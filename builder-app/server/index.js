import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { initDatabase } from './db/connection.js';
import authRoutes from './auth/routes.js';
import projectRoutes from './projects/routes.js';
import aiRoutes from './ai/routes.js';
import deployRoutes from './deploy/routes.js';
import assetRoutes from './assets/routes.js';

dotenv.config({ path: new URL('./.env', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1') });
// Fallback: also try loading from the server directory directly
if (!process.env.DATABASE_URL) {
  const __filename2 = fileURLToPath(import.meta.url);
  const __dirname2 = dirname(__filename2);
  dotenv.config({ path: join(__dirname2, '.env') });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5174',
  'http://localhost:5174',
  'http://localhost:3001',
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (healthchecks, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(null, true); // permissive in prod — tighten if needed
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

// Health check — must return 200 for Railway
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/deploy', deployRoutes);
app.use('/api/assets', assetRoutes);

// Serve uploaded files
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// ── build-api.js route (re-mounted here so we don't modify build-api.js) ──
// Replicates the POST /api/generate-build endpoint from build-api.js
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function getDirectoryTree(dir, prefix = '') {
  const items = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      items.push(`${prefix}📁 ${entry.name}/`);
      items.push(...getDirectoryTree(fullPath, prefix + '  '));
    } else {
      const stats = fs.statSync(fullPath);
      const size = (stats.size / 1024).toFixed(2);
      items.push(`${prefix}📄 ${entry.name} (${size} KB)`);
    }
  }
  return items;
}

app.post('/api/generate-build', async (req, res) => {
  try {
    const { config } = req.body;

    if (!config || !config.metadata) {
      return res.status(400).json({ error: 'Invalid configuration' });
    }

    const projectName = config.metadata.projectName || 'project';
    const clientName = config.metadata.clientName || 'client';
    const timestamp = new Date().toISOString().split('T')[0];

    const rootDir = join(__dirname, '..');
    const clientTemplatePath = join(rootDir, '..', 'client-template');
    const configOutputPath = join(clientTemplatePath, 'src', 'config', 'page-config.json');
    const distPath = join(clientTemplatePath, 'dist');
    const finalOutputDir = join(rootDir, 'builds', `${clientName}-${timestamp}`);

    console.log('Starting build process...');
    console.log(`Project: ${projectName}`);
    console.log(`Client: ${clientName}`);

    // Step 1: Write config to client-template
    fs.writeFileSync(configOutputPath, JSON.stringify(config, null, 2));

    // Step 2: Build client-template
    const originalDir = process.cwd();
    process.chdir(clientTemplatePath);
    execSync('npm run build', { stdio: 'inherit' });
    process.chdir(originalDir);

    // Step 3: Create output directory
    if (!fs.existsSync(join(rootDir, 'builds'))) {
      fs.mkdirSync(join(rootDir, 'builds'), { recursive: true });
    }
    if (fs.existsSync(finalOutputDir)) {
      fs.rmSync(finalOutputDir, { recursive: true, force: true });
    }
    fs.mkdirSync(finalOutputDir, { recursive: true });

    // Step 4: Copy dist to output
    copyDirectory(distPath, finalOutputDir);

    // Step 5: Create deployment info
    const deploymentInfo = {
      projectName,
      clientName,
      buildDate: new Date().toISOString(),
      files: getDirectoryTree(finalOutputDir),
    };
    fs.writeFileSync(
      join(finalOutputDir, 'build-info.json'),
      JSON.stringify(deploymentInfo, null, 2)
    );

    console.log('Build completed successfully!');

    res.json({
      success: true,
      message: 'Build generated successfully',
      outputPath: finalOutputDir,
      buildInfo: deploymentInfo,
    });
  } catch (error) {
    console.error('Build failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Build generation failed',
      details: error.stack,
    });
  }
});

// Serve static files in production
const distDir = join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  // SPA fallback — serve index.html for non-API routes
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads') && req.method === 'GET') {
      res.sendFile(join(distDir, 'index.html'));
    } else {
      next();
    }
  });
}

// Start server
async function start() {
  try {
    await initDatabase();
    console.log('Database initialized');
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    console.log('Server starting without database — some features may not work');
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();

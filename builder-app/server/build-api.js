import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Build generation endpoint
app.post('/api/generate-build', async (req, res) => {
  try {
    const { config } = req.body;

    if (!config || !config.metadata) {
      return res.status(400).json({ error: 'Invalid configuration' });
    }

    const projectName = config.metadata.projectName || 'project';
    const clientName = config.metadata.clientName || 'client';
    const timestamp = new Date().toISOString().split('T')[0];

    // Paths
    const rootDir = join(__dirname, '..');
    const clientTemplatePath = join(rootDir, '..', 'client-template');
    const configOutputPath = join(clientTemplatePath, 'src', 'config', 'page-config.json');
    const distPath = join(clientTemplatePath, 'dist');
    const finalOutputDir = join(rootDir, 'builds', `${clientName}-${timestamp}`);

    console.log('🚀 Starting build process...');
    console.log(`Project: ${projectName}`);
    console.log(`Client: ${clientName}`);

    // Step 1: Write config to client-template
    console.log('📝 Writing configuration...');
    fs.writeFileSync(configOutputPath, JSON.stringify(config, null, 2));

    // Step 2: Build client-template
    console.log('🔨 Building client template...');
    process.chdir(clientTemplatePath);
    execSync('npm run build', { stdio: 'inherit' });

    // Step 3: Create output directory
    console.log('📁 Creating output directory...');
    if (!fs.existsSync(join(rootDir, 'builds'))) {
      fs.mkdirSync(join(rootDir, 'builds'), { recursive: true });
    }
    if (fs.existsSync(finalOutputDir)) {
      fs.rmSync(finalOutputDir, { recursive: true, force: true });
    }
    fs.mkdirSync(finalOutputDir, { recursive: true });

    // Step 4: Copy dist to output
    console.log('📦 Copying build files...');
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

    console.log('✅ Build completed successfully!');

    res.json({
      success: true,
      message: 'Build generated successfully',
      outputPath: finalOutputDir,
      buildInfo: deploymentInfo,
    });

  } catch (error) {
    console.error('❌ Build failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Build generation failed',
      details: error.stack,
    });
  }
});

// Helper: Copy directory recursively
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

// Helper: Get directory tree
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

app.listen(PORT, () => {
  console.log(`🚀 Build API server running on http://localhost:${PORT}`);
});

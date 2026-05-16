#!/usr/bin/env node

/**
 * Static Build Generator Script
 *
 * This script takes a JSON configuration file and generates a static build
 * of the client-template with the configuration injected.
 *
 * Usage:
 *   node generate-build.js <config-file.json> [output-directory]
 *
 * Example:
 *   node generate-build.js ../public/sample-configs/client-abc.json ./dist/client-abc
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('❌ Error: Config file path is required');
  console.log('\nUsage: node generate-build.js <config-file.json> [output-directory]');
  console.log('Example: node generate-build.js client-abc.json ./dist/client-abc');
  process.exit(1);
}

const configPath = path.resolve(args[0]);
const outputDir = args[1] ? path.resolve(args[1]) : path.resolve(__dirname, '../../dist');

console.log('🚀 Landing Page Build Generator\n');
console.log('━'.repeat(50));

// Validate config file exists
if (!fs.existsSync(configPath)) {
  console.error(`❌ Error: Config file not found: ${configPath}`);
  process.exit(1);
}

// Read and validate config
let config;
try {
  const configContent = fs.readFileSync(configPath, 'utf8');
  config = JSON.parse(configContent);
  console.log('✅ Configuration file loaded successfully');
} catch (error) {
  console.error('❌ Error: Invalid JSON in config file');
  console.error(error.message);
  process.exit(1);
}

// Validate config structure
if (!config.metadata || !config.sections) {
  console.error('❌ Error: Invalid config structure. Missing required fields.');
  process.exit(1);
}

console.log(`📋 Client: ${config.metadata.clientName}`);
console.log(`📦 Project: ${config.metadata.projectName}`);
console.log(`📄 Sections: ${config.sections.length}`);
console.log('━'.repeat(50) + '\n');

// Paths
const clientTemplatePath = path.resolve(__dirname, '../../client-template');
const clientConfigPath = path.join(clientTemplatePath, 'src/config/page-config.json');

// Step 1: Inject configuration into client-template
console.log('📝 Step 1: Injecting configuration...');
try {
  fs.writeFileSync(clientConfigPath, JSON.stringify(config, null, 2));
  console.log('✅ Configuration injected successfully\n');
} catch (error) {
  console.error('❌ Error: Failed to inject configuration');
  console.error(error.message);
  process.exit(1);
}

// Step 2: Build client-template
console.log('🔨 Step 2: Building static site...');
console.log('This may take a minute...\n');

try {
  // Change to client-template directory and build
  process.chdir(clientTemplatePath);
  execSync('npm run build', { stdio: 'inherit' });
  console.log('\n✅ Build completed successfully\n');
} catch (error) {
  console.error('❌ Error: Build failed');
  console.error(error.message);
  process.exit(1);
}

// Step 3: Copy dist folder to output directory
console.log('📦 Step 3: Copying build files...');

const distPath = path.join(clientTemplatePath, 'dist');
const finalOutputDir = path.join(outputDir, config.metadata.clientName.toLowerCase().replace(/[^a-z0-9]/g, '-'));

try {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(finalOutputDir)) {
    fs.mkdirSync(finalOutputDir, { recursive: true });
  }

  // Copy dist folder contents
  copyDirectory(distPath, finalOutputDir);
  console.log(`✅ Files copied to: ${finalOutputDir}\n`);
} catch (error) {
  console.error('❌ Error: Failed to copy build files');
  console.error(error.message);
  process.exit(1);
}

// Step 4: Generate deployment instructions
console.log('📋 Step 4: Generating deployment instructions...');

const deploymentInstructions = `
DEPLOYMENT INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Client: ${config.metadata.clientName}
Project: ${config.metadata.projectName}
Build Date: ${new Date().toISOString()}

Build Location:
${finalOutputDir}

cPanel Deployment Steps:
──────────────────────────────────────────────────────

1. Login to cPanel
   URL: https://your-cpanel-url.com:2083

2. Navigate to File Manager
   Go to: public_html/your-domain.com/

3. Upload Files
   - Select all files from the build folder
   - Upload to the domain directory
   - Or use FTP client (FileZilla, etc.)

4. Verify Deployment
   Visit: https://your-domain.com
   Check: All sections load correctly
   Test: WhatsApp button works

FTP Deployment (Alternative):
──────────────────────────────────────────────────────

Host: ftp.your-domain.com
Username: your-ftp-username
Password: ****
Port: 21

Upload all files from:
${finalOutputDir}

To remote directory:
/public_html/your-domain.com/

Build Contents:
──────────────────────────────────────────────────────
`;

const deploymentFile = path.join(finalOutputDir, 'DEPLOYMENT.txt');
fs.writeFileSync(deploymentFile, deploymentInstructions);

// List files in build
const files = listFiles(finalOutputDir);
const fileList = files.map(f => `- ${path.relative(finalOutputDir, f)}`).join('\n');

fs.appendFileSync(deploymentFile, fileList);

console.log('✅ Deployment instructions generated\n');

// Final success message
console.log('━'.repeat(50));
console.log('🎉 Build Generation Complete!');
console.log('━'.repeat(50));
console.log(`\n📁 Build Location: ${finalOutputDir}`);
console.log(`📋 Instructions: ${deploymentFile}`);
console.log(`\n💡 Next Steps:`);
console.log(`   1. Review the build files`);
console.log(`   2. Follow deployment instructions`);
console.log(`   3. Upload to cPanel`);
console.log(`   4. Test the live site\n`);

// Helper functions
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function listFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      listFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });

  return fileList;
}

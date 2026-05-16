# Landing Page Builder - Deployment Guide

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Complete Workflow](#complete-workflow)
3. [Builder App Usage](#builder-app-usage)
4. [Generating Static Builds](#generating-static-builds)
5. [cPanel Deployment](#cpanel-deployment)
6. [Production Checklist](#production-checklist)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 System Overview

This system consists of two applications:

### 1. **Builder App** (Internal Tool)
- **Location**: `builder-app/`
- **Port**: http://localhost:5174
- **Purpose**: Internal drag-and-drop page builder for creating client landing pages
- **Users**: Your team only

### 2. **Client Template** (Production Sites)
- **Location**: `client-template/`
- **Port**: http://localhost:5173 (dev)
- **Purpose**: Generic template that renders final client websites
- **Users**: End clients and their customers

---

## 🔄 Complete Workflow

### Step 1: Create a Landing Page

1. **Start the Builder App**
   ```bash
   cd builder-app
   npm run dev
   ```
   Open: http://localhost:5174

2. **Build Your Page**
   - Drag components from left sidebar to canvas
   - Click on sections to edit properties in right panel
   - Reorder sections by dragging
   - Delete unwanted sections
   - Use undo/redo (Ctrl+Z / Ctrl+Y)
   - Toggle device preview (desktop/tablet/mobile)

3. **Configure Settings**
   - Set client name and project name
   - Configure theme colors
   - Add WhatsApp number
   - Set SEO metadata

4. **Save Configuration**
   - Click **"Save Config"** button
   - Download JSON file (e.g., `delicious-bites-2025-01-11.json`)
   - Store in `builder-app/public/sample-configs/`

### Step 2: Generate Static Build

1. **Run Build Generator Script**
   ```bash
   cd builder-app
   node scripts/generate-build.js public/sample-configs/your-client.json
   ```

2. **What Happens**:
   - ✅ Validates configuration JSON
   - ✅ Injects config into client-template
   - ✅ Runs production build (`npm run build`)
   - ✅ Creates optimized static files
   - ✅ Generates deployment instructions
   - ✅ Output: `dist/your-client-name/`

3. **Build Output Structure**:
   ```
   dist/your-client-name/
   ├── index.html           # Main HTML file
   ├── assets/
   │   ├── js/
   │   │   ├── index-[hash].js
   │   │   ├── vendor-[hash].js
   │   │   └── animations-[hash].js
   │   ├── css/
   │   │   └── index-[hash].css
   │   └── images/
   ├── DEPLOYMENT.txt       # Deployment instructions
   └── favicon.ico
   ```

### Step 3: Deploy to cPanel

#### Method 1: File Manager (Easiest)

1. **Login to cPanel**
   - URL: `https://your-cpanel-url.com:2083`
   - Enter credentials

2. **Navigate to File Manager**
   - Click **"File Manager"** icon
   - Go to `public_html/`

3. **Create Client Directory**
   - Create folder: `clientdomain.com/`
   - Or use existing addon domain folder

4. **Upload Files**
   - Click **"Upload"** button
   - Select all files from `dist/your-client-name/`
   - Wait for upload to complete
   - Extract if uploaded as ZIP

5. **Set Permissions**
   - Select all files
   - Click **"Permissions"**
   - Set to `644` for files, `755` for directories

#### Method 2: FTP/SFTP (Recommended for Large Sites)

1. **Connect via FTP Client** (FileZilla, WinSCP, etc.)
   ```
   Host: ftp.your-domain.com
   Port: 21 (FTP) or 22 (SFTP)
   Username: your-ftp-username
   Password: ****
   ```

2. **Navigate to Directory**
   - Remote path: `/public_html/clientdomain.com/`

3. **Upload Files**
   - Drag all files from local `dist/your-client-name/`
   - Upload to remote directory
   - Overwrite if updating existing site

4. **Verify Upload**
   - Check all files transferred successfully
   - Verify file sizes match

#### Method 3: SSH (Advanced)

```bash
# Compress build locally
cd dist/your-client-name
tar -czf site.tar.gz *

# Upload via SCP
scp site.tar.gz user@your-server.com:/home/user/public_html/clientdomain.com/

# SSH into server
ssh user@your-server.com

# Extract files
cd /home/user/public_html/clientdomain.com/
tar -xzf site.tar.gz
rm site.tar.gz

# Set permissions
chmod 644 *
chmod 755 .
```

### Step 4: Domain Configuration

#### Setting Up Addon Domain in cPanel

1. **Add Addon Domain**
   - cPanel → **Domains** → **Addon Domains**
   - Enter: `clientdomain.com`
   - Document Root: `public_html/clientdomain.com`
   - Click **"Add Domain"**

2. **Configure DNS** (if domain is elsewhere)
   ```
   A Record:
   Host: @
   Points to: YOUR_SERVER_IP
   TTL: 3600

   CNAME Record:
   Host: www
   Points to: clientdomain.com
   TTL: 3600
   ```

3. **Wait for Propagation** (15 minutes - 48 hours)

4. **Verify Domain**
   - Visit: `https://clientdomain.com`
   - Check: Site loads correctly

### Step 5: SSL Certificate (HTTPS)

1. **Install Let's Encrypt SSL** (Free)
   - cPanel → **Security** → **SSL/TLS Status**
   - Find `clientdomain.com`
   - Click **"Run AutoSSL"**
   - Wait for installation

2. **Force HTTPS** (Optional but Recommended)
   - Create `.htaccess` in domain root:
   ```apache
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

### Step 6: Final Verification

✅ **Checklist**:
- [ ] Site loads at `https://clientdomain.com`
- [ ] All sections display correctly
- [ ] Images load properly
- [ ] WhatsApp button works
- [ ] Mobile responsive
- [ ] Forms/CTAs functional
- [ ] SSL certificate active
- [ ] Page load speed < 2 seconds

---

## 🛠️ Builder App Usage

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Z` | Undo |
| `Ctrl + Y` or `Ctrl + Shift + Z` | Redo |
| `Delete` or `Backspace` | Delete selected section |
| `Escape` | Deselect section |
| `Ctrl + S` | Save config (triggers download) |

### Component Library

**Hero Sections** (1 component)
- Hero Section - Full-screen hero with background image

**Content Sections** (5 components)
- About Section - Image + text layout
- Services Section - Service cards grid
- Menu Section - Menu items with categories
- Gallery Section - Image gallery
- Offers Section - Special offers/promotions

**Interactive Sections** (2 components)
- Testimonials Section - Customer reviews
- Call to Action - Bold CTA section

**Footer & Utility** (2 components)
- Footer Section - Business info + social links
- WhatsApp Button - Floating contact button

### Property Editors

Each component has customizable properties:

**Common Properties**:
- Heading, subheading, description
- Background color/image
- Text color
- Images with URL input

**Advanced Properties**:
- Array fields (services, menu items, testimonials)
- Color pickers with presets
- Image position (left/right)
- Layout options (grid/carousel)
- Column count (2/3/4)

### Saving & Loading

**Save Configuration**:
- Click **"Save Config"**
- JSON file downloads automatically
- Filename: `client-name-YYYY-MM-DD.json`

**Load Configuration**:
- Click **"Load Config"**
- Select saved JSON file
- Page rebuilds with saved sections

**Export for Sharing**:
- Saved JSON can be shared with team
- Version control with Git recommended
- Store in `builder-app/public/sample-configs/`

---

## 🚀 Generating Static Builds

### Using the Build Script

**Basic Usage**:
```bash
cd builder-app
node scripts/generate-build.js <config-file> [output-directory]
```

**Examples**:
```bash
# Build with default output
node scripts/generate-build.js public/sample-configs/restaurant.json

# Build with custom output directory
node scripts/generate-build.js ../configs/client-abc.json ./builds/client-abc

# Build from absolute path
node scripts/generate-build.js "C:\Users\Projects\configs\client.json"
```

### Build Process Steps

1. **Validation** - Checks JSON structure
2. **Injection** - Copies config to client-template
3. **Build** - Runs `npm run build` (Vite)
4. **Optimization** - Minifies and compresses
5. **Copy** - Moves to output directory
6. **Documentation** - Generates DEPLOYMENT.txt

### Build Optimizations

The build includes:
- ✅ Minified JavaScript (Terser)
- ✅ Optimized CSS (PostCSS)
- ✅ Code splitting (vendor/animations chunks)
- ✅ Asset optimization
- ✅ Tree shaking (removes unused code)
- ✅ Compression ready (Gzip/Brotli)

**Expected Build Size**:
- HTML: ~15 KB
- CSS: ~50-100 KB
- JavaScript: ~150-200 KB (gzipped)
- **Total**: ~200-300 KB (excluding images)

### Performance Targets

- ⚡ **First Contentful Paint**: < 1.5s
- ⚡ **Time to Interactive**: < 3s
- ⚡ **Lighthouse Score**: > 90

---

## 📦 cPanel Deployment

### Pre-Deployment Checklist

- [ ] Build generated successfully
- [ ] All files present in dist folder
- [ ] DEPLOYMENT.txt reviewed
- [ ] Domain configured in cPanel
- [ ] DNS records pointing to server
- [ ] FTP/File Manager access confirmed

### File Structure on Server

```
/home/username/
└── public_html/
    └── clientdomain.com/
        ├── index.html
        ├── assets/
        │   ├── js/
        │   ├── css/
        │   └── images/
        ├── favicon.ico
        └── .htaccess (optional)
```

### .htaccess Configuration (Recommended)

Create `.htaccess` in domain root:

```apache
# Enable Gzip Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle SPA routing (if needed)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
```

### Common Deployment Issues

**Problem**: Site shows cPanel default page
- **Solution**: Check files are in correct directory, clear browser cache

**Problem**: Images not loading
- **Solution**: Verify image URLs in config, check file permissions (644)

**Problem**: WhatsApp button not working
- **Solution**: Check phone number format in config (+countrycode)

**Problem**: SSL not working
- **Solution**: Wait for AutoSSL, or manually install certificate

**Problem**: Site slow to load
- **Solution**: Enable Gzip in .htaccess, optimize images before upload

---

## ✅ Production Checklist

### Before Deployment

- [ ] All sections reviewed in builder
- [ ] Content proofread (no typos)
- [ ] Images optimized (< 500 KB each)
- [ ] WhatsApp number tested
- [ ] Links verified (all work)
- [ ] SEO metadata filled
- [ ] Mobile preview checked
- [ ] Config JSON saved safely

### During Deployment

- [ ] Build generated without errors
- [ ] All files uploaded to cPanel
- [ ] File permissions set correctly
- [ ] Domain configured properly
- [ ] DNS propagated (if new domain)
- [ ] SSL certificate installed

### After Deployment

- [ ] Visit site in browser
- [ ] Test on mobile device
- [ ] Click all links/buttons
- [ ] Test WhatsApp button
- [ ] Check page load speed
- [ ] Run Lighthouse audit
- [ ] Test on different browsers
- [ ] Share with client for approval

---

## 🔧 Troubleshooting

### Build Errors

**"Invalid JSON"**
- Check config file syntax
- Validate at jsonlint.com
- Ensure all quotes are correct

**"Build failed"**
- Check Node.js version (16+)
- Run `npm install` in client-template
- Check for TypeScript errors

### Deployment Issues

**"Permission denied"**
- Set file permissions: 644 (files), 755 (directories)
- Check cPanel user ownership

**"Site not accessible"**
- Verify DNS records
- Check domain spelling
- Wait for DNS propagation (up to 48 hours)

**"Blank page"**
- Check browser console for errors
- Verify index.html exists
- Check file paths in index.html

### Performance Issues

**"Slow loading"**
- Enable Gzip compression
- Optimize images (use WebP format)
- Enable browser caching
- Use CDN for assets (optional)

**"High bounce rate"**
- Improve page load speed
- Optimize mobile experience
- Check content relevance

---

## 📞 Support

### Need Help?

1. Check this documentation first
2. Review DEPLOYMENT.txt in build folder
3. Check cPanel error logs
4. Test in incognito mode (clears cache)
5. Contact hosting provider for server issues

### Useful Tools

- **JSON Validator**: https://jsonlint.com
- **Page Speed Test**: https://pagespeed.web.dev
- **SSL Test**: https://www.ssllabs.com/ssltest
- **DNS Propagation**: https://dnschecker.org
- **Mobile Test**: https://search.google.com/test/mobile-friendly

---

## 🎉 Success!

Your client landing page is now live and ready to receive visitors!

**Next Steps**:
1. Share URL with client
2. Monitor analytics
3. Gather feedback
4. Update as needed (rebuild & redeploy)

**Remember**: Every update requires rebuilding and re-uploading the static files to cPanel.

---

*Generated by Landing Page Builder System v1.0*

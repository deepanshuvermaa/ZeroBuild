# Quick Start Guide - Pre-Built Templates

## 🚀 Get Started in 5 Minutes

This guide will help you quickly integrate and use the pre-built templates with your landing page builder.

---

## Step 1: Choose Your Template

Browse the available templates:
- **restaurant-template.json** - For food & beverage businesses
- **painting-template.json** - For home service contractors
- **furniture-template.json** - For furniture & decor stores

Open `template-preview.html` in your browser to see visual previews.

---

## Step 2: Import Template into Builder

### Option A: Using the Builder App

```bash
# Navigate to builder app
cd builder-app

# Start the development server
npm run dev
```

1. Open the builder interface
2. Click "Import Template" button
3. Select your desired JSON file
4. Template sections will populate automatically

### Option B: Direct Integration

```bash
# Copy template to config folder
cp prebuilt-templates/restaurant-template.json client-template/src/config/template.json
```

---

## Step 3: Customize Content

### Quick Edits

Open the JSON file and modify:

```json
{
  "sections": [
    {
      "id": "hero-1",
      "props": {
        "title": {
          "text": "YOUR BUSINESS NAME"  // ← Change this
        },
        "description": "Your description here",  // ← And this
        "button": {
          "text": "Call to Action",  // ← And this
          "link": "#contact"
        }
      }
    }
  ]
}
```

### WhatsApp Setup

Find the `globalSettings` section:

```json
{
  "globalSettings": {
    "whatsapp": {
      "enabled": true,
      "number": "1234567890",  // ← Your WhatsApp number (country code + number)
      "message": "Hello! I'd like to inquire...",  // ← Pre-filled message
      "position": "bottom-right"
    }
  }
}
```

### Color Scheme

```json
{
  "globalSettings": {
    "colorScheme": {
      "primary": "#DC2626",    // ← Main brand color
      "secondary": "#1F2937",  // ← Secondary color
      "accent": "#F59E0B",     // ← Accent/highlight color
      "background": "#FFFFFF",
      "text": "#1F2937"
    }
  }
}
```

---

## Step 4: Add Your Images

### Method 1: Use Image URLs

```json
{
  "image": {
    "url": "https://your-website.com/images/hero.jpg",
    "alt": "Hero image"
  }
}
```

### Method 2: Use Local Images

1. Place images in `public/images/` folder
2. Reference them in the JSON:

```json
{
  "image": {
    "url": "/images/hero.jpg",
    "alt": "Hero image"
  }
}
```

### Recommended Image Sources:
- **Unsplash** - https://unsplash.com (free, high-quality)
- **Pexels** - https://pexels.com (free)
- **Pixabay** - https://pixabay.com (free)

---

## Step 5: Test & Preview

### In Builder App:
1. Click "Preview" in the builder
2. Test on different screen sizes
3. Check all links and buttons
4. Verify animations work smoothly

### Standalone Test:

```bash
cd client-template
npm run dev
```

Open http://localhost:5173 in your browser.

### Test Checklist:
- [ ] All text is readable
- [ ] Images load correctly
- [ ] WhatsApp button works
- [ ] Animations are smooth
- [ ] Responsive on mobile
- [ ] All links work

---

## Step 6: Build & Deploy

### Build Static Files

```bash
cd client-template
npm run build
```

This creates a `dist/` folder with your static website.

### Deploy to cPanel

1. Log into your cPanel
2. Navigate to File Manager
3. Go to `public_html/` (or your domain folder)
4. Upload all files from the `dist/` folder
5. Your site is now live! 🎉

### Alternative: FTP Upload

```bash
# Using FileZilla or similar FTP client
# Upload dist/* to your web server
```

---

## Common Customizations

### Change Section Order

Reorder items in the `sections` array:

```json
{
  "sections": [
    { "id": "hero-1", ... },      // First
    { "id": "about-1", ... },     // Second
    { "id": "services-1", ... },  // Third
    { "id": "cta-1", ... }        // Last
  ]
}
```

### Remove a Section

Simply delete the section object from the array:

```json
{
  "sections": [
    { "id": "hero-1", ... },
    // { "id": "about-1", ... },  ← Commented out / removed
    { "id": "services-1", ... }
  ]
}
```

### Add Menu Items (Restaurant Template)

```json
{
  "items": [
    {
      "id": "dish-1",
      "name": "Chicken Teriyaki",
      "image": "https://...",
      "price": "$15.99",
      "description": "Grilled chicken with teriyaki sauce"
    },
    {
      "id": "dish-2",
      "name": "Beef Ramen",
      "image": "https://...",
      "price": "$13.99",
      "description": "Rich broth with tender beef"
    }
  ]
}
```

### Change Fonts

```json
{
  "globalSettings": {
    "fonts": {
      "heading": "'Montserrat', sans-serif",
      "body": "'Open Sans', sans-serif"
    }
  }
}
```

Don't forget to add the font import in your HTML:

```html
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans&display=swap" rel="stylesheet">
```

---

## Troubleshooting

### Animations Not Working

**Problem:** Animations don't play
**Solution:** Make sure Framer Motion is installed

```bash
npm install framer-motion
```

### Images Not Loading

**Problem:** Images show as broken
**Solution:**
1. Check the image URL is correct
2. Verify the image is publicly accessible
3. Check file paths are relative to `public/` folder

### WhatsApp Button Not Working

**Problem:** Button doesn't open WhatsApp
**Solution:** Verify number format:

```json
"number": "1234567890"  // ✗ Wrong
"number": "11234567890"  // ✓ Correct (with country code)
```

### Mobile Layout Issues

**Problem:** Layout breaks on mobile
**Solution:** Check that responsive classes are applied:

```json
{
  "props": {
    "layout": "responsive-grid"  // Ensure responsive layout
  }
}
```

---

## Advanced Features

### Enable Parallax Scrolling

```json
{
  "animation": {
    "type": "parallax",
    "scrollSpeed": 0.5  // 0.1 = slow, 1.0 = normal
  }
}
```

### Custom Animation Duration

```json
{
  "animation": {
    "type": "fadeInUp",
    "duration": 1.2,  // seconds
    "delay": 0.3      // wait before starting
  }
}
```

### Stagger Child Elements

```json
{
  "animation": {
    "type": "stagger",
    "childDelay": 0.15  // delay between each item
  }
}
```

---

## Performance Optimization

### Optimize Images

Before uploading, compress images:
- Use tools like TinyPNG or ImageOptim
- Target: < 200KB per image
- Use WebP format when possible

### Reduce Animation Complexity

For better mobile performance:

```json
{
  "globalSettings": {
    "animations": {
      "defaultDuration": 0.4,  // Faster = better performance
      "reducedMotion": true    // Respect user preferences
    }
  }
}
```

### Lazy Load Images

```json
{
  "image": {
    "url": "...",
    "loading": "lazy"  // Loads only when in viewport
  }
}
```

---

## Next Steps

1. **Read the full docs**: Check `README.md` for complete feature list
2. **Explore animations**: See `animations-library.md` for all animation types
3. **Customize styles**: Modify colors, fonts, and layouts
4. **Add your content**: Replace placeholder text and images
5. **Test thoroughly**: Check on multiple devices
6. **Deploy**: Upload to your hosting provider

---

## Need Help?

- Check `README.md` for detailed documentation
- Review `animations-library.md` for animation examples
- Look at template JSON structure for reference
- Test in the builder app for visual feedback

---

## Quick Reference Commands

```bash
# Start builder
cd builder-app && npm run dev

# Start template preview
cd client-template && npm run dev

# Build for production
cd client-template && npm run build

# View template preview
open prebuilt-templates/template-preview.html
```

---

Happy building! 🎉

# 🚀 Landing Page Builder & Deployment System

> **A complete React-based solution for creating and deploying modern, animated landing pages for small business clients.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38BDF8?logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0055)](https://www.framer.com/motion)

---

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [Component Library](#-component-library)
- [Deployment](#-deployment)
- [Development](#-development)
- [Tech Stack](#-tech-stack)

---

## ✨ Features

### 🎨 **Builder App** (Internal Tool)
- ✅ **Drag & Drop Interface** - Intuitive component placement
- ✅ **Live Preview** - Real-time rendering as you build
- ✅ **Property Editor** - Dynamic forms for each component type
- ✅ **Undo/Redo** - 50-state history with keyboard shortcuts
- ✅ **Device Preview** - Desktop, tablet, and mobile modes
- ✅ **Save/Load Configs** - JSON-based page configurations
- ✅ **Component Library** - 10 pre-built, customizable sections
- ✅ **Theme Customization** - Colors, fonts, and styling
- ✅ **SEO Configuration** - Meta tags and descriptions

### 🌐 **Client Template** (Production Sites)
- ✅ **Static Export** - No backend required
- ✅ **Optimized Performance** - Lighthouse score > 90
- ✅ **Smooth Animations** - GPU-accelerated with Framer Motion
- ✅ **Fully Responsive** - Mobile-first design
- ✅ **WhatsApp Integration** - Floating contact button
- ✅ **Modern UI** - Professional Tailwind CSS styling
- ✅ **Fast Loading** - < 2s on 4G networks
- ✅ **cPanel Ready** - Easy deployment to shared hosting

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org))
- **npm** 9+ (comes with Node.js)
- **Git** (optional, for version control)

### Installation

```bash
# Clone or download the project
cd "c:\Users\Asus\Desktop\drag and drop"

# Install Builder App dependencies
cd builder-app
npm install

# Install Client Template dependencies
cd ../client-template
npm install
```

### Run Development Servers

**Terminal 1 - Builder App:**
```bash
cd builder-app
npm run dev
```
🌐 Opens at: **http://localhost:5174**

**Terminal 2 - Client Template:**
```bash
cd client-template
npm run dev
```
🌐 Opens at: **http://localhost:5173**

### Build Your First Page

1. Open Builder App at http://localhost:5174
2. Drag components from left sidebar to canvas
3. Click sections to edit properties
4. Save configuration as JSON
5. Generate static build
6. Deploy to cPanel

**Full workflow**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     BUILDER APP                         │
│  (Internal Tool - Your Team Only)                      │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Component   │  │    Canvas    │  │  Properties  │ │
│  │   Library    │  │   Preview    │  │    Panel     │ │
│  │  (Sidebar)   │  │  (Drag/Drop) │  │   (Editor)   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  Toolbar: Save | Load | Export | Generate Build        │
└─────────────────────────────────────────────────────────┘
                           ↓
                    [Save Config JSON]
                           ↓
┌─────────────────────────────────────────────────────────┐
│              STATIC BUILD GENERATOR                     │
│  (Node.js Script)                                       │
│                                                         │
│  1. Load JSON config                                    │
│  2. Inject into client-template                         │
│  3. Run production build (Vite)                         │
│  4. Optimize assets                                     │
│  5. Output /dist folder                                 │
└─────────────────────────────────────────────────────────┘
                           ↓
                     [Static Files]
                           ↓
┌─────────────────────────────────────────────────────────┐
│                  cPANEL HOSTING                         │
│  (Shared Hosting Environment)                          │
│                                                         │
│  public_html/                                           │
│  └── clientdomain.com/                                  │
│      ├── index.html                                     │
│      ├── assets/                                        │
│      │   ├── js/                                        │
│      │   ├── css/                                       │
│      │   └── images/                                    │
│      └── .htaccess                                      │
└─────────────────────────────────────────────────────────┘
                           ↓
                  [Live Client Website]
                           ↓
┌─────────────────────────────────────────────────────────┐
│              END USER (Client's Customers)              │
│                                                         │
│  → View beautiful, animated landing page                │
│  → Contact via WhatsApp button                          │
│  → Fast, responsive, modern experience                  │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
drag-and-drop/
├── builder-app/                    # Internal page builder
│   ├── src/
│   │   ├── components/
│   │   │   ├── Builder/
│   │   │   │   ├── Sidebar/       # Component library
│   │   │   │   ├── Canvas/        # Drag & drop area
│   │   │   │   ├── PropertiesPanel/ # Property editor
│   │   │   │   └── Toolbar/       # Top controls
│   │   │   ├── PreviewComponents/ # Live preview components
│   │   │   └── shared/            # Reusable UI components
│   │   ├── store/                 # Zustand state management
│   │   │   ├── builderStore.ts
│   │   │   └── historyStore.ts
│   │   ├── types/                 # TypeScript definitions
│   │   ├── utils/                 # Helper functions
│   │   ├── schemas/               # Zod validation schemas
│   │   └── lib/                   # Utility library
│   ├── scripts/
│   │   └── generate-build.js      # Static build generator
│   ├── public/
│   │   └── sample-configs/        # Example configurations
│   └── package.json
│
├── client-template/                # Production template
│   ├── src/
│   │   ├── components/            # Client-facing components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── ServicesSection.tsx
│   │   │   ├── MenuSection.tsx
│   │   │   ├── GallerySection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── OffersSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   ├── FooterSection.tsx
│   │   │   └── FloatingWhatsApp.tsx
│   │   ├── renderer/
│   │   │   └── PageRenderer.tsx   # Renders page from config
│   │   ├── animations/
│   │   │   └── motionVariants.ts  # Framer Motion presets
│   │   ├── config/
│   │   │   └── page-config.json   # Injected configuration
│   │   └── types/                 # TypeScript definitions
│   └── package.json
│
├── DEPLOYMENT_GUIDE.md             # Complete deployment guide
├── README.md                       # This file
└── prd.xml                         # Product requirements document
```

---

## 📖 Usage Guide

### 1. Building a Landing Page

#### Open Builder App
```bash
cd builder-app
npm run dev
```
Navigate to http://localhost:5174

#### Add Components
1. **Drag** components from left sidebar
2. **Drop** onto canvas center area
3. **Reorder** by dragging section handles (⋮⋮)
4. **Delete** unwanted sections (Delete key or trash icon)

#### Edit Properties
1. **Click** on any section to select it
2. **Right panel** shows editable properties
3. **Update** text, colors, images, arrays
4. **Changes** reflect immediately in canvas

#### Configure Global Settings
- **Metadata**: Client name, project name
- **Theme**: Primary, secondary, accent colors
- **WhatsApp**: Phone number, default message
- **SEO**: Title, description, keywords

#### Keyboard Shortcuts
- `Ctrl+Z`: Undo
- `Ctrl+Y`: Redo
- `Delete`: Remove selected section
- `Escape`: Deselect section
- `Ctrl+S`: Save configuration

#### Save Your Work
1. Click **"Save Config"** in toolbar
2. JSON file downloads automatically
3. Store in `builder-app/public/sample-configs/`
4. Filename format: `client-name-YYYY-MM-DD.json`

### 2. Generating Static Build

```bash
cd builder-app
node scripts/generate-build.js public/sample-configs/your-config.json
```

**Output**: `dist/client-name/` folder with:
- `index.html` - Main page
- `assets/` - Optimized JS, CSS, images
- `DEPLOYMENT.txt` - Deployment instructions

### 3. Deploying to cPanel

See detailed instructions in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

**Quick Steps**:
1. Login to cPanel
2. File Manager → `public_html/clientdomain.com/`
3. Upload all files from `dist/client-name/`
4. Set permissions (644 for files, 755 for folders)
5. Configure domain and SSL
6. Visit site to verify

---

## 🎨 Component Library

### Hero Section
- Full viewport height
- Background image with overlay
- Heading + subheading
- CTA button
- Fade-in animations

### About Section
- Image + text two-column layout
- Configurable image position (left/right)
- Feature list with checkmarks
- Slide-in animations

### Services Section
- Grid of service cards
- Icon + title + description
- Configurable columns (2/3/4)
- Stagger animations

### Menu Section
- Category filtering tabs
- Menu item cards with images
- Name, description, price display
- Smooth filter transitions

### Gallery Section
- Responsive image grid
- Hover overlay effects
- Configurable layout (grid/masonry)
- Lazy loading support

### Testimonials Section
- Customer review cards
- 5-star rating system
- Customer photos and positions
- Layout options (grid/carousel)

### Offers Section
- Special offer cards
- Discount badges
- Validity dates
- Bold CTAs

### Call to Action
- Full-width section
- Large heading + description
- Prominent CTA button
- Optional background image

### Footer Section
- Business information
- Contact details
- Social media links
- Copyright notice

### Floating WhatsApp Button
- Fixed position (bottom-right/left)
- Pulse animation
- Customizable message
- wa.me link integration

---

## 🚀 Deployment

### Prerequisites
- cPanel hosting account
- Domain name configured
- FTP access (optional)

### Build Process
```bash
# Generate static build
cd builder-app
node scripts/generate-build.js path/to/config.json

# Build output
dist/client-name/
├── index.html
├── assets/
└── DEPLOYMENT.txt
```

### Upload to cPanel
1. **File Manager** (easiest) or **FTP**
2. Upload to `public_html/domain.com/`
3. Set file permissions
4. Install SSL certificate
5. Test live site

### Performance Optimization
- ✅ Minified JS/CSS
- ✅ Code splitting
- ✅ Asset optimization
- ✅ Gzip compression
- ✅ Browser caching

**Expected Results**:
- Page Load: < 2 seconds
- Lighthouse Score: > 90
- Mobile Friendly: Yes

---

## 💻 Development

### Tech Stack

**Framework & Build**
- React 19 + TypeScript
- Vite 7.2 (build tool)
- Node.js 18+

**Styling**
- Tailwind CSS 4.0
- PostCSS + Autoprefixer

**Animations**
- Framer Motion 11
- GPU-accelerated transforms

**Drag & Drop**
- @dnd-kit (core, sortable, utilities)

**State Management**
- Zustand (builder state)
- Immer (immutable updates)

**UI Components**
- Radix UI (headless components)
- Lucide React (icons)
- react-colorful (color picker)

**Validation**
- Zod (schema validation)
- react-hook-form (forms)

### Commands

**Builder App:**
```bash
npm run dev          # Start dev server (port 5174)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

**Client Template:**
```bash
npm run dev          # Start dev server (port 5173)
npm run build        # Production build
npm run preview      # Preview production build
```

### Environment Variables

No environment variables required. All configuration is done through JSON files.

### Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📦 Build Specifications

### Client Template Build

**Bundle Size** (gzipped):
- HTML: ~15 KB
- CSS: ~50-100 KB
- JavaScript: ~150-200 KB
- **Total**: ~200-300 KB (excluding images)

**Optimization Features**:
- Tree shaking (removes unused code)
- Code splitting (vendor/animations chunks)
- Minification (Terser for JS, cssnano for CSS)
- Asset optimization
- Lazy loading
- Prefetching

**Performance Metrics**:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Cumulative Layout Shift: < 0.1
- Largest Contentful Paint: < 2.5s

---

## 🔒 Security & Best Practices

### Builder App (Internal Use)
- ✅ No sensitive data storage
- ✅ Client-side only (no backend)
- ✅ JSON validation before export
- ✅ Type-safe TypeScript throughout

### Client Template (Production)
- ✅ Static files only (no server vulnerabilities)
- ✅ No client-side data storage
- ✅ HTTPS enforced via .htaccess
- ✅ Content Security Policy ready
- ✅ No inline scripts (CSP compliant)

### WhatsApp Integration
- ✅ Uses official wa.me links
- ✅ No data collection
- ✅ Client-controlled phone number

---

## 📈 Future Enhancements

Potential additions:

- [ ] Image upload and hosting integration
- [ ] More component types (pricing tables, FAQ, etc.)
- [ ] Template library (pre-made page layouts)
- [ ] A/B testing capability
- [ ] Analytics integration
- [ ] Automated FTP deployment
- [ ] Multi-page support
- [ ] Form builder with backend integration
- [ ] CMS integration options

---

## 🤝 Contributing

This is an internal tool for your team. To extend functionality:

1. **Add new components**: Create in both `builder-app` and `client-template`
2. **Update schemas**: Add to `componentDefinitions.ts` and types
3. **Test thoroughly**: Check drag-drop, properties, export, build
4. **Document**: Update README and deployment guide

---

## 📄 License

Internal use only. All rights reserved.

---

## 🎉 Success Metrics

✅ **30-minute page creation** (from blank to complete)
✅ **< 2-second page loads** (on 4G mobile)
✅ **90+ Lighthouse score** (performance)
✅ **100% mobile responsive**
✅ **Zero runtime dependencies** (static files only)
✅ **Unlimited client sites** (no SaaS fees)

---

## 📞 Support

**Documentation**:
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [prd.xml](prd.xml) - Product requirements document

**Useful Resources**:
- [React Documentation](https://react.dev)
- [Framer Motion Docs](https://www.framer.com/motion)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide)

---

## 🚀 Get Started Now!

```bash
# 1. Install dependencies
cd builder-app && npm install
cd ../client-template && npm install

# 2. Start builder
cd builder-app && npm run dev

# 3. Build your first page!
# Open http://localhost:5174
```

**Happy Building! 🎨**

---

*Built with ❤️ using React, TypeScript, Tailwind CSS, and Framer Motion*

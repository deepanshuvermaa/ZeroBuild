# Pre-Built Landing Page Templates

## Overview

This directory contains professionally designed, animation-rich landing page templates ready to be used with your drag-and-drop builder. Each template is configured with modern animations, responsive layouts, and WhatsApp integration.

## Available Templates

### 1. Restaurant & Food Delivery Template
**File:** `restaurant-template.json`
**Industry:** Food & Beverage
**Best For:** Restaurants, cafes, food delivery services, catering

**Features:**
- Hero section with animated burger/food imagery
- Scroll-triggered menu carousel with hover effects
- Food gallery with masonry layout
- Pizza/specialty showcase with directional arrows
- Color-coded food categories
- Delivery-focused CTAs

**Animations Used:**
- ✨ Fade-in-up entrance effects
- 🎪 Carousel with smooth transitions
- 🔄 Parallax scrolling backgrounds
- 💫 Hover scale & lift effects
- 🎯 Kinetic typography
- 🌊 Floating decorative elements

**Color Scheme:** Red (#DC2626), Dark Gray (#1F2937), Amber accents

---

### 2. Painting & Interior Design Template
**File:** `painting-template.json`
**Industry:** Home Services
**Best For:** Painting contractors, interior designers, home improvement

**Features:**
- Split-screen hero with color emphasis
- "Our Crew" about section with testimonials
- Color palette showcase
- Before/after galleries
- Service cards with icon animations
- Trust-building elements

**Animations Used:**
- 🎨 Color transition effects
- 📜 Split text reveal
- 🌊 Parallax image scrolling
- 💳 Card flip animations
- 🎭 Hover lift & shadow effects
- 🌈 Gradient text animations

**Color Scheme:** Forest Green (#059669), Blue (#1E40AF), Beige (#FEF3E2)

---

### 3. Furniture & Home Decor Template
**File:** `furniture-template.json`
**Industry:** Home & Decor
**Best For:** Furniture stores, home decor shops, interior design boutiques

**Features:**
- Minimalist hero with elegant typography
- Numbered product grid (01, 02, 03)
- Asymmetric gallery layout
- Premium material emphasis
- Icon-based value propositions
- Sophisticated color palette

**Animations Used:**
- 🎲 3D tilt & rotate effects
- 📐 Perspective transforms
- 🔍 Image reveal on hover
- ✨ Letter spacing animations
- 🎪 Zoom on scroll
- 🎯 Cursor follow effects
- 🌊 Smooth scrollbar

**Color Scheme:** Brown (#3E2723), Tan (#8B7355), Cream (#F5F3EF)

---

## Animation Types Reference

### Entrance Animations
- **fadeIn** - Simple opacity fade
- **fadeInUp** - Fade in while moving up
- **fadeInDown** - Fade in while moving down
- **slideInLeft** - Slide from left
- **slideInRight** - Slide from right
- **scaleIn** - Scale from 0 to full size
- **fadeInScale** - Combined fade and scale

### Scroll Animations
- **scrollReveal** - Reveal elements on scroll
- **parallax** - Background moves slower than foreground
- **zoomOnScroll** - Zoom effect triggered by scrolling
- **stagger** - Sequential animation of multiple elements

### Hover Effects
- **scaleOnHover** - Enlarge on mouse over
- **lift-shadow** - Lift up with shadow
- **zoom-rotate** - Zoom and slight rotation
- **3d-tilt** - 3D perspective tilt
- **expandOnHover** - Expand to fill space
- **image-reveal** - Reveal hidden image portion

### Text Animations
- **typewriter** - Text types out character by character
- **splitTextReveal** - Each word/letter animates in
- **kineticType** - Text that moves/shifts
- **gradientText** - Animated gradient on text
- **letterSpacing** - Animate letter spacing

### Advanced Effects
- **cardFlip** - 3D card flip animation
- **carousel** - Rotating content slider
- **pulse-glow** - Pulsing glow effect
- **bounce** - Bouncing motion
- **float** - Gentle floating motion
- **colorWave** - Wave of color transition

---

## How to Use These Templates

### Method 1: Import into Builder
1. Open your builder app
2. Click "Import Template"
3. Select the desired JSON file
4. Template sections will populate in the builder
5. Customize content, images, and colors
6. Export static build

### Method 2: Direct Deployment
1. Copy the JSON file
2. Place in `client-template/src/config/`
3. Run build: `npm run build`
4. Deploy `/dist` folder to cPanel

---

## Customization Guide

### Changing Colors
Each template has a `globalSettings.colorScheme` object:
```json
"colorScheme": {
  "primary": "#DC2626",
  "secondary": "#1F2937",
  "accent": "#F59E0B",
  "background": "#FFFFFF",
  "text": "#1F2937"
}
```

### Modifying Animations
Each section has an `animation` property:
```json
"animation": {
  "type": "fadeInUp",
  "duration": 0.8,
  "delay": 0.2,
  "stagger": 0.15
}
```

- **type**: Animation name
- **duration**: How long (seconds)
- **delay**: Wait before starting (seconds)
- **stagger**: Delay between child elements (seconds)

### WhatsApp Configuration
Update the global WhatsApp settings:
```json
"whatsapp": {
  "enabled": true,
  "number": "1234567890",
  "message": "Hello! I'd like to order...",
  "position": "bottom-right",
  "animation": "bounce"
}
```

---

## Animation Performance Tips

1. **Use CSS for simple animations** - Transitions, fades, scales
2. **Use Framer Motion for complex animations** - Scroll-triggered, orchestrated
3. **Lazy load images** - Only load when in viewport
4. **Reduce motion on mobile** - Use `prefers-reduced-motion` media query
5. **Limit simultaneous animations** - Max 3-4 at once
6. **Use transform over position** - Better performance
7. **Add will-change sparingly** - Only for actively animating elements

---

## Browser Support

All templates are tested and work on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 10+)

---

## File Structure

```
prebuilt-templates/
├── README.md                    # This file
├── restaurant-template.json     # Restaurant template
├── painting-template.json       # Painting service template
├── furniture-template.json      # Furniture store template
├── animations-library.md        # Animation implementation guide
└── template-preview.html        # Visual preview page
```

---

## Creating New Templates

To create your own template:

1. Copy an existing template JSON
2. Modify `templateName`, `templateId`, and `industry`
3. Update sections array with your content
4. Configure animations for each section
5. Set global color scheme and fonts
6. Test animations and responsiveness
7. Document your template in this README

---

## Support & Resources

- **Framer Motion Docs:** https://www.framer.com/motion/
- **Animation Inspiration:** https://www.awwwards.com/
- **Color Palettes:** https://coolors.co/
- **Free Images:** https://unsplash.com/

---

## License

These templates are part of the Landing Page Builder system. All rights reserved.

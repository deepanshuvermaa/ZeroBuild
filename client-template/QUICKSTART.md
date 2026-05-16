# Quick Start Guide

## Getting Started

### 1. Install Dependencies

Make sure all dependencies are installed:

```bash
npm install
```

### 2. Import Components

Import the components you need in your React files:

```typescript
import {
  HeroSection,
  AboutSection,
  ServicesSection,
  MenuSection,
  GallerySection,
  TestimonialsSection,
  OffersSection,
  CTASection,
  FooterSection,
  FloatingWhatsApp
} from './components';
```

### 3. Import Types

Import the corresponding TypeScript types:

```typescript
import type {
  HeroSectionProps,
  AboutSectionProps,
  ServicesSectionProps,
  // ... etc
} from './types';
```

### 4. Use Components

Use components with your data:

```typescript
function App() {
  const heroData: HeroSectionProps = {
    backgroundImage: '/images/hero-bg.jpg',
    heading: 'Welcome to Our Business',
    subheading: 'We provide exceptional services',
    ctaText: 'Get Started',
    ctaLink: '#services'
  };

  return (
    <div>
      <HeroSection {...heroData} />
      {/* Add more components */}
    </div>
  );
}
```

## Minimal Example

Here's a minimal working example:

```typescript
// src/App.tsx
import { HeroSection, FooterSection, FloatingWhatsApp } from './components';

function App() {
  return (
    <div className="min-h-screen">
      <HeroSection
        backgroundImage="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
        heading="Welcome"
        subheading="Start your journey with us"
        ctaText="Learn More"
        ctaLink="#about"
      />

      <FooterSection
        businessName="My Business"
        socialLinks={[
          { platform: 'Facebook', url: 'https://facebook.com', icon: '📘' },
          { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' }
        ]}
      />

      <FloatingWhatsApp
        phoneNumber="+1234567890"
        message="Hello! I'd like to know more."
      />
    </div>
  );
}

export default App;
```

## Full Example

For a complete example using all components with sample data, check:
- `src/examples/ComponentUsageExample.tsx`

## Run Development Server

```bash
npm run dev
```

## Component Props Reference

### Required vs Optional Props

Each component has a mix of required and optional props. TypeScript will guide you:

- **Required props**: Must be provided
- **Optional props**: Marked with `?` in the type definition

### Example with Optional Props

```typescript
<AboutSection
  image="/about.jpg"
  imageAlt="About us"
  heading="Our Story"
  description="We started in 2020..."
  features={[  // Optional!
    'Feature 1',
    'Feature 2'
  ]}
/>
```

## Styling Customization

### Tailwind Configuration

Customize colors in `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',    // Change blue-600
        secondary: '#8B5CF6',  // Change purple-600
      }
    }
  }
}
```

### Component-Level Customization

Each component uses Tailwind classes. To customize, you can:

1. Edit the component files directly
2. Wrap components in custom divs
3. Use Tailwind's `@apply` directive

## Animation Customization

### Adjusting Animation Duration

Find animation settings in each component:

```typescript
// Example: In HeroSection.tsx
transition={{ duration: 0.6, ease: 'easeOut' }}

// Change to:
transition={{ duration: 1.0, ease: 'easeOut' }}  // Slower
transition={{ duration: 0.3, ease: 'easeOut' }}  // Faster
```

### Disabling Animations

To disable animations, replace `motion.div` with `div`:

```typescript
// Before:
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
>

// After:
<div>
```

## Common Patterns

### Loading Data from API

```typescript
import { useState, useEffect } from 'react';
import { ServicesSection } from './components';
import type { ServicesSectionProps } from './types';

function ServicesPage() {
  const [data, setData] = useState<ServicesSectionProps | null>(null);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  return <ServicesSection {...data} />;
}
```

### Dynamic Menu Filtering

MenuSection handles filtering automatically. Just pass all items:

```typescript
<MenuSection
  heading="Menu"
  categories={categories}
  items={allItems}  // Component filters these
/>
```

### WhatsApp Number Format

Always include country code:

```typescript
// Correct:
phoneNumber="+15551234567"
phoneNumber="+447123456789"

// Incorrect:
phoneNumber="5551234567"  // Missing country code
```

## Troubleshooting

### TypeScript Errors

If you get type errors:
1. Make sure you're importing types from `'./types'`
2. Check that all required props are provided
3. Run `npm run build` to check for errors

### Animation Not Working

1. Check that Framer Motion is installed: `npm list framer-motion`
2. Verify component is in viewport
3. Check browser console for errors

### Images Not Loading

1. Verify image URLs are correct
2. Check CORS settings if loading from external source
3. Use relative paths for local images: `/images/photo.jpg`

### Styling Issues

1. Make sure Tailwind CSS is properly configured
2. Check that `index.css` imports Tailwind directives
3. Verify `tailwind.config.js` includes all content paths

## Next Steps

1. **Customize Data**: Replace example data with your real content
2. **Add Images**: Upload your images to `/public/images/`
3. **Configure Colors**: Update Tailwind config with your brand colors
4. **Test Responsive**: Check all breakpoints (mobile, tablet, desktop)
5. **Optimize Performance**: Optimize images, lazy load heavy sections
6. **Deploy**: Build and deploy your site

## Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React TypeScript Docs](https://react-typescript-cheatsheet.netlify.app/)

## Support

For issues or questions:
1. Check `COMPONENTS_README.md` for detailed component docs
2. Review example in `src/examples/ComponentUsageExample.tsx`
3. Check TypeScript types in `src/types/index.ts`

---

Happy building! 🚀

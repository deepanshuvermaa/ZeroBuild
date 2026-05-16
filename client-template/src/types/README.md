# TypeScript Types Reference

This directory contains all TypeScript type definitions for the client-facing components.

## Importing Types

### Import All Types

```typescript
import type * as Types from './types';

const heroData: Types.HeroSectionProps = {
  // ...
};
```

### Import Specific Types

```typescript
import type {
  HeroSectionProps,
  AboutSectionProps,
  ServicesSectionProps
} from './types';
```

### Import Individual Nested Types

```typescript
import type {
  Service,
  MenuItem,
  MenuCategory,
  GalleryImage,
  Testimonial,
  Offer,
  SocialLink
} from './types';
```

## Type Reference

### Component Props Types

All main component prop types:

| Type | Component | Required Props |
|------|-----------|----------------|
| `HeroSectionProps` | HeroSection | all props |
| `AboutSectionProps` | AboutSection | image, imageAlt, heading, description |
| `ServicesSectionProps` | ServicesSection | heading, services |
| `MenuSectionProps` | MenuSection | heading, categories, items |
| `GallerySectionProps` | GallerySection | heading, images |
| `TestimonialsSectionProps` | TestimonialsSection | heading, testimonials |
| `OffersSectionProps` | OffersSection | heading, offers |
| `CTASectionProps` | CTASection | heading, description, ctaText, ctaLink |
| `FooterSectionProps` | FooterSection | businessName, socialLinks |
| `FloatingWhatsAppProps` | FloatingWhatsApp | phoneNumber |

### Data Object Types

Nested types used within component props:

| Type | Used In | Properties |
|------|---------|------------|
| `Service` | ServicesSection | id, icon, title, description |
| `MenuItem` | MenuSection | id, name, description, price, category |
| `MenuCategory` | MenuSection | id, name, slug |
| `GalleryImage` | GallerySection | id, url, alt |
| `Testimonial` | TestimonialsSection | id, name, rating, comment |
| `Offer` | OffersSection | id, title, description, discount |
| `SocialLink` | FooterSection | platform, url, icon |

## Type Details

### HeroSectionProps

```typescript
interface HeroSectionProps {
  backgroundImage: string;  // URL to background image
  heading: string;          // Main heading text
  subheading: string;       // Supporting text
  ctaText: string;          // Button text
  ctaLink: string;          // Button destination
}
```

### AboutSectionProps

```typescript
interface AboutSectionProps {
  image: string;            // Image URL
  imageAlt: string;         // Alt text for accessibility
  heading: string;          // Section heading
  description: string;      // Main text content
  features?: string[];      // Optional bullet points
}
```

### ServicesSectionProps

```typescript
interface ServicesSectionProps {
  heading: string;
  subheading?: string;      // Optional subtitle
  services: Service[];      // Array of service objects
}

interface Service {
  id: string;               // Unique identifier
  icon: string;             // Emoji or icon character
  title: string;            // Service name
  description: string;      // Service description
}
```

### MenuSectionProps

```typescript
interface MenuSectionProps {
  heading: string;
  categories: MenuCategory[];
  items: MenuItem[];
}

interface MenuCategory {
  id: string;
  name: string;             // Display name
  slug: string;             // URL-friendly identifier
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;            // Numeric price
  image?: string;           // Optional item image
  category: string;         // Must match category slug
}
```

### GallerySectionProps

```typescript
interface GallerySectionProps {
  heading: string;
  images: GalleryImage[];
}

interface GalleryImage {
  id: string;
  url: string;              // Image URL
  alt: string;              // Alt text
  caption?: string;         // Optional caption on hover
}
```

### TestimonialsSectionProps

```typescript
interface TestimonialsSectionProps {
  heading: string;
  testimonials: Testimonial[];
}

interface Testimonial {
  id: string;
  name: string;             // Customer name
  rating: number;           // 1-5 stars
  comment: string;          // Review text
  image?: string;           // Optional avatar
  date?: string;            // Optional review date
}
```

### OffersSectionProps

```typescript
interface OffersSectionProps {
  heading: string;
  offers: Offer[];
}

interface Offer {
  id: string;
  title: string;            // Offer title
  description: string;      // Offer details
  discount: string;         // e.g., "50% OFF"
  image?: string;           // Optional offer image
  validUntil?: string;      // Optional expiration date
}
```

### CTASectionProps

```typescript
interface CTASectionProps {
  heading: string;
  description: string;
  ctaText: string;          // Button text
  ctaLink: string;          // Button URL
  backgroundImage?: string; // Optional background
}
```

### FooterSectionProps

```typescript
interface FooterSectionProps {
  businessName: string;
  tagline?: string;
  address?: string;
  phone?: string;           // Format: "+1234567890"
  email?: string;
  socialLinks: SocialLink[];
  copyright?: string;       // Auto-generated if not provided
}

interface SocialLink {
  platform: string;         // e.g., "Facebook"
  url: string;              // Full URL
  icon: string;             // Emoji or icon character
}
```

### FloatingWhatsAppProps

```typescript
interface FloatingWhatsAppProps {
  phoneNumber: string;      // With country code: "+1234567890"
  message?: string;         // Pre-filled message
  position?: 'left' | 'right'; // Button position
}
```

## Optional Props

Props marked with `?` are optional. All other props are required.

### Example with All Optional Props

```typescript
const aboutData: AboutSectionProps = {
  image: '/about.jpg',
  imageAlt: 'About us',
  heading: 'Our Story',
  description: 'We started...',
  features: ['Feature 1', 'Feature 2']  // Optional
};
```

## Array Types

When working with arrays, ensure each item has a unique `id`:

```typescript
const services: Service[] = [
  { id: '1', icon: '🍕', title: 'Pizza', description: 'Delicious pizza' },
  { id: '2', icon: '🍔', title: 'Burgers', description: 'Juicy burgers' }
];
```

## Type Safety Tips

1. **Use TypeScript's type checking**: Let TypeScript catch errors before runtime
2. **Provide all required props**: TypeScript will warn you if props are missing
3. **Use correct data types**: Especially for numbers (price, rating) and booleans
4. **Use unions carefully**: For `position?: 'left' | 'right'`, only use these exact values

## Common Type Errors

### Missing Required Prop

```typescript
// ❌ Error: Missing 'heading'
<AboutSection
  image="/img.jpg"
  imageAlt="Alt"
  description="Text"
/>

// ✅ Correct:
<AboutSection
  image="/img.jpg"
  imageAlt="Alt"
  heading="About Us"    // Added
  description="Text"
/>
```

### Wrong Type

```typescript
// ❌ Error: price should be number
const item: MenuItem = {
  id: '1',
  name: 'Pizza',
  description: 'Yum',
  price: '$12.99',      // Wrong: should be number
  category: 'food'
};

// ✅ Correct:
const item: MenuItem = {
  id: '1',
  name: 'Pizza',
  description: 'Yum',
  price: 12.99,         // Correct: number
  category: 'food'
};
```

### Invalid Union Value

```typescript
// ❌ Error: position must be 'left' or 'right'
<FloatingWhatsApp
  phoneNumber="+123"
  position="center"     // Wrong: not in union
/>

// ✅ Correct:
<FloatingWhatsApp
  phoneNumber="+123"
  position="right"      // Correct: valid union value
/>
```

## Type Extensions

To extend types for custom use:

```typescript
import type { Service } from './types';

// Extend existing type
interface ExtendedService extends Service {
  featured: boolean;
  discount?: number;
}

// Use extended type
const services: ExtendedService[] = [
  {
    id: '1',
    icon: '🍕',
    title: 'Pizza',
    description: 'Delicious',
    featured: true,       // Custom property
    discount: 0.1         // Custom property
  }
];
```

## Best Practices

1. **Always import types**: Use `import type` for type-only imports
2. **Use const assertions**: For literal values that won't change
3. **Validate at runtime**: Types are compile-time only
4. **Document custom data**: Add JSDoc comments for custom properties
5. **Keep IDs unique**: Always use unique IDs for array items

---

For more information, see the main `COMPONENTS_README.md` file.

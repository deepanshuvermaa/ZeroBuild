# Client-Facing Components Documentation

This project includes 10 production-ready, client-facing components built with React, TypeScript, Framer Motion, and Tailwind CSS.

## Components Overview

All components are located in `src/components/` and can be imported from the main index file:

```typescript
import {
  HeroSection,
  AboutSection,
  ServicesSection,
  // ... etc
} from './components';
```

## Component Details

### 1. HeroSection
**File:** `src/components/HeroSection.tsx`

Full viewport hero section with background image overlay.

**Props:**
- `backgroundImage` (string) - URL of the hero background image
- `heading` (string) - Main hero heading text
- `subheading` (string) - Supporting text below heading
- `ctaText` (string) - Call-to-action button text
- `ctaLink` (string) - CTA button destination URL

**Features:**
- Full viewport height (min-h-screen)
- Dark overlay for text readability
- Animated scroll indicator
- Staggered fade-in animations
- Responsive text sizing

---

### 2. AboutSection
**File:** `src/components/AboutSection.tsx`

Image and text layout with optional feature list.

**Props:**
- `image` (string) - URL of the about section image
- `imageAlt` (string) - Alt text for the image
- `heading` (string) - Section heading
- `description` (string) - Main descriptive text
- `features` (string[], optional) - Array of feature bullet points

**Features:**
- Side-by-side image/text layout (responsive)
- Slide-in animations from opposite directions
- Checkmark icons for feature list
- Decorative background element
- Smooth stagger animations

---

### 3. ServicesSection
**File:** `src/components/ServicesSection.tsx`

Grid display of service cards with icons.

**Props:**
- `heading` (string) - Section heading
- `subheading` (string, optional) - Supporting text
- `services` (Service[]) - Array of service objects
  - `id` (string) - Unique identifier
  - `icon` (string) - Emoji or icon
  - `title` (string) - Service name
  - `description` (string) - Service description

**Features:**
- Responsive grid (1/2/3 columns)
- Staggered card animations
- Icon rotation on hover
- Lift effect on hover
- GPU-accelerated transforms

---

### 4. MenuSection
**File:** `src/components/MenuSection.tsx`

Tabbed menu with category filtering.

**Props:**
- `heading` (string) - Section heading
- `categories` (MenuCategory[]) - Array of category objects
  - `id` (string) - Unique identifier
  - `name` (string) - Display name
  - `slug` (string) - URL-friendly identifier
- `items` (MenuItem[]) - Array of menu item objects
  - `id` (string) - Unique identifier
  - `name` (string) - Item name
  - `description` (string) - Item description
  - `price` (number) - Item price
  - `image` (string, optional) - Item image URL
  - `category` (string) - Category slug

**Features:**
- Interactive category tabs
- Filtered item display
- Image zoom on hover
- Smooth layout transitions
- AnimatePresence for smooth filtering

---

### 5. GallerySection
**File:** `src/components/GallerySection.tsx`

Responsive image gallery with hover overlays.

**Props:**
- `heading` (string) - Section heading
- `images` (GalleryImage[]) - Array of image objects
  - `id` (string) - Unique identifier
  - `url` (string) - Image URL
  - `alt` (string) - Alt text
  - `caption` (string, optional) - Image caption

**Features:**
- Masonry-style responsive grid
- Hover overlay with captions
- Scale animation on hover
- Border highlight effect
- Staggered load animations

---

### 6. TestimonialsSection
**File:** `src/components/TestimonialsSection.tsx`

Customer reviews with star ratings.

**Props:**
- `heading` (string) - Section heading
- `testimonials` (Testimonial[]) - Array of testimonial objects
  - `id` (string) - Unique identifier
  - `name` (string) - Customer name
  - `rating` (number) - Star rating (1-5)
  - `comment` (string) - Review text
  - `image` (string, optional) - Customer avatar URL
  - `date` (string, optional) - Review date

**Features:**
- Animated star ratings
- Quote icon decoration
- Customer avatars
- Card lift on hover
- Staggered card animations

---

### 7. OffersSection
**File:** `src/components/OffersSection.tsx`

Special offers with discount badges.

**Props:**
- `heading` (string) - Section heading
- `offers` (Offer[]) - Array of offer objects
  - `id` (string) - Unique identifier
  - `title` (string) - Offer title
  - `description` (string) - Offer details
  - `discount` (string) - Discount text (e.g., "50% OFF")
  - `image` (string, optional) - Offer image URL
  - `validUntil` (string, optional) - Expiration date

**Features:**
- Spinning discount badges
- Gradient background
- Image zoom on hover
- Validity timer display
- CTA buttons with animations

---

### 8. CTASection
**File:** `src/components/CTASection.tsx`

Full-width call-to-action section with bold design.

**Props:**
- `heading` (string) - Main CTA heading
- `description` (string) - Supporting text
- `ctaText` (string) - Button text
- `ctaLink` (string) - Button destination URL
- `backgroundImage` (string, optional) - Background image URL

**Features:**
- Full-width bold design
- Gradient or image background
- Animated background blobs
- Large, prominent CTA button
- Animated decorative elements

---

### 9. FooterSection
**File:** `src/components/FooterSection.tsx`

Business information and social links footer.

**Props:**
- `businessName` (string) - Business name
- `tagline` (string, optional) - Business tagline
- `address` (string, optional) - Physical address
- `phone` (string, optional) - Phone number
- `email` (string, optional) - Email address
- `socialLinks` (SocialLink[]) - Array of social media links
  - `platform` (string) - Platform name
  - `url` (string) - Profile URL
  - `icon` (string) - Icon emoji or symbol
- `copyright` (string, optional) - Copyright text (auto-generated if not provided)

**Features:**
- Multi-column responsive layout
- Clickable contact information
- Animated social media icons
- Icon-based contact display
- Divider animation

---

### 10. FloatingWhatsApp
**File:** `src/components/FloatingWhatsApp.tsx`

Fixed position WhatsApp contact button.

**Props:**
- `phoneNumber` (string) - WhatsApp phone number (with country code)
- `message` (string, optional) - Pre-filled message text
- `position` ('left' | 'right', optional) - Button position (default: 'right')

**Features:**
- Fixed bottom corner positioning
- Continuous pulse animation
- Hover tooltip
- Opens WhatsApp chat in new tab
- Scale animations on interaction

---

## Type Definitions

All TypeScript interfaces are defined in `src/types/index.ts`.

## Animation Features

All components use:
- **Framer Motion** for smooth animations
- **whileInView** with `viewport={{ once: true }}` for scroll-triggered animations
- **GPU-accelerated properties** (transform, opacity) only
- Stagger effects for lists and grids
- Hover and tap interactions

## Styling

- **Tailwind CSS** for all styling
- **Mobile-first** responsive design
- Consistent color scheme (customizable via Tailwind config)
- Professional shadows and transitions

## Example Usage

See `src/examples/ComponentUsageExample.tsx` for a complete example of how to use all components with sample data.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive
- Framer Motion animations degrade gracefully

## Performance

- Optimized animations (GPU-accelerated)
- Lazy loading ready (viewport detection)
- Minimal re-renders
- Efficient bundle size

## Customization

All components accept standard className props and can be customized via:
1. Tailwind CSS configuration
2. Component props
3. Direct styling (not recommended)

---

Built with React 19, TypeScript, Framer Motion, and Tailwind CSS.

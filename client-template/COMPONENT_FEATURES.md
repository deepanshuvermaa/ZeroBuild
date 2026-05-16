# Component Features & Visual Guide

Detailed breakdown of each component's features, animations, and visual appearance.

---

## 1. HeroSection

### Visual Design
- **Layout**: Full viewport height (100vh)
- **Background**: Full-screen image with dark overlay
- **Content**: Centered heading, subheading, and CTA button
- **Colors**: White text on dark overlay, blue CTA button

### Animations
1. **Heading**: Fades in + slides up (0.6s)
2. **Subheading**: Fades in + slides up (0.6s, 0.2s delay)
3. **CTA Button**: Fades in + slides up (0.6s, 0.4s delay)
4. **Hover**: Button scales to 1.05x
5. **Tap**: Button scales to 0.95x
6. **Scroll Indicator**: Bouncing animation (1.5s loop)

### Responsive Breakpoints
- Mobile: text-4xl heading
- SM: text-5xl heading
- MD: text-6xl heading
- LG: text-7xl heading

### Key Features
- Full viewport coverage
- Dark overlay for readability
- Animated scroll indicator
- Staggered content reveal
- Smooth CTA interactions

---

## 2. AboutSection

### Visual Design
- **Layout**: Two-column grid (image left, content right)
- **Background**: White
- **Content**: Image with decorative element, heading, text, feature list
- **Colors**: Blue accents, gray text

### Animations
1. **Image**: Slides in from left (0.6s)
2. **Decorative Box**: Fades in + scales (0.6s, 0.2s delay)
3. **Heading**: Fades in + slides up (0.6s, 0.1s delay)
4. **Description**: Fades in + slides up (0.6s, 0.2s delay)
5. **Features**: Staggered fade-in from left (0.4s each, 0.1s stagger)
6. **Checkmarks**: Individual animations per feature

### Responsive Breakpoints
- Mobile: Single column (image top, content bottom)
- LG: Two columns side by side

### Key Features
- Image aspect ratio: 4:3
- Blue decorative background element
- Checkmark icons for features
- Smooth slide-in from opposite directions
- Optional feature list

---

## 3. ServicesSection

### Visual Design
- **Layout**: Grid of service cards (1/2/3 columns)
- **Background**: Light gray (gray-50)
- **Content**: Icon, title, description per card
- **Colors**: Blue icons, white cards, shadow effects

### Animations
1. **Heading**: Fades in + slides up (0.6s)
2. **Subheading**: Fades in + slides up (0.6s, 0.1s delay)
3. **Cards**: Staggered fade-in + scale (0.15s stagger)
4. **Card Hover**: Lifts up 8px
5. **Icon Hover**: Scales to 1.1x + rotates 5deg
6. **Shadow**: Increases on hover

### Responsive Breakpoints
- Mobile: 1 column
- SM: 2 columns
- LG: 3 columns

### Key Features
- Equal height cards
- Icon background circles
- Hover lift effect
- Stagger animation
- Flexible grid system

---

## 4. MenuSection

### Visual Design
- **Layout**: Category tabs + grid of menu items
- **Background**: White
- **Content**: Filterable menu items with images
- **Colors**: Blue active tab, gray inactive tabs

### Animations
1. **Heading**: Fades in + slides up (0.6s)
2. **Tabs**: Fades in + slides up (0.6s, 0.2s delay)
3. **Tab Hover**: Scales to 1.05x
4. **Tab Tap**: Scales to 0.95x
5. **Items Grid**: Staggered fade-in + scale (0.1s stagger)
6. **Item Hover**: Lifts up 5px
7. **Image Hover**: Scales to 1.1x
8. **Filter Transition**: Smooth AnimatePresence

### Responsive Breakpoints
- Mobile: 1 column
- MD: 2 columns
- LG: 3 columns

### Key Features
- Interactive category filtering
- Smooth filter transitions
- Image zoom on hover
- Price display
- Optional item images

---

## 5. GallerySection

### Visual Design
- **Layout**: Masonry-style grid of images
- **Background**: Light gray (gray-50)
- **Content**: Square images with hover overlay
- **Colors**: Blue border on hover, black overlay

### Animations
1. **Heading**: Fades in + slides up (0.6s)
2. **Images**: Staggered fade-in + scale (0.1s stagger)
3. **Image Hover**: Scales to 1.05x
4. **Overlay**: Fades in on hover (0.3s)
5. **Caption**: Slides up + fades in (0.3s, 0.1s delay)
6. **Border**: Scales from 0 to 1 (0.3s)

### Responsive Breakpoints
- Mobile: 1 column
- SM: 2 columns
- LG: 3 columns

### Key Features
- Square aspect ratio
- Caption on hover
- Blue border highlight
- Dark overlay effect
- Smooth scale animations

---

## 6. TestimonialsSection

### Visual Design
- **Layout**: Grid of testimonial cards
- **Background**: White
- **Content**: Quote icon, stars, review, author info
- **Colors**: Blue quote icons, yellow stars, gray cards

### Animations
1. **Heading**: Fades in + slides up (0.6s)
2. **Cards**: Staggered fade-in + slide up (0.15s stagger)
3. **Quote Icon**: Fades in + rotates (0.5s)
4. **Stars**: Individual staggered animations (0.1s each)
5. **Card Hover**: Lifts up 8px
6. **Avatar Hover**: Scales to 1.1x

### Responsive Breakpoints
- Mobile: 1 column
- MD: 2 columns
- LG: 3 columns

### Key Features
- 5-star rating system
- Quote icon decoration
- Customer avatars
- Date stamps
- Hover lift effect

---

## 7. OffersSection

### Visual Design
- **Layout**: Grid of offer cards with badges
- **Background**: Blue-purple gradient
- **Content**: Discount badge, image, title, description, CTA
- **Colors**: Red discount badge, white cards, blue gradient

### Animations
1. **Heading**: Fades in + slides up (0.6s)
2. **Cards**: Staggered fade-in + scale (0.15s stagger)
3. **Discount Badge**: Spins in from 0 scale (0.5s, 0.2s delay)
4. **Card Hover**: Scales to 1.05x
5. **Image Hover**: Scales to 1.1x
6. **Button Hover**: Scales to 1.05x
7. **Button Tap**: Scales to 0.95x

### Responsive Breakpoints
- Mobile: 1 column
- MD: 2 columns
- LG: 3 columns

### Key Features
- Spinning discount badges
- Gradient background
- Validity dates with icons
- CTA buttons
- Optional images

---

## 8. CTASection

### Visual Design
- **Layout**: Full-width section with centered content
- **Background**: Gradient or image with overlay
- **Content**: Large heading, description, prominent CTA button
- **Colors**: Blue-purple gradient, white text, white button

### Animations
1. **Heading**: Fades in + slides up (0.6s)
2. **Description**: Fades in + slides up (0.6s, 0.2s delay)
3. **Button**: Fades in + slides up (0.6s, 0.4s delay)
4. **Background Blobs**: Rotating + scaling (20-25s loops)
5. **Decorative Dots**: Bouncing (2s loops, staggered)
6. **Button Hover**: Scales to 1.05x
7. **Button Tap**: Scales to 0.95x

### Responsive Breakpoints
- Mobile: text-3xl heading
- SM: text-4xl heading
- MD: text-5xl heading
- LG: text-6xl heading

### Key Features
- Bold, attention-grabbing design
- Animated background effects
- Large CTA button
- Optional background image
- Gradient overlay

---

## 9. FooterSection

### Visual Design
- **Layout**: Multi-column grid with sections
- **Background**: Dark gray (gray-900)
- **Content**: Business info, contact, social links
- **Colors**: White text, blue accents, gray hover states

### Animations
1. **All Sections**: Staggered fade-in + slide up (0.1s stagger)
2. **Social Icons**: Scale + rotate on hover
3. **Social Icons Tap**: Scales to 0.9x
4. **Divider**: Scales horizontally (0.8s)
5. **Copyright**: Fades in (0.6s, 0.3s delay)
6. **Links**: Color transition on hover

### Responsive Breakpoints
- Mobile: 1 column
- MD: 2 columns
- LG: 3 columns

### Key Features
- Clickable contact info
- Social media icons
- Address with map icon
- Phone and email with icons
- Auto-generated copyright

---

## 10. FloatingWhatsApp

### Visual Design
- **Layout**: Fixed position circle button
- **Background**: Green (WhatsApp brand color)
- **Content**: WhatsApp icon
- **Colors**: Green background, white icon

### Animations
1. **Initial**: Scales from 0 to 1 (0.5s, 1s delay)
2. **Pulse**: Continuous pulse effect (2s loop)
3. **Hover**: Scales to 1.1x
4. **Tap**: Scales to 0.9x
5. **Tooltip**: Slides in from side on hover (0.3s)

### Positioning
- **Right**: Fixed right-6 bottom-6 (default)
- **Left**: Fixed left-6 bottom-6

### Key Features
- Continuous pulse animation
- WhatsApp integration
- Pre-filled message
- Hover tooltip
- Customizable position

---

## Common Animation Properties

All components use GPU-accelerated properties:
- **Transform**: translate, scale, rotate
- **Opacity**: fade effects

### No Layout Shift Properties
Avoiding these for performance:
- width, height
- top, left, right, bottom (except fixed positioning)
- margin, padding

### Standard Durations
- **Fast**: 0.3s (hovers, quick interactions)
- **Normal**: 0.6s (content reveals)
- **Slow**: 0.8s - 1.0s (large elements)

### Standard Easings
- **easeOut**: Default for entering animations
- **easeInOut**: Smooth continuous animations
- **linear**: Infinite loops (pulse, rotate)

---

## Color Palette Used

### Primary Colors
- **Blue**: `blue-600` (#2563eb) - CTAs, accents
- **Purple**: `purple-600` (#9333ea) - Gradients

### Neutral Colors
- **White**: Background, text on dark
- **Gray-50**: Light backgrounds
- **Gray-900**: Dark backgrounds (footer)

### Accent Colors
- **Green**: WhatsApp button
- **Red**: Discount badges
- **Yellow**: Star ratings

---

## Responsive Strategy

### Mobile First
All components start with mobile layouts and scale up.

### Breakpoints
- **SM**: 640px (small tablets)
- **MD**: 768px (tablets)
- **LG**: 1024px (desktops)
- **XL**: 1280px (large desktops) - rarely used

### Typical Patterns
```
Mobile:  1 column grid
Tablet:  2 column grid
Desktop: 3 column grid
```

---

## Accessibility Features

### Semantic HTML
- `<section>` for sections
- `<nav>` for navigation
- `<footer>` for footer
- `<button>` for buttons

### ARIA Labels
- Alt text on all images
- aria-label on icon buttons
- Screen reader friendly

### Keyboard Navigation
- All interactive elements focusable
- Proper tab order
- Focus indicators

---

## Performance Optimizations

### GPU Acceleration
- Using transform and opacity only
- No layout thrashing
- Smooth 60fps animations

### Lazy Loading
- whileInView triggers on scroll
- viewport={{ once: true }} prevents re-animation
- Efficient animation cleanup

### Bundle Size
- Tree-shakeable exports
- No unnecessary dependencies
- Optimized component code

---

Use this guide to understand each component's behavior and customize as needed!

# Component Features Overview

Visual guide to all features available in each preview component.

## 🎨 Universal Features (All Components)

Every preview component includes these features:

### Selection System
- **Visual Indicator:** 4px blue ring border with 2px offset
- **Edit Hint Badge:** Top-right corner with edit icon
- **Click to Select:** Simple click interaction
- **Clear Selection:** Only one component selected at a time

### Hover System
- **Dotted Border:** 2px dashed blue outline
- **Smooth Transition:** Opacity animation
- **Non-intrusive:** Doesn't interfere with content

### Animation System
- **Entrance:** Fade + slide from bottom
- **Exit:** Fade + slide to left
- **Stagger:** Children animate sequentially
- **Performance:** Optimized 60fps animations

### Responsive System
- **Mobile First:** Works on all screen sizes
- **Breakpoints:** sm, md, lg, xl
- **Flexible Grids:** Adapt to container width
- **Typography:** Scales appropriately

---

## 1️⃣ HeroSectionPreview

### Visual Features
```
┌─────────────────────────────────────────┐
│  [Background Image with Overlay]        │
│                                         │
│         MAIN HEADLINE TEXT              │
│         Supporting subheading           │
│                                         │
│         [ CTA Button ]                  │
│                                         │
└─────────────────────────────────────────┘
```

### Props Configuration
- `heading` - Large, bold headline
- `subheading` - Supporting text
- `ctaText` - Button label
- `ctaLink` - Button destination
- `backgroundImage` - Hero image URL
- `backgroundColor` - Fallback color
- `textColor` - Text color override
- `overlayOpacity` - Darkness (0-1)

### Special Features
- Background image with overlay
- Customizable overlay opacity
- Gradient text shadow
- Responsive text sizing
- Hover effect on button

---

## 2️⃣ AboutSectionPreview

### Visual Features (Image Right)
```
┌─────────────────────────────────────────┐
│  ┌─────────────┐    ┌─────────────┐   │
│  │   Heading   │    │             │   │
│  │             │    │   Image     │   │
│  │ Description │    │             │   │
│  │   Content   │    │             │   │
│  └─────────────┘    └─────────────┘   │
└─────────────────────────────────────────┘
```

### Visual Features (Image Left)
```
┌─────────────────────────────────────────┐
│  ┌─────────────┐    ┌─────────────┐   │
│  │             │    │   Heading   │   │
│  │   Image     │    │             │   │
│  │             │    │ Description │   │
│  │             │    │   Content   │   │
│  └─────────────┘    └─────────────┘   │
└─────────────────────────────────────────┘
```

### Props Configuration
- `heading` - Section heading
- `description` - Main text content
- `image` - About image URL
- `imagePosition` - 'left' | 'right'
- `backgroundColor` - Section background

### Special Features
- Dynamic image positioning
- Responsive grid layout
- Image placeholder when empty
- Shadow on image
- Smooth entrance animations

---

## 3️⃣ ServicesSectionPreview

### Visual Features (3 Columns)
```
┌─────────────────────────────────────────┐
│         HEADING                         │
│         Subheading                      │
│                                         │
│  ┌────┐  ┌────┐  ┌────┐               │
│  │ 🎯 │  │ 💼 │  │ 🚀 │               │
│  │Srv1│  │Srv2│  │Srv3│               │
│  │Desc│  │Desc│  │Desc│               │
│  └────┘  └────┘  └────┘               │
└─────────────────────────────────────────┘
```

### Props Configuration
- `heading` - Section heading
- `subheading` - Section tagline
- `services` - Array of service objects
- `backgroundColor` - Background color
- `columns` - 2 | 3 | 4

### Service Object
```tsx
{
  id: string;
  icon: string;        // Emoji or icon
  title: string;       // Service name
  description: string; // Service description
}
```

### Special Features
- Configurable grid (2, 3, or 4 columns)
- Card hover effects
- Staggered animations
- Empty state with helpful message
- Responsive stacking

---

## 4️⃣ MenuSectionPreview

### Visual Features
```
┌─────────────────────────────────────────┐
│         HEADING                         │
│         Subheading                      │
│                                         │
│  [All] [Appetizers] [Main] [Desserts]  │
│                                         │
│  ┌────────┐  Dish Name      $24.99    │
│  │ Image  │  Description text here     │
│  └────────┘                             │
│                                         │
│  ┌────────┐  Dish Name      $18.99    │
│  │ Image  │  Description text here     │
│  └────────┘                             │
└─────────────────────────────────────────┘
```

### Props Configuration
- `heading` - Menu heading
- `subheading` - Menu tagline
- `menuItems` - Array of items
- `categories` - Filter categories
- `backgroundColor` - Background color

### Menu Item Object
```tsx
{
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
}
```

### Special Features
- Working category filter
- Animated tab switching
- Filtered item transitions
- Image with food placeholder
- Price display formatting
- 2-column grid layout

---

## 5️⃣ GallerySectionPreview

### Visual Features (Grid Layout)
```
┌─────────────────────────────────────────┐
│         HEADING                         │
│         Subheading                      │
│                                         │
│  ┌────┐ ┌────┐ ┌────┐                 │
│  │Img1│ │Img2│ │Img3│                 │
│  └────┘ └────┘ └────┘                 │
│  ┌────┐ ┌────┐ ┌────┐                 │
│  │Img4│ │Img5│ │Img6│                 │
│  └────┘ └────┘ └────┘                 │
└─────────────────────────────────────────┘
```

### Visual Features (Masonry Layout)
```
┌─────────────────────────────────────────┐
│  ┌────┐ ┌────┐ ┌────┐                 │
│  │    │ │Img2│ │    │                 │
│  │Img1│ └────┘ │Img3│                 │
│  │    │ ┌────┐ │    │                 │
│  └────┘ │Img4│ └────┘                 │
│  ┌────┐ └────┘ ┌────┐                 │
│  │Img5│        │Img6│                 │
│  └────┘        └────┘                 │
└─────────────────────────────────────────┘
```

### Props Configuration
- `heading` - Gallery heading
- `subheading` - Gallery tagline
- `images` - Array of images
- `layout` - 'grid' | 'masonry'
- `backgroundColor` - Background
- `columns` - 2 | 3 | 4

### Gallery Image Object
```tsx
{
  id: string;
  url: string;
  alt: string;
  caption?: string;
}
```

### Special Features
- Grid or masonry layouts
- Hover zoom effect
- Caption overlay on hover
- Configurable columns
- Responsive image sizing
- Staggered load animations

---

## 6️⃣ TestimonialsSectionPreview

### Visual Features (Grid Layout)
```
┌─────────────────────────────────────────┐
│         HEADING                         │
│         Subheading                      │
│                                         │
│  ┌─────┐  ┌─────┐  ┌─────┐            │
│  │⭐⭐⭐⭐⭐│  │⭐⭐⭐⭐⭐│  │⭐⭐⭐⭐⭐│            │
│  │Quote1│  │Quote2│  │Quote3│            │
│  │[Img]│  │[Img]│  │[Img]│            │
│  │Name │  │Name │  │Name │            │
│  └─────┘  └─────┘  └─────┘            │
└─────────────────────────────────────────┘
```

### Props Configuration
- `heading` - Section heading
- `subheading` - Section tagline
- `testimonials` - Array of reviews
- `backgroundColor` - Background
- `layout` - 'carousel' | 'grid'

### Testimonial Object
```tsx
{
  id: string;
  name: string;
  photo: string;
  rating: number;      // 1-5
  review: string;
  position?: string;
}
```

### Special Features
- Star ratings (filled/empty)
- Customer photos or initials
- Grid or carousel layout
- Review text formatting
- Card shadow effects
- Professional typography

---

## 7️⃣ OffersSectionPreview

### Visual Features
```
┌─────────────────────────────────────────┐
│         HEADING                         │
│         Subheading                      │
│                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐│
│  │  [30%]  │  │  [50%]  │  │  [20%]  ││
│  │  Image  │  │  Image  │  │  Image  ││
│  │         │  │         │  │         ││
│  │ Title   │  │ Title   │  │ Title   ││
│  │ Desc    │  │ Desc    │  │ Desc    ││
│  │📅 Valid │  │📅 Valid │  │📅 Valid ││
│  └─────────┘  └─────────┘  └─────────┘│
└─────────────────────────────────────────┘
```

### Props Configuration
- `heading` - Offers heading
- `subheading` - Offers tagline
- `offers` - Array of offers
- `backgroundColor` - Background

### Offer Object
```tsx
{
  id: string;
  title: string;
  description: string;
  image: string;
  discount?: string;
  validUntil?: string;
}
```

### Special Features
- Discount badge (top-right)
- Image hover zoom
- Valid until date
- Calendar icon
- Card shadow effects
- 3-column grid

---

## 8️⃣ CTASectionPreview

### Visual Features
```
┌─────────────────────────────────────────┐
│  [Full-width Background Image]         │
│                                         │
│                                         │
│      LARGE COMPELLING HEADLINE          │
│      Supporting description text        │
│                                         │
│         [ Call to Action → ]            │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

### Props Configuration
- `heading` - CTA headline
- `description` - Supporting text
- `ctaText` - Button text
- `ctaLink` - Button link
- `backgroundImage` - Background URL
- `backgroundColor` - Fallback color
- `textColor` - Text color

### Special Features
- Full-width design
- Background image support
- Gradient overlay
- Decorative blur elements
- Arrow icon on button
- Button hover effect
- Centered content

---

## 9️⃣ FooterSectionPreview

### Visual Features
```
┌─────────────────────────────────────────┐
│  Business Name    Contact        Hours  │
│  Tagline          📍 Address     Mon-Fri│
│  [Social Icons]   📞 Phone       9-6    │
│                   ✉️  Email      Sat    │
│                                  10-4   │
│  ─────────────────────────────────────  │
│     © 2025 Business. All rights reserved│
└─────────────────────────────────────────┘
```

### Props Configuration
- `businessName` - Company name
- `tagline` - Company tagline
- `address` - Physical address
- `phone` - Contact phone
- `email` - Contact email
- `socialLinks` - Social media array
- `backgroundColor` - Footer background
- `textColor` - Text color

### Social Link Object
```tsx
{
  id: string;
  platform: string;  // 'facebook', 'twitter', etc.
  url: string;
  icon: string;
}
```

### Special Features
- 3-column layout
- Contact icons
- Social media buttons
- Business hours
- Copyright notice
- Responsive stacking
- Icon mapping

---

## 🔟 FloatingWhatsAppPreview

### Visual Features
```
┌─────────────────────────────────────────┐
│                                         │
│  [Preview Placeholder]                  │
│  Shows position indicator               │
│                                         │
│                            [💬]←Floating│
│                              Pulse       │
└─────────────────────────────────────────┘
```

### Props Configuration
- `phoneNumber` - WhatsApp number
- `message` - Pre-filled message
- `position` - 'bottom-right' | 'bottom-left'

### Special Features
- Fixed positioning
- Pulse animation
- Green WhatsApp color
- Tooltip on hover
- Preview placeholder
- Direct wa.me link
- Position indicator

---

## 🎯 Common Patterns

### Empty States
All components with arrays show helpful empty states:
```
┌─────────────────────┐
│        🎨           │
│                     │
│   No items added    │
│   Add items in      │
│   properties panel  │
│                     │
└─────────────────────┘
```

### Image Placeholders
When images are missing:
```
┌─────────────────────┐
│                     │
│        🖼️           │
│    Image Name       │
│                     │
└─────────────────────┘
```

### Loading States
Entrance animations for all components:
- Fade in (opacity 0 → 1)
- Slide up (y: 20 → 0)
- Duration: 0.6s
- Easing: ease-out

---

## 🔧 Customization Options

### Colors
All components support custom colors:
- Background colors
- Text colors
- Border colors
- Accent colors

### Layout
Configurable layouts:
- Grid columns (2, 3, 4)
- Image positions (left, right)
- Layout types (grid, masonry, carousel)

### Content
All content is customizable:
- Text (heading, description, etc.)
- Images (URLs)
- Icons (emoji or SVG)
- Links (URLs)

### Animations
Control animation behavior:
- Entrance delays
- Stagger timing
- Hover effects
- Transition durations

---

## 📊 Performance Features

### Optimizations
- CSS transitions over JS
- Efficient re-rendering
- Lazy animations
- Optimized images
- Memoized components (where applicable)

### Targets
- 60fps animations
- < 1.5s first paint
- < 100ms interaction response
- Minimal memory usage

---

## ♿ Accessibility Features

### Semantic HTML
- Proper heading hierarchy
- Semantic elements (header, footer, nav)
- Descriptive alt text
- ARIA labels where needed

### Keyboard Support
- Tab navigation
- Enter/Space selection
- Escape to deselect
- Focus indicators

### Visual
- Color contrast compliant
- Focus visible
- Touch targets (44x44px min)
- Readable font sizes

---

## 🎨 Design System

### Typography
- Headings: 2xl - 5xl
- Body: base - lg
- Small: sm - xs
- Font weight: 400 - 700

### Spacing
- Padding: 4, 6, 8, 12, 16
- Margins: 2, 4, 6, 8, 12
- Gaps: 2, 3, 4, 6, 8

### Colors
- Primary: Blue (400-600)
- Success: Green (500-600)
- Warning: Yellow (400-600)
- Error: Red (500-600)
- Neutral: Gray (100-900)

### Shadows
- sm: Small cards
- md: Default cards
- lg: Hover states
- xl: Prominent elements

---

## 🚀 Quick Reference

| Component | Lines | Main Feature | Grid Support |
|-----------|-------|--------------|--------------|
| Hero | 113 | Background images | N/A |
| About | 109 | Image positioning | 2-col |
| Services | 121 | Icon cards | 2/3/4-col |
| Menu | 164 | Category filter | 2-col |
| Gallery | 136 | Masonry layout | 2/3/4-col |
| Testimonials | 162 | Star ratings | 3-col |
| Offers | 143 | Discount badges | 3-col |
| CTA | 110 | Full-width | N/A |
| Footer | 172 | Social links | 3-col |
| WhatsApp | 107 | Pulse animation | N/A |

**Total: 1,437 lines of component code**

---

This reference guide covers all visual and functional features of every preview component!

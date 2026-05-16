# Preview Components - Master Index

Complete reference to all files in the Preview Components system.

## Quick Navigation

- [Quick Start](#quick-start) - Get started in 5 minutes
- [Components](#components) - All 10 preview components
- [Documentation](#documentation) - Guides and references
- [Utilities](#utilities) - Helper functions
- [Integration](#integration) - How to integrate

---

## Quick Start

**File:** `QUICK_START.md` (6.5 KB)

5-minute guide to integrate the preview system. Includes:
- Step-by-step instructions
- Code examples
- Complete CanvasArea.tsx example
- Troubleshooting tips

**Start here if:** You want to get the system working ASAP

---

## Components

All preview components render real, interactive content.

### 1. HeroSectionPreview
**File:** `HeroSectionPreview.tsx` (3.2 KB, 113 lines)

Full-screen hero section with background images, overlays, and CTA.

**Features:**
- Background image support
- Customizable overlay opacity
- Responsive text sizing
- Gradient effects
- CTA button with hover

**Props:** HeroSectionProps
- heading, subheading, ctaText, ctaLink
- backgroundImage, backgroundColor, textColor
- overlayOpacity

---

### 2. AboutSectionPreview
**File:** `AboutSectionPreview.tsx` (3.4 KB, 109 lines)

About section with image and text in configurable layout.

**Features:**
- Image position (left/right)
- Responsive grid layout
- Image placeholder
- Shadow effects
- Smooth animations

**Props:** AboutSectionProps
- heading, description, image
- imagePosition ('left' | 'right')
- backgroundColor

---

### 3. ServicesSectionPreview
**File:** `ServicesSectionPreview.tsx` (3.7 KB, 121 lines)

Services grid with cards, icons, and descriptions.

**Features:**
- Configurable columns (2/3/4)
- Service cards with icons
- Hover shadow effects
- Staggered animations
- Empty state

**Props:** ServicesSectionProps
- heading, subheading, services[]
- backgroundColor, columns

---

### 4. MenuSectionPreview
**File:** `MenuSectionPreview.tsx` (5.6 KB, 164 lines)

Restaurant menu with category filtering.

**Features:**
- Category filter tabs
- Menu items with images
- Prices and descriptions
- Animated filtering
- 2-column grid

**Props:** MenuSectionProps
- heading, subheading, menuItems[]
- categories[], backgroundColor

---

### 5. GallerySectionPreview
**File:** `GallerySectionPreview.tsx` (4.4 KB, 136 lines)

Image gallery with grid or masonry layout.

**Features:**
- Grid/masonry layouts
- Configurable columns (2/3/4)
- Hover zoom effect
- Caption overlay
- Staggered load

**Props:** GallerySectionProps
- heading, subheading, images[]
- layout ('grid' | 'masonry')
- backgroundColor, columns

---

### 6. TestimonialsSectionPreview
**File:** `TestimonialsSectionPreview.tsx` (5.2 KB, 162 lines)

Customer testimonials with ratings.

**Features:**
- Star ratings (1-5)
- Customer photos/avatars
- Grid/carousel layout
- Review cards
- Shadow effects

**Props:** TestimonialsSectionProps
- heading, subheading, testimonials[]
- backgroundColor, layout

---

### 7. OffersSectionPreview
**File:** `OffersSectionPreview.tsx` (5.0 KB, 143 lines)

Special offers with discount badges.

**Features:**
- Offer cards with images
- Discount badges (top-right)
- Valid until dates
- Hover zoom effect
- 3-column grid

**Props:** OffersSectionProps
- heading, subheading, offers[]
- backgroundColor

---

### 8. CTASectionPreview
**File:** `CTASectionPreview.tsx` (3.6 KB, 110 lines)

Full-width call-to-action section.

**Features:**
- Full-width design
- Background images
- Gradient overlays
- Decorative blur elements
- CTA button with arrow

**Props:** CTASectionProps
- heading, description, ctaText, ctaLink
- backgroundImage, backgroundColor, textColor

---

### 9. FooterSectionPreview
**File:** `FooterSectionPreview.tsx` (5.8 KB, 172 lines)

Professional footer with business info.

**Features:**
- 3-column layout
- Contact details with icons
- Social media links
- Business hours
- Copyright notice

**Props:** FooterSectionProps
- businessName, tagline, address, phone, email
- socialLinks[], backgroundColor, textColor

---

### 10. FloatingWhatsAppPreview
**File:** `FloatingWhatsAppPreview.tsx` (3.6 KB, 107 lines)

Floating WhatsApp button with pulse animation.

**Features:**
- Fixed positioning
- Pulse animation
- Green WhatsApp color
- Tooltip on hover
- Preview placeholder

**Props:** FloatingWhatsAppProps
- phoneNumber, message
- position ('bottom-right' | 'bottom-left')

---

## Documentation

### README.md
**Size:** 11 KB

Main documentation covering:
- Component overview
- Detailed prop descriptions
- Usage examples
- Integration with Canvas
- Features and benefits
- Styling system
- Best practices
- Type safety
- Performance
- Accessibility
- Browser support
- Troubleshooting

**Read this for:** Complete understanding of the system

---

### INTEGRATION_GUIDE.md
**Size:** 11 KB

Step-by-step integration guide:
- Before/after code examples
- Complete CanvasArea.tsx code
- Builder store updates
- Testing steps
- Troubleshooting
- Advanced customization

**Read this for:** Detailed integration instructions

---

### TESTING.md
**Size:** 12 KB

Comprehensive testing guide:
- Testing checklists for each component
- Sample test data
- Manual testing steps
- Automated test examples
- Unit test examples
- Integration test examples
- Visual regression testing
- Storybook examples
- Browser testing
- Accessibility testing
- Performance metrics
- Common issues & solutions

**Read this for:** Testing and quality assurance

---

### COMPONENT_FEATURES.md
**Size:** 19 KB

Visual feature reference:
- Universal features
- Component-by-component breakdown
- Visual diagrams
- Props configuration
- Special features
- Common patterns
- Customization options
- Performance features
- Accessibility features
- Design system
- Quick reference table

**Read this for:** Visual feature overview

---

### QUICK_START.md
**Size:** 6.5 KB

5-minute quick start:
- 4 simple steps
- Code snippets
- Complete example
- Troubleshooting
- What you get
- Next steps

**Read this for:** Fast integration

---

## Utilities

### previewHelpers.ts
**Size:** 8.2 KB (320 lines)

Utility functions library with 25+ helpers:

**Image Utilities:**
- `getPlaceholderImage()` - Generate placeholder images
- `isValidImageUrl()` - Validate image URLs

**Text Utilities:**
- `truncateText()` - Truncate with ellipsis
- `getInitials()` - Get initials from name

**WhatsApp Utilities:**
- `formatWhatsAppNumber()` - Clean phone numbers
- `getWhatsAppLink()` - Generate WhatsApp URLs

**Color Utilities:**
- `getColorBrightness()` - Check if color is light/dark
- `getContrastingTextColor()` - Get contrasting text color
- `getGradientFromString()` - Generate gradient from string

**Formatting Utilities:**
- `formatDate()` - Format dates
- `formatPrice()` - Format prices
- `formatFileSize()` - Format file sizes

**General Utilities:**
- `debounce()` - Debounce functions
- `clamp()` - Clamp numbers
- `generateId()` - Generate unique IDs
- `safeJsonParse()` - Safe JSON parsing
- `getNestedProperty()` - Get nested properties
- `calculateReadingTime()` - Calculate reading time
- `isValidUrl()` - Validate URLs
- `copyToClipboard()` - Copy to clipboard
- `isBrowser()` - Check browser environment

---

## Integration

### index.ts
**Size:** 1.9 KB (37 lines)

Barrel exports and component mapping:

```tsx
// Named exports for all components
export { HeroSectionPreview } from './HeroSectionPreview';
export { AboutSectionPreview } from './AboutSectionPreview';
// ... etc

// Component map for dynamic rendering
export const PreviewComponentMap: Record<ComponentType, React.FC<any>> = {
  HeroSection: HeroSectionPreview,
  AboutSection: AboutSectionPreview,
  // ... etc
};
```

**Use this for:**
- Importing components
- Dynamic component rendering
- Type-safe component lookup

---

## Summary Files

### PREVIEW_COMPONENTS_SUMMARY.md
**Location:** `builder-app/PREVIEW_COMPONENTS_SUMMARY.md`
**Size:** 9.7 KB

High-level project summary:
- What was created
- Key features
- How to use
- Architecture
- Benefits
- File statistics
- Success metrics

**Read this for:** Executive summary

---

## Statistics

### Files Created
- **Components:** 10 (.tsx files)
- **Documentation:** 6 (.md files)
- **Utilities:** 1 (.ts file)
- **Index/Export:** 1 (.ts file)
- **Summary:** 1 (.md file in root)
- **Total:** 18 files

### Code Statistics
- **Component Code:** 1,437 lines
- **Utility Code:** 320 lines
- **Total TypeScript:** 1,757 lines
- **Documentation:** ~40,000 words

### File Sizes
- **Components Directory:** 144 KB
- **Individual Components:** 3-6 KB each
- **Documentation:** 6-19 KB each
- **Utilities:** 8.2 KB

---

## File Structure

```
builder-app/
├── src/
│   └── components/
│       └── PreviewComponents/
│           ├── HeroSectionPreview.tsx          (3.2 KB)
│           ├── AboutSectionPreview.tsx         (3.4 KB)
│           ├── ServicesSectionPreview.tsx      (3.7 KB)
│           ├── MenuSectionPreview.tsx          (5.6 KB)
│           ├── GallerySectionPreview.tsx       (4.4 KB)
│           ├── TestimonialsSectionPreview.tsx  (5.2 KB)
│           ├── OffersSectionPreview.tsx        (5.0 KB)
│           ├── CTASectionPreview.tsx           (3.6 KB)
│           ├── FooterSectionPreview.tsx        (5.8 KB)
│           ├── FloatingWhatsAppPreview.tsx     (3.6 KB)
│           ├── index.ts                         (1.9 KB)
│           ├── previewHelpers.ts                (8.2 KB)
│           ├── README.md                        (11 KB)
│           ├── INTEGRATION_GUIDE.md             (11 KB)
│           ├── TESTING.md                       (12 KB)
│           ├── COMPONENT_FEATURES.md            (19 KB)
│           ├── QUICK_START.md                   (6.5 KB)
│           └── INDEX.md (this file)             (8.0 KB)
│
└── PREVIEW_COMPONENTS_SUMMARY.md                (9.7 KB)
```

---

## Recommended Reading Order

### For Developers (First Time)
1. `QUICK_START.md` - Get it working (5 min)
2. `README.md` - Understand the system (15 min)
3. `COMPONENT_FEATURES.md` - Learn features (10 min)
4. Component files - Read source code (30 min)

### For Integration
1. `INTEGRATION_GUIDE.md` - Step-by-step (10 min)
2. `TESTING.md` - Verify it works (20 min)
3. `QUICK_START.md` - Quick reference (ongoing)

### For Testing
1. `TESTING.md` - Full testing guide
2. `COMPONENT_FEATURES.md` - Feature checklist
3. Component files - Implementation details

### For Reference
1. `COMPONENT_FEATURES.md` - Feature lookup
2. `previewHelpers.ts` - Utility functions
3. `README.md` - Complete reference

---

## Support

### Having Issues?

1. Check `QUICK_START.md` troubleshooting section
2. Review `INTEGRATION_GUIDE.md` for integration issues
3. Consult `TESTING.md` for testing problems
4. Read component source code for implementation details

### Want to Extend?

1. Review existing component structure
2. Follow the pattern in `README.md`
3. Use `previewHelpers.ts` utilities
4. Add to `PreviewComponentMap` in `index.ts`

### Contributing?

1. Follow existing component patterns
2. Include all required features (selection, hover, etc.)
3. Write comprehensive prop types
4. Add documentation
5. Test thoroughly

---

## Version Information

- **Created:** December 11, 2025
- **Status:** Production Ready
- **Version:** 1.0.0
- **Components:** 10
- **Documentation:** Complete
- **Tests:** Guides provided

---

## License

Part of the Builder App project.

---

**Need help?** Start with `QUICK_START.md` or `README.md`

**Want details?** Check `COMPONENT_FEATURES.md`

**Ready to integrate?** Follow `INTEGRATION_GUIDE.md`

**Testing?** Use `TESTING.md`

**Summary?** Read `PREVIEW_COMPONENTS_SUMMARY.md` in project root

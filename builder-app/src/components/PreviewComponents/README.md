# Preview Components

Professional visual preview components for the page builder. These components render real, interactive content instead of placeholder boxes, giving users an accurate preview of their website as they build it.

## Overview

This directory contains 10 fully-functional preview components that match the design and functionality of the final client-facing components. Each preview component includes:

- Real content rendering from props
- Selection states with visual indicators
- Hover states with dotted outlines
- Edit hints for better UX
- Responsive design
- Smooth animations with Framer Motion
- Professional styling with Tailwind CSS

## Components

### 1. HeroSectionPreview

**File:** `HeroSectionPreview.tsx`

Renders a full hero section with:
- Background image support
- Customizable overlay opacity
- Heading, subheading, and CTA button
- Gradient overlays
- Responsive text sizing

**Props:** `HeroSectionProps`
- `heading` - Main headline text
- `subheading` - Supporting text
- `ctaText` - Call-to-action button text
- `ctaLink` - Button link
- `backgroundImage` - Hero background image URL
- `backgroundColor` - Fallback background color
- `textColor` - Text color
- `overlayOpacity` - Overlay darkness (0-1)

### 2. AboutSectionPreview

**File:** `AboutSectionPreview.tsx`

Renders an about section with:
- Image positioning (left/right)
- Text content area
- Responsive grid layout
- Smooth entrance animations

**Props:** `AboutSectionProps`
- `heading` - Section heading
- `description` - About text content
- `image` - About image URL
- `imagePosition` - 'left' | 'right'
- `backgroundColor` - Section background color

### 3. ServicesSectionPreview

**File:** `ServicesSectionPreview.tsx`

Renders a services grid with:
- Configurable columns (2, 3, or 4)
- Service cards with icons
- Hover effects on cards
- Staggered animations

**Props:** `ServicesSectionProps`
- `heading` - Section heading
- `subheading` - Section subheading
- `services` - Array of service objects
- `backgroundColor` - Section background color
- `columns` - Number of columns (2 | 3 | 4)

### 4. MenuSectionPreview

**File:** `MenuSectionPreview.tsx`

Renders a restaurant menu with:
- Category filtering tabs
- Menu item cards with images
- Prices and descriptions
- Animated filtering transitions

**Props:** `MenuSectionProps`
- `heading` - Section heading
- `subheading` - Section subheading
- `menuItems` - Array of menu items
- `categories` - Available categories
- `backgroundColor` - Section background color

### 5. GallerySectionPreview

**File:** `GallerySectionPreview.tsx`

Renders an image gallery with:
- Grid or masonry layout
- Configurable columns
- Image hover overlays
- Caption support
- Zoom hover effect

**Props:** `GallerySectionProps`
- `heading` - Section heading
- `subheading` - Section subheading
- `images` - Array of gallery images
- `layout` - 'grid' | 'masonry'
- `backgroundColor` - Section background color
- `columns` - Number of columns (2 | 3 | 4)

### 6. TestimonialsSectionPreview

**File:** `TestimonialsSectionPreview.tsx`

Renders customer testimonials with:
- Star ratings (1-5 stars)
- Customer photos or avatars
- Grid or carousel layout
- Review text and customer info

**Props:** `TestimonialsSectionProps`
- `heading` - Section heading
- `subheading` - Section subheading
- `testimonials` - Array of testimonials
- `backgroundColor` - Section background color
- `layout` - 'carousel' | 'grid'

### 7. OffersSectionPreview

**File:** `OffersSectionPreview.tsx`

Renders special offers with:
- Offer cards with images
- Discount badges
- Valid until dates
- Hover zoom effects

**Props:** `OffersSectionProps`
- `heading` - Section heading
- `subheading` - Section subheading
- `offers` - Array of offers
- `backgroundColor` - Section background color

### 8. CTASectionPreview

**File:** `CTASectionPreview.tsx`

Renders a call-to-action section with:
- Full-width design
- Background image support
- Gradient overlays
- Prominent CTA button
- Decorative blur elements

**Props:** `CTASectionProps`
- `heading` - CTA heading
- `description` - CTA description
- `ctaText` - Button text
- `ctaLink` - Button link
- `backgroundImage` - Background image URL
- `backgroundColor` - Fallback background color
- `textColor` - Text color

### 9. FooterSectionPreview

**File:** `FooterSectionPreview.tsx`

Renders a professional footer with:
- Business information
- Contact details with icons
- Social media links
- Business hours
- Copyright notice

**Props:** `FooterSectionProps`
- `businessName` - Company name
- `tagline` - Company tagline
- `address` - Physical address
- `phone` - Contact phone
- `email` - Contact email
- `socialLinks` - Array of social media links
- `backgroundColor` - Footer background color
- `textColor` - Footer text color

### 10. FloatingWhatsAppPreview

**File:** `FloatingWhatsAppPreview.tsx`

Renders a floating WhatsApp button with:
- Fixed positioning (bottom-right/left)
- Pulse animation effect
- Hover tooltip
- Direct WhatsApp link

**Props:** `FloatingWhatsAppProps`
- `phoneNumber` - WhatsApp phone number
- `message` - Pre-filled message
- `position` - 'bottom-right' | 'bottom-left'

## Usage

### Basic Usage

```tsx
import { HeroSectionPreview } from '@/components/PreviewComponents';

function MyComponent() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <HeroSectionPreview
      id="hero-1"
      props={{
        heading: "Welcome to Our Business",
        subheading: "We create amazing experiences",
        ctaText: "Get Started",
        ctaLink: "#contact",
        backgroundImage: "/hero.jpg",
        backgroundColor: "#1e293b",
        textColor: "#ffffff",
        overlayOpacity: 0.5
      }}
      isSelected={selectedId === "hero-1"}
      onSelect={() => setSelectedId("hero-1")}
    />
  );
}
```

### Using the Component Map

```tsx
import { PreviewComponentMap } from '@/components/PreviewComponents';
import type { PageSection } from '@/types/component.types';

function DynamicPreview({ section }: { section: PageSection }) {
  const PreviewComponent = PreviewComponentMap[section.type];

  return (
    <PreviewComponent
      id={section.id}
      props={section.props}
      isSelected={isSelected}
      onSelect={handleSelect}
    />
  );
}
```

### Integration with Canvas

```tsx
import { PreviewComponentMap } from '@/components/PreviewComponents';
import { useBuilderStore } from '@/store/builderStore';

function CanvasArea() {
  const { config, selectedSectionId, setSelectedSection } = useBuilderStore();

  return (
    <div className="canvas">
      {config.sections.map((section) => {
        const PreviewComponent = PreviewComponentMap[section.type];

        return (
          <PreviewComponent
            key={section.id}
            id={section.id}
            props={section.props}
            isSelected={selectedSectionId === section.id}
            onSelect={() => setSelectedSection(section.id)}
          />
        );
      })}
    </div>
  );
}
```

## Features

### Selection State

When a component is selected:
- Blue ring border (4px) with offset
- Edit hint badge in top-right corner
- Prevents multiple selections

### Hover State

When hovering over a component:
- Dashed blue border outline
- Smooth opacity transition
- Non-intrusive pointer events

### Animations

All components use Framer Motion for:
- Entrance animations (fade + slide)
- Staggered child animations
- Layout animations
- Smooth state transitions

### Responsive Design

All components are fully responsive:
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Flexible grid layouts
- Responsive typography

### Empty States

When no content is provided:
- Helpful placeholder message
- Visual icon representation
- Instructions to add content
- Dashed border styling

## Styling

All components use:
- **Tailwind CSS** for styling
- **cn()** utility for class merging
- Consistent spacing and sizing
- Professional color schemes
- Accessibility-friendly contrasts

## Best Practices

1. **Always pass all required props** - Components have defaults but work best with complete data
2. **Use unique IDs** - Ensure each component has a unique ID for selection
3. **Handle selection state** - Properly manage selectedSectionId in parent
4. **Test with empty data** - Components gracefully handle missing content
5. **Optimize images** - Use appropriate image sizes for performance

## Type Safety

All components are fully typed with TypeScript:
- Props interfaces from `@/types/component.types`
- Strict null checks
- Type-safe event handlers
- Proper React.FC typing

## Performance

Optimizations included:
- Lazy animations with delays
- Efficient re-rendering
- CSS transitions over JS animations
- Optimized image loading
- Memoized child components (where applicable)

## Accessibility

Accessibility features:
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus states
- Color contrast compliance

## Browser Support

Tested and working on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Component not rendering

- Check that props match the expected interface
- Verify the component type exists in PreviewComponentMap
- Ensure imports are correct

### Selection not working

- Verify onSelect callback is properly passed
- Check that isSelected prop is updated
- Ensure click events aren't stopped by parent elements

### Animations not smooth

- Check for conflicting CSS transitions
- Verify Framer Motion is properly installed
- Reduce animation delays if needed

## Future Enhancements

Potential improvements:
- Real-time collaborative editing indicators
- Component performance metrics
- A/B testing variants
- Advanced animation options
- Theme preview modes
- Accessibility audit tools

## Contributing

When adding new preview components:
1. Follow the existing component structure
2. Include selection and hover states
3. Add comprehensive prop types
4. Write responsive styles
5. Include empty states
6. Add to PreviewComponentMap
7. Update this README

## License

Part of the Builder App project. See main project README for license details.

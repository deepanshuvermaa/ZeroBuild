# Testing Guide for Preview Components

This guide helps you test all preview components to ensure they work correctly.

## Quick Test Checklist

Use this checklist to verify each component:

### 1. HeroSectionPreview
- [ ] Background image displays correctly
- [ ] Overlay opacity works
- [ ] Text colors apply properly
- [ ] CTA button renders
- [ ] Selection border appears on click
- [ ] Hover dotted border shows
- [ ] Edit hint badge appears when selected
- [ ] Responsive on mobile/tablet

### 2. AboutSectionPreview
- [ ] Image displays on correct side (left/right)
- [ ] Text content renders properly
- [ ] Layout switches correctly
- [ ] Placeholder shows when no image
- [ ] Selection state works
- [ ] Hover state works

### 3. ServicesSectionPreview
- [ ] Services grid displays correctly
- [ ] Column count changes (2/3/4)
- [ ] Service icons render
- [ ] Cards have proper spacing
- [ ] Hover effects work on cards
- [ ] Empty state shows when no services
- [ ] Staggered animations work

### 4. MenuSectionPreview
- [ ] Category tabs render
- [ ] Clicking tabs filters items
- [ ] Menu items display with images
- [ ] Prices show correctly
- [ ] Filter animation works
- [ ] Empty state shows when no items

### 5. GallerySectionPreview
- [ ] Images display in grid
- [ ] Column count changes (2/3/4)
- [ ] Masonry layout works
- [ ] Hover overlay appears
- [ ] Captions display
- [ ] Zoom effect works on hover

### 6. TestimonialsSectionPreview
- [ ] Testimonial cards render
- [ ] Star ratings display correctly (1-5)
- [ ] Customer photos show
- [ ] Fallback avatars work (initials)
- [ ] Grid/carousel layout switches
- [ ] Review text displays properly

### 7. OffersSectionPreview
- [ ] Offer cards display
- [ ] Discount badges show
- [ ] Valid until dates render
- [ ] Images display correctly
- [ ] Hover zoom effect works
- [ ] Empty state shows

### 8. CTASectionPreview
- [ ] Background image displays
- [ ] Gradient overlay works
- [ ] Text colors apply
- [ ] CTA button renders with arrow
- [ ] Decorative blur elements show
- [ ] Full-width layout works

### 9. FooterSectionPreview
- [ ] Business info displays
- [ ] Contact details with icons show
- [ ] Social links render with icons
- [ ] Business hours display
- [ ] Copyright notice shows
- [ ] Background/text colors work

### 10. FloatingWhatsAppPreview
- [ ] Preview placeholder shows
- [ ] Position indicator displays
- [ ] WhatsApp button appears (fixed position)
- [ ] Pulse animation works
- [ ] Tooltip shows on hover
- [ ] Link is correct (wa.me)

## Test Data

### Sample Hero Section Data

```tsx
const heroData: HeroSectionProps = {
  heading: "Welcome to Paradise Resort",
  subheading: "Experience luxury like never before",
  ctaText: "Book Now",
  ctaLink: "#booking",
  backgroundImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  backgroundColor: "#1e293b",
  textColor: "#ffffff",
  overlayOpacity: 0.4
};
```

### Sample Services Data

```tsx
const servicesData: ServicesSectionProps = {
  heading: "Our Services",
  subheading: "What we offer",
  backgroundColor: "#f8fafc",
  columns: 3,
  services: [
    {
      id: "1",
      icon: "🏊",
      title: "Swimming Pool",
      description: "Olympic-sized pool with stunning ocean views"
    },
    {
      id: "2",
      icon: "🍽️",
      title: "Fine Dining",
      description: "World-class cuisine from award-winning chefs"
    },
    {
      id: "3",
      icon: "💆",
      title: "Spa & Wellness",
      description: "Rejuvenate with our premium spa treatments"
    }
  ]
};
```

### Sample Menu Data

```tsx
const menuData: MenuSectionProps = {
  heading: "Our Menu",
  subheading: "Delicious food made with love",
  backgroundColor: "#ffffff",
  categories: ["All", "Appetizers", "Main Course", "Desserts"],
  menuItems: [
    {
      id: "1",
      name: "Caesar Salad",
      description: "Fresh romaine with parmesan and croutons",
      price: "$12.99",
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1",
      category: "Appetizers"
    },
    {
      id: "2",
      name: "Grilled Salmon",
      description: "Fresh Atlantic salmon with herbs",
      price: "$24.99",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
      category: "Main Course"
    }
  ]
};
```

### Sample Testimonials Data

```tsx
const testimonialsData: TestimonialsSectionProps = {
  heading: "Customer Reviews",
  subheading: "What our guests say",
  backgroundColor: "#f8fafc",
  layout: "grid",
  testimonials: [
    {
      id: "1",
      name: "John Smith",
      photo: "https://i.pravatar.cc/150?img=1",
      rating: 5,
      review: "Amazing experience! The service was exceptional and the facilities were world-class.",
      position: "Business Traveler"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      photo: "",
      rating: 5,
      review: "Best vacation ever! Highly recommend to anyone looking for a luxury getaway.",
      position: "Honeymooner"
    }
  ]
};
```

## Manual Testing Steps

### 1. Component Rendering Test

```tsx
import { HeroSectionPreview } from '@/components/PreviewComponents';

function TestPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="p-8">
      <HeroSectionPreview
        id="test-hero"
        props={heroData}
        isSelected={selected === "test-hero"}
        onSelect={() => setSelected("test-hero")}
      />
    </div>
  );
}
```

### 2. Selection State Test

1. Click on a component
2. Verify blue ring border appears
3. Verify edit hint badge shows in top-right
4. Click another component
5. Verify selection moves to new component

### 3. Hover State Test

1. Hover over a component (without clicking)
2. Verify dotted blue border appears
3. Move mouse away
4. Verify border disappears

### 4. Props Update Test

1. Select a component
2. Change a prop in the properties panel
3. Verify component updates immediately
4. Verify no console errors

### 5. Animation Test

1. Add a new component to canvas
2. Verify entrance animation plays
3. Remove a component
4. Verify exit animation plays

### 6. Responsive Test

1. Switch preview mode to tablet
2. Verify component adapts to tablet width
3. Switch to mobile
4. Verify component adapts to mobile width
5. Switch back to desktop

### 7. Empty State Test

For components with arrays (services, menu, etc.):
1. Provide empty array for the data
2. Verify empty state message shows
3. Verify helpful placeholder displays

### 8. Performance Test

1. Add 10+ components to canvas
2. Verify smooth scrolling
3. Verify no lag when selecting
4. Check browser DevTools for performance issues

## Automated Testing Examples

### Unit Test Example

```tsx
import { render, screen } from '@testing-library/react';
import { HeroSectionPreview } from './HeroSectionPreview';

describe('HeroSectionPreview', () => {
  const mockProps = {
    heading: 'Test Heading',
    subheading: 'Test Subheading',
    ctaText: 'Click Me',
    ctaLink: '#',
    backgroundImage: '',
    backgroundColor: '#000',
    textColor: '#fff',
    overlayOpacity: 0.5
  };

  it('renders heading correctly', () => {
    render(
      <HeroSectionPreview
        id="test"
        props={mockProps}
        isSelected={false}
        onSelect={() => {}}
      />
    );

    expect(screen.getByText('Test Heading')).toBeInTheDocument();
  });

  it('shows selection border when selected', () => {
    const { container } = render(
      <HeroSectionPreview
        id="test"
        props={mockProps}
        isSelected={true}
        onSelect={() => {}}
      />
    );

    expect(container.firstChild).toHaveClass('ring-4');
  });

  it('calls onSelect when clicked', () => {
    const handleSelect = jest.fn();
    const { container } = render(
      <HeroSectionPreview
        id="test"
        props={mockProps}
        isSelected={false}
        onSelect={handleSelect}
      />
    );

    container.firstChild?.click();
    expect(handleSelect).toHaveBeenCalled();
  });
});
```

### Integration Test Example

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { PreviewComponentMap } from './index';

describe('Preview Components Integration', () => {
  it('renders all component types', () => {
    const componentTypes = Object.keys(PreviewComponentMap);

    componentTypes.forEach(type => {
      const Component = PreviewComponentMap[type];
      expect(Component).toBeDefined();
    });
  });

  it('handles selection across multiple components', () => {
    const { rerender } = render(
      <HeroSectionPreview
        id="hero"
        props={heroProps}
        isSelected={true}
        onSelect={() => {}}
      />
    );

    expect(screen.getByText(/click properties panel/i)).toBeInTheDocument();

    rerender(
      <HeroSectionPreview
        id="hero"
        props={heroProps}
        isSelected={false}
        onSelect={() => {}}
      />
    );

    expect(screen.queryByText(/click properties panel/i)).not.toBeInTheDocument();
  });
});
```

## Visual Regression Testing

Use tools like:
- **Percy** - Automated visual testing
- **Chromatic** - Storybook visual testing
- **BackstopJS** - Screenshot comparison

### Storybook Examples

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { HeroSectionPreview } from './HeroSectionPreview';

const meta: Meta<typeof HeroSectionPreview> = {
  title: 'Preview/HeroSection',
  component: HeroSectionPreview,
};

export default meta;
type Story = StoryObj<typeof HeroSectionPreview>;

export const Default: Story = {
  args: {
    id: 'hero-1',
    props: {
      heading: 'Welcome',
      subheading: 'Get started today',
      ctaText: 'Learn More',
      ctaLink: '#',
      backgroundImage: '',
      backgroundColor: '#1e293b',
      textColor: '#ffffff',
      overlayOpacity: 0.5
    },
    isSelected: false,
    onSelect: () => {}
  }
};

export const Selected: Story = {
  args: {
    ...Default.args,
    isSelected: true
  }
};

export const WithBackgroundImage: Story = {
  args: {
    ...Default.args,
    props: {
      ...Default.args.props,
      backgroundImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945'
    }
  }
};
```

## Common Issues & Solutions

### Issue: Component not rendering

**Check:**
- Props are correctly typed
- All required props are provided
- Component is imported correctly
- No TypeScript errors

### Issue: Selection border not showing

**Check:**
- `isSelected` prop is boolean
- CSS classes are applied
- Tailwind ring utilities are available
- No conflicting CSS

### Issue: Animations not working

**Check:**
- Framer Motion is installed
- No conflicting CSS transitions
- AnimatePresence is used correctly
- Motion variants are defined

### Issue: Images not loading

**Check:**
- URLs are valid and accessible
- CORS headers allow loading
- Placeholder fallback is working
- Network tab shows requests

## Browser Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Accessibility Testing

Use tools like:
- **axe DevTools**
- **WAVE**
- **Lighthouse**

Check for:
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Color contrast
- [ ] Focus indicators
- [ ] ARIA labels

## Performance Metrics

Target benchmarks:
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Smooth animations:** 60fps
- **No memory leaks**

## Reporting Issues

When reporting bugs, include:
1. Component name
2. Props used
3. Expected behavior
4. Actual behavior
5. Browser/device info
6. Screenshots/videos
7. Console errors

## Success Criteria

All tests pass when:
- ✅ All components render correctly
- ✅ Selection states work
- ✅ Hover states work
- ✅ Animations are smooth
- ✅ No console errors
- ✅ Responsive on all devices
- ✅ Accessible to all users
- ✅ Performant with many components

Happy Testing!

# Code Snippets Reference

Quick copy-paste snippets for common tasks.

## Import Statements

### Import All Components

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

### Import All Types

```typescript
import type {
  HeroSectionProps,
  AboutSectionProps,
  ServicesSectionProps,
  MenuSectionProps,
  GallerySectionProps,
  TestimonialsSectionProps,
  OffersSectionProps,
  CTASectionProps,
  FooterSectionProps,
  FloatingWhatsAppProps,
  Service,
  MenuItem,
  MenuCategory,
  GalleryImage,
  Testimonial,
  Offer,
  SocialLink
} from './types';
```

## Sample Data Snippets

### HeroSection Data

```typescript
const heroData: HeroSectionProps = {
  backgroundImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  heading: 'Welcome to Our Business',
  subheading: 'Experience excellence with every interaction',
  ctaText: 'Get Started',
  ctaLink: '#services'
};
```

### AboutSection Data

```typescript
const aboutData: AboutSectionProps = {
  image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
  imageAlt: 'About our company',
  heading: 'Our Story',
  description: 'We are passionate about delivering exceptional quality and service to our customers. Our journey began with a simple vision: to make a difference.',
  features: [
    'Over 10 years of experience',
    'Award-winning service',
    'Customer satisfaction guaranteed',
    'Professional team of experts'
  ]
};
```

### ServicesSection Data

```typescript
const servicesData: ServicesSectionProps = {
  heading: 'Our Services',
  subheading: 'What we offer',
  services: [
    {
      id: '1',
      icon: '🎯',
      title: 'Service One',
      description: 'Professional service with attention to detail'
    },
    {
      id: '2',
      icon: '⚡',
      title: 'Service Two',
      description: 'Fast and efficient solutions'
    },
    {
      id: '3',
      icon: '🔧',
      title: 'Service Three',
      description: 'Expert technical support'
    }
  ]
};
```

### MenuSection Data

```typescript
const menuData: MenuSectionProps = {
  heading: 'Menu',
  categories: [
    { id: '1', name: 'All', slug: 'all' },
    { id: '2', name: 'Appetizers', slug: 'appetizers' },
    { id: '3', name: 'Main Courses', slug: 'main' },
    { id: '4', name: 'Desserts', slug: 'desserts' }
  ],
  items: [
    {
      id: '1',
      name: 'Item Name',
      description: 'Delicious item description',
      price: 12.99,
      category: 'appetizers',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1'
    }
  ]
};
```

### GallerySection Data

```typescript
const galleryData: GallerySectionProps = {
  heading: 'Gallery',
  images: [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
      alt: 'Gallery image 1',
      caption: 'Beautiful scene'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
      alt: 'Gallery image 2',
      caption: 'Amazing view'
    }
  ]
};
```

### TestimonialsSection Data

```typescript
const testimonialsData: TestimonialsSectionProps = {
  heading: 'Customer Reviews',
  testimonials: [
    {
      id: '1',
      name: 'John Doe',
      rating: 5,
      comment: 'Excellent service! Highly recommend to everyone.',
      image: 'https://i.pravatar.cc/150?img=1',
      date: 'December 2024'
    },
    {
      id: '2',
      name: 'Jane Smith',
      rating: 5,
      comment: 'Professional and friendly. Will come back again!',
      image: 'https://i.pravatar.cc/150?img=2',
      date: 'December 2024'
    }
  ]
};
```

### OffersSection Data

```typescript
const offersData: OffersSectionProps = {
  heading: 'Special Offers',
  offers: [
    {
      id: '1',
      title: 'Limited Time Offer',
      description: 'Get amazing deals on all our services this month only!',
      discount: '50% OFF',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da',
      validUntil: 'December 31, 2024'
    }
  ]
};
```

### CTASection Data

```typescript
const ctaData: CTASectionProps = {
  heading: 'Ready to Get Started?',
  description: 'Join thousands of satisfied customers today',
  ctaText: 'Contact Us Now',
  ctaLink: '#contact',
  backgroundImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'
};
```

### FooterSection Data

```typescript
const footerData: FooterSectionProps = {
  businessName: 'My Business',
  tagline: 'Excellence in everything we do',
  address: '123 Main Street, City, State 12345',
  phone: '+1 (555) 123-4567',
  email: 'info@mybusiness.com',
  socialLinks: [
    { platform: 'Facebook', url: 'https://facebook.com/yourbusiness', icon: '📘' },
    { platform: 'Instagram', url: 'https://instagram.com/yourbusiness', icon: '📷' },
    { platform: 'Twitter', url: 'https://twitter.com/yourbusiness', icon: '🐦' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/company/yourbusiness', icon: '💼' }
  ],
  copyright: '© 2024 My Business. All rights reserved.'
};
```

### FloatingWhatsApp Data

```typescript
const whatsappData: FloatingWhatsAppProps = {
  phoneNumber: '+15551234567',
  message: 'Hello! I would like to inquire about your services.',
  position: 'right'
};
```

## Component Usage Snippets

### Single Component

```typescript
function HomePage() {
  return (
    <div>
      <HeroSection
        backgroundImage="/images/hero.jpg"
        heading="Welcome"
        subheading="Your journey starts here"
        ctaText="Learn More"
        ctaLink="#about"
      />
    </div>
  );
}
```

### Multiple Components

```typescript
function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection {...heroData} />
      <AboutSection {...aboutData} />
      <ServicesSection {...servicesData} />
      <CTASection {...ctaData} />
      <FooterSection {...footerData} />
      <FloatingWhatsApp {...whatsappData} />
    </div>
  );
}
```

### With State

```typescript
function MenuPage() {
  const [menuData, setMenuData] = useState<MenuSectionProps | null>(null);

  useEffect(() => {
    // Load menu data
    setMenuData({
      heading: 'Our Menu',
      categories: [...],
      items: [...]
    });
  }, []);

  if (!menuData) return <div>Loading...</div>;

  return <MenuSection {...menuData} />;
}
```

### With API Data

```typescript
function TestimonialsPage() {
  const [data, setData] = useState<TestimonialsSectionProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading testimonials:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading testimonials...</div>;
  if (!data) return <div>Failed to load testimonials</div>;

  return <TestimonialsSection {...data} />;
}
```

## Styling Snippets

### Wrapper with Custom Styles

```typescript
<div className="bg-gray-50 py-8">
  <ServicesSection {...servicesData} />
</div>
```

### Custom Section Spacing

```typescript
<div className="space-y-16 md:space-y-24">
  <AboutSection {...aboutData} />
  <ServicesSection {...servicesData} />
  <TestimonialsSection {...testimonialsData} />
</div>
```

### Full Page Layout

```typescript
<div className="min-h-screen flex flex-col">
  <main className="flex-grow">
    <HeroSection {...heroData} />
    <AboutSection {...aboutData} />
    <ServicesSection {...servicesData} />
  </main>
  <FooterSection {...footerData} />
  <FloatingWhatsApp {...whatsappData} />
</div>
```

## Utility Snippets

### Generate Unique IDs

```typescript
// Using crypto (modern browsers)
const id = crypto.randomUUID();

// Using timestamp + random
const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Simple counter
let idCounter = 0;
const id = `item-${++idCounter}`;
```

### Format Phone Number

```typescript
function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Add country code if missing
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
}
```

### Format Price

```typescript
function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}
```

### Validate Email

```typescript
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

## Animation Customization Snippets

### Custom Animation Duration

```typescript
// In component file, change:
transition={{ duration: 0.6 }}

// To:
transition={{ duration: 1.0 }}  // Slower
transition={{ duration: 0.3 }}  // Faster
```

### Custom Stagger Delay

```typescript
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2  // Change this value
    }
  }
};
```

### Add Custom Animation

```typescript
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  {/* Your content */}
</motion.div>
```

## TypeScript Snippets

### Type Guard

```typescript
function isMenuItem(item: unknown): item is MenuItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'name' in item &&
    'price' in item
  );
}
```

### Partial Props

```typescript
// For optional updates
type PartialService = Partial<Service>;

const updates: PartialService = {
  title: 'New Title'  // Only update title
};
```

### Readonly Props

```typescript
// Prevent modifications
type ReadonlyHeroProps = Readonly<HeroSectionProps>;
```

## React Patterns

### Conditional Rendering

```typescript
{services.length > 0 && (
  <ServicesSection {...servicesData} />
)}

{loading ? (
  <div>Loading...</div>
) : (
  <MenuSection {...menuData} />
)}
```

### Map with Components

```typescript
{sections.map((section, index) => (
  <div key={section.id}>
    {section.type === 'about' && <AboutSection {...section.data} />}
    {section.type === 'services' && <ServicesSection {...section.data} />}
  </div>
))}
```

### Error Boundary

```typescript
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <div>Something went wrong</div>;
  }

  return <>{children}</>;
}
```

## Testing Snippets

### Basic Component Test

```typescript
import { render, screen } from '@testing-library/react';
import { HeroSection } from './components';

test('renders hero section', () => {
  render(
    <HeroSection
      backgroundImage="/test.jpg"
      heading="Test Heading"
      subheading="Test Subheading"
      ctaText="Click Me"
      ctaLink="#test"
    />
  );

  expect(screen.getByText('Test Heading')).toBeInTheDocument();
});
```

## Environment Variables

### .env.local Example

```env
VITE_API_URL=https://api.example.com
VITE_WHATSAPP_NUMBER=+15551234567
VITE_BUSINESS_NAME=My Business
VITE_BUSINESS_EMAIL=info@mybusiness.com
```

### Using in Code

```typescript
const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
const apiUrl = import.meta.env.VITE_API_URL;
```

---

Copy and modify these snippets as needed for your project!

import { z } from 'zod';

export const HeroSectionSchema = z.object({
  heading: z.string().min(1, 'Heading is required'),
  subheading: z.string(),
  ctaText: z.string().min(1, 'CTA text is required'),
  ctaLink: z.string().url('Must be a valid URL'),
  backgroundImage: z.string().url('Must be a valid URL').or(z.literal('')),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  textColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  overlayOpacity: z.number().min(0).max(1),
});

export const AboutSectionSchema = z.object({
  heading: z.string().min(1, 'Heading is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().url('Must be a valid URL'),
  imagePosition: z.enum(['left', 'right']),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
});

export const ServiceSchema = z.object({
  id: z.string(),
  icon: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
});

export const ServicesSectionSchema = z.object({
  heading: z.string().min(1, 'Heading is required'),
  subheading: z.string(),
  services: z.array(ServiceSchema),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]),
});

export const MenuItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  price: z.string().min(1, 'Price is required'),
  image: z.string().url('Must be a valid URL'),
  category: z.string(),
});

export const MenuSectionSchema = z.object({
  heading: z.string().min(1, 'Heading is required'),
  subheading: z.string(),
  menuItems: z.array(MenuItemSchema),
  categories: z.array(z.string()),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
});

export const GalleryImageSchema = z.object({
  id: z.string(),
  url: z.string().url('Must be a valid URL'),
  alt: z.string(),
  caption: z.string().optional(),
});

export const GallerySectionSchema = z.object({
  heading: z.string().min(1, 'Heading is required'),
  subheading: z.string(),
  images: z.array(GalleryImageSchema),
  layout: z.enum(['grid', 'masonry']),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]),
});

export const TestimonialSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  photo: z.string().url('Must be a valid URL'),
  rating: z.number().min(1).max(5),
  review: z.string().min(1, 'Review is required'),
  position: z.string().optional(),
});

export const TestimonialsSectionSchema = z.object({
  heading: z.string().min(1, 'Heading is required'),
  subheading: z.string(),
  testimonials: z.array(TestimonialSchema),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  layout: z.enum(['carousel', 'grid']),
});

export const OfferSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  image: z.string().url('Must be a valid URL'),
  discount: z.string().optional(),
  validUntil: z.string().optional(),
});

export const OffersSectionSchema = z.object({
  heading: z.string().min(1, 'Heading is required'),
  subheading: z.string(),
  offers: z.array(OfferSchema),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
});

export const CTASectionSchema = z.object({
  heading: z.string().min(1, 'Heading is required'),
  description: z.string(),
  ctaText: z.string().min(1, 'CTA text is required'),
  ctaLink: z.string().url('Must be a valid URL'),
  backgroundImage: z.string().url('Must be a valid URL').or(z.literal('')),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  textColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
});

export const SocialLinkSchema = z.object({
  id: z.string(),
  platform: z.string(),
  url: z.string().url('Must be a valid URL'),
  icon: z.string(),
});

export const FooterSectionSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  tagline: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string().email('Must be a valid email'),
  socialLinks: z.array(SocialLinkSchema),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  textColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
});

export const FloatingWhatsAppSchema = z.object({
  phoneNumber: z.string().min(1, 'Phone number is required'),
  message: z.string().optional(),
  position: z.enum(['bottom-right', 'bottom-left']),
});

export const PageConfigSchema = z.object({
  metadata: z.object({
    clientName: z.string(),
    projectName: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    version: z.string(),
  }),
  theme: z.object({
    primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i),
    secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i),
    fontFamily: z.string(),
    accentColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  }),
  whatsapp: z.object({
    phoneNumber: z.string(),
    defaultMessage: z.string(),
    enabled: z.boolean(),
  }),
  seo: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
    ogImage: z.string().optional(),
  }),
  sections: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      props: z.any(),
      order: z.number(),
    })
  ),
});

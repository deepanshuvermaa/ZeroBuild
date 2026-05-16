// Type definitions for all client-facing components

export interface HeroSectionProps {
  backgroundImage: string;
  heading: string;
  subheading: string;
  ctaText: string;
  ctaLink: string;
}

export interface AboutSectionProps {
  image: string;
  imageAlt: string;
  heading: string;
  description: string;
  features?: string[];
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface ServicesSectionProps {
  heading: string;
  subheading?: string;
  services: Service[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
}

export interface MenuSectionProps {
  heading: string;
  categories: string[];
  items: MenuItem[];
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

export interface GallerySectionProps {
  heading: string;
  images: GalleryImage[];
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  image?: string;
  date?: string;
}

export interface TestimonialsSectionProps {
  heading: string;
  testimonials: Testimonial[];
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  image?: string;
  validUntil?: string;
}

export interface OffersSectionProps {
  heading: string;
  offers: Offer[];
}

export interface CTASectionProps {
  heading: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface FooterSectionProps {
  businessName: string;
  tagline?: string;
  address?: string;
  phone?: string;
  email?: string;
  socialLinks: SocialLink[];
  copyright?: string;
}

export interface FloatingWhatsAppProps {
  phoneNumber: string;
  message?: string;
  position?: 'left' | 'right';
}

// Page Configuration Types
export interface PageSection {
  id: string;
  type: string;
  props: any;
  order: number;
}

export interface PageMetadata {
  clientName: string;
  projectName: string;
  createdAt: string;
  updatedAt: string;
  version?: string;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  accentColor?: string;
}

export interface WhatsAppConfig {
  phoneNumber: string;
  defaultMessage: string;
  enabled: boolean;
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

export interface PageConfig {
  metadata: PageMetadata;
  theme?: ThemeConfig;
  whatsapp: WhatsAppConfig;
  seo: SEOConfig;
  sections: PageSection[];
}

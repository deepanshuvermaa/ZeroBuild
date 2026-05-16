export type ComponentType =
  | 'HeroSection'
  | 'AboutSection'
  | 'ServicesSection'
  | 'MenuSection'
  | 'GallerySection'
  | 'TestimonialsSection'
  | 'OffersSection'
  | 'CTASection'
  | 'FooterSection'
  | 'FloatingWhatsApp'
  | 'CardSection'
  | 'StatsSection'
  | 'CategorySection'
  | 'ProfileSection'
  | 'PricingSection'
  | 'FAQSection'
  | 'TimelineSection'
  | 'FeatureSection'
  | 'JobBoardSection';

export interface BaseComponentProps {
  id: string;
  type: ComponentType;
}

// Advanced Design System Properties
export interface AdvancedStyleProps {
  // Animation
  hoverEffect?: 'scale' | 'lift' | 'glow' | 'rotate' | 'tilt' | 'none';
  scrollAnimation?: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'zoom' | 'flip' | 'none';
  staggerDelay?: number; // milliseconds between each item animation

  // Visual Style
  cardStyle?: 'flat' | 'elevated' | 'glass' | 'neumorphic' | 'gradient' | 'outline';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  shadowSize?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner';
  borderWidth?: 'none' | 'thin' | 'medium' | 'thick';
  borderColor?: string;

  // Color Palette
  colorScheme?: 'warm' | 'cool' | 'professional' | 'vibrant' | 'pastel' | 'dark' | 'custom';
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: 'to-r' | 'to-br' | 'to-b' | 'to-bl' | 'to-l' | 'to-tr' | 'to-t' | 'to-tl';

  // Interactive
  clickAnimation?: 'ripple' | 'pulse' | 'bounce' | 'shake' | 'none';
  loadingAnimation?: 'spin' | 'pulse' | 'bounce' | 'dots' | 'none';
  buttonStyle?: 'solid' | 'outline' | 'ghost' | 'gradient' | 'glass';
  buttonSize?: 'sm' | 'md' | 'lg' | 'xl';

  // Layout
  spacing?: 'compact' | 'normal' | 'relaxed' | 'loose';
  alignment?: 'left' | 'center' | 'right';
}

// Text styling properties
export interface TextStyleProps {
  headingColor?: string;
  headingSize?: string;
  headingBold?: boolean;
  headingItalic?: boolean;
  headingUnderline?: boolean;
  headingAlign?: 'left' | 'center' | 'right' | 'justify';
  headingFontFamily?: string;

  subheadingColor?: string;
  subheadingSize?: string;
  subheadingBold?: boolean;
  subheadingItalic?: boolean;
  subheadingUnderline?: boolean;
  subheadingAlign?: 'left' | 'center' | 'right' | 'justify';
  subheadingFontFamily?: string;

  descriptionColor?: string;
  descriptionSize?: string;
  descriptionBold?: boolean;
  descriptionItalic?: boolean;
  descriptionUnderline?: boolean;
  descriptionAlign?: 'left' | 'center' | 'right' | 'justify';
  descriptionFontFamily?: string;

  ctaTextColor?: string;
  ctaTextSize?: string;
  ctaTextBold?: boolean;
  ctaTextItalic?: boolean;
  ctaTextUnderline?: boolean;
  ctaTextAlign?: 'left' | 'center' | 'right' | 'justify';
  ctaTextFontFamily?: string;

  titleColor?: string;
  titleSize?: string;
  titleBold?: boolean;
  titleItalic?: boolean;
  titleUnderline?: boolean;
  titleAlign?: 'left' | 'center' | 'right' | 'justify';
  titleFontFamily?: string;

  taglineColor?: string;
  taglineSize?: string;
  taglineBold?: boolean;
  taglineItalic?: boolean;
  taglineUnderline?: boolean;
  taglineAlign?: 'left' | 'center' | 'right' | 'justify';
  taglineFontFamily?: string;

  businessNameColor?: string;
  businessNameSize?: string;
  businessNameBold?: boolean;
  businessNameItalic?: boolean;
  businessNameUnderline?: boolean;
  businessNameAlign?: 'left' | 'center' | 'right' | 'justify';
  businessNameFontFamily?: string;
}

export interface HeroSectionProps extends Partial<TextStyleProps> {
  heading: string;
  subheading: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  backgroundColor: string;
  textColor: string;
  overlayOpacity: number;
}

export interface AboutSectionProps extends Partial<TextStyleProps> {
  heading: string;
  description: string;
  image: string;
  imagePosition: 'left' | 'right';
  backgroundColor: string;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface ServicesSectionProps extends Partial<TextStyleProps> {
  heading: string;
  subheading: string;
  services: Service[];
  backgroundColor: string;
  columns: 2 | 3 | 4;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
}

export interface MenuSectionProps extends Partial<TextStyleProps> {
  heading: string;
  subheading: string;
  menuItems: MenuItem[];
  categories: string[];
  backgroundColor: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

export interface GallerySectionProps extends Partial<TextStyleProps> {
  heading: string;
  subheading: string;
  images: GalleryImage[];
  layout: 'grid' | 'masonry';
  backgroundColor: string;
  columns: 2 | 3 | 4;
}

export interface Testimonial {
  id: string;
  name: string;
  photo: string;
  rating: number;
  review: string;
  position?: string;
}

export interface TestimonialsSectionProps extends Partial<TextStyleProps> {
  heading: string;
  subheading: string;
  testimonials: Testimonial[];
  backgroundColor: string;
  layout: 'carousel' | 'grid';
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
  discount?: string;
  validUntil?: string;
}

export interface OffersSectionProps extends Partial<TextStyleProps> {
  heading: string;
  subheading: string;
  offers: Offer[];
  backgroundColor: string;
}

export interface CTASectionProps extends Partial<TextStyleProps> {
  heading: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  backgroundColor: string;
  textColor: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

export interface FooterSectionProps extends Partial<TextStyleProps> {
  businessName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  socialLinks: SocialLink[];
  backgroundColor: string;
  textColor: string;
}

export interface FloatingWhatsAppProps {
  phoneNumber: string;
  message?: string;
  position: 'bottom-right' | 'bottom-left';
}

// New Advanced Component Types

export interface Card {
  id: string;
  image?: string;
  icon?: string;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  link?: string;
  linkText?: string;
  tags?: string[];
  rating?: number;
  price?: string;
}

export interface CardSectionProps extends Partial<TextStyleProps>, Partial<AdvancedStyleProps> {
  heading: string;
  subheading?: string;
  cards: Card[];
  backgroundColor: string;
  columns: 1 | 2 | 3 | 4;
  cardLayout?: 'vertical' | 'horizontal';
}

export interface Stat {
  id: string;
  value: string;
  label: string;
  icon?: string;
  suffix?: string;
  prefix?: string;
  animateCounter?: boolean;
}

export interface StatsSectionProps extends Partial<TextStyleProps>, Partial<AdvancedStyleProps> {
  heading?: string;
  subheading?: string;
  stats: Stat[];
  backgroundColor: string;
  columns: 2 | 3 | 4;
}

export interface Category {
  id: string;
  label: string;
  icon?: string;
  count?: number;
  color?: string;
}

export interface CategorySectionProps extends Partial<TextStyleProps>, Partial<AdvancedStyleProps> {
  heading: string;
  subheading?: string;
  categories: Category[];
  backgroundColor: string;
  layout: 'pills' | 'cards' | 'buttons';
  allowMultiSelect?: boolean;
}

export interface Profile {
  id: string;
  name: string;
  photo: string;
  role: string;
  bio?: string;
  rating?: number;
  reviews?: number;
  social?: { platform: string; url: string }[];
}

export interface ProfileSectionProps extends Partial<TextStyleProps>, Partial<AdvancedStyleProps> {
  heading: string;
  subheading?: string;
  profiles: Profile[];
  backgroundColor: string;
  columns: 2 | 3 | 4;
  showRating?: boolean;
  showSocial?: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  recommended?: boolean;
  ctaText?: string;
  ctaLink?: string;
}

export interface PricingSectionProps extends Partial<TextStyleProps>, Partial<AdvancedStyleProps> {
  heading: string;
  subheading?: string;
  plans: PricingPlan[];
  backgroundColor: string;
  billingToggle?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQSectionProps extends Partial<TextStyleProps>, Partial<AdvancedStyleProps> {
  heading: string;
  subheading?: string;
  faqs: FAQItem[];
  backgroundColor: string;
  layout: 'accordion' | 'grid';
}

export interface TimelineItem {
  id: string;
  year?: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
}

export interface TimelineSectionProps extends Partial<TextStyleProps>, Partial<AdvancedStyleProps> {
  heading: string;
  subheading?: string;
  items: TimelineItem[];
  backgroundColor: string;
  orientation: 'vertical' | 'horizontal';
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  link?: string;
}

export interface FeatureSectionProps extends Partial<TextStyleProps>, Partial<AdvancedStyleProps> {
  heading: string;
  subheading?: string;
  features: Feature[];
  backgroundColor: string;
  columns: 2 | 3 | 4;
  iconStyle?: 'circular' | 'square' | 'none';
}

export interface JobFilter {
  datePosted?: 'last-24h' | 'last-week' | 'last-month' | 'any-time';
  jobType?: ('full-time' | 'part-time' | 'freelance')[];
  salaryRange?: {
    min?: number;
    max?: number;
  };
  workMode?: ('on-site' | 'hybrid' | 'remote')[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  logo?: string;
  location: string;
  jobType: 'full-time' | 'part-time' | 'freelance';
  workMode: 'on-site' | 'hybrid' | 'remote';
  salary?: string;
  description: string;
  requirements?: string[];
  datePosted: string;
  tags?: string[];
}

export interface JobBoardSectionProps extends Partial<TextStyleProps>, Partial<AdvancedStyleProps> {
  heading: string;
  subheading?: string;
  jobs: Job[];
  backgroundColor: string;
  showFilters?: boolean;
  showSearch?: boolean;
  defaultFilters?: JobFilter;
}

export type ComponentProps =
  | HeroSectionProps
  | AboutSectionProps
  | ServicesSectionProps
  | MenuSectionProps
  | GallerySectionProps
  | TestimonialsSectionProps
  | OffersSectionProps
  | CTASectionProps
  | FooterSectionProps
  | FloatingWhatsAppProps
  | CardSectionProps
  | StatsSectionProps
  | CategorySectionProps
  | ProfileSectionProps
  | PricingSectionProps
  | FAQSectionProps
  | TimelineSectionProps
  | FeatureSectionProps
  | JobBoardSectionProps;

export interface PageSection {
  id: string;
  type: ComponentType;
  props: ComponentProps;
  order: number;
}

export interface ComponentDefinition {
  type: ComponentType;
  label: string;
  icon: string;
  category: 'hero' | 'content' | 'interactive' | 'footer' | 'utility';
  defaultProps: ComponentProps;
  description: string;
}

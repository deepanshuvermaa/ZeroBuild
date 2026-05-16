// Export all preview components
export { HeroSectionPreview } from './HeroSectionPreview';
export { AboutSectionPreview } from './AboutSectionPreview';
export { ServicesSectionPreview } from './ServicesSectionPreview';
export { MenuSectionPreview } from './MenuSectionPreview';
export { GallerySectionPreview } from './GallerySectionPreview';
export { TestimonialsSectionPreview } from './TestimonialsSectionPreview';
export { OffersSectionPreview } from './OffersSectionPreview';
export { CTASectionPreview } from './CTASectionPreview';
export { FooterSectionPreview } from './FooterSectionPreview';
export { FloatingWhatsAppPreview } from './FloatingWhatsAppPreview';
export { CardSectionPreview } from './CardSectionPreview';
export { StatsSectionPreview } from './StatsSectionPreview';
export { CategorySectionPreview } from './CategorySectionPreview';
export { ProfileSectionPreview } from './ProfileSectionPreview';
export { PricingSectionPreview } from './PricingSectionPreview';
export { FAQSectionPreview } from './FAQSectionPreview';
export { TimelineSectionPreview } from './TimelineSectionPreview';
export { FeatureSectionPreview } from './FeatureSectionPreview';
export { JobBoardSectionPreview } from './JobBoardSectionPreview';

// Component map for easy lookup
import { HeroSectionPreview } from './HeroSectionPreview';
import { AboutSectionPreview } from './AboutSectionPreview';
import { ServicesSectionPreview } from './ServicesSectionPreview';
import { MenuSectionPreview } from './MenuSectionPreview';
import { GallerySectionPreview } from './GallerySectionPreview';
import { TestimonialsSectionPreview } from './TestimonialsSectionPreview';
import { OffersSectionPreview } from './OffersSectionPreview';
import { CTASectionPreview } from './CTASectionPreview';
import { FooterSectionPreview } from './FooterSectionPreview';
import { FloatingWhatsAppPreview } from './FloatingWhatsAppPreview';
import { CardSectionPreview } from './CardSectionPreview';
import { StatsSectionPreview } from './StatsSectionPreview';
import { CategorySectionPreview } from './CategorySectionPreview';
import { ProfileSectionPreview } from './ProfileSectionPreview';
import { PricingSectionPreview } from './PricingSectionPreview';
import { FAQSectionPreview } from './FAQSectionPreview';
import { TimelineSectionPreview } from './TimelineSectionPreview';
import { FeatureSectionPreview } from './FeatureSectionPreview';
import { JobBoardSectionPreview } from './JobBoardSectionPreview';
import type { ComponentType } from '@/types/component.types';

export const PreviewComponentMap: Record<ComponentType, React.FC<any>> = {
  HeroSection: HeroSectionPreview,
  AboutSection: AboutSectionPreview,
  ServicesSection: ServicesSectionPreview,
  MenuSection: MenuSectionPreview,
  GallerySection: GallerySectionPreview,
  TestimonialsSection: TestimonialsSectionPreview,
  OffersSection: OffersSectionPreview,
  CTASection: CTASectionPreview,
  FooterSection: FooterSectionPreview,
  FloatingWhatsApp: FloatingWhatsAppPreview,
  CardSection: CardSectionPreview,
  StatsSection: StatsSectionPreview,
  CategorySection: CategorySectionPreview,
  ProfileSection: ProfileSectionPreview,
  PricingSection: PricingSectionPreview,
  FAQSection: FAQSectionPreview,
  TimelineSection: TimelineSectionPreview,
  FeatureSection: FeatureSectionPreview,
  JobBoardSection: JobBoardSectionPreview,
};

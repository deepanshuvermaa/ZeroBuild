import { v4 as uuidv4 } from 'uuid';
import { aiComplete } from './client.js';

const SECTION_INTERFACES = {
  HeroSection: `interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  alignment: 'left' | 'center' | 'right';
  overlayOpacity: number;
  showBadge?: boolean;
  badgeText?: string;
}`,
  AboutSection: `interface AboutSectionProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imagePosition: 'left' | 'right';
  stats?: { label: string; value: string }[];
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
}`,
  ServicesSection: `interface ServicesSectionProps {
  title: string;
  subtitle: string;
  services: {
    icon: string;
    title: string;
    description: string;
    link?: string;
  }[];
  columns: 2 | 3 | 4;
  layout: 'grid' | 'list';
}`,
  MenuSection: `interface MenuSectionProps {
  title: string;
  subtitle: string;
  categories: {
    name: string;
    items: {
      name: string;
      description: string;
      price: string;
      image?: string;
      badge?: string;
    }[];
  }[];
}`,
  GallerySection: `interface GallerySectionProps {
  title: string;
  subtitle: string;
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  columns: 2 | 3 | 4;
  layout: 'grid' | 'masonry';
  showLightbox: boolean;
}`,
  TestimonialsSection: `interface TestimonialsSectionProps {
  title: string;
  subtitle: string;
  testimonials: {
    name: string;
    role: string;
    company?: string;
    content: string;
    avatar: string;
    rating: number;
  }[];
  layout: 'grid' | 'carousel';
}`,
  OffersSection: `interface OffersSectionProps {
  title: string;
  subtitle: string;
  offers: {
    title: string;
    description: string;
    discount: string;
    originalPrice?: string;
    salePrice?: string;
    image?: string;
    badge?: string;
    ctaText: string;
    ctaLink: string;
    validUntil?: string;
  }[];
}`,
  CTASection: `interface CTASectionProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  layout: 'centered' | 'split';
}`,
  FooterSection: `interface FooterSectionProps {
  companyName: string;
  description: string;
  logo?: string;
  links: {
    group: string;
    items: { label: string; url: string }[];
  }[];
  socialLinks: {
    platform: string;
    url: string;
  }[];
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  copyrightText: string;
}`,
  FloatingWhatsApp: `interface FloatingWhatsAppProps {
  phoneNumber: string;
  defaultMessage: string;
  position: 'bottom-right' | 'bottom-left';
  showOnMobile: boolean;
}`,
  CardSection: `interface CardSectionProps {
  title: string;
  subtitle: string;
  cards: {
    title: string;
    description: string;
    image?: string;
    icon?: string;
    ctaText?: string;
    ctaLink?: string;
    badge?: string;
  }[];
  columns: 2 | 3 | 4;
  layout: 'standard' | 'horizontal' | 'overlay';
}`,
  StatsSection: `interface StatsSectionProps {
  title: string;
  subtitle: string;
  stats: {
    value: string;
    label: string;
    icon?: string;
    prefix?: string;
    suffix?: string;
  }[];
  backgroundColor?: string;
  layout: 'row' | 'grid';
}`,
  CategorySection: `interface CategorySectionProps {
  title: string;
  subtitle: string;
  categories: {
    name: string;
    description?: string;
    image: string;
    link?: string;
    itemCount?: number;
  }[];
  columns: 2 | 3 | 4;
  layout: 'grid' | 'carousel';
}`,
  ProfileSection: `interface ProfileSectionProps {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  coverImage?: string;
  socialLinks: { platform: string; url: string }[];
  skills?: string[];
  contactEmail?: string;
}`,
  PricingSection: `interface PricingSectionProps {
  title: string;
  subtitle: string;
  plans: {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    ctaText: string;
    ctaLink: string;
    isPopular?: boolean;
    badge?: string;
  }[];
  showToggle?: boolean;
}`,
  FAQSection: `interface FAQSectionProps {
  title: string;
  subtitle: string;
  faqs: {
    question: string;
    answer: string;
  }[];
  layout: 'accordion' | 'grid';
}`,
  TimelineSection: `interface TimelineSectionProps {
  title: string;
  subtitle: string;
  events: {
    date: string;
    title: string;
    description: string;
    icon?: string;
    image?: string;
  }[];
  layout: 'vertical' | 'horizontal';
}`,
  FeatureSection: `interface FeatureSectionProps {
  title: string;
  subtitle: string;
  features: {
    icon: string;
    title: string;
    description: string;
    image?: string;
  }[];
  layout: 'grid' | 'alternating' | 'centered';
  columns: 2 | 3;
}`,
  JobBoardSection: `interface JobBoardSectionProps {
  title: string;
  subtitle: string;
  jobs: {
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
    applyLink: string;
    postedDate?: string;
  }[];
  showFilters: boolean;
}`,
};

export async function generateFullPage(prompt) {
  // Step 1: Intent analysis
  const intent = await aiComplete({
    systemPrompt: `You are a web design strategist. Analyze the user's request and determine the industry, target audience, tone, style, and which sections to include.
Available section types: HeroSection, AboutSection, ServicesSection, MenuSection, GallerySection, TestimonialsSection, OffersSection, CTASection, FooterSection, FloatingWhatsApp, CardSection, StatsSection, CategorySection, ProfileSection, PricingSection, FAQSection, TimelineSection, FeatureSection, JobBoardSection.
Respond with ONLY valid JSON: { "industry": string, "audience": string, "tone": string, "style": string, "sections": string[] }
Choose 5-8 sections that make sense for the request. Always include HeroSection first and FooterSection last.`,
    userPrompt: prompt,
    maxTokens: 1024,
    json: true,
  });

  // Step 2: Design tokens
  const theme = await aiComplete({
    systemPrompt: `You are a brand designer. Generate a color palette and typography that matches the given industry and tone.
Respond with ONLY valid JSON: { "primaryColor": "#hex", "secondaryColor": "#hex", "accentColor": "#hex", "fontFamily": "font name" }
Use professional, accessible color combinations. The fontFamily should be a Google Font name like "Inter", "Poppins", "Playfair Display", "Roboto", etc.`,
    userPrompt: `Industry: ${intent.industry}\nTone: ${intent.tone}\nStyle: ${intent.style}\nUser request: ${prompt}`,
    maxTokens: 512,
    json: true,
  });

  // Step 3: Generate each section in parallel
  const sectionPromises = intent.sections.map(async (sectionType) => {
    const iface = SECTION_INTERFACES[sectionType];
    if (!iface) {
      console.warn(`[AI] Unknown section type: ${sectionType}`);
      return null;
    }

    const props = await aiComplete({
      systemPrompt: `You generate website section content. Return ONLY valid JSON matching this TypeScript interface:

${iface}

Context:
- Industry: ${intent.industry}
- Target audience: ${intent.audience}
- Tone: ${intent.tone}
- Style: ${intent.style}
- Theme colors: primary=${theme.primaryColor}, secondary=${theme.secondaryColor}, accent=${theme.accentColor}

Generate realistic, compelling content. Use placeholder image URLs from https://placehold.co (e.g., "https://placehold.co/800x600"). Do not include any explanation, only the JSON object.`,
      userPrompt: `Generate content for a ${sectionType} based on this request: ${prompt}`,
      maxTokens: 2048,
      json: true,
    });

    return {
      id: uuidv4(),
      type: sectionType,
      props,
      order: 0,
    };
  });

  const sectionResults = await Promise.allSettled(sectionPromises);
  const sections = sectionResults
    .filter((r) => r.status === 'fulfilled' && r.value)
    .map((r) => r.value)
    .map((s, i) => ({ ...s, order: i }));

  // Step 4: Assemble PageConfig
  return {
    metadata: {
      clientName: '',
      projectName: prompt.substring(0, 60),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
    },
    theme,
    whatsapp: {
      phoneNumber: '',
      defaultMessage: 'Hi!',
      enabled: false,
    },
    seo: {
      title: `${intent.industry} Website`,
      description: prompt.substring(0, 160),
      keywords: [intent.industry, intent.audience, intent.tone].filter(Boolean),
    },
    sections,
  };
}

export async function editSection(currentConfig, sectionId, instruction) {
  const section = currentConfig.sections?.find((s) => s.id === sectionId);
  if (!section) throw new Error('Section not found');

  const iface = SECTION_INTERFACES[section.type];

  return aiComplete({
    systemPrompt: `You modify website section properties based on user instructions. Return ONLY the modified props as valid JSON.

Section type: ${section.type}
Interface:
${iface || 'Unknown type'}

Current props:
${JSON.stringify(section.props, null, 2)}

Apply the user's instruction and return the complete updated props object. Only change what the user asks for, keep everything else the same.`,
    userPrompt: instruction,
    maxTokens: 2048,
    json: true,
  });
}

export async function rewriteCopy(sectionType, currentProps, instruction) {
  const iface = SECTION_INTERFACES[sectionType];

  return aiComplete({
    systemPrompt: `You rewrite text content in website section props based on user instructions. Return ONLY the complete modified props as valid JSON.

Section type: ${sectionType}
Interface:
${iface || 'Unknown type'}

Current props:
${JSON.stringify(currentProps, null, 2)}

Rewrite the text/copy content as instructed. Keep structural properties (layout, columns, etc.) unchanged. Only modify text fields.`,
    userPrompt: instruction,
    maxTokens: 2048,
    json: true,
  });
}

export async function generateSEO(config) {
  const sectionSummary = (config.sections || [])
    .map((s) => `${s.type}: ${JSON.stringify(s.props).substring(0, 300)}`)
    .join('\n');

  return aiComplete({
    systemPrompt: `You are an SEO expert. Analyze the website content and generate optimized SEO metadata.
Return ONLY valid JSON: { "title": string (max 60 chars), "description": string (max 160 chars), "keywords": string[] (5-10 keywords) }`,
    userPrompt: `Website content:\n${sectionSummary}\n\nTheme: ${JSON.stringify(config.theme)}\nProject: ${config.metadata?.projectName || 'Website'}`,
    maxTokens: 512,
    json: true,
  });
}

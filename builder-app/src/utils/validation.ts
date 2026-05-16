import type { PageConfig, PageMetadata, ThemeConfig, WhatsAppConfig, SEOConfig } from '@/types/config.types';
import type { PageSection, ComponentType } from '@/types/component.types';

/**
 * Validates a complete PageConfig object
 */
export function validateConfig(config: any): PageConfig {
  if (!config || typeof config !== 'object') {
    throw new Error('Invalid configuration: must be an object');
  }

  // Validate metadata
  const metadata = validateMetadata(config.metadata);

  // Validate theme
  const theme = validateTheme(config.theme);

  // Validate whatsapp
  const whatsapp = validateWhatsApp(config.whatsapp);

  // Validate SEO
  const seo = validateSEO(config.seo);

  // Validate sections
  const sections = validateSections(config.sections);

  return {
    metadata,
    theme,
    whatsapp,
    seo,
    sections,
  };
}

/**
 * Validates PageMetadata
 */
function validateMetadata(metadata: any): PageMetadata {
  if (!metadata || typeof metadata !== 'object') {
    throw new Error('Invalid metadata: must be an object');
  }

  return {
    clientName: String(metadata.clientName || ''),
    projectName: String(metadata.projectName || 'Untitled Project'),
    createdAt: validateISO8601(metadata.createdAt) || new Date().toISOString(),
    updatedAt: validateISO8601(metadata.updatedAt) || new Date().toISOString(),
    version: String(metadata.version || '1.0'),
  };
}

/**
 * Validates ThemeConfig
 */
function validateTheme(theme: any): ThemeConfig {
  if (!theme || typeof theme !== 'object') {
    throw new Error('Invalid theme: must be an object');
  }

  return {
    primaryColor: validateColor(theme.primaryColor, '#3B82F6'),
    secondaryColor: validateColor(theme.secondaryColor, '#10B981'),
    fontFamily: String(theme.fontFamily || 'Inter'),
    accentColor: theme.accentColor ? validateColor(theme.accentColor) : undefined,
  };
}

/**
 * Validates WhatsAppConfig
 */
function validateWhatsApp(whatsapp: any): WhatsAppConfig {
  if (!whatsapp || typeof whatsapp !== 'object') {
    throw new Error('Invalid WhatsApp config: must be an object');
  }

  return {
    phoneNumber: String(whatsapp.phoneNumber || ''),
    defaultMessage: String(whatsapp.defaultMessage || 'Hi! I would like to know more.'),
    enabled: Boolean(whatsapp.enabled ?? true),
  };
}

/**
 * Validates SEOConfig
 */
function validateSEO(seo: any): SEOConfig {
  if (!seo || typeof seo !== 'object') {
    throw new Error('Invalid SEO config: must be an object');
  }

  return {
    title: String(seo.title || 'Welcome'),
    description: String(seo.description || ''),
    keywords: Array.isArray(seo.keywords) ? seo.keywords.map(String) : [],
    ogImage: seo.ogImage ? String(seo.ogImage) : undefined,
  };
}

/**
 * Validates sections array
 */
function validateSections(sections: any): PageSection[] {
  if (!Array.isArray(sections)) {
    throw new Error('Invalid sections: must be an array');
  }

  return sections.map((section, index) => {
    if (!section || typeof section !== 'object') {
      throw new Error(`Invalid section at index ${index}: must be an object`);
    }

    // Validate component type
    const validTypes: ComponentType[] = [
      'HeroSection',
      'AboutSection',
      'ServicesSection',
      'MenuSection',
      'GallerySection',
      'TestimonialsSection',
      'OffersSection',
      'CTASection',
      'FooterSection',
      'FloatingWhatsApp',
      'CardSection',
      'StatsSection',
      'CategorySection',
      'ProfileSection',
      'PricingSection',
      'FAQSection',
      'TimelineSection',
      'FeatureSection',
      'JobBoardSection',
    ];

    if (!validTypes.includes(section.type)) {
      throw new Error(`Invalid component type at section ${index}: ${section.type}`);
    }

    return {
      id: String(section.id || `section-${Date.now()}-${index}`),
      type: section.type as ComponentType,
      props: section.props || {},
      order: typeof section.order === 'number' ? section.order : index,
    };
  });
}

/**
 * Validates a hex color string
 */
function validateColor(color: any, fallback: string = '#000000'): string {
  if (typeof color !== 'string') {
    return fallback;
  }

  // Check if valid hex color
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (hexRegex.test(color)) {
    return color;
  }

  return fallback;
}

/**
 * Validates ISO 8601 date string
 */
function validateISO8601(dateString: any): string | null {
  if (typeof dateString !== 'string') {
    return null;
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return null;
  }

  return dateString;
}

/**
 * Validates a URL string
 */
export function validateURL(url: any): string {
  if (typeof url !== 'string') {
    return '';
  }

  try {
    new URL(url);
    return url;
  } catch {
    return url.startsWith('http') ? url : '';
  }
}

/**
 * Validates a phone number (basic validation)
 */
export function validatePhoneNumber(phone: any): string {
  if (typeof phone !== 'string') {
    return '';
  }

  // Remove all non-digit and non-plus characters
  const cleaned = phone.replace(/[^\d+]/g, '');

  return cleaned;
}

/**
 * Type guard to check if a value is a valid PageConfig
 */
export function isValidPageConfig(value: any): value is PageConfig {
  try {
    validateConfig(value);
    return true;
  } catch {
    return false;
  }
}

import type { PageSection } from './component.types';

export interface PageMetadata {
  clientName: string;
  projectName: string;
  createdAt: string;
  updatedAt: string;
  version: string;
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
  theme: ThemeConfig;
  whatsapp: WhatsAppConfig;
  seo: SEOConfig;
  sections: PageSection[];
}

export interface BuilderState {
  config: PageConfig;
  selectedSectionId: string | null;
  isDragging: boolean;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  hasUnsavedChanges: boolean;
}

export interface HistoryState {
  past: PageConfig[];
  present: PageConfig;
  future: PageConfig[];
}

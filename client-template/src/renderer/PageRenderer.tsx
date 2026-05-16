import React from 'react';
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
  FloatingWhatsApp,
} from '../components';
import type { PageConfig } from '../types';

interface PageRendererProps {
  config: PageConfig;
}

const PageRenderer: React.FC<PageRendererProps> = ({ config }) => {
  const componentMap: Record<string, React.FC<any>> = {
    HeroSection,
    AboutSection,
    ServicesSection,
    MenuSection,
    GallerySection,
    TestimonialsSection,
    OffersSection,
    CTASection,
    FooterSection,
  };

  const renderSection = (section: any) => {
    const { type, props, id } = section;
    const Component = componentMap[type];
    if (!Component) {
      console.warn(`Unknown section type: ${type}`);
      return null;
    }
    return <Component key={id} {...props} />;
  };

  return (
    <div className="min-h-screen">
      {/* Render all sections */}
      {config.sections
        .sort((a, b) => a.order - b.order)
        .map((section) => renderSection(section))}

      {/* Render WhatsApp button if enabled */}
      {config.whatsapp?.enabled && config.whatsapp?.phoneNumber && (
        <FloatingWhatsApp
          phoneNumber={config.whatsapp.phoneNumber}
          message={config.whatsapp.defaultMessage}
        />
      )}
    </div>
  );
};

export default PageRenderer;

import { useRef } from 'react';
import { useBuilderStore } from '@/store/builderStore';
import { PreviewComponentMap } from '@/components/PreviewComponents';

/**
 * Deep normalize props to prevent React Error #31 (rendering objects as children).
 * Maps AI output format to what preview components expect.
 */
function normalizeProps(props: Record<string, any>, sectionType: string): Record<string, any> {
  if (!props || typeof props !== 'object') return { heading: '', subheading: '', backgroundColor: '#ffffff' };

  const normalized: Record<string, any> = {
    ...props,
    heading: props.heading || props.title || '',
    subheading: props.subheading || props.subtitle || '',
    description: props.description || props.subtitle || props.subheading || '',
    backgroundColor: props.backgroundColor || '#ffffff',
    textColor: props.textColor || '#1f2937',
  };

  // MenuSection: AI generates {categories: [{name, items}]} but component expects {menuItems, categories}
  if (sectionType === 'MenuSection' && Array.isArray(props.categories) && props.categories[0]?.items) {
    const cats = props.categories as Array<{name: string, items: any[]}>;
    normalized.categories = ['All', ...cats.map(c => c.name)];
    normalized.menuItems = cats.flatMap(cat =>
      (cat.items || []).map((item: any) => ({
        id: crypto.randomUUID(),
        name: String(item.name || ''),
        description: String(item.description || ''),
        price: String(item.price || ''),
        image: String(item.image || ''),
        category: String(cat.name || ''),
        badge: String(item.badge || ''),
      }))
    );
  }

  // TestimonialsSection: ensure all fields are strings
  if (sectionType === 'TestimonialsSection' && Array.isArray(normalized.testimonials)) {
    normalized.testimonials = normalized.testimonials.map((t: any) => ({
      id: crypto.randomUUID(),
      name: String(t.name || 'Customer'),
      role: String(t.role || ''),
      company: String(t.company || ''),
      content: String(t.content || t.review || t.text || 'Great experience!'),
      avatar: String(t.avatar || 'https://source.unsplash.com/150x150/?portrait'),
      rating: Number(t.rating) || 5,
    }));
  }

  // CategorySection: ensure categories have string fields
  if (sectionType === 'CategorySection' && Array.isArray(normalized.categories)) {
    normalized.categories = normalized.categories.map((c: any) => {
      if (typeof c === 'string') return c;
      return {
        id: crypto.randomUUID(),
        name: String(c.name || ''),
        description: String(c.description || ''),
        image: String(c.image || ''),
        itemCount: Number(c.itemCount) || 0,
      };
    });
  }

  // CardSection: ensure cards have string fields
  if (sectionType === 'CardSection' && Array.isArray(normalized.cards)) {
    normalized.cards = normalized.cards.map((c: any) => ({
      id: crypto.randomUUID(),
      title: String(c.title || ''),
      description: String(c.description || ''),
      image: String(c.image || ''),
      icon: String(c.icon || ''),
      ctaText: String(c.ctaText || ''),
      ctaLink: String(c.ctaLink || '#'),
    }));
  }

  // OffersSection: ensure offers have string fields
  if (sectionType === 'OffersSection' && Array.isArray(normalized.offers)) {
    normalized.offers = normalized.offers.map((o: any) => ({
      id: crypto.randomUUID(),
      title: String(o.title || ''),
      description: String(o.description || ''),
      discount: String(o.discount || ''),
      originalPrice: String(o.originalPrice || ''),
      salePrice: String(o.salePrice || ''),
      image: String(o.image || ''),
      badge: String(o.badge || ''),
      ctaText: String(o.ctaText || 'Shop Now'),
      ctaLink: String(o.ctaLink || '#'),
    }));
  }

  // FeatureSection/ServicesSection: ensure features/services have string fields
  const arrayKey = normalized.features ? 'features' : normalized.services ? 'services' : null;
  if (arrayKey && Array.isArray(normalized[arrayKey])) {
    normalized[arrayKey] = normalized[arrayKey].map((f: any) => ({
      id: crypto.randomUUID(),
      icon: String(f.icon || '⭐'),
      title: String(f.title || ''),
      description: String(f.description || ''),
      image: String(f.image || ''),
      link: String(f.link || ''),
    }));
  }

  // StatsSection: ensure stats are strings
  if (sectionType === 'StatsSection' && Array.isArray(normalized.stats)) {
    normalized.stats = normalized.stats.map((s: any) => ({
      id: crypto.randomUUID(),
      value: String(s.value || '0'),
      label: String(s.label || ''),
      icon: String(s.icon || ''),
    }));
  }

  return normalized;
}

export default function PreviewCanvas() {
  const { config, selectedSectionId, setSelectedSection, previewMode } = useBuilderStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const sections = [...config.sections].sort((a, b) => a.order - b.order);
  const widthClass = previewMode === 'mobile' ? 'max-w-[375px]' : previewMode === 'tablet' ? 'max-w-[768px]' : 'w-full';

  return (
    <div className="h-full overflow-y-auto bg-white" ref={containerRef}>
      <div className={`mx-auto ${widthClass} transition-all duration-300`}>
        {sections.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[60vh]">
            <p className="text-gray-400 text-sm">Your site preview will appear here</p>
          </div>
        ) : (
          sections.map(section => {
            const Component = PreviewComponentMap[section.type];
            if (!Component) return null;
            const isSelected = selectedSectionId === section.id;

            return (
              <div key={section.id} className={`relative transition-all ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}`}>
                <Component
                  id={section.id}
                  props={normalizeProps(section.props as Record<string, any>, section.type)}
                  isSelected={isSelected}
                  onSelect={() => setSelectedSection(section.id)}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

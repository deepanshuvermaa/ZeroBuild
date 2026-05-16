import { useRef } from 'react';
import { useBuilderStore } from '@/store/builderStore';
import { PreviewComponentMap } from '@/components/PreviewComponents';

function normalizeProps(props: Record<string, any>, theme: any): Record<string, any> {
  if (!props || typeof props !== 'object') return { heading: '', subheading: '', backgroundColor: '#ffffff' };
  return {
    ...props,
    heading: props.heading || props.title || '',
    subheading: props.subheading || props.subtitle || '',
    description: props.description || props.subtitle || props.subheading || '',
    backgroundColor: props.backgroundColor || '#ffffff',
    textColor: props.textColor || '#1f2937',
    // Inject theme for components that need it
    _theme: theme,
  };
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
                  props={normalizeProps(section.props as Record<string, any>, config.theme)}
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

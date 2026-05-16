import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useBuilderStore } from '@/store/builderStore';
import { PreviewComponentMap } from '@/components/PreviewComponents';

export default function PreviewCanvas() {
  const { config, selectedSectionId, setSelectedSection, previewMode } = useBuilderStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const sections = [...config.sections].sort((a, b) => a.order - b.order);

  const widthClass = previewMode === 'mobile' ? 'max-w-[375px]' : previewMode === 'tablet' ? 'max-w-[768px]' : 'w-full';

  return (
    <div className="h-full overflow-y-auto bg-[#0a0a0a]" ref={containerRef}>
      <div className={`mx-auto ${widthClass} transition-all duration-300`}>
        {sections.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[60vh]">
            <p className="text-white/20 text-sm">Your site preview will appear here</p>
          </div>
        ) : (
          sections.map(section => {
            const Component = PreviewComponentMap[section.type];
            if (!Component) return null;

            const isSelected = selectedSectionId === section.id;

            return (
              <motion.div
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={`relative cursor-pointer transition-all duration-200 ${
                  isSelected ? 'ring-2 ring-white/30 ring-offset-2 ring-offset-[#0a0a0a]' : 'hover:ring-1 hover:ring-white/10'
                }`}
                whileHover={{ scale: 1.001 }}
              >
                <Component {...section.props} theme={config.theme} />
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-white/10 backdrop-blur-sm rounded-md px-2 py-0.5 text-[10px] text-white/60 border border-white/10">
                    {section.type.replace('Section', '')}
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

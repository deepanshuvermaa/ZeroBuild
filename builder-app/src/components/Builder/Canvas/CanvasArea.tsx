import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import { useBuilderStore } from '@/store/builderStore';
import { SectionWrapper } from './SectionWrapper';
import { PreviewComponentMap } from '@/components/PreviewComponents';
import { cn } from '@/lib/utils';

export const CanvasArea: React.FC = () => {
  const { config, previewMode, isDragging, selectedSectionId, setSelectedSection } = useBuilderStore();
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-droppable',
    data: {
      type: 'canvas',
    },
  });

  const sections = config.sections.sort((a, b) => a.order - b.order);
  const sectionIds = sections.map((s) => s.id);

  // Device frame dimensions
  const deviceStyles = {
    desktop: 'w-full',
    tablet: 'w-[768px] mx-auto',
    mobile: 'w-[375px] mx-auto scale-100',
  };

  return (
    <div className="h-full bg-gray-100 overflow-auto">
      <div className="min-h-full p-8">
        {/* Device Preview Frame */}
        <motion.div
          layout
          className={cn(
            'transition-all duration-300',
            deviceStyles[previewMode]
          )}
        >
          <div
            ref={setNodeRef}
            className={cn(
              'min-h-[600px] bg-white rounded-lg shadow-lg overflow-hidden',
              'transition-all duration-200',
              isOver && 'ring-2 ring-blue-500 ring-offset-4',
              isDragging && 'ring-2 ring-gray-300 ring-offset-4 ring-dashed',
              previewMode === 'mobile' && 'mobile-viewport',
              previewMode === 'tablet' && 'tablet-viewport'
            )}
          >
            {sections.length === 0 ? (
              // Empty State
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center min-h-[600px] p-12"
              >
                <div className="text-center max-w-md">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Sparkles className="h-16 w-16 mx-auto text-blue-500 mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Start Building
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Drag components from the sidebar to get started building your page
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Plus className="h-4 w-4" />
                    <span>Drag & Drop to Add Components</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              // Sections List
              <SortableContext
                items={sectionIds}
                strategy={verticalListSortingStrategy}
              >
                <AnimatePresence mode="popLayout">
                  {sections.map((section) => {
                    const PreviewComponent = PreviewComponentMap[section.type];

                    if (!PreviewComponent) {
                      return (
                        <motion.div
                          key={section.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.2 }}
                          className="relative"
                        >
                          <SectionWrapper section={section}>
                            <div className="bg-red-50 p-8 min-h-[200px] flex items-center justify-center border-b border-red-200">
                              <div className="text-center">
                                <div className="text-4xl mb-2">❌</div>
                                <h3 className="text-xl font-bold text-red-900 mb-2">
                                  Component not found
                                </h3>
                                <p className="text-red-600 text-sm">
                                  {section.type} is not available
                                </p>
                              </div>
                            </div>
                          </SectionWrapper>
                        </motion.div>
                      );
                    }

                    return (
                      <motion.div
                        key={section.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.2 }}
                        className="relative"
                      >
                        <SectionWrapper section={section}>
                          <PreviewComponent
                            id={section.id}
                            props={section.props}
                            isSelected={selectedSectionId === section.id}
                            onSelect={() => setSelectedSection(section.id)}
                          />
                        </SectionWrapper>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </SortableContext>
            )}
          </div>
        </motion.div>

        {/* Canvas Info */}
        <div className="text-center mt-4 text-sm text-gray-500">
          <p>
            Preview Mode: <span className="font-semibold capitalize">{previewMode}</span>
            {' • '}
            Sections: <span className="font-semibold">{sections.length}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { GallerySectionProps } from '@/types/component.types';
import { extractTextStyle, getTextStyle } from '@/utils/textStyles';

interface PreviewProps {
  id: string;
  props: GallerySectionProps;
  isSelected: boolean;
  onSelect: () => void;
}

export const GallerySectionPreview: React.FC<PreviewProps> = ({
  id: _id,
  props,
  isSelected,
  onSelect,
}) => {
  const {
    heading = 'Gallery',
    subheading = 'Our visual story',
    images = [],
    layout = 'grid',
    backgroundColor = '#ffffff',
    columns = 3,
  } = props;

  const gridColsClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[columns];

  // Scroll animation
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div
      onClick={onSelect}
      className={cn(
        'relative cursor-pointer transition-all group',
        isSelected && 'ring-4 ring-blue-500 ring-offset-2'
      )}
    >
      {/* Gallery Section Content */}
      <div
        ref={ref}
        className="py-12 sm:py-16 px-4 sm:px-6 md:px-8"
        style={{ backgroundColor }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="text-blue-600 font-semibold mb-2 uppercase tracking-wide text-sm sm:text-base break-words"
              style={getTextStyle(extractTextStyle(props, 'subheading'))}
            >
              {subheading}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 break-words"
              style={getTextStyle(extractTextStyle(props, 'heading'))}
            >
              {heading}
            </motion.h2>
          </div>

          {/* Gallery Grid */}
          {images.length > 0 ? (
            <div
              className={cn(
                'grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4',
                gridColsClass,
                layout === 'masonry' && 'auto-rows-[200px]'
              )}
            >
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
                  className={cn(
                    'relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all group/item cursor-zoom-in',
                    layout === 'masonry' &&
                      index % 3 === 0 &&
                      'md:row-span-2'
                  )}
                >
                  {/* Image */}
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform group-hover/item:scale-110"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                      {image.caption && (
                        <p className="text-xs sm:text-sm font-medium break-words">
                          {image.caption}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 px-4">
              <div className="text-6xl mb-4">🖼️</div>
              <p className="text-gray-600 font-medium break-words">
                No images added yet. Add images in the properties panel.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Hover Indicator */}
      <div className="absolute inset-0 border-2 border-dashed border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

    </div>
  );
};


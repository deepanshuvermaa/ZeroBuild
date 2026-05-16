import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { AboutSectionProps } from '@/types/component.types';
import { extractTextStyle, getTextStyle } from '@/utils/textStyles';

interface PreviewProps {
  id: string;
  props: AboutSectionProps;
  isSelected: boolean;
  onSelect: () => void;
}

export const AboutSectionPreview: React.FC<PreviewProps> = ({
  id: _id,
  props,
  isSelected,
  onSelect,
}) => {
  const {
    heading = 'About Us',
    description = 'Learn more about our story and values',
    image = '',
    imagePosition = 'right',
    backgroundColor = '#ffffff',
  } = props;

  const imageOnLeft = imagePosition === 'left';

  return (
    <div
      onClick={onSelect}
      className={cn(
        'relative cursor-pointer transition-all group',
        isSelected && 'ring-4 ring-blue-500 ring-offset-2'
      )}
    >
      {/* About Section Content */}
      <div
        className="py-12 sm:py-16 px-4 sm:px-6 md:px-8"
        style={{ backgroundColor }}
      >
        <div className="max-w-7xl mx-auto">
          <div
            className={cn(
              'grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center',
              imageOnLeft && 'md:grid-flow-dense'
            )}
          >
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: imageOnLeft ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className={imageOnLeft ? 'md:col-start-2' : ''}
            >
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900 break-words"
                style={getTextStyle(extractTextStyle(props, 'heading'))}
              >
                {heading}
              </h2>
              <p
                className="text-base sm:text-lg text-gray-700 leading-relaxed whitespace-pre-wrap break-words"
                style={getTextStyle(extractTextStyle(props, 'description'))}
              >
                {description}
              </p>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: imageOnLeft ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={cn(
                'rounded-lg overflow-hidden shadow-xl',
                imageOnLeft && 'md:col-start-1 md:row-start-1'
              )}
            >
              {image ? (
                <img
                  src={image}
                  alt={heading}
                  className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-cover"
                />
              ) : (
                <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-center px-4">
                    <div className="text-4xl sm:text-5xl md:text-6xl mb-2">🖼️</div>
                    <p className="text-gray-600 font-medium text-sm sm:text-base break-words">About Image</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Hover Indicator */}
      <div className="absolute inset-0 border-2 border-dashed border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

    </div>
  );
};


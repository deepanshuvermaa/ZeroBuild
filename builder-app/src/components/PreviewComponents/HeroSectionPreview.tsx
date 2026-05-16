import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { HeroSectionProps } from '@/types/component.types';
import { extractTextStyle, getTextStyle } from '@/utils/textStyles';

interface PreviewProps {
  id: string;
  props: HeroSectionProps;
  isSelected: boolean;
  onSelect: () => void;
}

export const HeroSectionPreview: React.FC<PreviewProps> = ({
  id: _id,
  props,
  isSelected,
  onSelect,
}) => {
  const {
    heading = 'Welcome to Your Business',
    subheading = 'Your journey starts here',
    ctaText = 'Get Started',
    ctaLink: _ctaLink = '#',
    backgroundImage = '',
    backgroundColor = '#1e293b',
    textColor = '#ffffff',
    overlayOpacity = 0.5,
  } = props;

  return (
    <div
      onClick={onSelect}
      className={cn(
        'relative cursor-pointer transition-all group',
        isSelected && 'ring-4 ring-blue-500 ring-offset-2'
      )}
    >
      {/* Hero Section Content */}
      <div
        className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundColor,
        }}
      >
        {/* Background Image */}
        {backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImage})`,
            }}
          />
        )}

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: '#000',
            opacity: overlayOpacity,
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 break-words"
            style={{
              color: textColor,
              ...getTextStyle(extractTextStyle(props, 'heading'))
            }}
          >
            {heading}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90 break-words"
            style={{
              color: textColor,
              ...getTextStyle(extractTextStyle(props, 'subheading'))
            }}
          >
            {subheading}
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-100 transition-colors shadow-lg break-words"
            style={getTextStyle(extractTextStyle(props, 'ctaText'))}
          >
            {ctaText}
          </motion.button>
        </div>
      </div>

      {/* Hover Indicator */}
      <div className="absolute inset-0 border-2 border-dashed border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

    </div>
  );
};


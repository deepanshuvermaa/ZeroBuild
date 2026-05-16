import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CTASectionProps } from '@/types/component.types';
import { extractTextStyle, getTextStyle } from '@/utils/textStyles';

interface PreviewProps {
  id: string;
  props: CTASectionProps;
  isSelected: boolean;
  onSelect: () => void;
}

export const CTASectionPreview: React.FC<PreviewProps> = ({
  id: _id,
  props,
  isSelected,
  onSelect,
}) => {
  const {
    heading = 'Ready to Get Started?',
    description = 'Take action now and transform your business',
    ctaText = 'Contact Us',
    ctaLink: _ctaLink = '#',
    backgroundImage = '',
    backgroundColor = '#1e40af',
    textColor = '#ffffff',
  } = props;

  return (
    <div
      onClick={onSelect}
      className={cn(
        'relative cursor-pointer transition-all group',
        isSelected && 'ring-4 ring-blue-500 ring-offset-2'
      )}
    >
      {/* CTA Section Content */}
      <div
        className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 overflow-hidden"
        style={{ backgroundColor }}
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 break-words"
            style={{
              color: textColor,
              ...getTextStyle(extractTextStyle(props, 'heading'))
            }}
          >
            {heading}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90 break-words"
            style={{
              color: textColor,
              ...getTextStyle(extractTextStyle(props, 'description'))
            }}
          >
            {description}
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-100 transition-colors shadow-lg group/btn break-words"
            style={getTextStyle(extractTextStyle(props, 'ctaText'))}
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/btn:translate-x-1 flex-shrink-0" />
          </motion.button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Hover Indicator */}
      <div className="absolute inset-0 border-2 border-dashed border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

    </div>
  );
};


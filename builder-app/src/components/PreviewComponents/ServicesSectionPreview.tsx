import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ServicesSectionProps } from '@/types/component.types';
import { extractTextStyle, getTextStyle } from '@/utils/textStyles';

interface PreviewProps {
  id: string;
  props: ServicesSectionProps;
  isSelected: boolean;
  onSelect: () => void;
}

export const ServicesSectionPreview: React.FC<PreviewProps> = ({
  id: _id,
  props,
  isSelected,
  onSelect,
}) => {
  const {
    heading = 'Our Services',
    subheading = 'What we offer',
    services = [],
    backgroundColor = '#f8fafc',
    columns = 3,
  } = props;

  const gridColsClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[columns];

  // Scroll animation ref
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
      {/* Services Section Content */}
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

          {/* Services Grid */}
          {services.length > 0 ? (
            <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8', gridColsClass)}>
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="bg-white rounded-lg p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow"
                >
                  {/* Icon */}
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">
                    {service.icon || '⚙️'}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 break-words">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed break-words">
                    {service.description}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300 px-4">
              <div className="text-6xl mb-4">⚙️</div>
              <p className="text-gray-600 font-medium break-words">
                No services added yet. Add services in the properties panel.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Hover Indicator */}
      <div className="absolute inset-0 border-2 border-dashed border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Selected Hint */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg flex items-center gap-2 z-20"
        >
          <span>✏️</span>
          <span>Click properties panel to edit →</span>
        </motion.div>
      )}
    </div>
  );
};

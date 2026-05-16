import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { TimelineSectionProps } from '@/types/component.types';
import {
  getCardStyle,
  getBorderRadius,
  getScrollAnimation,
  getSpacing,
  getColorScheme,
} from '@/utils/designSystem';

interface PreviewProps {
  id: string;
  props: TimelineSectionProps;
  isSelected: boolean;
  onSelect: () => void;
}

export const TimelineSectionPreview: React.FC<PreviewProps> = ({
  id: _id,
  props,
  isSelected,
  onSelect,
}) => {
  const {
    heading = 'Our Journey',
    subheading,
    items = [],
    backgroundColor = '#FFFFFF',
    orientation = 'vertical',
    cardStyle = 'elevated',
    borderRadius = 'lg',
    scrollAnimation = 'slide-up',
    staggerDelay = 150,
    colorScheme = 'professional',
    spacing = 'relaxed',
  } = props;

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const animation = getScrollAnimation(scrollAnimation);
  const scheme = getColorScheme(colorScheme);

  return (
    <div
      ref={ref}
      onClick={onSelect}
      className={cn(
        'relative cursor-pointer transition-all',
        isSelected && 'ring-4 ring-blue-500 ring-offset-2'
      )}
      style={{ backgroundColor }}
    >
      <div className={cn('py-12 px-4 md:px-8', getSpacing(spacing))}>
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={animation.initial}
            animate={isInView ? animation.animate : animation.initial}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
          >
            {heading}
          </motion.h2>
          {subheading && (
            <motion.p
              initial={animation.initial}
              animate={isInView ? animation.animate : animation.initial}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-gray-600"
            >
              {subheading}
            </motion.p>
          )}
        </div>

        {/* Vertical Timeline */}
        {orientation === 'vertical' && (
          <div className="max-w-4xl mx-auto relative">
            {/* Center Line */}
            <div
              className="absolute left-1/2 transform -translate-x-1/2 h-full w-1"
              style={{ backgroundColor: scheme.primary + '30' }}
            />

            {items.map((item, index) => {
              const isLeft = index % 2 === 0;
              return (
                <motion.div
                  key={item.id}
                  initial={animation.initial}
                  animate={isInView ? animation.animate : animation.initial}
                  transition={{ duration: 0.5, delay: 0.2 + index * (staggerDelay / 1000) }}
                  className={cn('relative mb-12 flex', isLeft ? 'justify-end' : 'justify-start')}
                >
                  <div className={cn('w-5/12', isLeft ? 'text-right pr-8' : 'pl-8 ml-auto')}>
                    <div
                      className={cn(
                        'p-6',
                        getCardStyle(cardStyle),
                        getBorderRadius(borderRadius),
                        'hover:shadow-xl transition-shadow'
                      )}
                    >
                      {/* Year Badge */}
                      {item.year && (
                        <div
                          className="inline-block px-4 py-1 rounded-full text-sm font-bold text-white mb-3"
                          style={{ backgroundColor: scheme.primary }}
                        >
                          {item.year}
                        </div>
                      )}

                      {/* Icon */}
                      {item.icon && <div className="text-3xl mb-3">{item.icon}</div>}

                      {/* Image */}
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                      )}

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>

                      {/* Description */}
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div
                    className="absolute left-1/2 top-6 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white"
                    style={{ backgroundColor: scheme.primary }}
                  />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Horizontal Timeline */}
        {orientation === 'horizontal' && (
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Horizontal Line */}
              <div
                className="absolute top-16 left-0 right-0 h-1"
                style={{ backgroundColor: scheme.primary + '30' }}
              />

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={animation.initial}
                    animate={isInView ? animation.animate : animation.initial}
                    transition={{ duration: 0.5, delay: 0.2 + index * (staggerDelay / 1000) }}
                    className="relative"
                  >
                    {/* Dot */}
                    <div className="flex justify-center mb-6">
                      <div
                        className="w-8 h-8 rounded-full border-4 border-white shadow-lg"
                        style={{ backgroundColor: scheme.primary }}
                      />
                    </div>

                    {/* Card */}
                    <div
                      className={cn(
                        'p-4 text-center',
                        getCardStyle(cardStyle),
                        getBorderRadius(borderRadius),
                        'hover:shadow-xl transition-shadow'
                      )}
                    >
                      {item.year && (
                        <div
                          className="text-lg font-bold mb-2"
                          style={{ color: scheme.primary }}
                        >
                          {item.year}
                        </div>
                      )}
                      {item.icon && <div className="text-2xl mb-2">{item.icon}</div>}
                      <h3 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-600">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

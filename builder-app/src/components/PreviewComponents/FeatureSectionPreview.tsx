import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { FeatureSectionProps } from '@/types/component.types';
import {
  getCardStyle,
  getBorderRadius,
  getShadowSize,
  getHoverEffect,
  getScrollAnimation,
  getSpacing,
  getColorScheme,
} from '@/utils/designSystem';

interface PreviewProps {
  id: string;
  props: FeatureSectionProps;
  isSelected: boolean;
  onSelect: () => void;
}

export const FeatureSectionPreview: React.FC<PreviewProps> = ({
  id: _id,
  props,
  isSelected,
  onSelect,
}) => {
  const {
    heading = 'Our Features',
    subheading,
    features = [],
    backgroundColor = '#FFFFFF',
    columns = 3,
    iconStyle = 'circular',
    cardStyle = 'elevated',
    borderRadius = 'xl',
    shadowSize = 'md',
    hoverEffect = 'lift',
    scrollAnimation = 'zoom',
    staggerDelay = 100,
    colorScheme = 'vibrant',
    spacing = 'normal',
  } = props;

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const animation = getScrollAnimation(scrollAnimation);
  const scheme = getColorScheme(colorScheme);

  const gridColumns = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const iconContainerStyle = {
    circular: 'rounded-full',
    square: 'rounded-lg',
    none: '',
  };

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

        {/* Features Grid */}
        <div className={cn('grid gap-8 max-w-7xl mx-auto', gridColumns[columns])}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={animation.initial}
              animate={isInView ? animation.animate : animation.initial}
              transition={{ duration: 0.5, delay: 0.2 + index * (staggerDelay / 1000) }}
              className={cn(
                'text-center p-8',
                getCardStyle(cardStyle),
                getBorderRadius(borderRadius),
                getShadowSize(shadowSize),
                getHoverEffect(hoverEffect)
              )}
            >
              {/* Icon */}
              {iconStyle !== 'none' && (
                <div className="flex justify-center mb-6">
                  <div
                    className={cn(
                      'w-20 h-20 flex items-center justify-center text-4xl',
                      iconContainerStyle[iconStyle]
                    )}
                    style={{
                      backgroundColor: scheme.primary + '20',
                      color: scheme.primary,
                    }}
                  >
                    {feature.icon}
                  </div>
                </div>
              )}

              {iconStyle === 'none' && (
                <div className="text-5xl mb-6">{feature.icon}</div>
              )}

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>

              {/* Link */}
              {feature.link && (
                <a
                  href={feature.link}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 font-semibold text-sm hover:underline transition-all"
                  style={{ color: scheme.primary }}
                >
                  Learn More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

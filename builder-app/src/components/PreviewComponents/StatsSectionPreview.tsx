import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { StatsSectionProps } from '@/types/component.types';
import {
  getCardStyle,
  getBorderRadius,
  getScrollAnimation,
  getSpacing,
  getColorScheme,
} from '@/utils/designSystem';

interface PreviewProps {
  id: string;
  props: StatsSectionProps;
  isSelected: boolean;
  onSelect: () => void;
}

const AnimatedCounter: React.FC<{ value: string; inView: boolean }> = ({ value, inView }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (inView) {
      const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
      const controls = animate(count, numericValue, { duration: 2, ease: 'easeOut' });

      const unsubscribe = rounded.on('change', (latest) => {
        setDisplayValue(latest.toString());
      });

      return () => {
        controls.stop();
        unsubscribe();
      };
    }
  }, [inView, value, count, rounded]);

  return <span>{displayValue}</span>;
};

export const StatsSectionPreview: React.FC<PreviewProps> = ({
  id: _id,
  props,
  isSelected,
  onSelect,
}) => {
  const {
    heading,
    subheading,
    stats = [],
    backgroundColor = '#FFFFFF',
    columns = 4,
    cardStyle = 'glass',
    borderRadius = 'xl',
    scrollAnimation = 'zoom',
    staggerDelay = 100,
    colorScheme = 'professional',
    spacing = 'relaxed',
  } = props;

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const animation = getScrollAnimation(scrollAnimation);
  const scheme = getColorScheme(colorScheme);

  const gridColumns = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
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
      <div className={cn('py-16 px-4 md:px-8', getSpacing(spacing))}>
        {/* Header */}
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <motion.h2
                initial={animation.initial}
                animate={isInView ? animation.animate : animation.initial}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
              >
                {heading}
              </motion.h2>
            )}
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
        )}

        {/* Stats Grid */}
        <div className={cn('grid gap-6 max-w-6xl mx-auto', gridColumns[columns])}>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={animation.initial}
              animate={isInView ? animation.animate : animation.initial}
              transition={{ duration: 0.5, delay: 0.2 + index * (staggerDelay / 1000) }}
              className={cn(
                'text-center p-8',
                getCardStyle(cardStyle),
                getBorderRadius(borderRadius),
                'hover:scale-105 transition-transform duration-300'
              )}
            >
              {/* Icon */}
              {stat.icon && (
                <div className="text-5xl mb-4">{stat.icon}</div>
              )}

              {/* Value */}
              <div
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ color: scheme.primary }}
              >
                {stat.prefix}
                {stat.animateCounter !== false ? (
                  <AnimatedCounter value={stat.value} inView={isInView} />
                ) : (
                  stat.value
                )}
                {stat.suffix}
              </div>

              {/* Label */}
              <div className="text-lg text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};


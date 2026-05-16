import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { CardSectionProps } from '@/types/component.types';
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
  props: CardSectionProps;
  isSelected: boolean;
  onSelect: () => void;
}

export const CardSectionPreview: React.FC<PreviewProps> = ({
  id: _id,
  props,
  isSelected,
  onSelect,
}) => {
  const {
    heading = 'Popular Courses',
    subheading,
    cards = [],
    backgroundColor = '#FFFFFF',
    columns = 3,
    cardLayout = 'vertical',
    cardStyle = 'elevated',
    borderRadius = 'xl',
    shadowSize = 'lg',
    hoverEffect = 'lift',
    scrollAnimation = 'slide-up',
    staggerDelay = 100,
    colorScheme = 'warm',
    spacing = 'normal',
  } = props;

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const animation = getScrollAnimation(scrollAnimation);
  const scheme = getColorScheme(colorScheme);

  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
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

        {/* Cards Grid */}
        <div className={cn('grid gap-6 max-w-7xl mx-auto', gridColumns[columns])}>
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={animation.initial}
              animate={isInView ? animation.animate : animation.initial}
              transition={{ duration: 0.5, delay: 0.2 + index * (staggerDelay / 1000) }}
              className={cn(
                'group overflow-hidden',
                getCardStyle(cardStyle),
                getBorderRadius(borderRadius),
                getShadowSize(shadowSize),
                getHoverEffect(hoverEffect),
                cardLayout === 'horizontal' && 'flex flex-row'
              )}
            >
              {/* Card Image */}
              {card.image && (
                <div className={cn(
                  'relative overflow-hidden',
                  cardLayout === 'vertical' ? 'h-48 w-full' : 'h-full w-48 flex-shrink-0'
                )}>
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {card.badge && (
                    <div
                      className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: card.badgeColor || scheme.primary }}
                    >
                      {card.badge}
                    </div>
                  )}
                </div>
              )}

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-1">
                {/* Icon */}
                {card.icon && !card.image && (
                  <div className="text-4xl mb-4">{card.icon}</div>
                )}

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4 flex-1">{card.description}</p>

                {/* Tags */}
                {card.tags && card.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {card.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  {/* Rating */}
                  {card.rating !== undefined && (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-sm font-semibold text-gray-700">{card.rating}</span>
                    </div>
                  )}

                  {/* Price */}
                  {card.price && (
                    <div className="text-lg font-bold" style={{ color: scheme.primary }}>
                      {card.price}
                    </div>
                  )}

                  {/* Link */}
                  {card.link && (
                    <a
                      href={card.link}
                      className="text-sm font-semibold hover:underline"
                      style={{ color: scheme.primary }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {card.linkText || 'Learn More'} →
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { CategorySectionProps } from '@/types/component.types';
import {
  getBorderRadius,
  getScrollAnimation,
  getSpacing,
  getColorScheme,
} from '@/utils/designSystem';

interface PreviewProps {
  id: string;
  props: CategorySectionProps;
  isSelected: boolean;
  onSelect: () => void;
}

export const CategorySectionPreview: React.FC<PreviewProps> = ({
  id: _id,
  props,
  isSelected: isSectionSelected,
  onSelect,
}) => {
  const {
    heading = 'Top Categories',
    subheading,
    categories = [],
    backgroundColor = '#FFFFFF',
    layout = 'pills',
    allowMultiSelect = false,
    borderRadius = 'full',
    scrollAnimation = 'slide-up',
    staggerDelay = 50,
    colorScheme = 'vibrant',
    spacing = 'normal',
  } = props;

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const animation = getScrollAnimation(scrollAnimation);
  const scheme = getColorScheme(colorScheme);

  const handleCategoryClick = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (allowMultiSelect) {
      setSelectedCategories((prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev, categoryId]
      );
    } else {
      setSelectedCategories([categoryId]);
    }
  };

  const isCategorySelected = (categoryId: string) => selectedCategories.includes(categoryId);

  return (
    <div
      ref={ref}
      onClick={onSelect}
      className={cn(
        'relative cursor-pointer transition-all',
        isSectionSelected && 'ring-4 ring-blue-500 ring-offset-2'
      )}
      style={{ backgroundColor }}
    >
      <div className={cn('py-12 px-4 md:px-8', getSpacing(spacing))}>
        {/* Header */}
        <div className="text-center mb-10">
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

        {/* Pills Layout */}
        {layout === 'pills' && (
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={animation.initial}
                animate={isInView ? animation.animate : animation.initial}
                transition={{ duration: 0.4, delay: 0.2 + index * (staggerDelay / 1000) }}
                onClick={(e) => handleCategoryClick(category.id, e)}
                className={cn(
                  'px-6 py-3 font-semibold transition-all duration-300',
                  getBorderRadius(borderRadius),
                  isCategorySelected(category.id)
                    ? 'text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 shadow hover:shadow-md hover:scale-105'
                )}
                style={{
                  backgroundColor: isCategorySelected(category.id)
                    ? category.color || scheme.primary
                    : undefined,
                }}
              >
                {category.icon && <span className="mr-2">{category.icon}</span>}
                {category.label}
                {category.count !== undefined && (
                  <span
                    className={cn(
                      'ml-2 px-2 py-0.5 rounded-full text-xs',
                      isCategorySelected(category.id)
                        ? 'bg-white/30'
                        : 'bg-gray-100'
                    )}
                  >
                    {category.count}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        )}

        {/* Cards Layout */}
        {layout === 'cards' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={animation.initial}
                animate={isInView ? animation.animate : animation.initial}
                transition={{ duration: 0.4, delay: 0.2 + index * (staggerDelay / 1000) }}
                onClick={(e) => handleCategoryClick(category.id, e)}
                className={cn(
                  'p-6 text-center cursor-pointer transition-all duration-300',
                  'bg-white shadow-md hover:shadow-xl rounded-2xl',
                  isCategorySelected(category.id) && 'ring-4 scale-105'
                )}
                style={{
                  borderColor: isCategorySelected(category.id) ? category.color || scheme.primary : undefined,
                }}
              >
                {category.icon && (
                  <div
                    className="text-5xl mb-3 p-4 rounded-full inline-block"
                    style={{ backgroundColor: category.color || scheme.primary + '20' }}
                  >
                    {category.icon}
                  </div>
                )}
                <div className="text-lg font-bold text-gray-900 mb-1">{category.label}</div>
                {category.count !== undefined && (
                  <div className="text-sm text-gray-600">{category.count} items</div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Buttons Layout */}
        {layout === 'buttons' && (
          <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={animation.initial}
                animate={isInView ? animation.animate : animation.initial}
                transition={{ duration: 0.4, delay: 0.2 + index * (staggerDelay / 1000) }}
                onClick={(e) => handleCategoryClick(category.id, e)}
                className={cn(
                  'px-8 py-4 font-bold text-lg rounded-xl transition-all duration-300',
                  'border-2 hover:scale-105',
                  isCategorySelected(category.id)
                    ? 'text-white shadow-xl'
                    : 'bg-white text-gray-700 hover:shadow-lg'
                )}
                style={{
                  backgroundColor: isCategorySelected(category.id) ? category.color || scheme.primary : undefined,
                  borderColor: category.color || scheme.primary,
                }}
              >
                {category.icon && <span className="mr-2 text-2xl">{category.icon}</span>}
                {category.label}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


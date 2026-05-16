import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { MenuSectionProps } from '@/types/component.types';
import { extractTextStyle, getTextStyle } from '@/utils/textStyles';

interface PreviewProps {
  id: string;
  props: MenuSectionProps;
  isSelected: boolean;
  onSelect: () => void;
}

export const MenuSectionPreview: React.FC<PreviewProps> = ({
  id: _id,
  props,
  isSelected,
  onSelect,
}) => {
  const {
    heading = 'Our Menu',
    subheading = 'Discover our delicious offerings',
    menuItems = [],
    categories = ['All'],
    backgroundColor = '#ffffff',
  } = props;

  const [activeCategory, setActiveCategory] = useState(categories[0] || 'All');

  const filteredItems =
    activeCategory === 'All'
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <div
      onClick={onSelect}
      className={cn(
        'relative cursor-pointer transition-all group',
        isSelected && 'ring-4 ring-blue-500 ring-offset-2'
      )}
    >
      {/* Menu Section Content */}
      <div
        className="py-12 sm:py-16 px-4 sm:px-6 md:px-8"
        style={{ backgroundColor }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-blue-600 font-semibold mb-2 uppercase tracking-wide text-sm sm:text-base break-words"
              style={getTextStyle(extractTextStyle(props, 'subheading'))}
            >
              {subheading}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 break-words"
              style={getTextStyle(extractTextStyle(props, 'heading'))}
            >
              {heading}
            </motion.h2>
          </div>

          {/* Category Tabs */}
          {categories.length > 0 && (
            <div className="flex justify-center gap-2 mb-8 sm:mb-12 flex-wrap px-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCategory(category);
                  }}
                  className={cn(
                    'px-4 sm:px-6 py-2 rounded-full font-medium transition-all text-sm sm:text-base break-words',
                    activeCategory === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* Menu Items */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                  >
                    <div className="flex gap-3 sm:gap-4">
                      {/* Image */}
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 sm:w-32 sm:h-32 object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0">
                          <span className="text-3xl sm:text-4xl">🍽️</span>
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 p-3 sm:p-4 min-w-0">
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 break-words">
                            {item.name}
                          </h3>
                          <span className="text-blue-600 font-bold text-base sm:text-lg whitespace-nowrap flex-shrink-0">
                            {item.price}
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs sm:text-sm break-words">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 px-4">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-gray-600 font-medium break-words">
                No menu items added yet. Add items in the properties panel.
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


import React from 'react';
import { motion } from 'framer-motion';
import { Tag, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OffersSectionProps } from '@/types/component.types';
import { extractTextStyle, getTextStyle } from '@/utils/textStyles';

interface PreviewProps {
  id: string;
  props: OffersSectionProps;
  isSelected: boolean;
  onSelect: () => void;
}

export const OffersSectionPreview: React.FC<PreviewProps> = ({
  id: _id,
  props,
  isSelected,
  onSelect,
}) => {
  const {
    heading = 'Special Offers',
    subheading = 'Limited time deals',
    offers = [],
    backgroundColor = '#ffffff',
  } = props;

  return (
    <div
      onClick={onSelect}
      className={cn(
        'relative cursor-pointer transition-all group',
        isSelected && 'ring-4 ring-blue-500 ring-offset-2'
      )}
    >
      {/* Offers Section Content */}
      <div
        className="py-12 sm:py-16 px-4 sm:px-6 md:px-8"
        style={{ backgroundColor }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
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

          {/* Offers Grid */}
          {offers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {offers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group/card"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    {offer.image ? (
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-40 sm:h-48 object-cover transition-transform group-hover/card:scale-110"
                      />
                    ) : (
                      <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <span className="text-5xl sm:text-6xl">🎁</span>
                      </div>
                    )}

                    {/* Discount Badge */}
                    {offer.discount && (
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-red-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold shadow-lg">
                        <div className="flex items-center gap-1">
                          <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm break-words">{offer.discount}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 break-words">
                      {offer.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed break-words">
                      {offer.description}
                    </p>

                    {/* Valid Until */}
                    {offer.validUntil && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 border-t border-gray-100 pt-3 sm:pt-4">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="break-words">Valid until {offer.validUntil}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 px-4">
              <div className="text-6xl mb-4">🎁</div>
              <p className="text-gray-600 font-medium break-words">
                No offers added yet. Add offers in the properties panel.
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

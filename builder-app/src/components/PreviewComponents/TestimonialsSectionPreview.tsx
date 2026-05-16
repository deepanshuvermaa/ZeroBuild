import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TestimonialsSectionProps } from '@/types/component.types';
import { extractTextStyle, getTextStyle } from '@/utils/textStyles';

interface PreviewProps {
  id: string;
  props: TestimonialsSectionProps;
  isSelected: boolean;
  onSelect: () => void;
}

export const TestimonialsSectionPreview: React.FC<PreviewProps> = ({
  id: _id,
  props,
  isSelected,
  onSelect,
}) => {
  const {
    heading = 'Testimonials',
    subheading = 'What our customers say',
    testimonials = [],
    backgroundColor = '#f8fafc',
    layout = 'grid',
  } = props;

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'w-5 h-5',
              i < rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      onClick={onSelect}
      className={cn(
        'relative cursor-pointer transition-all group',
        isSelected && 'ring-4 ring-blue-500 ring-offset-2'
      )}
    >
      {/* Testimonials Section Content */}
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

          {/* Testimonials */}
          {testimonials.length > 0 ? (
            <div
              className={cn(
                'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8',
                layout === 'grid' ? 'md:grid-cols-3' : 'md:grid-cols-1 max-w-3xl mx-auto'
              )}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow"
                >
                  {/* Rating */}
                  <div className="mb-3 sm:mb-4">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Review */}
                  <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 italic leading-relaxed break-words">
                    "{testimonial.review}"
                  </p>

                  {/* Customer Info */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Photo */}
                    {testimonial.photo ? (
                      <img
                        src={testimonial.photo}
                        alt={testimonial.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {testimonial.name.charAt(0)}
                      </div>
                    )}

                    {/* Name & Position */}
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base break-words">
                        {testimonial.name}
                      </h4>
                      {testimonial.position && (
                        <p className="text-xs sm:text-sm text-gray-600 break-words">
                          {testimonial.position}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300 px-4">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-gray-600 font-medium break-words">
                No testimonials added yet. Add testimonials in the properties panel.
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

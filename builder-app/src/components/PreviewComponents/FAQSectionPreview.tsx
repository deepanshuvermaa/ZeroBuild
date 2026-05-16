import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { FAQSectionProps } from '@/types/component.types';
import {
  getCardStyle,
  getBorderRadius,
  getScrollAnimation,
  getSpacing,
  getColorScheme,
} from '@/utils/designSystem';

interface PreviewProps {
  id: string;
  props: FAQSectionProps;
  isSelected: boolean;
  onSelect: () => void;
}

export const FAQSectionPreview: React.FC<PreviewProps> = ({
  id: _id,
  props,
  isSelected,
  onSelect,
}) => {
  const {
    heading = 'Frequently Asked Questions',
    subheading,
    faqs = [],
    backgroundColor = '#FFFFFF',
    layout = 'accordion',
    cardStyle = 'elevated',
    borderRadius = 'lg',
    scrollAnimation = 'slide-up',
    staggerDelay = 100,
    colorScheme = 'professional',
    spacing = 'normal',
  } = props;

  const [openIds, setOpenIds] = useState<string[]>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const animation = getScrollAnimation(scrollAnimation);
  const scheme = getColorScheme(colorScheme);

  const toggleFAQ = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((faqId) => faqId !== id) : [...prev, id]
    );
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

        {/* Accordion Layout */}
        {layout === 'accordion' && (
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <motion.div
                  key={faq.id}
                  initial={animation.initial}
                  animate={isInView ? animation.animate : animation.initial}
                  transition={{ duration: 0.4, delay: 0.2 + index * (staggerDelay / 1000) }}
                  className={cn(
                    'overflow-hidden',
                    getCardStyle(cardStyle),
                    getBorderRadius(borderRadius)
                  )}
                >
                  <button
                    onClick={(e) => toggleFAQ(faq.id, e)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </span>
                    <motion.svg
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: scheme.primary }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </motion.svg>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pt-2">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Grid Layout */}
        {layout === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={animation.initial}
                animate={isInView ? animation.animate : animation.initial}
                transition={{ duration: 0.4, delay: 0.2 + index * (staggerDelay / 1000) }}
                className={cn(
                  'p-6',
                  getCardStyle(cardStyle),
                  getBorderRadius(borderRadius),
                  'hover:shadow-xl transition-shadow'
                )}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

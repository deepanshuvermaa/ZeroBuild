import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { PricingSectionProps } from '@/types/component.types';
import {
  getCardStyle,
  getBorderRadius,
  getShadowSize,
  getHoverEffect,
  getScrollAnimation,
  getButtonStyle,
  getSpacing,
  getColorScheme,
} from '@/utils/designSystem';

interface PreviewProps {
  id: string;
  props: PricingSectionProps;
  isSelected: boolean;
  onSelect: () => void;
}

export const PricingSectionPreview: React.FC<PreviewProps> = ({
  id: _id,
  props,
  isSelected,
  onSelect,
}) => {
  const {
    heading = 'Choose Your Plan',
    subheading,
    plans = [],
    backgroundColor = '#FFFFFF',
    billingToggle = false,
    cardStyle = 'elevated',
    borderRadius = 'xl',
    shadowSize = 'lg',
    hoverEffect = 'lift',
    scrollAnimation = 'slide-up',
    staggerDelay = 150,
    buttonStyle = 'solid',
    buttonSize = 'lg',
    colorScheme = 'professional',
    spacing = 'relaxed',
  } = props;

  const [isAnnual, setIsAnnual] = useState(true);
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
      <div className={cn('py-16 px-4 md:px-8', getSpacing(spacing))}>
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
              className="text-lg text-gray-600 mb-8"
            >
              {subheading}
            </motion.p>
          )}

          {/* Billing Toggle */}
          {billingToggle && (
            <motion.div
              initial={animation.initial}
              animate={isInView ? animation.animate : animation.initial}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-gray-100 p-1 rounded-full"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAnnual(false);
                }}
                className={cn(
                  'px-6 py-2 rounded-full font-semibold transition-all',
                  !isAnnual ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                )}
              >
                Monthly
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAnnual(true);
                }}
                className={cn(
                  'px-6 py-2 rounded-full font-semibold transition-all',
                  isAnnual ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                )}
              >
                Annual
                <span className="ml-2 text-xs text-green-600">Save 20%</span>
              </button>
            </motion.div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={animation.initial}
              animate={isInView ? animation.animate : animation.initial}
              transition={{ duration: 0.5, delay: 0.3 + index * (staggerDelay / 1000) }}
              className={cn(
                'relative p-8',
                getCardStyle(plan.recommended ? 'gradient' : cardStyle),
                getBorderRadius(borderRadius),
                getShadowSize(plan.recommended ? '2xl' : shadowSize),
                getHoverEffect(hoverEffect),
                plan.recommended && 'scale-105'
              )}
              style={{
                backgroundColor: plan.recommended ? undefined : undefined,
              }}
            >
              {/* Recommended Badge */}
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span
                    className="px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                    style={{ backgroundColor: scheme.accent }}
                  >
                    RECOMMENDED
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3
                className={cn(
                  'text-2xl font-bold mb-2',
                  plan.recommended ? 'text-white' : 'text-gray-900'
                )}
              >
                {plan.name}
              </h3>

              {/* Description */}
              {plan.description && (
                <p className={cn('text-sm mb-6', plan.recommended ? 'text-white/80' : 'text-gray-600')}>
                  {plan.description}
                </p>
              )}

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span
                    className={cn(
                      'text-5xl font-bold',
                      plan.recommended ? 'text-white' : 'text-gray-900'
                    )}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className={cn(
                        'ml-2 text-lg',
                        plan.recommended ? 'text-white/70' : 'text-gray-600'
                      )}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg
                      className={cn(
                        'w-5 h-5 flex-shrink-0 mt-0.5',
                        plan.recommended ? 'text-white' : 'text-green-500'
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span
                      className={cn(
                        'text-sm',
                        plan.recommended ? 'text-white' : 'text-gray-700'
                      )}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  'w-full',
                  plan.recommended
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : getButtonStyle(buttonStyle, buttonSize)
                )}
              >
                {plan.ctaText || 'Get Started'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};


import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ProfileSectionProps } from '@/types/component.types';
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
  props: ProfileSectionProps;
  isSelected: boolean;
  onSelect: () => void;
}

export const ProfileSectionPreview: React.FC<PreviewProps> = ({
  id: _id,
  props,
  isSelected,
  onSelect,
}) => {
  const {
    heading = 'Meet Our Mentors',
    subheading,
    profiles = [],
    backgroundColor = '#FFFFFF',
    columns = 3,
    showRating = true,
    showSocial = false,
    cardStyle = 'elevated',
    borderRadius = '2xl',
    shadowSize = 'lg',
    hoverEffect = 'lift',
    scrollAnimation = 'fade',
    staggerDelay = 100,
    colorScheme = 'professional',
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

        {/* Profiles Grid */}
        <div className={cn('grid gap-8 max-w-6xl mx-auto', gridColumns[columns])}>
          {profiles.map((profile, index) => (
            <motion.div
              key={profile.id}
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
              {/* Photo */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {/* Online indicator */}
                  <div
                    className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white"
                    style={{ backgroundColor: scheme.accent }}
                  />
                </div>
              </div>

              {/* Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h3>

              {/* Role */}
              <p
                className="text-sm font-semibold mb-3"
                style={{ color: scheme.primary }}
              >
                {profile.role}
              </p>

              {/* Bio */}
              {profile.bio && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{profile.bio}</p>
              )}

              {/* Rating */}
              {showRating && profile.rating !== undefined && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          'text-lg',
                          i < profile.rating! ? 'text-yellow-400' : 'text-gray-300'
                        )}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {profile.rating.toFixed(1)}
                  </span>
                  {profile.reviews && (
                    <span className="text-sm text-gray-500">({profile.reviews})</span>
                  )}
                </div>
              )}

              {/* Social Links */}
              {showSocial && profile.social && profile.social.length > 0 && (
                <div className="flex justify-center gap-3 pt-4 border-t border-gray-100">
                  {profile.social.map((social, i) => (
                    <a
                      key={i}
                      href={social.url}
                      onClick={(e) => e.stopPropagation()}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                      style={{ backgroundColor: scheme.primary }}
                    >
                      {social.platform[0].toUpperCase()}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};


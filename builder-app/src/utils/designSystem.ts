import type { AdvancedStyleProps } from '@/types/component.types';

// Color Palettes
export const colorPalettes = {
  warm: {
    primary: '#F59E0B',
    secondary: '#F97316',
    accent: '#FDE047',
    gradient: { from: '#FBBF24', to: '#F97316' },
  },
  cool: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#06B6D4',
    gradient: { from: '#3B82F6', to: '#8B5CF6' },
  },
  professional: {
    primary: '#1E40AF',
    secondary: '#475569',
    accent: '#0EA5E9',
    gradient: { from: '#1E293B', to: '#475569' },
  },
  vibrant: {
    primary: '#EC4899',
    secondary: '#8B5CF6',
    accent: '#F59E0B',
    gradient: { from: '#EC4899', to: '#8B5CF6' },
  },
  pastel: {
    primary: '#C7D2FE',
    secondary: '#FBCFE8',
    accent: '#BAE6FD',
    gradient: { from: '#C7D2FE', to: '#FBCFE8' },
  },
  dark: {
    primary: '#1F2937',
    secondary: '#374151',
    accent: '#60A5FA',
    gradient: { from: '#111827', to: '#374151' },
  },
};

// Get card style classes
export const getCardStyle = (style: AdvancedStyleProps['cardStyle'] = 'elevated'): string => {
  const styles = {
    flat: 'bg-white',
    elevated: 'bg-white shadow-lg',
    glass: 'bg-white/70 backdrop-blur-md border border-white/20 shadow-xl',
    neumorphic: 'bg-gray-100 shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff]',
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white',
    outline: 'bg-transparent border-2 border-gray-300',
  };
  return styles[style] || styles.elevated;
};

// Get border radius classes
export const getBorderRadius = (radius: AdvancedStyleProps['borderRadius'] = 'lg'): string => {
  const radii = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };
  return radii[radius] || radii.lg;
};

// Get shadow classes
export const getShadowSize = (size: AdvancedStyleProps['shadowSize'] = 'md'): string => {
  const shadows = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
    inner: 'shadow-inner',
  };
  return shadows[size] || shadows.md;
};

// Get hover effect classes
export const getHoverEffect = (effect: AdvancedStyleProps['hoverEffect'] = 'lift'): string => {
  const effects = {
    scale: 'hover:scale-105 transition-transform duration-300',
    lift: 'hover:-translate-y-2 hover:shadow-2xl transition-all duration-300',
    glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-shadow duration-300',
    rotate: 'hover:rotate-2 transition-transform duration-300',
    tilt: 'hover:rotate-1 hover:scale-105 transition-all duration-300',
    none: '',
  };
  return effects[effect] || effects.lift;
};

// Get scroll animation variants for Framer Motion
export const getScrollAnimation = (
  animation: AdvancedStyleProps['scrollAnimation'] = 'fade'
) => {
  const animations = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    'slide-up': {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
    },
    'slide-left': {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
    },
    'slide-right': {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
    },
    zoom: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
    },
    flip: {
      initial: { opacity: 0, rotateX: -90 },
      animate: { opacity: 1, rotateX: 0 },
    },
    none: {
      initial: {},
      animate: {},
    },
  };
  return animations[animation] || animations.fade;
};

// Get button style classes
export const getButtonStyle = (
  style: AdvancedStyleProps['buttonStyle'] = 'solid',
  size: AdvancedStyleProps['buttonSize'] = 'md'
): string => {
  const styles = {
    solid: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    ghost: 'text-blue-600 hover:bg-blue-50',
    gradient: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700',
    glass: 'bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  return `${styles[style] || styles.solid} ${sizes[size] || sizes.md} rounded-lg font-semibold transition-all duration-300`;
};

// Get spacing classes
export const getSpacing = (spacing: AdvancedStyleProps['spacing'] = 'normal'): string => {
  const spacings = {
    compact: 'gap-2 p-4',
    normal: 'gap-4 p-6',
    relaxed: 'gap-6 p-8',
    loose: 'gap-8 p-12',
  };
  return spacings[spacing] || spacings.normal;
};

// Get color scheme
export const getColorScheme = (scheme: AdvancedStyleProps['colorScheme'] = 'professional') => {
  return colorPalettes[scheme] || colorPalettes.professional;
};

// Get gradient classes
export const getGradientClasses = (
  from: string = '#3B82F6',
  to: string = '#8B5CF6',
  direction: AdvancedStyleProps['gradientDirection'] = 'to-br'
): string => {
  return `bg-gradient-${direction}`;
};

// Animation variants for click animations
export const getClickAnimation = (animation: AdvancedStyleProps['clickAnimation'] = 'pulse') => {
  const animations = {
    ripple: {
      whileTap: { scale: 0.95 },
    },
    pulse: {
      whileTap: { scale: 1.05 },
    },
    bounce: {
      whileTap: { y: -5 },
    },
    shake: {
      whileTap: { x: [-2, 2, -2, 2, 0] },
    },
    none: {},
  };
  return animations[animation] || animations.pulse;
};

// Get border width classes
export const getBorderWidth = (width: AdvancedStyleProps['borderWidth'] = 'none'): string => {
  const widths = {
    none: 'border-0',
    thin: 'border',
    medium: 'border-2',
    thick: 'border-4',
  };
  return widths[width] || widths.none;
};

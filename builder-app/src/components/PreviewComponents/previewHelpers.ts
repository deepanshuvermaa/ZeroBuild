/**
 * Preview Component Utilities
 * Helper functions for preview components
 */

/**
 * Generates a placeholder image URL using a placeholder service
 * @param width - Image width
 * @param height - Image height
 * @param text - Optional text to display
 * @returns Placeholder image URL
 */
export const getPlaceholderImage = (
  width: number,
  height: number,
  text?: string
): string => {
  const displayText = text || `${width}x${height}`;
  return `https://via.placeholder.com/${width}x${height}/e2e8f0/64748b?text=${encodeURIComponent(displayText)}`;
};

/**
 * Truncates text to a specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Formats a phone number for WhatsApp
 * @param phoneNumber - Phone number with any format
 * @returns Cleaned phone number (digits only)
 */
export const formatWhatsAppNumber = (phoneNumber: string): string => {
  return phoneNumber.replace(/\D/g, '');
};

/**
 * Generates a WhatsApp link
 * @param phoneNumber - Phone number
 * @param message - Pre-filled message
 * @returns WhatsApp URL
 */
export const getWhatsAppLink = (
  phoneNumber: string,
  message?: string
): string => {
  const cleanNumber = formatWhatsAppNumber(phoneNumber);
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${cleanNumber}${encodedMessage}`;
};

/**
 * Validates if an image URL is valid
 * @param url - Image URL
 * @returns Boolean indicating if URL is valid
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  } catch {
    return false;
  }
};

/**
 * Gets initials from a name for avatar fallback
 * @param name - Full name
 * @returns Initials (max 2 characters)
 */
export const getInitials = (name: string): string => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Generates a gradient background color based on a string
 * @param str - String to generate color from
 * @returns CSS gradient string
 */
export const getGradientFromString = (str: string): string => {
  const colors = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-green-400 to-green-600',
    'from-yellow-400 to-yellow-600',
    'from-red-400 to-red-600',
    'from-indigo-400 to-indigo-600',
    'from-teal-400 to-teal-600',
  ];

  const hash = str.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  return colors[Math.abs(hash) % colors.length];
};

/**
 * Formats a date string for display
 * @param dateString - Date string
 * @returns Formatted date
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

/**
 * Checks if a color is light or dark
 * @param color - Hex color code
 * @returns 'light' | 'dark'
 */
export const getColorBrightness = (color: string): 'light' | 'dark' => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155 ? 'light' : 'dark';
};

/**
 * Gets contrasting text color for a background
 * @param backgroundColor - Hex background color
 * @returns Contrasting text color
 */
export const getContrastingTextColor = (backgroundColor: string): string => {
  const brightness = getColorBrightness(backgroundColor);
  return brightness === 'light' ? '#000000' : '#ffffff';
};

/**
 * Safely parses JSON with fallback
 * @param jsonString - JSON string
 * @param fallback - Fallback value
 * @returns Parsed object or fallback
 */
export const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
};

/**
 * Debounces a function
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Generates a unique ID
 * @param prefix - Optional prefix
 * @returns Unique ID string
 */
export const generateId = (prefix = 'preview'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Clamps a number between min and max
 * @param value - Number to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Checks if we're in a browser environment
 * @returns Boolean
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * Safely gets a nested property from an object
 * @param obj - Object to get property from
 * @param path - Path to property (e.g., 'user.name.first')
 * @param defaultValue - Default value if property doesn't exist
 * @returns Property value or default
 */
export const getNestedProperty = (
  obj: any,
  path: string,
  defaultValue: any = undefined
): any => {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) return defaultValue;
  }

  return result;
};

/**
 * Calculates reading time for text
 * @param text - Text content
 * @param wordsPerMinute - Reading speed (default: 200)
 * @returns Reading time in minutes
 */
export const calculateReadingTime = (
  text: string,
  wordsPerMinute = 200
): number => {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

/**
 * Formats a price
 * @param price - Price as number or string
 * @param currency - Currency symbol (default: '$')
 * @returns Formatted price string
 */
export const formatPrice = (
  price: number | string,
  currency = '$'
): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return price.toString();

  return `${currency}${numPrice.toFixed(2)}`;
};

/**
 * Checks if a string is a valid URL
 * @param str - String to check
 * @returns Boolean
 */
export const isValidUrl = (str: string): boolean => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

/**
 * Converts a file size in bytes to human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Copies text to clipboard
 * @param text - Text to copy
 * @returns Promise<boolean> indicating success
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!isBrowser()) return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }
};

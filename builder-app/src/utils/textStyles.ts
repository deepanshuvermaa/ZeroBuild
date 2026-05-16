import type { CSSProperties } from 'react';

interface TextStyleOptions {
  color?: string;
  size?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: 'left' | 'center' | 'right' | 'justify';
  fontFamily?: string;
}

/**
 * Generate inline CSS styles for text based on style options
 */
export const getTextStyle = (options: TextStyleOptions): CSSProperties => {
  const style: CSSProperties = {};

  if (options.color) {
    style.color = options.color;
  }

  if (options.size) {
    style.fontSize = options.size;
  }

  if (options.bold) {
    style.fontWeight = 'bold';
  }

  if (options.italic) {
    style.fontStyle = 'italic';
  }

  if (options.underline) {
    style.textDecoration = 'underline';
  }

  if (options.align) {
    style.textAlign = options.align;
  }

  if (options.fontFamily) {
    style.fontFamily = options.fontFamily;
  }

  return style;
};

/**
 * Extract text style options for a specific field from props
 */
export const extractTextStyle = (props: any, fieldKey: string): TextStyleOptions => {
  return {
    color: props[`${fieldKey}Color`],
    size: props[`${fieldKey}Size`],
    bold: props[`${fieldKey}Bold`],
    italic: props[`${fieldKey}Italic`],
    underline: props[`${fieldKey}Underline`],
    align: props[`${fieldKey}Align`],
    fontFamily: props[`${fieldKey}FontFamily`],
  };
};

/**
 * Get merged style object combining text styles with other inline styles
 */
export const mergeTextStyle = (
  baseStyle: CSSProperties,
  textStyleOptions: TextStyleOptions
): CSSProperties => {
  return {
    ...baseStyle,
    ...getTextStyle(textStyleOptions),
  };
};

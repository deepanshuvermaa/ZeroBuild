import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Pipette,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextStyleEditorProps {
  label: string;
  fieldKey: string;
  values: {
    color?: string;
    size?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    align?: 'left' | 'center' | 'right' | 'justify';
    fontFamily?: string;
  };
  onChange: (key: string, value: any) => void;
}

const FONT_FAMILIES = [
  { value: '', label: 'Default' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Courier New, monospace', label: 'Courier New' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: 'Impact, sans-serif', label: 'Impact' },
  { value: 'Comic Sans MS, cursive', label: 'Comic Sans' },
];

const FONT_SIZES = [
  { value: '12px', label: '12px' },
  { value: '14px', label: '14px' },
  { value: '16px', label: '16px' },
  { value: '18px', label: '18px' },
  { value: '20px', label: '20px' },
  { value: '24px', label: '24px' },
  { value: '28px', label: '28px' },
  { value: '32px', label: '32px' },
  { value: '36px', label: '36px' },
  { value: '40px', label: '40px' },
  { value: '48px', label: '48px' },
  { value: '56px', label: '56px' },
  { value: '64px', label: '64px' },
  { value: '72px', label: '72px' },
];

export const TextStyleEditor: React.FC<TextStyleEditorProps> = ({
  label,
  fieldKey,
  values,
  onChange,
}) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const color = values.color || '#000000';
  const size = values.size || '';
  const bold = values.bold || false;
  const italic = values.italic || false;
  const underline = values.underline || false;
  const align = values.align || 'left';
  const fontFamily = values.fontFamily || '';

  const handleColorChange = (newColor: string) => {
    onChange(`${fieldKey}Color`, newColor);
  };

  const handleSizeChange = (newSize: string) => {
    onChange(`${fieldKey}Size`, newSize);
  };

  const handleBoldToggle = () => {
    onChange(`${fieldKey}Bold`, !bold);
  };

  const handleItalicToggle = () => {
    onChange(`${fieldKey}Italic`, !italic);
  };

  const handleUnderlineToggle = () => {
    onChange(`${fieldKey}Underline`, !underline);
  };

  const handleAlignChange = (newAlign: 'left' | 'center' | 'right' | 'justify') => {
    onChange(`${fieldKey}Align`, newAlign);
  };

  const handleFontFamilyChange = (newFontFamily: string) => {
    onChange(`${fieldKey}FontFamily`, newFontFamily);
  };

  return (
    <div className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full mb-2"
      >
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {label} Styles
          </span>
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-gray-500 transition-transform',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3 overflow-hidden"
          >
            {/* Color Picker */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Color
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                  className={cn(
                    'flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-gray-300',
                    'bg-white hover:bg-gray-50 transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500'
                  )}
                >
                  <div
                    className="w-5 h-5 rounded border border-gray-300 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="flex-1 text-left text-xs font-mono text-gray-700">
                    {color.toUpperCase()}
                  </span>
                  <Pipette className="h-3.5 w-3.5 text-gray-400" />
                </button>

                <AnimatePresence>
                  {isColorPickerOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsColorPickerOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 mt-2 p-3 bg-white rounded-lg shadow-xl border border-gray-200"
                      >
                        <HexColorPicker color={color} onChange={handleColorChange} />
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-600 mb-2">Preset Colors</p>
                          <div className="grid grid-cols-8 gap-1.5">
                            {[
                              '#000000', '#FFFFFF', '#EF4444', '#F59E0B',
                              '#10B981', '#3B82F6', '#8B5CF6', '#EC4899',
                              '#1F2937', '#6B7280', '#DC2626', '#D97706',
                              '#059669', '#2563EB', '#7C3AED', '#DB2777',
                            ].map((presetColor) => (
                              <button
                                key={presetColor}
                                onClick={() => {
                                  handleColorChange(presetColor);
                                  setIsColorPickerOpen(false);
                                }}
                                className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                                style={{ backgroundColor: presetColor }}
                                title={presetColor}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Font Size
              </label>
              <select
                value={size}
                onChange={(e) => handleSizeChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Default</option>
                {FONT_SIZES.map((fontSize) => (
                  <option key={fontSize.value} value={fontSize.value}>
                    {fontSize.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Font Family
              </label>
              <select
                value={fontFamily}
                onChange={(e) => handleFontFamilyChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {FONT_FAMILIES.map((font) => (
                  <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Text Formatting */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Text Style
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleBoldToggle}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border',
                    'transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
                    bold
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  )}
                  title="Bold"
                >
                  <Bold className="h-4 w-4" />
                  <span className="text-xs font-medium">B</span>
                </button>
                <button
                  onClick={handleItalicToggle}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border',
                    'transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
                    italic
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  )}
                  title="Italic"
                >
                  <Italic className="h-4 w-4" />
                  <span className="text-xs font-medium">I</span>
                </button>
                <button
                  onClick={handleUnderlineToggle}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border',
                    'transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
                    underline
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  )}
                  title="Underline"
                >
                  <Underline className="h-4 w-4" />
                  <span className="text-xs font-medium">U</span>
                </button>
              </div>
            </div>

            {/* Text Alignment */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Alignment
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAlignChange('left')}
                  className={cn(
                    'flex-1 flex items-center justify-center px-3 py-2 rounded-lg border',
                    'transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
                    align === 'left'
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  )}
                  title="Align Left"
                >
                  <AlignLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleAlignChange('center')}
                  className={cn(
                    'flex-1 flex items-center justify-center px-3 py-2 rounded-lg border',
                    'transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
                    align === 'center'
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  )}
                  title="Align Center"
                >
                  <AlignCenter className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleAlignChange('right')}
                  className={cn(
                    'flex-1 flex items-center justify-center px-3 py-2 rounded-lg border',
                    'transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
                    align === 'right'
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  )}
                  title="Align Right"
                >
                  <AlignRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleAlignChange('justify')}
                  className={cn(
                    'flex-1 flex items-center justify-center px-3 py-2 rounded-lg border',
                    'transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
                    align === 'justify'
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  )}
                  title="Justify"
                >
                  <AlignJustify className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

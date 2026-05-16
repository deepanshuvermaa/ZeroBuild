import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Pipette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2 rounded-lg border border-gray-300',
            'bg-white hover:bg-gray-50 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500'
          )}
        >
          <div
            className="w-6 h-6 rounded border border-gray-300 shadow-sm"
            style={{ backgroundColor: value }}
          />
          <span className="flex-1 text-left text-sm font-mono text-gray-700">
            {value.toUpperCase()}
          </span>
          <Pipette className="h-4 w-4 text-gray-400" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />

              {/* Color Picker Popover */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 mt-2 p-3 bg-white rounded-lg shadow-xl border border-gray-200"
              >
                <HexColorPicker color={value} onChange={onChange} />

                {/* Preset Colors */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">Preset Colors</p>
                  <div className="grid grid-cols-8 gap-1.5">
                    {[
                      '#000000',
                      '#FFFFFF',
                      '#EF4444',
                      '#F59E0B',
                      '#10B981',
                      '#3B82F6',
                      '#8B5CF6',
                      '#EC4899',
                      '#1F2937',
                      '#6B7280',
                      '#DC2626',
                      '#D97706',
                      '#059669',
                      '#2563EB',
                      '#7C3AED',
                      '#DB2777',
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          onChange(color);
                          setIsOpen(false);
                        }}
                        className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Manual Input */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#000000"
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

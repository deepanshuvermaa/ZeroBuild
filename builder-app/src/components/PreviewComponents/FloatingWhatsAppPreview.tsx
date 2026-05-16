import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FloatingWhatsAppProps } from '@/types/component.types';

interface PreviewProps {
  id: string;
  props: FloatingWhatsAppProps;
  isSelected: boolean;
  onSelect: () => void;
}

export const FloatingWhatsAppPreview: React.FC<PreviewProps> = ({
  id: _id,
  props,
  isSelected,
  onSelect,
}) => {
  const {
    phoneNumber = '+1234567890',
    message = 'Hello! I would like to know more about your services.',
    position = 'bottom-right',
  } = props;

  const positionClasses = {
    'bottom-right': 'bottom-8 right-8',
    'bottom-left': 'bottom-8 left-8',
  };

  return (
    <div
      onClick={onSelect}
      className={cn(
        'relative cursor-pointer transition-all group',
        'min-h-[200px]',
        isSelected && 'ring-4 ring-blue-500 ring-offset-2'
      )}
    >
      {/* Preview Note */}
      <div className="flex items-center justify-center min-h-[200px] bg-gray-50 border-2 border-dashed border-gray-300">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
          <p className="text-gray-700 font-medium mb-1">
            Floating WhatsApp Button
          </p>
          <p className="text-sm text-gray-500">
            This will appear fixed on the published page
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Position: {position === 'bottom-right' ? 'Bottom Right' : 'Bottom Left'}
          </p>
        </div>
      </div>

      {/* Actual WhatsApp Button - Positioned */}
      <motion.a
        href={`https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'fixed z-50 group/whatsapp',
          positionClasses[position]
        )}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 0.5,
        }}
      >
        {/* Pulse Animation */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />

        {/* Button */}
        <div className="relative w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center transition-colors">
          <MessageCircle className="w-7 h-7 text-white" />
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full mb-2 right-0 opacity-0 group-hover/whatsapp:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
            Chat with us on WhatsApp
          </div>
        </div>
      </motion.a>

      {/* Hover Indicator */}
      <div className="absolute inset-0 border-2 border-dashed border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

    </div>
  );
};


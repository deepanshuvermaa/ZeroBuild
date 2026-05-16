import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  showClose?: boolean;
  size?: 'default' | 'large';
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  showClose = true,
  size = 'default',
}) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2',
                  'rounded-xl bg-white p-6 shadow-xl',
                  size === 'default' && 'max-w-lg',
                  size === 'large' && 'max-w-6xl',
                  className
                )}
              >
                {showClose && (
                  <DialogPrimitive.Close
                    className={cn(
                      'absolute right-4 top-4 rounded-lg p-1',
                      'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500'
                    )}
                  >
                    <X className="h-4 w-4" />
                  </DialogPrimitive.Close>
                )}

                {title && (
                  <DialogPrimitive.Title className="text-xl font-semibold text-gray-900 mb-2">
                    {title}
                  </DialogPrimitive.Title>
                )}

                {description && (
                  <DialogPrimitive.Description className="text-sm text-gray-500 mb-4">
                    {description}
                  </DialogPrimitive.Description>
                )}

                {children}
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};

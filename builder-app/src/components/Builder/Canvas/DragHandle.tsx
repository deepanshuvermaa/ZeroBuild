import React from 'react';
import { GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DragHandleProps {
  className?: string;
}

export const DragHandle: React.FC<DragHandleProps> = ({ className }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={cn(
        'flex items-center justify-center rounded cursor-grab active:cursor-grabbing',
        'bg-gray-100 hover:bg-gray-200 transition-colors',
        'p-1',
        className
      )}
    >
      <GripVertical className="h-4 w-4 text-gray-600" />
    </motion.div>
  );
};

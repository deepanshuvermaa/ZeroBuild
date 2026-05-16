import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import type { ComponentDefinition } from '@/types/component.types';
import { cn } from '@/lib/utils';

interface ComponentCardProps {
  definition: ComponentDefinition;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({ definition }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `component-${definition.type}`,
    data: {
      type: 'new-component',
      componentType: definition.type,
      defaultProps: definition.defaultProps,
    },
  });

  return (
    <motion.div
      ref={setNodeRef}
      whileHover={{ scale: isDragging ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'group relative cursor-grab rounded-lg border-2 border-gray-200 bg-white p-3',
        'transition-all duration-200 hover:border-blue-400 hover:shadow-md',
        'active:cursor-grabbing',
        isDragging && 'opacity-50 cursor-grabbing'
      )}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-2xl">{definition.icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
            {definition.label}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2">
            {definition.description}
          </p>
        </div>
        <GripVertical className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>
    </motion.div>
  );
};

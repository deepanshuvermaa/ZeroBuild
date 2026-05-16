import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2 } from 'lucide-react';
import type { PageSection } from '@/types/component.types';
import { useBuilderStore } from '@/store/builderStore';
import { DragHandle } from './DragHandle';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  section: PageSection;
  children: React.ReactNode;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  section,
  children,
}) => {
  const { selectedSectionId, setSelectedSection, deleteSection } = useBuilderStore();
  const isSelected = selectedSectionId === section.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
    data: {
      type: 'section',
      section,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't select if clicking on delete button or drag handle
    if ((e.target as HTMLElement).closest('[data-no-select]')) {
      return;
    }
    setSelectedSection(section.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this section?')) {
      deleteSection(section.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative transition-all duration-200',
        isDragging && 'opacity-50 z-50'
      )}
    >

      {/* Hover Controls */}
      <div
        className={cn(
          'absolute -top-10 left-1/2 -translate-x-1/2 z-20',
          'flex items-center gap-2 px-3 py-1.5 rounded-lg',
          'bg-gray-900 text-white shadow-lg',
          'opacity-0 group-hover:opacity-100 transition-opacity',
          isSelected && 'opacity-100'
        )}
      >
        <div data-no-select {...attributes} {...listeners}>
          <DragHandle className="bg-transparent hover:bg-gray-700" />
        </div>

        <div className="text-xs font-medium border-l border-gray-700 pl-2">
          {section.type}
        </div>

        <button
          data-no-select
          onClick={handleDelete}
          className="p-1 rounded hover:bg-red-600 transition-colors ml-1"
          title="Delete section"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Content */}
      <div
        onClick={handleClick}
        className="relative"
      >
        {children}
      </div>
    </div>
  );
};

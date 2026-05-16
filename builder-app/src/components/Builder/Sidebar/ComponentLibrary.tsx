import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { componentDefinitions } from '@/utils/componentDefinitions';
import { ComponentCard } from './ComponentCard';
import { Input } from '@/components/shared/Input';

const categories = [
  { id: 'hero', label: 'Hero Sections', icon: '🎯' },
  { id: 'content', label: 'Content Sections', icon: '📝' },
  { id: 'interactive', label: 'Interactive', icon: '✨' },
  { id: 'footer', label: 'Footer', icon: '📄' },
  { id: 'utility', label: 'Utilities', icon: '🔧' },
] as const;

export const ComponentLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map((c) => c.id))
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const filteredComponents = componentDefinitions.filter((def) =>
    def.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    def.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const componentsByCategory = categories.map((category) => ({
    ...category,
    components: filteredComponents.filter((def) => def.category === category.id),
  }));

  return (
    <div className="flex h-full flex-col bg-gray-50 border-r border-gray-200">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Components</h2>
        <Input
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {componentsByCategory.map((category) => {
            const isExpanded = expandedCategories.has(category.id);
            const hasComponents = category.components.length > 0;

            if (!hasComponents && searchQuery) return null;

            return (
              <div key={category.id} className="space-y-2">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="flex w-full items-center gap-2 text-left group"
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="flex-1 text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                    {category.label}
                  </span>
                  <span className="text-xs text-gray-500">
                    {category.components.length}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 pl-2">
                        {category.components.map((definition) => (
                          <ComponentCard
                            key={definition.type}
                            definition={definition}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {filteredComponents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No components found</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Tip */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white p-3">
        <p className="text-xs text-gray-500 text-center">
          Drag components to the canvas
        </p>
      </div>
    </div>
  );
};

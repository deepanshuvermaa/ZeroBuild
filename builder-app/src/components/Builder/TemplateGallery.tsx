import React, { useState } from 'react';
import { Dialog } from '@/components/shared/Dialog';
import { Button } from '@/components/shared/Button';
import { templates, type Template } from '@/data/templates';
import { useBuilderStore } from '@/store/builderStore';
import { useHistoryStore } from '@/store/historyStore';
import { cn } from '@/lib/utils';
import { Sparkles, Check } from 'lucide-react';

interface TemplateGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ open, onOpenChange }) => {
  const { config, setConfig } = useBuilderStore();
  const { recordState, clearHistory } = useHistoryStore();
  const [selectedCategory, setSelectedCategory] = useState<Template['category'] | 'all'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const categories: Array<{ value: Template['category'] | 'all'; label: string }> = [
    { value: 'all', label: 'All Templates' },
    { value: 'professional', label: 'Professional' },
    { value: 'modern', label: 'Modern' },
    { value: 'classic', label: 'Classic' },
    { value: 'minimalist', label: 'Minimalist' },
  ];

  const filteredTemplates =
    selectedCategory === 'all'
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  const handleUseTemplate = (template: Template) => {
    if (
      config.sections.length > 0 &&
      !window.confirm('This will replace your current project. Continue?')
    ) {
      return;
    }

    recordState(config);
    setConfig(template.config);
    clearHistory();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Template Gallery"
      description="Choose a professionally designed template to get started quickly"
      size="large"
    >
      <div className="space-y-6">
        {/* Category Filters */}
        <div className="flex gap-2 flex-wrap border-b pb-4">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                selectedCategory === cat.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto pr-2">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={cn(
                'group relative border-2 rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-xl',
                selectedTemplate === template.id
                  ? 'border-blue-600 ring-4 ring-blue-100'
                  : 'border-gray-200 hover:border-blue-400'
              )}
              onClick={() => setSelectedTemplate(template.id)}
            >
              {/* Thumbnail */}
              <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {/* Gradient overlay on hover only */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white text-center">{template.name}</h3>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 bg-white">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <span
                    className={cn(
                      'px-2 py-1 text-xs rounded-full',
                      template.category === 'professional' &&
                        'bg-blue-100 text-blue-700',
                      template.category === 'modern' && 'bg-purple-100 text-purple-700',
                      template.category === 'classic' && 'bg-amber-100 text-amber-700',
                      template.category === 'minimalist' &&
                        'bg-gray-100 text-gray-700'
                    )}
                  >
                    {template.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                {/* Preview Info */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{template.config.sections.length} sections</span>
                  {selectedTemplate === template.id && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="primary"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseTemplate(template);
                  }}
                >
                  Use Template
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Sparkles className="h-4 w-4" />
            <span>{filteredTemplates.length} templates available</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {selectedTemplate && (
              <Button
                variant="primary"
                onClick={() => {
                  const template = templates.find((t) => t.id === selectedTemplate);
                  if (template) handleUseTemplate(template);
                }}
              >
                Use Selected Template
              </Button>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

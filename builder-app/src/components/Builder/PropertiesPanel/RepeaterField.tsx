import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { cn } from '@/lib/utils';

interface RepeaterFieldProps {
  label: string;
  value: any[];
  onChange: (value: any[]) => void;
  itemLabel: string;
  fields: {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'number';
    placeholder?: string;
  }[];
  addButtonText?: string;
}

export const RepeaterField: React.FC<RepeaterFieldProps> = ({
  label,
  value = [],
  onChange,
  itemLabel,
  fields,
  addButtonText = 'Add Item',
}) => {
  const [expandedItems, setExpandedItems] = React.useState<Set<number>>(
    new Set(value.map((_, i) => i))
  );

  const addItem = () => {
    const newItem: any = { id: Date.now().toString() };
    fields.forEach((field) => {
      newItem[field.key] = '';
    });
    onChange([...value, newItem]);
    setExpandedItems(new Set([...expandedItems, value.length]));
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    const newExpanded = new Set(expandedItems);
    newExpanded.delete(index);
    setExpandedItems(newExpanded);
  };

  const updateItem = (index: number, key: string, newValue: any) => {
    const newArray = [...value];
    newArray[index] = { ...newArray[index], [key]: newValue };
    onChange(newArray);
  };

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <span className="text-xs text-gray-500">{value.length} items</span>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {value.map((item, index) => {
            const isExpanded = expandedItems.has(index);

            return (
              <motion.div
                key={item.id || index}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="border border-gray-200 rounded-lg bg-white overflow-hidden"
              >
                {/* Item Header */}
                <div
                  className={cn(
                    'flex items-center gap-2 p-3 cursor-pointer',
                    'hover:bg-gray-50 transition-colors',
                    isExpanded && 'bg-gray-50'
                  )}
                  onClick={() => toggleExpanded(index)}
                >
                  <GripVertical className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="flex-1 text-sm font-medium text-gray-700">
                    {itemLabel} {index + 1}
                    {item.title || item.name ? `: ${item.title || item.name}` : ''}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(index);
                    }}
                    className="p-1 rounded hover:bg-red-100 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </div>

                {/* Item Fields */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 pt-0 space-y-3 border-t border-gray-100">
                        {fields.map((field) => (
                          <div key={field.key}>
                            {field.type === 'textarea' ? (
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  {field.label}
                                </label>
                                <textarea
                                  value={item[field.key] || ''}
                                  onChange={(e) =>
                                    updateItem(index, field.key, e.target.value)
                                  }
                                  placeholder={field.placeholder}
                                  rows={2}
                                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                                    placeholder:text-gray-400
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                    resize-none"
                                />
                              </div>
                            ) : (
                              <Input
                                label={field.label}
                                type={field.type}
                                value={item[field.key] || ''}
                                onChange={(e) =>
                                  updateItem(index, field.key, e.target.value)
                                }
                                placeholder={field.placeholder}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Add Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={addItem}
          icon={<Plus className="h-4 w-4" />}
          className="w-full"
        >
          {addButtonText}
        </Button>
      </div>
    </div>
  );
};

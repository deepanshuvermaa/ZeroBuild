import { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { useBuilderStore } from '@/store/builderStore';
import { useHistoryStore } from '@/store/historyStore';

export default function PropertyPanel() {
  const { config, selectedSectionId, setSelectedSection, updateSection, deleteSection } = useBuilderStore();
  const { recordState } = useHistoryStore();
  const [localProps, setLocalProps] = useState<Record<string, any>>({});

  const section = config.sections.find(s => s.id === selectedSectionId);

  useEffect(() => {
    if (section) setLocalProps({ ...(section.props as Record<string, any>) });
  }, [selectedSectionId]);

  if (!section) return null;

  const handleChange = (key: string, value: any) => {
    setLocalProps(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    recordState(config);
    updateSection(section.id, localProps);
  };

  const handleDelete = () => {
    if (confirm('Delete this section?')) {
      recordState(config);
      deleteSection(section.id);
    }
  };

  // Determine which fields to show (skip internal/complex ones)
  const editableFields = Object.entries(localProps).filter(([key, val]) => {
    if (key.startsWith('_')) return false;
    if (typeof val === 'string' || typeof val === 'number') return true;
    return false;
  });

  const arrayFields = Object.entries(localProps).filter(([key, val]) => Array.isArray(val));

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{section.type.replace('Section', '')}</h3>
          <p className="text-xs text-gray-500">Edit properties</p>
        </div>
        <button onClick={() => setSelectedSection(null)} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {editableFields.map(([key, val]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            {typeof val === 'string' && val.length > 80 ? (
              <textarea
                value={localProps[key] || ''}
                onChange={e => handleChange(key, e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-400 resize-none"
              />
            ) : typeof val === 'string' && (key.includes('color') || key.includes('Color')) ? (
              <div className="flex items-center gap-2">
                <input type="color" value={localProps[key] || '#000000'} onChange={e => handleChange(key, e.target.value)} className="w-8 h-8 rounded border border-gray-200 cursor-pointer" />
                <input type="text" value={localProps[key] || ''} onChange={e => handleChange(key, e.target.value)} className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-blue-400 font-mono" />
              </div>
            ) : typeof val === 'number' ? (
              <input type="number" value={localProps[key] ?? 0} onChange={e => handleChange(key, parseFloat(e.target.value))} step={0.1} className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-blue-400" />
            ) : (
              <input type="text" value={localProps[key] || ''} onChange={e => handleChange(key, e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-blue-400" />
            )}
          </div>
        ))}

        {arrayFields.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2">Arrays ({arrayFields.map(([k]) => k).join(', ')}) — edit via AI chat or code editor</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 flex-shrink-0">
        <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-500 transition-colors">
          <Save className="w-3.5 h-3.5" /> Save Changes
        </button>
        <button onClick={handleDelete} className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

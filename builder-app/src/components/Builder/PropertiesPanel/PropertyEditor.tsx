import React from 'react';
import { motion } from 'framer-motion';
import { Settings, X } from 'lucide-react';
import { useBuilderStore } from '@/store/builderStore';
import { getComponentDefinition } from '@/utils/componentDefinitions';
import { TextInput } from './TextInput';
import { ColorPicker } from './ColorPicker';
import { ImageUploader } from './ImageUploader';
import { RepeaterField } from './RepeaterField';
import { TextStyleEditor } from './TextStyleEditor';
import { Select } from '@/components/shared/Select';
import { Button } from '@/components/shared/Button';

export const PropertyEditor: React.FC = () => {
  const { config, selectedSectionId, updateSection, setSelectedSection } = useBuilderStore();

  const selectedSection = config.sections.find((s) => s.id === selectedSectionId);

  if (!selectedSection) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-gray-50 border-l border-gray-200">
        <div className="text-center max-w-xs">
          <Settings className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Selection
          </h3>
          <p className="text-sm text-gray-500">
            Click on a section in the canvas to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const definition = getComponentDefinition(selectedSection.type);
  const props = selectedSection.props;

  const updateProp = (key: string, value: any) => {
    updateSection(selectedSection.id, { [key]: value });
  };

  // Text fields that should have styling options
  const TEXT_FIELDS = [
    'heading', 'subheading', 'title', 'description',
    'tagline', 'ctaText', 'businessName', 'name'
  ];

  const isTextField = (key: string) => {
    return TEXT_FIELDS.some(field => key.toLowerCase().includes(field.toLowerCase()));
  };

  const getTextStyleValues = (key: string) => {
    const propsAny = props as any;
    return {
      color: propsAny[`${key}Color`] as string | undefined,
      size: propsAny[`${key}Size`] as string | undefined,
      bold: propsAny[`${key}Bold`] as boolean | undefined,
      italic: propsAny[`${key}Italic`] as boolean | undefined,
      underline: propsAny[`${key}Underline`] as boolean | undefined,
      align: propsAny[`${key}Align`] as 'left' | 'center' | 'right' | 'justify' | undefined,
      fontFamily: propsAny[`${key}FontFamily`] as string | undefined,
    };
  };

  const renderField = (key: string, value: any) => {
    // Skip style properties that are handled by TextStyleEditor
    const styleProperties = ['Color', 'Size', 'Bold', 'Italic', 'Underline', 'Align', 'FontFamily'];
    if (styleProperties.some(prop => key.endsWith(prop))) {
      return null;
    }

    // Color fields (but not text color fields)
    if (key.toLowerCase().includes('color') && !isTextField(key.replace(/Color$/, ''))) {
      return (
        <ColorPicker
          key={key}
          label={formatLabel(key)}
          value={value || '#000000'}
          onChange={(newValue) => updateProp(key, newValue)}
        />
      );
    }

    // Image fields
    if (key.toLowerCase().includes('image') && typeof value === 'string') {
      return (
        <ImageUploader
          key={key}
          label={formatLabel(key)}
          value={value || ''}
          onChange={(newValue) => updateProp(key, newValue)}
        />
      );
    }

    // Number fields
    if (key === 'overlayOpacity' || key === 'columns') {
      return (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {formatLabel(key)}
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => updateProp(key, parseFloat(e.target.value))}
            min={key === 'overlayOpacity' ? 0 : 1}
            max={key === 'overlayOpacity' ? 1 : 4}
            step={key === 'overlayOpacity' ? 0.1 : 1}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      );
    }

    // Select fields
    if (key === 'imagePosition') {
      return (
        <Select
          key={key}
          label={formatLabel(key)}
          value={value}
          onChange={(newValue) => updateProp(key, newValue)}
          options={[
            { value: 'left', label: 'Left' },
            { value: 'right', label: 'Right' },
          ]}
        />
      );
    }

    if (key === 'layout') {
      return (
        <Select
          key={key}
          label={formatLabel(key)}
          value={value}
          onChange={(newValue) => updateProp(key, newValue)}
          options={[
            { value: 'grid', label: 'Grid' },
            { value: 'carousel', label: 'Carousel' },
            { value: 'masonry', label: 'Masonry' },
          ]}
        />
      );
    }

    if (key === 'position') {
      return (
        <Select
          key={key}
          label={formatLabel(key)}
          value={value}
          onChange={(newValue) => updateProp(key, newValue)}
          options={[
            { value: 'bottom-right', label: 'Bottom Right' },
            { value: 'bottom-left', label: 'Bottom Left' },
          ]}
        />
      );
    }

    // Array fields (Repeaters)
    if (Array.isArray(value)) {
      // Services
      if (key === 'services') {
        return (
          <RepeaterField
            key={key}
            label="Services"
            value={value}
            onChange={(newValue) => updateProp(key, newValue)}
            itemLabel="Service"
            fields={[
              { key: 'icon', label: 'Icon (emoji)', type: 'text', placeholder: '🚀' },
              { key: 'title', label: 'Title', type: 'text', placeholder: 'Service Name' },
              { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Service description' },
            ]}
            addButtonText="Add Service"
          />
        );
      }

      // Menu Items
      if (key === 'menuItems') {
        return (
          <RepeaterField
            key={key}
            label="Menu Items"
            value={value}
            onChange={(newValue) => updateProp(key, newValue)}
            itemLabel="Menu Item"
            fields={[
              { key: 'name', label: 'Name', type: 'text', placeholder: 'Item name' },
              { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Description' },
              { key: 'price', label: 'Price', type: 'text', placeholder: '$12.99' },
              { key: 'image', label: 'Image URL', type: 'text', placeholder: 'https://...' },
              { key: 'category', label: 'Category', type: 'text', placeholder: 'Main' },
            ]}
            addButtonText="Add Menu Item"
          />
        );
      }

      // Gallery Images
      if (key === 'images') {
        return (
          <RepeaterField
            key={key}
            label="Gallery Images"
            value={value}
            onChange={(newValue) => updateProp(key, newValue)}
            itemLabel="Image"
            fields={[
              { key: 'url', label: 'Image URL', type: 'text', placeholder: 'https://...' },
              { key: 'alt', label: 'Alt Text', type: 'text', placeholder: 'Image description' },
              { key: 'caption', label: 'Caption', type: 'text', placeholder: 'Optional caption' },
            ]}
            addButtonText="Add Image"
          />
        );
      }

      // Testimonials
      if (key === 'testimonials') {
        return (
          <RepeaterField
            key={key}
            label="Testimonials"
            value={value}
            onChange={(newValue) => updateProp(key, newValue)}
            itemLabel="Testimonial"
            fields={[
              { key: 'name', label: 'Name', type: 'text', placeholder: 'John Doe' },
              { key: 'position', label: 'Position', type: 'text', placeholder: 'CEO, Company' },
              { key: 'photo', label: 'Photo URL', type: 'text', placeholder: 'https://...' },
              { key: 'review', label: 'Review', type: 'textarea', placeholder: 'Their testimonial...' },
              { key: 'rating', label: 'Rating (1-5)', type: 'number', placeholder: '5' },
            ]}
            addButtonText="Add Testimonial"
          />
        );
      }

      // Offers
      if (key === 'offers') {
        return (
          <RepeaterField
            key={key}
            label="Offers"
            value={value}
            onChange={(newValue) => updateProp(key, newValue)}
            itemLabel="Offer"
            fields={[
              { key: 'title', label: 'Title', type: 'text', placeholder: 'Special Offer' },
              { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Offer details' },
              { key: 'discount', label: 'Discount', type: 'text', placeholder: '20% OFF' },
              { key: 'image', label: 'Image URL', type: 'text', placeholder: 'https://...' },
              { key: 'validUntil', label: 'Valid Until', type: 'text', placeholder: '2025-12-31' },
            ]}
            addButtonText="Add Offer"
          />
        );
      }

      // Social Links
      if (key === 'socialLinks') {
        return (
          <RepeaterField
            key={key}
            label="Social Links"
            value={value}
            onChange={(newValue) => updateProp(key, newValue)}
            itemLabel="Social Link"
            fields={[
              { key: 'platform', label: 'Platform', type: 'text', placeholder: 'Facebook' },
              { key: 'url', label: 'URL', type: 'text', placeholder: 'https://...' },
              { key: 'icon', label: 'Icon (emoji)', type: 'text', placeholder: '📘' },
            ]}
            addButtonText="Add Social Link"
          />
        );
      }

      // Categories (simple string array)
      if (key === 'categories') {
        return (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Categories (comma-separated)
            </label>
            <textarea
              value={value.join(', ')}
              onChange={(e) => updateProp(key, e.target.value.split(',').map(s => s.trim()))}
              rows={2}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                resize-none"
            />
          </div>
        );
      }
    }

    // Text fields (multiline for longer content)
    if (typeof value === 'string') {
      const isLongText = key === 'description' || key === 'review' || key === 'tagline';
      const textField = (
        <TextInput
          key={key}
          label={formatLabel(key)}
          value={value}
          onChange={(newValue) => updateProp(key, newValue)}
          multiline={isLongText}
          placeholder={`Enter ${formatLabel(key).toLowerCase()}...`}
        />
      );

      // Add text style editor for text fields
      if (isTextField(key)) {
        return (
          <div key={key} className="space-y-2">
            {textField}
            <TextStyleEditor
              label={formatLabel(key)}
              fieldKey={key}
              values={getTextStyleValues(key)}
              onChange={updateProp}
            />
          </div>
        );
      }

      return textField;
    }

    return null;
  };

  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="h-full flex flex-col bg-white border-l border-gray-200"
    >
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-900">Properties</h2>
          <button
            onClick={() => setSelectedSection(null)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{definition?.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-700">
              {definition?.label}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {definition?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Properties Form */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {Object.entries(props).map(([key, value]) => {
            // Skip id field
            if (key === 'id') return null;
            return renderField(key, value);
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4 bg-gray-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedSection(null)}
          className="w-full"
        >
          Done Editing
        </Button>
      </div>
    </motion.div>
  );
};

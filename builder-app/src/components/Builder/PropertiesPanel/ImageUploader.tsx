import React, { useState } from 'react';
import { Image as ImageIcon, Link as LinkIcon, X } from 'lucide-react';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
}) => {
  const [showPreview, setShowPreview] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleClear = () => {
    onChange('');
    setImageError(false);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>

      <div className="space-y-3">
        {/* URL Input */}
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setImageError(false);
            }}
            placeholder="Enter image URL..."
            leftIcon={<LinkIcon className="h-4 w-4" />}
          />
          {value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              icon={<X className="h-4 w-4" />}
            />
          )}
        </div>

        {/* Image Preview */}
        {value && showPreview && (
          <div
            className={cn(
              'relative rounded-lg overflow-hidden border-2',
              imageError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
            )}
          >
            {!imageError ? (
              <div className="relative aspect-video">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
                <button
                  onClick={() => setShowPreview(false)}
                  className="absolute top-2 right-2 p-1 rounded bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center p-4">
                <div className="text-center">
                  <ImageIcon className="h-8 w-8 mx-auto text-red-400 mb-2" />
                  <p className="text-xs text-red-600">Failed to load image</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Check the URL and try again
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {value && !showPreview && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(true)}
            icon={<ImageIcon className="h-4 w-4" />}
            className="w-full"
          >
            Show Preview
          </Button>
        )}

        {/* Helper Text */}
        <p className="text-xs text-gray-500">
          Enter a direct URL to an image (e.g., from Unsplash or your CDN)
        </p>
      </div>
    </div>
  );
};

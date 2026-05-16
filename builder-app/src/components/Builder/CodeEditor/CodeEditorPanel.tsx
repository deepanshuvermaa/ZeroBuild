import React, { useState, useEffect } from 'react';
import { Code2, Eye, Upload, Image as ImageIcon, Save, Copy } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';

interface CodeEditorPanelProps {
  onSave?: (code: { html: string; css: string; js: string }) => void;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({ onSave }) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [htmlCode, setHtmlCode] = useState(`<!-- Paste your HTML here -->
<div class="container">
  <h1>Welcome to Code Editor</h1>
  <p>Start building your page!</p>
  <button class="btn">Click Me</button>
</div>`);

  const [cssCode, setCssCode] = useState(`/* Paste your CSS here */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
}

h1 {
  color: #1F2937;
  font-size: 3rem;
  margin-bottom: 1rem;
}

.btn {
  background: #3B82F6;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn:hover {
  background: #2563EB;
  transform: translateY(-2px);
}`);

  const [jsCode, setJsCode] = useState(`// Paste your JavaScript here
document.addEventListener('DOMContentLoaded', function() {
  const btn = document.querySelector('.btn');
  if (btn) {
    btn.addEventListener('click', function() {
      alert('Button clicked!');
    });
  }
});`);

  const [previewHtml, setPreviewHtml] = useState('');
  const [uploadedImages, setUploadedImages] = useState<Array<{ name: string; url: string }>>([]);

  // Update preview when code changes
  useEffect(() => {
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    ${cssCode}
  </style>
</head>
<body>
  ${htmlCode}
  <script>
    ${jsCode}
  </script>
</body>
</html>
    `;
    setPreviewHtml(fullHtml);
  }, [htmlCode, cssCode, jsCode]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          setUploadedImages((prev) => [
            ...prev,
            { name: file.name, url }
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Image URL copied to clipboard!');
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ html: htmlCode, css: cssCode, js: jsCode });
    }
    alert('Code saved successfully!');
  };

  const getCurrentCode = () => {
    switch (activeTab) {
      case 'html':
        return htmlCode;
      case 'css':
        return cssCode;
      case 'js':
        return jsCode;
    }
  };

  const setCurrentCode = (code: string) => {
    switch (activeTab) {
      case 'html':
        setHtmlCode(code);
        break;
      case 'css':
        setCssCode(code);
        break;
      case 'js':
        setJsCode(code);
        break;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code2 className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Code Editor</h2>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="image-upload">
              <Button variant="ghost" size="sm" className="cursor-pointer" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </span>
              </Button>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
            <Button variant="primary" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Code
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Code Editor */}
        <div className="w-1/2 flex flex-col border-r bg-white">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('html')}
              className={cn(
                'flex-1 px-6 py-3 text-sm font-medium transition-colors',
                activeTab === 'html'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              HTML
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={cn(
                'flex-1 px-6 py-3 text-sm font-medium transition-colors',
                activeTab === 'css'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              CSS
            </button>
            <button
              onClick={() => setActiveTab('js')}
              className={cn(
                'flex-1 px-6 py-3 text-sm font-medium transition-colors',
                activeTab === 'js'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              JavaScript
            </button>
          </div>

          {/* Code Textarea */}
          <textarea
            value={getCurrentCode()}
            onChange={(e) => setCurrentCode(e.target.value)}
            className="flex-1 p-6 font-mono text-sm resize-none focus:outline-none bg-gray-50"
            placeholder={`Enter your ${activeTab.toUpperCase()} code here...`}
            spellCheck={false}
          />

          {/* Uploaded Images Panel */}
          {uploadedImages.length > 0 && (
            <div className="border-t bg-white p-4 max-h-48 overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="h-4 w-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-900">Uploaded Images</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {uploadedImages.map((img, index) => (
                  <div
                    key={index}
                    className="group relative border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                      <button
                        onClick={() => copyImageUrl(img.url)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 px-3 py-1 rounded text-xs flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        Copy URL
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 truncate">
                      {img.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Live Preview */}
        <div className="w-1/2 flex flex-col bg-gray-100">
          {/* Preview Header */}
          <div className="bg-white border-b px-6 py-3 flex items-center gap-2">
            <Eye className="h-5 w-5 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">Live Preview</h3>
          </div>

          {/* Preview Frame */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="bg-white rounded-lg shadow-lg h-full">
              <iframe
                srcDoc={previewHtml}
                className="w-full h-full border-0 rounded-lg"
                title="Live Preview"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tips Footer */}
      <div className="bg-blue-50 border-t border-blue-100 px-6 py-3">
        <p className="text-sm text-blue-800">
          <strong>💡 Tips:</strong> Upload images first, then copy their URLs to use in your HTML.
          Changes are reflected in real-time. Use standard HTML, CSS, and JavaScript.
        </p>
      </div>
    </div>
  );
};

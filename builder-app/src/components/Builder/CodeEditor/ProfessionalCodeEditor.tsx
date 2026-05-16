import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
  Code2,
  Eye,
  Upload,
  Image as ImageIcon,
  Save,
  Copy,
  Download,
  RefreshCw,
  Settings,
  Maximize2,
  Minimize2,
  Play,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';

interface ProfessionalCodeEditorProps {
  onSave?: (code: { html: string; css: string; js: string }) => void;
}

export const ProfessionalCodeEditor: React.FC<ProfessionalCodeEditorProps> = ({ onSave }) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [htmlCode, setHtmlCode] = useState(`<!-- Welcome to the Code Editor! -->
<div class="container">
  <header class="header">
    <h1 class="title">Welcome to Your Page</h1>
    <p class="subtitle">Build amazing things with code</p>
  </header>

  <section class="content">
    <div class="card">
      <h2>Feature 1</h2>
      <p>Description of your first feature</p>
    </div>

    <div class="card">
      <h2>Feature 2</h2>
      <p>Description of your second feature</p>
    </div>

    <div class="card">
      <h2>Feature 3</h2>
      <p>Description of your third feature</p>
    </div>
  </section>

  <footer class="footer">
    <p>&copy; 2025 Your Company. All rights reserved.</p>
  </footer>
</div>`);

  const [cssCode, setCssCode] = useState(`/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Header */
.header {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  margin-bottom: 40px;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  animation: fadeInDown 0.8s ease;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  animation: fadeInUp 0.8s ease 0.2s both;
}

/* Content Section */
.content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

/* Cards */
.card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  animation: scaleIn 0.6s ease backwards;
}

.card:nth-child(1) { animation-delay: 0.1s; }
.card:nth-child(2) { animation-delay: 0.2s; }
.card:nth-child(3) { animation-delay: 0.3s; }

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.card h2 {
  color: #667eea;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

/* Footer */
.footer {
  text-align: center;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 10px;
  color: #6c757d;
}

/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}`);

  const [jsCode, setJsCode] = useState(`// Interactive JavaScript
console.log('Page loaded successfully!');

// Add click animation to cards
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.card');

  cards.forEach((card, index) => {
    card.addEventListener('click', function() {
      console.log(\`Card \${index + 1} clicked!\`);

      // Add a pulse effect
      this.style.animation = 'none';
      setTimeout(() => {
        this.style.animation = 'pulse 0.5s ease';
      }, 10);
    });
  });
});

// Add pulse animation dynamically
const style = document.createElement('style');
style.textContent = \`
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
\`;
document.head.appendChild(style);`);

  const [previewHtml, setPreviewHtml] = useState('');
  const [uploadedImages, setUploadedImages] = useState<Array<{ name: string; url: string }>>([]);
  const [previewKey, setPreviewKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [consoleOutput, setConsoleOutput] = useState<Array<{ type: 'log' | 'error' | 'warn'; message: string }>>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Update preview when code changes
  useEffect(() => {
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Preview</title>
  <style>
    ${cssCode}
  </style>
</head>
<body>
  ${htmlCode}
  <script>
    // Capture console logs
    (function() {
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;

      console.log = function(...args) {
        window.parent.postMessage({ type: 'console', level: 'log', message: args.join(' ') }, '*');
        originalLog.apply(console, args);
      };

      console.error = function(...args) {
        window.parent.postMessage({ type: 'console', level: 'error', message: args.join(' ') }, '*');
        originalError.apply(console, args);
      };

      console.warn = function(...args) {
        window.parent.postMessage({ type: 'console', level: 'warn', message: args.join(' ') }, '*');
        originalWarn.apply(console, args);
      };

      // Catch errors
      window.onerror = function(message, source, lineno, colno, error) {
        window.parent.postMessage({
          type: 'console',
          level: 'error',
          message: \`Error: \${message} at line \${lineno}\`
        }, '*');
        return false;
      };
    })();

    ${jsCode}
  </script>
</body>
</html>
    `;
    setPreviewHtml(fullHtml);
  }, [htmlCode, cssCode, jsCode]);

  // Listen for console messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'console') {
        setConsoleOutput((prev) => [...prev, {
          type: event.data.level,
          message: event.data.message
        }].slice(-50)); // Keep last 50 messages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          setUploadedImages((prev) => [...prev, { name: file.name, url }]);
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

  const handleDownload = () => {
    const blob = new Blob([previewHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'page.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const refreshPreview = () => {
    setPreviewKey((prev) => prev + 1);
    setConsoleOutput([]);
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

  const setCurrentCode = (code: string | undefined) => {
    if (!code) return;
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

  const getLanguage = () => {
    switch (activeTab) {
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'js':
        return 'javascript';
    }
  };

  return (
    <div className={cn("flex flex-col h-full w-full bg-gray-900", isFullscreen && "fixed inset-0 z-50")}>
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Professional Code Editor</h2>
              <p className="text-xs text-gray-400">HTML • CSS • JavaScript</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Font Size Controls */}
            <div className="flex items-center gap-2 bg-gray-700 rounded px-2 py-1">
              <button
                onClick={() => setFontSize((prev) => Math.max(10, prev - 2))}
                className="text-white hover:bg-gray-600 hover:text-blue-300 px-2 rounded transition-colors"
              >
                A-
              </button>
              <span className="text-white text-xs">{fontSize}px</span>
              <button
                onClick={() => setFontSize((prev) => Math.min(24, prev + 2))}
                className="text-white hover:bg-gray-600 hover:text-blue-300 px-2 rounded transition-colors"
              >
                A+
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setEditorTheme((prev) => (prev === 'vs-dark' ? 'light' : 'vs-dark'))}
              className="p-2 hover:bg-gray-700 rounded text-white transition-colors"
              title="Toggle Theme"
            >
              <Settings className="h-4 w-4" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-700 rounded text-white transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            {/* Image Upload */}
            <label htmlFor="image-upload" className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded hover:bg-gray-700 text-white hover:text-blue-300 transition-colors">
              <Upload className="h-4 w-4" />
              Upload Images
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />

            {/* Refresh Preview */}
            <Button variant="ghost" size="sm" onClick={refreshPreview} className="text-white hover:bg-gray-700 hover:text-blue-300">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>

            {/* Download */}
            <Button variant="ghost" size="sm" onClick={handleDownload} className="text-white hover:bg-gray-700 hover:text-blue-300">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>

            {/* Save */}
            <Button variant="primary" size="sm" onClick={handleSave} className="hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden w-full code-editor-panel">
        {/* Left Panel - Code Editor */}
        <div className="w-full md:w-1/2 flex flex-col border-r border-gray-700 bg-gray-900">
          {/* Tabs */}
          <div className="flex bg-gray-800 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('html')}
              className={cn(
                'flex-1 px-6 py-3 text-sm font-semibold transition-all border-b-2 relative',
                activeTab === 'html'
                  ? 'bg-gray-900 text-orange-400 border-orange-400 shadow-inner'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50 border-transparent'
              )}
            >
              <span className="flex items-center justify-center gap-2">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  activeTab === 'html' ? 'bg-orange-400' : 'bg-gray-600'
                )}>
                </span>
                HTML
              </span>
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={cn(
                'flex-1 px-6 py-3 text-sm font-semibold transition-all border-b-2 relative',
                activeTab === 'css'
                  ? 'bg-gray-900 text-blue-400 border-blue-400 shadow-inner'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50 border-transparent'
              )}
            >
              <span className="flex items-center justify-center gap-2">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  activeTab === 'css' ? 'bg-blue-400' : 'bg-gray-600'
                )}>
                </span>
                CSS
              </span>
            </button>
            <button
              onClick={() => setActiveTab('js')}
              className={cn(
                'flex-1 px-6 py-3 text-sm font-semibold transition-all border-b-2 relative',
                activeTab === 'js'
                  ? 'bg-gray-900 text-yellow-400 border-yellow-400 shadow-inner'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50 border-transparent'
              )}
            >
              <span className="flex items-center justify-center gap-2">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  activeTab === 'js' ? 'bg-yellow-400' : 'bg-gray-600'
                )}>
                </span>
                JavaScript
              </span>
            </button>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              language={getLanguage()}
              value={getCurrentCode()}
              onChange={setCurrentCode}
              theme={editorTheme}
              options={{
                minimap: { enabled: true },
                fontSize: fontSize,
                lineNumbers: 'on',
                roundedSelection: true,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                formatOnPaste: true,
                formatOnType: true,
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                folding: true,
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>

          {/* Uploaded Images Panel */}
          {uploadedImages.length > 0 && (
            <div className="border-t border-gray-700 bg-gray-800 p-4 max-h-48 overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="h-4 w-4 text-gray-400" />
                <h3 className="text-sm font-semibold text-white">Uploaded Images ({uploadedImages.length})</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {uploadedImages.map((img, index) => (
                  <div
                    key={index}
                    className="group relative border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
                  >
                    <img src={img.url} alt={img.name} className="w-full h-20 object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all flex items-center justify-center">
                      <button
                        onClick={() => copyImageUrl(img.url)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Live Preview */}
        <div className="w-full md:w-1/2 flex flex-col bg-white">
          {/* Preview Header */}
          <div className="bg-gray-100 border-b border-gray-300 px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-1.5 rounded-lg">
                <Eye className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Live Preview</h3>
                <p className="text-xs text-gray-500">Auto-updates as you type</p>
              </div>
            </div>
            <button
              onClick={refreshPreview}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded flex items-center gap-2 transition-colors"
            >
              <Play className="h-3.5 w-3.5" />
              Run Code
            </button>
          </div>

          {/* Preview Frame */}
          <div className="flex-1 overflow-auto bg-white relative">
            {previewHtml ? (
              <iframe
                key={previewKey}
                ref={iframeRef}
                srcDoc={previewHtml}
                className="w-full h-full border-0 absolute inset-0"
                title="Live Preview"
                sandbox="allow-scripts allow-modals allow-same-origin"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <Eye className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Preview will appear here</p>
                </div>
              </div>
            )}
          </div>

          {/* Console Output */}
          {consoleOutput.length > 0 && (
            <div className="border-t border-gray-300 bg-gray-900 max-h-48 overflow-y-auto">
              <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Console Output</span>
                <button
                  onClick={() => setConsoleOutput([])}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Clear
                </button>
              </div>
              <div className="p-2 font-mono text-xs">
                {consoleOutput.map((output, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-2 py-1 px-2 rounded',
                      output.type === 'error' && 'text-red-400',
                      output.type === 'warn' && 'text-yellow-400',
                      output.type === 'log' && 'text-green-400'
                    )}
                  >
                    {output.type === 'error' && <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                    {output.type === 'log' && <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                    <span className="flex-1">{output.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips Footer with References */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-3">
        <div className="flex items-start gap-6 text-xs text-blue-100">
          <div className="flex-1">
            <p className="font-semibold mb-1.5 text-white flex items-center gap-2">
              <span className="bg-blue-500 px-2 py-0.5 rounded text-white">💡</span>
              Keyboard Shortcuts
            </p>
            <p className="text-blue-200">
              <strong>Ctrl+Space</strong> Auto-complete • <strong>Ctrl+/</strong> Comment •
              <strong>Ctrl+F</strong> Find • <strong>Ctrl+H</strong> Replace •
              <strong>Alt+Shift+F</strong> Format
            </p>
          </div>
          <div className="flex-1">
            <p className="font-semibold mb-1.5 text-white flex items-center gap-2">
              <span className="bg-green-500 px-2 py-0.5 rounded text-white">📚</span>
              References
            </p>
            <p className="text-blue-200">
              <a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">HTML Docs</a> •
              <a href="https://developer.mozilla.org/en-US/docs/Web/CSS" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">CSS Docs</a> •
              <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">JS Docs</a>
            </p>
          </div>
          <div className="flex-1">
            <p className="font-semibold mb-1.5 text-white flex items-center gap-2">
              <span className="bg-purple-500 px-2 py-0.5 rounded text-white">⚡</span>
              Features
            </p>
            <p className="text-blue-200">
              Live Preview • Console Output • Image Upload • Syntax Highlighting • Auto-save
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

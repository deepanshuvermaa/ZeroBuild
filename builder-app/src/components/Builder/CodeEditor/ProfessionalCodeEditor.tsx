import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Save, Copy, Download, CheckCircle } from 'lucide-react';
import { useBuilderStore } from '@/store/builderStore';

interface ProfessionalCodeEditorProps {
  onSave?: (code: any) => void;
}

export const ProfessionalCodeEditor: React.FC<ProfessionalCodeEditorProps> = ({ onSave }) => {
  const { config, setConfig } = useBuilderStore();
  const [code, setCode] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCode(JSON.stringify(config, null, 2));
  }, [config]);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(code);
      setConfig(parsed);
      setError(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSave?.(parsed);
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.metadata.projectName || 'project'}-config.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1e1e1e]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#333] bg-[#252526]">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60 font-mono">page-config.json</span>
          {error && <span className="text-xs text-red-400">{error}</span>}
          {saved && <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Saved</span>}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleCopy} className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors" title="Copy"><Copy className="w-3.5 h-3.5" /></button>
          <button onClick={handleDownload} className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors" title="Download"><Download className="w-3.5 h-3.5" /></button>
          <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium ml-2 transition-colors">
            <Save className="w-3 h-3" /> Save
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language="json"
          theme="vs-dark"
          value={code}
          onChange={(v) => { setCode(v || ''); setError(null); }}
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            wordWrap: 'on',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            formatOnPaste: true,
          }}
        />
      </div>
    </div>
  );
};

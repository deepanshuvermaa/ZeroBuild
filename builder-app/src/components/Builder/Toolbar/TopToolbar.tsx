import React, { useState } from 'react';
import {
  Save,
  FolderOpen,
  FileJson,
  Code,
  Monitor,
  Tablet,
  Smartphone,
  FilePlus,
  Settings,
  Sparkles,
  Code2,
  Layout,
  Rocket,
  Cloud,
  LogOut,
  ArrowLeft,
  Wand2,
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/shared/Button';
import { Dialog } from '@/components/shared/Dialog';
import { Input } from '@/components/shared/Input';
import { TemplateGallery } from '../TemplateGallery';
import { UndoRedo } from './UndoRedo';
import { useBuilderStore } from '@/store/builderStore';
import { useHistoryStore } from '@/store/historyStore';
import { useAuthStore } from '@/store/authStore';
import { downloadJSON } from '@/utils/exportConfig';
import { importConfig } from '@/utils/importConfig';
import { generateAndDownloadZip } from '@/utils/generateWebsite';
import { cn } from '@/lib/utils';

interface TopToolbarProps {
  builderMode?: 'visual' | 'code';
  onModeChange?: (mode: 'visual' | 'code') => void;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({ builderMode = 'visual', onModeChange }) => {
  const {
    config,
    previewMode,
    setPreviewMode,
    resetConfig,
    setConfig,
    hasUnsavedChanges,
    markSaved,
    projectId,
    isSaving,
    saveToServer,
    lastSavedAt,
  } = useBuilderStore();
  const { recordState, clearHistory } = useHistoryStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showDeployPanel, setShowDeployPanel] = useState(false);
  const [projectName, setProjectName] = useState(config.metadata.projectName);

  // Lazy load AI and Deploy panels
  const AIGeneratePanel = React.lazy(() => import('@/components/AI/AIGeneratePanel'));
  const DeployPanel = React.lazy(() => import('@/components/AI/DeployPanel'));

  const handleNew = () => {
    if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Create a new project?')) return;
    recordState(config);
    resetConfig();
    clearHistory();
  };

  const handleSave = async () => {
    if (projectId) {
      await saveToServer();
    } else {
      downloadJSON(config, config.metadata.projectName || 'page-config');
      markSaved();
    }
    setShowSaveDialog(false);
  };

  const handleLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const loadedConfig = await importConfig(file);
      recordState(config);
      setConfig(loadedConfig);
      clearHistory();
      alert('Configuration loaded successfully!');
    } catch (error) {
      alert(`Failed to load configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleExportJSON = () => {
    downloadJSON(config, `${config.metadata.projectName}-export`);
  };

  const handleGenerateBuild = async () => {
    try {
      await generateAndDownloadZip(config);
      alert('Website generated and downloaded successfully!');
    } catch (error) {
      alert(`Build generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <>
      <div className="min-h-16 bg-white border-b border-gray-200 px-2 md:px-4 flex flex-wrap items-center gap-2 md:gap-4 py-2">
        {/* Back to Dashboard + Logo */}
        <div className="flex items-center gap-2 border-r border-gray-200 pr-2 md:pr-4">
          {isAuthenticated && (
            <button
              onClick={() => navigate('/dashboard')}
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </button>
          )}
          <Code className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
          <div className="hidden sm:flex flex-col">
            <h1 className="text-sm font-bold text-gray-900">ZeroBuild</h1>
            <p className="text-xs text-gray-500 truncate max-w-[100px] md:max-w-none">{config.metadata.projectName}</p>
          </div>
        </div>

        {/* File Actions */}
        <div className="flex items-center gap-1 md:gap-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={() => setShowTemplateGallery(true)} icon={<Sparkles className="h-4 w-4" />} title="Browse Templates">
            <span className="hidden sm:inline">Templates</span>
          </Button>

          {!projectId && (
            <Button variant="ghost" size="sm" onClick={handleNew} icon={<FilePlus className="h-4 w-4" />} title="New Project">
              <span className="hidden sm:inline">New</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            icon={isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            title={projectId ? "Save to Cloud" : "Save as JSON"}
          >
            <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
          </Button>

          {!projectId && (
            <div>
              <input id="config-file-input" type="file" accept=".json" onChange={handleLoad} className="hidden" />
              <Button variant="ghost" size="sm" onClick={() => document.getElementById('config-file-input')?.click()} icon={<FolderOpen className="h-4 w-4" />} title="Load Project">
                <span className="hidden sm:inline">Load</span>
              </Button>
            </div>
          )}

          <div className="hidden md:block h-6 w-px bg-gray-300" />

          <Button variant="ghost" size="sm" onClick={handleExportJSON} icon={<FileJson className="h-4 w-4" />} title="Export JSON">
            <span className="hidden md:inline">Export</span>
          </Button>

          <Button variant="primary" size="sm" onClick={handleGenerateBuild} icon={<Code className="h-4 w-4" />} title="Generate Build Files">
            Generate
          </Button>
        </div>

        {/* AI + Deploy buttons */}
        {isAuthenticated && (
          <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAIPanel(true)}
              icon={<Wand2 className="h-4 w-4 text-purple-600" />}
              title="AI Generate"
            >
              <span className="hidden md:inline text-purple-600">AI</span>
            </Button>

            {projectId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeployPanel(true)}
                icon={<Rocket className="h-4 w-4 text-green-600" />}
                title="Deploy Website"
              >
                <span className="hidden md:inline text-green-600">Deploy</span>
              </Button>
            )}
          </div>
        )}

        {/* Undo/Redo */}
        <div className="hidden md:flex border-l border-gray-200 pl-4">
          <UndoRedo />
        </div>

        <div className="hidden lg:flex flex-1" />

        {/* Builder Mode Switcher */}
        {onModeChange && (
          <div className="flex items-center gap-1 md:gap-2 border-r border-gray-200 pr-2 md:pr-4">
            <span className="hidden md:inline text-xs text-gray-500 font-medium">Mode:</span>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button onClick={() => onModeChange('visual')} className={cn('px-2 md:px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1', builderMode === 'visual' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900')} title="Visual Builder">
                <Layout className="h-3.5 w-3.5" /><span className="hidden sm:inline">Visual</span>
              </button>
              <button onClick={() => onModeChange('code')} className={cn('px-2 md:px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1', builderMode === 'code' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900')} title="Code Editor">
                <Code2 className="h-3.5 w-3.5" /><span className="hidden sm:inline">Code</span>
              </button>
            </div>
          </div>
        )}

        {/* Preview Mode */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button onClick={() => setPreviewMode('desktop')} className={cn('p-2 rounded transition-colors', previewMode === 'desktop' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900')} title="Desktop"><Monitor className="h-4 w-4" /></button>
          <button onClick={() => setPreviewMode('tablet')} className={cn('p-2 rounded transition-colors', previewMode === 'tablet' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900')} title="Tablet"><Tablet className="h-4 w-4" /></button>
          <button onClick={() => setPreviewMode('mobile')} className={cn('p-2 rounded transition-colors', previewMode === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900')} title="Mobile"><Smartphone className="h-4 w-4" /></button>
        </div>

        {/* Settings */}
        <Button variant="ghost" size="sm" onClick={() => setShowSettingsDialog(true)} icon={<Settings className="h-4 w-4" />} title="Project Settings" />

        {/* User info */}
        {isAuthenticated && user && (
          <div className="flex items-center gap-2 border-l border-gray-200 pl-2">
            <div className="hidden md:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-medium text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-400">{user.ai_credits_remaining} credits</p>
              </div>
            </div>
            <button onClick={() => { logout(); navigate('/'); }} className="p-1.5 rounded-md hover:bg-gray-100" title="Logout">
              <LogOut className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        )}

        {/* Save status */}
        {hasUnsavedChanges && (
          <div className="flex items-center gap-2 text-xs text-amber-600">
            <div className="h-2 w-2 rounded-full bg-amber-600 animate-pulse" />
            Unsaved
          </div>
        )}
        {lastSavedAt && !hasUnsavedChanges && (
          <div className="hidden md:flex items-center gap-1 text-xs text-green-600">
            <Cloud className="h-3 w-3" />
            Saved
          </div>
        )}
      </div>

      {/* Template Gallery */}
      <TemplateGallery open={showTemplateGallery} onOpenChange={setShowTemplateGallery} />

      {/* Save Dialog (for non-project mode) */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog} title="Save Project" description="Download your project configuration as JSON">
        <div className="space-y-4">
          <Input label="Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="My Awesome Project" />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setShowSaveDialog(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog} title="Project Settings" description="Configure global project settings">
        <div className="space-y-4">
          <Input label="Client Name" value={config.metadata.clientName} onChange={(e) => useBuilderStore.getState().updateMetadata({ clientName: e.target.value })} placeholder="Client Name" />
          <Input label="Project Name" value={config.metadata.projectName} onChange={(e) => useBuilderStore.getState().updateMetadata({ projectName: e.target.value })} placeholder="Project Name" />
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button onClick={() => setShowSettingsDialog(false)}>Done</Button>
          </div>
        </div>
      </Dialog>

      {/* AI Generate Panel */}
      {showAIPanel && (
        <React.Suspense fallback={null}>
          <AIGeneratePanel open={showAIPanel} onOpenChange={setShowAIPanel} projectId={projectId || undefined} />
        </React.Suspense>
      )}

      {/* Deploy Panel */}
      {showDeployPanel && projectId && (
        <React.Suspense fallback={null}>
          <DeployPanel open={showDeployPanel} onOpenChange={setShowDeployPanel} projectId={projectId} />
        </React.Suspense>
      )}
    </>
  );
};

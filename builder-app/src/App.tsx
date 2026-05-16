import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { useBuilderStore } from '@/store/builderStore';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import SuggestionWidget from '@/components/SuggestionWidget';

const LandingPage = React.lazy(() => import('@/components/Landing/LandingPage'));
const LoginForm = React.lazy(() => import('@/components/Auth/LoginForm'));
const RegisterForm = React.lazy(() => import('@/components/Auth/RegisterForm'));
const ForgotPassword = React.lazy(() => import('@/components/Auth/ForgotPassword'));
const ProjectList = React.lazy(() => import('@/components/Dashboard/ProjectList'));
const Settings = React.lazy(() => import('@/components/Dashboard/Settings'));
const AdminDashboard = React.lazy(() => import('@/components/Admin/AdminDashboard'));
const BuilderChat = React.lazy(() => import('@/components/Builder/BuilderChat'));
const PreviewCanvas = React.lazy(() => import('@/components/Builder/PreviewCanvas'));
const ThemePicker = React.lazy(() => import('@/components/Builder/ThemePicker'));
const ProfessionalCodeEditor = React.lazy(() => import('@/components/Builder/CodeEditor/ProfessionalCodeEditor').then(m => ({ default: m.ProfessionalCodeEditor })));

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/40 text-sm">Loading...</p>
      </div>
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function EditorPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { loadFromServer, setProjectId, config, setPreviewMode, previewMode } = useBuilderStore();
  const { mode, toggle } = useThemeStore();
  const [isLoading, setIsLoading] = React.useState(true);
  const [editorMode, setEditorMode] = React.useState<'visual' | 'code'>('visual');
  const [loadError, setLoadError] = React.useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      setIsLoading(true);
      setLoadError(null);
      loadFromServer(projectId)
        .then(() => { setProjectId(projectId); setIsLoading(false); })
        .catch(() => {
          setLoadError('Project not found. It may have been deleted or the server was restarted.');
          setIsLoading(false);
        });
    }
  }, [projectId]);

  if (isLoading) return <LoadingScreen />;

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="text-2xl">🔍</span>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Project Not Found</h2>
          <p className="text-white/50 text-sm mb-6">{loadError}</p>
          <button onClick={() => navigate('/dashboard')} className="px-6 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col ${mode === 'dark' ? 'bg-[#050505]' : 'bg-gray-50'}`}>
      {/* Glass navbar */}
      <nav className={`flex items-center justify-between px-4 py-2.5 border-b z-50 ${mode === 'dark' ? 'border-white/[0.08] bg-black/60 backdrop-blur-xl' : 'border-gray-200 bg-white/80 backdrop-blur-xl'}`}>
        <div className="flex items-center gap-3">
          <a href="/dashboard" className={`flex items-center gap-2 transition-colors ${mode === 'dark' ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            <span className="text-sm font-medium">ZeroBuild</span>
          </a>
          <span className={mode === 'dark' ? 'text-white/20' : 'text-gray-300'}>·</span>
          <span className={`text-sm truncate max-w-[200px] ${mode === 'dark' ? 'text-white/50' : 'text-gray-500'}`}>{config.metadata.projectName || 'Untitled'}</span>
        </div>

        {/* Center: responsive + code toggle */}
        <div className={`flex items-center gap-1 border rounded-lg p-0.5 ${mode === 'dark' ? 'bg-white/[0.04] border-white/[0.08]' : 'bg-gray-100 border-gray-200'}`}>
          {([
            { m: 'desktop' as const, label: 'Desktop', icon: '🖥' },
            { m: 'tablet' as const, label: 'Tablet', icon: '📱' },
            { m: 'mobile' as const, label: 'Mobile', icon: '📲' },
          ]).map(({ m, label, icon }) => (
            <button
              key={m}
              onClick={() => { setPreviewMode(m); setEditorMode('visual'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors ${
                previewMode === m && editorMode === 'visual'
                  ? (mode === 'dark' ? 'bg-white/10 text-white' : 'bg-white text-gray-900 shadow-sm')
                  : (mode === 'dark' ? 'text-white/40 hover:text-white/70' : 'text-gray-500 hover:text-gray-700')
              }`}
            >
              <span>{icon}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
          <div className={`w-px h-4 mx-1 ${mode === 'dark' ? 'bg-white/10' : 'bg-gray-300'}`} />
          <button
            onClick={() => setEditorMode(editorMode === 'code' ? 'visual' : 'code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors ${
              editorMode === 'code'
                ? (mode === 'dark' ? 'bg-white/10 text-white' : 'bg-white text-gray-900 shadow-sm')
                : (mode === 'dark' ? 'text-white/40 hover:text-white/70' : 'text-gray-500 hover:text-gray-700')
            }`}
          >
            <span>{'</>'}</span>
            <span className="hidden sm:inline">Code</span>
          </button>
          <div className={`w-px h-4 mx-1 ${mode === 'dark' ? 'bg-white/10' : 'bg-gray-300'}`} />
          <React.Suspense fallback={null}><ThemePicker /></React.Suspense>
        </div>

        {/* Right: save/publish */}
        <div className="flex items-center gap-2">
          <button onClick={toggle} className={`px-2.5 py-1.5 rounded-md text-xs transition-colors ${mode === 'dark' ? 'text-white/40 hover:text-white/70' : 'text-gray-500 hover:text-gray-900'}`} title="Toggle light/dark">
            {mode === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => useBuilderStore.getState().saveToServer()}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${mode === 'dark' ? 'bg-white/10 border border-white/10 text-white hover:bg-white/20' : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200'}`}
          >
            Save
          </button>
          <button className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${mode === 'dark' ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-gray-800'}`}>
            Publish
          </button>
        </div>
      </nav>

      {/* Two-panel layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {editorMode === 'code' ? (
          <React.Suspense fallback={<div className="flex-1 bg-[#1e1e1e]" />}>
            <ProfessionalCodeEditor onSave={(code) => console.log('Saved:', code)} />
          </React.Suspense>
        ) : (
          <>
            {/* Left: AI Chat Panel (hidden on mobile, shown as bottom sheet) */}
            <aside className="w-[320px] flex-shrink-0 hidden md:block h-full">
              <React.Suspense fallback={<div className="h-full bg-black/40" />}>
                <BuilderChat projectId={projectId} />
              </React.Suspense>
            </aside>
            {/* Preview */}
            <main className="flex-1 min-w-0 min-h-0">
              <React.Suspense fallback={<div className="h-full bg-[#0a0a0a]" />}>
                <PreviewCanvas />
              </React.Suspense>
            </main>
            {/* Mobile: Chat as bottom sheet */}
            <div className="md:hidden border-t border-white/[0.08] h-[45vh] flex-shrink-0">
              <React.Suspense fallback={<div className="h-full bg-black/40" />}>
                <BuilderChat projectId={projectId} />
              </React.Suspense>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AppContent() {
  const { checkAuth } = useAuthStore();
  useEffect(() => { checkAuth(); }, []);

  return (
    <>
      <SuggestionWidget />
      <React.Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<RequireAuth><ProjectList /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
          <Route path="/editor/:projectId" element={<RequireAuth><EditorPage /></RequireAuth>} />
          <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

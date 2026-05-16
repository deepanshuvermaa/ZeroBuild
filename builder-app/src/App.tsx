import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { useBuilderStore } from '@/store/builderStore';
import { useAuthStore } from '@/store/authStore';
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
  const [isLoading, setIsLoading] = React.useState(true);
  const [editorMode, setEditorMode] = React.useState<'visual' | 'code'>('visual');

  useEffect(() => {
    if (projectId) {
      setIsLoading(true);
      loadFromServer(projectId)
        .then(() => { setProjectId(projectId); setIsLoading(false); })
        .catch(() => navigate('/dashboard'));
    }
  }, [projectId]);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="h-screen flex flex-col bg-[#050505]">
      {/* Glass navbar */}
      <nav className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08] bg-black/60 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <a href="/dashboard" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            <span className="text-sm font-medium">ZeroBuild</span>
          </a>
          <span className="text-white/20">·</span>
          <span className="text-sm text-white/50 truncate max-w-[200px]">{config.metadata.projectName || 'Untitled'}</span>
        </div>

        {/* Center: responsive + code toggle */}
        <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] rounded-lg p-0.5">
          {([
            { mode: 'desktop' as const, label: 'Desktop', icon: '🖥' },
            { mode: 'tablet' as const, label: 'Tablet', icon: '📱' },
            { mode: 'mobile' as const, label: 'Mobile', icon: '📲' },
          ]).map(({ mode, label, icon }) => (
            <button
              key={mode}
              onClick={() => { setPreviewMode(mode); setEditorMode('visual'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors ${
                previewMode === mode && editorMode === 'visual' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <span>{icon}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button
            onClick={() => setEditorMode(editorMode === 'code' ? 'visual' : 'code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors ${
              editorMode === 'code' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'
            }`}
          >
            <span>{'</>'}</span>
            <span className="hidden sm:inline">Code</span>
          </button>
        </div>

        {/* Right: save/publish */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => useBuilderStore.getState().saveToServer()}
            className="px-4 py-1.5 rounded-lg bg-white/10 border border-white/10 text-white text-xs font-medium hover:bg-white/20 transition-colors"
          >
            Save
          </button>
          <button className="px-4 py-1.5 rounded-lg bg-white text-black text-xs font-medium hover:bg-white/90 transition-colors">
            Publish
          </button>
        </div>
      </nav>

      {/* Two-panel layout */}
      <div className="flex-1 flex overflow-hidden">
        {editorMode === 'code' ? (
          <React.Suspense fallback={<div className="flex-1 bg-[#1e1e1e]" />}>
            <ProfessionalCodeEditor onSave={(code) => console.log('Saved:', code)} />
          </React.Suspense>
        ) : (
          <>
            {/* Left: AI Chat Panel */}
            <aside className="w-[320px] flex-shrink-0 hidden md:block">
              <React.Suspense fallback={<div className="h-full bg-black/40" />}>
                <BuilderChat projectId={projectId} />
              </React.Suspense>
            </aside>
            {/* Right: Full Preview */}
            <main className="flex-1 min-w-0">
              <React.Suspense fallback={<div className="h-full bg-[#0a0a0a]" />}>
                <PreviewCanvas />
              </React.Suspense>
            </main>
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

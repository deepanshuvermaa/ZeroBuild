import React, { useEffect, useCallback } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore } from '@/store/builderStore';
import { useHistoryStore } from '@/store/historyStore';
import { useAuthStore } from '@/store/authStore';
import { getDefaultProps } from '@/utils/componentDefinitions';
import { ComponentLibrary } from '@/components/Builder/Sidebar/ComponentLibrary';
import { CanvasArea } from '@/components/Builder/Canvas/CanvasArea';
import { PropertyEditor } from '@/components/Builder/PropertiesPanel/PropertyEditor';
import { TopToolbar } from '@/components/Builder/Toolbar/TopToolbar';
import { ProfessionalCodeEditor } from '@/components/Builder/CodeEditor/ProfessionalCodeEditor';
import type { ComponentType } from '@/types/component.types';

// Lazy load pages for code splitting
const LandingPage = React.lazy(() => import('@/components/Landing/LandingPage'));
const LoginForm = React.lazy(() => import('@/components/Auth/LoginForm'));
const RegisterForm = React.lazy(() => import('@/components/Auth/RegisterForm'));
const ForgotPassword = React.lazy(() => import('@/components/Auth/ForgotPassword'));
const ProjectList = React.lazy(() => import('@/components/Dashboard/ProjectList'));
const Settings = React.lazy(() => import('@/components/Dashboard/Settings'));

// Loading fallback
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

// Protected route wrapper
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

// Editor page that loads a specific project
function EditorPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const {
    config,
    selectedSectionId,
    setIsDragging,
    addSection,
    reorderSections,
    deleteSection,
    loadFromServer,
    setProjectId,
  } = useBuilderStore();
  const { recordState } = useHistoryStore();

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [builderMode, setBuilderMode] = React.useState<'visual' | 'code'>('visual');
  const [showMobileSidebar, setShowMobileSidebar] = React.useState(false);
  const [isLoadingProject, setIsLoadingProject] = React.useState(true);

  // Load project from server
  useEffect(() => {
    if (projectId) {
      setIsLoadingProject(true);
      loadFromServer(projectId)
        .then(() => {
          setProjectId(projectId);
          setIsLoadingProject(false);
        })
        .catch(() => {
          navigate('/dashboard');
        });
    }
  }, [projectId]);

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setIsDragging(true);
  }, [setIsDragging]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      setIsDragging(false);

      if (!over) return;

      if (active.data.current?.type === 'new-component') {
        const componentType = active.data.current.componentType as ComponentType;
        const defaultProps = getDefaultProps(componentType);
        recordState(config);
        addSection(componentType, defaultProps);
        return;
      }

      if (active.data.current?.type === 'section' && over.data.current?.type === 'section') {
        if (active.id !== over.id) {
          const sections = [...config.sections].sort((a, b) => a.order - b.order);
          const oldIndex = sections.findIndex((s) => s.id === active.id);
          const newIndex = sections.findIndex((s) => s.id === over.id);

          if (oldIndex !== -1 && newIndex !== -1) {
            recordState(config);
            const newSections = arrayMove(sections, oldIndex, newIndex);
            reorderSections(newSections);
          }
        }
      }
    },
    [config, recordState, addSection, reorderSections, setIsDragging]
  );

  const handleDragOver = useCallback((_event: DragOverEvent) => {}, []);
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setIsDragging(false);
  }, [setIsDragging]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        const { undo, canUndo } = useHistoryStore.getState();
        const { setConfig } = useBuilderStore.getState();
        if (canUndo) {
          const previousState = undo();
          if (previousState) setConfig(previousState);
        }
      }

      if (
        ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')
      ) {
        e.preventDefault();
        const { redo, canRedo } = useHistoryStore.getState();
        const { setConfig } = useBuilderStore.getState();
        if (canRedo) {
          const nextState = redo();
          if (nextState) setConfig(nextState);
        }
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        const { selectedSectionId } = useBuilderStore.getState();
        if (selectedSectionId && document.activeElement?.tagName !== 'INPUT' &&
            document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          if (window.confirm('Delete the selected section?')) {
            recordState(config);
            deleteSection(selectedSectionId);
          }
        }
      }

      if (e.key === 'Escape') {
        useBuilderStore.getState().setSelectedSection(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config, recordState, deleteSection]);

  if (isLoadingProject) return <LoadingScreen />;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <TopToolbar builderMode={builderMode} onModeChange={setBuilderMode} />

      <div className="flex-1 flex overflow-hidden relative">
        {builderMode === 'code' ? (
          <ProfessionalCodeEditor
            onSave={(code) => {
              console.log('Code saved:', code);
            }}
          />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragCancel={handleDragCancel}
          >
            <button
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="md:hidden fixed bottom-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
              aria-label="Toggle component library"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {showMobileSidebar && (
              <div
                className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setShowMobileSidebar(false)}
              />
            )}

            <aside className={`
              w-[280px] flex-shrink-0 h-full
              md:relative md:translate-x-0
              fixed inset-y-0 left-0 z-50
              transform transition-transform duration-300 ease-in-out
              ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
              <ComponentLibrary />
            </aside>

            <main className="flex-1 min-w-0 pb-16 lg:pb-0">
              <CanvasArea />
            </main>

            <AnimatePresence mode="wait">
              {selectedSectionId && (
                <motion.aside
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 320, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 overflow-hidden hidden lg:block"
                >
                  <PropertyEditor />
                </motion.aside>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {selectedSectionId && (
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ duration: 0.3 }}
                  className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 max-h-[60vh] overflow-y-auto z-30 shadow-2xl"
                >
                  <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Properties</h3>
                    <button
                      onClick={() => useBuilderStore.getState().setSelectedSection(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <PropertyEditor />
                </motion.div>
              )}
            </AnimatePresence>

            <DragOverlay>
              {activeId ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 0.9 }}
                  className="bg-white rounded-lg shadow-2xl p-4 border-2 border-blue-500"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">📦</div>
                    <p className="text-sm font-semibold text-gray-900">
                      {activeId.includes('component-') ? 'New Component' : 'Moving Section'}
                    </p>
                  </div>
                </motion.div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
}

// Standalone editor (no auth, no project — for backward compatibility / local use)
function StandaloneEditor() {
  const {
    config,
    selectedSectionId,
    setIsDragging,
    addSection,
    reorderSections,
    deleteSection,
  } = useBuilderStore();
  const { recordState } = useHistoryStore();

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [builderMode, setBuilderMode] = React.useState<'visual' | 'code'>('visual');
  const [showMobileSidebar, setShowMobileSidebar] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setIsDragging(true);
  }, [setIsDragging]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      setIsDragging(false);
      if (!over) return;

      if (active.data.current?.type === 'new-component') {
        const componentType = active.data.current.componentType as ComponentType;
        const defaultProps = getDefaultProps(componentType);
        recordState(config);
        addSection(componentType, defaultProps);
        return;
      }

      if (active.data.current?.type === 'section' && over.data.current?.type === 'section') {
        if (active.id !== over.id) {
          const sections = [...config.sections].sort((a, b) => a.order - b.order);
          const oldIndex = sections.findIndex((s) => s.id === active.id);
          const newIndex = sections.findIndex((s) => s.id === over.id);
          if (oldIndex !== -1 && newIndex !== -1) {
            recordState(config);
            reorderSections(arrayMove(sections, oldIndex, newIndex));
          }
        }
      }
    },
    [config, recordState, addSection, reorderSections, setIsDragging]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        const { undo, canUndo } = useHistoryStore.getState();
        const { setConfig } = useBuilderStore.getState();
        if (canUndo) { const s = undo(); if (s) setConfig(s); }
      }
      if (((e.ctrlKey || e.metaKey) && e.key === 'y') || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        const { redo, canRedo } = useHistoryStore.getState();
        const { setConfig } = useBuilderStore.getState();
        if (canRedo) { const s = redo(); if (s) setConfig(s); }
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        const { selectedSectionId } = useBuilderStore.getState();
        if (selectedSectionId) {
          e.preventDefault();
          if (window.confirm('Delete the selected section?')) { recordState(config); deleteSection(selectedSectionId); }
        }
      }
      if (e.key === 'Escape') useBuilderStore.getState().setSelectedSection(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config, recordState, deleteSection]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <TopToolbar builderMode={builderMode} onModeChange={setBuilderMode} />
      <div className="flex-1 flex overflow-hidden relative">
        {builderMode === 'code' ? (
          <ProfessionalCodeEditor onSave={(code) => console.log('Code saved:', code)} />
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={() => {}} onDragCancel={() => { setActiveId(null); setIsDragging(false); }}>
            <button onClick={() => setShowMobileSidebar(!showMobileSidebar)} className="md:hidden fixed bottom-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg" aria-label="Toggle sidebar">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            {showMobileSidebar && <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowMobileSidebar(false)} />}
            <aside className={`w-[280px] flex-shrink-0 h-full md:relative md:translate-x-0 fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
              <ComponentLibrary />
            </aside>
            <main className="flex-1 min-w-0 pb-16 lg:pb-0"><CanvasArea /></main>
            <AnimatePresence mode="wait">
              {selectedSectionId && (
                <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 320, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 overflow-hidden hidden lg:block">
                  <PropertyEditor />
                </motion.aside>
              )}
            </AnimatePresence>
            <DragOverlay>{activeId ? <motion.div initial={{ scale: 0.9, opacity: 0.8 }} animate={{ scale: 1, opacity: 0.9 }} className="bg-white rounded-lg shadow-2xl p-4 border-2 border-blue-500"><div className="text-center"><div className="text-3xl mb-2">📦</div><p className="text-sm font-semibold text-gray-900">{activeId.includes('component-') ? 'New Component' : 'Moving Section'}</p></div></motion.div> : null}</DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
}

// Auth check wrapper for the app
function AppContent() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <React.Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<RequireAuth><ProjectList /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
        <Route path="/editor/:projectId" element={<RequireAuth><EditorPage /></RequireAuth>} />

        {/* Standalone editor (backward compat — no auth required) */}
        <Route path="/standalone" element={<StandaloneEditor />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </React.Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

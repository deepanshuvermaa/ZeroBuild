import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Plus, LogOut, Search, LayoutGrid, Globe, Zap, FolderOpen, Settings } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { projects as projectsAPI } from '@/utils/api';
import { ProjectCard } from '@/components/Dashboard/ProjectCard';
import type { Project } from '@/types/api.types';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newName, setNewName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchProjects = async () => {
    setIsLoading(true); setError(null);
    try { const { projects } = await projectsAPI.list(); setProjectsList(projects); }
    catch (err: any) { setError(err.message || 'Failed to load projects'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return projectsList;
    const q = search.toLowerCase();
    return projectsList.filter(p => p.name.toLowerCase().includes(q));
  }, [projectsList, search]);

  const publishedCount = projectsList.filter(p => p.status === 'published').length;

  const handleCreateProject = async () => {
    if (!newName.trim()) return;
    setIsCreating(true);
    try {
      const { project } = await projectsAPI.create(newName.trim());
      setShowNewDialog(false); setNewName('');
      navigate(`/editor/${project.id}`);
    } catch (err: any) { setError(err.message); } finally { setIsCreating(false); }
  };

  const handleDelete = async (id: string) => {
    try { await projectsAPI.delete(id); setProjectsList(prev => prev.filter(p => p.id !== id)); }
    catch (err: any) { setError(err.message); }
  };

  const handleDuplicate = async (id: string) => {
    try { const { project } = await projectsAPI.duplicate(id); setProjectsList(prev => [project, ...prev]); }
    catch (err: any) { setError(err.message); }
  };

  const handleLogout = async () => { await logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-black/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-white" />
              <span className="text-lg font-bold text-white">ZeroBuild</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowNewDialog(true)} className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white text-black text-xs font-medium hover:bg-white/90 transition-colors">
                <Plus className="h-3.5 w-3.5" />New Project
              </button>
              {user?.role === 'admin' && (
                <Link to="/admin" className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-white text-xs hover:bg-white/20 transition-colors">Admin</Link>
              )}
              <Link to="/settings" className="text-white/40 hover:text-white transition-colors"><Settings className="h-4 w-4" /></Link>
              <div className="hidden sm:flex items-center gap-2 ml-2 pl-3 border-l border-white/10">
                <div className="text-right">
                  <p className="text-xs font-medium text-white/80">{user?.name}</p>
                  <p className="text-[10px] text-white/30 capitalize">{user?.plan} plan</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-medium">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <button onClick={handleLogout} className="text-white/30 hover:text-white transition-colors"><LogOut className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: LayoutGrid, label: 'Total Projects', value: projectsList.length, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { icon: Globe, label: 'Published', value: publishedCount, color: 'text-green-400', bg: 'bg-green-500/10' },
            { icon: Zap, label: 'AI Credits', value: `${user?.ai_credits_remaining ?? 0} / ${user?.ai_credits_monthly_limit ?? 0}`, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 flex items-center gap-4">
              <div className={`rounded-lg ${stat.bg} p-3`}><stat.icon className={`h-5 w-5 ${stat.color}`} /></div>
              <div>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/40">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-white/20 focus:outline-none" />
          </div>
        </div>

        {error && <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">{error}</div>}

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-24 text-center">
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 mb-6">
              <FolderOpen className="h-12 w-12 text-white/20" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{search ? 'No projects found' : 'Create your first website'}</h3>
            <p className="text-white/40 mb-6 max-w-sm text-sm">{search ? 'Try a different search term.' : 'Get started by creating a new project. AI will help you build a beautiful website in minutes.'}</p>
            {!search && (
              <button onClick={() => setShowNewDialog(true)} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors">
                <Plus className="h-4 w-4" />New Project
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(project => (
              <motion.div key={project.id} variants={item}>
                <ProjectCard project={project} onDelete={handleDelete} onDuplicate={handleDuplicate} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* New Project Dialog */}
      {showNewDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={e => { if (e.target === e.currentTarget) { setShowNewDialog(false); setNewName(''); } }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md rounded-2xl border border-white/10 p-6" style={{ background: 'rgba(10,10,10,0.98)' }}>
            <h3 className="text-lg font-semibold text-white mb-1">Create New Project</h3>
            <p className="text-sm text-white/40 mb-5">Give your project a name to get started.</p>
            <form onSubmit={e => { e.preventDefault(); handleCreateProject(); }}>
              <input autoFocus value={newName} onChange={e => setNewName(e.target.value)} placeholder="My Awesome Website" required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 focus:border-white/20 focus:outline-none mb-5" />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => { setShowNewDialog(false); setNewName(''); }} className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={!newName.trim() || isCreating} className="px-5 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 disabled:opacity-40 transition-colors">
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;

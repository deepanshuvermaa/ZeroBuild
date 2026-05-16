import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Plus,
  LogOut,
  Search,
  LayoutGrid,
  Globe,
  Zap,
  FolderOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Dialog } from '@/components/shared/Dialog';
import { useAuthStore } from '@/store/authStore';
import { projects as projectsAPI } from '@/utils/api';
import { ProjectCard } from '@/components/Dashboard/ProjectCard';
import type { Project } from '@/types/api.types';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // New project dialog
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newName, setNewName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { projects } = await projectsAPI.list();
      setProjectsList(projects);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return projectsList;
    const q = search.toLowerCase();
    return projectsList.filter((p) => p.name.toLowerCase().includes(q));
  }, [projectsList, search]);

  const publishedCount = projectsList.filter((p) => p.status === 'published').length;

  const handleCreateProject = async () => {
    if (!newName.trim()) return;
    setIsCreating(true);
    try {
      const { project } = await projectsAPI.create(newName.trim());
      setShowNewDialog(false);
      setNewName('');
      navigate(`/editor/${project.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await projectsAPI.delete(id);
      setProjectsList((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete project');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const { project } = await projectsAPI.duplicate(id);
      setProjectsList((prev) => [project, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Failed to duplicate project');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userInitial = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ZeroBuild</span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="h-4 w-4" />}
                onClick={() => setShowNewDialog(true)}
              >
                New Project
              </Button>

              {/* User info */}
              <div className="hidden sm:flex items-center gap-3 ml-2 pl-3 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700 leading-tight">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">{user?.plan || 'Free'} plan</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                  {userInitial}
                </div>
              </div>

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-gray-200 bg-white p-5 flex items-center gap-4"
          >
            <div className="rounded-lg bg-blue-50 p-3">
              <LayoutGrid className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{projectsList.length}</p>
              <p className="text-sm text-gray-500">Total Projects</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-gray-200 bg-white p-5 flex items-center gap-4"
          >
            <div className="rounded-lg bg-green-50 p-3">
              <Globe className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{publishedCount}</p>
              <p className="text-sm text-gray-500">Published</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-gray-200 bg-white p-5 flex items-center gap-4"
          >
            <div className="rounded-lg bg-amber-50 p-3">
              <Zap className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {user?.ai_credits_remaining ?? 0}
                <span className="text-sm font-normal text-gray-400">
                  {' '}/ {user?.ai_credits_monthly_limit ?? 0}
                </span>
              </p>
              <p className="text-sm text-gray-500">AI Credits</p>
            </div>
          </motion.div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            className="max-w-md"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="rounded-2xl bg-gray-100 p-6 mb-6">
              <FolderOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {search
                ? 'No projects found'
                : 'Create your first website'}
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              {search
                ? 'Try a different search term.'
                : 'Get started by creating a new project. Our AI will help you build a beautiful website in minutes.'}
            </p>
            {!search && (
              <Button
                variant="primary"
                icon={<Plus className="h-4 w-4" />}
                onClick={() => setShowNewDialog(true)}
              >
                New Project
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project) => (
              <motion.div key={project.id} variants={item}>
                <ProjectCard
                  project={project}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* New Project Dialog */}
      <Dialog
        open={showNewDialog}
        onOpenChange={setShowNewDialog}
        title="Create New Project"
        description="Give your project a name to get started."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateProject();
          }}
          className="space-y-4"
        >
          <Input
            label="Project Name"
            placeholder="My Awesome Website"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            autoFocus
            required
          />
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowNewDialog(false);
                setNewName('');
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isCreating}
              disabled={!newName.trim()}
            >
              Create Project
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default ProjectList;

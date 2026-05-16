import { useState, useCallback } from 'react';
import { projects as projectsAPI } from '@/utils/api';
import type { Project, ProjectVersion } from '@/types/api.types';
import type { PageConfig } from '@/types/config.types';

export function useProject(projectId: string | null) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const loadProject = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const { project } = await projectsAPI.get(projectId);
      setProject(project);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const saveProject = useCallback(async (config: PageConfig) => {
    if (!projectId) return;
    setIsSaving(true);
    try {
      const { project } = await projectsAPI.update(projectId, { config });
      setProject(project);
      setLastSavedAt(new Date().toISOString());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }, [projectId]);

  return { project, isLoading, isSaving, error, lastSavedAt, loadProject, saveProject };
}

export function useProjects() {
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { projects } = await projectsAPI.list();
      setProjectsList(projects);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = useCallback(async (name: string) => {
    try {
      const { project } = await projectsAPI.create(name);
      setProjectsList(prev => [project, ...prev]);
      return project;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    try {
      await projectsAPI.delete(id);
      setProjectsList(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const duplicateProject = useCallback(async (id: string) => {
    try {
      const { project } = await projectsAPI.duplicate(id);
      setProjectsList(prev => [project, ...prev]);
      return project;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  return { projects: projectsList, isLoading, error, loadProjects, createProject, deleteProject, duplicateProject };
}

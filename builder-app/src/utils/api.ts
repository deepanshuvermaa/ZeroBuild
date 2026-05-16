import type { User, Project, ProjectVersion, Deployment, AICredits, LoginRequest, RegisterRequest, DeployRequest, AIGenerateRequest, AIEditRequest } from '@/types/api.types';
import type { PageConfig, SEOConfig } from '@/types/config.types';

const API_BASE = import.meta.env.VITE_API_URL || '';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// Auth
export const auth = {
  register: (data: RegisterRequest) => request<{ user: User }>('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: LoginRequest) => request<{ user: User }>('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request<{ message: string }>('/api/auth/logout', { method: 'POST' }),
  me: () => request<{ user: User }>('/api/auth/me'),
  forgotPassword: (email: string) => request<{ message: string }>('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (token: string, newPassword: string) => request<{ message: string }>('/api/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword }) }),
};

// Projects
export const projects = {
  list: () => request<{ projects: Project[] }>('/api/projects'),
  create: (name: string) => request<{ project: Project }>('/api/projects', { method: 'POST', body: JSON.stringify({ name }) }),
  get: (id: string) => request<{ project: Project }>(`/api/projects/${id}`),
  update: (id: string, data: { config?: PageConfig; name?: string }) => request<{ project: Project }>(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<{ message: string }>(`/api/projects/${id}`, { method: 'DELETE' }),
  duplicate: (id: string) => request<{ project: Project }>(`/api/projects/${id}/duplicate`, { method: 'POST' }),
  versions: (id: string) => request<{ versions: ProjectVersion[] }>(`/api/projects/${id}/versions`),
  restoreVersion: (id: string, vid: string) => request<{ project: Project }>(`/api/projects/${id}/versions/${vid}/restore`, { method: 'POST' }),
};

// AI
export const ai = {
  generate: (data: AIGenerateRequest) => request<{ config: PageConfig }>('/api/ai/generate', { method: 'POST', body: JSON.stringify(data) }),
  edit: (data: AIEditRequest) => request<{ props: Record<string, any> }>('/api/ai/edit', { method: 'POST', body: JSON.stringify(data) }),
  rewriteCopy: (sectionType: string, currentProps: any, instruction: string) => request<{ props: Record<string, any> }>('/api/ai/rewrite-copy', { method: 'POST', body: JSON.stringify({ sectionType, currentProps, instruction }) }),
  seo: (config: PageConfig) => request<{ seo: SEOConfig }>('/api/ai/seo', { method: 'POST', body: JSON.stringify({ config }) }),
  credits: () => request<AICredits>('/api/ai/credits'),
};

// Deploy
export const deploy = {
  create: (projectId: string, data: DeployRequest) => request<{ deployment: Deployment }>(`/api/deploy/${projectId}/deploy`, { method: 'POST', body: JSON.stringify(data) }),
  list: (projectId: string) => request<{ deployments: Deployment[] }>(`/api/deploy/${projectId}/deployments`),
};

// Assets
export const assets = {
  upload: async (file: File, projectId?: string): Promise<{ id: string; url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (projectId) formData.append('projectId', projectId);
    const res = await fetch(`${API_BASE}/api/assets/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(err.error);
    }
    return res.json();
  },
  list: () => request<{ assets: Array<{ id: string; filename: string; public_url: string; content_type: string; size_bytes: number }> }>('/api/assets'),
  delete: (id: string) => request<{ message: string }>(`/api/assets/${id}`, { method: 'DELETE' }),
};

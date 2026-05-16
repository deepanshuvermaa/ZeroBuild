export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  ai_credits_remaining: number;
  ai_credits_monthly_limit: number;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  config: import('./config.types').PageConfig;
  status: 'draft' | 'published' | 'archived';
  published_url: string | null;
  custom_domain: string | null;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectVersion {
  id: string;
  project_id: string;
  version_number: number;
  config: import('./config.types').PageConfig;
  change_description: string | null;
  created_at: string;
}

export interface Deployment {
  id: string;
  project_id: string;
  platform: 'railway' | 'cpanel';
  target: 'preview' | 'production';
  url: string | null;
  status: 'queued' | 'building' | 'deploying' | 'deployed' | 'failed' | 'rolled_back';
  deployed_at: string | null;
  created_at: string;
}

export interface AICredits {
  remaining: number;
  limit: number;
  resetsAt: string | null;
}

export interface APIError {
  error: string;
  details?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface DeployRequest {
  platform: 'railway' | 'cpanel';
  ftpConfig?: {
    host: string;
    user: string;
    password: string;
    path: string;
  };
}

export interface AIGenerateRequest {
  prompt: string;
  projectId?: string;
}

export interface AIEditRequest {
  projectId: string;
  sectionId: string;
  instruction: string;
  currentConfig: import('./config.types').PageConfig;
}

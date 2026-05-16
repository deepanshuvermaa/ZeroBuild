import { create } from 'zustand';
import type { PageConfig } from '@/types/config.types';
import type { PageSection } from '@/types/component.types';
import type { ComponentType } from '@/types/component.types';
import { generateId } from '@/lib/utils';

interface BuilderStore {
  config: PageConfig;
  selectedSectionId: string | null;
  isDragging: boolean;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  hasUnsavedChanges: boolean;
  projectId: string | null;
  isSaving: boolean;
  lastSavedAt: string | null;

  // Actions
  setConfig: (config: PageConfig) => void;
  addSection: (type: ComponentType, props: any) => void;
  updateSection: (id: string, props: any) => void;
  deleteSection: (id: string) => void;
  reorderSections: (sections: PageSection[]) => void;
  setSelectedSection: (id: string | null) => void;
  setIsDragging: (isDragging: boolean) => void;
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  updateMetadata: (metadata: Partial<PageConfig['metadata']>) => void;
  updateTheme: (theme: Partial<PageConfig['theme']>) => void;
  updateWhatsApp: (whatsapp: Partial<PageConfig['whatsapp']>) => void;
  updateSEO: (seo: Partial<PageConfig['seo']>) => void;
  resetConfig: () => void;
  markSaved: () => void;
  setProjectId: (id: string | null) => void;
  saveToServer: () => Promise<void>;
  loadFromServer: (projectId: string) => Promise<void>;
}

const defaultConfig: PageConfig = {
  metadata: {
    clientName: '',
    projectName: 'New Project',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: '1.0',
  },
  theme: {
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    fontFamily: 'Inter',
  },
  whatsapp: {
    phoneNumber: '',
    defaultMessage: 'Hi! I would like to know more about your services.',
    enabled: true,
  },
  seo: {
    title: 'Welcome',
    description: 'Welcome to our website',
    keywords: [],
  },
  sections: [],
};

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  config: defaultConfig,
  selectedSectionId: null,
  isDragging: false,
  previewMode: 'desktop',
  hasUnsavedChanges: false,
  projectId: null,
  isSaving: false,
  lastSavedAt: null,

  setConfig: (config) =>
    set({
      config,
      hasUnsavedChanges: false,
    }),

  addSection: (type, props) =>
    set((state) => {
      const newSection: PageSection = {
        id: generateId(),
        type,
        props,
        order: state.config.sections.length,
      };

      return {
        config: {
          ...state.config,
          sections: [...state.config.sections, newSection],
          metadata: {
            ...state.config.metadata,
            updatedAt: new Date().toISOString(),
          },
        },
        hasUnsavedChanges: true,
      };
    }),

  updateSection: (id, props) =>
    set((state) => ({
      config: {
        ...state.config,
        sections: state.config.sections.map((section) =>
          section.id === id ? { ...section, props: { ...section.props, ...props } } : section
        ),
        metadata: {
          ...state.config.metadata,
          updatedAt: new Date().toISOString(),
        },
      },
      hasUnsavedChanges: true,
    })),

  deleteSection: (id) =>
    set((state) => ({
      config: {
        ...state.config,
        sections: state.config.sections
          .filter((section) => section.id !== id)
          .map((section, index) => ({ ...section, order: index })),
        metadata: {
          ...state.config.metadata,
          updatedAt: new Date().toISOString(),
        },
      },
      selectedSectionId: state.selectedSectionId === id ? null : state.selectedSectionId,
      hasUnsavedChanges: true,
    })),

  reorderSections: (sections) =>
    set((state) => ({
      config: {
        ...state.config,
        sections: sections.map((section, index) => ({ ...section, order: index })),
        metadata: {
          ...state.config.metadata,
          updatedAt: new Date().toISOString(),
        },
      },
      hasUnsavedChanges: true,
    })),

  setSelectedSection: (id) =>
    set({
      selectedSectionId: id,
    }),

  setIsDragging: (isDragging) =>
    set({
      isDragging,
    }),

  setPreviewMode: (mode) =>
    set({
      previewMode: mode,
    }),

  updateMetadata: (metadata) =>
    set((state) => ({
      config: {
        ...state.config,
        metadata: {
          ...state.config.metadata,
          ...metadata,
          updatedAt: new Date().toISOString(),
        },
      },
      hasUnsavedChanges: true,
    })),

  updateTheme: (theme) =>
    set((state) => ({
      config: {
        ...state.config,
        theme: {
          ...state.config.theme,
          ...theme,
        },
        metadata: {
          ...state.config.metadata,
          updatedAt: new Date().toISOString(),
        },
      },
      hasUnsavedChanges: true,
    })),

  updateWhatsApp: (whatsapp) =>
    set((state) => ({
      config: {
        ...state.config,
        whatsapp: {
          ...state.config.whatsapp,
          ...whatsapp,
        },
        metadata: {
          ...state.config.metadata,
          updatedAt: new Date().toISOString(),
        },
      },
      hasUnsavedChanges: true,
    })),

  updateSEO: (seo) =>
    set((state) => ({
      config: {
        ...state.config,
        seo: {
          ...state.config.seo,
          ...seo,
        },
        metadata: {
          ...state.config.metadata,
          updatedAt: new Date().toISOString(),
        },
      },
      hasUnsavedChanges: true,
    })),

  resetConfig: () =>
    set({
      config: {
        ...defaultConfig,
        metadata: {
          ...defaultConfig.metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      selectedSectionId: null,
      hasUnsavedChanges: false,
    }),

  markSaved: () =>
    set({
      hasUnsavedChanges: false,
    }),

  setProjectId: (id) =>
    set({ projectId: id }),

  saveToServer: async () => {
    const { config, projectId } = get();
    if (!projectId) return;
    set({ isSaving: true });
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ config }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Save failed' }));
        throw new Error(err.error);
      }
      set({ hasUnsavedChanges: false, isSaving: false, lastSavedAt: new Date().toISOString() });
    } catch (error) {
      set({ isSaving: false });
      console.error('Failed to save to server:', error);
    }
  },

  loadFromServer: async (projectId) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to load project');
      const { project } = await res.json();
      set({
        config: project.config,
        projectId,
        hasUnsavedChanges: false,
        selectedSectionId: null,
      });
    } catch (error) {
      console.error('Failed to load from server:', error);
      throw error;
    }
  },
}));

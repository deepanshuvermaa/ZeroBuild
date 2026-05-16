import { create } from 'zustand';
import type { PageConfig } from '@/types/config.types';

interface HistoryStore {
  past: PageConfig[];
  future: PageConfig[];
  canUndo: boolean;
  canRedo: boolean;

  // Actions
  recordState: (state: PageConfig) => void;
  undo: () => PageConfig | null;
  redo: () => PageConfig | null;
  clearHistory: () => void;
}

const MAX_HISTORY = 50;

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,

  recordState: (state) =>
    set((current) => {
      const newPast = [...current.past, state].slice(-MAX_HISTORY);
      return {
        past: newPast,
        future: [],
        canUndo: newPast.length > 0,
        canRedo: false,
      };
    }),

  undo: () => {
    const { past, future } = get();
    if (past.length === 0) return null;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);

    set({
      past: newPast,
      future: [previous, ...future].slice(0, MAX_HISTORY),
      canUndo: newPast.length > 0,
      canRedo: true,
    });

    return previous;
  },

  redo: () => {
    const { past, future } = get();
    if (future.length === 0) return null;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      past: [...past, next].slice(-MAX_HISTORY),
      future: newFuture,
      canUndo: true,
      canRedo: newFuture.length > 0,
    });

    return next;
  },

  clearHistory: () =>
    set({
      past: [],
      future: [],
      canUndo: false,
      canRedo: false,
    }),
}));

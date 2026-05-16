import { create } from 'zustand';

type Mode = 'dark' | 'light';

interface ThemeStore {
  mode: Mode;
  toggle: () => void;
  setMode: (mode: Mode) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: (localStorage.getItem('zerobuild_mode') as Mode) || 'dark',
  toggle: () => set(state => {
    const next = state.mode === 'dark' ? 'light' : 'dark';
    localStorage.setItem('zerobuild_mode', next);
    return { mode: next };
  }),
  setMode: (mode) => { localStorage.setItem('zerobuild_mode', mode); set({ mode }); },
}));

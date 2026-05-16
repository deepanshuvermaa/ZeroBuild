import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X } from 'lucide-react';
import { useBuilderStore } from '@/store/builderStore';

const THEME_PRESETS = [
  { name: 'Minimal', primary: '#000000', secondary: '#6b7280', accent: '#3b82f6', font: 'Inter' },
  { name: 'Ocean', primary: '#0f172a', secondary: '#0ea5e9', accent: '#06b6d4', font: 'Inter' },
  { name: 'Forest', primary: '#14532d', secondary: '#16a34a', accent: '#84cc16', font: 'Lato' },
  { name: 'Sunset', primary: '#7c2d12', secondary: '#ea580c', accent: '#f59e0b', font: 'Poppins' },
  { name: 'Royal', primary: '#1e1b4b', secondary: '#7c3aed', accent: '#a78bfa', font: 'Playfair Display' },
  { name: 'Rose', primary: '#4c0519', secondary: '#e11d48', accent: '#fb7185', font: 'Montserrat' },
  { name: 'Slate', primary: '#1e293b', secondary: '#475569', accent: '#f8fafc', font: 'Space Grotesk' },
  { name: 'Warm', primary: '#451a03', secondary: '#d97706', accent: '#fbbf24', font: 'Merriweather' },
  { name: 'Neon', primary: '#020617', secondary: '#8b5cf6', accent: '#22d3ee', font: 'Montserrat' },
  { name: 'Earth', primary: '#292524', secondary: '#78716c', accent: '#a3e635', font: 'Raleway' },
  { name: 'Candy', primary: '#500724', secondary: '#ec4899', accent: '#f472b6', font: 'Poppins' },
  { name: 'Arctic', primary: '#f0f9ff', secondary: '#0284c7', accent: '#0369a1', font: 'Inter' },
];

export default function ThemePicker() {
  const [open, setOpen] = useState(false);
  const { config, updateTheme } = useBuilderStore();

  const applyTheme = (preset: typeof THEME_PRESETS[0]) => {
    updateTheme({ primaryColor: preset.primary, secondaryColor: preset.secondary, accentColor: preset.accent, fontFamily: preset.font });
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-white/40 hover:text-white/70 transition-colors" title="Theme">
        <Palette className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Theme</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(10,10,10,0.98)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Theme Presets</h3>
                <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {THEME_PRESETS.map(preset => (
                  <button key={preset.name} onClick={() => { applyTheme(preset); setOpen(false); }}
                    className="rounded-xl border border-white/10 p-3 hover:border-white/30 transition-colors text-left">
                    <div className="flex gap-1 mb-2">
                      <div className="w-4 h-4 rounded-full" style={{ background: preset.primary }} />
                      <div className="w-4 h-4 rounded-full" style={{ background: preset.secondary }} />
                      <div className="w-4 h-4 rounded-full" style={{ background: preset.accent }} />
                    </div>
                    <p className="text-[10px] text-white/60">{preset.name}</p>
                    <p className="text-[9px] text-white/30">{preset.font}</p>
                  </button>
                ))}
              </div>
              {/* Current theme */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <p className="text-[10px] text-white/30 mb-2">Current: {config.theme.fontFamily}</p>
                <div className="flex gap-1">
                  <div className="w-5 h-5 rounded-full border border-white/20" style={{ background: config.theme.primaryColor }} />
                  <div className="w-5 h-5 rounded-full border border-white/20" style={{ background: config.theme.secondaryColor }} />
                  <div className="w-5 h-5 rounded-full border border-white/20" style={{ background: config.theme.accentColor || '#fff' }} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

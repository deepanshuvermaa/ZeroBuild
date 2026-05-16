import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Clock, Lock } from 'lucide-react';
import { PreviewComponentMap } from '@/components/PreviewComponents';
import GenerationOverlay from '@/components/Builder/GenerationOverlay';
import type { PageConfig } from '@/types/config.types';

interface GuestPreviewProps {
  config: PageConfig | null;
  isGenerating: boolean;
  sectionTypes: string[];
}

export default function GuestPreview({ config, isGenerating, sectionTypes }: GuestPreviewProps) {
  const [overlayDone, setOverlayDone] = useState(false);

  if (isGenerating && !overlayDone) {
    return <GenerationOverlay isVisible sectionTypes={sectionTypes} onComplete={() => setOverlayDone(true)} />;
  }

  if (!config) return null;

  const sections = [...config.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="fixed inset-0 z-[90] bg-black">
      {/* Blurred site render behind overlay */}
      <div className="absolute inset-0 overflow-y-auto filter blur-[12px] pointer-events-none opacity-70">
        {sections.map(section => {
          const Component = PreviewComponentMap[section.type];
          if (!Component) return null;
          return <Component key={section.id} {...section.props} theme={config.theme} />;
        })}
      </div>

      {/* Dark overlay with CTA */}
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center px-6 max-w-lg"
        >
          <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-3">
            Your site is ready
          </h2>

          <p className="text-white/60 mb-8">
            We built {sections.length} sections in seconds.
            <br />Sign up free to unlock, edit, and publish it.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors text-center"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors text-center"
            >
              Sign In
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-white/30">
            <Clock className="w-3 h-3" />
            <span>Your progress is saved for 15 minutes</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

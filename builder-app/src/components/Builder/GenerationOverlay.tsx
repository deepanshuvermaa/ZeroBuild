import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';

interface GenerationOverlayProps {
  isVisible: boolean;
  sectionTypes?: string[];
  onComplete?: () => void;
}

const NARRATION_MAP: Record<string, string> = {
  HeroSection: 'Crafting your hero section...',
  AboutSection: 'Writing your story...',
  ServicesSection: 'Listing your services...',
  MenuSection: 'Building your menu...',
  GallerySection: 'Curating your gallery...',
  TestimonialsSection: 'Adding social proof...',
  OffersSection: 'Creating your offers...',
  CTASection: 'Designing call-to-action...',
  FooterSection: 'Finishing with footer...',
  FloatingWhatsApp: 'Adding WhatsApp widget...',
  CardSection: 'Laying out cards...',
  StatsSection: 'Adding statistics...',
  CategorySection: 'Organizing categories...',
  ProfileSection: 'Building profile...',
  PricingSection: 'Setting up pricing...',
  FAQSection: 'Writing FAQ answers...',
  TimelineSection: 'Creating timeline...',
  FeatureSection: 'Highlighting features...',
  JobBoardSection: 'Adding job listings...',
};

export default function GenerationOverlay({ isVisible, sectionTypes = [], onComplete }: GenerationOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isVisible) { setCurrentIndex(0); setCompleted(new Set()); return; }
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev < sectionTypes.length - 1) {
          setCompleted(c => new Set([...c, prev]));
          return prev + 1;
        }
        clearInterval(interval);
        setCompleted(c => new Set([...c, prev]));
        setTimeout(() => onComplete?.(), 800);
        return prev;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [isVisible, sectionTypes.length]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
    >
      <div className="w-full max-w-md px-6">
        {/* Pulsing icon */}
        <motion.div
          className="w-16 h-16 mx-auto mb-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1], borderColor: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-7 h-7 text-white/80" />
        </motion.div>

        {/* Current narration */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-center text-lg text-white/90 font-medium mb-8"
          >
            {NARRATION_MAP[sectionTypes[currentIndex]] || `Building section ${currentIndex + 1}...`}
          </motion.p>
        </AnimatePresence>

        {/* Progress steps */}
        <div className="space-y-2">
          {sectionTypes.map((type, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 text-sm transition-colors duration-300 ${
                completed.has(i) ? 'text-white/60' : i === currentIndex ? 'text-white' : 'text-white/20'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                {completed.has(i) ? (
                  <Check className="w-3.5 h-3.5 text-green-400" />
                ) : i === currentIndex ? (
                  <motion.div className="w-2 h-2 rounded-full bg-white" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                )}
              </div>
              <span>{NARRATION_MAP[type] || type}</span>
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-8 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white/40 rounded-full"
            animate={{ width: `${((completed.size) / Math.max(sectionTypes.length, 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

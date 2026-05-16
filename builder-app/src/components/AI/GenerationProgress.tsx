import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenerationProgressProps {
  isGenerating: boolean;
  currentStep?: string;
}

const STEPS = [
  'Analyzing your request...',
  'Planning page structure...',
  'Designing color palette...',
  'Writing compelling content...',
  'Assembling your website...',
];

const STEP_INTERVAL = 2500;

export const GenerationProgress: React.FC<GenerationProgressProps> = ({
  isGenerating,
  currentStep,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isGenerating) {
      setActiveIndex(0);
      setCompletedSteps(new Set());

      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => {
          if (prev < STEPS.length - 1) {
            setCompletedSteps((cs) => new Set([...cs, prev]));
            return prev + 1;
          }
          return prev;
        });
      }, STEP_INTERVAL);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Mark all steps complete when done
      setCompletedSteps(new Set(STEPS.map((_, i) => i)));
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isGenerating]);

  const displayStep = currentStep || STEPS[activeIndex];

  return (
    <div className="py-8 px-4">
      {/* Animated pulse ring */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <motion.div
            className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center"
            animate={
              isGenerating
                ? { scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }
                : { scale: 1, opacity: 1 }
            }
            transition={
              isGenerating
                ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.3 }
            }
          >
            {isGenerating ? (
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Check className="w-8 h-8 text-green-600" />
              </motion.div>
            )}
          </motion.div>
          {isGenerating && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-blue-400"
              animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </div>
      </div>

      {/* Current step text with typewriter effect */}
      <AnimatePresence mode="wait">
        <motion.p
          key={displayStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="text-center text-lg font-medium text-gray-800 mb-8"
        >
          {displayStep}
        </motion.p>
      </AnimatePresence>

      {/* Step list */}
      <div className="max-w-sm mx-auto space-y-3">
        {STEPS.map((step, index) => {
          const isComplete = completedSteps.has(index) || (!isGenerating && completedSteps.size > 0);
          const isActive = isGenerating && index === activeIndex;
          const isPending = isGenerating && index > activeIndex;

          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'flex items-center gap-3 text-sm transition-colors duration-300',
                isComplete && 'text-green-600',
                isActive && 'text-blue-700 font-medium',
                isPending && 'text-gray-400'
              )}
            >
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                {isComplete ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <Check className="w-4 h-4 text-green-500" />
                  </motion.div>
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                )}
              </div>
              <span>{step}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="max-w-sm mx-auto mt-6">
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
            initial={{ width: '0%' }}
            animate={{
              width: isGenerating
                ? `${((activeIndex + 1) / STEPS.length) * 100}%`
                : '100%',
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </div>
  );
};

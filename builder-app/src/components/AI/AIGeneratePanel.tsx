import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Dialog } from '@/components/shared/Dialog';
import { Button } from '@/components/shared/Button';
import { useBuilderStore } from '@/store/builderStore';
import { useHistoryStore } from '@/store/historyStore';
import { useAuthStore } from '@/store/authStore';
import { ai as aiAPI } from '@/utils/api';
import { GenerationProgress } from './GenerationProgress';

interface AIGeneratePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
}

const EXAMPLE_PROMPTS = [
  'Modern SaaS landing page with pricing',
  'Restaurant with menu and gallery',
  'Portfolio for a freelance designer',
  'Dental clinic with services and booking',
  'Real estate agency with listings',
];

const CREDITS_COST = 8;

const AIGeneratePanel: React.FC<AIGeneratePanelProps> = ({
  open,
  onOpenChange,
  projectId,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { config, setConfig } = useBuilderStore();
  const { recordState } = useHistoryStore();
  const { user, updateCredits } = useAuthStore();

  const creditsRemaining = user?.ai_credits_remaining ?? 0;
  const hasEnoughCredits = creditsRemaining >= CREDITS_COST;

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setError(null);
      setSuccess(false);
    }
  }, [open]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isGenerating || !hasEnoughCredits) return;

    setIsGenerating(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await aiAPI.generate({ prompt: prompt.trim(), projectId });

      // Record current state for undo before applying new config
      recordState(config);
      setConfig(result.config);
      updateCredits(creditsRemaining - CREDITS_COST);

      setSuccess(true);
      // Close after a brief success display
      setTimeout(() => {
        onOpenChange(false);
        setPrompt('');
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [
    prompt,
    isGenerating,
    hasEnoughCredits,
    projectId,
    config,
    recordState,
    setConfig,
    updateCredits,
    creditsRemaining,
    onOpenChange,
  ]);

  return (
    <Dialog
      open={open}
      onOpenChange={isGenerating ? () => {} : onOpenChange}
      title="Generate Website with AI"
      description="Describe your ideal website and our AI will build it for you."
    >
      <div className="space-y-5">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GenerationProgress isGenerating={isGenerating} />
            </motion.div>
          ) : success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </motion.div>
              <p className="text-lg font-semibold text-gray-900">Website generated!</p>
              <p className="text-sm text-gray-500 mt-1">Your new design is ready.</p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* Prompt textarea */}
              <div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your website... e.g., 'A modern landing page for a coffee shop with menu, gallery, and testimonials'"
                  rows={4}
                  disabled={isGenerating}
                  className={cn(
                    'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm',
                    'placeholder:text-gray-400 resize-none',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed'
                  )}
                />
              </div>

              {/* Example prompt chips */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Try an example:</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_PROMPTS.map((example) => (
                    <motion.button
                      key={example}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setPrompt(example)}
                      className={cn(
                        'px-3 py-1.5 text-xs rounded-full border transition-colors',
                        prompt === example
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                      )}
                    >
                      {example}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Credits info */}
              <div
                className={cn(
                  'flex items-center justify-between rounded-lg px-4 py-3 text-sm',
                  hasEnoughCredits
                    ? 'bg-blue-50 text-blue-800'
                    : 'bg-red-50 text-red-800'
                )}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>This will use {CREDITS_COST} AI credits</span>
                </div>
                <span className="font-medium">
                  Balance: {creditsRemaining} credits
                </span>
              </div>

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Generate button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleGenerate}
                disabled={!prompt.trim() || !hasEnoughCredits || isGenerating}
                isLoading={isGenerating}
                icon={<Sparkles className="w-5 h-5" />}
              >
                {!hasEnoughCredits ? 'Not enough credits' : 'Generate Website'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Dialog>
  );
};

export default AIGeneratePanel;

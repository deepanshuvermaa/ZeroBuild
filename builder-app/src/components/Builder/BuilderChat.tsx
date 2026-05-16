import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Loader2, Check } from 'lucide-react';
import { useBuilderStore } from '@/store/builderStore';
import { useAuthStore } from '@/store/authStore';
import { ai as aiAPI } from '@/utils/api';
import { useHistoryStore } from '@/store/historyStore';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: number;
}

export default function BuilderChat({ projectId }: { projectId?: string }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { config, setConfig, selectedSectionId, updateSection } = useBuilderStore();
  const { recordState } = useHistoryStore();
  const { user, updateCredits } = useAuthStore();

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollToBottom, [messages]);

  // Show context when section is selected
  useEffect(() => {
    if (selectedSectionId) {
      const section = config.sections.find(s => s.id === selectedSectionId);
      if (section) {
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'system' && last.content.includes(section.type)) return prev;
          return [...prev, {
            id: crypto.randomUUID(),
            role: 'system',
            content: `Selected: ${section.type} — "${(section.props as any)?.title || (section.props as any)?.companyName || 'section'}"`,
            timestamp: Date.now(),
          }];
        });
      }
    }
  }, [selectedSectionId]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    const userMsg = input.trim();
    setInput('');

    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'user', content: userMsg, timestamp: Date.now() }]);
    setIsProcessing(true);

    try {
      if (selectedSectionId) {
        // Edit selected section
        const result = await aiAPI.edit({
          projectId: projectId || '',
          sectionId: selectedSectionId,
          instruction: userMsg,
          currentConfig: config,
        });
        recordState(config);
        updateSection(selectedSectionId, result.props);
        setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'ai', content: '✓ Section updated.', timestamp: Date.now() }]);
      } else {
        // Full page generation
        const result = await aiAPI.generate({ prompt: userMsg, projectId });
        recordState(config);
        setConfig(result.config);
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(), role: 'ai',
          content: `Built ${result.config.sections.length} sections for "${result.config.metadata.projectName}".`,
          timestamp: Date.now(),
        }]);
      }
      // Refresh credits
      try {
        const credits = await aiAPI.credits();
        updateCredits(credits.remaining);
      } catch {}
    } catch (err: any) {
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'ai', content: `Error: ${err.message}`, timestamp: Date.now() }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black/40 backdrop-blur-2xl border-r border-white/[0.08]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white/90">ZeroBuild AI</span>
        </div>
        {config.sections.length > 0 && (
          <p className="text-xs text-white/40 mt-1">
            {config.sections.length} sections · {config.metadata.projectName}
          </p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-8 h-8 text-white/20 mx-auto mb-3" />
            <p className="text-sm text-white/40">
              {config.sections.length > 0
                ? 'Click a section to edit it, or type a new prompt.'
                : 'Describe your website to get started.'}
            </p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-sm ${
                msg.role === 'user' ? 'text-white ml-6' :
                msg.role === 'system' ? 'text-white/30 text-xs italic' :
                'text-white/70'
              }`}
            >
              {msg.role === 'user' && (
                <div className="bg-white/[0.08] rounded-xl px-3 py-2 border border-white/[0.06]">
                  {msg.content}
                </div>
              )}
              {msg.role === 'ai' && (
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-white/60" />
                  </div>
                  <span>{msg.content}</span>
                </div>
              )}
              {msg.role === 'system' && <span>— {msg.content}</span>}
            </motion.div>
          ))}
        </AnimatePresence>
        {isProcessing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-white/50">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>{selectedSectionId ? 'Editing section...' : 'Building your site...'}</span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Credits */}
      {user && (
        <div className="px-5 py-1.5 text-[10px] text-white/25">
          {user.ai_credits_remaining} credits remaining
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.1] rounded-xl px-3 py-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={selectedSectionId ? 'Edit this section...' : 'Describe your website...'}
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none"
            disabled={isProcessing}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            className="w-7 h-7 rounded-lg bg-white flex items-center justify-center disabled:opacity-30 hover:bg-white/90 transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}

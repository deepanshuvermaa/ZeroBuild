import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { useBuilderStore } from '@/store/builderStore';
import { useAuthStore } from '@/store/authStore';
import { ai as aiAPI } from '@/utils/api';
import { useHistoryStore } from '@/store/historyStore';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  created_at?: string;
}

export default function BuilderChat({ projectId }: { projectId?: string }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { config, setConfig, selectedSectionId, updateSection } = useBuilderStore();
  const { recordState } = useHistoryStore();
  const { user, updateCredits } = useAuthStore();

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollToBottom, [messages]);

  // Load persisted messages on mount
  useEffect(() => {
    if (!projectId) return;
    fetch(`/api/chat/${projectId}`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setMessages(data.messages.map((m: any) => ({ id: m.id, role: m.role, content: m.content, created_at: m.created_at })));
          if (data.summary) setSummary(data.summary);
        }
      })
      .catch(() => {});
    // Trigger summarize for old messages
    fetch(`/api/chat/${projectId}/summarize`, { method: 'POST', credentials: 'include' }).catch(() => {});
  }, [projectId]);

  // Persist a message to server
  const persistMessage = (role: string, content: string) => {
    if (!projectId) return;
    fetch(`/api/chat/${projectId}`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, content }),
    }).catch(() => {});
  };

  // Show context when section is selected
  useEffect(() => {
    if (selectedSectionId) {
      const section = config.sections.find(s => s.id === selectedSectionId);
      if (section) {
        const sysMsg = `Selected: ${section.type.replace('Section', '')} — "${(section.props as any)?.heading || (section.props as any)?.title || 'section'}"`;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'system' && last.content === sysMsg) return prev;
          return [...prev, { id: crypto.randomUUID(), role: 'system', content: sysMsg }];
        });
      }
    }
  }, [selectedSectionId]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    const userMsg = input.trim();
    setInput('');

    const userEntry: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: userMsg };
    setMessages(prev => [...prev, userEntry]);
    persistMessage('user', userMsg);
    setIsProcessing(true);

    try {
      let aiResponse = '';
      if (selectedSectionId) {
        const result = await aiAPI.edit({ projectId: projectId || '', sectionId: selectedSectionId, instruction: userMsg, currentConfig: config });
        recordState(config);
        updateSection(selectedSectionId, result.props);
        aiResponse = '✓ Section updated.';
      } else {
        const result = await aiAPI.generate({ prompt: userMsg, projectId });
        recordState(config);
        setConfig(result.config);
        aiResponse = `Built ${result.config.sections.length} sections for "${result.config.metadata.projectName}".`;
      }
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'ai', content: aiResponse }]);
      persistMessage('ai', aiResponse);
      try { const credits = await aiAPI.credits(); updateCredits(credits.remaining); } catch {}
    } catch (err: any) {
      const errMsg = `Error: ${err.message}`;
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'ai', content: errMsg }]);
      persistMessage('ai', errMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black/40 backdrop-blur-2xl border-r border-white/[0.08]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.08] flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white/90">ZeroBuild AI</span>
        </div>
        {config.sections.length > 0 && (
          <p className="text-[10px] text-white/30 mt-0.5">{config.sections.length} sections · {config.metadata.projectName}</p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 scrollbar-thin min-h-0">
        {summary && (
          <div className="text-[10px] text-white/20 italic border border-white/5 rounded-lg px-2 py-1.5 mb-2">
            Previous context: {summary}
          </div>
        )}
        {messages.length === 0 && !summary && (
          <div className="text-center py-8">
            <Sparkles className="w-6 h-6 text-white/15 mx-auto mb-2" />
            <p className="text-xs text-white/30">
              {config.sections.length > 0 ? 'Click a section to edit, or type a prompt.' : 'Describe your website to start.'}
            </p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className={`text-xs ${msg.role === 'user' ? 'text-white ml-4' : msg.role === 'system' ? 'text-white/20 italic' : 'text-white/60'}`}>
              {msg.role === 'user' && <div className="bg-white/[0.07] rounded-lg px-2.5 py-1.5 border border-white/[0.05]">{msg.content}</div>}
              {msg.role === 'ai' && (
                <div className="flex items-start gap-1.5">
                  <Sparkles className="w-3 h-3 text-white/40 mt-0.5 flex-shrink-0" />
                  <span>{msg.content}</span>
                </div>
              )}
              {msg.role === 'system' && <span className="text-[10px]">— {msg.content}</span>}
            </motion.div>
          ))}
        </AnimatePresence>
        {isProcessing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 text-xs text-white/40">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>{selectedSectionId ? 'Editing...' : 'Building...'}</span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Credits */}
      {user && <div className="px-4 py-1 text-[9px] text-white/20 flex-shrink-0">{user.ai_credits_remaining} credits</div>}

      {/* Input */}
      <div className="px-3 pb-3 flex-shrink-0">
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2">
          <input
            type="text" value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={selectedSectionId ? 'Edit this section...' : 'Describe your website...'}
            className="flex-1 bg-transparent text-xs text-white placeholder-white/25 focus:outline-none min-w-0"
            disabled={isProcessing}
          />
          <button onClick={handleSend} disabled={!input.trim() || isProcessing}
            className="w-6 h-6 rounded-lg bg-white flex items-center justify-center disabled:opacity-20 flex-shrink-0">
            <Send className="w-3 h-3 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}

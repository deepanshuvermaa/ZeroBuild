import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { useBuilderStore } from '@/store/builderStore';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
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
  const { mode } = useThemeStore();
  const dark = mode === 'dark';

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
    <div className={`h-full flex flex-col border-r ${dark ? 'bg-black/40 backdrop-blur-2xl border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
      {/* Header */}
      <div className={`px-4 py-3 border-b flex-shrink-0 ${dark ? 'border-white/[0.08]' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <Sparkles className={`w-4 h-4 ${dark ? 'text-white' : 'text-blue-600'}`} />
          <span className={`text-sm font-medium ${dark ? 'text-white/90' : 'text-gray-900'}`}>ZeroBuild AI</span>
        </div>
        {config.sections.length > 0 && (
          <p className={`text-[11px] mt-0.5 ${dark ? 'text-white/30' : 'text-gray-500'}`}>{config.sections.length} sections · {config.metadata.projectName}</p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 scrollbar-thin min-h-0">
        {summary && (
          <div className={`text-[11px] italic border rounded-lg px-2 py-1.5 mb-2 ${dark ? 'text-white/20 border-white/5' : 'text-gray-500 border-gray-200 bg-gray-100'}`}>
            Previous context: {summary}
          </div>
        )}
        {messages.length === 0 && !summary && (
          <div className="text-center py-8">
            <Sparkles className={`w-6 h-6 mx-auto mb-2 ${dark ? 'text-white/15' : 'text-gray-300'}`} />
            <p className={`text-sm ${dark ? 'text-white/30' : 'text-gray-500'}`}>
              {config.sections.length > 0 ? 'Click a section to edit, or type a prompt.' : 'Describe your website to start.'}
            </p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className={`text-sm ${msg.role === 'user' ? (dark ? 'text-white ml-4' : 'text-gray-900 ml-4') : msg.role === 'system' ? (dark ? 'text-white/20 italic' : 'text-gray-400 italic') : (dark ? 'text-white/70' : 'text-gray-700')}`}>
              {msg.role === 'user' && <div className={`rounded-lg px-3 py-2 border ${dark ? 'bg-white/[0.07] border-white/[0.05]' : 'bg-blue-50 border-blue-100'}`}>{msg.content}</div>}
              {msg.role === 'ai' && (
                <div className="flex items-start gap-1.5">
                  <Sparkles className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${dark ? 'text-white/40' : 'text-blue-500'}`} />
                  <span>{msg.content}</span>
                </div>
              )}
              {msg.role === 'system' && <span className="text-[11px]">— {msg.content}</span>}
            </motion.div>
          ))}
        </AnimatePresence>
        {isProcessing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex items-center gap-1.5 text-sm ${dark ? 'text-white/40' : 'text-gray-500'}`}>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>{selectedSectionId ? 'Editing...' : 'Building...'}</span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Credits */}
      {user && <div className={`px-4 py-1 text-[11px] flex-shrink-0 ${dark ? 'text-white/20' : 'text-gray-400'}`}>{user.ai_credits_remaining} credits</div>}

      {/* Input */}
      <div className="px-3 pb-3 flex-shrink-0">
        <div className={`flex items-center gap-2 border rounded-xl px-3 py-2 ${dark ? 'bg-white/[0.04] border-white/[0.08]' : 'bg-white border-gray-200 shadow-sm'}`}>
          <input
            type="text" value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={selectedSectionId ? 'Edit this section...' : 'Describe your website...'}
            className={`flex-1 bg-transparent text-sm focus:outline-none min-w-0 ${dark ? 'text-white placeholder-white/25' : 'text-gray-900 placeholder-gray-400'}`}
            disabled={isProcessing}
          />
          <button onClick={handleSend} disabled={!input.trim() || isProcessing}
            className={`w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-20 flex-shrink-0 ${dark ? 'bg-white' : 'bg-blue-600'}`}>
            <Send className={`w-3.5 h-3.5 ${dark ? 'text-black' : 'text-white'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, X, Send, ChevronDown } from 'lucide-react';

export default function SuggestionWidget() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Hide on editor pages to avoid overlap with chat panel
  if (location.pathname.startsWith('/editor')) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: text.trim(), name: name.trim() || 'Anonymous' }),
      });
      setSent(true);
      setTimeout(() => { setSent(false); setText(''); setName(''); setOpen(false); }, 2500);
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mb-3 w-72 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <p className="text-sm font-semibold text-white">Share Feedback</p>
              <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4">
              {sent ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
                  <p className="text-white text-sm font-medium">Thank you!</p>
                  <p className="text-white/40 text-xs mt-1">Your suggestion was received.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name (optional)" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/20 focus:border-white/30 focus:outline-none" />
                  <textarea value={text} onChange={e => setText(e.target.value)} placeholder="What can we improve?" rows={3} required className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/20 focus:border-white/30 focus:outline-none resize-none" />
                  <button type="submit" disabled={loading || !text.trim()} className="w-full flex items-center justify-center gap-2 rounded-xl bg-white py-2 text-sm font-semibold text-black hover:bg-gray-200 transition-colors disabled:opacity-40">
                    <Send className="h-4 w-4" />{loading ? 'Sending...' : 'Submit'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm font-medium text-white shadow-xl"
        style={{ background: 'rgba(20,20,20,0.9)', backdropFilter: 'blur(10px)' }}
      >
        {open ? <X className="h-4 w-4" /> : <MessageSquarePlus className="h-4 w-4" />}
        {open ? 'Close' : 'Suggest'}
      </motion.button>
    </div>
  );
}

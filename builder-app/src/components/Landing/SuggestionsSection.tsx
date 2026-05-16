import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';

export default function SuggestionsSection() {
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

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
    } catch {
      setSent(true); // still show success
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="suggestions" className="py-24 bg-gray-950">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4">Community</p>
          <h2 className="text-3xl sm:text-4xl font-light text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
            Shape ZeroBuild
          </h2>
          <p className="text-base text-white/50 mb-10">
            Got an idea or feature request? We read everything.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-8"
        >
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <p className="text-white font-semibold text-lg">Received. Thank you.</p>
              <p className="text-white/40 text-sm mt-2">Your suggestion helps us build a better product.</p>
              <button
                onClick={() => { setSent(false); setText(''); setName(''); }}
                className="mt-6 text-sm text-white/40 hover:text-white transition-colors underline"
              >
                Submit another
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="text-xs text-white/40 font-medium block mb-1.5">Your name (optional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Anonymous"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 focus:border-white/30 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 font-medium block mb-1.5">Your suggestion</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="I wish ZeroBuild could..."
                  rows={4}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 focus:border-white/30 focus:outline-none transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !text.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-black hover:bg-gray-200 transition-colors disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
                {loading ? 'Sending...' : 'Submit Suggestion'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { auth as authAPI } from '@/utils/api';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try { await authAPI.forgotPassword(email); setSent(true); }
    catch (err: any) { setError(err.message || 'Something went wrong.'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-black overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
        src="/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Blur overlay */}
      <div
        className="video-blur-overlay absolute inset-0 z-[1] pointer-events-none"
        style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
      />

      <div className="absolute inset-0 z-[2] bg-black/50 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <div
          className="rounded-2xl p-8 border border-white/10"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-white/70" />
              <span className="text-2xl font-bold text-white">ZeroBuild</span>
            </Link>
            <p className="text-white/40 text-sm">Reset your password</p>
          </div>

          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Check your email</h3>
              <p className="text-sm text-white/50 mb-6">
                We sent reset instructions to <span className="text-white/70">{email}</span>.
              </p>
              <Link to="/login" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to sign in
              </Link>
            </motion.div>
          ) : (
            <>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                >
                  {error}
                </motion.div>
              )}

              <p className="text-sm text-white/40 mb-6">
                Enter your account email and we'll send a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/50 font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:border-white/30 focus:outline-none focus:ring-0 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-black hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="mt-6 text-center">
                <Link to="/login" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => { clearError(); }, [clearError]);
  useEffect(() => { if (isAuthenticated) navigate('/dashboard'); }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (password.length < 8) { setLocalError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPassword) { setLocalError('Passwords do not match.'); return; }
    try { await register(email, password, name); navigate('/dashboard'); } catch {}
  };

  const displayError = localError || error;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-black overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
        src="/hero-raw.mp4"
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

      {/* Dark overlay */}
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
          {/* Brand */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-white/70" />
              <span className="text-2xl font-bold text-white">ZeroBuild</span>
            </Link>
            <p className="text-white/40 text-sm">Create your account</p>
          </div>

          {displayError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >
              {displayError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', type: 'text', value: name, onChange: setName, placeholder: 'John Doe', icon: User },
              { label: 'Email', type: 'email', value: email, onChange: setEmail, placeholder: 'you@example.com', icon: Mail },
              { label: 'Password', type: 'password', value: password, onChange: setPassword, placeholder: 'Min. 8 characters', icon: Lock },
              { label: 'Confirm Password', type: 'password', value: confirmPassword, onChange: setConfirmPassword, placeholder: 'Re-enter password', icon: Lock },
            ].map((field) => (
              <div key={field.label} className="space-y-1">
                <label className="text-xs text-white/50 font-medium">{field.label}</label>
                <div className="relative">
                  <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder={field.placeholder}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:border-white/30 focus:outline-none focus:ring-0 transition-colors"
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-black hover:bg-gray-200 transition-colors disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/40">
            Already have an account?{' '}
            <Link to="/login" className="text-white/70 hover:text-white font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterForm;

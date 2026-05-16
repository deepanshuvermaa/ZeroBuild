import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Zap, Globe, AlertTriangle, MessageSquare, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface UserStat {
  id: string;
  email: string;
  name: string;
  plan: string;
  ai_credits_remaining: number;
  ai_credits_monthly_limit: number;
  projects_count: number;
  ai_generations: number;
  tokens_used: number;
  failures: number;
  credits_used: number;
  created_at: string;
}

interface Suggestion {
  id: string;
  submitted_by: string;
  text: string;
  created_at: string;
}

interface AdminStats {
  users: UserStat[];
  suggestions: Suggestion[];
  totals: { users: number; projects: number; generations: number };
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'users' | 'suggestions'>('users');

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/stats', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setStats(data);
    } catch {
      setError('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold">Admin Dashboard</h1>
            <p className="text-xs text-white/40">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchStats} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button onClick={() => { logout(); navigate('/'); }} className="text-sm text-white/40 hover:text-white transition-colors">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">{error}</div>
        ) : stats ? (
          <>
            {/* Totals */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Users, label: 'Total Users', value: stats.totals.users },
                { icon: Globe, label: 'Total Projects', value: stats.totals.projects },
                { icon: Zap, label: 'AI Generations', value: stats.totals.generations },
                { icon: MessageSquare, label: 'Suggestions', value: stats.suggestions.length },
              ].map((s) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <s.icon className="h-5 w-5 text-white/40 mb-3" />
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-white/40 mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-white/10">
              {(['users', 'suggestions'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                    tab === t ? 'border-white text-white' : 'border-transparent text-white/40 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Users Table */}
            {tab === 'users' && (
              <div className="rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02]">
                        {['User', 'Plan', 'Projects', 'AI Gens', 'Credits Used', 'Tokens', 'Failures', 'Joined'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stats.users.map((u, i) => (
                        <tr key={u.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                          <td className="px-4 py-3">
                            <p className="font-medium text-white">{u.name}</p>
                            <p className="text-xs text-white/40">{u.email}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="rounded-full border border-white/20 px-2 py-0.5 text-xs capitalize">{u.plan}</span>
                          </td>
                          <td className="px-4 py-3 text-white/70">{u.projects_count}</td>
                          <td className="px-4 py-3 text-white/70">{u.ai_generations}</td>
                          <td className="px-4 py-3 text-white/70">{u.credits_used} / {u.ai_credits_monthly_limit}</td>
                          <td className="px-4 py-3 text-white/70">{u.tokens_used.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            {u.failures > 0 ? (
                              <span className="flex items-center gap-1 text-red-400">
                                <AlertTriangle className="h-3 w-3" />{u.failures}
                              </span>
                            ) : <span className="text-white/30">0</span>}
                          </td>
                          <td className="px-4 py-3 text-white/40 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Suggestions Table */}
            {tab === 'suggestions' && (
              <div className="space-y-3">
                {stats.suggestions.length === 0 ? (
                  <div className="text-center py-16 text-white/30">No suggestions yet.</div>
                ) : stats.suggestions.map((s) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
                  >
                    <p className="text-white/80 leading-relaxed mb-3">"{s.text}"</p>
                    <div className="flex items-center gap-3 text-xs text-white/30">
                      <span>{s.submitted_by}</span>
                      <span>&middot;</span>
                      <span>{new Date(s.created_at).toLocaleString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
}

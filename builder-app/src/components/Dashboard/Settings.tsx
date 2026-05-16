import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Crown,
  Zap,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Dialog } from '@/components/shared/Dialog';
import { useAuthStore } from '@/store/authStore';
import { Link } from 'react-router-dom';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export const Settings: React.FC = () => {
  const { user } = useAuthStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const creditsUsed = (user?.ai_credits_monthly_limit ?? 0) - (user?.ai_credits_remaining ?? 0);
  const creditsTotal = user?.ai_credits_monthly_limit ?? 0;
  const creditsPercent = creditsTotal > 0 ? (creditsUsed / creditsTotal) * 100 : 0;

  const planColors: Record<string, string> = {
    free: 'bg-gray-100 text-gray-700',
    pro: 'bg-blue-100 text-blue-700',
    business: 'bg-purple-100 text-purple-700',
    enterprise: 'bg-amber-100 text-amber-700',
  };

  const planBadgeClass = planColors[user?.plan || 'free'] || planColors.free;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8 space-y-8">
        {/* Profile */}
        <motion.section
          {...fadeUp}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-gray-200 bg-white p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-blue-50 p-2">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
          </div>

          <div className="space-y-4">
            <Input
              label="Full Name"
              value={user?.name || ''}
              leftIcon={<User className="h-4 w-4" />}
              readOnly
              className="bg-gray-50 cursor-default"
            />
            <Input
              label="Email"
              value={user?.email || ''}
              leftIcon={<Mail className="h-4 w-4" />}
              readOnly
              className="bg-gray-50 cursor-default"
            />
          </div>
        </motion.section>

        {/* Plan */}
        <motion.section
          {...fadeUp}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-gray-200 bg-white p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-purple-50 p-2">
              <Crown className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Plan</h2>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <p className="text-gray-700">Current plan:</p>
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize',
                  planBadgeClass
                )}
              >
                {user?.plan || 'Free'}
              </span>
            </div>
            <Link to="/pricing">
              <Button variant="outline" size="sm" icon={<ArrowUpRight className="h-4 w-4" />}>
                Upgrade
              </Button>
            </Link>
          </div>
        </motion.section>

        {/* AI Credits */}
        <motion.section
          {...fadeUp}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-gray-200 bg-white p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-amber-50 p-2">
              <Zap className="h-5 w-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">AI Credits</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                {user?.ai_credits_remaining ?? 0} credits remaining
              </span>
              <span className="text-gray-500">
                {creditsTotal} total
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(creditsPercent, 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={cn(
                  'h-full rounded-full',
                  creditsPercent > 80
                    ? 'bg-red-500'
                    : creditsPercent > 50
                      ? 'bg-amber-500'
                      : 'bg-blue-600'
                )}
              />
            </div>

            <p className="text-xs text-gray-400">
              {creditsUsed} of {creditsTotal} credits used this month.
              Credits reset at the start of each billing cycle.
            </p>
          </div>
        </motion.section>

        {/* Danger Zone */}
        <motion.section
          {...fadeUp}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-red-200 bg-white p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-red-50 p-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Danger Zone</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-500">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete Account
            </Button>
          </div>
        </motion.section>
      </main>

      {/* Delete Account Confirmation */}
      <Dialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action is permanent and cannot be undone. All your projects, data, and settings will be lost."
      >
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="ghost" onClick={() => setShowDeleteDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              // Placeholder -- API integration pending
              setShowDeleteDialog(false);
            }}
          >
            Yes, Delete My Account
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default Settings;

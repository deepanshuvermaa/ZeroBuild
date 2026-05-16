import React, { useState } from 'react';
import {
  Cloud,
  Server,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Rocket,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Dialog } from '@/components/shared/Dialog';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { deploy as deployAPI } from '@/utils/api';
import type { Deployment } from '@/types/api.types';

interface DeployPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

type Platform = 'railway' | 'cpanel';

interface FtpConfig {
  host: string;
  user: string;
  password: string;
  path: string;
}

const DEPLOY_STEPS = ['Building...', 'Deploying...', 'Configuring...'];

const DeployPanel: React.FC<DeployPanelProps> = ({
  open,
  onOpenChange,
  projectId,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [ftpConfig, setFtpConfig] = useState<FtpConfig>({
    host: '',
    user: '',
    password: '',
    path: '/public_html',
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const resetState = () => {
    setSelectedPlatform(null);
    setIsDeploying(false);
    setDeployStep(0);
    setDeployment(null);
    setError(null);
    setFtpConfig({ host: '', user: '', password: '', path: '/public_html' });
  };

  const handleDeploy = async (platform: Platform) => {
    setIsDeploying(true);
    setError(null);
    setDeployStep(0);

    // Simulate step progression
    const stepInterval = setInterval(() => {
      setDeployStep((prev) => {
        if (prev < DEPLOY_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 3000);

    try {
      const data: { platform: Platform; ftpConfig?: FtpConfig } = { platform };
      if (platform === 'cpanel') {
        data.ftpConfig = ftpConfig;
      }

      const result = await deployAPI.create(projectId, data);
      clearInterval(stepInterval);
      setDeployment(result.deployment);
    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err.message || 'Deployment failed. Please try again.');
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!deployment?.url) return;
    try {
      await navigator.clipboard.writeText(deployment.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback ignored
    }
  };

  const isCpanelValid =
    ftpConfig.host.trim() !== '' &&
    ftpConfig.user.trim() !== '' &&
    ftpConfig.password.trim() !== '';

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!isDeploying) {
          onOpenChange(v);
          if (!v) resetState();
        }
      }}
      title="Deploy Your Website"
      description="Choose a hosting platform and deploy your site in seconds."
    >
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {/* Deploying progress */}
          {isDeploying && (
            <motion.div
              key="deploying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-10 text-center"
            >
              <motion.div
                className="w-14 h-14 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
              </motion.div>
              <div className="space-y-3 max-w-xs mx-auto">
                {DEPLOY_STEPS.map((step, i) => (
                  <div
                    key={step}
                    className={cn(
                      'flex items-center gap-2 text-sm transition-colors',
                      i < deployStep && 'text-green-600',
                      i === deployStep && 'text-blue-700 font-medium',
                      i > deployStep && 'text-gray-400'
                    )}
                  >
                    {i < deployStep ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : i === deployStep ? (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    ) : (
                      <div className="w-4 h-4 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      </div>
                    )}
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Deployment success */}
          {deployment && !isDeploying && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center"
              >
                <Rocket className="w-7 h-7 text-green-600" />
              </motion.div>
              <p className="text-lg font-semibold text-gray-900 mb-1">
                Deployed successfully!
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Your website is now live.
              </p>

              {deployment.url && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Your site URL</p>
                  <p className="text-sm font-mono text-blue-600 break-all">
                    {deployment.url}
                  </p>
                </div>
              )}

              <div className="flex gap-2 justify-center">
                {deployment.url && (
                  <>
                    <Button
                      variant="primary"
                      size="md"
                      icon={<ExternalLink className="w-4 h-4" />}
                      onClick={() => window.open(deployment.url!, '_blank')}
                    >
                      Visit Site
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      icon={
                        copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )
                      }
                      onClick={handleCopyUrl}
                    >
                      {copied ? 'Copied!' : 'Copy URL'}
                    </Button>
                  </>
                )}
              </div>

              <div className="mt-4">
                <Button variant="ghost" size="sm" onClick={resetState}>
                  Deploy another
                </Button>
              </div>
            </motion.div>
          )}

          {/* Error state */}
          {error && !isDeploying && !deployment && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Deployment failed</p>
                <p className="mt-0.5">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-xs underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            </motion.div>
          )}

          {/* Platform selection */}
          {!isDeploying && !deployment && (
            <motion.div
              key="platforms"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Railway card */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={cn(
                  'rounded-xl border-2 p-5 cursor-pointer transition-colors',
                  selectedPlatform === 'railway'
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                )}
                onClick={() => setSelectedPlatform('railway')}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Cloud className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">Railway</h3>
                    <ul className="mt-1.5 space-y-1">
                      <li className="text-xs text-gray-500">
                        Managed hosting with automatic SSL
                      </li>
                      <li className="text-xs text-gray-500">
                        Free subdomain: yoursite.up.railway.app
                      </li>
                      <li className="text-xs text-gray-500">One-click deploy</li>
                    </ul>
                    {selectedPlatform === 'railway' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4"
                      >
                        <Button
                          variant="primary"
                          size="md"
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeploy('railway');
                          }}
                          icon={<Rocket className="w-4 h-4" />}
                        >
                          Deploy to Railway
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* cPanel card */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={cn(
                  'rounded-xl border-2 p-5 cursor-pointer transition-colors',
                  selectedPlatform === 'cpanel'
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                )}
                onClick={() => setSelectedPlatform('cpanel')}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Server className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">cPanel</h3>
                    <ul className="mt-1.5 space-y-1">
                      <li className="text-xs text-gray-500">
                        Upload to your own hosting via FTP
                      </li>
                    </ul>
                    {selectedPlatform === 'cpanel' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 space-y-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Input
                          label="FTP Host"
                          placeholder="ftp.yourdomain.com"
                          value={ftpConfig.host}
                          onChange={(e) =>
                            setFtpConfig((prev) => ({ ...prev, host: e.target.value }))
                          }
                        />
                        <Input
                          label="FTP Username"
                          placeholder="user@yourdomain.com"
                          value={ftpConfig.user}
                          onChange={(e) =>
                            setFtpConfig((prev) => ({ ...prev, user: e.target.value }))
                          }
                        />
                        <Input
                          label="FTP Password"
                          type="password"
                          placeholder="Your FTP password"
                          value={ftpConfig.password}
                          onChange={(e) =>
                            setFtpConfig((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }))
                          }
                        />
                        <Input
                          label="Remote Path"
                          placeholder="/public_html"
                          value={ftpConfig.path}
                          onChange={(e) =>
                            setFtpConfig((prev) => ({ ...prev, path: e.target.value }))
                          }
                        />
                        <Button
                          variant="primary"
                          size="md"
                          className="w-full"
                          disabled={!isCpanelValid}
                          onClick={() => handleDeploy('cpanel')}
                          icon={<Rocket className="w-4 h-4" />}
                        >
                          Deploy to cPanel
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Dialog>
  );
};

export default DeployPanel;

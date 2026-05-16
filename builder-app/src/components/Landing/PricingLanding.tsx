import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Plan {
  name: string;
  monthlyPrice: number;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

const plans: Plan[] = [
  {
    name: 'Free',
    monthlyPrice: 0,
    features: ['2 projects', '20 AI credits / mo', 'Community support', 'Export to HTML'],
  },
  {
    name: 'Starter',
    monthlyPrice: 15,
    features: ['10 projects', '150 AI credits / mo', 'Custom domains', 'Priority support'],
  },
  {
    name: 'Pro',
    monthlyPrice: 39,
    highlighted: true,
    badge: 'Most Popular',
    features: ['50 projects', '500 AI credits / mo', 'Everything in Starter', 'Version history', 'Priority builds'],
  },
  {
    name: 'Agency',
    monthlyPrice: 99,
    features: ['Unlimited projects', '2000 AI credits / mo', 'Everything in Pro', 'White label', 'Team access'],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function PricingLanding() {
  const [yearly, setYearly] = useState(false);
  const price = (monthly: number) => (monthly === 0 ? 0 : yearly ? Math.round(monthly * 0.8) : monthly);

  return (
    <section id="pricing" className="py-24 bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight" style={{ letterSpacing: '-0.03em' }}>
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-base text-white/50">Start free. Upgrade when you need more.</p>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setYearly(false)}
              className={cn('rounded-full px-5 py-2 text-sm font-medium transition-all', !yearly ? 'bg-white text-black' : 'text-white/60 hover:text-white')}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn('rounded-full px-5 py-2 text-sm font-medium transition-all', yearly ? 'bg-white text-black' : 'text-white/60 hover:text-white')}
            >
              Yearly
              <span className="ml-1.5 text-xs text-emerald-400 font-semibold">-20%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -4 }}
              className={cn(
                'relative flex flex-col rounded-2xl p-6 border transition-all',
                plan.highlighted
                  ? 'border-white/30 bg-white/[0.06]'
                  : 'border-white/10 bg-white/[0.02]'
              )}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-black shadow-sm">
                  {plan.badge}
                </span>
              )}

              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">{plan.name}</h3>

              <div className="mt-4 flex items-baseline gap-1 mb-6">
                {yearly && plan.monthlyPrice > 0 && (
                  <span className="text-base text-white/30 line-through">${plan.monthlyPrice}</span>
                )}
                <span className="text-4xl font-light text-white">${price(plan.monthlyPrice)}</span>
                {plan.monthlyPrice > 0 && <span className="text-sm text-white/40">/mo</span>}
              </div>

              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/50">
                    <Check className="h-4 w-4 mt-0.5 shrink-0 text-white/40" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={cn(
                  'block rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition-colors',
                  plan.highlighted
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'border border-white/20 text-white hover:bg-white/10'
                )}
              >
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

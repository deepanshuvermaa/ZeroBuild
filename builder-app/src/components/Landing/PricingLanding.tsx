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
    features: [
      '2 projects',
      '20 AI credits / mo',
      'Community support',
      'Export to HTML',
    ],
  },
  {
    name: 'Starter',
    monthlyPrice: 15,
    features: [
      '10 projects',
      '150 AI credits / mo',
      'Custom domains',
      'Priority support',
    ],
  },
  {
    name: 'Pro',
    monthlyPrice: 39,
    highlighted: true,
    badge: 'Most Popular',
    features: [
      '50 projects',
      '500 AI credits / mo',
      'Everything in Starter',
      'Version history',
      'Priority builds',
    ],
  },
  {
    name: 'Agency',
    monthlyPrice: 99,
    features: [
      'Unlimited projects',
      '2000 AI credits / mo',
      'Everything in Pro',
      'White label',
      'Team access',
    ],
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

  const price = (monthly: number) => {
    if (monthly === 0) return 0;
    return yearly ? Math.round(monthly * 0.8) : monthly;
  };

  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Start free. Upgrade when you need more.
          </p>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-white p-1 border border-slate-200 shadow-sm">
            <button
              onClick={() => setYearly(false)}
              className={cn(
                'rounded-full px-5 py-2 text-sm font-medium transition-all',
                !yearly
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn(
                'rounded-full px-5 py-2 text-sm font-medium transition-all',
                yearly
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Yearly
              <span className="ml-1.5 text-xs text-emerald-500 font-semibold">-20%</span>
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                'relative flex flex-col rounded-2xl p-6 bg-white border transition-shadow',
                plan.highlighted
                  ? 'border-indigo-600 ring-2 ring-indigo-600/20 shadow-lg'
                  : 'border-slate-200 shadow-sm'
              )}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  {plan.badge}
                </span>
              )}

              <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>

              <div className="mt-4 flex items-baseline gap-1">
                {yearly && plan.monthlyPrice > 0 && (
                  <span className="text-lg text-slate-400 line-through mr-1">
                    ${plan.monthlyPrice}
                  </span>
                )}
                <span className="text-4xl font-extrabold text-slate-900">
                  ${price(plan.monthlyPrice)}
                </span>
                {plan.monthlyPrice > 0 && (
                  <span className="text-sm text-slate-500">/mo</span>
                )}
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check className="h-4 w-4 mt-0.5 shrink-0 text-indigo-600" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={cn(
                  'mt-8 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors',
                  plan.highlighted
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
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

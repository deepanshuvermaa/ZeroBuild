import { motion } from 'framer-motion';
import {
  Sparkles,
  MousePointerClick,
  Palette,
  Rocket,
  Wand2,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Sparkles,
    title: 'AI Page Generation',
    description:
      'Describe your business in one sentence and get a complete website with copy, design, and layout.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    icon: MousePointerClick,
    title: 'Drag & Drop Editor',
    description:
      'Fine-tune every section with our intuitive visual editor. No coding required.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Palette,
    title: 'Smart Design System',
    description:
      'AI picks colors, fonts, and styles that match your brand. 19 section types available.',
    color: 'text-pink-600',
    bg: 'bg-pink-50',
  },
  {
    icon: Rocket,
    title: 'One-Click Deploy',
    description:
      'Deploy to Railway or cPanel with a single click. Custom domains supported.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    icon: Wand2,
    title: 'AI Editing Assistant',
    description:
      "Tell the AI to 'make it more modern' or 'change the theme to luxury' — it just works.",
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Static sites load in under 2 seconds. Lighthouse score 90+. Mobile responsive.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function FeaturesLanding() {
  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Everything You Need to Build Amazing Websites
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            From AI generation to one-click deployment
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.12)' }}
              className="group rounded-xl bg-white p-6 shadow-sm border border-slate-100 transition-shadow cursor-default"
            >
              <div
                className={cn(
                  'inline-flex items-center justify-center h-12 w-12 rounded-lg mb-4',
                  feature.bg
                )}
              >
                <feature.icon className={cn('h-6 w-6', feature.color)} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

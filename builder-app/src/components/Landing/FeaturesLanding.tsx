import { motion } from 'framer-motion';
import {
  Wand2,
  MousePointerClick,
  Layers,
  Rocket,
  SlidersHorizontal,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Wand2,
    title: 'One Prompt, Full Website',
    description:
      'Describe your business and the AI assembles a complete multi-section website — copy, colors, layout — in under 60 seconds.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    icon: Layers,
    title: 'Every Section, Your Way',
    description:
      'Hero, Pricing, FAQ, Gallery, Testimonials — each section is independently editable. Change one without touching the rest.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: MousePointerClick,
    title: 'Drag & Drop Reorder',
    description:
      'Reorder sections instantly by dragging. The AI generates the structure; you decide the final order.',
    color: 'text-pink-600',
    bg: 'bg-pink-50',
  },
  {
    icon: Rocket,
    title: 'One-Click Deployment',
    description:
      'Deploy to Railway or upload to cPanel FTP in a single click. Custom domains supported out of the box.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    icon: SlidersHorizontal,
    title: 'AI Section Editing',
    description:
      'Select any section and tell the AI what to change — "make this more professional", "add 3 more features". It updates instantly.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Zap,
    title: 'Production-Ready Output',
    description:
      'Static sites that load in under 2 seconds. Mobile responsive. Lighthouse 90+. Export as clean HTML at any time.',
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
            Build Everything. Control Everything.
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            AI does the heavy lifting. You have full control over every section.
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

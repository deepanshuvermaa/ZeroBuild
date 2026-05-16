import { motion } from 'framer-motion';
import { Wand2, MousePointerClick, Layers, Rocket, SlidersHorizontal, Zap } from 'lucide-react';

const features = [
  {
    icon: Wand2,
    title: 'One Prompt, Full Website',
    description: 'Describe your business and AI assembles a complete multi-section website — copy, colors, layout — in under 60 seconds.',
    color: 'text-indigo-400',
    border: 'border-indigo-500/20',
    glow: 'bg-indigo-500/5',
  },
  {
    icon: Layers,
    title: 'Every Section, Your Way',
    description: 'Hero, Pricing, FAQ, Gallery, Testimonials — each section is independently editable. Change one without touching the rest.',
    color: 'text-purple-400',
    border: 'border-purple-500/20',
    glow: 'bg-purple-500/5',
  },
  {
    icon: MousePointerClick,
    title: 'Drag & Drop Reorder',
    description: 'Reorder sections by dragging. The AI generates the structure; you decide the final order.',
    color: 'text-pink-400',
    border: 'border-pink-500/20',
    glow: 'bg-pink-500/5',
  },
  {
    icon: Rocket,
    title: 'One-Click Deployment',
    description: 'Deploy to Railway or upload to cPanel FTP in a single click. Custom domains supported.',
    color: 'text-orange-400',
    border: 'border-orange-500/20',
    glow: 'bg-orange-500/5',
  },
  {
    icon: SlidersHorizontal,
    title: 'AI Section Editing',
    description: 'Select any section and tell the AI what to change. "Make it more professional." It updates instantly.',
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
    glow: 'bg-emerald-500/5',
  },
  {
    icon: Zap,
    title: 'Production-Ready Output',
    description: 'Static sites load in under 2 seconds. Mobile responsive. Lighthouse 90+. Export as clean HTML anytime.',
    color: 'text-amber-400',
    border: 'border-amber-500/20',
    glow: 'bg-amber-500/5',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function FeaturesLanding() {
  return (
    <section id="features" className="py-24 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4">Capabilities</p>
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight" style={{ letterSpacing: '-0.03em' }}>
            Build Everything. Control Everything.
          </h2>
          <p className="mt-4 text-base text-white/50 max-w-xl mx-auto">
            AI does the heavy lifting. You have full control over every section.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className={`rounded-2xl border ${feature.border} ${feature.glow} p-6 backdrop-blur-sm transition-all cursor-default`}
            >
              <feature.icon className={`h-6 w-6 ${feature.color} mb-4`} />
              <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { MessageSquareText, MousePointerClick, Rocket } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: MessageSquareText,
    title: 'Type Your Prompt',
    description: 'Describe your business in plain English. "A landing page for a dental clinic with pricing and testimonials." That\'s it.',
    color: 'text-indigo-400',
    border: 'border-indigo-500/20',
  },
  {
    num: '02',
    icon: MousePointerClick,
    title: 'Edit Every Section',
    description: 'Your full website appears instantly. Drag sections, click to edit text, swap colors, upload images — each section is yours.',
    color: 'text-purple-400',
    border: 'border-purple-500/20',
  },
  {
    num: '03',
    icon: Rocket,
    title: 'Deploy in One Click',
    description: 'Push live to Railway or upload to cPanel. Prompt to published without a single line of code.',
    color: 'text-pink-400',
    border: 'border-pink-500/20',
  },
];

const stepVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function HowItWorks() {
  return (
    <section id="howitworks" className="py-24 bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4">The Flow</p>
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight" style={{ letterSpacing: '-0.03em' }}>
            Prompt. Edit. Deploy.
          </h2>
          <p className="mt-4 text-base text-white/50 max-w-lg mx-auto">
            Idea to live website in under 2 minutes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              custom={i}
              variants={stepVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className={`relative rounded-2xl border ${step.border} bg-white/[0.02] p-8`}
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-4xl font-light text-white/10 tabular-nums">{step.num}</span>
                <step.icon className={`h-5 w-5 ${step.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Section types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center"
        >
          <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-5">19 Section Types — All Editable</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Hero', 'About', 'Features', 'Services', 'Pricing', 'FAQ', 'Testimonials', 'Gallery', 'Stats', 'CTA', 'Cards', 'Timeline', 'Menu', 'Job Board', 'Profiles', 'Categories', 'Offers', 'WhatsApp', 'Footer'].map((s) => (
              <span key={s} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                {s}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { MessageSquareText, MousePointerClick, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  {
    num: 1,
    icon: MessageSquareText,
    title: 'Type Your Prompt',
    description:
      'Describe your business in plain English. "A modern landing page for a dental clinic with pricing and testimonials." That\'s it.',
  },
  {
    num: 2,
    icon: MousePointerClick,
    title: 'Edit Every Section',
    description:
      'Your full website appears instantly. Drag sections to reorder, click to edit text, swap colors, upload images — each section is fully customizable.',
  },
  {
    num: 3,
    icon: Rocket,
    title: 'Deploy in One Click',
    description:
      'Push live to Railway or upload to cPanel. Your site goes from prompt to published without touching a single line of code.',
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
    <section className="py-24 bg-white">
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
            Prompt. Edit. Deploy.
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-xl mx-auto">
            The entire flow from idea to live website takes under 2 minutes.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Connector line — desktop only */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] border-t-2 border-dashed border-slate-200 pointer-events-none" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              custom={i}
              variants={stepVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Number circle */}
              <div className="relative z-10 flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-xl font-bold shadow-lg shadow-indigo-600/20 mb-6">
                {step.num}
              </div>

              {/* Icon */}
              <div className="mb-4 inline-flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-50">
                <step.icon className="h-6 w-6 text-indigo-600" />
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Section types callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-20 rounded-2xl bg-slate-50 border border-slate-200 p-8 text-center"
        >
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3">
            19 Section Types — All Editable
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Hero', 'About', 'Features', 'Services', 'Pricing', 'FAQ', 'Testimonials', 'Gallery', 'Stats', 'CTA', 'Cards', 'Timeline', 'Menu', 'Job Board', 'Profiles', 'Categories', 'Offers', 'WhatsApp', 'Footer'].map((s) => (
              <span
                key={s}
                className="rounded-full bg-white border border-slate-200 px-3 py-1 text-xs text-slate-600 shadow-sm"
              >
                {s}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

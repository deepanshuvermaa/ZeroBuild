import { motion } from 'framer-motion';
import { MessageSquareText, SlidersHorizontal, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  {
    num: 1,
    icon: MessageSquareText,
    title: 'Describe',
    description:
      "Tell AI what you want. 'A modern landing page for my coffee shop with menu and gallery.'",
  },
  {
    num: 2,
    icon: SlidersHorizontal,
    title: 'Customize',
    description:
      'Fine-tune with drag-and-drop. Edit text, colors, images, and layout.',
  },
  {
    num: 3,
    icon: Rocket,
    title: 'Deploy',
    description:
      'One click to go live. Your site is ready for the world.',
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
            Three Steps to Your Perfect Website
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            From idea to live site in minutes
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Dotted connector line — desktop only */}
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
      </div>
    </section>
  );
}

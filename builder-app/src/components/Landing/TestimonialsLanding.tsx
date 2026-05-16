import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    quote:
      'ZeroBuild saved us hours of development time. We went from idea to deployed site in under 10 minutes.',
    name: 'Sarah K.',
    role: 'Agency Owner',
    initials: 'SK',
    color: 'bg-indigo-600',
  },
  {
    quote:
      'The AI understood our pharmacy business perfectly on the first prompt. Every section was exactly what we needed.',
    name: 'Dr. Ahmed R.',
    role: 'PharmaBill',
    initials: 'AR',
    color: 'bg-purple-600',
  },
  {
    quote:
      "Finally a website builder that doesn't require a CS degree. I edit each section myself and my clients love it.",
    name: 'Marco T.',
    role: 'Freelancer',
    initials: 'MT',
    color: 'bg-pink-600',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function TestimonialsLanding() {
  return (
    <section
      id="testimonials"
      className="py-24 bg-gradient-to-b from-white via-indigo-50/40 to-white"
    >
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
            What Builders Say
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Real results from real users
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="relative rounded-2xl bg-white p-6 shadow-sm border border-slate-100"
            >
              <Quote className="h-8 w-8 text-indigo-100 mb-4" />

              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star key={si} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-slate-700 leading-relaxed mb-6">"{t.quote}"</p>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div
                  className={cn(
                    'flex items-center justify-center h-10 w-10 rounded-full text-sm font-semibold text-white',
                    t.color
                  )}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

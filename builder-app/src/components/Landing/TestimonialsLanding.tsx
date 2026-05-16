import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: 'ZeroBuild saved us hours of development time. We went from idea to deployed site in under 10 minutes.',
    name: 'Sarah K.',
    role: 'Agency Owner',
    initials: 'SK',
  },
  {
    quote: 'The AI understood our pharmacy business perfectly on the first prompt. Every section was exactly what we needed.',
    name: 'Dr. Ahmed R.',
    role: 'PharmaBill',
    initials: 'AR',
  },
  {
    quote: "Finally a website builder that doesn't require a CS degree. I edit each section myself and my clients love it.",
    name: 'Marco T.',
    role: 'Freelancer',
    initials: 'MT',
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
    <section id="testimonials" className="py-24 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4">Reviews</p>
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight" style={{ letterSpacing: '-0.03em' }}>
            What Builders Say
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star key={si} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-sm text-white/70 leading-relaxed mb-6">"{t.quote}"</p>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-center h-9 w-9 rounded-full bg-white/10 text-xs font-semibold text-white">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

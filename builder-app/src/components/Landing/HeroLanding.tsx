import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, LayoutGrid, Gauge, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

const floatingElements = [
  { top: '12%', left: '8%', size: 60, delay: 0, char: '<div>' },
  { top: '20%', right: '10%', size: 50, delay: 1.2, char: '{ }' },
  { top: '55%', left: '5%', size: 45, delay: 0.8, char: 'CSS' },
  { top: '65%', right: '7%', size: 55, delay: 2, char: '</>' },
  { top: '35%', left: '12%', size: 40, delay: 1.5, char: '( )' },
  { top: '75%', right: '15%', size: 35, delay: 0.5, char: 'AI' },
];

const stats = [
  { icon: LayoutGrid, label: '19 Section Types', value: '19' },
  { icon: Gauge, label: '< 2s Page Load', value: '<2s' },
  { icon: Timer, label: '60s to Generate', value: '60s' },
];

export default function HeroLanding() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 pt-16">
      {/* Floating decorative elements */}
      {floatingElements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute hidden md:flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/20 font-mono text-xs select-none pointer-events-none"
          style={{
            top: el.top,
            left: el.left,
            right: el.right,
            width: el.size,
            height: el.size,
          }}
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: el.delay,
            ease: 'easeInOut',
          }}
        >
          {el.char}
        </motion.div>
      ))}

      {/* Radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300 mb-8 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
        >
          <span>✨</span> AI-Powered Website Builder
        </motion.div>

        {/* Heading */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight"
        >
          Build Stunning Websites
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            With Just One Sentence
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-slate-400 leading-relaxed"
        >
          Describe your vision, and our AI creates a complete, production-ready website
          in under 60 seconds. Then fine-tune with our drag-and-drop editor.
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 hover:shadow-indigo-600/40 transition-all"
          >
            Start Building Free
            <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
          </Link>
          <button className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition-all">
            <Play className="h-4 w-4" />
            Watch Demo
          </button>
        </motion.div>

        {/* Sub-CTA text */}
        <motion.p
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-5 text-sm text-slate-500"
        >
          No credit card required &middot; 2 free projects &middot; 50 AI credits
        </motion.p>

        {/* Browser Mockup */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-14 max-w-3xl"
        >
          <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl overflow-hidden">
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <span className="h-3 w-3 rounded-full bg-green-400/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="rounded-md bg-white/10 px-4 py-1 text-xs text-slate-400 font-mono">
                  pageforge.app/preview
                </div>
              </div>
            </div>
            {/* Fake website content */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="h-6 w-32 rounded bg-indigo-500/30" />
              <div className="h-10 w-3/4 rounded bg-white/10" />
              <div className="h-4 w-full rounded bg-white/5" />
              <div className="h-4 w-5/6 rounded bg-white/5" />
              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="h-24 rounded-lg bg-indigo-500/10 border border-indigo-500/20" />
                <div className="h-24 rounded-lg bg-purple-500/10 border border-purple-500/20" />
                <div className="h-24 rounded-lg bg-pink-500/10 border border-pink-500/20" />
              </div>
              <div className="flex gap-3 pt-2">
                <div className="h-8 w-28 rounded-md bg-indigo-600/50" />
                <div className="h-8 w-28 rounded-md bg-white/10" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          custom={6}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-14 mb-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 text-slate-400">
              <stat.icon className="h-5 w-5 text-indigo-400" />
              <span className="text-sm font-medium">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

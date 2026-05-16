import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MousePointerClick, Wand2, Layers } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

const floatingElements = [
  { top: '12%', left: '8%', size: 58, delay: 0, char: '<Hero />' },
  { top: '22%', right: '9%', size: 52, delay: 1.2, char: '<CTA />' },
  { top: '55%', left: '5%', size: 48, delay: 0.8, char: '<FAQ />' },
  { top: '65%', right: '7%', size: 54, delay: 2, char: '<Nav />' },
  { top: '38%', left: '11%', size: 42, delay: 1.5, char: '{ ai }' },
  { top: '75%', right: '14%', size: 38, delay: 0.5, char: 'drag' },
];

const pills = [
  { icon: Wand2, label: 'One prompt' },
  { icon: Layers, label: 'Full website generated' },
  { icon: MousePointerClick, label: 'Edit every section' },
];

export default function HeroLanding() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 pt-16">
      {/* Floating decorative elements */}
      {floatingElements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute hidden md:flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/20 font-mono text-xs select-none pointer-events-none px-2"
          style={{ top: el.top, left: el.left, right: el.right, height: el.size }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: el.delay, ease: 'easeInOut' }}
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
          <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
          AI Website Builder
        </motion.div>

        {/* Heading */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight"
        >
          One Prompt.
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            A Complete Website.
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
          Type what your business does. ZeroBuild's AI generates every section — hero, features, pricing, FAQ, footer — fully styled and ready to go. Then drag, drop, and edit each section your way.
        </motion.p>

        {/* How it works pills */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {pills.map((pill, i) => (
            <div key={pill.label} className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/8 border border-white/10 px-4 py-2 text-sm text-slate-300">
                <pill.icon className="h-4 w-4 text-indigo-400" />
                {pill.label}
              </div>
              {i < pills.length - 1 && (
                <ArrowRight className="h-4 w-4 text-slate-600 hidden sm:block" />
              )}
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 hover:shadow-indigo-600/40 transition-all"
          >
            Build Your Site Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition-all"
          >
            Sign In
          </Link>
        </motion.div>

        <motion.p
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-5 text-sm text-slate-500"
        >
          Free to start — no credit card required
        </motion.p>

        {/* Browser Mockup */}
        <motion.div
          custom={6}
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
                  zerobuild.app/editor
                </div>
              </div>
            </div>
            {/* Prompt bar */}
            <div className="border-b border-white/10 px-6 py-3 flex items-center gap-3">
              <div className="flex-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 text-xs text-indigo-300 text-left font-mono">
                "Modern SaaS landing page for a pharmacy billing software"
              </div>
              <div className="rounded-lg bg-indigo-600 px-3 py-2 text-xs text-white font-semibold whitespace-nowrap">
                Generate
              </div>
            </div>
            {/* Fake website content */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-24 rounded bg-indigo-500/30" />
                <div className="h-5 w-16 rounded bg-green-500/20" />
              </div>
              <div className="h-8 w-3/4 rounded bg-white/10" />
              <div className="h-4 w-full rounded bg-white/5" />
              <div className="h-4 w-5/6 rounded bg-white/5" />
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="h-20 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <div className="h-3 w-12 rounded bg-indigo-400/30" />
                </div>
                <div className="h-20 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <div className="h-3 w-12 rounded bg-purple-400/30" />
                </div>
                <div className="h-20 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                  <div className="h-3 w-12 rounded bg-pink-400/30" />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <div className="h-8 w-28 rounded-md bg-indigo-600/50" />
                <div className="h-8 w-28 rounded-md bg-white/10" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          custom={7}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-12 mb-16 flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16"
        >
          {[
            { value: '19', label: 'Section Types' },
            { value: '<60s', label: 'Generation Time' },
            { value: '100%', label: 'Edit Control' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

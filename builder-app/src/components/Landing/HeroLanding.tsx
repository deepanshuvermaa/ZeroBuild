import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  User,
  Menu,
  X,
  Play,
  Star,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#howitworks' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Get Started', href: '/register' },
];

export default function HeroLanding() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden flex flex-col">

      {/* ── Background Video ── */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* ── Bottom blur overlay (no gradient darkening, only blur) ── */}
      <div
        className="video-blur-overlay absolute inset-0 z-[1] pointer-events-none"
        style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
      />

      {/* ── Subtle dark vignette at top for navbar readability ── */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/60 to-transparent z-[2] pointer-events-none" />

      {/* ── Navbar ── */}
      <nav className="relative z-50 flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 md:py-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 animate-blur-fade-up"
          style={{ animationDelay: '0ms' }}
        >
          <Sparkles className="h-5 w-5 text-white" />
          <span className="text-xl font-bold tracking-tight text-white">ZeroBuild</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              className="animate-blur-fade-up text-sm text-white/80 hover:text-white transition-colors"
              style={{ animationDelay: `${100 + i * 50}ms` }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop right buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            className="animate-blur-fade-up liquid-glass flex items-center gap-2 rounded-full px-4 md:px-6 py-2 text-sm font-medium text-white"
            style={{ animationDelay: '350ms' }}
          >
            <Search size={16} />
            Search
          </button>
          <Link
            to="/login"
            className="animate-blur-fade-up liquid-glass flex items-center justify-center w-10 h-10 rounded-full"
            style={{ animationDelay: '400ms' }}
          >
            <User size={18} className="text-white" />
          </Link>
        </div>

        {/* Hamburger — below lg */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="animate-blur-fade-up liquid-glass lg:hidden flex items-center justify-center w-10 h-10 rounded-full"
          style={{ animationDelay: '350ms' }}
        >
          <span className={`transition-all duration-500 ease-out ${mobileOpen ? 'rotate-180 opacity-0 scale-50 absolute' : 'rotate-0 opacity-100 scale-100'}`}>
            <Menu size={18} className="text-white" />
          </span>
          <span className={`transition-all duration-500 ease-out ${mobileOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-180 opacity-0 scale-50 absolute'}`}>
            <X size={18} className="text-white" />
          </span>
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      <div
        className={`absolute top-[72px] left-0 right-0 z-40 lg:hidden transition-all duration-500 ease-out
          ${mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}
      >
        <div className="bg-gray-900/95 backdrop-blur-lg border-t border-b border-gray-800 shadow-2xl">
          <div className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 px-3 rounded-lg text-sm text-white hover:bg-gray-800/50 transition-all"
                style={{
                  transform: mobileOpen ? 'translateX(0)' : 'translateX(-12px)',
                  transitionDelay: `${i * 50}ms`,
                  opacity: mobileOpen ? 1 : 0,
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3 px-7 py-4 border-t border-gray-800 sm:hidden">
            <button className="liquid-glass flex items-center gap-2 rounded-full px-5 py-2 text-sm text-white">
              <Search size={16} /> Search
            </button>
            <Link to="/login" className="liquid-glass flex items-center justify-center w-10 h-10 rounded-full">
              <User size={18} className="text-white" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Hero Content ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-4 sm:px-6 md:px-12 pb-8 md:pb-16">
        <div className="flex flex-col md:flex-row items-end gap-8">

          {/* Left — text content */}
          <div className="flex-1">
            {/* Metadata row */}
            <div
              className="animate-blur-fade-up flex flex-wrap items-center gap-3 sm:gap-6 mb-6 md:mb-8 text-xs sm:text-sm text-white/80"
              style={{ animationDelay: '300ms' }}
            >
              <span className="flex items-center gap-1.5">
                <Star size={14} className="fill-white text-white sm:w-5 sm:h-5" />
                <span className="font-medium">AI-Powered</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="sm:w-5 sm:h-5" />
                Under 60s
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="sm:w-5 sm:h-5" />
                19 Section Types
              </span>
            </div>

            {/* Title */}
            <h1
              className="animate-blur-fade-up text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-white mb-4 md:mb-6"
              style={{ animationDelay: '400ms', letterSpacing: '-0.04em' }}
            >
              One Prompt.
              <br />
              Full Website.
            </h1>

            {/* Description */}
            <p
              className="animate-blur-fade-up text-base sm:text-lg md:text-xl text-gray-400 mb-6 md:mb-12 max-w-2xl"
              style={{ animationDelay: '500ms' }}
            >
              Type what your business does. ZeroBuild generates every section — styled, structured, ready to edit. Drag, tweak, deploy.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                to="/register"
                className="animate-blur-fade-up flex items-center gap-2 rounded-full bg-white text-black font-medium px-6 sm:px-8 py-2.5 sm:py-3 hover:bg-gray-200 transition-colors"
                style={{ animationDelay: '600ms' }}
              >
                <Play size={18} className="fill-black" />
                Start Building
              </Link>
              <Link
                to="/login"
                className="animate-blur-fade-up liquid-glass rounded-full font-medium px-6 sm:px-8 py-2.5 sm:py-3 text-white"
                style={{ animationDelay: '700ms' }}
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right — navigation arrows */}
          <div className="flex items-center gap-3 md:flex-col md:items-end">
            <button
              className="animate-blur-fade-up liquid-glass flex items-center gap-2 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-white text-sm"
              style={{ animationDelay: '800ms' }}
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            <button
              className="animate-blur-fade-up liquid-glass flex items-center gap-2 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-white text-sm"
              style={{ animationDelay: '900ms' }}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

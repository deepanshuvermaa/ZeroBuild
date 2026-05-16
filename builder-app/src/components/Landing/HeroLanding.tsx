import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, User, Menu, X, Star, Clock, Calendar,
  ChevronLeft, ChevronRight, Sparkles, Send, Loader2,
} from 'lucide-react';
import GuestPreview from './GuestPreview';
import type { PageConfig } from '@/types/config.types';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#howitworks' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Suggest', href: '#suggestions' },
];

const SEARCH_INDEX = [
  { keywords: ['hero', 'start', 'home', 'top', 'build', 'prompt', 'website'], id: 'hero', label: 'Hero — Start Building' },
  { keywords: ['feature', 'drag', 'drop', 'deploy', 'ai', 'edit', 'section', 'generate'], id: 'features', label: 'Features' },
  { keywords: ['how', 'works', 'step', 'flow', 'process'], id: 'howitworks', label: 'How It Works' },
  { keywords: ['price', 'pricing', 'plan', 'free', 'starter', 'pro', 'agency', 'cost'], id: 'pricing', label: 'Pricing' },
  { keywords: ['review', 'testimonial', 'user', 'says', 'feedback'], id: 'testimonials', label: 'Testimonials' },
  { keywords: ['suggest', 'idea', 'request', 'feedback', 'community'], id: 'suggestions', label: 'Suggestions' },
];

function scrollToSection(id: string) {
  if (id === 'hero') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function HeroLanding() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [guestConfig, setGuestConfig] = useState<PageConfig | null>(null);
  const [guestSectionTypes, setGuestSectionTypes] = useState<string[]>([]);

  const goNext = () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  const goPrev = () => document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });

  const searchResults = searchQuery.trim()
    ? SEARCH_INDEX.filter(s => s.keywords.some(k => k.includes(searchQuery.toLowerCase())) || s.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : SEARCH_INDEX;

  const handleGuestGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/guest-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGuestSectionTypes(data.sectionTypes || []);
      // Fetch the full config from session (it's stored server-side, we show blurred teaser)
      // The response only has metadata — we render a blurred placeholder
      setGuestConfig({
        metadata: { clientName: '', projectName: prompt, createdAt: '', updatedAt: '', version: '1.0' },
        theme: data.theme || { primaryColor: '#3B82F6', secondaryColor: '#10B981', fontFamily: 'Inter' },
        whatsapp: { phoneNumber: '', defaultMessage: '', enabled: false },
        seo: { title: '', description: '', keywords: [] },
        sections: (data.sectionTypes || []).map((type: string, i: number) => ({
          id: `guest-${i}`, type, order: i,
          props: { title: 'Your Content Here', subtitle: 'AI-generated content preview' },
        })),
      });
    } catch (err: any) {
      console.error('Guest generation failed:', err);
      setIsGenerating(false);
    }
  };

  // Show guest preview overlay
  if (guestConfig || isGenerating) {
    return <GuestPreview config={guestConfig} isGenerating={isGenerating && !guestConfig} sectionTypes={guestSectionTypes} />;
  }

  return (
    <section id="hero" className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      {/* Background Video */}
      <video className="absolute inset-0 w-full h-full object-cover z-0" src="/hero.mp4" autoPlay loop muted playsInline />
      <div className="video-blur-overlay absolute inset-0 z-[1] pointer-events-none" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }} />
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/60 to-transparent z-[2] pointer-events-none" />

      {/* Search Modal */}
      {searchOpen && (
        <div className="absolute inset-0 z-[60] flex items-start justify-center pt-24 px-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }} onClick={e => { if (e.target === e.currentTarget) setSearchOpen(false); }}>
          <div className="w-full max-w-lg rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(10,10,10,0.95)' }}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <Search className="h-4 w-4 text-white/40" />
              <input autoFocus type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search sections..." className="flex-1 bg-transparent text-white placeholder-white/30 text-sm focus:outline-none" />
              <button onClick={() => setSearchOpen(false)}><X className="h-4 w-4 text-white/40" /></button>
            </div>
            <div className="py-2">
              {searchResults.map(r => (
                <button key={r.id} onClick={() => { scrollToSection(r.id); setSearchOpen(false); setSearchQuery(''); }} className="w-full text-left px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">{r.label}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 md:py-6">
        <Link to="/" className="flex items-center gap-2 animate-blur-fade-up" style={{ animationDelay: '0ms' }}>
          <Sparkles className="h-5 w-5 text-white" />
          <span className="text-xl font-bold tracking-tight text-white">ZeroBuild</span>
        </Link>
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <a key={link.label} href={link.href} className="animate-blur-fade-up text-sm text-white/80 hover:text-white transition-colors" style={{ animationDelay: `${100 + i * 50}ms` }}>{link.label}</a>
          ))}
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <button onClick={() => setSearchOpen(true)} className="animate-blur-fade-up liquid-glass flex items-center gap-2 rounded-full px-4 md:px-6 py-2 text-sm font-medium text-white" style={{ animationDelay: '350ms' }}>
            <Search size={16} /> Search
          </button>
          <Link to="/login" className="animate-blur-fade-up liquid-glass flex items-center justify-center w-10 h-10 rounded-full" style={{ animationDelay: '400ms' }}>
            <User size={18} className="text-white" />
          </Link>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="animate-blur-fade-up liquid-glass lg:hidden flex items-center justify-center w-10 h-10 rounded-full" style={{ animationDelay: '350ms' }}>
          {mobileOpen ? <X size={18} className="text-white" /> : <Menu size={18} className="text-white" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`absolute top-[72px] left-0 right-0 z-40 lg:hidden transition-all duration-500 ease-out ${mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className="bg-gray-900/95 backdrop-blur-lg border-t border-b border-gray-800 shadow-2xl">
          <div className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link, i) => (
              <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)} className="py-3 px-3 rounded-lg text-sm text-white hover:bg-gray-800/50 transition-all" style={{ transitionDelay: `${i * 50}ms` }}>{link.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-3 px-7 py-4 border-t border-gray-800 sm:hidden">
            <button onClick={() => { setMobileOpen(false); setSearchOpen(true); }} className="liquid-glass flex items-center gap-2 rounded-full px-5 py-2 text-sm text-white"><Search size={16} /> Search</button>
            <Link to="/login" className="liquid-glass flex items-center justify-center w-10 h-10 rounded-full"><User size={18} className="text-white" /></Link>
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-4 sm:px-6 md:px-12 pb-8 md:pb-16">
        <div className="flex flex-col md:flex-row items-end gap-8">
          <div className="flex-1">
            <div className="animate-blur-fade-up flex flex-wrap items-center gap-3 sm:gap-6 mb-6 md:mb-8 text-xs sm:text-sm text-white/80" style={{ animationDelay: '300ms' }}>
              <span className="flex items-center gap-1.5"><Star size={14} className="fill-white text-white" /><span className="font-medium">AI-Powered</span></span>
              <span className="flex items-center gap-1.5"><Clock size={14} />Under 60s</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} />19 Section Types</span>
            </div>

            <h1 className="animate-blur-fade-up text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-white mb-4 md:mb-6" style={{ animationDelay: '400ms', letterSpacing: '-0.04em' }}>
              One Prompt.<br />Full Website.
            </h1>

            <p className="animate-blur-fade-up text-base sm:text-lg md:text-xl text-gray-400 mb-6 md:mb-8 max-w-2xl" style={{ animationDelay: '500ms' }}>
              Type what your business does. ZeroBuild generates every section — styled, structured, ready to edit. No signup required to preview.
            </p>

            {/* Guest Prompt Box */}
            <div className="animate-blur-fade-up max-w-xl" style={{ animationDelay: '600ms' }}>
              <div className="flex items-center gap-2 bg-white/[0.06] border border-white/[0.12] rounded-2xl px-4 py-3 backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-white/40 flex-shrink-0" />
                <input
                  type="text"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleGuestGenerate()}
                  placeholder="e.g. A dry fruit shop in Delhi with delivery..."
                  className="flex-1 bg-transparent text-white placeholder-white/30 text-sm sm:text-base focus:outline-none"
                />
                <button
                  onClick={handleGuestGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-9 h-9 rounded-xl bg-white flex items-center justify-center disabled:opacity-30 hover:bg-white/90 transition-colors flex-shrink-0"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 text-black animate-spin" /> : <Send className="w-4 h-4 text-black" />}
                </button>
              </div>
              <p className="text-[11px] text-white/25 mt-2 ml-1">Free preview — no account needed</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6">
              <Link to="/register" className="animate-blur-fade-up flex items-center gap-2 rounded-full bg-white/10 border border-white/20 text-white font-medium px-6 sm:px-8 py-2.5 sm:py-3 hover:bg-white/20 transition-colors" style={{ animationDelay: '700ms' }}>
                Create Account
              </Link>
              <Link to="/login" className="animate-blur-fade-up liquid-glass rounded-full font-medium px-6 sm:px-8 py-2.5 sm:py-3 text-white" style={{ animationDelay: '800ms' }}>
                Sign In
              </Link>
            </div>
          </div>

          {/* Right nav */}
          <div className="flex items-center gap-3 md:flex-col md:items-end">
            <button onClick={goPrev} className="animate-blur-fade-up liquid-glass flex items-center gap-2 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-white text-sm hover:bg-white/10 transition-colors" style={{ animationDelay: '900ms' }} title="Previous section">
              <ChevronLeft size={18} />Previous
            </button>
            <button onClick={goNext} className="animate-blur-fade-up liquid-glass flex items-center gap-2 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-white text-sm hover:bg-white/10 transition-colors" style={{ animationDelay: '1000ms' }} title="Next section">
              Next<ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

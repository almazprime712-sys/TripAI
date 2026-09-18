import React from 'react';
import { Sparkles, Compass, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';

interface HeroProps {
  currentLang: SupportedLanguage;
  onOpenPlanner: () => void;
  onOpenExplore: () => void;
  onSelectQuickDestination: (destination: string) => void;
}

const quickDestinations = [
  { name: 'Tokyo', country: 'Japan', tag: 'Neon & Culture' },
  { name: 'Paris', country: 'France', tag: 'Art & Bistros' },
  { name: 'Dubai', country: 'UAE', tag: 'Luxury & Skyline' },
  { name: 'New York', country: 'USA', tag: 'Urban Energy' },
  { name: 'Bali', country: 'Indonesia', tag: 'Tropical Peace' },
  { name: 'Iceland', country: 'Reykjavik', tag: 'Waterfalls & Auroras' },
  { name: 'Samarkand', country: 'Uzbekistan', tag: 'Silk Road Jewels' },
];

export const Hero: React.FC<HeroProps> = ({
  currentLang,
  onOpenPlanner,
  onOpenExplore,
  onSelectQuickDestination,
}) => {
  const t = translations[currentLang] || translations.en;

  return (
    <section className="relative pt-12 pb-20 sm:pt-18 sm:pb-28 overflow-hidden">
      {/* Subtle architectural background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[360px] bg-sky-100/40 dark:bg-sky-950/20 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Trust pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{t.guestsNotice}</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="hidden sm:inline text-slate-500 dark:text-slate-400">
            Over 48,000 trips planned worldwide
          </span>
        </div>

        {/* Hero Title */}
        <h1
          id="hero-main-title"
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-950 dark:text-white max-w-4xl mx-auto leading-[1.1] mb-6"
        >
          {t.heroTitle}
        </h1>

        {/* Hero Subtitle */}
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          {t.heroSubtitle}
        </p>

        {/* Primary and Secondary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            id="hero-plan-my-trip-cta"
            onClick={onOpenPlanner}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-base font-semibold shadow-lg shadow-slate-950/10 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 active:scale-98 cursor-pointer group"
          >
            <Sparkles className="w-5 h-5 text-sky-400 dark:text-sky-600 transition-transform group-hover:rotate-12" />
            <span>{t.planMyTrip}</span>
            <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            id="hero-explore-cta"
            onClick={onOpenExplore}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white dark:bg-[#131722] hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-base font-semibold transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer"
          >
            <Compass className="w-5 h-5 text-slate-500" />
            <span>{t.exploreTripAI}</span>
          </button>
        </div>

        {/* Quick Destination Chips */}
        <div className="flex flex-col items-center">
          <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-3.5">
            Popular destinations to plan in seconds
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl">
            {quickDestinations.map((dest) => (
              <button
                key={dest.name}
                onClick={() => onSelectQuickDestination(dest.name)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-900/60 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-300 dark:hover:border-sky-800 transition-all cursor-pointer"
              >
                <MapPin className="w-3 h-3 opacity-60" />
                <span>{dest.name}</span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">({dest.country})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Value Propositions / Trust Markers */}
        <div className="mt-16 pt-10 border-t border-slate-200/70 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
          <div className="flex items-start gap-3.5 p-3 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center shrink-0 text-sky-600 dark:text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Complex inside, simple outside
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Logistics, distances, and pacing calculated automatically behind clean, uncluttered cards.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Verified travel facts & visas
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Clear entry requirements, emergency contacts, and tipping etiquette with exact sources.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Offline & collaboration ready
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Invite friends with one shareable link, vote on dinner spots, and export tickets offline.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

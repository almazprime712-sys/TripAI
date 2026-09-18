import React from 'react';
import { Compass, ShieldCheck, Heart } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';

interface FooterProps {
  currentLang: SupportedLanguage;
  onOpenPrivacy: () => void;
  onOpenHowItWorks: () => void;
  onOpenPricing: () => void;
  onOpenExplore: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onOpenPrivacy,
  onOpenHowItWorks,
  onOpenPricing,
  onOpenExplore,
}) => {
  const t = translations[currentLang] || translations.en;

  return (
    <footer className="mt-20 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0f17] text-slate-600 dark:text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Ethos */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-bold">
                <Compass className="w-4 h-4 text-sky-400 dark:text-sky-600" />
              </div>
              <span className="text-base font-bold text-slate-950 dark:text-white">TripAI</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              The world’s premier AI-powered travel architecture platform. We build effortless journeys backed by verified opening hours, realistic transit pacing, and transparent budgeting.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Zero dark patterns • No forced accounts • Verified official data sources</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Product
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenExplore} className="hover:text-slate-950 dark:hover:text-white cursor-pointer">
                  Explore Destinations
                </button>
              </li>
              <li>
                <button onClick={onOpenHowItWorks} className="hover:text-slate-950 dark:hover:text-white cursor-pointer">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={onOpenPricing} className="hover:text-slate-950 dark:hover:text-white cursor-pointer">
                  Pricing & Pro Plan
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Privacy & Standards */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Trust & Privacy
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-slate-950 dark:hover:text-white cursor-pointer">
                  Privacy Center
                </button>
              </li>
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-slate-950 dark:hover:text-white cursor-pointer">
                  Data Sovereignty & Guest Mode
                </button>
              </li>
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-slate-950 dark:hover:text-white cursor-pointer">
                  Verified Visa Sources Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © 2026 TripAI Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted for travelers across 13 languages</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

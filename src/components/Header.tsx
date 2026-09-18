import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  Globe,
  Sun,
  Moon,
  Laptop,
  BookmarkCheck,
  ChevronDown,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { SupportedLanguage, SupportedCurrency } from '../types';
import { translations, applyDirection } from '../i18n/translations';

interface HeaderProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  currentCurrency: SupportedCurrency;
  onCurrencyChange: (cur: SupportedCurrency) => void;
  theme: 'light' | 'dark' | 'system';
  onThemeChange: (t: 'light' | 'dark' | 'system') => void;
  onOpenPlanner: () => void;
  onOpenExplore: () => void;
  onOpenSavedTrips: () => void;
  onOpenPricing: () => void;
  onOpenHowItWorks: () => void;
  onGoHome: () => void;
  savedTripsCount: number;
}

const languagesList: { code: SupportedLanguage; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'uz', name: 'Uzbek', nativeName: 'O‘zbekcha' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية (RTL)' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
];

const currenciesList: SupportedCurrency[] = ['USD', 'EUR', 'GBP', 'JPY', 'UZS', 'AED', 'RUB', 'CNY', 'CAD', 'AUD'];

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  currentCurrency,
  onCurrencyChange,
  theme,
  onThemeChange,
  onOpenPlanner,
  onOpenExplore,
  onOpenSavedTrips,
  onOpenPricing,
  onOpenHowItWorks,
  onGoHome,
  savedTripsCount,
}) => {
  const t = translations[currentLang] || translations.en;
  const [langOpen, setLangOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const curRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
      if (curRef.current && !curRef.current.contains(e.target as Node)) {
        setCurrencyOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (lang: SupportedLanguage) => {
    onLanguageChange(lang);
    applyDirection(lang);
    setLangOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-[#0c0f17]/85 border-b border-slate-200/70 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          id="tripai-brand-logo"
          onClick={onGoHome}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
            <Compass className="w-5 h-5 text-sky-400 dark:text-sky-600 transition-transform group-hover:rotate-45 duration-300" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-950 dark:text-white font-sans">
                TripAI
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/50">
                AI Travel
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            id="nav-explore-btn"
            onClick={onOpenExplore}
            className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer py-1"
          >
            {t.exploreTripAI}
          </button>
          <button
            id="nav-how-it-works-btn"
            onClick={onOpenHowItWorks}
            className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer py-1"
          >
            {t.howItWorks}
          </button>
          <button
            id="nav-pricing-btn"
            onClick={onOpenPricing}
            className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer py-1"
          >
            {t.pricing}
          </button>
          <button
            id="nav-saved-trips-btn"
            onClick={onOpenSavedTrips}
            className="flex items-center gap-1.5 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer py-1"
          >
            <BookmarkCheck className="w-4 h-4 text-slate-400" />
            <span>{t.savedTrips}</span>
            {savedTripsCount > 0 && (
              <span className="w-5 h-5 text-xs bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-full flex items-center justify-center font-semibold">
                {savedTripsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Controls (Currency, Lang, Theme, CTA) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Currency Selector */}
          <div className="relative" ref={curRef}>
            <button
              id="currency-selector-btn"
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="hidden sm:flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 transition-colors"
              title="Change Currency"
            >
              <span>{currentCurrency}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            {currencyOpen && (
              <div className="absolute right-0 mt-2 w-32 py-1.5 bg-white dark:bg-[#151a24] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                  {t.currency}
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {currenciesList.map((cur) => (
                    <button
                      key={cur}
                      onClick={() => {
                        onCurrencyChange(cur);
                        setCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                        currentCurrency === cur
                          ? 'text-sky-600 dark:text-sky-400 font-semibold bg-sky-50/50 dark:bg-sky-950/30'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{cur}</span>
                      {currentCurrency === cur && <span className="text-sky-600">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              id="language-selector-btn"
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 transition-colors"
              title="Global Language"
            >
              <Globe className="w-3.5 h-3.5 opacity-70" />
              <span className="uppercase">{currentLang}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-52 py-2 bg-white dark:bg-[#151a24] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                  {t.language} (13 Supported)
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {languagesList.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => handleSelectLanguage(item.code)}
                      className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                        currentLang === item.code
                          ? 'text-sky-600 dark:text-sky-400 font-semibold bg-sky-50/50 dark:bg-sky-950/30'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <span>{item.nativeName}</span>
                        <span className="text-[10px] text-slate-400 ml-1.5">({item.name})</span>
                      </div>
                      {currentLang === item.code && <span className="text-sky-600">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Selector */}
          <div className="relative" ref={themeRef}>
            <button
              id="theme-toggle-btn"
              onClick={() => setThemeOpen(!themeOpen)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors"
              title="Theme settings"
            >
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-sky-400" />
              ) : theme === 'light' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Laptop className="w-4 h-4" />
              )}
            </button>
            {themeOpen && (
              <div className="absolute right-0 mt-2 w-36 py-1.5 bg-white dark:bg-[#151a24] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => {
                    onThemeChange('light');
                    setThemeOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                    theme === 'light' ? 'text-sky-600 font-semibold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>{t.light}</span>
                </button>
                <button
                  onClick={() => {
                    onThemeChange('dark');
                    setThemeOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                    theme === 'dark' ? 'text-sky-400 font-semibold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Moon className="w-4 h-4 text-sky-400" />
                  <span>{t.dark}</span>
                </button>
                <button
                  onClick={() => {
                    onThemeChange('system');
                    setThemeOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                    theme === 'system' ? 'text-sky-600 font-semibold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Laptop className="w-4 h-4" />
                  <span>{t.system}</span>
                </button>
              </div>
            )}
          </div>

          {/* Primary Call-to-action Button */}
          <button
            id="header-plan-my-trip-btn"
            onClick={onOpenPlanner}
            className="hidden sm:inline-flex items-center gap-2 px-4.5 py-2 rounded-xl text-sm font-semibold bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 transition-all shadow-sm hover:shadow active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-sky-400 dark:text-sky-600" />
            <span>{t.planMyTrip}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onOpenExplore();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-lg bg-slate-50 dark:bg-slate-900"
            >
              {t.exploreTripAI}
            </button>
            <button
              onClick={() => {
                onOpenHowItWorks();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-lg bg-slate-50 dark:bg-slate-900"
            >
              {t.howItWorks}
            </button>
            <button
              onClick={() => {
                onOpenPricing();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-lg bg-slate-50 dark:bg-slate-900"
            >
              {t.pricing}
            </button>
            <button
              onClick={() => {
                onOpenSavedTrips();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-between"
            >
              <span>{t.savedTrips}</span>
              {savedTripsCount > 0 && (
                <span className="text-xs bg-slate-900 text-white rounded-full px-1.5 py-0.2">
                  {savedTripsCount}
                </span>
              )}
            </button>
          </div>
          <button
            onClick={() => {
              onOpenPlanner();
              setMobileMenuOpen(false);
            }}
            className="w-full py-3 rounded-xl text-center text-sm font-semibold bg-slate-950 text-white dark:bg-white dark:text-slate-950 flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>{t.planMyTrip}</span>
          </button>
        </div>
      )}
    </header>
  );
};

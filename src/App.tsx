import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PlanTripModal } from './components/PlanTripModal';
import { TripView } from './components/TripView';
import { ExploreView } from './components/ExploreView';
import { SavedTripsModal } from './components/SavedTripsModal';
import { PricingModal } from './components/PricingModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { PrivacyCenterModal } from './components/PrivacyCenterModal';
import { Footer } from './components/Footer';
import { SupportedLanguage, SupportedCurrency, Trip } from './types';
import { translations, applyDirection, formatCurrency } from './i18n/translations';
import { samplePrebuiltTrips, destinationsData } from './data/destinations';
import {
  Sparkles,
  ArrowRight,
  MapPin,
  Calendar,
  Compass,
  Star,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export default function App() {
  // Localization & Preferences
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('tripai_lang') as SupportedLanguage) || 'en';
  });

  const [currentCurrency, setCurrentCurrency] = useState<SupportedCurrency>(() => {
    return (localStorage.getItem('tripai_currency') as SupportedCurrency) || 'USD';
  });

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('tripai_theme') as 'light' | 'dark' | 'system') || 'system';
  });

  // Active view: 'home' | 'explore' | 'trip'
  const [currentView, setCurrentView] = useState<'home' | 'explore' | 'trip'>('home');

  // Stored trips
  const [savedTrips, setSavedTrips] = useState<Trip[]>(() => {
    try {
      const stored = localStorage.getItem('tripai_saved_trips');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading stored trips:', e);
    }
    return [samplePrebuiltTrips.tokyo, samplePrebuiltTrips.paris];
  });

  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);

  // Modals state
  const [isPlannerOpen, setIsPlannerOpen] = useState<boolean>(false);
  const [plannerInitialDest, setPlannerInitialDest] = useState<string>('');
  const [isSavedTripsOpen, setIsSavedTripsOpen] = useState<boolean>(false);
  const [isPricingOpen, setIsPricingOpen] = useState<boolean>(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);

  // Apply Theme
  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('tripai_theme', theme);

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  // Apply Language and Direction
  useEffect(() => {
    localStorage.setItem('tripai_lang', currentLang);
    applyDirection(currentLang);
  }, [currentLang]);

  // Save trips to storage
  useEffect(() => {
    try {
      localStorage.setItem('tripai_saved_trips', JSON.stringify(savedTrips));
    } catch (e) {
      console.warn('Error saving trips to storage:', e);
    }
  }, [savedTrips]);

  const t = translations[currentLang] || translations.en;

  const handleOpenPlanner = (initialDest?: string) => {
    setPlannerInitialDest(initialDest || '');
    setIsPlannerOpen(true);
  };

  const handleTripCreated = (newTrip: Trip) => {
    setSavedTrips((prev) => [newTrip, ...prev.filter((t) => t.id !== newTrip.id)]);
    setActiveTrip(newTrip);
    setCurrentView('trip');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateActiveTrip = (updated: Trip) => {
    setActiveTrip(updated);
    setSavedTrips((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleDeleteTrip = (tripId: string) => {
    setSavedTrips((prev) => prev.filter((t) => t.id !== tripId));
    if (activeTrip?.id === tripId) {
      setActiveTrip(null);
      setCurrentView('home');
    }
  };

  const handleClearAllData = () => {
    setSavedTrips([]);
    setActiveTrip(null);
    setCurrentView('home');
    localStorage.removeItem('tripai_saved_trips');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0f17] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Global Navigation Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        currentCurrency={currentCurrency}
        onCurrencyChange={setCurrentCurrency}
        theme={theme}
        onThemeChange={setTheme}
        onOpenPlanner={() => handleOpenPlanner()}
        onOpenExplore={() => {
          setCurrentView('explore');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSavedTrips={() => setIsSavedTripsOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onGoHome={() => {
          setCurrentView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedTripsCount={savedTrips.length}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {/* VIEW 1: ACTIVE TRIP DASHBOARD */}
        {currentView === 'trip' && activeTrip ? (
          <TripView
            trip={activeTrip}
            currentLang={currentLang}
            currentCurrency={currentCurrency}
            onUpdateTrip={handleUpdateActiveTrip}
            onBackToHome={() => setCurrentView('home')}
          />
        ) : currentView === 'explore' ? (
          /* VIEW 2: EXPLORE CATALOG */
          <ExploreView
            currentLang={currentLang}
            currentCurrency={currentCurrency}
            onSelectDestination={(dest) => handleOpenPlanner(dest)}
            onClose={() => setCurrentView('home')}
          />
        ) : (
          /* VIEW 3: HOME / LANDING PAGE */
          <div>
            <Hero
              currentLang={currentLang}
              onOpenPlanner={() => handleOpenPlanner()}
              onOpenExplore={() => {
                setCurrentView('explore');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectQuickDestination={(dest) => handleOpenPlanner(dest)}
            />

            {/* Interactive Live Trip Demo Strip */}
            <section className="py-12 bg-slate-50/70 dark:bg-[#0f131c] border-y border-slate-200/70 dark:border-slate-800/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Instant Interactive Preview</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
                      Experience a live AI trip before planning
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveTrip(samplePrebuiltTrips.tokyo);
                        setCurrentView('trip');
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <span>Explore Tokyo 7-Day Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveTrip(samplePrebuiltTrips.paris);
                        setCurrentView('trip');
                      }}
                      className="px-4 py-2 rounded-xl bg-white dark:bg-[#151a24] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Paris 5-Day Plan</span>
                    </button>
                  </div>
                </div>

                {/* Featured Interactive Trip Card Preview */}
                <div className="rounded-3xl bg-white dark:bg-[#121620] border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="lg:col-span-1 rounded-2xl overflow-hidden h-64 relative">
                    <img
                      src={samplePrebuiltTrips.tokyo.coverImage}
                      alt="Tokyo"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                      <div className="text-xs font-bold text-sky-400">7-Day Curated Journey</div>
                      <div className="text-lg font-bold">Tokyo & Hakone Escape</div>
                      <div className="text-xs text-slate-300 mt-0.5">Couple • Culture & Food</div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900">
                        <div className="text-slate-400">Pacing & Distance</div>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                          Max 2.5 km walk / day
                        </div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                          No transit burnout
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900">
                        <div className="text-slate-400">Smart Budget Tracking</div>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                          {formatCurrency(3400, currentCurrency)}
                        </div>
                        <div className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold mt-1">
                          AI swaps save ~15%
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900">
                        <div className="text-slate-400">Verified Travel Facts</div>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                          Visa & Etiquette Check
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          Verified Sep 2026
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      "TripAI accurately scheduled our teamLab Borderless morning tickets, paired it with Tsukiji fresh tuna, and avoided crowded peak subways with 1-click schedule rebalancing."
                    </p>

                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Includes hotel bookings, live weather & wallet passes</span>
                      </div>

                      <button
                        onClick={() => {
                          setActiveTrip(samplePrebuiltTrips.tokyo);
                          setCurrentView('trip');
                        }}
                        className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Inspect itinerary breakdown →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Destinations Showcase */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
                    Iconic Global Destinations
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Ready to be tailored by AI in seconds according to your style and budget.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setCurrentView('explore');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1 cursor-pointer"
                >
                  <span>View all destinations</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {destinationsData.slice(0, 4).map((dest) => (
                  <div
                    key={dest.id}
                    onClick={() => handleOpenPlanner(`${dest.name}, ${dest.country}`)}
                    className="rounded-3xl bg-white dark:bg-[#121620] border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={dest.cardImage}
                          alt={dest.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-slate-950/70 text-white text-[10px] font-bold backdrop-blur-md flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>{dest.rating}</span>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="text-[10px] uppercase tracking-wider font-semibold text-sky-600 dark:text-sky-400">
                          {dest.country}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                          {dest.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {dest.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs mt-2">
                      <span className="text-slate-400 text-[11px]">{dest.recommendedDuration}</span>
                      <span className="font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                        <span>Plan</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer
        currentLang={currentLang}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenExplore={() => {
          setCurrentView('explore');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* MODALS */}
      <PlanTripModal
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        currentLang={currentLang}
        currentCurrency={currentCurrency}
        onTripCreated={handleTripCreated}
        initialDestination={plannerInitialDest}
      />

      <SavedTripsModal
        isOpen={isSavedTripsOpen}
        onClose={() => setIsSavedTripsOpen(false)}
        trips={savedTrips}
        currentCurrency={currentCurrency}
        onSelectTrip={(trip) => {
          setActiveTrip(trip);
          setCurrentView('trip');
        }}
        onDeleteTrip={handleDeleteTrip}
      />

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        currentCurrency={currentCurrency}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onOpenPlanner={() => {
          setIsHowItWorksOpen(false);
          handleOpenPlanner();
        }}
      />

      <PrivacyCenterModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        onClearAllData={handleClearAllData}
      />
    </div>
  );
}

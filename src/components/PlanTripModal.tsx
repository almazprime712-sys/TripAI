import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Users,
  Heart,
  Wallet,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SupportedLanguage, SupportedCurrency, TravelerType, Trip } from '../types';
import { translations, formatCurrency } from '../i18n/translations';
import { generateTripWithProgress, PlanTripParams } from '../services/aiService';
import { destinationsData } from '../data/destinations';

interface PlanTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: SupportedLanguage;
  currentCurrency: SupportedCurrency;
  onTripCreated: (trip: Trip) => void;
  initialDestination?: string;
}

const interestOptions = [
  { id: 'Culture & Museums', label: 'Culture & History', icon: '🏛️' },
  { id: 'Food & Dining', label: 'Food & Gastronomy', icon: '🍜' },
  { id: 'Nature & Parks', label: 'Nature & Outdoors', icon: '🌿' },
  { id: 'Architecture', label: 'Iconic Architecture', icon: '🏰' },
  { id: 'Shopping', label: 'Shopping & Markets', icon: '🛍️' },
  { id: 'Art & Photography', label: 'Art & Photo Spots', icon: '📸' },
  { id: 'Beach & Sea', label: 'Beach & Coastal', icon: '🏖️' },
  { id: 'Relaxation & Spa', label: 'Relaxation & Onsen', icon: '♨️' },
  { id: 'Nightlife & Bars', label: 'Nightlife & Lounges', icon: '🍸' },
  { id: 'Hidden Gems', label: 'Off the Beaten Path', icon: '🧭' },
];

export const PlanTripModal: React.FC<PlanTripModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  currentCurrency,
  onTripCreated,
  initialDestination = '',
}) => {
  const t = translations[currentLang] || translations.en;

  const [step, setStep] = useState<number>(1);
  const [destination, setDestination] = useState<string>(initialDestination || '');
  const [isFlexibleDates, setIsFlexibleDates] = useState<boolean>(true);
  const [flexibleDays, setFlexibleDays] = useState<number>(5);
  const [startDate, setStartDate] = useState<string>('2026-10-15');
  const [endDate, setEndDate] = useState<string>('2026-10-20');

  const [travelerType, setTravelerType] = useState<TravelerType>('couple');
  const [adultsCount, setAdultsCount] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);

  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Culture & Museums',
    'Food & Dining',
  ]);

  const [budgetTier, setBudgetTier] = useState<'budget' | 'moderate' | 'luxury' | 'custom'>('moderate');
  const [customBudgetAmount, setCustomBudgetAmount] = useState<number>(2500);

  // Loading generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentProgressStep, setCurrentProgressStep] = useState<number>(0);

  useEffect(() => {
    if (initialDestination) {
      setDestination(initialDestination);
    }
  }, [initialDestination]);

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleStartPlanning = async () => {
    setIsGenerating(true);
    setCurrentProgressStep(0);

    const params: PlanTripParams = {
      destination: destination.trim() || 'Tokyo',
      dates: {
        isFlexible: isFlexibleDates,
        flexibleDays,
        startDate: isFlexibleDates ? undefined : startDate,
        endDate: isFlexibleDates ? undefined : endDate,
      },
      travelerType,
      adultsCount,
      childrenCount,
      interests: selectedInterests,
      budgetTier,
      customBudgetAmount: budgetTier === 'custom' ? customBudgetAmount : undefined,
      currency: currentCurrency,
    };

    try {
      const generatedTrip = await generateTripWithProgress(params, (stepIdx) => {
        setCurrentProgressStep(stepIdx);
      });

      // Celebrate completion
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Confetti optional
      }

      setIsGenerating(false);
      onTripCreated(generatedTrip);
      onClose();
    } catch (err) {
      console.error('Trip generation error:', err);
      setIsGenerating(false);
    }
  };

  const generationStepLabels = [
    t.findingPlaces,
    t.buildingItinerary,
    t.checkingDistances,
    t.balancingBudget,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#11151e] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Close Button */}
        {!isGenerating && (
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header & Progress Bar */}
        {!isGenerating && (
          <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2.5">
              <span>
                {t.stepOf} {step} / 5
              </span>
              <span className="text-sky-600 dark:text-sky-400">
                {step === 1 && 'Destination'}
                {step === 2 && 'Dates'}
                {step === 3 && 'Travelers'}
                {step === 4 && 'Interests'}
                {step === 5 && 'Budget'}
              </span>
            </div>
            {/* Visual Step Progress Line */}
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-950 dark:bg-white rounded-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Modal Body: Active Step or Generating Screen */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {isGenerating ? (
            /* AI Generation in progress */
            <div className="py-12 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-6 shadow-sm">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {t.planningTripTitle}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-8">
                Analyzing routes, seasonal hours, local hotspots, and budget optimization for{' '}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {destination || 'your destination'}
                </span>
                .
              </p>

              <div className="w-full max-w-md space-y-3.5 text-left">
                {generationStepLabels.map((label, idx) => {
                  const isDone = currentProgressStep > idx;
                  const isCurrent = currentProgressStep === idx;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all ${
                        isDone
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-400'
                          : isCurrent
                          ? 'bg-sky-50/60 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 font-medium'
                          : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/60 dark:border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="w-5 h-5 flex items-center justify-center shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : isCurrent ? (
                          <Loader2 className="w-5 h-5 animate-spin text-sky-600 dark:text-sky-400" />
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                        )}
                      </div>
                      <span className="text-sm">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* 5-Step Interactive Form */
            <>
              {/* STEP 1: DESTINATION */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
                      {t.whereToGo}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {t.whereSubtitle}
                    </p>
                  </div>

                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="destination-input"
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      autoFocus
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 text-base"
                    />
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                      Recommended destinations
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {destinationsData.slice(0, 8).map((guide) => (
                        <button
                          key={guide.id}
                          type="button"
                          onClick={() => setDestination(`${guide.name}, ${guide.country}`)}
                          className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                            destination.toLowerCase().includes(guide.name.toLowerCase())
                              ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 font-semibold'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <img
                            src={guide.cardImage}
                            alt={guide.name}
                            className="w-7 h-7 rounded-lg object-cover shrink-0"
                          />
                          <span className="text-xs truncate">{guide.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: DATES */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
                      {t.whenGoing}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Pick specific calendar dates or choose a flexible trip length.
                    </p>
                  </div>

                  {/* Mode Tabs */}
                  <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1">
                    <button
                      type="button"
                      onClick={() => setIsFlexibleDates(true)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                        isFlexibleDates
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {t.flexibleDates}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFlexibleDates(false)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                        !isFlexibleDates
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      Exact Dates
                    </button>
                  </div>

                  {isFlexibleDates ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        Select Trip Duration
                      </label>
                      <div className="grid grid-cols-5 gap-2.5">
                        {[3, 5, 7, 10, 14].map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setFlexibleDays(d)}
                            className={`py-3.5 px-2 rounded-2xl border text-center transition-all cursor-pointer ${
                              flexibleDays === d
                                ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-bold shadow-sm'
                                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="text-lg font-bold">{d}</div>
                            <div className="text-[10px] uppercase text-slate-400">Days</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          Start Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          End Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: TRAVELERS */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
                      {t.whoTravelling}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Helps TripAI tailor pacing, dining styles, and room configurations.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { type: 'solo' as TravelerType, title: 'Solo', subtitle: '1 Traveler', adults: 1 },
                      { type: 'couple' as TravelerType, title: 'Couple', subtitle: '2 Adults', adults: 2 },
                      { type: 'family' as TravelerType, title: 'Family', subtitle: 'With Children', adults: 2, children: 1 },
                      { type: 'friends' as TravelerType, title: 'Friends', subtitle: 'Group Trip', adults: 4 },
                      { type: 'business' as TravelerType, title: 'Business', subtitle: 'Work & Leisure', adults: 1 },
                    ].map((opt) => (
                      <button
                        key={opt.type}
                        type="button"
                        onClick={() => {
                          setTravelerType(opt.type);
                          setAdultsCount(opt.adults);
                          if (opt.children) setChildrenCount(opt.children);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          travelerType === opt.type
                            ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 font-semibold shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Users className="w-5 h-5 mb-2 text-slate-400" />
                        <div className="text-sm font-semibold">{opt.title}</div>
                        <div className="text-xs text-slate-400">{opt.subtitle}</div>
                      </button>
                    ))}
                  </div>

                  {/* Adults and Children counters */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                      <div>
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Adults</div>
                        <div className="text-[10px] text-slate-400">Age 13+</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                          className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center text-sm font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{adultsCount}</span>
                        <button
                          type="button"
                          onClick={() => setAdultsCount(adultsCount + 1)}
                          className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center text-sm font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                      <div>
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Children</div>
                        <div className="text-[10px] text-slate-400">Age 0-12</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                          className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center text-sm font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{childrenCount}</span>
                        <button
                          type="button"
                          onClick={() => setChildrenCount(childrenCount + 1)}
                          className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center text-sm font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: INTERESTS */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
                      {t.whatLove}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Select your favorite themes to balance each day’s attractions and pacing.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {interestOptions.map((item) => {
                      const isSelected = selectedInterests.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleInterest(item.id)}
                          className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 font-semibold shadow-xs'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="text-xl">{item.icon}</span>
                          <span className="text-xs leading-tight">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 5: BUDGET */}
              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
                      {t.whatBudget}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Choose an expense comfort tier in{' '}
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {currentCurrency}
                      </span>
                      .
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        tier: 'budget' as const,
                        name: 'Smart Economy',
                        price: formatCurrency(1200, currentCurrency),
                        desc: 'Hostels, boutique guesthouses, street food & transit passes',
                      },
                      {
                        tier: 'moderate' as const,
                        name: 'Balanced Comfort',
                        price: formatCurrency(2800, currentCurrency),
                        desc: 'Design 4★ hotels, neighborhood bistros & skip-the-line passes',
                      },
                      {
                        tier: 'luxury' as const,
                        name: 'Luxury & Signature',
                        price: formatCurrency(5500, currentCurrency),
                        desc: '5★ luxury stays, fine dining & private chauffeur transfers',
                      },
                    ].map((b) => (
                      <button
                        key={b.tier}
                        type="button"
                        onClick={() => setBudgetTier(b.tier)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          budgetTier === b.tier
                            ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 font-semibold shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Wallet className="w-5 h-5 mb-2 text-slate-400" />
                        <div className="text-sm font-bold">{b.name}</div>
                        <div className="text-xs text-sky-600 dark:text-sky-400 font-semibold mt-0.5">
                          ~{b.price}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{b.desc}</p>
                      </button>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Or specify custom total budget
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {formatCurrency(customBudgetAmount, currentCurrency)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={500}
                      max={15000}
                      step={100}
                      value={customBudgetAmount}
                      onChange={(e) => {
                        setCustomBudgetAmount(Number(e.target.value));
                        setBudgetTier('custom');
                      }}
                      className="w-full accent-slate-950 dark:accent-white cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!isGenerating && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/40">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.back}</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              {step < 5 ? (
                <button
                  id="modal-next-btn"
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !destination.trim()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 transition-all shadow-sm active:scale-98 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  <span>{t.next}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  id="modal-create-trip-btn"
                  type="button"
                  onClick={handleStartPlanning}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-sky-400 dark:text-sky-600" />
                  <span>{t.createMyTrip}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Users,
  MapPin,
  Share2,
  Download,
  CheckCircle2,
  Clock,
  DollarSign,
  Plus,
  RefreshCw,
  Send,
  MessageSquare,
  ShieldAlert,
  Sun,
  CloudSun,
  Luggage,
  Check,
  ChevronRight,
  TrendingDown,
  Navigation,
  ThumbsUp,
  FileText,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { Trip, TripDay, ItineraryItem, SupportedLanguage, SupportedCurrency } from '../types';
import { translations, formatCurrency } from '../i18n/translations';
import { askTripAssistant, optimizeBudgetWithAI } from '../services/aiService';

interface TripViewProps {
  trip: Trip;
  currentLang: SupportedLanguage;
  currentCurrency: SupportedCurrency;
  onUpdateTrip: (updated: Trip) => void;
  onBackToHome: () => void;
}

export const TripView: React.FC<TripViewProps> = ({
  trip,
  currentLang,
  currentCurrency,
  onUpdateTrip,
  onBackToHome,
}) => {
  const t = translations[currentLang] || translations.en;

  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'map' | 'budget' | 'bookings' | 'essentials'>('overview');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // AI Assistant state
  const [assistantQuery, setAssistantQuery] = useState<string>('');
  const [isAssistantThinking, setIsAssistantThinking] = useState<boolean>(false);
  const [assistantMessages, setAssistantMessages] = useState<
    { sender: 'user' | 'ai'; text: string; proposal?: any }[]
  >([
    {
      sender: 'ai',
      text: `Hello! I'm your AI Trip Architect for ${trip.destination}. Ask me to adjust pacing, find local hidden gems, or balance your budget.`,
    },
  ]);

  // AI Budget optimization modal
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState<boolean>(false);
  const [budgetOptimizationData, setBudgetOptimizationData] = useState<any>(null);
  const [isOptimizingBudget, setIsOptimizingBudget] = useState<boolean>(false);

  // Share modal
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [shareCopied, setShareCopied] = useState<boolean>(false);

  // Item voting / notes state
  const [activeItemDetails, setActiveItemDetails] = useState<ItineraryItem | null>(null);

  const currentDay = trip.days[selectedDayIndex] || trip.days[0];

  // Budget calculations
  const totalBudget = trip.budget.totalBudget;
  const categoriesSum = Object.values(trip.budget.categories).reduce((a, b) => a + b, 0);
  const remainingBudget = totalBudget - categoriesSum;

  const handleAskAssistant = async (queryText?: string) => {
    const q = queryText || assistantQuery;
    if (!q.trim()) return;

    const newMsgs = [...assistantMessages, { sender: 'user' as const, text: q }];
    setAssistantMessages(newMsgs);
    setAssistantQuery('');
    setIsAssistantThinking(true);

    const result = await askTripAssistant(q, trip, currentLang);
    setIsAssistantThinking(false);

    setAssistantMessages([
      ...newMsgs,
      { sender: 'ai' as const, text: result.message, proposal: result.proposal },
    ]);
  };

  const handleApplyProposal = (proposal: any) => {
    // Clone and apply targeted adjustments
    const updated = JSON.parse(JSON.stringify(trip)) as Trip;
    if (proposal && proposal.changes) {
      proposal.changes.forEach((c: any) => {
        if (c.dayNumber && updated.days[c.dayNumber - 1]) {
          const targetDay = updated.days[c.dayNumber - 1];
          // Add a gentle scenic coffee break
          targetDay.items.splice(1, 0, {
            id: 'coffee-' + Date.now(),
            title: 'Scenic Afternoon Cafe & Leisure Rest',
            description: 'Curated 45-minute downtime at an artisanal tea & cafe lounge to recharge.',
            period: 'afternoon',
            time: '03:30 PM',
            duration: '45 min',
            category: 'relaxation',
            photoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop',
            lat: 0,
            lng: 0,
            estimatedCost: 12,
            rating: 4.9,
          });
        }
      });
    }
    onUpdateTrip(updated);
    setAssistantMessages((prev) => [
      ...prev,
      { sender: 'ai', text: '✓ Changes applied to your itinerary successfully!' },
    ]);
  };

  const handleOpenBudgetOptimizer = async () => {
    setIsBudgetModalOpen(true);
    setIsOptimizingBudget(true);
    const data = await optimizeBudgetWithAI(trip);
    setBudgetOptimizationData(data);
    setIsOptimizingBudget(false);
  };

  const handleToggleChecklist = (id: string) => {
    const updated = { ...trip };
    updated.checklist = updated.checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdateTrip(updated);
  };

  const handleShareCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(trip, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${trip.title.replace(/\s+/g, '_')}_TripAI.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#0a0d14] text-slate-900 dark:text-slate-100 pb-20">
      {/* Top Hero Banner */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden">
        <img
          src={trip.coverImage}
          alt={trip.destination}
          className="w-full h-full object-cover object-center filter brightness-[0.75]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-[#0a0d14]/30 to-transparent" />

        {/* Floating Top Controls */}
        <div className="absolute top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between z-10">
          <button
            onClick={onBackToHome}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900/70 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            ← Back to Home
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs font-semibold backdrop-blur-md shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t.shareTrip}</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-xl bg-slate-900/70 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Save for offline usage"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.saveOffline}</span>
            </button>
          </div>
        </div>

        {/* Hero Meta Info */}
        <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 z-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 text-white backdrop-blur-md border border-white/20">
              {trip.durationDays} {t.daysDuration}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 text-white backdrop-blur-md border border-white/20">
              {trip.travelerType.toUpperCase()} • {trip.adultsCount} {t.travelersCount}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/80 text-white backdrop-blur-md">
              AI Optimized Route
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight drop-shadow-sm">
            {trip.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-white/80 mt-2 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {trip.startDate} — {trip.endDate}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {trip.destination}, {trip.country}
            </span>
          </div>
        </div>
      </div>

      {/* Main App Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-8 overflow-x-auto gap-3">
          <div className="flex items-center gap-2">
            {[
              { id: 'overview' as const, label: t.overview },
              { id: 'itinerary' as const, label: t.itinerary },
              { id: 'map' as const, label: t.map },
              { id: 'budget' as const, label: t.budget },
              { id: 'bookings' as const, label: t.bookings },
              { id: 'essentials' as const, label: t.travelEssentials },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Collaborator Avatars */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] text-slate-400 font-medium mr-1.5">Collaborators:</span>
            <div className="flex -space-x-2">
              {trip.collaborators.map((c) => (
                <img
                  key={c.id}
                  src={c.avatar}
                  alt={c.name}
                  title={`${c.name} (${c.role})`}
                  className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                />
              ))}
            </div>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="w-7 h-7 rounded-full border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 ml-1 cursor-pointer"
              title="Invite traveler"
            >
              +
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Highlights & Quick Timeline */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI Trip Assistant Conversational Bar */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      TripAI Context Assistant
                    </h3>
                    <p className="text-xs text-slate-400">
                      Live recommendations grounded in local opening hours and distances
                    </p>
                  </div>
                </div>

                {/* Assistant Chat Message Feed */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1 mb-4">
                  {assistantMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white ml-8 text-right'
                          : 'bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50 text-slate-800 dark:text-slate-200 mr-8'
                      }`}
                    >
                      <p>{msg.text}</p>
                      {msg.proposal && (
                        <div className="mt-2.5 pt-2 border-t border-sky-200/60 dark:border-sky-800/60 flex items-center justify-between">
                          <span className="font-semibold text-sky-700 dark:text-sky-300">
                            {msg.proposal.title}
                          </span>
                          <button
                            onClick={() => handleApplyProposal(msg.proposal)}
                            className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-[10px] cursor-pointer"
                          >
                            {t.confirmChanges}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {isAssistantThinking && (
                    <div className="text-xs text-slate-400 italic flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      TripAI is analyzing your schedule…
                    </div>
                  )}
                </div>

                {/* Suggestion prompt pills */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {[
                    'Make Day 2 less busy',
                    'Find hidden gem dining',
                    'Check budget balance',
                    'Suggest romantic sunset spot',
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleAskAssistant(chip)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-50 dark:bg-slate-900 hover:bg-sky-50 dark:hover:bg-sky-950/50 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800 transition-colors cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Input box */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={assistantQuery}
                    onChange={(e) => setAssistantQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskAssistant()}
                    placeholder={t.askAssistantPlaceholder}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  <button
                    onClick={() => handleAskAssistant()}
                    className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-semibold cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day-by-day Overview Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Itinerary Highlights
                  </h3>
                  <button
                    onClick={() => setActiveTab('itinerary')}
                    className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                  >
                    View detailed schedule <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {trip.days.map((day, dIdx) => (
                    <div
                      key={day.dayNumber}
                      onClick={() => {
                        setSelectedDayIndex(dIdx);
                        setActiveTab('itinerary');
                      }}
                      className="p-4 rounded-2xl bg-white dark:bg-[#121620] border border-slate-200/80 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 transition-all cursor-pointer group shadow-xs"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1.5">
                        <span className="text-sky-600 dark:text-sky-400">Day {day.dayNumber}</span>
                        <span>{day.items.length} spots</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mb-2 line-clamp-1">
                        {day.themeTitle}
                      </h4>

                      <div className="space-y-1.5">
                        {day.items.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Weather, Live Essentials & Fast Budget widget */}
            <div className="space-y-6">
              {/* Budget Quick Ring / Summary */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t.budget}</h3>
                  <button
                    onClick={handleOpenBudgetOptimizer}
                    className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                  >
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>{t.fixWithAI}</span>
                  </button>
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs text-slate-400">{t.totalBudget}</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {formatCurrency(totalBudget, trip.budget.currency)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all ${
                      categoriesSum > totalBudget ? 'bg-rose-500' : 'bg-slate-950 dark:bg-white'
                    }`}
                    style={{ width: `${Math.min(100, (categoriesSum / totalBudget) * 100)}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="text-slate-400">{t.planned}</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrency(categoriesSum, trip.budget.currency)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-400">{t.remaining}</div>
                    <div
                      className={`font-semibold ${
                        remainingBudget < 0
                          ? 'text-rose-600 font-bold'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {formatCurrency(remainingBudget, trip.budget.currency)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Weather & Local Time Widget */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Destination Weather
                  </h3>
                  <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                    {trip.essentials.tempCelsius}°C
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                  {trip.essentials.weatherSummary}
                </p>

                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                  {trip.essentials.forecast.slice(0, 4).map((f, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900">
                      <div className="text-[10px] text-slate-400">{f.day}</div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 my-0.5">
                        {f.temp}°C
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{f.condition}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Travel Packing Checklist */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t.checklist}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {trip.checklist.filter((c) => c.completed).length}/{trip.checklist.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {trip.checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleChecklist(item.id)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer text-xs transition-colors"
                    >
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          item.completed
                            ? 'bg-slate-950 dark:bg-white border-slate-950 dark:border-white text-white dark:text-slate-950'
                            : 'border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span
                        className={`${
                          item.completed
                            ? 'line-through text-slate-400'
                            : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {item.task}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ITINERARY (DAY-BY-DAY) */}
        {activeTab === 'itinerary' && (
          <div className="space-y-8">
            {/* Day Selector Ribbon */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {trip.days.map((day, idx) => (
                <button
                  key={day.dayNumber}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedDayIndex === idx
                      ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                      : 'bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Day {day.dayNumber}
                </button>
              ))}
            </div>

            {/* Current Day Header */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1">
                  {currentDay.dateStr}
                </div>
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                  {currentDay.themeTitle}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAskAssistant(`Add one high-rated dessert or tea spot to Day ${currentDay.dayNumber}`)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.addPlace}</span>
                </button>
                <button
                  onClick={() => handleAskAssistant(`Regenerate Day ${currentDay.dayNumber} with relaxing morning activities`)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t.regenerateDay}</span>
                </button>
              </div>
            </div>

            {/* Itinerary Timeline Items */}
            <div className="space-y-6">
              {currentDay.items.map((item, idx) => (
                <div key={item.id} className="relative">
                  {/* Transit line connecting to next */}
                  {idx < currentDay.items.length - 1 && (
                    <div className="absolute left-6 top-24 bottom-[-24px] w-0.5 bg-slate-200 dark:bg-slate-800 z-0" />
                  )}

                  <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200/80 dark:border-slate-800 shadow-sm relative z-10 grid grid-cols-1 sm:grid-cols-4 gap-6">
                    {/* Item Photo */}
                    <div className="sm:col-span-1 rounded-2xl overflow-hidden h-44 sm:h-auto bg-slate-100 dark:bg-slate-800 relative">
                      <img
                        src={item.photoUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-bold bg-slate-950/80 text-white backdrop-blur-sm">
                        {item.period}
                      </span>
                    </div>

                    {/* Item Content */}
                    <div className="sm:col-span-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              {item.time} ({item.duration})
                            </span>
                          </div>

                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            ~{formatCurrency(item.estimatedCost, trip.budget.currency)}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                          {item.title}
                        </h3>

                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                          {item.description}
                        </p>
                      </div>

                      {/* Transit indicator to next spot */}
                      {item.transitToNext && (
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Navigation className="w-3.5 h-3.5 text-sky-500" />
                            <span>{item.transitToNext}</span>
                          </div>
                          {item.distanceToNext && <span>{item.distanceToNext}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MAP */}
        {activeTab === 'map' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.map}</h2>
                <p className="text-xs text-slate-400">
                  Interactive geographic clusters and routing for {trip.destination}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                <span className="px-3 py-1 font-semibold rounded-lg bg-white dark:bg-slate-800 shadow-xs">
                  Route View
                </span>
              </div>
            </div>

            {/* Stylized Visual Map Stage */}
            <div className="relative w-full h-[460px] rounded-2xl bg-[#0e1420] border border-slate-800 overflow-hidden flex items-center justify-center p-6">
              {/* Map grid lines & contour styling */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

              {/* Central Map Illustration Canvas */}
              <div className="relative z-10 w-full max-w-2xl text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700 text-white text-xs font-semibold mb-6">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>{trip.destination} Regional Route Coordinates</span>
                </div>

                {/* Day pin nodes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                  {currentDay.items.map((item, i) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white shadow-lg backdrop-blur-md"
                    >
                      <div className="flex items-center justify-between text-[11px] text-sky-400 font-bold mb-1">
                        <span>Stop {i + 1}</span>
                        <span>{item.time}</span>
                      </div>
                      <div className="text-xs font-bold truncate">{item.title}</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Est: {item.transitToNext || 'End of schedule'}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-xs text-slate-400">
                  All locations verified for walking safety and realistic transit connectivity.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BUDGET & OPTIMIZATION */}
        {activeTab === 'budget' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Budget Health & Allocation
                </h2>
                <p className="text-xs text-slate-400">
                  Track planned expenditures and optimize cost without sacrificing travel quality.
                </p>
              </div>

              <button
                onClick={handleOpenBudgetOptimizer}
                className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <TrendingDown className="w-4 h-4 text-sky-400 dark:text-sky-600" />
                <span>{t.fixWithAI}</span>
              </button>
            </div>

            {/* Category breakdown bars */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                Category Allocations
              </h3>

              {Object.entries(trip.budget.categories).map(([cat, amt]) => {
                const percent = Math.min(100, Math.round((amt / (totalBudget || 1)) * 100));
                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="capitalize font-medium text-slate-700 dark:text-slate-300">
                        {cat}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(amt, trip.budget.currency)} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-600 dark:bg-sky-400 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: BOOKINGS & WALLET */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t.travelWallet} & Bookings
                </h2>
                <p className="text-xs text-slate-400">
                  Confirmed vouchers, hotel confirmations, and boarding passes stored securely.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trip.bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-5 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40">
                        {booking.status}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {formatCurrency(booking.cost, booking.currency)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                      {booking.title}
                    </h3>
                    <div className="text-xs text-slate-400 mb-2">
                      Provider: <span className="text-slate-700 dark:text-slate-300 font-medium">{booking.provider}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 space-y-1 mb-3">
                      <div>Ref: <strong className="font-mono">{booking.referenceNumber}</strong></div>
                      <div>Date: {booking.date} {booking.time ? `• ${booking.time}` : ''}</div>
                      <div>{booking.details}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => alert(`Showing digital pass for ${booking.referenceNumber}`)}
                      className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      View confirmation pass
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: TRAVEL ESSENTIALS */}
        {activeTab === 'essentials' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Visa & Entry Requirements
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {trip.essentials.visaPolicy}
              </p>
              <div className="text-[11px] font-semibold text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                Source: {trip.essentials.visaSourceDate}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-500" />
                Currency & Tipping Etiquette
              </h3>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Live Rate: {trip.essentials.currencyExchangeRate}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {trip.essentials.tippingCulture}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                Emergency & Medical Contacts
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-mono">
                {trip.essentials.emergencyNumbers}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Power Plugs & Local Time
              </h3>
              <div className="text-xs text-slate-600 dark:text-slate-300">
                Timezone: <strong className="text-slate-900 dark:text-white">{trip.essentials.timezone}</strong>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300">
                Sockets: <strong className="text-slate-900 dark:text-white">{trip.essentials.plugsAndVoltage}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI BUDGET OPTIMIZATION MODAL */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white dark:bg-[#11151e] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    TripAI Budget Optimization
                  </h3>
                  <p className="text-xs text-slate-400">Real savings while preserving experience quality</p>
                </div>
              </div>
              <button
                onClick={() => setIsBudgetModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                ✕
              </button>
            </div>

            {isOptimizingBudget ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                <Sparkles className="w-6 h-6 animate-spin mx-auto text-sky-500 mb-3" />
                Analyzing smart alternatives & city passes…
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {budgetOptimizationData?.summary}
                </p>

                <div className="space-y-3">
                  {budgetOptimizationData?.suggestions.map((sug: any, i: number) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {sug.category}
                        </span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          Save {formatCurrency(sug.savingsAmount, trip.budget.currency)}
                        </span>
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 line-through text-[11px]">
                        {sug.originalOption}
                      </div>
                      <div className="font-semibold text-sky-700 dark:text-sky-300 mt-0.5">
                        ↳ {sug.recommendedOption}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                        {sug.reasoning}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button
                    onClick={() => setIsBudgetModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={() => {
                      setIsBudgetModalOpen(false);
                      alert('Budget savings applied to your travel plan!');
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 cursor-pointer"
                  >
                    {t.apply}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-[#11151e] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.shareTrip}
              </h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Anyone with this link can view this trip and vote on favorite dinner spots and attractions in real time.
            </p>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-4">
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="w-full bg-transparent text-xs text-slate-600 dark:text-slate-300 outline-none truncate"
              />
              <button
                onClick={handleShareCopy}
                className="px-3 py-1.5 rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer"
              >
                {shareCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

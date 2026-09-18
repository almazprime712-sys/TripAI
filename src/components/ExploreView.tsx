import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  Search,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { DestinationGuide, destinationsData } from '../data/destinations';
import { SupportedLanguage, SupportedCurrency } from '../types';
import { translations, formatCurrency } from '../i18n/translations';

interface ExploreViewProps {
  currentLang: SupportedLanguage;
  currentCurrency: SupportedCurrency;
  onSelectDestination: (destName: string) => void;
  onClose: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  currentLang,
  currentCurrency,
  onSelectDestination,
  onClose,
}) => {
  const t = translations[currentLang] || translations.en;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const allTags = ['All', 'Culture', 'Food & Dining', 'Nature', 'Luxury', 'Shopping', 'Architecture'];

  const filtered = destinationsData.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = selectedTag === 'All' || d.tags.some((t) => t.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-950 dark:text-white tracking-tight">
            Explore Destinations
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Curated world guides with verified local hours, average budgets, and seasonal recommendations.
          </p>
        </div>

        <button
          onClick={() => {
            const random = destinationsData[Math.floor(Math.random() * destinationsData.length)];
            onSelectDestination(`${random.name}, ${random.country}`);
          }}
          className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-sky-400 dark:text-sky-600" />
          <span>Inspire me (Surprise trip)</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city, country or vibe..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121620] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedTag === tag
                  ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                  : 'bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Destination Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((dest) => (
          <div
            key={dest.id}
            className="rounded-3xl bg-white dark:bg-[#121620] border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-52 w-full overflow-hidden">
                <img
                  src={dest.cardImage}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/70 text-white text-[10px] font-bold backdrop-blur-md flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{dest.rating}</span>
                  <span className="opacity-70">({dest.reviewsCount.toLocaleString()})</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white drop-shadow-sm">
                  <span className="text-xs font-semibold">{dest.bestSeason}</span>
                  <span className="text-xs font-bold">
                    ~{formatCurrency(dest.avgDailyBudgetUSD, currentCurrency)} / day
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">
                  {dest.country}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {dest.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {dest.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-2">
              <button
                onClick={() => onSelectDestination(`${dest.name}, ${dest.country}`)}
                className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors mt-3"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400 dark:text-sky-600" />
                <span>Plan trip to {dest.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

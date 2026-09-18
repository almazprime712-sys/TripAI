import React, { useState } from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import { SupportedCurrency } from '../types';
import { formatCurrency } from '../i18n/translations';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCurrency: SupportedCurrency;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  currentCurrency,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  if (!isOpen) return null;

  const monthlyPrice = 12;
  const yearlyMonthlyEquivalent = 8.25; // $99/year

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white dark:bg-[#11151e] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 sm:p-8 text-center relative border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/50 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent, Honest Pricing</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
            Simple plans for every traveler
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1.5">
            Plan your first trips completely free. Upgrade anytime for unlimited AI generation, offline synchronization, and group voting.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="inline-flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 mt-5">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Yearly</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                Save 30%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="p-6 sm:p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Tier */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Free Forever</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {formatCurrency(0, currentCurrency)}
              </div>
              <p className="text-xs text-slate-400 mt-1">Ideal for occasional trips and solo exploration.</p>

              <div className="space-y-2.5 mt-6">
                {[
                  '3 active AI itineraries',
                  'Day-by-day balanced pacing',
                  'Verified essentials & visa notices',
                  'Basic JSON export',
                  'Guest mode with no registration',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mt-8 cursor-pointer"
            >
              Current Plan
            </button>
          </div>

          {/* Pro Tier */}
          <div className="p-6 rounded-2xl bg-sky-50/40 dark:bg-sky-950/20 border-2 border-sky-500/80 flex flex-col justify-between relative shadow-sm">
            <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-sky-500 text-white text-[10px] font-bold">
              POPULAR
            </div>

            <div>
              <div className="text-sm font-bold text-sky-900 dark:text-sky-200">TripAI Pro</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2 flex items-baseline gap-1">
                <span>
                  {formatCurrency(
                    billingCycle === 'yearly' ? yearlyMonthlyEquivalent : monthlyPrice,
                    currentCurrency
                  )}
                </span>
                <span className="text-xs font-normal text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {billingCycle === 'yearly' ? 'Billed annually ($99/year)' : 'Billed monthly, cancel anytime'}
              </p>

              <div className="space-y-2.5 mt-6">
                {[
                  'Unlimited AI-crafted itineraries',
                  'Real-time group collaboration & spot voting',
                  'Full offline bundle (no roaming data needed)',
                  'AI Budget Optimization & smart swaps',
                  'Flight schedule & delay tracking',
                  'Priority Gemini 3.8 Flash model access',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200 font-medium">
                    <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                alert('TripAI Pro trial activated for this session!');
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold transition-all mt-8 shadow-sm cursor-pointer"
            >
              Start 14-Day Free Pro Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

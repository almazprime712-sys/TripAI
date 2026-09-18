import React from 'react';
import { X, Sparkles, Navigation, Users, ArrowRight } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPlanner: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onOpenPlanner,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-[#11151e] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">How TripAI Works</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              The philosophy: Complex inside, incredibly simple outside.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Share your idea in 60 seconds
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Choose a destination, dates or duration, travel companion type, and what you love doing. No account required to begin.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                AI architects realistic logistics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Rather than random lists, TripAI clusters sights geographically, checks realistic transit intervals, avoids midday burnout, and verifies entry regulations.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Collaborate & travel offline
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Invite fellow travelers to vote on restaurants, balance budgets using one-click AI recommendations, and export complete offline bundles.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex justify-end">
          <button
            onClick={() => {
              onClose();
              onOpenPlanner();
            }}
            className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-sky-400 dark:text-sky-600" />
            <span>Plan my trip now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

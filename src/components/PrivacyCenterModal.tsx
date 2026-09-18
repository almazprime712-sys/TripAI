import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, Trash2 } from 'lucide-react';

interface PrivacyCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearAllData: () => void;
}

export const PrivacyCenterModal: React.FC<PrivacyCenterModalProps> = ({
  isOpen,
  onClose,
  onClearAllData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-[#11151e] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              TripAI Privacy Center
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="flex items-start gap-3.5">
            <EyeOff className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Zero Forced Registration
              </h3>
              <p>
                You are free to plan complete trips, balance budgets, and explore routes as a guest. We store trip data inside your local browser storage by default.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <Lock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Zero Data Monetization or Tracking
              </h3>
              <p>
                We never sell your destinations, dates, budgets, or companion details to ad networks, third-party data brokers, or airlines.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Verified Information Sources
              </h3>
              <p>
                Visa summaries, emergency lines, and transit guidelines cite official government portals and IATA databases with verified snapshot dates.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between">
            <div>
              <div className="font-bold text-rose-800 dark:text-rose-300">
                Data Erasure & Reset
              </div>
              <div className="text-[11px] text-rose-600 dark:text-rose-400">
                Wipe all cached itineraries and preferences from your browser.
              </div>
            </div>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all locally saved trips?')) {
                  onClearAllData();
                  onClose();
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear My Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

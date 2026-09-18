import React from 'react';
import { Trip, SupportedCurrency } from '../types';
import { formatCurrency } from '../i18n/translations';
import { X, Calendar, MapPin, Trash2, ArrowRight } from 'lucide-react';

interface SavedTripsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trips: Trip[];
  currentCurrency: SupportedCurrency;
  onSelectTrip: (trip: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
}

export const SavedTripsModal: React.FC<SavedTripsModalProps> = ({
  isOpen,
  onClose,
  trips,
  currentCurrency,
  onSelectTrip,
  onDeleteTrip,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-[#11151e] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Saved Trips</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cached locally in your browser. No forced registration.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-3">
          {trips.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              You don’t have any saved trips yet. Click "Plan my trip" to create your first journey!
            </div>
          ) : (
            trips.map((trip) => (
              <div
                key={trip.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={trip.coverImage}
                    alt={trip.destination}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {trip.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {trip.destination}
                      </span>
                      <span>•</span>
                      <span>{trip.durationDays} days</span>
                      <span>•</span>
                      <span>{formatCurrency(trip.budget.totalBudget, trip.budget.currency)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      onSelectTrip(trip);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteTrip(trip.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Delete trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

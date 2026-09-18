export type SupportedLanguage =
  | 'en'
  | 'ru'
  | 'uz'
  | 'es'
  | 'fr'
  | 'de'
  | 'it'
  | 'pt'
  | 'tr'
  | 'ar'
  | 'zh'
  | 'ja'
  | 'ko';

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'UZS' | 'AED' | 'RUB' | 'CNY' | 'CAD' | 'AUD';

export type TravelerType = 'solo' | 'couple' | 'family' | 'friends' | 'business';

export type TripDayPeriod = 'morning' | 'afternoon' | 'evening';

export interface PlaceVote {
  id: string;
  name: string;
  votes: string[]; // user names or IDs
  category: string;
  photoUrl: string;
  cost: string;
}

export interface ItineraryItem {
  id: string;
  title: string;
  description: string;
  period: TripDayPeriod;
  time: string;
  duration: string;
  category: 'attraction' | 'dining' | 'nature' | 'culture' | 'shopping' | 'relaxation' | 'nightlife' | 'transit';
  photoUrl: string;
  transitToNext?: string;
  distanceToNext?: string;
  lat: number;
  lng: number;
  estimatedCost: number;
  rating?: number;
  tags?: string[];
  userNotes?: string;
  comments?: { id: string; author: string; text: string; time: string }[];
  voteOptions?: PlaceVote[];
}

export interface TripDay {
  dayNumber: number;
  dateStr: string;
  themeTitle: string;
  items: ItineraryItem[];
}

export interface BudgetBreakdown {
  totalBudget: number;
  currency: SupportedCurrency;
  categories: {
    flights: number;
    hotels: number;
    food: number;
    transport: number;
    activities: number;
    shopping: number;
    other: number;
  };
  spent: number;
}

export interface BookingItem {
  id: string;
  type: 'flight' | 'hotel' | 'activity' | 'restaurant' | 'transfer';
  title: string;
  provider: string;
  referenceNumber: string;
  date: string;
  time?: string;
  cost: number;
  currency: SupportedCurrency;
  status: 'confirmed' | 'pending' | 'cancelled';
  details: string;
  documentUrl?: string;
}

export interface ChecklistItem {
  id: string;
  task: string;
  category: 'documents' | 'gear' | 'health' | 'clothing' | 'general';
  completed: boolean;
  dueDate?: string;
}

export interface TravelEssentials {
  timezone: string;
  localTimeOffset: number; // e.g. +9 for Tokyo, +2 for Paris
  weatherSummary: string;
  tempCelsius: number;
  forecast: { day: string; temp: number; icon: string; condition: string }[];
  currencyCode: SupportedCurrency;
  currencyExchangeRate: string; // e.g. "1 USD ≈ 154 JPY"
  visaPolicy: string;
  visaSourceDate: string; // e.g. "Verified Sep 2026 via IATA / Official Embassy"
  plugsAndVoltage: string;
  emergencyNumbers: string;
  tippingCulture: string;
  languagesSpoken: string[];
}

export interface Collaborator {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  role: 'owner' | 'editor' | 'viewer';
  activeSection?: string;
  isOnline: boolean;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  country: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  travelerType: TravelerType;
  adultsCount: number;
  childrenCount: number;
  interests: string[];
  budget: BudgetBreakdown;
  days: TripDay[];
  bookings: BookingItem[];
  checklist: ChecklistItem[];
  essentials: TravelEssentials;
  collaborators: Collaborator[];
  isPublic: boolean;
  sharePermission: 'view' | 'edit';
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
}

export interface AIDiffProposal {
  id: string;
  description: string;
  changes: {
    type: 'add' | 'remove' | 'reorder' | 'budget_adjust' | 'hotel_swap';
    dayNumber?: number;
    summary: string;
    details: string;
  }[];
  appliedAction: () => void;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  preferredCurrency: SupportedCurrency;
  preferredLanguage: SupportedLanguage;
  isPro: boolean;
  createdAt: string;
}

export type SpotCategory = 'eating' | 'drinking' | 'outdoors' | 'activities' | 'nightlife' | 'cafe' | 'hotel' | 'event';
export type BudgetTier = 'budget' | 'mid' | 'splurge';

export interface Spot {
  id: string;
  name: string;
  slug: string;
  description: string;
  area: string;
  city: string;
  category: SpotCategory;
  budgetTier: BudgetTier;
  priceRange: string;
  vibeTags: string[];
  whoItsFor: string[];
  amenities: string[];
  bestTimeToGo: string;
  images: string[];
  videoUrl?: string;
  phone: string;
  instagram: string;
  website: string;
  mapsUrl: string;
  isVerified: boolean;
  lastVerifiedDate: string;
  isFeatured: boolean;
  isOutsyPick: boolean;
  isNew: boolean;
  goingNowCount: number;
  special?: {
    label: string;
    type: 'promo' | 'event' | 'active' | 'limited';
  };
  type: 'spot' | 'event';
  eventDate?: string;
  eventEndDate?: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  type: 'category' | 'mood' | 'who' | 'curated';
  spotIds: string[];
}

export interface OutsyPick {
  id: string;
  spotId: string;
  weekStartDate: string;
  order: number;
}

export interface IssueReport {
  id: string;
  spotId?: string;
  spotName?: string;
  issueType: 'incorrect_info' | 'closed_permanently' | 'wrong_location' | 'bad_link' | 'other';
  description: string;
  email?: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface Business {
  id: string;
  name: string;
  tier: 'Basic' | 'Featured' | 'Premium';
  startDate: string;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Pending' | 'Cancelled';
  contact: string;
  notes: string;
}

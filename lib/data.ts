import { Spot, SpotCategory, BudgetTier, Collection, OutsyPick } from './types';
import spotsData from '../data/spots.json';
import collectionsData from '../data/collections.json';
import picksData from '../data/picks.json';
import eventsData from '../data/events.json';

const spots = spotsData as Spot[];
const collections = collectionsData as Collection[];
const outsyPicks = picksData as OutsyPick[];
const events = eventsData as Spot[]; // events have type 'event' but use Spot interface

// Combine spots and events for general retrieval where applicable
const allSpotsAndEvents = [...spots, ...events];

export function getAllSpots(): Spot[] {
  return spots;
}

export function getSpotById(id: string): Spot | undefined {
  return allSpotsAndEvents.find(s => s.id === id);
}

export function getSpotBySlug(slug: string): Spot | undefined {
  return allSpotsAndEvents.find(s => s.slug === slug);
}

export function getSpotsByCategory(category: SpotCategory): Spot[] {
  return allSpotsAndEvents.filter(s => s.category === category);
}

export function getSpotsByBudget(budget: BudgetTier): Spot[] {
  return allSpotsAndEvents.filter(s => s.budgetTier === budget);
}

export function getTrendingSpots(limit: number = 5): Spot[] {
  return allSpotsAndEvents
    .sort((a, b) => b.goingNowCount - a.goingNowCount)
    .slice(0, limit);
}

export function getOutsyPicks(): Spot[] {
  return outsyPicks
    .sort((a, b) => a.order - b.order)
    .map(pick => getSpotById(pick.spotId))
    .filter((s): s is Spot => !!s);
}

export function getAllCollections(): Collection[] {
  return collections;
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find(c => c.slug === slug);
}

export function getSpotsForCollection(collectionSlug: string): Spot[] {
  const collection = getCollectionBySlug(collectionSlug);
  if (!collection) return [];
  
  return collection.spotIds
    .map(id => getSpotById(id))
    .filter((s): s is Spot => !!s);
}

export interface FilterOptions {
  category?: SpotCategory;
  budget?: BudgetTier;
  area?: string;
  type?: 'spot' | 'event';
}

export function getFilteredSpots(filters: FilterOptions): Spot[] {
  return allSpotsAndEvents.filter(spot => {
    if (filters.category && spot.category !== filters.category) return false;
    if (filters.budget && spot.budgetTier !== filters.budget) return false;
    if (filters.area && spot.area !== filters.area) return false;
    if (filters.type && spot.type !== filters.type) return false;
    return true;
  });
}

export function getDiscoverSpots(limit: number = 4): {
  morning: Spot[];
  afternoon: Spot[];
  night: Spot[];
} {
  const byPopularity = (a: Spot, b: Spot) => b.goingNowCount - a.goingNowCount;

  const morningCats: SpotCategory[] = ["cafe", "eating", "outdoors", "activities"];
  const afternoonCats: SpotCategory[] = ["activities", "outdoors", "eating", "cafe"];
  const nightCats: SpotCategory[] = ["nightlife", "drinking", "eating"];

  function pick(cats: SpotCategory[]): Spot[] {
    const matched = allSpotsAndEvents
      .filter((s) => cats.includes(s.category))
      .sort(byPopularity)
      .slice(0, limit);
    if (matched.length < limit) {
      const seen = new Set(matched.map((s) => s.id));
      const extras = allSpotsAndEvents
        .filter((s) => !seen.has(s.id))
        .sort(byPopularity)
        .slice(0, limit - matched.length);
      return [...matched, ...extras];
    }
    return matched;
  }

  return {
    morning: pick(morningCats),
    afternoon: pick(afternoonCats),
    night: pick(nightCats),
  };
}

export function getRandomSpot(): Spot | undefined {
  if (spots.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * spots.length);
  return spots[randomIndex];
}

export function getSimilarSpots(spot: Spot, limit: number = 6): Spot[] {
  return allSpotsAndEvents
    .filter(s => s.id !== spot.id && s.category === spot.category)
    .sort((a, b) => b.goingNowCount - a.goingNowCount)
    .slice(0, limit);
}

export function getTimeBasedSpots(limit: number = 4): { label: string; spots: Spot[] } {
  const hour = new Date().getHours();

  let label: string;
  let categories: SpotCategory[];

  if (hour >= 6 && hour < 12) {
    label = "Good for this morning";
    categories = ["cafe", "eating"];
  } else if (hour >= 12 && hour < 17) {
    label = "Good for this afternoon";
    categories = ["activities", "outdoors", "eating"];
  } else if (hour >= 17 && hour < 21) {
    label = "Good for this evening";
    categories = ["eating", "drinking", "cafe"];
  } else {
    label = "Good for tonight";
    categories = ["nightlife", "drinking", "eating"];
  }

  const matched = allSpotsAndEvents
    .filter((s) => categories.includes(s.category))
    .sort((a, b) => b.goingNowCount - a.goingNowCount)
    .slice(0, limit);

  // fallback: if not enough category matches, pad with trending
  if (matched.length < limit) {
    const ids = new Set(matched.map((s) => s.id));
    const extras = allSpotsAndEvents
      .filter((s) => !ids.has(s.id))
      .sort((a, b) => b.goingNowCount - a.goingNowCount)
      .slice(0, limit - matched.length);
    return { label, spots: [...matched, ...extras] };
  }

  return { label, spots: matched };
}

export function searchSpots(query: string): Spot[] {
  const lowercaseQuery = query.toLowerCase();
  return allSpotsAndEvents.filter(
    spot =>
      spot.name.toLowerCase().includes(lowercaseQuery) ||
      spot.description.toLowerCase().includes(lowercaseQuery) ||
      spot.area.toLowerCase().includes(lowercaseQuery) ||
      spot.vibeTags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

import { createClient, createStaticClient } from './supabase/server';
import { Spot, SpotCategory, BudgetTier, Collection, OutsyPick } from './types';

// Helper to map DB snake_case to UI camelCase
function mapSpot(dbSpot: any): Spot {
  return {
    id: dbSpot.id,
    name: dbSpot.name,
    slug: dbSpot.slug,
    description: dbSpot.description || '',
    area: dbSpot.area || '',
    city: dbSpot.city || 'Lagos',
    category: dbSpot.category as SpotCategory,
    budgetTier: dbSpot.budget_tier as BudgetTier,
    priceRange: dbSpot.price_range || '',
    vibeTags: dbSpot.vibe_tags || [],
    whoItsFor: dbSpot.who_its_for || [],
    amenities: dbSpot.amenities || [],
    bestTimeToGo: dbSpot.best_time_to_go || '',
    images: dbSpot.images || [],
    videoUrl: dbSpot.video_url,
    phone: dbSpot.phone || '',
    instagram: dbSpot.instagram || '',
    website: dbSpot.website || '',
    mapsUrl: dbSpot.maps_url || '',
    isVerified: dbSpot.is_verified || false,
    lastVerifiedDate: dbSpot.last_verified_date || '',
    isFeatured: dbSpot.is_featured || false,
    isOutsyPick: dbSpot.is_outsy_pick || false,
    isNew: dbSpot.is_new || false,
    goingNowCount: dbSpot.going_now_count || 0,
    type: dbSpot.type as 'spot' | 'event',
    createdAt: dbSpot.created_at || ''
  };
}

function mapCollection(dbCol: any): Collection {
  return {
    id: dbCol.id,
    name: dbCol.name,
    slug: dbCol.slug,
    description: dbCol.description || '',
    coverImage: dbCol.cover_image || '',
    type: dbCol.type as any,
    spotIds: dbCol.spot_ids || []
  };
}

export async function getAllSpots(): Promise<Spot[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all spots:', error);
    return [];
  }

  return data.map(mapSpot);
}

export async function getSpotsByIds(ids: string[]): Promise<Spot[]> {
  if (!ids.length) return [];
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .in('id', ids);

  if (error) {
    console.error('Error fetching spots by IDs:', error);
    return [];
  }
  return data.map(mapSpot);
}

export async function getSpotById(id: string): Promise<Spot | undefined> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return undefined;
  return mapSpot(data);
}

export async function getSpotBySlug(slug: string): Promise<Spot | undefined> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return undefined;
  return mapSpot(data);
}

export async function getSpotsByCategory(category: SpotCategory): Promise<Spot[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .eq('category', category);

  if (error) return [];
  return data.map(mapSpot);
}

export async function getSpotsByBudget(budget: BudgetTier): Promise<Spot[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .eq('budget_tier', budget);

  if (error) return [];
  return data.map(mapSpot);
}

export async function getTrendingSpots(limit: number = 5): Promise<Spot[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .order('going_now_count', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data.map(mapSpot);
}

export async function getOutsyPicks(): Promise<Spot[]> {
  const supabase = createStaticClient();
  
  // Fetch from the 'picks' join table which orders our featured content
  const { data: picksData, error: picksError } = await supabase
    .from('picks')
    .select('*, spot:spots(*)')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (picksError || !picksData) {
    console.error('Error fetching picks:', picksError);
    return [];
  }

  return picksData
    .map(p => p.spot ? mapSpot(p.spot) : null)
    .filter((s): s is Spot => !!s);
}

export async function getAllCollections(): Promise<Collection[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from('collections')
    .select('*');

  if (error) return [];
  return data.map(mapCollection);
}

export async function getCollectionBySlug(slug: string): Promise<Collection | undefined> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return undefined;
  return mapCollection(data);
}

export async function getSpotsForCollection(collectionSlug: string): Promise<Spot[]> {
  const collection = await getCollectionBySlug(collectionSlug);
  if (!collection || !collection.spotIds.length) return [];
  
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .in('id', collection.spotIds);

  if (error) return [];
  return data.map(mapSpot);
}

export async function getCollectionsForSpot(spotId: string): Promise<Collection[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .contains('spot_ids', [spotId]);

  if (error) {
    console.error('Error fetching collections for spot:', error);
    return [];
  }
  return data.map(mapCollection);
}

export async function getDiscoverSpots(limit: number = 4): Promise<{
  morning: Spot[];
  afternoon: Spot[];
  night: Spot[];
}> {
  const morningCats: SpotCategory[] = ["cafe", "eating", "outdoors", "activities"];
  const afternoonCats: SpotCategory[] = ["activities", "outdoors", "eating", "cafe"];
  const nightCats: SpotCategory[] = ["nightlife", "drinking", "eating"];

  const [morning, afternoon, night] = await Promise.all([
    fetchByCategoryList(morningCats, limit),
    fetchByCategoryList(afternoonCats, limit),
    fetchByCategoryList(nightCats, limit)
  ]);

  return { morning, afternoon, night };
}

async function fetchByCategoryList(cats: SpotCategory[], limit: number): Promise<Spot[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .in('category', cats)
    .order('going_now_count', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data.map(mapSpot);
}

export async function getRandomSpot(): Promise<Spot | undefined> {
  const supabase = createStaticClient();
  // Simplified random: fetch a list and pick one, or use a RPC if DB is huge
  const { data, error } = await supabase.from('spots').select('id').limit(50);
  if (error || !data.length) return undefined;
  
  const randomIndex = Math.floor(Math.random() * data.length);
  return getSpotById(data[randomIndex].id);
}

export async function getSimilarSpots(spot: Spot, limit: number = 6): Promise<Spot[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .eq('category', spot.category)
    .neq('id', spot.id)
    .order('going_now_count', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data.map(mapSpot);
}

export async function searchSpots(query: string): Promise<Spot[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,area.ilike.%${query}%`)
    .limit(20);

  if (error) return [];
  return data.map(mapSpot);
}

export async function getTimeBasedSpots(limit: number = 4): Promise<{ label: string; spots: Spot[] }> {
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

  const spots = await fetchByCategoryList(categories, limit);
  return { label, spots };
}

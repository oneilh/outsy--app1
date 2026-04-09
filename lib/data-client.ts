import { createClient } from './supabase/client';
import { Spot, SpotCategory, BudgetTier, Collection } from './types';

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

export async function getSpotById(id: string): Promise<Spot | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return undefined;
  return mapSpot(data);
}

export async function getSpotsByIds(ids: string[]): Promise<Spot[]> {
  if (!ids.length) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .in('id', ids);

  if (error) return [];
  return data.map(mapSpot);
}

export async function getAllSpots(): Promise<Spot[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data.map(mapSpot);
}

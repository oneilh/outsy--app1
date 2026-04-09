'use server'

import { createClient } from '@/lib/supabase/server';
import { Spot } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function addSpot(spot: Omit<Spot, 'id' | 'createdAt' | 'goingNowCount'>) {
  try {
    const supabase = await createClient();
    
    // Transform to snake_case for DB
    const dbSpot = {
      name: spot.name,
      slug: spot.slug,
      description: spot.description,
      area: spot.area,
      city: spot.city,
      category: spot.category,
      budget_tier: spot.budgetTier,
      price_range: spot.priceRange,
      vibe_tags: spot.vibeTags,
      who_its_for: spot.whoItsFor,
      amenities: spot.amenities,
      best_time_to_go: spot.bestTimeToGo,
      images: spot.images,
      video_url: spot.videoUrl,
      phone: spot.phone,
      instagram: spot.instagram,
      website: spot.website,
      maps_url: spot.mapsUrl,
      is_verified: spot.isVerified,
      last_verified_date: spot.lastVerifiedDate,
      is_featured: spot.isFeatured,
      is_outsy_pick: spot.isOutsyPick,
      is_new: spot.isNew,
      type: spot.type
    };

    const { data, error } = await supabase
      .from('spots')
      .insert([dbSpot])
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath('/admin');
    revalidatePath('/spots');
    revalidatePath('/');
    return { success: true, spot: data };
  } catch (error) {
    console.error('Failed to add spot:', error);
    return { success: false, error: 'Failed to add spot' };
  }
}

export async function updateSpot(id: string, updates: Partial<Spot>) {
  try {
    const supabase = await createClient();
    
    // Transform known fields to snake_case
    const dbUpdates: any = { ...updates };
    if (updates.budgetTier) {
      dbUpdates.budget_tier = updates.budgetTier;
      delete dbUpdates.budgetTier;
    }
    if (updates.vibeTags) {
      dbUpdates.vibe_tags = updates.vibeTags;
      delete dbUpdates.vibeTags;
    }
    // ... add more mappings if needed, or refine the Partial<Spot> mapping

    const { data, error } = await supabase
      .from('spots')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath('/admin');
    revalidatePath(`/spots/${data.slug}`);
    revalidatePath('/spots');
    revalidatePath('/');
    return { success: true, spot: data };
  } catch (error) {
    console.error('Failed to update spot:', error);
    return { success: false, error: 'Failed to update spot' };
  }
}

export async function verifySpot(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('spots')
      .update({ 
        is_verified: true, 
        last_verified_date: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath('/admin');
    revalidatePath(`/spots/${data.slug}`);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to verify spot:', error);
    return { success: false, error: 'Failed to verify spot' };
  }
}

export async function deleteSpot(id: string) {
  try {
    const supabase = await createClient();
    
    // Get slug before deleting for cache revalidation
    const { data: spot } = await supabase.from('spots').select('slug').eq('id', id).single();

    const { error } = await supabase.from('spots').delete().eq('id', id);
    if (error) throw error;
    
    revalidatePath('/admin');
    revalidatePath('/spots');
    if (spot) revalidatePath(`/spots/${spot.slug}`);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete spot:', error);
    return { success: false, error: 'Failed to delete spot' };
  }
}

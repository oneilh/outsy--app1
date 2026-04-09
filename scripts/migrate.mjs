import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log('🚀 Starting migration...');

  try {
    // 1. Migrate Spots
    const spotsData = JSON.parse(fs.readFileSync('./data/spots.json', 'utf8'));
    console.log(`📍 Migrating ${spotsData.length} spots...`);
    
    // Transform data to match snake_case schema
    const formattedSpots = spotsData.map(spot => ({
      id: spot.id,
      name: spot.name,
      slug: spot.slug,
      description: spot.description,
      area: spot.area,
      city: spot.city || 'Lagos',
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
      going_now_count: spot.goingNowCount,
      type: spot.type || 'spot',
      created_at: spot.createdAt || new Date().toISOString()
    }));

    const { error: spotsError } = await supabase.from('spots').upsert(formattedSpots);
    if (spotsError) throw spotsError;
    console.log('✅ Spots migrated successfully');

    // 2. Migrate Collections
    const collectionsData = JSON.parse(fs.readFileSync('./data/collections.json', 'utf8'));
    console.log(`📚 Migrating ${collectionsData.length} collections...`);
    
    const formattedCollections = collectionsData.map(col => ({
      id: col.id,
      name: col.name,
      slug: col.slug,
      description: col.description,
      cover_image: col.coverImage,
      type: col.type,
      spot_ids: col.spotIds,
      created_at: new Date().toISOString()
    }));

    const { error: collectionsError } = await supabase.from('collections').upsert(formattedCollections);
    if (collectionsError) throw collectionsError;
    console.log('✅ Collections migrated successfully');

    // 3. Migrate Picks (from picks.json if it exists)
    if (fs.existsSync('./data/picks.json')) {
      const picksData = JSON.parse(fs.readFileSync('./data/picks.json', 'utf8'));
      console.log(`⭐ Migrating ${picksData.length} picks...`);
      
      const formattedPicks = picksData.map(pick => ({
        id: pick.id,
        spot_id: pick.spotId,
        sort_order: pick.order,
        active: true,
        created_at: new Date().toISOString()
      }));

      const { error: picksError } = await supabase.from('picks').upsert(formattedPicks);
      if (picksError) throw picksError;
      console.log('✅ Picks migrated successfully');
    }

    console.log('🎉 Migration finished!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  }
}

migrate();

-- Outsy Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Create Spots Table
CREATE TABLE IF NOT EXISTS public.spots (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    area TEXT,
    city TEXT DEFAULT 'Lagos',
    category TEXT, -- cafe, eating, outdoors, activities, drinking, nightlife, hotel
    budget_tier TEXT, -- budget, mid, splurge
    price_range TEXT,
    vibe_tags TEXT[],
    who_its_for TEXT[],
    amenities TEXT[],
    best_time_to_go TEXT,
    images TEXT[],
    video_url TEXT,
    phone TEXT,
    instagram TEXT,
    website TEXT,
    maps_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    last_verified_date TIMESTAMPTZ,
    is_featured BOOLEAN DEFAULT false,
    is_outsy_pick BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    going_now_count INTEGER DEFAULT 0,
    type TEXT DEFAULT 'spot', -- spot, event
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. Create Collections Table
CREATE TABLE IF NOT EXISTS public.collections (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    cover_image TEXT,
    type TEXT, -- category, mood, who, curated
    spot_ids TEXT[], -- We can use a join table later, but keeping it simple for MVP match to JSON
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Outsy Picks Table (Ordering for featured picks)
CREATE TABLE IF NOT EXISTS public.picks (
    id TEXT PRIMARY KEY,
    spot_id TEXT REFERENCES public.spots(id),
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
-- For MVP, we'll allow public Read access
ALTER TABLE public.spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.picks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.spots FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.picks FOR SELECT USING (true);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_spots_slug ON public.spots(slug);
CREATE INDEX IF NOT EXISTS idx_spots_category ON public.spots(category);
CREATE INDEX IF NOT EXISTS idx_collections_slug ON public.collections(slug);

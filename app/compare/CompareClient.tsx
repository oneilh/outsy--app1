"use client";

import Image from "next/image";
import Link from "next/link";
import { RiMapPinLine, RiTimeLine, RiMoneyDollarCircleLine, RiLayoutGridLine, RiCheckLine, RiCloseLine, RiArrowRightLine } from "react-icons/ri";
import { useCompare } from "@/lib/context/CompareContext";
import { useState, useEffect } from "react";
import { getSpotsByIds } from "@/lib/data-client";
import type { Spot } from "@/lib/types";
import { PageContainer } from "@/components/layout/PageContainer";
import { VerificationBadge } from "@/components/spots/VerificationBadge";

const BUDGET_LABELS: Record<string, string> = {
  budget: "Budget-friendly",
  mid: "Mid-range",
  splurge: "Splurge",
};

const CATEGORY_LABELS: Record<string, string> = {
  eating: "Eat",
  drinking: "Drink",
  outdoors: "Outdoor",
  activities: "Activity",
  nightlife: "Club",
  cafe: "Café",
  hotel: "Hotel",
  event: "Event",
};

function ComparisonSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
          {label}
        </h3>
        <div className="h-px w-full bg-border/40" />
      </div>
      {children}
    </div>
  );
}

export default function ComparePage() {
  const { compareIds, clearCompare } = useCompare();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpots() {
      if (compareIds.length > 0) {
        const data = await getSpotsByIds(compareIds);
        setSpots(data);
      } else {
        setSpots([]);
      }
      setLoading(false);
    }
    fetchSpots();
  }, [compareIds]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (spots.length < 2) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-10 px-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
          <div className="relative flex items-center justify-center h-32 w-32 rounded-[2.5rem] bg-surface border border-border shadow-2xl rotate-12 group hover:rotate-0 transition-transform duration-500">
             <RiLayoutGridLine className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
          </div>
        </div>
        <div className="space-y-4 max-w-sm">
          <h2 className="text-3xl font-black text-foreground uppercase tracking-tight leading-none">The Shortlist is Empty</h2>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            Pick 2–3 spots you vibe with and we&apos;ll help you decide between them side-by-side in under 60 seconds.
          </p>
        </div>
        <Link
          href="/spots"
          className="group flex items-center gap-3 rounded-2xl bg-foreground px-10 py-5 text-sm font-black text-background hover:bg-primary transition-all shadow-2xl hover:scale-105 active:scale-95"
        >
          GO EXPLORE
          <RiArrowRightLine className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  const GRID_COLS = spots.length === 2 ? "grid-cols-2" : "grid-cols-3";

  return (
    <div className="min-h-screen bg-background pb-40">
      <PageContainer>
        {/* Premium Header */}
        <div className="pt-16 pb-20 lg:pt-24 lg:pb-32 flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 group cursor-default">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] lg:text-[11px] font-black text-primary uppercase tracking-[0.2em]">Live Comparison</span>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <h1 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tight leading-[0.9] drop-shadow-sm">
                The<br/>Shortlist
              </h1>
              
              <div className="flex flex-col gap-4 items-start lg:items-end">
                <p className="text-lg md:text-xl font-bold text-muted-foreground/60 italic lg:text-right max-w-xs leading-tight">
                  Analyzing {spots.length} curated Lagos experiences side-by-side.
                </p>
                <button
                  onClick={clearCompare}
                  className="flex items-center gap-3 rounded-2xl bg-muted/50 px-6 py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:bg-foreground hover:text-background transition-all shadow-lg active:scale-95"
                >
                  <RiCloseLine className="h-5 w-5" />
                  Reset Comparison
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="space-y-4">
          
          {/* Header Row: Images & Names (Sticky) */}
          <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/60 py-4 mb-12">
            <div className={`grid ${GRID_COLS} gap-4 md:gap-10`}>
              {spots.map((spot) => (
                <Link key={spot.id} href={`/spots/${spot.slug}`} className="group flex flex-col gap-4">
                  <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden border border-border/40 shadow-xl group-hover:border-primary/50 transition-all">
                    <Image
                      src={spot.images[0] || "https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?q=80&w=1000&auto=format&fit=crop"}
                      alt={spot.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="30vw"
                    />
                    <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
                  </div>
                  <div className="flex flex-col gap-1 px-1">
                    <h3 className="text-sm md:text-lg font-black text-foreground uppercase tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                      {spot.name}
                    </h3>
                    <div className="flex items-center gap-1.5 opacity-50">
                      <RiMapPinLine className="h-3 w-3" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{spot.area}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-24">
            {/* The Vibe Section */}
            <ComparisonSection label="The Vibe">
              <div className={`grid ${GRID_COLS} gap-4 md:gap-10`}>
                {spots.map((spot) => (
                  <div key={spot.id} className="flex flex-wrap gap-2">
                    {spot.vibeTags.slice(0, 4).map((tag) => (
                      <span key={tag} className="px-3 py-2 bg-muted/50 border border-border rounded-xl text-[10px] font-black text-foreground uppercase tracking-tight">
                        {tag}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </ComparisonSection>

            {/* The Deal Section */}
            <ComparisonSection label="The Deal">
              <div className={`grid ${GRID_COLS} gap-4 md:gap-10`}>
                {spots.map((spot) => (
                  <div key={spot.id} className="space-y-3">
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map((n) => (
                        <RiMoneyDollarCircleLine 
                          key={n} 
                          className={`h-6 w-6 ${n <= (spot.budgetTier === 'budget' ? 1 : spot.budgetTier === 'mid' ? 2 : 3) ? 'text-primary' : 'text-muted/20'}`} 
                        />
                      ))}
                    </div>
                    <div>
                      <p className="text-xl font-black text-foreground tracking-tight">{spot.priceRange}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1 tracking-widest">{BUDGET_LABELS[spot.budgetTier]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ComparisonSection>

            {/* Timing Section */}
            <ComparisonSection label="Best Timing">
              <div className={`grid ${GRID_COLS} gap-4 md:gap-10`}>
                {spots.map((spot) => (
                  <div key={spot.id} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0">
                      <RiTimeLine className="h-5 w-5 text-secondary" />
                    </div>
                    <p className="text-sm font-black text-foreground uppercase leading-tight">{spot.bestTimeToGo}</p>
                  </div>
                ))}
              </div>
            </ComparisonSection>

            {/* Perfect For Section */}
            <ComparisonSection label="Crowd / Dynamic">
              <div className={`grid ${GRID_COLS} gap-4 md:gap-10`}>
                {spots.map((spot) => (
                  <div key={spot.id} className="space-y-2">
                    {spot.whoItsFor.map((who) => (
                      <div key={who} className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center">
                          <RiCheckLine className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-[11px] font-bold text-foreground uppercase">{who}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </ComparisonSection>

            {/* Amenities Section */}
            <ComparisonSection label="Key Amenities">
              <div className={`grid ${GRID_COLS} gap-4 md:gap-10`}>
                {spots.map((spot) => (
                  <div key={spot.id} className="flex flex-wrap gap-2">
                    {spot.amenities.map((amenity) => (
                      <span key={amenity} className="px-3 py-1.5 rounded-xl border border-border text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">
                        {amenity.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </ComparisonSection>

            {/* Final Call */}
            <ComparisonSection label="Final Call">
              <div className={`grid ${GRID_COLS} gap-4 md:gap-10`}>
                {spots.map((spot) => (
                  <div key={spot.id} className="space-y-4">
                    <Link
                      href={`/spots/${spot.slug}`}
                      className="group flex items-center justify-center w-full h-16 rounded-3xl bg-foreground text-background text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95"
                    >
                      CHOOSE THIS SPOT
                    </Link>
                    <div className="flex justify-center">
                      <VerificationBadge spot={spot} />
                    </div>
                  </div>
                ))}
              </div>
            </ComparisonSection>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}



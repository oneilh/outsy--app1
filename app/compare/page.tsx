"use client";

import Image from "next/image";
import Link from "next/link";
import { RiMapPinLine, RiTimeLine, RiMoneyDollarCircleLine, RiLayoutGridLine, RiCheckLine, RiCloseLine } from "react-icons/ri";
import { useCompare } from "@/lib/context/CompareContext";
import { getSpotById } from "@/lib/data";
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
  const spots = compareIds.map((id) => getSpotById(id)).filter((s): s is Spot => !!s);

  if (spots.length < 2) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-8 px-4 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="relative flex items-center justify-center h-24 w-24 rounded-full bg-surface border border-border shadow-xl">
             <RiLayoutGridLine className="h-10 w-10 text-primary" />
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-black text-foreground tracking-tight">Your shortlist is empty</h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Pick 2–3 spots you vibe with and we&apos;ll help you decide between them side-by-side.
          </p>
        </div>
        <Link
          href="/collections"
          className="rounded-2xl bg-primary px-10 py-4 text-sm font-black text-white hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95"
        >
          Explore Lagos Spots
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <PageContainer>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 pb-12">
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2">The Shortlist</h1>
            <p className="text-muted-foreground text-sm font-medium">
              Comparing {spots.length} curated experiences in Lagos
            </p>
          </div>
          <button
            onClick={clearCompare}
            className="self-start md:self-auto flex items-center gap-2 rounded-2xl bg-muted/50 px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-95"
          >
            <RiCloseLine className="h-4 w-4" />
            Clear Shortlist
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="relative">
          {/* Main Table/Grid */}
          <div className="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] gap-4 md:gap-8">
            
            {/* Left Labels (Hidden on very small mobile if desired, or made narrow) */}
            <div className="space-y-24 mt-[280px] md:mt-[320px]">
              <div className="flex flex-col gap-[140px] md:gap-[160px]">
                {["The Vibe", "The Deal", "Timing", "Crowd", "Included"].map((label) => (
                  <span key={label} className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground vertical-text md:horizontal-text origin-left transform md:rotate-0 h-10">
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Spots Columns */}
            <div className={`grid gap-4 md:gap-8`} style={{ gridTemplateColumns: `repeat(${spots.length}, 1fr)` }}>
              {spots.map((spot) => (
                <div key={spot.id} className="space-y-12 min-w-0">
                  {/* Hero Header */}
                  <div className="space-y-4">
                    <Link href={`/spots/${spot.slug}`} className="block group">
                      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-2xl transition-all duration-500 group-hover:shadow-primary/10 group-hover:scale-[0.98]">
                        <Image
                          src={spot.images[0]}
                          alt={spot.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 45vw, 30vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        <div className="absolute top-3 left-3">
                           <span className="backdrop-blur-xl bg-white/10 border border-white/20 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                            {CATEGORY_LABELS[spot.category] ?? spot.category}
                          </span>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4">
                          <h2 className="text-white text-sm md:text-xl font-black leading-tight group-hover:text-primary transition-colors">
                            {spot.name}
                          </h2>
                        </div>
                      </div>
                    </Link>
                    <div className="flex items-center gap-1.5 text-muted-foreground px-1">
                      <RiMapPinLine className="h-3 w-3" />
                      <span className="text-[10px] md:text-xs font-bold truncate uppercase tracking-wider">{spot.area}</span>
                    </div>
                  </div>

                  {/* Vibes */}
                  <div className="h-[120px] md:h-[140px] overflow-hidden">
                    <div className="flex flex-wrap gap-1.5">
                      {spot.vibeTags.slice(0, 4).map((tag) => (
                        <span key={tag} className="px-2.5 py-1.5 bg-secondary/5 border border-secondary/10 text-secondary rounded-lg text-[10px] font-black uppercase tracking-tighter">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* The Deal (Price) */}
                  <div className="h-[120px] md:h-[140px]">
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-0.5">
                        {[1, 2, 3].map((n) => (
                          <RiMoneyDollarCircleLine 
                            key={n} 
                            className={`h-5 w-5 ${n <= (spot.budgetTier === 'budget' ? 1 : spot.budgetTier === 'mid' ? 2 : 3) ? 'text-primary' : 'text-muted/30'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-[11px] font-black text-foreground mt-2">{spot.priceRange}</p>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">{BUDGET_LABELS[spot.budgetTier]}</p>
                    </div>
                  </div>

                  {/* Timing */}
                  <div className="h-[120px] md:h-[140px]">
                    <div className="flex items-start gap-2">
                      <div className="h-8 w-8 rounded-xl bg-accent/5 border border-accent/10 flex items-center justify-center flex-shrink-0">
                        <RiTimeLine className="h-4 w-4 text-accent" />
                      </div>
                      <p className="text-[11px] font-black text-foreground pt-1">{spot.bestTimeToGo}</p>
                    </div>
                  </div>

                  {/* Perfect For */}
                  <div className="h-[120px] md:h-[140px]">
                    <div className="flex flex-col gap-1.5">
                      {spot.whoItsFor.slice(0, 2).map((who) => (
                        <div key={who} className="flex items-center gap-2">
                          <RiCheckLine className="h-3.5 w-3.5 text-green-500" />
                          <span className="text-[10px] font-bold text-foreground">{who}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="h-[120px] md:h-[140px]">
                    <div className="flex flex-wrap gap-3">
                      {spot.amenities.slice(0, 4).map((amenity) => (
                        <div key={amenity} className="h-5 w-5 rounded-md bg-muted flex items-center justify-center" title={amenity}>
                           <RiCheckLine className="h-3 w-3 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Final Action */}
                  <div className="pt-4">
                    <Link
                      href={`/spots/${spot.slug}`}
                      className="flex items-center justify-center w-full h-12 rounded-2xl bg-foreground text-background text-[11px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/5 active:scale-95"
                    >
                      View Details
                    </Link>
                  </div>

                  <VerificationBadge spot={spot} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}


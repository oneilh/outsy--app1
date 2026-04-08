"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { RiArrowRightLine, RiFlashlightLine, RiMapPinLine, RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import type { Spot } from "@/lib/types";

interface TrendingSectionProps {
  spots: Spot[];
}

const TRENDING_REASONS: Record<string, string[]> = {
  eating: [
    "Most requested for dinner tonight", 
    "Highly rated for Friday vibes",
    "Top choice for group dining",
    "Trending for Lagos foodies"
  ],
  drinking: [
    "Perfect for post-work drinks",
    "Best cocktail selection this week",
    "Lively bar scene right now",
    "Highly saved for happy hour"
  ],
  nightlife: [
    "The place to be this weekend",
    "Top rated for late night dancing",
    "Where the vibe is at tonight",
    "Lagos nightlife staple"
  ],
  cafe: [
    "Best for a quiet coffee break",
    "Top rated for weekend brunch",
    "Most saved for remote work",
    "Trending for cafe lovers"
  ],
  outdoors: [
    "Highest rated outdoor escape",
    "Perfect for sunset views",
    "Top choice for fresh air",
    "Trending for city explorers"
  ],
  activities: [
    "Most popular group activity",
    "Highly requested for weekend fun",
    "Best way to spend your Saturday",
    "Trending for adventure seekers"
  ],
  hotel: [
    "Top choice for a staycation",
    "Highly rated boutique experience",
    "Most saved for romantic getaways",
    "Luxury redefined this week"
  ],
};

function getTrendingReason(spot: Spot): string {
  if (spot.isOutsyPick) return "Official Outsy Pick";
  if (spot.isNew) return "New & already making noise";
  
  const reasons = TRENDING_REASONS[spot.category] || ["A crowd favourite"];
  // Deterministic pick based on ID length or similar to keep it stable
  return reasons[spot.id.length % reasons.length];
}

const BUDGET_DOT: Record<string, string> = {
  budget: "bg-green-400",
  mid: "bg-accent",
  splurge: "bg-primary",
};

export function TrendingSection({ spots }: TrendingSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleCount = isExpanded ? 15 : 5;
  const visible = spots.slice(0, visibleCount);

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <RiFlashlightLine className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-bold text-foreground">Trending in Lagos</h2>
        </div>
        {spots.length > 5 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
          >
            {isExpanded ? (
              <>
                Collapse <RiArrowUpSLine className="h-4 w-4" />
              </>
            ) : (
              <>
                See all <RiArrowDownSLine className="h-4 w-4" />
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {visible.map((spot, idx) => (
          <Link
            key={spot.id}
            href={`/spots/${spot.slug}`}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3 hover:border-primary/40 hover:shadow-md transition-all group"
          >
            {/* Rank */}
            <span className="shrink-0 w-6 text-center text-sm font-black text-muted-foreground/30 group-hover:text-primary/40 transition-colors">
              {idx + 1}
            </span>

            {/* Image */}
            <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden border border-border/50">
              <Image
                src={spot.images[0]}
                alt={spot.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="64px"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-[15px] text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {spot.name}
                </h3>
              </div>
              
              <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
                <RiMapPinLine className="h-3 w-3 shrink-0" />
                <span className="text-xs font-medium">{spot.area}</span>
                <span className="mx-0.5 text-muted-foreground/30">·</span>
                <span
                  className={`h-1.5 w-1.5 rounded-full shrink-0 ${BUDGET_DOT[spot.budgetTier] ?? "bg-muted"}`}
                />
                <span className="text-xs font-medium">{spot.priceRange.split(' - ')[0]}</span>
              </div>

              {/* Trending reason pill */}
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 rounded-lg bg-accent/5 border border-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent uppercase tracking-tight">
                  {getTrendingReason(spot)}
                </span>
              </div>
            </div>

            <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
              <RiArrowRightLine className="h-5 w-5 text-primary" />
            </div>
          </Link>
        ))}
      </div>
      
      {!isExpanded && spots.length > 5 && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full mt-4 py-3 rounded-xl border border-dashed border-border text-muted-foreground text-xs font-semibold hover:border-primary/40 hover:text-primary transition-all uppercase tracking-widest"
        >
          View {spots.length - 5} more trending spots
        </button>
      )}
    </section>
  );
}

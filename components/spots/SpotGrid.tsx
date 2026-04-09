"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  RiMapPinLine, 
  RiGroupLine, 
  RiAddLine, 
  RiCheckLine, 
  RiTimerFlashLine, 
  RiStarFill,
  RiHeartFill,
  RiFlashlightLine
} from "react-icons/ri";
import type { Spot } from "@/lib/types";
import { useCompare } from "@/lib/context/CompareContext";

const CATEGORY_LABELS: Record<string, string> = {
  eating: "Eating",
  drinking: "Drinking",
  outdoors: "Outdoors",
  activities: "Activities",
  nightlife: "Nightlife",
  cafe: "Café",
  hotel: "Hotel",
  event: "Event",
};

const BUDGET_SYMBOLS: Record<string, string> = {
  budget: "₦",
  mid: "₦₦",
  splurge: "₦₦₦",
};

interface SpotGridProps {
  spots: Spot[];
}

export function SpotGrid({ spots }: SpotGridProps) {
  const { isInCompare, toggleCompare, maxReached } = useCompare();

  if (!spots.length) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {spots.map((spot) => {
        const inCompare = isInCompare(spot.id);
        return (
          <div key={spot.id} className="group relative">
            <Link
              href={`/spots/${spot.slug}`}
              className="block group"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-3">
                <Image
                  src={spot.images[0]}
                  alt={spot.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black uppercase bg-black/60 text-white backdrop-blur-md border border-white/10 shadow-sm">
                    {CATEGORY_LABELS[spot.category] ?? spot.category}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    {spot.special ? (
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase bg-primary text-white shadow-lg">
                        <RiFlashlightLine className="h-2.5 w-2.5" />
                        {spot.special.label}
                      </span>
                    ) : spot.isFeatured ? (
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase bg-accent text-accent-foreground shadow-sm">
                        <RiStarFill className="h-2.5 w-2.5" />
                        Spotlight
                      </span>
                    ) : spot.isNew ? (
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase bg-green-500 text-white shadow-sm">
                        <RiTimerFlashLine className="h-2.5 w-2.5" />
                        New
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Outsy Pick Indicator */}
                {spot.isOutsyPick && (
                  <div className="absolute bottom-3 left-3 z-10">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-lg">
                      <RiHeartFill className="h-2.5 w-2.5 text-primary" />
                      <span className="text-[10px] font-black uppercase text-primary tracking-tighter">Pick</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="px-1">
                <h3 className="font-bold text-sm md:text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-300">
                  {spot.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
                  <RiMapPinLine className="h-3 w-3 flex-shrink-0" />
                  <span className="text-xs truncate">{spot.area}</span>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="text-[10px] font-bold text-foreground/60">{BUDGET_SYMBOLS[spot.budgetTier] ?? "₦"}</span>
                </div>
              </div>
            </Link>

            {/* Compare toggle - Styled more premium */}
            <button
              onClick={() => toggleCompare(spot.id)}
              disabled={!inCompare && maxReached}
              className={`absolute top-3 right-3 flex items-center justify-center h-8 w-8 rounded-full backdrop-blur-md border transition-all duration-300 z-20
                ${inCompare
                  ? "bg-primary border-primary text-white scale-110 shadow-lg"
                  : "bg-black/30 border-white/20 text-white opacity-0 group-hover:opacity-100 hover:bg-black/50 disabled:opacity-30 disabled:cursor-not-allowed"
                }`}
              aria-label={inCompare ? "Remove from compare" : "Add to compare"}
            >
              {inCompare ? (
                <RiCheckLine className="h-4 w-4" />
              ) : (
                <RiAddLine className="h-4 w-4" />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

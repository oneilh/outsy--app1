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

const BUDGET_LABELS: Record<string, string> = {
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {spots.map((spot) => {
        const inCompare = isInCompare(spot.id);
        return (
          <div key={spot.id} className="group relative">
            <Link
              href={`/spots/${spot.slug}`}
              className="block rounded-2xl overflow-hidden bg-card border border-border hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={spot.images[0]}
                  alt={spot.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Badges Overlay */}
                <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black uppercase bg-black/60 text-white backdrop-blur-sm">
                    {CATEGORY_LABELS[spot.category] ?? spot.category}
                  </span>
                  
                  {/* Status Badges - Prioritize Special > Spotlight > New to avoid label spam */}
                  {spot.special ? (
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase bg-primary text-white shadow-sm">
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

                {/* Indicators Overlay */}
                <div className="absolute bottom-2 left-2 flex gap-1">
                  {spot.isOutsyPick && (
                    <div className="flex items-center justify-center bg-primary text-white p-1 rounded-full shadow-lg" title="Outsy Pick">
                      <RiHeartFill className="h-3 w-3" />
                    </div>
                  )}
                </div>

                {/* Going now */}
                {spot.goingNowCount > 0 && (
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5">
                    <RiGroupLine className="h-3 w-3 text-white" />
                    <span className="text-[10px] font-bold text-white">{spot.goingNowCount}</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {spot.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-muted-foreground">
                  <RiMapPinLine className="h-3 w-3 flex-shrink-0" />
                  <span className="text-xs truncate">{spot.area}</span>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="text-xs font-bold text-foreground/60">{BUDGET_LABELS[spot.budgetTier] ?? ""}</span>
                </div>
              </div>
            </Link>

            {/* Compare toggle */}
            <button
              onClick={() => toggleCompare(spot.id)}
              disabled={!inCompare && maxReached}
              className={`absolute top-2 right-2 flex items-center justify-center h-7 w-7 rounded-full backdrop-blur-sm transition-all
                ${inCompare
                  ? "bg-primary text-white opacity-100"
                  : "bg-black/40 text-white opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
                }`}
              aria-label={inCompare ? "Remove from compare" : "Add to compare"}
            >
              {inCompare ? (
                <RiCheckLine className="h-3.5 w-3.5" />
              ) : (
                <RiAddLine className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { RiMapPinLine, RiGroupLine, RiAddLine, RiCheckLine } from "react-icons/ri";
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {/* Category chip */}
                <span className="absolute top-2 left-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-black/50 text-white backdrop-blur-sm">
                  {CATEGORY_LABELS[spot.category] ?? spot.category}
                </span>

                {/* Going now */}
                {spot.goingNowCount > 0 && (
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-primary/90 rounded-full px-2 py-0.5">
                    <RiGroupLine className="h-3 w-3 text-white" />
                    <span className="text-[10px] font-bold text-white">{spot.goingNowCount}</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {spot.name}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1 text-muted-foreground min-w-0">
                    <RiMapPinLine className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs truncate">{spot.area}</span>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground flex-shrink-0 ml-2">
                    {BUDGET_LABELS[spot.budgetTier] ?? ""}
                  </span>
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

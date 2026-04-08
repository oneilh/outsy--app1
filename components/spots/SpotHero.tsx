"use client";

import Image from "next/image";
import Link from "next/link";
import {
  RiArrowLeftLine,
  RiBookmarkLine,
  RiBookmarkFill,
  RiGroupLine,
} from "react-icons/ri";
import type { Spot } from "@/lib/types";
import { useSavedSpots } from "@/lib/hooks/useSavedSpots";

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

interface SpotHeroProps {
  spot: Spot;
}

export function SpotHero({ spot }: SpotHeroProps) {
  const { isSaved, toggleSave } = useSavedSpots();

  return (
    <div className="relative w-full h-[55vw] min-h-[260px] max-h-[480px]">
      <Image
        src={spot.images[0]}
        alt={spot.name}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

      {/* Top controls */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-safe">
        <Link
          href="/"
          className="flex items-center justify-center h-9 w-9 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
          aria-label="Go back"
        >
          <RiArrowLeftLine className="h-5 w-5" />
        </Link>

        <button
          onClick={() => toggleSave(spot.id)}
          className="flex items-center justify-center h-9 w-9 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
          aria-label={isSaved(spot.id) ? "Remove from saved" : "Save spot"}
        >
          {isSaved(spot.id) ? (
            <RiBookmarkFill className="h-5 w-5 text-accent" />
          ) : (
            <RiBookmarkLine className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Bottom info overlay */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-primary text-white">
            {CATEGORY_LABELS[spot.category] ?? spot.category}
          </span>
          {spot.isNew && (
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-accent text-secondary">
              New
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-1">
          {spot.name}
        </h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-white/80 font-medium">
            {spot.area} · {BUDGET_SYMBOLS[spot.budgetTier]}
          </span>
          {spot.goingNowCount > 0 && (
            <span className="inline-flex items-center gap-1 text-sm text-white/80">
              <RiGroupLine className="h-4 w-4" />
              {spot.goingNowCount} going now
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

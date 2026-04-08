"use client";

import Image from "next/image";
import Link from "next/link";
import { RiMapPinLine, RiGroupLine, RiBookmarkLine, RiBookmarkFill } from "react-icons/ri";
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

interface SpotCardProps {
  spot: Spot;
}

export function SpotCard({ spot }: SpotCardProps) {
  const { isSaved, toggleSave } = useSavedSpots();

  return (
    <Link
      href={`/spots/${spot.slug}`}
      className="block flex-shrink-0 w-44 md:w-52 group"
    >
      <div className="relative h-36 md:h-40 rounded-xl overflow-hidden mb-2">
        <Image
          src={spot.images[0]}
          alt={spot.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 176px, 208px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Category chip */}
        <div className="absolute top-2 left-2">
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-black/50 text-white backdrop-blur-sm">
            {CATEGORY_LABELS[spot.category] ?? spot.category}
          </span>
        </div>

        {/* Save button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleSave(spot.id);
          }}
          className="absolute top-2 right-2 flex items-center justify-center h-7 w-7 rounded-full bg-black/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={isSaved(spot.id) ? "Remove from saved" : "Save spot"}
        >
          {isSaved(spot.id) ? (
            <RiBookmarkFill className="h-3.5 w-3.5 text-accent" />
          ) : (
            <RiBookmarkLine className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Going now count */}
        {spot.goingNowCount > 0 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-primary/90 rounded-full px-2 py-0.5">
            <RiGroupLine className="h-3 w-3 text-white" />
            <span className="text-[10px] font-bold text-white">{spot.goingNowCount}</span>
          </div>
        )}
      </div>

      <div className="px-0.5">
        <h3 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {spot.name}
        </h3>
        <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
          <RiMapPinLine className="h-3 w-3 flex-shrink-0" />
          <span className="text-xs line-clamp-1">{spot.area}</span>
        </div>
      </div>
    </Link>
  );
}

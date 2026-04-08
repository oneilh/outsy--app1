"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { RiCloseLine, RiArrowRightLine } from "react-icons/ri";
import { useCompare } from "@/lib/context/CompareContext";
import { getSpotById } from "@/lib/data";

export function CompareBar() {
  const { compareIds, toggleCompare, clearCompare } = useCompare();
  const router = useRouter();

  if (compareIds.length === 0) return null;

  const spots = compareIds.map((id) => getSpotById(id)).filter(Boolean);

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 pointer-events-none">
      <div className="max-w-2xl mx-auto px-4 pb-3 pointer-events-auto">
        <div className="flex items-center gap-3 rounded-2xl bg-secondary text-secondary-foreground px-4 py-3 shadow-xl">
          {/* Spot thumbnails */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {spots.map((spot) =>
              spot ? (
                <div key={spot.id} className="relative flex-shrink-0 group/thumb">
                  <div className="relative h-10 w-10 rounded-xl overflow-hidden ring-2 ring-white/20">
                    <Image
                      src={spot.images[0]}
                      alt={spot.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <button
                    onClick={() => toggleCompare(spot.id)}
                    className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors opacity-0 group-hover/thumb:opacity-100"
                    aria-label={`Remove ${spot.name}`}
                  >
                    <RiCloseLine className="h-2.5 w-2.5" />
                  </button>
                </div>
              ) : null
            )}

            {/* Empty slot placeholders */}
            {Array.from({ length: 3 - spots.length }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-10 rounded-xl border-2 border-dashed border-white/20 flex-shrink-0"
              />
            ))}

            <div className="min-w-0 ml-1">
              <p className="text-sm font-semibold truncate">
                {spots.length === 1 ? "Pick 1 more to compare" : `${spots.length} spots selected`}
              </p>
              <button
                onClick={clearCompare}
                className="text-xs text-white/60 hover:text-white/90 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => router.push("/compare")}
            disabled={spots.length < 2}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            Compare
            <RiArrowRightLine className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { RiCloseLine, RiArrowRightLine } from "react-icons/ri";
import { useCompare } from "@/lib/context/CompareContext";
import { getSpotById } from "@/lib/data";

export function CompareBar() {
  const { compareIds, toggleCompare, clearCompare } = useCompare();
  const router = useRouter();

  const pathname = usePathname();
  const isDetailPage = pathname.startsWith("/spots/");

  if (compareIds.length === 0) return null;

  const spots = compareIds.map((id) => getSpotById(id)).filter(Boolean);

  return (
    <div className={`fixed ${isDetailPage ? "bottom-[112px] md:bottom-24" : "bottom-20 md:bottom-6"} left-0 right-0 z-40 pointer-events-none transition-all duration-300`}>
      <div className="max-w-2xl mx-auto px-4 pointer-events-auto">
        <div className="flex items-center gap-4 rounded-2xl bg-black/80 backdrop-blur-xl text-white px-5 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
          {/* Spot thumbnails */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex -space-x-3">
              {spots.map((spot) =>
                spot ? (
                  <div key={spot.id} className="relative flex-shrink-0 group/thumb">
                    <div className="relative h-11 w-11 rounded-xl overflow-hidden ring-2 ring-black bg-muted">
                      <Image
                        src={spot.images[0]}
                        alt={spot.name}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    </div>
                    <button
                      onClick={() => toggleCompare(spot.id)}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center shadow-lg transform scale-0 group-hover/thumb:scale-100 transition-transform duration-200"
                      aria-label={`Remove ${spot.name}`}
                    >
                      <RiCloseLine className="h-3 w-3" />
                    </button>
                  </div>
                ) : null
              )}

              {/* Empty slot placeholders */}
              {Array.from({ length: 3 - spots.length }).map((_, i) => (
                <div
                  key={i}
                  className="h-11 w-11 rounded-xl border-2 border-dashed border-white/10 flex-shrink-0 bg-white/5"
                />
              ))}
            </div>

            <div className="min-w-0 flex flex-col items-start ml-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/50 leading-none mb-1">
                Comparing
              </span>
              <p className="text-sm font-bold truncate leading-none">
                {spots.length === 1 ? "Pick 1 more" : `${spots.length} spots selected`}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => router.push("/compare")}
              disabled={spots.length < 2}
              className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-white transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed flex-shrink-0"
            >
              Compare
              <RiArrowRightLine className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

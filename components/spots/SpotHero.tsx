"use client";

import Image from "next/image";
import Link from "next/link";
import {
  RiArrowLeftLine,
  RiBookmarkLine,
  RiBookmarkFill,
  RiPlayFill,
  RiShareLine,
  RiCheckLine,
} from "react-icons/ri";
import { useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
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

function ShareSpotButton({ spot }: { spot: Spot }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const shareData = {
      title: `${spot.name} — Outsy`,
      text: `Check out ${spot.name} on Outsy!`,
      url: url,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.error(err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center h-12 w-12 rounded-2xl bg-black/30 backdrop-blur-xl text-white hover:bg-black/50 transition-all shadow-xl border border-white/20 active:scale-90 relative"
      aria-label="Share spot"
    >
      {copied ? (
        <RiCheckLine className="h-6 w-6 text-green-400" />
      ) : (
        <RiShareLine className="h-6 w-6" />
      )}
    </button>
  );
}

export function SpotHero({ spot }: SpotHeroProps) {
  const { isSaved, toggleSave } = useSavedSpots();

  return (
    <div className="relative w-full h-[65vw] min-h-[300px] max-h-[520px] bg-muted">
      <Splide
        options={{
          type: "loop",
          perPage: 1,
          arrows: false,
          pagination: true,
          gap: "0rem",
          speed: 800,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="h-full splide-custom"
      >
        {spot.images.map((img, index) => (
          <SplideSlide key={index} className="h-full">
            <div className="relative w-full h-full">
              <Image
                src={img}
                alt={`${spot.name} - ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
              />
              {index === 0 && spot.videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/20 backdrop-blur-[2px] rounded-full p-4 border border-white/30 animate-pulse cursor-pointer">
                    <RiPlayFill className="h-8 w-8 text-white" />
                  </div>
                </div>
              )}
            </div>
          </SplideSlide>
        ))}
      </Splide>

      {/* Image Counter */}
      <div className="absolute bottom-6 right-5 z-20 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
        {spot.images.length} Photos
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

      {/* Top controls */}
      <div className="absolute top-0 left-0 right-0 z-40 px-6 pt-10">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center justify-center h-12 w-12 rounded-2xl bg-black/30 backdrop-blur-xl text-white hover:bg-black/50 transition-all shadow-xl border border-white/20 active:scale-90"
            aria-label="Go back"
          >
            <RiArrowLeftLine className="h-6 w-6" />
          </Link>

          <div className="flex items-center gap-2">
            <ShareSpotButton spot={spot} />
            <button
              onClick={() => toggleSave(spot.id)}
              className="flex items-center justify-center h-12 w-12 rounded-2xl bg-black/30 backdrop-blur-xl text-white hover:bg-black/50 transition-all shadow-xl border border-white/20 active:scale-90"
              aria-label={isSaved(spot.id) ? "Remove from saved" : "Save spot"}
            >
              {isSaved(spot.id) ? (
                <RiBookmarkFill className="h-6 w-6 text-accent" />
              ) : (
                <RiBookmarkLine className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom info overlay */}
      <div className="absolute bottom-0 left-0 right-0 pb-10 z-20 pointer-events-none">
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-4 pointer-events-auto">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold bg-primary text-white uppercase tracking-widest border border-white/10 shadow-sm">
              {CATEGORY_LABELS[spot.category] ?? spot.category}
            </span>
            {spot.isNew && (
              <span className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold bg-accent text-secondary uppercase tracking-widest border border-white/10 shadow-sm">
                New
              </span>
            )}
            {spot.isOutsyPick && (
              <span className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold bg-white text-black uppercase tracking-widest border border-white/10 shadow-sm">
                Outsy Pick
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-[1.1] mb-3 drop-shadow-2xl">
            {spot.name}
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-xs text-white/90 font-bold flex items-center gap-2 uppercase tracking-[0.1em]">
              <span className="opacity-90">{spot.area}</span>
              <span className="h-1 w-1 rounded-full bg-accent/60" />
              <span className="text-accent bg-black/40 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded text-[10px] font-black">{BUDGET_SYMBOLS[spot.budgetTier]}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { RiMapPinLine, RiTimeLine, RiMoneyDollarCircleLine, RiArrowLeftLine, RiCheckLine, RiCloseLine } from "react-icons/ri";
import { useCompare } from "@/lib/context/CompareContext";
import { getSpotById } from "@/lib/data";
import type { Spot } from "@/lib/types";

const BUDGET_SYMBOLS: Record<string, string> = {
  budget: "₦",
  mid: "₦₦",
  splurge: "₦₦₦",
};

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

function SpotColumn({ spot }: { spot: Spot }) {
  return (
    <div className="flex flex-col min-w-0">
      {/* Image */}
      <Link href={`/spots/${spot.slug}`} className="block group">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl mb-3 shadow-sm group-hover:shadow-lg transition-shadow duration-300">
          <Image
            src={spot.images[0]}
            alt={spot.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
          
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[8px] font-black uppercase bg-black/60 text-white backdrop-blur-md border border-white/10 shadow-sm">
              {CATEGORY_LABELS[spot.category] ?? spot.category}
            </span>
          </div>
        </div>
        <h2 className="font-bold text-sm md:text-base text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {spot.name}
        </h2>
      </Link>
      <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
        <RiMapPinLine className="h-3 w-3 flex-shrink-0" />
        <span className="text-[10px] md:text-xs truncate">{spot.area}</span>
      </div>
    </div>
  );
}

export default function ComparePage() {
  const { compareIds, clearCompare } = useCompare();
  const spots = compareIds.map((id) => getSpotById(id)).filter((s): s is Spot => !!s);

  if (spots.length < 2) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="flex items-center justify-center h-20 w-20 rounded-full bg-muted shadow-inner">
          <RiArrowLeftLine className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Nothing to compare yet</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
            Select 2–3 spots using the + button on any collection or saved page to see them side by side.
          </p>
        </div>
        <Link
          href="/collections"
          className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-white hover:bg-primary/90 transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          Browse Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 lg:px-8 pt-8 pb-6 flex items-end justify-between border-b border-border/40">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Compare</h1>
          <p className="text-muted-foreground text-sm mt-1 uppercase font-bold tracking-widest text-[10px]">
            {spots.length} spots side by side
          </p>
        </div>
        <button
          onClick={clearCompare}
          className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all active:scale-95"
        >
          <RiCloseLine className="h-4 w-4" />
          CLEAR ALL
        </button>
      </div>

      <div className="px-4 lg:px-8 pb-16">
        {/* Spot headers */}
        <div
          className="grid gap-6 md:gap-8 mb-8 mt-6"
          style={{ gridTemplateColumns: `5rem repeat(${spots.length}, 1fr)` }}
        >
          <div /> {/* label column spacer */}
          {spots.map((spot) => (
            <SpotColumn key={spot.id} spot={spot} />
          ))}
        </div>

        {/* Comparison rows */}
        {[
          {
            label: "Price",
            render: (s: Spot) => (
              <div>
                <span className="text-xs font-black text-foreground tracking-wide bg-muted px-2 py-0.5 rounded-md">
                   {BUDGET_SYMBOLS[s.budgetTier]}
                </span>
                <p className="text-[10px] text-muted-foreground mt-1 font-medium">{s.priceRange}</p>
              </div>
            ),
          },
          {
            label: "Best Time",
            render: (s: Spot) => (
              <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <RiTimeLine className="h-3.5 w-3.5 text-primary" />
                {s.bestTimeToGo}
              </div>
            ),
          },
          {
            label: "Vibes",
            render: (s: Spot) => (
              <div className="flex flex-wrap gap-1">
                {s.vibeTags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-block rounded-md bg-secondary/10 px-1.5 py-0.5 text-[9px] font-bold text-secondary uppercase tracking-tighter"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ),
          },
          {
            label: "Perfect For",
            render: (s: Spot) => (
              <div className="flex flex-wrap gap-1">
                {s.whoItsFor.length > 0
                  ? s.whoItsFor.slice(0, 2).map((w) => (
                      <span
                        key={w}
                        className="inline-block rounded-md bg-accent/10 px-1.5 py-0.5 text-[9px] font-bold text-accent uppercase tracking-tighter"
                      >
                        {w}
                      </span>
                    ))
                  : <span className="text-[10px] text-muted-foreground/40 font-black">—</span>}
              </div>
            ),
          },
          {
            label: "Amenities",
            render: (s: Spot) => (
              <div className="flex flex-wrap gap-1">
                {s.amenities.slice(0, 3).map((a) => (
                  <div key={a} className="h-1.5 w-1.5 rounded-full bg-green-500/50" title={a} />
                ))}
              </div>
            ),
          },
        ].map(({ label, render }) => (
          <div
            key={label}
            className="grid gap-6 md:gap-8 border-t border-border/40"
            style={{ gridTemplateColumns: `5rem repeat(${spots.length}, 1fr)` }}
          >
            <span className="py-5 pr-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-tight self-start">
              {label}
            </span>
            {spots.map((spot) => (
              <div key={spot.id} className="py-5">
                {render(spot)}
              </div>
            ))}
          </div>
        ))}

        {/* View spot CTAs */}
        <div
          className="grid gap-6 md:gap-8 mt-10"
          style={{ gridTemplateColumns: `5rem repeat(${spots.length}, 1fr)` }}
        >
          <div />
          {spots.map((spot) => (
            <Link
              key={spot.id}
              href={`/spots/${spot.slug}`}
              className="block rounded-full bg-foreground text-background px-3 py-3 text-center text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
            >
              Go to Spot
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

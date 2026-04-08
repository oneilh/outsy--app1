"use client";

import Image from "next/image";
import Link from "next/link";
import { RiMapPinLine, RiTimeLine, RiMoneyDollarCircleLine, RiArrowLeftLine, RiCheckLine, RiCloseLine } from "react-icons/ri";
import { useCompare } from "@/lib/context/CompareContext";
import { getSpotById } from "@/lib/data";
import type { Spot } from "@/lib/types";

const BUDGET_LABELS: Record<string, string> = {
  budget: "Budget-friendly",
  mid: "Mid-range",
  splurge: "Splurge",
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

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-px" style={{ gridTemplateColumns: "7rem 1fr" }}>
      <span className="py-3 pr-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide leading-tight self-start pt-3.5">
        {label}
      </span>
      <div className="py-3 border-t border-border">{children}</div>
    </div>
  );
}

function SpotColumn({ spot }: { spot: Spot }) {
  return (
    <div className="flex flex-col min-w-0">
      {/* Image */}
      <Link href={`/spots/${spot.slug}`} className="block">
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl mb-3">
          <Image
            src={spot.images[0]}
            alt={spot.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
        <h2 className="font-bold text-base text-foreground line-clamp-2 hover:text-primary transition-colors">
          {spot.name}
        </h2>
      </Link>
      <p className="text-xs text-muted-foreground mt-0.5 mb-3">{CATEGORY_LABELS[spot.category] ?? spot.category}</p>
    </div>
  );
}

export default function ComparePage() {
  const { compareIds, clearCompare } = useCompare();
  const spots = compareIds.map((id) => getSpotById(id)).filter((s): s is Spot => !!s);

  if (spots.length < 2) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-muted">
          <RiArrowLeftLine className="h-7 w-7 text-muted-foreground" />
        </div>
        <div>
          <p className="font-semibold text-foreground">Nothing to compare yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Select 2–3 spots using the + button on any collection or saved page.
          </p>
        </div>
        <Link
          href="/collections"
          className="mt-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          Browse Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 lg:px-8 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compare</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {spots.length} spots side by side
          </p>
        </div>
        <button
          onClick={clearCompare}
          className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          <RiCloseLine className="h-4 w-4" />
          Clear
        </button>
      </div>

      <div className="px-4 lg:px-8 pb-16">
        {/* Spot headers */}
        <div
          className="grid gap-4 mb-2"
          style={{ gridTemplateColumns: `7rem repeat(${spots.length}, 1fr)` }}
        >
          <div /> {/* label column spacer */}
          {spots.map((spot) => (
            <SpotColumn key={spot.id} spot={spot} />
          ))}
        </div>

        {/* Comparison rows */}
        {[
          {
            label: "Area",
            render: (s: Spot) => (
              <div className="flex items-center gap-1 text-sm text-foreground">
                <RiMapPinLine className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                {s.area}, {s.city}
              </div>
            ),
          },
          {
            label: "Price",
            render: (s: Spot) => (
              <div>
                <p className="text-sm font-semibold text-foreground">{s.priceRange}</p>
                <p className="text-xs text-muted-foreground">{BUDGET_LABELS[s.budgetTier]}</p>
              </div>
            ),
          },
          {
            label: "Best Time",
            render: (s: Spot) => (
              <div className="flex items-center gap-1 text-sm text-foreground">
                <RiTimeLine className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                {s.bestTimeToGo}
              </div>
            ),
          },
          {
            label: "Vibes",
            render: (s: Spot) => (
              <div className="flex flex-wrap gap-1">
                {s.vibeTags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground capitalize"
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
                  ? s.whoItsFor.map((w) => (
                      <span
                        key={w}
                        className="inline-block rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-medium text-secondary capitalize"
                      >
                        {w}
                      </span>
                    ))
                  : <span className="text-xs text-muted-foreground">—</span>}
              </div>
            ),
          },
          {
            label: "Verified",
            render: (s: Spot) =>
              s.isVerified ? (
                <RiCheckLine className="h-5 w-5 text-green-500" />
              ) : (
                <RiCloseLine className="h-5 w-5 text-muted-foreground" />
              ),
          },
          {
            label: "Budget",
            render: (s: Spot) => (
              <div className="flex items-center gap-1 text-sm">
                <RiMoneyDollarCircleLine className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{s.priceRange}</span>
              </div>
            ),
          },
        ].map(({ label, render }) => (
          <div
            key={label}
            className="grid gap-4 border-t border-border"
            style={{ gridTemplateColumns: `7rem repeat(${spots.length}, 1fr)` }}
          >
            <span className="py-3 pr-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide self-start pt-3.5">
              {label}
            </span>
            {spots.map((spot) => (
              <div key={spot.id} className="py-3">
                {render(spot)}
              </div>
            ))}
          </div>
        ))}

        {/* View spot CTAs */}
        <div
          className="grid gap-4 mt-6"
          style={{ gridTemplateColumns: `7rem repeat(${spots.length}, 1fr)` }}
        >
          <div />
          {spots.map((spot) => (
            <Link
              key={spot.id}
              href={`/spots/${spot.slug}`}
              className="block rounded-xl bg-primary px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              View Spot
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

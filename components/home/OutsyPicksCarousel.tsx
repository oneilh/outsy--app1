"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Image from "next/image";
import Link from "next/link";
import { RiMapPinLine, RiFireLine, RiTimerFlashLine, RiStarFill, RiFlashlightLine } from "react-icons/ri";
import posthog from "posthog-js";
import type { Spot } from "@/lib/types";

interface OutsyPicksCarouselProps {
  picks: Spot[];
}

const BUDGET_SYMBOLS: Record<string, string> = {
  budget: "₦",
  mid: "₦₦",
  splurge: "₦₦₦",
};

export function OutsyPicksCarousel({ picks }: OutsyPicksCarouselProps) {
  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <RiFireLine className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Outsy Picks</h2>
        </div>
        <span className="text-xs text-muted-foreground font-medium">This week</span>
      </div>

      <Splide
        options={{
          classes: {
            pagination: "splide__pagination !bottom-3",
            page: "splide__pagination__page !bg-white/60",
          },
          type: "loop",
          perPage: 1,
          perMove: 1,
          gap: "1rem",
          padding: { right: "2.5rem" },
          arrows: false,
          pagination: true,
          autoplay: true,
          interval: 5000,
          pauseOnHover: true,
          breakpoints: {
            768: {
              padding: { right: "2.5rem" },
            },
            1024: {
              perPage: 2,
              padding: { right: "1.5rem" },
              gap: "1.25rem",
            },
          },
        }}
        className=""
        aria-label="Outsy Picks this week"
      >
        {picks.map((spot, index) => (
          <SplideSlide key={spot.id}>
            <Link
              href={`/spots/${spot.slug}`}
              onClick={() => posthog.capture("pick_clicked", { spot_id: spot.id, spot_name: spot.name })}
              className="block relative h-64 md:h-72 lg:h-80 rounded-2xl overflow-hidden group"
            >
              <Image
                src={spot.images[0]}
                alt={spot.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 90vw, (max-width: 1024px) 85vw, 45vw"
                priority
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Special Badges Info (Tightened Horizontal Grouping) */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                {spot.special ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase bg-primary text-white shadow-xl border border-white/20">
                    <RiFlashlightLine className="h-3 w-3" />
                    {spot.special.label}
                  </span>
                ) : spot.isFeatured ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase bg-accent text-accent-foreground shadow-xl border border-white/20">
                    <RiStarFill className="h-3 w-3" />
                    Spotlight
                  </span>
                ) : spot.isNew ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-xl border border-white/20">
                    <RiTimerFlashLine className="h-3 w-3" />
                    New
                  </span>
                ) : null}
              </div>


              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="mb-1 min-w-0">
                  <h3 className="text-white font-bold text-xl leading-tight truncate">
                    {spot.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-white/80 text-sm mb-2 font-medium">
                  <RiMapPinLine className="h-4 w-4 flex-shrink-0" />
                  <span>{spot.area}</span>
                  <span className="text-white/30">·</span>
                  <span className="text-white font-bold">{BUDGET_SYMBOLS[spot.budgetTier]}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {spot.vibeTags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-white/20 text-white backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </SplideSlide>
        ))}
      </Splide>
    </section>
  );
}

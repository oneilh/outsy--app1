"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Image from "next/image";
import Link from "next/link";
import { RiMapPinLine, RiFireLine } from "react-icons/ri";
import type { Spot } from "@/lib/types";

interface OutsyPicksCarouselProps {
  picks: Spot[];
}

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

              {/* Budget Tier Badge */}
              <div className="absolute top-3 left-3">
                <span className={`badge shadow-sm ${
                  spot.budgetTier === "budget"
                    ? "bg-green-500 text-white"
                    : spot.budgetTier === "mid"
                    ? "bg-accent text-accent-foreground"
                    : "bg-primary text-white"
                }`}>
                  {spot.budgetTier === "budget" 
                    ? "Budget" 
                    : spot.budgetTier === "mid" 
                    ? "Mid-range" 
                    : "Splurge"}
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-xl leading-tight mb-1">
                  {spot.name}
                </h3>
                <div className="flex items-center gap-1 text-white/80 text-sm mb-2">
                  <RiMapPinLine className="h-4 w-4 flex-shrink-0" />
                  <span>{spot.area}</span>
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

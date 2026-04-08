"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { SpotCard } from "@/components/home/SpotCard";
import type { Spot } from "@/lib/types";

interface SimilarSpotsProps {
  spots: Spot[];
}

export function SimilarSpots({ spots }: SimilarSpotsProps) {
  if (!spots.length) return null;

  return (
    <section>
      <h2 className="text-lg font-bold text-foreground mb-4">You Might Also Like</h2>
      <Splide
        options={{
          type: "slide",
          perPage: 2,
          perMove: 1,
          gap: "0.75rem",
          arrows: false,
          pagination: false,
          drag: "free",
          snap: true,
          breakpoints: {
            768: { perPage: 2, gap: "0.75rem" },
            1024: { perPage: 3, gap: "1rem" },
            1280: { perPage: 4, gap: "1rem" },
          },
        }}
        aria-label="Similar spots"
      >
        {spots.map((spot) => (
          <SplideSlide key={spot.id}>
            <SpotCard spot={spot} />
          </SplideSlide>
        ))}
      </Splide>
    </section>
  );
}

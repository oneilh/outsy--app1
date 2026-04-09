"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { CollectionCard } from "@/components/home/CollectionCard";
import type { Collection } from "@/lib/types";

interface RelatedCollectionsProps {
  collections: Collection[];
}

export function RelatedCollections({ collections }: RelatedCollectionsProps) {
  if (!collections.length) return null;

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-2 w-2 rounded-full bg-primary" />
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">Featured In</h2>
      </div>
      
      <Splide
        options={{
          type: "slide",
          perPage: 2,
          perMove: 1,
          gap: "1rem",
          arrows: false,
          pagination: false,
          drag: "free",
          snap: true,
          breakpoints: {
            768: { perPage: 2, gap: "1rem" },
            1024: { perPage: 2, gap: "1.5rem" },
            1280: { perPage: 3, gap: "1.5rem" },
          },
        }}
        aria-label="Related collections"
      >
        {collections.map((collection) => (
          <SplideSlide key={collection.id}>
            <CollectionCard collection={collection} />
          </SplideSlide>
        ))}
      </Splide>
    </section>
  );
}

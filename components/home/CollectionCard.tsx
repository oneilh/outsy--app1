"use client";

import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";
import { RiArrowRightLine } from "react-icons/ri";
import type { Collection } from "@/lib/types";

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      onClick={() => posthog.capture("collection_clicked", { collection_id: collection.id, collection_name: collection.name })}
      className="block relative rounded-2xl overflow-hidden group aspect-[4/3] bg-card border border-border/50 shadow-sm transition-all duration-500 hover:shadow-xl hover:border-primary/30"
    >
      <Image
        src={collection.coverImage}
        alt={collection.name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
        sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
      />
      
      {/* Dynamic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 transition-transform duration-500 group-hover:translate-y-[-4px]">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-black text-white text-base md:text-lg leading-tight tracking-tight drop-shadow-md">
              {collection.name}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-primary/20 backdrop-blur-sm border border-primary/20 text-[8px] font-black text-primary uppercase tracking-tighter">
                Official
              </span>
              <p className="text-white/90 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                {collection.spotIds.length} curated picks
              </p>
            </div>

          </div>
          
          <div className="flex-shrink-0 h-8 w-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:scale-110 transition-all duration-300">
            <RiArrowRightLine className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>

      {/* Subtle top-right accent */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="px-2 py-0.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 text-[9px] font-bold text-white uppercase tracking-tighter">
          Explore
        </div>
      </div>
    </Link>
  );
}


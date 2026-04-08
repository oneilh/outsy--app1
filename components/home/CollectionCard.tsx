import Image from "next/image";
import Link from "next/link";
import { RiArrowRightLine } from "react-icons/ri";
import type { Collection } from "@/lib/types";

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="block relative rounded-2xl overflow-hidden group aspect-[4/3]"
    >
      <Image
        src={collection.coverImage}
        alt={collection.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="flex items-end justify-between gap-1">
          <div>
            <h3 className="font-bold text-white text-sm md:text-base leading-tight">
              {collection.name}
            </h3>
            <p className="text-white/70 text-xs mt-0.5 line-clamp-1 hidden md:block">
              {collection.spotIds.length} spots
            </p>
          </div>
          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary transition-colors">
            <RiArrowRightLine className="h-3.5 w-3.5 text-white" />
          </div>
        </div>
      </div>
    </Link>
  );
}

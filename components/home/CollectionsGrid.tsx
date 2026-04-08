import Link from "next/link";
import { RiArrowRightLine, RiGridLine } from "react-icons/ri";
import { CollectionCard } from "./CollectionCard";
import type { Collection } from "@/lib/types";

interface CollectionsGridProps {
  collections: Collection[];
}

export function CollectionsGrid({ collections }: CollectionsGridProps) {
  // Show first 6 on home screen (progressive disclosure)
  const visible = collections.slice(0, 6);

  return (
    <section className="w-full px-4 lg:px-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <RiGridLine className="h-5 w-5 text-secondary" />
          <h2 className="text-lg font-bold text-foreground">Collections</h2>
        </div>
        <Link
          href="/collections"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          See all
          <RiArrowRightLine className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {visible.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </section>
  );
}

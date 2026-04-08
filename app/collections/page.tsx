import type { Metadata } from "next";
import { getAllCollections } from "@/lib/data";
import { CollectionCard } from "@/components/home/CollectionCard";
import type { Collection } from "@/lib/types";

export const metadata: Metadata = {
  title: "Collections — Outsy",
  description: "Browse curated spot collections for every mood, occasion, and crew.",
};

const TYPE_LABELS: Record<Collection["type"], string> = {
  category: "By Category",
  mood: "By Mood",
  who: "Who You're With",
  curated: "Curated by Outsy",
};

const TYPE_ORDER: Collection["type"][] = ["category", "mood", "who", "curated"];

export default function CollectionsPage() {
  const collections = getAllCollections();

  const grouped = TYPE_ORDER.reduce<Record<Collection["type"], Collection[]>>(
    (acc, type) => {
      acc[type] = collections.filter((c) => c.type === type);
      return acc;
    },
    { category: [], mood: [], who: [], curated: [] }
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="px-4 lg:px-8 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-foreground">Collections</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Curated spots for every mood, occasion, and crew.
        </p>
      </div>

      {/* Grouped sections */}
      <div className="px-4 lg:px-8 pb-10 space-y-10">
        {TYPE_ORDER.map((type) => {
          const group = grouped[type];
          if (!group.length) return null;
          return (
            <section key={type}>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {TYPE_LABELS[type]}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {group.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

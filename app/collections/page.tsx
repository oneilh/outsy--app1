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

import { PageContainer } from "@/components/layout/PageContainer";

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
      <PageContainer>
        {/* Page header */}
        <div className="pt-4 pb-6">
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            Collections
          </h1>
          <p className="text-muted-foreground text-sm mt-1.5 max-w-md font-medium">
            Hand-picked lists of the best spots in Lagos, curated for every mood, crew, and occasion.
          </p>
        </div>

        {/* Grouped sections */}
        <div className="pb-16 space-y-12">
          {TYPE_ORDER.map((type) => {
            const group = grouped[type];
            if (!group.length) return null;
            return (
              <section key={type} className="relative">
                <div className="flex items-center gap-4 mb-5">
                  <h2 className="text-xs font-black text-foreground/40 uppercase tracking-[0.2em] whitespace-nowrap">
                    {TYPE_LABELS[type]}
                  </h2>
                  <div className="h-[1px] w-full bg-linear-to-r from-border/50 to-transparent" />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
                  {group.map((collection) => (
                    <CollectionCard key={collection.id} collection={collection} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </PageContainer>
    </div>
  );
}


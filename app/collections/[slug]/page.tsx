import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RiArrowLeftLine } from "react-icons/ri";
import { getCollectionBySlug, getSpotsForCollection, getAllCollections } from "@/lib/data";
import { SpotGrid } from "@/components/spots/SpotGrid";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCollections().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return {};
  return {
    title: `${collection.name} — Outsy Collections`,
    description: collection.description,
  };
}

const TYPE_LABELS: Record<string, string> = {
  category: "Category",
  mood: "Mood",
  who: "For",
  curated: "Curated",
};

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const spots = getSpotsForCollection(slug);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Immersive Hero */}
      <div className="relative w-full h-[50vh] min-h-[400px] max-h-[600px] bg-muted overflow-hidden">
        <Image
          src={collection.coverImage}
          alt={collection.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 z-40 px-6 pt-10">
          <div className="max-w-7xl mx-auto w-full">
            <Link
              href="/collections"
              className="group flex items-center justify-center h-12 w-12 rounded-2xl bg-black/30 backdrop-blur-xl text-white hover:bg-black/50 transition-all shadow-xl border border-white/20 active:scale-90"
              aria-label="Back to Collections"
            >
              <RiArrowLeftLine className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Collection Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 pb-12 lg:pb-16 z-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex flex-col gap-4">
              <span className="inline-flex items-center self-start rounded-full px-3 py-1 text-[10px] lg:text-[11px] font-black bg-primary text-white uppercase tracking-[0.2em] border border-white/10 shadow-lg">
                {TYPE_LABELS[collection.type] ?? collection.type} Collection
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight uppercase tracking-tight drop-shadow-2xl">
                {collection.name}
              </h1>
              
              <p className="text-white/80 text-base md:text-lg font-medium max-w-2xl leading-relaxed">
                {collection.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-sm font-black text-muted-foreground uppercase tracking-widest">
              Included Spots
            </h2>
          </div>
          <p className="text-sm font-bold text-foreground">
            {spots.length} curated {spots.length === 1 ? "spot" : "spots"}
          </p>
        </div>

        {/* Grid */}
        <div>
          {spots.length > 0 ? (
            <SpotGrid spots={spots} />
          ) : (
            <div className="py-32 text-center rounded-[3rem] border border-dashed border-border bg-muted/20">
              <p className="text-muted-foreground font-medium">
                No spots in this collection yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


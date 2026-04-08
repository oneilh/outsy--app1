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
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-52 md:h-72 w-full">
        <Image
          src={collection.coverImage}
          alt={collection.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10" />

        {/* Back button */}
        <Link
          href="/collections"
          className="absolute top-4 left-4 flex items-center justify-center h-9 w-9 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
          aria-label="Back to Collections"
        >
          <RiArrowLeftLine className="h-5 w-5" />
        </Link>

        {/* Title block */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-5">
          <span className="inline-block mb-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-white/20 backdrop-blur-sm text-white">
            {TYPE_LABELS[collection.type] ?? collection.type}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            {collection.name}
          </h1>
          <p className="text-white/80 text-sm mt-1 line-clamp-2">{collection.description}</p>
        </div>
      </div>

      {/* Spot count */}
      <div className="px-4 lg:px-8 pt-5 pb-3 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{spots.length}</span>{" "}
          {spots.length === 1 ? "spot" : "spots"}
        </p>
      </div>

      {/* Grid */}
      <div className="px-4 lg:px-8 pb-10">
        {spots.length > 0 ? (
          <SpotGrid spots={spots} />
        ) : (
          <div className="py-16 text-center text-muted-foreground text-sm">
            No spots in this collection yet.
          </div>
        )}
      </div>
    </div>
  );
}

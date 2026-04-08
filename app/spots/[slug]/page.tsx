import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  RiMapPinLine,
  RiTimeLine,
  RiMoneyDollarCircleLine,
  RiInstagramLine,
  RiGlobalLine,
  RiPhoneLine,
} from "react-icons/ri";
import { getSpotBySlug, getSimilarSpots, getAllSpots } from "@/lib/data";
import { SpotHero } from "@/components/spots/SpotHero";
import { VibeTagList } from "@/components/spots/VibeTagList";
import { AmenitiesList } from "@/components/spots/AmenitiesList";
import { GoingNowButton } from "@/components/spots/GoingNowButton";
import { SimilarSpots } from "@/components/spots/SimilarSpots";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const spots = getAllSpots();
  return spots.map((spot) => ({ slug: spot.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const spot = getSpotBySlug(slug);
  if (!spot) return {};
  return {
    title: `${spot.name} — Outsy`,
    description: spot.description,
  };
}

const BUDGET_LABELS: Record<string, string> = {
  budget: "Budget-friendly",
  mid: "Mid-range",
  splurge: "Splurge",
};

const BUDGET_COLORS: Record<string, string> = {
  budget: "text-green-600 bg-green-50",
  mid: "text-amber-600 bg-amber-50",
  splurge: "text-primary bg-surface",
};

export default async function SpotDetailPage({ params }: Props) {
  const { slug } = await params;
  const spot = getSpotBySlug(slug);
  if (!spot) notFound();

  const similarSpots = getSimilarSpots(spot);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero — full bleed, no padding */}
      <SpotHero spot={spot} />

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">

        {/* Going Now CTA */}
        <GoingNowButton spotId={spot.id} initialCount={spot.goingNowCount} />

        {/* Quick facts row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-start gap-2 rounded-xl bg-muted p-3">
            <RiMoneyDollarCircleLine className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Price</p>
              <p className="text-sm font-semibold text-foreground">{spot.priceRange}</p>
              <span
                className={`inline-block mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  BUDGET_COLORS[spot.budgetTier] ?? "text-muted-foreground bg-muted"
                }`}
              >
                {BUDGET_LABELS[spot.budgetTier] ?? spot.budgetTier}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-muted p-3">
            <RiTimeLine className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Best Time</p>
              <p className="text-sm font-semibold text-foreground">{spot.bestTimeToGo}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-base text-foreground/80 leading-relaxed">{spot.description}</p>

        {/* Vibe tags */}
        <VibeTagList tags={spot.vibeTags} />

        {/* Amenities */}
        <AmenitiesList amenities={spot.amenities} />

        {/* Who it's for */}
        {spot.whoItsFor.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Perfect For
            </h2>
            <div className="flex flex-wrap gap-2">
              {spot.whoItsFor.map((who) => (
                <span
                  key={who}
                  className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-secondary/10 text-secondary"
                >
                  {who.charAt(0).toUpperCase() + who.slice(1)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Map + Contact */}
        <div className="rounded-2xl border border-border overflow-hidden">
          {/* Map CTA */}
          <Link
            href={spot.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 hover:bg-muted transition-colors border-b border-border"
          >
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary flex-shrink-0">
              <RiMapPinLine className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Open in Google Maps</p>
              <p className="text-xs text-muted-foreground truncate">
                {spot.area}, {spot.city}
              </p>
            </div>
            <span className="text-xs font-semibold text-primary">Directions</span>
          </Link>

          {/* Phone */}
          {spot.phone && (
            <Link
              href={`tel:${spot.phone}`}
              className="flex items-center gap-3 p-4 hover:bg-muted transition-colors border-b border-border"
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted text-foreground flex-shrink-0">
                <RiPhoneLine className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Call</p>
                <p className="text-xs text-muted-foreground">{spot.phone}</p>
              </div>
            </Link>
          )}

          {/* Instagram */}
          {spot.instagram && (
            <Link
              href={`https://instagram.com/${spot.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 hover:bg-muted transition-colors border-b border-border last:border-b-0"
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted text-foreground flex-shrink-0">
                <RiInstagramLine className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Instagram</p>
                <p className="text-xs text-muted-foreground">@{spot.instagram}</p>
              </div>
            </Link>
          )}

          {/* Website */}
          {spot.website && (
            <Link
              href={spot.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted text-foreground flex-shrink-0">
                <RiGlobalLine className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">Website</p>
                <p className="text-xs text-muted-foreground truncate">{spot.website}</p>
              </div>
            </Link>
          )}
        </div>

        {/* Similar spots */}
        {similarSpots.length > 0 && <SimilarSpots spots={similarSpots} />}
      </div>
    </div>
  );
}

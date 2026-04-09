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
import { ShareSpot } from "@/components/spots/ShareSpot";
import { SimilarSpots } from "@/components/spots/SimilarSpots";
import { DetailActions } from "@/components/spots/DetailActions";
import { VerificationBadge } from "@/components/spots/VerificationBadge";
import { SpotGallery } from "@/components/spots/SpotGallery";

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
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-32 space-y-10">
        
        {/* Quick facts row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3 rounded-2xl bg-secondary/5 border border-secondary/10 p-4 transition-all hover:bg-secondary/10">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary flex-shrink-0">
              <RiMoneyDollarCircleLine className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Price Range</p>
              <p className="text-sm font-bold text-foreground leading-none mb-1.5">{spot.priceRange}</p>
              <span
                className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                  BUDGET_COLORS[spot.budgetTier] ?? "text-muted-foreground bg-muted"
                }`}
              >
                {BUDGET_LABELS[spot.budgetTier] ?? spot.budgetTier}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-accent/5 border border-accent/10 p-4 transition-all hover:bg-accent/10">
             <div className="flex items-center justify-center h-10 w-10 rounded-full bg-accent/10 text-accent flex-shrink-0">
              <RiTimeLine className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Best Time</p>
              <p className="text-sm font-bold text-foreground leading-none">{spot.bestTimeToGo}</p>
            </div>
          </div>
        </div>

        {/* Description - Premium Typography */}
        <div className="relative">
          <p className="text-lg md:text-xl text-foreground font-medium leading-relaxed italic border-l-4 border-primary pl-6 py-2">
            {spot.description}
          </p>
        </div>
        
        {/* Vibe Gallery */}
        <SpotGallery spot={spot} />

        {/* Vibe tags */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            The Vibe
          </h2>
          <VibeTagList tags={spot.vibeTags} />
        </div>

        {/* Amenities */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Amenities
          </h2>
          <AmenitiesList amenities={spot.amenities} />
        </div>

        {/* Who it's for */}
        {spot.whoItsFor.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
              Perfect For
            </h2>
            <div className="flex flex-wrap gap-2">
              {spot.whoItsFor.map((who) => (
                <span
                  key={who}
                  className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold bg-primary/5 text-primary border border-primary/10"
                >
                  {who.charAt(0).toUpperCase() + who.slice(1)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Map + Contact */}
        <div className="rounded-3xl border border-border shadow-sm overflow-hidden bg-card">
          <div className="p-4 border-b border-border bg-muted/30">
             <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Contact & Location</h2>
          </div>
          
          {/* Map CTA */}
          <Link
            href={spot.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 hover:bg-muted transition-colors border-b border-border"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 flex-shrink-0">
              <RiMapPinLine className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground">Open in Google Maps</p>
              <p className="text-xs text-muted-foreground truncate">
                {spot.area}, {spot.city}
              </p>
            </div>
            <span className="text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/5">Directions</span>
          </Link>

          <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
            {/* Phone */}
            {spot.phone ? (
              <Link
                href={`tel:${spot.phone}`}
                className="flex flex-col items-center justify-center py-6 hover:bg-muted transition-colors"
              >
                <RiPhoneLine className="h-6 w-6 text-primary mb-2" />
                <p className="text-xs font-bold">Call</p>
              </Link>
            ) : null}

            {/* Instagram */}
            {spot.instagram ? (
              <Link
                href={`https://instagram.com/${spot.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center py-6 hover:bg-muted transition-colors"
              >
                <RiInstagramLine className="h-6 w-6 text-primary mb-2" />
                <p className="text-xs font-bold">Instagram</p>
              </Link>
            ) : null}
          </div>

          <div className="grid grid-cols-2 divide-x divide-border">
             {/* Website */}
            {spot.website ? (
              <Link
                href={spot.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center py-6 hover:bg-muted transition-colors"
              >
                <RiGlobalLine className="h-6 w-6 text-primary mb-2" />
                <p className="text-xs font-bold">Website</p>
              </Link>
            ) : (
               <div className="py-6 flex flex-col items-center justify-center opacity-40">
                <RiGlobalLine className="h-6 w-6 mb-2" />
                <p className="text-xs font-bold">No Website</p>
              </div>
            )}
            
            {/* Share - Reusing component but styled as a grid item if possible */}
            <ShareSpot spot={spot} variant="grid-item" />
          </div>

          {/* Additional Actions (Compare, Report) */}
          <DetailActions spot={spot} />
        </div>

        {/* Verification Footer */}
        <VerificationBadge spot={spot} />

        {/* Similar spots */}
        {similarSpots.length > 0 && (
          <div className="pt-8 border-t border-border">
            <SimilarSpots spots={similarSpots} />
          </div>
        )}
      </div>

      {/* Floating Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-gradient-to-t from-background via-background/95 to-transparent z-50">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="flex-1">
            <GoingNowButton spotId={spot.id} initialCount={spot.goingNowCount} variant="full" />
          </div>
          <Link
            href={spot.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-14 w-14 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center shadow-xl shadow-secondary/20 hover:scale-105 active:scale-95 transition-all"
            aria-label="Get directions"
          >
            <RiMapPinLine className="h-7 w-7" />
          </Link>
        </div>
      </div>
    </div>
  );
}

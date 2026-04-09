"use client";

import { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RiBookmarkLine, RiGroupLine } from "react-icons/ri";
import { useSavedSpots } from "@/lib/hooks/useSavedSpots";
import { SpotGrid } from "@/components/spots/SpotGrid";
import { ShareSavedList } from "@/components/spots/ShareSavedList";
import { PageContainer } from "@/components/layout/PageContainer";
import Link from "next/link";

import { useState, useEffect } from "react";
import { getSpotsByIds } from "@/lib/data-client";
import type { Spot } from "@/lib/types";

function SavedContent() {
  const { savedIds } = useSavedSpots();
  const searchParams = useSearchParams();
  const [savedSpots, setSavedSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get IDs from URL if present
  const sharedIdsParam = searchParams.get("ids");
  const sharedIds = useMemo(() => sharedIdsParam ? sharedIdsParam.split(",") : [], [sharedIdsParam]);
  const isSharedView = sharedIds.length > 0;
  
  const displayIds = isSharedView ? sharedIds : savedIds;

  useEffect(() => {
    async function loadSpots() {
      if (displayIds.length > 0) {
        const data = await getSpotsByIds(displayIds);
        setSavedSpots(data);
      } else {
        setSavedSpots([]);
      }
      setLoading(false);
    }
    loadSpots();
  }, [displayIds]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
         <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <PageContainer>
        {/* Refined Header - Reduced Spacing */}
        <div className="pt-6 pb-12 lg:pt-10 lg:pb-16 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              {isSharedView ? (
                <div className="flex items-center gap-2 group cursor-default">
                  <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                  <span className="text-[10px] lg:text-[11px] font-black text-secondary uppercase tracking-[0.2em]">Shared Curated List</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 group cursor-default">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] lg:text-[11px] font-black text-primary uppercase tracking-[0.2em]">Your Personal Library</span>
                </div>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tight leading-[0.9] drop-shadow-sm">
              {isSharedView ? "Outsy\n Picks" : "The\n Library"}
            </h1>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-border/60">
            <div className="max-w-xl">
              <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed italic border-l-4 border-primary pl-6 py-1">
                {savedSpots.length > 0
                  ? `Featuring ${savedSpots.length} curated ${savedSpots.length === 1 ? "spot" : "spots"} ${isSharedView ? "hand-picked for you" : "saved for your next Lagos move"}.`
                  : isSharedView 
                    ? "This curated list is currently empty." 
                    : "Your library is ready for curation. Start exploring to build your perfect Lagos hitlist."}
              </p>
            </div>

            {!isSharedView && savedSpots.length > 0 && (
              <div className="shrink-0">
                <ShareSavedList savedIds={savedIds} />
              </div>
            )}
          </div>
        </div>

        <div>

          {savedSpots.length > 0 ? (
            <SpotGrid spots={savedSpots} className="lg:grid-cols-5 xl:grid-cols-6" />
          ) : (
            <div className="flex flex-col items-center justify-center py-24 gap-8 text-center max-w-sm mx-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-muted/20 rounded-full blur-2xl" />
                <div className="relative flex items-center justify-center h-24 w-24 rounded-full bg-surface border border-border shadow-xl">
                  <RiBookmarkLine className="h-10 w-10 text-muted-foreground/30" />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-foreground tracking-tight">
                  {isSharedView ? "List is empty" : "Your library is waiting"}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isSharedView 
                    ? "This shared link doesn't seem to contain any active spots. Try asking for a new one."
                    : "Bookmark the spots you vibe with most. They'll automatically sync here so you can find them in under 60 seconds."}
                </p>
                {!isSharedView && (
                   <div className="pt-4">
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center px-10 py-4 rounded-2xl bg-primary text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      Explore Spots
                    </Link>
                   </div>
                )}
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
}

export default function SavedPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
      <SavedContent />
    </Suspense>
  );
}


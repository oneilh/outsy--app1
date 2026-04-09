"use client";

import { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RiBookmarkLine, RiGroupLine } from "react-icons/ri";
import { getAllSpots } from "@/lib/data";
import { useSavedSpots } from "@/lib/hooks/useSavedSpots";
import { SpotGrid } from "@/components/spots/SpotGrid";
import { ShareSavedList } from "@/components/spots/ShareSavedList";
import { PageContainer } from "@/components/layout/PageContainer";
import Link from "next/link";

const allSpots = getAllSpots();

function SavedContent() {
  const { savedIds } = useSavedSpots();
  const searchParams = useSearchParams();
  
  // Get IDs from URL if present
  const sharedIdsParam = searchParams.get("ids");
  const sharedIds = useMemo(() => sharedIdsParam ? sharedIdsParam.split(",") : [], [sharedIdsParam]);
  const isSharedView = sharedIds.length > 0;
  
  const displayIds = isSharedView ? sharedIds : savedIds;

  const savedSpots = useMemo(
    () => allSpots.filter((s) => displayIds.includes(s.id)),
    [displayIds]
  );

  return (
    <div className="min-h-screen bg-background">
      <PageContainer>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 pt-8 pb-10 border-b border-border/40 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              {isSharedView ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-secondary/20">
                  <RiGroupLine className="h-3.5 w-3.5" />
                  Shared List
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                  <RiBookmarkLine className="h-3.5 w-3.5" />
                  Library
                </div>
              )}
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tighter">
              {isSharedView ? "Recommended Spots" : "Saved Spots"}
            </h1>
            <p className="text-muted-foreground text-sm font-medium mt-2">
              {savedSpots.length > 0
                ? `${savedSpots.length} spot${savedSpots.length === 1 ? "" : "s"} ${isSharedView ? "in this shared list" : "saved for your next outing"}`
                : isSharedView ? "No spots found in this shared list." : "Curate your perfect night out."}
            </p>
          </div>

          {!isSharedView && savedSpots.length > 0 && (
            <div className="self-start md:self-auto">
              <ShareSavedList savedIds={savedIds} />
            </div>
          )}
        </div>

        <div className="pb-32">
          {savedSpots.length > 0 ? (
            <SpotGrid spots={savedSpots} />
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


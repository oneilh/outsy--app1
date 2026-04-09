"use client";

import { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RiBookmarkLine, RiGroupLine } from "react-icons/ri";
import { getAllSpots } from "@/lib/data";
import { useSavedSpots } from "@/lib/hooks/useSavedSpots";
import { SpotGrid } from "@/components/spots/SpotGrid";
import { ShareSavedList } from "@/components/spots/ShareSavedList";

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
      <div className="px-4 lg:px-8 pt-8 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-border/40 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {isSharedView ? (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-secondary text-white text-[9px] font-black uppercase tracking-widest">
                <RiGroupLine className="h-3 w-3" />
                Shared List
              </div>
            ) : null}
            <h1 className="text-3xl font-black text-foreground tracking-tight">
              {isSharedView ? "Recommended Spots" : "Saved Spots"}
            </h1>
          </div>
          <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest text-[10px]">
            {savedSpots.length > 0
              ? `${savedSpots.length} spot${savedSpots.length === 1 ? "" : "s"} ${isSharedView ? "in list" : "saved"}`
              : isSharedView ? "No spots found in this shared list." : "Collect your favorite spots here."}
          </p>
        </div>

        {!isSharedView && savedSpots.length > 0 && (
          <ShareSavedList savedIds={savedIds} />
        )}
      </div>

      <div className="px-4 lg:px-8 pb-32">
        {savedSpots.length > 0 ? (
          <SpotGrid spots={savedSpots} />
        ) : (
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-muted shadow-inner">
              <RiBookmarkLine className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="max-w-xs">
              <p className="font-bold text-lg text-foreground">
                {isSharedView ? "List is empty" : "Nothing saved yet"}
              </p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {isSharedView 
                  ? "This shared list doesn't seem to have any valid spots."
                  : "Tap the bookmark icon on any spot to save it for later. Your favorites will automatically appear here."}
              </p>
            </div>
          </div>
        )}
      </div>
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


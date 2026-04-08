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
      <div className="px-4 lg:px-8 pt-8 pb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isSharedView ? (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-secondary text-white text-[10px] font-bold uppercase tracking-wider">
                <RiGroupLine className="h-3 w-3" />
                Shared List
              </div>
            ) : null}
            <h1 className="text-2xl font-bold text-foreground">
              {isSharedView ? "Recommended Spots" : "Saved Spots"}
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            {savedSpots.length > 0
              ? `${savedSpots.length} spot${savedSpots.length === 1 ? "" : "s"} ${isSharedView ? "in this list" : "saved"}`
              : isSharedView ? "No spots found in this shared list." : "Spots you save will appear here."}
          </p>
        </div>

        {!isSharedView && savedSpots.length > 0 && (
          <ShareSavedList savedIds={savedIds} />
        )}
      </div>

      <div className="px-4 lg:px-8 pb-10">
        {savedSpots.length > 0 ? (
          <SpotGrid spots={savedSpots} />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-muted">
              <RiBookmarkLine className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {isSharedView ? "List is empty" : "Nothing saved yet"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {isSharedView 
                  ? "This shared list doesn't seem to have any valid spots."
                  : "Tap the bookmark on any spot to save it for later."}
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


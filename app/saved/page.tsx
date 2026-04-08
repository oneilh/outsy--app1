"use client";

import { useMemo } from "react";
import { RiBookmarkLine } from "react-icons/ri";
import { getAllSpots } from "@/lib/data";
import { useSavedSpots } from "@/lib/hooks/useSavedSpots";
import { SpotGrid } from "@/components/spots/SpotGrid";

const allSpots = getAllSpots();

export default function SavedPage() {
  const { savedIds } = useSavedSpots();

  const savedSpots = useMemo(
    () => allSpots.filter((s) => savedIds.includes(s.id)),
    [savedIds]
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 lg:px-8 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-foreground">Saved Spots</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {savedSpots.length > 0
            ? `${savedSpots.length} spot${savedSpots.length === 1 ? "" : "s"} saved`
            : "Spots you save will appear here."}
        </p>
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
              <p className="font-semibold text-foreground">Nothing saved yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Tap the bookmark on any spot to save it for later.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import posthog from "posthog-js";

const STORAGE_KEY = "outsy-saved";

export function useSavedSpots() {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
    setSavedIds(stored);
  }, []);

  const toggleSave = useCallback((id: string) => {
    setSavedIds((prev) => {
      const isRemoving = prev.includes(id);
      const next = isRemoving ? prev.filter((x) => x !== id) : [...prev, id];
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      
      posthog.capture(isRemoving ? "spot_unsaved" : "spot_saved", {
        spot_id: id,
        total_saved: next.length
      });

      return next;
    });
  }, []);

  const isSaved = useCallback(
    (id: string) => savedIds.includes(id),
    [savedIds]
  );

  return { savedIds, isSaved, toggleSave };
}

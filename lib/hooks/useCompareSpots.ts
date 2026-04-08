"use client";

import { useState, useCallback } from "react";

const MAX_COMPARE = 3;

export function useCompareSpots() {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const isInCompare = useCallback(
    (id: string) => compareIds.includes(id),
    [compareIds]
  );

  const toggleCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  }, []);

  const clearCompare = useCallback(() => setCompareIds([]), []);

  return { compareIds, isInCompare, toggleCompare, clearCompare, maxReached: compareIds.length >= MAX_COMPARE };
}

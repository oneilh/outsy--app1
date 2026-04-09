"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

const MAX_COMPARE = 3;

interface CompareContextValue {
  compareIds: string[];
  isInCompare: (id: string) => boolean;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  maxReached: boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("outsy-compare");
    if (stored) {
      try {
        setCompareIds(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse compare ids", e);
      }
    }
  }, []);

  const isInCompare = useCallback((id: string) => compareIds.includes(id), [compareIds]);

  const toggleCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      let next;
      if (prev.includes(id)) {
        next = prev.filter((x) => x !== id);
      } else if (prev.length < MAX_COMPARE) {
        next = [...prev, id];
      } else {
        return prev;
      }
      localStorage.setItem("outsy-compare", JSON.stringify(next));
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
    localStorage.removeItem("outsy-compare");
  }, []);

  return (
    <CompareContext.Provider
      value={{ compareIds, isInCompare, toggleCompare, clearCompare, maxReached: compareIds.length >= MAX_COMPARE }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}

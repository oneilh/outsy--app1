"use client";

import { useState, useMemo } from "react";
import { RiSearchLine, RiCloseLine } from "react-icons/ri";
import { getAllSpots } from "@/lib/data";
import { SpotGrid } from "@/components/spots/SpotGrid";
import type { SpotCategory, BudgetTier } from "@/lib/types";

const ALL_SPOTS = getAllSpots();

const CATEGORIES: { id: SpotCategory | "all"; label: string }[] = [
  { id: "all",        label: "All"        },
  { id: "eating",     label: "Eating"     },
  { id: "drinking",   label: "Drinking"   },
  { id: "cafe",       label: "Café"       },
  { id: "outdoors",   label: "Outdoors"   },
  { id: "activities", label: "Activities" },
  { id: "nightlife",  label: "Nightlife"  },
  { id: "hotel",      label: "Hotel"      },
];

const BUDGETS: { id: BudgetTier | "all"; label: string }[] = [
  { id: "all",    label: "Any price"  },
  { id: "budget", label: "Budget ₦"   },
  { id: "mid",    label: "Mid ₦₦"     },
  { id: "splurge", label: "Splurge ₦₦₦" },
];

export default function SpotsPage() {
  const [query, setQuery]       = useState("");
  const [category, setCategory] = useState<SpotCategory | "all">("all");
  const [budget, setBudget]     = useState<BudgetTier | "all">("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_SPOTS.filter((s) => {
      if (category !== "all" && s.category !== category) return false;
      if (budget   !== "all" && s.budgetTier !== budget)  return false;
      if (q && !(
        s.name.toLowerCase().includes(q) ||
        s.area.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.vibeTags.some((t) => t.toLowerCase().includes(q))
      )) return false;
      return true;
    });
  }, [query, category, budget]);

  const hasFilters = query !== "" || category !== "all" || budget !== "all";

  function clearFilters() {
    setQuery("");
    setCategory("all");
    setBudget("all");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 lg:px-8 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-foreground">All Spots</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {results.length} spot{results.length !== 1 ? "s" : ""} in Lagos
        </p>
      </div>

      {/* Search */}
      <div className="px-4 lg:px-8 mb-4">
        <div className="relative">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search spots, areas, vibes…"
            className="w-full rounded-xl border border-border bg-muted pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <RiCloseLine className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto px-4 lg:px-8 pb-1 scrollbar-none mb-3">
        {CATEGORIES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setCategory(id)}
            className={`chip flex-shrink-0 border text-sm transition-all ${
              category === id
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Budget filter */}
      <div className="flex gap-2 overflow-x-auto px-4 lg:px-8 pb-1 scrollbar-none mb-5">
        {BUDGETS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setBudget(id)}
            className={`chip flex-shrink-0 border text-xs transition-all ${
              budget === id
                ? "bg-secondary text-white border-secondary"
                : "bg-background text-muted-foreground border-border hover:border-secondary/50 hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="px-4 lg:px-8 pb-10">
        {results.length > 0 ? (
          <SpotGrid spots={results} />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <RiSearchLine className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-semibold text-foreground">No spots found</p>
              <p className="text-sm text-muted-foreground mt-1">Try a different search or filter.</p>
            </div>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

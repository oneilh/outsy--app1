"use client";

import { useState, useMemo } from "react";
import { RiSearchLine, RiCloseLine } from "react-icons/ri";
import posthog from "posthog-js";
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
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tight">Browse Spots</h1>
          <p className="text-muted-foreground text-sm font-medium mt-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Showing {results.length} curated experiences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* MOBILE FILTERS */}
          <div className="lg:hidden space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Popular Vibes</h3>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {["Rooftop", "Date Night", "Live Music", "Chill", "Hidden Gem", "Buzzy"].map((vibe) => (
                  <button
                    key={vibe}
                    onClick={() => setQuery(vibe)}
                    className="px-4 py-2 rounded-xl bg-muted/50 border border-border/50 text-[11px] font-bold text-foreground whitespace-nowrap hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    # {vibe}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search spots, areas, vibes..."
                className="w-full rounded-2xl border border-border bg-muted/30 pl-11 pr-4 py-3.5 text-sm outline-none focus:border-primary transition-all font-medium"
              />
              {query && (
                <button 
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground"
                >
                  <RiCloseLine />
                </button>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => {
                    setCategory(id);
                    posthog.capture("browse_category_filter", { category: id });
                  }}
                  className={`h-9 px-4 rounded-xl border text-xs font-bold whitespace-nowrap transition-all ${
                    category === id ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-border"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              <div className="flex items-center gap-2 px-1 border-r border-border mr-1 pr-3 py-1">
                 <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tight">Price</span>
              </div>
              {BUDGETS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => {
                    setBudget(id);
                    posthog.capture("browse_budget_filter", { budget: id });
                  }}
                  className={`h-9 px-3 rounded-xl border text-[10px] font-black uppercase whitespace-nowrap transition-all ${
                    budget === id ? "bg-secondary text-white border-secondary" : "bg-card text-muted-foreground border-border"
                  }`}
                >
                  {label === "Any price" ? "Any" : label.split(' ')[1] || label}
                </button>
              ))}
            </div>
          </div>

          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:flex lg:col-span-3 flex-col gap-10 sticky top-10">
            {/* Search */}
            <div className="space-y-3">
              <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Search</h2>
              <div className="relative">
                <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Find a spot…"
                  className="w-full rounded-2xl border border-border bg-muted/20 pl-11 pr-4 py-4 text-sm outline-none focus:border-primary focus:bg-background transition-all font-medium"
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-1 px-1">
                {["Date Night", "Rooftop", "Chill", "Buzzy"].map((vibe) => (
                  <button
                    key={vibe}
                    onClick={() => setQuery(vibe)}
                    className="px-2.5 py-1.5 rounded-lg bg-muted/30 border border-border/40 text-[10px] font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all uppercase tracking-tight"
                  >
                    {vibe}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-4">
              <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Category</h2>
              <div className="flex flex-col gap-1">
                {CATEGORIES.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setCategory(id);
                      posthog.capture("browse_category_filter", { category: id });
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      category === id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    {label}
                    {category === id && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-4">
              <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Price</h2>
              <div className="grid grid-cols-2 gap-2">
                {BUDGETS.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setBudget(id);
                      posthog.capture("browse_budget_filter", { budget: id });
                    }}
                    className={`px-3 py-3 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${
                      budget === id
                        ? "bg-secondary text-white border-secondary"
                        : "bg-background text-muted-foreground border-border hover:border-secondary/40"
                    }`}
                  >
                    {label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:opacity-80 transition-opacity flex items-center gap-2 group px-4"
              >
                <RiCloseLine className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                Clear Filters
              </button>
            )}
          </aside>


          {/* RESULTS GRID */}
          <main className="lg:col-span-9">
            {results.length > 0 ? (
              <SpotGrid spots={results} />
            ) : (
              <div className="flex flex-col items-center justify-center py-32 gap-6 text-center bg-muted/20 rounded-[3rem] border border-dashed border-border">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                  <RiSearchLine className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="max-w-xs">
                  <p className="text-xl font-black text-foreground uppercase tracking-tight">No spots found</p>
                  <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search terms to find what you&apos;re looking for.</p>
                </div>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="h-12 px-8 rounded-2xl bg-foreground text-background text-sm font-bold hover:opacity-90 active:scale-95 transition-all shadow-xl"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}


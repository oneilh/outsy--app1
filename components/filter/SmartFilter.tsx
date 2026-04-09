"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  RiRestaurantLine,
  RiDrinksLine,
  RiLeafLine,
  RiRunLine,
  RiGroupLine,
  RiHeartLine,
  RiUserLine,
  RiMoonLine,
  RiFireLine,
  RiSparkling2Line,
  RiMoneyDollarCircleLine,
  RiVipCrownLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiShuffleLine,
  RiMapPinLine,
  RiBookmarkLine,
  RiBookmarkFill,
  RiCheckLine,
  RiCloseLine,
  RiTimerFlashLine,
  RiStarFill,
} from "react-icons/ri";
import type { Spot } from "@/lib/types";
import { useSavedSpots } from "@/lib/hooks/useSavedSpots";

// ── Filter option definitions ─────────────────────────────────────────────

type ActivityId = "eat" | "drinks" | "outdoors" | "activity";
type WhoId = "friends" | "couples" | "solo";
type FeelingId = "chill" | "party" | "date-night";
type BudgetId = "budget" | "mid" | "splurge";

interface FilterState {
  activities: ActivityId[];
  who: WhoId[];
  feeling: FeelingId[];
  budget: BudgetId[];
}

const ACTIVITY_OPTIONS = [
  { id: "eat" as ActivityId, label: "Eat", sub: "Restaurants", Icon: RiRestaurantLine },
  { id: "drinks" as ActivityId, label: "Drinks", sub: "Bars & Pubs", Icon: RiDrinksLine },
  { id: "outdoors" as ActivityId, label: "Outdoors", sub: "Parks & Beaches", Icon: RiLeafLine },
  { id: "activity" as ActivityId, label: "Activity", sub: "Games & Fun", Icon: RiRunLine },
];

const WHO_OPTIONS = [
  { id: "friends" as WhoId, label: "Friends", Icon: RiGroupLine },
  { id: "couples" as WhoId, label: "Partner", Icon: RiHeartLine },
  { id: "solo" as WhoId, label: "Solo", Icon: RiUserLine },
];

const FEELING_OPTIONS = [
  { id: "chill" as FeelingId, label: "Chill", Icon: RiMoonLine },
  { id: "party" as FeelingId, label: "Party", Icon: RiFireLine },
  { id: "date-night" as FeelingId, label: "Romantic", Icon: RiSparkling2Line },
];

const BUDGET_OPTIONS = [
  { id: "budget" as BudgetId, label: "Budget", Icon: RiMoneyDollarCircleLine, price: "₦" },
  { id: "mid" as BudgetId, label: "Mid-range", Icon: RiMoneyDollarCircleLine, price: "₦₦" },
  { id: "splurge" as BudgetId, label: "Splurge", Icon: RiVipCrownLine, price: "₦₦₦" },
];

// ── Filter logic ──────────────────────────────────────────────────────────

const ACTIVITY_CATEGORIES: Record<ActivityId, string[]> = {
  eat: ["eating", "cafe"],
  drinks: ["drinking", "nightlife"],
  outdoors: ["outdoors"],
  activity: ["activities"],
};

const WHO_TAGS: Record<WhoId, string[]> = {
  friends: ["friends", "groups"],
  couples: ["couples"],
  solo: ["solo", "singles", "solo-travellers"],
};

const FEELING_TAGS: Record<FeelingId, string[]> = {
  chill: ["chill", "cosy", "quiet", "serene", "casual", "escape"],
  party: ["dancing", "bottles", "clubbing", "late-night", "wild-night", "night-out", "afrobeats", "music", "live-music", "buzzy"],
  "date-night": ["date-night", "romantic", "intimate", "fancy", "upscale", "classy"],
};

function scoreSpot(spot: Spot, filters: FilterState): number {
  let score = 0;
  let matches = 0;
  let totalCriteria = 0;

  // Activity match (Required if any selected)
  if (filters.activities.length > 0) {
    totalCriteria++;
    const validCategories = filters.activities.flatMap(a => ACTIVITY_CATEGORIES[a]);
    if (validCategories.includes(spot.category)) {
      score += 15;
      matches++;
    } else {
      return -1; // Activities are usually hard filters
    }
  }

  // Who match
  if (filters.who.length > 0) {
    totalCriteria++;
    const whoTags = filters.who.flatMap(w => WHO_TAGS[w]);
    const whoMatch = whoTags.some((t) => spot.whoItsFor.includes(t)) || spot.whoItsFor.includes("everyone");
    if (whoMatch) {
      score += 10;
      matches++;
    }
  }

  // Feeling match
  if (filters.feeling.length > 0) {
    totalCriteria++;
    const feelTags = filters.feeling.flatMap(f => FEELING_TAGS[f]);
    const feelMatch = feelTags.some((t) => spot.vibeTags.includes(t));
    if (feelMatch) {
      score += 10;
      matches++;
    }
  }

  // Budget match
  if (filters.budget.length > 0) {
    totalCriteria++;
    if (filters.budget.includes(spot.budgetTier as BudgetId)) {
      score += 12;
      matches++;
    }
  }

  // If filter criteria exist but none matched (outside hard filters), return low score or -1
  if (totalCriteria > 0 && matches === 0) return -1;

  // Popularity tiebreaker
  score += Math.min(spot.goingNowCount, 5);

  return score;
}

function runFilter(spots: Spot[], filters: FilterState): Spot[] {
  // If no filters selected, return trending
  const hasFilters = filters.activities.length > 0 || filters.who.length > 0 || filters.feeling.length > 0 || filters.budget.length > 0;
  
  if (!hasFilters) {
    return [...spots].sort((a, b) => b.goingNowCount - a.goingNowCount);
  }

  return spots
    .map((spot) => ({ spot, score: scoreSpot(spot, filters) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ spot }) => spot);
}

function generateWhyPicked(spot: Spot, filters: FilterState): string {
  const parts: string[] = [];

  if (filters.who.length > 0) {
    const whoTags = filters.who.flatMap(w => WHO_TAGS[w]);
    if (whoTags.some((t) => spot.whoItsFor.includes(t))) {
      const labels: Record<WhoId, string> = { friends: "Great for friends", couples: "Perfect for couples", solo: "Solo-friendly" };
      const firstMatched = filters.who.find(w => WHO_TAGS[w].some(t => spot.whoItsFor.includes(t)));
      if (firstMatched) parts.push(labels[firstMatched]);
    }
  }

  if (filters.feeling.length > 0) {
    const feelTags = filters.feeling.flatMap(f => FEELING_TAGS[f]);
    const matchedTag = feelTags.find((t) => spot.vibeTags.includes(t));
    if (matchedTag) {
      const readable = matchedTag.replace(/-/g, " ");
      parts.push(readable.charAt(0).toUpperCase() + readable.slice(1) + " vibes");
    }
  }

  if (spot.isFeatured) parts.push("Outsy Featured");

  if (parts.length === 0 && spot.vibeTags[0]) {
    const tag = spot.vibeTags[0].replace(/-/g, " ");
    parts.push(tag.charAt(0).toUpperCase() + tag.slice(1));
  }

  return parts.slice(0, 2).join(" · ");
}

// ── Result card ───────────────────────────────────────────────────────────

function ResultCard({ spot, filters, rank }: { spot: Spot; filters: FilterState; rank: number }) {
  const { isSaved, toggleSave } = useSavedSpots();
  const why = generateWhyPicked(spot, filters);

  const BUDGET_SYMBOLS: Record<string, string> = {
    budget: "₦",
    mid: "₦₦",
    splurge: "₦₦₦",
  };

  return (
    <div className={`rounded-3xl border border-border/50 bg-card overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:border-primary/30 ${spot.isFeatured ? "ring-2 ring-primary/20 shadow-xl" : "shadow-sm"}`}>
      {/* Image */}
      <Link href={`/spots/${spot.slug}`} className="block relative h-48 md:h-56 overflow-hidden">
        <Image
          src={spot.images[0]}
          alt={spot.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

        {/* Status Badges - Tightened Grouping */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          {/* Rank badge */}
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center shadow-lg border border-white/20">
            <span className="text-white text-[10px] font-black">{rank}</span>
          </div>
          
          <div className="flex items-center gap-1">
            {spot.isNew && (
              <div className="flex items-center gap-1 bg-green-500/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight shadow-sm">
                <RiTimerFlashLine className="h-2.5 w-2.5" />
                New
              </div>
            )}
            
            {spot.isFeatured && (
              <div className="flex items-center gap-1 bg-accent/90 backdrop-blur-sm text-accent-foreground px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight shadow-sm">
                <RiStarFill className="h-2.5 w-2.5" />
                Featured
              </div>
            )}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={(e) => { e.preventDefault(); toggleSave(spot.id); }}
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary transition-all active:scale-90"
          aria-label={isSaved(spot.id) ? "Remove from saved" : "Save"}
        >
          {isSaved(spot.id)
            ? <RiBookmarkFill className="h-4 w-4 text-accent" />
            : <RiBookmarkLine className="h-4 w-4" />}
        </button>

        {/* Category Label (floating) */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[9px] font-bold text-white uppercase tracking-wider">
            {spot.category}
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <Link href={`/spots/${spot.slug}`}>
            <h3 className="font-black text-lg text-foreground hover:text-primary transition-colors line-clamp-1 leading-tight tracking-tight">
              {spot.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <RiMapPinLine className="h-3.5 w-3.5 shrink-0 opacity-70" />
          <span className="text-xs font-medium">{spot.area}</span>
          <span className="flex h-1 w-1 rounded-full bg-border" />
          <span className="text-xs font-black text-foreground/60">{BUDGET_SYMBOLS[spot.budgetTier]}</span>
        </div>

        {why && (
          <div className="flex items-center gap-2 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <p className="text-xs font-bold text-primary uppercase tracking-widest text-[10px]">
              {why}
            </p>
          </div>
        )}

        <Link
          href={`/spots/${spot.slug}`}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-secondary text-white text-sm font-black uppercase tracking-widest hover:bg-secondary/90 hover:scale-[1.02] transition-all active:scale-[0.98] shadow-lg shadow-secondary/20"
        >
          Explore Spot
          <RiArrowRightLine className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}


// ── Main component ────────────────────────────────────────────────────────

interface SmartFilterProps {
  allSpots: Spot[];
}

export function SmartFilter({ allSpots }: SmartFilterProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({
    activities: [],
    who: [],
    feeling: [],
    budget: [],
  });
  const [showResults, setShowResults] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  // Compute filtered + shuffled results
  const allResults = useMemo(() => runFilter(allSpots, filters), [allSpots, filters, shuffleSeed]);
  const results = allResults.slice(0, 3);

  const toggleOption = (category: keyof FilterState, id: string) => {
    setFilters((prev) => {
      const current = prev[category] as string[];
      if (current.includes(id)) {
        return { ...prev, [category]: current.filter((x) => x !== id) };
      }
      return { ...prev, [category]: [...current, id] };
    });
  };

  const clearAll = () => {
    setFilters({ activities: [], who: [], feeling: [], budget: [] });
  };

  const hasAnyFilter = filters.activities.length > 0 || filters.who.length > 0 || filters.feeling.length > 0 || filters.budget.length > 0;

  function handleBack() {
    if (showResults) {
      setShowResults(false);
    } else {
      router.push("/");
    }
  }

  function handleShuffle() {
    setShuffleSeed((s) => s + 1);
  }

  function handlePickForMe() {
    const pool = allResults.length > 3 ? allResults.slice(3) : allResults;
    if (pool.length === 0) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    router.push(`/spots/${pick.slug}`);
  }

  function handleReset() {
    clearAll();
    setShowResults(false);
    setShuffleSeed(0);
  }

  // ── Results view ────────────────────────────────────────────────────
  if (showResults) {
    return (
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors shrink-0"
            aria-label="Back"
          >
            <RiArrowLeftLine className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">
              {results.length > 0 ? `We found ${allResults.length} spot${allResults.length !== 1 ? "s" : ""}` : "No matches found"}
            </h2>
            <p className="text-xs text-muted-foreground">Tailored to your vibe</p>
          </div>
        </div>

        {/* Filter summary pills */}
        <div className="flex flex-wrap gap-2">
          {[...filters.activities, ...filters.who, ...filters.feeling, ...filters.budget].map((id) => {
            const allOpts = [...ACTIVITY_OPTIONS, ...WHO_OPTIONS, ...FEELING_OPTIONS, ...BUDGET_OPTIONS];
            const opt = allOpts.find(o => o.id === id);
            if (!opt) return null;
            return (
              <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                <opt.Icon className="h-3 w-3" />
                {opt.label}
              </span>
            );
          })}
          {hasAnyFilter && (
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium hover:text-foreground transition-colors flex items-center gap-1"
            >
              <RiCloseLine className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Action row */}
        <div className="flex gap-3">
          <button
            onClick={handleShuffle}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            <RiShuffleLine className="h-4 w-4" />
            Shuffle
          </button>
          <button
            onClick={handlePickForMe}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            Pick for me
          </button>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((spot, i) => (
              <ResultCard key={spot.id} spot={spot} filters={filters} rank={i + 1} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-muted/20 p-12 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <RiShuffleLine className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm mb-4 font-medium">No spots matched these filters perfectly.</p>
            <button onClick={handleReset} className="text-primary font-bold text-sm hover:underline underline-offset-4">
              Try broader search
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Single Page Filter view ─────────────────────────────────────────

  const FilterGroup = ({ title, category, options }: { title: string; category: keyof FilterState; options: typeof ACTIVITY_OPTIONS | typeof WHO_OPTIONS | typeof FEELING_OPTIONS | typeof BUDGET_OPTIONS }) => (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-bold text-foreground/70 uppercase tracking-wider px-1">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((option) => {
          const isSelected = (filters[category] as string[]).includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => toggleOption(category, option.id)}
              className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all active:scale-[0.96] text-center ${
                isSelected
                  ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                  : "border-border bg-card text-foreground hover:border-primary/30"
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                  <RiCheckLine className="h-3 w-3 text-white" />
                </div>
              )}
              <option.Icon className={`h-6 w-6 ${isSelected ? "text-white" : "text-primary"}`} />
              <div className="flex flex-col">
                <span className="text-xs font-bold leading-tight line-clamp-1">{option.label}</span>
                {"price" in option && (
                   <span className={`text-[10px] font-black mt-0.5 opacity-80`}>{option.price}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <RiArrowLeftLine className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Find a Spot</h2>
            <p className="text-xs text-muted-foreground font-medium">Pick one or more vibes</p>
          </div>
        </div>
        {hasAnyFilter && (
          <button onClick={clearAll} className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
            Reset
          </button>
        )}
      </div>

      <div className="flex flex-col gap-8">
        <FilterGroup title="What" category="activities" options={ACTIVITY_OPTIONS} />
        <FilterGroup title="Who" category="who" options={WHO_OPTIONS} />
        <FilterGroup title="Vibe" category="feeling" options={FEELING_OPTIONS} />
        <FilterGroup title="Budget" category="budget" options={BUDGET_OPTIONS} />
      </div>

      {/* Persistent Footer CTA */}
      <div className="fixed bottom-6 left-6 right-6 flex justify-center z-50 pointer-events-none">
        <button
          onClick={() => setShowResults(true)}
          className={`pointer-events-auto flex items-center justify-center gap-3 w-full max-w-md py-4 rounded-2xl bg-secondary text-white font-bold text-base shadow-2xl transition-all active:scale-[0.98] ${
            !hasAnyFilter ? "opacity-90 grayscale-[0.5]" : "opacity-100"
          }`}
        >
          {hasAnyFilter 
            ? `See ${allResults.length} matches` 
            : "Show all spots"}
          <RiArrowRightLine className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

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
} from "react-icons/ri";
import type { Spot } from "@/lib/types";
import { useSavedSpots } from "@/lib/hooks/useSavedSpots";

// ── Filter option definitions ─────────────────────────────────────────────

type ActivityId = "eat" | "drinks" | "outdoors" | "activity";
type WhoId = "friends" | "couples" | "solo";
type FeelingId = "chill" | "party" | "date-night";
type BudgetId = "budget" | "mid" | "splurge";

interface FilterState {
  activity: ActivityId | null;
  who: WhoId | null;
  feeling: FeelingId | null;
  budget: BudgetId | null;
}

const STEPS = ["activity", "who", "feeling", "budget"] as const;
type StepKey = (typeof STEPS)[number];

const ACTIVITY_OPTIONS = [
  { id: "eat" as ActivityId, label: "Let's Eat", sub: "Restaurants & cafés", Icon: RiRestaurantLine },
  { id: "drinks" as ActivityId, label: "Grab Drinks", sub: "Bars & nightlife", Icon: RiDrinksLine },
  { id: "outdoors" as ActivityId, label: "Go Outdoors", sub: "Parks & beaches", Icon: RiLeafLine },
  { id: "activity" as ActivityId, label: "Do an Activity", sub: "Things to do", Icon: RiRunLine },
];

const WHO_OPTIONS = [
  { id: "friends" as WhoId, label: "With Friends", sub: "Squad, crew or group", Icon: RiGroupLine },
  { id: "couples" as WhoId, label: "With a Partner", sub: "Date night or couple", Icon: RiHeartLine },
  { id: "solo" as WhoId, label: "Flying Solo", sub: "Just you", Icon: RiUserLine },
];

const FEELING_OPTIONS = [
  { id: "chill" as FeelingId, label: "Chill Vibes", sub: "Low-key, relaxed", Icon: RiMoonLine },
  { id: "party" as FeelingId, label: "Party Mode", sub: "Loud, fun, dancing", Icon: RiFireLine },
  { id: "date-night" as FeelingId, label: "Date Night", sub: "Romantic, special", Icon: RiSparkling2Line },
];

const BUDGET_OPTIONS = [
  { id: "budget" as BudgetId, label: "Budget", sub: "Keep it affordable", Icon: RiMoneyDollarCircleLine, price: "₦" },
  { id: "mid" as BudgetId, label: "Mid-range", sub: "Good value", Icon: RiMoneyDollarCircleLine, price: "₦₦" },
  { id: "splurge" as BudgetId, label: "Splurge", sub: "Worth every naira", Icon: RiVipCrownLine, price: "₦₦₦" },
];

const STEP_LABELS: Record<StepKey, string> = {
  activity: "What are you up for?",
  who: "Who are you going with?",
  feeling: "What's the vibe?",
  budget: "What's your budget?",
};

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

  // Hard match: activity → category (must match or score 0)
  if (filters.activity) {
    const validCategories = ACTIVITY_CATEGORIES[filters.activity];
    if (!validCategories.includes(spot.category)) return -1;
    score += 10;
  }

  // Who (soft — bonus points)
  if (filters.who) {
    const whoTags = WHO_TAGS[filters.who];
    const whoMatch = whoTags.some((t) => spot.whoItsFor.includes(t)) || spot.whoItsFor.includes("everyone");
    if (whoMatch) score += 5;
  }

  // Feeling (soft — bonus points)
  if (filters.feeling) {
    const feelTags = FEELING_TAGS[filters.feeling];
    const feelMatch = feelTags.some((t) => spot.vibeTags.includes(t));
    if (feelMatch) score += 5;
  }

  // Budget (soft — bonus points)
  if (filters.budget) {
    if (spot.budgetTier === filters.budget) score += 8;
  }

  // Popularity tiebreaker
  score += Math.min(spot.goingNowCount, 5);

  return score;
}

function runFilter(spots: Spot[], filters: FilterState): Spot[] {
  return spots
    .map((spot) => ({ spot, score: scoreSpot(spot, filters) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ spot }) => spot);
}

function generateWhyPicked(spot: Spot, filters: FilterState): string {
  const parts: string[] = [];

  if (filters.who) {
    const whoTags = WHO_TAGS[filters.who];
    if (whoTags.some((t) => spot.whoItsFor.includes(t))) {
      const labels: Record<WhoId, string> = { friends: "Great for friends", couples: "Perfect for couples", solo: "Solo-friendly" };
      parts.push(labels[filters.who]);
    }
  }

  if (filters.feeling) {
    const feelTags = FEELING_TAGS[filters.feeling];
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

  const BUDGET_COLOR: Record<string, string> = {
    budget: "bg-green-100 text-green-700",
    mid: "bg-amber-100 text-amber-700",
    splurge: "bg-primary/10 text-primary",
  };

  const BUDGET_LABELS: Record<string, string> = {
    budget: "Budget",
    mid: "Mid-range",
    splurge: "Splurge",
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden group">
      {/* Image */}
      <Link href={`/spots/${spot.slug}`} className="block relative h-44 md:h-52 overflow-hidden">
        <Image
          src={spot.images[0]}
          alt={spot.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

        {/* Rank badge */}
        <div className="absolute top-3 left-3 h-7 w-7 rounded-full bg-primary flex items-center justify-center">
          <span className="text-white text-xs font-bold">{rank}</span>
        </div>

        {/* Budget */}
        <div className="absolute top-3 right-3">
          <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${BUDGET_COLOR[spot.budgetTier] ?? "bg-muted text-muted-foreground"}`}>
            {BUDGET_LABELS[spot.budgetTier]}
          </span>
        </div>

        {/* Save button */}
        <button
          onClick={(e) => { e.preventDefault(); toggleSave(spot.id); }}
          className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          aria-label={isSaved(spot.id) ? "Remove from saved" : "Save"}
        >
          {isSaved(spot.id)
            ? <RiBookmarkFill className="h-4 w-4 text-accent" />
            : <RiBookmarkLine className="h-4 w-4" />}
        </button>
      </Link>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link href={`/spots/${spot.slug}`}>
            <h3 className="font-bold text-base text-foreground hover:text-primary transition-colors">
              {spot.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground mb-2">
          <RiMapPinLine className="h-3.5 w-3.5 shrink-0" />
          <span className="text-xs">{spot.area}, {spot.city}</span>
        </div>

        {why && (
          <p className="text-xs font-medium text-primary bg-primary/8 rounded-full px-3 py-1 inline-block mb-3">
            {why}
          </p>
        )}

        <Link
          href={`/spots/${spot.slug}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-secondary text-white text-sm font-semibold hover:bg-secondary/90 transition-colors"
        >
          View spot
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
  const [stepIndex, setStepIndex] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    activity: null,
    who: null,
    feeling: null,
    budget: null,
  });
  const [showResults, setShowResults] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const currentStep = STEPS[stepIndex];
  const currentValue = filters[currentStep];
  const isLastStep = stepIndex === STEPS.length - 1;

  // Compute filtered + shuffled results
  const allResults = useMemo(() => runFilter(allSpots, filters), [allSpots, filters, shuffleSeed]); // eslint-disable-line react-hooks/exhaustive-deps
  const results = allResults.slice(0, 3);

  function selectOption(value: string) {
    setFilters((prev) => ({ ...prev, [currentStep]: value }));
  }

  function handleNext() {
    if (!currentValue) return;
    if (isLastStep) {
      setShowResults(true);
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  function handleBack() {
    if (showResults) {
      setShowResults(false);
    } else if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
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
    setFilters({ activity: null, who: null, feeling: null, budget: null });
    setStepIndex(0);
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
            className="h-9 w-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors shrink-0"
            aria-label="Back"
          >
            <RiArrowLeftLine className="h-4 w-4" />
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground">
              {results.length > 0 ? `We found ${results.length} spot${results.length !== 1 ? "s" : ""}` : "No matches found"}
            </h2>
            <p className="text-xs text-muted-foreground">Based on your choices</p>
          </div>
        </div>

        {/* Filter summary pills */}
        <div className="flex flex-wrap gap-2">
          {filters.activity && (
            <span className="chip bg-secondary/10 text-secondary text-xs">
              {ACTIVITY_OPTIONS.find((o) => o.id === filters.activity)?.label}
            </span>
          )}
          {filters.who && (
            <span className="chip bg-secondary/10 text-secondary text-xs">
              {WHO_OPTIONS.find((o) => o.id === filters.who)?.label}
            </span>
          )}
          {filters.feeling && (
            <span className="chip bg-secondary/10 text-secondary text-xs">
              {FEELING_OPTIONS.find((o) => o.id === filters.feeling)?.label}
            </span>
          )}
          {filters.budget && (
            <span className="chip bg-secondary/10 text-secondary text-xs capitalize">
              {filters.budget}
            </span>
          )}
          <button
            onClick={handleReset}
            className="chip bg-muted text-muted-foreground text-xs hover:text-foreground transition-colors"
          >
            Start over
          </button>
        </div>

        {/* Action row */}
        <div className="flex gap-3">
          <button
            onClick={handleShuffle}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            <RiShuffleLine className="h-4 w-4" />
            Shuffle
          </button>
          <button
            onClick={handlePickForMe}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            Pick for me
          </button>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((spot, i) => (
              <ResultCard key={spot.id} spot={spot} filters={filters} rank={i + 1} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-muted/30 p-10 text-center">
            <p className="text-muted-foreground mb-3">No spots matched these filters.</p>
            <button onClick={handleReset} className="text-primary font-semibold text-sm underline underline-offset-2">
              Try different options
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Step view ───────────────────────────────────────────────────────
  const stepOptions =
    currentStep === "activity" ? ACTIVITY_OPTIONS
    : currentStep === "who" ? WHO_OPTIONS
    : currentStep === "feeling" ? FEELING_OPTIONS
    : BUDGET_OPTIONS;

  const cols = stepOptions.length === 4 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-3";

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Back + progress */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleBack}
          className="h-9 w-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors shrink-0"
          aria-label="Back"
        >
          <RiArrowLeftLine className="h-4 w-4" />
        </button>

        {/* Step dots */}
        <div className="flex items-center gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i < stepIndex
                  ? "w-6 bg-primary"
                  : i === stepIndex
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        <span className="text-xs text-muted-foreground ml-auto shrink-0">
          {stepIndex + 1} of {STEPS.length}
        </span>
      </div>

      {/* Question */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">{STEP_LABELS[currentStep]}</h2>
        <p className="text-sm text-muted-foreground mt-1">Pick one to continue</p>
      </div>

      {/* Options grid */}
      <div className={`grid ${cols} gap-3`}>
        {stepOptions.map((option) => {
          const isSelected = currentValue === option.id;
          return (
            <button
              key={option.id}
              onClick={() => selectOption(option.id)}
              className={`relative flex flex-col items-start gap-3 p-5 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${
                isSelected
                  ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                  : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/40"
              }`}
            >
              {/* Check indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">
                  <RiCheckLine className="h-3 w-3 text-white" />
                </div>
              )}

              <option.Icon
                className={`h-7 w-7 ${isSelected ? "text-white" : "text-primary"}`}
              />

              <div>
                <p className={`font-bold text-base leading-tight ${isSelected ? "text-white" : "text-foreground"}`}>
                  {option.label}
                </p>
                {"sub" in option && (
                  <p className={`text-xs mt-0.5 ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>
                    {option.sub}
                  </p>
                )}
                {"price" in option && (
                  <p className={`text-sm font-bold mt-1 ${isSelected ? "text-white/90" : "text-primary"}`}>
                    {option.price}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Next button */}
      <button
        onClick={handleNext}
        disabled={!currentValue}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-secondary text-white font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary/90 active:scale-[0.99]"
      >
        {isLastStep ? "Show me spots" : "Next"}
        <RiArrowRightLine className="h-5 w-5" />
      </button>
    </div>
  );
}

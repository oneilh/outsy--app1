import type { Metadata } from "next";
import Link from "next/link";
import {
  RiMapPinLine,
  RiLayoutGridLine,
  RiGroupLine,
  RiSearchLine,
  RiBookmarkLine,
  RiEqualizerLine,
  RiInstagramLine,
} from "react-icons/ri";

export const metadata: Metadata = {
  title: "About — Outsy",
  description: "Outsy is Lagos's curated outing guide. Open it. Pick a spot. Go out.",
};

const STATS = [
  { value: "31", label: "Curated spots" },
  { value: "12", label: "Collections" },
  { value: "6",  label: "Neighbourhoods" },
  { value: "8",  label: "Categories" },
];

const HOW_IT_WORKS = [
  {
    icon: RiSearchLine,
    title: "Browse or search",
    body: "Filter by category, budget, area, or mood. No account needed.",
  },
  {
    icon: RiBookmarkLine,
    title: "Save your favourites",
    body: "Bookmark spots to your personal saved list so you never lose track.",
  },
  {
    icon: RiEqualizerLine,
    title: "Compare side by side",
    body: "Pick two or three spots and compare price, vibe, and location at a glance.",
  },
  {
    icon: RiGroupLine,
    title: "See who's going",
    body: "Real-time going-now counts show you which spots are buzzing tonight.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="relative overflow-hidden bg-secondary px-6 pt-16 pb-14 text-center">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-12 -left-12 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />

        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 uppercase tracking-widest">
          <RiMapPinLine className="h-3.5 w-3.5" /> Lagos, Nigeria
        </p>
        <h1 className="text-4xl font-bold text-white leading-tight">
          Open it.<br />Pick a spot.<br />Go out.
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-base text-white/70 leading-relaxed">
          Outsy is Lagos's no-fuss outing guide — curated spots, real vibes, zero endless scrolling.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
        >
          Find a spot tonight
        </Link>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border border-b border-border">
        {STATS.map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center justify-center py-8 gap-1">
            <span className="text-3xl font-bold text-primary">{value}</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
          </div>
        ))}
      </section>

      {/* Mission */}
      <section className="px-6 py-14 max-w-xl mx-auto text-center">
        <RiLayoutGridLine className="mx-auto mb-4 h-8 w-8 text-primary" />
        <h2 className="text-2xl font-bold text-foreground mb-4">Why Outsy?</h2>
        <p className="text-base text-foreground/70 leading-relaxed">
          Finding a good spot in Lagos shouldn't require three apps, a group chat argument,
          and fifteen minutes of indecision. Outsy cuts straight to the point — every listing
          is hand-picked, price-tagged, and vibe-labelled so you can decide in seconds, not hours.
        </p>
      </section>

      {/* How it works */}
      <section className="bg-muted/50 px-6 py-14">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-bold text-foreground text-center mb-8">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {HOW_IT_WORKS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl bg-card border border-border p-5">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 text-primary mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + social */}
      <section className="px-6 py-14 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-foreground mb-2">Ready to go out?</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Browse 31 hand-picked spots across Lagos — no sign-up required.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
          >
            Explore spots
          </Link>
          <Link
            href="/collections"
            className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            View collections
          </Link>
        </div>

        <div className="mt-10 border-t border-border pt-8 flex flex-col items-center gap-2">
          <a
            href="https://instagram.com/outsyapp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <RiInstagramLine className="h-4 w-4" />
            @outsyapp
          </a>
          <p className="text-xs text-muted-foreground">
            Built with love for Lagos nights out.
          </p>
        </div>
      </section>

    </div>
  );
}

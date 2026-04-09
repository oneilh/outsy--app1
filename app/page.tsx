import Link from "next/link";
import { RiMapPinFill, RiArrowRightLine } from "react-icons/ri";
import { getOutsyPicks, getTrendingSpots, getDiscoverSpots, getAllSpots } from "@/lib/data";
import { OutsyPicksCarousel } from "@/components/home/OutsyPicksCarousel";
import { FilteredTrending } from "@/components/home/FilteredTrending";
import { DiscoverSection } from "@/components/home/DiscoverSection";
import { RandomSpotButton } from "@/components/home/RandomSpotButton";

import { PageContainer } from "@/components/layout/PageContainer";

export default async function Home() {
  const picks = await getOutsyPicks();
  const trending = await getTrendingSpots(15); 
  const discoverSpots = await getDiscoverSpots(4);
  const allSpots = await getAllSpots();
  const allSlugs = allSpots.map((s) => s.slug);

  return (
    <PageContainer className="pb-24 md:pb-10">
      <div className="flex flex-col gap-8">
        {/* ── Filter CTA hero ─────────────────────────────────────────── */}
        <div className="rounded-3xl bg-secondary text-white px-6 py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <RiMapPinFill className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">Lagos</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              Where to tonight?
            </h1>
            <p className="text-sm text-white/60 mt-1">
              Tell us your vibe — we&apos;ll pick the spot.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href="/filter"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-lg text-center"
            >
              Find a spot
              <RiArrowRightLine className="h-4 w-4" />
            </Link>
            <Link
              href="/spots"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 active:scale-95 transition-all border border-white/20 text-center"
            >
              Browse all
            </Link>
          </div>
        </div>

        {/* Outsy Picks carousel — full width */}
        <OutsyPicksCarousel picks={picks} />

        {/* ── Desktop 2-column split ── */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] lg:gap-10">

          {/* Left: Trending - Now stacked and limited to 5 with See All */}
          <div className="flex flex-col gap-6">
            <FilteredTrending spots={trending} />
          </div>

          {/* Right sidebar: Discover (Tabs: Morning, Afternoon, Night) + Random CTA */}
          <aside className="flex flex-col gap-10 mt-8 lg:mt-0">
            {/* Discover Section - The new Story-like UI */}
            <DiscoverSection morning={discoverSpots.morning} afternoon={discoverSpots.afternoon} night={discoverSpots.night} />

            {/* Random pick CTA */}
            <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3">
              <div>
                <h3 className="font-bold text-base text-foreground">Can&apos;t decide?</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Let Outsy pick a spot for you — one tap, no thinking.</p>
              </div>
              <RandomSpotButton slugs={allSlugs} />
            </div>
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}


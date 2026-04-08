import { getOutsyPicks, getTrendingSpots, getAllCollections } from "@/lib/data";
import { OutsyPicksCarousel } from "@/components/home/OutsyPicksCarousel";
import { TrendingSection } from "@/components/home/TrendingSection";
import { CollectionsGrid } from "@/components/home/CollectionsGrid";
import { CategoryFilter } from "@/components/home/CategoryFilter";

export default function Home() {
  const picks = getOutsyPicks();
  const trending = getTrendingSpots(10);
  const collections = getAllCollections();

  return (
    <div className="flex flex-col gap-8 py-6">
      {/* Hero: Outsy Picks carousel */}
      <OutsyPicksCarousel picks={picks} />

      {/* Category filter chips */}
      <div className="-mb-2">
        <CategoryFilter />
      </div>

      {/* Trending spots horizontal scroll */}
      <TrendingSection spots={trending} />

      {/* Collections grid */}
      <CollectionsGrid collections={collections} />
    </div>
  );
}

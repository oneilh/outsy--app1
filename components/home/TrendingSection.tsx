import Link from "next/link";
import { RiArrowRightLine, RiFlashlightLine } from "react-icons/ri";
import { SpotCard } from "./SpotCard";
import type { Spot } from "@/lib/types";

interface TrendingSectionProps {
  spots: Spot[];
}

export function TrendingSection({ spots }: TrendingSectionProps) {
  return (
    <section className="w-full">
      <div className="flex items-center justify-between px-4 mb-3 lg:px-8">
        <div className="flex items-center gap-2">
          <RiFlashlightLine className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-bold text-foreground">Trending Now</h2>
        </div>
        <Link
          href="/spots"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          See all
          <RiArrowRightLine className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 lg:px-8 pb-2 scrollbar-none snap-x snap-mandatory">
        {spots.map((spot) => (
          <div key={spot.id} className="snap-start">
            <SpotCard spot={spot} />
          </div>
        ))}
      </div>
    </section>
  );
}

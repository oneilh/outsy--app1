import Link from "next/link";
import Image from "next/image";
import { RiTimeLine, RiMapPinLine, RiArrowRightLine } from "react-icons/ri";
import type { Spot } from "@/lib/types";

interface TimeBasedSectionProps {
  label: string;
  spots: Spot[];
}

const BUDGET_DOT: Record<string, string> = {
  budget: "bg-green-400",
  mid: "bg-accent",
  splurge: "bg-primary",
};

export function TimeBasedSection({ label, spots }: TimeBasedSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <RiTimeLine className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">{label}</h2>
        </div>
        <Link
          href="/spots"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          See all
          <RiArrowRightLine className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {spots.map((spot) => (
          <Link
            key={spot.id}
            href={`/spots/${spot.slug}`}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 hover:border-primary/40 hover:shadow-sm transition-all group"
          >
            <div className="relative h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden">
              <Image
                src={spot.images[0]}
                alt={spot.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="64px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {spot.name}
              </h3>
              <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                <RiMapPinLine className="h-3 w-3 flex-shrink-0" />
                <span className="text-xs">{spot.area}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`h-2 w-2 rounded-full flex-shrink-0 ${BUDGET_DOT[spot.budgetTier] ?? "bg-muted"}`}
                />
                <span className="text-xs text-muted-foreground">{spot.priceRange}</span>
              </div>
            </div>
            {spot.vibeTags[0] && (
              <span className="hidden sm:inline-flex flex-shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground">
                {spot.vibeTags[0]}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

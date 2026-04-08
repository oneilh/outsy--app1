"use client";

import { useState, useMemo } from "react";
import { CategoryFilter } from "./CategoryFilter";
import { TrendingSection } from "./TrendingSection";
import type { Spot, SpotCategory } from "@/lib/types";

interface FilteredTrendingProps {
  spots: Spot[];
}

type CategoryFilterValue = SpotCategory | "all";

export function FilteredTrending({ spots }: FilteredTrendingProps) {
  const [category, setCategory] = useState<CategoryFilterValue>("all");

  const filtered = useMemo(
    () => (category === "all" ? spots : spots.filter((s) => s.category === category)),
    [spots, category]
  );

  return (
    <>
      <div className="-mb-2">
        <CategoryFilter onCategoryChange={setCategory} />
      </div>
      <TrendingSection spots={filtered} />
    </>
  );
}

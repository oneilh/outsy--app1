"use client";

import { useState } from "react";
import {
  RiRestaurantLine,
  RiCupLine,
  RiLeafLine,
  RiGamepadLine,
  RiMoonLine,
  RiLayoutGridLine
} from "react-icons/ri";

const CATEGORIES = [
  { id: "all", label: "All", Icon: RiLayoutGridLine },
  { id: "eating", label: "Eating", Icon: RiRestaurantLine },
  { id: "drinking", label: "Drinking", Icon: RiCupLine },
  { id: "outdoors", label: "Outdoors", Icon: RiLeafLine },
  { id: "activities", label: "Activities", Icon: RiGamepadLine },
  { id: "nightlife", label: "Nightlife", Icon: RiMoonLine },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

interface CategoryFilterProps {
  onCategoryChange?: (category: CategoryId) => void;
}

export function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  const [active, setActive] = useState<CategoryId>("all");

  function handleSelect(id: CategoryId) {
    setActive(id);
    onCategoryChange?.(id);
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {CATEGORIES.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => handleSelect(id)}
            className={`chip flex-shrink-0 gap-1.5 border transition-all ${
              isActive
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

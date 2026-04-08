import { RiSparklingLine } from "react-icons/ri";

interface VibeTagListProps {
  tags: string[];
}

const TAG_LABELS: Record<string, string> = {
  "date-night": "Date Night",
  "buzzy": "Buzzy",
  "upscale": "Upscale",
  "artistic": "Artistic",
  "fancy": "Fancy",
  "panoramic-views": "Panoramic Views",
  "chill": "Chill",
  "garden": "Garden",
  "local-vibes": "Local Vibes",
  "brunch": "Brunch",
  "rooftop": "Rooftop",
  "cocktails": "Cocktails",
  "lively": "Lively",
  "hidden-gem": "Hidden Gem",
  "family-friendly": "Family Friendly",
  "scenic": "Scenic",
  "outdoor": "Outdoor",
  "pool": "Pool",
  "nightlife": "Nightlife",
  "live-music": "Live Music",
  "cosy": "Cosy",
  "aesthetic": "Aesthetic",
  "trendy": "Trendy",
  "romantic": "Romantic",
  "beachfront": "Beachfront",
  "tropical": "Tropical",
  "adventure": "Adventure",
  "cultural": "Cultural",
};

function formatTag(tag: string): string {
  return TAG_LABELS[tag] ?? tag
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function VibeTagList({ tags }: VibeTagListProps) {
  if (!tags.length) return null;

  return (
    <div>
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
        <RiSparklingLine className="h-4 w-4" />
        Vibe
      </h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-surface text-secondary border border-border"
          >
            {formatTag(tag)}
          </span>
        ))}
      </div>
    </div>
  );
}

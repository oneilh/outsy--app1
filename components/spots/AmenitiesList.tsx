import {
  RiSofaLine,
  RiCalendarCheckLine,
  RiParkingBoxLine,
  RiAnchorLine,
  RiGobletLine,
  RiPlantLine,
  RiMusic2Line,
  RiWifiLine,
  RiBuilding4Line,
  RiWaterPercentLine,
  RiCarLine,
  RiDoorLine,
  RiSunLine,
  RiFireLine,
  RiShieldCheckLine,
  RiRestaurantLine,
} from "react-icons/ri";
import type { ReactElement } from "react";

interface AmenitiesListProps {
  amenities: string[];
}

const AMENITY_MAP: Record<string, { label: string; icon: ReactElement }> = {
  "outdoor-seating":      { label: "Outdoor Seating",       icon: <RiSofaLine /> },
  "reservations":         { label: "Takes Reservations",    icon: <RiCalendarCheckLine /> },
  "parking":              { label: "Parking",                icon: <RiParkingBoxLine /> },
  "ocean-view":           { label: "Ocean View",             icon: <RiAnchorLine /> },
  "valet-parking":        { label: "Valet Parking",          icon: <RiCarLine /> },
  "full-bar":             { label: "Full Bar",               icon: <RiGobletLine /> },
  "garden-seating":       { label: "Garden Seating",         icon: <RiPlantLine /> },
  "live-music-weekends":  { label: "Live Music (Weekends)",  icon: <RiMusic2Line /> },
  "live-music":           { label: "Live Music",             icon: <RiMusic2Line /> },
  "wifi":                 { label: "Free WiFi",              icon: <RiWifiLine /> },
  "rooftop":              { label: "Rooftop",                icon: <RiBuilding4Line /> },
  "pool":                 { label: "Pool",                   icon: <RiWaterPercentLine /> },
  "private-parking":      { label: "Private Parking",        icon: <RiParkingBoxLine /> },
  "private-dining":       { label: "Private Dining",         icon: <RiDoorLine /> },
  "terrace":              { label: "Terrace",                icon: <RiSunLine /> },
  "bbq":                  { label: "BBQ",                    icon: <RiFireLine /> },
  "security":             { label: "Security",               icon: <RiShieldCheckLine /> },
  "kitchen":              { label: "Full Kitchen",           icon: <RiRestaurantLine /> },
};

function getAmenity(key: string): { label: string; icon: ReactElement } {
  if (AMENITY_MAP[key]) return AMENITY_MAP[key];
  const label = key
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return { label, icon: <RiShieldCheckLine /> };
}

export function AmenitiesList({ amenities }: AmenitiesListProps) {
  if (!amenities.length) return null;

  return (
    <div>
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Amenities
      </h2>
      <div className="flex flex-wrap gap-2">
        {amenities.map((key) => {
          const { label, icon } = getAmenity(key);
          return (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-muted text-foreground"
            >
              <span className="h-4 w-4 text-primary shrink-0">{icon}</span>
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

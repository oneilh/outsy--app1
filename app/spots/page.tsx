import type { Metadata } from "next";
import SpotsClient from "./SpotsClient";

export const metadata: Metadata = {
  title: "Browse All Spots in Lagos | Outsy",
  description: "Explore curated restaurants, bars, cafes, and activities in Lagos. Filter by category, price, and vibe to find your next outing fast.",
  openGraph: {
    title: "Browse All Spots in Lagos | Outsy",
    description: "Explore curated restaurants, bars, cafes, and activities in Lagos. Find your next move in under 60 seconds.",
    type: "website",
  },
};

import { getAllSpots } from "@/lib/data";

export default async function SpotsPage() {
  const spots = await getAllSpots();
  return <SpotsClient initialSpots={spots} />;
}

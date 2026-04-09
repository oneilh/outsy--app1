import type { Metadata } from "next";
import SavedClient from "./SavedClient";

export const metadata: Metadata = {
  title: "Your Saved Spots | My Library — Outsy",
  description: "Access your curated list of favorite spots in Lagos. Plan your next move with your personal collection of top-rated restaurants, bars, and activities.",
  openGraph: {
    title: "My Library — Outsy",
    description: "Your curated hitlist of the best spots in Lagos.",
    type: "website",
  },
};

export default function SavedPage() {
  return <SavedClient />;
}

import type { Metadata } from "next";
import CompareClient from "./CompareClient";

export const metadata: Metadata = {
  title: "Compare Spots | Side-by-Side Analysis — Outsy",
  description: "Compare your top Lagos spot choices side-by-side. Analyze vibe, price, and amenities to make the perfect decision for your next outing.",
  openGraph: {
    title: "The Shortlist: Compare Spots — Outsy",
    description: "Compare vibes, price, and locations of your favorite spots side-by-side.",
    type: "website",
  },
};

export default function ComparePage() {
  return <CompareClient />;
}

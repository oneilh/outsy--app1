import type { Metadata } from "next";
import { SmartFilter } from "@/components/filter/SmartFilter";

export const metadata: Metadata = {
  title: "Find a Spot — Outsy",
  description: "Tell us your vibe and we'll find the perfect Lagos spot for you.",
};

export default function FilterPage() {
  return <SmartFilter />;
}

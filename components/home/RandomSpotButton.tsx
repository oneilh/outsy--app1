"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RiShuffleLine } from "react-icons/ri";

interface RandomSpotButtonProps {
  slugs: string[];
}

export function RandomSpotButton({ slugs }: RandomSpotButtonProps) {
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);

  function handlePick() {
    if (slugs.length === 0) return;
    setSpinning(true);
    const slug = slugs[Math.floor(Math.random() * slugs.length)];
    setTimeout(() => {
      router.push(`/spots/${slug}`);
      setSpinning(false);
    }, 350);
  }

  return (
    <button
      onClick={handlePick}
      className="flex items-center gap-2 px-5 py-3 rounded-full bg-secondary text-white font-semibold text-sm shadow-sm hover:bg-secondary/90 active:scale-95 transition-all"
    >
      <RiShuffleLine className={`h-5 w-5 transition-transform ${spinning ? "rotate-180" : ""}`} />
      Pick a spot for me
    </button>
  );
}

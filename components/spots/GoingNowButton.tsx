"use client";

import { useState, useEffect } from "react";
import { RiFlashlightLine, RiFlashlightFill } from "react-icons/ri";
import posthog from "posthog-js";

interface GoingNowButtonProps {
  spotId: string;
  variant?: "default" | "full";
}

export function GoingNowButton({ spotId, variant = "default" }: GoingNowButtonProps) {
  const storageKey = `outsy-going-${spotId}`;
  const [isGoing, setIsGoing] = useState(false);
  const [justToggled, setJustToggled] = useState(false);

  useEffect(() => {
    setIsGoing(localStorage.getItem(storageKey) === "true");
  }, [storageKey]);

  function handleToggle() {
    const next = !isGoing;
    localStorage.setItem(storageKey, String(next));
    setIsGoing(next);
    setJustToggled(true);
    
    posthog.capture("spot_going_now", {
      spot_id: spotId,
      is_going: next
    });

    setTimeout(() => setJustToggled(false), 2000);
  }

  return (
    <div className="w-full">
      <button
        onClick={handleToggle}
        className={`w-full flex items-center justify-center gap-3 px-6 rounded-2xl h-14 text-sm font-bold transition-all duration-500 active:scale-[0.97] group overflow-hidden relative shadow-xl ${
          isGoing
            ? "bg-secondary text-white shadow-secondary/20"
            : "bg-primary text-white shadow-primary/20 hover:brightness-105"
        }`}
      >
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex items-center gap-3 relative">
          {isGoing ? (
            <RiFlashlightFill className="h-5 w-5 animate-pulse text-accent" />
          ) : (
            <RiFlashlightLine className="h-5 w-5 group-hover:rotate-12 transition-transform" />
          )}
          <span>{isGoing ? "You're Going!" : "I'm Going Now"}</span>
        </div>
      </button>
    </div>
  );
}

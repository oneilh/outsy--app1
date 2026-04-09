"use client";

import { useState, useEffect } from "react";
import { RiFlashlightLine, RiFlashlightFill } from "react-icons/ri";

interface GoingNowButtonProps {
  spotId: string;
  initialCount: number;
  variant?: "default" | "full";
}

export function GoingNowButton({ spotId, initialCount, variant = "default" }: GoingNowButtonProps) {
  const storageKey = `outsy-going-${spotId}`;
  const [isGoing, setIsGoing] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [justToggled, setJustToggled] = useState(false);

  useEffect(() => {
    setIsGoing(localStorage.getItem(storageKey) === "true");
  }, [storageKey]);

  function handleToggle() {
    const next = !isGoing;
    localStorage.setItem(storageKey, String(next));
    setIsGoing(next);
    setCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
    setJustToggled(true);
    setTimeout(() => setJustToggled(false), 2000);
  }

  const isFull = variant === "full";

  return (
    <div className="w-full">
      <button
        onClick={handleToggle}
        className={`w-full flex items-center justify-between px-6 rounded-2xl h-14 text-sm font-bold transition-all duration-500 active:scale-[0.97] group overflow-hidden relative shadow-xl ${
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

        {count > 0 && (
          <div className="flex items-center gap-2 relative bg-black/20 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/10">
            <div className="flex -space-x-1.5">
              {[...Array(Math.min(2, count))].map((_, i) => (
                 <div key={i} className="h-4 w-4 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-[7px] font-black">
                    {String.fromCharCode(65 + i)}
                 </div>
              ))}
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter">{count}</span>
          </div>
        )}
      </button>
    </div>
  );
}

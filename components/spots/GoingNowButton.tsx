"use client";

import { useState, useEffect } from "react";
import { RiFlashlightLine, RiFlashlightFill } from "react-icons/ri";

interface GoingNowButtonProps {
  spotId: string;
  initialCount: number;
}

export function GoingNowButton({ spotId, initialCount }: GoingNowButtonProps) {
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
    setTimeout(() => setJustToggled(false), 1500);
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        onClick={handleToggle}
        className={`w-full flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-bold transition-all duration-200 active:scale-95 ${
          isGoing
            ? "bg-secondary text-white shadow-lg shadow-secondary/30"
            : "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90"
        }`}
      >
        {isGoing ? (
          <RiFlashlightFill className="h-5 w-5" />
        ) : (
          <RiFlashlightLine className="h-5 w-5" />
        )}
        {isGoing ? "You're Going!" : "I'm Going Now"}
      </button>

      <p
        className={`text-sm transition-all duration-300 ${
          justToggled ? "text-primary font-semibold" : "text-muted-foreground"
        }`}
      >
        {count > 0
          ? `${count} ${count === 1 ? "person" : "people"} going right now`
          : "Be the first to go"}
      </p>
    </div>
  );
}

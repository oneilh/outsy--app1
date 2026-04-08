"use client";

import { useState } from "react";
import { RiShareForwardLine, RiCheckLine } from "react-icons/ri";
import type { Spot } from "@/lib/types";

interface ShareSpotProps {
  spot: Spot;
}

export function ShareSpot({ spot }: ShareSpotProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: `${spot.name} — Outsy`,
      text: `Check out ${spot.name} in ${spot.area} on Outsy!`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-3 w-full p-4 hover:bg-muted transition-all active:scale-[0.98] group"
    >
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted text-foreground flex-shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        {copied ? (
          <RiCheckLine className="h-5 w-5 text-green-600" />
        ) : (
          <RiShareForwardLine className="h-5 w-5" />
        )}
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-semibold text-foreground">
          {copied ? "Link copied!" : "Share spot"}
        </p>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Spread the word
        </p>
      </div>
    </button>
  );
}

"use client";

import { useState } from "react";
import { RiShareForwardLine, RiCheckLine } from "react-icons/ri";
import posthog from "posthog-js";
import type { Spot } from "@/lib/types";

interface ShareSpotProps {
  spot: Spot;
  variant?: "default" | "grid-item";
}

export function ShareSpot({ spot, variant = "default" }: ShareSpotProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const shareData = {
      title: `${spot.name} — Outsy`,
      text: `Check out ${spot.name} in ${spot.area} on Outsy!`,
      url: url,
    };

    posthog.capture("spot_shared", {
      spot_id: spot.id,
      spot_name: spot.name,
      method: navigator.share ? "native" : "clipboard"
    });

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error("Error sharing:", err);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  if (variant === "grid-item") {
    return (
      <button
        onClick={handleShare}
        className="flex flex-col items-center justify-center py-6 hover:bg-muted transition-colors relative"
      >
        <RiShareForwardLine className={`h-6 w-6 text-primary mb-2 transition-transform ${copied ? 'scale-0' : 'scale-100'}`} />
        <RiCheckLine className={`h-6 w-6 text-green-600 mb-2 absolute top-6 transition-transform ${copied ? 'scale-100' : 'scale-0'}`} />
        <p className="text-xs font-bold">{copied ? "Copied!" : "Share"}</p>
      </button>
    );
  }

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

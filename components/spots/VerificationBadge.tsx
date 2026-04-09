"use client";

import { RiShieldCheckFill, RiInformationLine } from "react-icons/ri";
import type { Spot } from "@/lib/types";

interface VerificationBadgeProps {
  spot: Spot;
}

export function VerificationBadge({ spot }: VerificationBadgeProps) {
  // Mock logic for days since verified
  const lastDate = new Date(spot.lastVerifiedDate);
  const now = new Date();
  const diffDays = Math.ceil((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="rounded-2xl bg-muted/30 p-4 border border-border/50">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full flex-shrink-0 ${spot.isVerified ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}>
          {spot.isVerified ? (
            <RiShieldCheckFill className="h-5 w-5" />
          ) : (
             <RiInformationLine className="h-5 w-5" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">
            {spot.isVerified ? "Verified by Outsy" : "Awaiting Verification"}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {spot.isVerified 
              ? `We last checked this spot ${diffDays} day${diffDays === 1 ? "" : "s"} ago to ensure the price and vibes are accurate.`
              : "We're currently verifying this spot. Information is based on recent user feedback and public data."}
          </p>
          <div className="mt-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
            Last Checked: {spot.lastVerifiedDate}
          </div>
        </div>
      </div>
    </div>
  );
}

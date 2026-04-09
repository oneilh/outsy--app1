"use client";

import { useState } from "react";
import { RiShareLine, RiCheckLine, RiMailSendLine } from "react-icons/ri";

interface ShareSavedListProps {
  savedIds: string[];
}

export function ShareSavedList({ savedIds }: ShareSavedListProps) {
  const [copied, setCopied] = useState(false);

  if (savedIds.length === 0) return null;

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.set("ids", savedIds.join(","));
    return `${baseUrl}?${params.toString()}`;
  };

  const handleShare = async () => {
    const shareUrl = getShareUrl();
    const shareData = {
      title: "My Outsy Picks",
      text: "Check out the spots I've saved on Outsy!",
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-all active:scale-95"
      >
        {copied ? (
          <>
            <RiCheckLine className="h-4 w-4" />
            Copied link
          </>
        ) : (
          <>
            <RiShareLine className="h-4 w-4" />
            Share list
          </>
        )}
      </button>
      
      <a
        href={`mailto:?subject=My Outsy Picks&body=Check out these spots I saved on Outsy: ${getShareUrl()}`}
        className="flex items-center justify-center h-10 w-10 rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Email list"
      >
        <RiMailSendLine className="h-4 w-4" />
      </a>
    </div>
  );
}

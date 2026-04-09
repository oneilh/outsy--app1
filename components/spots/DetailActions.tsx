"use client";

import { useState } from "react";
import { RiLayoutGridLine, RiCheckLine, RiAddLine, RiFlagLine } from "react-icons/ri";
import { useCompare } from "@/lib/context/CompareContext";
import type { Spot } from "@/lib/types";
import { ReportIssueModal } from "./ReportIssueModal";

interface DetailActionsProps {
  spot: Spot;
}

export function DetailActions({ spot }: DetailActionsProps) {
  const { isInCompare, toggleCompare, maxReached } = useCompare();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  
  const inCompare = isInCompare(spot.id);

  return (
    <>
      <div className="flex flex-col">
        {/* Toggle Compare */}
        <button
          onClick={() => toggleCompare(spot.id)}
          disabled={!inCompare && maxReached}
          className="flex items-center gap-3 p-4 hover:bg-muted transition-colors border-b border-border text-left disabled:opacity-50"
        >
          <div className={`flex items-center justify-center h-10 w-10 rounded-full flex-shrink-0 transition-colors ${inCompare ? "bg-primary text-white" : "bg-muted text-foreground"}`}>
            {inCompare ? (
              <RiCheckLine className="h-5 w-5" />
            ) : (
              <RiAddLine className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              {inCompare ? "Added to Compare" : "Compare this spot"}
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {inCompare ? "Remove from list" : "Compare with others"}
            </p>
          </div>
          {!inCompare && maxReached && (
            <span className="text-[10px] font-black text-primary uppercase">Full</span>
          )}
        </button>

        {/* Report an Issue */}
        <button
          onClick={() => setReportModalOpen(true)}
          className="flex items-center gap-3 p-4 hover:bg-muted transition-colors text-left"
        >
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted text-foreground flex-shrink-0">
            <RiFlagLine className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Report an Issue</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Outdated or wrong? Let us know
            </p>
          </div>
        </button>
      </div>

      <ReportIssueModal 
        isOpen={reportModalOpen} 
        onClose={() => setReportModalOpen(false)} 
        spotName={spot.name} 
        spotId={spot.id}
      />
    </>
  );
}

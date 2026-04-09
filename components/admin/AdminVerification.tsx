"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { RiShieldCheckLine, RiTimeLine } from "react-icons/ri";
import { Spot } from "@/lib/types";
import { verifySpot } from "@/app/actions/spots";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AdminVerificationProps {
  spots: Spot[];
}

function getVerificationTier(lastVerifiedDate: string): "urgent" | "due" | "pending" | "ok" {
  const days = Math.floor((Date.now() - new Date(lastVerifiedDate).getTime()) / (1000 * 60 * 60 * 24));
  if (days >= 30) return "urgent";
  if (days >= 14) return "due";
  if (days >= 7) return "pending";
  return "ok";
}

function daysSince(dateStr: string) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

const TIER_STYLES = {
  urgent: { bg: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500", label: "Urgent" },
  due: { bg: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-400", label: "Due" },
  pending: { bg: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-400", label: "Pending" },
  ok: { bg: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500", label: "Verified" },
};

export function AdminVerification({ spots: initialSpots }: AdminVerificationProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "urgent" | "due" | "pending" | "ok">("all");

  const handleVerify = async (id: string, name: string) => {
    setLoadingId(id);
    try {
      const result = await verifySpot(id);
      if (result.success) {
        toast.success(`${name} verified!`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to verify spot");
      }
    } catch (error) {
      toast.error("An error occurred during verification");
    } finally {
      setLoadingId(null);
    }
  };

  const filteredSpots = useMemo(() => {
    const sorted = [...initialSpots].sort(
      (a, b) => daysSince(b.lastVerifiedDate) - daysSince(a.lastVerifiedDate)
    );
    if (filter === "all") return sorted;
    return sorted.filter((s) => getVerificationTier(s.lastVerifiedDate) === filter);
  }, [initialSpots, filter]);

  const counts = useMemo(() => ({
    all: initialSpots.length,
    urgent: initialSpots.filter((s) => getVerificationTier(s.lastVerifiedDate) === "urgent").length,
    due: initialSpots.filter((s) => getVerificationTier(s.lastVerifiedDate) === "due").length,
    pending: initialSpots.filter((s) => getVerificationTier(s.lastVerifiedDate) === "pending").length,
    ok: initialSpots.filter((s) => getVerificationTier(s.lastVerifiedDate) === "ok").length,
  }), [initialSpots]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Verification Queue</h2>
          <p className="text-sm text-muted-foreground">Ensure spot data (price, menu, hours) is up to date.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {(["all", "urgent", "due", "pending", "ok"] as const).map((f) => {
          const labels: Record<string, string> = { all: "All Spots", urgent: "Urgent", due: "Due Soon", pending: "Next Week", ok: "Verified" };
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold flex-shrink-0 transition-all border ${
                filter === f
                  ? "bg-secondary text-white border-secondary shadow-lg shadow-secondary/20"
                  : "bg-card text-muted-foreground border-border hover:border-secondary/40"
              }`}
            >
              {f !== "all" && (
                <span className={`h-2 w-2 rounded-full ${TIER_STYLES[f]?.dot ?? ""}`} />
              )}
              {labels[f]} <span className="opacity-60">{counts[f]}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSpots.map((spot) => {
          const tier = getVerificationTier(spot.lastVerifiedDate);
          const style = TIER_STYLES[tier];
          return (
            <div key={spot.id} className="rounded-3xl border border-border bg-card p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="relative h-14 w-14 rounded-2xl overflow-hidden flex-shrink-0 border border-border">
                <Image src={spot.images[0]} alt={spot.name} fill className="object-cover" sizes="56px" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-sm text-foreground truncate">{spot.name}</p>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black border uppercase tracking-tighter ${style.bg}`}>
                    {style.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">{spot.area} · {spot.category}</p>
                <div className="mt-3 flex items-center gap-4">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Pricing</span>
                      <span className="text-xs font-bold text-foreground">Verified {new Date(spot.lastVerifiedDate).toLocaleDateString("en-GB", { day: "numeric", month: "numeric" })}</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Status</span>
                      <span className={`text-xs font-bold ${spot.isVerified ? "text-green-600" : "text-amber-500"}`}>
                        {spot.isVerified ? "Current" : "Needs Re-check"}
                      </span>
                   </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleVerify(spot.id, spot.name)}
                  disabled={loadingId === spot.id || (spot.isVerified && tier === "ok")}
                  className={`h-9 w-9 rounded-full flex items-center justify-center transition-all shadow-sm ${
                    loadingId === spot.id ? "bg-muted text-muted-foreground" :
                    (spot.isVerified && tier === "ok") ? "bg-green-50 text-green-600 opacity-50 cursor-not-allowed" :
                    "bg-primary/10 text-primary hover:bg-green-600 hover:text-white"
                  }`}
                  title="Mark as Verified"
                >
                  {loadingId === spot.id ? (
                    <RiTimeLine className="h-5 w-5 animate-spin" />
                  ) : (
                    <RiShieldCheckLine className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

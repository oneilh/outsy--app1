"use client";

import { RiAddLine, RiCalendarLine, RiPriceTag3Line, RiEditLine } from "react-icons/ri";

// ── Mock business data ──────────────────────────────────────────────────────
const BUSINESSES = [
  { id: "b1", name: "Nok by Alara", tier: "Featured", startDate: "2026-03-01", expiryDate: "2026-04-01", status: "Active", contact: "@nokbyalara", notes: "Renewed on time" },
  { id: "b2", name: "Quilox", tier: "Featured", startDate: "2026-03-15", expiryDate: "2026-04-15", status: "Active", contact: "@quiloxlagos", notes: "First 2 weeks free" },
  { id: "b3", name: "Shiro Lagos", tier: "Basic", startDate: "2026-02-01", expiryDate: "2026-03-01", status: "Expired", contact: "+234 816 000 1234", notes: "Follow up for renewal" },
  { id: "b4", name: "UPBEAT Recreation", tier: "Basic", startDate: "2026-04-01", expiryDate: "2026-05-01", status: "Active", contact: "@upbeatlagos", notes: "" },
  { id: "b5", name: "The George", tier: "Featured", startDate: "2026-03-10", expiryDate: "2026-04-10", status: "Pending", contact: "@thegeorgelagos", notes: "Awaiting payment" },
];

const BUSINESS_STATUS_STYLES: Record<string, string> = {
  Active: "bg-green-50 text-green-700",
  Expired: "bg-red-50 text-red-700",
  Pending: "bg-amber-50 text-amber-700",
};

function daysSince(dateStr: string) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

export function AdminBusinesses() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-xl font-bold text-foreground">Business Partnerships</h2>
           <p className="text-sm text-muted-foreground">Manage sponsorships, featured status, and billing.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-white text-sm font-bold shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all">
          <RiAddLine className="h-5 w-5" />
          Onboard Business
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BUSINESSES.map((biz) => (
          <div key={biz.id} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-start justify-between gap-2 mb-5">
              <div>
                <p className="font-black text-base text-foreground uppercase tracking-tighter">{biz.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">{biz.contact}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter ${
                  biz.tier === "Featured" ? "bg-primary text-white" : "bg-secondary/10 text-secondary"
                }`}>
                  {biz.tier}
                </span>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter ${BUSINESS_STATUS_STYLES[biz.status] ?? "bg-muted text-muted-foreground"}`}>
                  {biz.status}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/30 mb-5">
              <div className="flex items-center gap-3">
                 <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <RiCalendarLine className="h-4 w-4 text-primary" />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Expiry</p>
                    <p className={`text-xs font-bold ${daysSince(biz.expiryDate) > 0 ? "text-red-500" : "text-foreground"}`}>
                       {new Date(biz.expiryDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <RiPriceTag3Line className="h-4 w-4 text-green-600" />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tier</p>
                    <p className="text-xs font-bold text-foreground">{biz.tier === "Featured" ? "₦35,000" : "₦15,000"}</p>
                 </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
               <button className="flex-1 py-2.5 rounded-xl border border-border text-xs font-bold hover:bg-muted transition-colors">Contact</button>
               <button className="flex-1 py-2.5 rounded-xl border border-border text-xs font-bold hover:bg-muted transition-colors">Invoice</button>
               <button className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-all">
                  <RiEditLine className="h-5 w-5" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { RiFireLine, RiEditLine } from "react-icons/ri";
import { Spot } from "@/lib/types";

interface AdminCalendarProps {
  spots: Spot[];
}

export function AdminCalendar({ spots }: AdminCalendarProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Content Calendar</h2>
        <p className="text-sm text-muted-foreground">Planning Outsy Picks and Featured Cycles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Outsy Picks Cycle */}
         <div className="lg:col-span-2 space-y-4">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-2xl bg-amber-100 flex items-center justify-center">
                   <RiFireLine className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                   <h3 className="font-bold text-base text-foreground">Outsy Picks — This Week</h3>
                   <p className="text-xs text-muted-foreground">Cycle: April 7th - April 14th</p>
                </div>
              </div>
              <div className="space-y-3">
                {spots.filter((s) => s.isOutsyPick).slice(0, 5).map((spot, i) => (
                  <div key={spot.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-muted/30 transition-colors group">
                    <span className="text-sm font-black text-muted-foreground/40 w-5">0{i + 1}</span>
                    <div className="relative h-10 w-10 rounded-xl overflow-hidden flex-shrink-0 border border-border">
                      <Image src={spot.images[0]} alt={spot.name} fill className="object-cover" sizes="40px" />
                    </div>
                    <div className="flex-1">
                       <p className="text-sm font-bold text-foreground uppercase tracking-tight">{spot.name}</p>
                       <p className="text-[10px] font-bold text-muted-foreground">{spot.area} · {spot.category}</p>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-primary transition-all">
                       <RiEditLine className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 rounded-2xl border-2 border-dashed border-border text-sm font-bold text-muted-foreground hover:border-primary/40 hover:text-primary transition-all">
                 Schedule Next Week&apos;s Picks
              </button>
            </div>
         </div>

         {/* Sidebar: Availability */}
         <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
               <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Ad Inventory</h3>
               <div className="space-y-6">
                  <div>
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-foreground">Featured Slots</span>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Available</span>
                     </div>
                     <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-3/4" />
                     </div>
                     <p className="text-[10px] text-muted-foreground mt-2 font-medium">3 of 4 slots filled for April</p>
                  </div>
                  <div>
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-foreground">Banner Ads</span>
                        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">Sold Out</span>
                     </div>
                     <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-secondary w-full" />
                     </div>
                     <p className="text-[10px] text-muted-foreground mt-2 font-medium">All slots booked until May 15th</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

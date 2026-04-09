"use client";

import { RiLineChartLine, RiBarChartLine, RiMapPinLine, RiGridLine, RiFireLine, RiArrowUpSLine, RiArrowDownSLine, RiShareLine, RiBookmarkLine, RiInstagramLine, RiGlobalLine } from "react-icons/ri";

// ── Mock Analytics Data (The Golden Sequence) ──────────────────────────────
const ANALYTICS = {
  visits: {
    total: 12450,
    change: 12,
    trend: "up"
  },
  sequences: [
    { label: "Landing Page", value: 12450, percent: 100, icon: RiGridLine },
    { label: "Search/Filter Used", value: 8720, percent: 70, icon: RiBarChartLine },
    { label: "Spot Detail Viewed", value: 4360, percent: 35, icon: RiMapPinLine },
    { label: "Conversion (Save/Go)", value: 1245, percent: 10, icon: RiFireLine },
  ],
  topSpots: [
    { id: "1", name: "Nok by Alara", views: 2450, saves: 420, conversion: "17%" },
    { id: "3", name: "Quilox", views: 2100, saves: 380, conversion: "18%" },
    { id: "5", name: "Shiro Lagos", views: 1850, saves: 310, conversion: "16%" },
  ],
  topVibes: [
    { label: "Date Night", count: 3200, trend: "up" },
    { label: "Rooftop", count: 2800, trend: "up" },
    { label: "Hidden Gem", count: 1500, trend: "down" },
    { label: "Live Music", count: 1200, trend: "up" },
  ],
  topAreas: [
    { label: "Victoria Island", count: 5400 },
    { label: "Ikoyi", count: 3200 },
    { label: "Lekki Phase 1", count: 2800 },
    { label: "Ikeja", count: 1100 },
  ],
  referrals: [
    { label: "Direct/WhatsApp", count: 4200, icon: RiShareLine, color: "bg-green-100 text-green-700" },
    { label: "Instagram Link", count: 3800, icon: RiInstagramLine, color: "bg-pink-100 text-pink-700" },
    { label: "Google Search", count: 2100, icon: RiGlobalLine, color: "bg-blue-100 text-blue-700" },
    { label: "TikTok/Reels", count: 1500, icon: RiFireLine, color: "bg-slate-100 text-slate-700" },
  ]
};

export function AdminAnalytics() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-bold text-foreground">Strategic Analytics</h2>
        <p className="text-sm text-muted-foreground">Tracking the &quot;Golden Sequence&quot; — from landing to decision.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Funnel */}
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-base font-bold text-foreground mb-6 flex items-center gap-2">
            <RiLineChartLine className="h-5 w-5 text-primary" />
            The Golden Funnel (Last 30 Days)
          </h3>
          <div className="space-y-6">
            {ANALYTICS.sequences.map((step, i) => (
              <div key={step.label} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                     <div className="bg-muted p-2 rounded-lg">
                       <step.icon className="h-4 w-4 text-muted-foreground" />
                     </div>
                     <span className="text-sm font-bold text-foreground">{step.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold">{step.value.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground ml-2">({step.percent}%)</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${step.percent}%`, opacity: 1 - (i * 0.15) }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
               <p className="text-sm text-muted-foreground">Overall User Success Rate</p>
               <p className="text-xl font-black text-secondary">10.0%</p>
            </div>
          </div>
        </div>

        {/* Top Vibing/Searching */}
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Top Searching Vibs</h3>
            <div className="space-y-4">
              {ANALYTICS.topVibes.map((vibe) => (
                <div key={vibe.label} className="flex items-center justify-between">
                   <span className="text-sm font-semibold text-muted-foreground">{vibe.label}</span>
                   <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{vibe.count}</span>
                      {vibe.trend === "up" ? (
                         <RiArrowUpSLine className="text-green-500" />
                      ) : (
                         <RiArrowDownSLine className="text-red-500" />
                      )}
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">High Intent Actions</h3>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 rounded-2xl bg-muted/50 text-center">
                  <RiBookmarkLine className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <p className="text-lg font-bold">842</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Saves</p>
               </div>
               <div className="p-4 rounded-2xl bg-muted/50 text-center">
                  <RiShareLine className="h-5 w-5 mx-auto mb-2 text-secondary" />
                  <p className="text-lg font-bold">215</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Shares</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Content & Referral Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
           <h3 className="text-base font-bold text-foreground mb-6">Top Performing Spots</h3>
           <div className="overflow-x-auto">
             <table className="w-full text-sm">
               <thead>
                  <tr className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider">
                     <th className="text-left py-3">Spot Name</th>
                     <th className="text-center py-3">Views</th>
                     <th className="text-center py-3">Saves</th>
                     <th className="text-center py-3">CVR</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border">
                 {ANALYTICS.topSpots.map((spot) => (
                   <tr key={spot.id}>
                      <td className="py-4 font-bold text-foreground">{spot.name}</td>
                      <td className="py-4 text-center font-medium">{spot.views}</td>
                      <td className="py-4 text-center font-medium">{spot.saves}</td>
                      <td className="py-4 text-center">
                        <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-100">
                          {spot.conversion}
                        </span>
                      </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
           <h3 className="text-base font-bold text-foreground mb-6">Where Users Come From</h3>
           <div className="space-y-4">
              {ANALYTICS.referrals.map((ref) => (
                <div key={ref.label} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
                   <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${ref.color}`}>
                         <ref.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold text-foreground">{ref.label}</span>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-bold">{ref.count.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Visits</p>
                   </div>
                </div>
              ))}
           </div>
           <div className="mt-8 p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <p className="text-xs font-medium text-primary leading-relaxed">
                <span className="font-bold">Growth Insight:</span> WhatsApp sharing is currently the #1 source of repeat traffic. Focus on the &quot;Share List&quot; feature to boost viral loop.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

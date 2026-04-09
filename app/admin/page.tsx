"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  RiMapPinLine,
  RiCheckboxCircleLine,
  RiAlertLine,
  RiTimeLine,
  RiShieldCheckLine,
  RiStoreLine,
  RiCalendarLine,
  RiFireLine,
  RiGridLine,
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiExternalLinkLine,
  RiBarChartLine,
  RiLineChartLine,
  RiGroupLine,
  RiFlagLine,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiShareLine,
  RiBookmarkLine,
  RiPhoneLine,
  RiParkingLine,
  RiPriceTag3Line,
} from "react-icons/ri";
import spotsRaw from "@/data/spots.json";
import collectionsRaw from "@/data/collections.json";
import reportsRaw from "@/data/reports.json";

type Spot = (typeof spotsRaw)[number];
type Collection = (typeof collectionsRaw)[number];
type Report = {
  id: string;
  spotId: string;
  spotName: string;
  issueType: string;
  description: string;
  status: "pending" | "resolved" | "ignored";
  createdAt: string;
};

const spots = spotsRaw as Spot[];
const collections = collectionsRaw as Collection[];
const reports = reportsRaw as Report[];

// ── Mock business data ──────────────────────────────────────────────────────
const BUSINESSES = [
  { id: "b1", name: "Nok by Alara", tier: "Featured", startDate: "2026-03-01", expiryDate: "2026-04-01", status: "Active", contact: "@nokbyalara", notes: "Renewed on time" },
  { id: "b2", name: "Quilox", tier: "Featured", startDate: "2026-03-15", expiryDate: "2026-04-15", status: "Active", contact: "@quiloxlagos", notes: "First 2 weeks free" },
  { id: "b3", name: "Shiro Lagos", tier: "Basic", startDate: "2026-02-01", expiryDate: "2026-03-01", status: "Expired", contact: "+234 816 000 1234", notes: "Follow up for renewal" },
  { id: "b4", name: "UPBEAT Recreation", tier: "Basic", startDate: "2026-04-01", expiryDate: "2026-05-01", status: "Active", contact: "@upbeatlagos", notes: "" },
  { id: "b5", name: "The George", tier: "Featured", startDate: "2026-03-10", expiryDate: "2026-04-10", status: "Pending", contact: "@thegeorgelagos", notes: "Awaiting payment" },
];

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
  ]
};

// ── Verification tier logic ────────────────────────────────────────────────
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

const BUSINESS_STATUS_STYLES: Record<string, string> = {
  Active: "bg-green-50 text-green-700",
  Expired: "bg-red-50 text-red-700",
  Pending: "bg-amber-50 text-amber-700",
};

type Tab = "overview" | "analytics" | "verification" | "businesses" | "reports" | "calendar";

// ── Stats derived from mock data ──────────────────────────────────────────
const totalSpots = spots.length;
const featuredSpots = spots.filter((s) => s.isFeatured).length;
const urgentVerification = spots.filter((s) => getVerificationTier(s.lastVerifiedDate) === "urgent").length;
const activeBusinesses = BUSINESSES.filter((b) => b.status === "Active").length;

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [verificationFilter, setVerificationFilter] = useState<"all" | "urgent" | "due" | "pending" | "ok">("all");

  const filteredSpots = useMemo(() => {
    const sorted = [...spots].sort(
      (a, b) => daysSince(b.lastVerifiedDate) - daysSince(a.lastVerifiedDate)
    );
    if (verificationFilter === "all") return sorted;
    return sorted.filter((s) => getVerificationTier(s.lastVerifiedDate) === verificationFilter);
  }, [verificationFilter]);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Admin Header ──────────────────────────────────────────────── */}
      <div className="border-b border-border bg-card mb-6 -mx-4 md:-mx-6 lg:-mx-10 px-4 md:px-6 lg:px-10 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Image src="/outsy_logo.svg" alt="Outsy" width={80} height={24} className="h-6 w-auto" />
            </Link>
            <span className="text-muted-foreground text-sm font-medium">/ Admin</span>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full font-medium hidden md:inline-flex">
              Internal tool — not public
            </span>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold">
              OA
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Users", value: "1,245", trend: "+12%", icon: RiGroupLine, color: "text-blue-500" },
          { label: "Daily Conversion", value: "10.4%", trend: "+2.1%", icon: RiFireLine, color: "text-primary" },
          { label: "Needs Reviver", value: urgentVerification, trend: "Urgent", icon: RiAlertLine, color: "text-red-500" },
          { label: "Active Revenue", value: "₦140k", trend: "+5%", icon: RiStoreLine, color: "text-green-600" },
        ].map(({ label, value, trend, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl bg-muted/50 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                trend.startsWith("+") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {trend}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Tabs ──────────────────────────────────────────────────────── */}
      <div className="flex gap-1 mb-8 overflow-x-auto scrollbar-none border-b border-border pb-px">
        {([
          { id: "overview", label: "Content", icon: RiGridLine },
          { id: "analytics", label: "Analytics", icon: RiLineChartLine },
          { id: "verification", label: "Verification", icon: RiShieldCheckLine },
          { id: "businesses", label: "Businesses", icon: RiStoreLine },
          { id: "reports", label: "Reports", icon: RiFlagLine },
          { id: "calendar", label: "Calendar", icon: RiCalendarLine },
        ] as { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[]).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all flex-shrink-0 text-sm font-semibold ${
              tab === id
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: Content Management (Overview) ────────────────────────── */}
      {tab === "overview" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">Content Inventory</h2>
              <p className="text-sm text-muted-foreground">Manage spots, verified status and listings.</p>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              <RiAddLine className="h-5 w-5" />
              Add New Spot
            </button>
          </div>

          <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-5 py-4 font-bold text-muted-foreground uppercase tracking-wider text-[11px]">Spot</th>
                    <th className="text-left px-5 py-4 font-bold text-muted-foreground uppercase tracking-wider text-[11px] hidden md:table-cell">Location</th>
                    <th className="text-left px-5 py-4 font-bold text-muted-foreground uppercase tracking-wider text-[11px] hidden md:table-cell">Category</th>
                    <th className="text-left px-5 py-4 font-bold text-muted-foreground uppercase tracking-wider text-[11px]">Health</th>
                    <th className="text-right px-5 py-4 font-bold text-muted-foreground uppercase tracking-wider text-[11px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {spots.map((spot, i) => (
                    <tr key={spot.id} className={`border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-11 w-11 rounded-xl overflow-hidden flex-shrink-0 border border-border">
                            <Image src={spot.images[0]} alt={spot.name} fill className="object-cover" sizes="44px" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground line-clamp-1">{spot.name}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              {spot.isFeatured && (
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase tracking-tighter">FEATURED</span>
                              )}
                              {spot.isOutsyPick && (
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 uppercase tracking-tighter">PICK</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground hidden md:table-cell font-medium">{spot.area}</td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="capitalize text-muted-foreground bg-muted/50 px-2 py-1 rounded-md text-xs font-semibold">{spot.category}</span>
                      </td>
                      <td className="px-5 py-4">
                        {spot.isVerified ? (
                          <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs uppercase tracking-tighter">
                            <RiCheckboxCircleLine className="h-4 w-4" />
                            Live
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs uppercase tracking-tighter">
                            <RiTimeLine className="h-4 w-4" />
                            Pending
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/spots/${spot.slug}`}
                            className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                            title="View Live"
                          >
                            <RiExternalLinkLine className="h-5 w-5" />
                          </Link>
                          <button className="p-2 rounded-xl text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-all" title="Edit Content">
                            <RiEditLine className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Strategic Analytics ──────────────────────────────────── */}
      {tab === "analytics" && (
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

          {/* Top Performing Content */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
             <h3 className="text-base font-bold text-foreground mb-6">Top Performing Spots</h3>
             <div className="overflow-x-auto">
               <table className="w-full text-sm">
                 <thead>
                    <tr className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider">
                       <th className="text-left py-3">Spot Name</th>
                       <th className="text-center py-3">Views</th>
                       <th className="text-center py-3">Saves</th>
                       <th className="text-center py-3">Conversion</th>
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
        </div>
      )}

      {/* ── Tab: Reports & Moderation ─────────────────────────────────── */}
      {tab === "reports" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">Issue Reports</h2>
              <p className="text-sm text-muted-foreground">User feedback and data corrections.</p>
            </div>
            <div className="bg-muted p-1 rounded-xl flex">
               <button className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white shadow-sm">Active</button>
               <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-muted-foreground">Resolved</button>
            </div>
          </div>

          {reports.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-border p-12 text-center">
               <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <RiCheckboxCircleLine className="h-8 w-8 text-muted-foreground" />
               </div>
               <h3 className="text-lg font-bold text-foreground">All Clear!</h3>
               <p className="text-muted-foreground mt-1">No pending issue reports from users.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div key={report.id} className="rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-tighter border border-red-100">
                          {report.issueType}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">#{report.id} · {new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-bold text-foreground">{report.spotName}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors">
                        Investigate
                      </button>
                      <button className="px-4 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-bold hover:bg-muted/80 transition-colors">
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Verification Queue ────────────────────────────────────── */}
      {tab === "verification" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">Verification Queue</h2>
              <p className="text-sm text-muted-foreground">Ensure spot data (price, menu, hours) is up to date.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {(["all", "urgent", "due", "pending", "ok"] as const).map((f) => {
              const counts: Record<string, number> = {
                all: spots.length,
                urgent: spots.filter((s) => getVerificationTier(s.lastVerifiedDate) === "urgent").length,
                due: spots.filter((s) => getVerificationTier(s.lastVerifiedDate) === "due").length,
                pending: spots.filter((s) => getVerificationTier(s.lastVerifiedDate) === "pending").length,
                ok: spots.filter((s) => getVerificationTier(s.lastVerifiedDate) === "ok").length,
              };
              const labels: Record<string, string> = { all: "All Spots", urgent: "Urgent", due: "Due Soon", pending: "Next Week", ok: "Verified" };
              return (
                <button
                  key={f}
                  onClick={() => setVerificationFilter(f)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold flex-shrink-0 transition-all border ${
                    verificationFilter === f
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
              const days = daysSince(spot.lastVerifiedDate);
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
                          <span className="text-xs font-bold text-foreground">Verified 10/05</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Menu</span>
                          <span className="text-xs font-bold text-foreground">Outdated</span>
                       </div>
                    </div>
                  </div>
                  <button className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-green-600 hover:text-white transition-all shadow-sm">
                    <RiShieldCheckLine className="h-5 w-5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Tab: Business & Payments ───────────────────────────────────── */}
      {tab === "businesses" && (
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
      )}

      {/* ── Tab: Content Calendar ──────────────────────────────────────── */}
      {tab === "calendar" && (
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
                            <span className="text-sm font-bold text-primary">{featuredSpots}/5</span>
                         </div>
                         <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${(featuredSpots / 5) * 100}%` }} />
                         </div>
                      </div>
                      <div>
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-foreground">Collections</span>
                            <span className="text-sm font-bold text-secondary">3/4</span>
                         </div>
                         <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-secondary" style={{ width: "75%" }} />
                         </div>
                      </div>
                   </div>
                </div>

                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                   <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4 italic">Editor&apos;s Note</h3>
                   <p className="text-xs text-muted-foreground leading-relaxed">
                      Lagos nightlife is peaking due to the holiday weekend. Consider swapping out 1 Afternoon Pick for an Underground Party Pick by Friday.
                   </p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

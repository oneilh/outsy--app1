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
} from "react-icons/ri";
import spotsRaw from "@/data/spots.json";
import collectionsRaw from "@/data/collections.json";

type Spot = (typeof spotsRaw)[number];
type Collection = (typeof collectionsRaw)[number];

const spots = spotsRaw as Spot[];
const collections = collectionsRaw as Collection[];

// ── Mock business data ──────────────────────────────────────────────────────
const BUSINESSES = [
  { id: "b1", name: "Nok by Alara", tier: "Featured", startDate: "2026-03-01", expiryDate: "2026-04-01", status: "Active", contact: "@nokbyalara", notes: "Renewed on time" },
  { id: "b2", name: "Quilox", tier: "Featured", startDate: "2026-03-15", expiryDate: "2026-04-15", status: "Active", contact: "@quiloxlagos", notes: "First 2 weeks free" },
  { id: "b3", name: "Shiro Lagos", tier: "Basic", startDate: "2026-02-01", expiryDate: "2026-03-01", status: "Expired", contact: "+234 816 000 1234", notes: "Follow up for renewal" },
  { id: "b4", name: "UPBEAT Recreation", tier: "Basic", startDate: "2026-04-01", expiryDate: "2026-05-01", status: "Active", contact: "@upbeatlagos", notes: "" },
  { id: "b5", name: "The George", tier: "Featured", startDate: "2026-03-10", expiryDate: "2026-04-10", status: "Pending", contact: "@thegeorgelagos", notes: "Awaiting payment" },
];

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

type Tab = "overview" | "verification" | "businesses" | "calendar";

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
          <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full font-medium">
            Internal tool — not public
          </span>
        </div>
      </div>

      {/* ── Stats row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Spots", value: totalSpots, icon: RiMapPinLine, color: "text-secondary" },
          { label: "Featured", value: featuredSpots, icon: RiFireLine, color: "text-primary" },
          { label: "Need Reverification", value: urgentVerification, icon: RiAlertLine, color: "text-red-500" },
          { label: "Paying Businesses", value: activeBusinesses, icon: RiStoreLine, color: "text-green-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ──────────────────────────────────────────────────────── */}
      <div className="flex gap-1 mb-6 overflow-x-auto scrollbar-none">
        {([
          { id: "overview", label: "Content", icon: RiGridLine },
          { id: "verification", label: "Verification Queue", icon: RiShieldCheckLine },
          { id: "businesses", label: "Businesses", icon: RiStoreLine },
          { id: "calendar", label: "Content Calendar", icon: RiCalendarLine },
        ] as { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[]).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              tab === id
                ? "bg-primary text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: Content Management ───────────────────────────────────── */}
      {tab === "overview" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">All Spots ({spots.length})</h2>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
              <RiAddLine className="h-4 w-4" />
              Add Spot
            </button>
          </div>

          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Spot</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Area</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Category</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                    <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {spots.map((spot, i) => (
                    <tr key={spot.id} className={`border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-9 w-9 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={spot.images[0]} alt={spot.name} fill className="object-cover" sizes="36px" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground line-clamp-1">{spot.name}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              {spot.isFeatured && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase tracking-wide">Featured</span>
                              )}
                              {spot.isNew && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 uppercase tracking-wide">New</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{spot.area}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="capitalize text-muted-foreground">{spot.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        {spot.isVerified ? (
                          <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                            <RiCheckboxCircleLine className="h-3.5 w-3.5" />
                            Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-600 text-xs font-medium">
                            <RiTimeLine className="h-3.5 w-3.5" />
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/spots/${spot.slug}`}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            title="View"
                          >
                            <RiExternalLinkLine className="h-4 w-4" />
                          </Link>
                          <button className="p-1.5 rounded-lg text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-colors" title="Edit">
                            <RiEditLine className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors" title="Archive">
                            <RiDeleteBinLine className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Collections overview */}
          <div>
            <h2 className="text-base font-bold text-foreground mb-3">Collections ({collections.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {collections.map((col) => (
                <div key={col.id} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={col.coverImage} alt={col.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground line-clamp-1">{col.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 capitalize">{col.type} · {col.spotIds.length} spots</p>
                  </div>
                  <button className="p-1.5 rounded-lg text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-colors">
                    <RiEditLine className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Verification Queue ────────────────────────────────────── */}
      {tab === "verification" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {(["all", "urgent", "due", "pending", "ok"] as const).map((f) => {
              const counts: Record<string, number> = {
                all: spots.length,
                urgent: spots.filter((s) => getVerificationTier(s.lastVerifiedDate) === "urgent").length,
                due: spots.filter((s) => getVerificationTier(s.lastVerifiedDate) === "due").length,
                pending: spots.filter((s) => getVerificationTier(s.lastVerifiedDate) === "pending").length,
                ok: spots.filter((s) => getVerificationTier(s.lastVerifiedDate) === "ok").length,
              };
              const labels: Record<string, string> = { all: "All", urgent: "Urgent", due: "Due", pending: "Pending", ok: "Up-to-date" };
              return (
                <button
                  key={f}
                  onClick={() => setVerificationFilter(f)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-all border ${
                    verificationFilter === f
                      ? "bg-secondary text-white border-secondary"
                      : "bg-background text-muted-foreground border-border hover:border-secondary/40"
                  }`}
                >
                  {f !== "all" && (
                    <span className={`h-2 w-2 rounded-full ${TIER_STYLES[f]?.dot ?? ""}`} />
                  )}
                  {labels[f]} ({counts[f]})
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3">
            {filteredSpots.map((spot) => {
              const tier = getVerificationTier(spot.lastVerifiedDate);
              const style = TIER_STYLES[tier];
              const days = daysSince(spot.lastVerifiedDate);
              return (
                <div key={spot.id} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-4">
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={spot.images[0]} alt={spot.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-foreground">{spot.name}</p>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${style.bg}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        {style.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{spot.area} · {spot.category}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Last verified: {days === 0 ? "today" : `${days} days ago`} ({new Date(spot.lastVerifiedDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })})
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href={`/spots/${spot.slug}`} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="View">
                      <RiExternalLinkLine className="h-4 w-4" />
                    </Link>
                    <button className="px-3 py-1.5 rounded-full bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors">
                      Mark verified
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Tab: Business & Payments ───────────────────────────────────── */}
      {tab === "businesses" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Paying Businesses</h2>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
              <RiAddLine className="h-4 w-4" />
              Add Business
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {BUSINESSES.map((biz) => (
              <div key={biz.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="font-bold text-sm text-foreground">{biz.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{biz.contact}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      biz.tier === "Featured" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                    }`}>
                      {biz.tier}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${BUSINESS_STATUS_STYLES[biz.status] ?? "bg-muted text-muted-foreground"}`}>
                      {biz.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground border-t border-border pt-3">
                  <div>
                    <p className="font-semibold text-foreground/60 uppercase text-[9px] tracking-wide mb-0.5">Start</p>
                    <p>{new Date(biz.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground/60 uppercase text-[9px] tracking-wide mb-0.5">Expires</p>
                    <p className={daysSince(biz.expiryDate) > 0 ? "text-red-600 font-semibold" : ""}>
                      {new Date(biz.expiryDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                {biz.notes && (
                  <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border italic">{biz.notes}</p>
                )}
              </div>
            ))}
          </div>

          {/* Pricing reminder */}
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-sm font-semibold text-foreground mb-2">Pricing Tiers</p>
            <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
              <div className="rounded-xl bg-muted p-3">
                <p className="font-bold text-foreground">Basic Listing</p>
                <p className="text-primary font-semibold text-base mt-1">₦15,000<span className="text-xs text-muted-foreground font-normal">/mo</span></p>
                <p className="mt-1">Listed + Verified badge</p>
              </div>
              <div className="rounded-xl bg-primary/5 border border-primary/20 p-3">
                <p className="font-bold text-foreground">Featured Spot</p>
                <p className="text-primary font-semibold text-base mt-1">₦35,000<span className="text-xs text-muted-foreground font-normal">/mo</span></p>
                <p className="mt-1">Listed + Featured label + Priority results + 1 Picks week</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Content Calendar ──────────────────────────────────────── */}
      {tab === "calendar" && (
        <div className="flex flex-col gap-6">
          <h2 className="text-base font-bold text-foreground">This Week</h2>

          {/* Outsy Picks this week */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <RiFireLine className="h-4 w-4 text-primary" />
              <h3 className="font-bold text-sm text-foreground">Outsy Picks — Week of {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</h3>
            </div>
            <div className="flex flex-col gap-2">
              {spots.filter((s) => s.isOutsyPick).slice(0, 5).map((spot, i) => (
                <div key={spot.id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-4">#{i + 1}</span>
                  <div className="relative h-8 w-8 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={spot.images[0]} alt={spot.name} fill className="object-cover" sizes="32px" />
                  </div>
                  <p className="text-sm text-foreground flex-1">{spot.name}</p>
                  <p className="text-xs text-muted-foreground">{spot.area}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Featured spots active */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <RiStoreLine className="h-4 w-4 text-secondary" />
              <h3 className="font-bold text-sm text-foreground">Featured Spots Active ({featuredSpots}/{5} max)</h3>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-3">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(featuredSpots / 5) * 100}%` }}
              />
            </div>
            <div className="flex flex-col gap-2">
              {spots.filter((s) => s.isFeatured).map((spot) => (
                <div key={spot.id} className="flex items-center gap-3">
                  <div className="relative h-8 w-8 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={spot.images[0]} alt={spot.name} fill className="object-cover" sizes="32px" />
                  </div>
                  <p className="text-sm text-foreground flex-1">{spot.name}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">Featured</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expiring businesses */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <RiAlertLine className="h-4 w-4 text-amber-500" />
              <h3 className="font-bold text-sm text-foreground">Expiring Soon</h3>
            </div>
            {BUSINESSES.filter((b) => {
              const diff = new Date(b.expiryDate).getTime() - Date.now();
              return diff < 7 * 24 * 60 * 60 * 1000 && b.status !== "Expired";
            }).length === 0 ? (
              <p className="text-sm text-muted-foreground">No businesses expiring in the next 7 days.</p>
            ) : (
              BUSINESSES.filter((b) => {
                const diff = new Date(b.expiryDate).getTime() - Date.now();
                return diff < 7 * 24 * 60 * 60 * 1000;
              }).map((biz) => (
                <div key={biz.id} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                  <p className="text-sm font-semibold text-foreground">{biz.name}</p>
                  <span className="text-xs text-amber-600 font-semibold">
                    {new Date(biz.expiryDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

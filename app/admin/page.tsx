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
  RiInstagramLine,
  RiGlobalLine,
} from "react-icons/ri";
import { IssueReport, Spot, Collection } from "@/lib/types";
import { AdminReports } from "@/components/admin/AdminReports";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { AdminVerification } from "@/components/admin/AdminVerification";
import { AdminBusinesses } from "@/components/admin/AdminBusinesses";
import { AdminCalendar } from "@/components/admin/AdminCalendar";
import { SpotForm } from "@/components/admin/SpotForm";
import { deleteSpot } from "@/app/actions/spots";
import {
  Dialog,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import spotsRaw from "@/data/spots.json";
import collectionsRaw from "@/data/collections.json";
import reportsRaw from "@/data/reports.json";

const spots = spotsRaw as Spot[];
const collections = collectionsRaw as Collection[];
const reports = reportsRaw as IssueReport[];

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

type Tab = "overview" | "analytics" | "verification" | "businesses" | "reports" | "calendar";

// ── Stats derived from mock data ──────────────────────────────────────────
const totalSpots = spots.length;
const featuredSpots = spots.filter((s) => s.isFeatured).length;
const urgentVerification = spots.filter((s) => getVerificationTier(s.lastVerifiedDate) === "urgent").length;
const activeBusinesses = 4; // Mock for now

export default function AdminPage() {
    const [tab, setTab] = useState<Tab>("overview");
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const router = useRouter();

    // Spot Form State
    const [isSpotFormOpen, setIsSpotFormOpen] = useState(false);
    const [editingSpot, setEditingSpot] = useState<Spot | undefined>(undefined);

    const handleAddSpot = () => {
      setEditingSpot(undefined);
      setIsSpotFormOpen(true);
    };

    const handleEditSpot = (spot: Spot) => {
      setEditingSpot(spot);
      setIsSpotFormOpen(true);
    };

    const handleDeleteSpot = async (id: string, name: string) => {
      if (confirm(`Are you sure you want to delete "${name}"?`)) {
        const result = await deleteSpot(id);
        if (result.success) {
          toast.success("Spot deleted successfully");
          router.refresh();
        } else {
          toast.error(result.error || "Failed to delete spot");
        }
      }
    };

    const filteredSpotsBySearch = useMemo(() => {
      return spots.filter(spot => {
        const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             spot.area.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || spot.category === categoryFilter;
        return matchesSearch && matchesCategory;
      });
    }, [searchQuery, categoryFilter]);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Admin Header (Full-Bleed) ─────────────────────────────────── */}
      <header className="border-b border-border bg-card mb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-5">
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
      </header>

      {/* ── Dashboard Content (Contained) ─────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 pb-20">

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
            <button 
              onClick={handleAddSpot}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <RiAddLine className="h-5 w-5" />
              Add New Spot
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
             <div className="relative flex-1">
                <RiGridLine className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search spots or areas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
             </div>
             <select 
               value={categoryFilter}
               onChange={(e) => setCategoryFilter(e.target.value)}
               className="px-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold min-w-[140px] appearance-none"
             >
                <option value="all">All Categories</option>
                <option value="restaurant">Restaurants</option>
                <option value="lounge">Lounges</option>
                <option value="activity">Activities</option>
                <option value="cafe">Cafes</option>
             </select>
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
                  {filteredSpotsBySearch.map((spot, i) => (
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
                          <button 
                            onClick={() => handleEditSpot(spot)}
                            className="p-2 rounded-xl text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-all" 
                            title="Edit Content"
                          >
                            <RiEditLine className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteSpot(spot.id, spot.name)}
                            className="p-2 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all" 
                            title="Delete Spot"
                          >
                            <RiDeleteBinLine className="h-5 w-5" />
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
      {tab === "analytics" && <AdminAnalytics />}

      {/* ── Tab: Reports & Moderation ─────────────────────────────────── */}
      {tab === "reports" && <AdminReports reports={reports} />}

      {/* ── Tab: Verification Queue ────────────────────────────────────── */}
      {tab === "verification" && <AdminVerification spots={spots} />}

      {/* ── Tab: Business & Payments ───────────────────────────────────── */}
      {tab === "businesses" && <AdminBusinesses />}

      {/* ── Tab: Content Calendar ──────────────────────────────────────── */}
      {tab === "calendar" && <AdminCalendar spots={spots} />}
       {/* ── Spot Form Dialog ─────────────────────────────────────────── */}
      <Dialog open={isSpotFormOpen} onOpenChange={setIsSpotFormOpen}>
        <SpotForm 
          initialData={editingSpot} 
          onSuccess={() => setIsSpotFormOpen(false)} 
        />
      </Dialog>
     </main>
    </div>
  );
}

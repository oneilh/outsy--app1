"use client";

import { useState, useMemo } from "react";
import { RiCheckboxCircleLine, RiFlagLine } from "react-icons/ri";
import { IssueReport } from "@/lib/types";
import { updateReportStatus, deleteReport } from "@/app/actions/reports";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AdminReportsProps {
  reports: IssueReport[];
}

export function AdminReports({ reports: initialReports }: AdminReportsProps) {
  const [statusFilter, setStatusFilter] = useState<"pending" | "resolved">("pending");
  const router = useRouter();

  const handleUpdateReport = async (reportId: string, status: IssueReport["status"]) => {
    const result = await updateReportStatus(reportId, status);
    if (result.success) {
      toast.success(`Report ${status === 'resolved' ? 'resolved' : 'dismissed'}`);
      router.refresh();
    } else {
      toast.error("Failed to update report");
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    const result = await deleteReport(reportId);
    if (result.success) {
      toast.success("Report deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete report");
    }
  };

  const filteredReports = useMemo(() => {
    return initialReports.filter((r) => r.status === statusFilter);
  }, [initialReports, statusFilter]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Issue Reports</h2>
          <p className="text-sm text-muted-foreground">User feedback and data corrections.</p>
        </div>
        <div className="bg-muted p-1 rounded-xl flex">
           <button 
            onClick={() => setStatusFilter("pending")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === "pending" ? "bg-white shadow-sm" : "text-muted-foreground"}`}
           >
             Active
           </button>
           <button 
            onClick={() => setStatusFilter("resolved")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === "resolved" ? "bg-white shadow-sm" : "text-muted-foreground"}`}
           >
             Resolved
           </button>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-border p-12 text-center">
           <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <RiCheckboxCircleLine className="h-8 w-8 text-muted-foreground" />
           </div>
           <h3 className="text-lg font-bold text-foreground">All Clear!</h3>
           <p className="text-muted-foreground mt-1">
             No {statusFilter} issue reports from users.
           </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReports.map((report) => (
            <div key={report.id} className="rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter border ${
                      report.issueType === 'closed_permanently' ? 'bg-red-50 text-red-700 border-red-100' :
                      report.issueType === 'incorrect_info' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {report.issueType.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">#{report.id} · {new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-bold text-foreground">{report.spotName}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {report.status === 'pending' ? (
                    <>
                      <button 
                        onClick={() => handleUpdateReport(report.id, 'resolved')}
                        className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors"
                      >
                        Resolve
                      </button>
                      <button 
                        onClick={() => handleUpdateReport(report.id, 'dismissed')}
                        className="px-4 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-bold hover:bg-muted/80 transition-colors"
                      >
                        Dismiss
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => handleDeleteReport(report.id)}
                      className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
                    >
                      Delete Permanent
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

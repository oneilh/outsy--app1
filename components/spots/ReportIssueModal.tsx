"use client";

import { useState } from "react";
import { RiCloseLine, RiFlagLine, RiCheckLine } from "react-icons/ri";
import posthog from 'posthog-js';
import { submitReport } from "@/app/actions/reports";
import { toast } from "sonner";

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  spotName: string;
  spotId?: string;
}

const ISSUE_TYPES = [
  "Closed / Moved",
  "Incorrect Price",
  "Wrong Information",
  "Bad Photo",
  "Other",
];

const ISSUE_TYPE_MAP: Record<string, any> = {
  "Closed / Moved": "closed_permanently",
  "Incorrect Price": "incorrect_info",
  "Wrong Information": "incorrect_info",
  "Bad Photo": "incorrect_info",
  "Other": "other",
};

export function ReportIssueModal({ isOpen, onClose, spotName, spotId }: ReportIssueModalProps) {
  const [selectedIssue, setSelectedIssue] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedIssue || isSubmitting) return;
    
    setIsSubmitting(true);
    
    // track event
    posthog.capture('report_submitted', {
      spot_name: spotName,
      spot_id: spotId,
      issue_type: selectedIssue,
    });

    const result = await submitReport({
      spotId,
      spotName,
      issueType: ISSUE_TYPE_MAP[selectedIssue] || 'other',
      description,
    });
    
    if (result.success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSelectedIssue("");
        setDescription("");
        onClose();
      }, 3000);
    } else {
      toast.error("Failed to submit report. Please try again.");
    }
    
    setIsSubmitting(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                <RiFlagLine className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Report an issue</h2>
            </div>
            <button 
              onClick={onClose}
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            >
              <RiCloseLine className="h-5 w-5" />
            </button>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                  What's wrong with {spotName}?
                </p>
                <div className="flex flex-wrap gap-2">
                  {ISSUE_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedIssue(type)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        selectedIssue === type
                          ? "bg-primary text-white scale-105"
                          : "bg-muted text-muted-foreground hover:bg-muted-foreground/10"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-2 block">
                  Additional Details
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us what's outdated or incorrect..."
                  className="w-full min-h-[100px] p-4 rounded-2xl bg-muted border border-transparent focus:border-primary/30 focus:bg-white transition-all text-sm outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={!selectedIssue || isSubmitting}
                className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
              >
                {isSubmitting ? "Sending..." : "Send Report"}
              </button>
            </form>
          ) : (
            <div className="py-12 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                <RiCheckLine className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Thanks for the heads up!</h3>
              <p className="text-sm text-muted-foreground mt-2 px-6">
                Our team will verify this and update the listing soon. Your feedback keeps Outsy reliable.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

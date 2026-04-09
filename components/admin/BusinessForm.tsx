"use client";

import { useState } from "react";
import { Business } from "@/lib/types";
import { addBusiness, updateBusiness } from "@/app/actions/businesses";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RiSaveLine, RiPriceTag3Line, RiCalendarLine, RiUserLine } from "react-icons/ri";

interface BusinessFormProps {
  initialData?: Business;
  onSuccess?: () => void;
}

export function BusinessForm({ initialData, onSuccess }: BusinessFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

  const [formData, setFormData] = useState<Partial<Business>>(
    initialData || {
      name: "",
      tier: "Basic",
      startDate: new Date().toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "Pending",
      contact: "",
      notes: "",
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name || !formData.contact) {
        toast.error("Name and Contact are required");
        setLoading(false);
        return;
      }

      const result = isEditing
        ? await updateBusiness(initialData.id, formData)
        : await addBusiness(formData as Omit<Business, 'id'>);

      if (result.success) {
        toast.success(`Business ${isEditing ? "updated" : "onboarded"} successfully`);
        router.refresh();
        onSuccess?.();
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Partnership" : "Onboard New Business"}</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6 py-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Business Name *</Label>
            <div className="relative">
              <RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className="pl-9"
                placeholder="e.g. Nok by Alara"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tier">Partnership Tier</Label>
              <div className="relative">
                <RiPriceTag3Line className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <select
                  id="tier"
                  name="tier"
                  value={formData.tier || "Basic"}
                  onChange={handleChange}
                  className="w-full h-10 pl-9 pr-3 py-2 rounded-md border border-input bg-background text-sm"
                >
                  <option value="Basic">Basic (₦15k)</option>
                  <option value="Featured">Featured (₦35k)</option>
                  <option value="Premium">Premium (₦75k)</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status || "Pending"}
                onChange={handleChange}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Expired">Expired</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                type="date"
                value={formData.expiryDate || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contact Info *</Label>
            <Input
              id="contact"
              name="contact"
              value={formData.contact || ""}
              onChange={handleChange}
              placeholder="Email, WhatsApp, or Instagram"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              placeholder="e.g. Needs renewal next month"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" disabled={loading} className="w-full gap-2">
            {loading ? "Processing..." : (
              <>
                <RiSaveLine className="h-4 w-4" />
                {isEditing ? "Update Business" : "Onboard Business"}
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

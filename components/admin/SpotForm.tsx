"use client";

import { useState } from "react";
import { Spot, SpotCategory, BudgetTier } from "@/lib/types";
import { addSpot, updateSpot } from "@/app/actions/spots";
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
import { RiSaveLine, RiImageLine, RiLinksLine, RiSettings4Line, RiFireLine } from "react-icons/ri";

interface SpotFormProps {
  initialData?: Spot;
  onSuccess?: () => void;
}

export function SpotForm({ initialData, onSuccess }: SpotFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

  const [formData, setFormData] = useState<Partial<Spot>>(
    initialData || {
      name: "",
      slug: "",
      description: "",
      area: "",
      city: "Lagos",
      category: "restaurant",
      budgetTier: "mid",
      priceRange: "₦₦₦",
      vibeTags: [],
      whoItsFor: [],
      amenities: [],
      bestTimeToGo: "",
      images: [""],
      phone: "",
      instagram: "",
      website: "",
      mapsUrl: "",
      isVerified: true,
      lastVerifiedDate: new Date().toISOString().split("T")[0],
      isFeatured: false,
      isOutsyPick: false,
      isNew: true,
      type: "spot",
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic validation
      if (!formData.name || !formData.slug || !formData.area) {
        toast.error("Please fill in required fields (Name, Slug, Area)");
        setLoading(false);
        return;
      }

      const result = isEditing
        ? await updateSpot(initialData.id, formData)
        : await addSpot(formData as Omit<Spot, 'id' | 'createdAt' | 'goingNowCount'>);

      if (result.success) {
        toast.success(`Spot ${isEditing ? "updated" : "added"} successfully`);
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
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (name: keyof Spot, value: string) => {
    const tags = value.split(",").map((t) => t.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, [name]: tags }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...(prev.images || []), ""] }));
  };

  return (
    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Spot" : "Add New Spot"}</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-8 py-4">
        {/* Basic Info Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-sm border-b pb-2">
            <RiSettings4Line className="h-5 w-5" />
            Core Information
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Spot Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                placeholder="e.g. Nok by Alara"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug || ""}
                onChange={handleChange}
                placeholder="e.g. nok-by-alara"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Tell us what makes this spot special..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={formData.category || "eating"}
                onChange={handleChange}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background"
              >
                <option value="eating">Eating</option>
                <option value="drinking">Drinking</option>
                <option value="outdoors">Outdoors</option>
                <option value="activities">Activities</option>
                <option value="nightlife">Nightlife</option>
                <option value="cafe">Cafe</option>
                <option value="hotel">Hotel</option>
                <option value="event">Event</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Area *</Label>
              <Input
                id="area"
                name="area"
                value={formData.area || ""}
                onChange={handleChange}
                placeholder="e.g. Victoria Island"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetTier">Budget</Label>
              <select
                id="budgetTier"
                name="budgetTier"
                value={formData.budgetTier || "mid"}
                onChange={handleChange}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="budget">Budget (₦)</option>
                <option value="mid">Mid-Range (₦₦)</option>
                <option value="splurge">Splurge (₦₦₦)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Vibe & Details Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-sm border-b pb-2">
            <RiFireLine className="h-5 w-5" />
            Vibe & Tags
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vibeTags">Vibe Tags (comma separated)</Label>
              <Input
                id="vibeTags"
                value={formData.vibeTags?.join(", ")}
                onChange={(e) => handleArrayChange("vibeTags", e.target.value)}
                placeholder="Aesthetic, Lively, Cozy..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whoItsFor">Who It's For (comma separated)</Label>
              <Input
                id="whoItsFor"
                value={formData.whoItsFor?.join(", ")}
                onChange={(e) => handleArrayChange("whoItsFor", e.target.value)}
                placeholder="Couples, Large Groups, Families..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amenities">Amenities (comma separated)</Label>
            <Input
              id="amenities"
              value={formData.amenities?.join(", ")}
              onChange={(e) => handleArrayChange("amenities", e.target.value)}
              placeholder="Valet Parking, Outdoor Seating, WiFi..."
            />
          </div>
        </section>

        {/* Media Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-sm border-b pb-2">
            <RiImageLine className="h-5 w-5" />
            Media & Visuals
          </div>
          <div className="space-y-3">
            <Label>Images (Unsplash/Local Paths)</Label>
            {formData.images?.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={url}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
                {index === (formData.images?.length || 0) - 1 && (
                  <Button type="button" variant="outline" onClick={addImageField}>
                    +
                  </Button>
                )}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL (Optional)</Label>
            <Input
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl || ""}
              onChange={handleChange}
              placeholder="Cloudinary/YouTube URL"
            />
          </div>
        </section>

        {/* Links & Contact */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-sm border-b pb-2">
            <RiLinksLine className="h-5 w-5" />
            Links & Contact
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram Handle</Label>
              <Input
                id="instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="nokbyalara"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+234..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mapsUrl">Google Maps URL</Label>
            <Input
              id="mapsUrl"
              name="mapsUrl"
              value={formData.mapsUrl || ""}
              onChange={handleChange}
              placeholder="https://goo.gl/maps/..."
            />
          </div>
        </section>

        {/* Admin Flags */}
        <section className="space-y-4 pt-4 border-t">
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isVerified"
                checked={formData.isVerified}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">Verified</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isOutsyPick"
                checked={formData.isOutsyPick}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">Outsy Pick</span>
            </label>
          </div>
        </section>

        <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto gap-2">
            {loading ? "Saving..." : (
              <>
                <RiSaveLine className="h-4 w-4" />
                {isEditing ? "Update Spot" : "Create Spot"}
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

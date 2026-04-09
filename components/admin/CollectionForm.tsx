"use client";

import { useState, useMemo } from "react";
import { Collection, Spot } from "@/lib/types";
import { addCollection, updateCollection } from "@/app/actions/collections";
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
import { RiSaveLine, RiImageLine, RiLinksLine, RiHashtag, RiSearchLine, RiCheckLine, RiCloseLine } from "react-icons/ri";
import Image from "next/image";

interface CollectionFormProps {
  initialData?: Collection;
  allSpots: Spot[];
  onSuccess?: () => void;
}

export function CollectionForm({ initialData, allSpots, onSuccess }: CollectionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

  const [formData, setFormData] = useState<Partial<Collection>>(
    initialData || {
      name: "",
      slug: "",
      description: "",
      coverImage: "",
      type: "curated",
      spotIds: [],
    }
  );

  const [spotSearch, setSpotSearch] = useState("");

  const filteredSpots = useMemo(() => {
    if (!spotSearch) return [];
    return allSpots.filter(s => 
      s.name.toLowerCase().includes(spotSearch.toLowerCase()) ||
      s.area.toLowerCase().includes(spotSearch.toLowerCase())
    ).slice(0, 5);
  }, [allSpots, spotSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name || !formData.slug) {
        toast.error("Name and Slug are required");
        setLoading(false);
        return;
      }

      const result = isEditing
        ? await updateCollection(initialData.id, formData)
        : await addCollection(formData as Omit<Collection, 'id'>);

      if (result.success) {
        toast.success(`Collection ${isEditing ? "updated" : "added"} successfully`);
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

  const toggleSpot = (spotId: string) => {
    setFormData((prev) => {
      const currentIds = prev.spotIds || [];
      if (currentIds.includes(spotId)) {
        return { ...prev, spotIds: currentIds.filter(id => id !== spotId) };
      } else {
        return { ...prev, spotIds: [...currentIds, spotId] };
      }
    });
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Collection" : "Create Collection"}</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6 py-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Collection Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                placeholder="e.g. Best Date Spots"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug || ""}
                onChange={handleChange}
                placeholder="e.g. best-date-spots"
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
              placeholder="What is this collection about?"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                name="type"
                value={formData.type || "curated"}
                onChange={handleChange}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="curated">Curated</option>
                <option value="category">Category</option>
                <option value="mood">Mood</option>
                <option value="who">Who is it for</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                name="coverImage"
                value={formData.coverImage || ""}
                onChange={handleChange}
                placeholder="Unsplash URL..."
              />
            </div>
          </div>
        </div>

        {/* Spot Selection */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <RiHashtag className="h-5 w-5" />
            Manage Spots ({formData.spotIds?.length || 0})
          </div>
          
          <div className="relative">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={spotSearch}
              onChange={(e) => setSpotSearch(e.target.value)}
              placeholder="Search spots to add..."
              className="pl-9"
            />
            {spotSearch && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-50 p-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {filteredSpots.length === 0 ? (
                  <p className="p-3 text-xs text-muted-foreground">No spots found</p>
                ) : (
                  filteredSpots.map(spot => (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={() => {
                        toggleSpot(spot.id);
                        setSpotSearch("");
                      }}
                      className="w-full flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors text-left"
                    >
                      <div className="relative h-8 w-8 rounded overflow-hidden flex-shrink-0 bg-muted">
                        {spot.images?.[0] && <Image src={spot.images[0]} alt={spot.name} fill className="object-cover" sizes="32px" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{spot.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{spot.area}</p>
                      </div>
                      {formData.spotIds?.includes(spot.id) && <RiCheckLine className="h-4 w-4 text-primary" />}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Selected Spots List */}
          <div className="flex flex-wrap gap-2">
            {formData.spotIds?.map(id => {
              const spot = allSpots.find(s => s.id === id);
              if (!spot) return null;
              return (
                <div key={id} className="flex items-center gap-2 bg-muted px-2 py-1 rounded-lg border border-border animate-in slide-in-from-left-1 duration-200">
                  <span className="text-[10px] font-bold truncate max-w-[120px]">{spot.name}</span>
                  <button 
                    type="button"
                    onClick={() => toggleSpot(id)}
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <RiCloseLine className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto gap-2">
            {loading ? "Saving..." : (
              <>
                <RiSaveLine className="h-4 w-4" />
                {isEditing ? "Update Collection" : "Create Collection"}
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

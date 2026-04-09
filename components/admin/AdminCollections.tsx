"use client";

import { useState, useMemo } from "react";
import { Collection, Spot } from "@/lib/types";
import { deleteCollection } from "@/app/actions/collections";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiSearchLine, RiHashtag, RiGroupLine, RiHeartLine, RiMapPinLine } from "react-icons/ri";
import { Dialog } from "@/components/ui/dialog";
import { CollectionForm } from "./CollectionForm";

interface AdminCollectionsProps {
  collections: Collection[];
  allSpots: Spot[];
}

const TYPE_ICONS = {
  curated: RiHeartLine,
  category: RiGridLine,
  mood: RiHashtag,
  who: RiGroupLine,
} as const;

import { RiGridLine } from "react-icons/ri";

export function AdminCollections({ collections, allSpots }: AdminCollectionsProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | undefined>(undefined);

  const filteredCollections = useMemo(() => {
    return collections.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [collections, searchQuery]);

  const handleEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingCollection(undefined);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const result = await deleteCollection(id);
      if (result.success) {
        toast.success("Collection deleted successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete collection");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Curated Collections</h2>
          <p className="text-sm text-muted-foreground">Manage thematic lists shown on the home screen.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <RiAddLine className="h-5 w-5" />
          Create Collection
        </button>
      </div>

      <div className="relative">
        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search collections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCollections.map((collection) => {
          const Icon = (TYPE_ICONS as any)[collection.type] || RiHashtag;
          return (
            <div key={collection.id} className="group relative rounded-3xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all">
              <div className="relative h-32 w-full overflow-hidden">
                <Image 
                  src={collection.coverImage} 
                  alt={collection.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-3 w-3 opacity-80" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{collection.type}</span>
                  </div>
                  <h3 className="font-bold text-base leading-tight">{collection.name}</h3>
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px] mb-4">
                  {collection.description}
                </p>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-tighter">
                      <RiMapPinLine className="h-3 w-3" />
                      {collection.spotIds.length} Spots
                   </div>
                   <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleEdit(collection)}
                        className="p-2 rounded-xl text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-all"
                      >
                        <RiEditLine className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(collection.id, collection.name)}
                        className="p-2 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <RiDeleteBinLine className="h-4 w-4" />
                      </button>
                   </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <CollectionForm 
          initialData={editingCollection} 
          allSpots={allSpots}
          onSuccess={() => setIsFormOpen(false)} 
        />
      </Dialog>
    </div>
  );
}

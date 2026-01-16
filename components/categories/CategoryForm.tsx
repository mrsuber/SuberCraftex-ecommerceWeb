"use client";

import { useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";

interface ParentCategory {
  id: string;
  name: string;
}

interface CategoryFormProps {
  children: ReactNode;
  parentCategories?: ParentCategory[];
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    imageUrl: string | null;
    sortOrder: number;
    isActive: boolean;
  };
}

export function CategoryForm({ children, parentCategories, category }: CategoryFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parentCats, setParentCats] = useState<ParentCategory[]>(parentCategories || []);
  const [imageUrl, setImageUrl] = useState(category?.imageUrl || "");
  const [selectedParentId, setSelectedParentId] = useState<string>(category?.parentId || "none");
  const [uploading, setUploading] = useState(false);

  const isEdit = !!category;

  // Fetch parent categories if not provided
  useEffect(() => {
    if (!parentCategories && open) {
      async function fetchParentCategories() {
        try {
          const res = await fetch("/api/categories?parentOnly=true");
          if (res.ok) {
            const data = await res.json();
            // Filter out the current category if editing (can't be its own parent)
            const filtered = category
              ? data.filter((c: ParentCategory) => c.id !== category.id)
              : data;
            setParentCats(filtered);
          }
        } catch (error) {
          console.error("Failed to fetch parent categories:", error);
        }
      }
      fetchParentCategories();
    }
  }, [parentCategories, open, category]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      const { url } = await response.json();
      setImageUrl(url);
      e.target.value = '';
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      parentId: selectedParentId === "none" ? null : selectedParentId,
      imageUrl: imageUrl || null,
      sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
      isActive: formData.get("isActive") === "on",
    };

    try {
      const url = isEdit ? `/api/categories/${category.id}` : "/api/categories";
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save category");
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Category" : "Add Category"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update category details" : "Create a new product category"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={category?.name}
              placeholder="Threads, Sewing Thread, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={category?.slug}
              placeholder="threads, sewing-thread"
              required
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly version (lowercase, hyphens instead of spaces)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentId">Parent Category</Label>
            <Select
              value={selectedParentId}
              onValueChange={setSelectedParentId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  None (This is a parent category)
                </SelectItem>
                {parentCats.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Leave as "None" to create a main category, or select a parent to create a subcategory
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={category?.description || ""}
              placeholder="Category description..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Category Image</Label>
            <div className="flex items-center gap-3">
              {imageUrl && (
                <div className="relative w-16 h-16 border rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={imageUrl}
                    alt="Category image"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading || loading}
                  className="cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Or paste image URL"
                    disabled={uploading || loading}
                    className="flex-1"
                  />
                  {uploading && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                name="sortOrder"
                type="number"
                defaultValue={category?.sortOrder || 0}
                placeholder="0"
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="isActive"
                name="isActive"
                defaultChecked={category?.isActive ?? true}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading || uploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

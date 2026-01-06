"use client";

import { useState, ReactNode } from "react";
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
import { Loader2 } from "lucide-react";

interface ServiceCategoryFormProps {
  children: ReactNode;
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    imageUrl: string | null;
    sortOrder: number;
    isActive: boolean;
  };
}

export function ServiceCategoryForm({ children, category }: ServiceCategoryFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEdit = !!category;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string || null,
      icon: formData.get("icon") as string || null,
      imageUrl: formData.get("imageUrl") as string || null,
      sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
      isActive: formData.get("isActive") === "on",
    };

    try {
      const url = isEdit
        ? `/api/services/categories/${category.id}`
        : "/api/services/categories";
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save service category");
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to save service category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Service Category" : "Add Service Category"}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? "Update service category details" : "Create a new service category"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={category?.name}
              placeholder="Woodworking, Dress Making, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={category?.slug}
              placeholder="woodworking-services"
              required
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly version (e.g., woodworking-services)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={category?.description || ""}
              placeholder="Category description..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Input
              id="icon"
              name="icon"
              defaultValue={category?.icon || ""}
              placeholder="wrench (lucide icon name)"
            />
            <p className="text-xs text-muted-foreground">
              Lucide icon name for display
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              defaultValue={category?.imageUrl || ""}
              placeholder="https://example.com/image.jpg"
            />
          </div>

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

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              name="isActive"
              defaultChecked={category?.isActive ?? true}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

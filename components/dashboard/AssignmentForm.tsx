"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, Loader2, X, Image as ImageIcon } from "lucide-react";

interface AssignmentFormProps {
  apprenticeId: string;
  assignment?: {
    id: string;
    title: string;
    description: string;
    instructions: string | null;
    dueDate: string | null;
    assignmentPhotos: string[];
  };
}

export function AssignmentForm({ apprenticeId, assignment }: AssignmentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [formData, setFormData] = useState({
    title: assignment?.title || "",
    description: assignment?.description || "",
    instructions: assignment?.instructions || "",
    dueDate: assignment?.dueDate
      ? new Date(assignment.dueDate).toISOString().split("T")[0]
      : "",
    assignmentPhotos: assignment?.assignmentPhotos || [],
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhoto(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("type", "assignment");
        formDataUpload.append("apprenticeId", apprenticeId);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (!response.ok) {
          throw new Error("Failed to upload photo");
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      setFormData((prev) => ({
        ...prev,
        assignmentPhotos: [...prev.assignmentPhotos, ...uploadedUrls],
      }));
      toast.success(`${uploadedUrls.length} photo(s) uploaded successfully`);
    } catch (error) {
      console.error("Error uploading photos:", error);
      toast.error("Failed to upload photos");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      assignmentPhotos: prev.assignmentPhotos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = assignment
        ? `/api/apprentices/${apprenticeId}/assignments/${assignment.id}`
        : `/api/apprentices/${apprenticeId}/assignments`;
      const method = assignment ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          dueDate: formData.dueDate || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save assignment");
      }

      toast.success(
        assignment ? "Assignment updated successfully" : "Assignment created successfully"
      );
      router.push(`/dashboard/apprentices/${apprenticeId}/assignments`);
      router.refresh();
    } catch (error) {
      console.error("Error saving assignment:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save assignment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g., Hem a pair of trousers"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Describe what needs to be done..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, instructions: e.target.value }))
              }
              placeholder="Step-by-step instructions (optional)..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reference Photos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload photos showing what the assignment should look like or reference materials.
          </p>

          {/* Photo Grid */}
          {formData.assignmentPhotos.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {formData.assignmentPhotos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Reference ${index + 1}`}
                    className="rounded-lg object-cover aspect-square w-full"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          <div>
            <Label htmlFor="photos" className="cursor-pointer">
              <div className="flex items-center justify-center gap-2 p-8 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
                {isUploadingPhoto ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload photos
                    </span>
                  </>
                )}
              </div>
            </Label>
            <Input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoUpload}
              disabled={isUploadingPhoto}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {assignment ? "Update Assignment" : "Create Assignment"}
        </Button>
      </div>
    </form>
  );
}

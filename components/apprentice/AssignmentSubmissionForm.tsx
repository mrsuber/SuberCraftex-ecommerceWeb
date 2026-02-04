"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2,
  X,
  Image as ImageIcon,
  Video,
  Plus,
  Send,
  Camera,
  FileText,
  File,
} from "lucide-react";

interface AssignmentSubmissionFormProps {
  apprenticeId: string;
  assignmentId: string;
  assignmentTitle: string;
  existingSubmission?: {
    submissionNotes: string | null;
    submissionPhotos: string[];
    submissionVideos: string[];
    submissionDocuments?: string[];
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AssignmentSubmissionForm({
  apprenticeId,
  assignmentId,
  assignmentTitle,
  existingSubmission,
  onSuccess,
  onCancel,
}: AssignmentSubmissionFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);

  const [formData, setFormData] = useState({
    submissionNotes: existingSubmission?.submissionNotes || "",
    submissionPhotos: existingSubmission?.submissionPhotos || [],
    submissionVideos: existingSubmission?.submissionVideos || [],
    submissionDocuments: existingSubmission?.submissionDocuments || [],
  });

  const [newVideoUrl, setNewVideoUrl] = useState("");

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhoto(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("type", "submission");
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
        submissionPhotos: [...prev.submissionPhotos, ...uploadedUrls],
      }));
      toast.success(`${uploadedUrls.length} photo(s) uploaded`);
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
      submissionPhotos: prev.submissionPhotos.filter((_, i) => i !== index),
    }));
  };

  const addVideoUrl = () => {
    if (!newVideoUrl.trim()) return;

    // Basic validation for YouTube URLs
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(newVideoUrl) && !newVideoUrl.includes("video")) {
      toast.error("Please enter a valid YouTube or video URL");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      submissionVideos: [...prev.submissionVideos, newVideoUrl.trim()],
    }));
    setNewVideoUrl("");
    toast.success("Video link added");
  };

  const removeVideo = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      submissionVideos: prev.submissionVideos.filter((_, i) => i !== index),
    }));
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingDocument(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("type", "document");
        formDataUpload.append("apprenticeId", apprenticeId);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (!response.ok) {
          throw new Error("Failed to upload document");
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      setFormData((prev) => ({
        ...prev,
        submissionDocuments: [...prev.submissionDocuments, ...uploadedUrls],
      }));
      toast.success(`${uploadedUrls.length} document(s) uploaded`);
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast.error("Failed to upload documents");
    } finally {
      setIsUploadingDocument(false);
    }
  };

  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      submissionDocuments: prev.submissionDocuments.filter((_, i) => i !== index),
    }));
  };

  const getDocumentName = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1] || "Document";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.submissionNotes.trim()) {
      toast.error("Please describe what you did");
      return;
    }

    if (formData.submissionPhotos.length === 0 && formData.submissionVideos.length === 0 && formData.submissionDocuments.length === 0) {
      toast.error("Please add at least one photo, video, or document");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/apprentices/${apprenticeId}/assignments/${assignmentId}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit assignment");
      }

      toast.success("Assignment submitted for review!");
      router.refresh();
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit assignment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Submit Your Work
          </CardTitle>
          <CardDescription>
            Submit your completed work for &quot;{assignmentTitle}&quot;
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Submission Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Describe What You Did *</Label>
            <Textarea
              id="notes"
              value={formData.submissionNotes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, submissionNotes: e.target.value }))
              }
              placeholder="Explain what you learned, challenges you faced, and how you completed the assignment..."
              rows={5}
              required
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Photos of Your Work
            </Label>
            <p className="text-sm text-muted-foreground">
              Upload photos showing your completed work from different angles.
            </p>

            {/* Photo Grid */}
            {formData.submissionPhotos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {formData.submissionPhotos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Submission ${index + 1}`}
                      className="rounded-lg object-cover aspect-square w-full border"
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
                <div className="flex items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
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
          </div>

          {/* Video Links */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Video Links (YouTube)
            </Label>
            <p className="text-sm text-muted-foreground">
              Add YouTube links showing your work process or final result.
            </p>

            {/* Video List */}
            {formData.submissionVideos.length > 0 && (
              <div className="space-y-2">
                {formData.submissionVideos.map((video, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                  >
                    <Video className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <a
                      href={video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline truncate flex-1"
                    >
                      {video}
                    </a>
                    <button
                      type="button"
                      onClick={() => removeVideo(index)}
                      className="p-1 hover:bg-destructive/10 rounded"
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Video URL */}
            <div className="flex gap-2">
              <Input
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                placeholder="Paste YouTube video URL..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addVideoUrl}
                disabled={!newVideoUrl.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* Documents Upload */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents (PDF, Word, etc.)
            </Label>
            <p className="text-sm text-muted-foreground">
              Upload supporting documents like pattern files, research notes, or design sketches.
            </p>

            {/* Document List */}
            {formData.submissionDocuments.length > 0 && (
              <div className="space-y-2">
                {formData.submissionDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                  >
                    <File className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <a
                      href={doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline truncate flex-1"
                    >
                      {getDocumentName(doc)}
                    </a>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="p-1 hover:bg-destructive/10 rounded"
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <div>
              <Label htmlFor="documents" className="cursor-pointer">
                <div className="flex items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
                  {isUploadingDocument ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <FileText className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload documents (PDF, DOC, DOCX)
                      </span>
                    </>
                  )}
                </div>
              </Label>
              <Input
                id="documents"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                multiple
                className="hidden"
                onChange={handleDocumentUpload}
                disabled={isUploadingDocument}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit for Review
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

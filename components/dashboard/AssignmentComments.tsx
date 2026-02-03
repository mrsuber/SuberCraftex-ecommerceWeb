"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Loader2,
  X,
  Image as ImageIcon,
  MessageSquare,
  Send,
  User,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  content: string;
  photos: string[];
  createdAt: string;
}

interface AssignmentCommentsProps {
  apprenticeId: string;
  assignmentId: string;
  currentUserRole: string;
}

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-100 text-red-800",
  tailor: "bg-blue-100 text-blue-800",
  apprentice: "bg-green-100 text-green-800",
};

export function AssignmentComments({
  apprenticeId,
  assignmentId,
  currentUserRole,
}: AssignmentCommentsProps) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [commentPhotos, setCommentPhotos] = useState<string[]>([]);

  useEffect(() => {
    fetchComments();
  }, [apprenticeId, assignmentId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `/api/apprentices/${apprenticeId}/assignments/${assignmentId}/comments`
      );
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhoto(true);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "comment");
        formData.append("apprenticeId", apprenticeId);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const data = await response.json();
        setCommentPhotos((prev) => [...prev, data.url]);
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Failed to upload photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const removePhoto = (index: number) => {
    setCommentPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/apprentices/${apprenticeId}/assignments/${assignmentId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: newComment.trim(),
            photos: commentPhotos,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      const comment = await response.json();
      setComments((prev) => [...prev, comment]);
      setNewComment("");
      setCommentPhotos([]);
      toast.success("Comment posted");
      router.refresh();
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Discussion ({comments.length})
        </CardTitle>
        <CardDescription>
          Comments and feedback on this assignment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comments List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>No comments yet</p>
            <p className="text-sm">Be the first to comment</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-9 w-9 flex-shrink-0">
                  <AvatarFallback className="text-xs">
                    {getInitials(comment.userName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{comment.userName}</span>
                    <Badge className={`${ROLE_COLORS[comment.userRole]} text-xs`}>
                      {comment.userRole}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                  {comment.photos.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {comment.photos.map((photo, idx) => (
                        <a
                          key={idx}
                          href={photo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={photo}
                            alt={`Comment photo ${idx + 1}`}
                            className="h-20 w-20 rounded-lg object-cover border hover:opacity-80 transition-opacity"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Comment Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-4 border-t">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={
              currentUserRole === "apprentice"
                ? "Ask a question or share your progress..."
                : "Add feedback or instructions..."
            }
            rows={3}
          />

          {/* Photo Attachments */}
          {commentPhotos.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {commentPhotos.map((photo, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={photo}
                    alt={`Attachment ${idx + 1}`}
                    className="h-16 w-16 rounded object-cover border"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute -top-1 -right-1 p-0.5 bg-destructive text-destructive-foreground rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="comment-photo" className="cursor-pointer">
                <div className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {isUploadingPhoto ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}
                  <span>Add photo</span>
                </div>
              </Label>
              <Input
                id="comment-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
                disabled={isUploadingPhoto}
              />
            </div>

            <Button type="submit" size="sm" disabled={isSubmitting || !newComment.trim()}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4 mr-1" />
                  Post
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

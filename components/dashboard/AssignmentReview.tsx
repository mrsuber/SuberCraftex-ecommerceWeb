"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssignmentReviewProps {
  apprenticeId: string;
  assignmentId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AssignmentReview({
  apprenticeId,
  assignmentId,
  onSuccess,
  onCancel,
}: AssignmentReviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState<"completed" | "needs_revision">("completed");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    if (!feedback.trim()) {
      toast.error("Please provide feedback");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/apprentices/${apprenticeId}/assignments/${assignmentId}/review`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating,
            feedback,
            status,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit review");
      }

      toast.success("Review submitted successfully");
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit review");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rating */}
      <div className="space-y-2">
        <Label>Rating *</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Star
                className={cn(
                  "h-8 w-8 transition-colors",
                  (hoveredRating || rating) >= value
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                )}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {rating > 0 ? `${rating}/5` : "Select rating"}
          </span>
        </div>
      </div>

      {/* Decision */}
      <div className="space-y-2">
        <Label>Decision *</Label>
        <RadioGroup
          value={status}
          onValueChange={(value) => setStatus(value as "completed" | "needs_revision")}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="completed" id="completed" />
            <Label htmlFor="completed" className="font-normal cursor-pointer">
              Mark as Completed - Assignment meets requirements
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="needs_revision" id="needs_revision" />
            <Label htmlFor="needs_revision" className="font-normal cursor-pointer">
              Needs Revision - Requires more work
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Feedback */}
      <div className="space-y-2">
        <Label htmlFor="feedback">Feedback *</Label>
        <Textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Provide detailed feedback about the work..."
          rows={4}
          required
        />
        <p className="text-xs text-muted-foreground">
          Be specific about what was done well and what could be improved.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Review
        </Button>
      </div>
    </form>
  );
}

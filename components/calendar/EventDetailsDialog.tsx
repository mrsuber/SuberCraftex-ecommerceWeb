"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface EventDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: any | null;
  onEventUpdated: () => void;
  userRole: string;
}

export function EventDetailsDialog({
  open,
  onOpenChange,
  event,
  onEventUpdated,
  userRole,
}: EventDetailsDialogProps) {
  const [completing, setCompleting] = useState(false);
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [completionNotes, setCompletionNotes] = useState("");

  if (!event) return null;

  const handleComplete = async () => {
    setCompleting(true);

    try {
      const response = await fetch(`/api/calendar/events/${event.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completionNotes }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete event");
      }

      toast.success(
        `Event completed! ${data.completedOnTime ? "On time" : "Late"} (+${data.disciplinePoints} points)`
      );

      onOpenChange(false);
      onEventUpdated();
      setShowCompleteForm(false);
      setCompletionNotes("");
    } catch (error: any) {
      console.error("Error completing event:", error);
      toast.error(error.message || "Failed to complete event");
    } finally {
      setCompleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-emerald-100 text-emerald-800";
      case "incomplete": return "bg-orange-100 text-orange-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const canComplete = userRole === "apprentice" && event.status === "scheduled" && !event.isCompleted;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{event.title}</span>
            <Badge className={getStatusColor(event.status)}>
              {event.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {event.description && (
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{event.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Start</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(event.startTime), "PPP p")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">End</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(event.endTime), "PPP p")}
                </p>
              </div>
            </div>
          </div>

          {event.location && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{event.location}</p>
              </div>
            </div>
          )}

          {event.apprentice && (
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Apprentice</p>
                <p className="text-sm text-muted-foreground">{event.apprentice.fullName}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Created by:</span>
            <Badge variant="outline">{event.createdByRole}</Badge>
          </div>

          {event.notes && (
            <div>
              <h4 className="font-semibold mb-2">Notes</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{event.notes}</p>
            </div>
          )}

          {event.isCompleted && event.completionNotes && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                Completion Notes
              </h4>
              <p className="text-sm text-green-700">{event.completionNotes}</p>
            </div>
          )}

          {event.conflicts && event.conflicts.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <h4 className="font-semibold mb-2 text-yellow-800">Conflicts Detected</h4>
              <p className="text-sm text-yellow-700">
                This event conflicts with {event.conflicts.length} other event(s)
              </p>
            </div>
          )}

          {canComplete && !showCompleteForm && (
            <Button onClick={() => setShowCompleteForm(true)} className="w-full">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Completed
            </Button>
          )}

          {showCompleteForm && (
            <div className="space-y-3 border-t pt-4">
              <Label htmlFor="completionNotes">Completion Notes (Optional)</Label>
              <Textarea
                id="completionNotes"
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="Add notes about completing this event..."
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleComplete}
                  disabled={completing}
                  className="flex-1"
                >
                  {completing ? "Completing..." : "Confirm Completion"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCompleteForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

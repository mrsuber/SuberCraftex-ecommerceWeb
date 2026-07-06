"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface EventDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: any | null;
  onEventUpdated: () => void;
  userRole: string;
  userId?: string;
}

export function EventDetailsDialog({
  open,
  onOpenChange,
  event,
  onEventUpdated,
  userRole,
  userId,
}: EventDetailsDialogProps) {
  const [completing, setCompleting] = useState(false);
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [completionNotes, setCompletionNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    notes: "",
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!event) return null;

  // Check if user can edit/delete (creator or admin)
  const canEdit = userId && (event.createdBy === userId || userRole === "admin");

  // Format datetime for input
  const formatDateTimeLocal = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Initialize edit form when entering edit mode
  const startEditing = () => {
    setEditData({
      title: event.title || "",
      description: event.description || "",
      startTime: formatDateTimeLocal(event.startTime),
      endTime: formatDateTimeLocal(event.endTime),
      location: event.location || "",
      notes: event.notes || "",
    });
    setIsEditing(true);
  };

  // Save edited event
  const handleSaveEdit = async () => {
    if (!editData.title || !editData.startTime || !editData.endTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    setCompleting(true);

    try {
      const response = await fetch(`/api/calendar/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editData.title,
          description: editData.description,
          startTime: new Date(editData.startTime).toISOString(),
          endTime: new Date(editData.endTime).toISOString(),
          location: editData.location,
          notes: editData.notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update event");
      }

      toast.success("Event updated successfully");
      setIsEditing(false);
      onEventUpdated();
    } catch (error: any) {
      console.error("Error updating event:", error);
      toast.error(error.message || "Failed to update event");
    } finally {
      setCompleting(false);
    }
  };

  // Delete event
  const handleDelete = async () => {
    setDeleting(true);

    try {
      const response = await fetch(`/api/calendar/events/${event.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete event");
      }

      toast.success("Event deleted successfully");
      setShowDeleteDialog(false);
      onOpenChange(false);
      onEventUpdated();
    } catch (error: any) {
      console.error("Error deleting event:", error);
      toast.error(error.message || "Failed to delete event");
    } finally {
      setDeleting(false);
    }
  };

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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{isEditing ? "Edit Event" : event.title}</span>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(event.status)}>
                  {event.status}
                </Badge>
                {canEdit && !isEditing && !showCompleteForm && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={startEditing}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDeleteDialog(true)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {isEditing ? (
              // Edit Form
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title *</Label>
                  <Input
                    id="edit-title"
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    placeholder="Event title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    placeholder="Event description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-startTime">Start Time *</Label>
                    <Input
                      id="edit-startTime"
                      type="datetime-local"
                      value={editData.startTime}
                      onChange={(e) => setEditData({ ...editData, startTime: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-endTime">End Time *</Label>
                    <Input
                      id="edit-endTime"
                      type="datetime-local"
                      value={editData.endTime}
                      onChange={(e) => setEditData({ ...editData, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={editData.location}
                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    placeholder="Event location"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    value={editData.notes}
                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                    placeholder="Additional notes"
                    rows={2}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSaveEdit}
                    disabled={completing}
                    className="flex-1"
                  >
                    {completing ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              // View Mode
              <>
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
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apprenticeId?: string;
  selectedDate?: Date;
  apprentices?: Array<{ id: string; fullName: string }>;
  onEventCreated: () => void;
  userRole: string;
}

const EVENT_TYPES = [
  { value: "class", label: "Class" },
  { value: "assignment_deadline", label: "Assignment Deadline" },
  { value: "meeting", label: "Meeting" },
  { value: "workshop", label: "Workshop" },
  { value: "exam", label: "Exam" },
  { value: "orientation", label: "Orientation" },
  { value: "personal_event", label: "Personal Event" },
  { value: "recurring_class", label: "Recurring Class" },
  { value: "mentor_session", label: "Mentor Session" },
  { value: "study_time", label: "Study Time" },
  { value: "break", label: "Break" },
  { value: "other", label: "Other" },
];

export function CreateEventDialog({
  open,
  onOpenChange,
  apprenticeId,
  selectedDate,
  apprentices,
  onEventCreated,
  userRole,
}: CreateEventDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventType: "personal_event",
    startTime: selectedDate ? formatDateTimeLocal(selectedDate) : "",
    endTime: selectedDate ? formatDateTimeLocal(new Date(selectedDate.getTime() + 3600000)) : "",
    isAllDay: false,
    apprenticeId: apprenticeId || "",
    location: "",
    color: "",
    notes: "",
    isRecurring: false,
    recurrencePattern: "",
    recurrenceEnd: "",
  });

  const [conflicts, setConflicts] = useState<string[]>([]);

  function formatDateTimeLocal(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.startTime || !formData.endTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (userRole !== "apprentice" && !formData.apprenticeId) {
      toast.error("Please select an apprentice");
      return;
    }

    setLoading(true);
    setConflicts([]);

    try {
      const response = await fetch("/api/calendar/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create event");
      }

      if (data.hasConflicts) {
        setConflicts([`This event conflicts with ${data.conflictCount} other event(s)`]);
      }

      toast.success(
        data.hasConflicts
          ? "Event created with conflicts detected"
          : "Event created successfully"
      );

      onOpenChange(false);
      onEventCreated();
      resetForm();
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast.error(error.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      eventType: "personal_event",
      startTime: "",
      endTime: "",
      isAllDay: false,
      apprenticeId: apprenticeId || "",
      location: "",
      color: "",
      notes: "",
      isRecurring: false,
      recurrencePattern: "",
      recurrenceEnd: "",
    });
    setConflicts([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Schedule a new event on the calendar
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {conflicts.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                {conflicts.map((conflict, idx) => (
                  <p key={idx}>{conflict}</p>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Event title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Event description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type *</Label>
              <Select
                value={formData.eventType}
                onValueChange={(value) => setFormData({ ...formData, eventType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {userRole !== "apprentice" && apprentices && (
              <div className="space-y-2">
                <Label htmlFor="apprenticeId">Apprentice *</Label>
                <Select
                  value={formData.apprenticeId}
                  onValueChange={(value) => setFormData({ ...formData, apprenticeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select apprentice" />
                  </SelectTrigger>
                  <SelectContent>
                    {apprentices.map((apprentice) => (
                      <SelectItem key={apprentice.id} value={apprentice.id}>
                        {apprentice.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isAllDay"
              checked={formData.isAllDay}
              onCheckedChange={(checked) => setFormData({ ...formData, isAllDay: checked })}
            />
            <Label htmlFor="isAllDay">All-day event</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Event location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes"
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isRecurring"
              checked={formData.isRecurring}
              onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked })}
            />
            <Label htmlFor="isRecurring">Recurring event</Label>
          </div>

          {formData.isRecurring && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recurrencePattern">Recurrence</Label>
                <Select
                  value={formData.recurrencePattern}
                  onValueChange={(value) => setFormData({ ...formData, recurrencePattern: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recurrenceEnd">Ends On</Label>
                <Input
                  id="recurrenceEnd"
                  type="date"
                  value={formData.recurrenceEnd}
                  onChange={(e) => setFormData({ ...formData, recurrenceEnd: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

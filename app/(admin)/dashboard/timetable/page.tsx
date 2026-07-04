"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Plus, Users, Clock, MapPin, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface TimetableEvent {
  id: string;
  title: string;
  description: string | null;
  eventType: string;
  status: string;
  startTime: string;
  endTime: string;
  location: string | null;
  serviceTrack: string | null;
  _count: {
    attendees: number;
  };
  attendees: any[];
}

interface Apprentice {
  id: string;
  fullName: string;
  email: string;
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  class: "Class",
  meeting: "Meeting",
  assignment_deadline: "Assignment Deadline",
  workshop: "Workshop",
  exam: "Exam",
  orientation: "Orientation",
  other: "Other",
};

const SERVICE_TRACK_LABELS: Record<string, string> = {
  tailoring: "Tailoring",
  device_repair: "Device Repair",
  beadwork: "Beadwork",
  henna: "Henna",
  printing_press: "Printing Press",
  embroidery: "Embroidery",
  electronics: "Electronics",
  computing: "Computing",
  woodworking_aerospace: "Woodworking → Aerospace",
  leather_working: "Leather Working",
  drawing_sketching: "Drawing & Sketching",
  beauty_grooming: "Beauty & Grooming",
  filmmaking: "Filmmaking & Video Production",
};

export default function TimetablePage() {
  const router = useRouter();
  const [events, setEvents] = useState<TimetableEvent[]>([]);
  const [apprentices, setApprentices] = useState<Apprentice[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("class");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [serviceTrack, setServiceTrack] = useState("");
  const [selectedApprentices, setSelectedApprentices] = useState<string[]>([]);

  useEffect(() => {
    fetchEvents();
    fetchApprentices();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/timetable/events");
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load timetable events");
    } finally {
      setLoading(false);
    }
  };

  const fetchApprentices = async () => {
    try {
      const response = await fetch("/api/apprentices");
      if (response.ok) {
        const data = await response.json();
        setApprentices(data);
      }
    } catch (error) {
      console.error("Error fetching apprentices:", error);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !startTime || !endTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    setCreating(true);

    try {
      const response = await fetch("/api/timetable/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          eventType,
          startTime,
          endTime,
          location,
          serviceTrack: serviceTrack || null,
          attendeeIds: selectedApprentices,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create event");
      }

      toast.success("Event created successfully");
      setCreateDialogOpen(false);
      resetForm();
      fetchEvents();
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast.error(error.message || "Failed to create event");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/timetable/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      toast.success("Event deleted successfully");
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEventType("class");
    setStartTime("");
    setEndTime("");
    setLocation("");
    setServiceTrack("");
    setSelectedApprentices([]);
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Timetable & Schedule</h1>
          <p className="text-muted-foreground">
            Manage classes, meetings, and events for apprentices
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Schedule a new class, meeting, or event for apprentices
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Tailoring Basics Class"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Event details..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventType">Event Type *</Label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceTrack">Service Track (Optional)</Label>
                  <Select value={serviceTrack} onValueChange={setServiceTrack}>
                    <SelectTrigger>
                      <SelectValue placeholder="All tracks" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All tracks</SelectItem>
                      {Object.entries(SERVICE_TRACK_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Room 101, Workshop"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? "Creating..." : "Create Event"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No events scheduled</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Create your first event to get started
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                        {EVENT_TYPE_LABELS[event.eventType]}
                      </span>
                      {event.serviceTrack && (
                        <span className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded">
                          {SERVICE_TRACK_LABELS[event.serviceTrack]}
                        </span>
                      )}
                    </div>

                    {event.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {event.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(new Date(event.startTime), "MMM d, yyyy h:mm a")} -{" "}
                        {format(new Date(event.endTime), "h:mm a")}
                      </div>

                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event._count.attendees} attendee(s)
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEvent(event.id, event.title)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

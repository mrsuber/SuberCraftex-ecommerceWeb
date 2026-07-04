"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle } from "lucide-react";
import { CalendarView } from "@/components/calendar/CalendarView";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CreateEventDialog } from "@/components/calendar/CreateEventDialog";
import { EventDetailsDialog } from "@/components/calendar/EventDetailsDialog";
import { toast } from "sonner";

type ViewMode = "year" | "month" | "week" | "day" | "agenda";

export default function ApprenticeCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  useEffect(() => {
    fetchEvents();
  }, [currentDate, viewMode]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Calculate date range based on view mode
      let startDate, endDate;
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      switch (viewMode) {
        case "year":
          startDate = new Date(year, 0, 1);
          endDate = new Date(year, 11, 31);
          break;
        case "month":
          startDate = new Date(year, month, 1);
          endDate = new Date(year, month + 1, 0);
          break;
        case "week":
          const weekStart = new Date(currentDate);
          weekStart.setDate(currentDate.getDate() - currentDate.getDay());
          startDate = weekStart;
          endDate = new Date(weekStart);
          endDate.setDate(weekStart.getDate() + 6);
          break;
        case "day":
          startDate = new Date(currentDate);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(currentDate);
          endDate.setHours(23, 59, 59, 999);
          break;
        case "agenda":
          startDate = new Date(year, month, 1);
          endDate = new Date(year, month + 2, 0); // Next 2 months
          break;
      }

      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      const response = await fetch(`/api/calendar/events?${params}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        throw new Error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load calendar events");
    } finally {
      setLoading(false);
    }
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setEventDetailsOpen(true);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setCreateDialogOpen(true);
  };

  const handleEventCreated = () => {
    fetchEvents();
  };

  const handleEventUpdated = () => {
    fetchEvents();
    setEventDetailsOpen(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Calendar</h1>
            <p className="text-muted-foreground">
              Manage your schedule, events, and assignments
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onDateChange={setCurrentDate}
        onViewModeChange={setViewMode}
        onTodayClick={handleTodayClick}
      />

      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading calendar...</p>
            </div>
          </div>
        ) : (
          <CalendarView
            events={events}
            viewMode={viewMode}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            onEventClick={handleEventClick}
            onDateClick={handleDateClick}
            showApprenticeNames={false}
          />
        )}
      </div>

      {/* Legend */}
      <div className="border-t p-4 bg-muted/30">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Admin Created</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Mentor Created</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>My Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Pending Approval</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span>Completed</span>
          </div>
        </div>
      </div>

      <CreateEventDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        selectedDate={selectedDate}
        onEventCreated={handleEventCreated}
        userRole="apprentice"
      />

      <EventDetailsDialog
        open={eventDetailsOpen}
        onOpenChange={setEventDetailsOpen}
        event={selectedEvent}
        onEventUpdated={handleEventUpdated}
        userRole="apprentice"
      />
    </div>
  );
}

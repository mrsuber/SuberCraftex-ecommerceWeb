"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek, addDays, startOfYear, endOfYear, eachMonthOfInterval } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ViewMode = "year" | "month" | "week" | "day" | "agenda";

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  eventType: string;
  status: string;
  color?: string;
  createdByRole: string;
  isCompleted: boolean;
  apprentice?: {
    fullName: string;
  };
}

interface CalendarViewProps {
  events: CalendarEvent[];
  viewMode: ViewMode;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  showApprenticeNames?: boolean;
  onEventUpdate?: () => void;
  userId?: string;
}

export function CalendarView({
  events,
  viewMode,
  currentDate,
  onDateChange,
  onEventClick,
  onDateClick,
  showApprenticeNames = false,
  onEventUpdate,
  userId,
}: CalendarViewProps) {
  const getEventColor = (event: CalendarEvent) => {
    if (event.color) return event.color;

    // Color by status
    if (event.status === "pending") return "#FFA500"; // Orange
    if (event.status === "approved") return "#22C55E"; // Green
    if (event.status === "rejected") return "#EF4444"; // Red
    if (event.status === "completed") return "#10B981"; // Emerald
    if (event.status === "incomplete") return "#F97316"; // Orange-red
    if (event.status === "cancelled") return "#6B7280"; // Gray

    // Color by creator role
    if (event.createdByRole === "admin") return "#3B82F6"; // Blue
    if (event.createdByRole === "mentor") return "#22C55E"; // Green
    if (event.createdByRole === "apprentice") return "#A855F7"; // Purple
    if (event.createdByRole === "system") return "#6366F1"; // Indigo

    return "#6B7280"; // Default gray
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime);
      return (
        (isSameDay(eventStart, date)) ||
        (date >= eventStart && date <= eventEnd)
      );
    });
  };

  if (viewMode === "year") {
    return <YearView currentDate={currentDate} events={events} onMonthClick={(date) => onDateChange(date)} getEventColor={getEventColor} />;
  }

  if (viewMode === "month") {
    return <MonthView currentDate={currentDate} events={events} onEventClick={onEventClick} onDateClick={onDateClick} getEventsForDate={getEventsForDate} getEventColor={getEventColor} />;
  }

  if (viewMode === "week") {
    return <WeekView currentDate={currentDate} events={events} onEventClick={onEventClick} getEventsForDate={getEventsForDate} getEventColor={getEventColor} showApprenticeNames={showApprenticeNames} onEventUpdate={onEventUpdate} userId={userId} />;
  }

  if (viewMode === "day") {
    return <DayView currentDate={currentDate} events={events} onEventClick={onEventClick} getEventsForDate={getEventsForDate} getEventColor={getEventColor} showApprenticeNames={showApprenticeNames} />;
  }

  if (viewMode === "agenda") {
    return <AgendaView currentDate={currentDate} events={events} onEventClick={onEventClick} getEventColor={getEventColor} showApprenticeNames={showApprenticeNames} />;
  }

  return null;
}

// Year View Component
function YearView({
  currentDate,
  events,
  onMonthClick,
  getEventColor,
}: {
  currentDate: Date;
  events: CalendarEvent[];
  onMonthClick: (date: Date) => void;
  getEventColor: (event: CalendarEvent) => string;
}) {
  const year = currentDate.getFullYear();
  const months = eachMonthOfInterval({
    start: startOfYear(currentDate),
    end: endOfYear(currentDate),
  });

  const getEventsForMonth = (month: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return eventDate.getMonth() === month.getMonth() && eventDate.getFullYear() === month.getFullYear();
    });
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-4 p-4">
      {months.map((month) => {
        const monthEvents = getEventsForMonth(month);
        return (
          <Card
            key={month.toISOString()}
            className="p-3 cursor-pointer hover:bg-accent transition-colors"
            onClick={() => onMonthClick(month)}
          >
            <h3 className="font-semibold text-sm mb-2">{format(month, "MMMM")}</h3>
            <div className="grid grid-cols-7 gap-1 text-xs">
              {eachDayOfInterval({
                start: startOfMonth(month),
                end: endOfMonth(month),
              }).map((day) => {
                const dayEvents = events.filter((event) => isSameDay(new Date(event.startTime), day));
                const hasEvents = dayEvents.length > 0;
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "aspect-square flex items-center justify-center rounded",
                      hasEvents && "relative"
                    )}
                  >
                    <span className={cn(isToday(day) && "font-bold text-primary")}>
                      {format(day, "d")}
                    </span>
                    {hasEvents && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {dayEvents.slice(0, 3).map((event, idx) => (
                          <div
                            key={idx}
                            className="w-1 h-1 rounded-full"
                            style={{ backgroundColor: getEventColor(event) }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {monthEvents.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                {monthEvents.length} event{monthEvents.length !== 1 ? "s" : ""}
              </p>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// Month View Component
function MonthView({
  currentDate,
  events,
  onEventClick,
  onDateClick,
  getEventsForDate,
  getEventColor,
}: {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  getEventsForDate: (date: Date) => CalendarEvent[];
  getEventColor: (event: CalendarEvent) => string;
}) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="flex flex-col h-full">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-semibold">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-rows-5">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 border-b last:border-b-0">
            {week.map((day) => {
              const dayEvents = getEventsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isDayToday = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "border-r last:border-r-0 p-1 min-h-[100px] cursor-pointer hover:bg-accent/50 transition-colors",
                    !isCurrentMonth && "bg-muted/30 text-muted-foreground"
                  )}
                  onClick={() => onDateClick?.(day)}
                >
                  <div className={cn(
                    "text-sm mb-1 font-medium",
                    isDayToday && "bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center"
                  )}>
                    {format(day, "d")}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80"
                        style={{ backgroundColor: getEventColor(event), color: "white" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                      >
                        {format(new Date(event.startTime), "h:mm a")} {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground pl-1">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// Week View Component
function WeekView({
  currentDate,
  events,
  onEventClick,
  getEventsForDate,
  getEventColor,
  showApprenticeNames,
  onEventUpdate,
  userId,
}: {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  getEventsForDate: (date: Date) => CalendarEvent[];
  getEventColor: (event: CalendarEvent) => string;
  showApprenticeNames: boolean;
  onEventUpdate?: () => void;
  userId?: string;
}) {
  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const HOUR_HEIGHT = 60; // Height of each hour slot in pixels

  // Drag state
  const [draggingEvent, setDraggingEvent] = useState<{ event: CalendarEvent; mode: 'move' | 'resize' } | null>(null);
  const [dragPreview, setDragPreview] = useState<{ top: number; height: number } | null>(null);
  const [initialDragY, setInitialDragY] = useState(0);
  const [initialEventTop, setInitialEventTop] = useState(0);
  const [initialEventHeight, setInitialEventHeight] = useState(0);

  // Calculate event position and height
  const getEventStyle = (event: CalendarEvent, dayStart: Date) => {
    const eventStart = new Date(event.startTime);
    const eventEnd = new Date(event.endTime);

    // Calculate minutes from start of day
    const startMinutes = eventStart.getHours() * 60 + eventStart.getMinutes();
    const endMinutes = eventEnd.getHours() * 60 + eventEnd.getMinutes();

    // Calculate position and height
    const top = (startMinutes / 60) * HOUR_HEIGHT;
    const height = ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT;

    return {
      top: `${top}px`,
      height: `${Math.max(height - 2, 20)}px`, // Minimum 20px height, -2px for gap
      left: '2px',
      right: '2px',
    };
  };

  // Check if user can edit event
  const canEditEvent = (event: CalendarEvent) => {
    return userId && (event.createdBy === userId);
  };

  // Handle drag start for moving
  const handleDragStart = (e: React.MouseEvent, event: CalendarEvent, mode: 'move' | 'resize') => {
    if (!canEditEvent(event)) return;

    e.stopPropagation();
    const style = getEventStyle(event, new Date());
    const top = parseFloat(style.top);
    const height = parseFloat(style.height);

    setDraggingEvent({ event, mode });
    setInitialDragY(e.clientY);
    setInitialEventTop(top);
    setInitialEventHeight(height);
    setDragPreview({ top, height });
  };

  // Handle drag move
  const handleDragMove = (e: React.MouseEvent) => {
    if (!draggingEvent || !dragPreview) return;

    const deltaY = e.clientY - initialDragY;

    if (draggingEvent.mode === 'move') {
      // Move entire event
      const newTop = Math.max(0, Math.min(initialEventTop + deltaY, HOUR_HEIGHT * 24 - dragPreview.height));
      setDragPreview({ ...dragPreview, top: newTop });
    } else if (draggingEvent.mode === 'resize') {
      // Resize event
      const newHeight = Math.max(30, initialEventHeight + deltaY); // Min 30px (0.5 hour)
      setDragPreview({ top: dragPreview.top, height: newHeight });
    }
  };

  // Handle drag end
  const handleDragEnd = async () => {
    if (!draggingEvent || !dragPreview || !onEventUpdate) {
      setDraggingEvent(null);
      setDragPreview(null);
      return;
    }

    const { event, mode } = draggingEvent;

    // Calculate new times
    const startMinutes = Math.round((dragPreview.top / HOUR_HEIGHT) * 60);
    const durationMinutes = Math.round((dragPreview.height / HOUR_HEIGHT) * 60);

    const startHour = Math.floor(startMinutes / 60);
    const startMinute = startMinutes % 60;
    const endMinutes = startMinutes + durationMinutes;
    const endHour = Math.floor(endMinutes / 60);
    const endMinute = endMinutes % 60;

    // Create new date objects
    const eventDate = new Date(event.startTime);
    const newStart = new Date(eventDate);
    newStart.setHours(startHour, startMinute, 0, 0);

    const newEnd = new Date(eventDate);
    newEnd.setHours(endHour, endMinute, 0, 0);

    // Update event via API
    try {
      const response = await fetch(`/api/calendar/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: newStart.toISOString(),
          endTime: newEnd.toISOString(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update event');
      }

      toast.success('Event updated successfully');
      onEventUpdate();
    } catch (error: any) {
      console.error('Error updating event:', error);
      toast.error(error.message || 'Failed to update event');
    } finally {
      setDraggingEvent(null);
      setDragPreview(null);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Day headers */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b sticky top-0 bg-background z-10">
        <div className="p-2"></div>
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="p-2 text-center border-l">
            <div className="text-sm font-semibold">{format(day, "EEE")}</div>
            <div className={cn(
              "text-2xl font-bold",
              isToday(day) && "bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center mx-auto"
            )}>
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      {/* Time slots */}
      <div className="flex-1 relative">
        <div className="grid grid-cols-[60px_repeat(7,1fr)]" style={{ height: `${HOUR_HEIGHT * 24}px` }}>
          {/* Hour labels */}
          <div className="relative">
            {hours.map((hour) => (
              <div
                key={hour}
                className="absolute w-full text-right pr-2 text-sm text-muted-foreground border-b"
                style={{
                  top: `${hour * HOUR_HEIGHT}px`,
                  height: `${HOUR_HEIGHT}px`,
                  lineHeight: `${HOUR_HEIGHT}px`
                }}
              >
                {format(new Date().setHours(hour, 0), "h a")}
              </div>
            ))}
          </div>

          {/* Day columns with events */}
          {weekDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDate(day);

            return (
              <div
                key={day.toISOString()}
                className="relative border-l"
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
              >
                {/* Hour grid lines */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="absolute w-full border-b"
                    style={{
                      top: `${hour * HOUR_HEIGHT}px`,
                      height: `${HOUR_HEIGHT}px`
                    }}
                  />
                ))}

                {/* Events positioned absolutely */}
                {dayEvents.map((event) => {
                  const style = getEventStyle(event, day);
                  const isDragging = draggingEvent?.event.id === event.id;
                  const isEditable = canEditEvent(event);

                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "absolute text-xs p-2 rounded overflow-hidden",
                        isEditable ? "cursor-move" : "cursor-pointer",
                        !isDragging && "hover:opacity-90 transition-opacity"
                      )}
                      style={{
                        ...style,
                        backgroundColor: getEventColor(event),
                        color: "white",
                        zIndex: isDragging ? 10 : 1,
                        opacity: isDragging ? 0.5 : 1,
                      }}
                      onClick={(e) => {
                        if (!isDragging) {
                          onEventClick(event);
                        }
                      }}
                      onMouseDown={(e) => {
                        if (isEditable) {
                          handleDragStart(e, event, 'move');
                        }
                      }}
                    >
                      <div className="font-semibold truncate">{event.title}</div>
                      <div className="text-[10px] opacity-90">
                        {format(new Date(event.startTime), "h:mm a")}
                      </div>
                      {showApprenticeNames && event.apprentice && (
                        <div className="text-[10px] opacity-80 truncate">{event.apprentice.fullName}</div>
                      )}

                      {/* Resize handle */}
                      {isEditable && (
                        <div
                          className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-white/20"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            handleDragStart(e, event, 'resize');
                          }}
                        />
                      )}
                    </div>
                  );
                })}

                {/* Drag preview overlay */}
                {draggingEvent && dragPreview && (
                  <div
                    className="absolute border-2 border-dashed border-white bg-white/10 rounded pointer-events-none"
                    style={{
                      top: `${dragPreview.top}px`,
                      height: `${dragPreview.height}px`,
                      left: '2px',
                      right: '2px',
                      zIndex: 20,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Day View Component
function DayView({
  currentDate,
  events,
  onEventClick,
  getEventsForDate,
  getEventColor,
  showApprenticeNames,
}: {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  getEventsForDate: (date: Date) => CalendarEvent[];
  getEventColor: (event: CalendarEvent) => string;
  showApprenticeNames: boolean;
}) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayEvents = getEventsForDate(currentDate);

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <div className="border-b p-4 sticky top-0 bg-background z-10">
        <h2 className="text-2xl font-bold">{format(currentDate, "EEEE, MMMM d, yyyy")}</h2>
        <p className="text-sm text-muted-foreground">{dayEvents.length} events</p>
      </div>

      {/* Time slots */}
      <div className="flex-1">
        {hours.map((hour) => {
          const hourEvents = dayEvents.filter((event) => {
            const eventHour = new Date(event.startTime).getHours();
            return eventHour === hour;
          });

          return (
            <div key={hour} className="flex border-b min-h-[80px]">
              <div className="w-20 p-2 text-right text-sm text-muted-foreground flex-shrink-0">
                {format(new Date().setHours(hour, 0), "h:mm a")}
              </div>
              <div className="flex-1 p-2 border-l space-y-2">
                {hourEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 rounded cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: getEventColor(event), color: "white" }}
                    onClick={() => onEventClick(event)}
                  >
                    <div className="font-semibold text-sm">{event.title}</div>
                    <div className="text-xs opacity-90">
                      {format(new Date(event.startTime), "h:mm a")} - {format(new Date(event.endTime), "h:mm a")}
                    </div>
                    {showApprenticeNames && event.apprentice && (
                      <div className="text-xs opacity-90 mt-1">{event.apprentice.fullName}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Agenda View Component
function AgendaView({
  currentDate,
  events,
  onEventClick,
  getEventColor,
  showApprenticeNames,
}: {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  getEventColor: (event: CalendarEvent) => string;
  showApprenticeNames: boolean;
}) {
  // Group events by date
  const groupedEvents = events.reduce((acc, event) => {
    const dateKey = format(new Date(event.startTime), "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  const sortedDates = Object.keys(groupedEvents).sort();

  return (
    <div className="p-4 space-y-6 overflow-auto h-full">
      {sortedDates.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No events scheduled</p>
        </div>
      ) : (
        sortedDates.map((dateKey) => {
          const date = new Date(dateKey);
          const dateEvents = groupedEvents[dateKey];

          return (
            <div key={dateKey} className="space-y-3">
              <div className="sticky top-0 bg-background py-2 border-b">
                <h3 className="font-semibold text-lg">
                  {format(date, "EEEE, MMMM d, yyyy")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {dateEvents.length} event{dateEvents.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="space-y-2">
                {dateEvents
                  .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                  .map((event) => (
                    <Card
                      key={event.id}
                      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => onEventClick(event)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-1 h-full rounded-full flex-shrink-0"
                          style={{ backgroundColor: getEventColor(event) }}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(event.startTime), "h:mm a")} -{" "}
                            {format(new Date(event.endTime), "h:mm a")}
                          </p>
                          {showApprenticeNames && event.apprentice && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {event.apprentice.fullName}
                            </p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <span
                              className="text-xs px-2 py-1 rounded"
                              style={{
                                backgroundColor: getEventColor(event) + "20",
                                color: getEventColor(event),
                              }}
                            >
                              {event.eventType.replace("_", " ")}
                            </span>
                            <span className="text-xs px-2 py-1 rounded bg-secondary">
                              {event.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

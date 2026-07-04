import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth/api-auth";
import { CalendarEventType, EventCreatorRole } from "@prisma/client";

export const dynamic = "force-dynamic";

// GET /api/calendar/events - Get calendar events
export async function GET(request: NextRequest) {
  try {
    const user = await requireApiAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const apprenticeId = searchParams.get("apprenticeId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const eventType = searchParams.get("eventType");
    const status = searchParams.get("status");
    const includeDeleted = searchParams.get("includeDeleted") === "true";

    // Build where clause
    const where: any = {
      isDeleted: includeDeleted ? undefined : false,
    };

    // Role-based filtering
    if (user.role === "apprentice") {
      // Apprentices can only see their own events
      const apprentice = await db.apprentice.findUnique({
        where: { userId: user.id },
      });
      if (!apprentice) {
        return NextResponse.json({ error: "Apprentice not found" }, { status: 404 });
      }
      where.apprenticeId = apprentice.id;
    } else if (apprenticeId) {
      // Admin/mentor can filter by specific apprentice
      where.apprenticeId = apprenticeId;
    }

    // Date range filter
    if (startDate && endDate) {
      where.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Event type filter
    if (eventType && eventType !== "all") {
      where.eventType = eventType;
    }

    // Status filter
    if (status && status !== "all") {
      where.status = status;
    }

    const events = await db.calendarEvent.findMany({
      where,
      include: {
        apprentice: {
          select: {
            id: true,
            fullName: true,
            email: true,
            photoUrl: true,
          },
        },
        assignment: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        editRequests: {
          where: { status: "pending" },
          select: {
            id: true,
            requestType: true,
            createdAt: true,
          },
        },
        conflicts: {
          where: { isResolved: false },
          select: {
            id: true,
            conflictType: true,
            event2Id: true,
          },
        },
        _count: {
          select: {
            editRequests: true,
            conflicts: true,
            reminders: true,
          },
        },
      },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar events" },
      { status: 500 }
    );
  }
}

// POST /api/calendar/events - Create a new calendar event
export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      eventType,
      startTime,
      endTime,
      isAllDay,
      apprenticeId,
      location,
      color,
      notes,
      isRecurring,
      recurrencePattern,
      recurrenceEnd,
      dueDate,
    } = body;

    // Validation
    if (!title || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Title, start time, and end time are required" },
        { status: 400 }
      );
    }

    // Validate date range
    if (new Date(endTime) <= new Date(startTime)) {
      return NextResponse.json(
        { error: "End time must be after start time" },
        { status: 400 }
      );
    }

    // Determine apprentice ID based on user role
    let targetApprenticeId = apprenticeId;
    let creatorRole: EventCreatorRole = "admin";

    if (user.role === "apprentice") {
      const apprentice = await db.apprentice.findUnique({
        where: { userId: user.id },
      });
      if (!apprentice) {
        return NextResponse.json({ error: "Apprentice not found" }, { status: 404 });
      }
      targetApprenticeId = apprentice.id;
      creatorRole = "apprentice";
    } else {
      // Admin/mentor must specify apprentice
      if (!apprenticeId) {
        return NextResponse.json(
          { error: "Apprentice ID is required" },
          { status: 400 }
        );
      }
      creatorRole = user.role === "admin" ? "admin" : "mentor";
    }

    // Check for 24-hour advance requirement (for admin/mentor)
    if (creatorRole !== "apprentice") {
      const now = new Date();
      const eventStart = new Date(startTime);
      const hoursUntilEvent = (eventStart.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursUntilEvent < 24) {
        return NextResponse.json(
          { error: "Events must be created at least 24 hours in advance" },
          { status: 400 }
        );
      }
    }

    // Check for conflicts
    const conflicts = await db.calendarEvent.findMany({
      where: {
        apprenticeId: targetApprenticeId,
        isDeleted: false,
        status: { not: "cancelled" },
        OR: [
          {
            // New event starts during existing event
            AND: [
              { startTime: { lte: new Date(startTime) } },
              { endTime: { gt: new Date(startTime) } },
            ],
          },
          {
            // New event ends during existing event
            AND: [
              { startTime: { lt: new Date(endTime) } },
              { endTime: { gte: new Date(endTime) } },
            ],
          },
          {
            // New event completely contains existing event
            AND: [
              { startTime: { gte: new Date(startTime) } },
              { endTime: { lte: new Date(endTime) } },
            ],
          },
        ],
      },
    });

    // Create event
    const event = await db.calendarEvent.create({
      data: {
        title,
        description,
        eventType: eventType || "personal_event",
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        isAllDay: isAllDay || false,
        apprenticeId: targetApprenticeId,
        createdBy: user.id,
        createdByRole: creatorRole,
        location,
        color,
        notes,
        isRecurring: isRecurring || false,
        recurrencePattern,
        recurrenceEnd: recurrenceEnd ? new Date(recurrenceEnd) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: creatorRole === "apprentice" ? "pending" : "scheduled",
      },
      include: {
        apprentice: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    // Log conflicts if any
    if (conflicts.length > 0) {
      for (const conflictingEvent of conflicts) {
        await db.eventConflict.create({
          data: {
            event1Id: event.id,
            event2Id: conflictingEvent.id,
            conflictType: "time_overlap",
          },
        });
      }
    }

    // Create reminders for the event
    const eventStart = new Date(startTime);
    const oneDayBefore = new Date(eventStart.getTime() - 24 * 60 * 60 * 1000);
    const oneHourBefore = new Date(eventStart.getTime() - 60 * 60 * 1000);

    // Only create reminders if event is in the future
    const now = new Date();
    if (eventStart > now) {
      if (oneDayBefore > now) {
        await db.calendarReminder.create({
          data: {
            eventId: event.id,
            apprenticeId: targetApprenticeId,
            reminderType: "one_day_before",
            scheduledFor: oneDayBefore,
            emailTo: event.apprentice.email,
            emailSubject: `Reminder: ${title} tomorrow`,
            emailBody: "",
            emailStatus: "pending",
          },
        });
      }

      if (oneHourBefore > now) {
        await db.calendarReminder.create({
          data: {
            eventId: event.id,
            apprenticeId: targetApprenticeId,
            reminderType: "one_hour_before",
            scheduledFor: oneHourBefore,
            emailTo: event.apprentice.email,
            emailSubject: `Reminder: ${title} in 1 hour`,
            emailBody: "",
            emailStatus: "pending",
          },
        });
      }
    }

    console.log(
      `✅ Created calendar event: ${title} for ${event.apprentice.fullName}${conflicts.length > 0 ? ` (${conflicts.length} conflicts detected)` : ""}`
    );

    return NextResponse.json(
      {
        ...event,
        hasConflicts: conflicts.length > 0,
        conflictCount: conflicts.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return NextResponse.json(
      { error: "Failed to create calendar event" },
      { status: 500 }
    );
  }
}

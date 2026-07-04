import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth/api-auth";

export const dynamic = "force-dynamic";

// GET /api/calendar/events/[eventId] - Get a specific event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const user = await requireApiAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await params;

    const event = await db.calendarEvent.findUnique({
      where: { id: eventId },
      include: {
        apprentice: {
          select: {
            id: true,
            fullName: true,
            email: true,
            photoUrl: true,
          },
        },
        assignment: true,
        editRequests: {
          orderBy: { createdAt: "desc" },
        },
        conflicts: {
          include: {
            event2: {
              select: {
                id: true,
                title: true,
                startTime: true,
                endTime: true,
              },
            },
          },
        },
        reminders: {
          orderBy: { scheduledFor: "asc" },
        },
        completionLog: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Permission check
    if (user.role === "apprentice") {
      const apprentice = await db.apprentice.findUnique({
        where: { userId: user.id },
      });
      if (!apprentice || event.apprenticeId !== apprentice.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// PATCH /api/calendar/events/[eventId] - Update an event
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const user = await requireApiAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await params;
    const body = await request.json();

    // Fetch existing event
    const existingEvent = await db.calendarEvent.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Permission check - only creator can edit
    if (existingEvent.createdBy !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { error: "Only the event creator can edit this event" },
        { status: 403 }
      );
    }

    // Check if edit is allowed (before due date or 1 day after)
    const now = new Date();
    const eventStart = new Date(existingEvent.startTime);
    const oneDayAfter = new Date(eventStart.getTime() + 24 * 60 * 60 * 1000);

    if (now > oneDayAfter && user.role !== "admin") {
      return NextResponse.json(
        { error: "Cannot edit event more than 1 day after it started" },
        { status: 403 }
      );
    }

    const {
      title,
      description,
      eventType,
      status,
      startTime,
      endTime,
      isAllDay,
      location,
      color,
      notes,
      isRecurring,
      recurrencePattern,
      recurrenceEnd,
    } = body;

    // Update event
    const event = await db.calendarEvent.update({
      where: { id: eventId },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(eventType && { eventType }),
        ...(status && { status }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(isAllDay !== undefined && { isAllDay }),
        ...(location !== undefined && { location }),
        ...(color !== undefined && { color }),
        ...(notes !== undefined && { notes }),
        ...(isRecurring !== undefined && { isRecurring }),
        ...(recurrencePattern !== undefined && { recurrencePattern }),
        ...(recurrenceEnd !== undefined && {
          recurrenceEnd: recurrenceEnd ? new Date(recurrenceEnd) : null,
        }),
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

    // If time changed, update reminders
    if (startTime) {
      await db.calendarReminder.deleteMany({
        where: {
          eventId: eventId,
          emailStatus: "pending",
        },
      });

      const eventStart = new Date(startTime);
      const oneDayBefore = new Date(eventStart.getTime() - 24 * 60 * 60 * 1000);
      const oneHourBefore = new Date(eventStart.getTime() - 60 * 60 * 1000);

      if (eventStart > now) {
        if (oneDayBefore > now) {
          await db.calendarReminder.create({
            data: {
              eventId: event.id,
              apprenticeId: event.apprenticeId,
              reminderType: "one_day_before",
              scheduledFor: oneDayBefore,
              emailTo: event.apprentice.email,
              emailSubject: `Reminder: ${event.title} tomorrow`,
              emailBody: "",
              emailStatus: "pending",
            },
          });
        }

        if (oneHourBefore > now) {
          await db.calendarReminder.create({
            data: {
              eventId: event.id,
              apprenticeId: event.apprenticeId,
              reminderType: "one_hour_before",
              scheduledFor: oneHourBefore,
              emailTo: event.apprentice.email,
              emailSubject: `Reminder: ${event.title} in 1 hour`,
              emailBody: "",
              emailStatus: "pending",
            },
          });
        }
      }
    }

    console.log(`✅ Updated calendar event: ${event.title}`);

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE /api/calendar/events/[eventId] - Soft delete an event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const user = await requireApiAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await params;

    const event = await db.calendarEvent.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Permission check
    if (event.createdBy !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { error: "Only the event creator can delete this event" },
        { status: 403 }
      );
    }

    // Check if deletion is allowed (before 1 day after due date)
    const now = new Date();
    const eventStart = new Date(event.startTime);
    const oneDayAfter = new Date(eventStart.getTime() + 24 * 60 * 60 * 1000);

    if (now > oneDayAfter && user.role !== "admin") {
      return NextResponse.json(
        { error: "Cannot delete event more than 1 day after it started" },
        { status: 403 }
      );
    }

    // Soft delete
    await db.calendarEvent.update({
      where: { id: eventId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: user.id,
      },
    });

    // Resolve all conflicts involving this event
    await db.eventConflict.updateMany({
      where: {
        OR: [{ event1Id: eventId }, { event2Id: eventId }],
      },
      data: {
        isResolved: true,
        resolvedAt: new Date(),
      },
    });

    console.log(`✅ Deleted calendar event: ${event.title}`);

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}

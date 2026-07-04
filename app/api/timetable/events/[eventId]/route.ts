import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth/api-auth";

export const dynamic = "force-dynamic";

// GET /api/timetable/events/[eventId] - Get a specific event
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

    const event = await db.timetableEvent.findUnique({
      where: { id: eventId },
      include: {
        attendees: {
          include: {
            apprentice: {
              select: {
                id: true,
                fullName: true,
                email: true,
                photoUrl: true,
                serviceTrack: true,
              },
            },
          },
        },
        reminders: {
          orderBy: { sentAt: "desc" },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
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

// PATCH /api/timetable/events/[eventId] - Update an event
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const user = await requireApiAuth();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await params;
    const body = await request.json();

    const {
      title,
      description,
      eventType,
      status,
      startTime,
      endTime,
      location,
      serviceTrack,
      notes,
      isRecurring,
      recurrencePattern,
      recurrenceEnd,
    } = body;

    // Update event
    const event = await db.timetableEvent.update({
      where: { id: eventId },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(eventType && { eventType }),
        ...(status && { status }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(location !== undefined && { location }),
        ...(serviceTrack !== undefined && { serviceTrack }),
        ...(notes !== undefined && { notes }),
        ...(isRecurring !== undefined && { isRecurring }),
        ...(recurrencePattern !== undefined && { recurrencePattern }),
        ...(recurrenceEnd !== undefined && {
          recurrenceEnd: recurrenceEnd ? new Date(recurrenceEnd) : null,
        }),
      },
      include: {
        attendees: {
          include: {
            apprentice: {
              select: {
                id: true,
                fullName: true,
                email: true,
                photoUrl: true,
              },
            },
          },
        },
      },
    });

    console.log(`✅ Updated timetable event: ${event.title}`);

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE /api/timetable/events/[eventId] - Delete an event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const user = await requireApiAuth();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await params;

    // Delete event (cascade will delete attendees and reminders)
    const event = await db.timetableEvent.delete({
      where: { id: eventId },
    });

    console.log(`✅ Deleted timetable event: ${event.title}`);

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

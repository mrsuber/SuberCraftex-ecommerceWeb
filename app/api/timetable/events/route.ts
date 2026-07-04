import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth/api-auth";
import { EventType, ServiceTrack } from "@prisma/client";

export const dynamic = "force-dynamic";

// GET /api/timetable/events - Get all timetable events
export async function GET(request: NextRequest) {
  try {
    const user = await requireApiAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const serviceTrack = searchParams.get("serviceTrack");
    const eventType = searchParams.get("eventType");

    const where: any = {};

    // Filter by date range
    if (startDate && endDate) {
      where.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Filter by service track
    if (serviceTrack && serviceTrack !== "all") {
      where.serviceTrack = serviceTrack;
    }

    // Filter by event type
    if (eventType && eventType !== "all") {
      where.eventType = eventType;
    }

    const events = await db.timetableEvent.findMany({
      where,
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
        _count: {
          select: {
            attendees: true,
            reminders: true,
          },
        },
      },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching timetable events:", error);
    return NextResponse.json(
      { error: "Failed to fetch timetable events" },
      { status: 500 }
    );
  }
}

// POST /api/timetable/events - Create a new timetable event
export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      eventType,
      startTime,
      endTime,
      location,
      serviceTrack,
      attendeeIds,
      isRecurring,
      recurrencePattern,
      recurrenceEnd,
      notes,
    } = body;

    // Validate required fields
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

    // Create event
    const event = await db.timetableEvent.create({
      data: {
        title,
        description,
        eventType: eventType || "class",
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location,
        serviceTrack: serviceTrack || null,
        createdBy: user.id,
        notes,
        isRecurring: isRecurring || false,
        recurrencePattern: recurrencePattern || null,
        recurrenceEnd: recurrenceEnd ? new Date(recurrenceEnd) : null,
      },
    });

    // Add attendees if provided
    if (attendeeIds && Array.isArray(attendeeIds) && attendeeIds.length > 0) {
      await db.timetableEventAttendee.createMany({
        data: attendeeIds.map((apprenticeId: string) => ({
          eventId: event.id,
          apprenticeId,
          status: "invited",
        })),
      });
    }

    // Fetch the created event with attendees
    const createdEvent = await db.timetableEvent.findUnique({
      where: { id: event.id },
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

    console.log(`✅ Created timetable event: ${title} with ${attendeeIds?.length || 0} attendees`);

    return NextResponse.json(createdEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating timetable event:", error);
    return NextResponse.json(
      { error: "Failed to create timetable event" },
      { status: 500 }
    );
  }
}

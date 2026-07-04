import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth/api-auth";

export const dynamic = "force-dynamic";

// POST /api/calendar/events/[eventId]/complete - Mark event as completed
export async function POST(
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
    const { completionNotes, completionEvidence } = body;

    // Fetch event
    const event = await db.calendarEvent.findUnique({
      where: { id: eventId },
      include: {
        apprentice: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Permission check - apprentice can only complete their own events
    if (user.role === "apprentice") {
      const apprentice = await db.apprentice.findUnique({
        where: { userId: user.id },
      });
      if (!apprentice || event.apprenticeId !== apprentice.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    const now = new Date();
    const eventStart = new Date(event.startTime);
    const completedOnTime = now <= new Date(event.endTime);

    // Calculate discipline points
    let disciplinePoints = 0;
    if (completedOnTime) {
      disciplinePoints = 10; // Completed on time
    } else {
      const daysLate = Math.floor((now.getTime() - event.endTime.getTime()) / (1000 * 60 * 60 * 24));
      disciplinePoints = Math.max(-10, -daysLate * 2); // -2 points per day late, min -10
    }

    // Update event
    const updatedEvent = await db.calendarEvent.update({
      where: { id: eventId },
      data: {
        isCompleted: true,
        completedAt: now,
        completionNotes,
        completionEvidence: completionEvidence || [],
        status: "completed",
      },
    });

    // Create or update completion log
    await db.eventCompletionLog.upsert({
      where: { eventId },
      create: {
        eventId,
        apprenticeId: event.apprenticeId,
        wasCompleted: true,
        completedOnTime,
        completedAt: now,
        completionNotes,
        completionEvidence: completionEvidence || [],
        disciplinePoints,
      },
      update: {
        wasCompleted: true,
        completedOnTime,
        completedAt: now,
        completionNotes,
        completionEvidence: completionEvidence || [],
        disciplinePoints,
      },
    });

    // If linked to assignment, update assignment status
    if (event.assignmentId) {
      await db.apprenticeAssignment.update({
        where: { id: event.assignmentId },
        data: {
          status: "completed",
          completedDate: now,
        },
      });
    }

    console.log(
      `✅ ${event.apprentice.fullName} completed event: ${event.title} (${completedOnTime ? "on time" : "late"}, ${disciplinePoints} points)`
    );

    return NextResponse.json({
      success: true,
      event: updatedEvent,
      disciplinePoints,
      completedOnTime,
    });
  } catch (error) {
    console.error("Error completing event:", error);
    return NextResponse.json(
      { error: "Failed to complete event" },
      { status: 500 }
    );
  }
}

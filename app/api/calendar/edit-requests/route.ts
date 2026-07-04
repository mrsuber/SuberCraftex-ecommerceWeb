import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth/api-auth";

export const dynamic = "force-dynamic";

// GET /api/calendar/edit-requests - Get edit requests
export async function GET(request: NextRequest) {
  try {
    const user = await requireApiAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const apprenticeId = searchParams.get("apprenticeId");

    const where: any = {};

    // Filter by status
    if (status && status !== "all") {
      where.status = status;
    }

    // Role-based filtering
    if (user.role === "apprentice") {
      const apprentice = await db.apprentice.findUnique({
        where: { userId: user.id },
      });
      if (!apprentice) {
        return NextResponse.json({ error: "Apprentice not found" }, { status: 404 });
      }
      where.apprenticeId = apprentice.id;
    } else if (apprenticeId) {
      where.apprenticeId = apprenticeId;
    }

    const requests = await db.eventEditRequest.findMany({
      where,
      include: {
        event: {
          select: {
            id: true,
            title: true,
            startTime: true,
            endTime: true,
            eventType: true,
          },
        },
        apprentice: {
          select: {
            id: true,
            fullName: true,
            email: true,
            photoUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching edit requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch edit requests" },
      { status: 500 }
    );
  }
}

// POST /api/calendar/edit-requests - Create edit request
export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { eventId, requestType, requestedChanges, reason, attachments } = body;

    // Validation
    if (!eventId || !requestType || !requestedChanges || !reason) {
      return NextResponse.json(
        { error: "Event ID, request type, requested changes, and reason are required" },
        { status: 400 }
      );
    }

    // Get apprentice
    const apprentice = await db.apprentice.findUnique({
      where: { userId: user.id },
    });

    if (!apprentice) {
      return NextResponse.json({ error: "Apprentice not found" }, { status: 404 });
    }

    // Verify event exists and belongs to apprentice
    const event = await db.calendarEvent.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.apprenticeId !== apprentice.id) {
      return NextResponse.json(
        { error: "You can only request edits for your own events" },
        { status: 403 }
      );
    }

    // Check if event was created by admin/mentor
    if (event.createdByRole === "apprentice") {
      return NextResponse.json(
        { error: "You can edit your own events directly" },
        { status: 400 }
      );
    }

    // Create edit request
    const editRequest = await db.eventEditRequest.create({
      data: {
        eventId,
        apprenticeId: apprentice.id,
        requestType,
        requestedChanges,
        reason,
        attachments: attachments || [],
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            startTime: true,
            endTime: true,
          },
        },
        apprentice: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    console.log(
      `✅ ${apprentice.fullName} requested ${requestType} for event: ${event.title}`
    );

    return NextResponse.json(editRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating edit request:", error);
    return NextResponse.json(
      { error: "Failed to create edit request" },
      { status: 500 }
    );
  }
}

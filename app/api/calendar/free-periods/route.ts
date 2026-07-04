import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth/api-auth";

export const dynamic = "force-dynamic";

// GET /api/calendar/free-periods - Get free period requests
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

    const requests = await db.freePeriodRequest.findMany({
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
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching free period requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch free period requests" },
      { status: 500 }
    );
  }
}

// POST /api/calendar/free-periods - Create free period request
export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { startDate, endDate, reason, attachments } = body;

    // Validation
    if (!startDate || !endDate || !reason) {
      return NextResponse.json(
        { error: "Start date, end date, and reason are required" },
        { status: 400 }
      );
    }

    // Validate date range
    if (new Date(endDate) <= new Date(startDate)) {
      return NextResponse.json(
        { error: "End date must be after start date" },
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

    // Create free period request
    const freePeriodRequest = await db.freePeriodRequest.create({
      data: {
        apprenticeId: apprentice.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        attachments: attachments || [],
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

    // Create calendar event immediately with pending status
    const calendarEvent = await db.calendarEvent.create({
      data: {
        title: "Free Period Request",
        description: reason,
        eventType: "free_period",
        status: "pending",
        startTime: new Date(startDate),
        endTime: new Date(endDate),
        isAllDay: true,
        apprenticeId: apprentice.id,
        createdBy: user.id,
        createdByRole: "apprentice",
        color: "#FFA500", // Orange for pending
      },
    });

    // Link calendar event to request
    await db.freePeriodRequest.update({
      where: { id: freePeriodRequest.id },
      data: { calendarEventId: calendarEvent.id },
    });

    console.log(
      `✅ ${apprentice.fullName} requested free period from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`
    );

    return NextResponse.json(
      { ...freePeriodRequest, calendarEventId: calendarEvent.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating free period request:", error);
    return NextResponse.json(
      { error: "Failed to create free period request" },
      { status: 500 }
    );
  }
}

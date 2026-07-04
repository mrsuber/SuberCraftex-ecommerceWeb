import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth/api-auth";

export const dynamic = "force-dynamic";

// PATCH /api/calendar/free-periods/[requestId] - Approve or reject free period request
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const user = await requireApiAuth();

    if (!user || (user.role !== "admin" && user.role !== "tailor" && user.role !== "technician")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId } = await params;
    const body = await request.json();
    const { status, reviewNotes } = body;

    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be 'approved' or 'rejected'" },
        { status: 400 }
      );
    }

    // Fetch free period request
    const freePeriodRequest = await db.freePeriodRequest.findUnique({
      where: { id: requestId },
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

    if (!freePeriodRequest) {
      return NextResponse.json({ error: "Free period request not found" }, { status: 404 });
    }

    if (freePeriodRequest.status !== "pending") {
      return NextResponse.json(
        { error: "This request has already been reviewed" },
        { status: 400 }
      );
    }

    // Update request
    const updatedRequest = await db.freePeriodRequest.update({
      where: { id: requestId },
      data: {
        status,
        reviewedBy: user.id,
        reviewedAt: new Date(),
        reviewNotes,
      },
    });

    // Update linked calendar event status and color
    if (freePeriodRequest.calendarEventId) {
      await db.calendarEvent.update({
        where: { id: freePeriodRequest.calendarEventId },
        data: {
          status: status === "approved" ? "approved" : "rejected",
          color: status === "approved" ? "#22C55E" : "#EF4444", // Green for approved, red for rejected
        },
      });
    }

    console.log(
      `✅ ${status === "approved" ? "Approved" : "Rejected"} free period request for ${freePeriodRequest.apprentice.fullName}`
    );

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Error reviewing free period request:", error);
    return NextResponse.json(
      { error: "Failed to review free period request" },
      { status: 500 }
    );
  }
}

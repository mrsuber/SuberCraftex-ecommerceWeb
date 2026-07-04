import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth/api-auth";

export const dynamic = "force-dynamic";

// PATCH /api/calendar/edit-requests/[requestId] - Approve or reject edit request
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

    // Fetch edit request
    const editRequest = await db.eventEditRequest.findUnique({
      where: { id: requestId },
      include: {
        event: true,
        apprentice: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!editRequest) {
      return NextResponse.json({ error: "Edit request not found" }, { status: 404 });
    }

    if (editRequest.status !== "pending") {
      return NextResponse.json(
        { error: "This request has already been reviewed" },
        { status: 400 }
      );
    }

    // Update request
    const updatedRequest = await db.eventEditRequest.update({
      where: { id: requestId },
      data: {
        status,
        reviewedBy: user.id,
        reviewedAt: new Date(),
        reviewNotes,
      },
    });

    // If approved, apply changes to event
    if (status === "approved") {
      const changes = editRequest.requestedChanges as any;

      await db.calendarEvent.update({
        where: { id: editRequest.eventId },
        data: {
          ...(changes.newTitle && { title: changes.newTitle }),
          ...(changes.newDescription !== undefined && { description: changes.newDescription }),
          ...(changes.newStartTime && { startTime: new Date(changes.newStartTime) }),
          ...(changes.newEndTime && { endTime: new Date(changes.newEndTime) }),
          ...(changes.newLocation !== undefined && { location: changes.newLocation }),
          ...(changes.newNotes !== undefined && { notes: changes.newNotes }),
        },
      });

      // If time changed and request type was postpone, update reminders
      if (changes.newStartTime && editRequest.requestType === "postpone") {
        await db.calendarReminder.deleteMany({
          where: {
            eventId: editRequest.eventId,
            emailStatus: "pending",
          },
        });

        const eventStart = new Date(changes.newStartTime);
        const now = new Date();
        const oneDayBefore = new Date(eventStart.getTime() - 24 * 60 * 60 * 1000);
        const oneHourBefore = new Date(eventStart.getTime() - 60 * 60 * 1000);

        if (eventStart > now) {
          if (oneDayBefore > now) {
            await db.calendarReminder.create({
              data: {
                eventId: editRequest.eventId,
                apprenticeId: editRequest.apprenticeId,
                reminderType: "one_day_before",
                scheduledFor: oneDayBefore,
                emailTo: editRequest.apprentice.email,
                emailSubject: `Reminder: ${changes.newTitle || editRequest.event.title} tomorrow`,
                emailBody: "",
                emailStatus: "pending",
              },
            });
          }

          if (oneHourBefore > now) {
            await db.calendarReminder.create({
              data: {
                eventId: editRequest.eventId,
                apprenticeId: editRequest.apprenticeId,
                reminderType: "one_hour_before",
                scheduledFor: oneHourBefore,
                emailTo: editRequest.apprentice.email,
                emailSubject: `Reminder: ${changes.newTitle || editRequest.event.title} in 1 hour`,
                emailBody: "",
                emailStatus: "pending",
              },
            });
          }
        }
      }

      // If request type was cancel, mark event as cancelled
      if (editRequest.requestType === "cancel") {
        await db.calendarEvent.update({
          where: { id: editRequest.eventId },
          data: { status: "cancelled" },
        });
      }
    }

    console.log(
      `✅ ${status === "approved" ? "Approved" : "Rejected"} ${editRequest.requestType} request for event: ${editRequest.event.title}`
    );

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Error reviewing edit request:", error);
    return NextResponse.json(
      { error: "Failed to review edit request" },
      { status: 500 }
    );
  }
}

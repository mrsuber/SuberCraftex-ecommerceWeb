import { NextRequest, NextResponse } from "next/server";
import { NotificationService } from "@/lib/services/notification-service";
import { getSession } from "@/lib/auth/session";

// POST /api/notifications/[id]/read - Mark notification as read
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const notification = await NotificationService.markAsRead(id, user.id);

    return NextResponse.json({ notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 }
    );
  }
}

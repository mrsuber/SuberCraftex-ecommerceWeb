import { NextResponse } from "next/server";
import { NotificationService } from "@/lib/services/notification-service";
import { getSession } from "@/lib/auth/session";

// POST /api/notifications/read-all - Mark all notifications as read
export async function POST() {
  try {
    const user = await getSession();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await NotificationService.markAllAsRead(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      { error: "Failed to mark all notifications as read" },
      { status: 500 }
    );
  }
}

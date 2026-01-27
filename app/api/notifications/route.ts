import { NextRequest, NextResponse } from "next/server";
import { NotificationService } from "@/lib/services/notification-service";
import { getSession } from "@/lib/auth/session";

// GET /api/notifications - Get notifications
export async function GET(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const [notifications, unreadCount] = await Promise.all([
      NotificationService.getNotifications({ limit, offset, unreadOnly }),
      NotificationService.getUnreadCount(),
    ]);

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

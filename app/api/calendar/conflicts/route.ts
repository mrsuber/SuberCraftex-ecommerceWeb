import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth/api-auth";

export const dynamic = "force-dynamic";

// GET /api/calendar/conflicts - Get event conflicts
export async function GET(request: NextRequest) {
  try {
    const user = await requireApiAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const apprenticeId = searchParams.get("apprenticeId");
    const includeResolved = searchParams.get("includeResolved") === "true";

    const where: any = {
      isResolved: includeResolved ? undefined : false,
    };

    // Build filter for apprentice's events
    if (user.role === "apprentice") {
      const apprentice = await db.apprentice.findUnique({
        where: { userId: user.id },
      });
      if (!apprentice) {
        return NextResponse.json({ error: "Apprentice not found" }, { status: 404 });
      }

      const conflicts = await db.eventConflict.findMany({
        where: {
          AND: [
            where,
            {
              OR: [
                { event1: { apprenticeId: apprentice.id } },
                { event2: { apprenticeId: apprentice.id } },
              ],
            },
          ],
        },
        include: {
          event1: {
            select: {
              id: true,
              title: true,
              startTime: true,
              endTime: true,
              eventType: true,
              status: true,
            },
          },
          event2: {
            select: {
              id: true,
              title: true,
              startTime: true,
              endTime: true,
              eventType: true,
              status: true,
            },
          },
        },
        orderBy: { detectedAt: "desc" },
      });

      return NextResponse.json(conflicts);
    } else {
      // Admin/mentor view
      const conflictWhere: any = { ...where };

      if (apprenticeId) {
        conflictWhere.OR = [
          { event1: { apprenticeId } },
          { event2: { apprenticeId } },
        ];
      }

      const conflicts = await db.eventConflict.findMany({
        where: conflictWhere,
        include: {
          event1: {
            select: {
              id: true,
              title: true,
              startTime: true,
              endTime: true,
              eventType: true,
              status: true,
              apprentice: {
                select: {
                  id: true,
                  fullName: true,
                },
              },
            },
          },
          event2: {
            select: {
              id: true,
              title: true,
              startTime: true,
              endTime: true,
              eventType: true,
              status: true,
              apprentice: {
                select: {
                  id: true,
                  fullName: true,
                },
              },
            },
          },
        },
        orderBy: { detectedAt: "desc" },
      });

      return NextResponse.json(conflicts);
    }
  } catch (error) {
    console.error("Error fetching conflicts:", error);
    return NextResponse.json(
      { error: "Failed to fetch conflicts" },
      { status: 500 }
    );
  }
}

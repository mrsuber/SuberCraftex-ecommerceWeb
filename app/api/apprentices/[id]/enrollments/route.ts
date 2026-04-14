import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth/api-auth";

export const dynamic = "force-dynamic";

// GET /api/apprentices/[id]/enrollments - Get apprentice's enrollment history
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const enrollments = await db.apprenticeEnrollment.findMany({
      where: { apprenticeId: id },
      include: {
        _count: {
          select: { assignments: true },
        },
        assignments: {
          where: { status: "completed" },
          select: { id: true },
        },
      },
      orderBy: [{ status: "asc" }, { startDate: "desc" }],
    });

    // Format response with proper counts
    const formattedEnrollments = enrollments.map((enrollment) => ({
      id: enrollment.id,
      serviceTrack: enrollment.serviceTrack,
      status: enrollment.status,
      startDate: enrollment.startDate,
      completionDate: enrollment.completionDate,
      totalAssignments: enrollment.totalAssignments,
      completedAssignments: enrollment.assignments.length,
      progressPercentage: Math.round(
        (enrollment.assignments.length / enrollment.totalAssignments) * 100
      ),
      createdAt: enrollment.createdAt,
      updatedAt: enrollment.updatedAt,
    }));

    return NextResponse.json(formattedEnrollments);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}

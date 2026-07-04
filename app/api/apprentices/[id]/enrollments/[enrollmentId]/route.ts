import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth/api-auth";

export const dynamic = "force-dynamic";

// DELETE /api/apprentices/[id]/enrollments/[enrollmentId] - Remove enrollment and all associated assignments
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; enrollmentId: string }> }
) {
  try {
    const user = await requireApiAuth();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: apprenticeId, enrollmentId } = await params;

    // Verify enrollment exists and belongs to this apprentice
    const enrollment = await db.apprenticeEnrollment.findFirst({
      where: {
        id: enrollmentId,
        apprenticeId,
      },
      include: {
        apprentice: {
          select: {
            id: true,
            fullName: true,
            serviceTrack: true,
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    // Delete all assignments associated with this enrollment
    const deletedAssignments = await db.apprenticeAssignment.deleteMany({
      where: { enrollmentId },
    });

    // Delete the enrollment
    await db.apprenticeEnrollment.delete({
      where: { id: enrollmentId },
    });

    // If this was the apprentice's current service track, update it
    if (enrollment.apprentice.serviceTrack === enrollment.serviceTrack) {
      // Find another active enrollment to set as current, or set to null
      const nextEnrollment = await db.apprenticeEnrollment.findFirst({
        where: {
          apprenticeId,
          status: "active",
        },
        orderBy: { startDate: "desc" },
      });

      await db.apprentice.update({
        where: { id: apprenticeId },
        data: {
          serviceTrack: nextEnrollment?.serviceTrack ?? undefined,
        },
      });
    }

    console.log(
      `✅ Removed ${enrollment.serviceTrack} enrollment for ${enrollment.apprentice.fullName} (deleted ${deletedAssignments.count} assignments)`
    );

    return NextResponse.json({
      success: true,
      message: "Enrollment removed successfully",
      deletedAssignments: deletedAssignments.count,
    });
  } catch (error) {
    console.error("Error removing enrollment:", error);
    return NextResponse.json(
      { error: "Failed to remove enrollment" },
      { status: 500 }
    );
  }
}

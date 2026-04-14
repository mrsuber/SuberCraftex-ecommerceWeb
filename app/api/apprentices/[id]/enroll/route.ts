import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth/api-auth";
import { ServiceTrack } from "@prisma/client";

export const dynamic = "force-dynamic";

// POST /api/apprentices/[id]/enroll - Enroll apprentice in a new curriculum
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiAuth();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { serviceTrack } = body;

    if (!serviceTrack) {
      return NextResponse.json(
        { error: "Service track is required" },
        { status: 400 }
      );
    }

    // Validate service track
    if (!Object.values(ServiceTrack).includes(serviceTrack)) {
      return NextResponse.json(
        { error: "Invalid service track" },
        { status: 400 }
      );
    }

    // Get apprentice
    const apprentice = await db.apprentice.findUnique({
      where: { id },
      include: {
        enrollments: {
          where: { serviceTrack },
        },
      },
    });

    if (!apprentice) {
      return NextResponse.json(
        { error: "Apprentice not found" },
        { status: 404 }
      );
    }

    // Check if already enrolled in this curriculum
    if (apprentice.enrollments.length > 0) {
      return NextResponse.json(
        { error: "Apprentice is already enrolled in this curriculum" },
        { status: 400 }
      );
    }

    // Fetch curriculum templates for this service track
    const templates = await db.assignmentTemplate.findMany({
      where: {
        serviceTrack,
        isActive: true,
      },
      orderBy: [{ level: "asc" }, { orderIndex: "asc" }],
    });

    if (templates.length === 0) {
      return NextResponse.json(
        { error: "No curriculum found for this service track" },
        { status: 404 }
      );
    }

    // Create enrollment
    const enrollment = await db.apprenticeEnrollment.create({
      data: {
        apprenticeId: apprentice.id,
        serviceTrack,
        status: "active",
        startDate: new Date(),
        totalAssignments: templates.length,
        completedAssignments: 0,
        progressPercentage: 0,
      },
    });

    // Create assignments for all curriculum templates
    const today = new Date();
    const assignmentsData = templates.map((template, index) => {
      // Stagger due dates based on level and order
      const monthsOffset = (template.level - 1) * 3 + index;
      const dueDate = new Date(today);
      dueDate.setMonth(dueDate.getMonth() + monthsOffset);

      return {
        apprenticeId: apprentice.id,
        enrollmentId: enrollment.id,
        templateId: template.id,
        title: template.title,
        description: template.description,
        instructions: template.instructions,
        status: "pending" as const,
        dueDate,
        assignedBy: user.id,
      };
    });

    await db.apprenticeAssignment.createMany({
      data: assignmentsData,
    });

    // Update apprentice's current service track if this is their first enrollment
    const allEnrollments = await db.apprenticeEnrollment.count({
      where: { apprenticeId: apprentice.id },
    });

    if (allEnrollments === 1) {
      await db.apprentice.update({
        where: { id: apprentice.id },
        data: { serviceTrack },
      });
    }

    console.log(
      `✅ Enrolled ${apprentice.fullName} in ${serviceTrack} curriculum (${templates.length} assignments)`
    );

    return NextResponse.json({
      success: true,
      enrollment,
      assignmentsCreated: templates.length,
    });
  } catch (error) {
    console.error("Error enrolling apprentice:", error);
    return NextResponse.json(
      { error: "Failed to enroll apprentice" },
      { status: 500 }
    );
  }
}

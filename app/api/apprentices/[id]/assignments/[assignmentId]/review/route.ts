import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const reviewAssignmentSchema = z.object({
  rating: z.number().min(1).max(5),
  feedback: z.string().min(1),
  status: z.enum(['completed', 'needs_revision']),
});

// POST - Review assignment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; assignmentId: string }> }
) {
  try {
    const user = await requireApiAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, assignmentId } = await params;

    // Check if assignment exists
    const existingAssignment = await db.apprenticeAssignment.findFirst({
      where: {
        id: assignmentId,
        apprenticeId: id,
      },
      include: {
        apprentice: {
          select: { mentorId: true },
        },
      },
    });

    if (!existingAssignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Only admin or mentor can review assignments
    const isMentor = existingAssignment.apprentice.mentorId === user.id;
    const isAdmin = user.role === 'admin';

    if (!isMentor && !isAdmin) {
      return NextResponse.json({ error: 'Access denied - Only admin or mentor can review assignments' }, { status: 403 });
    }

    // Check if assignment is in a reviewable state
    if (!['submitted', 'needs_revision'].includes(existingAssignment.status)) {
      return NextResponse.json({ error: 'Assignment is not ready for review' }, { status: 400 });
    }

    const body = await request.json();
    const data = reviewAssignmentSchema.parse(body);

    const assignment = await db.apprenticeAssignment.update({
      where: { id: assignmentId },
      data: {
        rating: data.rating,
        feedback: data.feedback,
        status: data.status,
        reviewedBy: user.id,
        reviewedAt: new Date(),
        completedDate: data.status === 'completed' ? new Date() : null,
      },
    });

    console.log(`Assignment ${assignmentId} reviewed with status: ${data.status}`);

    return NextResponse.json(assignment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error reviewing assignment:', error);
    return NextResponse.json({ error: 'Failed to review assignment' }, { status: 500 });
  }
}

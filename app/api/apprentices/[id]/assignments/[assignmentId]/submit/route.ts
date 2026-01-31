import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const submitAssignmentSchema = z.object({
  submissionPhotos: z.array(z.string()).min(1, 'At least one photo is required'),
  notes: z.string().optional(),
});

// POST - Submit assignment
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
          select: { userId: true, mentorId: true },
        },
      },
    });

    if (!existingAssignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Check if user is authorized (apprentice owner, admin, or mentor)
    const isOwner = existingAssignment.apprentice.userId === user.id;
    const isMentor = existingAssignment.apprentice.mentorId === user.id;
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isMentor && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Check if assignment can be submitted
    if (['completed', 'submitted'].includes(existingAssignment.status)) {
      return NextResponse.json({ error: 'Assignment already submitted or completed' }, { status: 400 });
    }

    const body = await request.json();
    const data = submitAssignmentSchema.parse(body);

    const assignment = await db.apprenticeAssignment.update({
      where: { id: assignmentId },
      data: {
        submissionPhotos: data.submissionPhotos,
        status: 'submitted',
        // If there's additional feedback from the apprentice, we could add it here
      },
    });

    console.log(`Assignment ${assignmentId} submitted for review`);

    return NextResponse.json(assignment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error submitting assignment:', error);
    return NextResponse.json({ error: 'Failed to submit assignment' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const submitAssignmentSchema = z.object({
  submissionNotes: z.string().min(1, 'Please describe what you did'),
  submissionPhotos: z.array(z.string()).default([]),
  submissionVideos: z.array(z.string()).default([]), // YouTube/video links
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

    // Check if assignment can be submitted (allow resubmission if needs_revision)
    if (['completed'].includes(existingAssignment.status)) {
      return NextResponse.json({ error: 'Assignment already completed' }, { status: 400 });
    }

    const body = await request.json();
    const data = submitAssignmentSchema.parse(body);

    // Validate that at least photos or videos are provided
    if (data.submissionPhotos.length === 0 && data.submissionVideos.length === 0) {
      return NextResponse.json({ error: 'Please provide at least one photo or video' }, { status: 400 });
    }

    const assignment = await db.apprenticeAssignment.update({
      where: { id: assignmentId },
      data: {
        submissionNotes: data.submissionNotes,
        submissionPhotos: data.submissionPhotos,
        submissionVideos: data.submissionVideos,
        status: 'submitted',
        submittedAt: new Date(),
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

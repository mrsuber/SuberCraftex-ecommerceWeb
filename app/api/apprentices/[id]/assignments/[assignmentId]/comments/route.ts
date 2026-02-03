import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
  photos: z.array(z.string()).default([]),
});

// GET - Get all comments for an assignment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; assignmentId: string }> }
) {
  try {
    const user = await requireApiAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, assignmentId } = await params;

    // Check if assignment exists and user has access
    const assignment = await db.apprenticeAssignment.findFirst({
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

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Check if user is authorized
    const isOwner = assignment.apprentice.userId === user.id;
    const isMentor = assignment.apprentice.mentorId === user.id;
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isMentor && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const comments = await db.assignmentComment.findMany({
      where: { assignmentId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST - Create a new comment
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

    // Check if assignment exists and user has access
    const assignment = await db.apprenticeAssignment.findFirst({
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

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Check if user is authorized
    const isOwner = assignment.apprentice.userId === user.id;
    const isMentor = assignment.apprentice.mentorId === user.id;
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isMentor && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const data = createCommentSchema.parse(body);

    const comment = await db.assignmentComment.create({
      data: {
        assignmentId,
        userId: user.id,
        userName: user.fullName || user.email,
        userRole: user.role,
        content: data.content,
        photos: data.photos,
      },
    });

    console.log(`Comment added to assignment ${assignmentId} by ${user.email}`);

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

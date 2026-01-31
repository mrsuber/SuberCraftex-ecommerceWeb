import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const updateAssignmentSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  instructions: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable().transform((val) => val ? new Date(val) : null),
  status: z.enum(['pending', 'in_progress', 'submitted', 'needs_revision', 'completed', 'overdue']).optional(),
  assignmentPhotos: z.array(z.string()).optional(),
});

// GET - Get assignment details
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

    const assignment = await db.apprenticeAssignment.findFirst({
      where: {
        id: assignmentId,
        apprenticeId: id,
      },
      include: {
        apprentice: {
          select: {
            id: true,
            fullName: true,
            userId: true,
            mentorId: true,
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Non-admins can only view their own assignments or their mentees' assignments
    if (user.role !== 'admin') {
      if (assignment.apprentice.userId !== user.id && assignment.apprentice.mentorId !== user.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    // Get assignee and reviewer info
    const [assignedByUser, reviewedByUser] = await Promise.all([
      db.user.findUnique({
        where: { id: assignment.assignedBy },
        select: { id: true, fullName: true, email: true },
      }),
      assignment.reviewedBy
        ? db.user.findUnique({
            where: { id: assignment.reviewedBy },
            select: { id: true, fullName: true, email: true },
          })
        : null,
    ]);

    return NextResponse.json({
      ...assignment,
      assignedByUser,
      reviewedByUser,
    });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    return NextResponse.json({ error: 'Failed to fetch assignment' }, { status: 500 });
  }
}

// PUT - Update assignment
export async function PUT(
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

    // Only admin or mentor can update assignments
    if (user.role !== 'admin' && existingAssignment.apprentice.mentorId !== user.id) {
      return NextResponse.json({ error: 'Access denied - Only admin or mentor can update assignments' }, { status: 403 });
    }

    const body = await request.json();
    const data = updateAssignmentSchema.parse(body);

    const assignment = await db.apprenticeAssignment.update({
      where: { id: assignmentId },
      data,
    });

    console.log(`Updated assignment ${assignmentId}`);

    return NextResponse.json(assignment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating assignment:', error);
    return NextResponse.json({ error: 'Failed to update assignment' }, { status: 500 });
  }
}

// DELETE - Delete assignment
export async function DELETE(
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

    // Only admin or mentor can delete assignments
    if (user.role !== 'admin' && existingAssignment.apprentice.mentorId !== user.id) {
      return NextResponse.json({ error: 'Access denied - Only admin or mentor can delete assignments' }, { status: 403 });
    }

    await db.apprenticeAssignment.delete({
      where: { id: assignmentId },
    });

    console.log(`Deleted assignment ${assignmentId}`);

    return NextResponse.json({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return NextResponse.json({ error: 'Failed to delete assignment' }, { status: 500 });
  }
}

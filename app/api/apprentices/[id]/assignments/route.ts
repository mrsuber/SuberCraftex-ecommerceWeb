import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const createAssignmentSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  instructions: z.string().optional(),
  dueDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  assignmentPhotos: z.array(z.string()).optional().default([]),
});

// GET - Get apprentice's assignments
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Check if apprentice exists
    const apprentice = await db.apprentice.findUnique({
      where: { id },
      select: { id: true, userId: true, mentorId: true },
    });

    if (!apprentice) {
      return NextResponse.json({ error: 'Apprentice not found' }, { status: 404 });
    }

    // Non-admins can only view their own assignments or their mentees' assignments
    if (user.role !== 'admin') {
      if (apprentice.userId !== user.id && apprentice.mentorId !== user.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    // Build where clause
    const where: Record<string, unknown> = { apprenticeId: id };
    if (status) {
      where.status = status;
    }

    const assignments = await db.apprenticeAssignment.findMany({
      where,
      orderBy: { assignedDate: 'desc' },
    });

    // Update overdue status
    const now = new Date();
    const updatedAssignments = assignments.map((assignment) => {
      if (
        assignment.dueDate &&
        assignment.dueDate < now &&
        !['completed', 'overdue'].includes(assignment.status)
      ) {
        // Mark as overdue in database
        db.apprenticeAssignment.update({
          where: { id: assignment.id },
          data: { status: 'overdue' },
        }).catch(console.error);

        return { ...assignment, status: 'overdue' as const };
      }
      return assignment;
    });

    return NextResponse.json(updatedAssignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
  }
}

// POST - Create assignment for apprentice
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if apprentice exists
    const apprentice = await db.apprentice.findUnique({
      where: { id },
      select: { id: true, mentorId: true, status: true },
    });

    if (!apprentice) {
      return NextResponse.json({ error: 'Apprentice not found' }, { status: 404 });
    }

    // Check if user is authorized (admin or mentor)
    if (user.role !== 'admin' && apprentice.mentorId !== user.id) {
      return NextResponse.json({ error: 'Access denied - Only admin or mentor can create assignments' }, { status: 403 });
    }

    // Check if apprentice is active
    if (apprentice.status !== 'active' && apprentice.status !== 'pending') {
      return NextResponse.json({ error: 'Cannot create assignments for inactive apprentices' }, { status: 400 });
    }

    const body = await request.json();
    const data = createAssignmentSchema.parse(body);

    const assignment = await db.apprenticeAssignment.create({
      data: {
        apprenticeId: id,
        title: data.title,
        description: data.description,
        instructions: data.instructions,
        dueDate: data.dueDate,
        assignmentPhotos: data.assignmentPhotos,
        assignedBy: user.id,
        status: 'pending',
      },
    });

    console.log(`Created assignment "${assignment.title}" for apprentice ${id}`);

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating assignment:', error);
    return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 });
  }
}

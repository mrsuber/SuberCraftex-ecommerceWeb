import { NextRequest, NextResponse } from 'next/server';
import { requireApiAdmin, requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const updateApprenticeSchema = z.object({
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  photoUrl: z.string().optional().nullable(),
  department: z.enum(['tailoring', 'sales', 'delivery', 'operations']).optional(),
  mentorId: z.string().min(1).optional(),
  mentorType: z.enum(['tailor', 'cashier', 'driver', 'admin']).optional(),
  startDate: z.string().transform((val) => new Date(val)).optional(),
  expectedEndDate: z.string().optional().nullable().transform((val) => val ? new Date(val) : null),
  actualEndDate: z.string().optional().nullable().transform((val) => val ? new Date(val) : null),
  status: z.enum(['pending', 'active', 'on_hold', 'completed', 'terminated']).optional(),
  emergencyContactName: z.string().optional().nullable(),
  emergencyContactPhone: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

// GET - Get apprentice details
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

    const apprentice = await db.apprentice.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
        assignments: {
          orderBy: { assignedDate: 'desc' },
        },
        certificates: {
          orderBy: { issuedDate: 'desc' },
        },
      },
    });

    if (!apprentice) {
      return NextResponse.json({ error: 'Apprentice not found' }, { status: 404 });
    }

    // Non-admins can only view their own profile or their mentees
    if (user.role !== 'admin') {
      if (apprentice.userId !== user.id && apprentice.mentorId !== user.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    // Get mentor info
    const mentor = await db.user.findUnique({
      where: { id: apprentice.mentorId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
      },
    });

    // Calculate stats
    const stats = {
      totalAssignments: apprentice.assignments.length,
      completedAssignments: apprentice.assignments.filter((a) => a.status === 'completed').length,
      pendingAssignments: apprentice.assignments.filter((a) => ['pending', 'in_progress'].includes(a.status)).length,
      submittedAssignments: apprentice.assignments.filter((a) => a.status === 'submitted').length,
      overdueAssignments: apprentice.assignments.filter((a) => a.status === 'overdue').length,
      averageRating: (() => {
        const rated = apprentice.assignments.filter((a) => a.rating !== null);
        if (rated.length === 0) return null;
        return rated.reduce((acc, a) => acc + (a.rating || 0), 0) / rated.length;
      })(),
      certificatesCount: apprentice.certificates.length,
    };

    return NextResponse.json({
      ...apprentice,
      mentor,
      stats,
    });
  } catch (error) {
    console.error('Error fetching apprentice:', error);
    return NextResponse.json({ error: 'Failed to fetch apprentice' }, { status: 500 });
  }
}

// PUT - Update apprentice
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireApiAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = updateApprenticeSchema.parse(body);

    // Check if apprentice exists
    const existingApprentice = await db.apprentice.findUnique({
      where: { id },
    });

    if (!existingApprentice) {
      return NextResponse.json({ error: 'Apprentice not found' }, { status: 404 });
    }

    // Update apprentice
    const apprentice = await db.apprentice.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    console.log(`Updated apprentice ${apprentice.apprenticeNumber}`);

    return NextResponse.json(apprentice);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating apprentice:', error);
    return NextResponse.json({ error: 'Failed to update apprentice' }, { status: 500 });
  }
}

// DELETE - Delete apprentice (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireApiAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const { id } = await params;

    // Check if apprentice exists
    const existingApprentice = await db.apprentice.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingApprentice) {
      return NextResponse.json({ error: 'Apprentice not found' }, { status: 404 });
    }

    // Soft delete - deactivate the apprentice and change user role back to customer
    await db.$transaction(async (tx) => {
      await tx.apprentice.update({
        where: { id },
        data: {
          isActive: false,
          status: 'terminated',
          actualEndDate: new Date(),
        },
      });

      // Update user role back to customer
      await tx.user.update({
        where: { id: existingApprentice.userId },
        data: { role: 'customer' },
      });
    });

    console.log(`Deactivated apprentice ${existingApprentice.apprenticeNumber}`);

    return NextResponse.json({ success: true, message: 'Apprentice deactivated' });
  } catch (error) {
    console.error('Error deleting apprentice:', error);
    return NextResponse.json({ error: 'Failed to delete apprentice' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireApiAdmin, requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const updateTechnicianSchema = z.object({
  fullName: z.string().min(1).optional(),
  phone: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  specializations: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  hireDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
});

// GET - Get technician details
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

    const technician = await db.technician.findUnique({
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
        repairRequests: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            customer: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!technician) {
      return NextResponse.json({ error: 'Technician not found' }, { status: 404 });
    }

    // Non-admins can only view their own profile
    if (user.role !== 'admin' && technician.userId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get all repairs for stats
    const allRepairs = await db.repairRequest.findMany({
      where: { technicianId: id },
      select: {
        id: true,
        status: true,
        rating: true,
        deviceType: true,
      },
    });

    // Calculate stats
    const completedRepairs = allRepairs.filter((r) => r.status === 'completed');
    const ratings = completedRepairs
      .filter((r) => r.rating !== null)
      .map((r) => r.rating as number);

    const stats = {
      totalRepairs: allRepairs.length,
      completedRepairs: completedRepairs.length,
      pendingRepairs: allRepairs.filter(
        (r) => !['completed', 'cancelled'].includes(r.status)
      ).length,
      averageRating: ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : null,
      repairsByDeviceType: allRepairs.reduce((acc, r) => {
        acc[r.deviceType] = (acc[r.deviceType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    return NextResponse.json({
      ...technician,
      stats,
    });
  } catch (error) {
    console.error('Error fetching technician:', error);
    return NextResponse.json({ error: 'Failed to fetch technician' }, { status: 500 });
  }
}

// PATCH - Update technician
export async function PATCH(
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
    const data = updateTechnicianSchema.parse(body);

    // Check if technician exists
    const existingTechnician = await db.technician.findUnique({
      where: { id },
    });

    if (!existingTechnician) {
      return NextResponse.json({ error: 'Technician not found' }, { status: 404 });
    }

    // Update technician
    const technician = await db.technician.update({
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

    console.log(`Updated technician ${technician.employeeId}`);

    return NextResponse.json(technician);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating technician:', error);
    return NextResponse.json({ error: 'Failed to update technician' }, { status: 500 });
  }
}

// DELETE - Delete technician (soft delete)
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

    // Check if technician exists
    const existingTechnician = await db.technician.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingTechnician) {
      return NextResponse.json({ error: 'Technician not found' }, { status: 404 });
    }

    // Check for active repairs
    const activeRepairs = await db.repairRequest.count({
      where: {
        technicianId: id,
        status: {
          notIn: ['completed', 'cancelled'],
        },
      },
    });

    if (activeRepairs > 0) {
      return NextResponse.json(
        { error: `Cannot deactivate technician with ${activeRepairs} active repairs` },
        { status: 400 }
      );
    }

    // Soft delete - deactivate the technician and change user role back to customer
    await db.$transaction(async (tx) => {
      await tx.technician.update({
        where: { id },
        data: {
          isActive: false,
        },
      });

      // Update user role back to customer
      await tx.user.update({
        where: { id: existingTechnician.userId },
        data: { role: 'customer' },
      });
    });

    console.log(`Deactivated technician ${existingTechnician.employeeId}`);

    return NextResponse.json({ success: true, message: 'Technician deactivated' });
  } catch (error) {
    console.error('Error deleting technician:', error);
    return NextResponse.json({ error: 'Failed to delete technician' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireApiAdmin, requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const updateRepairRequestSchema = z.object({
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
  status: z.enum([
    'pending', 'received', 'diagnosing', 'diagnosed', 'quote_sent',
    'quote_approved', 'quote_rejected', 'waiting_parts', 'in_repair',
    'testing', 'ready_for_pickup', 'completed', 'cancelled'
  ]).optional(),
  deviceConditionOnIntake: z.string().optional(),
  intakePhotos: z.array(z.string()).optional(),
  warrantyDays: z.number().optional(),
});

// GET - Get repair request details
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

    const repairRequest = await db.repairRequest.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
        technician: {
          select: {
            id: true,
            fullName: true,
            employeeId: true,
            photoUrl: true,
            specializations: true,
          },
        },
        apprentice: {
          select: {
            id: true,
            fullName: true,
            apprenticeNumber: true,
            photoUrl: true,
          },
        },
        progress: {
          orderBy: { createdAt: 'desc' },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!repairRequest) {
      return NextResponse.json({ error: 'Repair request not found' }, { status: 404 });
    }

    // Role-based access control
    if (user.role === 'customer' && repairRequest.customerId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (user.role === 'technician') {
      const technician = await db.technician.findUnique({
        where: { userId: user.id },
      });
      if (!technician || repairRequest.technicianId !== technician.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    // Calculate payment summary
    const paymentSummary = {
      totalPaid: repairRequest.payments.reduce(
        (sum, p) => sum + Number(p.amount),
        0
      ),
      totalQuote: repairRequest.totalQuote ? Number(repairRequest.totalQuote) : null,
      balance: repairRequest.totalQuote && repairRequest.finalCost
        ? Number(repairRequest.finalCost) - repairRequest.payments.reduce(
            (sum, p) => sum + Number(p.amount),
            0
          )
        : null,
    };

    return NextResponse.json({
      ...repairRequest,
      paymentSummary,
    });
  } catch (error) {
    console.error('Error fetching repair request:', error);
    return NextResponse.json({ error: 'Failed to fetch repair request' }, { status: 500 });
  }
}

// PATCH - Update repair request
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin or technician can update
    if (!['admin', 'technician'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = updateRepairRequestSchema.parse(body);

    // Check if repair request exists
    const existingRequest = await db.repairRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Repair request not found' }, { status: 404 });
    }

    // If technician, verify they are assigned to this repair
    if (user.role === 'technician') {
      const technician = await db.technician.findUnique({
        where: { userId: user.id },
      });
      if (!technician || existingRequest.technicianId !== technician.id) {
        return NextResponse.json({ error: 'Not assigned to this repair' }, { status: 403 });
      }
    }

    // Update repair request
    const repairRequest = await db.repairRequest.update({
      where: { id },
      data,
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        technician: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    // Add progress entry if status changed
    if (data.status && data.status !== existingRequest.status) {
      await db.repairProgress.create({
        data: {
          repairRequestId: id,
          status: data.status,
          description: `Status updated to ${data.status.replace(/_/g, ' ')}`,
          photos: [],
          updatedBy: user.id,
          updatedByName: user.fullName || user.email,
        },
      });
    }

    console.log(`Updated repair request ${repairRequest.ticketNumber}`);

    return NextResponse.json(repairRequest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating repair request:', error);
    return NextResponse.json({ error: 'Failed to update repair request' }, { status: 500 });
  }
}

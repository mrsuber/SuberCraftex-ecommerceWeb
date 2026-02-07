import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const completeRepairSchema = z.object({
  repairNotes: z.string().optional(),
  completionPhotos: z.array(z.string()).default([]),
  partsUsed: z.array(z.object({
    name: z.string(),
    cost: z.number(),
    quantity: z.number().default(1),
  })).optional(),
  finalCost: z.number().optional(),
});

// POST - Mark repair as complete
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin or technician can complete repairs
    if (!['admin', 'technician'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = completeRepairSchema.parse(body);

    // Check if repair request exists
    const existingRequest = await db.repairRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Repair request not found' }, { status: 404 });
    }

    // Validate status allows completion
    const validStatuses = ['in_repair', 'testing', 'quote_approved'];
    if (!validStatuses.includes(existingRequest.status)) {
      return NextResponse.json(
        { error: 'Repair must be in progress to be completed' },
        { status: 400 }
      );
    }

    // If technician, verify they are assigned
    if (user.role === 'technician') {
      const technician = await db.technician.findUnique({
        where: { userId: user.id },
      });
      if (!technician || existingRequest.technicianId !== technician.id) {
        return NextResponse.json({ error: 'Not assigned to this repair' }, { status: 403 });
      }
    }

    // Calculate warranty expiration if applicable
    const warrantyExpiresAt = existingRequest.warrantyDays
      ? (() => {
          const date = new Date();
          date.setDate(date.getDate() + existingRequest.warrantyDays);
          return date;
        })()
      : null;

    // Update repair request
    const repairRequest = await db.$transaction(async (tx) => {
      const updated = await tx.repairRequest.update({
        where: { id },
        data: {
          status: 'ready_for_pickup',
          repairNotes: data.repairNotes,
          completionPhotos: data.completionPhotos,
          partsUsed: data.partsUsed,
          repairCompletedAt: new Date(),
          finalCost: data.finalCost ?? existingRequest.totalQuote,
          warrantyExpiresAt,
        },
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

      // Update technician stats if applicable
      if (existingRequest.technicianId) {
        await tx.technician.update({
          where: { id: existingRequest.technicianId },
          data: {
            totalRepairs: { increment: 1 },
          },
        });
      }

      // Update apprentice stats if supervised work
      if (existingRequest.isSupervisedWork && existingRequest.apprenticeId) {
        await tx.apprentice.update({
          where: { id: existingRequest.apprenticeId },
          data: {
            realJobsCompleted: { increment: 1 },
          },
        });
      }

      return updated;
    });

    // Add progress entry
    await db.repairProgress.create({
      data: {
        repairRequestId: id,
        status: 'ready_for_pickup',
        description: `Repair completed. Device is ready for customer pickup.${data.repairNotes ? ` Notes: ${data.repairNotes}` : ''}`,
        photos: data.completionPhotos,
        updatedBy: user.id,
        updatedByName: user.fullName || user.email,
      },
    });

    console.log(`Repair completed for ${repairRequest.ticketNumber}`);

    return NextResponse.json(repairRequest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error completing repair:', error);
    return NextResponse.json({ error: 'Failed to complete repair' }, { status: 500 });
  }
}

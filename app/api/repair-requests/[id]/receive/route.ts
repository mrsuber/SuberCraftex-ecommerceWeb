import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const receiveDeviceSchema = z.object({
  deviceConditionOnIntake: z.string().min(1),
  intakePhotos: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

// POST - Mark device as received at shop
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin or technician can receive devices
    if (!['admin', 'technician'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = receiveDeviceSchema.parse(body);

    // Check if repair request exists
    const existingRequest = await db.repairRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Repair request not found' }, { status: 404 });
    }

    if (existingRequest.status !== 'pending') {
      return NextResponse.json(
        { error: 'Device has already been received or processed' },
        { status: 400 }
      );
    }

    // Update repair request
    const repairRequest = await db.repairRequest.update({
      where: { id },
      data: {
        status: 'received',
        receivedAt: new Date(),
        deviceConditionOnIntake: data.deviceConditionOnIntake,
        intakePhotos: data.intakePhotos,
      },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    // Add progress entry
    await db.repairProgress.create({
      data: {
        repairRequestId: id,
        status: 'received',
        description: `Device received at shop. Condition: ${data.deviceConditionOnIntake}${data.notes ? `. Notes: ${data.notes}` : ''}`,
        photos: data.intakePhotos,
        updatedBy: user.id,
        updatedByName: user.fullName || user.email,
      },
    });

    console.log(`Device received for repair ${repairRequest.ticketNumber}`);

    return NextResponse.json(repairRequest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error receiving device:', error);
    return NextResponse.json({ error: 'Failed to receive device' }, { status: 500 });
  }
}

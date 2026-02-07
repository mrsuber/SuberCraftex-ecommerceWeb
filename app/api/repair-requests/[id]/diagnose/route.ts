import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const diagnoseSchema = z.object({
  diagnosis: z.string().min(10),
  diagnosisPhotos: z.array(z.string()).default([]),
});

// POST - Submit diagnosis for a device
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin or technician can diagnose
    if (!['admin', 'technician'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = diagnoseSchema.parse(body);

    // Check if repair request exists
    const existingRequest = await db.repairRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Repair request not found' }, { status: 404 });
    }

    if (!['received', 'diagnosing'].includes(existingRequest.status)) {
      return NextResponse.json(
        { error: 'Invalid status for diagnosis' },
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

    // Update repair request with diagnosis
    const repairRequest = await db.repairRequest.update({
      where: { id },
      data: {
        status: 'diagnosed',
        diagnosis: data.diagnosis,
        diagnosisPhotos: data.diagnosisPhotos,
        diagnosedAt: new Date(),
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

    // Add progress entry
    await db.repairProgress.create({
      data: {
        repairRequestId: id,
        status: 'diagnosed',
        description: `Diagnosis complete: ${data.diagnosis}`,
        photos: data.diagnosisPhotos,
        updatedBy: user.id,
        updatedByName: user.fullName || user.email,
      },
    });

    console.log(`Diagnosis submitted for repair ${repairRequest.ticketNumber}`);

    return NextResponse.json(repairRequest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error submitting diagnosis:', error);
    return NextResponse.json({ error: 'Failed to submit diagnosis' }, { status: 500 });
  }
}

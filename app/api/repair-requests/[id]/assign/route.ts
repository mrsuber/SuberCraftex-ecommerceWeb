import { NextRequest, NextResponse } from 'next/server';
import { requireApiAdmin } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const assignSchema = z.object({
  technicianId: z.string().uuid().optional(),
  apprenticeId: z.string().uuid().optional(),
  isSupervisedWork: z.boolean().default(false),
});

// POST - Assign technician/apprentice to repair
export async function POST(
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
    const data = assignSchema.parse(body);

    // Must assign at least a technician
    if (!data.technicianId) {
      return NextResponse.json({ error: 'Technician is required' }, { status: 400 });
    }

    // Check if repair request exists
    const existingRequest = await db.repairRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Repair request not found' }, { status: 404 });
    }

    // Check if technician exists and is active
    const technician = await db.technician.findUnique({
      where: { id: data.technicianId },
    });

    if (!technician) {
      return NextResponse.json({ error: 'Technician not found' }, { status: 404 });
    }

    if (!technician.isActive) {
      return NextResponse.json({ error: 'Technician is not active' }, { status: 400 });
    }

    // If apprentice is assigned, validate
    let apprentice = null;
    if (data.apprenticeId) {
      apprentice = await db.apprentice.findUnique({
        where: { id: data.apprenticeId },
      });

      if (!apprentice) {
        return NextResponse.json({ error: 'Apprentice not found' }, { status: 404 });
      }

      if (!apprentice.isActive) {
        return NextResponse.json({ error: 'Apprentice is not active' }, { status: 400 });
      }

      if (apprentice.serviceTrack !== 'device_repair') {
        return NextResponse.json(
          { error: 'Apprentice is not in device repair track' },
          { status: 400 }
        );
      }

      if (!apprentice.canWorkOnRealJobs) {
        return NextResponse.json(
          { error: 'Apprentice is not yet qualified for real jobs' },
          { status: 400 }
        );
      }
    }

    // Update repair request
    const repairRequest = await db.repairRequest.update({
      where: { id },
      data: {
        technicianId: data.technicianId,
        apprenticeId: data.apprenticeId,
        supervisorId: data.apprenticeId ? data.technicianId : null,
        isSupervisedWork: data.isSupervisedWork && !!data.apprenticeId,
        status: existingRequest.status === 'pending' ? 'received' : existingRequest.status,
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
            employeeId: true,
          },
        },
        apprentice: {
          select: {
            id: true,
            fullName: true,
            apprenticeNumber: true,
          },
        },
      },
    });

    // Add progress entry
    const assignmentDetails = [
      `Assigned to ${technician.fullName}`,
      apprentice ? `Apprentice: ${apprentice.fullName}` : null,
      data.isSupervisedWork ? '(Supervised work)' : null,
    ].filter(Boolean).join('. ');

    await db.repairProgress.create({
      data: {
        repairRequestId: id,
        status: 'assigned',
        description: assignmentDetails,
        photos: [],
        updatedBy: admin.id,
        updatedByName: admin.fullName || admin.email,
      },
    });

    console.log(`Assigned repair ${repairRequest.ticketNumber} to ${technician.fullName}`);

    return NextResponse.json(repairRequest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error assigning repair:', error);
    return NextResponse.json({ error: 'Failed to assign repair' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const addProgressSchema = z.object({
  status: z.string().min(1),
  description: z.string().min(1),
  photos: z.array(z.string()).default([]),
});

// POST - Add progress update
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin or technician can add progress
    if (!['admin', 'technician'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = addProgressSchema.parse(body);

    // Check if repair request exists
    const existingRequest = await db.repairRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Repair request not found' }, { status: 404 });
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

    // Create progress entry
    const progress = await db.repairProgress.create({
      data: {
        repairRequestId: id,
        status: data.status,
        description: data.description,
        photos: data.photos,
        updatedBy: user.id,
        updatedByName: user.fullName || user.email,
      },
    });

    console.log(`Progress added for repair ${existingRequest.ticketNumber}`);

    return NextResponse.json(progress, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error adding progress:', error);
    return NextResponse.json({ error: 'Failed to add progress' }, { status: 500 });
  }
}

// GET - Get all progress for a repair
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

    // Check if repair request exists
    const existingRequest = await db.repairRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Repair request not found' }, { status: 404 });
    }

    // Role-based access
    if (user.role === 'customer' && existingRequest.customerId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const progress = await db.repairProgress.findMany({
      where: { repairRequestId: id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const createRepairRequestSchema = z.object({
  deviceType: z.enum(['phone', 'tablet', 'laptop', 'desktop', 'tv', 'gaming_console', 'audio_equipment', 'other']),
  brand: z.string().min(1),
  model: z.string().min(1),
  serialNumber: z.string().optional(),
  deviceColor: z.string().optional(),
  issueDescription: z.string().min(10),
  issuePhotos: z.array(z.string()).default([]),
  customerNotes: z.string().optional(),
  collectionMethod: z.enum(['customer_brings', 'pickup_requested']).default('customer_brings'),
  pickupAddress: z.string().optional(),
  scheduledDropoff: z.string().optional().transform((val) => val ? new Date(val) : undefined),
});

// Helper to generate ticket number
async function generateTicketNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await db.repairRequest.count();
  return `REP-${year}-${String(count + 1).padStart(4, '0')}`;
}

// GET - List repair requests (filtered by role)
export async function GET(request: NextRequest) {
  try {
    const user = await requireApiAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const deviceType = searchParams.get('deviceType');
    const priority = searchParams.get('priority');
    const technicianId = searchParams.get('technicianId');

    // Build where clause
    const where: Record<string, unknown> = {};

    // Role-based filtering
    if (user.role === 'customer') {
      where.customerId = user.id;
    } else if (user.role === 'technician') {
      const technician = await db.technician.findUnique({
        where: { userId: user.id },
      });
      if (technician) {
        where.technicianId = technician.id;
      }
    }
    // Admin can see all

    if (status) {
      where.status = status;
    }
    if (deviceType) {
      where.deviceType = deviceType;
    }
    if (priority) {
      where.priority = priority;
    }
    if (technicianId && user.role === 'admin') {
      where.technicianId = technicianId;
    }

    const repairs = await db.repairRequest.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
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
        progress: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(repairs);
  } catch (error) {
    console.error('Error fetching repair requests:', error);
    return NextResponse.json({ error: 'Failed to fetch repair requests' }, { status: 500 });
  }
}

// POST - Create new repair request (customer)
export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = createRepairRequestSchema.parse(body);

    // Generate ticket number
    const ticketNumber = await generateTicketNumber();

    // Create repair request
    const repairRequest = await db.repairRequest.create({
      data: {
        ticketNumber,
        customerId: user.id,
        deviceType: data.deviceType,
        brand: data.brand,
        model: data.model,
        serialNumber: data.serialNumber,
        deviceColor: data.deviceColor,
        issueDescription: data.issueDescription,
        issuePhotos: data.issuePhotos,
        customerNotes: data.customerNotes,
        collectionMethod: data.collectionMethod,
        pickupAddress: data.pickupAddress,
        scheduledDropoff: data.scheduledDropoff,
        status: 'pending',
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

    // Create initial progress entry
    await db.repairProgress.create({
      data: {
        repairRequestId: repairRequest.id,
        status: 'pending',
        description: 'Repair request submitted. Awaiting device intake.',
        photos: [],
        updatedBy: user.id,
        updatedByName: user.fullName || user.email,
      },
    });

    console.log(`Created repair request ${ticketNumber} for user ${user.email}`);

    return NextResponse.json(repairRequest, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating repair request:', error);
    return NextResponse.json({ error: 'Failed to create repair request' }, { status: 500 });
  }
}

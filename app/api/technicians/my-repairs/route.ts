import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';

// GET - Get current technician's assigned repairs
export async function GET(request: NextRequest) {
  try {
    const user = await requireApiAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'technician') {
      return NextResponse.json({ error: 'Not a technician' }, { status: 403 });
    }

    const technician = await db.technician.findUnique({
      where: { userId: user.id },
    });

    if (!technician) {
      return NextResponse.json({ error: 'Technician profile not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const deviceType = searchParams.get('deviceType');
    const priority = searchParams.get('priority');

    // Build where clause
    const where: Record<string, unknown> = {
      technicianId: technician.id,
    };

    if (status) {
      where.status = status;
    }
    if (deviceType) {
      where.deviceType = deviceType;
    }
    if (priority) {
      where.priority = priority;
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
        payments: {
          select: {
            id: true,
            amount: true,
            paymentType: true,
            createdAt: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    // Group repairs by status for easier display
    const grouped = {
      urgent: repairs.filter((r) => r.priority === 'urgent' && !['completed', 'cancelled'].includes(r.status)),
      inProgress: repairs.filter((r) => ['received', 'diagnosing', 'diagnosed', 'in_repair', 'testing'].includes(r.status)),
      awaitingCustomer: repairs.filter((r) => ['quote_sent', 'waiting_parts', 'ready_for_pickup'].includes(r.status)),
      completed: repairs.filter((r) => r.status === 'completed'),
      all: repairs,
    };

    return NextResponse.json({
      repairs,
      grouped,
      total: repairs.length,
    });
  } catch (error) {
    console.error('Error fetching technician repairs:', error);
    return NextResponse.json({ error: 'Failed to fetch repairs' }, { status: 500 });
  }
}

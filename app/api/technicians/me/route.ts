import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';

// GET - Get current technician's profile
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
      },
    });

    if (!technician) {
      return NextResponse.json({ error: 'Technician profile not found' }, { status: 404 });
    }

    // Get stats
    const allRepairs = await db.repairRequest.findMany({
      where: { technicianId: technician.id },
      select: {
        id: true,
        status: true,
        rating: true,
        deviceType: true,
        createdAt: true,
      },
    });

    // Calculate stats
    const completedRepairs = allRepairs.filter((r) => r.status === 'completed');
    const ratings = completedRepairs
      .filter((r) => r.rating !== null)
      .map((r) => r.rating as number);

    // Get today's repairs
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRepairs = allRepairs.filter(
      (r) => new Date(r.createdAt) >= today
    );

    const stats = {
      totalRepairs: allRepairs.length,
      completedRepairs: completedRepairs.length,
      pendingRepairs: allRepairs.filter(
        (r) => !['completed', 'cancelled'].includes(r.status)
      ).length,
      todayRepairs: todayRepairs.length,
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
    console.error('Error fetching technician profile:', error);
    return NextResponse.json({ error: 'Failed to fetch technician profile' }, { status: 500 });
  }
}

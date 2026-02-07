import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';

// GET - Get apprentices supervised by current technician
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

    // Get apprentices where this technician is the mentor
    // and they are in the device_repair track
    const apprentices = await db.apprentice.findMany({
      where: {
        mentorId: user.id,
        serviceTrack: 'device_repair',
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        assignments: {
          select: {
            id: true,
            status: true,
            rating: true,
          },
        },
        certificates: {
          select: {
            id: true,
          },
        },
        repairRequests: {
          where: {
            isSupervisedWork: true,
          },
          select: {
            id: true,
            status: true,
            rating: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform data to include stats
    const apprenticesWithStats = apprentices.map((apprentice) => ({
      ...apprentice,
      totalAssignments: apprentice.assignments.length,
      completedAssignments: apprentice.assignments.filter((a) => a.status === 'completed').length,
      certificatesCount: apprentice.certificates.length,
      supervisedRepairs: apprentice.repairRequests.length,
      completedSupervisedRepairs: apprentice.repairRequests.filter((r) => r.status === 'completed').length,
    }));

    return NextResponse.json(apprenticesWithStats);
  } catch (error) {
    console.error('Error fetching technician apprentices:', error);
    return NextResponse.json({ error: 'Failed to fetch apprentices' }, { status: 500 });
  }
}

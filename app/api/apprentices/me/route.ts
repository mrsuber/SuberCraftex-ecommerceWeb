import { NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';

// GET - Get current apprentice's profile
export async function GET() {
  try {
    const user = await requireApiAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'apprentice') {
      return NextResponse.json({ error: 'Not an apprentice' }, { status: 403 });
    }

    const apprentice = await db.apprentice.findUnique({
      where: { userId: user.id },
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
          orderBy: { assignedDate: 'desc' },
          take: 10,
        },
        certificates: {
          orderBy: { issuedDate: 'desc' },
        },
      },
    });

    if (!apprentice) {
      return NextResponse.json({ error: 'Apprentice profile not found' }, { status: 404 });
    }

    // Calculate stats
    const stats = {
      totalAssignments: apprentice.assignments.length,
      completedAssignments: apprentice.assignments.filter((a) => a.status === 'completed').length,
      pendingAssignments: apprentice.assignments.filter((a) => a.status === 'pending' || a.status === 'in_progress').length,
      averageRating: apprentice.assignments
        .filter((a) => a.rating !== null)
        .reduce((acc, a, _, arr) => acc + (a.rating || 0) / arr.length, 0) || null,
      certificatesCount: apprentice.certificates.length,
    };

    return NextResponse.json({ ...apprentice, stats });
  } catch (error) {
    console.error('Error fetching apprentice profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

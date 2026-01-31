import { NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';

// GET - Get mentor's apprentices (for mentors)
export async function GET() {
  try {
    const user = await requireApiAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is a mentor (tailor, cashier, driver, or admin)
    const validMentorRoles = ['tailor', 'cashier', 'driver', 'admin'];
    if (!validMentorRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Not authorized as a mentor' }, { status: 403 });
    }

    const apprentices = await db.apprentice.findMany({
      where: {
        mentorId: user.id,
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
            title: true,
            status: true,
            dueDate: true,
            rating: true,
          },
          orderBy: { assignedDate: 'desc' },
          take: 5,
        },
        certificates: {
          select: {
            id: true,
            title: true,
            issuedDate: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Add stats to each apprentice
    const apprenticesWithStats = apprentices.map((apprentice) => ({
      ...apprentice,
      totalAssignments: apprentice.assignments.length,
      completedAssignments: apprentice.assignments.filter((a) => a.status === 'completed').length,
      pendingAssignments: apprentice.assignments.filter((a) => a.status === 'pending' || a.status === 'in_progress').length,
      certificatesCount: apprentice.certificates.length,
    }));

    return NextResponse.json(apprenticesWithStats);
  } catch (error) {
    console.error('Error fetching mentor apprentices:', error);
    return NextResponse.json({ error: 'Failed to fetch apprentices' }, { status: 500 });
  }
}

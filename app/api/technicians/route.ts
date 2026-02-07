import { NextRequest, NextResponse } from 'next/server';
import { requireApiAdmin, requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const createTechnicianSchema = z.object({
  userId: z.string().uuid(),
  fullName: z.string().min(1),
  phone: z.string().optional(),
  photoUrl: z.string().optional(),
  specializations: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  hireDate: z.string().optional().transform((val) => val ? new Date(val) : new Date()),
});

// Helper to generate employee ID
async function generateEmployeeId(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await db.technician.count();
  return `TECH-${year}-${String(count + 1).padStart(3, '0')}`;
}

// GET - List all technicians
export async function GET(request: NextRequest) {
  try {
    const user = await requireApiAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    const specialization = searchParams.get('specialization');

    // Build where clause
    const where: Record<string, unknown> = {};

    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    if (specialization) {
      where.specializations = { has: specialization };
    }

    const technicians = await db.technician.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        repairRequests: {
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
    const techniciansWithStats = technicians.map((technician) => {
      const completedRepairs = technician.repairRequests.filter(
        (r) => r.status === 'completed'
      );
      const ratings = completedRepairs
        .filter((r) => r.rating !== null)
        .map((r) => r.rating as number);

      return {
        ...technician,
        totalRepairs: technician.repairRequests.length,
        completedRepairs: completedRepairs.length,
        pendingRepairs: technician.repairRequests.filter(
          (r) => !['completed', 'cancelled'].includes(r.status)
        ).length,
        averageRating: ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : null,
      };
    });

    return NextResponse.json(techniciansWithStats);
  } catch (error) {
    console.error('Error fetching technicians:', error);
    return NextResponse.json({ error: 'Failed to fetch technicians' }, { status: 500 });
  }
}

// POST - Create new technician (admin only)
export async function POST(request: NextRequest) {
  try {
    const admin = await requireApiAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const body = await request.json();
    const data = createTechnicianSchema.parse(body);

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: data.userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user already has a technician profile
    const existingTechnician = await db.technician.findUnique({
      where: { userId: data.userId },
    });

    if (existingTechnician) {
      return NextResponse.json({ error: 'User already has a technician profile' }, { status: 400 });
    }

    // Create technician profile and update user role
    const technician = await db.$transaction(async (tx) => {
      // Update user role to technician
      await tx.user.update({
        where: { id: data.userId },
        data: { role: 'technician' },
      });

      // Generate employee ID
      const employeeId = await generateEmployeeId();

      // Create technician profile
      return tx.technician.create({
        data: {
          userId: data.userId,
          employeeId,
          fullName: data.fullName,
          phone: data.phone,
          photoUrl: data.photoUrl,
          specializations: data.specializations,
          certifications: data.certifications,
          hireDate: data.hireDate,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
        },
      });
    });

    console.log(`Created technician profile for user ${existingUser.email}`);

    return NextResponse.json(technician, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating technician:', error);
    return NextResponse.json({ error: 'Failed to create technician' }, { status: 500 });
  }
}

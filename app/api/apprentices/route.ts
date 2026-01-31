import { NextRequest, NextResponse } from 'next/server';
import { requireApiAdmin, requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const createApprenticeSchema = z.object({
  userId: z.string().uuid(),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  photoUrl: z.string().optional(),
  department: z.enum(['tailoring', 'sales', 'delivery', 'operations']),
  mentorId: z.string().min(1),
  mentorType: z.enum(['tailor', 'cashier', 'driver', 'admin']),
  startDate: z.string().transform((val) => new Date(val)),
  expectedEndDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  notes: z.string().optional(),
});

// Helper to generate apprentice number
async function generateApprenticeNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await db.apprentice.count();
  return `APP-${year}-${String(count + 1).padStart(3, '0')}`;
}

// GET - List all apprentices (admin/mentor)
export async function GET(request: NextRequest) {
  try {
    const user = await requireApiAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const status = searchParams.get('status');
    const mentorId = searchParams.get('mentorId');

    // Build where clause
    const where: Record<string, unknown> = { isActive: true };

    if (department) {
      where.department = department;
    }
    if (status) {
      where.status = status;
    }
    if (mentorId) {
      where.mentorId = mentorId;
    }

    // If not admin, only show apprentices assigned to this user as mentor
    if (user.role !== 'admin') {
      where.mentorId = user.id;
    }

    const apprentices = await db.apprentice.findMany({
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
        assignments: {
          select: {
            id: true,
            status: true,
          },
        },
        certificates: {
          select: {
            id: true,
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
    }));

    return NextResponse.json(apprenticesWithStats);
  } catch (error) {
    console.error('Error fetching apprentices:', error);
    return NextResponse.json({ error: 'Failed to fetch apprentices' }, { status: 500 });
  }
}

// POST - Create new apprentice
export async function POST(request: NextRequest) {
  try {
    const admin = await requireApiAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const body = await request.json();
    const data = createApprenticeSchema.parse(body);

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: data.userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user already has an apprentice profile
    const existingApprentice = await db.apprentice.findUnique({
      where: { userId: data.userId },
    });

    if (existingApprentice) {
      return NextResponse.json({ error: 'User already has an apprentice profile' }, { status: 400 });
    }

    // Create apprentice profile and update user role
    const apprentice = await db.$transaction(async (tx) => {
      // Update user role to apprentice
      await tx.user.update({
        where: { id: data.userId },
        data: { role: 'apprentice' },
      });

      // Generate apprentice number
      const apprenticeNumber = await generateApprenticeNumber();

      // Create apprentice profile
      return tx.apprentice.create({
        data: {
          userId: data.userId,
          apprenticeNumber,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          photoUrl: data.photoUrl,
          department: data.department,
          mentorId: data.mentorId,
          mentorType: data.mentorType,
          startDate: data.startDate,
          expectedEndDate: data.expectedEndDate,
          emergencyContactName: data.emergencyContactName,
          emergencyContactPhone: data.emergencyContactPhone,
          notes: data.notes,
          status: 'pending',
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

    console.log(`Created apprentice profile for user ${existingUser.email}`);

    return NextResponse.json(apprentice, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating apprentice:', error);
    return NextResponse.json({ error: 'Failed to create apprentice' }, { status: 500 });
  }
}

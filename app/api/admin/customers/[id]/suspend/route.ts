import { NextRequest, NextResponse } from 'next/server';
import { requireApiAdmin } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';

// POST - Suspend/Unsuspend user account
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    const admin = await requireApiAdmin();

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { suspended } = body;

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent suspending admin users
    if (existingUser.role === 'admin') {
      return NextResponse.json(
        { error: 'Cannot suspend admin users' },
        { status: 403 }
      );
    }

    // For now, we'll add a suspended field to track this
    // You can extend the User model to include a 'suspended' boolean field
    // Or use emailVerified = false as a suspension mechanism

    const updatedUser = await db.user.update({
      where: { id },
      data: {
        emailVerified: !suspended, // Unverify email to suspend
      },
      select: {
        id: true,
        email: true,
        emailVerified: true,
      },
    });

    console.log(
      `✅ ${suspended ? 'Suspended' : 'Unsuspended'} user ${existingUser.email}`
    );

    return NextResponse.json({
      success: true,
      suspended,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error suspending user:', error);
    return NextResponse.json({ error: 'Failed to suspend user' }, { status: 500 });
  }
}

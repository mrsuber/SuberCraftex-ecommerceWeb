import { NextRequest, NextResponse } from 'next/server';
import { requireApiAdmin } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const roleSchema = z.object({
  role: z.enum(['customer', 'admin', 'driver']),
});

// PATCH - Update user role
export async function PATCH(
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
    const { role } = roleSchema.parse(body);

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user role
    const updatedUser = await db.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true,
        fullName: true,
      },
    });

    console.log(`✅ Updated user ${existingUser.email} role to ${role}`);

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireApiAdmin } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const roleSchema = z.object({
  role: z.enum(['customer', 'admin', 'driver', 'cashier', 'tailor']),
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

    // Update user role and create associated profiles if needed
    const updatedUser = await db.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id },
        data: { role },
        select: {
          id: true,
          email: true,
          role: true,
          fullName: true,
          phone: true,
        },
      });

      // Create Cashier profile if role is changed to cashier and profile doesn't exist
      if (role === 'cashier') {
        const existingCashier = await tx.cashier.findUnique({
          where: { userId: id },
        });

        if (!existingCashier) {
          await tx.cashier.create({
            data: {
              userId: id,
              fullName: user.fullName || 'Cashier',
              email: user.email,
              phone: user.phone || 'Not provided',
            },
          });
          console.log(`✅ Created Cashier profile for user ${user.email}`);
        }
      }

      // Create Tailor profile if role is changed to tailor and profile doesn't exist
      if (role === 'tailor') {
        const existingTailor = await tx.tailor.findUnique({
          where: { userId: id },
        });

        if (!existingTailor) {
          await tx.tailor.create({
            data: {
              userId: id,
              fullName: user.fullName || 'Tailor',
              email: user.email,
              phone: user.phone || 'Not provided',
              specialties: [], // Admin can update specialties later
            },
          });
          console.log(`✅ Created Tailor profile for user ${user.email}`);
        }
      }

      // Note: Driver profile is NOT auto-created because it requires vehicle details
      // Admin must manually create driver profile from the drivers page

      return user;
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

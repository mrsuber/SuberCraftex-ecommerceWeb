import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { z } from 'zod';

const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').optional(),
  phone: z.string().optional(),
});

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = profileSchema.parse(body);

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: validatedData,
      select: {
        id: true,
        email: true,
        role: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

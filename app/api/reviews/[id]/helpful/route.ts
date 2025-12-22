import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';

// POST - Mark review as helpful
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: 'Must be logged in to vote' }, { status: 401 });
    }

    const { id } = await params;

    // Increment helpful count
    const review = await db.review.update({
      where: { id },
      data: {
        helpfulCount: {
          increment: 1,
        },
      },
    });

    console.log(`✅ Review ${id} marked as helpful by ${user.email}`);

    return NextResponse.json({ success: true, helpfulCount: review.helpfulCount });
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    return NextResponse.json({ error: 'Failed to mark as helpful' }, { status: 500 });
  }
}

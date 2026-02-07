import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const submitReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

// POST - Submit customer review for completed repair
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = submitReviewSchema.parse(body);

    // Check if repair request exists
    const existingRequest = await db.repairRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Repair request not found' }, { status: 404 });
    }

    // Customer can only review their own repairs
    if (existingRequest.customerId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (existingRequest.status !== 'completed') {
      return NextResponse.json(
        { error: 'Can only review completed repairs' },
        { status: 400 }
      );
    }

    if (existingRequest.rating !== null) {
      return NextResponse.json(
        { error: 'Repair has already been reviewed' },
        { status: 400 }
      );
    }

    // Update repair request with review
    const repairRequest = await db.$transaction(async (tx) => {
      const updated = await tx.repairRequest.update({
        where: { id },
        data: {
          rating: data.rating,
          reviewComment: data.comment,
        },
        include: {
          technician: true,
        },
      });

      // Update technician average rating if applicable
      if (updated.technicianId) {
        const technicianRepairs = await tx.repairRequest.findMany({
          where: {
            technicianId: updated.technicianId,
            rating: { not: null },
          },
          select: { rating: true },
        });

        const ratings = technicianRepairs.map((r) => r.rating as number);
        const averageRating = ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;

        await tx.technician.update({
          where: { id: updated.technicianId },
          data: { averageRating },
        });
      }

      return updated;
    });

    // Add progress entry
    await db.repairProgress.create({
      data: {
        repairRequestId: id,
        status: 'reviewed',
        description: `Customer left a ${data.rating}-star review.${data.comment ? ` "${data.comment}"` : ''}`,
        photos: [],
        updatedBy: user.id,
        updatedByName: user.fullName || user.email,
      },
    });

    console.log(`Review submitted for repair ${repairRequest.ticketNumber}: ${data.rating} stars`);

    return NextResponse.json(repairRequest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

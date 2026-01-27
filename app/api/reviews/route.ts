import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';

// POST - Submit a review
export async function POST(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: 'Must be logged in to submit a review' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, rating, title, content, images, orderId } = body;

    // Validate required fields
    if (!productId || !rating) {
      return NextResponse.json(
        { error: 'Product ID and rating are required' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if user already reviewed this product
    const existingReview = await db.review.findFirst({
      where: {
        productId,
        userId: user.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Check if this is a verified purchase
    let verifiedPurchase = false;
    if (orderId) {
      const order = await db.order.findFirst({
        where: {
          id: orderId,
          userId: user.id,
          orderStatus: 'delivered',
        },
        include: {
          orderItems: {
            where: { productId },
          },
        },
      });

      verifiedPurchase = !!order && order.orderItems.length > 0;
    } else {
      // Check if user has ever purchased this product
      const purchaseOrder = await db.order.findFirst({
        where: {
          userId: user.id,
          orderStatus: 'delivered',
          orderItems: {
            some: { productId },
          },
        },
      });

      verifiedPurchase = !!purchaseOrder;
    }

    // Create review
    const review = await db.review.create({
      data: {
        productId,
        userId: user.id,
        orderId: orderId || null,
        rating,
        title: title || null,
        content: content || null,
        images: images || [],
        verifiedPurchase,
        isApproved: false, // Requires admin approval
      },
      include: {
        user: {
          select: {
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    console.log(`✅ Review submitted for product ${product.name} by ${user.email}`);

    // Create admin notification for new review
    try {
      const { NotificationService } = await import('@/lib/services/notification-service');
      await NotificationService.notifyNewReview({
        id: review.id,
        productName: product.name,
        rating,
        customerName: review.user?.fullName || undefined,
      });
      console.log('✅ Admin notification created for new review');
    } catch (notifError) {
      console.error('⚠️  Failed to create admin notification:', notifError);
    }

    return NextResponse.json(
      {
        review,
        message: 'Review submitted successfully! It will be visible after admin approval.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

// GET - List reviews (for admin)
export async function GET(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'pending', 'approved', 'all'

    const where: any = {};
    if (status === 'pending') {
      where.isApproved = false;
    } else if (status === 'approved') {
      where.isApproved = true;
    }

    const reviews = await db.review.findMany({
      where,
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
        product: {
          select: {
            name: true,
            sku: true,
            featuredImage: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';

// GET - Get a single delivery's details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: trackingId } = await params;
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'driver') {
      return NextResponse.json({ error: 'Not a driver' }, { status: 403 });
    }

    // Get driver profile
    const driver = await db.driver.findUnique({
      where: { userId: user.id },
    });

    if (!driver) {
      return NextResponse.json({ error: 'Driver profile not found' }, { status: 404 });
    }

    // Get the delivery with full details
    const delivery = await db.shippingTracking.findUnique({
      where: { id: trackingId },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            orderStatus: true,
            totalAmount: true,
            shippingAddress: true,
            customerName: true,
            customerPhone: true,
            customerEmail: true,
            customerNotes: true,
            createdAt: true,
            orderItems: {
              select: {
                id: true,
                productName: true,
                productImage: true,
                quantity: true,
                price: true,
              },
            },
          },
        },
        trackingHistory: {
          orderBy: {
            recordedAt: 'desc',
          },
        },
      },
    });

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    // Verify this is the driver's delivery
    if (delivery.driverId !== driver.id) {
      return NextResponse.json({ error: 'This delivery is not assigned to you' }, { status: 403 });
    }

    // Transform the data
    const transformedDelivery = {
      id: delivery.id,
      orderId: delivery.orderId,
      status: delivery.status,
      orderNumber: delivery.order.orderNumber,
      totalAmount: parseFloat(delivery.order.totalAmount.toString()),
      shippingAddress: delivery.order.shippingAddress,
      customerName: delivery.order.customerName,
      customerPhone: delivery.order.customerPhone,
      customerEmail: delivery.order.customerEmail,
      customerNotes: delivery.order.customerNotes,
      estimatedDeliveryTime: delivery.estimatedDeliveryTime?.toISOString() || null,
      actualDeliveryTime: delivery.actualDeliveryTime?.toISOString() || null,
      currentLocation: delivery.currentLocation,
      pickupLocation: delivery.pickupLocation,
      deliveryLocation: delivery.deliveryLocation,
      notes: delivery.notes,
      photoUrl: delivery.photoUrl,
      signatureUrl: delivery.signatureUrl,
      createdAt: delivery.createdAt.toISOString(),
      updatedAt: delivery.updatedAt.toISOString(),
      items: delivery.order.orderItems.map((item) => ({
        id: item.id,
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
        price: parseFloat(item.price.toString()),
      })),
      history: delivery.trackingHistory.map((h) => ({
        id: h.id,
        location: h.location,
        recordedAt: h.recordedAt.toISOString(),
      })),
    };

    return NextResponse.json({ delivery: transformedDelivery });
  } catch (error) {
    console.error('Error fetching delivery details:', error);
    return NextResponse.json({ error: 'Failed to fetch delivery details' }, { status: 500 });
  }
}

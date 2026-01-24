import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';

// GET - Get current driver profile
export async function GET(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'driver') {
      return NextResponse.json({ error: 'Not a driver' }, { status: 403 });
    }

    const driver = await db.driver.findUnique({
      where: { userId: user.id },
      include: {
        shippingTracking: {
          where: {
            status: {
              notIn: ['delivered', 'failed'],
            },
          },
          include: {
            order: {
              select: {
                id: true,
                orderNumber: true,
                totalAmount: true,
                shippingAddress: true,
              },
            },
          },
        },
      },
    });

    if (!driver) {
      return NextResponse.json({ error: 'Driver profile not found' }, { status: 404 });
    }

    // Get stats
    const [totalDeliveries, completedToday, activeDeliveries] = await Promise.all([
      db.shippingTracking.count({
        where: {
          driverId: driver.id,
          status: 'delivered',
        },
      }),
      db.shippingTracking.count({
        where: {
          driverId: driver.id,
          status: 'delivered',
          actualDeliveryTime: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      db.shippingTracking.count({
        where: {
          driverId: driver.id,
          status: {
            notIn: ['delivered', 'failed'],
          },
        },
      }),
    ]);

    return NextResponse.json({
      driver: {
        id: driver.id,
        fullName: driver.fullName,
        phone: driver.phone,
        email: driver.email,
        photoUrl: driver.photoUrl,
        vehicleType: driver.vehicleType,
        vehicleNumber: driver.vehicleNumber,
        isAvailable: driver.isAvailable,
        rating: driver.rating ? parseFloat(driver.rating.toString()) : 0,
        totalDeliveries: driver.totalDeliveries,
      },
      stats: {
        totalDeliveries,
        completedToday,
        activeDeliveries,
      },
    });
  } catch (error) {
    console.error('Error fetching driver profile:', error);
    return NextResponse.json({ error: 'Failed to fetch driver profile' }, { status: 500 });
  }
}

// PATCH - Update driver availability
export async function PATCH(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user || user.role !== 'driver') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { isAvailable } = body;

    const driver = await db.driver.update({
      where: { userId: user.id },
      data: { isAvailable },
    });

    return NextResponse.json({ driver });
  } catch (error) {
    console.error('Error updating driver:', error);
    return NextResponse.json({ error: 'Failed to update driver' }, { status: 500 });
  }
}

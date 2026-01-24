import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSession();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // First verify the order belongs to the user
    const order = await db.order.findFirst({
      where: {
        id,
        userId: user.id,
      },
      select: {
        id: true,
        orderNumber: true,
        shippingAddress: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Get tracking information
    const tracking = await db.shippingTracking.findUnique({
      where: {
        orderId: id,
      },
      include: {
        driver: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            photoUrl: true,
            vehicleType: true,
            vehicleNumber: true,
            rating: true,
            totalDeliveries: true,
          },
        },
        trackingHistory: {
          orderBy: {
            recordedAt: 'desc',
          },
        },
      },
    });

    if (!tracking) {
      // Return a default tracking response if no tracking exists yet
      return NextResponse.json({
        id: null,
        order_id: id,
        status: 'pending',
        current_location: null,
        pickup_location: null,
        delivery_location: order.shippingAddress ? JSON.stringify(order.shippingAddress) : null,
        estimated_delivery_time: null,
        actual_delivery_time: null,
        notes: null,
        driver: null,
        history: [],
      });
    }

    // Transform to snake_case format expected by the mobile app
    const response = {
      id: tracking.id,
      order_id: tracking.orderId,
      driver_id: tracking.driverId,
      status: tracking.status,
      current_location: tracking.currentLocation,
      pickup_location: tracking.pickupLocation,
      delivery_location: tracking.deliveryLocation,
      estimated_delivery_time: tracking.estimatedDeliveryTime?.toISOString() || null,
      actual_delivery_time: tracking.actualDeliveryTime?.toISOString() || null,
      notes: tracking.notes,
      signature_url: tracking.signatureUrl,
      photo_url: tracking.photoUrl,
      created_at: tracking.createdAt.toISOString(),
      updated_at: tracking.updatedAt.toISOString(),
      driver: tracking.driver ? {
        id: tracking.driver.id,
        full_name: tracking.driver.fullName,
        phone: tracking.driver.phone,
        photo_url: tracking.driver.photoUrl,
        vehicle_type: tracking.driver.vehicleType,
        vehicle_number: tracking.driver.vehicleNumber,
        rating: tracking.driver.rating ? parseFloat(tracking.driver.rating.toString()) : 0,
        total_deliveries: tracking.driver.totalDeliveries,
      } : null,
      history: tracking.trackingHistory.map(h => ({
        id: h.id,
        tracking_id: h.trackingId,
        status: tracking.status, // Use current status since TrackingHistory doesn't have status field
        location: h.location,
        notes: null,
        recorded_at: h.recordedAt.toISOString(),
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Order tracking API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tracking information" },
      { status: 500 }
    );
  }
}

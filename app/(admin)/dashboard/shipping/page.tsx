import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DriversTable } from "@/components/shipping/DriversTable";
import { ShipmentsTable } from "@/components/shipping/ShipmentsTable";
import { DriverStatsCard } from "@/components/shipping/DriverStatsCard";
import { MetricCard } from "@/components/analytics/MetricCard";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Shipping - SuberCraftex Admin",
  description: "Manage drivers and shipments",
};

async function getShippingData() {
  const [drivers, shipments, unassignedOrders, deliveryStats] = await Promise.all([
    // Get all drivers with their active deliveries
    db.driver.findMany({
      include: {
        user: {
          select: { email: true, fullName: true },
        },
        shippingTracking: {
          where: {
            status: { in: ['assigned', 'picked_up', 'in_transit', 'out_for_delivery'] },
          },
          include: {
            order: {
              select: {
                orderNumber: true,
                totalAmount: true,
              },
            },
          },
        },
      },
      orderBy: { isActive: 'desc' },
    }),

    // Get all shipments
    db.shippingTracking.findMany({
      include: {
        order: {
          select: {
            orderNumber: true,
            shippingAddress: true,
            totalAmount: true,
            createdAt: true,
          },
        },
        driver: {
          select: {
            fullName: true,
            phone: true,
            vehicleType: true,
          },
        },
        trackingHistory: {
          orderBy: { recordedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),

    // Get unassigned orders
    db.order.findMany({
      where: {
        orderStatus: { in: ['processing', 'paid'] },
        paymentStatus: 'paid',
        shippingTracking: null,
      },
      include: {
        orderItems: {
          select: {
            productName: true,
            quantity: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    }),

    // Get delivery statistics
    db.shippingTracking.groupBy({
      by: ['status'],
      _count: true,
    }),
  ]);

  // Calculate driver metrics
  const activeDrivers = drivers.filter(d => d.isActive).length;
  const availableDrivers = drivers.filter(
    d => d.isActive && d.isAvailable && d.shippingTracking.length < 5
  ).length;

  // Calculate delivery metrics
  const activeDeliveries = deliveryStats
    .filter(s => ['assigned', 'picked_up', 'in_transit', 'out_for_delivery'].includes(s.status))
    .reduce((sum, s) => sum + s._count, 0);

  const completedToday = await db.shippingTracking.count({
    where: {
      status: 'delivered',
      actualDeliveryTime: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
  });

  // Serialize data for client
  const serializedShipments = shipments.map(s => ({
    id: s.id,
    orderId: s.orderId,
    orderNumber: s.order.orderNumber,
    driverId: s.driverId,
    driverName: s.driver?.fullName || null,
    driverPhone: s.driver?.phone || null,
    vehicleType: s.driver?.vehicleType || null,
    status: s.status,
    currentLocation: s.currentLocation,
    estimatedDeliveryTime: s.estimatedDeliveryTime?.toISOString() || null,
    actualDeliveryTime: s.actualDeliveryTime?.toISOString() || null,
    createdAt: s.createdAt.toISOString(),
  }));

  const serializedDrivers = drivers.map(d => ({
    id: d.id,
    userId: d.userId,
    fullName: d.fullName,
    phone: d.phone,
    email: d.email,
    photoUrl: d.photoUrl,
    vehicleType: d.vehicleType,
    vehicleNumber: d.vehicleNumber,
    licenseNumber: d.licenseNumber,
    isActive: d.isActive,
    isAvailable: d.isAvailable,
    rating: d.rating ? Number(d.rating) : null,
    totalDeliveries: d.totalDeliveries,
    activeDeliveries: d.shippingTracking.length,
    createdAt: d.createdAt.toISOString(),
  }));

  const serializedUnassignedOrders = unassignedOrders.map(o => ({
    id: o.id,
    orderNumber: o.orderNumber,
    totalAmount: Number(o.totalAmount),
    itemCount: o.orderItems.reduce((sum, item) => sum + item.quantity, 0),
    shippingAddress: o.shippingAddress as any,
    createdAt: o.createdAt.toISOString(),
  }));

  return {
    drivers: serializedDrivers,
    shipments: serializedShipments,
    unassignedOrders: serializedUnassignedOrders,
    stats: {
      totalDrivers: drivers.length,
      activeDrivers,
      availableDrivers,
      activeDeliveries,
      completedToday,
      unassignedCount: unassignedOrders.length,
    },
  };
}

export default async function ShippingPage() {
  const user = await getSession();

  // Only admins can access shipping management
  if (!user || user.role !== 'admin') {
    redirect('/dashboard');
  }

  const data = await getShippingData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Shipping Management</h1>
          <p className="text-muted-foreground">
            Manage drivers, shipments, and deliveries
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="drivers">
            Drivers ({data.stats.totalDrivers})
          </TabsTrigger>
          <TabsTrigger value="shipments">
            Active Shipments ({data.stats.activeDeliveries})
          </TabsTrigger>
          <TabsTrigger value="unassigned">
            Unassigned ({data.stats.unassignedCount})
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Drivers"
              value={data.stats.totalDrivers.toString()}
              description="Registered drivers"
              iconName="Users"
            />
            <MetricCard
              title="Active Drivers"
              value={data.stats.activeDrivers.toString()}
              description="Currently active"
              iconName="Truck"
            />
            <MetricCard
              title="Active Deliveries"
              value={data.stats.activeDeliveries.toString()}
              description="In progress"
              iconName="Package"
            />
            <MetricCard
              title="Completed Today"
              value={data.stats.completedToday.toString()}
              description="Delivered today"
              iconName="Clock"
            />
          </div>

          {/* Recent Shipments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Shipments</CardTitle>
              <CardDescription>Latest shipment activity</CardDescription>
            </CardHeader>
            <CardContent>
              <ShipmentsTable shipments={data.shipments.slice(0, 10)} />
            </CardContent>
          </Card>

          {/* Top Drivers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Drivers</CardTitle>
              <CardDescription>Highest performing drivers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.drivers
                  .filter(d => d.isActive)
                  .sort((a, b) => b.totalDeliveries - a.totalDeliveries)
                  .slice(0, 6)
                  .map(driver => (
                    <DriverStatsCard key={driver.id} driver={driver} />
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Drivers Tab */}
        <TabsContent value="drivers" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>All Drivers</CardTitle>
                <CardDescription>Manage your delivery drivers</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Driver
              </Button>
            </CardHeader>
            <CardContent>
              <DriversTable drivers={data.drivers} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Shipments Tab */}
        <TabsContent value="shipments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Shipments</CardTitle>
              <CardDescription>Track all ongoing deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              <ShipmentsTable shipments={data.shipments} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Unassigned Orders Tab */}
        <TabsContent value="unassigned" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Unassigned Orders</CardTitle>
              <CardDescription>
                Orders waiting for driver assignment ({data.stats.unassignedCount})
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.unassignedOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No unassigned orders
                </div>
              ) : (
                <div className="space-y-4">
                  {data.unassignedOrders.map(order => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{order.orderNumber}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.itemCount} items • ${order.totalAmount.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Assign Driver
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

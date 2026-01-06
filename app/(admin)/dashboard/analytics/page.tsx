import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { MetricCard } from "@/components/analytics/MetricCard";
import { RevenueChart } from "@/components/analytics/RevenueChart";
import { OrderStatusChart } from "@/components/analytics/OrderStatusChart";
import { CategoryRevenueChart } from "@/components/analytics/CategoryRevenueChart";
import { CustomerSegmentChart } from "@/components/analytics/CustomerSegmentChart";
import { TopProductsTable } from "@/components/analytics/TopProductsTable";
import { TopCustomersTable } from "@/components/analytics/TopCustomersTable";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Analytics - SuberCraftex Admin",
  description: "Business analytics and insights",
};

async function getAnalyticsData() {
  // Date ranges
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Parallel queries for performance
  const [
    currentPeriodOrders,
    previousPeriodOrders,
    ordersByStatus,
    totalCustomers,
    newCustomers,
    topProductsData,
    topCustomersData,
    categoryData,
  ] = await Promise.all([
    // Current period paid orders (last 30 days)
    db.order.findMany({
      where: {
        paymentStatus: "paid",
        createdAt: { gte: thirtyDaysAgo },
      },
      select: {
        totalAmount: true,
        createdAt: true,
      },
    }),

    // Previous period paid orders (30-60 days ago)
    db.order.findMany({
      where: {
        paymentStatus: "paid",
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
      },
      select: {
        totalAmount: true,
      },
    }),

    // Orders by status (last 30 days)
    db.order.groupBy({
      by: ['orderStatus'],
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
      _count: true,
    }),

    // Total customers
    db.user.count({
      where: { role: 'customer' },
    }),

    // New customers (last 30 days)
    db.user.count({
      where: {
        role: 'customer',
        createdAt: { gte: thirtyDaysAgo },
      },
    }),

    // Top 10 products by revenue
    db.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        total: true,
        quantity: true,
      },
      orderBy: {
        _sum: {
          total: 'desc',
        },
      },
      take: 10,
    }),

    // Top 10 customers by spend
    db.order.groupBy({
      by: ['userId'],
      where: {
        paymentStatus: 'paid',
        userId: { not: null },
      },
      _sum: {
        totalAmount: true,
      },
      _count: true,
      orderBy: {
        _sum: {
          totalAmount: 'desc',
        },
      },
      take: 10,
    }),

    // Orders with items for category revenue
    db.order.findMany({
      where: {
        paymentStatus: 'paid',
        createdAt: { gte: thirtyDaysAgo },
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                categoryId: true,
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  // Calculate revenue metrics
  const currentRevenue = currentPeriodOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
  const previousRevenue = previousPeriodOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
  const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

  // Calculate order metrics
  const currentOrderCount = currentPeriodOrders.length;
  const previousOrderCount = previousPeriodOrders.length;
  const orderGrowth = previousOrderCount > 0 ? ((currentOrderCount - previousOrderCount) / previousOrderCount) * 100 : 0;

  // Calculate AOV
  const aov = currentOrderCount > 0 ? currentRevenue / currentOrderCount : 0;

  // Calculate completion rate
  const totalOrders = ordersByStatus.reduce((sum, s) => sum + s._count, 0);
  const completedOrdersCount = ordersByStatus.find(s => s.orderStatus === 'delivered')?._count || 0;
  const completionRate = totalOrders > 0 ? (completedOrdersCount / totalOrders) * 100 : 0;

  // Prepare daily revenue data for chart
  const dailyRevenueMap = new Map<string, number>();
  currentPeriodOrders.forEach(order => {
    const date = order.createdAt.toISOString().split('T')[0];
    dailyRevenueMap.set(date, (dailyRevenueMap.get(date) || 0) + Number(order.totalAmount));
  });

  const dailyRevenue = Array.from(dailyRevenueMap.entries())
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Prepare order status data for chart
  const orderStatusData = ordersByStatus.map(status => ({
    status: status.orderStatus,
    count: status._count,
  }));

  // Fetch product details for top products
  const productIds = topProductsData.map(p => p.productId);
  const products = await db.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      name: true,
      sku: true,
      featuredImage: true,
    },
  });

  const topProducts = topProductsData.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      id: item.productId,
      name: product?.name || 'Unknown',
      sku: product?.sku || '',
      image: product?.featuredImage || null,
      unitsSold: item._sum.quantity || 0,
      revenue: Number(item._sum.total || 0),
    };
  });

  // Fetch user details for top customers
  const userIds = topCustomersData.map(c => c.userId).filter((id): id is string => id !== null);
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: {
      id: true,
      email: true,
      fullName: true,
    },
  });

  const topCustomers = topCustomersData.map(item => {
    const user = users.find(u => u.id === item.userId);
    return {
      id: item.userId || '',
      name: user?.fullName || 'Guest',
      email: user?.email || '',
      orderCount: item._count,
      totalSpent: Number(item._sum.totalAmount || 0),
    };
  });

  // Calculate category revenue
  const categoryRevenueMap = new Map<string, number>();
  categoryData.forEach(order => {
    order.orderItems.forEach(item => {
      const categoryName = item.product?.category?.name || 'Uncategorized';
      categoryRevenueMap.set(
        categoryName,
        (categoryRevenueMap.get(categoryName) || 0) + Number(item.total)
      );
    });
  });

  const categoryRevenue = Array.from(categoryRevenueMap.entries())
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue);

  // Calculate customer segments
  const returningCustomers = topCustomersData.filter(c => c._count > 1).length;
  const customerSegments = {
    new: newCustomers,
    returning: returningCustomers,
  };

  return {
    metrics: {
      revenue: currentRevenue,
      revenueGrowth,
      orders: currentOrderCount,
      orderGrowth,
      aov,
      customers: totalCustomers,
      newCustomers,
      completionRate,
    },
    charts: {
      dailyRevenue,
      orderStatus: orderStatusData,
      categoryRevenue,
      customerSegments,
    },
    tables: {
      topProducts,
      topCustomers,
    },
  };
}

export default async function AnalyticsPage() {
  // Redirect drivers to orders page
  const user = await getSession();
  if (user?.role === 'driver') {
    redirect('/dashboard/orders');
  }

  const data = await getAnalyticsData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Business insights and performance metrics
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Revenue"
          value={formatPrice(data.metrics.revenue)}
          description="Last 30 days"
          iconName="DollarSign"
          trend={{
            value: data.metrics.revenueGrowth,
            isPositive: data.metrics.revenueGrowth > 0,
          }}
        />
        <MetricCard
          title="Total Orders"
          value={data.metrics.orders.toString()}
          description="Last 30 days"
          iconName="ShoppingCart"
          trend={{
            value: data.metrics.orderGrowth,
            isPositive: data.metrics.orderGrowth > 0,
          }}
        />
        <MetricCard
          title="Average Order Value"
          value={formatPrice(data.metrics.aov)}
          description="Per transaction"
          iconName="TrendingUp"
        />
        <MetricCard
          title="Total Customers"
          value={data.metrics.customers.toString()}
          description="All time"
          iconName="Users"
        />
        <MetricCard
          title="New Customers"
          value={data.metrics.newCustomers.toString()}
          description="Last 30 days"
          iconName="UserPlus"
        />
        <MetricCard
          title="Completion Rate"
          value={`${data.metrics.completionRate.toFixed(1)}%`}
          description="Orders delivered"
          iconName="CheckCircle"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily revenue for the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart data={data.charts.dailyRevenue} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Order distribution by status</CardDescription>
          </CardHeader>
          <CardContent>
            <OrderStatusChart data={data.charts.orderStatus} />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
            <CardDescription>Top performing categories</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryRevenueChart data={data.charts.categoryRevenue} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
            <CardDescription>New vs Returning customers</CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerSegmentChart data={data.charts.customerSegments} />
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <TopProductsTable products={data.tables.topProducts} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>Highest spending customers</CardDescription>
          </CardHeader>
          <CardContent>
            <TopCustomersTable customers={data.tables.topCustomers} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

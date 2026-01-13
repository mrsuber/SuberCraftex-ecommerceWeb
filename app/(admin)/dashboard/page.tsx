import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  Clock,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { SalesChart } from "@/components/dashboard/SalesChart";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Dashboard - SuberCraftex Admin",
  description: "Admin dashboard overview",
};

async function getStats() {
  // Get paid orders for revenue calculation
  const paidOrders = await db.order.findMany({
    where: { paymentStatus: "paid" },
    select: { totalAmount: true },
  });

  const totalRevenue = paidOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
  const totalOrders = paidOrders.length;

  // Get total customers
  const customerCount = await db.user.count({
    where: { role: "customer" },
  });

  // Get total products
  const productCount = await db.product.count({
    where: { isActive: true },
  });

  // Get pending orders
  const pendingOrders = await db.order.count({
    where: {
      orderStatus: {
        in: ["pending", "processing"],
      },
    },
  });

  // Get low stock products (less than 10)
  const lowStockCount = await db.product.count({
    where: {
      inventoryCount: { lte: 10 },
      isActive: true,
    },
  });

  return {
    totalRevenue,
    totalOrders,
    customerCount,
    productCount,
    pendingOrders,
    lowStockCount,
    averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
  };
}

export default async function DashboardPage() {
  // Redirect drivers to orders page
  const user = await getSession();
  if (user?.role === 'driver') {
    redirect('/dashboard/orders');
  }

  // Redirect tailors to their dedicated dashboard
  if (user?.role === 'tailor') {
    redirect('/dashboard/tailor');
  }

  // Admin dashboard continues below
  const stats = await getStats();

  const statCards = [
    {
      title: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      description: "All time earnings",
      icon: DollarSign,
      trend: "+12.5%",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      description: "All time orders",
      icon: ShoppingCart,
      trend: "+8.2%",
    },
    {
      title: "Total Customers",
      value: stats.customerCount.toString(),
      description: "Registered users",
      icon: Users,
      trend: "+15.3%",
    },
    {
      title: "Avg. Order Value",
      value: formatPrice(stats.averageOrderValue),
      description: "Per transaction",
      icon: TrendingUp,
      trend: "+4.1%",
    },
  ];

  const alertCards = [
    {
      title: "Pending Orders",
      value: stats.pendingOrders.toString(),
      description: "Require attention",
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockCount.toString(),
      description: "Need restocking",
      icon: Package,
      color: "text-destructive",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <p className="text-xs text-green-500 mt-1">{stat.trend} from last month</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alertCards.map((alert) => {
          const Icon = alert.icon;
          return (
            <Card key={alert.title} className="border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {alert.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${alert.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{alert.value}</div>
                <p className="text-xs text-muted-foreground">
                  {alert.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentOrders />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

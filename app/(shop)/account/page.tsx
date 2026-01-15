import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LogOut, Package, MapPin, Heart, Settings, LayoutDashboard, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

async function signOut() {
  "use server";
  const { clearAuthCookie } = await import("@/lib/auth/jwt");
  await clearAuthCookie();
  redirect("/");
}

export default async function AccountPage() {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  // Fetch user orders (both logged-in and guest orders with matching email)
  const orders = await db.order.findMany({
    where: {
      OR: [
        { userId: user.id },
        { guestEmail: user.email },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      orderItems: true,
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Account</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.fullName || user.email}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Menu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(user.role === 'admin' || user.role === 'driver' || user.role === 'cashier' || user.role === 'tailor') && (
                  <>
                    <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg border-2 border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all font-medium cursor-pointer">
                      <LayoutDashboard className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                    <Separator />
                  </>
                )}
                {user.role === 'investor' && (
                  <>
                    <Link href="/investor/dashboard" className="flex items-center gap-3 p-3 rounded-lg border-2 border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all font-medium cursor-pointer">
                      <TrendingUp className="h-5 w-5" />
                      <span>Investor Dashboard</span>
                    </Link>
                    <Separator />
                  </>
                )}
                <Link href="/account" className="flex items-center gap-3 p-3 rounded-lg border-2 border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all font-medium cursor-pointer">
                  <Package className="h-5 w-5" />
                  <span>Orders</span>
                </Link>
                <Link href="/bookings" className="flex items-center gap-3 p-3 rounded-lg border-2 border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all font-medium cursor-pointer">
                  <Calendar className="h-5 w-5" />
                  <span>Bookings</span>
                </Link>
                <Link href="/account/addresses" className="flex items-center gap-3 p-3 rounded-lg border-2 border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all font-medium cursor-pointer">
                  <MapPin className="h-5 w-5" />
                  <span>Addresses</span>
                </Link>
                <Link href="/account/wishlist" className="flex items-center gap-3 p-3 rounded-lg border-2 border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all font-medium cursor-pointer">
                  <Heart className="h-5 w-5" />
                  <span>Wishlist</span>
                </Link>
                <Link href="/account/settings" className="flex items-center gap-3 p-3 rounded-lg border-2 border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all font-medium cursor-pointer">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
                <Separator />
                <form action={signOut}>
                  <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" type="submit">
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Orders Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Your recent orders and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border-2 border-gray-300 rounded-lg p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer bg-background"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-bold text-lg">Order #{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-primary">${order.totalAmount.toString()}</p>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              order.orderStatus === "delivered"
                                ? "bg-green-100 text-green-700"
                                : order.orderStatus === "shipped"
                                ? "bg-blue-100 text-blue-700"
                                : order.orderStatus === "processing"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}>
                              {order.orderStatus}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">
                            {order.orderItems.length} item{order.orderItems.length > 1 ? "s" : ""}
                          </p>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/account/orders/${order.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start shopping to see your orders here
                    </p>
                    <Button asChild>
                      <Link href="/catalog">Browse Products</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

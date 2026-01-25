import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OrderStatusUpdate } from "@/components/orders/OrderStatusUpdate";

export const dynamic = 'force-dynamic';

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  // Fetch order with items and tracking
  const order = await db.order.findFirst({
    where: {
      OR: [
        { id, userId: user.id },
        // Allow drivers and admins to view any order
        ...(user.role === 'admin' || user.role === 'driver' ? [{ id }] : []),
      ],
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      shippingTracking: {
        include: {
          driver: {
            include: {
              user: {
                select: {
                  fullName: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/account">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>

        {/* Order Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
              <p className="text-muted-foreground mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={
                order.orderStatus === "delivered"
                  ? "bg-green-100 text-green-700"
                  : order.orderStatus === "shipped"
                  ? "bg-blue-100 text-blue-700"
                  : order.orderStatus === "processing"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }>
                {order.orderStatus}
              </Badge>
              {(user.role === 'admin' || user.role === 'driver') && (
                <>
                  {user.role === 'driver' && order.userId === user.id ? (
                    <Badge variant="outline" className="text-muted-foreground">
                      Another agent must deliver your order
                    </Badge>
                  ) : (
                    <OrderStatusUpdate orderId={order.id} currentStatus={order.orderStatus} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Order Items */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>
                  {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item.id}>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.product?.name || 'Product'}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Price: ${item.price.toString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <Separator className="mt-4" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${order.subtotal.toString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${order.shippingCost.toString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${order.taxAmount.toString()}</span>
                </div>
                {order.discountAmount && parseFloat(order.discountAmount.toString()) > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-${order.discountAmount.toString()}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${order.totalAmount.toString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  {typeof order.shippingAddress === 'object' && order.shippingAddress !== null && (
                    <>
                      <p className="font-medium">
                        {(order.shippingAddress as any).fullName || 'N/A'}
                      </p>
                      <p className="text-muted-foreground">
                        {(order.shippingAddress as any).addressLine1}
                      </p>
                      {(order.shippingAddress as any).addressLine2 && (
                        <p className="text-muted-foreground">
                          {(order.shippingAddress as any).addressLine2}
                        </p>
                      )}
                      <p className="text-muted-foreground">
                        {(order.shippingAddress as any).city}, {(order.shippingAddress as any).state}{' '}
                        {(order.shippingAddress as any).postalCode}
                      </p>
                      <p className="text-muted-foreground">
                        {(order.shippingAddress as any).country}
                      </p>
                      {(order.shippingAddress as any).phone && (
                        <p className="text-muted-foreground mt-2">
                          Phone: {(order.shippingAddress as any).phone}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm capitalize">{order.paymentMethod}</p>
                {order.paymentStatus && (
                  <Badge variant="outline" className="mt-2">
                    {order.paymentStatus}
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Delivery Confirmation - Show if delivered with proof */}
            {order.orderStatus === 'delivered' && (order.shippingTracking?.signatureUrl || order.shippingTracking?.photoUrl) && (
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Confirmation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.shippingTracking.driver && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Delivered By</p>
                        <div className="text-sm">
                          <p className="font-medium">
                            {order.shippingTracking.driver.user?.fullName || 'Delivery Agent'}
                          </p>
                          {order.shippingTracking.driver.phone && (
                            <p className="text-muted-foreground">
                              {order.shippingTracking.driver.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Delivery Photo */}
                    {order.shippingTracking.photoUrl && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Delivery Photo</p>
                          <div className="border rounded-lg overflow-hidden">
                            <img
                              src={order.shippingTracking.photoUrl}
                              alt="Delivery proof photo"
                              className="max-w-full h-auto object-cover"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Customer Signature */}
                    {order.shippingTracking.signatureUrl && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Customer Signature</p>
                          <div className="border rounded-lg p-4 bg-muted/50">
                            <img
                              src={order.shippingTracking.signatureUrl}
                              alt="Customer signature"
                              className="max-w-full h-auto"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {order.deliveredAt && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Delivered on {new Date(order.deliveredAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

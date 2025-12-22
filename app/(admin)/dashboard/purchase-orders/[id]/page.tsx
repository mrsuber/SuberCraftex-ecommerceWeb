import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Package, Mail } from "lucide-react";
import { StatusUpdate } from "@/components/purchase-orders/StatusUpdate";
import { PaymentStatusUpdate } from "@/components/purchase-orders/PaymentStatusUpdate";
import { RequestPaymentConfirmation } from "@/components/purchase-orders/RequestPaymentConfirmation";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PurchaseOrderDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getSession();

  if (!user || user.role !== 'admin') {
    redirect("/login");
  }

  const purchaseOrder = await db.purchaseOrder.findUnique({
    where: { id },
    include: {
      supplier: true,
      items: {
        include: {
          product: true,
        },
      },
      createdBy: {
        select: {
          fullName: true,
          email: true,
        },
      },
      goodsReceipts: {
        orderBy: {
          receivedDate: 'desc',
        },
      },
    },
  });

  if (!purchaseOrder) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'secondary',
      sent: 'default',
      confirmed: 'default',
      shipped: 'default',
      partial_received: 'default',
      received: 'default',
      completed: 'default',
      cancelled: 'destructive',
    };
    return colors[status] || 'default';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'secondary',
      paid: 'default',
      failed: 'destructive',
      refunded: 'secondary',
    };
    return colors[status] || 'default';
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/purchase-orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Purchase Order Details</h1>
          <p className="text-gray-600 mt-1">
            {purchaseOrder.poNumber}
          </p>
        </div>
        <div className="flex gap-2">
          {purchaseOrder.status !== 'received' && purchaseOrder.status !== 'completed' && purchaseOrder.status !== 'cancelled' && (
            <Button asChild>
              <Link href={`/dashboard/purchase-orders/${id}/receive`}>
                <Package className="h-4 w-4 mr-2" />
                Receive Goods
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Status Management */}
      <Card>
        <CardHeader>
          <CardTitle>Status Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Order Status</div>
                <StatusUpdate purchaseOrderId={id} currentStatus={purchaseOrder.status} />
              </div>
              <div className="flex-1 text-sm text-gray-600">
                <p>💡 <strong>Tip:</strong> Change status to "Sent" or "Confirmed" to enable receiving goods.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Payment Status</div>
                <div className="flex items-center gap-2">
                  <PaymentStatusUpdate purchaseOrderId={id} currentPaymentStatus={purchaseOrder.paymentStatus} />
                  <RequestPaymentConfirmation
                    purchaseOrderId={id}
                    paymentStatus={purchaseOrder.paymentStatus}
                    supplierEmail={purchaseOrder.supplier.email}
                  />
                </div>
              </div>
              <div className="flex-1 text-sm text-gray-600">
                <p>💡 <strong>Tip:</strong> Update manually to "Paid" when payment is complete, or send a confirmation link to the supplier.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={getStatusColor(purchaseOrder.status) as any}>
              {formatStatus(purchaseOrder.status)}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={getPaymentStatusColor(purchaseOrder.paymentStatus) as any}>
              {formatStatus(purchaseOrder.paymentStatus)}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Number(purchaseOrder.totalAmount).toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Goods Receipts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchaseOrder.goodsReceipts.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Order Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Supplier Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm font-medium text-gray-600">Supplier Name</div>
              <div className="text-base">{purchaseOrder.supplier.name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Email</div>
              <div className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                {purchaseOrder.supplier.email}
              </div>
            </div>
            {purchaseOrder.supplier.phone && (
              <div>
                <div className="text-sm font-medium text-gray-600">Phone</div>
                <div className="text-base">{purchaseOrder.supplier.phone}</div>
              </div>
            )}
            {purchaseOrder.supplier.contactPerson && (
              <div>
                <div className="text-sm font-medium text-gray-600">Contact Person</div>
                <div className="text-base">{purchaseOrder.supplier.contactPerson}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm font-medium text-gray-600">Order Date</div>
              <div className="text-base">
                {new Date(purchaseOrder.orderDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
            {purchaseOrder.expectedDeliveryDate && (
              <div>
                <div className="text-sm font-medium text-gray-600">Expected Delivery</div>
                <div className="text-base">
                  {new Date(purchaseOrder.expectedDeliveryDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-gray-600">Payment Terms</div>
              <div className="text-base">{formatStatus(purchaseOrder.paymentTerms)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Created By</div>
              <div className="text-base">
                {purchaseOrder.createdBy.fullName || purchaseOrder.createdBy.email}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">SKU</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Ordered</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Received</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Unit Price</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Total</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrder.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3 px-4">{item.product.name}</td>
                    <td className="py-3 px-4 text-gray-600">{item.product.sku}</td>
                    <td className="py-3 px-4 text-right">{item.quantity}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={item.quantityReceived === item.quantity ? 'text-green-600 font-medium' : ''}>
                        {item.quantityReceived}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">${Number(item.unitPrice).toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-medium">
                      ${Number(item.lineTotal).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${Number(purchaseOrder.subtotal).toFixed(2)}</span>
                </div>
                {Number(purchaseOrder.taxAmount) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span>${Number(purchaseOrder.taxAmount).toFixed(2)}</span>
                  </div>
                )}
                {Number(purchaseOrder.shippingCost) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>${Number(purchaseOrder.shippingCost).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-blue-600">${Number(purchaseOrder.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {purchaseOrder.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{purchaseOrder.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Goods Receipts */}
      {purchaseOrder.goodsReceipts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Goods Receipts History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {purchaseOrder.goodsReceipts.map((receipt) => (
                <div key={receipt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{receipt.receiptNumber}</div>
                    <div className="text-sm text-gray-600">
                      Received: {new Date(receipt.receivedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  {receipt.discrepancyNotes && (
                    <Badge variant="secondary">Has Notes</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

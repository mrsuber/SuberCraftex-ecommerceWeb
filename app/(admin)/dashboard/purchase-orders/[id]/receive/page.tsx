import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { ReceiveGoodsForm } from "@/components/purchase-orders/ReceiveGoodsForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic';

interface ReceiveGoodsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReceiveGoodsPage({ params }: ReceiveGoodsPageProps) {
  const user = await getSession();

  if (!user || user.role !== 'admin') {
    redirect("/login");
  }

  const { id } = await params;

  const purchaseOrder = await db.purchaseOrder.findUnique({
    where: { id },
    include: {
      supplier: true,
      items: {
        include: {
          product: true,
        },
      },
      goodsReceipts: {
        orderBy: { receivedDate: 'desc' },
        include: {
          receivedBy: {
            select: {
              fullName: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!purchaseOrder) {
    notFound();
  }

  // Check if PO can receive goods
  if (purchaseOrder.status === 'draft' || purchaseOrder.status === 'cancelled') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">
              Cannot receive goods for purchase orders in {purchaseOrder.status} status.
            </p>
            <Button asChild>
              <Link href={`/dashboard/purchase-orders/${id}`}>
                Back to Purchase Order
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href={`/dashboard/purchase-orders/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Purchase Order
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold">Receive Goods</h1>
              <p className="text-gray-600 mt-1">
                PO #{purchaseOrder.poNumber} from {purchaseOrder.supplier.name}
              </p>
            </div>
            <Badge className="capitalize">
              {purchaseOrder.status.replace(/_/g, " ")}
            </Badge>
          </div>
        </div>

        {/* PO Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Purchase Order Summary</CardTitle>
            <CardDescription>
              Ordered on {new Date(purchaseOrder.orderDate).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Supplier</span>
                <span className="font-medium">{purchaseOrder.supplier.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Items</span>
                <span className="font-medium">
                  {purchaseOrder.items.reduce((sum, item) => sum + item.quantity, 0)} units
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-medium">${purchaseOrder.totalAmount.toString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Previous Receipts */}
        {purchaseOrder.goodsReceipts.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Previous Receipts</CardTitle>
              <CardDescription>
                {purchaseOrder.goodsReceipts.length} receipt(s) recorded
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {purchaseOrder.goodsReceipts.map((receipt) => (
                  <div key={receipt.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{receipt.receiptNumber}</p>
                      <p className="text-gray-600 text-xs">
                        Received by {receipt.receivedBy.fullName} on{" "}
                        {new Date(receipt.receivedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {(receipt.items as any[]).reduce((sum: number, item: any) => sum + item.quantityReceived, 0)} items
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Receive Goods Form */}
        <ReceiveGoodsForm purchaseOrder={purchaseOrder} />
      </div>
    </div>
  );
}

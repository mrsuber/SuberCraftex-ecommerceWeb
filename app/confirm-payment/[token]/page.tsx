import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { ConfirmPaymentButton } from "@/components/payment-confirmation/ConfirmPaymentButton";

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function PaymentConfirmationPage({ params }: PageProps) {
  const { token } = await params;

  const confirmation = await db.paymentConfirmation.findUnique({
    where: { token },
    include: {
      purchaseOrder: {
        include: {
          supplier: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!confirmation) {
    notFound();
  }

  const isExpired = new Date() > confirmation.expiresAt;
  const isConfirmed = confirmation.isConfirmed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Payment Confirmation
          </h1>
          <p className="text-lg text-gray-600">
            Purchase Order {confirmation.purchaseOrder.poNumber}
          </p>
        </div>

        {/* Status Messages */}
        {isConfirmed && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-green-700">
                <CheckCircle className="h-6 w-6" />
                <div>
                  <p className="font-semibold text-lg">Payment Already Confirmed</p>
                  <p className="text-sm text-green-600">
                    This payment was confirmed on{" "}
                    {confirmation.confirmedAt &&
                      new Date(confirmation.confirmedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isExpired && !isConfirmed && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-700">
                <XCircle className="h-6 w-6" />
                <div>
                  <p className="font-semibold text-lg">Confirmation Link Expired</p>
                  <p className="text-sm text-red-600">
                    This confirmation link expired on{" "}
                    {confirmation.expiresAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    . Please contact the company for a new link.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!isExpired && !isConfirmed && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-blue-700">
                <Clock className="h-6 w-6" />
                <div>
                  <p className="font-semibold text-lg">Action Required</p>
                  <p className="text-sm text-blue-600">
                    Please confirm that you have received the payment for this purchase order.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Purchase Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Purchase Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-600">PO Number</div>
                <div className="text-base font-semibold">{confirmation.purchaseOrder.poNumber}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Total Amount</div>
                <div className="text-base font-semibold text-blue-600">
                  ${Number(confirmation.purchaseOrder.totalAmount).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Order Date</div>
                <div className="text-base">
                  {new Date(confirmation.purchaseOrder.orderDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Payment Status</div>
                <div>
                  <Badge variant={confirmation.purchaseOrder.paymentStatus === "paid" ? "default" : "secondary"}>
                    {confirmation.purchaseOrder.paymentStatus.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {confirmation.purchaseOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{item.product.name}</div>
                    <div className="text-sm text-gray-600">
                      Quantity: {item.quantity} × ${Number(item.unitPrice).toFixed(2)}
                    </div>
                  </div>
                  <div className="font-semibold">${Number(item.lineTotal).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Button */}
        {!isExpired && !isConfirmed && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-700 mb-6">
                  By clicking the button below, you confirm that you have received the payment of{" "}
                  <strong className="text-blue-600">
                    ${Number(confirmation.purchaseOrder.totalAmount).toFixed(2)}
                  </strong>{" "}
                  for Purchase Order <strong>{confirmation.purchaseOrder.poNumber}</strong>.
                </p>
                <ConfirmPaymentButton token={token} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>
            If you have any questions or did not receive this payment, please contact{" "}
            <a
              href={`mailto:${process.env.SMTP_FROM_EMAIL}`}
              className="text-blue-600 hover:underline"
            >
              {process.env.SMTP_FROM_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

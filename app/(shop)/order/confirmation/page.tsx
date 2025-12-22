import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Package, Mail } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Order Confirmation - SuberCraftex",
  description: "Your order has been confirmed",
};

export default function OrderConfirmationPage() {
  // In a real app, get order details from URL params or API
  const orderNumber = "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <>
      <Header />
      <main className="min-h-screen py-12">
        <div className="container max-w-2xl">
          <Card>
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-primary/10">
                  <CheckCircle2 className="h-16 w-16 text-primary" />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <h1 className="text-4xl font-bold">Order Confirmed!</h1>
                <p className="text-lg text-muted-foreground">
                  Thank you for your purchase
                </p>
              </div>

              {/* Order Number */}
              <div className="p-6 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Order Number</div>
                <div className="text-2xl font-bold">{orderNumber}</div>
              </div>

              {/* Info */}
              <div className="space-y-4 text-left max-w-md mx-auto">
                <div className="flex gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <div className="font-semibold">Confirmation Email Sent</div>
                    <div className="text-muted-foreground">
                      We&apos;ve sent a confirmation email with your order details.
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Package className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <div className="font-semibold">Track Your Order</div>
                    <div className="text-muted-foreground">
                      You can track your order status in your account dashboard.
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button size="lg" asChild>
                  <Link href="/account/orders">View Order</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/catalog">Continue Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}

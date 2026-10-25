"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { ArrowLeft, Smartphone, Banknote, Package, CheckCircle2 } from "lucide-react";
import { useShippingRates } from "@/hooks/use-shipping-rates";
import Image from "next/image";
import type { ShippingAddress } from "@/lib/validations/checkout";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface OrderReviewProps {
  shippingData: ShippingAddress;
  shippingMethod: "in_store" | "standard" | "express" | "overnight";
  paymentMethod: "mobile_payment" | "cash";
  onBack: () => void;
}

const shippingLabels = {
  in_store: "Shop Pickup",
  standard: "Standard Delivery",
  express: "Express Delivery",
  overnight: "Next Day Delivery",
};

export function OrderReview({
  shippingData,
  shippingMethod,
  paymentMethod,
  onBack,
}: OrderReviewProps) {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.getTotal());
  const clearCart = useCartStore((state) => state.clearCart);
  const [isProcessing, setIsProcessing] = useState(false);

  const rates = useShippingRates();

  // For display only: the server prices the order itself from the catalogue
  const subtotal = total;
  const shipping = shippingMethod === "in_store" ? 0 : rates?.[shippingMethod] ?? 0;
  const grandTotal = subtotal + shipping;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      // Prepare order data
      const orderData = {
        items: items.map((item) => ({
          productId: item.product.id,
          variantId: item.variant_id,
          quantity: item.quantity,
        })),
        shippingAddress: shippingData,
        billingAddress: shippingData, // Using same as shipping
        shippingMethod,
        paymentMethod,
      };

      // Create order via API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.error || "Failed to create order");
      }

      const result = await response.json();
      console.log("Order created:", result);

      // Clear cart and show success
      clearCart();
      toast.success("Order placed successfully!", {
        description: `Order #${result.order.orderNumber} has been created.`,
      });

      // Redirect to order confirmation with order ID
      router.push(`/order/confirmation?orderId=${result.order.id}`);
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error("Failed to place order", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>Review your items</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                {item.product.featured_image ? (
                  <Image
                    src={item.product.featured_image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl">
                    📦
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium">{item.product.name}</div>
                <div className="text-sm text-muted-foreground">
                  Qty: {item.quantity}
                </div>
              </div>
              <div className="font-semibold">
                {formatPrice(item.product.price * item.quantity)}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 text-sm">
            <div className="font-semibold">{shippingData.fullName}</div>
            <div>{shippingData.addressLine1}</div>
            {shippingData.addressLine2 && <div>{shippingData.addressLine2}</div>}
            <div>
              {shippingData.city}, {shippingData.state} {shippingData.postalCode}
            </div>
            <div>{shippingData.country}</div>
            <div className="pt-2 text-muted-foreground">
              {shippingData.email} • {shippingData.phone}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping & Payment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Shipping Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-medium">{shippingLabels[shippingMethod]}</div>
            <div className="text-sm text-muted-foreground">
              {shipping === 0 ? "Free" : formatPrice(shipping)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {paymentMethod === "mobile_payment" ? (
                <Smartphone className="h-5 w-5" />
              ) : (
                <Banknote className="h-5 w-5" />
              )}
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-medium">
              {paymentMethod === "mobile_payment" ? "Mobile Money" : "Cash"}
            </div>
            <div className="text-sm text-muted-foreground">
              {paymentMethod === "mobile_payment"
                ? "Approve the payment request on your phone"
                : shippingMethod === "in_store"
                  ? "Pay when you pick up"
                  : "Pay when you receive"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">
              {shipping === 0 ? "Free" : formatPrice(shipping)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(grandTotal)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        <Button
          size="lg"
          className="group"
          onClick={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>Processing...</>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Place Order
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

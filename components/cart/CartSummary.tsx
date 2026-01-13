"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { ArrowRight, Tag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function CartSummary() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.getTotal());
  const [couponCode, setCouponCode] = useState("");

  const subtotal = total;
  const shipping = subtotal > 25000 ? 0 : 5000; // Free shipping over 25,000 FCFA
  const tax = subtotal * 0.08; // 8% tax
  const discount = 0; // TODO: Apply coupon logic
  const grandTotal = subtotal + shipping + tax - discount;

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between text-base">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-base">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-success">Free</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        {subtotal > 0 && subtotal < 25000 && (
          <p className="text-xs text-muted-foreground">
            Add {formatPrice(25000 - subtotal)} more for free shipping!
          </p>
        )}

        {/* Tax */}
        <div className="flex justify-between text-base">
          <span className="text-muted-foreground">Tax (8%)</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>

        {/* Coupon */}
        {discount > 0 && (
          <div className="flex justify-between text-base text-success">
            <span>Discount</span>
            <span className="font-medium">-{formatPrice(discount)}</span>
          </div>
        )}

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(grandTotal)}</span>
        </div>

        {/* Coupon Code */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Apply</Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <Button
          size="lg"
          className="w-full group"
          disabled={items.length === 0}
          asChild
        >
          <Link href="/checkout">
            Proceed to Checkout
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="w-full" asChild>
          <Link href="/catalog">Continue Shopping</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

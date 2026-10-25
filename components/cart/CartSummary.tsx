"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CartSummary() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.getTotal());
  const subtotal = total;

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

        {/* Delivery is chosen at checkout: shop pickup is free */}
        <div className="flex justify-between text-base">
          <span className="text-muted-foreground">Delivery</span>
          <span className="text-sm text-muted-foreground">Chosen at checkout</span>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-lg font-bold">
          <span>Total before delivery</span>
          <span>{formatPrice(subtotal)}</span>
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

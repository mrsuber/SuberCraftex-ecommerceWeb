"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MobileMoneyPay } from "@/components/payments/MobileMoneyPay";
import { formatCurrency } from "@/lib/currency";

interface OrderInfo {
  id: string;
  orderNumber: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  paymentDueAt: string | null;
  customerPhone: string | null;
  items: { name: string; quantity: number; total: number }[];
}

export function PayOrderClient() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("orderId") ?? "";
  const token = params.get("token") ?? undefined;
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const qs = token ? `?token=${encodeURIComponent(token)}` : "";
    fetch(`/api/orders/${orderId}/payment-info${qs}`)
      .then(async (r) => (r.ok ? r.json() : Promise.reject((await r.json()).error)))
      .then(setOrder)
      .catch((e) => setError(typeof e === "string" ? e : "Order not found"));
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [orderId, token]);

  const confirmationUrl = `/order/confirmation?orderId=${orderId}${token ? `&token=${encodeURIComponent(token)}` : ""}`;

  if (error) {
    return (
      <Card>
        <CardContent className="py-10 text-center space-y-4">
          <p>{error}</p>
          <Button asChild variant="outline"><Link href="/catalog">Back to the shop</Link></Button>
        </CardContent>
      </Card>
    );
  }
  if (!order) return <p className="text-center text-muted-foreground">Loading your order…</p>;

  if (order.paymentStatus === "paid") {
    router.replace(confirmationUrl);
    return null;
  }

  const secondsLeft = order.paymentDueAt ? Math.max(0, Math.floor((new Date(order.paymentDueAt).getTime() - now) / 1000)) : null;

  if (order.orderStatus === "cancelled" || secondsLeft === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center space-y-4">
          <p className="font-medium">The time to pay for order {order.orderNumber} has passed.</p>
          <p className="text-sm text-muted-foreground">Its items were put back on sale. You can place the order again.</p>
          <Button asChild><Link href="/cart">Back to cart</Link></Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay for order {order.orderNumber}</CardTitle>
        <CardDescription>
          {formatCurrency(order.totalAmount)} by MTN Mobile Money or Orange Money.
          {secondsLeft !== null && (
            <> Your items are held for {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")} more.</>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ul className="text-sm space-y-1">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between">
              <span>{item.quantity} × {item.name}</span>
              <span>{formatCurrency(item.total)}</span>
            </li>
          ))}
        </ul>
        <MobileMoneyPay
          purpose="order"
          id={order.id}
          token={token}
          amount={order.totalAmount}
          defaultPhone={order.customerPhone ?? ""}
          onPaid={() => setTimeout(() => router.push(confirmationUrl), 1500)}
        />
      </CardContent>
    </Card>
  );
}

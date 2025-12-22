import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const statusColors = {
  pending: "secondary",
  paid: "default",
  processing: "default",
  shipped: "default",
  delivered: "default",
  cancelled: "destructive",
  refunded: "destructive",
} as const;

export async function RecentOrders() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No orders yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/dashboard/orders/${order.id}`}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="space-y-1">
            <p className="text-sm font-medium">{order.orderNumber}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{formatPrice(Number(order.totalAmount))}</p>
              <Badge variant={statusColors[order.orderStatus as keyof typeof statusColors]} className="text-xs">
                {order.orderStatus}
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

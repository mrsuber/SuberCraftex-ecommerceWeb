"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, Eye, Truck, X, Search, Clock, MapPin } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

interface OrdersTableProps {
  orders: Order[];
}

const statusColors = {
  pending: "secondary",
  paid: "default",
  processing: "default",
  shipped: "default",
  out_for_delivery: "default",
  delivered: "default",
  cancelled: "destructive",
  refunded: "destructive",
} as const;

export function OrdersTable({ orders }: OrdersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredOrders = orders.filter(
    (order) =>
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.guest_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewOrder = (orderId: string) => {
    console.log("Viewing order:", orderId);
    router.push(`/account/orders/${orderId}`);
  };

  const handleUpdateStatus = (orderId: string) => {
    console.log("Updating status for order:", orderId);
    router.push(`/account/orders/${orderId}`);
  };

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No orders found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Shipping</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono font-medium">
                    {order.order_number}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {order.shipping_address?.full_name || order.guest_email || 'N/A'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.guest_email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {(order as any).order_items?.length || 0} items
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(order.total_amount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.payment_status === "paid"
                          ? "default"
                          : order.payment_status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {order.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.shipping_method === 'in_store' ? (
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1 text-xs">
                          <MapPin className="h-3 w-3" />
                          <span>Pickup</span>
                        </div>
                        {order.pickup_deadline && order.status === 'pending' && (
                          <div className={`flex items-center gap-1 text-[10px] ${
                            new Date(order.pickup_deadline) < new Date()
                              ? 'text-red-600 font-medium'
                              : new Date(order.pickup_deadline).getTime() - Date.now() < 2 * 60 * 60 * 1000
                              ? 'text-amber-600 font-medium'
                              : 'text-muted-foreground'
                          }`}>
                            <Clock className="h-2.5 w-2.5" />
                            {new Date(order.pickup_deadline) < new Date()
                              ? 'Expired'
                              : `Due ${new Date(order.pickup_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                            }
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs capitalize text-muted-foreground">
                        {order.shipping_method?.replace('_', ' ') || 'Standard'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={statusColors[order.status]}
                      className="text-xs capitalize"
                    >
                      {order.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleViewOrder(order.id)}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(order.id)}
                          className="cursor-pointer"
                        >
                          <Truck className="mr-2 h-4 w-4" />
                          Update Status
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive cursor-pointer"
                          onClick={() => {
                            console.log("Cancel order:", order.id);
                            alert("Cancel order functionality coming soon");
                          }}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Results Count */}
      {searchQuery && (
        <p className="text-sm text-muted-foreground">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
      )}
    </div>
  );
}

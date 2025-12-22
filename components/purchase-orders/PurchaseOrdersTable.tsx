"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { MoreHorizontal, Eye, Package, Search, FileText } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface PurchaseOrder {
  id: string;
  poNumber: string;
  orderDate: Date;
  expectedDeliveryDate: Date | null;
  status: string;
  paymentStatus: string;
  totalAmount: any;
  supplier: {
    name: string;
  };
  items: Array<{
    product: {
      name: string;
    };
    quantity: number;
    quantityReceived: number;
  }>;
  _count: {
    goodsReceipts: number;
  };
}

interface PurchaseOrdersTableProps {
  purchaseOrders: PurchaseOrder[];
}

const statusColors: Record<string, "default" | "secondary" | "destructive"> = {
  draft: "secondary",
  sent: "default",
  confirmed: "default",
  shipped: "default",
  partial_received: "default",
  received: "default",
  completed: "default",
  cancelled: "destructive",
};

export function PurchaseOrdersTable({ purchaseOrders }: PurchaseOrdersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredPOs = purchaseOrders.filter(
    (po) =>
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewPO = (poId: string) => {
    router.push(`/dashboard/purchase-orders/${poId}`);
  };

  const handleReceiveGoods = (poId: string) => {
    router.push(`/dashboard/purchase-orders/${poId}/receive`);
  };

  if (purchaseOrders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">No purchase orders found.</p>
          <Button asChild>
            <Link href="/dashboard/purchase-orders/new">Create Your First Purchase Order</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search purchase orders..."
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
                <TableHead>PO Number</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Expected Delivery</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPOs.map((po) => {
                const totalItems = po.items.reduce((sum, item) => sum + item.quantity, 0);
                const receivedItems = po.items.reduce((sum, item) => sum + item.quantityReceived, 0);

                return (
                  <TableRow key={po.id}>
                    <TableCell className="font-mono font-medium">
                      {po.poNumber}
                    </TableCell>
                    <TableCell>{po.supplier.name}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(po.orderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm">
                      {po.expectedDeliveryDate
                        ? new Date(po.expectedDeliveryDate).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {receivedItems}/{totalItems} received
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(Number(po.totalAmount))}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          po.paymentStatus === "paid"
                            ? "default"
                            : po.paymentStatus === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {po.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusColors[po.status] || "default"}
                        className="text-xs capitalize"
                      >
                        {po.status.replace(/_/g, " ")}
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
                            onClick={() => handleViewPO(po.id)}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {po.status !== "cancelled" && po.status !== "completed" && (
                            <DropdownMenuItem
                              onClick={() => handleReceiveGoods(po.id)}
                              className="cursor-pointer"
                            >
                              <Package className="mr-2 h-4 w-4" />
                              Receive Goods
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Results Count */}
      {searchQuery && (
        <p className="text-sm text-gray-600">
          Showing {filteredPOs.length} of {purchaseOrders.length} purchase orders
        </p>
      )}
    </div>
  );
}

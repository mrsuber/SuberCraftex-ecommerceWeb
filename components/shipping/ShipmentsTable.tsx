"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";

interface Shipment {
  id: string;
  orderId: string;
  orderNumber: string;
  driverName: string | null;
  driverPhone: string | null;
  status: string;
  currentLocation: string | null;
  estimatedDeliveryTime: string | null;
  createdAt: string;
}

interface ShipmentsTableProps {
  shipments: Shipment[];
}

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  assigned: "secondary",
  picked_up: "outline",
  in_transit: "default",
  out_for_delivery: "default",
  delivered: "outline",
  failed: "destructive",
};

const STATUS_LABELS: Record<string, string> = {
  assigned: "Assigned",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  failed: "Failed",
};

export function ShipmentsTable({ shipments }: ShipmentsTableProps) {
  const [search, setSearch] = useState("");

  const filteredShipments = shipments.filter(
    (shipment) =>
      shipment.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      shipment.driverName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search shipments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Est. Delivery</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No shipments found
                </TableCell>
              </TableRow>
            ) : (
              filteredShipments.map((shipment) => (
                <TableRow key={shipment.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{shipment.orderNumber}</TableCell>
                  <TableCell>
                    {shipment.driverName ? (
                      <div>
                        <div className="font-medium">{shipment.driverName}</div>
                        <div className="text-xs text-muted-foreground">
                          {shipment.driverPhone}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANTS[shipment.status] || "secondary"}>
                      {STATUS_LABELS[shipment.status] || shipment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {shipment.currentLocation || (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {shipment.estimatedDeliveryTime ? (
                      new Date(shipment.estimatedDeliveryTime).toLocaleDateString()
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(shipment.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

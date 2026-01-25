"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Eye, Camera, PenTool } from "lucide-react";

interface Shipment {
  id: string;
  orderId: string;
  orderNumber: string;
  driverName: string | null;
  driverPhone: string | null;
  status: string;
  currentLocation: string | null;
  estimatedDeliveryTime: string | null;
  actualDeliveryTime: string | null;
  signatureUrl: string | null;
  photoUrl: string | null;
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
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

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
              <TableHead className="w-[60px]">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No shipments found
                </TableCell>
              </TableRow>
            ) : (
              filteredShipments.map((shipment) => (
                <TableRow
                  key={shipment.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedShipment(shipment)}
                >
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
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedShipment(shipment);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Shipment Details Dialog */}
      <Dialog open={!!selectedShipment} onOpenChange={(open) => !open && setSelectedShipment(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Shipment Details - {selectedShipment?.orderNumber}
            </DialogTitle>
          </DialogHeader>

          {selectedShipment && (
            <div className="space-y-6">
              {/* Status and Driver Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge variant={STATUS_VARIANTS[selectedShipment.status] || "secondary"}>
                    {STATUS_LABELS[selectedShipment.status] || selectedShipment.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Driver</p>
                  {selectedShipment.driverName ? (
                    <div>
                      <p className="font-medium">{selectedShipment.driverName}</p>
                      <p className="text-sm text-muted-foreground">{selectedShipment.driverPhone}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Unassigned</p>
                  )}
                </div>
              </div>

              {/* Delivery Times */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Created</p>
                  <p>{new Date(selectedShipment.createdAt).toLocaleString()}</p>
                </div>
                {selectedShipment.actualDeliveryTime && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Delivered At</p>
                    <p>{new Date(selectedShipment.actualDeliveryTime).toLocaleString()}</p>
                  </div>
                )}
              </div>

              {/* Delivery Proof Section */}
              {selectedShipment.status === "delivered" && (selectedShipment.photoUrl || selectedShipment.signatureUrl) && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-lg">Delivery Proof</h3>

                  {/* Delivery Photo */}
                  {selectedShipment.photoUrl && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Camera className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Delivery Photo</p>
                      </div>
                      <div className="border rounded-lg overflow-hidden">
                        <img
                          src={selectedShipment.photoUrl}
                          alt="Delivery proof photo"
                          className="max-w-full h-auto max-h-[300px] object-contain mx-auto"
                        />
                      </div>
                    </div>
                  )}

                  {/* Customer Signature */}
                  {selectedShipment.signatureUrl && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <PenTool className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Customer Signature</p>
                      </div>
                      <div className="border rounded-lg p-4 bg-muted/50">
                        <img
                          src={selectedShipment.signatureUrl}
                          alt="Customer signature"
                          className="max-w-full h-auto max-h-[200px] object-contain mx-auto"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* No proof available message */}
              {selectedShipment.status === "delivered" && !selectedShipment.photoUrl && !selectedShipment.signatureUrl && (
                <div className="border-t pt-4">
                  <p className="text-muted-foreground text-center py-4">
                    No delivery proof available for this shipment
                  </p>
                </div>
              )}

              {/* View Full Order Link */}
              <div className="border-t pt-4">
                <a
                  href={`/account/orders/${selectedShipment.orderId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  View Full Order Details →
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

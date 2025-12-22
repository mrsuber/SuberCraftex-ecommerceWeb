"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SignaturePad } from "./SignaturePad";
import { toast } from "sonner";
import { Package } from "lucide-react";

interface OrderStatusUpdateProps {
  orderId: string;
  currentStatus: string;
}

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

export function OrderStatusUpdate({ orderId, currentStatus }: OrderStatusUpdateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [notes, setNotes] = useState("");
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    // Show signature pad if status is delivered
    if (value === "delivered") {
      setShowSignaturePad(true);
    } else {
      setShowSignaturePad(false);
      setSignatureDataUrl(null);
    }
  };

  const handleSaveSignature = (dataUrl: string) => {
    setSignatureDataUrl(dataUrl);
    setShowSignaturePad(false);
  };

  const handleUpdateStatus = async () => {
    console.log("Updating order status:", { orderId, selectedStatus, currentStatus });

    if (selectedStatus === "delivered" && !signatureDataUrl) {
      toast.error("Signature is required for delivery confirmation");
      setShowSignaturePad(true);
      return;
    }

    setIsUpdating(true);

    try {
      const requestBody: any = {
        orderStatus: selectedStatus,
      };

      if (signatureDataUrl) {
        requestBody.signatureUrl = signatureDataUrl;
      }

      if (notes) {
        requestBody.notes = notes;
      }

      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.error || "Failed to update order status");
      }

      const result = await response.json();
      console.log("Update successful:", result);

      toast.success("Order status updated successfully");
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating order status:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update order status";
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          console.log("Update Status button clicked");
          setIsOpen(true);
        }}
        className="gap-2"
      >
        <Package className="h-4 w-4" />
        Update Status
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          {showSignaturePad ? (
            <SignaturePad
              onSave={handleSaveSignature}
              onCancel={() => setShowSignaturePad(false)}
            />
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Update Order Status</DialogTitle>
                <DialogDescription>
                  Change the status of this order and add optional notes
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Order Status</Label>
                  <Select value={selectedStatus} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedStatus === "delivered" && signatureDataUrl && (
                  <div className="space-y-2">
                    <Label>Customer Signature</Label>
                    <div className="border rounded-lg p-4 bg-muted/50">
                      <img
                        src={signatureDataUrl}
                        alt="Customer signature"
                        className="max-w-full h-auto"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSignaturePad(true)}
                        className="mt-2"
                      >
                        Retake Signature
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any notes about this status update..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating || selectedStatus === currentStatus}
                >
                  {isUpdating ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

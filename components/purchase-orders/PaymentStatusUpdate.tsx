"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface PaymentStatusUpdateProps {
  purchaseOrderId: string;
  currentPaymentStatus: string;
}

const paymentStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

export function PaymentStatusUpdate({ purchaseOrderId, currentPaymentStatus }: PaymentStatusUpdateProps) {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentStatusChange = async (newPaymentStatus: string) => {
    if (newPaymentStatus === paymentStatus) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/purchase-orders/${purchaseOrderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentStatus: newPaymentStatus,
          paymentDate: newPaymentStatus === 'paid' ? new Date().toISOString() : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update payment status");
      }

      setPaymentStatus(newPaymentStatus);
      router.refresh();
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert(error instanceof Error ? error.message : "Failed to update payment status");
      setPaymentStatus(paymentStatus); // Revert on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={paymentStatus} onValueChange={handlePaymentStatusChange} disabled={isLoading}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {paymentStatusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
    </div>
  );
}

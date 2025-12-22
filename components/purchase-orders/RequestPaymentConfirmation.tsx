"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";

interface RequestPaymentConfirmationProps {
  purchaseOrderId: string;
  paymentStatus: string;
  supplierEmail: string;
}

export function RequestPaymentConfirmation({
  purchaseOrderId,
  paymentStatus,
  supplierEmail,
}: RequestPaymentConfirmationProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestConfirmation = async () => {
    if (!confirm(`Send payment confirmation request to ${supplierEmail}?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/purchase-orders/${purchaseOrderId}/request-payment-confirmation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send confirmation request");
      }

      const data = await response.json();
      alert(
        `Payment confirmation request sent successfully! The link will expire on ${new Date(
          data.expiresAt
        ).toLocaleDateString()}.`
      );
      router.refresh();
    } catch (error) {
      console.error("Error requesting payment confirmation:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to send confirmation request"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show button if payment is already paid
  if (paymentStatus === "paid") {
    return null;
  }

  return (
    <Button
      onClick={handleRequestConfirmation}
      disabled={isLoading}
      variant="outline"
      size="sm"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <Send className="h-4 w-4 mr-2" />
          Request Payment Confirmation
        </>
      )}
    </Button>
  );
}

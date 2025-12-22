"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";

interface ConfirmPaymentButtonProps {
  token: string;
}

export function ConfirmPaymentButton({ token }: ConfirmPaymentButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (
      !confirm(
        "Are you sure you want to confirm that you have received this payment? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/confirm-payment/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to confirm payment");
      }

      alert(
        "Thank you! Payment confirmation has been recorded successfully."
      );
      router.refresh();
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to confirm payment. Please try again or contact support."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleConfirm}
      disabled={isLoading}
      size="lg"
      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Confirming...
        </>
      ) : (
        <>
          <CheckCircle className="h-5 w-5 mr-2" />
          Confirm Payment Received
        </>
      )}
    </Button>
  );
}

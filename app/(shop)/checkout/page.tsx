"use client";

import { useState, useEffect } from "react";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { ShippingMethodForm } from "@/components/checkout/ShippingMethodForm";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import { OrderReview } from "@/components/checkout/OrderReview";
import { useCartStore } from "@/stores/cart-store";
import { useRouter } from "next/navigation";
import type { ShippingAddress, ShippingMethod, PaymentMethod } from "@/lib/validations/checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingData, setShippingData] = useState<ShippingAddress | null>(null);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  const handleShippingSubmit = (data: ShippingAddress) => {
    setShippingData(data);
    setCurrentStep(2);
  };

  const handleShippingMethodSubmit = (data: ShippingMethod) => {
    setShippingMethod(data);
    setCurrentStep(3);
  };

  const handlePaymentSubmit = (data: PaymentMethod) => {
    setPaymentMethod(data);
    setCurrentStep(4);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <main className="min-h-screen py-12 bg-muted/20">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        {/* Progress Steps */}
        <CheckoutProgress currentStep={currentStep} />

        {/* Step Content */}
        <div className="mt-8">
          {currentStep === 1 && (
            <ShippingForm
              defaultValues={shippingData || undefined}
              onSubmit={handleShippingSubmit}
            />
          )}

          {currentStep === 2 && (
            <ShippingMethodForm
              defaultValues={shippingMethod || undefined}
              onSubmit={handleShippingMethodSubmit}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <PaymentForm
              defaultValues={paymentMethod || undefined}
              onSubmit={handlePaymentSubmit}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && shippingData && shippingMethod && paymentMethod && (
            <OrderReview
              shippingData={shippingData}
              shippingMethod={shippingMethod.method}
              paymentMethod={paymentMethod.method}
              onBack={() => setCurrentStep(3)}
            />
          )}
        </div>
      </div>
    </main>
  );
}

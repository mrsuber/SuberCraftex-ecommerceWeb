"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { paymentMethodSchema, type PaymentMethod } from "@/lib/validations/checkout";
import { ArrowLeft, ArrowRight, Smartphone, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const paymentOptions = [
  {
    value: "mobile_payment" as const,
    label: "Mobile Money",
    description: "MTN Mobile Money or Orange Money: approve the payment on your phone",
    icon: Smartphone,
  },
  {
    value: "cash" as const,
    label: "Cash",
    description: "Pay when you receive or pick up your order",
    icon: Banknote,
  },
];

interface PaymentFormProps {
  defaultValues?: PaymentMethod;
  onSubmit: (data: PaymentMethod) => void;
  onBack: () => void;
}

export function PaymentForm({ defaultValues, onSubmit, onBack }: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(
    defaultValues?.method || null
  );

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentMethod>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues,
  });

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    setValue("method", method as any);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Choose how you want to pay for your order</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-3">
            {paymentOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedMethod === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleMethodSelect(option.value)}
                  className={cn(
                    "w-full text-left p-4 rounded-lg border-2 transition-all cursor-pointer shadow-sm",
                    isSelected
                      ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/20"
                      : "border-gray-300 hover:border-primary/50 hover:bg-muted/50 hover:shadow-md"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "p-3 rounded-lg",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {errors.method && (
            <p className="text-sm text-destructive">{errors.method.message}</p>
          )}

          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {selectedMethod === "mobile_payment"
                ? "After you place the order, you will receive a payment request on your phone. Approve it with your Mobile Money PIN to complete the order."
                : "SuberCraftex charges no payment fees. Prices already include any taxes."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <Button type="button" variant="outline" size="lg" onClick={onBack}>
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </Button>
            <Button type="submit" size="lg" className="group">
              Review Order
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

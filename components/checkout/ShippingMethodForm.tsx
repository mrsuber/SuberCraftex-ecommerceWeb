"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { shippingMethodSchema, type ShippingMethod } from "@/lib/validations/checkout";
import { ArrowLeft, ArrowRight, Package, Truck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const shippingOptions = [
  {
    value: "standard" as const,
    label: "Standard Shipping",
    description: "5-7 business days",
    price: 0,
    icon: Package,
  },
  {
    value: "express" as const,
    label: "Express Shipping",
    description: "2-3 business days",
    price: 10,
    icon: Truck,
  },
  {
    value: "overnight" as const,
    label: "Overnight Shipping",
    description: "1 business day",
    price: 25,
    icon: Zap,
  },
];

interface ShippingMethodFormProps {
  defaultValues?: ShippingMethod;
  onSubmit: (data: ShippingMethod) => void;
  onBack: () => void;
}

export function ShippingMethodForm({ defaultValues, onSubmit, onBack }: ShippingMethodFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(
    defaultValues?.method || null
  );

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ShippingMethod>({
    resolver: zodResolver(shippingMethodSchema),
    defaultValues,
  });

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    setValue("method", method as any);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Method</CardTitle>
        <CardDescription>Choose how you want your order delivered</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-3">
            {shippingOptions.map((option) => {
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
                  <div className="flex items-center justify-between">
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
                    <div className="text-lg font-bold">
                      {option.price === 0 ? "Free" : `$${option.price}`}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {errors.method && (
            <p className="text-sm text-destructive">{errors.method.message}</p>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <Button type="button" variant="outline" size="lg" onClick={onBack}>
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </Button>
            <Button type="submit" size="lg" className="group">
              Continue to Payment
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

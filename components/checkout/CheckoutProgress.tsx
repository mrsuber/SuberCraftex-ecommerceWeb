"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { number: 1, title: "Shipping", description: "Enter your address" },
  { number: 2, title: "Delivery", description: "Choose shipping method" },
  { number: 3, title: "Payment", description: "Select payment option" },
  { number: 4, title: "Review", description: "Confirm your order" },
];

interface CheckoutProgressProps {
  currentStep: number;
}

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  return (
    <div className="relative">
      {/* Progress Line */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted hidden md:block">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4">
        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <div key={step.number} className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={cn(
                  "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isCurrent
                    ? "bg-background border-primary text-primary"
                    : "bg-background border-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="font-semibold">{step.number}</span>
                )}
              </div>

              {/* Text */}
              <div className="mt-2 text-center">
                <div
                  className={cn(
                    "text-sm font-semibold transition-colors",
                    isCurrent ? "text-primary" : "text-foreground"
                  )}
                >
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground hidden md:block">
                  {step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

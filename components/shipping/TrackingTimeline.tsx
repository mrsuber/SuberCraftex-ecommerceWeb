"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock, Package, Truck } from "lucide-react";

interface TrackingTimelineProps {
  status: string;
  createdAt: string;
  actualDeliveryTime?: string | null;
}

const TIMELINE_STEPS = [
  { key: "assigned", label: "Assigned", icon: Package },
  { key: "picked_up", label: "Picked Up", icon: Truck },
  { key: "in_transit", label: "In Transit", icon: Truck },
  { key: "out_for_delivery", label: "Out for Delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

export function TrackingTimeline({
  status,
  createdAt,
  actualDeliveryTime,
}: TrackingTimelineProps) {
  const currentStepIndex = TIMELINE_STEPS.findIndex((step) => step.key === status);

  return (
    <div className="space-y-4">
      {TIMELINE_STEPS.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;
        const isUpcoming = index > currentStepIndex;

        return (
          <div key={step.key} className="flex gap-4">
            {/* Icon */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isCurrent
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5" />
                ) : isCurrent ? (
                  <Icon className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </div>
              {index < TIMELINE_STEPS.length - 1 && (
                <div
                  className={`w-0.5 h-12 ${
                    isCompleted ? "bg-green-500" : "bg-muted"
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <div className="flex items-center gap-2">
                <h4 className={`font-medium ${isCurrent ? "text-primary" : ""}`}>
                  {step.label}
                </h4>
                {isCurrent && <Badge>Current</Badge>}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {step.key === "assigned" && new Date(createdAt).toLocaleString()}
                {step.key === "delivered" &&
                  actualDeliveryTime &&
                  new Date(actualDeliveryTime).toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

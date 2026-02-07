"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock } from "lucide-react";

interface RepairStatusTrackerProps {
  currentStatus: string;
}

const STATUS_STEPS = [
  { key: "pending", label: "Request Submitted" },
  { key: "received", label: "Device Received" },
  { key: "diagnosing", label: "Diagnosing" },
  { key: "diagnosed", label: "Diagnosis Complete" },
  { key: "quote_sent", label: "Quote Sent" },
  { key: "quote_approved", label: "Quote Approved" },
  { key: "in_repair", label: "Repair in Progress" },
  { key: "testing", label: "Testing" },
  { key: "ready_for_pickup", label: "Ready for Pickup" },
  { key: "completed", label: "Completed" },
];

const CANCELLED_STATUSES = ["quote_rejected", "cancelled"];

export function RepairStatusTracker({ currentStatus }: RepairStatusTrackerProps) {
  if (CANCELLED_STATUSES.includes(currentStatus)) {
    return (
      <div className="text-center p-8">
        <Badge variant="destructive" className="text-lg px-4 py-2">
          {currentStatus === "quote_rejected" ? "Quote Rejected" : "Cancelled"}
        </Badge>
        <p className="text-muted-foreground mt-4">
          {currentStatus === "quote_rejected"
            ? "The repair quote was not approved. Please contact us if you have any questions."
            : "This repair request has been cancelled."}
        </p>
      </div>
    );
  }

  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === currentStatus);
  const normalizedIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="relative">
      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {STATUS_STEPS.map((step, index) => {
          const isCompleted = index < normalizedIndex;
          const isCurrent = index === normalizedIndex;

          return (
            <div
              key={step.key}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                isCurrent ? "bg-primary/10 border border-primary" : ""
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : isCurrent ? (
                <Clock className="h-6 w-6 text-primary animate-pulse" />
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground" />
              )}
              <span
                className={`text-sm ${
                  isCurrent
                    ? "font-medium text-primary"
                    : isCompleted
                    ? "text-muted-foreground"
                    : "text-muted-foreground/50"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {STATUS_STEPS.map((step, index) => {
            const isCompleted = index < normalizedIndex;
            const isCurrent = index === normalizedIndex;

            return (
              <div key={step.key} className="flex flex-col items-center flex-1">
                <div className="relative flex items-center justify-center w-full">
                  {/* Connector Line */}
                  {index > 0 && (
                    <div
                      className={`absolute left-0 right-1/2 h-1 -translate-y-1/2 top-1/2 ${
                        isCompleted || isCurrent ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                  {index < STATUS_STEPS.length - 1 && (
                    <div
                      className={`absolute left-1/2 right-0 h-1 -translate-y-1/2 top-1/2 ${
                        isCompleted ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}

                  {/* Status Circle */}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? "bg-green-500"
                        : isCurrent
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : isCurrent ? (
                      <Clock className="h-4 w-4 text-primary-foreground animate-pulse" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Label */}
                <span
                  className={`mt-2 text-xs text-center ${
                    isCurrent
                      ? "font-medium text-primary"
                      : isCompleted
                      ? "text-muted-foreground"
                      : "text-muted-foreground/50"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RepairWorkflow } from "@/components/dashboard/RepairWorkflow";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Star,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Work on Repair | Technician Dashboard",
  description: "Work on a repair request",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TechnicianRepairDetailPage({ params }: PageProps) {
  const user = await requireAuth();

  if (!user || user.role !== "technician") {
    redirect("/dashboard");
  }

  const technician = await db.technician.findUnique({
    where: { userId: user.id },
  });

  if (!technician) {
    redirect("/dashboard");
  }

  const { id } = await params;

  const repair = await db.repairRequest.findUnique({
    where: { id },
    include: {
      customer: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
        },
      },
      technician: {
        select: {
          id: true,
          fullName: true,
          employeeId: true,
        },
      },
      apprentice: {
        select: {
          id: true,
          fullName: true,
          apprenticeNumber: true,
        },
      },
      progress: {
        orderBy: { createdAt: "desc" },
      },
      payments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!repair) {
    notFound();
  }

  // Verify technician is assigned to this repair
  if (repair.technicianId !== technician.id) {
    redirect("/dashboard/technician/repairs");
  }

  // Get apprentices for this technician (for supervised work)
  const apprentices = await db.apprentice.findMany({
    where: {
      mentorId: user.id,
      isActive: true,
      serviceTrack: "device_repair",
      canWorkOnRealJobs: true,
    },
    select: {
      id: true,
      fullName: true,
      apprenticeNumber: true,
    },
  });

  // Calculate payment summary
  const totalPaid = repair.payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const finalCost = repair.finalCost ? Number(repair.finalCost) : null;
  const totalQuote = repair.totalQuote ? Number(repair.totalQuote) : null;

  const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "secondary",
    received: "outline",
    diagnosing: "outline",
    diagnosed: "outline",
    quote_sent: "outline",
    quote_approved: "default",
    quote_rejected: "destructive",
    waiting_parts: "secondary",
    in_repair: "default",
    testing: "default",
    ready_for_pickup: "default",
    completed: "default",
    cancelled: "destructive",
  };

  const priorityColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    low: "secondary",
    normal: "outline",
    high: "default",
    urgent: "destructive",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/technician/repairs">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{repair.ticketNumber}</h1>
              <Badge variant={statusColors[repair.status] || "outline"}>
                {repair.status.replace(/_/g, " ")}
              </Badge>
              <Badge variant={priorityColors[repair.priority] || "outline"}>
                {repair.priority}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {repair.brand} {repair.model} - {repair.deviceType.replace(/_/g, " ")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Workflow Actions */}
          <RepairWorkflow
            repairId={repair.id}
            currentStatus={repair.status}
            technicians={[{ ...technician, specializations: technician.specializations }]}
            apprentices={apprentices}
            assignedTechnicianId={repair.technicianId}
            totalQuote={totalQuote}
          />

          {/* Device Information */}
          <Card>
            <CardHeader>
              <CardTitle>Device Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Type</div>
                  <div className="font-medium capitalize">
                    {repair.deviceType.replace(/_/g, " ")}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Brand</div>
                  <div className="font-medium">{repair.brand}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Model</div>
                  <div className="font-medium">{repair.model}</div>
                </div>
                {repair.serialNumber && (
                  <div>
                    <div className="text-sm text-muted-foreground">Serial Number</div>
                    <div className="font-medium">{repair.serialNumber}</div>
                  </div>
                )}
                {repair.deviceColor && (
                  <div>
                    <div className="text-sm text-muted-foreground">Color</div>
                    <div className="font-medium">{repair.deviceColor}</div>
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Issue Description</div>
                <div className="p-3 bg-muted rounded-lg text-sm">
                  {repair.issueDescription}
                </div>
              </div>

              {repair.customerNotes && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Customer Notes</div>
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    {repair.customerNotes}
                  </div>
                </div>
              )}

              {repair.diagnosis && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Diagnosis</div>
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    {repair.diagnosis}
                  </div>
                </div>
              )}

              {repair.deviceConditionOnIntake && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Condition on Intake
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    {repair.deviceConditionOnIntake}
                  </div>
                </div>
              )}

              {repair.repairNotes && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Repair Notes</div>
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    {repair.repairNotes}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Progress Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {repair.progress.length === 0 ? (
                <p className="text-muted-foreground text-sm">No progress updates yet</p>
              ) : (
                <div className="space-y-4">
                  {repair.progress.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`relative pl-6 pb-4 ${
                        index !== repair.progress.length - 1 ? "border-l border-muted" : ""
                      }`}
                    >
                      <div className="absolute left-0 -translate-x-1/2 w-3 h-3 rounded-full bg-primary" />
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge variant="outline" className="mb-1">
                            {entry.status.replace(/_/g, " ")}
                          </Badge>
                          <p className="text-sm">{entry.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            by {entry.updatedByName}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(entry.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Card */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="font-medium">
                {repair.customer.fullName || "N/A"}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{repair.customer.email}</span>
              </div>
              {repair.customer.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{repair.customer.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Apprentice */}
          {repair.apprentice && (
            <Card>
              <CardHeader>
                <CardTitle>Supervised Apprentice</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-medium">{repair.apprentice.fullName}</div>
                <div className="text-sm text-muted-foreground">
                  {repair.apprentice.apprenticeNumber}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {totalQuote !== null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quote</span>
                  <span className="font-medium">${totalQuote.toFixed(2)}</span>
                </div>
              )}
              {finalCost !== null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Final Cost</span>
                  <span className="font-medium">${finalCost.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Paid</span>
                <span className="font-medium">${totalPaid.toFixed(2)}</span>
              </div>
              {finalCost !== null && (
                <div className="flex justify-between border-t pt-2">
                  <span className="text-muted-foreground">Balance</span>
                  <span className={`font-medium ${finalCost - totalPaid > 0 ? "text-destructive" : "text-green-600"}`}>
                    ${(finalCost - totalPaid).toFixed(2)}
                  </span>
                </div>
              )}
              <Badge variant={repair.paymentStatus === "paid" ? "default" : "secondary"}>
                {repair.paymentStatus}
              </Badge>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{new Date(repair.createdAt).toLocaleDateString()}</span>
              </div>
              {repair.receivedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Received</span>
                  <span>{new Date(repair.receivedAt).toLocaleDateString()}</span>
                </div>
              )}
              {repair.diagnosedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Diagnosed</span>
                  <span>{new Date(repair.diagnosedAt).toLocaleDateString()}</span>
                </div>
              )}
              {repair.repairCompletedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span>{new Date(repair.repairCompletedAt).toLocaleDateString()}</span>
                </div>
              )}
              {repair.warrantyExpiresAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Warranty Until</span>
                  <span>{new Date(repair.warrantyExpiresAt).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rating */}
          {repair.rating && (
            <Card>
              <CardHeader>
                <CardTitle>Customer Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < repair.rating!
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                {repair.reviewComment && (
                  <p className="text-sm text-muted-foreground">
                    &ldquo;{repair.reviewComment}&rdquo;
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

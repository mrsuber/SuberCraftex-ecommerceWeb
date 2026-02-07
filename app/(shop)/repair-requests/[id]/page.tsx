import { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RepairStatusTracker } from "@/components/repair/RepairStatusTracker";
import {
  ArrowLeft,
  Phone,
  Laptop,
  Tablet,
  Tv,
  Gamepad2,
  Speaker,
  Monitor,
  HelpCircle,
  AlertCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Repair Request Details | SuberCraftex",
  description: "Track the status of your device repair.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

const DEVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  phone: Phone,
  tablet: Tablet,
  laptop: Laptop,
  desktop: Monitor,
  tv: Tv,
  gaming_console: Gamepad2,
  audio_equipment: Speaker,
  other: HelpCircle,
};

export default async function CustomerRepairDetailPage({ params }: PageProps) {
  const user = await getSession();

  if (!user) {
    redirect("/login?redirect=/repair-requests");
  }

  const { id } = await params;

  const repair = await db.repairRequest.findUnique({
    where: { id },
    include: {
      technician: {
        select: {
          fullName: true,
        },
      },
      progress: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      payments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!repair) {
    notFound();
  }

  // Verify customer owns this repair
  if (repair.customerId !== user.id) {
    redirect("/repair-requests");
  }

  const DeviceIcon = DEVICE_ICONS[repair.deviceType] || HelpCircle;
  const totalPaid = repair.payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalQuote = repair.totalQuote ? Number(repair.totalQuote) : null;
  const needsQuoteApproval = repair.status === "quote_sent";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/repair-requests">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to My Requests
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
          <DeviceIcon className="h-8 w-8" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">{repair.ticketNumber}</h1>
            <Badge variant="outline">
              {repair.status.replace(/_/g, " ")}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {repair.brand} {repair.model} - {repair.deviceType.replace(/_/g, " ")}
          </p>
        </div>
      </div>

      {/* Quote Approval Alert */}
      {needsQuoteApproval && (
        <Card className="mb-6 border-primary bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <AlertCircle className="h-6 w-6 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold">Quote Ready for Approval</h3>
                <p className="text-sm text-muted-foreground">
                  We've diagnosed your device. Please review and approve the quote to proceed with the repair.
                </p>
              </div>
              <Link href={`/repair-requests/${repair.id}/approve-quote`}>
                <Button>Review Quote</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Status Tracker */}
          <Card>
            <CardHeader>
              <CardTitle>Repair Status</CardTitle>
            </CardHeader>
            <CardContent>
              <RepairStatusTracker currentStatus={repair.status} />
            </CardContent>
          </Card>

          {/* Device Details */}
          <Card>
            <CardHeader>
              <CardTitle>Device Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Device Type</div>
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
                  <div className="text-sm text-muted-foreground mb-1">Additional Notes</div>
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    {repair.customerNotes}
                  </div>
                </div>
              )}

              {repair.diagnosis && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Technician Diagnosis</div>
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    {repair.diagnosis}
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
          {repair.progress.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Progress Updates</CardTitle>
              </CardHeader>
              <CardContent>
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
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(entry.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quote/Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {repair.diagnosticFee && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Diagnostic Fee</span>
                  <span className="font-medium">${Number(repair.diagnosticFee).toFixed(2)}</span>
                </div>
              )}
              {repair.estimatedPartsCost && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Parts</span>
                  <span className="font-medium">${Number(repair.estimatedPartsCost).toFixed(2)}</span>
                </div>
              )}
              {repair.estimatedLaborCost && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Labor</span>
                  <span className="font-medium">${Number(repair.estimatedLaborCost).toFixed(2)}</span>
                </div>
              )}
              {totalQuote !== null && (
                <>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Total Quote</span>
                    <span className="font-bold">${totalQuote.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paid</span>
                    <span className="font-medium text-green-600">${totalPaid.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Balance</span>
                    <span className={`font-medium ${totalQuote - totalPaid > 0 ? "text-destructive" : "text-green-600"}`}>
                      ${(totalQuote - totalPaid).toFixed(2)}
                    </span>
                  </div>
                </>
              )}
              <Badge variant={repair.paymentStatus === "paid" ? "default" : "secondary"}>
                {repair.paymentStatus}
              </Badge>
            </CardContent>
          </Card>

          {/* Technician Info */}
          {repair.technician && (
            <Card>
              <CardHeader>
                <CardTitle>Your Technician</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-medium">{repair.technician.fullName}</div>
              </CardContent>
            </Card>
          )}

          {/* Important Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submitted</span>
                <span>{new Date(repair.createdAt).toLocaleDateString()}</span>
              </div>
              {repair.receivedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Device Received</span>
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
                  <span className="text-muted-foreground">Repair Completed</span>
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

          {/* Collection Info */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Method</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="mb-2">
                {repair.collectionMethod === "pickup_requested" ? "Pickup Requested" : "Drop-off"}
              </Badge>
              {repair.collectionMethod === "pickup_requested" && repair.pickupAddress && (
                <p className="text-sm text-muted-foreground">{repair.pickupAddress}</p>
              )}
              {repair.scheduledDropoff && (
                <p className="text-sm text-muted-foreground">
                  Scheduled: {new Date(repair.scheduledDropoff).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

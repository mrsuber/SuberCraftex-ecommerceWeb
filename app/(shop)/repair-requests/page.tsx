import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Laptop,
  Tablet,
  Tv,
  Gamepad2,
  Speaker,
  Monitor,
  HelpCircle,
  Plus,
  Wrench,
} from "lucide-react";

export const metadata: Metadata = {
  title: "My Repair Requests | SuberCraftex",
  description: "Track and manage your device repair requests.",
};

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

const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  received: "outline",
  diagnosing: "outline",
  diagnosed: "outline",
  quote_sent: "default",
  quote_approved: "default",
  quote_rejected: "destructive",
  waiting_parts: "secondary",
  in_repair: "default",
  testing: "default",
  ready_for_pickup: "default",
  completed: "default",
  cancelled: "destructive",
};

export default async function CustomerRepairRequestsPage() {
  const user = await getSession();

  if (!user) {
    redirect("/login?redirect=/repair-requests");
  }

  const repairs = await db.repairRequest.findMany({
    where: { customerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Repair Requests</h1>
          <p className="text-muted-foreground">
            Track the status of your device repairs
          </p>
        </div>
        <Link href="/services/repair/request">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Request
          </Button>
        </Link>
      </div>

      {repairs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Wrench className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Repair Requests</h3>
            <p className="text-muted-foreground mb-4">
              You haven't submitted any repair requests yet.
            </p>
            <Link href="/services/repair/request">
              <Button>Submit a Repair Request</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {repairs.map((repair) => {
            const DeviceIcon = DEVICE_ICONS[repair.deviceType] || HelpCircle;
            const needsAction = repair.status === "quote_sent";

            return (
              <Link key={repair.id} href={`/repair-requests/${repair.id}`}>
                <Card className={`hover:shadow-md transition-shadow ${needsAction ? "border-primary" : ""}`}>
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                        <DeviceIcon className="h-6 w-6" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{repair.ticketNumber}</span>
                          <Badge variant={STATUS_COLORS[repair.status] || "outline"}>
                            {repair.status.replace(/_/g, " ")}
                          </Badge>
                          {needsAction && (
                            <Badge variant="destructive">Action Required</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {repair.brand} {repair.model} - {repair.deviceType.replace(/_/g, " ")}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Submitted {new Date(repair.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {repair.totalQuote && (
                          <div className="font-semibold">
                            {formatCurrency(Number(repair.totalQuote))}
                          </div>
                        )}
                        <Button variant="ghost" size="sm">
                          View Details →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  CheckCircle,
  Clock,
  Star,
  ArrowRight,
  Phone,
  Laptop,
  Tablet,
  Tv,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Technician Dashboard | SuberCraftex",
  description: "Technician overview and assigned repairs",
};

export default async function TechnicianDashboardPage() {
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

  // Get all repairs assigned to this technician
  const repairs = await db.repairRequest.findMany({
    where: { technicianId: technician.id },
    include: {
      customer: {
        select: {
          fullName: true,
          email: true,
        },
      },
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  // Calculate stats
  const completedRepairs = repairs.filter((r) => r.status === "completed");
  const activeRepairs = repairs.filter(
    (r) => !["completed", "cancelled"].includes(r.status)
  );
  const urgentRepairs = activeRepairs.filter((r) => r.priority === "urgent");

  const ratings = completedRepairs
    .filter((r) => r.rating !== null)
    .map((r) => r.rating as number);
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : null;

  // Today's repairs
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayRepairs = repairs.filter(
    (r) => new Date(r.createdAt) >= today && !["completed", "cancelled"].includes(r.status)
  );

  // Repairs by device type
  const repairsByType = repairs.reduce((acc, r) => {
    acc[r.deviceType] = (acc[r.deviceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deviceIcons: Record<string, React.ReactNode> = {
    phone: <Phone className="h-4 w-4" />,
    laptop: <Laptop className="h-4 w-4" />,
    tablet: <Tablet className="h-4 w-4" />,
    tv: <Tv className="h-4 w-4" />,
  };

  const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "secondary",
    received: "outline",
    diagnosing: "outline",
    diagnosed: "outline",
    quote_sent: "outline",
    quote_approved: "default",
    in_repair: "default",
    ready_for_pickup: "default",
    completed: "default",
    cancelled: "destructive",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {technician.fullName}</h1>
        <p className="text-muted-foreground">
          Here&apos;s your repair overview for today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Repairs</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRepairs.length}</div>
            {urgentRepairs.length > 0 && (
              <p className="text-xs text-destructive">
                {urgentRepairs.length} urgent
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedRepairs.length}</div>
            <p className="text-xs text-muted-foreground">Total repairs done</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayRepairs.length}</div>
            <p className="text-xs text-muted-foreground">New repairs today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageRating ? averageRating.toFixed(1) : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              From {ratings.length} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Repairs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Repairs</CardTitle>
            <Link href="/dashboard/technician/repairs">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {activeRepairs.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No active repairs assigned
              </p>
            ) : (
              <div className="space-y-3">
                {activeRepairs.slice(0, 5).map((repair) => (
                  <Link
                    key={repair.id}
                    href={`/dashboard/technician/repairs/${repair.id}`}
                    className="block p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {repair.ticketNumber}
                          </span>
                          {repair.priority === "urgent" && (
                            <Badge variant="destructive" className="text-xs">
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {repair.brand} {repair.model}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {repair.customer.fullName || repair.customer.email}
                        </div>
                      </div>
                      <Badge
                        variant={statusColors[repair.status] || "outline"}
                        className="text-xs"
                      >
                        {repair.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Repairs by Device Type */}
        <Card>
          <CardHeader>
            <CardTitle>By Device Type</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(repairsByType).length === 0 ? (
              <p className="text-muted-foreground text-sm">No repairs yet</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(repairsByType)
                  .sort(([, a], [, b]) => b - a)
                  .map(([type, count]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted"
                    >
                      <div className="flex items-center gap-2">
                        {deviceIcons[type] || <Wrench className="h-4 w-4" />}
                        <span className="capitalize">
                          {type.replace(/_/g, " ")}
                        </span>
                      </div>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Specializations */}
      <Card>
        <CardHeader>
          <CardTitle>Your Specializations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {technician.specializations.map((spec) => (
              <Badge key={spec} variant="outline">
                {spec.replace(/_/g, " ")}
              </Badge>
            ))}
          </div>
          {technician.certifications.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {technician.certifications.map((cert, i) => (
                  <Badge key={i} variant="secondary">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

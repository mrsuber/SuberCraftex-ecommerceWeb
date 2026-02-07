import { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TechnicianForm } from "@/components/dashboard/TechnicianForm";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Star,
  Wrench,
  Award,
  Edit,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Technician Details | Dashboard",
  description: "View technician details",
};

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}

export default async function TechnicianDetailPage({ params, searchParams }: PageProps) {
  const user = await requireAuth();

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  const { id } = await params;
  const { edit } = await searchParams;
  const isEditMode = edit === "true";

  const technician = await db.technician.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
          avatarUrl: true,
          createdAt: true,
        },
      },
      repairRequests: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          customer: {
            select: {
              fullName: true,
            },
          },
        },
      },
    },
  });

  if (!technician) {
    notFound();
  }

  // Calculate stats
  const allRepairs = await db.repairRequest.findMany({
    where: { technicianId: id },
    select: {
      id: true,
      status: true,
      rating: true,
      deviceType: true,
    },
  });

  const completedRepairs = allRepairs.filter((r) => r.status === "completed");
  const ratings = completedRepairs
    .filter((r) => r.rating !== null)
    .map((r) => r.rating as number);

  const stats = {
    totalRepairs: allRepairs.length,
    completedRepairs: completedRepairs.length,
    pendingRepairs: allRepairs.filter(
      (r) => !["completed", "cancelled"].includes(r.status)
    ).length,
    averageRating: ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : null,
    repairsByDeviceType: allRepairs.reduce((acc, r) => {
      acc[r.deviceType] = (acc[r.deviceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  if (isEditMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/technicians/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Technician</h1>
            <p className="text-muted-foreground">
              Update technician information
            </p>
          </div>
        </div>

        <TechnicianForm
          technician={{
            id: technician.id,
            userId: technician.userId,
            fullName: technician.fullName,
            phone: technician.phone,
            photoUrl: technician.photoUrl,
            specializations: technician.specializations,
            certifications: technician.certifications,
            isActive: technician.isActive,
            hireDate: technician.hireDate.toISOString(),
          }}
        />
      </div>
    );
  }

  const specializationLabels: Record<string, string> = {
    phones: "Phones",
    tablets: "Tablets",
    laptops: "Laptops",
    desktops: "Desktops",
    tvs: "TVs",
    gaming_consoles: "Gaming Consoles",
    audio_equipment: "Audio Equipment",
    other: "Other",
  };

  const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "secondary",
    received: "outline",
    diagnosing: "outline",
    diagnosed: "outline",
    quote_sent: "outline",
    quote_approved: "default",
    in_repair: "default",
    testing: "default",
    ready_for_pickup: "default",
    completed: "default",
    cancelled: "destructive",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/technicians">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{technician.fullName}</h1>
            <p className="text-muted-foreground">
              {technician.employeeId || "Technician"}
            </p>
          </div>
        </div>
        <Link href={`/dashboard/technicians/${id}?edit=true`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={technician.photoUrl || technician.user.avatarUrl || undefined}
                />
                <AvatarFallback>
                  {technician.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Badge variant={technician.isActive ? "default" : "secondary"}>
                  {technician.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{technician.user.email}</span>
              </div>
              {technician.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{technician.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Hired {new Date(technician.hireDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Specializations</h4>
              <div className="flex flex-wrap gap-1">
                {technician.specializations.map((spec) => (
                  <Badge key={spec} variant="outline" className="text-xs">
                    {specializationLabels[spec] || spec}
                  </Badge>
                ))}
              </div>
            </div>

            {technician.certifications.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Certifications</h4>
                <div className="space-y-1">
                  {technician.certifications.map((cert, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{stats.totalRepairs}</div>
                <div className="text-sm text-muted-foreground">Total Repairs</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{stats.completedRepairs}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{stats.pendingRepairs}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                  {stats.averageRating ? (
                    <>
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      {stats.averageRating.toFixed(1)}
                    </>
                  ) : (
                    "N/A"
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">By Device Type</h4>
              <div className="space-y-2">
                {Object.entries(stats.repairsByDeviceType).map(([type, count]) => (
                  <div key={type} className="flex justify-between text-sm">
                    <span className="capitalize">{type.replace(/_/g, " ")}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Repairs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Repairs</CardTitle>
          </CardHeader>
          <CardContent>
            {technician.repairRequests.length === 0 ? (
              <p className="text-muted-foreground text-sm">No repairs yet</p>
            ) : (
              <div className="space-y-3">
                {technician.repairRequests.map((repair) => (
                  <Link
                    key={repair.id}
                    href={`/dashboard/repair-requests/${repair.id}`}
                    className="block p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-sm">
                          {repair.ticketNumber}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {repair.brand} {repair.model}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {repair.customer.fullName}
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
            {technician.repairRequests.length > 0 && (
              <Link href={`/dashboard/repair-requests?technicianId=${id}`}>
                <Button variant="link" className="mt-2 p-0">
                  View all repairs
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

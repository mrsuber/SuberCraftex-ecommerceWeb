import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Edit,
  ClipboardList,
  Award,
  Calendar,
  Phone,
  Mail,
  User,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Apprentice Details | Dashboard",
  description: "View apprentice profile and progress",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  active: "default",
  on_hold: "outline",
  completed: "default",
  terminated: "destructive",
};

const departmentLabels: Record<string, string> = {
  tailoring: "Tailoring",
  sales: "Sales",
  delivery: "Delivery",
  operations: "Operations",
};

export default async function ApprenticeDetailsPage({ params }: PageProps) {
  const user = await requireAuth();
  const { id } = await params;

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  const apprentice = await db.apprentice.findUnique({
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
      assignments: {
        orderBy: { assignedDate: "desc" },
        take: 5,
      },
      certificates: {
        orderBy: { issuedDate: "desc" },
      },
    },
  });

  if (!apprentice) {
    notFound();
  }

  // Get mentor info
  const mentor = await db.user.findUnique({
    where: { id: apprentice.mentorId },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      avatarUrl: true,
    },
  });

  // Calculate stats
  const stats = {
    totalAssignments: apprentice.assignments.length,
    completedAssignments: apprentice.assignments.filter((a) => a.status === "completed").length,
    pendingAssignments: apprentice.assignments.filter((a) =>
      ["pending", "in_progress"].includes(a.status)
    ).length,
    submittedAssignments: apprentice.assignments.filter((a) => a.status === "submitted").length,
    averageRating: (() => {
      const rated = apprentice.assignments.filter((a) => a.rating !== null);
      if (rated.length === 0) return null;
      return (rated.reduce((acc, a) => acc + (a.rating || 0), 0) / rated.length).toFixed(1);
    })(),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/apprentices">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{apprentice.fullName}</h1>
            <p className="text-muted-foreground">{apprentice.apprenticeNumber}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/apprentices/${id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Link href={`/dashboard/apprentices/${id}/assignments`}>
            <Button variant="outline">
              <ClipboardList className="mr-2 h-4 w-4" />
              Assignments
            </Button>
          </Link>
          <Link href={`/dashboard/apprentices/${id}/certificates`}>
            <Button>
              <Award className="mr-2 h-4 w-4" />
              Certificates
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={apprentice.photoUrl || apprentice.user.avatarUrl || undefined} />
                <AvatarFallback className="text-2xl">
                  {apprentice.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{apprentice.fullName}</h2>
              <Badge variant={statusColors[apprentice.status]} className="mt-2">
                {apprentice.status.replace("_", " ").charAt(0).toUpperCase() +
                  apprentice.status.replace("_", " ").slice(1)}
              </Badge>

              <div className="w-full mt-6 space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{apprentice.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{apprentice.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Started {new Date(apprentice.startDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats and Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalAssignments}</p>
                    <p className="text-xs text-muted-foreground">Total Assignments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.completedAssignments}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.pendingAssignments}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="text-2xl font-bold">{stats.averageRating || "-"}</p>
                    <p className="text-xs text-muted-foreground">Avg. Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Program Details */}
          <Card>
            <CardHeader>
              <CardTitle>Program Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">
                  {departmentLabels[apprentice.department] || apprentice.department}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mentor</p>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={mentor?.avatarUrl || undefined} />
                    <AvatarFallback>
                      {mentor?.fullName?.[0] || "M"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{mentor?.fullName || mentor?.email}</span>
                  <Badge variant="outline" className="text-xs">
                    {mentor?.role}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">
                  {new Date(apprentice.startDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expected End Date</p>
                <p className="font-medium">
                  {apprentice.expectedEndDate
                    ? new Date(apprentice.expectedEndDate).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          {(apprentice.emergencyContactName || apprentice.emergencyContactPhone) && (
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{apprentice.emergencyContactName || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{apprentice.emergencyContactPhone || "-"}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Assignments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Assignments</CardTitle>
              <Link href={`/dashboard/apprentices/${id}/assignments`}>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {apprentice.assignments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No assignments yet
                </p>
              ) : (
                <div className="space-y-3">
                  {apprentice.assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(assignment.assignedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={statusColors[assignment.status] || "outline"}>
                          {assignment.status.replace("_", " ")}
                        </Badge>
                        {assignment.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{assignment.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Certificates */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Certificates</CardTitle>
              <Link href={`/dashboard/apprentices/${id}/certificates`}>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {apprentice.certificates.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No certificates issued yet
                </p>
              ) : (
                <div className="space-y-3">
                  {apprentice.certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="font-medium">{cert.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {cert.certificateNumber}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(cert.issuedDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

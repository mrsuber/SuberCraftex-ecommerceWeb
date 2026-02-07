import { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  User,
  ClipboardList,
  Award,
  Wrench,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "My Apprentices | Technician Dashboard",
  description: "View apprentices under your supervision",
};

export default async function TechnicianApprenticesPage() {
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

  // Get apprentices mentored by this technician in device_repair track
  const apprentices = await db.apprentice.findMany({
    where: {
      mentorId: user.id,
      serviceTrack: "device_repair",
      isActive: true,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      assignments: {
        select: {
          id: true,
          status: true,
          rating: true,
        },
      },
      certificates: {
        select: {
          id: true,
        },
      },
      repairRequests: {
        where: {
          isSupervisedWork: true,
        },
        select: {
          id: true,
          status: true,
          rating: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "secondary",
    active: "default",
    on_hold: "outline",
    completed: "default",
    terminated: "destructive",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Apprentices</h1>
        <p className="text-muted-foreground">
          Device repair apprentices under your supervision
        </p>
      </div>

      {apprentices.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No apprentices assigned to you yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apprentices.map((apprentice) => {
            const completedAssignments = apprentice.assignments.filter(
              (a) => a.status === "completed"
            ).length;
            const completedRepairs = apprentice.repairRequests.filter(
              (r) => r.status === "completed"
            ).length;
            const ratings = apprentice.assignments
              .filter((a) => a.rating !== null)
              .map((a) => a.rating as number);
            const avgRating =
              ratings.length > 0
                ? ratings.reduce((a, b) => a + b, 0) / ratings.length
                : null;

            return (
              <Card key={apprentice.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={
                          apprentice.photoUrl ||
                          apprentice.user.avatarUrl ||
                          undefined
                        }
                      />
                      <AvatarFallback>
                        {apprentice.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {apprentice.fullName}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {apprentice.apprenticeNumber}
                      </p>
                    </div>
                    <Badge variant={statusColors[apprentice.status] || "outline"}>
                      {apprentice.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {completedAssignments}/{apprentice.assignments.length}{" "}
                        tasks
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span>{apprentice.certificates.length} certs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {completedRepairs}/{apprentice.repairRequests.length}{" "}
                        repairs
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {avgRating ? `${avgRating.toFixed(1)} avg` : "No rating"}
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {apprentice.canWorkOnRealJobs ? (
                      <Badge variant="default" className="text-xs">
                        Ready for Real Work
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        In Training
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {apprentice.realJobsCompleted} real jobs
                    </Badge>
                  </div>

                  {/* Action */}
                  <Link href={`/dashboard/apprentices/${apprentice.id}`}>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

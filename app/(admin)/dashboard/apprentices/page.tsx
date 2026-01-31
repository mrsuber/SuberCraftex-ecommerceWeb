import { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { ApprenticesTable } from "@/components/dashboard/ApprenticesTable";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Apprentices | Dashboard",
  description: "Manage apprentices and trainees",
};

export default async function ApprenticesPage() {
  const user = await requireAuth();

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  const apprentices = await db.apprentice.findMany({
    where: { isActive: true },
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
        },
      },
      certificates: {
        select: {
          id: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Transform data to include stats
  const apprenticesWithStats = apprentices.map((apprentice) => ({
    ...apprentice,
    startDate: apprentice.startDate.toISOString(),
    expectedEndDate: apprentice.expectedEndDate?.toISOString() || null,
    totalAssignments: apprentice.assignments.length,
    completedAssignments: apprentice.assignments.filter((a) => a.status === "completed").length,
    certificatesCount: apprentice.certificates.length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Apprentices</h1>
          <p className="text-muted-foreground">
            Manage and track apprentice progress
          </p>
        </div>
        <Link href="/dashboard/apprentices/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Apprentice
          </Button>
        </Link>
      </div>

      <ApprenticesTable apprentices={apprenticesWithStats} />
    </div>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { TechniciansTable } from "@/components/dashboard/TechniciansTable";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Technicians | Dashboard",
  description: "Manage device repair technicians",
};

export default async function TechniciansPage() {
  const user = await requireAuth();

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  const technicians = await db.technician.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      repairRequests: {
        select: {
          id: true,
          status: true,
          rating: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Transform data to include stats
  const techniciansWithStats = technicians.map((technician) => {
    const completedRepairs = technician.repairRequests.filter(
      (r) => r.status === "completed"
    );
    const ratings = completedRepairs
      .filter((r) => r.rating !== null)
      .map((r) => r.rating as number);

    return {
      ...technician,
      hireDate: technician.hireDate.toISOString(),
      totalRepairs: technician.repairRequests.length,
      completedRepairs: completedRepairs.length,
      pendingRepairs: technician.repairRequests.filter(
        (r) => !["completed", "cancelled"].includes(r.status)
      ).length,
      averageRating: ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : null,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Technicians</h1>
          <p className="text-muted-foreground">
            Manage device repair technicians
          </p>
        </div>
        <Link href="/dashboard/technicians/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Technician
          </Button>
        </Link>
      </div>

      <TechniciansTable technicians={techniciansWithStats} />
    </div>
  );
}

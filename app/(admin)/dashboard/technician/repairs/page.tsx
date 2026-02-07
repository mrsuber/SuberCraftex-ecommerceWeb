import { Metadata } from "next";
import { requireAuth } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { RepairRequestsTable } from "@/components/dashboard/RepairRequestsTable";

export const metadata: Metadata = {
  title: "My Repairs | Technician Dashboard",
  description: "View your assigned repair requests",
};

export default async function TechnicianRepairsPage() {
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

  const repairs = await db.repairRequest.findMany({
    where: { technicianId: technician.id },
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
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  const repairsForTable = repairs.map((repair) => ({
    ...repair,
    createdAt: repair.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Repairs</h1>
        <p className="text-muted-foreground">
          Manage your assigned repair requests
        </p>
      </div>

      <RepairRequestsTable repairs={repairsForTable} />
    </div>
  );
}

import { Metadata } from "next";
import { requireAuth } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { RepairRequestsTable } from "@/components/dashboard/RepairRequestsTable";

export const metadata: Metadata = {
  title: "Repair Requests | Dashboard",
  description: "Manage device repair requests",
};

interface PageProps {
  searchParams: Promise<{ technicianId?: string }>;
}

export default async function RepairRequestsPage({ searchParams }: PageProps) {
  const user = await requireAuth();

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const technicianId = params.technicianId;

  const where: Record<string, unknown> = {};
  if (technicianId) {
    where.technicianId = technicianId;
  }

  const repairs = await db.repairRequest.findMany({
    where,
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
    orderBy: [
      { priority: "desc" },
      { createdAt: "desc" },
    ],
  });

  const repairsForTable = repairs.map((repair) => ({
    ...repair,
    createdAt: repair.createdAt.toISOString(),
  }));

  // Get technician name if filtering
  let technicianName = null;
  if (technicianId) {
    const technician = await db.technician.findUnique({
      where: { id: technicianId },
      select: { fullName: true },
    });
    technicianName = technician?.fullName;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Repair Requests</h1>
        <p className="text-muted-foreground">
          {technicianName
            ? `Repairs assigned to ${technicianName}`
            : "Manage all device repair requests"}
        </p>
      </div>

      <RepairRequestsTable repairs={repairsForTable} />
    </div>
  );
}

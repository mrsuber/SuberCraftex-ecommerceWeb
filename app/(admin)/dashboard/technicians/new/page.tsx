import { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { TechnicianForm } from "@/components/dashboard/TechnicianForm";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Add Technician | Dashboard",
  description: "Add a new device repair technician",
};

export default async function NewTechnicianPage() {
  const user = await requireAuth();

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  // Get eligible users (customers who can be promoted to technician)
  const users = await db.user.findMany({
    where: {
      role: "customer",
      technician: null, // Doesn't already have a technician profile
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      role: true,
    },
    orderBy: { fullName: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/technicians">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add Technician</h1>
          <p className="text-muted-foreground">
            Create a new technician profile
          </p>
        </div>
      </div>

      <TechnicianForm users={users} />
    </div>
  );
}

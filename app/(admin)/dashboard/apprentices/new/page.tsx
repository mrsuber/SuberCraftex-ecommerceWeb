import { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ApprenticeForm } from "@/components/dashboard/ApprenticeForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Add Apprentice | Dashboard",
  description: "Register a new apprentice",
};

export default async function NewApprenticePage() {
  const user = await requireAuth();

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  // Get users who can be converted to apprentices (customers only)
  const eligibleUsers = await db.user.findMany({
    where: {
      role: "customer",
      apprentice: null, // No existing apprentice profile
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

  // Get potential mentors (admins, tailors, cashiers, drivers)
  const potentialMentors = await db.user.findMany({
    where: {
      role: {
        in: ["admin", "tailor", "cashier", "driver"],
      },
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
    },
    orderBy: { fullName: "asc" },
  });

  // Format mentors with display name
  const mentors = potentialMentors.map((m) => ({
    id: m.id,
    fullName: m.fullName || m.email,
    email: m.email,
    role: m.role,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/apprentices">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add Apprentice</h1>
          <p className="text-muted-foreground">
            Register a new trainee in the program
          </p>
        </div>
      </div>

      <ApprenticeForm users={eligibleUsers} mentors={mentors} />
    </div>
  );
}

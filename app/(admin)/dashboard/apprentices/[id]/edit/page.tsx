import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { ApprenticeForm } from "@/components/dashboard/ApprenticeForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Edit Apprentice | Dashboard",
  description: "Edit apprentice details",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditApprenticePage({ params }: PageProps) {
  const user = await requireAuth();
  const { id } = await params;

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  const apprentice = await db.apprentice.findUnique({
    where: { id },
  });

  if (!apprentice) {
    notFound();
  }

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

  // Format apprentice data for the form
  const formattedApprentice = {
    ...apprentice,
    startDate: apprentice.startDate.toISOString(),
    expectedEndDate: apprentice.expectedEndDate?.toISOString() || null,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/apprentices/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Apprentice</h1>
          <p className="text-muted-foreground">
            Update {apprentice.fullName}&apos;s details
          </p>
        </div>
      </div>

      <ApprenticeForm apprentice={formattedApprentice} mentors={mentors} />
    </div>
  );
}

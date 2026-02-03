import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { AssignmentsTable } from "@/components/dashboard/AssignmentsTable";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Assignments | Dashboard",
  description: "Manage apprentice assignments",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AssignmentsPage({ params }: PageProps) {
  const user = await requireAuth();
  const { id } = await params;

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  const apprentice = await db.apprentice.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      apprenticeNumber: true,
      mentorId: true,
    },
  });

  if (!apprentice) {
    notFound();
  }

  const assignments = await db.apprenticeAssignment.findMany({
    where: { apprenticeId: id },
    orderBy: { assignedDate: "desc" },
  });

  // Check if current user can review (is mentor or admin)
  const canReview = user.role === "admin" || user.id === apprentice.mentorId;

  // Format assignments for the table
  const formattedAssignments = assignments.map((a) => ({
    ...a,
    assignedDate: a.assignedDate.toISOString(),
    dueDate: a.dueDate?.toISOString() || null,
    completedDate: a.completedDate?.toISOString() || null,
    submittedAt: a.submittedAt?.toISOString() || null,
    reviewedAt: a.reviewedAt?.toISOString() || null,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/apprentices/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">
            {apprentice.fullName} ({apprentice.apprenticeNumber})
          </p>
        </div>
      </div>

      <AssignmentsTable
        assignments={formattedAssignments}
        apprenticeId={id}
        canReview={canReview}
      />
    </div>
  );
}

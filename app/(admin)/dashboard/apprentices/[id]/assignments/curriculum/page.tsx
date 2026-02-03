import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { CurriculumBrowser } from "@/components/dashboard/CurriculumBrowser";
import { ArrowLeft, ClipboardList } from "lucide-react";

export const metadata: Metadata = {
  title: "Assign from Curriculum | Dashboard",
  description: "Assign curriculum tasks to apprentice",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CurriculumAssignmentPage({ params }: PageProps) {
  const user = await requireAuth();
  const { id } = await params;

  if (!user || !["admin", "tailor"].includes(user.role)) {
    redirect("/dashboard");
  }

  const apprentice = await db.apprentice.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      apprenticeNumber: true,
      status: true,
      mentorId: true,
      department: true,
    },
  });

  if (!apprentice) {
    notFound();
  }

  // Check if tailor can access (must be mentor of this apprentice)
  if (user.role === "tailor" && apprentice.mentorId !== user.id) {
    redirect("/dashboard");
  }

  // Check if apprentice is in a valid state for assignments
  if (!["active", "pending"].includes(apprentice.status)) {
    redirect(`/dashboard/apprentices/${id}`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/apprentices/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Assign from Curriculum</h1>
            <p className="text-muted-foreground">
              {apprentice.fullName} ({apprentice.apprenticeNumber})
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/apprentices/${id}/assignments`}>
            <Button variant="outline">
              <ClipboardList className="mr-2 h-4 w-4" />
              View All Assignments
            </Button>
          </Link>
          <Link href={`/dashboard/apprentices/${id}/assignments/new`}>
            <Button variant="outline">
              Create Custom Assignment
            </Button>
          </Link>
        </div>
      </div>

      {/* Curriculum Browser */}
      <CurriculumBrowser
        apprenticeId={id}
        apprenticeName={apprentice.fullName}
      />
    </div>
  );
}

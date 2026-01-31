import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { AssignmentForm } from "@/components/dashboard/AssignmentForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Create Assignment | Dashboard",
  description: "Create a new assignment for apprentice",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NewAssignmentPage({ params }: PageProps) {
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
      status: true,
    },
  });

  if (!apprentice) {
    notFound();
  }

  // Check if apprentice is in a valid state for assignments
  if (!["active", "pending"].includes(apprentice.status)) {
    redirect(`/dashboard/apprentices/${id}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/apprentices/${id}/assignments`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Assignment</h1>
          <p className="text-muted-foreground">
            New task for {apprentice.fullName}
          </p>
        </div>
      </div>

      <AssignmentForm apprenticeId={id} />
    </div>
  );
}

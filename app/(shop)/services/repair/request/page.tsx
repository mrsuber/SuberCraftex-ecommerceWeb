import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { RepairRequestForm } from "@/components/repair/RepairRequestForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Submit Repair Request | SuberCraftex",
  description: "Submit a repair request for your device. We'll diagnose the issue and provide you with a quote.",
};

export default async function RepairRequestPage() {
  const user = await getSession();

  if (!user) {
    redirect("/login?redirect=/services/repair/request");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/services/repair">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Repair Services
          </Button>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Submit a Repair Request</h1>
        <p className="text-muted-foreground">
          Tell us about your device and the issue you're experiencing
        </p>
      </div>

      <RepairRequestForm />
    </div>
  );
}

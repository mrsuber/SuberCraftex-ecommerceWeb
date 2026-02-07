import { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { QuoteApproval } from "@/components/repair/QuoteApproval";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Approve Quote | SuberCraftex",
  description: "Review and approve your repair quote.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ApproveQuotePage({ params }: PageProps) {
  const user = await getSession();

  if (!user) {
    redirect("/login?redirect=/repair-requests");
  }

  const { id } = await params;

  const repair = await db.repairRequest.findUnique({
    where: { id },
  });

  if (!repair) {
    notFound();
  }

  // Verify customer owns this repair
  if (repair.customerId !== user.id) {
    redirect("/repair-requests");
  }

  // Check if quote is available for approval
  if (repair.status !== "quote_sent") {
    redirect(`/repair-requests/${id}`);
  }

  const totalQuote = repair.totalQuote ? Number(repair.totalQuote) : 0;
  const estimatedPartsCost = repair.estimatedPartsCost ? Number(repair.estimatedPartsCost) : null;
  const estimatedLaborCost = repair.estimatedLaborCost ? Number(repair.estimatedLaborCost) : null;
  const diagnosticFee = repair.diagnosticFee ? Number(repair.diagnosticFee) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href={`/repair-requests/${id}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Request
          </Button>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Review Your Quote</h1>
        <p className="text-muted-foreground">
          Please review the repair quote and let us know if you'd like to proceed
        </p>
      </div>

      <QuoteApproval
        repairId={repair.id}
        ticketNumber={repair.ticketNumber}
        deviceInfo={`${repair.brand} ${repair.model}`}
        diagnosis={repair.diagnosis}
        estimatedPartsCost={estimatedPartsCost}
        estimatedLaborCost={estimatedLaborCost}
        diagnosticFee={diagnosticFee}
        totalQuote={totalQuote}
        quoteValidUntil={repair.quoteValidUntil}
      />
    </div>
  );
}

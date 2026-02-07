"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface QuoteApprovalProps {
  repairId: string;
  ticketNumber: string;
  deviceInfo: string;
  diagnosis: string | null;
  estimatedPartsCost: number | null;
  estimatedLaborCost: number | null;
  diagnosticFee: number | null;
  totalQuote: number;
  quoteValidUntil: Date | null;
}

export function QuoteApproval({
  repairId,
  ticketNumber,
  deviceInfo,
  diagnosis,
  estimatedPartsCost,
  estimatedLaborCost,
  diagnosticFee,
  totalQuote,
  quoteValidUntil,
}: QuoteApprovalProps) {
  const router = useRouter();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const isExpired = quoteValidUntil ? new Date(quoteValidUntil) < new Date() : false;

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const response = await fetch(`/api/repair-requests/${repairId}/quote/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: true }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to approve quote");
      }

      toast.success("Quote approved! We'll begin the repair shortly.");
      router.push(`/repair-requests/${repairId}`);
      router.refresh();
    } catch (error) {
      console.error("Error approving quote:", error);
      toast.error(error instanceof Error ? error.message : "Failed to approve quote");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      const response = await fetch(`/api/repair-requests/${repairId}/quote/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approved: false,
          reason: rejectionReason || "No reason provided",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to reject quote");
      }

      toast.success("Quote rejected. We'll contact you with alternative options.");
      router.push(`/repair-requests/${repairId}`);
      router.refresh();
    } catch (error) {
      console.error("Error rejecting quote:", error);
      toast.error(error instanceof Error ? error.message : "Failed to reject quote");
    } finally {
      setIsRejecting(false);
      setShowRejectDialog(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Quote Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Repair Quote</CardTitle>
          <CardDescription>
            {ticketNumber} - {deviceInfo}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Diagnosis */}
          {diagnosis && (
            <div>
              <h4 className="font-medium mb-2">Diagnosis</h4>
              <div className="p-4 bg-muted rounded-lg text-sm">
                {diagnosis}
              </div>
            </div>
          )}

          {/* Cost Breakdown */}
          <div>
            <h4 className="font-medium mb-3">Cost Breakdown</h4>
            <div className="space-y-2">
              {diagnosticFee !== null && diagnosticFee > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Diagnostic Fee</span>
                  <span>${diagnosticFee.toFixed(2)}</span>
                </div>
              )}
              {estimatedPartsCost !== null && estimatedPartsCost > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Parts & Components</span>
                  <span>${estimatedPartsCost.toFixed(2)}</span>
                </div>
              )}
              {estimatedLaborCost !== null && estimatedLaborCost > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Labor</span>
                  <span>${estimatedLaborCost.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-t font-bold text-lg">
                <span>Total</span>
                <span>${totalQuote.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Quote Validity */}
          {quoteValidUntil && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${isExpired ? "bg-destructive/10 text-destructive" : "bg-muted"}`}>
              {isExpired ? (
                <>
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">
                    This quote expired on {new Date(quoteValidUntil).toLocaleDateString()}. Please contact us for an updated quote.
                  </span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Quote valid until {new Date(quoteValidUntil).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Terms Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Before You Approve</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>By approving this quote, you agree to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The total cost may vary slightly if additional issues are discovered during repair</li>
            <li>You will be notified of any changes before additional work is performed</li>
            <li>Payment is due upon pickup of your device</li>
            <li>All repairs come with a warranty (see your receipt for details)</li>
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handleApprove}
          disabled={isApproving || isExpired}
          className="flex-1 gap-2"
          size="lg"
        >
          {isApproving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          Approve Quote
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowRejectDialog(true)}
          disabled={isRejecting}
          className="flex-1 gap-2"
          size="lg"
        >
          {isRejecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          Decline Quote
        </Button>
      </div>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline This Quote?</AlertDialogTitle>
            <AlertDialogDescription>
              If you decline, we'll contact you to discuss alternative options. You may still be
              responsible for the diagnostic fee.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="reason">Reason for declining (optional)</Label>
            <Textarea
              id="reason"
              placeholder="Let us know why you're declining..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={isRejecting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRejecting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Decline Quote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

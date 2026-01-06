'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ConfirmationDialog } from '@/components/shared/ConfirmationDialog'
import { Check, X, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface QuoteApprovalActionsProps {
  quoteId: string
  bookingId: string
  onApprove: () => void
  onReject: (reason?: string) => void
  isProcessing?: boolean
}

export function QuoteApprovalActions({
  quoteId,
  bookingId,
  onApprove,
  onReject,
  isProcessing = false,
}: QuoteApprovalActionsProps) {
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const handleApprove = () => {
    setShowApproveDialog(true)
  }

  const handleConfirmApprove = () => {
    setShowApproveDialog(false)
    onApprove()
  }

  const handleReject = () => {
    setShowRejectDialog(true)
  }

  const handleConfirmReject = () => {
    setShowRejectDialog(false)
    onReject(rejectReason || undefined)
    setRejectReason('')
  }

  return (
    <>
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Ready to proceed?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Approving this quote will reserve the materials and your spot in our production
                queue. You'll proceed to pay the down payment to start work.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleApprove}
                disabled={isProcessing}
                className="flex-1"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Approve Quote
                  </>
                )}
              </Button>

              <Button
                onClick={handleReject}
                disabled={isProcessing}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <X className="mr-2 h-5 w-5" />
                Reject Quote
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approve Confirmation Dialog */}
      <ConfirmationDialog
        open={showApproveDialog}
        onOpenChange={setShowApproveDialog}
        title="Approve Quote?"
        description="By approving this quote, materials will be reserved and the price will be locked. You'll proceed to pay the down payment to start work on your order."
        confirmText="Approve & Continue"
        onConfirm={handleConfirmApprove}
      />

      {/* Reject Dialog with Reason */}
      <ConfirmationDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        title="Reject Quote?"
        description={
          <div className="space-y-3">
            <p>Are you sure you want to reject this quote?</p>
            <div className="space-y-2">
              <Label>Reason (Optional)</Label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Let us know why you're rejecting (price too high, timeline too long, etc.)"
                rows={3}
              />
            </div>
          </div>
        }
        confirmText="Reject Quote"
        onConfirm={handleConfirmReject}
        variant="destructive"
      />
    </>
  )
}

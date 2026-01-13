'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'

interface WithdrawalProcessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: any
  onSuccess?: () => void
}

export default function WithdrawalProcessDialog({
  open,
  onOpenChange,
  request,
  onSuccess,
}: WithdrawalProcessDialogProps) {
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState<'approve' | 'reject' | 'complete'>('approve')
  const [formData, setFormData] = useState({
    approvedAmount: request.amount || '0',
    adminNotes: '',
    rejectionReason: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation
      if (action === 'approve' && (!formData.approvedAmount || parseFloat(formData.approvedAmount) <= 0)) {
        toast.error('Please enter a valid approved amount')
        return
      }

      if (action === 'reject' && !formData.rejectionReason) {
        toast.error('Please provide a rejection reason')
        return
      }

      const response = await fetch(`/api/admin/withdrawals/${request.id}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          adminNotes: formData.adminNotes || undefined,
          approvedAmount: action === 'approve' ? parseFloat(formData.approvedAmount) : undefined,
          rejectionReason: action === 'reject' ? formData.rejectionReason : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process withdrawal')
      }

      toast.success(
        action === 'approve'
          ? 'Withdrawal request approved'
          : action === 'reject'
          ? 'Withdrawal request rejected'
          : 'Withdrawal completed'
      )

      onOpenChange(false)

      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error('Process withdrawal error:', error)
      toast.error(error.message || 'Failed to process withdrawal')
    } finally {
      setLoading(false)
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      cash: 'Cash Withdrawal',
      profit: 'Profit Withdrawal',
      product: 'Product Claim',
      equipment_share: 'Equipment Share Exit',
    }
    return labels[type] || type
  }

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle2 className="h-4 w-4 text-green-600" />
    if (status === 'rejected') return <XCircle className="h-4 w-4 text-red-600" />
    if (status === 'approved') return <CheckCircle2 className="h-4 w-4 text-blue-600" />
    return <Clock className="h-4 w-4 text-yellow-600" />
  }

  // Determine available actions based on current status
  const canApprove = request.status === 'pending'
  const canReject = request.status === 'pending' || request.status === 'approved'
  const canComplete = request.status === 'approved' || request.status === 'pending'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Process Withdrawal Request</DialogTitle>
          <DialogDescription>
            Review and process the investor's withdrawal request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Request Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-lg">{request.requestNumber}</p>
                <p className="text-sm text-gray-600">{getTypeLabel(request.type)}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(request.status)}
                <Badge
                  variant={
                    request.status === 'completed'
                      ? 'default'
                      : request.status === 'rejected'
                      ? 'destructive'
                      : request.status === 'approved'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {request.status.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Requested Amount</p>
                <p className="font-semibold text-lg">{formatCurrency(parseFloat(request.amount))}</p>
              </div>

              {request.approvedAmount && (
                <div>
                  <p className="text-gray-500">Approved Amount</p>
                  <p className="font-semibold text-lg text-green-600">
                    {formatCurrency(parseFloat(request.approvedAmount))}
                  </p>
                </div>
              )}

              <div>
                <p className="text-gray-500">Requested On</p>
                <p className="font-medium">{new Date(request.requestedAt).toLocaleString()}</p>
              </div>

              {request.reviewedAt && (
                <div>
                  <p className="text-gray-500">Reviewed On</p>
                  <p className="font-medium">{new Date(request.reviewedAt).toLocaleString()}</p>
                </div>
              )}
            </div>

            {request.requestReason && (
              <div>
                <p className="text-sm text-gray-500">Reason</p>
                <p className="text-sm">{request.requestReason}</p>
              </div>
            )}

            {request.investorNotes && (
              <div>
                <p className="text-sm text-gray-500">Investor Notes</p>
                <p className="text-sm">{request.investorNotes}</p>
              </div>
            )}

            {request.adminNotes && (
              <div>
                <p className="text-sm text-gray-500">Previous Admin Notes</p>
                <p className="text-sm">{request.adminNotes}</p>
              </div>
            )}

            {request.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded p-2">
                <p className="text-sm text-red-800 font-medium">Rejection Reason</p>
                <p className="text-sm text-red-700">{request.rejectionReason}</p>
              </div>
            )}
          </div>

          {/* Action Form */}
          {(canApprove || canReject || canComplete) && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="action">Action</Label>
                <Select value={action} onValueChange={(value: any) => setAction(value)}>
                  <SelectTrigger id="action">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {canApprove && (
                      <SelectItem value="approve">Approve Request</SelectItem>
                    )}
                    {canComplete && (
                      <SelectItem value="complete">Complete Withdrawal</SelectItem>
                    )}
                    {canReject && (
                      <SelectItem value="reject">Reject Request</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {action === 'approve' && 'Approve the request for processing'}
                  {action === 'complete' && 'Complete and finalize the withdrawal (deducts balance)'}
                  {action === 'reject' && 'Reject and decline the request'}
                </p>
              </div>

              {action === 'approve' && (
                <div>
                  <Label htmlFor="approvedAmount">
                    Approved Amount (FCFA) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="approvedAmount"
                    type="number"
                    min="1"
                    step="1"
                    value={formData.approvedAmount}
                    onChange={(e) => setFormData({ ...formData, approvedAmount: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Can be different from requested amount if needed
                  </p>
                </div>
              )}

              {action === 'reject' && (
                <div>
                  <Label htmlFor="rejectionReason">
                    Rejection Reason <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="rejectionReason"
                    value={formData.rejectionReason}
                    onChange={(e) => setFormData({ ...formData, rejectionReason: e.target.value })}
                    placeholder="Explain why this request is being rejected"
                    rows={3}
                    required
                  />
                </div>
              )}

              {action === 'complete' && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                  <p className="text-sm text-amber-800 font-medium">⚠️ Important</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Completing this withdrawal will immediately deduct from the investor's balance.
                    Make sure you have transferred the funds before completing.
                  </p>
                  {request.type === 'equipment_share' && (
                    <p className="text-sm text-amber-700 mt-2">
                      Equipment exit will be calculated based on current equipment value and ownership percentage.
                    </p>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="adminNotes">Admin Notes (Optional)</Label>
                <Textarea
                  id="adminNotes"
                  value={formData.adminNotes}
                  onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                  placeholder="Add any internal notes about this decision"
                  rows={2}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  variant={action === 'reject' ? 'destructive' : 'default'}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {action === 'approve' && 'Approve Request'}
                  {action === 'complete' && 'Complete Withdrawal'}
                  {action === 'reject' && 'Reject Request'}
                </Button>
              </DialogFooter>
            </form>
          )}

          {!canApprove && !canReject && !canComplete && (
            <div className="text-center py-4 text-sm text-gray-500">
              This withdrawal request has been {request.status} and cannot be modified.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

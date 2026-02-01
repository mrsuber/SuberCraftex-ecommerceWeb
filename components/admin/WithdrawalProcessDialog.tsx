'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, CheckCircle2, XCircle, Clock, Phone, User, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'
import Image from 'next/image'

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
  const [uploading, setUploading] = useState(false)
  const [action, setAction] = useState<'approve' | 'reject' | 'complete'>('approve')
  const [formData, setFormData] = useState({
    approvedAmount: request.amount || '0',
    adminNotes: '',
    rejectionReason: '',
    adminReceiptUrl: '',
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('type', 'admin-withdrawal-receipt')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image')
      }

      setFormData({ ...formData, adminReceiptUrl: data.url })
      toast.success('Receipt uploaded successfully')
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload receipt')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation
      if (action === 'approve' && (!formData.approvedAmount || parseFloat(formData.approvedAmount) <= 0)) {
        toast.error('Please enter a valid approved amount')
        setLoading(false)
        return
      }

      if (action === 'reject' && !formData.rejectionReason) {
        toast.error('Please provide a rejection reason')
        setLoading(false)
        return
      }

      // Require receipt for cash/profit withdrawals when completing
      if (action === 'complete' && ['cash', 'profit'].includes(request.type) && !formData.adminReceiptUrl) {
        toast.error('Please upload a payment receipt')
        setLoading(false)
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
          adminReceiptUrl: action === 'complete' ? formData.adminReceiptUrl : undefined,
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
          : 'Payment sent - awaiting investor confirmation'
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
    if (status === 'completed' || status === 'confirmed') return <CheckCircle2 className="h-4 w-4 text-green-600" />
    if (status === 'rejected') return <XCircle className="h-4 w-4 text-red-600" />
    if (status === 'approved' || status === 'awaiting_investor_confirmation') return <CheckCircle2 className="h-4 w-4 text-blue-600" />
    if (status === 'disputed') return <AlertCircle className="h-4 w-4 text-orange-600" />
    return <Clock className="h-4 w-4 text-yellow-600" />
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'PENDING',
      approved: 'APPROVED',
      awaiting_investor_confirmation: 'AWAITING CONFIRMATION',
      processing: 'PROCESSING',
      completed: 'COMPLETED',
      confirmed: 'CONFIRMED',
      rejected: 'REJECTED',
      cancelled: 'CANCELLED',
      disputed: 'DISPUTED',
    }
    return labels[status] || status.toUpperCase()
  }

  const getStatusVariant = (status: string) => {
    if (status === 'completed' || status === 'confirmed') return 'default'
    if (status === 'rejected') return 'destructive'
    if (status === 'approved' || status === 'awaiting_investor_confirmation') return 'default'
    if (status === 'disputed') return 'destructive'
    return 'secondary'
  }

  // Determine available actions based on current status
  const canApprove = request.status === 'pending'
  const canReject = request.status === 'pending' || request.status === 'approved' || request.status === 'disputed'
  const canComplete = request.status === 'approved' || request.status === 'pending' || request.status === 'disputed'

  // Check if request has momo details
  const hasMomoDetails = request.momoNumber || request.momoName || request.momoProvider

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
                <Badge variant={getStatusVariant(request.status)}>
                  {getStatusLabel(request.status)}
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

            {/* Mobile Money Details - Prominently displayed */}
            {hasMomoDetails && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                <p className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Send Payment To:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-blue-600">Provider</p>
                    <p className="font-semibold text-blue-900">{request.momoProvider || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600">Phone Number</p>
                    <p className="font-semibold text-blue-900 text-lg">{request.momoNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600">Account Name</p>
                    <p className="font-semibold text-blue-900 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {request.momoName || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}

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

            {/* Show investor feedback for disputed requests */}
            {request.investorFeedback && (
              <div className="bg-orange-50 border border-orange-200 rounded p-2">
                <p className="text-sm text-orange-800 font-medium">Investor Dispute Feedback</p>
                <p className="text-sm text-orange-700">{request.investorFeedback}</p>
              </div>
            )}

            {/* Show existing admin receipt if any */}
            {request.adminReceiptUrl && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Previous Payment Receipt</p>
                <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                  <Image
                    src={request.adminReceiptUrl}
                    alt="Payment Receipt"
                    fill
                    className="object-contain"
                  />
                </div>
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
                      <SelectItem value="complete">Send Payment & Upload Receipt</SelectItem>
                    )}
                    {canReject && (
                      <SelectItem value="reject">Reject Request</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {action === 'approve' && 'Approve the request for processing'}
                  {action === 'complete' && 'Send payment to investor and upload proof. Investor will confirm receipt.'}
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
                <>
                  {/* Payment Instructions */}
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                    <p className="text-sm text-amber-800 font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Payment Instructions
                    </p>
                    <ol className="text-sm text-amber-700 mt-2 list-decimal list-inside space-y-1">
                      <li>Send <strong>{formatCurrency(parseFloat(request.approvedAmount || request.amount))}</strong> to the investor's mobile money</li>
                      {hasMomoDetails && (
                        <li>
                          Provider: <strong>{request.momoProvider}</strong>, Number: <strong>{request.momoNumber}</strong>
                        </li>
                      )}
                      <li>Take a screenshot of your payment confirmation</li>
                      <li>Upload the receipt below</li>
                      <li>Investor will confirm receipt before their balance is updated</li>
                    </ol>
                  </div>

                  {/* Receipt Upload */}
                  <div>
                    <Label>
                      Payment Receipt <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-2">
                      {formData.adminReceiptUrl ? (
                        <div className="space-y-2">
                          <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                            <Image
                              src={formData.adminReceiptUrl}
                              alt="Uploaded Receipt"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setFormData({ ...formData, adminReceiptUrl: '' })}
                          >
                            Remove & Upload Different Image
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {uploading ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="h-6 w-6 animate-spin text-primary" />
                              <span className="text-sm text-gray-600">Uploading...</span>
                            </div>
                          ) : (
                            <>
                              <Upload className="h-8 w-8 mx-auto text-gray-400" />
                              <p className="text-sm text-gray-600 mt-2">
                                Click to upload payment receipt
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                PNG, JPG up to 10MB
                              </p>
                            </>
                          )}
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>
                  </div>
                </>
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
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading || uploading}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || uploading}
                  variant={action === 'reject' ? 'destructive' : 'default'}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {action === 'approve' && 'Approve Request'}
                  {action === 'complete' && 'Send Payment'}
                  {action === 'reject' && 'Reject Request'}
                </Button>
              </DialogFooter>
            </form>
          )}

          {!canApprove && !canReject && !canComplete && (
            <div className="text-center py-4 text-sm text-gray-500">
              {request.status === 'awaiting_investor_confirmation' && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-blue-800 font-medium">Waiting for Investor Confirmation</p>
                  <p className="text-blue-700 mt-1">
                    Payment has been sent. Waiting for the investor to confirm receipt.
                  </p>
                </div>
              )}
              {request.status === 'confirmed' && (
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <p className="text-green-800 font-medium">Withdrawal Confirmed</p>
                  <p className="text-green-700 mt-1">
                    The investor has confirmed receipt of payment. Balance has been updated.
                  </p>
                </div>
              )}
              {!['awaiting_investor_confirmation', 'confirmed', 'pending', 'approved', 'disputed'].includes(request.status) && (
                <p>This withdrawal request has been {request.status} and cannot be modified.</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

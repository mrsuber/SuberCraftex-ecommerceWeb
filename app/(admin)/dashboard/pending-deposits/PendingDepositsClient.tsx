'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Loader2,
  XCircle,
  Receipt,
  User,
  Phone,
  Mail,
  ExternalLink,
} from 'lucide-react'
import { formatCurrency } from '@/lib/currency'

interface Deposit {
  id: string
  depositNumber: string
  grossAmount: string
  charges: string
  amount: string
  paymentMethod: string
  referenceNumber: string | null
  investorReceiptUrl: string | null
  receiptUrl: string | null
  notes: string | null
  confirmationStatus: string
  investorNotes: string | null
  adminConfirmedAt: string | null
  confirmedAt: string | null
  depositedAt: string
  createdAt: string
  investor: {
    id: string
    investorNumber: string
    fullName: string
    email: string
    phone: string
  }
}

interface GroupedDeposits {
  awaiting_admin_confirmation: Deposit[]
  awaiting_receipt: Deposit[]
  awaiting_payment: Deposit[]
  pending_confirmation: Deposit[]
}

// Helper to normalize upload URLs
const normalizeUploadUrl = (url: string | null): string | null => {
  if (!url) return null
  if (url.startsWith('/api/uploads/')) return url
  if (url.startsWith('/uploads/')) return '/api' + url
  return url
}

interface PendingDepositsClientProps {
  groupedDeposits: GroupedDeposits
}

export default function PendingDepositsClient({ groupedDeposits }: PendingDepositsClientProps) {
  const router = useRouter()
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  // For confirming mobile money receipts
  const [confirmingDeposit, setConfirmingDeposit] = useState<Deposit | null>(null)
  const [charges, setCharges] = useState('0')
  const [adminNotes, setAdminNotes] = useState('')

  const totalPending =
    groupedDeposits.awaiting_admin_confirmation.length +
    groupedDeposits.awaiting_receipt.length +
    groupedDeposits.awaiting_payment.length +
    groupedDeposits.pending_confirmation.length

  const handleConfirmReceipt = async (action: 'confirm' | 'reject') => {
    if (!confirmingDeposit) return

    setProcessingId(confirmingDeposit.id)
    setError('')

    try {
      const response = await fetch(
        `/api/admin/investors/${confirmingDeposit.investor.id}/deposits/${confirmingDeposit.id}/confirm-receipt`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action,
            charges: parseFloat(charges) || 0,
            notes: adminNotes || null,
          }),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to process deposit')
      }

      setConfirmingDeposit(null)
      setCharges('0')
      setAdminNotes('')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setProcessingId(null)
    }
  }

  const renderDepositCard = (deposit: Deposit, showActions: boolean = false) => {
    const grossAmount = parseFloat(deposit.grossAmount)
    const chargesAmount = parseFloat(deposit.charges)
    const netAmount = parseFloat(deposit.amount)

    return (
      <div key={deposit.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          {/* Receipt Image */}
          {deposit.investorReceiptUrl && (
            <div
              className="w-20 h-20 bg-gray-100 rounded border overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setPreviewImage(normalizeUploadUrl(deposit.investorReceiptUrl))}
            >
              <img
                src={normalizeUploadUrl(deposit.investorReceiptUrl) || ''}
                alt="Receipt"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="font-semibold text-sm">
                  {deposit.paymentMethod === 'mobile_money' ? 'Mobile Money' : deposit.paymentMethod.replace('_', ' ').toUpperCase()}
                </p>
                <p className="text-xs text-gray-500">{deposit.depositNumber}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{formatCurrency(grossAmount)}</p>
                {chargesAmount > 0 && (
                  <p className="text-xs text-gray-500">Net: {formatCurrency(netAmount)}</p>
                )}
              </div>
            </div>

            {/* Investor Info */}
            <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {deposit.investor.fullName}
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">{deposit.investor.investorNumber}</span>
                <Link
                  href={`/dashboard/investors/${deposit.investor.id}`}
                  className="text-primary hover:underline flex items-center gap-1 ml-auto"
                >
                  View <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Notes */}
            {deposit.notes && (
              <p className="text-xs text-gray-600 mt-2">
                <span className="font-medium">Notes:</span> {deposit.notes}
              </p>
            )}

            {/* Timestamp */}
            <p className="text-xs text-gray-400 mt-2">
              Created: {new Date(deposit.createdAt).toLocaleString()}
            </p>

            {/* Actions for awaiting_admin_confirmation */}
            {showActions && deposit.confirmationStatus === 'awaiting_admin_confirmation' && (
              <div className="mt-3 flex gap-2">
                {deposit.investorReceiptUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewImage(normalizeUploadUrl(deposit.investorReceiptUrl))}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Receipt
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => {
                    setConfirmingDeposit(deposit)
                    setCharges('0')
                    setAdminNotes('')
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Review & Confirm
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pending Deposits</h1>
          <p className="text-gray-600 mt-1">
            {totalPending} deposit{totalPending !== 1 ? 's' : ''} requiring attention
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Wallet className="h-8 w-8 text-primary" />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {totalPending === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">All caught up!</h3>
            <p className="text-gray-500 mt-1">No pending deposits to process.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile Money Receipts to Review - PRIORITY */}
          {groupedDeposits.awaiting_admin_confirmation.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <Receipt className="h-5 w-5" />
                  Mobile Money Receipts to Review
                  <Badge variant="destructive" className="ml-2">
                    {groupedDeposits.awaiting_admin_confirmation.length}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Investors have uploaded receipts. Review and confirm payment received.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {groupedDeposits.awaiting_admin_confirmation.map((deposit) =>
                    renderDepositCard(deposit, true)
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cash Deposits Awaiting Receipt */}
          {groupedDeposits.awaiting_receipt.length > 0 && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <Clock className="h-5 w-5" />
                  Cash Deposits - Awaiting Receipt
                  <Badge variant="secondary" className="ml-2">
                    {groupedDeposits.awaiting_receipt.length}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Investor has requested cash deposit. Process when payment is received.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {groupedDeposits.awaiting_receipt.map((deposit) =>
                    renderDepositCard(deposit)
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mobile Money - Awaiting Payment (Step 1) */}
          {groupedDeposits.awaiting_payment.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <Clock className="h-5 w-5" />
                  Mobile Money - Awaiting Payment
                  <Badge variant="outline" className="ml-2">
                    {groupedDeposits.awaiting_payment.length}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Investors are in Step 1: Sending money. Waiting for them to upload receipt.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {groupedDeposits.awaiting_payment.map((deposit) =>
                    renderDepositCard(deposit)
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Awaiting Investor Confirmation (Step 3) */}
          {groupedDeposits.pending_confirmation.length > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle2 className="h-5 w-5" />
                  Awaiting Investor Confirmation
                  <Badge variant="outline" className="ml-2 bg-green-100">
                    {groupedDeposits.pending_confirmation.length}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Admin confirmed. Waiting for investor to do final confirmation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {groupedDeposits.pending_confirmation.map((deposit) =>
                    renderDepositCard(deposit)
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Confirm Receipt Dialog */}
      <Dialog open={!!confirmingDeposit} onOpenChange={() => setConfirmingDeposit(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Mobile Money Receipt</DialogTitle>
          </DialogHeader>

          {confirmingDeposit && (
            <div className="space-y-4">
              {/* Receipt Preview */}
              {confirmingDeposit.investorReceiptUrl && (
                <div
                  className="w-full h-48 bg-gray-100 rounded-lg border overflow-hidden cursor-pointer"
                  onClick={() => setPreviewImage(normalizeUploadUrl(confirmingDeposit.investorReceiptUrl))}
                >
                  <img
                    src={normalizeUploadUrl(confirmingDeposit.investorReceiptUrl) || ''}
                    alt="Receipt"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Investor Info */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{confirmingDeposit.investor.fullName}</p>
                <p className="text-sm text-gray-600">{confirmingDeposit.investor.investorNumber}</p>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {confirmingDeposit.investor.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {confirmingDeposit.investor.phone}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">Amount on Receipt:</span>
                <span className="text-xl font-bold">
                  {formatCurrency(parseFloat(confirmingDeposit.grossAmount))}
                </span>
              </div>

              {/* Charges Input */}
              <div>
                <Label htmlFor="charges">Transaction Charges (FCFA)</Label>
                <Input
                  id="charges"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={charges}
                  onChange={(e) => setCharges(e.target.value)}
                  className="mt-1"
                />
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">Net amount to credit:</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(parseFloat(confirmingDeposit.grossAmount) - (parseFloat(charges) || 0))}
                  </span>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <Label htmlFor="adminNotes">Notes (Optional)</Label>
                <Textarea
                  id="adminNotes"
                  placeholder="Any notes about this deposit..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="mt-1"
                  rows={2}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleConfirmReceipt('reject')}
                  disabled={processingId === confirmingDeposit.id}
                >
                  {processingId === confirmingDeposit.id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Reject Receipt
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => handleConfirmReceipt('confirm')}
                  disabled={
                    processingId === confirmingDeposit.id ||
                    parseFloat(confirmingDeposit.grossAmount) - (parseFloat(charges) || 0) <= 0
                  }
                >
                  {processingId === confirmingDeposit.id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  )}
                  Confirm Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Receipt Preview</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="flex justify-center">
              <img
                src={previewImage}
                alt="Receipt Preview"
                className="max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

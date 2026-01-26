'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  DollarSign,
  Download,
  Package,
  Settings as SettingsIcon,
  Plus,
  Loader2,
  FileCheck,
  XCircle,
  Eye,
  User,
  CreditCard,
  Upload,
  ImageIcon,
  Trash2,
  Receipt,
} from 'lucide-react'
import { formatCurrency } from '@/lib/currency'
import WithdrawalProcessDialog from './WithdrawalProcessDialog'

// Helper to normalize upload URLs - handles both old (/uploads/...) and new (/api/uploads/...) formats
const normalizeUploadUrl = (url: string | null): string | null => {
  if (!url) return null;
  // If URL already starts with /api/uploads, return as is
  if (url.startsWith('/api/uploads/')) return url;
  // If URL starts with /uploads/, prepend /api
  if (url.startsWith('/uploads/')) return '/api' + url;
  // Return as is for other URLs (external URLs, etc.)
  return url;
};

interface InvestorDetailClientProps {
  investor: any
  products: any[]
  equipment: any[]
}

// Component for handling deposit request with receipt upload (for cash deposits)
function DepositRequestCard({ deposit, investorId, onSuccess }: { deposit: any; investorId: string; onSuccess: () => void }) {
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [receiptUrl, setReceiptUrl] = useState('')
  const [charges, setCharges] = useState('0')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image (JPEG, PNG, WebP) or PDF file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'receipt')
      formData.append('investorId', investorId)

      const response = await fetch('/api/admin/investors/upload-receipt', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to upload receipt')
      }

      const data = await response.json()
      setReceiptUrl(data.url)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleProcessDeposit = async () => {
    if (!receiptUrl) {
      setError('Please upload a receipt first')
      return
    }

    setProcessing(true)
    setError('')

    const chargesNum = parseFloat(charges) || 0
    const grossAmount = parseFloat(deposit.grossAmount)
    const netAmount = grossAmount - chargesNum

    try {
      const response = await fetch(`/api/admin/investors/${investorId}/deposits/${deposit.id}/upload-receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiptUrl,
          charges: chargesNum,
          netAmount,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to process deposit')
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm font-medium">
            {deposit.paymentMethod === 'mobile_money' ? 'Mobile Money' : 'Cash'} Deposit Request
          </p>
          <p className="text-xs text-gray-500">
            Requested: {new Date(deposit.createdAt).toLocaleString()}
          </p>
        </div>
        <span className="text-lg font-bold text-amber-600">
          {formatCurrency(parseFloat(deposit.grossAmount))}
        </span>
      </div>

      {deposit.notes && (
        <p className="text-xs text-gray-600 mb-3">
          <span className="font-medium">Investor Notes:</span> {deposit.notes}
        </p>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mb-3">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {/* Receipt Upload */}
        <div>
          <Label className="text-xs">Upload Receipt / Proof of Payment</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            onChange={handleFileUpload}
          />

          {receiptUrl ? (
            <div className="mt-1 flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700 flex-1">Receipt uploaded</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReceiptUrl('')}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-1"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Receipt
                </>
              )}
            </Button>
          )}
        </div>

        {/* Charges Input */}
        <div>
          <Label className="text-xs">Transaction Charges (FCFA)</Label>
          <Input
            type="number"
            min="0"
            placeholder="0"
            value={charges}
            onChange={(e) => setCharges(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Net amount: {formatCurrency(parseFloat(deposit.grossAmount) - (parseFloat(charges) || 0))}
          </p>
        </div>

        {/* Submit Button */}
        <Button
          className="w-full"
          onClick={handleProcessDeposit}
          disabled={!receiptUrl || processing}
        >
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Send Receipt to Investor
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// Component for reviewing investor-uploaded mobile money receipt
function InvestorReceiptReviewCard({
  deposit,
  investorId,
  onSuccess,
  onPreviewImage
}: {
  deposit: any;
  investorId: string;
  onSuccess: () => void;
  onPreviewImage: (url: string) => void;
}) {
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [charges, setCharges] = useState('0')
  const [notes, setNotes] = useState('')

  const handleConfirmReceipt = async () => {
    setProcessing(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/investors/${investorId}/deposits/${deposit.id}/confirm-receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'confirm',
          charges: parseFloat(charges) || 0,
          notes: notes || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to confirm receipt')
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  const handleRejectReceipt = async () => {
    if (!confirm('Are you sure you want to reject this receipt? The investor will need to resubmit.')) {
      return
    }

    setProcessing(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/investors/${investorId}/deposits/${deposit.id}/confirm-receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          notes: notes || 'Receipt rejected. Please resubmit with a clearer image.',
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to reject receipt')
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  const grossAmount = parseFloat(deposit.grossAmount)
  const chargesNum = parseFloat(charges) || 0
  const netAmount = grossAmount - chargesNum

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex gap-4">
        {/* Investor Receipt Image */}
        {deposit.investorReceiptUrl && (
          <div
            className="w-24 h-24 bg-gray-100 rounded border overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onPreviewImage(normalizeUploadUrl(deposit.investorReceiptUrl) || '')}
          >
            <img
              src={normalizeUploadUrl(deposit.investorReceiptUrl) || ''}
              alt="Investor Receipt"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium">
                Mobile Money Deposit
              </p>
              <p className="text-xs text-gray-500">
                Receipt uploaded: {new Date(deposit.createdAt).toLocaleString()}
              </p>
              {deposit.referenceNumber && (
                <p className="text-xs text-gray-600 mt-1">
                  <span className="font-medium">Reference:</span> {deposit.referenceNumber}
                </p>
              )}
            </div>
            <span className="text-lg font-bold text-amber-600">
              {formatCurrency(grossAmount)}
            </span>
          </div>

          {deposit.notes && (
            <p className="text-xs text-gray-600 mb-2">
              <span className="font-medium">Investor Notes:</span> {deposit.notes}
            </p>
          )}

          {/* View Receipt Button */}
          {deposit.investorReceiptUrl && (
            <Button
              variant="outline"
              size="sm"
              className="mb-3"
              onClick={() => onPreviewImage(normalizeUploadUrl(deposit.investorReceiptUrl) || '')}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Full Receipt
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm my-3">
          {error}
        </div>
      )}

      <div className="mt-4 pt-4 border-t space-y-3">
        {/* Charges Input */}
        <div>
          <Label className="text-xs">Transaction Charges (FCFA)</Label>
          <Input
            type="number"
            min="0"
            placeholder="0"
            value={charges}
            onChange={(e) => setCharges(e.target.value)}
            className="mt-1"
          />
          <div className="flex justify-between text-xs mt-1">
            <span className="text-gray-500">Gross amount: {formatCurrency(grossAmount)}</span>
            <span className={`font-medium ${netAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>
              Net amount: {formatCurrency(netAmount)}
            </span>
          </div>
        </div>

        {/* Admin Notes */}
        <div>
          <Label className="text-xs">Notes (Optional)</Label>
          <Textarea
            placeholder="Add any notes about this deposit..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1"
            rows={2}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="destructive"
            className="flex-1"
            onClick={handleRejectReceipt}
            disabled={processing}
          >
            {processing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4 mr-2" />
            )}
            Reject
          </Button>
          <Button
            className="flex-1"
            onClick={handleConfirmReceipt}
            disabled={processing || netAmount <= 0}
          >
            {processing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4 mr-2" />
            )}
            Confirm Receipt
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function InvestorDetailClient({
  investor,
  products,
  equipment,
}: InvestorDetailClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Deposit form
  const [depositOpen, setDepositOpen] = useState(false)
  const [depositForm, setDepositForm] = useState({
    grossAmount: '',  // Total amount investor sent
    charges: '',      // Transaction fees
    amount: '',       // Net amount to credit (auto-calculated)
    paymentMethod: 'cash',
    referenceNumber: '',
    receiptUrl: '',
    notes: '',
  })
  const [uploadingReceipt, setUploadingReceipt] = useState(false)
  const receiptInputRef = useRef<HTMLInputElement>(null)

  // Auto-calculate net amount when gross amount or charges change
  const calculateNetAmount = (gross: string, charges: string) => {
    const grossNum = parseFloat(gross) || 0
    const chargesNum = parseFloat(charges) || 0
    return Math.max(0, grossNum - chargesNum).toString()
  }

  // Product allocation form
  const [productAllocOpen, setProductAllocOpen] = useState(false)
  const [productForm, setProductForm] = useState({
    productId: '',
    variantId: '',
    quantity: '',
    purchasePrice: '',
    notes: '',
  })

  // Equipment allocation form
  const [equipmentAllocOpen, setEquipmentAllocOpen] = useState(false)
  const [equipmentForm, setEquipmentForm] = useState({
    equipmentId: '',
    amountAllocated: '',
    notes: '',
  })

  // Verification
  const [verifying, setVerifying] = useState(false)

  // KYC Review
  const [kycRejectOpen, setKycRejectOpen] = useState(false)
  const [kycRejectionReason, setKycRejectionReason] = useState('')
  const [processingKyc, setProcessingKyc] = useState(false)

  // Image preview
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Withdrawal processing
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false)
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null)

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any }> = {
      pending_verification: { variant: 'secondary', icon: Clock },
      active: { variant: 'default', icon: CheckCircle2 },
      suspended: { variant: 'destructive', icon: AlertCircle },
      exited: { variant: 'outline', icon: AlertCircle },
    }

    const config = variants[status] || variants.pending_verification
    const Icon = config.icon

    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    )
  }

  const handleSuspendToggle = async () => {
    const newStatus = investor.status === 'suspended' ? 'active' : 'suspended'
    const action = newStatus === 'suspended' ? 'suspend' : 'reactivate'

    if (!confirm(`Are you sure you want to ${action} this investor?`)) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/investors/${investor.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${action} investor`)
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyInvestor = async () => {
    setVerifying(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/investors/${investor.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: true }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to verify investor')
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setVerifying(false)
    }
  }

  const handleKycApprove = async () => {
    if (!confirm('Are you sure you want to approve this KYC verification?')) {
      return
    }

    setProcessingKyc(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/investors/${investor.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kycAction: 'approve' }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to approve KYC')
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setProcessingKyc(false)
    }
  }

  const handleKycReject = async () => {
    setProcessingKyc(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/investors/${investor.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kycAction: 'reject',
          kycRejectionReason: kycRejectionReason || 'Verification documents rejected. Please resubmit with clearer images.',
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to reject KYC')
      }

      setKycRejectOpen(false)
      setKycRejectionReason('')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setProcessingKyc(false)
    }
  }

  const getKycStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      not_started: { variant: 'outline', icon: Clock, label: 'Not Started' },
      pending: { variant: 'secondary', icon: Clock, label: 'Pending Review' },
      approved: { variant: 'default', icon: CheckCircle2, label: 'Approved' },
      rejected: { variant: 'destructive', icon: XCircle, label: 'Rejected' },
    }

    const config = variants[status] || variants.not_started
    const Icon = config.icon

    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image (JPEG, PNG, WebP) or PDF file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    setUploadingReceipt(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'receipt')
      formData.append('investorId', investor.id)

      const response = await fetch('/api/admin/investors/upload-receipt', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to upload receipt')
      }

      const data = await response.json()
      setDepositForm({ ...depositForm, receiptUrl: data.url })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploadingReceipt(false)
    }
  }

  const handleRecordDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const grossAmount = parseFloat(depositForm.grossAmount) || 0
    const charges = parseFloat(depositForm.charges) || 0
    const netAmount = grossAmount - charges

    if (netAmount <= 0) {
      setError('Net amount must be greater than zero')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/admin/investors/${investor.id}/deposits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grossAmount: grossAmount,
          charges: charges,
          amount: netAmount,
          paymentMethod: depositForm.paymentMethod,
          referenceNumber: depositForm.referenceNumber || null,
          receiptUrl: depositForm.receiptUrl || null,
          notes: depositForm.notes || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to record deposit')
      }

      setDepositOpen(false)
      setDepositForm({
        grossAmount: '',
        charges: '',
        amount: '',
        paymentMethod: 'cash',
        referenceNumber: '',
        receiptUrl: '',
        notes: '',
      })
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAllocateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/investors/${investor.id}/allocate-product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to allocate product')
      }

      setProductAllocOpen(false)
      setProductForm({
        productId: '',
        variantId: '',
        quantity: '',
        purchasePrice: '',
        notes: '',
      })
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAllocateEquipment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/investors/${investor.id}/allocate-equipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(equipmentForm),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to allocate equipment')
      }

      setEquipmentAllocOpen(false)
      setEquipmentForm({
        equipmentId: '',
        amountAllocated: '',
        notes: '',
      })
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const selectedProduct = products.find(p => p.id === productForm.productId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/investors">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{investor.fullName}</h1>
            <p className="text-gray-600 mt-1">
              {investor.investorNumber} • {investor.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(investor.status)}
          {investor.kycStatus && getKycStatusBadge(investor.kycStatus)}
          {/* Show KYC Review buttons if pending */}
          {investor.kycStatus === 'pending' && (
            <>
              <Button onClick={handleKycApprove} disabled={processingKyc}>
                {processingKyc ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                Approve KYC
              </Button>
              <Button variant="destructive" onClick={() => setKycRejectOpen(true)} disabled={processingKyc}>
                <XCircle className="mr-2 h-4 w-4" />
                Reject KYC
              </Button>
            </>
          )}
          {/* Legacy verify button for investors without KYC documents */}
          {!investor.isVerified && investor.kycStatus !== 'pending' && !investor.idDocumentUrl && (
            <Button onClick={handleVerifyInvestor} disabled={verifying}>
              {verifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Verify Investor
                </>
              )}
            </Button>
          )}
          {investor.isVerified && (
            <Button
              variant={investor.status === 'suspended' ? 'default' : 'destructive'}
              onClick={handleSuspendToggle}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : investor.status === 'suspended' ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Reactivate
                </>
              ) : (
                <>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Suspend
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(parseFloat(investor.cashBalance))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(parseFloat(investor.profitBalance))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(parseFloat(investor.totalInvested))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(parseFloat(investor.totalProfit))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Record Deposit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record Investor Deposit</DialogTitle>
                  <DialogDescription>
                    Record a new deposit to investor's cash balance
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleRecordDeposit} className="space-y-4">
                  <div>
                    <Label htmlFor="paymentMethod">Payment Method *</Label>
                    <Select
                      value={depositForm.paymentMethod}
                      onValueChange={(value) => setDepositForm({ ...depositForm, paymentMethod: value })}
                    >
                      <SelectTrigger id="paymentMethod">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="mobile_payment">Mobile Money</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amount Section */}
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                    <h4 className="font-medium text-sm text-gray-700">Amount Details</h4>

                    <div>
                      <Label htmlFor="grossAmount">Amount on Receipt (FCFA) *</Label>
                      <Input
                        id="grossAmount"
                        type="number"
                        step="1"
                        min="1"
                        placeholder="e.g., 1010 (total shown on receipt)"
                        value={depositForm.grossAmount}
                        onChange={(e) => {
                          const newGross = e.target.value
                          setDepositForm({
                            ...depositForm,
                            grossAmount: newGross,
                            amount: calculateNetAmount(newGross, depositForm.charges)
                          })
                        }}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Total amount shown on the receipt/proof of payment</p>
                    </div>

                    <div>
                      <Label htmlFor="charges">Transaction Charges/Fees (FCFA)</Label>
                      <Input
                        id="charges"
                        type="number"
                        step="1"
                        min="0"
                        placeholder="e.g., 10 (mobile money fees)"
                        value={depositForm.charges}
                        onChange={(e) => {
                          const newCharges = e.target.value
                          setDepositForm({
                            ...depositForm,
                            charges: newCharges,
                            amount: calculateNetAmount(depositForm.grossAmount, newCharges)
                          })
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">Mobile money fees, bank charges, etc.</p>
                    </div>

                    {/* Net Amount Display */}
                    {depositForm.grossAmount && (
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Net Amount to Credit:</span>
                          <span className="text-lg font-bold text-green-600">
                            {formatCurrency(parseFloat(calculateNetAmount(depositForm.grossAmount, depositForm.charges)) || 0)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">This amount will be added to investor's cash balance</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="referenceNumber">Reference / Receipt Number</Label>
                    <Input
                      id="referenceNumber"
                      placeholder="e.g., Receipt #001, Transaction ID"
                      value={depositForm.referenceNumber}
                      onChange={(e) => setDepositForm({ ...depositForm, referenceNumber: e.target.value })}
                    />
                  </div>

                  {/* Receipt Upload */}
                  <div>
                    <Label>Receipt / Proof of Payment</Label>
                    <input
                      ref={receiptInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      className="hidden"
                      onChange={handleReceiptUpload}
                    />

                    {depositForm.receiptUrl ? (
                      <div className="mt-2 relative border-2 border-green-200 bg-green-50 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-white rounded border overflow-hidden flex items-center justify-center">
                            {depositForm.receiptUrl.endsWith('.pdf') ? (
                              <Receipt className="h-8 w-8 text-gray-400" />
                            ) : (
                              <img
                                src={depositForm.receiptUrl}
                                alt="Receipt"
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-green-700">Receipt uploaded</p>
                            <p className="text-xs text-green-600">Click to view or replace</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setDepositForm({ ...depositForm, receiptUrl: '' })}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => receiptInputRef.current?.click()}
                        disabled={uploadingReceipt}
                        className="mt-2 w-full border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        {uploadingReceipt ? (
                          <>
                            <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                            <span className="text-sm text-gray-500">Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-6 w-6 text-gray-400" />
                            <span className="text-sm text-gray-600">Upload receipt image or PDF</span>
                            <span className="text-xs text-gray-400">JPEG, PNG, WebP or PDF (max 10MB)</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="depositNotes">Notes</Label>
                    <Textarea
                      id="depositNotes"
                      placeholder="Any additional notes about this deposit..."
                      value={depositForm.notes}
                      onChange={(e) => setDepositForm({ ...depositForm, notes: e.target.value })}
                    />
                  </div>
                  <Button type="submit" disabled={loading || uploadingReceipt} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Recording...
                      </>
                    ) : (
                      <>
                        <DollarSign className="mr-2 h-4 w-4" />
                        Record Deposit
                      </>
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={productAllocOpen} onOpenChange={setProductAllocOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Package className="mr-2 h-4 w-4" />
                  Allocate to Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Allocate Funds to Product</DialogTitle>
                  <DialogDescription>
                    Allocate investor's cash to purchase products
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAllocateProduct} className="space-y-4">
                  <div>
                    <Label htmlFor="product">Product</Label>
                    <Select
                      value={productForm.productId}
                      onValueChange={(value) => {
                        const product = products.find(p => p.id === value)
                        setProductForm({
                          ...productForm,
                          productId: value,
                          variantId: '',
                          purchasePrice: product?.price.toString() || '',
                        })
                      }}
                    >
                      <SelectTrigger id="product">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map(product => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} ({product.sku}) - {formatCurrency(parseFloat(product.price))}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedProduct && selectedProduct.variants.length > 0 && (
                    <div>
                      <Label htmlFor="variant">Variant (Optional)</Label>
                      <Select
                        value={productForm.variantId}
                        onValueChange={(value) => {
                          const variant = selectedProduct.variants.find((v: any) => v.id === value)
                          setProductForm({
                            ...productForm,
                            variantId: value,
                            purchasePrice: variant?.price.toString() || selectedProduct.price.toString(),
                          })
                        }}
                      >
                        <SelectTrigger id="variant">
                          <SelectValue placeholder="Select variant or skip" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No variant</SelectItem>
                          {selectedProduct.variants.map((variant: any) => (
                            <SelectItem key={variant.id} value={variant.id}>
                              {variant.name} ({variant.sku}) - {formatCurrency(parseFloat(variant.price))}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={productForm.quantity}
                        onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="purchasePrice">Purchase Price per Unit</Label>
                      <Input
                        id="purchasePrice"
                        type="number"
                        step="0.01"
                        value={productForm.purchasePrice}
                        onChange={(e) => setProductForm({ ...productForm, purchasePrice: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {productForm.quantity && productForm.purchasePrice && (
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm font-medium">
                        Total Investment: {formatCurrency(parseFloat(productForm.quantity) * parseFloat(productForm.purchasePrice))}
                      </p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="productNotes">Notes (Optional)</Label>
                    <Textarea
                      id="productNotes"
                      value={productForm.notes}
                      onChange={(e) => setProductForm({ ...productForm, notes: e.target.value })}
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Allocating...
                      </>
                    ) : (
                      'Allocate to Product'
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={equipmentAllocOpen} onOpenChange={setEquipmentAllocOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Allocate to Equipment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Allocate Funds to Equipment</DialogTitle>
                  <DialogDescription>
                    Co-fund equipment purchase with investor's cash
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAllocateEquipment} className="space-y-4">
                  <div>
                    <Label htmlFor="equipment">Equipment</Label>
                    <Select
                      value={equipmentForm.equipmentId}
                      onValueChange={(value) => setEquipmentForm({ ...equipmentForm, equipmentId: value })}
                    >
                      <SelectTrigger id="equipment">
                        <SelectValue placeholder="Select equipment" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipment.map(equip => (
                          <SelectItem key={equip.id} value={equip.id}>
                            {equip.name} ({equip.equipmentNumber}) - Value: {formatCurrency(parseFloat(equip.currentValue))}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amountAllocated">Amount to Allocate (FCFA)</Label>
                    <Input
                      id="amountAllocated"
                      type="number"
                      step="0.01"
                      value={equipmentForm.amountAllocated}
                      onChange={(e) => setEquipmentForm({ ...equipmentForm, amountAllocated: e.target.value })}
                      required
                    />
                  </div>

                  {equipmentForm.equipmentId && equipmentForm.amountAllocated && (
                    <div className="bg-blue-50 p-3 rounded space-y-1">
                      {(() => {
                        const selectedEquip = equipment.find(e => e.id === equipmentForm.equipmentId)
                        const percentage = (parseFloat(equipmentForm.amountAllocated) / parseFloat(selectedEquip?.purchasePrice || '1')) * 100
                        return (
                          <>
                            <p className="text-sm font-medium">
                              Ownership: {percentage.toFixed(2)}%
                            </p>
                            <p className="text-xs text-gray-600">
                              Will receive {percentage.toFixed(2)}% of equipment profits
                            </p>
                          </>
                        )
                      })()}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="equipmentNotes">Notes (Optional)</Label>
                    <Textarea
                      id="equipmentNotes"
                      value={equipmentForm.notes}
                      onChange={(e) => setEquipmentForm({ ...equipmentForm, notes: e.target.value })}
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Allocating...
                      </>
                    ) : (
                      'Allocate to Equipment'
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Main Content - Continued in next part due to length */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deposits" className="relative">
            Deposits ({investor.deposits.length})
            {investor.deposits.filter((d: any) => ['awaiting_admin_confirmation', 'awaiting_receipt'].includes(d.confirmationStatus)).length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {investor.deposits.filter((d: any) => ['awaiting_admin_confirmation', 'awaiting_receipt'].includes(d.confirmationStatus)).length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals ({investor.withdrawalRequests.length})</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KYC Verification Card - Show if documents submitted */}
          {(investor.idDocumentUrl || investor.selfieUrl) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  KYC Verification Documents
                </CardTitle>
                <CardDescription>
                  Review the investor's identity verification documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* KYC Status */}
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">KYC Status</p>
                      <p className="text-xs text-gray-500">
                        {investor.kycSubmittedAt
                          ? `Submitted: ${new Date(investor.kycSubmittedAt).toLocaleString()}`
                          : 'Not submitted'}
                      </p>
                    </div>
                    {investor.kycStatus && getKycStatusBadge(investor.kycStatus)}
                  </div>

                  {investor.kycRejectionReason && investor.kycStatus === 'rejected' && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                      <p className="text-sm text-red-700">{investor.kycRejectionReason}</p>
                    </div>
                  )}

                  {/* Document Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* ID Front */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        ID Document (Front)
                      </p>
                      {investor.idDocumentUrl ? (
                        <div
                          className="relative border rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setPreviewImage(normalizeUploadUrl(investor.idDocumentUrl))}
                        >
                          <img
                            src={normalizeUploadUrl(investor.idDocumentUrl) || ''}
                            alt="ID Front"
                            className="w-full h-40 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Eye className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed rounded-lg h-40 flex items-center justify-center text-gray-400">
                          Not uploaded
                        </div>
                      )}
                    </div>

                    {/* ID Back */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        ID Document (Back)
                      </p>
                      {investor.idDocumentBackUrl ? (
                        <div
                          className="relative border rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setPreviewImage(normalizeUploadUrl(investor.idDocumentBackUrl))}
                        >
                          <img
                            src={normalizeUploadUrl(investor.idDocumentBackUrl) || ''}
                            alt="ID Back"
                            className="w-full h-40 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Eye className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed rounded-lg h-40 flex items-center justify-center text-gray-400">
                          Not uploaded
                        </div>
                      )}
                    </div>

                    {/* Selfie */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <User className="h-4 w-4" />
                        Selfie Photo
                      </p>
                      {investor.selfieUrl ? (
                        <div
                          className="relative border rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setPreviewImage(normalizeUploadUrl(investor.selfieUrl))}
                        >
                          <img
                            src={normalizeUploadUrl(investor.selfieUrl) || ''}
                            alt="Selfie"
                            className="w-full h-40 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Eye className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed rounded-lg h-40 flex items-center justify-center text-gray-400">
                          Not uploaded
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons for Pending KYC */}
                  {investor.kycStatus === 'pending' && (
                    <div className="flex gap-3 pt-4 border-t">
                      <Button onClick={handleKycApprove} disabled={processingKyc} className="flex-1">
                        {processingKyc ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                        )}
                        Approve KYC
                      </Button>
                      <Button variant="destructive" onClick={() => setKycRejectOpen(true)} disabled={processingKyc} className="flex-1">
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject KYC
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Investor Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-sm font-medium">Full Name:</span>
                  <span className="text-sm">{investor.fullName}</span>

                  <span className="text-sm font-medium">Email:</span>
                  <span className="text-sm">{investor.email}</span>

                  <span className="text-sm font-medium">Phone:</span>
                  <span className="text-sm">{investor.phone}</span>

                  <span className="text-sm font-medium">ID Type:</span>
                  <span className="text-sm">{investor.idType ? investor.idType.replace('_', ' ').toUpperCase() : 'Not provided'}</span>

                  <span className="text-sm font-medium">ID Number:</span>
                  <span className="text-sm">{investor.idNumber || 'Not provided'}</span>

                  <span className="text-sm font-medium">Joined:</span>
                  <span className="text-sm">{new Date(investor.createdAt).toLocaleDateString()}</span>

                  <span className="text-sm font-medium">Agreement:</span>
                  <span className="text-sm">
                    {investor.agreementAccepted ? (
                      <Badge variant="default">Accepted</Badge>
                    ) : (
                      <Badge variant="secondary">Not Accepted</Badge>
                    )}
                  </span>
                </div>

                {investor.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-1">Admin Notes:</p>
                    <p className="text-sm text-gray-600">{investor.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-sm font-medium">Products:</span>
                  <span className="text-sm">{investor.productAllocations.length} allocations</span>

                  <span className="text-sm font-medium">Equipment:</span>
                  <span className="text-sm">{investor.equipmentAllocations.filter((e: any) => !e.hasExited).length} active</span>

                  <span className="text-sm font-medium">Total Deposits:</span>
                  <span className="text-sm">{investor.deposits.length}</span>

                  <span className="text-sm font-medium">Withdrawals:</span>
                  <span className="text-sm">{investor.withdrawalRequests.length} requests</span>

                  <span className="text-sm font-medium">Total Withdrawn:</span>
                  <span className="text-sm">{formatCurrency(parseFloat(investor.totalWithdrawn))}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Profit Distributions</CardTitle>
            </CardHeader>
            <CardContent>
              {investor.profitDistributions.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No profit distributions yet
                </p>
              ) : (
                <div className="space-y-2">
                  {investor.profitDistributions.slice(0, 10).map((profit: any) => (
                    <div key={profit.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="text-sm font-medium">{profit.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(profit.distributedAt).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        +{formatCurrency(parseFloat(profit.investorShare))}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deposits" className="space-y-6">
          {/* Mobile Money - Awaiting Admin Confirmation (Step 2) */}
          {investor.deposits.filter((d: any) => d.confirmationStatus === 'awaiting_admin_confirmation').length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <Receipt className="h-5 w-5" />
                  Mobile Money Receipts to Review
                </CardTitle>
                <CardDescription>
                  Investor has uploaded receipt. Review and confirm the payment received.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {investor.deposits.filter((d: any) => d.confirmationStatus === 'awaiting_admin_confirmation').map((deposit: any) => (
                    <InvestorReceiptReviewCard
                      key={deposit.id}
                      deposit={deposit}
                      investorId={investor.id}
                      onSuccess={() => router.refresh()}
                      onPreviewImage={setPreviewImage}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mobile Money - Awaiting Payment (Step 1) */}
          {investor.deposits.filter((d: any) => d.confirmationStatus === 'awaiting_payment').length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <Clock className="h-5 w-5" />
                  Awaiting Mobile Money Payment
                </CardTitle>
                <CardDescription>
                  Investor has initiated these deposits and is sending money. Waiting for receipt upload.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {investor.deposits.filter((d: any) => d.confirmationStatus === 'awaiting_payment').map((deposit: any) => (
                    <div key={deposit.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium">Mobile Money Deposit</p>
                          <p className="text-xs text-gray-500">
                            Initiated: {new Date(deposit.createdAt).toLocaleString()}
                          </p>
                          <Badge variant="secondary" className="mt-2">Step 1: Awaiting Payment</Badge>
                        </div>
                        <span className="text-lg font-bold text-amber-600">
                          {formatCurrency(parseFloat(deposit.grossAmount))}
                        </span>
                      </div>
                      {deposit.notes && (
                        <p className="text-xs text-gray-600 mt-2">
                          <span className="font-medium">Notes:</span> {deposit.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pending Deposit Requests - Awaiting Receipt (Cash deposits) */}
          {investor.deposits.filter((d: any) => d.confirmationStatus === 'awaiting_receipt').length > 0 && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <Clock className="h-5 w-5" />
                  Cash Deposit Requests
                </CardTitle>
                <CardDescription>
                  Investor has requested these cash deposits. Upload receipt once payment is received.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {investor.deposits.filter((d: any) => d.confirmationStatus === 'awaiting_receipt').map((deposit: any) => (
                    <DepositRequestCard
                      key={deposit.id}
                      deposit={deposit}
                      investorId={investor.id}
                      onSuccess={() => router.refresh()}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Deposits Pending Investor Confirmation (Step 3) */}
          {investor.deposits.filter((d: any) => d.confirmationStatus === 'pending_confirmation').length > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle2 className="h-5 w-5" />
                  Awaiting Investor Final Confirmation
                </CardTitle>
                <CardDescription>
                  Admin has verified payment. Waiting for investor to confirm and add funds to their account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {investor.deposits.filter((d: any) => d.confirmationStatus === 'pending_confirmation').map((deposit: any) => (
                    <div key={deposit.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex gap-4">
                        {(deposit.receiptUrl || deposit.investorReceiptUrl) && (
                          <div
                            className="w-16 h-16 bg-gray-100 rounded border overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setPreviewImage(normalizeUploadUrl(deposit.receiptUrl || deposit.investorReceiptUrl))}
                          >
                            <img
                              src={normalizeUploadUrl(deposit.receiptUrl || deposit.investorReceiptUrl) || ''}
                              alt="Receipt"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium">
                                {deposit.paymentMethod === 'mobile_money' ? 'Mobile Money' : deposit.paymentMethod.replace('_', ' ').toUpperCase()}
                              </p>
                              <p className="text-xs text-gray-500">
                                Admin confirmed: {deposit.adminConfirmedAt ? new Date(deposit.adminConfirmedAt).toLocaleString() : 'N/A'}
                              </p>
                              <Badge variant="outline" className="mt-1 bg-green-100 text-green-800">Step 3: Awaiting Investor Confirm</Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Gross: {formatCurrency(parseFloat(deposit.grossAmount))}</p>
                              {parseFloat(deposit.charges) > 0 && (
                                <p className="text-xs text-red-500">Charges: -{formatCurrency(parseFloat(deposit.charges))}</p>
                              )}
                              <p className="text-lg font-bold text-green-600">
                                Net: {formatCurrency(parseFloat(deposit.amount))}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Deposits History */}
          <Card>
            <CardHeader>
              <CardTitle>All Deposits</CardTitle>
              <CardDescription>Complete deposit history with all details</CardDescription>
            </CardHeader>
            <CardContent>
              {investor.deposits.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No deposits yet</p>
              ) : (
                <div className="space-y-4">
                  {investor.deposits.map((deposit: any) => {
                    const grossAmount = parseFloat(deposit.grossAmount || deposit.amount)
                    const charges = parseFloat(deposit.charges || '0')
                    const netAmount = parseFloat(deposit.amount)
                    const isDisputed = deposit.confirmationStatus === 'disputed'
                    const isConfirmed = deposit.confirmationStatus === 'confirmed'
                    const isPending = ['awaiting_payment', 'awaiting_admin_confirmation', 'awaiting_receipt', 'pending_confirmation'].includes(deposit.confirmationStatus)

                    return (
                      <div
                        key={deposit.id}
                        className={`border rounded-lg p-4 ${isDisputed ? 'border-red-200 bg-red-50' : isConfirmed ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}
                      >
                        {/* Header Row */}
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-sm font-semibold flex items-center gap-2">
                              {deposit.paymentMethod === 'mobile_money' ? 'Mobile Money' : deposit.paymentMethod.replace('_', ' ').toUpperCase()}
                              {isConfirmed && (
                                <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Confirmed
                                </Badge>
                              )}
                              {isDisputed && (
                                <Badge variant="destructive" className="text-xs">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Disputed
                                </Badge>
                              )}
                              {isPending && (
                                <Badge variant="secondary" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {deposit.confirmationStatus.replace(/_/g, ' ')}
                                </Badge>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              DEP-{deposit.id.slice(0, 8).toUpperCase()} • {new Date(deposit.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`text-lg font-bold ${isConfirmed ? 'text-green-600' : 'text-gray-700'}`}>
                              {formatCurrency(netAmount)}
                            </span>
                            {charges > 0 && (
                              <p className="text-xs text-gray-500">
                                Gross: {formatCurrency(grossAmount)} | Charges: {formatCurrency(charges)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Receipts Row */}
                        <div className="flex gap-4 mb-3">
                          {/* Investor's uploaded receipt */}
                          {deposit.investorReceiptUrl && (
                            <div className="flex-1">
                              <p className="text-xs font-medium text-gray-600 mb-1">Investor's Receipt:</p>
                              <div
                                className="w-full h-32 bg-gray-100 rounded border overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setPreviewImage(normalizeUploadUrl(deposit.investorReceiptUrl))}
                              >
                                <img
                                  src={normalizeUploadUrl(deposit.investorReceiptUrl) || ''}
                                  alt="Investor Receipt"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 h-auto mt-1 text-xs"
                                onClick={() => setPreviewImage(normalizeUploadUrl(deposit.investorReceiptUrl))}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View Full Size
                              </Button>
                            </div>
                          )}

                          {/* Admin's receipt (for cash deposits) */}
                          {deposit.receiptUrl && deposit.receiptUrl !== deposit.investorReceiptUrl && (
                            <div className="flex-1">
                              <p className="text-xs font-medium text-gray-600 mb-1">Admin Receipt:</p>
                              <div
                                className="w-full h-32 bg-gray-100 rounded border overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setPreviewImage(normalizeUploadUrl(deposit.receiptUrl))}
                              >
                                {deposit.receiptUrl.endsWith('.pdf') ? (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Receipt className="h-8 w-8 text-gray-400" />
                                    <span className="text-xs text-gray-500 ml-2">PDF</span>
                                  </div>
                                ) : (
                                  <img
                                    src={normalizeUploadUrl(deposit.receiptUrl) || ''}
                                    alt="Admin Receipt"
                                    className="w-full h-full object-contain"
                                  />
                                )}
                              </div>
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 h-auto mt-1 text-xs"
                                onClick={() => setPreviewImage(normalizeUploadUrl(deposit.receiptUrl))}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View Full Size
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="space-y-2 text-sm">
                          {deposit.referenceNumber && (
                            <p className="text-gray-600">
                              <span className="font-medium">Reference:</span> {deposit.referenceNumber}
                            </p>
                          )}

                          {/* Admin Notes */}
                          {deposit.notes && (
                            <div className="p-2 bg-blue-50 rounded border border-blue-100">
                              <p className="text-xs font-medium text-blue-800">Admin Notes:</p>
                              <p className="text-blue-700 whitespace-pre-wrap">{deposit.notes}</p>
                            </div>
                          )}

                          {/* Investor Notes / Dispute Reason */}
                          {deposit.investorNotes && (
                            <div className={`p-2 rounded border ${isDisputed ? 'bg-red-100 border-red-200' : 'bg-yellow-50 border-yellow-100'}`}>
                              <p className={`text-xs font-medium ${isDisputed ? 'text-red-800' : 'text-yellow-800'}`}>
                                {isDisputed ? 'Dispute Reason:' : 'Investor Notes:'}
                              </p>
                              <p className={`${isDisputed ? 'text-red-700' : 'text-yellow-700'} whitespace-pre-wrap`}>
                                {deposit.investorNotes}
                              </p>
                            </div>
                          )}

                          {/* Timestamps */}
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 pt-2 border-t">
                            <span>Created: {new Date(deposit.createdAt).toLocaleString()}</span>
                            {deposit.adminConfirmedAt && (
                              <span>Admin Confirmed: {new Date(deposit.adminConfirmedAt).toLocaleString()}</span>
                            )}
                            {deposit.confirmedAt && (
                              <span>Investor Confirmed: {new Date(deposit.confirmedAt).toLocaleString()}</span>
                            )}
                          </div>
                        </div>

                        {/* Action for disputed - link to pending deposits */}
                        {isDisputed && (
                          <div className="mt-3 pt-3 border-t border-red-200">
                            <Link href="/dashboard/pending-deposits">
                              <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Resolve in Pending Deposits
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Allocations</CardTitle>
            </CardHeader>
            <CardContent>
              {investor.productAllocations.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No product allocations</p>
              ) : (
                <div className="space-y-4">
                  {investor.productAllocations.map((alloc: any) => (
                    <div key={alloc.id} className="border rounded-lg p-4">
                      <div className="flex gap-4">
                        {alloc.product.featuredImage && (
                          <img
                            src={alloc.product.featuredImage}
                            alt={alloc.product.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold">{alloc.product.name}</h4>
                          <p className="text-sm text-gray-600">SKU: {alloc.product.sku}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                            <div>
                              <p className="text-xs text-gray-500">Quantity</p>
                              <p className="text-sm font-semibold">
                                {alloc.quantityRemaining} / {alloc.quantity}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Investment</p>
                              <p className="text-sm font-semibold">
                                {formatCurrency(parseFloat(alloc.totalInvestment))}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Profit</p>
                              <p className="text-sm font-semibold text-green-600">
                                {formatCurrency(parseFloat(alloc.profitGenerated))}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Capital Returned</p>
                              <p className="text-sm font-semibold">
                                {formatCurrency(parseFloat(alloc.capitalReturned))}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equipment Allocations</CardTitle>
            </CardHeader>
            <CardContent>
              {investor.equipmentAllocations.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No equipment allocations</p>
              ) : (
                <div className="space-y-4">
                  {investor.equipmentAllocations.map((alloc: any) => (
                    <div key={alloc.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{alloc.equipment.name}</h4>
                          <p className="text-sm text-gray-600">{alloc.equipment.equipmentNumber}</p>
                        </div>
                        {alloc.hasExited ? (
                          <Badge variant="outline">Exited</Badge>
                        ) : (
                          <Badge variant="default">Active</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-gray-500">Investment</p>
                          <p className="text-sm font-semibold">
                            {formatCurrency(parseFloat(alloc.amountAllocated))}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Ownership</p>
                          <p className="text-sm font-semibold">
                            {parseFloat(alloc.investmentPercentage).toFixed(2)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Profit</p>
                          <p className="text-sm font-semibold text-green-600">
                            {formatCurrency(parseFloat(alloc.totalProfitReceived))}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Current Value</p>
                          <p className="text-sm font-semibold">
                            {formatCurrency(parseFloat(alloc.equipment.currentValue))}
                          </p>
                        </div>
                      </div>
                      {alloc.hasExited && (
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-sm text-gray-600">
                            Exited: {new Date(alloc.exitedAt).toLocaleDateString()} - Refund: {formatCurrency(parseFloat(alloc.exitAmount))}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {investor.withdrawalRequests.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No withdrawal requests</p>
              ) : (
                <div className="space-y-3">
                  {investor.withdrawalRequests.map((request: any) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{request.requestNumber}</p>
                          <p className="text-sm text-gray-600">
                            {request.type.replace('_', ' ').toUpperCase()}
                          </p>
                        </div>
                        <Badge
                          variant={
                            request.status === 'completed'
                              ? 'default'
                              : request.status === 'rejected'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-gray-500">Amount:</span>
                        <span className="font-semibold">
                          {formatCurrency(parseFloat(request.amount))}
                        </span>

                        <span className="text-gray-500">Requested:</span>
                        <span>{new Date(request.requestedAt).toLocaleDateString()}</span>

                        {request.approvedAmount && (
                          <>
                            <span className="text-gray-500">Approved Amount:</span>
                            <span className="font-semibold">
                              {formatCurrency(parseFloat(request.approvedAmount))}
                            </span>
                          </>
                        )}
                      </div>
                      {request.investorNotes && (
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>Notes:</strong> {request.investorNotes}
                        </p>
                      )}
                      {request.adminNotes && (
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Admin Notes:</strong> {request.adminNotes}
                        </p>
                      )}
                      {(request.status === 'pending' || request.status === 'approved') && (
                        <div className="mt-3 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedWithdrawal(request)
                              setWithdrawalDialogOpen(true)
                            }}
                          >
                            Process Request
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {investor.transactions.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No transactions</p>
              ) : (
                <div className="space-y-2">
                  {investor.transactions.map((transaction: any) => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="text-sm font-medium">{transaction.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleString()} • {transaction.type.replace('_', ' ')}
                        </p>
                        {transaction.notes && (
                          <p className="text-xs text-gray-600 mt-1">{transaction.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${
                          ['deposit', 'profit_credit', 'refund'].includes(transaction.type)
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {['deposit', 'profit_credit', 'refund'].includes(transaction.type) ? '+' : '-'}
                          {formatCurrency(parseFloat(transaction.amount))}
                        </p>
                        <p className="text-xs text-gray-500">
                          Balance: {formatCurrency(parseFloat(transaction.balanceAfter))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Withdrawal Processing Dialog */}
      {selectedWithdrawal && (
        <WithdrawalProcessDialog
          open={withdrawalDialogOpen}
          onOpenChange={setWithdrawalDialogOpen}
          request={selectedWithdrawal}
          onSuccess={() => router.refresh()}
        />
      )}

      {/* KYC Rejection Dialog */}
      <Dialog open={kycRejectOpen} onOpenChange={setKycRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject KYC Verification</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this verification. The investor will be notified and can resubmit.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionReason">Rejection Reason</Label>
              <Textarea
                id="rejectionReason"
                placeholder="E.g., ID document is blurry, selfie doesn't match ID photo, expired document..."
                value={kycRejectionReason}
                onChange={(e) => setKycRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setKycRejectOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleKycReject} disabled={processingKyc} className="flex-1">
                {processingKyc ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                Reject KYC
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="flex justify-center">
              <img
                src={previewImage}
                alt="Document Preview"
                className="max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

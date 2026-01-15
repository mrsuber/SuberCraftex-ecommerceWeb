'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DollarSign,
  TrendingUp,
  Package,
  Settings,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wallet,
  PiggyBank,
  Receipt,
  Eye,
  XCircle,
  Loader2,
} from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/currency'
import WithdrawalRequestDialog from './WithdrawalRequestDialog'
import AccountSettingsDialog from './AccountSettingsDialog'
import { useRouter } from 'next/navigation'

interface InvestorDashboardClientProps {
  investor: any
}

export default function InvestorDashboardClient({ investor }: InvestorDashboardClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)

  // Deposit confirmation state
  const [confirmingDeposit, setConfirmingDeposit] = useState<string | null>(null)
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false)
  const [selectedDeposit, setSelectedDeposit] = useState<any>(null)
  const [disputeReason, setDisputeReason] = useState('')
  const [processingDeposit, setProcessingDeposit] = useState(false)
  const [previewReceipt, setPreviewReceipt] = useState<string | null>(null)

  // Filter pending deposits that need confirmation
  const pendingDeposits = investor.deposits?.filter(
    (d: any) => d.confirmationStatus === 'pending_confirmation'
  ) || []

  const handleConfirmDeposit = async (depositId: string) => {
    setConfirmingDeposit(depositId)
    setProcessingDeposit(true)

    try {
      const response = await fetch(`/api/investors/deposits/${depositId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'confirm' }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to confirm deposit')
      }

      toast.success('Deposit confirmed! Funds have been added to your balance.')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setConfirmingDeposit(null)
      setProcessingDeposit(false)
    }
  }

  const handleDisputeDeposit = async () => {
    if (!selectedDeposit || !disputeReason.trim()) {
      toast.error('Please provide a reason for disputing')
      return
    }

    setProcessingDeposit(true)

    try {
      const response = await fetch(`/api/investors/deposits/${selectedDeposit.id}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dispute', notes: disputeReason }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to dispute deposit')
      }

      toast.success('Dispute submitted. Our team will review and contact you.')
      setDisputeDialogOpen(false)
      setSelectedDeposit(null)
      setDisputeReason('')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setProcessingDeposit(false)
    }
  }

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

  const getTransactionIcon = (type: string) => {
    const depositTypes = ['deposit', 'profit_credit', 'refund']
    return depositTypes.includes(type) ? (
      <ArrowDownRight className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowUpRight className="h-4 w-4 text-red-600" />
    )
  }

  const totalProductsValue = investor.productAllocations.reduce(
    (sum: number, alloc: any) => sum + parseFloat(alloc.totalInvestment),
    0
  )

  const totalEquipmentValue = investor.equipmentAllocations.reduce(
    (sum: number, alloc: any) => sum + parseFloat(alloc.amountAllocated),
    0
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Investor Dashboard</h1>
              <p className="text-gray-600 mt-1">
                {investor.investorNumber} • {investor.fullName}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(investor.status)}
              {!investor.isVerified && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Pending Verification
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Verification Notice */}
        {!investor.isVerified && (
          <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-amber-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  <strong>Verification Pending:</strong> Your account is under review by our admin team. You'll be able to make deposits once verified (typically within 24-48 hours).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pending Deposits Confirmation */}
        {pendingDeposits.length > 0 && (
          <Card className="mb-6 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Clock className="h-5 w-5" />
                Deposits Awaiting Your Confirmation ({pendingDeposits.length})
              </CardTitle>
              <CardDescription className="text-blue-700">
                Please review and confirm these deposits. Funds will be added to your balance after confirmation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingDeposits.map((deposit: any) => (
                <div key={deposit.id} className="bg-white rounded-lg border p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Receipt Preview */}
                    {deposit.receiptUrl && (
                      <div
                        className="w-full md:w-24 h-24 bg-gray-100 rounded border overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setPreviewReceipt(deposit.receiptUrl)}
                      >
                        <img
                          src={deposit.receiptUrl}
                          alt="Receipt"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Deposit Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {deposit.paymentMethod?.replace('_', ' ').toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(deposit.depositedAt).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Pending Confirmation
                        </Badge>
                      </div>

                      {/* Amount Breakdown */}
                      <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg text-sm mb-3">
                        <div>
                          <p className="text-gray-500">Receipt Amount</p>
                          <p className="font-semibold">{formatCurrency(parseFloat(deposit.grossAmount))}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Charges</p>
                          <p className="font-semibold text-red-600">-{formatCurrency(parseFloat(deposit.charges || 0))}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">To Be Credited</p>
                          <p className="font-bold text-green-600">{formatCurrency(parseFloat(deposit.amount))}</p>
                        </div>
                      </div>

                      {deposit.referenceNumber && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Reference:</span> {deposit.referenceNumber}
                        </p>
                      )}

                      {deposit.notes && (
                        <p className="text-sm text-gray-600 mb-3">
                          <span className="font-medium">Admin Notes:</span> {deposit.notes}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {deposit.receiptUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPreviewReceipt(deposit.receiptUrl)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Receipt
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => handleConfirmDeposit(deposit.id)}
                          disabled={processingDeposit}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {confirmingDeposit === deposit.id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                          )}
                          Confirm Amount is Correct
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedDeposit(deposit)
                            setDisputeDialogOpen(true)
                          }}
                          disabled={processingDeposit}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Dispute
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(parseFloat(investor.cashBalance))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Available for allocation
              </p>
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
              <p className="text-xs text-muted-foreground mt-1">
                Earned profits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(parseFloat(investor.totalInvested))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Lifetime deposits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(parseFloat(investor.totalProfit))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All-time earnings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your investment account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button disabled={!investor.isVerified}>
                <Download className="mr-2 h-4 w-4" />
                Request Deposit
              </Button>
              <Button
                variant="outline"
                onClick={() => setWithdrawalDialogOpen(true)}
                disabled={!investor.isVerified}
              >
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Request Withdrawal
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveTab('products')}
              >
                <Package className="mr-2 h-4 w-4" />
                View Investments
              </Button>
              <Button
                variant="outline"
                onClick={() => setSettingsDialogOpen(true)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products ({investor.productAllocations.length})</TabsTrigger>
            <TabsTrigger value="equipment">Equipment ({investor.equipmentAllocations.length})</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Investment Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Investment Breakdown</CardTitle>
                  <CardDescription>How your capital is allocated</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Cash (Available)</span>
                      <span className="text-sm font-semibold">
                        {formatCurrency(parseFloat(investor.cashBalance))}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(parseFloat(investor.cashBalance) / parseFloat(investor.totalInvested)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Products</span>
                      <span className="text-sm font-semibold">
                        {formatCurrency(totalProductsValue)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${(totalProductsValue / parseFloat(investor.totalInvested)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Equipment</span>
                      <span className="text-sm font-semibold">
                        {formatCurrency(totalEquipmentValue)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{
                          width: `${(totalEquipmentValue / parseFloat(investor.totalInvested)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Profits */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Profits</CardTitle>
                  <CardDescription>Latest profit distributions</CardDescription>
                </CardHeader>
                <CardContent>
                  {investor.profitDistributions.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No profit distributions yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {investor.profitDistributions.slice(0, 5).map((profit: any) => (
                        <div key={profit.id} className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">{profit.description}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(profit.distributedAt).toLocaleDateString()}
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
            </div>

            {/* Pending Withdrawals */}
            {investor.withdrawalRequests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pending Withdrawal Requests</CardTitle>
                  <CardDescription>Requests awaiting processing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {investor.withdrawalRequests.map((request: any) => (
                      <div key={request.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">
                            {request.type.replace('_', ' ').toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(request.requestedAt).toLocaleDateString()} • {request.requestNumber}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            {formatCurrency(parseFloat(request.amount))}
                          </p>
                          <Badge variant="secondary" className="mt-1">
                            {request.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Investments</CardTitle>
                <CardDescription>
                  Products purchased with your investment
                </CardDescription>
              </CardHeader>
              <CardContent>
                {investor.productAllocations.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No product investments yet. Funds will be allocated by admin.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {investor.productAllocations.map((alloc: any) => (
                      <div key={alloc.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex gap-4">
                          {(alloc.product.featuredImage || alloc.variant?.imageUrl) && (
                            <img
                              src={alloc.variant?.imageUrl || alloc.product.featuredImage}
                              alt={alloc.product.name}
                              className="w-20 h-20 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {alloc.product.name}
                              {alloc.variant && ` - ${alloc.variant.name}`}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              SKU: {alloc.variant?.sku || alloc.product.sku}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                              <div>
                                <p className="text-xs text-gray-500">Invested</p>
                                <p className="text-sm font-semibold">
                                  {formatCurrency(parseFloat(alloc.totalInvestment))}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Quantity</p>
                                <p className="text-sm font-semibold">
                                  {alloc.quantityRemaining} / {alloc.quantity}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Profit Generated</p>
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
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Equipment Investments</CardTitle>
                <CardDescription>
                  Equipment co-funded by your investment
                </CardDescription>
              </CardHeader>
              <CardContent>
                {investor.equipmentAllocations.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No equipment investments yet. Funds will be allocated by admin.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {investor.equipmentAllocations.map((alloc: any) => (
                      <div key={alloc.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex gap-4">
                          {alloc.equipment.photos.length > 0 && (
                            <img
                              src={alloc.equipment.photos[0]}
                              alt={alloc.equipment.name}
                              className="w-20 h-20 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {alloc.equipment.name}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {alloc.equipment.equipmentNumber}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  alloc.equipment.status === 'active'
                                    ? 'default'
                                    : 'secondary'
                                }
                              >
                                {alloc.equipment.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3">
                              <div>
                                <p className="text-xs text-gray-500">Your Investment</p>
                                <p className="text-sm font-semibold">
                                  {formatCurrency(parseFloat(alloc.amountAllocated))}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Ownership %</p>
                                <p className="text-sm font-semibold">
                                  {parseFloat(alloc.investmentPercentage).toFixed(2)}%
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Current Value</p>
                                <p className="text-sm font-semibold">
                                  {formatCurrency(parseFloat(alloc.equipment.currentValue))}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Total Revenue</p>
                                <p className="text-sm font-semibold">
                                  {formatCurrency(parseFloat(alloc.equipment.totalRevenue))}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Your Profit</p>
                                <p className="text-sm font-semibold text-green-600">
                                  {formatCurrency(parseFloat(alloc.totalProfitReceived))}
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
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>All account activity</CardDescription>
              </CardHeader>
              <CardContent>
                {investor.transactions.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No transactions yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {investor.transactions.map((transaction: any) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          {getTransactionIcon(transaction.type)}
                          <div>
                            <p className="text-sm font-medium">{transaction.description}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.createdAt).toLocaleString()}
                            </p>
                          </div>
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
                          <Badge variant="outline" className="text-xs mt-1">
                            {transaction.type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <WithdrawalRequestDialog
        open={withdrawalDialogOpen}
        onOpenChange={setWithdrawalDialogOpen}
        investor={investor}
        onSuccess={() => router.refresh()}
      />

      <AccountSettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
        investor={investor}
        onSuccess={() => router.refresh()}
      />

      {/* Dispute Deposit Dialog */}
      <Dialog open={disputeDialogOpen} onOpenChange={setDisputeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dispute Deposit</DialogTitle>
            <DialogDescription>
              Please explain why you're disputing this deposit. Our team will review and contact you.
            </DialogDescription>
          </DialogHeader>
          {selectedDeposit && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                <p><span className="font-medium">Amount:</span> {formatCurrency(parseFloat(selectedDeposit.amount))}</p>
                <p><span className="font-medium">Date:</span> {new Date(selectedDeposit.depositedAt).toLocaleString()}</p>
                <p><span className="font-medium">Method:</span> {selectedDeposit.paymentMethod?.replace('_', ' ')}</p>
              </div>
              <div>
                <Label htmlFor="disputeReason">Reason for Dispute *</Label>
                <Textarea
                  id="disputeReason"
                  placeholder="E.g., The amount is incorrect, I didn't make this deposit, etc."
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDisputeDialogOpen(false)
                    setSelectedDeposit(null)
                    setDisputeReason('')
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDisputeDeposit}
                  disabled={processingDeposit || !disputeReason.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {processingDeposit ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Submit Dispute
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Receipt Preview Dialog */}
      <Dialog open={!!previewReceipt} onOpenChange={() => setPreviewReceipt(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Receipt / Proof of Payment</DialogTitle>
          </DialogHeader>
          {previewReceipt && (
            <div className="flex justify-center">
              <img
                src={previewReceipt}
                alt="Receipt"
                className="max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

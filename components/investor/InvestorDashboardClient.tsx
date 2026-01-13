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
} from 'lucide-react'
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
    </div>
  )
}

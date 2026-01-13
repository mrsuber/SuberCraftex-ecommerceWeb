'use client'

import { useState } from 'react'
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
} from 'lucide-react'
import { formatCurrency } from '@/lib/currency'
import WithdrawalProcessDialog from './WithdrawalProcessDialog'

interface InvestorDetailClientProps {
  investor: any
  products: any[]
  equipment: any[]
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
    amount: '',
    paymentMethod: 'bank_transfer',
    referenceNumber: '',
    notes: '',
  })

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

  const handleRecordDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/investors/${investor.id}/deposits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(depositForm),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to record deposit')
      }

      setDepositOpen(false)
      setDepositForm({
        amount: '',
        paymentMethod: 'bank_transfer',
        referenceNumber: '',
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
          {!investor.isVerified && (
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
                    <Label htmlFor="amount">Amount (FCFA)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={depositForm.amount}
                      onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select
                      value={depositForm.paymentMethod}
                      onValueChange={(value) => setDepositForm({ ...depositForm, paymentMethod: value })}
                    >
                      <SelectTrigger id="paymentMethod">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="mobile_payment">Mobile Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="referenceNumber">Reference Number (Optional)</Label>
                    <Input
                      id="referenceNumber"
                      value={depositForm.referenceNumber}
                      onChange={(e) => setDepositForm({ ...depositForm, referenceNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="depositNotes">Notes (Optional)</Label>
                    <Textarea
                      id="depositNotes"
                      value={depositForm.notes}
                      onChange={(e) => setDepositForm({ ...depositForm, notes: e.target.value })}
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Recording...
                      </>
                    ) : (
                      'Record Deposit'
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
          <TabsTrigger value="deposits">Deposits ({investor.deposits.length})</TabsTrigger>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals ({investor.withdrawalRequests.length})</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
                  <span className="text-sm">{investor.idType.replace('_', ' ').toUpperCase()}</span>

                  <span className="text-sm font-medium">ID Number:</span>
                  <span className="text-sm">{investor.idNumber}</span>

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

        <TabsContent value="deposits">
          <Card>
            <CardHeader>
              <CardTitle>Deposit History</CardTitle>
            </CardHeader>
            <CardContent>
              {investor.deposits.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No deposits recorded</p>
              ) : (
                <div className="space-y-2">
                  {investor.deposits.map((deposit: any) => (
                    <div key={deposit.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="text-sm font-medium">
                          {deposit.paymentMethod.replace('_', ' ').toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(deposit.depositedAt).toLocaleString()}
                          {deposit.referenceNumber && ` • Ref: ${deposit.referenceNumber}`}
                        </p>
                        {deposit.notes && (
                          <p className="text-xs text-gray-600 mt-1">{deposit.notes}</p>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        +{formatCurrency(parseFloat(deposit.amount))}
                      </span>
                    </div>
                  ))}
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
    </div>
  )
}

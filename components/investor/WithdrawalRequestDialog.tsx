'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'

interface WithdrawalRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  investor: any
  onSuccess?: () => void
}

export default function WithdrawalRequestDialog({
  open,
  onOpenChange,
  investor,
  onSuccess,
}: WithdrawalRequestDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'cash',
    amount: '',
    productId: '',
    variantId: '',
    equipmentId: '',
    quantity: '',
    requestReason: '',
    investorNotes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate based on type
      if (formData.type === 'cash' || formData.type === 'profit') {
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
          toast.error('Please enter a valid amount')
          return
        }

        const balance =
          formData.type === 'cash'
            ? parseFloat(investor.cashBalance)
            : parseFloat(investor.profitBalance)

        if (parseFloat(formData.amount) > balance) {
          toast.error(`Insufficient ${formData.type} balance`)
          return
        }
      }

      if (formData.type === 'product') {
        if (!formData.productId || !formData.quantity) {
          toast.error('Please select a product and enter quantity')
          return
        }
      }

      if (formData.type === 'equipment_share') {
        if (!formData.equipmentId) {
          toast.error('Please select equipment')
          return
        }
      }

      if (!formData.requestReason) {
        toast.error('Please provide a reason for this withdrawal')
        return
      }

      const response = await fetch('/api/investors/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          amount: formData.amount ? parseFloat(formData.amount) : undefined,
          productId: formData.productId || undefined,
          variantId: formData.variantId || undefined,
          equipmentId: formData.equipmentId || undefined,
          quantity: formData.quantity ? parseInt(formData.quantity) : undefined,
          requestReason: formData.requestReason,
          investorNotes: formData.investorNotes || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create withdrawal request')
      }

      toast.success('Withdrawal request submitted successfully')
      onOpenChange(false)

      // Reset form
      setFormData({
        type: 'cash',
        amount: '',
        productId: '',
        variantId: '',
        equipmentId: '',
        quantity: '',
        requestReason: '',
        investorNotes: '',
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error('Withdrawal request error:', error)
      toast.error(error.message || 'Failed to create withdrawal request')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Withdrawal</DialogTitle>
          <DialogDescription>
            Submit a withdrawal request for admin review. Your request will be processed within 1-3 business days.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Withdrawal Type */}
          <div>
            <Label htmlFor="type">Withdrawal Type</Label>
            <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">
                  Cash Withdrawal (Available: {formatCurrency(parseFloat(investor.cashBalance))})
                </SelectItem>
                <SelectItem value="profit">
                  Profit Withdrawal (Available: {formatCurrency(parseFloat(investor.profitBalance))})
                </SelectItem>
                <SelectItem value="product">Product Claim (Physical Delivery)</SelectItem>
                <SelectItem value="equipment_share">Equipment Share Exit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cash/Profit Amount */}
          {(formData.type === 'cash' || formData.type === 'profit') && (
            <div>
              <Label htmlFor="amount">
                Amount (FCFA){' '}
                <span className="text-sm text-muted-foreground">
                  Max: {formatCurrency(
                    parseFloat(formData.type === 'cash' ? investor.cashBalance : investor.profitBalance)
                  )}
                </span>
              </Label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="1"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="Enter amount"
                required
              />
            </div>
          )}

          {/* Product Selection */}
          {formData.type === 'product' && (
            <>
              <div>
                <Label htmlFor="productId">Select Product</Label>
                <Select value={formData.productId} onValueChange={(value) => handleChange('productId', value)}>
                  <SelectTrigger id="productId">
                    <SelectValue placeholder="Choose a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {investor.productAllocations
                      .filter((alloc: any) => alloc.quantityRemaining > 0)
                      .map((alloc: any) => (
                        <SelectItem key={alloc.id} value={alloc.productId}>
                          {alloc.product.name} ({alloc.quantityRemaining} units available)
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', e.target.value)}
                  placeholder="Number of units"
                  required
                />
              </div>
            </>
          )}

          {/* Equipment Selection */}
          {formData.type === 'equipment_share' && (
            <div>
              <Label htmlFor="equipmentId">Select Equipment</Label>
              <Select value={formData.equipmentId} onValueChange={(value) => handleChange('equipmentId', value)}>
                <SelectTrigger id="equipmentId">
                  <SelectValue placeholder="Choose equipment" />
                </SelectTrigger>
                <SelectContent>
                  {investor.equipmentAllocations
                    .filter((alloc: any) => !alloc.hasExited)
                    .map((alloc: any) => (
                      <SelectItem key={alloc.id} value={alloc.equipmentId}>
                        {alloc.equipment.name} ({alloc.investmentPercentage}% ownership - Current value:{' '}
                        {formatCurrency(parseFloat(alloc.equipment.currentValue))})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                You will receive your share based on the current equipment value (after depreciation).
              </p>
            </div>
          )}

          {/* Reason */}
          <div>
            <Label htmlFor="requestReason">
              Reason for Withdrawal <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="requestReason"
              value={formData.requestReason}
              onChange={(e) => handleChange('requestReason', e.target.value)}
              placeholder="Please explain why you need this withdrawal"
              rows={3}
              required
            />
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="investorNotes">Additional Notes (Optional)</Label>
            <Textarea
              id="investorNotes"
              value={formData.investorNotes}
              onChange={(e) => handleChange('investorNotes', e.target.value)}
              placeholder="Any additional information for the admin team"
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Trash2, Minus, Plus, ShoppingCart, Smartphone, Printer } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'
import { MobileMoneyPay } from '@/components/payments/MobileMoneyPay'

interface CartItem {
  productId: string
  variantId?: string
  name: string
  sku: string
  price: number
  quantity: number
  image?: string
}

interface POSCartProps {
  cart: CartItem[]
  session: any
  onUpdateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void
  onRemoveItem: (productId: string, variantId: string | undefined) => void
  onClearCart: () => void
  onOrderComplete: () => void
}

export default function POSCart({
  cart,
  session,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderComplete,
}: POSCartProps) {
  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mobile_payment'>('cash')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [amountTendered, setAmountTendered] = useState('')
  const [discountAmount, setDiscountAmount] = useState('0')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = Math.max(0, Math.round(Number(discountAmount) || 0))
  // Catalogue prices already include any VAT; the server prices the order the same way
  const total = subtotal - discount
  const change = amountTendered ? parseFloat(amountTendered) - total : 0

  const [mobileSale, setMobileSale] = useState<{ id: string; total: number } | null>(null)
  // A sale created for Mobile Money that the customer will now pay in cash
  const [openSaleId, setOpenSaleId] = useState<string | null>(null)

  const finishSale = (orderId: string) => {
    // Open receipt in new window
    window.open(`/api/pos/receipt/${orderId}`, '_blank')
    setShowCheckout(false)
    setMobileSale(null)
    setOpenSaleId(null)
    setCustomerName('')
    setCustomerPhone('')
    setCustomerEmail('')
    setAmountTendered('')
    setDiscountAmount('0')
    onOrderComplete()
  }

  const handleCheckout = async () => {
    if (paymentMethod === 'mobile_payment' && customerPhone.replace(/\D/g, '').length < 9) {
      setError("Enter the customer's Mobile Money number")
      return
    }

    if (cart.length === 0) return

    if (paymentMethod === 'cash' && !amountTendered) {
      setError('Please enter amount tendered')
      return
    }

    if (paymentMethod === 'cash' && parseFloat(amountTendered) < total) {
      setError('Amount tendered is less than total')
      return
    }

    setError('')
    setLoading(true)

    try {
      if (openSaleId) {
        // Same sale, now paid in cash
        const res = await fetch(`/api/pos/orders/${openSaleId}/payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ method: 'cash', amountTendered: Number(amountTendered) || null }),
        })
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed to process payment')
        finishSale(openSaleId)
        return
      }

      // Create order
      const orderResponse = await fetch('/api/pos/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          paymentMethod,
          amountTendered: paymentMethod === 'cash' ? parseFloat(amountTendered) : null,
          customerName: customerName || undefined,
          customerEmail: customerEmail || undefined,
          customerPhone: customerPhone || undefined,
          discountAmount: discount,
        }),
      })

      if (!orderResponse.ok) {
        const data = await orderResponse.json()
        throw new Error(data.error || 'Failed to create order')
      }

      const orderData = await orderResponse.json()
      const orderId = orderData.order.id

      if (paymentMethod === 'mobile_payment') {
        // The customer approves the prompt on their phone; the sale completes when PayWithCAMSOL confirms
        setMobileSale({ id: orderId, total: Number(orderData.order.totalAmount) })
        return
      }

      // Cash: into this session's drawer
      const paymentResponse = await fetch(`/api/pos/orders/${orderId}/payment`, {
        method: 'POST',
      })

      if (!paymentResponse.ok) {
        const data = await paymentResponse.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to process payment')
      }

      finishSale(orderId)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (mobileSale) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Mobile Money payment</h2>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <MobileMoneyPay
            purpose="pos_order"
            id={mobileSale.id}
            amount={mobileSale.total}
            defaultPhone={customerPhone}
            compact
            onPaid={() => setTimeout(() => finishSale(mobileSale.id), 1200)}
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              // The customer pays cash instead: the same sale, taken into the drawer
              setPaymentMethod('cash')
              setOpenSaleId(mobileSale.id)
              setMobileSale(null)
              setError('Take the cash and enter the amount tendered to complete this sale.')
            }}
          >
            Customer will pay cash instead
          </Button>
        </div>
      </div>
    )
  }

  if (showCheckout) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Checkout</h2>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Payment Method */}
          <div>
            <Label>Payment Method</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                type="button"
                variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('cash')}
                className="flex flex-col h-auto py-3"
              >
                <ShoppingCart className="w-5 h-5 mb-1" />
                <span className="text-xs">Cash</span>
              </Button>
              <Button
                type="button"
                variant={paymentMethod === 'mobile_payment' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('mobile_payment')}
                className="flex flex-col h-auto py-3"
              >
                <Smartphone className="w-5 h-5 mb-1" />
                <span className="text-xs">Mobile</span>
              </Button>
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="customerName">Customer Name (Optional)</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Walk-in Customer"
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Phone (Optional)</Label>
              <Input
                id="customerPhone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+1234567890"
              />
            </div>
            <div>
              <Label htmlFor="customerEmail">Email (Optional)</Label>
              <Input
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@example.com"
              />
            </div>
          </div>

          {/* Discount */}
          <div>
            <div>
              <Label htmlFor="discount">Discount (FCFA)</Label>
              <Input
                id="discount"
                type="number"
                step="1"
                min="0"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Amount Tendered (Cash only) */}
          {paymentMethod === 'cash' && (
            <div>
              <Label htmlFor="amountTendered">Amount Tendered</Label>
              <Input
                id="amountTendered"
                type="number"
                step="1"
                min="0"
                value={amountTendered}
                onChange={(e) => setAmountTendered(e.target.value)}
                placeholder="0"
                className="text-lg"
              />
              {change > 0 && (
                <p className="text-sm text-green-600 mt-1">
                  Change: {formatCurrency(change)}
                </p>
              )}
            </div>
          )}

          {/* Totals */}
          <Card className="p-4 bg-gray-50 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount:</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold pt-2 border-t">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </Card>
        </div>

        <div className="p-4 border-t space-y-2">
          <Button
            onClick={handleCheckout}
            disabled={loading || cart.length === 0}
            className="w-full"
            size="lg"
          >
            {loading ? 'Processing...' : `Complete Payment (${formatCurrency(total)})`}
          </Button>
          <Button
            onClick={() => setShowCheckout(false)}
            variant="outline"
            className="w-full"
            disabled={loading}
          >
            Back to Cart
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Current Order</h2>
          {cart.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearCart}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Cart is empty</p>
            <p className="text-sm text-gray-400 mt-1">Add products to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <Card key={`${item.productId}-${item.variantId}`} className="p-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.sku}</p>
                    <p className="text-sm font-bold mt-1">{formatCurrency(item.price)}</p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.productId, item.variantId)}
                      className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        className="h-7 w-7 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        className="h-7 w-7 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    <p className="text-sm font-bold mt-1">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Items:</span>
            <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
        </div>

        <Button
          onClick={() => setShowCheckout(true)}
          disabled={cart.length === 0}
          className="w-full"
          size="lg"
        >
          Checkout ({cart.length} {cart.length === 1 ? 'item' : 'items'})
        </Button>
      </div>
    </div>
  )
}

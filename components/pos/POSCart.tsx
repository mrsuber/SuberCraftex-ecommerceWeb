'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Trash2, Minus, Plus, ShoppingCart, CreditCard, Smartphone, Printer } from 'lucide-react'

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
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile_payment'>('cash')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [amountTendered, setAmountTendered] = useState('')
  const [taxRate, setTaxRate] = useState('10')
  const [discountAmount, setDiscountAmount] = useState('0')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = parseFloat(discountAmount) || 0
  const tax = (subtotal - discount) * (parseFloat(taxRate) / 100)
  const total = subtotal - discount + tax
  const change = amountTendered ? parseFloat(amountTendered) - total : 0

  const handleCheckout = async () => {
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
      // Create order
      const orderResponse = await fetch('/api/pos/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })),
          paymentMethod,
          amountTendered: paymentMethod === 'cash' ? parseFloat(amountTendered) : null,
          customerName: customerName || undefined,
          customerEmail: customerEmail || undefined,
          customerPhone: customerPhone || undefined,
          taxRate: parseFloat(taxRate),
          discountAmount: discount,
        }),
      })

      if (!orderResponse.ok) {
        const data = await orderResponse.json()
        throw new Error(data.error || 'Failed to create order')
      }

      const orderData = await orderResponse.json()
      const orderId = orderData.order.id

      // Process payment
      const paymentResponse = await fetch(`/api/pos/orders/${orderId}/payment`, {
        method: 'POST',
      })

      if (!paymentResponse.ok) {
        throw new Error('Failed to process payment')
      }

      // Show success and print receipt
      alert('Order completed successfully!')

      // Open receipt in new window
      window.open(`/api/pos/receipt/${orderId}`, '_blank')

      // Reset
      setShowCheckout(false)
      setCustomerName('')
      setCustomerPhone('')
      setCustomerEmail('')
      setAmountTendered('')
      setDiscountAmount('0')
      onOrderComplete()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
            <div className="grid grid-cols-3 gap-2 mt-2">
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
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('card')}
                className="flex flex-col h-auto py-3"
              >
                <CreditCard className="w-5 h-5 mb-1" />
                <span className="text-xs">Card</span>
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

          {/* Tax & Discount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="discount">Discount ($)</Label>
              <Input
                id="discount"
                type="number"
                step="0.01"
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
                step="0.01"
                value={amountTendered}
                onChange={(e) => setAmountTendered(e.target.value)}
                placeholder="0.00"
                className="text-lg"
              />
              {change > 0 && (
                <p className="text-sm text-green-600 mt-1">
                  Change: ${change.toFixed(2)}
                </p>
              )}
            </div>
          )}

          {/* Totals */}
          <Card className="p-4 bg-gray-50 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount:</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>Tax ({taxRate}%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2 border-t">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
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
            {loading ? 'Processing...' : `Complete Payment ($${total.toFixed(2)})`}
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
                    <p className="text-sm font-bold mt-1">${item.price}</p>
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
                      ${(item.price * item.quantity).toFixed(2)}
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
            <span>${subtotal.toFixed(2)}</span>
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

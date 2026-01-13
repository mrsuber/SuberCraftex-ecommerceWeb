'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Receipt } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { formatCurrency } from '@/lib/currency'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  createdAt: string
  orderItems: Array<{
    id: string
    productName: string
    quantity: number
    price: number
    total: number
  }>
}

interface POSOrderListProps {
  sessionId: string
  refreshTrigger?: number
}

export default function POSOrderList({ sessionId, refreshTrigger }: POSOrderListProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    loadOrders()
  }, [sessionId, refreshTrigger])

  const loadOrders = async () => {
    try {
      const response = await fetch(`/api/pos/orders?sessionId=${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewReceipt = (orderId: string) => {
    window.open(`/api/pos/receipt/${orderId}`, '_blank')
  }

  const getPaymentMethodBadge = (method: string) => {
    const colors = {
      cash: 'bg-green-100 text-green-800',
      card: 'bg-blue-100 text-blue-800',
      mobile_payment: 'bg-purple-100 text-purple-800',
    }
    return colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Order detail view
  if (selectedOrder) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
            ← Back to Orders
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewReceipt(selectedOrder.id)}
          >
            <Receipt className="w-4 h-4 mr-2" />
            Print Receipt
          </Button>
        </div>

        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <h3 className="font-bold text-lg">{selectedOrder.orderNumber}</h3>
                <p className="text-sm text-gray-600">{selectedOrder.customerName}</p>
              </div>
              <Badge className={getPaymentMethodBadge(selectedOrder.paymentMethod)}>
                {selectedOrder.paymentMethod.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700">Items:</p>
              {selectedOrder.orderItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.quantity}x {item.productName}
                  </span>
                  <span className="font-medium">{formatCurrency(item.total)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{formatCurrency(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="text-xs text-gray-500 pt-2">
              {formatDistanceToNow(new Date(selectedOrder.createdAt), { addSuffix: true })}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Orders list view
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Recent Orders</h3>
        <span className="text-sm text-gray-600">{orders.length} orders</span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No orders yet</p>
          <p className="text-sm text-gray-400 mt-1">Orders will appear here as you process them</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="p-3 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{order.orderNumber}</span>
                    <Badge className={getPaymentMethodBadge(order.paymentMethod)} variant="secondary">
                      {order.paymentMethod === 'mobile_payment' ? 'Mobile' : order.paymentMethod.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{order.customerName}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewReceipt(order.id)
                    }}
                    className="h-7 px-2 mt-1 hover:bg-blue-50"
                    title="Print Receipt"
                  >
                    <Receipt className="w-4 h-4 text-blue-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

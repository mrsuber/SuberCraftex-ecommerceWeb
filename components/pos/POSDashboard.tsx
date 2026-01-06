'use client'

import { useState, useEffect } from 'react'
import POSSessionManager from './POSSessionManager'
import POSProductGrid from './POSProductGrid'
import POSCart from './POSCart'
import POSOrderList from './POSOrderList'
import POSSessionStats from './POSSessionStats'
import { ShoppingCart, Package, DollarSign, Clock } from 'lucide-react'

interface POSSession {
  id: string
  sessionNumber: string
  status: string
  openingBalance: number
  totalSales: number
  totalOrders: number
  totalCash: number
  totalCard: number
  totalMobile: number
  expectedCash: number
  openedAt: string
  cashier: {
    fullName: string
    employeeId?: string
  }
}

interface CartItem {
  productId: string
  variantId?: string
  name: string
  sku: string
  price: number
  quantity: number
  image?: string
}

export default function POSDashboard() {
  const [activeSession, setActiveSession] = useState<POSSession | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Load active session
  useEffect(() => {
    loadActiveSession()
  }, [refreshTrigger])

  const loadActiveSession = async () => {
    try {
      const response = await fetch('/api/pos/session')
      if (response.ok) {
        const session = await response.json()
        setActiveSession(session)
      } else {
        setActiveSession(null)
      }
    } catch (error) {
      console.error('Error loading session:', error)
      setActiveSession(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSessionOpened = (session: POSSession) => {
    setActiveSession(session)
  }

  const handleSessionClosed = () => {
    setActiveSession(null)
    setCart([])
  }

  const handleAddToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(
        i => i.productId === item.productId && i.variantId === item.variantId
      )
      if (existing) {
        return prev.map(i =>
          i.productId === item.productId && i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const handleUpdateQuantity = (productId: string, variantId: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(
        i => !(i.productId === productId && i.variantId === variantId)
      ))
    } else {
      setCart(prev =>
        prev.map(i =>
          i.productId === productId && i.variantId === variantId
            ? { ...i, quantity }
            : i
        )
      )
    }
  }

  const handleRemoveItem = (productId: string, variantId: string | undefined) => {
    setCart(prev => prev.filter(
      i => !(i.productId === productId && i.variantId === variantId)
    ))
  }

  const handleClearCart = () => {
    setCart([])
  }

  const handleOrderComplete = () => {
    setCart([])
    setRefreshTrigger(prev => prev + 1)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading POS...</p>
        </div>
      </div>
    )
  }

  if (!activeSession) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <POSSessionManager
            onSessionOpened={handleSessionOpened}
          />
        </div>
      </div>
    )
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
              <p className="text-sm text-gray-600">
                Session: {activeSession.sessionNumber} | Cashier: {activeSession.cashier.fullName}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Session Sales</div>
                <div className="text-xl font-bold text-green-600">
                  ${activeSession.totalSales.toFixed(2)}
                </div>
              </div>
              <POSSessionManager
                activeSession={activeSession}
                onSessionClosed={handleSessionClosed}
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-xs text-blue-600">Orders</div>
                  <div className="text-lg font-bold text-blue-900">{activeSession.totalOrders}</div>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-xs text-green-600">Cash</div>
                  <div className="text-lg font-bold text-green-900">${activeSession.totalCash.toFixed(2)}</div>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="text-xs text-purple-600">Card</div>
                  <div className="text-lg font-bold text-purple-900">${activeSession.totalCard.toFixed(2)}</div>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="text-xs text-orange-600">Mobile</div>
                  <div className="text-lg font-bold text-orange-900">${activeSession.totalMobile.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Products */}
        <div className="flex-1 overflow-auto p-6">
          <POSProductGrid onAddToCart={handleAddToCart} />
        </div>

        {/* Right Side - Cart */}
        <div className="w-96 bg-white border-l shadow-lg flex flex-col">
          <POSCart
            cart={cart}
            session={activeSession}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onOrderComplete={handleOrderComplete}
          />
        </div>
      </div>
    </div>
  )
}

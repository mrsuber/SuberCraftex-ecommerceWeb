'use client'

import { Card } from '@/components/ui/card'
import { DollarSign, ShoppingCart, CreditCard, Smartphone, TrendingUp, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

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

interface POSSessionStatsProps {
  session: POSSession
}

export default function POSSessionStats({ session }: POSSessionStatsProps) {
  const stats = [
    {
      label: 'Total Sales',
      value: `$${session.totalSales.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Total Orders',
      value: session.totalOrders,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Cash Sales',
      value: `$${session.totalCash.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Card Sales',
      value: `$${session.totalCard.toFixed(2)}`,
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Mobile Sales',
      value: `$${session.totalMobile.toFixed(2)}`,
      icon: Smartphone,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Expected Cash',
      value: `$${session.expectedCash.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ]

  const averageOrderValue = session.totalOrders > 0
    ? (session.totalSales / session.totalOrders).toFixed(2)
    : '0.00'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Session Statistics</h3>
          <p className="text-sm text-gray-600">
            Session {session.sessionNumber}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Started {formatDistanceToNow(new Date(session.openedAt), { addSuffix: true })}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Cashier: {session.cashier.fullName}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className={`p-4 ${stat.bgColor} border-none`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Additional metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Average Order Value</p>
            <p className="text-2xl font-bold text-gray-900">${averageOrderValue}</p>
          </div>
        </Card>
        <Card className="p-4 bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Opening Balance</p>
            <p className="text-2xl font-bold text-gray-900">${session.openingBalance.toFixed(2)}</p>
          </div>
        </Card>
      </div>

      {/* Payment method breakdown */}
      <Card className="p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Payment Method Breakdown</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm text-gray-600">Cash</span>
            </div>
            <span className="text-sm font-medium">
              ${session.totalCash.toFixed(2)}
              {session.totalSales > 0 && (
                <span className="text-xs text-gray-500 ml-2">
                  ({((session.totalCash / session.totalSales) * 100).toFixed(1)}%)
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm text-gray-600">Card</span>
            </div>
            <span className="text-sm font-medium">
              ${session.totalCard.toFixed(2)}
              {session.totalSales > 0 && (
                <span className="text-xs text-gray-500 ml-2">
                  ({((session.totalCard / session.totalSales) * 100).toFixed(1)}%)
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-sm text-gray-600">Mobile Payment</span>
            </div>
            <span className="text-sm font-medium">
              ${session.totalMobile.toFixed(2)}
              {session.totalSales > 0 && (
                <span className="text-xs text-gray-500 ml-2">
                  ({((session.totalMobile / session.totalSales) * 100).toFixed(1)}%)
                </span>
              )}
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}

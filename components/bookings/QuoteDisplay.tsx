import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { FileText, Package, Wrench, DollarSign, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import type { Quote, QuoteStatus } from '@/types'

interface QuoteDisplayProps {
  quote: Quote
  showHistory?: boolean
}

const statusConfig: Record<QuoteStatus, { label: string; variant: any }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  sent: { label: 'Pending Review', variant: 'default' },
  approved: { label: 'Approved', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'destructive' },
  expired: { label: 'Expired', variant: 'secondary' },
}

export function QuoteDisplay({ quote, showHistory = false }: QuoteDisplayProps) {
  const status = statusConfig[quote.status] || statusConfig.draft

  const materialCost = Number(quote.material_cost)
  const laborCost = Number(quote.labor_cost)
  const totalCost = Number(quote.total_cost)
  const downPaymentAmount = Number(quote.down_payment_amount)
  const remainingBalance = totalCost - downPaymentAmount

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Quote Details
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">Quote #{quote.id.slice(0, 8)}</p>
            </div>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {quote.valid_until && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>
                Valid until: {format(new Date(quote.valid_until), 'MMMM d, yyyy')}
              </span>
            </div>
          )}

          {quote.notes && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Notes from team:</p>
              <p className="text-sm text-gray-600">{quote.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Materials Cost */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">Materials</p>
                <p className="text-sm text-gray-500">All required materials</p>
              </div>
            </div>
            <p className="text-lg font-semibold">${materialCost.toFixed(2)}</p>
          </div>

          <Separator />

          {/* Labor Cost */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">Labor</p>
                <p className="text-sm text-gray-500">
                  {Number(quote.labor_hours).toFixed(1)} hours
                </p>
              </div>
            </div>
            <p className="text-lg font-semibold">${laborCost.toFixed(2)}</p>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-primary" />
              <p className="text-lg font-bold">Total Cost</p>
            </div>
            <p className="text-2xl font-bold text-primary">${totalCost.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div>
              <p className="font-medium">Down Payment (Required to Start)</p>
              <p className="text-sm text-gray-600">
                {((downPaymentAmount / totalCost) * 100).toFixed(0)}% of total
              </p>
            </div>
            <p className="text-xl font-bold text-primary">${downPaymentAmount.toFixed(2)}</p>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Remaining Balance</p>
              <p className="text-sm text-gray-600">Due upon completion</p>
            </div>
            <p className="text-lg font-semibold">${remainingBalance.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Quote History */}
      {showHistory && quote.history && quote.history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quote History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quote.history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium capitalize">{entry.action}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(entry.created_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    {entry.notes && <p className="text-sm text-gray-600">{entry.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

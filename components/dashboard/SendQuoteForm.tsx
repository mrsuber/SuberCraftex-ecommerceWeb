"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, DollarSign, Clock, Package, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface SendQuoteFormProps {
  bookingId: string
  bookingNumber: string
  customerName: string
  customerEmail: string
  serviceName: string
  quote: {
    id: string
    materialCost: number
    laborCost: number
    laborHours: number
    totalCost: number
    downPaymentAmount: number
    notes: string | null
    status: string
  }
  materials: Array<{
    name: string
    quantity: number
    price: number
    unit: string
  }>
}

export function SendQuoteForm({
  bookingId,
  bookingNumber,
  customerName,
  customerEmail,
  serviceName,
  quote,
  materials,
}: SendQuoteFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSend = async () => {
    try {
      setIsLoading(true)

      const response = await fetch(`/api/bookings/${bookingId}/quote/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send quote')
      }

      setIsSent(true)
      toast({
        title: 'Quote Sent Successfully',
        description: `Quote has been sent to ${customerEmail}`,
      })

      // Redirect back to booking detail after 2 seconds
      setTimeout(() => {
        router.push(`/dashboard/bookings/${bookingId}`)
      }, 2000)
    } catch (error) {
      console.error('Error sending quote:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send quote',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSent) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-green-900 mb-2">Quote Sent!</h2>
            <p className="text-green-700 mb-4">
              The quote has been sent to {customerEmail}
            </p>
            <p className="text-sm text-green-600">
              Redirecting back to booking details...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Customer Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name:</span>
            <span className="font-medium">{customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium">{customerEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service:</span>
            <span className="font-medium">{serviceName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Booking:</span>
            <span className="font-mono text-sm">{bookingNumber}</span>
          </div>
        </CardContent>
      </Card>

      {/* Quote Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Quote Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Materials */}
          {materials.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Materials</span>
              </div>
              <div className="space-y-2 ml-6">
                {materials.map((material, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {material.name} ({material.quantity} {material.unit})
                    </span>
                    <span className="font-medium">
                      ${(material.price * material.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Material Cost:</span>
                  <span>${quote.materialCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Labor */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Labor</span>
            </div>
            <div className="space-y-2 ml-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {quote.laborHours.toFixed(1)} hours @ $
                  {(quote.laborCost / quote.laborHours).toFixed(2)}/hr
                </span>
                <span className="font-medium">${quote.laborCost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="space-y-2">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Cost:</span>
              <span className="text-primary">${quote.totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Down Payment Required:</span>
              <span className="font-semibold text-orange-600">
                ${quote.downPaymentAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Remaining Balance:</span>
              <span className="font-medium">
                ${(quote.totalCost - quote.downPaymentAmount).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Notes */}
          {quote.notes && (
            <>
              <Separator />
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Notes for Customer:
                </div>
                <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap">
                  {quote.notes}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Warning */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Once sent, the customer will receive an email with the quote details and can approve or reject it.
          After sending, you won't be able to edit the quote unless it's rejected.
        </AlertDescription>
      </Alert>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/bookings/${bookingId}`)}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSend}
          disabled={isLoading}
          className="min-w-[150px]"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Sending...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Send Quote
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}

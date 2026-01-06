'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  CreditCard,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface PaymentPageClientProps {
  data: {
    booking: {
      id: string
      bookingNumber: string
      status: string
      service: {
        id: string
        name: string
        featuredImage: string | null
      }
    }
    quote: {
      id: string
      totalCost: number
      downPaymentAmount: number
      materialCost: number
      laborCost: number
    }
    user: {
      id: string
      email: string
      fullName: string | null
    }
  }
}

export function PaymentPageClient({ data }: PaymentPageClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const { booking, quote, user } = data
  const remainingBalance = quote.totalCost - quote.downPaymentAmount

  const handlePayment = async () => {
    if (!agreeToTerms) {
      toast({
        title: 'Terms Required',
        description: 'Please agree to the terms and conditions',
        variant: 'destructive',
      })
      return
    }

    setIsProcessing(true)

    try {
      // Create payment intent
      const response = await fetch(`/api/bookings/${booking.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: quote.downPaymentAmount,
          paymentType: 'down_payment',
          paymentMethod: 'stripe',
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to process payment')
      }

      const paymentData = await response.json()

      // In a real implementation, this would redirect to Stripe Checkout
      // or use Stripe Elements for card input
      // For now, we'll simulate a successful payment

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mark payment as successful (in real app, this would be handled by Stripe webhook)
      const confirmResponse = await fetch(`/api/bookings/${booking.id}/payments/${paymentData.id}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (confirmResponse.ok) {
        setPaymentSuccess(true)
        toast({
          title: 'Payment Successful!',
          description: 'Your down payment has been processed',
        })

        // Redirect after a short delay
        setTimeout(() => {
          router.push(`/bookings/${booking.id}`)
        }, 2000)
      } else {
        throw new Error('Payment confirmation failed')
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: 'Payment Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (paymentSuccess) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-16 pb-16">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-900">Payment Successful!</h2>
                <p className="text-green-700 mt-2">
                  Your down payment of ${quote.downPaymentAmount.toFixed(2)} has been processed
                </p>
              </div>
              <div className="pt-4">
                <p className="text-sm text-green-700">
                  Work will begin shortly. You'll receive updates as we progress.
                </p>
              </div>
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/bookings/${booking.id}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Booking
        </Link>
        <h1 className="text-3xl font-bold">Complete Payment</h1>
        <p className="text-gray-600 mt-1">Booking #{booking.bookingNumber}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Security Notice */}
          <Alert>
            <ShieldCheck className="h-4 w-4" />
            <AlertDescription>
              Your payment is secure and encrypted. We use Stripe to process all payments safely.
            </AlertDescription>
          </Alert>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </CardTitle>
              <CardDescription>
                Pay securely with your credit or debit card
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* In a real implementation, this would be Stripe Elements */}
              <div className="p-8 border-2 border-dashed rounded-lg text-center">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-2">
                  Stripe payment form would appear here
                </p>
                <p className="text-xs text-gray-500">
                  Card number, expiry, CVC, and billing details
                </p>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2 pt-4">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm cursor-pointer">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary hover:underline">
                    terms and conditions
                  </Link>{' '}
                  and understand that this down payment is required to begin work on my order.
                </Label>
              </div>

              {/* Pay Button */}
              <Button
                onClick={handlePayment}
                disabled={!agreeToTerms || isProcessing}
                size="lg"
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    Pay ${quote.downPaymentAmount.toFixed(2)} Now
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-gray-500">
                You will be charged ${quote.downPaymentAmount.toFixed(2)} today
              </p>
            </CardContent>
          </Card>

          {/* Important Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-2">
                <span className="text-primary font-medium">•</span>
                <p>
                  Down payment is <strong>non-refundable</strong> once work begins
                </p>
              </div>
              <div className="flex gap-2">
                <span className="text-primary font-medium">•</span>
                <p>
                  We'll start working on your order as soon as payment is confirmed
                </p>
              </div>
              <div className="flex gap-2">
                <span className="text-primary font-medium">•</span>
                <p>
                  You'll receive progress updates throughout the production process
                </p>
              </div>
              <div className="flex gap-2">
                <span className="text-primary font-medium">•</span>
                <p>
                  Final payment of ${remainingBalance.toFixed(2)} is due upon completion
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          {/* Service Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Service */}
              <div className="flex gap-3">
                {booking.service.featuredImage && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={booking.service.featuredImage}
                      alt={booking.service.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{booking.service.name}</p>
                  <p className="text-xs text-gray-600">
                    Booking #{booking.bookingNumber}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Cost Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Materials</span>
                  <span>${quote.materialCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Labor</span>
                  <span>${quote.laborCost.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total Cost</span>
                  <span>${quote.totalCost.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              {/* Payment Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Down Payment (Due Now)</span>
                  <span className="font-semibold text-primary">
                    ${quote.downPaymentAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining Balance</span>
                  <span>${remainingBalance.toFixed(2)}</span>
                </div>
              </div>

              <Alert>
                <AlertDescription className="text-xs">
                  The remaining balance of ${remainingBalance.toFixed(2)} will be due when your
                  order is complete and ready for delivery or collection.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-gray-600 mb-3">
                If you have questions about your payment or order, please contact us:
              </p>
              <div className="space-y-2">
                <p className="font-medium">support@subercraftex.com</p>
                <p className="font-medium">+1 (555) 123-4567</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

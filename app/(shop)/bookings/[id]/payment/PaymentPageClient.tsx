'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Banknote, Smartphone } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'
import { MobileMoneyPay } from '@/components/payments/MobileMoneyPay'

interface PaymentPageClientProps {
  data: {
    booking: {
      id: string
      bookingNumber: string
      status: string
      service: { id: string; name: string; featuredImage: string | null }
    }
    balance: { total: number; paid: number; remaining: number; nextType: string; nextAmount: number }
    quote: { materialCost: number; laborCost: number; totalCost: number } | null
    phone: string
  }
}

const TYPE_LABEL: Record<string, string> = {
  down_payment: 'Down payment',
  partial_payment: 'Partial payment',
  final_payment: 'Payment',
}

export function PaymentPageClient({ data }: PaymentPageClientProps) {
  const router = useRouter()
  const { booking, balance, quote, phone } = data

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href={`/bookings/${booking.id}`} className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Booking
        </Link>
        <h1 className="text-3xl font-bold">Complete Payment</h1>
        <p className="text-gray-600 mt-1">Booking #{booking.bookingNumber}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                {TYPE_LABEL[balance.nextType] ?? 'Payment'}: {formatCurrency(balance.nextAmount)}
              </CardTitle>
              <CardDescription>Pay with MTN Mobile Money or Orange Money. You approve it on your phone.</CardDescription>
            </CardHeader>
            <CardContent>
              <MobileMoneyPay
                purpose="booking"
                id={booking.id}
                amount={balance.nextAmount}
                defaultPhone={phone}
                onPaid={() => setTimeout(() => router.push(`/bookings/${booking.id}`), 2000)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="w-5 h-5" />
                Or pay in cash at the shop
              </CardTitle>
              <CardDescription>
                Bring {formatCurrency(balance.nextAmount)} to SuberCraftex. Our staff will record it and your booking moves on.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {booking.service.featuredImage && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                  <Image src={booking.service.featuredImage} alt={booking.service.name} fill className="object-cover" />
                </div>
              )}
              <div className="font-semibold">{booking.service.name}</div>
              {quote && (
                <>
                  <div className="flex justify-between"><span className="text-muted-foreground">Materials</span><span>{formatCurrency(quote.materialCost)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Labour</span><span>{formatCurrency(quote.laborCost)}</span></div>
                </>
              )}
              <Separator />
              <div className="flex justify-between font-medium"><span>Total</span><span>{formatCurrency(balance.total)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Already paid</span><span>{formatCurrency(balance.paid)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Still to pay</span><span>{formatCurrency(balance.remaining)}</span></div>
              <Separator />
              <div className="flex justify-between text-base font-bold"><span>Due now</span><span>{formatCurrency(balance.nextAmount)}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

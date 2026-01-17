'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, ArrowLeft, MapPin, Calendar, DollarSign, Bell } from 'lucide-react'
import { UpcomingService } from '@/types'
import { format } from 'date-fns'

interface UpcomingServiceDetailProps {
  service: UpcomingService
}

interface CountdownValues {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

function useCountdown(targetDate: string): CountdownValues {
  const [countdown, setCountdown] = useState<CountdownValues>(() => {
    const target = new Date(targetDate).getTime()
    const now = Date.now()
    const diff = target - now

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      isExpired: false,
    }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const target = new Date(targetDate).getTime()
      const now = Date.now()
      const diff = target - now

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true })
        clearInterval(interval)
        return
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        isExpired: false,
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return countdown
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate)

  if (isExpired) {
    return (
      <div className="text-center py-8">
        <Badge variant="default" className="text-lg px-6 py-2 bg-green-500 hover:bg-green-600">
          <Clock className="h-5 w-5 mr-2" />
          Available Now
        </Badge>
      </div>
    )
  }

  return (
    <div className="text-center py-8">
      <p className="text-lg text-muted-foreground mb-4">Launching In</p>
      <div className="flex justify-center gap-4">
        <div className="flex flex-col items-center bg-primary/10 rounded-xl px-6 py-4 min-w-[80px]">
          <span className="text-4xl font-bold text-primary">{days}</span>
          <span className="text-sm text-muted-foreground mt-1">days</span>
        </div>
        <div className="flex flex-col items-center bg-primary/10 rounded-xl px-6 py-4 min-w-[80px]">
          <span className="text-4xl font-bold text-primary">{hours}</span>
          <span className="text-sm text-muted-foreground mt-1">hours</span>
        </div>
        <div className="flex flex-col items-center bg-primary/10 rounded-xl px-6 py-4 min-w-[80px]">
          <span className="text-4xl font-bold text-primary">{minutes}</span>
          <span className="text-sm text-muted-foreground mt-1">minutes</span>
        </div>
        <div className="flex flex-col items-center bg-primary/10 rounded-xl px-6 py-4 min-w-[80px]">
          <span className="text-4xl font-bold text-primary">{seconds}</span>
          <span className="text-sm text-muted-foreground mt-1">seconds</span>
        </div>
      </div>
    </div>
  )
}

export function UpcomingServiceDetail({ service }: UpcomingServiceDetailProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/upcoming-services"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Upcoming Services
      </Link>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
          <img
            src={service.image_url}
            alt={service.title}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-3">
              Coming Soon
            </Badge>
            <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
            {service.short_description && (
              <p className="text-lg text-muted-foreground">
                {service.short_description}
              </p>
            )}
          </div>

          {/* Countdown Timer */}
          <Card>
            <CardContent className="p-6">
              <CountdownTimer targetDate={service.service_date} />
            </CardContent>
          </Card>

          {/* Service Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="h-5 w-5" />
              <span>
                {format(new Date(service.service_date), 'EEEE, MMMM d, yyyy • h:mm a')}
              </span>
            </div>

            {service.location && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>{service.location}</span>
              </div>
            )}

            {service.price && (
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <span className="text-2xl font-bold text-primary">
                  ${parseFloat(service.price).toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <div className="flex gap-4">
            {service.service && (
              <Link href={`/services/${service.service.slug}`} className="flex-1">
                <Button size="lg" className="w-full">
                  {service.cta_text || 'Learn More'}
                </Button>
              </Link>
            )}
            <Button size="lg" variant="outline" className="flex-1">
              <Bell className="h-4 w-4 mr-2" />
              Notify Me
            </Button>
          </div>
        </div>
      </div>

      {/* Full Description */}
      {service.description && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">About This Service</h2>
          <Card>
            <CardContent className="p-6">
              <div className="prose prose-gray max-w-none dark:prose-invert">
                <p className="whitespace-pre-wrap">{service.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Related Service */}
      {service.service && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Related Service</h2>
          <Card className="overflow-hidden">
            <div className="flex items-center gap-4 p-4">
              {service.service.featured_image && (
                <img
                  src={service.service.featured_image}
                  alt={service.service.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{service.service.name}</h3>
                <Link href={`/services/${service.service.slug}`}>
                  <Button variant="link" className="p-0 h-auto">
                    View Service
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

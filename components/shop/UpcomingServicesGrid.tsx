'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, ArrowRight, MapPin, Calendar } from 'lucide-react'
import { UpcomingService } from '@/types'
import { format } from 'date-fns'

interface UpcomingServicesGridProps {
  services: UpcomingService[]
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

function CountdownDisplay({ targetDate }: { targetDate: string }) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate)

  if (isExpired) {
    return (
      <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm font-medium">
        <Clock className="h-4 w-4" />
        Available Now
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <div className="flex flex-col items-center bg-primary/10 rounded-lg px-3 py-2 min-w-[50px]">
        <span className="text-xl font-bold text-primary">{days}</span>
        <span className="text-xs text-muted-foreground">days</span>
      </div>
      <div className="flex flex-col items-center bg-primary/10 rounded-lg px-3 py-2 min-w-[50px]">
        <span className="text-xl font-bold text-primary">{hours}</span>
        <span className="text-xs text-muted-foreground">hrs</span>
      </div>
      <div className="flex flex-col items-center bg-primary/10 rounded-lg px-3 py-2 min-w-[50px]">
        <span className="text-xl font-bold text-primary">{minutes}</span>
        <span className="text-xs text-muted-foreground">min</span>
      </div>
      <div className="flex flex-col items-center bg-primary/10 rounded-lg px-3 py-2 min-w-[50px]">
        <span className="text-xl font-bold text-primary">{seconds}</span>
        <span className="text-xs text-muted-foreground">sec</span>
      </div>
    </div>
  )
}

function UpcomingServiceCard({ service }: { service: UpcomingService }) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={service.image_url}
          alt={service.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1">{service.title}</h3>
          {service.location && (
            <div className="flex items-center gap-1 text-white/80 text-sm">
              <MapPin className="h-3 w-3" />
              {service.location}
            </div>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        {service.short_description && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {service.short_description}
          </p>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar className="h-4 w-4" />
          {format(new Date(service.service_date), 'MMMM d, yyyy • h:mm a')}
        </div>

        <CountdownDisplay targetDate={service.service_date} />

        <div className="mt-4 flex items-center justify-between">
          {service.price && (
            <span className="text-lg font-bold text-primary">
              ${parseFloat(service.price).toFixed(2)}
            </span>
          )}
          <Link href={`/upcoming-services/${service.id}`} className="ml-auto">
            <Button variant="outline" size="sm">
              {service.cta_text || 'Learn More'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export function UpcomingServicesGrid({ services }: UpcomingServicesGridProps) {
  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Upcoming Services</h3>
        <p className="text-muted-foreground">
          Check back soon for exciting new services!
        </p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <UpcomingServiceCard key={service.id} service={service} />
      ))}
    </div>
  )
}

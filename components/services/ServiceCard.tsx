'use client'

import { useState, useEffect } from 'react'
import { Service } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Star, Tag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/currency'

interface ServiceCardProps {
  service: Service
}

const DURATION_LABELS: Record<string, string> = {
  half_hour: '30 min',
  one_hour: '1 hour',
  two_hours: '2 hours',
  half_day: '4 hours',
  full_day: '8 hours',
  custom: 'Custom',
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const hasDiscount = service.compare_at_price && service.compare_at_price > service.price
  const discountPercentage = hasDiscount && service.compare_at_price
    ? Math.round(((service.compare_at_price - service.price) / service.compare_at_price) * 100)
    : 0

  const durationLabel = service.duration === 'custom' && service.custom_duration
    ? `${service.custom_duration} min`
    : DURATION_LABELS[service.duration] || '1 hour'

  // Show skeleton during SSR and initial client render
  if (!mounted) {
    return (
      <Card className="h-full overflow-hidden"><div className="relative h-48 bg-muted animate-pulse" /><div className="p-4 space-y-3"><div className="h-3 w-20 bg-muted animate-pulse rounded" /><div className="h-6 bg-muted animate-pulse rounded" /><div className="h-10 bg-muted animate-pulse rounded" /><div className="h-8 bg-muted animate-pulse rounded" /><div className="h-10 bg-muted animate-pulse rounded" /></div></Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Link href={`/services/${service.id}`}>
        <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
          {/* Image */}
          <div className="relative h-48 overflow-hidden bg-muted">
            {service.featured_image ? (
              <Image
                src={service.featured_image}
                alt={service.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                <Tag className="w-16 h-16 text-muted-foreground/20" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {service.is_featured && (
                <Badge variant="default" className="bg-primary text-primary-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              {hasDiscount && (
                <Badge variant="destructive">
                  {discountPercentage}% OFF
                </Badge>
              )}
            </div>

            {/* Duration Badge */}
            <div className="absolute bottom-2 right-2">
              <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                <Clock className="w-3 h-3 mr-1" />
                {durationLabel}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-4 space-y-3">
            {/* Category */}
            {service.category && (
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {service.category.name}
              </div>
            )}

            {/* Title */}
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {service.name}
            </h3>

            {/* Short Description */}
            {service.short_description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {service.short_description}
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                {formatCurrency(Number(service.price))}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(Number(service.compare_at_price))}
                </span>
              )}
            </div>

            {/* CTA Button */}
            <Button className="w-full" variant="default">
              Book Now
            </Button>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

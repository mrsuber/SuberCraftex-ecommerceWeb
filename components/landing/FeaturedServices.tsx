'use client'

import { Service } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Clock, Calendar, ChevronLeft, ChevronRight, Wrench } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import { formatCurrency } from '@/lib/currency'

interface FeaturedServicesProps {
  services: Service[]
}

const DURATION_LABELS: Record<string, string> = {
  half_hour: '30 min',
  one_hour: '1 hour',
  two_hours: '2 hours',
  half_day: '4 hours',
  full_day: '8 hours',
  custom: 'Custom',
}

export function FeaturedServices({ services }: FeaturedServicesProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (services.length === 0) {
    return null
  }

  const itemsPerView = 3
  const maxIndex = Math.max(0, services.length - itemsPerView)

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary-rgb,59,130,246),0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(var(--secondary-rgb,139,92,246),0.1),transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm rounded-full border border-primary/20 shadow-lg">
            <Wrench className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold tracking-wider text-primary">
              PROFESSIONAL SERVICES
            </span>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Book Expert Services
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Schedule appointments with our skilled artisans for custom crafts and professional repairs
            </p>
          </div>
        </motion.div>

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {services.length > itemsPerView && (
            <>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-background border-2 border-primary/20 rounded-full p-3 shadow-lg hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed hidden md:block"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-background border-2 border-primary/20 rounded-full p-3 shadow-lg hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed hidden md:block"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Slider Track */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: `calc(-${currentIndex * (100 / itemsPerView)}% - ${currentIndex * 1.5}rem)` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {services.map((service, index) => {
                const hasDiscount = service.compare_at_price && service.compare_at_price > service.price
                const discountPercentage = hasDiscount && service.compare_at_price
                  ? Math.round(((service.compare_at_price - service.price) / service.compare_at_price) * 100)
                  : 0

                const durationLabel = service.duration === 'custom' && service.custom_duration
                  ? `${service.custom_duration} min`
                  : DURATION_LABELS[service.duration] || '1 hour'

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex-none w-full md:w-[calc(33.333%-1rem)] group"
                  >
                    <Link href={`/services/${service.id}`}>
                      <div className="relative h-full bg-card border-2 border-primary/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/30">
                        {/* Image Section */}
                        <div className="relative h-56 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                          {service.featured_image ? (
                            <Image
                              src={service.featured_image}
                              alt={service.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Wrench className="w-20 h-20 text-primary/30" />
                            </div>
                          )}

                          {/* Overlay Badges */}
                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {service.is_featured && (
                              <Badge className="bg-primary shadow-lg">
                                Featured
                              </Badge>
                            )}
                            {hasDiscount && (
                              <Badge variant="destructive" className="shadow-lg">
                                {discountPercentage}% OFF
                              </Badge>
                            )}
                          </div>

                          {/* Category Badge */}
                          {service.category && (
                            <div className="absolute bottom-4 left-4">
                              <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                                {service.category.name}
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Content Section */}
                        <div className="p-6 space-y-4">
                          <div>
                            <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                              {service.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {service.short_description || service.description || 'Professional service booking available'}
                            </p>
                          </div>

                          {/* Service Details */}
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{durationLabel}</span>
                            </div>
                          </div>

                          {/* Price & Booking */}
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-primary">
                                  {formatCurrency(service.price)}
                                </span>
                                {hasDiscount && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    {formatCurrency(service.compare_at_price!)}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">per session</span>
                            </div>

                            <Button size="sm" className="gap-2">
                              <Calendar className="w-4 h-4" />
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>

          {/* Mobile scroll indicators */}
          {services.length > 1 && (
            <div className="flex justify-center gap-2 mt-6 md:hidden">
              {Array.from({ length: Math.min(services.length, 5) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-primary/30'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button asChild size="lg" className="gap-2">
            <Link href="/services">
              Browse All Services
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { HeroBanner } from '@/types'

interface HeroBannersProps {
  initialBanners: HeroBanner[]
}

export function HeroBanners({ initialBanners }: HeroBannersProps) {
  const [banners, setBanners] = useState(initialBanners)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % banners.length)
    }, 8000) // Change banner every 8 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, banners.length])

  const goToPrevious = () => {
    setCurrentIndex((current) => (current - 1 + banners.length) % banners.length)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex((current) => (current + 1) % banners.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  if (banners.length === 0) {
    // Fallback if no banners
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-secondary/20 py-20 md:py-32">
        <div className="container text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to SuberCraftex</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Premium quality products and professional services
          </p>
          <Button size="lg" asChild>
            <Link href="/catalog">Shop Now</Link>
          </Button>
        </div>
      </section>
    )
  }

  const currentBanner = banners[currentIndex]

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[500px] md:h-[600px] lg:h-[700px]">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentBanner.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{
              backgroundColor: currentBanner.background_color || '#000000',
              color: currentBanner.text_color || '#ffffff',
            }}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <picture>
                <source
                  media="(max-width: 768px)"
                  srcSet={currentBanner.mobile_image_url || currentBanner.image_url}
                />
                <img
                  src={currentBanner.image_url}
                  alt={currentBanner.title}
                  className="w-full h-full object-cover"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative container h-full flex items-center">
              <div className="max-w-2xl space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                    {currentBanner.type.replace('_', ' ').toUpperCase()}
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
                  style={{ color: currentBanner.text_color || '#ffffff' }}
                >
                  {currentBanner.title}
                </motion.h1>

                {currentBanner.subtitle && (
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl md:text-2xl font-medium"
                    style={{ color: currentBanner.text_color || '#ffffff' }}
                  >
                    {currentBanner.subtitle}
                  </motion.p>
                )}

                {currentBanner.description && (
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg md:text-xl opacity-90"
                    style={{ color: currentBanner.text_color || '#ffffff' }}
                  >
                    {currentBanner.description}
                  </motion.p>
                )}

                {currentBanner.cta_text && currentBanner.cta_link && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button
                      size="lg"
                      variant={
                        currentBanner.cta_style === 'secondary'
                          ? 'secondary'
                          : currentBanner.cta_style === 'outline'
                          ? 'outline'
                          : 'default'
                      }
                      className="text-lg px-8 py-6"
                      asChild
                    >
                      <Link href={currentBanner.cta_link}>{currentBanner.cta_text}</Link>
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows (Desktop) */}
        {banners.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
              aria-label="Previous banner"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
              aria-label="Next banner"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {banners.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

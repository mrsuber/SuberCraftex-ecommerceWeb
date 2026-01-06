'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface PhotoGalleryProps {
  photos: string[]
  className?: string
  columns?: number
}

export function PhotoGallery({ photos, className, columns = 4 }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No photos available</p>
      </div>
    )
  }

  const openLightbox = (index: number) => {
    setSelectedIndex(index)
  }

  const closeLightbox = () => {
    setSelectedIndex(null)
  }

  const goToPrevious = () => {
    if (selectedIndex === null) return
    setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length)
  }

  const goToNext = () => {
    if (selectedIndex === null) return
    setSelectedIndex((selectedIndex + 1) % photos.length)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious()
    if (e.key === 'ArrowRight') goToNext()
    if (e.key === 'Escape') closeLightbox()
  }

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  }[columns] || 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

  return (
    <>
      {/* Gallery Grid */}
      <div className={cn('grid gap-4', gridCols, className)}>
        {photos.map((photo, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className="relative aspect-square group overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
          <DialogContent
            className="max-w-7xl w-full p-0 bg-black"
            onKeyDown={handleKeyDown}
          >
            <div className="relative w-full h-[90vh] flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Previous Button */}
              {photos.length > 1 && (
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Image */}
              <img
                src={photos[selectedIndex]}
                alt={`Photo ${selectedIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />

              {/* Next Button */}
              {photos.length > 1 && (
                <button
                  onClick={goToNext}
                  className="absolute right-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white text-sm">
                {selectedIndex + 1} / {photos.length}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

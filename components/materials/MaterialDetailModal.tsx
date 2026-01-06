'use client'

import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { StockIndicator } from './StockIndicator'
import type { Material } from '@/types'
import { Package, Tag, Box, Ruler } from 'lucide-react'

interface MaterialDetailModalProps {
  material: Material
  open: boolean
  onClose: () => void
  onSelect?: (material: Material) => void
  selected?: boolean
}

export function MaterialDetailModal({
  material,
  open,
  onClose,
  onSelect,
  selected = false,
}: MaterialDetailModalProps) {
  const isOutOfStock = material.stockQuantity === 0

  const handleSelect = () => {
    onSelect?.(material)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{material.name}</DialogTitle>
          <DialogDescription>
            SKU: {material.sku}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Material Image */}
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {material.imageUrl ? (
              <Image
                src={material.imageUrl}
                alt={material.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-24 h-24 text-gray-400" />
              </div>
            )}
          </div>

          {/* Price and Stock */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-primary">
                ${Number(material.price).toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">per {material.unit}</div>
            </div>
            <StockIndicator stockQuantity={material.stockQuantity} />
          </div>

          <Separator />

          {/* Material Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Box className="w-4 h-4" />
                <span>Unit</span>
              </div>
              <div className="text-base font-semibold">{material.unit}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Ruler className="w-4 h-4" />
                <span>Stock Quantity</span>
              </div>
              <div className="text-base font-semibold">
                {material.stockQuantity} {material.unit}
                {material.stockQuantity !== 1 ? 's' : ''}
              </div>
            </div>

            {material.category && (
              <div className="space-y-1 col-span-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Tag className="w-4 h-4" />
                  <span>Category</span>
                </div>
                <Badge variant="secondary">{material.category.name}</Badge>
              </div>
            )}
          </div>

          {/* Description */}
          {material.description && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold">Description</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{material.description}</p>
              </div>
            </>
          )}

          {/* Specifications */}
          {material.specifications && Object.keys(material.specifications).length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold">Specifications</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(material.specifications).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="text-sm text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-sm font-medium">{String(value)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Notes */}
          {material.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold">Additional Notes</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{material.notes}</p>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {onSelect && (
            <Button
              onClick={handleSelect}
              disabled={isOutOfStock}
              variant={selected ? 'default' : 'default'}
            >
              {isOutOfStock
                ? 'Out of Stock'
                : selected
                ? 'Selected - Select Again to Deselect'
                : 'Select Material'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

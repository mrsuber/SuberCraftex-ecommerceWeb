'use client'

import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StockIndicator } from './StockIndicator'
import type { Material } from '@/types'
import { Package, Eye } from 'lucide-react'

interface MaterialCardProps {
  material: Material
  selected?: boolean
  onSelect?: (material: Material) => void
  onViewDetails?: (material: Material) => void
  showSelectButton?: boolean
  disabled?: boolean
}

export function MaterialCard({
  material,
  selected = false,
  onSelect,
  onViewDetails,
  showSelectButton = true,
  disabled = false,
}: MaterialCardProps) {
  const isOutOfStock = material.stockQuantity === 0

  return (
    <Card
      className={`overflow-hidden transition-all ${
        selected
          ? 'ring-2 ring-primary border-primary'
          : 'hover:shadow-md'
      } ${disabled || isOutOfStock ? 'opacity-60' : ''}`}
    >
      <CardContent className="p-4">
        {/* Material Image/Placeholder */}
        <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3 relative">
          {material.imageUrl ? (
            <Image
              src={material.imageUrl}
              alt={material.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Material Details */}
        <div className="space-y-2">
          <div>
            <h3 className="font-semibold text-base line-clamp-1">{material.name}</h3>
            <p className="text-sm text-gray-500">SKU: {material.sku}</p>
          </div>

          {material.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{material.description}</p>
          )}

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-lg font-bold text-primary">
                ${Number(material.price).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">per {material.unit}</p>
            </div>

            <StockIndicator stockQuantity={material.stockQuantity} />
          </div>

          {material.category && (
            <p className="text-xs text-gray-500">
              Category: {material.category.name}
            </p>
          )}
        </div>
      </CardContent>

      {showSelectButton && (
        <CardFooter className="p-4 pt-0 flex gap-2">
          {onViewDetails && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onViewDetails(material)}
            >
              <Eye className="w-4 h-4 mr-1" />
              Details
            </Button>
          )}
          <Button
            type="button"
            variant={selected ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
            onClick={() => onSelect?.(material)}
            disabled={disabled || isOutOfStock}
          >
            {isOutOfStock
              ? 'Out of Stock'
              : selected
              ? 'Selected'
              : 'Select'}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

import { cn } from '@/lib/utils'

interface StockIndicatorProps {
  stockQuantity: number
  lowStockThreshold?: number
  className?: string
  showLabel?: boolean
}

export function StockIndicator({
  stockQuantity,
  lowStockThreshold = 10,
  className,
  showLabel = true,
}: StockIndicatorProps) {
  const getStockStatus = () => {
    if (stockQuantity === 0) {
      return {
        label: 'Out of Stock',
        color: 'bg-red-100 text-red-800 border-red-200',
        dotColor: 'bg-red-500',
      }
    }
    if (stockQuantity <= lowStockThreshold) {
      return {
        label: 'Low Stock',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        dotColor: 'bg-yellow-500',
      }
    }
    return {
      label: 'In Stock',
      color: 'bg-green-100 text-green-800 border-green-200',
      dotColor: 'bg-green-500',
    }
  }

  const status = getStockStatus()

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        status.color,
        className
      )}
    >
      <span className={cn('w-2 h-2 rounded-full', status.dotColor)} />
      {showLabel && <span>{status.label}</span>}
      <span className="font-semibold">({stockQuantity})</span>
    </div>
  )
}

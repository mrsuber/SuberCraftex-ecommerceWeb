'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface MaterialQuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  unit?: string
  disabled?: boolean
  className?: string
}

export function MaterialQuantitySelector({
  value,
  onChange,
  min = 1,
  max = 1000,
  step = 1,
  label,
  unit = 'units',
  disabled = false,
  className,
}: MaterialQuantitySelectorProps) {
  const [inputValue, setInputValue] = useState(value.toString())

  const handleIncrement = () => {
    const newValue = Math.min(value + step, max)
    onChange(newValue)
    setInputValue(newValue.toString())
  }

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min)
    onChange(newValue)
    setInputValue(newValue.toString())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value
    setInputValue(inputVal)

    const numValue = parseFloat(inputVal)
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue)
    }
  }

  const handleBlur = () => {
    // Reset to valid value on blur
    const numValue = parseFloat(inputValue)
    if (isNaN(numValue) || numValue < min || numValue > max) {
      setInputValue(value.toString())
    } else {
      setInputValue(numValue.toString())
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
        >
          <Minus className="w-4 h-4" />
        </Button>

        <div className="flex-1 relative">
          <Input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className="text-center"
          />
          {unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
              {unit}
            </span>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {max < 1000 && (
        <p className="text-xs text-gray-500">
          Available: {max} {unit}
        </p>
      )}
    </div>
  )
}

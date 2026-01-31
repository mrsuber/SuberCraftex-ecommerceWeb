'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Check, Palette } from 'lucide-react'

interface DesignOption {
  id: string
  name: string
  imageUrl: string
  description: string | null
  sortOrder: number
  isActive: boolean
}

interface DesignCategory {
  id: string
  name: string
  description: string | null
  isRequired: boolean
  options: DesignOption[]
}

export interface DesignSelection {
  categoryId: string
  categoryName: string
  optionIds: Array<{
    optionId: string
    optionName: string
    imageUrl: string
  }>
}

interface DesignOptionsPickerProps {
  serviceId: string
  value: DesignSelection[]
  onChange: (selections: DesignSelection[]) => void
}

export function DesignOptionsPicker({ serviceId, value, onChange }: DesignOptionsPickerProps) {
  const [categories, setCategories] = useState<DesignCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/services/${serviceId}/design-categories`)
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('Error fetching design categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [serviceId])

  const toggleOption = (category: DesignCategory, option: DesignOption) => {
    const existingCatIndex = value.findIndex((s) => s.categoryId === category.id)
    const optionEntry = {
      optionId: option.id,
      optionName: option.name,
      imageUrl: option.imageUrl,
    }

    let newSelections = [...value]

    if (existingCatIndex >= 0) {
      const existingCat = newSelections[existingCatIndex]
      const optionSelected = existingCat.optionIds.some((o) => o.optionId === option.id)

      if (optionSelected) {
        // Deselect this option
        const filtered = existingCat.optionIds.filter((o) => o.optionId !== option.id)
        if (filtered.length === 0) {
          // Remove entire category entry
          newSelections.splice(existingCatIndex, 1)
        } else {
          newSelections[existingCatIndex] = {
            ...existingCat,
            optionIds: filtered,
          }
        }
      } else {
        // Add this option to the category
        newSelections[existingCatIndex] = {
          ...existingCat,
          optionIds: [...existingCat.optionIds, optionEntry],
        }
      }
    } else {
      // New category selection
      newSelections.push({
        categoryId: category.id,
        categoryName: category.name,
        optionIds: [optionEntry],
      })
    }

    onChange(newSelections)
  }

  const isOptionSelected = (categoryId: string, optionId: string) => {
    const cat = value.find((s) => s.categoryId === categoryId)
    return cat?.optionIds.some((o) => o.optionId === optionId) ?? false
  }

  const getCategorySelectionCount = (categoryId: string) => {
    const cat = value.find((s) => s.categoryId === categoryId)
    return cat?.optionIds.length ?? 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Palette className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Design Options</h3>
      </div>

      {categories.map((category) => {
        const count = getCategorySelectionCount(category.id)
        const isMissing = category.isRequired && count === 0

        return (
          <Card key={category.id} className={isMissing ? 'border-orange-300' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  Select {category.name}
                  {category.isRequired && (
                    <Badge variant="secondary" className="text-xs">Required</Badge>
                  )}
                </CardTitle>
                {count > 0 && (
                  <Badge variant="default" className="text-xs">
                    {count} selected
                  </Badge>
                )}
              </div>
              {category.description && (
                <p className="text-sm text-muted-foreground">{category.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {category.options.map((option) => {
                  const selected = isOptionSelected(category.id, option.id)

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleOption(category, option)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                        selected
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-transparent hover:border-muted-foreground/30'
                      }`}
                    >
                      <div className="aspect-square bg-muted">
                        <img
                          src={option.imageUrl}
                          alt={option.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2 text-left">
                        <p className="text-sm font-medium truncate">{option.name}</p>
                        {option.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {option.description}
                          </p>
                        )}
                      </div>
                      {selected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

'use client'

import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Hammer, Wrench, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Service, ServiceType } from '@/types'

interface ServiceTypeSelectorProps {
  service: Service
  selectedType: ServiceType | null
  onSelectType: (type: ServiceType) => void
  className?: string
}

const serviceTypeConfig = {
  onsite: {
    icon: MapPin,
    title: 'On-Site Service',
    description: 'We come to your location for installation, repair, or consultation',
    features: ['Schedule appointment', 'We visit your location', 'Quick turnaround'],
  },
  custom_production: {
    icon: Hammer,
    title: 'Custom Production',
    description: 'Create something completely new from scratch with your specifications',
    features: ['Browse materials', 'Custom design', 'Quote-based pricing'],
  },
  collect_repair: {
    icon: Wrench,
    title: 'Collect & Repair',
    description: 'Workshop service for repairs, renewals, and restorations',
    features: ['Drop-off or collection', 'Workshop service', 'Progress tracking'],
  },
}

export function ServiceTypeSelector({
  service,
  selectedType,
  onSelectType,
  className,
}: ServiceTypeSelectorProps) {
  const availableTypes: ServiceType[] = []

  if (service.supportsOnsite) availableTypes.push('onsite')
  if (service.supportsCustomProduction) availableTypes.push('custom_production')
  if (service.supportsCollectRepair) availableTypes.push('collect_repair')

  // If only one type is available, auto-select it
  if (availableTypes.length === 1 && !selectedType) {
    onSelectType(availableTypes[0])
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Service Type</h3>
        <p className="text-sm text-gray-600">
          Choose how you'd like to receive this service
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {availableTypes.map((type) => {
          const config = serviceTypeConfig[type]
          const Icon = config.icon
          const isSelected = selectedType === type

          return (
            <Card
              key={type}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                isSelected && 'ring-2 ring-primary border-primary'
              )}
              onClick={() => onSelectType(type)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={cn(
                      'p-3 rounded-lg',
                      isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  {isSelected && (
                    <div className="bg-primary text-white p-1 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <h4 className="font-semibold mb-2">{config.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{config.description}</p>

                <ul className="space-y-1.5">
                  {config.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {availableTypes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No service types available for this service</p>
        </div>
      )}
    </div>
  )
}

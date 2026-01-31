'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { ServiceTypeSelector } from './ServiceTypeSelector'
import { OnsiteBookingForm, OnsiteBookingData } from './onsite/OnsiteBookingForm'
import { CustomProductionForm, CustomProductionData } from './custom/CustomProductionForm'
import { CollectRepairForm, CollectRepairData } from './collect/CollectRepairForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle } from 'lucide-react'
import type { Service, ServiceType } from '@/types'

interface EnhancedServiceBookingFormProps {
  service: Service
}

export function EnhancedServiceBookingForm({ service }: EnhancedServiceBookingFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingCreated, setBookingCreated] = useState(false)

  const handleOnsiteSubmit = async (data: OnsiteBookingData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.id,
          scheduledDate: data.scheduledDate.toISOString(),
          scheduledTime: data.scheduledTime,
          customerNotes: data.notes,
          serviceType: 'onsite',
          requirementPhotos: data.requirementPhotos,
          // These would come from user profile or be collected separately
          customerName: 'Current User', // TODO: Get from session
          customerEmail: 'user@example.com', // TODO: Get from session
        }),
      })

      if (response.ok) {
        const booking = await response.json()
        setBookingCreated(true)
        toast({
          title: 'Booking Created!',
          description: `Your on-site service is scheduled for ${data.scheduledTime}`,
        })

        // Redirect to booking detail after 2 seconds
        setTimeout(() => {
          router.push(`/bookings/${booking.id}`)
        }, 2000)
      } else {
        const error = await response.json()
        toast({
          title: 'Booking Failed',
          description: error.error || 'Failed to create booking',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCustomProductionSubmit = async (data: CustomProductionData) => {
    setIsSubmitting(true)

    try {
      // First create the booking
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.id,
          serviceType: 'custom_production',
          requirementPhotos: data.desiredProductPhotos,
          desiredOutcome: data.customizationNotes,
          customerNotes: data.customizationNotes,
          materials: data.selectedMaterials,
          designSelections: data.designSelections,
          // TODO: Get from session
          customerName: 'Current User',
          customerEmail: 'user@example.com',
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create booking')
      }

      const booking = await response.json()

      // Create material requests if any
      if (data.materialRequests.length > 0) {
        for (const request of data.materialRequests) {
          await fetch(`/api/bookings/${booking.id}/material-requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
          })
        }
      }

      setBookingCreated(true)
      toast({
        title: 'Quote Request Submitted!',
        description: "We'll review your requirements and send you a custom quote soon",
      })

      setTimeout(() => {
        router.push(`/bookings/${booking.id}`)
      }, 2000)
    } catch (error) {
      console.error('Error creating booking:', error)
      toast({
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCollectRepairSubmit = async (data: CollectRepairData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.id,
          serviceType: 'collect_repair',
          collectionMethod: data.collectionMethod,
          requirementPhotos: data.itemPhotos,
          desiredOutcome: data.desiredOutcome,
          customerNotes: data.additionalNotes,
          // TODO: Get from session
          customerName: 'Current User',
          customerEmail: 'user@example.com',
        }),
      })

      if (response.ok) {
        const booking = await response.json()
        setBookingCreated(true)
        toast({
          title: 'Quote Request Submitted!',
          description: "We'll review your item and send you a repair quote",
        })

        setTimeout(() => {
          router.push(`/bookings/${booking.id}`)
        }, 2000)
      } else {
        const error = await response.json()
        toast({
          title: 'Submission Failed',
          description: error.error || 'Failed to submit request',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show success message
  if (bookingCreated) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900">Success!</h3>
              <p className="text-sm text-green-700 mt-1">
                Redirecting to your booking details...
              </p>
            </div>
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-green-600" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Service Type Selection */}
      <ServiceTypeSelector
        service={service}
        selectedType={selectedServiceType}
        onSelectType={setSelectedServiceType}
      />

      {/* Info Alert */}
      {selectedServiceType && (
        <Alert>
          <AlertDescription>
            {selectedServiceType === 'onsite' && (
              <>Fill in the details below to schedule your on-site service appointment.</>
            )}
            {selectedServiceType === 'custom_production' && (
              <>
                Select your materials and describe what you'd like us to create. We'll provide a
                custom quote based on your requirements.
              </>
            )}
            {selectedServiceType === 'collect_repair' && (
              <>
                Upload photos of your item and describe the work needed. We'll review and send you
                a quote for the repair or renewal.
              </>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Booking Forms */}
      {selectedServiceType === 'onsite' && (
        <Card>
          <CardHeader>
            <CardTitle>Book On-Site Service</CardTitle>
          </CardHeader>
          <CardContent>
            <OnsiteBookingForm
              service={service}
              onSubmit={handleOnsiteSubmit}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      )}

      {selectedServiceType === 'custom_production' && (
        <Card>
          <CardHeader>
            <CardTitle>Custom Production Request</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomProductionForm
              service={service}
              onSubmit={handleCustomProductionSubmit}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      )}

      {selectedServiceType === 'collect_repair' && (
        <Card>
          <CardHeader>
            <CardTitle>Collect & Repair Request</CardTitle>
          </CardHeader>
          <CardContent>
            <CollectRepairForm
              service={service}
              onSubmit={handleCollectRepairSubmit}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { ServiceTypeSelector } from './ServiceTypeSelector'
import { OnsiteBookingForm, OnsiteBookingData } from './onsite/OnsiteBookingForm'
import { CustomProductionForm, CustomProductionData } from './custom/CustomProductionForm'
import { CollectRepairForm, CollectRepairData } from './collect/CollectRepairForm'
import { DesignOptionsPicker, DesignSelection } from './DesignOptionsPicker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, LogIn, MapPin, Phone, User } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import type { Service, ServiceType } from '@/types'

export interface BookingCustomer {
  name: string
  email: string
  phone: string
}

interface EnhancedServiceBookingFormProps {
  service: Service
  /** The signed-in customer, or null for a visitor (who is asked to sign in) */
  customer: BookingCustomer | null
}

export function EnhancedServiceBookingForm({ service, customer }: EnhancedServiceBookingFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingCreated, setBookingCreated] = useState(false)
  const [designSelections, setDesignSelections] = useState<DesignSelection[]>([])
  const [contact, setContact] = useState({
    name: customer?.name ?? '',
    phone: customer?.phone ?? '',
    address: '',
  })

  /** Who is booking and where; checked before anything is sent */
  const contactFields = (needsAddress: boolean) => {
    if (!contact.name.trim()) return { error: 'Please give your name' }
    if (needsAddress && !contact.phone.trim()) return { error: 'Please give a phone number so we can reach you' }
    if (needsAddress && !contact.address.trim()) return { error: 'Please tell us where the work is (address or landmark)' }
    return {
      fields: {
        customerName: contact.name.trim(),
        customerPhone: contact.phone.trim() || undefined,
        serviceAddress: contact.address.trim() || undefined,
      },
    }
  }

  const refuse = (description: string) => {
    toast({ title: 'Almost there', description, variant: 'destructive' })
  }

  const handleOnsiteSubmit = async (data: OnsiteBookingData) => {
    const who = contactFields(true)
    if (who.error) return refuse(who.error)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.id,
          // The day picked on the calendar, as a plain date: no time zone can shift it
          scheduledDate: format(data.scheduledDate, 'yyyy-MM-dd'),
          scheduledTime: data.scheduledTime,
          customerNotes: data.notes,
          serviceType: 'onsite',
          requirementPhotos: data.requirementPhotos,
          designSelections: designSelections.length > 0 ? designSelections : undefined,
          ...who.fields,
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
    const who = contactFields(false)
    if (who.error) return refuse(who.error)
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
          designSelections: designSelections.length > 0 ? designSelections : undefined,
          ...who.fields,
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
    const who = contactFields(data.collectionMethod === 'admin_collects')
    if (who.error) return refuse(who.error)
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
          designSelections: designSelections.length > 0 ? designSelections : undefined,
          ...who.fields,
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

  // Bookings belong to an account: that is how the customer follows the job, sees the
  // invoice and pays. Visitors sign in (or register) and come straight back here.
  if (!customer) {
    const back = `/services/${service.id}`
    return (
      <Card>
        <CardContent className="pt-6 space-y-4 text-center">
          <LogIn className="w-10 h-10 mx-auto text-primary" />
          <div>
            <h3 className="text-lg font-semibold">Sign in to book this service</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Your account lets you follow the job, receive your invoice and pay by Mobile Money.
              Prefer to call? We can book it for you by phone.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button asChild>
              <Link href={`/login?next=${encodeURIComponent(back)}`}>Sign in</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/register?next=${encodeURIComponent(back)}`}>Create an account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const addressRequired = selectedServiceType === 'onsite'

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

      {/* Design Options - shown for all service types */}
      {selectedServiceType && (
        <DesignOptionsPicker
          serviceId={service.id}
          value={designSelections}
          onChange={setDesignSelections}
        />
      )}

      {/* Who and where */}
      {selectedServiceType && (
        <Card>
          <CardHeader>
            <CardTitle>Your details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="booking-name" className="flex items-center gap-2"><User className="w-4 h-4" /> Name</Label>
              <Input
                id="booking-name"
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="booking-phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> Phone {addressRequired ? '' : '(optional)'}
              </Label>
              <Input
                id="booking-phone"
                type="tel"
                inputMode="tel"
                placeholder="6XX XXX XXX"
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                autoComplete="tel"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="booking-address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {selectedServiceType === 'collect_repair'
                  ? 'Collection address (if we pick the item up)'
                  : `Where is the work? ${addressRequired ? '' : '(optional)'}`}
              </Label>
              <Input
                id="booking-address"
                placeholder="Neighbourhood, street, landmark — e.g. Bonamoussadi, behind Total station"
                value={contact.address}
                onChange={(e) => setContact({ ...contact, address: e.target.value })}
                autoComplete="street-address"
              />
            </div>
            <p className="text-xs text-muted-foreground sm:col-span-2">
              Confirmations and your invoice go to {customer.email}.
            </p>
          </CardContent>
        </Card>
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

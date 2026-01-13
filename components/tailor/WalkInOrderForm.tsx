'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Upload, X, User, Wrench, Package, FileText, Search } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'
import { Badge } from '@/components/ui/badge'

interface Service {
  id: string
  name: string
  slug: string
  price: number
  supportsCustomProduction: boolean
  supportsCollectRepair: boolean
  category: {
    name: string
  } | null
}

interface Material {
  id: string
  name: string
  price: number
  unit: string
  stockQuantity: number
}

interface WalkInOrderFormProps {
  services: Service[]
  materials: Material[]
}

export function WalkInOrderForm({ services, materials }: WalkInOrderFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([])
  const [createMeasurementAfter, setCreateMeasurementAfter] = useState(false)
  const [customerSearchQuery, setCustomerSearchQuery] = useState('')
  const [searchingCustomer, setSearchingCustomer] = useState(false)
  const [customerSuggestions, setCustomerSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [formData, setFormData] = useState({
    // Customer info
    customerName: '',
    customerEmail: '',
    customerPhone: '',

    // Service details
    serviceId: '',
    serviceType: 'custom_production' as 'custom_production' | 'collect_repair',
    collectionMethod: 'customer_brings' as 'customer_brings' | 'admin_collects',

    // Requirements
    desiredOutcome: '',
    customerNotes: '',
    requirementPhotos: [] as string[],

    // Materials
    customerProvidedMaterials: false, // Customer brought their own materials
    selectedMaterials: [] as { materialId: string; quantity: number }[],
  })

  const handleServiceChange = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId)
    setSelectedService(service || null)
    setFormData((prev) => ({
      ...prev,
      serviceId,
      // Reset service type to first available option
      serviceType: service?.supportsCustomProduction
        ? 'custom_production'
        : 'collect_repair',
    }))
  }

  const handleMaterialToggle = (materialId: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        selectedMaterials: [
          ...prev.selectedMaterials,
          { materialId, quantity: 1 },
        ],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        selectedMaterials: prev.selectedMaterials.filter(
          (m) => m.materialId !== materialId
        ),
      }))
    }
  }

  const handleMaterialQuantityChange = (materialId: string, quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedMaterials: prev.selectedMaterials.map((m) =>
        m.materialId === materialId ? { ...m, quantity } : m
      ),
    }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    // Validate file count
    if (photoPreviewUrls.length + files.length > 10) {
      toast({
        title: 'Error',
        description: 'Maximum 10 photos allowed',
        variant: 'destructive',
      })
      return
    }

    // Validate file size and type
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Error',
          description: 'Only image files are allowed',
          variant: 'destructive',
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: `File ${file.name} is too large. Maximum 5MB per photo`,
          variant: 'destructive',
        })
        return
      }
    }

    // Convert to base64 and create previews
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setPhotoPreviewUrls((prev) => [...prev, base64String])
        setFormData((prev) => ({
          ...prev,
          requirementPhotos: [...prev.requirementPhotos, base64String],
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemovePhoto = (index: number) => {
    setPhotoPreviewUrls((prev) => prev.filter((_, i) => i !== index))
    setFormData((prev) => ({
      ...prev,
      requirementPhotos: prev.requirementPhotos.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.serviceId) {
      toast({
        title: 'Error',
        description: 'Please select a service',
        variant: 'destructive',
      })
      return
    }

    if (!formData.customerName || !formData.customerEmail) {
      toast({
        title: 'Error',
        description: 'Please provide customer name and email',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: formData.serviceId,
          serviceType: formData.serviceType,
          collectionMethod:
            formData.serviceType === 'collect_repair'
              ? formData.collectionMethod
              : null,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          desiredOutcome: formData.desiredOutcome,
          customerNotes: formData.customerNotes,
          requirementPhotos: formData.requirementPhotos,
          customerProvidedMaterials: formData.customerProvidedMaterials,
          materials: formData.selectedMaterials,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking')
      }

      toast({
        title: 'Success',
        description: `Booking ${data.bookingNumber} created successfully`,
      })

      // Redirect based on user preference
      if (createMeasurementAfter) {
        router.push(`/dashboard/bookings/${data.id}/measurement`)
      } else {
        router.push(`/dashboard/bookings/${data.id}/quote/create`)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create booking',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Information
          </CardTitle>
          <CardDescription>
            Enter the customer&apos;s contact details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Customer Search */}
          <div className="p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Label className="font-medium">Quick Customer Lookup (Optional)</Label>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Search for existing customer by email or phone to auto-fill information
            </p>
            <div className="relative">
              <Input
                placeholder="Search by email or phone number..."
                value={customerSearchQuery}
                onChange={(e) => {
                  setCustomerSearchQuery(e.target.value)
                  if (e.target.value.length >= 3) {
                    // Simple local search through recent customers
                    // In production, this would be an API call
                    setShowSuggestions(true)
                  } else {
                    setShowSuggestions(false)
                  }
                }}
                onFocus={() => {
                  if (customerSearchQuery.length >= 3) setShowSuggestions(true)
                }}
                className="pr-10"
              />
              {searchingCustomer && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            {showSuggestions && customerSuggestions.length > 0 && (
              <div className="mt-2 border rounded-lg bg-background divide-y max-h-48 overflow-y-auto">
                {customerSuggestions.map((customer) => (
                  <button
                    key={customer.id}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        customerName: customer.fullName,
                        customerEmail: customer.email,
                        customerPhone: customer.phone || '',
                      }))
                      setShowSuggestions(false)
                      setCustomerSearchQuery('')
                      toast({
                        title: 'Customer Selected',
                        description: `Auto-filled information for ${customer.fullName}`,
                      })
                    }}
                    className="w-full p-3 text-left hover:bg-muted transition-colors"
                  >
                    <div className="font-medium">{customer.fullName}</div>
                    <div className="text-sm text-muted-foreground">
                      {customer.email} {customer.phone && ` • ${customer.phone}`}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Full Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, customerName: e.target.value }))
                }
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone Number</Label>
              <Input
                id="customerPhone"
                type="tel"
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, customerPhone: e.target.value }))
                }
                placeholder="+237 6XX XXX XXX"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email Address *</Label>
            <Input
              id="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, customerEmail: e.target.value }))
              }
              placeholder="customer@example.com"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Service Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Service Details
          </CardTitle>
          <CardDescription>
            Select the service and type of work
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service">Service *</Label>
            <Select value={formData.serviceId} onValueChange={handleServiceChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - {formatCurrency(service.price)} (
                    {service.category?.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedService && (
            <div className="space-y-2">
              <Label>Service Type *</Label>
              <div className="space-y-2">
                {selectedService.supportsCustomProduction && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="custom_production"
                      name="serviceType"
                      value="custom_production"
                      checked={formData.serviceType === 'custom_production'}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          serviceType: e.target.value as 'custom_production',
                        }))
                      }
                      className="h-4 w-4"
                    />
                    <Label htmlFor="custom_production" className="font-normal">
                      Custom Production - Create from scratch
                    </Label>
                  </div>
                )}
                {selectedService.supportsCollectRepair && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="collect_repair"
                      name="serviceType"
                      value="collect_repair"
                      checked={formData.serviceType === 'collect_repair'}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          serviceType: e.target.value as 'collect_repair',
                        }))
                      }
                      className="h-4 w-4"
                    />
                    <Label htmlFor="collect_repair" className="font-normal">
                      Collect & Repair - Fix or renew existing item
                    </Label>
                  </div>
                )}
              </div>
            </div>
          )}

          {formData.serviceType === 'collect_repair' && (
            <div className="space-y-2">
              <Label>Collection Method</Label>
              <Select
                value={formData.collectionMethod}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    collectionMethod: value as 'customer_brings' | 'admin_collects',
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer_brings">
                    Customer brings item to shop
                  </SelectItem>
                  <SelectItem value="admin_collects">
                    We collect from customer location
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Requirements & Details
          </CardTitle>
          <CardDescription>
            Describe what the customer wants
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="desiredOutcome">Desired Outcome</Label>
            <Textarea
              id="desiredOutcome"
              value={formData.desiredOutcome}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, desiredOutcome: e.target.value }))
              }
              placeholder="Describe what the customer wants (e.g., 'Wedding dress with lace details')"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerNotes">Additional Notes</Label>
            <Textarea
              id="customerNotes"
              value={formData.customerNotes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, customerNotes: e.target.value }))
              }
              placeholder="Any special requests or important details"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Photo Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Requirement Photos (Optional)
          </CardTitle>
          <CardDescription>
            Upload reference images or photos of items (max 10 photos, 5MB each)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photoUpload">Upload Photos</Label>
            <Input
              id="photoUpload"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              {photoPreviewUrls.length}/10 photos uploaded
            </p>
          </div>

          {/* Photo Previews */}
          {photoPreviewUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photoPreviewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Requirement photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Materials Selection */}
      {materials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Select Materials (Optional)
            </CardTitle>
            <CardDescription>
              Choose materials needed for this order
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Customer Provided Materials Checkbox */}
            <div className="mb-6 p-4 border rounded-lg bg-muted/50">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="customerProvidedMaterials"
                  checked={formData.customerProvidedMaterials}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      customerProvidedMaterials: checked as boolean,
                      // Clear selected materials when customer provides their own
                      selectedMaterials: checked ? [] : prev.selectedMaterials,
                    }))
                  }
                />
                <div className="flex-1">
                  <Label
                    htmlFor="customerProvidedMaterials"
                    className="font-medium cursor-pointer"
                  >
                    Customer provided all materials
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Check this if the customer brought their own fabric, zippers, buttons, and all
                    other materials needed for this project
                  </p>
                </div>
              </div>
            </div>

            {/* Materials List - Hidden when customer provides materials */}
            {!formData.customerProvidedMaterials && (
              <div className="space-y-3">
                {materials.slice(0, 10).map((material) => {
                const isSelected = formData.selectedMaterials.some(
                  (m) => m.materialId === material.id
                )
                const selectedMaterial = formData.selectedMaterials.find(
                  (m) => m.materialId === material.id
                )

                return (
                  <div
                    key={material.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={`material-${material.id}`}
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleMaterialToggle(material.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`material-${material.id}`}
                        className="font-normal cursor-pointer"
                      >
                        <div>
                          <div className="font-medium">{material.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(material.price)} per {material.unit} •{' '}
                            {material.stockQuantity} {material.unit}s in stock
                          </div>
                        </div>
                      </Label>
                    </div>
                    {isSelected && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max={material.stockQuantity}
                          value={selectedMaterial?.quantity || 1}
                          onChange={(e) =>
                            handleMaterialQuantityChange(
                              material.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-20"
                        />
                        <span className="text-sm text-muted-foreground">
                          {material.unit}s
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
              </div>
            )}

            {/* Show message when customer provides materials */}
            {formData.customerProvidedMaterials && (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Customer provided all materials</p>
                <p className="text-sm">No materials will be ordered from inventory for this booking</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cost Summary */}
      {selectedService && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Estimated Cost Summary</CardTitle>
            <CardDescription>
              Initial estimate - final quote will be provided after assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Service Cost */}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Service Fee</span>
                <span className="font-medium">{formatCurrency(selectedService.price)}</span>
              </div>

              {/* Materials Cost */}
              {!formData.customerProvidedMaterials &&
                formData.selectedMaterials.length > 0 && (
                  <>
                    <div className="border-t pt-3">
                      <div className="text-sm font-medium mb-2">Materials</div>
                      {formData.selectedMaterials.map((sm) => {
                        const material = materials.find((m) => m.id === sm.materialId)
                        if (!material) return null
                        const subtotal = material.price * sm.quantity
                        return (
                          <div
                            key={sm.materialId}
                            className="flex justify-between items-center text-sm mb-1"
                          >
                            <span className="text-muted-foreground">
                              {material.name} ({sm.quantity} {material.unit}
                              {sm.quantity > 1 ? 's' : ''})
                            </span>
                            <span>{formatCurrency(subtotal)}</span>
                          </div>
                        )
                      })}
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Materials Subtotal</span>
                        <span className="font-medium">
                          {formatCurrency(
                            formData.selectedMaterials.reduce((total, sm) => {
                              const material = materials.find((m) => m.id === sm.materialId)
                              return total + (material ? material.price * sm.quantity : 0)
                            }, 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </>
                )}

              {/* Customer Provided Materials Note */}
              {formData.customerProvidedMaterials && (
                <div className="border-t pt-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>Customer provided all materials</span>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="border-t pt-3">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Estimated Total</span>
                  <span className="font-bold text-primary">
                    {formatCurrency(
                      selectedService.price +
                        (formData.customerProvidedMaterials
                          ? 0
                          : formData.selectedMaterials.reduce((total, sm) => {
                              const material = materials.find((m) => m.id === sm.materialId)
                              return total + (material ? material.price * sm.quantity : 0)
                            }, 0))
                    )}
                  </span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground mt-2">
                * This is an initial estimate. The tailor will provide a detailed quote after
                assessment and measurements.
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>What happens after creating this booking?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="createMeasurementAfter"
              checked={createMeasurementAfter}
              onCheckedChange={(checked) => setCreateMeasurementAfter(checked as boolean)}
            />
            <Label htmlFor="createMeasurementAfter" className="font-normal cursor-pointer">
              Take measurements immediately after creating booking
            </Label>
          </div>
          <div className="text-sm text-muted-foreground pl-7">
            {createMeasurementAfter ? (
              <>
                <strong>Selected:</strong> You&apos;ll be redirected to the measurement page
                to record customer measurements right away.
              </>
            ) : (
              <>
                <strong>Default:</strong> You&apos;ll be redirected to create a detailed quote
                for the customer based on requirements.
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading || !selectedService}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {createMeasurementAfter ? 'Create & Take Measurements' : 'Create & Make Quote'}
        </Button>
      </div>
    </form>
  )
}

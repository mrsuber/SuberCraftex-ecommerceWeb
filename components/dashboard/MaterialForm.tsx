'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Package } from 'lucide-react'

interface Service {
  id: string
  name: string
}

interface ServiceCategory {
  id: string
  name: string
}

interface MaterialFormData {
  id?: string
  sku: string
  name: string
  description: string
  price: number
  stockQuantity: number
  unit: string
  imageUrl: string
  serviceCategoryId: string
  isActive: boolean
  serviceIds: string[]
}

interface MaterialFormProps {
  material?: MaterialFormData
  categories: ServiceCategory[]
  services: Service[]
}

export function MaterialForm({ material, categories, services }: MaterialFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<MaterialFormData>({
    sku: material?.sku || '',
    name: material?.name || '',
    description: material?.description || '',
    price: material?.price || 0,
    stockQuantity: material?.stockQuantity || 0,
    unit: material?.unit || 'piece',
    imageUrl: material?.imageUrl || '',
    serviceCategoryId: material?.serviceCategoryId || '',
    isActive: material?.isActive ?? true,
    serviceIds: material?.serviceIds || [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = material?.id
        ? `/api/materials/${material.id}`
        : '/api/materials'

      const method = material?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save material')
      }

      toast({
        title: material?.id ? 'Material updated' : 'Material created',
        description: material?.id
          ? 'The material has been updated successfully'
          : 'The material has been created successfully',
      })

      router.push('/dashboard/materials')
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save material',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter(id => id !== serviceId)
        : [...prev.serviceIds, serviceId]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="MAT-001"
                required
                disabled={!!material?.id}
              />
              {material?.id && (
                <p className="text-xs text-muted-foreground">SKU cannot be changed</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Premium Oak Wood"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="High-quality oak planks for furniture"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
            />
            <p className="text-xs text-muted-foreground">
              Enter an image URL (preferably from Unsplash)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pricing & Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing & Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock Quantity *</Label>
              <Input
                id="stockQuantity"
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger id="unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="piece">Piece</SelectItem>
                  <SelectItem value="yard">Yard</SelectItem>
                  <SelectItem value="meter">Meter</SelectItem>
                  <SelectItem value="kg">Kilogram</SelectItem>
                  <SelectItem value="liter">Liter</SelectItem>
                  <SelectItem value="pack">Pack</SelectItem>
                  <SelectItem value="set">Set</SelectItem>
                  <SelectItem value="board feet">Board Feet</SelectItem>
                  <SelectItem value="square feet">Square Feet</SelectItem>
                  <SelectItem value="tube">Tube</SelectItem>
                  <SelectItem value="pair">Pair</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category & Services */}
      <Card>
        <CardHeader>
          <CardTitle>Category & Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.serviceCategoryId}
              onValueChange={(value) => setFormData({ ...formData, serviceCategoryId: value })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No category</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Link to Services</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Select which services can use this material
            </p>
            <div className="border rounded-lg p-4 space-y-2 max-h-60 overflow-y-auto">
              {services.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No services available. Create services first.
                </p>
              ) : (
                services.map((service) => (
                  <div key={service.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`service-${service.id}`}
                      checked={formData.serviceIds.includes(service.id)}
                      onChange={() => handleServiceToggle(service.id)}
                      className="rounded border-gray-300"
                    />
                    <label
                      htmlFor={`service-${service.id}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {service.name}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Active Status</Label>
              <p className="text-sm text-muted-foreground">
                Inactive materials won't be shown in service forms
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/materials')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {material?.id ? 'Update Material' : 'Create Material'}
        </Button>
      </div>
    </form>
  )
}

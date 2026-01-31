'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PhotoUpload } from '@/components/shared/PhotoUpload'
import { MaterialGrid } from '@/components/materials/MaterialGrid'
import { MaterialQuantitySelector } from '@/components/materials/MaterialQuantitySelector'
import { AlertCircle, Package, Image as ImageIcon, FileText, Link as LinkIcon } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DesignOptionsPicker, DesignSelection } from '@/components/services/DesignOptionsPicker'
import type { Service, Material } from '@/types'

interface CustomProductionFormProps {
  service: Service
  onSubmit: (data: CustomProductionData) => void
  isSubmitting?: boolean
}

export interface CustomProductionData {
  selectedMaterials: Array<{ materialId: string; quantity: number }>
  materialRequests: Array<{
    description: string
    referenceUrl?: string
    referencePhotos: string[]
  }>
  desiredProductPhotos: string[]
  customizationNotes: string
  designSelections?: DesignSelection[]
}

interface SelectedMaterial {
  material: Material
  quantity: number
}

export function CustomProductionForm({
  service,
  onSubmit,
  isSubmitting = false,
}: CustomProductionFormProps) {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loadingMaterials, setLoadingMaterials] = useState(true)
  const [selectedMaterials, setSelectedMaterials] = useState<SelectedMaterial[]>([])

  const [materialRequestDescription, setMaterialRequestDescription] = useState('')
  const [materialRequestUrl, setMaterialRequestUrl] = useState('')
  const [materialRequestPhotos, setMaterialRequestPhotos] = useState<string[]>([])
  const [materialRequests, setMaterialRequests] = useState<
    Array<{ description: string; referenceUrl?: string; referencePhotos: string[] }>
  >([])

  const [desiredProductPhotos, setDesiredProductPhotos] = useState<string[]>([])
  const [customizationNotes, setCustomizationNotes] = useState('')
  const [designSelections, setDesignSelections] = useState<DesignSelection[]>([])

  // Fetch materials linked to this service
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        // Get materials linked to this specific service only
        const serviceUrl = `/api/services/${service.id}/materials?isActive=true`
        const serviceResponse = await fetch(serviceUrl)

        if (serviceResponse.ok) {
          const serviceMaterials = await serviceResponse.json()
          setMaterials(serviceMaterials)
        } else {
          console.error('Failed to fetch service materials')
          setMaterials([])
        }
      } catch (error) {
        console.error('Error fetching materials:', error)
        setMaterials([])
      } finally {
        setLoadingMaterials(false)
      }
    }

    fetchMaterials()
  }, [service.id])

  const handleSelectMaterial = (material: Material) => {
    const existingIndex = selectedMaterials.findIndex((sm) => sm.material.id === material.id)

    if (existingIndex >= 0) {
      // Remove if already selected
      setSelectedMaterials((prev) => prev.filter((sm) => sm.material.id !== material.id))
    } else {
      // Add with default quantity of 1
      setSelectedMaterials((prev) => [...prev, { material, quantity: 1 }])
    }
  }

  const handleQuantityChange = (materialId: string, quantity: number) => {
    setSelectedMaterials((prev) =>
      prev.map((sm) => (sm.material.id === materialId ? { ...sm, quantity } : sm))
    )
  }

  const handleAddMaterialRequest = () => {
    if (!materialRequestDescription.trim()) {
      alert('Please provide a description for the material')
      return
    }

    setMaterialRequests((prev) => [
      ...prev,
      {
        description: materialRequestDescription,
        referenceUrl: materialRequestUrl || undefined,
        referencePhotos: materialRequestPhotos,
      },
    ])

    // Clear form
    setMaterialRequestDescription('')
    setMaterialRequestUrl('')
    setMaterialRequestPhotos([])
  }

  const handleRemoveMaterialRequest = (index: number) => {
    setMaterialRequests((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedMaterials.length === 0 && materialRequests.length === 0) {
      alert('Please select at least one material or request a material')
      return
    }

    if (desiredProductPhotos.length === 0) {
      alert('Please upload at least one photo of the desired product')
      return
    }

    if (!customizationNotes.trim()) {
      alert('Please provide customization details')
      return
    }

    onSubmit({
      selectedMaterials: selectedMaterials.map((sm) => ({
        materialId: sm.material.id,
        quantity: sm.quantity,
      })),
      materialRequests,
      desiredProductPhotos,
      customizationNotes,
      designSelections: designSelections.length > 0 ? designSelections : undefined,
    })
  }

  const isFormValid =
    (selectedMaterials.length > 0 || materialRequests.length > 0) &&
    desiredProductPhotos.length > 0 &&
    customizationNotes.trim().length > 0

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Select the materials you need from our catalog, or request materials that aren't listed.
          After submitting, we'll create a custom quote based on materials and estimated labor.
        </AlertDescription>
      </Alert>

      {/* Design Options Picker */}
      <DesignOptionsPicker
        serviceId={service.id}
        value={designSelections}
        onChange={setDesignSelections}
      />

      {/* Material Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Select Materials
          </CardTitle>
          <p className="text-sm text-gray-600">
            Choose from our available materials or request custom materials below
          </p>
        </CardHeader>
        <CardContent>
          {loadingMaterials ? (
            <div className="text-center py-8 text-gray-500">Loading materials...</div>
          ) : materials.length > 0 ? (
            <MaterialGrid
              materials={materials}
              selectedMaterials={selectedMaterials.map((sm) => sm.material.id)}
              onSelectMaterial={handleSelectMaterial}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No materials available. Please request custom materials below.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Materials Quantities */}
      {selectedMaterials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Set Quantities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedMaterials.map((sm) => (
              <div
                key={sm.material.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{sm.material.name}</p>
                  <p className="text-sm text-gray-500">
                    ${Number(sm.material.price).toFixed(2)} per {sm.material.unit}
                  </p>
                </div>
                <MaterialQuantitySelector
                  value={sm.quantity}
                  onChange={(qty) => handleQuantityChange(sm.material.id, qty)}
                  max={sm.material.stockQuantity}
                  unit={sm.material.unit}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Request Custom Materials */}
      <Card>
        <CardHeader>
          <CardTitle>Request Custom Material</CardTitle>
          <p className="text-sm text-gray-600">
            Can't find what you need? Tell us about it and we'll source it for you
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Material Description *</Label>
            <Textarea
              value={materialRequestDescription}
              onChange={(e) => setMaterialRequestDescription(e.target.value)}
              placeholder="Describe the material you need (e.g., 'Oak wood planks, 2 inches thick')"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Reference Link (Optional)</Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="url"
                value={materialRequestUrl}
                onChange={(e) => setMaterialRequestUrl(e.target.value)}
                placeholder="https://example.com/product"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Reference Photos (Optional)</Label>
            <PhotoUpload
              value={materialRequestPhotos}
              onChange={setMaterialRequestPhotos}
              maxFiles={3}
              type="material"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleAddMaterialRequest}
            disabled={!materialRequestDescription.trim()}
            className="w-full"
          >
            Add Material Request
          </Button>

          {/* Material Requests List */}
          {materialRequests.length > 0 && (
            <div className="space-y-2 mt-4 pt-4 border-t">
              <Label>Requested Materials ({materialRequests.length})</Label>
              {materialRequests.map((req, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{req.description}</p>
                    {req.referenceUrl && (
                      <p className="text-xs text-gray-500 truncate">{req.referenceUrl}</p>
                    )}
                    {req.referencePhotos.length > 0 && (
                      <p className="text-xs text-gray-500">
                        {req.referencePhotos.length} photo(s) attached
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMaterialRequest(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Desired Product Photos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Desired Product Photos *
          </CardTitle>
          <p className="text-sm text-gray-600">
            Upload photos or sketches of what you want us to create
          </p>
        </CardHeader>
        <CardContent>
          <PhotoUpload
            value={desiredProductPhotos}
            onChange={setDesiredProductPhotos}
            maxFiles={5}
            type="requirement"
          />
        </CardContent>
      </Card>

      {/* Customization Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Customization Details *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={customizationNotes}
            onChange={(e) => setCustomizationNotes(e.target.value)}
            placeholder="Provide detailed specifications: dimensions, colors, finishes, special features, etc..."
            rows={6}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          type="submit"
          size="lg"
          disabled={!isFormValid || isSubmitting}
          className="min-w-[200px]"
        >
          {isSubmitting ? 'Submitting...' : 'Submit for Quote'}
        </Button>
      </div>
    </form>
  )
}

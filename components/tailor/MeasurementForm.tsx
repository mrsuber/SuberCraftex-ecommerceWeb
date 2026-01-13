'use client'

import { useState, useRef } from 'react'
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
import { useToast } from '@/hooks/use-toast'
import { Loader2, Ruler, User2, Shirt, PenTool, CheckCircle2, Printer, FileText } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SignatureCanvas from 'react-signature-canvas'
import { BodySilhouetteProfessional } from './BodySilhouetteProfessional'
import {
  MEASUREMENT_TEMPLATES as PROFESSIONAL_TEMPLATES,
  getGarmentTypes,
  getTemplate,
  getGarmentTypeDisplayName,
} from '@/lib/measurements/professional-templates'

interface Booking {
  id: string
  bookingNumber: string
  customerName: string
  service: {
    name: string
  }
  measurement?: {
    measurements: any
    notes: string | null
  } | null
}

interface MeasurementFormProps {
  booking: Booking
}

// Use professional measurement templates

// Body parts mapping for visual indicator
const BODY_PARTS = {
  neck: 'Neck',
  shoulders: 'Shoulders',
  chest: 'Chest/Bust',
  arms: 'Arms',
  waist: 'Waist',
  hips: 'Hips',
  torso: 'Torso',
  back: 'Back',
  legs: 'Legs',
  crotch: 'Crotch/Rise',
}

export function MeasurementForm({ booking }: MeasurementFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // Initialize from existing measurements
  const initialMeasurements = booking.measurement?.measurements || {}
  const initialGender = initialMeasurements.gender || 'male'
  const initialGarmentTypes = initialMeasurements.garmentTypes || [getGarmentTypes('male')[0]]

  const [gender, setGender] = useState<'male' | 'female' | 'child'>(initialGender)
  const [selectedGarmentTypes, setSelectedGarmentTypes] = useState<string[]>(
    Array.isArray(initialGarmentTypes) ? initialGarmentTypes : [initialGarmentTypes]
  )
  const [measurements, setMeasurements] = useState<Record<string, number>>(
    initialMeasurements
  )
  const [notes, setNotes] = useState(booking.measurement?.notes || '')
  const [signature, setSignature] = useState<string | null>(null)
  const signaturePadRef = useRef<SignatureCanvas>(null)

  const handleMeasurementChange = (key: string, value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue) || value === '') {
      setMeasurements((prev) => ({
        ...prev,
        [key]: value === '' ? 0 : numValue,
      }))
    }
  }

  const handleSignatureEnd = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      const dataUrl = signaturePadRef.current.toDataURL()
      setSignature(dataUrl)
    }
  }

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear()
      setSignature(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          measurements: {
            ...measurements,
            gender,
            garmentTypes: selectedGarmentTypes,
          },
          notes,
          customerSignatureUrl: signature,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save measurements')
      }

      toast({
        title: 'Success',
        description: 'Measurements saved successfully',
      })

      // Prompt to schedule fitting appointment
      const shouldScheduleFitting = confirm(
        'Would you like to schedule a fitting appointment now?'
      )

      if (shouldScheduleFitting) {
        router.push(`/dashboard/bookings/${booking.id}?scheduleFitting=true`)
      } else {
        router.push(`/dashboard/bookings/${booking.id}`)
      }
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to save measurements',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Get organized sections: common fields + individual garment sections
  const getOrganizedSections = () => {
    const fieldMap = new Map<string, { field: any; garmentTypes: string[] }>()

    // First pass: collect all fields and which garments need them
    selectedGarmentTypes.forEach((garmentType) => {
      const template = getTemplate(gender, garmentType)
      if (template) {
        template.fields.forEach((field) => {
          if (fieldMap.has(field.key)) {
            // Field already exists, add this garment to the list
            fieldMap.get(field.key)!.garmentTypes.push(garmentType)
          } else {
            // New field, add it
            fieldMap.set(field.key, {
              field,
              garmentTypes: [garmentType]
            })
          }
        })
      }
    })

    // Separate common fields from garment-specific fields
    const commonFields: any[] = []
    const garmentSpecificFields = new Map<string, any[]>()

    // Initialize arrays for each garment
    selectedGarmentTypes.forEach(garmentType => {
      garmentSpecificFields.set(garmentType, [])
    })

    // Categorize fields
    fieldMap.forEach(({ field, garmentTypes }) => {
      if (garmentTypes.length > 1) {
        // This is a common field
        commonFields.push({
          field,
          garmentTypes: garmentTypes.map(gt => getGarmentTypeDisplayName(gt))
        })
      } else {
        // This is specific to one garment
        const garmentType = garmentTypes[0]
        garmentSpecificFields.get(garmentType)?.push({
          field,
          garmentTypes: [getGarmentTypeDisplayName(garmentType)]
        })
      }
    })

    return {
      commonFields,
      garmentSpecificFields,
      allFields: Array.from(fieldMap.values())
    }
  }

  const { commonFields, garmentSpecificFields, allFields } = getOrganizedSections()
  const combinedFields = allFields // For backward compatibility

  // Calculate completed body parts and active points
  const completedParts = new Set<string>()
  const activePoints: string[] = []

  combinedFields.forEach(({ field }) => {
    if (measurements[field.key] && measurements[field.key] > 0) {
      completedParts.add(field.position)
    }
    // Mark fields being edited as active
    if (field.required && (!measurements[field.key] || measurements[field.key] === 0)) {
      if (!activePoints.includes(field.position)) {
        activePoints.push(field.position)
      }
    }
  })

  // Get garment type options based on gender
  const garmentTypeOptions = getGarmentTypes(gender)

  // Toggle garment type selection
  const toggleGarmentType = (garmentType: string) => {
    setSelectedGarmentTypes(prev => {
      if (prev.includes(garmentType)) {
        // Remove if already selected (but keep at least one)
        return prev.length > 1 ? prev.filter(g => g !== garmentType) : prev
      } else {
        // Add if not selected
        return [...prev, garmentType]
      }
    })
  }

  // Print empty form
  const printEmptyForm = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const formHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Measurement Form - ${booking.customerName}</title>
        <style>
          @media print {
            body { margin: 0; }
            @page { margin: 1cm; }
          }
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
          }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 5px 0; color: #666; }
          .customer-info {
            margin-bottom: 20px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 5px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
          }
          .info-label { font-weight: bold; }
          .garments {
            margin-bottom: 20px;
            padding: 15px;
            border: 2px solid #333;
            border-radius: 5px;
          }
          .garments h3 { margin-top: 0; }
          .garment-tag {
            display: inline-block;
            padding: 5px 10px;
            background: #e0e0e0;
            margin: 5px 5px 5px 0;
            border-radius: 3px;
          }
          .section-header {
            margin-top: 25px;
            margin-bottom: 15px;
            padding: 10px 15px;
            border-bottom: 3px solid #333;
            page-break-after: avoid;
          }
          .section-header h3 {
            margin: 0;
            font-size: 18px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .section-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            font-weight: bold;
            font-size: 14px;
          }
          .common-section .section-header { border-bottom-color: #3b82f6; }
          .common-section .section-badge { background: #3b82f6; color: white; }
          .garment-section-0 .section-header { border-bottom-color: #9333ea; }
          .garment-section-0 .section-badge { background: #9333ea; color: white; }
          .garment-section-1 .section-header { border-bottom-color: #10b981; }
          .garment-section-1 .section-badge { background: #10b981; color: white; }
          .garment-section-2 .section-header { border-bottom-color: #f97316; }
          .garment-section-2 .section-badge { background: #f97316; color: white; }
          .garment-section-3 .section-header { border-bottom-color: #ec4899; }
          .garment-section-3 .section-badge { background: #ec4899; color: white; }
          .measurements {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .measurements th,
          .measurements td {
            border: 1px solid #000;
            padding: 10px;
            text-align: left;
          }
          .measurements th {
            background: #f0f0f0;
            font-weight: bold;
          }
          .measurements .field-name { width: 60%; }
          .measurements .field-value { width: 40%; }
          .required { color: red; }
          .notes-section {
            margin-top: 30px;
            page-break-inside: avoid;
          }
          .notes-section h3 { margin-bottom: 10px; }
          .notes-box {
            border: 1px solid #000;
            min-height: 100px;
            padding: 10px;
          }
          .signature-section {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
            page-break-inside: avoid;
          }
          .signature-box {
            width: 45%;
          }
          .signature-line {
            border-top: 1px solid #000;
            margin-top: 50px;
            padding-top: 5px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>MEASUREMENT FORM</h1>
          <p>SuberCraftex Tailoring Services</p>
          <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="customer-info">
          <div class="info-row">
            <span><span class="info-label">Customer:</span> ${booking.customerName}</span>
            <span><span class="info-label">Booking #:</span> ${booking.bookingNumber}</span>
          </div>
          <div class="info-row">
            <span><span class="info-label">Service:</span> ${booking.service.name}</span>
            <span><span class="info-label">Gender:</span> ${gender.charAt(0).toUpperCase() + gender.slice(1)}</span>
          </div>
        </div>

        <div class="garments">
          <h3>Garment Types</h3>
          ${selectedGarmentTypes.map(type => `<span class="garment-tag">${getGarmentTypeDisplayName(type)}</span>`).join('')}
        </div>

        ${commonFields.length > 0 ? `
          <div class="common-section">
            <div class="section-header">
              <h3>
                <span class="section-badge">✓</span>
                Common Measurements (Used by all garments)
              </h3>
            </div>
            <table class="measurements">
              <thead>
                <tr>
                  <th class="field-name">Measurement</th>
                  <th class="field-value">Value (cm)</th>
                </tr>
              </thead>
              <tbody>
                ${commonFields.map(({ field }) => `
                  <tr>
                    <td class="field-name">
                      ${field.label}
                      ${field.required ? '<span class="required">*</span>' : ''}
                      ${field.description ? `<br><small>${field.description}</small>` : ''}
                    </td>
                    <td class="field-value"></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        ${selectedGarmentTypes.map((garmentType, index) => {
          const fields = garmentSpecificFields.get(garmentType) || []
          if (fields.length === 0) return ''

          return `
            <div class="garment-section-${index}">
              <div class="section-header">
                <h3>
                  <span class="section-badge">${index + 1}</span>
                  ${getGarmentTypeDisplayName(garmentType)} Measurements
                </h3>
              </div>
              <table class="measurements">
                <thead>
                  <tr>
                    <th class="field-name">Measurement</th>
                    <th class="field-value">Value (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  ${fields.map(({ field }) => `
                    <tr>
                      <td class="field-name">
                        ${field.label}
                        ${field.required ? '<span class="required">*</span>' : ''}
                        ${field.description ? `<br><small>${field.description}</small>` : ''}
                      </td>
                      <td class="field-value"></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `
        }).join('')}

        <div class="notes-section">
          <h3>Notes</h3>
          <div class="notes-box"></div>
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line">Tailor Signature</div>
          </div>
          <div class="signature-box">
            <div class="signature-line">Customer Signature</div>
          </div>
        </div>
      </body>
      </html>
    `

    printWindow.document.write(formHtml)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  // Print filled form
  const printFilledForm = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const formHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Completed Measurements - ${booking.customerName}</title>
        <style>
          @media print {
            body { margin: 0; }
            @page { margin: 1cm; }
          }
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
          }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 5px 0; color: #666; }
          .customer-info {
            margin-bottom: 20px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 5px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
          }
          .info-label { font-weight: bold; }
          .garments {
            margin-bottom: 20px;
            padding: 15px;
            border: 2px solid #333;
            border-radius: 5px;
          }
          .garments h3 { margin-top: 0; }
          .garment-tag {
            display: inline-block;
            padding: 5px 10px;
            background: #e0e0e0;
            margin: 5px 5px 5px 0;
            border-radius: 3px;
          }
          .section-header {
            margin-top: 25px;
            margin-bottom: 15px;
            padding: 10px 15px;
            border-bottom: 3px solid #333;
            page-break-after: avoid;
          }
          .section-header h3 {
            margin: 0;
            font-size: 18px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .section-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            font-weight: bold;
            font-size: 14px;
          }
          .common-section .section-header { border-bottom-color: #3b82f6; }
          .common-section .section-badge { background: #3b82f6; color: white; }
          .garment-section-0 .section-header { border-bottom-color: #9333ea; }
          .garment-section-0 .section-badge { background: #9333ea; color: white; }
          .garment-section-1 .section-header { border-bottom-color: #10b981; }
          .garment-section-1 .section-badge { background: #10b981; color: white; }
          .garment-section-2 .section-header { border-bottom-color: #f97316; }
          .garment-section-2 .section-badge { background: #f97316; color: white; }
          .garment-section-3 .section-header { border-bottom-color: #ec4899; }
          .garment-section-3 .section-badge { background: #ec4899; color: white; }
          .measurements {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .measurements th,
          .measurements td {
            border: 1px solid #000;
            padding: 10px;
            text-align: left;
          }
          .measurements th {
            background: #f0f0f0;
            font-weight: bold;
          }
          .measurements .field-name { width: 60%; }
          .measurements .field-value { width: 40%; font-weight: bold; }
          .required { color: red; }
          .completed { background: #e8f5e9; }
          .notes-section {
            margin-top: 30px;
            page-break-inside: avoid;
          }
          .notes-section h3 { margin-bottom: 10px; }
          .notes-box {
            border: 1px solid #000;
            padding: 10px;
            white-space: pre-wrap;
          }
          .signature-section {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
            page-break-inside: avoid;
          }
          .signature-box {
            width: 45%;
          }
          .signature-line {
            border-top: 1px solid #000;
            margin-top: 50px;
            padding-top: 5px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>COMPLETED MEASUREMENTS</h1>
          <p>SuberCraftex Tailoring Services</p>
          <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="customer-info">
          <div class="info-row">
            <span><span class="info-label">Customer:</span> ${booking.customerName}</span>
            <span><span class="info-label">Booking #:</span> ${booking.bookingNumber}</span>
          </div>
          <div class="info-row">
            <span><span class="info-label">Service:</span> ${booking.service.name}</span>
            <span><span class="info-label">Gender:</span> ${gender.charAt(0).toUpperCase() + gender.slice(1)}</span>
          </div>
        </div>

        <div class="garments">
          <h3>Garment Types</h3>
          ${selectedGarmentTypes.map(type => `<span class="garment-tag">${getGarmentTypeDisplayName(type)}</span>`).join('')}
        </div>

        ${commonFields.length > 0 ? `
          <div class="common-section">
            <div class="section-header">
              <h3>
                <span class="section-badge">✓</span>
                Common Measurements (Used by all garments)
              </h3>
            </div>
            <table class="measurements">
              <thead>
                <tr>
                  <th class="field-name">Measurement</th>
                  <th class="field-value">Value (cm)</th>
                </tr>
              </thead>
              <tbody>
                ${commonFields.map(({ field }) => {
                  const value = measurements[field.key]
                  const hasValue = value && value > 0
                  return `
                  <tr class="${hasValue ? 'completed' : ''}">
                    <td class="field-name">
                      ${field.label}
                      ${field.required ? '<span class="required">*</span>' : ''}
                      ${field.description ? `<br><small>${field.description}</small>` : ''}
                    </td>
                    <td class="field-value">${hasValue ? value.toFixed(1) : '—'}</td>
                  </tr>
                `}).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        ${selectedGarmentTypes.map((garmentType, index) => {
          const fields = garmentSpecificFields.get(garmentType) || []
          if (fields.length === 0) return ''

          return `
            <div class="garment-section-${index}">
              <div class="section-header">
                <h3>
                  <span class="section-badge">${index + 1}</span>
                  ${getGarmentTypeDisplayName(garmentType)} Measurements
                </h3>
              </div>
              <table class="measurements">
                <thead>
                  <tr>
                    <th class="field-name">Measurement</th>
                    <th class="field-value">Value (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  ${fields.map(({ field }) => {
                    const value = measurements[field.key]
                    const hasValue = value && value > 0
                    return `
                    <tr class="${hasValue ? 'completed' : ''}">
                      <td class="field-name">
                        ${field.label}
                        ${field.required ? '<span class="required">*</span>' : ''}
                        ${field.description ? `<br><small>${field.description}</small>` : ''}
                      </td>
                      <td class="field-value">${hasValue ? value.toFixed(1) : '—'}</td>
                    </tr>
                  `}).join('')}
                </tbody>
              </table>
            </div>
          `
        }).join('')}

        ${notes ? `
          <div class="notes-section">
            <h3>Notes</h3>
            <div class="notes-box">${notes}</div>
          </div>
        ` : ''}

        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line">Tailor Signature</div>
          </div>
          <div class="signature-box">
            <div class="signature-line">Customer Signature</div>
          </div>
        </div>
      </body>
      </html>
    `

    printWindow.document.write(formHtml)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User2 className="h-5 w-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Name:</span>{' '}
              <span className="font-medium">{booking.customerName}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Service:</span>{' '}
              <span className="font-medium">{booking.service.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gender and Garment Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Measurement Type</CardTitle>
          <CardDescription>
            Select gender and garment type to show relevant measurement fields
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={gender}
                onValueChange={(value: 'male' | 'female' | 'child') => {
                  setGender(value)
                  // Reset to first garment type for new gender
                  const firstGarmentType = getGarmentTypes(value)[0]
                  setSelectedGarmentTypes([firstGarmentType])
                }}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Multi-select Garment Types */}
          <div className="space-y-3">
            <Label>Garment Types</Label>
            <p className="text-sm text-muted-foreground">
              Select all garments you need to measure. Fields will be combined automatically.
            </p>

            {/* Selected Tags */}
            {selectedGarmentTypes.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/30">
                {selectedGarmentTypes.map((type) => (
                  <div
                    key={type}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm"
                  >
                    <span>{getGarmentTypeDisplayName(type)}</span>
                    {selectedGarmentTypes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => toggleGarmentType(type)}
                        className="ml-1 hover:bg-primary/80 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Available Options */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {garmentTypeOptions.map((type) => {
                const isSelected = selectedGarmentTypes.includes(type)
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleGarmentType(type)}
                    className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:bg-muted'
                    }`}
                  >
                    {getGarmentTypeDisplayName(type)}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Print Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={printEmptyForm}
              className="flex-1"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Empty Form
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={printFilledForm}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              Print Filled Form
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Visual Progress Indicator with Body Silhouette */}
      <Card>
        <CardHeader>
          <CardTitle>Measurement Progress</CardTitle>
          <CardDescription>
            Body areas with completed measurements are highlighted in green
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Body Silhouette */}
            <div className="flex justify-center items-start">
              <BodySilhouetteProfessional
                gender={gender}
                completedParts={completedParts}
                activePoints={activePoints}
              />
            </div>

            {/* Progress Indicators */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(BODY_PARTS).map(([key, label]) => {
                  const isCompleted = completedParts.has(key)
                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                        isCompleted
                          ? 'bg-green-50 border-green-500 text-green-700'
                          : 'bg-gray-50 border-gray-200 text-gray-500'
                      }`}
                    >
                      <CheckCircle2
                        className={`h-4 w-4 ${
                          isCompleted ? 'text-green-600' : 'text-gray-300'
                        }`}
                      />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                  )
                })}
              </div>
              <div className="text-sm text-muted-foreground text-center p-4 bg-muted rounded-lg">
                <div className="font-semibold text-lg mb-1">
                  {completedParts.size} of {Object.keys(BODY_PARTS).length}
                </div>
                <div>body areas measured</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Measurements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Measurements for Selected Garments
          </CardTitle>
          <CardDescription>
            Enter measurements in centimeters.{' '}
            <span className="text-red-500">*</span> indicates required fields.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Common Measurements Section */}
          {commonFields.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-blue-500">
                <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Common Measurements</h3>
                  <p className="text-sm text-muted-foreground">
                    Used by all selected garments
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commonFields.map(({ field, garmentTypes }) => {
                  const isFilled = measurements[field.key] && measurements[field.key] > 0

                  return (
                    <div key={field.key} className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Label htmlFor={field.key} className="flex items-center gap-2 flex-wrap">
                        <span>
                          {field.label} ({field.unit})
                          {field.required && <span className="text-red-500">*</span>}
                        </span>
                        {isFilled && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                      </Label>

                      {field.description && (
                        <p className="text-xs text-muted-foreground">
                          {field.description}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <Input
                          id={field.key}
                          type="number"
                          step="0.1"
                          value={measurements[field.key] || ''}
                          onChange={(e) =>
                            handleMeasurementChange(field.key, e.target.value)
                          }
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          className={isFilled ? 'border-green-500 bg-white' : field.required ? 'border-amber-300 bg-white' : 'bg-white'}
                          required={field.required}
                        />
                        <div className="flex items-center px-3 border rounded-md bg-white text-muted-foreground text-sm">
                          {field.unit}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Individual Garment Sections */}
          {selectedGarmentTypes.map((garmentType, garmentIndex) => {
            const garmentFields = garmentSpecificFields.get(garmentType) || []
            if (garmentFields.length === 0) return null

            const garmentDisplayName = getGarmentTypeDisplayName(garmentType)
            const colors = [
              { bg: 'bg-purple-50', border: 'border-purple-500', icon: 'bg-purple-500' },
              { bg: 'bg-green-50', border: 'border-green-500', icon: 'bg-green-500' },
              { bg: 'bg-orange-50', border: 'border-orange-500', icon: 'bg-orange-500' },
              { bg: 'bg-pink-50', border: 'border-pink-500', icon: 'bg-pink-500' },
            ]
            const color = colors[garmentIndex % colors.length]

            return (
              <div key={garmentType} className="space-y-4">
                <div className={`flex items-center gap-2 pb-2 border-b-2 ${color.border}`}>
                  <div className={`h-8 w-8 rounded-full ${color.icon} text-white flex items-center justify-center font-bold`}>
                    {garmentIndex + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{garmentDisplayName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Specific measurements for this garment
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {garmentFields.map(({ field }) => {
                    const isFilled = measurements[field.key] && measurements[field.key] > 0

                    return (
                      <div key={field.key} className={`space-y-2 p-3 ${color.bg} rounded-lg border ${color.border}`}>
                        <Label htmlFor={field.key} className="flex items-center gap-2 flex-wrap">
                          <span>
                            {field.label} ({field.unit})
                            {field.required && <span className="text-red-500">*</span>}
                          </span>
                          {isFilled && (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          )}
                        </Label>

                        {field.description && (
                          <p className="text-xs text-muted-foreground">
                            {field.description}
                          </p>
                        )}

                        <div className="flex gap-2">
                          <Input
                            id={field.key}
                            type="number"
                            step="0.1"
                            value={measurements[field.key] || ''}
                            onChange={(e) =>
                              handleMeasurementChange(field.key, e.target.value)
                            }
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            className={isFilled ? 'border-green-500 bg-white' : field.required ? 'border-amber-300 bg-white' : 'bg-white'}
                            required={field.required}
                          />
                          <div className="flex items-center px-3 border rounded-md bg-white text-muted-foreground text-sm">
                            {field.unit}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shirt className="h-5 w-5" />
            Additional Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special notes, adjustments, posture considerations, or customer preferences..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Customer Signature */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            Customer Signature
          </CardTitle>
          <CardDescription>
            Customer confirmation of measurements taken (optional)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="border rounded-lg p-4 bg-white">
            <SignatureCanvas
              ref={signaturePadRef}
              canvasProps={{
                className: 'border rounded w-full h-40 touch-none cursor-crosshair',
              }}
              onEnd={handleSignatureEnd}
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearSignature}
            >
              Clear Signature
            </Button>
            {signature && (
              <span className="text-sm text-muted-foreground flex items-center">
                ✓ Signature captured
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {booking.measurement ? 'Update' : 'Save'} Measurements
        </Button>
      </div>
    </form>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { Calculator, DollarSign, Clock, FileText, Send } from 'lucide-react'

interface QuoteFormProps {
  bookingId: string
  bookingNumber: string
  materials?: Array<{
    id: string
    material: {
      id: string
      name: string
      price: number
      unit: string
    }
    quantity: number
  }>
}

export function QuoteForm({ bookingId, bookingNumber, materials = [] }: QuoteFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate material cost from selected materials
  const calculatedMaterialCost = materials.reduce(
    (sum, m) => sum + Number(m.material.price) * m.quantity,
    0
  )

  const [formData, setFormData] = useState({
    materialCost: calculatedMaterialCost.toFixed(2),
    laborHours: '',
    laborRate: '20.00', // Default hourly rate
    laborCost: '0.00',
    notes: '',
    downPaymentPercentage: '50',
  })

  const handleLaborChange = (hours: string, rate: string) => {
    const h = parseFloat(hours) || 0
    const r = parseFloat(rate) || 0
    const cost = (h * r).toFixed(2)

    setFormData(prev => ({
      ...prev,
      laborHours: hours,
      laborRate: rate,
      laborCost: cost,
    }))
  }

  const totalCost = (
    parseFloat(formData.materialCost || '0') +
    parseFloat(formData.laborCost || '0')
  ).toFixed(2)

  const downPaymentAmount = (
    parseFloat(totalCost) *
    (parseFloat(formData.downPaymentPercentage) / 100)
  ).toFixed(2)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/bookings/${bookingId}/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          material_cost: parseFloat(formData.materialCost),
          labor_cost: parseFloat(formData.laborCost),
          labor_hours: parseFloat(formData.laborHours),
          notes: formData.notes,
          down_payment_percentage: parseFloat(formData.downPaymentPercentage),
        }),
      })

      if (response.ok) {
        toast({
          title: 'Quote Created!',
          description: 'Quote has been sent to the customer.',
        })
        router.push(`/dashboard/bookings/${bookingId}`)
        router.refresh()
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to create quote',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error creating quote:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Material Cost */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Material Cost
          </CardTitle>
          <CardDescription>
            {materials.length > 0
              ? `Calculated from ${materials.length} selected material(s)`
              : 'Enter the total cost of materials needed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {materials.length > 0 && (
            <div className="space-y-2 mb-4">
              <div className="text-sm font-medium">Selected Materials:</div>
              {materials.map((m) => (
                <div
                  key={m.id}
                  className="flex justify-between items-center p-2 bg-muted rounded text-sm"
                >
                  <span>
                    {m.material.name} × {m.quantity} {m.material.unit}
                  </span>
                  <span className="font-medium">
                    ${(Number(m.material.price) * m.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <Separator />
            </div>
          )}

          <div>
            <Label htmlFor="materialCost">Total Material Cost ($)</Label>
            <Input
              id="materialCost"
              type="number"
              step="0.01"
              min="0"
              value={formData.materialCost}
              onChange={(e) => setFormData({ ...formData, materialCost: e.target.value })}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Labor Cost Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Labor Cost Calculator
          </CardTitle>
          <CardDescription>
            Calculate labor cost based on hours and hourly rate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="laborHours">Labor Hours</Label>
              <Input
                id="laborHours"
                type="number"
                step="0.5"
                min="0"
                placeholder="e.g., 40"
                value={formData.laborHours}
                onChange={(e) => handleLaborChange(e.target.value, formData.laborRate)}
                required
              />
            </div>

            <div>
              <Label htmlFor="laborRate">Hourly Rate ($)</Label>
              <Input
                id="laborRate"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g., 20.00"
                value={formData.laborRate}
                onChange={(e) => handleLaborChange(formData.laborHours, e.target.value)}
                required
              />
            </div>
          </div>

          <Separator />

          <div>
            <Label htmlFor="laborCost">Total Labor Cost ($)</Label>
            <Input
              id="laborCost"
              type="number"
              step="0.01"
              min="0"
              value={formData.laborCost}
              onChange={(e) => setFormData({ ...formData, laborCost: e.target.value })}
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              {formData.laborHours && formData.laborRate
                ? `${formData.laborHours} hours × $${formData.laborRate}/hr = $${formData.laborCost}`
                : 'Enter hours and rate to calculate automatically'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quote Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Quote Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Material Cost:</span>
              <span className="font-medium">${formData.materialCost}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Labor Cost:</span>
              <span className="font-medium">${formData.laborCost}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Cost:</span>
              <span className="text-primary">${totalCost}</span>
            </div>
          </div>

          <Separator />

          <div>
            <Label htmlFor="downPaymentPercentage">Down Payment (%)</Label>
            <Input
              id="downPaymentPercentage"
              type="number"
              step="1"
              min="0"
              max="100"
              value={formData.downPaymentPercentage}
              onChange={(e) => setFormData({ ...formData, downPaymentPercentage: e.target.value })}
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              Down Payment: ${downPaymentAmount} ({formData.downPaymentPercentage}%)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quote Notes
          </CardTitle>
          <CardDescription>
            Add any additional information or terms for the customer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            id="notes"
            placeholder="e.g., Includes premium materials, custom fitting sessions, 14-day validity..."
            rows={4}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Creating Quote...' : 'Send Quote to Customer'}
        </Button>
      </div>

      {/* Preview */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">Quote Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Booking:</strong> {bookingNumber}
          </p>
          <p>
            <strong>Total Quote:</strong> ${totalCost}
          </p>
          <p>
            <strong>Down Payment Required:</strong> ${downPaymentAmount}
          </p>
          <p>
            <strong>Remaining Balance:</strong> $
            {(parseFloat(totalCost) - parseFloat(downPaymentAmount)).toFixed(2)}
          </p>
          {formData.notes && (
            <div className="mt-2 pt-2 border-t">
              <strong>Notes:</strong>
              <p className="text-muted-foreground whitespace-pre-wrap">{formData.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </form>
  )
}

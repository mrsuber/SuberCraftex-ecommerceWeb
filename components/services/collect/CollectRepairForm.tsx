'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { PhotoUpload } from '@/components/shared/PhotoUpload'
import { AlertCircle, Camera, FileText, Truck, Store } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { Service, CollectionMethod } from '@/types'

interface CollectRepairFormProps {
  service: Service
  onSubmit: (data: CollectRepairData) => void
  isSubmitting?: boolean
}

export interface CollectRepairData {
  itemPhotos: string[]
  desiredOutcome: string
  collectionMethod: CollectionMethod
  additionalNotes: string
}

export function CollectRepairForm({
  service,
  onSubmit,
  isSubmitting = false,
}: CollectRepairFormProps) {
  const [itemPhotos, setItemPhotos] = useState<string[]>([])
  const [desiredOutcome, setDesiredOutcome] = useState('')
  const [collectionMethod, setCollectionMethod] = useState<CollectionMethod | null>(null)
  const [additionalNotes, setAdditionalNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (itemPhotos.length === 0) {
      alert('Please upload at least one photo of the item')
      return
    }

    if (!desiredOutcome.trim()) {
      alert('Please describe the desired outcome')
      return
    }

    if (!collectionMethod) {
      alert('Please select a collection method')
      return
    }

    onSubmit({
      itemPhotos,
      desiredOutcome,
      collectionMethod,
      additionalNotes,
    })
  }

  const isFormValid = itemPhotos.length > 0 && desiredOutcome.trim() && collectionMethod

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Upload photos of your item and tell us what you'd like done. We'll review it and provide
          a quote for the repair or renewal work.
        </AlertDescription>
      </Alert>

      {/* Item Photos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Item Photos *
          </CardTitle>
          <p className="text-sm text-gray-600">
            Upload clear photos showing the item's current condition and any areas needing work
          </p>
        </CardHeader>
        <CardContent>
          <PhotoUpload
            value={itemPhotos}
            onChange={setItemPhotos}
            maxFiles={8}
            type="requirement"
          />
          <p className="text-xs text-gray-500 mt-3">
            💡 Tip: Include photos from different angles and close-ups of damaged or worn areas
          </p>
        </CardContent>
      </Card>

      {/* Desired Outcome */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Desired Outcome *
          </CardTitle>
          <p className="text-sm text-gray-600">
            Describe what you want us to repair, renew, or improve
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            value={desiredOutcome}
            onChange={(e) => setDesiredOutcome(e.target.value)}
            placeholder="For example: 'Fix broken leg, restore original finish, repair torn upholstery...'"
            rows={5}
          />
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">Consider including:</p>
            <ul className="text-sm text-gray-600 space-y-1 ml-5 list-disc">
              <li>Specific repairs needed</li>
              <li>Preferred materials or finishes</li>
              <li>Any color or style preferences</li>
              <li>Timeline requirements</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Collection Method */}
      <Card>
        <CardHeader>
          <CardTitle>Collection Method *</CardTitle>
          <p className="text-sm text-gray-600">
            Choose how you'd like to get the item to our workshop
          </p>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={collectionMethod || ''}
            onValueChange={(value) => setCollectionMethod(value as CollectionMethod)}
          >
            <div className="space-y-3">
              {/* Admin Collects */}
              <div
                className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  collectionMethod === 'admin_collects'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setCollectionMethod('admin_collects')}
              >
                <RadioGroupItem value="admin_collects" id="admin_collects" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary" />
                    <Label htmlFor="admin_collects" className="cursor-pointer font-medium">
                      We collect from you
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 ml-7">
                    Our team will schedule a pickup from your location. Collection fee may apply
                    depending on distance.
                  </p>
                </div>
              </div>

              {/* Customer Brings */}
              <div
                className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  collectionMethod === 'customer_brings'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setCollectionMethod('customer_brings')}
              >
                <RadioGroupItem value="customer_brings" id="customer_brings" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Store className="w-5 h-5 text-primary" />
                    <Label htmlFor="customer_brings" className="cursor-pointer font-medium">
                      I'll bring it to the shop
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 ml-7">
                    Drop off your item at our workshop during business hours. No collection fee.
                  </p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Any other information that might help us (budget constraints, urgency, special instructions...)"
            rows={4}
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

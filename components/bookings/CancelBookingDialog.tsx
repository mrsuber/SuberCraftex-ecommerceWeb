'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { XCircle } from 'lucide-react'

interface CancelBookingDialogProps {
  bookingId: string
  bookingNumber: string
  onCancel: (reason: string) => Promise<void>
  isProcessing?: boolean
}

export function CancelBookingDialog({
  bookingId,
  bookingNumber,
  onCancel,
  isProcessing = false,
}: CancelBookingDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  const handleConfirm = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason for cancellation')
      return
    }

    try {
      await onCancel(reason)
      setOpen(false)
      setReason('')
      setError('')
    } catch (err) {
      setError('Failed to cancel booking. Please try again.')
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isProcessing) {
      setOpen(newOpen)
      if (!newOpen) {
        setReason('')
        setError('')
      }
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
          <XCircle className="w-4 h-4 mr-2" />
          Cancel Booking
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="!bg-white dark:!bg-gray-900 !text-gray-900 dark:!text-gray-100 z-[100]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
            Cancel Booking #{bookingNumber}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
            This action cannot be undone. Your booking will be cancelled and any reserved
            materials will be returned to inventory.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 py-4">
          <Label htmlFor="cancellation-reason" className="text-gray-900 dark:text-gray-100">
            Reason for Cancellation <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="cancellation-reason"
            placeholder="Please tell us why you're cancelling this booking..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              setError('')
            }}
            rows={4}
            className={`bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${error ? 'border-red-300' : ''}`}
            disabled={isProcessing}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
            Keep Booking
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isProcessing || !reason.trim()}
          >
            {isProcessing ? 'Cancelling...' : 'Yes, Cancel Booking'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

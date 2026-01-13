'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, DollarSign, LogOut } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'

interface POSSessionManagerProps {
  activeSession?: any
  onSessionOpened?: (session: any) => void
  onSessionClosed?: () => void
}

export default function POSSessionManager({
  activeSession,
  onSessionOpened,
  onSessionClosed,
}: POSSessionManagerProps) {
  const [openingBalance, setOpeningBalance] = useState('0')
  const [actualCash, setActualCash] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showCloseDialog, setShowCloseDialog] = useState(false)

  const handleOpenSession = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/pos/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ openingBalance: parseFloat(openingBalance) }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to open session')
      }

      const data = await response.json()
      onSessionOpened?.(data.session)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSession = async () => {
    if (!actualCash) {
      setError('Please enter the actual cash amount')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/pos/session/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actualCash: parseFloat(actualCash),
          notes,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to close session')
      }

      const data = await response.json()
      alert(
        `Session closed successfully!\n\n` +
        `Expected: ${formatCurrency(data.session.expectedCash)}\n` +
        `Actual: ${formatCurrency(data.session.actualCash)}\n` +
        `Difference: ${formatCurrency(data.session.cashDifference)}`
      )
      onSessionClosed?.()
      setShowCloseDialog(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Open Session Form
  if (!activeSession) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Start POS Session</CardTitle>
          <CardDescription>
            Enter the opening cash balance in the register
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleOpenSession} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <Label htmlFor="openingBalance">Opening Balance</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="openingBalance"
                  type="number"
                  step="0.01"
                  min="0"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                  placeholder="0.00"
                  className="pl-9"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Count the cash in your register before starting
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Opening Session...' : 'Start Session'}
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  // Close Session Dialog
  if (showCloseDialog) {
    const expectedCash = activeSession.expectedCash
    const difference = actualCash ? parseFloat(actualCash) - expectedCash : 0

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle>Close POS Session</CardTitle>
            <CardDescription>
              Count the cash and verify the closing balance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Opening Balance:</span>
                <span className="font-medium">{formatCurrency(activeSession.openingBalance)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cash Sales:</span>
                <span className="font-medium">{formatCurrency(activeSession.totalCash)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t">
                <span>Expected Cash:</span>
                <span className="text-green-600">{formatCurrency(expectedCash)}</span>
              </div>
            </div>

            <div>
              <Label htmlFor="actualCash">Actual Cash in Register</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="actualCash"
                  type="number"
                  step="0.01"
                  value={actualCash}
                  onChange={(e) => setActualCash(e.target.value)}
                  placeholder="0.00"
                  className="pl-9"
                  required
                />
              </div>
              {actualCash && (
                <p className={`text-sm mt-1 ${difference === 0 ? 'text-green-600' : difference > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {difference === 0 ? '✓ Perfect balance!' :
                   difference > 0 ? `Over by ${formatCurrency(Math.abs(difference))}` :
                   `Short by ${formatCurrency(Math.abs(difference))}`}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any notes about the session..."
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCloseDialog(false)}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCloseSession}
                className="flex-1"
                disabled={loading || !actualCash}
              >
                {loading ? 'Closing...' : 'Close Session'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Close Session Button
  return (
    <Button
      onClick={() => setShowCloseDialog(true)}
      variant="outline"
      className="gap-2"
    >
      <LogOut className="w-4 h-4" />
      Close Session
    </Button>
  )
}

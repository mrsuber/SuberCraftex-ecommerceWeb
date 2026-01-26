'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, CheckCircle2, Phone, User, MessageSquare } from 'lucide-react'

interface MobileMoneySettingsData {
  mobileMoneyNumber: string
  mobileMoneyName: string
  mobileMoneyProvider: string
  mobileMoneyInstructions: string
}

export function MobileMoneySettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [settings, setSettings] = useState<MobileMoneySettingsData>({
    mobileMoneyNumber: '',
    mobileMoneyName: '',
    mobileMoneyProvider: 'MTN',
    mobileMoneyInstructions: 'Send money to the number above, then upload your receipt.',
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings/mobile-money')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)

    try {
      const response = await fetch('/api/settings/mobile-money', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save settings')
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Mobile Money Configuration
        </CardTitle>
        <CardDescription>
          Configure the mobile money account where investors will send deposits.
          This information will be shown to investors when they select mobile money as their deposit method.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="mobileMoneyNumber" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Mobile Money Number
            </Label>
            <Input
              id="mobileMoneyNumber"
              type="tel"
              placeholder="e.g., 670123456"
              value={settings.mobileMoneyNumber}
              onChange={(e) => setSettings({ ...settings, mobileMoneyNumber: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              The phone number investors will send money to
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobileMoneyName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Account Name
            </Label>
            <Input
              id="mobileMoneyName"
              placeholder="e.g., John Doe"
              value={settings.mobileMoneyName}
              onChange={(e) => setSettings({ ...settings, mobileMoneyName: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              The name investors should confirm before sending
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobileMoneyProvider">Mobile Money Provider</Label>
          <Select
            value={settings.mobileMoneyProvider}
            onValueChange={(value) => setSettings({ ...settings, mobileMoneyProvider: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MTN">MTN Mobile Money</SelectItem>
              <SelectItem value="Orange">Orange Money</SelectItem>
              <SelectItem value="Airtel">Airtel Money</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobileMoneyInstructions" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Instructions for Investors
          </Label>
          <Textarea
            id="mobileMoneyInstructions"
            placeholder="Enter instructions for investors..."
            value={settings.mobileMoneyInstructions}
            onChange={(e) => setSettings({ ...settings, mobileMoneyInstructions: e.target.value })}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Additional instructions shown to investors when making a deposit
          </p>
        </div>

        {/* Preview */}
        {settings.mobileMoneyNumber && settings.mobileMoneyName && (
          <>
            <Separator />
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-2">Preview (what investors will see):</p>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-600">Send money to:</p>
                <p className="font-bold text-lg">{settings.mobileMoneyNumber}</p>
                <p className="text-sm text-gray-600 mt-1">Account name:</p>
                <p className="font-medium">{settings.mobileMoneyName}</p>
                <p className="text-xs text-gray-500 mt-2">{settings.mobileMoneyProvider}</p>
                {settings.mobileMoneyInstructions && (
                  <p className="text-xs text-gray-600 mt-2 italic">{settings.mobileMoneyInstructions}</p>
                )}
              </div>
            </div>
          </>
        )}

        <Separator />

        <div className="flex justify-end gap-2">
          {saved && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">Saved successfully!</span>
            </div>
          )}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Mobile Money Settings'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

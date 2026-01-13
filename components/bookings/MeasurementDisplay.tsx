import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Ruler, Check } from 'lucide-react'
import { format } from 'date-fns'

interface Measurement {
  id: string
  measurements: Record<string, number>
  notes: string | null
  takenAt: string
}

interface MeasurementDisplayProps {
  measurement: Measurement | null
}

// Group measurements by category for better display
const groupMeasurements = (measurements: Record<string, number>) => {
  const groups: Record<string, { label: string; value: number; unit: string }[]> = {
    general: [],
    upper: [],
    lower: [],
    other: [],
  }

  const upperBodyKeys = ['bust', 'under_bust', 'chest', 'shoulder_width', 'back_width', 'neck', 'neck_circumference', 'armhole', 'sleeve_length', 'arm_length', 'shoulder_to_waist', 'jacket_length']
  const lowerBodyKeys = ['waist', 'hips', 'inseam', 'outseam', 'thigh', 'knee', 'leg_opening', 'rise', 'dress_length']
  const generalKeys = ['height', 'weight']

  Object.entries(measurements).forEach(([key, value]) => {
    if (value === 0 || value === null || value === undefined) return

    const label = key
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    const unit = key === 'weight' ? 'kg' : 'cm'

    if (generalKeys.includes(key)) {
      groups.general.push({ label, value, unit })
    } else if (upperBodyKeys.includes(key)) {
      groups.upper.push({ label, value, unit })
    } else if (lowerBodyKeys.includes(key)) {
      groups.lower.push({ label, value, unit })
    } else {
      groups.other.push({ label, value, unit })
    }
  })

  return groups
}

export function MeasurementDisplay({ measurement }: MeasurementDisplayProps) {
  if (!measurement) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Measurements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Ruler className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No measurements recorded yet</p>
            <p className="text-sm mt-1">
              Your tailor will record your measurements once your quote is approved
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const groups = groupMeasurements(measurement.measurements)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Measurements
          </CardTitle>
          <Badge variant="default" className="bg-green-600">
            <Check className="h-3 w-3 mr-1" />
            Recorded
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Taken on {format(new Date(measurement.takenAt), 'MMMM d, yyyy')}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* General Measurements */}
        {groups.general.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-3">General</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {groups.general.map((m) => (
                <div
                  key={m.label}
                  className="p-3 border rounded-lg bg-muted/50"
                >
                  <div className="text-xs text-muted-foreground mb-1">
                    {m.label}
                  </div>
                  <div className="font-semibold">
                    {m.value} {m.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upper Body */}
        {groups.upper.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-3">Upper Body</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {groups.upper.map((m) => (
                <div
                  key={m.label}
                  className="p-3 border rounded-lg bg-muted/50"
                >
                  <div className="text-xs text-muted-foreground mb-1">
                    {m.label}
                  </div>
                  <div className="font-semibold">
                    {m.value} {m.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lower Body */}
        {groups.lower.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-3">Lower Body</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {groups.lower.map((m) => (
                <div
                  key={m.label}
                  className="p-3 border rounded-lg bg-muted/50"
                >
                  <div className="text-xs text-muted-foreground mb-1">
                    {m.label}
                  </div>
                  <div className="font-semibold">
                    {m.value} {m.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Measurements */}
        {groups.other.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-3">Other</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {groups.other.map((m) => (
                <div
                  key={m.label}
                  className="p-3 border rounded-lg bg-muted/50"
                >
                  <div className="text-xs text-muted-foreground mb-1">
                    {m.label}
                  </div>
                  <div className="font-semibold">
                    {m.value} {m.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {measurement.notes && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Tailor Notes</h4>
            <p className="text-sm text-muted-foreground">{measurement.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

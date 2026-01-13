'use client'

import { CheckCircle2 } from 'lucide-react'

interface MeasurementPoint {
  id: string
  x: number
  y: number
  label: string
  position: string
}

interface BodySilhouetteProps {
  gender: 'male' | 'female'
  completedParts: Set<string>
}

// Male measurement points
const MALE_POINTS: MeasurementPoint[] = [
  { id: 'neck', x: 150, y: 60, label: 'Neck', position: 'neck' },
  { id: 'shoulders-left', x: 100, y: 80, label: 'Shoulders', position: 'shoulders' },
  { id: 'shoulders-right', x: 200, y: 80, label: 'Shoulders', position: 'shoulders' },
  { id: 'chest', x: 150, y: 120, label: 'Chest', position: 'chest' },
  { id: 'arm-left', x: 70, y: 150, label: 'Arms', position: 'arms' },
  { id: 'arm-right', x: 230, y: 150, label: 'Arms', position: 'arms' },
  { id: 'waist', x: 150, y: 180, label: 'Waist', position: 'waist' },
  { id: 'hips', x: 150, y: 220, label: 'Hips', position: 'hips' },
  { id: 'thigh-left', x: 130, y: 280, label: 'Legs', position: 'legs' },
  { id: 'thigh-right', x: 170, y: 280, label: 'Legs', position: 'legs' },
]

// Female measurement points
const FEMALE_POINTS: MeasurementPoint[] = [
  { id: 'neck', x: 150, y: 60, label: 'Neck', position: 'neck' },
  { id: 'shoulders-left', x: 105, y: 80, label: 'Shoulders', position: 'shoulders' },
  { id: 'shoulders-right', x: 195, y: 80, label: 'Shoulders', position: 'shoulders' },
  { id: 'bust', x: 150, y: 115, label: 'Bust', position: 'chest' },
  { id: 'arm-left', x: 75, y: 145, label: 'Arms', position: 'arms' },
  { id: 'arm-right', x: 225, y: 145, label: 'Arms', position: 'arms' },
  { id: 'waist', x: 150, y: 170, label: 'Waist', position: 'waist' },
  { id: 'hips', x: 150, y: 215, label: 'Hips', position: 'hips' },
  { id: 'thigh-left', x: 130, y: 275, label: 'Legs', position: 'legs' },
  { id: 'thigh-right', x: 170, y: 275, label: 'Legs', position: 'legs' },
]

export function BodySilhouette({ gender, completedParts }: BodySilhouetteProps) {
  const points = gender === 'male' ? MALE_POINTS : FEMALE_POINTS

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-full max-w-[300px] aspect-[3/4]">
        <svg
          viewBox="0 0 300 400"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Define gradient for body */}
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f3f4f6" />
              <stop offset="100%" stopColor="#e5e7eb" />
            </linearGradient>
          </defs>

          {gender === 'male' ? (
            <MaleSilhouette />
          ) : (
            <FemaleSilhouette />
          )}

          {/* Measurement points */}
          {points.map((point) => {
            const isCompleted = completedParts.has(point.position)
            return (
              <g key={point.id}>
                {/* Measurement line indicators */}
                {point.id === 'neck' && (
                  <line
                    x1={point.x - 20}
                    y1={point.y}
                    x2={point.x + 20}
                    y2={point.y}
                    stroke={isCompleted ? '#22c55e' : '#9ca3af'}
                    strokeWidth="2"
                    strokeDasharray="4"
                  />
                )}
                {(point.id === 'shoulders-left' || point.id === 'shoulders-right') && (
                  <line
                    x1={100}
                    y1={80}
                    x2={200}
                    y2={80}
                    stroke={isCompleted ? '#22c55e' : '#9ca3af'}
                    strokeWidth="2"
                  />
                )}
                {point.id === 'chest' && (
                  <line
                    x1={point.x - 40}
                    y1={point.y}
                    x2={point.x + 40}
                    y2={point.y}
                    stroke={isCompleted ? '#22c55e' : '#9ca3af'}
                    strokeWidth="2"
                  />
                )}
                {point.id === 'waist' && (
                  <line
                    x1={point.x - 30}
                    y1={point.y}
                    x2={point.x + 30}
                    y2={point.y}
                    stroke={isCompleted ? '#22c55e' : '#9ca3af'}
                    strokeWidth="2"
                  />
                )}
                {point.id === 'hips' && (
                  <line
                    x1={point.x - 40}
                    y1={point.y}
                    x2={point.x + 40}
                    y2={point.y}
                    stroke={isCompleted ? '#22c55e' : '#9ca3af'}
                    strokeWidth="2"
                  />
                )}

                {/* Measurement point marker */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="8"
                  fill={isCompleted ? '#22c55e' : '#9ca3af'}
                  stroke="white"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
                {isCompleted && (
                  <text
                    x={point.x}
                    y={point.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    ✓
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        {/* Floating labels for body parts */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Neck label */}
          <div
            className={`absolute text-xs font-medium px-2 py-1 rounded transition-all ${
              completedParts.has('neck')
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 text-gray-600 border border-gray-300'
            }`}
            style={{ top: '12%', left: '50%', transform: 'translateX(-50%)' }}
          >
            Neck
          </div>

          {/* Chest label */}
          <div
            className={`absolute text-xs font-medium px-2 py-1 rounded transition-all ${
              completedParts.has('chest')
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 text-gray-600 border border-gray-300'
            }`}
            style={{ top: '27%', left: '5%' }}
          >
            {gender === 'female' ? 'Bust' : 'Chest'}
          </div>

          {/* Waist label */}
          <div
            className={`absolute text-xs font-medium px-2 py-1 rounded transition-all ${
              completedParts.has('waist')
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 text-gray-600 border border-gray-300'
            }`}
            style={{ top: '42%', left: '5%' }}
          >
            Waist
          </div>

          {/* Hips label */}
          <div
            className={`absolute text-xs font-medium px-2 py-1 rounded transition-all ${
              completedParts.has('hips')
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 text-gray-600 border border-gray-300'
            }`}
            style={{ top: '52%', left: '5%' }}
          >
            Hips
          </div>

          {/* Arms label */}
          <div
            className={`absolute text-xs font-medium px-2 py-1 rounded transition-all ${
              completedParts.has('arms')
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 text-gray-600 border border-gray-300'
            }`}
            style={{ top: '35%', right: '5%' }}
          >
            Arms
          </div>

          {/* Legs label */}
          <div
            className={`absolute text-xs font-medium px-2 py-1 rounded transition-all ${
              completedParts.has('legs')
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 text-gray-600 border border-gray-300'
            }`}
            style={{ top: '75%', left: '50%', transform: 'translateX(-50%)' }}
          >
            Legs
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span>Green markers indicate measured areas</span>
        </div>
      </div>
    </div>
  )
}

function MaleSilhouette() {
  return (
    <g>
      {/* Head */}
      <ellipse cx="150" cy="40" rx="25" ry="30" fill="url(#bodyGradient)" stroke="#9ca3af" strokeWidth="2" />

      {/* Neck */}
      <rect x="140" y="65" width="20" height="15" fill="url(#bodyGradient)" stroke="#9ca3af" strokeWidth="2" />

      {/* Torso */}
      <path
        d="M 110 80 L 100 80 L 90 120 L 90 180 L 100 220 L 130 240 L 170 240 L 200 220 L 210 180 L 210 120 L 200 80 L 190 80"
        fill="url(#bodyGradient)"
        stroke="#9ca3af"
        strokeWidth="2"
      />

      {/* Arms */}
      <path
        d="M 100 80 L 70 90 L 60 150 L 65 200 L 70 210"
        fill="url(#bodyGradient)"
        stroke="#9ca3af"
        strokeWidth="2"
      />
      <path
        d="M 200 80 L 230 90 L 240 150 L 235 200 L 230 210"
        fill="url(#bodyGradient)"
        stroke="#9ca3af"
        strokeWidth="2"
      />

      {/* Legs */}
      <path
        d="M 130 240 L 125 280 L 120 350 L 115 395"
        fill="url(#bodyGradient)"
        stroke="#9ca3af"
        strokeWidth="2"
      />
      <path
        d="M 170 240 L 175 280 L 180 350 L 185 395"
        fill="url(#bodyGradient)"
        stroke="#9ca3af"
        strokeWidth="2"
      />
    </g>
  )
}

function FemaleSilhouette() {
  return (
    <g>
      {/* Head */}
      <ellipse cx="150" cy="40" rx="25" ry="30" fill="url(#bodyGradient)" stroke="#9ca3af" strokeWidth="2" />

      {/* Neck */}
      <rect x="142" y="65" width="16" height="15" fill="url(#bodyGradient)" stroke="#9ca3af" strokeWidth="2" />

      {/* Torso (hourglass shape) */}
      <path
        d="M 105 80 L 95 80 L 85 110 L 90 170 L 95 215 L 130 240 L 170 240 L 205 215 L 210 170 L 215 110 L 205 80 L 195 80"
        fill="url(#bodyGradient)"
        stroke="#9ca3af"
        strokeWidth="2"
      />

      {/* Arms (slimmer) */}
      <path
        d="M 95 80 L 75 90 L 65 145 L 70 195 L 75 205"
        fill="url(#bodyGradient)"
        stroke="#9ca3af"
        strokeWidth="2"
      />
      <path
        d="M 205 80 L 225 90 L 235 145 L 230 195 L 225 205"
        fill="url(#bodyGradient)"
        stroke="#9ca3af"
        strokeWidth="2"
      />

      {/* Legs (closer together) */}
      <path
        d="M 130 240 L 128 275 L 125 340 L 120 395"
        fill="url(#bodyGradient)"
        stroke="#9ca3af"
        strokeWidth="2"
      />
      <path
        d="M 170 240 L 172 275 L 175 340 L 180 395"
        fill="url(#bodyGradient)"
        stroke="#9ca3af"
        strokeWidth="2"
      />
    </g>
  )
}

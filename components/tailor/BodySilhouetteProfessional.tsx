'use client'

interface BodySilhouetteProfessionalProps {
  gender: 'male' | 'female' | 'child'
  completedParts: Set<string>
  activePoints: string[]
}

export function BodySilhouetteProfessional({
  gender,
  completedParts,
  activePoints = []
}: BodySilhouetteProfessionalProps) {

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-full max-w-[400px]">
        <svg
          viewBox="0 0 400 600"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Define gradients and patterns */}
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f8f9fa" />
              <stop offset="100%" stopColor="#e9ecef" />
            </linearGradient>

            {/* Measurement line patterns */}
            <pattern id="measurePattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <line x1="0" y1="5" x2="10" y2="5" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,2" />
            </pattern>
          </defs>

          {gender === 'male' ? (
            <MaleSilhouetteProfessional completedParts={completedParts} activePoints={activePoints} />
          ) : gender === 'female' ? (
            <FemaleSilhouetteProfessional completedParts={completedParts} activePoints={activePoints} />
          ) : (
            <ChildSilhouetteProfessional completedParts={completedParts} activePoints={activePoints} />
          )}
        </svg>
      </div>

      <div className="text-center text-sm space-y-2">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs">Measured</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs">Active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span className="text-xs">Pending</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function MaleSilhouetteProfessional({
  completedParts,
  activePoints
}: {
  completedParts: Set<string>
  activePoints: string[]
}) {
  const measurements = [
    // Neck
    { id: 'neck', x: 200, y: 85, position: 'neck', label: 'Neck' },

    // Shoulders
    { id: 'shoulder-left', x: 130, y: 100, position: 'shoulders', label: 'Shoulder' },
    { id: 'shoulder-right', x: 270, y: 100, position: 'shoulders', label: 'Shoulder' },

    // Chest/Back
    { id: 'chest', x: 200, y: 145, position: 'chest', label: 'Chest' },
    { id: 'back-width', x: 200, y: 155, position: 'back', label: 'Back' },

    // Arms
    { id: 'bicep-left', x: 100, y: 160, position: 'arms', label: 'Bicep' },
    { id: 'bicep-right', x: 300, y: 160, position: 'arms', label: 'Bicep' },
    { id: 'elbow-left', x: 90, y: 220, position: 'arms', label: 'Elbow' },
    { id: 'elbow-right', x: 310, y: 220, position: 'arms', label: 'Elbow' },
    { id: 'wrist-left', x: 80, y: 280, position: 'arms', label: 'Wrist' },
    { id: 'wrist-right', x: 320, y: 280, position: 'arms', label: 'Wrist' },

    // Torso
    { id: 'waist', x: 200, y: 230, position: 'waist', label: 'Waist' },
    { id: 'stomach', x: 200, y: 260, position: 'torso', label: 'Stomach' },
    { id: 'hips', x: 200, y: 290, position: 'hips', label: 'Hips' },

    // Crotch/Rise
    { id: 'crotch', x: 200, y: 320, position: 'crotch', label: 'Crotch' },

    // Legs
    { id: 'thigh-left', x: 175, y: 360, position: 'legs', label: 'Thigh' },
    { id: 'thigh-right', x: 225, y: 360, position: 'legs', label: 'Thigh' },
    { id: 'knee-left', x: 170, y: 430, position: 'legs', label: 'Knee' },
    { id: 'knee-right', x: 230, y: 430, position: 'legs', label: 'Knee' },
    { id: 'calf-left', x: 168, y: 490, position: 'legs', label: 'Calf' },
    { id: 'calf-right', x: 232, y: 490, position: 'legs', label: 'Calf' },
    { id: 'ankle-left', x: 165, y: 560, position: 'legs', label: 'Ankle' },
    { id: 'ankle-right', x: 235, y: 560, position: 'legs', label: 'Ankle' },
  ]

  return (
    <g>
      {/* Head */}
      <ellipse cx="200" cy="55" rx="30" ry="38" fill="url(#bodyGradient)" stroke="#64748b" strokeWidth="2" />

      {/* Neck */}
      <path
        d="M 180 88 L 180 100 L 220 100 L 220 88"
        fill="url(#bodyGradient)"
        stroke="#64748b"
        strokeWidth="2"
      />

      {/* Torso - Male (broader shoulders, straight waist) */}
      <path
        d="M 130 100
           L 120 110
           L 110 145
           L 115 230
           L 125 290
           L 150 320
           L 175 330
           L 225 330
           L 250 320
           L 275 290
           L 285 230
           L 290 145
           L 280 110
           L 270 100"
        fill="url(#bodyGradient)"
        stroke="#64748b"
        strokeWidth="2.5"
      />

      {/* Arms - Male (muscular shape) */}
      {/* Left arm */}
      <path
        d="M 130 100
           L 100 110
           L 85 160
           L 75 220
           L 70 280
           L 75 285"
        fill="url(#bodyGradient)"
        stroke="#64748b"
        strokeWidth="2"
      />

      {/* Right arm */}
      <path
        d="M 270 100
           L 300 110
           L 315 160
           L 325 220
           L 330 280
           L 325 285"
        fill="url(#bodyGradient)"
        stroke="#64748b"
        strokeWidth="2"
      />

      {/* Legs - Male (straighter, more muscular) */}
      {/* Left leg */}
      <path
        d="M 175 330
           L 170 360
           L 165 430
           L 163 490
           L 160 560
           L 165 565"
        fill="url(#bodyGradient)"
        stroke="#64748b"
        strokeWidth="2.5"
      />

      {/* Right leg */}
      <path
        d="M 225 330
           L 230 360
           L 235 430
           L 237 490
           L 240 560
           L 235 565"
        fill="url(#bodyGradient)"
        stroke="#64748b"
        strokeWidth="2.5"
      />

      {/* Measurement lines and points */}
      {measurements.map((point) => {
        const isCompleted = completedParts.has(point.position)
        const isActive = activePoints.includes(point.position)
        const color = isCompleted ? '#22c55e' : isActive ? '#3b82f6' : '#94a3b8'

        return (
          <g key={point.id}>
            {/* Measurement line indicators */}
            {point.id === 'neck' && (
              <line x1={170} y1={85} x2={230} y2={85} stroke={color} strokeWidth="2" />
            )}
            {point.id === 'shoulder-left' && (
              <line x1={130} y1={100} x2={270} y2={100} stroke={color} strokeWidth="2" />
            )}
            {point.id === 'chest' && (
              <ellipse cx={200} cy={145} rx={75} ry={8} fill="none" stroke={color} strokeWidth="2" strokeDasharray="4,4" />
            )}
            {point.id === 'waist' && (
              <ellipse cx={200} cy={230} rx={60} ry={8} fill="none" stroke={color} strokeWidth="2" strokeDasharray="4,4" />
            )}
            {point.id === 'hips' && (
              <ellipse cx={200} cy={290} rx={70} ry={8} fill="none" stroke={color} strokeWidth="2" strokeDasharray="4,4" />
            )}

            {/* Measurement point markers */}
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill={color}
              stroke="white"
              strokeWidth="2"
              className="transition-all duration-300 cursor-pointer"
            />
            {isCompleted && (
              <text
                x={point.x}
                y={point.y + 1.5}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="8"
                fontWeight="bold"
              >
                ✓
              </text>
            )}
          </g>
        )
      })}
    </g>
  )
}

function FemaleSilhouetteProfessional({
  completedParts,
  activePoints
}: {
  completedParts: Set<string>
  activePoints: string[]
}) {
  const measurements = [
    // Neck
    { id: 'neck', x: 200, y: 85, position: 'neck', label: 'Neck' },

    // Shoulders
    { id: 'shoulder-left', x: 140, y: 100, position: 'shoulders', label: 'Shoulder' },
    { id: 'shoulder-right', x: 260, y: 100, position: 'shoulders', label: 'Shoulder' },

    // Bust/Chest
    { id: 'bust', x: 200, y: 140, position: 'chest', label: 'Bust' },
    { id: 'under-bust', x: 200, y: 155, position: 'chest', label: 'Under Bust' },
    { id: 'back-width', x: 200, y: 148, position: 'back', label: 'Back' },

    // Arms
    { id: 'bicep-left', x: 110, y: 155, position: 'arms', label: 'Bicep' },
    { id: 'bicep-right', x: 290, y: 155, position: 'arms', label: 'Bicep' },
    { id: 'elbow-left', x: 100, y: 215, position: 'arms', label: 'Elbow' },
    { id: 'elbow-right', x: 300, y: 215, position: 'arms', label: 'Elbow' },
    { id: 'wrist-left', x: 90, y: 275, position: 'arms', label: 'Wrist' },
    { id: 'wrist-right', x: 310, y: 275, position: 'arms', label: 'Wrist' },

    // Torso
    { id: 'waist', x: 200, y: 215, position: 'waist', label: 'Waist' },
    { id: 'high-hip', x: 200, y: 250, position: 'hips', label: 'High Hip' },
    { id: 'hips', x: 200, y: 285, position: 'hips', label: 'Full Hip' },

    // Crotch/Rise
    { id: 'crotch', x: 200, y: 320, position: 'crotch', label: 'Crotch' },

    // Legs
    { id: 'thigh-left', x: 175, y: 360, position: 'legs', label: 'Thigh' },
    { id: 'thigh-right', x: 225, y: 360, position: 'legs', label: 'Thigh' },
    { id: 'knee-left', x: 172, y: 430, position: 'legs', label: 'Knee' },
    { id: 'knee-right', x: 228, y: 430, position: 'legs', label: 'Knee' },
    { id: 'calf-left', x: 170, y: 490, position: 'legs', label: 'Calf' },
    { id: 'calf-right', x: 230, y: 490, position: 'legs', label: 'Calf' },
    { id: 'ankle-left', x: 168, y: 560, position: 'legs', label: 'Ankle' },
    { id: 'ankle-right', x: 232, y: 560, position: 'legs', label: 'Ankle' },
  ]

  return (
    <g>
      {/* Head */}
      <ellipse cx="200" cy="55" rx="28" ry="36" fill="url(#bodyGradient)" stroke="#64748b" strokeWidth="2" />

      {/* Neck - slimmer for female */}
      <path
        d="M 185 88 L 185 100 L 215 100 L 215 88"
        fill="url(#bodyGradient)"
        stroke="#64748b"
        strokeWidth="2"
      />

      {/* Torso - Female (hourglass shape - narrower shoulders, defined bust, narrow waist, wider hips) */}
      <path
        d="M 140 100
           L 130 110
           L 115 140
           L 110 170
           L 120 215
           L 130 250
           L 145 285
           L 155 320
           L 175 330
           L 225 330
           L 245 320
           L 255 285
           L 270 250
           L 280 215
           L 290 170
           L 285 140
           L 270 110
           L 260 100"
        fill="url(#bodyGradient)"
        stroke="#64748b"
        strokeWidth="2.5"
      />

      {/* Arms - Female (slimmer, more graceful) */}
      {/* Left arm */}
      <path
        d="M 140 100
           L 110 110
           L 95 155
           L 85 215
           L 80 275
           L 85 280"
        fill="url(#bodyGradient)"
        stroke="#64748b"
        strokeWidth="1.8"
      />

      {/* Right arm */}
      <path
        d="M 260 100
           L 290 110
           L 305 155
           L 315 215
           L 320 275
           L 315 280"
        fill="url(#bodyGradient)"
        stroke="#64748b"
        strokeWidth="1.8"
      />

      {/* Legs - Female (more curvaceous, closer together) */}
      {/* Left leg */}
      <path
        d="M 175 330
           L 172 360
           L 170 430
           L 168 490
           L 165 560
           L 170 565"
        fill="url(#bodyGradient)"
        stroke="#64748b"
        strokeWidth="2.2"
      />

      {/* Right leg */}
      <path
        d="M 225 330
           L 228 360
           L 230 430
           L 232 490
           L 235 560
           L 230 565"
        fill="url(#bodyGradient)"
        stroke="#64748b"
        strokeWidth="2.2"
      />

      {/* Bust definition */}
      <ellipse cx="200" cy="140" rx="45" ry="25" fill="none" stroke="#94a3b8" strokeWidth="1" opacity="0.3" />

      {/* Measurement lines and points */}
      {measurements.map((point) => {
        const isCompleted = completedParts.has(point.position)
        const isActive = activePoints.includes(point.position)
        const color = isCompleted ? '#22c55e' : isActive ? '#3b82f6' : '#94a3b8'

        return (
          <g key={point.id}>
            {/* Measurement line indicators */}
            {point.id === 'neck' && (
              <line x1={172} y1={85} x2={228} y2={85} stroke={color} strokeWidth="2" />
            )}
            {point.id === 'shoulder-left' && (
              <line x1={140} y1={100} x2={260} y2={100} stroke={color} strokeWidth="2" />
            )}
            {point.id === 'bust' && (
              <ellipse cx={200} cy={140} rx={65} ry={8} fill="none" stroke={color} strokeWidth="2" strokeDasharray="4,4" />
            )}
            {point.id === 'waist' && (
              <ellipse cx={200} cy={215} rx={50} ry={8} fill="none" stroke={color} strokeWidth="2" strokeDasharray="4,4" />
            )}
            {point.id === 'hips' && (
              <ellipse cx={200} cy={285} rx={70} ry={8} fill="none" stroke={color} strokeWidth="2" strokeDasharray="4,4" />
            )}

            {/* Measurement point markers */}
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill={color}
              stroke="white"
              strokeWidth="2"
              className="transition-all duration-300 cursor-pointer"
            />
            {isCompleted && (
              <text
                x={point.x}
                y={point.y + 1.5}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="8"
                fontWeight="bold"
              >
                ✓
              </text>
            )}
          </g>
        )
      })}
    </g>
  )
}

function ChildSilhouetteProfessional({
  completedParts,
  activePoints
}: {
  completedParts: Set<string>
  activePoints: string[]
}) {
  const measurements = [
    // Neck
    { id: 'neck', x: 200, y: 95, position: 'neck', label: 'Neck' },

    // Shoulders
    { id: 'shoulder-left', x: 145, y: 110, position: 'shoulders', label: 'Shoulder' },
    { id: 'shoulder-right', x: 255, y: 110, position: 'shoulders', label: 'Shoulder' },

    // Chest
    { id: 'chest', x: 200, y: 150, position: 'chest', label: 'Chest' },

    // Torso
    { id: 'waist', x: 200, y: 210, position: 'waist', label: 'Waist' },
    { id: 'hips', x: 200, y: 260, position: 'hips', label: 'Hips' },

    // Legs
    { id: 'thigh-left', x: 180, y: 320, position: 'legs', label: 'Thigh' },
    { id: 'thigh-right', x: 220, y: 320, position: 'legs', label: 'Thigh' },
    { id: 'knee-left', x: 177, y: 390, position: 'legs', label: 'Knee' },
    { id: 'knee-right', x: 223, y: 390, position: 'legs', label: 'Knee' },
  ]

  return (
    <g>
      {/* Head - proportionally larger for child */}
      <ellipse cx="200" cy="60" rx="32" ry="38" fill="url(#bodyGradient)" stroke="#64748b" strokeWidth="2" />

      {/* Neck - shorter */}
      <path
        d="M 187 93 L 187 110 L 213 110 L 213 93"
        fill="url(#bodyGradient)"
        stroke="#64748b"
        strokeWidth="2"
      />

      {/* Torso - Child (less defined muscles, smaller proportions) */}
      <path
        d="M 145 110
           L 135 120
           L 125 150
           L 125 210
           L 135 260
           L 155 290
           L 180 300
           L 220 300
           L 245 290
           L 265 260
           L 275 210
           L 275 150
           L 265 120
           L 255 110"
        fill="url(#bodyGradient)"
        stroke="#64748b"
        strokeWidth="2.5"
      />

      {/* Arms - Child (shorter, less muscular) */}
      {/* Left arm */}
      <path
        d="M 145 110
           L 115 120
           L 100 155
           L 95 200
           L 100 210"
        fill="url(#bodyGradient)"
        stroke="#64748b"
        strokeWidth="1.8"
      />

      {/* Right arm */}
      <path
        d="M 255 110
           L 285 120
           L 300 155
           L 305 200
           L 300 210"
        fill="url(#bodyGradient)"
        stroke="#64748b"
        strokeWidth="1.8"
      />

      {/* Legs - Child (shorter, less defined) */}
      {/* Left leg */}
      <path
        d="M 180 300
           L 177 320
           L 175 390
           L 173 460
           L 172 520"
        fill="url(#bodyGradient)"
        stroke="#64748b"
        strokeWidth="2.2"
      />

      {/* Right leg */}
      <path
        d="M 220 300
           L 223 320
           L 225 390
           L 227 460
           L 228 520"
        fill="url(#bodyGradient)"
        stroke="#64748b"
        strokeWidth="2.2"
      />

      {/* Measurement lines and points */}
      {measurements.map((point) => {
        const isCompleted = completedParts.has(point.position)
        const isActive = activePoints.includes(point.position)
        const color = isCompleted ? '#22c55e' : isActive ? '#3b82f6' : '#94a3b8'

        return (
          <g key={point.id}>
            {/* Measurement line indicators */}
            {point.id === 'neck' && (
              <line x1={175} y1={95} x2={225} y2={95} stroke={color} strokeWidth="2" />
            )}
            {point.id === 'shoulder-left' && (
              <line x1={145} y1={110} x2={255} y2={110} stroke={color} strokeWidth="2" />
            )}
            {point.id === 'chest' && (
              <ellipse cx={200} cy={150} rx={65} ry={8} fill="none" stroke={color} strokeWidth="2" strokeDasharray="4,4" />
            )}
            {point.id === 'waist' && (
              <ellipse cx={200} cy={210} rx={60} ry={8} fill="none" stroke={color} strokeWidth="2" strokeDasharray="4,4" />
            )}
            {point.id === 'hips' && (
              <ellipse cx={200} cy={260} rx={65} ry={8} fill="none" stroke={color} strokeWidth="2" strokeDasharray="4,4" />
            )}

            {/* Measurement point markers */}
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill={color}
              stroke="white"
              strokeWidth="2"
              className="transition-all duration-300 cursor-pointer"
            />
            {isCompleted && (
              <text
                x={point.x}
                y={point.y + 1.5}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="8"
                fontWeight="bold"
              >
                ✓
              </text>
            )}
          </g>
        )
      })}
    </g>
  )
}

import { PrismaClient, ServiceTrack } from '@prisma/client'

const prisma = new PrismaClient()

interface AssignmentTemplateData {
  level: number
  moduleNumber: string
  assignmentNumber: string
  orderIndex: number
  title: string
  description: string
  instructions?: string
  objectives: string[]
  skills: string[]
  expectedOutcome?: string
  passingCriteria?: string
  referencePhotos: string[]
  estimatedHours?: number
  difficulty: string
  category: string
  subcategory?: string
  serviceTrack: ServiceTrack
}

const printingPressCurriculum: AssignmentTemplateData[] = [
  // ============================================================================
  // LEVEL 1: FOUNDATION (Months 1-3)
  // ============================================================================

  // Module 1.1: Workshop Setup & Safety
  {
    level: 1,
    moduleNumber: '1.1',
    assignmentNumber: 'PP-1.1.1',
    orderIndex: 1,
    title: 'Printing Press Workshop Setup & Safety Protocols',
    description: 'Learn to set up a professional printing press workshop with proper safety measures, ventilation, lighting, and workflow organization.',
    instructions: `1. Study proper workshop layout for printing press operations
2. Learn ventilation requirements for working with inks and solvents
3. Understand electrical safety for press equipment
4. Set up proper lighting (5000K daylight bulbs for color accuracy)
5. Organize workflow zones: pre-press, printing, drying, post-press
6. Create safety checklist for daily operations
7. Study fire safety and emergency procedures
8. Set up proper storage for inks, solvents, and materials`,
    objectives: [
      'Design an efficient printing press workshop layout',
      'Implement proper ventilation and lighting systems',
      'Understand electrical safety requirements for press equipment',
      'Create organized workflow zones for maximum efficiency',
      'Establish comprehensive safety protocols',
    ],
    skills: ['Workshop organization', 'Safety protocols', 'Space planning', 'Risk assessment'],
    expectedOutcome: 'A complete workshop setup plan with safety checklist and workflow diagram.',
    passingCriteria: 'Workshop meets safety standards, has proper ventilation, organized zones, and comprehensive safety documentation',
    referencePhotos: ['/curriculum/printing/workshop-layout.jpg', '/curriculum/printing/safety-zones.jpg', '/curriculum/printing/ventilation-setup.jpg'],
    estimatedHours: 12,
    difficulty: 'beginner',
    category: 'setup',
    subcategory: 'safety',
    serviceTrack: 'printing_press' as ServiceTrack,
  },
  {
    level: 1,
    moduleNumber: '1.1',
    assignmentNumber: 'PP-1.1.2',
    orderIndex: 2,
    title: 'Printing Equipment Identification & Maintenance',
    description: 'Identify and understand all essential printing press equipment, machines, tools, and their proper maintenance procedures.',
    instructions: `1. Study different types of printing presses: screen printing, heat press, sublimation, DTG (Direct-to-Garment)
2. Learn platen press components and functions
3. Understand heat press types: clamshell, swing-away, draw
4. Identify screen printing equipment: frames, squeegees, emulsion, exposure unit
5. Study maintenance schedules for each machine type
6. Practice daily cleaning and lubrication procedures
7. Learn troubleshooting common mechanical issues
8. Create equipment maintenance log system`,
    objectives: [
      'Identify all major printing equipment types and their uses',
      'Understand the components of screen printing and heat press systems',
      'Perform daily maintenance and cleaning procedures',
      'Troubleshoot basic mechanical issues',
      'Maintain detailed equipment logs',
    ],
    skills: ['Equipment identification', 'Maintenance procedures', 'Troubleshooting', 'Documentation'],
    expectedOutcome: 'Demonstrate knowledge of all equipment types and complete a maintenance checklist for each machine.',
    passingCriteria: 'Correctly identify all equipment, perform maintenance procedures, and create accurate maintenance logs',
    referencePhotos: ['/curriculum/printing/heat-press.jpg', '/curriculum/printing/screen-press.jpg', '/curriculum/printing/dtg-printer.jpg', '/curriculum/printing/maintenance-tools.jpg'],
    estimatedHours: 10,
    difficulty: 'beginner',
    category: 'equipment',
    subcategory: 'identification',
    serviceTrack: 'printing_press' as ServiceTrack,
  },
  {
    level: 1,
    moduleNumber: '1.2',
    assignmentNumber: 'PP-1.2.1',
    orderIndex: 3,
    title: 'Fabric & Material Properties',
    description: 'Understand different fabric types, their properties, and which printing methods work best for each material.',
    instructions: `1. Study cotton: 100% cotton, ring-spun cotton, combed cotton
2. Learn about polyester and poly-cotton blends (50/50, 65/35)
3. Understand tri-blends and performance fabrics
4. Study fabric weights: lightweight (4-5 oz), medium (5-6 oz), heavyweight (6+ oz)
5. Learn about fabric weaves: jersey knit, French terry, fleece
6. Understand how fabric color affects print results (white, light, dark, fluorescent)
7. Study specialty materials: canvas bags, hoodies, caps, aprons
8. Test print on 10 different fabric types and document results`,
    objectives: [
      'Identify common fabric types and their properties',
      'Understand fabric weight and how it affects printing',
      'Match printing methods to fabric types',
      'Predict how fabric color impacts final print quality',
      'Work with specialty materials beyond standard t-shirts',
    ],
    skills: ['Material identification', 'Fabric properties', 'Print compatibility', 'Quality prediction'],
    expectedOutcome: 'A fabric swatch book with 10 different materials, each with test prints and documentation of results.',
    passingCriteria: 'Correctly identify all fabric types, demonstrate understanding of print compatibility, produce quality test prints',
    referencePhotos: ['/curriculum/printing/fabric-types.jpg', '/curriculum/printing/fabric-swatches.jpg', '/curriculum/printing/material-samples.jpg'],
    estimatedHours: 8,
    difficulty: 'beginner',
    category: 'materials',
    subcategory: 'fabric',
    serviceTrack: 'printing_press' as ServiceTrack,
  },
  {
    level: 1,
    moduleNumber: '1.2',
    assignmentNumber: 'PP-1.2.2',
    orderIndex: 4,
    title: 'Ink Types & Color Theory',
    description: 'Learn about different ink types (plastisol, water-based, discharge, sublimation) and master color theory for printing.',
    instructions: `1. Study plastisol ink: properties, curing temperature (320°F), opacity, durability
2. Learn water-based inks: eco-friendly, softer feel, curing requirements
3. Understand discharge inks for dark garments (removes dye, adds color)
4. Study sublimation inks for polyester (heat-activated dye process)
5. Learn DTG inks: CMYK + white ink systems
6. Master the color wheel: primary, secondary, tertiary colors
7. Understand color mixing: PMS (Pantone Matching System), RGB vs CMYK
8. Practice mixing custom colors using base inks
9. Create a color swatch library`,
    objectives: [
      'Identify different ink types and their applications',
      'Understand curing temperatures and times for each ink type',
      'Master color theory and color mixing principles',
      'Match Pantone colors using base inks',
      'Create and maintain a custom color library',
    ],
    skills: ['Ink identification', 'Color theory', 'Color mixing', 'Quality control'],
    expectedOutcome: 'A color swatch library with 20 custom mixed colors, documented formulas, and ink type samples.',
    passingCriteria: 'Accurately mix colors to match Pantone standards, demonstrate knowledge of ink properties and curing requirements',
    referencePhotos: ['/curriculum/printing/ink-types.jpg', '/curriculum/printing/color-wheel.jpg', '/curriculum/printing/color-mixing.jpg', '/curriculum/printing/swatch-library.jpg'],
    estimatedHours: 12,
    difficulty: 'beginner',
    category: 'materials',
    subcategory: 'inks',
    serviceTrack: 'printing_press' as ServiceTrack,
  },
  {
    level: 1,
    moduleNumber: '1.3',
    assignmentNumber: 'PP-1.3.1',
    orderIndex: 5,
    title: 'Typography & Design Fundamentals',
    description: 'Master typography basics, font selection, design composition, and prepare artwork for printing.',
    instructions: `1. Study typography basics: serif vs sans-serif, script, display fonts
2. Learn font pairing principles for professional designs
3. Understand legibility and readability at different sizes
4. Study design composition: balance, alignment, proximity, contrast
5. Learn about print resolution requirements (300 DPI minimum)
6. Understand vector vs raster graphics (AI, EPS, SVG vs PNG, JPG)
7. Practice creating simple text-based designs
8. Learn color separation for multi-color prints
9. Prepare 5 designs for print production`,
    objectives: [
      'Understand typography principles and font selection',
      'Create balanced, professional design compositions',
      'Prepare artwork at correct resolution and format',
      'Separate colors for multi-color screen printing',
      'Use design software (Adobe Illustrator, Photoshop, or free alternatives)',
    ],
    skills: ['Typography', 'Design composition', 'File preparation', 'Color separation', 'Software proficiency'],
    expectedOutcome: 'Five print-ready designs demonstrating typography, composition, and color separation skills.',
    passingCriteria: 'Designs are print-ready at 300 DPI, properly color-separated, and demonstrate strong typography and composition',
    referencePhotos: ['/curriculum/printing/typography-examples.jpg', '/curriculum/printing/design-composition.jpg', '/curriculum/printing/color-separation.jpg'],
    estimatedHours: 16,
    difficulty: 'beginner',
    category: 'design',
    subcategory: 'typography',
    serviceTrack: 'printing_press' as ServiceTrack,
  },

  // Module 1.4: First Prints
  {
    level: 1,
    moduleNumber: '1.4',
    assignmentNumber: 'PP-1.4.1',
    orderIndex: 6,
    title: 'Heat Press Basics: Vinyl Transfer',
    description: 'Learn the fundamentals of heat transfer vinyl (HTV) application using a heat press for single-color designs.',
    instructions: `1. Study heat transfer vinyl (HTV) types: standard, glitter, flock, metallic, glow-in-dark
2. Learn weeding techniques for vinyl (removing negative space)
3. Understand heat press settings: temperature (305-315°F), pressure (medium-firm), time (10-15 sec)
4. Practice proper garment preparation and positioning
5. Learn hot peel vs cold peel vinyl
6. Study layering multiple vinyl colors
7. Practice creating simple vinyl designs using cutting software (Cricut, Silhouette)
8. Complete 10 single-color vinyl transfers on different garments`,
    objectives: [
      'Identify different HTV types and their applications',
      'Master weeding techniques for clean vinyl transfers',
      'Operate heat press with correct temperature, pressure, and time settings',
      'Position designs accurately on garments',
      'Produce professional-quality vinyl transfers',
    ],
    skills: ['Vinyl cutting', 'Weeding', 'Heat press operation', 'Design positioning', 'Quality control'],
    expectedOutcome: 'Ten completed garments with single-color vinyl transfers demonstrating proper technique and quality.',
    passingCriteria: 'All transfers are properly adhered, free from bubbles/wrinkles, accurately positioned, and durable',
    referencePhotos: ['/curriculum/printing/htv-types.jpg', '/curriculum/printing/weeding-vinyl.jpg', '/curriculum/printing/heat-press-vinyl.jpg', '/curriculum/printing/vinyl-samples.jpg'],
    estimatedHours: 10,
    difficulty: 'beginner',
    category: 'technique',
    subcategory: 'vinyl',
    serviceTrack: 'printing_press' as ServiceTrack,
  },

  // ============================================================================
  // LEVEL 2: SCREEN PRINTING FUNDAMENTALS (Months 4-6)
  // ============================================================================

  // Module 2.1: Screen Preparation
  {
    level: 2,
    moduleNumber: '2.1',
    assignmentNumber: 'PP-2.1.1',
    orderIndex: 7,
    title: 'Screen Mesh Selection & Frame Preparation',
    description: 'Learn to select appropriate screen mesh counts and prepare aluminum or wooden frames for screen printing.',
    instructions: `1. Study mesh counts: 110 (heavy inks/glitter), 156 (standard), 200 (fine detail), 305 (halftones)
2. Learn mesh types: white, yellow (dyed), thread diameter
3. Understand frame types: aluminum vs wood, sizes (18x20", 20x24", 23x31")
4. Practice stretching mesh on frames with proper tension
5. Learn to use a tension meter (target: 20-25 Newtons)
6. Study frame cleaning and degreasing procedures
7. Prepare 5 screens with different mesh counts for various applications`,
    objectives: [
      'Select appropriate mesh count for different ink types and detail levels',
      'Stretch mesh on frames achieving proper tension',
      'Use a tension meter to verify screen quality',
      'Clean and prepare frames for emulsion coating',
    ],
    skills: ['Mesh selection', 'Screen stretching', 'Tension measurement', 'Frame preparation'],
    expectedOutcome: 'Five properly stretched and prepared screens with documented mesh counts and tension readings.',
    passingCriteria: 'Screens have uniform tension (20-25N), are clean and degreased, mesh count is appropriate for intended use',
    referencePhotos: ['/curriculum/printing/mesh-types.jpg', '/curriculum/printing/screen-stretching.jpg', '/curriculum/printing/tension-meter.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'screen-prep',
    subcategory: 'frames',
    serviceTrack: 'printing_press' as ServiceTrack,
  },
  {
    level: 2,
    moduleNumber: '2.1',
    assignmentNumber: 'PP-2.1.2',
    orderIndex: 8,
    title: 'Emulsion Coating Techniques',
    description: 'Master the art of coating screens with photo emulsion for screen printing stencil creation.',
    instructions: `1. Study emulsion types: diazo-based, photopolymer, dual-cure
2. Learn emulsion mixing procedures (adding diazo sensitizer)
3. Understand coating technique: scoop coater usage, wet-on-wet vs wet-on-dry
4. Practice coating screens in darkroom/yellow light conditions
5. Learn optimal coating thickness: 1-2 coats on print side, 1 coat on squeegee side
6. Study drying requirements: horizontal drying, dehumidified environment
7. Master edge coating and streak-free technique
8. Coat 10 screens with uniform, streak-free emulsion`,
    objectives: [
      'Mix photo emulsion with proper sensitizer ratios',
      'Coat screens uniformly using a scoop coater',
      'Work safely in darkroom conditions',
      'Achieve optimal emulsion thickness for sharp prints',
      'Dry screens properly to prevent premature exposure',
    ],
    skills: ['Emulsion mixing', 'Screen coating', 'Darkroom procedures', 'Quality control'],
    expectedOutcome: 'Ten coated screens with uniform, streak-free emulsion ready for exposure.',
    passingCriteria: 'Emulsion is evenly coated, free from streaks/bubbles, proper thickness, dried completely',
    referencePhotos: ['/curriculum/printing/emulsion-types.jpg', '/curriculum/printing/coating-technique.jpg', '/curriculum/printing/screen-drying.jpg'],
    estimatedHours: 10,
    difficulty: 'intermediate',
    category: 'screen-prep',
    subcategory: 'emulsion',
    serviceTrack: 'printing_press' as ServiceTrack,
  },
  {
    level: 2,
    moduleNumber: '2.2',
    assignmentNumber: 'PP-2.2.1',
    orderIndex: 9,
    title: 'Film Positive Creation & Screen Exposure',
    description: 'Learn to create film positives from artwork and properly expose screens to create printing stencils.',
    instructions: `1. Study transparency types: vellum, clear inkjet film, laser film
2. Learn artwork output requirements: pure black, high opacity
3. Practice printing film positives with maximum ink density
4. Understand exposure units: UV light box, DIY exposure units, sunlight exposure
5. Learn exposure calculations: mesh count + emulsion type = exposure time
6. Study exposure testing: step wedge method to find optimal time
7. Practice positioning films on screens accurately
8. Master washout technique: water pressure, temperature, timing
9. Expose and develop 10 screens with different designs`,
    objectives: [
      'Create high-quality film positives from digital artwork',
      'Calculate proper exposure times based on mesh and emulsion',
      'Use exposure equipment safely and effectively',
      'Wash out screens to reveal sharp, accurate stencils',
      'Troubleshoot common exposure problems (underexposure, overexposure)',
    ],
    skills: ['Film output', 'Exposure calculation', 'UV exposure', 'Screen development', 'Troubleshooting'],
    expectedOutcome: 'Ten fully exposed and developed screens with sharp, accurate stencils ready for printing.',
    passingCriteria: 'Stencils are sharp with no pinholes, edges are clean, fine details are captured, screens rinse clean',
    referencePhotos: ['/curriculum/printing/film-positives.jpg', '/curriculum/printing/exposure-unit.jpg', '/curriculum/printing/screen-washout.jpg', '/curriculum/printing/stencil-quality.jpg'],
    estimatedHours: 14,
    difficulty: 'intermediate',
    category: 'screen-prep',
    subcategory: 'exposure',
    serviceTrack: 'printing_press' as ServiceTrack,
  },

  // Module 2.3: Screen Printing Technique
  {
    level: 2,
    moduleNumber: '2.3',
    assignmentNumber: 'PP-2.3.1',
    orderIndex: 10,
    title: 'Single-Color Screen Printing',
    description: 'Master the fundamentals of single-color screen printing including squeegee technique, ink application, and quality control.',
    instructions: `1. Study squeegee types: durometer (hardness), blade profiles (square, rounded, beveled)
2. Learn proper squeegee angle (45 degrees) and pressure
3. Understand off-contact printing: screen should lift 1/8" off garment
4. Practice flood stroke and print stroke techniques
5. Learn proper ink consistency (should flow but not bleed)
6. Study registration marks and garment positioning
7. Master test printing and quality checks
8. Complete a run of 25 single-color prints on t-shirts`,
    objectives: [
      'Select appropriate squeegee for ink type and detail level',
      'Maintain proper squeegee angle and pressure throughout print run',
      'Set up screen with correct off-contact distance',
      'Produce consistent, high-quality prints across entire run',
      'Identify and correct common printing problems',
    ],
    skills: ['Squeegee technique', 'Ink application', 'Registration', 'Quality control', 'Consistency'],
    expectedOutcome: 'Twenty-five single-color printed t-shirts with consistent quality and proper ink coverage.',
    passingCriteria: 'All prints are sharp, have even ink coverage, are properly registered, and free from defects',
    referencePhotos: ['/curriculum/printing/squeegee-types.jpg', '/curriculum/printing/print-stroke.jpg', '/curriculum/printing/off-contact.jpg', '/curriculum/printing/quality-check.jpg'],
    estimatedHours: 16,
    difficulty: 'intermediate',
    category: 'printing',
    subcategory: 'technique',
    serviceTrack: 'printing_press' as ServiceTrack,
  },
  {
    level: 2,
    moduleNumber: '2.3',
    assignmentNumber: 'PP-2.3.2',
    orderIndex: 11,
    title: 'Ink Curing & Quality Testing',
    description: 'Learn proper ink curing techniques and testing methods to ensure print durability and washfastness.',
    instructions: `1. Study curing requirements for different inks (plastisol: 320°F, water-based: 330°F)
2. Learn about flash dryers vs conveyor dryers vs heat guns
3. Understand temperature verification: laser thermometer, temp strips
4. Practice proper conveyor dryer belt speed and temperature settings
5. Learn the wash test protocol: stretch test, wash/dry 5 cycles
6. Study common curing problems: under-cured (ink washes out), over-cured (scorching)
7. Practice curing on different fabric colors and types
8. Perform quality testing on all prints`,
    objectives: [
      'Set proper curing temperatures and times for different ink types',
      'Use temperature verification tools accurately',
      'Operate conveyor dryers and flash cure units safely',
      'Perform wash testing to verify cure quality',
      'Troubleshoot curing problems',
    ],
    skills: ['Curing technique', 'Temperature control', 'Quality testing', 'Equipment operation'],
    expectedOutcome: 'Documentation of curing tests on 10 different fabric/ink combinations with wash test results.',
    passingCriteria: 'All samples pass stretch test and 5-cycle wash test with no ink degradation',
    referencePhotos: ['/curriculum/printing/conveyor-dryer.jpg', '/curriculum/printing/temp-verification.jpg', '/curriculum/printing/wash-test.jpg'],
    estimatedHours: 10,
    difficulty: 'intermediate',
    category: 'finishing',
    subcategory: 'curing',
    serviceTrack: 'printing_press' as ServiceTrack,
  },

  // Module 2.4: Multi-Color Printing
  {
    level: 2,
    moduleNumber: '2.4',
    assignmentNumber: 'PP-2.4.1',
    orderIndex: 12,
    title: 'Two-Color Registration & Printing',
    description: 'Learn to register and print two-color designs with precise color alignment.',
    instructions: `1. Study registration methods: manual registration, micro-registration systems
2. Learn about registration marks on films and screens
3. Practice setting up two screens on a press with proper alignment
4. Understand the flash cure process for multi-color printing
5. Learn color printing order (typically light to dark)
6. Master the "touch and pull" technique for registration
7. Practice maintaining registration throughout production run
8. Complete a 25-piece run of a two-color design`,
    objectives: [
      'Register two screens accurately using registration marks',
      'Flash cure first color without scorching',
      'Maintain consistent registration across production run',
      'Troubleshoot registration problems',
      'Produce professional two-color prints',
    ],
    skills: ['Multi-color registration', 'Flash curing', 'Color layering', 'Consistency maintenance'],
    expectedOutcome: 'Twenty-five two-color t-shirts with perfect or near-perfect registration (within 1/16").',
    passingCriteria: 'Registration is tight (<1/16" variance), colors are clean, no smudging between layers',
    referencePhotos: ['/curriculum/printing/registration-marks.jpg', '/curriculum/printing/two-color-setup.jpg', '/curriculum/printing/flash-cure.jpg', '/curriculum/printing/two-color-sample.jpg'],
    estimatedHours: 18,
    difficulty: 'intermediate',
    category: 'printing',
    subcategory: 'multi-color',
    serviceTrack: 'printing_press' as ServiceTrack,
  },

  // ============================================================================
  // LEVEL 3: ADVANCED TECHNIQUES (Months 7-10)
  // ============================================================================

  // Module 3.1: Advanced Screen Printing
  {
    level: 3,
    moduleNumber: '3.1',
    assignmentNumber: 'PP-3.1.1',
    orderIndex: 13,
    title: 'Four-Color Process (CMYK) Printing',
    description: 'Master four-color process printing to reproduce full-color photographic images on garments.',
    instructions: `1. Study CMYK color separation in design software (Photoshop, Illustrator)
2. Learn halftone screen angles: C=15°, M=75°, Y=0°, K=45° to prevent moiré
3. Understand halftone dot size and frequency (45-55 LPI for garments)
4. Practice creating color separations from photographs
5. Learn underbase printing for dark garments (white underbase)
6. Master precise four-screen registration
7. Study proper printing order: white base (if needed) → C → M → Y → K
8. Complete a full-color process print project`,
    objectives: [
      'Create proper CMYK separations with correct screen angles',
      'Print white underbase on dark garments',
      'Register four screens with precision',
      'Produce photographic-quality full-color prints',
      'Troubleshoot moiré patterns and color shifts',
    ],
    skills: ['Color separation', 'Halftone techniques', 'Complex registration', 'Process printing'],
    expectedOutcome: 'A full-color photographic print on both light and dark garments with proper color reproduction.',
    passingCriteria: 'Colors are accurate, no moiré patterns, registration is tight, image is sharp and photographic quality',
    referencePhotos: ['/curriculum/printing/cmyk-separation.jpg', '/curriculum/printing/halftone-angles.jpg', '/curriculum/printing/process-print-sample.jpg'],
    estimatedHours: 24,
    difficulty: 'advanced',
    category: 'printing',
    subcategory: 'process',
    serviceTrack: 'printing_press' as ServiceTrack,
  },
  {
    level: 3,
    moduleNumber: '3.1',
    assignmentNumber: 'PP-3.1.2',
    orderIndex: 14,
    title: 'Discharge & Water-Based Printing',
    description: 'Learn discharge printing techniques for dark garments and water-based inks for soft-hand prints.',
    instructions: `1. Study discharge ink chemistry: removes garment dye, activates with heat
2. Learn discharge-safe fabrics (100% cotton, some blends) vs non-dischargeable (polyester)
3. Practice discharge base printing (removes dye to white/cream)
4. Learn discharge + color printing (simultaneous dye removal and color addition)
5. Master water-based ink printing: proper ink viscosity, fast printing required
6. Study water-based additives: retarders, reducers, binders
7. Learn cleanup procedures for water-based inks (wash before drying)
8. Complete discharge and water-based print projects`,
    objectives: [
      'Identify discharge-safe fabrics and understand chemistry',
      'Print discharge designs that remove dye cleanly',
      'Mix discharge inks with activator in proper ratios',
      'Print water-based inks before they dry in screen',
      'Achieve soft-hand prints with water-based techniques',
    ],
    skills: ['Discharge chemistry', 'Water-based printing', 'Fabric compatibility', 'Speed printing'],
    expectedOutcome: 'Discharge prints on dark garments and water-based prints demonstrating soft-hand technique.',
    passingCriteria: 'Discharge fully removes dye, water-based prints are soft to touch, no ink drying in screens',
    referencePhotos: ['/curriculum/printing/discharge-sample.jpg', '/curriculum/printing/water-based-ink.jpg', '/curriculum/printing/soft-hand-print.jpg'],
    estimatedHours: 20,
    difficulty: 'advanced',
    category: 'printing',
    subcategory: 'specialty',
    serviceTrack: 'printing_press' as ServiceTrack,
  },

  // Module 3.2: Sublimation Printing
  {
    level: 3,
    moduleNumber: '3.2',
    assignmentNumber: 'PP-3.2.1',
    orderIndex: 15,
    title: 'Dye Sublimation Printing Fundamentals',
    description: 'Learn dye sublimation printing for polyester garments and hard substrates using heat-activated dye transfer.',
    instructions: `1. Study sublimation chemistry: heat converts solid dye to gas, bonds with polyester
2. Learn sublimation printer setup: Epson EcoTank, Sawgrass printers, sublimation ink
3. Understand polyester requirements: 65%+ polyester for vibrant results
4. Study sublimation on white vs light-colored garments (no white ink in sublimation)
5. Practice printing on sublimation paper with mirror image
6. Learn heat press settings for sublimation: 400°F, 45-60 seconds, medium-heavy pressure
7. Master sublimation on hard goods: mugs, phone cases, tiles, keychains
8. Complete sublimation projects on fabric and hard substrates`,
    objectives: [
      'Set up and operate sublimation printer with correct profiles',
      'Identify sublimation-compatible fabrics and products',
      'Transfer designs to polyester garments with vibrant colors',
      'Sublimate on hard goods using heat press and mug press',
      'Understand limitations of sublimation (polyester-only, no white ink)',
    ],
    skills: ['Sublimation printing', 'Printer operation', 'Heat press technique', 'Product selection'],
    expectedOutcome: 'Sublimation prints on polyester t-shirts, mugs, and other substrates showing vibrant color and durability.',
    passingCriteria: 'Colors are vibrant, transfer is complete, no ghosting or blurring, durable through washing',
    referencePhotos: ['/curriculum/printing/sublimation-printer.jpg', '/curriculum/printing/sublimation-samples.jpg', '/curriculum/printing/mug-press.jpg'],
    estimatedHours: 16,
    difficulty: 'advanced',
    category: 'sublimation',
    subcategory: 'technique',
    serviceTrack: 'printing_press' as ServiceTrack,
  },

  // Module 3.3: DTG (Direct-to-Garment) Printing
  {
    level: 3,
    moduleNumber: '3.3',
    assignmentNumber: 'PP-3.3.1',
    orderIndex: 16,
    title: 'DTG Printer Operation & Maintenance',
    description: 'Learn to operate and maintain Direct-to-Garment (DTG) printers for high-quality digital printing on textiles.',
    instructions: `1. Study DTG printer types: Epson-based (Brother GTX, Ricoh Ri), industrial (Kornit, M&R)
2. Learn DTG ink system: CMYK + white ink, ink circulation, maintenance cycles
3. Understand printhead maintenance: nozzle checks, head cleaning, manual cleaning
4. Practice garment preparation: pre-treatment spray, heat pressing, platen setup
5. Learn RIP software: design import, color management, print queue
6. Study white ink underbase for dark garments: coverage, thickness
7. Master garment loading and platen height adjustment
8. Practice daily, weekly, and monthly maintenance procedures`,
    objectives: [
      'Operate DTG printer with proper RIP software settings',
      'Perform daily maintenance to prevent printhead clogs',
      'Pre-treat garments for optimal ink adhesion',
      'Print white underbase on dark garments effectively',
      'Troubleshoot common DTG issues (banding, color shifts, white ink problems)',
    ],
    skills: ['DTG operation', 'Printer maintenance', 'Pre-treatment', 'RIP software', 'Troubleshooting'],
    expectedOutcome: 'Successfully operate DTG printer to produce high-quality prints on light and dark garments with proper maintenance.',
    passingCriteria: 'Prints are sharp, colors are accurate, white ink is opaque, no banding or defects, printer maintenance is current',
    referencePhotos: ['/curriculum/printing/dtg-printer.jpg', '/curriculum/printing/pre-treatment.jpg', '/curriculum/printing/dtg-sample.jpg'],
    estimatedHours: 20,
    difficulty: 'advanced',
    category: 'dtg',
    subcategory: 'operation',
    serviceTrack: 'printing_press' as ServiceTrack,
  },

  // Module 3.4: Specialty Techniques
  {
    level: 3,
    moduleNumber: '3.4',
    assignmentNumber: 'PP-3.4.1',
    orderIndex: 17,
    title: 'Specialty Inks & Effects',
    description: 'Master specialty ink applications including glitter, puff, foil, and glow-in-the-dark for unique print effects.',
    instructions: `1. Study glitter ink: silver, gold, colored glitter, proper mesh count (86-110)
2. Learn puff ink: expansion additive, heat activation, design considerations
3. Master foil application: foil adhesive, heat press transfer, foil types
4. Practice high-density printing: multiple layers, dimensional effects
5. Study reflective inks for safety/fashion applications
6. Learn glow-in-the-dark ink: charge time, glow duration
7. Practice metallic inks: gold, silver, copper
8. Create sample set of all specialty techniques`,
    objectives: [
      'Print glitter ink with proper mesh count and curing',
      'Create puff prints with even expansion',
      'Apply foil transfers with complete adhesion',
      'Build high-density prints with dimensional effects',
      'Use specialty inks for unique visual effects',
    ],
    skills: ['Specialty inks', 'Effect printing', 'Foil application', 'Creative techniques'],
    expectedOutcome: 'A sample collection showcasing glitter, puff, foil, high-density, reflective, and glow prints.',
    passingCriteria: 'All specialty techniques are executed properly, effects are consistent, durability meets standards',
    referencePhotos: ['/curriculum/printing/glitter-ink.jpg', '/curriculum/printing/puff-print.jpg', '/curriculum/printing/foil-transfer.jpg', '/curriculum/printing/specialty-samples.jpg'],
    estimatedHours: 18,
    difficulty: 'advanced',
    category: 'printing',
    subcategory: 'specialty',
    serviceTrack: 'printing_press' as ServiceTrack,
  },

  // ============================================================================
  // LEVEL 4: PRODUCTION & BUSINESS (Months 11-14)
  // ============================================================================

  // Module 4.1: Production Management
  {
    level: 4,
    moduleNumber: '4.1',
    assignmentNumber: 'PP-4.1.1',
    orderIndex: 18,
    title: 'Production Workflow & Efficiency',
    description: 'Learn to manage production workflows, optimize efficiency, and handle large print runs professionally.',
    instructions: `1. Study production planning: job sheets, material lists, timeline estimation
2. Learn batch processing techniques for efficiency
3. Understand production bottlenecks and how to eliminate them
4. Practice gang sheet layouts to maximize printer usage
5. Study quality control checkpoints throughout production
6. Learn team coordination for multi-person production
7. Master inventory management for inks, garments, and supplies
8. Complete a simulated 500-piece order from start to finish`,
    objectives: [
      'Create detailed production plans and timelines',
      'Optimize workflow for maximum efficiency',
      'Coordinate team members in production environment',
      'Maintain quality control throughout large runs',
      'Manage inventory and material ordering',
    ],
    skills: ['Production planning', 'Workflow optimization', 'Quality control', 'Team management', 'Inventory'],
    expectedOutcome: 'A completed 500-piece simulated order with documentation of workflow, timeline, and quality checks.',
    passingCriteria: 'Order completed on time, quality is consistent across all pieces, workflow is documented and efficient',
    referencePhotos: ['/curriculum/printing/production-floor.jpg', '/curriculum/printing/job-sheet.jpg', '/curriculum/printing/qc-station.jpg'],
    estimatedHours: 24,
    difficulty: 'advanced',
    category: 'production',
    subcategory: 'management',
    serviceTrack: 'printing_press' as ServiceTrack,
  },
  {
    level: 4,
    moduleNumber: '4.1',
    assignmentNumber: 'PP-4.1.2',
    orderIndex: 19,
    title: 'Pricing, Quoting & Order Management',
    description: 'Master the business side of printing: calculating costs, creating quotes, and managing customer orders.',
    instructions: `1. Study cost calculation: materials (garment, ink, supplies), labor, overhead, profit margin
2. Learn competitive pricing strategies for different market segments
3. Practice creating detailed quotes for various order types
4. Understand price breaks: 1-11, 12-35, 36-71, 72-143, 144+ pieces
5. Study rush order pricing and minimums
6. Learn to estimate artwork/setup charges
7. Master order management: deposits, production tracking, delivery scheduling
8. Create pricing templates and quote calculators`,
    objectives: [
      'Calculate true cost of production including all factors',
      'Price competitively while maintaining healthy profit margins',
      'Create professional quotes for customers',
      'Manage orders from quote to delivery',
      'Communicate timelines and expectations clearly',
    ],
    skills: ['Cost analysis', 'Pricing strategy', 'Quote creation', 'Order management', 'Customer communication'],
    expectedOutcome: 'Pricing templates, quote calculator, and sample quotes for 10 different order scenarios.',
    passingCriteria: 'Pricing is competitive and profitable, quotes are professional and detailed, order management system is functional',
    referencePhotos: ['/curriculum/printing/price-sheet.jpg', '/curriculum/printing/quote-template.jpg', '/curriculum/printing/order-form.jpg'],
    estimatedHours: 16,
    difficulty: 'advanced',
    category: 'business',
    subcategory: 'pricing',
    serviceTrack: 'printing_press' as ServiceTrack,
  },

  // Module 4.2: Customer Service & Design
  {
    level: 4,
    moduleNumber: '4.2',
    assignmentNumber: 'PP-4.2.1',
    orderIndex: 20,
    title: 'Customer Artwork & Design Services',
    description: 'Learn to work with customer artwork, provide design services, and manage client expectations.',
    instructions: `1. Study file format requirements and how to communicate them to customers
2. Learn to assess customer artwork: resolution, color mode, print-readiness
3. Practice vectorizing raster images and cleaning up artwork
4. Understand mock-up creation for customer approval
5. Learn to communicate design limitations (no white in sublimation, color count costs, etc.)
6. Master the revision process and setting clear revision limits
7. Study copyright and trademark considerations
8. Create design packages at different price points`,
    objectives: [
      'Evaluate customer artwork for print-readiness',
      'Provide professional design services and revisions',
      'Create accurate mock-ups for approval',
      'Communicate technical limitations clearly',
      'Protect business from copyright issues',
    ],
    skills: ['Artwork evaluation', 'Design services', 'Mock-up creation', 'Client communication', 'Copyright awareness'],
    expectedOutcome: 'Portfolio of design work, mock-up templates, and client communication templates.',
    passingCriteria: 'Designs are print-ready, mock-ups are accurate, client communication is professional and clear',
    referencePhotos: ['/curriculum/printing/mockup-examples.jpg', '/curriculum/printing/design-portfolio.jpg'],
    estimatedHours: 14,
    difficulty: 'advanced',
    category: 'business',
    subcategory: 'design-services',
    serviceTrack: 'printing_press' as ServiceTrack,
  },

  // Module 4.3: Marketing & Sales
  {
    level: 4,
    moduleNumber: '4.3',
    assignmentNumber: 'PP-4.3.1',
    orderIndex: 21,
    title: 'Marketing Your Printing Business',
    description: 'Develop marketing strategies to attract and retain printing customers.',
    instructions: `1. Study target markets: schools/sports, businesses/corporate, events, non-profits, bands/artists
2. Learn to create a professional sample kit and portfolio
3. Practice photography for showcasing printed products
4. Understand social media marketing for printers (Instagram, Facebook, TikTok)
5. Study local marketing: business cards, flyers, networking events
6. Learn email marketing for repeat customers and promotions
7. Master referral program setup to generate word-of-mouth
8. Create a complete marketing plan`,
    objectives: [
      'Identify and target ideal customer segments',
      'Create professional marketing materials and portfolio',
      'Use social media effectively to showcase work',
      'Network locally to build customer base',
      'Develop systems for repeat business and referrals',
    ],
    skills: ['Marketing strategy', 'Photography', 'Social media', 'Networking', 'Business development'],
    expectedOutcome: 'Complete marketing plan, professional portfolio, social media content calendar, and sample kit.',
    passingCriteria: 'Marketing materials are professional, strategy targets right customers, social media presence is active',
    referencePhotos: ['/curriculum/printing/marketing-materials.jpg', '/curriculum/printing/sample-kit.jpg', '/curriculum/printing/social-media.jpg'],
    estimatedHours: 16,
    difficulty: 'advanced',
    category: 'business',
    subcategory: 'marketing',
    serviceTrack: 'printing_press' as ServiceTrack,
  },

  // ============================================================================
  // LEVEL 5: MASTERY & SPECIALIZATION (Months 15-18)
  // ============================================================================

  // Module 5.1: Advanced Projects
  {
    level: 5,
    moduleNumber: '5.1',
    assignmentNumber: 'PP-5.1.1',
    orderIndex: 22,
    title: 'All-Over Print (AOP) Garments',
    description: 'Master all-over printing techniques for sublimation and DTG to create fully printed garments.',
    instructions: `1. Study AOP garment construction: cut-and-sew vs pre-sewn garments
2. Learn AOP template creation for different garment types
3. Practice seamless pattern design for all-over prints
4. Understand bleed and seam allowances in AOP designs
5. Master sublimation on large-format printers for AOP panels
6. Learn DTG all-over printing on pre-constructed garments
7. Study finishing techniques for professional results
8. Complete AOP projects in both sublimation and DTG methods`,
    objectives: [
      'Create all-over print templates for various garments',
      'Design seamless patterns with proper registration',
      'Print AOP panels using sublimation',
      'Execute all-over DTG prints on finished garments',
      'Produce professional-quality AOP products',
    ],
    skills: ['AOP design', 'Template creation', 'Large-format printing', 'Advanced DTG', 'Pattern design'],
    expectedOutcome: 'Multiple all-over print garments in different styles using sublimation and DTG methods.',
    passingCriteria: 'Patterns align at seams, colors are vibrant, no white gaps, professional finishing',
    referencePhotos: ['/curriculum/printing/aop-template.jpg', '/curriculum/printing/aop-sublimation.jpg', '/curriculum/printing/aop-sample.jpg'],
    estimatedHours: 20,
    difficulty: 'expert',
    category: 'advanced',
    subcategory: 'aop',
    serviceTrack: 'printing_press' as ServiceTrack,
  },
  {
    level: 5,
    moduleNumber: '5.1',
    assignmentNumber: 'PP-5.1.2',
    orderIndex: 23,
    title: 'Embroidery & Print Combination',
    description: 'Learn to combine embroidery with printing techniques for premium, multi-textured products.',
    instructions: `1. Study embroidery basics: digitizing software, thread types, stabilizers
2. Learn embroidery machine operation and maintenance
3. Practice simple embroidery designs: text, logos, fills
4. Understand combining screen printing + embroidery on same garment
5. Study proper sequencing: embroider first or print first
6. Learn registration between print and embroidery elements
7. Master appliqué techniques combined with printing
8. Create high-end products using combined techniques`,
    objectives: [
      'Operate embroidery machine for basic designs',
      'Combine printing and embroidery on single products',
      'Sequence production properly for best results',
      'Create premium multi-technique products',
      'Understand pricing for combined services',
    ],
    skills: ['Embroidery basics', 'Multi-technique production', 'Appliqué', 'Premium finishing'],
    expectedOutcome: 'Products showcasing combined printing and embroidery techniques with professional results.',
    passingCriteria: 'Embroidery is clean, registration with prints is accurate, combined effect is premium quality',
    referencePhotos: ['/curriculum/printing/embroidery-machine.jpg', '/curriculum/printing/print-embroidery-combo.jpg'],
    estimatedHours: 18,
    difficulty: 'expert',
    category: 'advanced',
    subcategory: 'multi-technique',
    serviceTrack: 'printing_press' as ServiceTrack,
  },

  // Module 5.2: Portfolio Development
  {
    level: 5,
    moduleNumber: '5.2',
    assignmentNumber: 'PP-5.2.1',
    orderIndex: 24,
    title: 'Master Portfolio Project',
    description: 'Create a comprehensive portfolio showcasing all printing techniques and capabilities.',
    instructions: `1. Design a cohesive collection demonstrating all learned techniques
2. Create 15-20 showcase pieces covering: screen print, DTG, sublimation, vinyl, specialty inks
3. Include variety: t-shirts, hoodies, tote bags, hats, specialty items
4. Practice professional product photography with proper lighting
5. Create digital portfolio website or presentation
6. Develop printed sample books for in-person presentations
7. Write case studies explaining technical details of key pieces
8. Present portfolio professionally`,
    objectives: [
      'Demonstrate mastery of all printing techniques',
      'Create diverse, high-quality showcase pieces',
      'Photograph products professionally',
      'Build professional digital and physical portfolios',
      'Communicate technical expertise effectively',
    ],
    skills: ['Portfolio development', 'Photography', 'Web design', 'Presentation', 'Professional branding'],
    expectedOutcome: 'Complete portfolio including physical samples, professional photos, website, and case studies.',
    passingCriteria: 'Portfolio is comprehensive, photography is professional, presentation is polished and impressive',
    referencePhotos: ['/curriculum/printing/portfolio-samples.jpg', '/curriculum/printing/product-photography.jpg'],
    estimatedHours: 30,
    difficulty: 'expert',
    category: 'mastery',
    subcategory: 'portfolio',
    serviceTrack: 'printing_press' as ServiceTrack,
  },

  // ============================================================================
  // LEVEL 6: BUSINESS OPERATIONS & DIGITAL INTEGRATION (Months 19-24)
  // ============================================================================

  // Module 6.1: Online Business Setup
  {
    level: 6,
    moduleNumber: '6.1',
    assignmentNumber: 'PP-6.1.1',
    orderIndex: 25,
    title: 'E-commerce & Online Ordering Setup',
    description: 'Set up online ordering systems and e-commerce for custom printing business.',
    instructions: `1. Study e-commerce platforms for custom printing: Shopify, WooCommerce, Printful integration
2. Learn custom product builders/configurators for customer design
3. Set up payment processing: PayPal, Stripe, merchant accounts
4. Understand shipping integration and rate calculation
5. Create online design tool or integrate existing solutions
6. Study order management systems linking online to production
7. Learn automated email workflows for order status updates
8. Build functional e-commerce site for printing services`,
    objectives: [
      'Set up e-commerce platform for custom printing',
      'Integrate payment and shipping systems',
      'Provide online design tools for customers',
      'Automate order processing workflow',
      'Manage online and in-person orders efficiently',
    ],
    skills: ['E-commerce setup', 'Payment processing', 'Order automation', 'Online tools', 'System integration'],
    expectedOutcome: 'Functional e-commerce website with custom product options, payment processing, and order management.',
    passingCriteria: 'Site is user-friendly, ordering process works smoothly, orders flow to production system automatically',
    referencePhotos: ['/curriculum/printing/ecommerce-site.jpg', '/curriculum/printing/design-tool.jpg', '/curriculum/printing/order-dashboard.jpg'],
    estimatedHours: 24,
    difficulty: 'expert',
    category: 'business',
    subcategory: 'ecommerce',
    serviceTrack: 'printing_press' as ServiceTrack,
  },

  // Module 6.2: Print-on-Demand & Fulfillment
  {
    level: 6,
    moduleNumber: '6.2',
    assignmentNumber: 'PP-6.2.1',
    orderIndex: 26,
    title: 'Print-on-Demand Business Model',
    description: 'Learn to run a print-on-demand business and third-party fulfillment services.',
    instructions: `1. Study POD platforms: Printify, Printful, CustomCat, Teelaunch
2. Learn marketplace integration: Etsy, Amazon Merch, eBay, Redbubble
3. Understand POD vs in-house production economics
4. Practice setting up POD stores with automated fulfillment
5. Learn to offer white-label fulfillment for other sellers
6. Study bulk/batch production for POD efficiency
7. Understand packaging, labeling, and shipping for fulfillment
8. Set up POD business or fulfillment service`,
    objectives: [
      'Understand POD business model and platforms',
      'Set up automated marketplace stores',
      'Compare POD vs in-house production costs',
      'Offer fulfillment services to other businesses',
      'Manage high-volume small-order production',
    ],
    skills: ['POD platforms', 'Marketplace integration', 'Fulfillment operations', 'Automation', 'Logistics'],
    expectedOutcome: 'Functional POD store and/or white-label fulfillment service with automated order processing.',
    passingCriteria: 'POD system processes orders automatically, production is efficient, fulfillment is reliable',
    referencePhotos: ['/curriculum/printing/pod-dashboard.jpg', '/curriculum/printing/fulfillment-center.jpg'],
    estimatedHours: 20,
    difficulty: 'expert',
    category: 'business',
    subcategory: 'pod',
    serviceTrack: 'printing_press' as ServiceTrack,
  },

  // Module 6.3: Teaching & Training
  {
    level: 6,
    moduleNumber: '6.3',
    assignmentNumber: 'PP-6.3.1',
    orderIndex: 27,
    title: 'Teaching Printing Techniques to New Apprentices',
    description: 'Develop teaching skills to train new printing press apprentices and share your expertise.',
    instructions: `1. Study effective teaching methodologies for hands-on skills
2. Learn to assess student skill levels and adapt instruction
3. Practice demonstrating techniques clearly and safely
4. Develop lesson plans for key printing processes
5. Create training materials: checklists, guides, video tutorials
6. Learn to provide constructive feedback and corrections
7. Master patience and communication in teaching environment
8. Conduct training sessions with new apprentices`,
    objectives: [
      'Teach printing techniques effectively to beginners',
      'Create comprehensive training materials',
      'Demonstrate processes with clarity and safety focus',
      'Provide feedback that improves student skills',
      'Help apprentices progress through curriculum levels',
    ],
    skills: ['Teaching methods', 'Communication', 'Curriculum development', 'Mentoring', 'Leadership'],
    expectedOutcome: 'Training materials, lesson plans, and documented teaching sessions with apprentices.',
    passingCriteria: 'Teaching is clear and effective, students demonstrate skill improvement, materials are comprehensive',
    referencePhotos: ['/curriculum/printing/teaching-session.jpg', '/curriculum/printing/training-materials.jpg'],
    estimatedHours: 16,
    difficulty: 'expert',
    category: 'mastery',
    subcategory: 'teaching',
    serviceTrack: 'printing_press' as ServiceTrack,
  },

  // Module 6.4: Final Capstone
  {
    level: 6,
    moduleNumber: '6.4',
    assignmentNumber: 'PP-6.4.1',
    orderIndex: 28,
    title: 'Complete Printing Business Capstone Project',
    description: 'Execute a complete end-to-end printing business project from client acquisition to delivery.',
    instructions: `1. Acquire a real client and order (or simulate realistic scenario)
2. Provide professional consultation and design services
3. Create detailed quote and production timeline
4. Design and prepare artwork for production
5. Execute production using appropriate printing method(s)
6. Perform quality control and finishing
7. Package and deliver final products
8. Handle invoicing and payment processing
9. Document entire process with photos and notes`,
    objectives: [
      'Manage complete client project independently',
      'Demonstrate all technical and business skills',
      'Deliver professional-quality work on time',
      'Handle business aspects from quote to payment',
      'Document process for portfolio and future reference',
    ],
    skills: ['Complete workflow', 'Client management', 'Production execution', 'Business operations', 'Documentation'],
    expectedOutcome: 'Successfully completed client project with full documentation, client testimonial, and professional results.',
    passingCriteria: 'Client is satisfied, quality is excellent, project completed on time and budget, all business aspects handled professionally',
    referencePhotos: ['/curriculum/printing/client-project.jpg', '/curriculum/printing/final-delivery.jpg'],
    estimatedHours: 40,
    difficulty: 'expert',
    category: 'mastery',
    subcategory: 'capstone',
    serviceTrack: 'printing_press' as ServiceTrack,
  },
]

export async function seedPrintingPressCurriculum() {
  console.log('🖨️  Seeding Printing Press Curriculum...')

  for (const assignment of printingPressCurriculum) {
    await prisma.assignmentTemplate.upsert({
      where: { assignmentNumber: assignment.assignmentNumber },
      update: {
        ...assignment,
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        ...assignment,
        isActive: true,
      },
    })
    console.log(`  ✅ ${assignment.assignmentNumber}: ${assignment.title}`)
  }

  console.log(`\n✅ Printing Press Curriculum seeded successfully!`)
  console.log(`   Total assignments: ${printingPressCurriculum.length}`)
  console.log(`   Level 1: ${printingPressCurriculum.filter(a => a.level === 1).length} assignments`)
  console.log(`   Level 2: ${printingPressCurriculum.filter(a => a.level === 2).length} assignments`)
  console.log(`   Level 3: ${printingPressCurriculum.filter(a => a.level === 3).length} assignments`)
  console.log(`   Level 4: ${printingPressCurriculum.filter(a => a.level === 4).length} assignments`)
  console.log(`   Level 5: ${printingPressCurriculum.filter(a => a.level === 5).length} assignments`)
  console.log(`   Level 6: ${printingPressCurriculum.filter(a => a.level === 6).length} assignments`)
}

// Run if called directly
if (require.main === module) {
  seedPrintingPressCurriculum()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

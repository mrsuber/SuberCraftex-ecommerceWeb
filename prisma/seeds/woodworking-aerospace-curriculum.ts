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
  requiredReading?: string[]
  crossReferences?: string[]
}

const woodworkingAerospaceCurriculum: AssignmentTemplateData[] = [
  // ============================================================================
  // LEVEL 1: WORKSHOP FOUNDATIONS & SAFETY (Months 1-3)
  // ============================================================================

  // Module 1.1: Workshop Setup & Safety
  {
    level: 1,
    moduleNumber: '1.1',
    assignmentNumber: 'WA-1.1.1',
    orderIndex: 1,
    title: 'Workshop Safety & Hazard Assessment',
    description: 'Master comprehensive workshop safety protocols for woodworking and metalworking. Understand that safety is the foundation of all craftsmanship - a single accident can end your career or life.',
    instructions: `1. Study OSHA woodworking and metalworking safety standards
2. Learn proper personal protective equipment (PPE) for each operation
3. Understand machine guarding and lockout/tagout procedures
4. Study dust collection requirements and respiratory protection
5. Learn first aid procedures specific to workshop injuries
6. Practice emergency shutdown procedures for all equipment
7. Create a comprehensive safety checklist for your workspace
8. Study fire prevention and suppression systems
9. Complete safety certification exam`,
    objectives: [
      'Identify all workshop hazards and implement controls',
      'Use appropriate PPE for every operation',
      'Understand and apply lockout/tagout procedures',
      'Operate dust collection and respiratory protection systems',
      'Respond appropriately to workshop emergencies',
      'Create and maintain a safe working environment',
    ],
    skills: ['Safety protocols', 'Hazard identification', 'Risk assessment', 'Emergency response', 'PPE selection'],
    expectedOutcome: 'Complete safety certification and demonstrate comprehensive understanding of workshop safety.',
    passingCriteria: 'Score 100% on safety exam, demonstrate all emergency procedures correctly, create acceptable safety plan',
    referencePhotos: ['/curriculum/woodworking/safety-equipment.jpg', '/curriculum/woodworking/ppe-station.jpg', '/curriculum/woodworking/first-aid.jpg'],
    estimatedHours: 16,
    difficulty: 'beginner',
    category: 'safety',
    subcategory: 'foundations',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'OSHA 10-Hour General Industry Safety Training materials',
      '"The Anarchist\'s Tool Chest" by Christopher Schwarz - Chapter on Safety',
      'Manufacturer safety manuals for all shop equipment',
    ],
  },
  {
    level: 1,
    moduleNumber: '1.1',
    assignmentNumber: 'WA-1.1.2',
    orderIndex: 2,
    title: 'Workshop Layout & Workflow Design',
    description: 'Design an efficient workshop layout that optimizes workflow, safety, and material handling for both wood and metal operations.',
    instructions: `1. Study workshop design principles: material flow, workstation placement
2. Learn proper spacing requirements for equipment (3-4 feet clearance minimum)
3. Understand electrical requirements: 120V vs 240V, circuit capacity, grounding
4. Design dust collection ducting layout for maximum efficiency
5. Plan separate zones: rough milling, joinery, assembly, finishing, metalwork
6. Create material storage solutions: lumber racks, sheet goods, metal stock
7. Design efficient lighting: general (50+ lumens/sq ft) and task lighting
8. Plan for future expansion and equipment additions
9. Create a scaled workshop layout drawing`,
    objectives: [
      'Design efficient workflow patterns to minimize material handling',
      'Plan electrical system to support all equipment safely',
      'Create effective dust collection system layout',
      'Organize zones for different operations',
      'Maximize space utilization while maintaining safety clearances',
    ],
    skills: ['Space planning', 'Workflow optimization', 'Electrical planning', 'Dust collection design', 'Technical drawing'],
    expectedOutcome: 'Detailed workshop layout plan with equipment placement, electrical, dust collection, and material flow diagrams.',
    passingCriteria: 'Layout meets safety clearances, workflow is logical, electrical plan is adequate, dust collection covers all machines',
    referencePhotos: ['/curriculum/woodworking/shop-layout.jpg', '/curriculum/woodworking/dust-collection.jpg', '/curriculum/woodworking/workstation-spacing.jpg'],
    estimatedHours: 12,
    difficulty: 'beginner',
    category: 'setup',
    subcategory: 'layout',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"The Complete Manual of Woodworking" - Chapter on Shop Setup',
      '"Workshop Dust Control" by Sandor Nagyszalanczy',
      'Fine Woodworking magazine articles on shop layout (archive)',
    ],
  },

  // Module 1.2: Hand Tool Fundamentals
  {
    level: 1,
    moduleNumber: '1.2',
    assignmentNumber: 'WA-1.2.1',
    orderIndex: 3,
    title: 'Hand Tool Identification & Sharpening',
    description: 'Master the identification, use, and maintenance of essential hand tools. A sharp tool is a safe tool - this fundamental truth applies to all cutting operations.',
    instructions: `1. Identify hand planes: bench planes (#4, #5, #7), block planes, specialty planes
2. Study hand saws: rip, crosscut, dovetail, carcass, Japanese saws
3. Learn chisels: bench chisels, mortise chisels, paring chisels (1/4" to 1" set)
4. Understand marking and measuring tools: marking knife, marking gauge, combination square, try square
5. Master sharpening theory: grit progression (220→1000→4000→8000), honing angles
6. Practice sharpening on waterstones: flatten stone, establish primary bevel (25°), create micro-bevel (30°)
7. Learn to sharpen plane irons, chisels, and saw teeth
8. Demonstrate razor-sharp edge (should shave arm hair cleanly)
9. Create tool maintenance schedule`,
    objectives: [
      'Identify all essential hand tools and their specific uses',
      'Sharpen chisels and plane irons to razor sharpness',
      'Understand sharpening angles and bevel geometry',
      'Set up and flatten waterstones correctly',
      'Maintain all cutting tools in peak condition',
      'Use honing guide and freehand sharpening techniques',
    ],
    skills: ['Tool identification', 'Sharpening technique', 'Edge geometry', 'Tool maintenance', 'Precision grinding'],
    expectedOutcome: 'Demonstrate ability to sharpen chisel to shaving-sharp edge, properly identify and describe all hand tools.',
    passingCriteria: 'All cutting tools achieve shaving-sharp edge, identify 20+ hand tools correctly, explain use and maintenance of each',
    referencePhotos: ['/curriculum/woodworking/hand-tools.jpg', '/curriculum/woodworking/sharpening-station.jpg', '/curriculum/woodworking/sharp-edge-test.jpg'],
    estimatedHours: 20,
    difficulty: 'beginner',
    category: 'hand-tools',
    subcategory: 'fundamentals',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"The Essential Woodworker" by Robert Wearing',
      '"Sharpen This" by Christopher Schwarz',
      '"Japanese Woodworking Tools: Selection, Care & Use" by Toshio Odate',
    ],
  },
  {
    level: 1,
    moduleNumber: '1.2',
    assignmentNumber: 'WA-1.2.2',
    orderIndex: 4,
    title: 'Hand Planing & Stock Preparation',
    description: 'Learn to flatten, square, and thickness lumber using hand planes - the traditional method that teaches you to read wood grain and understand material behavior.',
    instructions: `1. Study wood grain: cathedral grain, rift sawn, quarter sawn, grain direction
2. Learn the 4-square method: flatten one face, square one edge, mark face/edge, thickness, width
3. Practice planing with the grain to avoid tearout
4. Master plane setup: sole flattening, chip breaker positioning (1/32" from edge), lateral adjustment
5. Learn to recognize and correct: convex/concave faces, twist (winding), cupping
6. Practice using winding sticks to check for twist
7. Achieve 4-square stock on 10 different boards (different species and grain patterns)
8. Understand when to use hand planes vs power tools
9. Master shooting board technique for end grain`,
    objectives: [
      'Flatten a board face using hand planes',
      'Square edges perpendicular to face',
      'Bring lumber to consistent thickness',
      'Read grain direction to prevent tearout',
      'Set up and adjust hand planes correctly',
      'Achieve accuracy within 1/64" across board length',
    ],
    skills: ['Hand planing', 'Stock preparation', 'Grain reading', 'Precision squaring', 'Tool setup'],
    expectedOutcome: 'Ten pieces of 4-square lumber from rough stock, demonstrating flat, square, and consistent thickness.',
    passingCriteria: 'All boards are flat (no daylight under straightedge), square (90° within 1/64"), consistent thickness (±1/64")',
    referencePhotos: ['/curriculum/woodworking/hand-planing.jpg', '/curriculum/woodworking/winding-sticks.jpg', '/curriculum/woodworking/4-square-process.jpg'],
    estimatedHours: 24,
    difficulty: 'beginner',
    category: 'hand-tools',
    subcategory: 'stock-prep',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"By Hand & Eye" by George Walker and Jim Tolpin',
      '"The Joiner and Cabinet Maker" by Anonymous (19th century)',
      'Paul Sellers video series on hand tool fundamentals',
    ],
  },

  // Module 1.3: Power Tool Fundamentals
  {
    level: 1,
    moduleNumber: '1.3',
    assignmentNumber: 'WA-1.3.1',
    orderIndex: 5,
    title: 'Table Saw Mastery & Safety',
    description: 'Master the table saw - the most dangerous and most versatile tool in the shop. Respect this machine and it will serve you for decades.',
    instructions: `1. Study table saw anatomy: arbor, trunnions, fence, miter gauge, blade guard, riving knife, pawls
2. Learn blade selection: rip (24T), crosscut (60-80T), combination (40T), dado stack
3. Master rip fence alignment: parallel to miter slot within 0.002"
4. Practice crosscut technique with miter gauge and crosscut sled
5. Learn proper push stick/push block technique (hand never closer than 6" to blade)
6. Understand kickback causes and prevention (riving knife, featherboards, proper stance)
7. Build essential table saw jigs: crosscut sled, taper jig, tenoning jig
8. Practice milling rough lumber to dimension: rip, crosscut, dimension
9. Master dado stack setup for joinery cuts`,
    objectives: [
      'Operate table saw safely with zero kickback incidents',
      'Align fence and blade for accurate cuts',
      'Select appropriate blade for each operation',
      'Build and use essential jigs',
      'Mill lumber to precise dimensions (±1/64")',
      'Understand and prevent kickback scenarios',
    ],
    skills: ['Table saw operation', 'Jig building', 'Precision cutting', 'Safety protocols', 'Fence alignment'],
    expectedOutcome: 'Build crosscut sled and demonstrate safe, accurate cuts. Mill 20 boards to precise dimensions.',
    passingCriteria: 'All cuts within ±1/64", zero safety violations, jigs are square and accurate, demonstrate proper kickback prevention',
    referencePhotos: ['/curriculum/woodworking/table-saw-safety.jpg', '/curriculum/woodworking/crosscut-sled.jpg', '/curriculum/woodworking/push-stick.jpg'],
    estimatedHours: 20,
    difficulty: 'beginner',
    category: 'power-tools',
    subcategory: 'table-saw',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"The Table Saw Book" by Kelly Mehler',
      'Fine Woodworking magazine: "Tune Up Your Table Saw" articles',
      'SawStop safety videos and manual',
    ],
  },
  {
    level: 1,
    moduleNumber: '1.3',
    assignmentNumber: 'WA-1.3.2',
    orderIndex: 6,
    title: 'Jointer & Planer Operation',
    description: 'Master the jointer and planer for efficient stock preparation. These machines work together: jointer creates reference surfaces, planer makes them parallel.',
    instructions: `1. Study jointer setup: fence square to table (90° ±0.002"), knife height (even with outfeed table)
2. Learn jointer safety: push blocks, hand position (never over cutterhead), climb cutting prevention
3. Practice face jointing: identify cupping/twist, take light passes (1/32" max)
4. Master edge jointing: reference face against fence, consistent pressure
5. Study planer operation: snipe prevention, grain direction, feed rate
6. Learn thickness planing: reference face down, incremental passes (1/16" max)
7. Understand spiral vs straight cutterheads: advantages and maintenance
8. Practice coordinated jointer/planer workflow for stock preparation
9. Mill 20 boards from rough to 4-square using power tools`,
    objectives: [
      'Set up and adjust jointer for square cuts',
      'Face joint boards to create flat reference surface',
      'Edge joint boards square to reference face',
      'Operate planer to create parallel surfaces',
      'Prevent snipe and other planer defects',
      'Mill rough lumber to S4S (surfaced 4 sides) efficiently',
    ],
    skills: ['Jointer operation', 'Planer operation', 'Machine setup', 'Stock preparation', 'Defect prevention'],
    expectedOutcome: 'Twenty boards milled from rough to S4S, demonstrating flat, square, and parallel surfaces.',
    passingCriteria: 'All boards are flat, square (90° ±1/64"), parallel surfaces, minimal snipe, consistent thickness',
    referencePhotos: ['/curriculum/woodworking/jointer-technique.jpg', '/curriculum/woodworking/planer-operation.jpg', '/curriculum/woodworking/s4s-lumber.jpg'],
    estimatedHours: 16,
    difficulty: 'beginner',
    category: 'power-tools',
    subcategory: 'milling',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Getting the Most from Your Jointer" - Taunton Press',
      '"Thickness Planer Techniques" - Fine Woodworking',
      'Manufacturer manuals for jointer and planer',
    ],
  },

  // Module 1.4: Wood Science & Material Properties
  {
    level: 1,
    moduleNumber: '1.4',
    assignmentNumber: 'WA-1.4.1',
    orderIndex: 7,
    title: 'Wood Species Identification & Properties',
    description: 'Learn to identify wood species and understand their working properties. Different woods require different techniques - choose the right species for each project.',
    instructions: `1. Study domestic hardwoods: oak, maple, cherry, walnut, ash (properties, uses, cost)
2. Learn softwoods: pine, fir, cedar, redwood (structural vs. fine woodworking)
3. Understand exotic species: mahogany, teak, ebony, rosewood (workability, sustainability)
4. Study grain patterns: straight, figured, quilted, curly, bird's eye, burl
5. Learn density ranges: specific gravity, hardness (Janka scale)
6. Understand toxicity and allergies: walnut (juglone), exotic dusts, respiratory protection
7. Create species sample board: 20+ species with notes on properties
8. Practice wood identification by: grain pattern, weight, smell, color, pore structure
9. Study sustainable forestry and FSC certification`,
    objectives: [
      'Identify 20+ common wood species by sight and properties',
      'Understand working characteristics of each species',
      'Match wood species to project requirements',
      'Recognize toxic species and take appropriate precautions',
      'Understand wood sustainability and ethical sourcing',
    ],
    skills: ['Species identification', 'Material selection', 'Grain pattern reading', 'Sustainability awareness'],
    expectedOutcome: 'Species sample board with 20+ woods, documented properties, and identification notes.',
    passingCriteria: 'Correctly identify 18+ species out of 20 in blind test, explain properties and uses of each',
    referencePhotos: ['/curriculum/woodworking/wood-species.jpg', '/curriculum/woodworking/grain-patterns.jpg', '/curriculum/woodworking/sample-board.jpg'],
    estimatedHours: 12,
    difficulty: 'beginner',
    category: 'wood-science',
    subcategory: 'species',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Understanding Wood" by R. Bruce Hoadley (essential reference)',
      '"Wood Handbook: Wood as an Engineering Material" - USDA Forest Service',
      '"The Wood Database" (online resource) - review all major species',
    ],
  },
  {
    level: 1,
    moduleNumber: '1.4',
    assignmentNumber: 'WA-1.4.2',
    orderIndex: 8,
    title: 'Moisture Content & Wood Movement',
    description: 'Master the most critical concept in woodworking: wood moves with humidity changes. Ignore this and your projects will fail.',
    instructions: `1. Study wood anatomy: cell structure, growth rings, sapwood vs heartwood, medullary rays
2. Understand moisture content (MC): green wood (>30%), air-dried (12-15%), kiln-dried (6-8%)
3. Learn to use moisture meter: pin-type and pinless, reading interpretation
4. Study wood movement: tangential (8-12%), radial (4-6%), longitudinal (<0.1%)
5. Understand equilibrium moisture content (EMC): changes with relative humidity
6. Learn seasonal movement calculations: width change = width × % MC change × movement coefficient
7. Practice wood movement accommodation: breadboard ends, floating panels, slot screws
8. Study case studies of movement failures: split tabletops, stuck drawers, cracked panels
9. Calculate expected movement for 10 different scenarios`,
    objectives: [
      'Measure and interpret wood moisture content',
      'Calculate expected seasonal wood movement',
      'Design joinery to accommodate wood movement',
      'Understand when to use solid wood vs. plywood',
      'Predict and prevent movement-related failures',
    ],
    skills: ['Moisture measurement', 'Movement calculation', 'Joinery design', 'Failure analysis', 'Long-term stability'],
    expectedOutcome: 'Complete movement calculations for various scenarios, demonstrate moisture meter use, design movement-accommodating joinery.',
    passingCriteria: 'All calculations accurate within 10%, demonstrate understanding through practical joinery designs that accommodate movement',
    referencePhotos: ['/curriculum/woodworking/moisture-meter.jpg', '/curriculum/woodworking/wood-movement-chart.jpg', '/curriculum/woodworking/breadboard-end.jpg'],
    estimatedHours: 10,
    difficulty: 'beginner',
    category: 'wood-science',
    subcategory: 'movement',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Understanding Wood" by R. Bruce Hoadley - Chapters 3-5 (critical reading)',
      '"The Nature and Behavior of Wood" - Fine Woodworking',
      'Wood movement calculators and charts (Sagulator, Wood Database)',
    ],
  },

  // Module 1.5: First Project - Simple Toolbox
  {
    level: 1,
    moduleNumber: '1.5',
    assignmentNumber: 'WA-1.5.1',
    orderIndex: 9,
    title: 'Level 1 Project: Traditional Tool Tote',
    description: 'Build a traditional tool tote using hand and power tools, basic joinery, and proper wood movement principles. This project integrates all Level 1 skills.',
    instructions: `1. Study traditional tool tote designs: dimensions, proportions, joinery methods
2. Select appropriate wood: hardwood for structure, softwood for bottom acceptable
3. Mill lumber to dimension: sides (1/2" thick), bottom (3/4"), handle (1" thick)
4. Layout and cut dados for bottom panel using table saw or router
5. Cut handle shape using bandsaw or jigsaw, refine with hand planes and spokeshave
6. Create simple dovetail or box joints for corner joinery
7. Assemble tote with glue, ensure square assembly
8. Sand progression: 80 → 120 → 180 grit
9. Apply finish: oil, wax, or simple polyurethane
10. Fill tote with your hand tools - you made this!`,
    objectives: [
      'Apply all Level 1 skills in complete project',
      'Demonstrate proper stock preparation',
      'Execute basic joinery accurately',
      'Achieve square, well-fitted assembly',
      'Apply appropriate finish',
      'Create functional, attractive tool tote',
    ],
    skills: ['Project planning', 'Stock preparation', 'Basic joinery', 'Assembly', 'Finishing', 'Quality control'],
    expectedOutcome: 'Completed tool tote demonstrating craftsmanship: flat surfaces, tight joinery, square assembly, good finish.',
    passingCriteria: 'Tote is square (diagonals within 1/16"), joinery is tight (no gaps), finish is even, tote is functional and attractive',
    referencePhotos: ['/curriculum/woodworking/tool-tote.jpg', '/curriculum/woodworking/tote-joinery.jpg', '/curriculum/woodworking/finished-tote.jpg'],
    estimatedHours: 20,
    difficulty: 'beginner',
    category: 'projects',
    subcategory: 'level-1',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"The Essential Woodworker" by Robert Wearing - Tool tote project',
      'Traditional tool tote plans from Popular Woodworking',
      'Review all Level 1 reading materials before starting',
    ],
  },
  {
    level: 1,
    moduleNumber: '1.3',
    assignmentNumber: 'WA-1.3.3',
    orderIndex: 10,
    title: 'Router Fundamentals & Template Routing',
    description: 'Master the router - one of the most versatile tools in woodworking. From edge profiles to precision joinery, the router is essential.',
    instructions: `1. Study router anatomy: collet, base types (fixed, plunge, D-handle), speed control
2. Learn bit selection: straight, flush-trim, pattern, roundover, cove, dovetail, spiral
3. Practice edge routing: proper feed direction (against rotation), climb cutting risks
4. Master template routing: using pattern bit or flush-trim bit with template
5. Learn depth setting: incremental passes (1/8" max per pass in hardwood)
6. Build router table and practice table routing techniques
7. Create template routing jigs for repeatable parts
8. Practice dado cutting, rabbeting, and groove cutting
9. Build essential router jigs: edge guide, circle jig, template system`,
    objectives: [
      'Operate router safely with proper feed direction',
      'Select appropriate router bit for each operation',
      'Use template routing for accurate reproduction',
      'Set up and use router table effectively',
      'Create and use routing jigs',
      'Achieve clean, burn-free cuts',
    ],
    skills: ['Router operation', 'Template routing', 'Jig building', 'Router table use', 'Bit selection'],
    expectedOutcome: 'Build router table and demonstrate proficiency with 10+ different router operations using various bits and techniques.',
    passingCriteria: 'All cuts are clean (no burning), template routing produces identical parts, router table setup is accurate and safe',
    referencePhotos: ['/curriculum/woodworking/router-techniques.jpg', '/curriculum/woodworking/template-routing.jpg', '/curriculum/woodworking/router-table.jpg'],
    estimatedHours: 18,
    difficulty: 'beginner',
    category: 'power-tools',
    subcategory: 'router',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Router Joinery" by Gary Rogowski',
      '"The Router Book" by Pat Warner',
      'Fine Woodworking Router Techniques compilation',
    ],
  },
  {
    level: 1,
    moduleNumber: '1.3',
    assignmentNumber: 'WA-1.3.4',
    orderIndex: 11,
    title: 'Bandsaw Mastery & Resawing',
    description: 'Master the bandsaw for curves, resawing, and efficient lumber processing. The bandsaw is safer than the table saw for many operations.',
    instructions: `1. Study bandsaw anatomy: wheels, guides, fence, blade tension system
2. Learn blade selection: width (1/8" to 3/4"), TPI (3-14), hook vs skip tooth
3. Master blade tensioning: proper tension prevents drift and blade breakage
4. Practice guide adjustment: bearings should barely touch blade when cutting
5. Learn drift compensation: test cut to find natural cutting line, adjust fence angle
6. Master resawing technique: maximize yield from expensive hardwood
7. Practice curve cutting: relief cuts for tight curves, blade selection for radius
8. Build circle cutting jig for perfect round parts
9. Learn blade maintenance: cleaning pitch, recognizing dull blades, blade life`,
    objectives: [
      'Tension and track bandsaw blade correctly',
      'Adjust guides for optimal performance',
      'Resaw lumber to create book-matched panels',
      'Cut smooth curves without blade wander',
      'Select appropriate blade for each operation',
      'Maintain bandsaw in peak condition',
    ],
    skills: ['Bandsaw tuning', 'Resawing', 'Curve cutting', 'Blade selection', 'Drift compensation'],
    expectedOutcome: 'Resaw 10 boards cleanly, create curved parts accurately, demonstrate proper bandsaw setup and maintenance.',
    passingCriteria: 'Resawn surfaces are smooth (minimal planer cleanup needed), curves are accurate to layout lines, blade tracking is perfect',
    referencePhotos: ['/curriculum/woodworking/bandsaw-resawing.jpg', '/curriculum/woodworking/curve-cutting.jpg', '/curriculum/woodworking/bandsaw-setup.jpg'],
    estimatedHours: 16,
    difficulty: 'beginner',
    category: 'power-tools',
    subcategory: 'bandsaw',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"The Bandsaw Book" by Lonnie Bird',
      'Fine Woodworking Bandsaw Techniques',
      'Michael Fortune bandsaw master class videos',
    ],
  },
  {
    level: 1,
    moduleNumber: '1.4',
    assignmentNumber: 'WA-1.4.3',
    orderIndex: 12,
    title: 'Lumber Grading & Selection',
    description: 'Learn to grade hardwood lumber and select the most economical grade for each project. Understanding grades saves money and ensures quality.',
    instructions: `1. Study NHLA grading system: FAS, FAS 1-Face, Select, #1 Common, #2 Common
2. Learn to calculate board footage: (thickness in inches × width in inches × length in feet) ÷ 12
3. Understand clear face requirements for each grade
4. Practice identifying defects: knots, checking, splits, wane, shake, pitch pockets
5. Learn to estimate yield: how many clear pieces can you get from a board?
6. Study grain matching: book-match, slip-match, random-match
7. Practice selecting boards for specific projects: choosing the right grade
8. Understand pricing: FAS costs more but may be more economical for clear parts
9. Visit lumber yard and practice grading 50 boards`,
    objectives: [
      'Grade hardwood lumber using NHLA standards',
      'Calculate board footage accurately',
      'Identify lumber defects and their impact on yield',
      'Select most economical grade for project requirements',
      'Estimate clear yield from rough lumber',
      'Match grain patterns for aesthetic effect',
    ],
    skills: ['Lumber grading', 'Board footage calculation', 'Defect identification', 'Grain matching', 'Economic selection'],
    expectedOutcome: 'Correctly grade 40+ boards out of 50, calculate board footage accurately, demonstrate economical lumber selection.',
    passingCriteria: 'Grade accuracy 80%+, board footage calculations within 5%, select appropriate grade for 10 different project scenarios',
    referencePhotos: ['/curriculum/woodworking/lumber-grades.jpg', '/curriculum/woodworking/defect-identification.jpg', '/curriculum/woodworking/grain-matching.jpg'],
    estimatedHours: 12,
    difficulty: 'beginner',
    category: 'wood-science',
    subcategory: 'grading',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'NHLA Rules for the Measurement and Inspection of Hardwood and Cypress',
      '"Understanding Wood" by R. Bruce Hoadley - Chapter on lumber grading',
      'Visit Wood-Mizer or local sawmill website for grading examples',
    ],
  },
  {
    level: 1,
    moduleNumber: '1.5',
    assignmentNumber: 'WA-1.5.2',
    orderIndex: 13,
    title: 'Drill Press & Drilling Techniques',
    description: 'Master the drill press for accurate, repeatable holes. Precision drilling is essential for joinery, hardware installation, and assembly.',
    instructions: `1. Study drill press components: quill, table, fence, depth stop, speed adjustment
2. Learn bit selection: twist bits, brad point, Forstner, spade, hole saws
3. Master speed selection: larger diameter = slower speed (RPM chart)
4. Practice fence setup for repeatable drilling operations
5. Learn depth stop use for consistent hole depth
6. Study drilling techniques: backing board prevents blowout, clamp workpieces
7. Practice drilling at angles: tilting table, using jigs
8. Learn mortising attachment use (if available)
9. Build drill press table with fence and dust collection`,
    objectives: [
      'Select correct drill speed for bit size and material',
      'Set up fence and depth stop for repeatable operations',
      'Drill accurate holes without tearout or blowout',
      'Use various drill bit types appropriately',
      'Build and use drilling jigs',
      'Maintain drill press accuracy',
    ],
    skills: ['Drill press operation', 'Bit selection', 'Fence setup', 'Depth control', 'Drilling jigs'],
    expectedOutcome: 'Build drill press table with fence, demonstrate accurate drilling operations, create sample board with various hole types.',
    passingCriteria: 'Holes are perpendicular (within 1°), consistent depth (±1/64"), no tearout, demonstrate proper speed selection',
    referencePhotos: ['/curriculum/woodworking/drill-press-setup.jpg', '/curriculum/woodworking/forstner-bits.jpg', '/curriculum/woodworking/drill-press-table.jpg'],
    estimatedHours: 10,
    difficulty: 'beginner',
    category: 'power-tools',
    subcategory: 'drill-press',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Drill press manufacturer manual',
      '"Drill Press Techniques" - Fine Woodworking',
      'Speed and feed charts for various materials',
    ],
  },
  {
    level: 1,
    moduleNumber: '1.5',
    assignmentNumber: 'WA-1.5.3',
    orderIndex: 14,
    title: 'Sanding & Surface Preparation',
    description: 'Master sanding techniques for perfect surface preparation. Good sanding is invisible - the wood should feel and look natural, not scratched.',
    instructions: `1. Study abrasive types: aluminum oxide, silicon carbide, ceramic, garnet
2. Learn grit progression: never skip more than one grit (80→120→180→220)
3. Practice hand sanding: with the grain, even pressure, backing pad for flat surfaces
4. Master random orbital sander use: let tool do the work, don't press hard
5. Study belt sander technique: extremely aggressive, mostly for stock removal
6. Learn detail sander and scraper use for difficult areas
7. Understand sanding sealer and grain raising
8. Practice sanding end grain: higher grit needed, wetting to raise grain
9. Create sample boards showing proper vs improper sanding`,
    objectives: [
      'Select appropriate grit progression for finishing',
      'Sand surfaces flat without creating dips or waves',
      'Achieve consistent scratch pattern before finishing',
      'Use power sanders without creating damage',
      'Recognize when sanding is complete',
      'Prepare surfaces for various finish types',
    ],
    skills: ['Hand sanding', 'Power sanding', 'Grit selection', 'Surface evaluation', 'Scratch pattern control'],
    expectedOutcome: 'Sand 10 boards demonstrating proper technique, create sample showing grit progression, achieve finish-ready surfaces.',
    passingCriteria: 'Surfaces are flat, scratch pattern is consistent and fine, no cross-grain scratches, no sanding through edges',
    referencePhotos: ['/curriculum/woodworking/sanding-technique.jpg', '/curriculum/woodworking/grit-progression.jpg', '/curriculum/woodworking/surface-prep.jpg'],
    estimatedHours: 12,
    difficulty: 'beginner',
    category: 'finishing',
    subcategory: 'surface-prep',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Understanding Wood Finishing" by Bob Flexner - Surface Preparation chapter',
      'Fine Woodworking sanding techniques articles',
      'Abrasive manufacturers technical guides',
    ],
  },
  {
    level: 1,
    moduleNumber: '1.5',
    assignmentNumber: 'WA-1.5.4',
    orderIndex: 15,
    title: 'Basic Wood Finishing - Oils & Waxes',
    description: 'Learn basic finishing with oils and waxes - simple, beautiful, food-safe finishes that enhance wood\'s natural beauty.',
    instructions: `1. Study finish types: linseed oil, tung oil, Danish oil, mineral oil, wax
2. Learn surface preparation: sanding to 220 grit minimum, removing dust
3. Practice oil application: flood surface, wait 15-30 min, wipe off excess
4. Understand cure times: linseed (weeks), tung (days), Danish (overnight)
5. Learn wet sanding technique: 600 grit with oil creates smooth surface
6. Study wax application: paste wax, buffing technique, maintenance
7. Practice combination finishes: oil base coat, wax topcoat
8. Understand food-safe finishes: mineral oil, walnut oil, beeswax
9. Finish 5 sample boards with different oil/wax combinations`,
    objectives: [
      'Apply oil finishes evenly without blotching',
      'Understand cure times and recoat windows',
      'Wet sand to achieve glass-smooth surface',
      'Apply and buff paste wax properly',
      'Select food-safe finishes when appropriate',
      'Maintain oiled and waxed surfaces',
    ],
    skills: ['Oil application', 'Wax finishing', 'Wet sanding', 'Surface evaluation', 'Finish maintenance'],
    expectedOutcome: 'Five finished sample boards demonstrating various oil and wax techniques with smooth, even finish.',
    passingCriteria: 'Finish is even (no blotches or dry spots), surface is smooth, appropriate cure time observed, proper buffing technique',
    referencePhotos: ['/curriculum/woodworking/oil-finish.jpg', '/curriculum/woodworking/wax-application.jpg', '/curriculum/woodworking/finished-samples.jpg'],
    estimatedHours: 14,
    difficulty: 'beginner',
    category: 'finishing',
    subcategory: 'oils-waxes',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Understanding Wood Finishing" by Bob Flexner (essential reference)',
      '"The Complete Guide to Finishing Wood" - Taunton Press',
      'Oil finish manufacturer technical data sheets',
    ],
  },

  // ============================================================================
  // LEVEL 2: JOINERY FUNDAMENTALS (Months 4-6)
  // ============================================================================

  // Module 2.1: Basic Joinery
  {
    level: 2,
    moduleNumber: '2.1',
    assignmentNumber: 'WA-2.1.1',
    orderIndex: 10,
    title: 'Mortise & Tenon Joinery',
    description: 'Master the mortise and tenon - the foundation of furniture construction for thousands of years. This joint is strong, elegant, and essential.',
    instructions: `1. Study mortise and tenon anatomy: cheek, shoulder, tenon thickness (1/3 stock thickness), proportions
2. Learn layout techniques: mortise gauge, marking knife (knife walls prevent tearout)
3. Practice mortising methods: bench chisel technique, drill and chisel, mortising machine, router
4. Master tenon cutting: table saw with tenoning jig, hand saw and chisel, router table
5. Understand joint variations: through tenon, blind tenon, haunched tenon, wedged tenon
6. Practice fitting: tenon should fit snugly without force (push fit, not hammer fit)
7. Study gluing and assembly: clamp placement, glue distribution, checking for square
8. Create 10 sample joints with different methods and variations
9. Test joint strength: break test to understand failure modes`,
    objectives: [
      'Cut accurate mortises using multiple methods',
      'Create well-fitted tenons with crisp shoulders',
      'Achieve proper joint fit (snug but not forced)',
      'Understand when to use each mortise and tenon variation',
      'Assemble mortise and tenon joints correctly',
    ],
    skills: ['Mortise cutting', 'Tenon cutting', 'Joint fitting', 'Layout precision', 'Assembly technique'],
    expectedOutcome: 'Ten mortise and tenon samples demonstrating various methods, showing tight fit and clean shoulders.',
    passingCriteria: 'Tenons fit snugly without gaps, shoulders are square and crisp, mortises are clean, joints are strong in break test',
    referencePhotos: ['/curriculum/woodworking/mortise-tenon.jpg', '/curriculum/woodworking/tenon-shoulders.jpg', '/curriculum/woodworking/joint-fitting.jpg'],
    estimatedHours: 24,
    difficulty: 'intermediate',
    category: 'joinery',
    subcategory: 'mortise-tenon',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"The Complete Illustrated Guide to Joinery" by Gary Rogowski',
      '"Mortise & Tenon Magazine" - select articles on technique',
      '"Joinery Methods" - Fine Woodworking compilation',
    ],
  },
  {
    level: 2,
    moduleNumber: '2.1',
    assignmentNumber: 'WA-2.1.2',
    orderIndex: 16,
    title: 'Dovetail Joinery - Hand Cut',
    description: 'Master hand-cut dovetails - the hallmark of fine craftsmanship. Through dovetails are both beautiful and incredibly strong.',
    instructions: `1. Study dovetail anatomy: pins, tails, half-blind, through, sliding dovetails
2. Learn traditional proportions: 1:6 slope for hardwoods, 1:8 for softwoods
3. Practice layout with dovetail marker and marking gauge
4. Master sawing technique: saw to the waste side of line, stop at baseline
5. Learn to chop waste with chisel: undercut slightly, work from both sides
6. Practice fitting: should be snug but assemble without mallet
7. Create sample joints: through dovetails, half-blind dovetails
8. Study historical examples: analyze 18th century furniture
9. Cut dovetails for a drawer box`,
    objectives: [
      'Lay out dovetails with proper proportions',
      'Saw accurately to layout lines',
      'Chop waste cleanly without damaging pins or tails',
      'Fit dovetails for proper glue gap',
      'Understand when to use each dovetail variation',
    ],
    skills: ['Hand sawing', 'Chisel technique', 'Layout precision', 'Joint fitting', 'Traditional joinery'],
    expectedOutcome: 'Five dovetailed corners demonstrating hand-cut technique with tight fit and clean execution.',
    passingCriteria: 'Joints fit together snugly, baselines are crisp, no gaps visible, pins and tails are undamaged',
    referencePhotos: ['/curriculum/woodworking/dovetail-layout.jpg', '/curriculum/woodworking/dovetail-sawing.jpg', '/curriculum/woodworking/finished-dovetails.jpg'],
    estimatedHours: 28,
    difficulty: 'intermediate',
    category: 'joinery',
    subcategory: 'dovetails',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"The Complete Dovetail" by Ian Kirby',
      '"Handmade" by Gary Rogowski - Dovetail chapter',
      'Frank Klausz dovetail demonstration videos',
    ],
  },
  {
    level: 2,
    moduleNumber: '2.2',
    assignmentNumber: 'WA-2.2.1',
    orderIndex: 17,
    title: 'Box Joints & Finger Joints',
    description: 'Master box joints using jigs for perfect, repeatable results. Box joints are strong, attractive, and faster than dovetails for production work.',
    instructions: `1. Study box joint geometry: finger width equals spacing, square shoulders
2. Build table saw box joint jig: indexing pin, adjustable fence
3. Learn jig setup: pin diameter sets finger width, test cuts for perfection
4. Practice cutting sequence: reference face against fence, flip after each cut
5. Master fit: should slide together with light hand pressure
6. Create router table box joint jig as alternative method
7. Study applications: drawers, boxes, trays, small cabinets
8. Build sample box with perfect box joints
9. Understand when box joints are better than dovetails`,
    objectives: [
      'Build accurate box joint jig',
      'Set up jig for various finger widths',
      'Cut box joints with perfect fit',
      'Troubleshoot common fitting problems',
      'Apply box joints to real projects',
    ],
    skills: ['Jig building', 'Table saw precision', 'Joint fitting', 'Setup accuracy', 'Production techniques'],
    expectedOutcome: 'Functional box joint jig and sample box demonstrating perfect fit and square assembly.',
    passingCriteria: 'Box joints fit snugly without force, corners are square, no gaps, jig produces repeatable results',
    referencePhotos: ['/curriculum/woodworking/box-joint-jig.jpg', '/curriculum/woodworking/box-joint-cutting.jpg', '/curriculum/woodworking/box-joint-box.jpg'],
    estimatedHours: 18,
    difficulty: 'intermediate',
    category: 'joinery',
    subcategory: 'box-joints',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Box by Box" by Matt Kenney - Fine Woodworking',
      'Matthias Wandel box joint jig tutorials',
      'William Ng box joint jig videos',
    ],
  },
  {
    level: 2,
    moduleNumber: '2.2',
    assignmentNumber: 'WA-2.2.2',
    orderIndex: 18,
    title: 'Dado, Rabbet, and Groove Joints',
    description: 'Master dado, rabbet, and groove joints for case construction, shelving, and drawer building.',
    instructions: `1. Study joint definitions: dado (across grain), groove (with grain), rabbet (edge rebate)
2. Learn table saw techniques: dado stack, multiple passes with standard blade
3. Practice router methods: straight bit with fence or edge guide
4. Master hand tool methods: router plane, dado plane, chisel and saw
5. Understand sizing: groove width = panel thickness + 1/32" for movement
6. Study applications: bookcase construction, drawer bottoms, back panels
7. Learn stopped dados and grooves for hidden joints
8. Practice sliding dovetail dados for strong connections
9. Build sample case piece with multiple joint types`,
    objectives: [
      'Cut accurate dados with table saw and router',
      'Size grooves properly for panel fit with movement',
      'Create stopped joints that hide from front view',
      'Understand structural applications of each joint',
      'Achieve tight fit without gaps',
    ],
    skills: ['Dado cutting', 'Router technique', 'Table saw joinery', 'Panel fitting', 'Case construction'],
    expectedOutcome: 'Sample pieces showing dados, rabbets, grooves, and a small case demonstrating practical application.',
    passingCriteria: 'Joints are accurate width and depth, panels fit with proper gap, stopped joints are clean',
    referencePhotos: ['/curriculum/woodworking/dado-joints.jpg', '/curriculum/woodworking/router-dado.jpg', '/curriculum/woodworking/case-construction.jpg'],
    estimatedHours: 16,
    difficulty: 'intermediate',
    category: 'joinery',
    subcategory: 'dados-rabbets',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"The Complete Illustrated Guide to Joinery" - Dado joint chapter',
      'Fine Woodworking case construction articles',
      '"Measure Twice, Cut Once" by Jim Tolpin',
    ],
  },
  {
    level: 2,
    moduleNumber: '2.3',
    assignmentNumber: 'WA-2.3.1',
    orderIndex: 19,
    title: 'Frame and Panel Construction',
    description: 'Master frame and panel construction - the traditional method for doors, cabinet sides, and panels that accommodates wood movement.',
    instructions: `1. Study frame and panel anatomy: stiles, rails, panel, groove depth
2. Learn panel raising techniques: table saw, router table, hand planes
3. Practice groove cutting in frame members: centered, consistent depth
4. Master cope and stick joinery: matching rail ends to stile grooves
5. Understand panel sizing: width allows for seasonal movement in groove
6. Study raised panel profiles: flat, cathedral, ogee, chamfered
7. Practice dry assembly and clamping technique
8. Create multiple frame and panel assemblies
9. Build frame and panel door`,
    objectives: [
      'Cut grooves accurately in frame members',
      'Raise panels with clean profiles',
      'Execute cope and stick joints perfectly',
      'Size panels for proper seasonal movement',
      'Assemble frames square and flat',
    ],
    skills: ['Frame construction', 'Panel raising', 'Cope and stick', 'Wood movement accommodation', 'Door building'],
    expectedOutcome: 'Complete frame and panel door with raised panel, demonstrating proper construction and movement allowance.',
    passingCriteria: 'Frame is flat and square, panel fits with 1/16" expansion room, cope and stick joints are tight',
    referencePhotos: ['/curriculum/woodworking/frame-panel.jpg', '/curriculum/woodworking/raised-panel.jpg', '/curriculum/woodworking/cope-stick.jpg'],
    estimatedHours: 22,
    difficulty: 'intermediate',
    category: 'joinery',
    subcategory: 'frame-panel',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Frame & Panel Magic" - Popular Woodworking',
      '"The Complete Manual of Woodworking" - Door construction chapter',
      'Christian Becksvoort frame and panel articles',
    ],
  },
  {
    level: 2,
    moduleNumber: '2.3',
    assignmentNumber: 'WA-2.3.2',
    orderIndex: 20,
    title: 'Biscuit and Domino Joinery',
    description: 'Master modern loose tenon joinery using biscuit joiner and Festool Domino. Fast, strong, and accurate alignment.',
    instructions: `1. Study biscuit joinery: #0, #10, #20 sizes, spacing, edge distance
2. Learn biscuit joiner setup: fence adjustment, depth setting, alignment
3. Practice biscuit slot cutting: reference face consistency, slot alignment
4. Master Festool Domino operation: mortise sizing, cross-dowel mode
5. Understand applications: edge-to-edge glue-ups, miter joints, case construction
6. Learn when biscuits are appropriate vs traditional joinery
7. Practice panel glue-up with biscuits for alignment
8. Study loose tenon joinery principles (Domino expands on this)
9. Build project using biscuit or Domino joinery`,
    objectives: [
      'Cut accurate biscuit slots for alignment',
      'Use biscuits to speed up panel glue-ups',
      'Operate Festool Domino (if available)',
      'Understand strength and limitations of biscuit joints',
      'Choose appropriate joinery method for application',
    ],
    skills: ['Biscuit joinery', 'Domino operation', 'Panel glue-up', 'Modern joinery methods', 'Tool selection'],
    expectedOutcome: 'Panel glue-up using biscuits showing perfect alignment, sample joints demonstrating proper technique.',
    passingCriteria: 'Biscuits align panels perfectly, no slippage during glue-up, joints are strong and properly spaced',
    referencePhotos: ['/curriculum/woodworking/biscuit-joiner.jpg', '/curriculum/woodworking/domino-joinery.jpg', '/curriculum/woodworking/panel-glueup.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'joinery',
    subcategory: 'modern-joinery',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Biscuit joiner manufacturer manuals',
      '"Taunton\'s Complete Illustrated Guide to Joinery" - Modern methods',
      'Fine Woodworking biscuit joinery articles',
    ],
  },
  {
    level: 2,
    moduleNumber: '2.4',
    assignmentNumber: 'WA-2.4.1',
    orderIndex: 21,
    title: 'Drawer Construction - Traditional Methods',
    description: 'Master drawer construction using traditional joinery. Drawers must be strong, smooth-running, and able to carry weight.',
    instructions: `1. Study drawer anatomy: front, back, sides, bottom, runners, guides
2. Learn drawer proportions: side height, bottom groove depth, back height
3. Practice joinery options: half-blind dovetails (front), through dovetails (back)
4. Master drawer bottom installation: floating panel in groove, screws at back
5. Study drawer fitting: side clearance (1/16"), vertical clearance, stop placement
6. Learn drawer runner systems: side-hung, bottom-runner, center-guided
7. Practice drawer face attachment: false front, integral front
8. Build complete drawer with hand-cut dovetails
9. Fit drawer to opening and adjust for smooth operation`,
    objectives: [
      'Construct drawer with proper joinery',
      'Install bottom panel with movement allowance',
      'Fit drawer to opening with proper clearances',
      'Create smooth-running drawer action',
      'Understand different drawer runner systems',
    ],
    skills: ['Drawer construction', 'Dovetail joinery', 'Fitting and adjustment', 'Runner installation', 'Traditional techniques'],
    expectedOutcome: 'Complete working drawer with hand-cut dovetails, properly fitted and smooth-running.',
    passingCriteria: 'Drawer runs smoothly without binding, dovetails are tight, bottom panel can expand/contract',
    referencePhotos: ['/curriculum/woodworking/drawer-construction.jpg', '/curriculum/woodworking/drawer-dovetails.jpg', '/curriculum/woodworking/drawer-fitting.jpg'],
    estimatedHours: 24,
    difficulty: 'intermediate',
    category: 'joinery',
    subcategory: 'drawer-construction',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"The Complete Illustrated Guide to Joinery" - Drawer chapter',
      '"Building Traditional Kitchen Cabinets" by Jim Tolpin',
      'Christian Becksvoort articles on drawer construction',
    ],
  },
  {
    level: 2,
    moduleNumber: '2.4',
    assignmentNumber: 'WA-2.4.2',
    orderIndex: 22,
    title: 'Cabinet Door Construction & Hanging',
    description: 'Master cabinet door construction and proper hinging techniques. Doors must be flat, square, and hang without binding.',
    instructions: `1. Study door types: frame-and-panel, slab, glass panel, louvered
2. Learn door sizing: opening size minus clearances, overlay vs inset
3. Practice frame-and-panel door construction (review Level 2.3.1)
4. Master hinge installation: butt hinges, European cup hinges, knife hinges
5. Study hinge mortising: router template, chisel technique
6. Learn door hanging procedure: shim, mark, cut, fit, hang
7. Practice door adjustment: reveal consistency, no binding
8. Understand catch and latch options: magnetic, roller, friction
9. Build and hang cabinet door with proper reveals`,
    objectives: [
      'Build cabinet door flat and square',
      'Install hinges with accurate mortises',
      'Hang door with consistent reveals',
      'Adjust door for smooth operation',
      'Understand different hinge types and applications',
    ],
    skills: ['Door construction', 'Hinge installation', 'Door hanging', 'Fitting and adjustment', 'Hardware installation'],
    expectedOutcome: 'Cabinet door properly hung with European cup hinges, demonstrating correct reveals and smooth operation.',
    passingCriteria: 'Door is flat, reveals are consistent (1/16"-1/8"), door swings freely without binding',
    referencePhotos: ['/curriculum/woodworking/cabinet-door.jpg', '/curriculum/woodworking/hinge-installation.jpg', '/curriculum/woodworking/door-reveals.jpg'],
    estimatedHours: 18,
    difficulty: 'intermediate',
    category: 'cabinetry',
    subcategory: 'doors',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Cabinets & Built-Ins" - Taunton Press',
      'Blum European hinge installation guide',
      '"Kitchen Cabinet Construction" by Danny Proulx',
    ],
  },
  {
    level: 2,
    moduleNumber: '2.5',
    assignmentNumber: 'WA-2.5.1',
    orderIndex: 23,
    title: 'Edge Banding & Veneering Basics',
    description: 'Master edge banding for plywood and learn basic veneer application. Essential skills for modern furniture construction.',
    instructions: `1. Study edge banding types: pre-glued, peel-and-stick, solid wood, veneer
2. Learn iron-on edge banding: temperature, pressure, trimming
3. Practice solid wood edge banding: thickness, glue-up, flush trimming
4. Master edge trimming: flush trim router bit, hand plane, chisel
5. Study basic veneer application: contact cement, veneer glue, vacuum press
6. Practice veneer cutting and jointing for book-matching
7. Learn substrate preparation: flatness, cleanliness critical
8. Understand veneer types: rotary cut, quarter sawn, slip matched
9. Apply edge banding and veneer to sample panels`,
    objectives: [
      'Apply edge banding with professional results',
      'Trim edge banding flush without damage',
      'Prepare substrate for veneer application',
      'Apply veneer without bubbles or voids',
      'Understand when to use edge banding vs solid wood',
    ],
    skills: ['Edge banding', 'Veneer application', 'Substrate preparation', 'Trimming technique', 'Modern materials'],
    expectedOutcome: 'Sample panels with flush edge banding and basic veneer application showing professional results.',
    passingCriteria: 'Edge banding is flush, no visible glue line, veneer is flat without bubbles',
    referencePhotos: ['/curriculum/woodworking/edge-banding.jpg', '/curriculum/woodworking/veneer-application.jpg', '/curriculum/woodworking/flush-trimming.jpg'],
    estimatedHours: 14,
    difficulty: 'intermediate',
    category: 'veneering',
    subcategory: 'edge-banding',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Veneering Basics" by Jo Sonja',
      'Fine Woodworking edge banding techniques',
      '"The Veneering Book" by David Square',
    ],
  },
  {
    level: 2,
    moduleNumber: '2.5',
    assignmentNumber: 'WA-2.5.2',
    orderIndex: 24,
    title: 'Laminate and Wood Glue-Ups',
    description: 'Master panel glue-up techniques for creating wide surfaces from narrow boards. Proper glue-up prevents warping and gaps.',
    instructions: `1. Study glue-up strategy: alternating growth rings, color matching, grain matching
2. Learn edge jointing for glue-ups: slight spring joint, perfectly square edges
3. Practice caul setup: preventing panel bow, even pressure distribution
4. Master clamping technique: pressure location, amount, checking for flat
5. Understand glue types and open time: PVA, hide glue, epoxy
6. Practice biscuit or domino alignment in glue-ups
7. Learn to flatten glued-up panels: hand plane, drum sander, wide belt sander
8. Study lamination techniques: bent lamination, stacked lamination
9. Create wide panel from narrow boards with perfect glue joints`,
    objectives: [
      'Joint edges for invisible glue lines',
      'Assemble panel flat without twist',
      'Apply appropriate clamping pressure',
      'Match grain and color for aesthetics',
      'Flatten panel after glue-up',
    ],
    skills: ['Panel glue-up', 'Edge jointing', 'Clamping technique', 'Grain matching', 'Surface flattening'],
    expectedOutcome: 'Wide panel glued up from multiple boards with invisible glue lines and flat surface.',
    passingCriteria: 'Glue lines are invisible, panel is flat (no twist or bow), color and grain well-matched',
    referencePhotos: ['/curriculum/woodworking/panel-glueup.jpg', '/curriculum/woodworking/caul-setup.jpg', '/curriculum/woodworking/grain-matching.jpg'],
    estimatedHours: 16,
    difficulty: 'intermediate',
    category: 'assembly',
    subcategory: 'glue-ups',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"The Complete Manual of Woodworking" - Gluing and clamping chapter',
      'Fine Woodworking panel glue-up techniques',
      'Franklin Titebond technical bulletins on wood glues',
    ],
  },
  {
    level: 2,
    moduleNumber: '2.6',
    assignmentNumber: 'WA-2.6.1',
    orderIndex: 25,
    title: 'Curve Cutting & Shaping - Bandsaw & Spokeshave',
    description: 'Master cutting and refining curves using bandsaw and hand shaping tools. Curves add elegance and comfort to furniture.',
    instructions: `1. Study curve layout: trammel points, flexible curves, templates
2. Learn bandsaw curve cutting: blade selection for radius, relief cuts
3. Practice spokeshave technique: grain direction, cutting angle, shaving thickness
4. Master rasp and file work: shaping techniques, coarse to fine progression
5. Study sanding curves: spindle sander, drum sander, hand sanding blocks
6. Learn to create fair curves: consistent radius, smooth transitions
7. Practice steam bending introduction (expanded in Level 5)
8. Create templates for repeatable curved parts
9. Build curved components: chair back slat, table apron, drawer front`,
    objectives: [
      'Cut smooth curves on bandsaw',
      'Refine curves with spokeshave to final dimension',
      'Create fair, flowing curves without flat spots',
      'Use rasps and files effectively',
      'Sand curves to finished surface',
    ],
    skills: ['Curve cutting', 'Spokeshave technique', 'Rasp and file work', 'Curve fairing', 'Template making'],
    expectedOutcome: 'Set of curved components demonstrating smooth bandsaw cuts and refined shaping with hand tools.',
    passingCriteria: 'Curves are fair and smooth, no bandsaw marks visible, consistent thickness throughout curve',
    referencePhotos: ['/curriculum/woodworking/curve-cutting.jpg', '/curriculum/woodworking/spokeshave-work.jpg', '/curriculum/woodworking/curved-components.jpg'],
    estimatedHours: 18,
    difficulty: 'intermediate',
    category: 'shaping',
    subcategory: 'curves',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"The Bandsaw Book" by Lonnie Bird - Curve cutting chapter',
      '"The Essential Woodworker" by Robert Wearing - Spokeshave technique',
      'Chairmaking books by Curtis Buchanan (for curve examples)',
    ],
  },
  {
    level: 2,
    moduleNumber: '2.6',
    assignmentNumber: 'WA-2.6.2',
    orderIndex: 26,
    title: 'Advanced Sanding & Scraping',
    description: 'Master card scraper and cabinet scraper techniques for surfaces too difficult to sand. Scrapers leave a superior surface.',
    instructions: `1. Study scraper types: card scraper, cabinet scraper, curved scrapers
2. Learn scraper sharpening: filing square, burnishing hook, angle control
3. Practice card scraper technique: flex amount, cutting angle, pressure
4. Master cabinet scraper setup: blade installation, sole adjustment, hook angle
5. Understand when scraping is better than sanding: figured wood, end grain
6. Practice on difficult woods: curly maple, bird's eye, quilted
7. Learn to prevent tear-out in figured grain
8. Study combination approach: scrape then very fine sand (320+)
9. Prepare sample boards showing superior scraped finish`,
    objectives: [
      'Sharpen card scraper with proper burnished hook',
      'Use card scraper without chattering',
      'Set up and use cabinet scraper effectively',
      'Achieve superior surface on figured woods',
      'Understand when to scrape vs sand',
    ],
    skills: ['Scraper sharpening', 'Scraper technique', 'Surface preparation', 'Figured wood handling', 'Tool tuning'],
    expectedOutcome: 'Sample boards of figured woods showing scraped surface superior to sanding, demonstrating proper technique.',
    passingCriteria: 'Scraped surface is smooth and tear-out free, no chatter marks, figured grain enhanced not obscured',
    referencePhotos: ['/curriculum/woodworking/card-scraper.jpg', '/curriculum/woodworking/scraper-sharpening.jpg', '/curriculum/woodworking/scraped-surface.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'surface-prep',
    subcategory: 'scraping',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"The Handplane Book" by Garrett Hack - Scraper chapter',
      'Fine Woodworking scraper technique articles',
      '"Understanding Wood Finishing" by Bob Flexner - Surface prep',
    ],
  },
  {
    level: 2,
    moduleNumber: '2.7',
    assignmentNumber: 'WA-2.7.1',
    orderIndex: 27,
    title: 'Table Construction - Solid Wood Top',
    description: 'Build a solid wood table with breadboard ends and apron attachment allowing for wood movement. The ultimate test of movement understanding.',
    instructions: `1. Study table construction methods: apron-to-leg joints, top attachment
2. Learn breadboard end construction: long tenon, floating pins, glue only at center
3. Practice apron joinery: mortise and tenon, bridle joints
4. Master top attachment methods: figure-8 fasteners, Z-clips, slotted screw holes
5. Understand top movement calculation: width × seasonal MC change × coefficient
6. Study leg attachment: square legs, tapered legs, turned legs
7. Practice leveling and stabilizing tables: adjustable feet, structural analysis
8. Learn to size components: top overhang, apron proportions, leg taper
9. Build complete small table (24"×36") with proper movement accommodation`,
    objectives: [
      'Construct breadboard ends that allow top movement',
      'Attach aprons with strong mortise and tenon joints',
      'Fasten top to base allowing for expansion/contraction',
      'Calculate and accommodate expected wood movement',
      'Build table that remains flat and stable long-term',
    ],
    skills: ['Table construction', 'Breadboard ends', 'Movement accommodation', 'Mortise and tenon', 'Structural design'],
    expectedOutcome: 'Complete working table with solid wood top, breadboard ends, and apron assembly allowing proper movement.',
    passingCriteria: 'Top can expand/contract freely, breadboard ends function correctly, table is flat and stable',
    referencePhotos: ['/curriculum/woodworking/table-construction.jpg', '/curriculum/woodworking/breadboard-ends.jpg', '/curriculum/woodworking/top-attachment.jpg'],
    estimatedHours: 36,
    difficulty: 'intermediate',
    category: 'furniture',
    subcategory: 'tables',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"The Complete Illustrated Guide to Furniture and Cabinet Construction" - Table chapter',
      'Christian Becksvoort articles on breadboard ends',
      '"Understanding Wood" by R. Bruce Hoadley - Review movement chapter',
    ],
  },
  {
    level: 2,
    moduleNumber: '2.7',
    assignmentNumber: 'WA-2.7.2',
    orderIndex: 28,
    title: 'Chair Construction Fundamentals',
    description: 'Introduction to chair construction - the most challenging furniture type. Learn basic chair joinery and structural principles.',
    instructions: `1. Study chair anatomy: legs, rungs, seat, back, stretchers
2. Learn chair structural requirements: racking resistance, weight capacity
3. Practice angled mortise and tenon joinery: compound angles, shoulder fitting
4. Master leg tapering and shaping for aesthetics and comfort
5. Study seat construction: solid wood, woven, upholstered (basics)
6. Practice assembly sequence: sub-assemblies, final assembly, keeping square
7. Learn about glue strength in chairs: stress points, reinforcement
8. Study historical chair designs: Windsor, Shaker, Arts & Crafts
9. Build simple stool or bench demonstrating chair joinery principles`,
    objectives: [
      'Cut accurate angled mortise and tenon joints',
      'Understand chair structural requirements',
      'Assemble chair components in correct sequence',
      'Create stable, strong seating furniture',
      'Apply ergonomic and aesthetic principles',
    ],
    skills: ['Chair joinery', 'Angled joinery', 'Structural analysis', 'Assembly sequence', 'Ergonomic design'],
    expectedOutcome: 'Simple stool or bench demonstrating sound chair construction principles and proper angled joinery.',
    passingCriteria: 'All joints are tight, structure is stable with no racking, supports 250+ lbs without flexing',
    referencePhotos: ['/curriculum/woodworking/chair-joinery.jpg', '/curriculum/woodworking/angled-mortise.jpg', '/curriculum/woodworking/chair-assembly.jpg'],
    estimatedHours: 32,
    difficulty: 'intermediate',
    category: 'furniture',
    subcategory: 'seating',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"The Complete Illustrated Guide to Furniture and Cabinet Construction" - Chair chapter',
      '"Make a Chair from a Tree" by John D. Alexander',
      'Curtis Buchanan Windsor chairmaking tutorials',
    ],
  },
  {
    level: 2,
    moduleNumber: '2.8',
    assignmentNumber: 'WA-2.8.1',
    orderIndex: 29,
    title: 'Shellac and French Polishing Basics',
    description: 'Learn shellac finishing - a traditional, beautiful, repairable finish. Master brush application and introduction to French polishing.',
    instructions: `1. Study shellac chemistry: flakes, cuts, dewaxed vs waxed, shelf life
2. Learn to mix shellac: 2# cut standard, fresh batches monthly
3. Practice brush application: technique, flow, avoiding runs and sags
4. Master pad application introduction: lint-free pad, lubrication
5. Study French polishing basics: bodying, spiriting off
6. Understand shellac advantages: quick-drying, reversible, beautiful depth
7. Practice grain filling with shellac and pumice
8. Learn color options: natural, garnet, amber, bleached
9. Finish samples with brushed and padded shellac`,
    objectives: [
      'Mix shellac to proper consistency',
      'Apply shellac with brush without runs or sags',
      'Use shellac pad for smooth application',
      'Understand basic French polishing technique',
      'Achieve beautiful hand-rubbed shellac finish',
    ],
    skills: ['Shellac mixing', 'Brush technique', 'Pad application', 'French polishing basics', 'Traditional finishing'],
    expectedOutcome: 'Sample boards finished with brushed and padded shellac showing smooth, clear finish.',
    passingCriteria: 'Finish is smooth and even, no runs or brush marks, pad work shows good technique',
    referencePhotos: ['/curriculum/woodworking/shellac-mixing.jpg', '/curriculum/woodworking/pad-application.jpg', '/curriculum/woodworking/french-polish.jpg'],
    estimatedHours: 16,
    difficulty: 'intermediate',
    category: 'finishing',
    subcategory: 'shellac',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Understanding Wood Finishing" by Bob Flexner - Shellac chapter',
      '"French Polishing" by Jeff Jewitt',
      'The Wood Whisperer shellac finishing videos',
    ],
  },
  {
    level: 2,
    moduleNumber: '2.8',
    assignmentNumber: 'WA-2.8.2',
    orderIndex: 30,
    title: 'Water-Based and Lacquer Finishes',
    description: 'Master water-based finishes and spray lacquer basics. Modern finishes for durability and ease of application.',
    instructions: `1. Study water-based finish types: polyurethane, acrylic, hybrid
2. Learn surface prep for water-based: grain raising, sanding sealer
3. Practice brush and wipe-on application techniques
4. Master grain raising and de-nibbing between coats
5. Study spray lacquer basics: HVLP setup, thinning, application
6. Learn spray booth safety: ventilation, respiratory protection, fire safety
7. Practice spray technique: overlap, distance, speed
8. Understand finish schedules: sealer, color coats, topcoats
9. Finish samples with water-based and lacquer (if spray available)`,
    objectives: [
      'Apply water-based finish without brush marks',
      'Handle grain raising properly',
      'Set up HVLP spray system correctly',
      'Spray lacquer with even, smooth results',
      'Understand finish durability and application trade-offs',
    ],
    skills: ['Water-based finishing', 'Spray finishing', 'HVLP setup', 'Finish safety', 'Modern finishes'],
    expectedOutcome: 'Samples finished with water-based polyurethane and spray lacquer showing professional results.',
    passingCriteria: 'Water-based finish is smooth without brush marks, spray finish is even without runs or dry spray',
    referencePhotos: ['/curriculum/woodworking/water-based-finish.jpg', '/curriculum/woodworking/hvlp-spray.jpg', '/curriculum/woodworking/spray-technique.jpg'],
    estimatedHours: 20,
    difficulty: 'intermediate',
    category: 'finishing',
    subcategory: 'modern-finishes',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Understanding Wood Finishing" by Bob Flexner - Water-based and lacquer chapters',
      '"Spray Finishing Made Simple" by Jeff Jewitt',
      'HVLP manufacturer training materials',
    ],
  },

  {
    level: 2,
    moduleNumber: '2.8',
    assignmentNumber: 'WA-2.8.3',
    orderIndex: 30.5,
    title: 'Finish Repair & Touch-Up Techniques',
    description: 'Learn to repair damaged finishes and perform professional touch-ups.',
    instructions: `1. Study common finish damage: scratches, dents, water rings, worn areas
2. Learn scratch repair: wax sticks, touch-up markers, blending
3. Practice dent removal: steam, hot iron, careful technique
4. Master water ring removal: mild abrasives, heat, refinishing
5. Learn color matching: stain blending, artist pigments, glazing
6. Practice spot refinishing: feather edges, blend new with old
7. Study French polish repairs: spiriting, padding, color matching
8. Learn wax and oil maintenance: restoration, cleaning, recoating
9. Practice finish leveling: sanding, rubbing out, polishing
10. Complete finish repair project: restore damaged furniture piece`,
    objectives: [
      'Diagnose finish damage types',
      'Repair scratches invisibly',
      'Remove dents and water rings',
      'Match colors accurately',
      'Perform spot refinishing',
      'Restore finish integrity',
    ],
    skills: ['Finish repair', 'Touch-up', 'Color matching', 'Spot refinishing', 'Restoration'],
    expectedOutcome: 'Damaged furniture piece with professionally repaired finish.',
    passingCriteria: 'Repairs blend seamlessly, color matches, finish is consistent, damage is invisible',
    referencePhotos: ['/curriculum/woodworking/finish-repair.jpg', '/curriculum/woodworking/touchup.jpg'],
    estimatedHours: 18,
    difficulty: 'intermediate',
    category: 'finishing',
    subcategory: 'repair',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Furniture finish repair techniques',
      'Color matching for wood finishing',
      '"The Furniture Doctor" by George Grotz',
    ],
  },

  {
    level: 2,
    moduleNumber: '2.9',
    assignmentNumber: 'WA-2.9.1',
    orderIndex: 31,
    title: 'Level 2 Project: Shaker Side Table',
    description: 'Build a complete Shaker-style side table integrating all Level 2 skills: joinery, assembly, finishing. This is your masterpiece for Level 2.',
    instructions: `1. Study Shaker design principles: simplicity, proportion, function, quality
2. Select and mill lumber: choose grain carefully for legs and top
3. Taper legs on table saw using jig
4. Cut mortise and tenon joints for apron-to-leg connections
5. Create drawer using half-blind dovetails
6. Build drawer runners and guides
7. Attach solid wood top with figure-8 fasteners
8. Sand and prepare all surfaces thoroughly
9. Apply finish: oil and wax or shellac (student choice)
10. Document process with photos and notes`,
    objectives: [
      'Integrate all Level 2 joinery skills in complete project',
      'Demonstrate proper wood selection and milling',
      'Execute complex assembly with multiple components',
      'Achieve furniture-quality results in all aspects',
      'Create functional, beautiful furniture piece',
      'Understand Shaker design philosophy',
    ],
    skills: ['Complete furniture construction', 'Project planning', 'Complex joinery', 'Assembly', 'Finishing', 'Design principles'],
    expectedOutcome: 'Complete Shaker side table with drawer, demonstrating mastery of Level 2 skills and furniture-quality craftsmanship.',
    passingCriteria: 'All joinery is tight, table is square and flat, drawer runs smoothly, finish is well-executed, overall quality is furniture-grade',
    referencePhotos: ['/curriculum/woodworking/shaker-table.jpg', '/curriculum/woodworking/table-joinery.jpg', '/curriculum/woodworking/completed-table.jpg'],
    estimatedHours: 60,
    difficulty: 'intermediate',
    category: 'projects',
    subcategory: 'level-2',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Shaker Furniture: The Craftsman\'s Art" by Charles R. Muller',
      '"The Shaker Image" by Elmer R. Pearson',
      'Review ALL Level 2 reading materials before starting',
    ],
  },

  // ============================================================================
  // LEVEL 3: INTRODUCTION TO FUSION 360 & DIGITAL DESIGN (Months 7-9)
  // ============================================================================

  {
    level: 3,
    moduleNumber: '3.1',
    assignmentNumber: 'WA-3.1.1',
    orderIndex: 20,
    title: 'Fusion 360 Fundamentals for Woodworking',
    description: 'Begin your journey with Fusion 360 - the industry-standard CAD/CAM software. Learn to design furniture and projects in 3D before building them.',
    instructions: `1. Install Fusion 360 and set up workspace preferences
2. Learn navigation: orbit, pan, zoom, view cube
3. Study sketch fundamentals: lines, rectangles, circles, arcs, constraints
4. Understand parametric design: dimensions as parameters, design intent
5. Practice 3D modeling basics: extrude, revolve, loft, sweep
6. Learn component creation and assembly structure
7. Create simple furniture models: stool, box, shelf
8. Generate 2D drawings with dimensions from 3D models
9. Export files for CAM (toolpaths) - introduction only
10. Model the tool tote you built in Level 1`,
    objectives: [
      'Navigate Fusion 360 interface confidently',
      'Create parametric 2D sketches with proper constraints',
      'Build 3D models of simple furniture pieces',
      'Understand assemblies and component relationships',
      'Generate dimensioned drawings from 3D models',
      'Think in 3D before building in wood',
    ],
    skills: ['CAD software', '3D modeling', 'Parametric design', 'Technical drawing', 'Design visualization'],
    expectedOutcome: '5 furniture models in Fusion 360 with complete dimensions and 2D drawings.',
    passingCriteria: 'Models are fully constrained, dimensions are accurate, drawings are readable and complete',
    referencePhotos: ['/curriculum/fusion/interface.jpg', '/curriculum/fusion/furniture-model.jpg', '/curriculum/fusion/drawing.jpg'],
    estimatedHours: 30,
    difficulty: 'intermediate',
    category: 'digital-design',
    subcategory: 'fusion-basics',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Autodesk Fusion 360 official tutorials (Getting Started series)',
      '"Fusion 360 for Makers" by Lydia Sloan Cline',
      'YouTube: "Product Design Online" - Fusion 360 woodworking series',
    ],
  },
  {
    level: 3,
    moduleNumber: '3.1',
    assignmentNumber: 'WA-3.1.2',
    orderIndex: 32,
    title: 'Parametric Modeling - Furniture Design',
    description: 'Master parametric modeling for furniture - create designs that update automatically when you change dimensions.',
    instructions: `1. Study parametric design principles: constraints, dimensions as parameters, design intent
2. Learn to use parameters effectively: named dimensions, equations, relationships
3. Practice creating fully constrained sketches: geometric and dimensional constraints
4. Master timeline and feature editing: making changes propagate through design
5. Study component creation: multiple bodies vs components, assembly context
6. Learn joint creation: rigid, revolute, slider, cylindrical
7. Practice creating furniture with parameters: table that scales, chair with adjustable dimensions
8. Understand when to use parameters vs direct modeling
9. Create parametric bookshelf that adjusts to any size`,
    objectives: [
      'Create fully parametric furniture models',
      'Use named parameters and equations',
      'Edit designs easily by changing parameters',
      'Understand constraint-based modeling',
      'Build assemblies with proper joints',
    ],
    skills: ['Parametric modeling', 'Constraints', 'Assembly design', 'Design intent', 'Advanced CAD'],
    expectedOutcome: 'Parametric bookshelf model that can be resized by changing a few parameter values.',
    passingCriteria: 'Model updates correctly when parameters change, no broken constraints, assembly joints work properly',
    referencePhotos: ['/curriculum/fusion/parametric-design.jpg', '/curriculum/fusion/parameters.jpg', '/curriculum/fusion/assemblies.jpg'],
    estimatedHours: 24,
    difficulty: 'intermediate',
    category: 'digital-design',
    subcategory: 'parametric',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Autodesk Fusion 360 parametric design tutorials',
      '"Parametric Modeling with Autodesk Fusion 360" by Randy Shih',
      'Lars Christensen Fusion 360 YouTube channel',
    ],
  },
  {
    level: 3,
    moduleNumber: '3.2',
    assignmentNumber: 'WA-3.2.1',
    orderIndex: 33,
    title: 'CAM Basics - 2D Toolpaths',
    description: 'Introduction to Computer Aided Manufacturing (CAM) - generate toolpaths from your 3D models for CNC machining.',
    instructions: `1. Study CAM workflow: setup, stock, operations, simulate, post-process
2. Learn setup creation: work coordinate system, stock size, fixturing plan
3. Practice 2D operations: face, pocket, contour, drill, bore
4. Master tool selection: end mills, ball nose, drill bits, feeds and speeds
5. Understand toolpath parameters: stepover, stepdown, ramp, lead-in/out
6. Study holding strategies: clamps, vacuum, t-tracks, fixture design
7. Practice simulation: detect collisions, visualize toolpaths, verify dimensions
8. Learn post-processing: generate G-code for specific CNC controller
9. Create toolpaths for simple pocketing operation`,
    objectives: [
      'Set up CAM workspace correctly',
      'Select appropriate tools and parameters',
      'Generate 2D toolpaths for pockets and contours',
      'Simulate toolpaths to verify correctness',
      'Post-process to G-code',
    ],
    skills: ['CAM programming', 'Toolpath generation', 'Tool selection', 'Feeds and speeds', 'G-code basics'],
    expectedOutcome: 'Generated toolpaths for pocketing operation with simulation showing correct cutting.',
    passingCriteria: 'Toolpaths are efficient, no collisions in simulation, G-code generates correctly',
    referencePhotos: ['/curriculum/fusion/cam-setup.jpg', '/curriculum/fusion/toolpaths.jpg', '/curriculum/fusion/simulation.jpg'],
    estimatedHours: 28,
    difficulty: 'intermediate',
    category: 'cam',
    subcategory: 'basics',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Autodesk Fusion 360 CAM tutorials',
      'Winston Moy Fusion 360 CAM YouTube series',
      'CNC feeds and speeds charts for wood',
    ],
  },
  {
    level: 3,
    moduleNumber: '3.2',
    assignmentNumber: 'WA-3.2.2',
    orderIndex: 34,
    title: '3D Toolpaths - Contouring and Adaptive Clearing',
    description: 'Advanced CAM - 3D toolpaths for complex surfaces and efficient material removal.',
    instructions: `1. Study 3D toolpath types: parallel, scallop, radial, spiral, adaptive
2. Learn adaptive clearing: efficient roughing, constant tool engagement
3. Practice contour operations: follow surface, maintain stepover
4. Master rest machining: cleanup from previous operations
5. Understand finishing strategies: parallel vs radial, cusps, surface quality
6. Study ball nose tool applications: 3D surfaces, carvings, complex shapes
7. Practice toolpath optimization: reduce air moves, tool changes, cycle time
8. Learn multi-axis basics: 4th axis introduction, rotary machining
9. Create toolpaths for carved sign or 3D relief`,
    objectives: [
      'Generate efficient 3D roughing toolpaths',
      'Create smooth finishing toolpaths',
      'Use adaptive clearing for material removal',
      'Understand rest machining workflow',
      'Optimize toolpaths for cycle time',
    ],
    skills: ['3D CAM', 'Adaptive toolpaths', 'Surface finishing', 'Toolpath optimization', 'Complex machining'],
    expectedOutcome: 'Complete toolpath strategy for 3D carved component with efficient roughing and smooth finishing.',
    passingCriteria: 'Simulation shows smooth surfaces, roughing is efficient, finishing passes are optimized',
    referencePhotos: ['/curriculum/fusion/adaptive-clearing.jpg', '/curriculum/fusion/3d-toolpaths.jpg', '/curriculum/fusion/carved-part.jpg'],
    estimatedHours: 26,
    difficulty: 'advanced',
    category: 'cam',
    subcategory: '3d-toolpaths',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Autodesk Fusion 360 3D toolpath tutorials',
      'Adaptive clearing white papers',
      'CNC machining strategies for complex surfaces',
    ],
  },
  {
    level: 3,
    moduleNumber: '3.3',
    assignmentNumber: 'WA-3.3.1',
    orderIndex: 35,
    title: 'Technical Drawing & Documentation',
    description: 'Create professional technical drawings from 3D models - the universal language of manufacturing.',
    instructions: `1. Study drawing standards: ANSI, ISO, title blocks, drawing views
2. Learn view creation: top, front, right, isometric, section views
3. Practice dimensioning: aligned, ordinate, baseline, chain
4. Master tolerances and fits: ±, limits, GD&T introduction
5. Study section views: full section, half section, offset section
6. Learn detail views: callouts, enlarged details, break lines
7. Practice creating bill of materials (BOM): part numbers, quantities
8. Understand drawing notes: general notes, specific callouts, finish specs
9. Create complete drawing package for furniture piece`,
    objectives: [
      'Generate proper orthographic views from 3D model',
      'Apply dimensions correctly and completely',
      'Create section views where appropriate',
      'Produce professional drawing package',
      'Communicate design intent clearly',
    ],
    skills: ['Technical drawing', 'Dimensioning', 'Drawing standards', 'Documentation', 'Communication'],
    expectedOutcome: 'Complete drawing package for furniture piece with all views, dimensions, and notes.',
    passingCriteria: 'Drawings follow standards, dimensions are complete and clear, BOM is accurate',
    referencePhotos: ['/curriculum/fusion/technical-drawing.jpg', '/curriculum/fusion/sections.jpg', '/curriculum/fusion/dimensioned-drawing.jpg'],
    estimatedHours: 20,
    difficulty: 'intermediate',
    category: 'documentation',
    subcategory: 'technical-drawing',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Technical Drawing" by Frederick E. Giesecke',
      'ANSI Y14.5 drafting standards',
      'Autodesk Fusion 360 drawing tutorials',
    ],
  },
  {
    level: 3,
    moduleNumber: '3.3',
    assignmentNumber: 'WA-3.3.2',
    orderIndex: 36,
    title: 'Rendering & Visualization',
    description: 'Create photorealistic renderings of your designs to communicate ideas to clients and visualize finished products.',
    instructions: `1. Study rendering basics: lighting, materials, camera angles
2. Learn appearance editor: wood grain, metal finishes, glass, fabric
3. Practice lighting setup: key light, fill light, rim light, environment
4. Master camera positioning: perspective, depth of field, composition
5. Study environment setup: HDRI backgrounds, studio setups
6. Learn rendering settings: quality vs speed, resolution, samples
7. Practice creating scenes: furniture in room context, product shots
8. Understand post-processing: brightness, contrast, color correction
9. Create portfolio-quality renderings of furniture designs`,
    objectives: [
      'Apply realistic materials to models',
      'Set up effective lighting for renderings',
      'Position camera for compelling compositions',
      'Generate high-quality photorealistic renders',
      'Present designs professionally',
    ],
    skills: ['3D rendering', 'Material application', 'Lighting design', 'Composition', 'Visual communication'],
    expectedOutcome: 'Three portfolio-quality renderings of furniture pieces showing different angles and contexts.',
    passingCriteria: 'Renderings are photorealistic, lighting is effective, materials look accurate, composition is professional',
    referencePhotos: ['/curriculum/fusion/rendering-setup.jpg', '/curriculum/fusion/materials.jpg', '/curriculum/fusion/final-render.jpg'],
    estimatedHours: 18,
    difficulty: 'intermediate',
    category: 'visualization',
    subcategory: 'rendering',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Autodesk Fusion 360 rendering tutorials',
      '"Digital Lighting and Rendering" by Jeremy Birn',
      'HDRI Haven for environment maps',
    ],
  },
  {
    level: 3,
    moduleNumber: '3.4',
    assignmentNumber: 'WA-3.4.1',
    orderIndex: 37,
    title: 'Sheet Metal Design in Fusion 360',
    description: 'Learn sheet metal design for brackets, enclosures, and metal furniture components.',
    instructions: `1. Study sheet metal fundamentals: bend allowance, K-factor, minimum bend radius
2. Learn sheet metal tools: flange, bend, unfold, refold
3. Practice creating sheet metal parts: brackets, boxes, enclosures
4. Master flat pattern creation: develop part for cutting and bending
5. Understand material thickness and its effect on bends
6. Study relief cuts and corner treatments
7. Learn to export flat patterns for laser cutting or water jet
8. Practice designing for manufacturability: bend sequence, tooling access
9. Design sheet metal bracket for furniture project`,
    objectives: [
      'Create sheet metal parts in Fusion 360',
      'Generate accurate flat patterns',
      'Understand bend allowance and K-factor',
      'Design parts that can actually be manufactured',
      'Export for CNC cutting and forming',
    ],
    skills: ['Sheet metal design', 'Bend allowance', 'Flat pattern development', 'Manufacturing design', 'Metal forming'],
    expectedOutcome: 'Sheet metal bracket design with 3D model and accurate flat pattern for manufacturing.',
    passingCriteria: 'Flat pattern is accurate, bends are achievable, design is manufacturable',
    referencePhotos: ['/curriculum/fusion/sheet-metal.jpg', '/curriculum/fusion/flat-pattern.jpg', '/curriculum/fusion/metal-bracket.jpg'],
    estimatedHours: 16,
    difficulty: 'intermediate',
    category: 'sheet-metal',
    subcategory: 'design',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Autodesk Fusion 360 sheet metal tutorials',
      'Sheet metal fabrication handbooks',
      'Bend allowance calculation guides',
    ],
  },
  {
    level: 3,
    moduleNumber: '3.4',
    assignmentNumber: 'WA-3.4.2',
    orderIndex: 38,
    title: 'Simulation & Finite Element Analysis (FEA) Basics',
    description: 'Learn structural simulation to verify designs will be strong enough before building them.',
    instructions: `1. Study FEA basics: mesh, boundary conditions, loads, material properties
2. Learn to set up static stress analysis: fixtures, loads, contacts
3. Practice mesh refinement: element size, convergence studies
4. Master result interpretation: stress, displacement, factor of safety
5. Understand yield strength and failure prediction
6. Study load cases: worst-case scenarios, safety factors
7. Learn to optimize designs: lightweighting, stress relief, ribbing
8. Practice on furniture components: shelf deflection, chair leg stress
9. Analyze table leg under load and optimize design`,
    objectives: [
      'Set up basic FEA analysis',
      'Interpret stress and displacement results',
      'Predict if design will fail under load',
      'Use simulation to optimize designs',
      'Understand safety factors',
    ],
    skills: ['FEA', 'Structural analysis', 'Result interpretation', 'Design optimization', 'Engineering analysis'],
    expectedOutcome: 'FEA analysis of furniture component showing stress distribution and factor of safety calculation.',
    passingCriteria: 'Analysis converges, loads and fixtures are correct, results are interpreted properly',
    referencePhotos: ['/curriculum/fusion/fea-setup.jpg', '/curriculum/fusion/stress-plot.jpg', '/curriculum/fusion/optimized-design.jpg'],
    estimatedHours: 22,
    difficulty: 'advanced',
    category: 'simulation',
    subcategory: 'fea',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Autodesk Fusion 360 simulation tutorials',
      '"Finite Element Analysis for Design Engineers" by Paul Kurowski',
      'Material property databases (MatWeb)',
    ],
  },
  {
    level: 3,
    moduleNumber: '3.5',
    assignmentNumber: 'WA-3.5.1',
    orderIndex: 39,
    title: 'Generative Design Introduction',
    description: 'Explore AI-driven generative design - let the computer explore thousands of designs to find optimal solutions.',
    instructions: `1. Study generative design principles: objectives, constraints, manufacturing methods
2. Learn to set up generative study: preserve geometry, obstacle geometry, loads
3. Practice defining manufacturing constraints: 2-axis, 3-axis, additive
4. Master material selection and quantities
5. Understand outcome interpretation: multiple solutions, performance metrics
6. Study post-processing: selecting best outcome, editing results
7. Learn when generative design is appropriate vs traditional modeling
8. Practice on furniture component: optimize chair leg, table support
9. Create lightweight bracket using generative design`,
    objectives: [
      'Set up generative design study',
      'Define appropriate constraints and objectives',
      'Evaluate and select from multiple outcomes',
      'Understand AI-driven design process',
      'Apply to real design problems',
    ],
    skills: ['Generative design', 'AI-assisted design', 'Design optimization', 'Advanced CAD', 'Future technology'],
    expectedOutcome: 'Generative design study results showing optimized component with weight reduction.',
    passingCriteria: 'Study produces valid results, selected outcome meets requirements, design is buildable',
    referencePhotos: ['/curriculum/fusion/generative-setup.jpg', '/curriculum/fusion/outcomes.jpg', '/curriculum/fusion/optimized-bracket.jpg'],
    estimatedHours: 20,
    difficulty: 'advanced',
    category: 'advanced-design',
    subcategory: 'generative',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Autodesk generative design tutorials',
      '"Generative Design" by Autodesk',
      'Case studies of generative design applications',
    ],
  },
  {
    level: 3,
    moduleNumber: '3.5',
    assignmentNumber: 'WA-3.5.2',
    orderIndex: 40,
    title: 'Electronics Enclosure Design',
    description: 'Design enclosures for electronics - prepare for integrating electronics into woodworking and aerospace projects.',
    instructions: `1. Study enclosure design requirements: access, ventilation, mounting, cable management
2. Learn component library use: importing STEP files, standard parts
3. Practice designing for assembly: snap fits, screw bosses, alignment features
4. Master clearance and tolerance design: fit analysis, assembly constraints
5. Study thermal management: vents, heat sinks, fan mounting
6. Learn cable management: strain relief, grommet design, routing channels
7. Practice designing split enclosures: alignment pins, screw locations
8. Understand IP ratings and sealing requirements
9. Design enclosure for Arduino or Raspberry Pi project`,
    objectives: [
      'Design functional electronics enclosures',
      'Incorporate mounting and access features',
      'Plan for thermal management',
      'Design for assembly and disassembly',
      'Use component libraries effectively',
    ],
    skills: ['Enclosure design', 'Assembly design', 'Tolerance analysis', 'Thermal design', 'Product design'],
    expectedOutcome: 'Complete enclosure design for electronics project with proper mounting, access, and ventilation.',
    passingCriteria: 'Enclosure fits components with clearance, assembly is practical, ventilation is adequate',
    referencePhotos: ['/curriculum/fusion/enclosure-design.jpg', '/curriculum/fusion/mounting-features.jpg', '/curriculum/fusion/assembled-enclosure.jpg'],
    estimatedHours: 18,
    difficulty: 'intermediate',
    category: 'product-design',
    subcategory: 'enclosures',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Designing Electronics for Manufacturability" by Ray Prasad',
      'Hammond enclosure design guides',
      'Fusion 360 product design tutorials',
    ],
    crossReferences: [
      'See Electronics Curriculum for understanding components being enclosed',
      'See Computing Curriculum for programming devices in enclosures',
    ],
  },
  {
    level: 3,
    moduleNumber: '3.6',
    assignmentNumber: 'WA-3.6.1',
    orderIndex: 41,
    title: 'CNC Router Operations - First Projects',
    description: 'Move from digital to physical - cut your first projects on a CNC router.',
    instructions: `1. Study CNC router safety: emergency stop, dust collection, proper fixturing
2. Learn machine coordinate systems: machine zero, work zero, tool length offset
3. Practice workpiece fixturing: clamps, screws, vacuum table, double-sided tape
4. Master tool installation: collet tightening, runout check, tool length setting
5. Study G-code basics: G00, G01, G02, G03, M03, M05 commands
6. Learn to zero the machine: X, Y, Z touch-off procedures
7. Practice running programs: dry run, feed rate override, spindle speed
8. Understand chip load and feed rates for different materials
9. Cut first project: simple pocketed tray or sign`,
    objectives: [
      'Operate CNC router safely',
      'Set up work coordinate system correctly',
      'Fixture workpieces securely',
      'Run CNC programs successfully',
      'Understand basic G-code commands',
    ],
    skills: ['CNC operation', 'Workpiece fixturing', 'Machine setup', 'G-code basics', 'Safe CNC practices'],
    expectedOutcome: 'Successfully machined first CNC project showing understanding of setup and operation.',
    passingCriteria: 'Part matches CAD model, no safety violations, proper fixturing, clean cutting',
    referencePhotos: ['/curriculum/cnc/router-setup.jpg', '/curriculum/cnc/fixturing.jpg', '/curriculum/cnc/first-project.jpg'],
    estimatedHours: 24,
    difficulty: 'intermediate',
    category: 'cnc-operations',
    subcategory: 'router-basics',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'CNC router manufacturer operation manual',
      '"CNC Machining Handbook" by Alan Overby',
      'G-code reference guide',
    ],
  },
  {
    level: 3,
    moduleNumber: '3.6',
    assignmentNumber: 'WA-3.6.2',
    orderIndex: 42,
    title: 'Advanced CNC Fixturing & Jigs',
    description: 'Master advanced fixturing techniques for complex parts and double-sided machining.',
    instructions: `1. Study fixture design principles: 3-2-1 locating, clamping forces, accessibility
2. Learn to design machining jigs: alignment features, repeatability, quick-change
3. Practice double-sided machining: registration methods, flip jigs, dowel pins
4. Master vacuum table use: seal design, pump selection, holding force calculation
5. Study soft jaws and sacrificial fixtures: custom holding, protecting parts
6. Learn fixture offsetting: programming multiple parts, nesting
7. Practice designing hold-down clamps: interference check, access for cleanup
8. Understand tombstone fixturing: 4-sided machining, indexing
9. Design and build fixture for complex part`,
    objectives: [
      'Design effective machining fixtures',
      'Execute double-sided machining',
      'Use vacuum holding systems',
      'Maximize machine utilization with nesting',
      'Create repeatable setups',
    ],
    skills: ['Fixture design', 'Advanced fixturing', 'Double-sided machining', 'Vacuum systems', 'Production setup'],
    expectedOutcome: 'Custom fixture design and successful double-sided machining of complex part.',
    passingCriteria: 'Fixture holds part securely, alignment is accurate, double-sided features align properly',
    referencePhotos: ['/curriculum/cnc/fixture-design.jpg', '/curriculum/cnc/double-sided.jpg', '/curriculum/cnc/vacuum-table.jpg'],
    estimatedHours: 26,
    difficulty: 'advanced',
    category: 'cnc-operations',
    subcategory: 'fixturing',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Fixture Design" by Edward G. Hoffman',
      'CNC fixturing handbooks',
      'Vacuum table sizing calculators and guides',
    ],
  },
  {
    level: 3,
    moduleNumber: '3.7',
    assignmentNumber: 'WA-3.7.1',
    orderIndex: 43,
    title: 'Laser Cutting & Engraving',
    description: 'Master laser cutting for precision parts, decorative engraving, and rapid prototyping.',
    instructions: `1. Study laser safety: laser classes, eye protection, fume extraction, fire watch
2. Learn laser types: CO2 (wood, acrylic), fiber (metal marking), diode (engraving)
3. Practice file preparation: vector cutting, raster engraving, power/speed settings
4. Master material selection: suitable materials, prohibited materials (PVC!)
5. Study kerf compensation: adjusting for beam width, tight fit joints
6. Learn to optimize cutting order: inside first, reduce material shift
7. Practice engraving parameters: DPI, speed, power for different effects
8. Understand air assist and gas selection: oxygen (cutting), nitrogen (clean edges)
9. Design and laser-cut box with living hinges`,
    objectives: [
      'Operate laser cutter safely',
      'Prepare files for cutting and engraving',
      'Select appropriate power and speed settings',
      'Compensate for kerf in designs',
      'Create precision laser-cut parts',
    ],
    skills: ['Laser operation', 'Laser safety', 'File preparation', 'Material knowledge', 'Engraving'],
    expectedOutcome: 'Laser-cut box with living hinges and engraved details showing mastery of technique.',
    passingCriteria: 'No safety violations, parts fit together precisely, engraving is clean and consistent',
    referencePhotos: ['/curriculum/laser/safety-setup.jpg', '/curriculum/laser/cutting.jpg', '/curriculum/laser/living-hinge-box.jpg'],
    estimatedHours: 20,
    difficulty: 'intermediate',
    category: 'digital-fabrication',
    subcategory: 'laser',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Laser cutter manufacturer safety manual',
      '"Make: Laser Cutting and Engraving" by Samer Najia',
      'Material compatibility charts for laser cutting',
    ],
  },
  {
    level: 3,
    moduleNumber: '3.7',
    assignmentNumber: 'WA-3.7.2',
    orderIndex: 44,
    title: '3D Printing for Jigs and Prototypes',
    description: 'Use 3D printing to create custom jigs, fixtures, and prototype parts for woodworking and manufacturing.',
    instructions: `1. Study 3D printing technologies: FDM, SLA, SLS (focus on FDM for jigs)
2. Learn print preparation: orientation, supports, layer height, infill
3. Practice slicing: Cura, PrusaSlicer, settings for different applications
4. Master material selection: PLA (prototyping), PETG (durability), TPU (flexibility)
5. Study design for 3D printing: overhangs, bridges, tolerances, orientation
6. Learn to design jigs and fixtures: drill guides, sanding blocks, templates
7. Practice print settings optimization: speed vs quality, strength vs material use
8. Understand post-processing: support removal, sanding, vapor smoothing, painting
9. Design and print custom drill guide or router template`,
    objectives: [
      'Prepare CAD models for 3D printing',
      'Select appropriate print settings',
      'Design functional jigs and fixtures',
      'Understand material properties and applications',
      'Post-process prints for final use',
    ],
    skills: ['3D printing', 'Additive manufacturing', 'Jig design', 'Material selection', 'Print optimization'],
    expectedOutcome: 'Functional 3D printed jig or template designed for specific woodworking operation.',
    passingCriteria: 'Jig functions as intended, print quality is good, design is optimized for 3D printing',
    referencePhotos: ['/curriculum/3dprint/slicer-setup.jpg', '/curriculum/3dprint/printing.jpg', '/curriculum/3dprint/drill-guide.jpg'],
    estimatedHours: 18,
    difficulty: 'intermediate',
    category: 'digital-fabrication',
    subcategory: '3d-printing',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"3D Printing Handbook" by Ben Redwood',
      '"Make: Getting Started with 3D Printing" by Liza Wallach Kloski',
      'Prusa 3D printing handbook',
    ],
  },
  {
    level: 3,
    moduleNumber: '3.8',
    assignmentNumber: 'WA-3.8.1',
    orderIndex: 45,
    title: 'Design for Manufacturing (DFM) Principles',
    description: 'Learn to design parts that are easy and economical to manufacture - critical for real-world projects.',
    instructions: `1. Study DFM principles: minimize operations, standard tooling, material efficiency
2. Learn tolerance assignment: only specify tight tolerances where necessary
3. Practice designing for your processes: CNC capabilities, tooling available
4. Master material selection: cost, availability, workability, performance
5. Understand setup reduction: minimize workpiece reorientation, gang operations
6. Study assembly design: DFA principles, reduce part count, snap fits
7. Learn to design for specific tools: standard drill sizes, available end mills
8. Practice cost estimation: material cost, machine time, labor
9. Redesign complex part to be more manufacturable`,
    objectives: [
      'Design parts that are easy to manufacture',
      'Minimize manufacturing cost',
      'Specify appropriate tolerances',
      'Reduce setup and operation count',
      'Select materials wisely',
    ],
    skills: ['DFM', 'Cost optimization', 'Tolerance design', 'Manufacturing planning', 'Value engineering'],
    expectedOutcome: 'Redesigned part showing significant manufacturing improvements over original.',
    passingCriteria: 'Redesign reduces operations, uses standard tooling, maintains functionality, lowers cost',
    referencePhotos: ['/curriculum/dfm/before-after.jpg', '/curriculum/dfm/standard-tooling.jpg', '/curriculum/dfm/optimized-design.jpg'],
    estimatedHours: 16,
    difficulty: 'advanced',
    category: 'manufacturing-engineering',
    subcategory: 'dfm',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Design for Manufacturability Handbook" by James G. Bralla',
      '"The Design of Manufacturing Systems" by J.T. Black',
      'Boothroyd DFM methodology papers',
    ],
  },
  {
    level: 3,
    moduleNumber: '3.8',
    assignmentNumber: 'WA-3.8.2',
    orderIndex: 46,
    title: 'Reverse Engineering with 3D Scanning',
    description: 'Learn to use 3D scanning to measure existing parts and create CAD models from physical objects.',
    instructions: `1. Study 3D scanning technologies: photogrammetry, structured light, laser scanning
2. Learn scan preparation: surface treatment, contrast powder, reference marks
3. Practice scanning technique: overlap, coverage, resolution settings
4. Master mesh processing: cleanup, hole filling, smoothing, decimation
5. Study mesh-to-CAD conversion: surfacing, feature recognition, parametric rebuild
6. Learn inspection and comparison: deviation analysis, GD&T verification
7. Practice reverse engineering workflow: scan → mesh → surface → solid
8. Understand when reverse engineering is appropriate vs measuring
9. Scan and model existing furniture part or tool handle`,
    objectives: [
      'Operate 3D scanner to capture part geometry',
      'Process scan data into usable mesh',
      'Convert mesh to parametric CAD model',
      'Verify accuracy of scanned model',
      'Apply reverse engineering to real problems',
    ],
    skills: ['3D scanning', 'Mesh processing', 'Reverse engineering', 'CAD surfacing', 'Metrology'],
    expectedOutcome: 'CAD model created from 3D scan of physical part showing accurate geometry.',
    passingCriteria: 'Model matches physical part within scanner resolution, topology is clean, model is parametric',
    referencePhotos: ['/curriculum/scan/scanning-setup.jpg', '/curriculum/scan/mesh-processing.jpg', '/curriculum/scan/cad-model.jpg'],
    estimatedHours: 22,
    difficulty: 'advanced',
    category: 'metrology',
    subcategory: '3d-scanning',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '3D scanner manufacturer training materials',
      '"3D Scanning and Analysis" by  Bernard Bayle',
      'Reverse engineering case studies',
    ],
  },
  {
    level: 3,
    moduleNumber: '3.9',
    assignmentNumber: 'WA-3.9.1',
    orderIndex: 47,
    title: 'Digital Furniture Portfolio Development',
    description: 'Create a professional digital portfolio of furniture designs to showcase your skills.',
    instructions: `1. Study portfolio best practices: presentation, variety, documentation
2. Learn to document design process: sketches, iterations, final design
3. Practice creating exploded views: assembly sequence, component labeling
4. Master animation basics: assembly animations, rotating turntables
5. Study presentation boards: layout, typography, rendering placement
6. Learn to create design variants: color options, size options, configurations
7. Practice writing design narratives: inspiration, function, materials, process
8. Understand portfolio format: PDF, website, printed book
9. Create complete portfolio page for one furniture design`,
    objectives: [
      'Document design process professionally',
      'Create compelling visual presentations',
      'Generate animations and exploded views',
      'Write effective design narratives',
      'Build presentation-quality portfolio',
    ],
    skills: ['Portfolio development', 'Presentation design', 'Animation', 'Technical communication', 'Professional practice'],
    expectedOutcome: 'Complete portfolio page with renderings, technical drawings, animations, and design narrative.',
    passingCriteria: 'Presentation is professional, visuals are high quality, documentation is complete',
    referencePhotos: ['/curriculum/portfolio/layout.jpg', '/curriculum/portfolio/exploded-view.jpg', '/curriculum/portfolio/portfolio-page.jpg'],
    estimatedHours: 20,
    difficulty: 'intermediate',
    category: 'professional-practice',
    subcategory: 'portfolio',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Professional furniture design portfolios (online research)',
      '"Portfolios for Interior Designers" by Maureen Mitton',
      'Design presentation best practices articles',
    ],
  },

  {
    level: 3,
    moduleNumber: '3.9',
    assignmentNumber: 'WA-3.9.2',
    orderIndex: 47.5,
    title: '3D Printing for Woodworking - Jigs & Templates',
    description: 'Use 3D printing to create custom jigs, templates, and hardware for woodworking projects.',
    instructions: `1. Study 3D printing basics: FDM technology, materials (PLA, PETG, TPU)
2. Learn to model printable objects in Fusion 360: tolerances, support structures
3. Design router template or circle cutting jig: precise curves, bearing surfaces
4. Design drill guide or doweling jig: precise hole locations
5. Model custom hardware: knobs, handles, cam clamps
6. Learn slicing software: layer height, infill, support generation
7. Print jigs and test fit: refine tolerances if needed
8. Design hinge mortise template or other specialized jig
9. Print and use custom jigs in actual woodworking project
10. Document library of useful 3D printed shop aids`,
    objectives: [
      'Model printable objects with proper tolerances',
      'Design functional jigs for woodworking',
      'Understand 3D printing constraints',
      'Slice and print successfully',
      'Create library of useful shop aids',
      'Integrate 3D printing into woodworking workflow',
    ],
    skills: ['3D printing', 'Jig design', 'Tolerance management', 'Additive manufacturing', 'Tool making'],
    expectedOutcome: 'Library of 3D printed jigs and templates proven in actual woodworking use.',
    passingCriteria: 'Printed jigs fit properly, function as designed, improve woodworking accuracy and efficiency',
    referencePhotos: ['/curriculum/3dprint/router-template.jpg', '/curriculum/3dprint/drill-jig.jpg'],
    estimatedHours: 26,
    difficulty: 'intermediate',
    category: 'digital-fabrication',
    subcategory: '3d-printing',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '3D printing basics for makers',
      'Fusion 360 for 3D printing',
      '3D printed woodworking jigs and fixtures',
    ],
  },

  {
    level: 3,
    moduleNumber: '3.9',
    assignmentNumber: 'WA-3.9.3',
    orderIndex: 47.8,
    title: 'Laser Cutting & Engraving for Woodworking',
    description: 'Learn laser cutting and engraving for precision parts, inlay, and decoration.',
    instructions: `1. Study laser cutter operation: CO2 lasers, power and speed settings
2. Learn material compatibility: woods, acrylics, safe vs unsafe materials
3. Design laser-cut inlay patterns in Fusion 360 or Illustrator
4. Practice vector vs raster: cutting vs engraving
5. Learn kerf compensation: accounting for laser beam width
6. Design and cut precise joinery: finger joints, living hinges
7. Practice engraving: photos, text, decorative patterns
8. Create multi-material inlay: wood + acrylic laser cut parts
9. Design and cut complex nested parts: efficient material usage
10. Complete project using laser cutting: inlay box lid or decorative panel`,
    objectives: [
      'Operate laser cutter safely',
      'Design for laser cutting (kerf, tolerances)',
      'Differentiate vector cutting and raster engraving',
      'Create precise inlay patterns',
      'Optimize nesting for material efficiency',
      'Integrate laser cutting into woodworking',
    ],
    skills: ['Laser cutting', 'Laser engraving', 'Vector design', 'Inlay work', 'Kerf compensation'],
    expectedOutcome: 'Laser-cut inlay or decorative project demonstrating precision and design integration.',
    passingCriteria: 'Parts fit precisely, engraving is clean and accurate, design is well-executed',
    referencePhotos: ['/curriculum/laser/inlay-cutting.jpg', '/curriculum/laser/engraved-panel.jpg'],
    estimatedHours: 24,
    difficulty: 'intermediate',
    category: 'digital-fabrication',
    subcategory: 'laser',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Laser cutter safety and operation',
      'Designing for laser cutting',
      'Laser-cut woodworking projects',
    ],
  },

  {
    level: 3,
    moduleNumber: '3.9',
    assignmentNumber: 'WA-3.9.4',
    orderIndex: 48,
    title: 'Level 3 Project: CNC Router Table',
    description: 'Design and fabricate a router table using Fusion 360 CAD/CAM and CNC router. Integration of all Level 3 digital skills.',
    instructions: `1. Research router table designs: features, dimensions, ergonomics
2. Design complete router table in Fusion 360: parametric model, all components
3. Create assembly with proper joints and hardware
4. Run FEA analysis on critical components: top deflection, fence rigidity
5. Generate complete technical drawings: all views, dimensions, BOM
6. Create photorealistic renderings: multiple views, different materials/finishes
7. Generate CAM toolpaths for all CNC-cut components
8. Machine all parts on CNC router
9. Assemble router table and verify performance
10. Document complete process with photos and notes`,
    objectives: [
      'Integrate all Level 3 CAD/CAM skills',
      'Design functional shop furniture',
      'Execute complete digital-to-physical workflow',
      'Verify design with FEA before building',
      'Produce professional documentation',
      'Build high-quality CNC project',
    ],
    skills: ['Complete CAD/CAM workflow', 'Furniture design', 'FEA validation', 'CNC fabrication', 'Project documentation'],
    expectedOutcome: 'Fully functional CNC-built router table with complete CAD model, toolpaths, drawings, and documentation.',
    passingCriteria: 'Router table is functional and accurate, all digital files are professional quality, build matches design',
    referencePhotos: ['/curriculum/fusion/router-table-cad.jpg', '/curriculum/cnc/router-table-parts.jpg', '/curriculum/projects/finished-router-table.jpg'],
    estimatedHours: 80,
    difficulty: 'advanced',
    category: 'projects',
    subcategory: 'level-3',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Router table design articles and plans',
      'Review ALL Level 3 reading materials',
      '"The Router Book" by Pat Warner - Router table chapter',
    ],
  },

  // ============================================================================
  // LEVEL 4: ADVANCED FURNITURE & CNC PRODUCTION (Months 10-12)
  // ============================================================================

  // Module 4.1: Advanced Veneering & Surfaces
  {
    level: 4,
    moduleNumber: '4.1',
    assignmentNumber: 'WA-4.1.1',
    orderIndex: 40,
    title: 'Vacuum Bag Veneering - Curved & Flat Panels',
    description: 'Master vacuum bag pressing for applying veneer to flat and curved substrates with professional results.',
    instructions: `1. Study vacuum bag theory: atmospheric pressure, clamping force distribution
2. Learn veneer selection: bookmatching, slip matching, grain direction
3. Practice substrate preparation: MDF, plywood, or curved forms
4. Master adhesive selection: yellow glue, urea formaldehyde, or epoxy
5. Learn bag setup: breather cloth, caul boards, sealing tape
6. Practice vacuum pump operation: target 20-25" Hg minimum
7. Veneer a flat panel: apply glue evenly, position veneer, bag and evacuate
8. Veneer a curved form: compound curves, veneer flexibility, pre-bending
9. Learn trimming and edging: flush trim bit, edge banding
10. Complete veneered panel project with bookmatched figure`,
    objectives: [
      'Set up and operate vacuum bag system',
      'Apply veneer to flat panels with no bubbles or voids',
      'Veneer compound curved surfaces',
      'Select appropriate adhesives for different applications',
      'Trim and finish veneered surfaces',
      'Create bookmatched veneer patterns',
    ],
    skills: ['Vacuum bag pressing', 'Veneering', 'Adhesive selection', 'Surface preparation', 'Curved work'],
    expectedOutcome: 'Professionally veneered flat and curved panels with no defects, ready for finishing.',
    passingCriteria: 'No bubbles, voids, or delamination; veneer grain matches design intent; edges clean and square',
    referencePhotos: ['/curriculum/woodworking/vacuum-bag.jpg', '/curriculum/woodworking/curved-veneer.jpg'],
    estimatedHours: 35,
    difficulty: 'advanced',
    category: 'advanced-techniques',
    subcategory: 'veneering',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Vacuum Pressing Made Simple" by Darryl Keil',
      '"The Complete Manual of Wood Veneering" by William Lincoln',
      'Joe Woodworker vacuum veneering guides',
    ],
    crossReferences: ['See WA-3 for curved form design in Fusion 360'],
  },

  {
    level: 4,
    moduleNumber: '4.1',
    assignmentNumber: 'WA-4.1.2',
    orderIndex: 41,
    title: 'Marquetry & Inlay Techniques',
    description: 'Create decorative patterns by inlaying contrasting wood species into a background veneer.',
    instructions: `1. Study marquetry history: boulle work, intarsia, parquetry
2. Learn veneer species selection: color contrast, grain pattern, stability
3. Practice knife cutting: sharp blades, angled cuts, tight joints
4. Master pad sawing: fretsaw technique for multiple layers
5. Learn double-bevel cutting for perfect joints
6. Practice shading with hot sand: adding depth and dimension
7. Design simple geometric pattern in Fusion 360
8. Cut and assemble marquetry panel
9. Apply marquetry to substrate with vacuum bag
10. Scrape, sand, and finish marquetry project`,
    objectives: [
      'Design marquetry patterns',
      'Cut veneer with precision knife work',
      'Use fretsaw for intricate patterns',
      'Create tight joints between veneer pieces',
      'Apply completed marquetry to substrate',
      'Finish marquetry without sanding through thin veneer',
    ],
    skills: ['Marquetry', 'Knife skills', 'Fretsaw work', 'Design', 'Finishing delicate surfaces'],
    expectedOutcome: 'Completed marquetry panel with tight joints, good contrast, and flawless finish.',
    passingCriteria: 'Joints are tight (no gaps), pattern is accurate, no sanding through veneer, finish is even',
    referencePhotos: ['/curriculum/woodworking/marquetry-cutting.jpg', '/curriculum/woodworking/marquetry-finished.jpg'],
    estimatedHours: 28,
    difficulty: 'advanced',
    category: 'advanced-techniques',
    subcategory: 'marquetry',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Marquetry: A Complete Guide" by Vince Ancona',
      '"The Art of Marquetry" by William Lincoln',
      'The Society of American Period Furniture Makers - marquetry resources',
    ],
  },

  {
    level: 4,
    moduleNumber: '4.1',
    assignmentNumber: 'WA-4.1.3',
    orderIndex: 41.5,
    title: 'Edge Banding & Solid Wood Edging Techniques',
    description: 'Master techniques for applying edge banding and solid wood edges to plywood and veneered panels.',
    instructions: `1. Study edge banding types: iron-on veneer, pre-glued, thick edge banding
2. Learn iron-on veneer application: temperature control, even pressure
3. Practice trimming flush: flush trim router bit, edge trimmer tool
4. Master solid wood edge application: matching grain, gluing thin strips
5. Learn mitered edge corners: precise 45° cuts, tight joints
6. Practice curved edge banding: kerfing, steam bending thin strips
7. Apply edge banding to plywood panel: flush, smooth results
8. Create solid wood lipping for veneered panels: seamless integration
9. Finish edges to match panel: sanding, staining, clear coat
10. Complete project with edge banding on all exposed plywood edges`,
    objectives: [
      'Apply iron-on edge banding smoothly',
      'Trim edge banding perfectly flush',
      'Glue solid wood edges to plywood',
      'Miter corners on edge banding',
      'Apply curved edge banding',
      'Finish edges to blend with panel surface',
    ],
    skills: ['Edge banding', 'Veneer application', 'Solid wood edging', 'Mitering', 'Curved edges', 'Finishing'],
    expectedOutcome: 'Panels with professional edge treatment, edges flush and finished to match surface.',
    passingCriteria: 'Edge banding is flush, no gaps or bubbles, miters are tight, finish matches panel surface',
    referencePhotos: ['/curriculum/woodworking/edge-banding.jpg', '/curriculum/woodworking/solid-edge.jpg'],
    estimatedHours: 18,
    difficulty: 'intermediate',
    category: 'advanced-techniques',
    subcategory: 'edge-treatment',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Edge banding application techniques',
      'Solid wood edging best practices',
      'Curved edge banding methods',
    ],
  },

  // Module 4.2: Curved Furniture Construction
  {
    level: 4,
    moduleNumber: '4.2',
    assignmentNumber: 'WA-4.2.1',
    orderIndex: 42,
    title: 'Bent Lamination - Chair Parts & Curved Components',
    description: 'Create strong curved components by laminating thin strips around a form.',
    instructions: `1. Study bent lamination theory: springback, form design, laminate thickness
2. Design curved form in Fusion 360: account for springback (add 10-15%)
3. Build lamination form: MDF, plywood, or solid wood with smooth curves
4. Prepare laminating strips: resaw to 1/8" or use commercial bending plywood
5. Practice glue application: even coating, quick assembly
6. Master clamping strategy: clamps every 3-4", cauls, even pressure
7. Calculate glue-up time: work in sections if needed
8. Bend and clamp lamination: work quickly before glue sets
9. Remove from form after 24 hours, clean up glue squeeze-out
10. Complete curved chair component or table apron with bent lamination`,
    objectives: [
      'Design forms that account for springback',
      'Prepare consistent laminating strips',
      'Execute fast, even glue application',
      'Clamp complex curves with even pressure',
      'Produce strong, stable curved components',
      'Clean up and finish bent laminations',
    ],
    skills: ['Bent lamination', 'Form building', 'Clamping strategies', 'Resaw technique', 'Springback calculation'],
    expectedOutcome: 'Strong curved component matching design intent, ready for furniture assembly.',
    passingCriteria: 'Curve is smooth and fair, lamination is strong (no delamination), final shape matches form accounting for springback',
    referencePhotos: ['/curriculum/woodworking/bent-lam-form.jpg', '/curriculum/woodworking/bent-lam-clamps.jpg'],
    estimatedHours: 32,
    difficulty: 'advanced',
    category: 'advanced-techniques',
    subcategory: 'bent-lamination',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Bending Wood" by Michael Podmaniczky',
      '"The Art of Bent Wood" by Don Faulkner',
      'Understanding springback in bent laminations',
    ],
    crossReferences: ['See WA-5 for steam bending alternative'],
  },

  {
    level: 4,
    moduleNumber: '4.2',
    assignmentNumber: 'WA-4.2.2',
    orderIndex: 43,
    title: 'Cooperage - Segmented Curved Construction',
    description: 'Build curved forms by joining angled segments (staves) like a barrel or curved door.',
    instructions: `1. Study cooperage principles: stave angle calculation, segment count
2. Calculate stave angles for desired radius using geometry or CAD
3. Set up table saw for precise bevel cuts: taper jig or sled
4. Mill staves with consistent dimensions and angles
5. Practice dry assembly: strap clamps, band clamps, or hose clamps
6. Learn glue-up strategy for cooperage: all at once or in stages
7. Execute glue-up: speed and even clamping pressure critical
8. Clean up interior and exterior surfaces after assembly
9. Complete curved door panel or decorative cylinder using cooperage
10. Sand, scrape, and finish cooperage project`,
    objectives: [
      'Calculate stave angles for any radius',
      'Cut precise bevels on table saw',
      'Assemble multi-piece curves with tight glue lines',
      'Use band clamps and straps effectively',
      'Clean up interior curved surfaces',
      'Create functional curved furniture components',
    ],
    skills: ['Cooperage', 'Angle calculation', 'Precision joinery', 'Complex glue-ups', 'Curved surface finishing'],
    expectedOutcome: 'Curved cooperage assembly with tight glue lines, fair curves, and smooth finish.',
    passingCriteria: 'All joints are tight, curve is fair and smooth, no steps between staves, final radius matches design',
    referencePhotos: ['/curriculum/woodworking/cooperage-assembly.jpg', '/curriculum/woodworking/curved-door.jpg'],
    estimatedHours: 30,
    difficulty: 'advanced',
    category: 'advanced-techniques',
    subcategory: 'cooperage',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Cooperage angle calculation formulas',
      '"Segmented Work" by Malcolm Tibbetts',
      'Curved door and panel construction techniques',
    ],
  },

  // Module 4.3: Production Techniques & Batch Work
  {
    level: 4,
    moduleNumber: '4.3',
    assignmentNumber: 'WA-4.3.1',
    orderIndex: 44,
    title: 'Production Jigs & Fixtures for Repeatable Results',
    description: 'Design and build custom jigs and fixtures to produce identical parts efficiently.',
    instructions: `1. Study production woodworking: batch processing, setup time vs run time
2. Learn jig design principles: repeatability, safety, efficiency
3. Design router template jig for identical curved parts
4. Build crosscut sled with stop block for repeatable lengths
5. Create drill press jig for consistent hole spacing
6. Design sanding jig for identical angles or profiles
7. Build toggle clamp fixture for fast part holding
8. Use jigs to produce 10 identical parts: compare for consistency
9. Document jig designs with drawings and photos
10. Calculate time savings vs hand-laying out each part`,
    objectives: [
      'Design jigs that improve repeatability and safety',
      'Build jigs from stable materials (MDF, plywood, UHMW)',
      'Use jigs to produce consistent parts',
      'Measure jig accuracy and part-to-part variation',
      'Calculate ROI on jig building time',
      'Maintain and store jigs for future use',
    ],
    skills: ['Jig design', 'Production techniques', 'Batch processing', 'Quality control', 'Efficiency optimization'],
    expectedOutcome: 'Library of custom jigs and fixtures, plus batch of 10 identical parts demonstrating repeatability.',
    passingCriteria: 'Parts produced with jig vary by less than 1/32" in critical dimensions, jigs are safe and durable',
    referencePhotos: ['/curriculum/woodworking/router-template.jpg', '/curriculum/woodworking/crosscut-sled.jpg'],
    estimatedHours: 26,
    difficulty: 'intermediate',
    category: 'production',
    subcategory: 'jigs-fixtures',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Jigs and Fixtures for the Table Saw and Router" by Fine Woodworking',
      'Production woodworking efficiency techniques',
      'ROI calculation for custom jigs',
    ],
  },

  {
    level: 4,
    moduleNumber: '4.3',
    assignmentNumber: 'WA-4.3.2',
    orderIndex: 45,
    title: 'CNC Router Production Workflow',
    description: 'Set up efficient CNC production workflow from CAD to finished parts.',
    instructions: `1. Design furniture component in Fusion 360: chair part, cabinet side, or template
2. Create CAM toolpaths: pocket, profile, drill, consider tabs and holding
3. Generate G-code and simulate: check for collisions, verify feeds and speeds
4. Set up CNC router: tool changes, work holding, origin setting
5. Run first part: monitor closely, adjust feeds/speeds if needed
6. Measure first part against design: verify critical dimensions
7. Execute production run: 10 identical parts with batch setup
8. Learn nesting strategy: minimize material waste
9. Post-process parts: remove tabs, sand edges, quality inspection
10. Calculate cycle time and material yield`,
    objectives: [
      'Create production-ready CAM toolpaths',
      'Set up CNC router for batch production',
      'Hold work securely for CNC operations',
      'Optimize nesting for material efficiency',
      'Produce consistent parts with CNC',
      'Calculate production costs and cycle times',
    ],
    skills: ['CNC production', 'CAM programming', 'Work holding', 'Nesting', 'Production planning', 'Quality control'],
    expectedOutcome: '10 identical CNC-machined parts with documented cycle time, material usage, and cost analysis.',
    passingCriteria: 'All parts within tolerance, cycle time optimized, material waste minimized, no scrapped parts',
    referencePhotos: ['/curriculum/woodworking/cnc-production.jpg', '/curriculum/woodworking/nested-parts.jpg'],
    estimatedHours: 35,
    difficulty: 'advanced',
    category: 'production',
    subcategory: 'cnc-production',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Fusion 360 CAM for production woodworking',
      'CNC work holding strategies',
      'Nesting software and techniques',
    ],
    crossReferences: ['Builds on WA-3 Fusion 360 skills', 'See WA-9 for advanced CNC'],
  },

  // Module 4.4: Advanced Finishing
  {
    level: 4,
    moduleNumber: '4.4',
    assignmentNumber: 'WA-4.4.1',
    orderIndex: 46,
    title: 'Spray Finishing with HVLP - Professional Results',
    description: 'Master HVLP spray technique for flawless furniture finishes.',
    instructions: `1. Study spray finishing theory: atomization, air pressure, fan pattern
2. Learn HVLP setup: 10 PSI at tip, fluid adjustment, air cap selection
3. Practice spray technique: distance, overlap, speed, wet coat application
4. Set up spray booth or area: ventilation, lighting, cleanliness
5. Prepare surface: sanding to 220 grit, raise grain, final sand
6. Apply spray sealer or washcoat: practice on scrap first
7. Sand sealer with 320 grit: level surface
8. Apply multiple coats: 2-3 coats with proper flash time between
9. Learn wet sanding and rubbing out: 600-2000 grit, polishing compounds
10. Complete furniture piece with sprayed lacquer or waterborne finish`,
    objectives: [
      'Set up and maintain HVLP spray equipment',
      'Apply even, consistent spray coats',
      'Achieve furniture-quality finish with no runs or sags',
      'Rub out finish to desired sheen',
      'Troubleshoot common spray finishing problems',
      'Clean and maintain spray equipment',
    ],
    skills: ['Spray finishing', 'HVLP technique', 'Surface preparation', 'Rubbing out', 'Finish troubleshooting'],
    expectedOutcome: 'Furniture piece with flawless sprayed finish, rubbed out to satin or gloss sheen.',
    passingCriteria: 'No runs, sags, orange peel, or dry spray; finish is smooth and even; final sheen is consistent',
    referencePhotos: ['/curriculum/woodworking/hvlp-spray.jpg', '/curriculum/woodworking/rubbing-out.jpg'],
    estimatedHours: 30,
    difficulty: 'advanced',
    category: 'finishing',
    subcategory: 'spray-finishing',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Understanding Wood Finishing" by Bob Flexner - spray chapter',
      'HVLP spray technique videos by Michael Dresdner',
      'Waterborne finishing systems guide',
    ],
  },

  {
    level: 4,
    moduleNumber: '4.4',
    assignmentNumber: 'WA-4.4.2',
    orderIndex: 47,
    title: 'French Polishing & Shellac Finishing',
    description: 'Learn the art of French polishing - building ultra-thin layers of shellac with a pad.',
    instructions: `1. Study French polish history and theory: pad technique, alcohol evaporation
2. Learn shellac grades: blonde, amber, garnet; pound cuts and mixing
3. Practice pad making: cotton wrapped in linen, proper size and shape
4. Master pad charging: amount of shellac, oil lubrication
5. Learn stroke patterns: spirals, figure-8, straight with grain
6. Apply bodying coats: build film thickness gradually (10-20 coats)
7. Learn spiriting off: removing oil, final polish with alcohol
8. Practice grain filling for open-pored woods
9. Troubleshoot common problems: streaks, pad sticking, uneven buildup
10. Complete small project with full French polish finish`,
    objectives: [
      'Mix shellac to proper pound cut',
      'Create and charge French polish pad',
      'Apply shellac in ultra-thin layers',
      'Build depth with multiple bodying coats',
      'Spirit off oil for final polish',
      'Achieve glass-smooth French polish finish',
    ],
    skills: ['French polishing', 'Shellac application', 'Pad technique', 'Traditional finishing', 'Surface evaluation'],
    expectedOutcome: 'Small furniture piece with traditional French polish finish showing depth and clarity.',
    passingCriteria: 'Finish is smooth and clear, no streaks or pad marks, wood grain visible with depth, professional gloss',
    referencePhotos: ['/curriculum/woodworking/french-polish-pad.jpg', '/curriculum/woodworking/french-polish-finish.jpg'],
    estimatedHours: 25,
    difficulty: 'expert',
    category: 'finishing',
    subcategory: 'french-polish',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"French Polishing" by Jeff Jewitt',
      '"The Art of French Polishing" Traditional Woodworker',
      'Shellac mixing and application guides',
    ],
  },

  // Module 4.5: Upholstery & Soft Goods
  {
    level: 4,
    moduleNumber: '4.5',
    assignmentNumber: 'WA-4.5.1',
    orderIndex: 48,
    title: 'Basic Upholstery - Slip Seats & Cushions',
    description: 'Learn fundamental upholstery skills for furniture making.',
    instructions: `1. Study upholstery basics: materials, tools, attachment methods
2. Learn foam selection: density, firmness, compression ratings
3. Practice fabric selection: durability, pattern matching, nap direction
4. Master slip seat upholstery: remove old cover, add padding, reupholster
5. Learn cushion construction: foam, batting, fabric cover with zipper
6. Practice stapling technique: even tension, fold corners properly
7. Create dust cover for furniture bottom: professional appearance
8. Learn button tufting basics: marking, buttoning, tying
9. Complete dining chair slip seat with fabric of choice
10. Build seat cushion with removable cover for bench or chair`,
    objectives: [
      'Select appropriate foam and fabric for application',
      'Upholster slip seat with tight, even fabric',
      'Fold corners professionally (hospital corners)',
      'Install dust cover on furniture bottom',
      'Sew basic cushion cover with zipper',
      'Understand upholstery terminology and techniques',
    ],
    skills: ['Upholstery', 'Fabric selection', 'Stapling', 'Corner folding', 'Cushion construction', 'Sewing basics'],
    expectedOutcome: 'Reupholstered slip seat and custom cushion with professional appearance.',
    passingCriteria: 'Fabric is tight and even, corners are neat, no wrinkles or puckers, cushion cover fits properly',
    referencePhotos: ['/curriculum/woodworking/slip-seat.jpg', '/curriculum/woodworking/cushion-construction.jpg'],
    estimatedHours: 20,
    difficulty: 'intermediate',
    category: 'upholstery',
    subcategory: 'basic-upholstery',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"The Complete Guide to Upholstery" by Cherry Dobson',
      'Foam density and selection guide',
      'Upholstery fabric durability ratings',
    ],
    crossReferences: ['See TAIL-4 for advanced sewing'],
  },

  {
    level: 4,
    moduleNumber: '4.5',
    assignmentNumber: 'WA-4.5.2',
    orderIndex: 48.5,
    title: 'Leather Working for Furniture - Handles & Accents',
    description: 'Add leather accents and components to furniture pieces.',
    instructions: `1. Study leather types: vegetable-tanned, chrome-tanned, thickness/weight
2. Learn leather tools: cutting knife, edge beveler, stitching awl, mallet
3. Practice cutting leather: templates, rotary cutter, straight edge
4. Learn edge finishing: burnishing, edge paint, wax
5. Master hand stitching: saddle stitch, spacing wheel, thread waxing
6. Create leather drawer pulls or cabinet handles
7. Design and fabricate leather sling seat for chair
8. Make leather desktop pad or placemat
9. Add rivets and hardware to leather: setting tool, backing plate
10. Finish leather with conditioner or wax`,
    objectives: [
      'Select appropriate leather for furniture applications',
      'Cut leather accurately with templates',
      'Finish leather edges professionally',
      'Execute saddle stitch hand sewing',
      'Install leather hardware (rivets, snaps)',
      'Create functional leather furniture components',
    ],
    skills: ['Leather working', 'Hand stitching', 'Edge finishing', 'Hardware installation', 'Pattern making'],
    expectedOutcome: 'Leather furniture accents (drawer pulls, seat, or pad) with professional finish and stitching.',
    passingCriteria: 'Leather is cut cleanly, edges are smooth and finished, stitching is even and tight, hardware is secure',
    referencePhotos: ['/curriculum/woodworking/leather-pulls.jpg', '/curriculum/woodworking/leather-sling-seat.jpg'],
    estimatedHours: 24,
    difficulty: 'intermediate',
    category: 'upholstery',
    subcategory: 'leather-working',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"The Leatherworking Handbook" by Valerie Michael',
      'Tandy Leather basics guides',
      'Leather furniture applications',
    ],
  },

  {
    level: 4,
    moduleNumber: '4.5',
    assignmentNumber: 'WA-4.5.3',
    orderIndex: 48.8,
    title: 'Woven Seats - Danish Cord, Rush, or Shaker Tape',
    description: 'Master traditional chair seat weaving techniques.',
    instructions: `1. Study woven seat types: Danish cord, paper rush, Shaker tape, cane
2. Learn Danish cord weaving: 3-ply cord, pattern sequence
3. Practice corner wrapping: build up corners for level seat
4. Master tension control: even, tight weaving throughout
5. Learn paper rush technique: continuous weaving, tucking ends
6. Practice Shaker tape weaving: checkerboard pattern, color combinations
7. Calculate material needed: measure chair opening, estimate yardage
8. Weave complete chair seat: maintain tension and pattern
9. Secure ends: hidden knots, tacking, or adhesive
10. Complete 2 chair seats using different weaving methods`,
    objectives: [
      'Calculate weaving material requirements',
      'Weave Danish cord chair seat with proper tension',
      'Execute paper rush weaving technique',
      'Create Shaker tape checkerboard pattern',
      'Maintain even tension throughout weaving',
      'Secure weaving ends invisibly',
    ],
    skills: ['Seat weaving', 'Danish cord', 'Paper rush', 'Shaker tape', 'Traditional techniques', 'Tension control'],
    expectedOutcome: 'Two chair seats woven with different materials, both showing even tension and professional finish.',
    passingCriteria: 'Weaving is tight and even, pattern is correct, corners are properly built up, seat is level and comfortable',
    referencePhotos: ['/curriculum/woodworking/danish-cord.jpg', '/curriculum/woodworking/shaker-tape.jpg'],
    estimatedHours: 26,
    difficulty: 'advanced',
    category: 'upholstery',
    subcategory: 'seat-weaving',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Caning & Seat Weaving Handbook" by Bruce Roberts',
      'Danish cord weaving instructions - Shaker Workshops',
      'Traditional chair seat weaving techniques',
    ],
  },

  // Module 4.6: Hardware Installation & Mechanical Components
  {
    level: 4,
    moduleNumber: '4.6',
    assignmentNumber: 'WA-4.6.1',
    orderIndex: 49,
    title: 'Cabinet Hardware Installation - Hinges, Slides, Pulls',
    description: 'Master installation of modern cabinet hardware for smooth operation and professional appearance.',
    instructions: `1. Study cabinet hardware types: European hinges, undermount slides, soft-close mechanisms
2. Learn European hinge installation: 35mm forstner bit, drilling jig, proper spacing
3. Practice hinge adjustment: in/out, up/down, left/right (3-way adjustment)
4. Master drawer slide installation: undermount vs side mount, clearances needed
5. Install soft-close dampers: door and drawer applications
6. Learn drawer pull/knob installation: template for consistent spacing, avoid splitting
7. Install lid stays, drop-front supports, and other specialty hardware
8. Adjust all hardware for smooth, silent operation
9. Create installation templates and jigs for production
10. Install full set of hardware on cabinet or furniture piece`,
    objectives: [
      'Install European cup hinges accurately',
      'Adjust hinges for perfect door alignment',
      'Install undermount drawer slides with proper clearance',
      'Add soft-close mechanisms to doors and drawers',
      'Install pulls and knobs at consistent spacing',
      'Troubleshoot and adjust hardware for smooth operation',
    ],
    skills: ['Hardware installation', 'Hinge adjustment', 'Drawer slides', 'Soft-close mechanisms', 'Precision drilling'],
    expectedOutcome: 'Cabinet with properly installed and adjusted hardware, all doors and drawers operating smoothly.',
    passingCriteria: 'All doors aligned with even gaps, drawers slide smoothly, soft-close works properly, pulls are straight and even',
    referencePhotos: ['/curriculum/woodworking/euro-hinge.jpg', '/curriculum/woodworking/undermount-slide.jpg'],
    estimatedHours: 22,
    difficulty: 'intermediate',
    category: 'hardware',
    subcategory: 'installation',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Blum European hinge installation guides',
      'Undermount drawer slide installation specs',
      'Cabinet hardware adjustment techniques',
    ],
  },

  {
    level: 4,
    moduleNumber: '4.6',
    assignmentNumber: 'WA-4.6.2',
    orderIndex: 50,
    title: 'Table Extension Mechanisms & Mechanical Furniture',
    description: 'Install and build mechanical furniture hardware including table slides, extension systems, and folding mechanisms.',
    instructions: `1. Study table extension systems: slides, equalizers, self-storing leaves
2. Learn table slide installation: proper alignment, smooth operation
3. Practice leaf alignment: pins, dowels, or commercial alignment systems
4. Install equalizer mechanism: simultaneous opening, load distribution
5. Build sliding dovetail extension system (traditional method)
6. Learn folding table hardware: drop leaves, gate legs, hinges
7. Install lift-up desk or Murphy bed hardware
8. Design and build simple mechanical furniture: folding stool or adjustable shelf
9. Adjust and tune all mechanisms for smooth operation
10. Document installation with measurements and photos`,
    objectives: [
      'Install table extension slides accurately',
      'Align table leaves for seamless appearance',
      'Build traditional sliding dovetail extensions',
      'Install and adjust complex furniture mechanisms',
      'Understand mechanical advantage in furniture',
      'Troubleshoot and repair furniture hardware',
    ],
    skills: ['Mechanical hardware', 'Table slides', 'Extension systems', 'Folding mechanisms', 'Traditional joinery', 'Adjustment'],
    expectedOutcome: 'Table with smoothly operating extension system, or functional mechanical furniture piece.',
    passingCriteria: 'Extension operates smoothly, leaves align flush, no sagging or binding, mechanism is durable',
    referencePhotos: ['/curriculum/woodworking/table-slide.jpg', '/curriculum/woodworking/leaf-alignment.jpg'],
    estimatedHours: 28,
    difficulty: 'advanced',
    category: 'hardware',
    subcategory: 'mechanical-furniture',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Table extension mechanism design and installation',
      '"The Furniture Maker\'s Handbook" - hardware chapter',
      'Rockler/Woodcraft table hardware catalogs',
    ],
  },

  // Module 4.7: Complex Case Construction
  {
    level: 4,
    moduleNumber: '4.7',
    assignmentNumber: 'WA-4.7.1',
    orderIndex: 51,
    title: 'Frame-and-Panel Door Construction',
    description: 'Build traditional frame-and-panel doors with mortise-and-tenon joinery and raised panels.',
    instructions: `1. Study frame-and-panel design: proportions, panel expansion, joinery methods
2. Calculate panel size: account for seasonal wood movement in groove
3. Mill frame stock: rails and stiles to consistent dimensions
4. Cut mortise-and-tenon joints: haunched tenons for groove
5. Rout or cut groove for panel: 1/4" or 3/8" deep
6. Raise panel on table saw or with router: proper slope and fit
7. Dry fit frame and panel: check for square, proper panel fit
8. Glue frame only (panel floats): assemble on flat surface
9. Clean up and sand door: flatten any warp immediately after glue-up
10. Build pair of cabinet doors with frame-and-panel construction`,
    objectives: [
      'Design frame-and-panel doors with proper proportions',
      'Calculate panel dimensions for wood movement',
      'Execute haunched mortise-and-tenon joints',
      'Raise panels with appropriate bevel',
      'Assemble doors square and flat',
      'Understand panel floating principles',
    ],
    skills: ['Frame-and-panel', 'Door construction', 'Raised panels', 'Haunched tenons', 'Assembly technique', 'Wood movement'],
    expectedOutcome: 'Pair of frame-and-panel cabinet doors, square and flat, with properly fitted floating panels.',
    passingCriteria: 'Doors are flat and square, panels fit with proper expansion gap, joints are tight, no panel rattling',
    referencePhotos: ['/curriculum/woodworking/raised-panel.jpg', '/curriculum/woodworking/frame-panel-door.jpg'],
    estimatedHours: 32,
    difficulty: 'advanced',
    category: 'case-construction',
    subcategory: 'doors',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Framed Cabinet Construction" by Fine Woodworking',
      'Panel calculation formulas for wood movement',
      'Traditional door construction techniques',
    ],
    crossReferences: ['Builds on WA-2 mortise-and-tenon skills'],
  },

  {
    level: 4,
    moduleNumber: '4.7',
    assignmentNumber: 'WA-4.7.2',
    orderIndex: 52,
    title: 'Face Frame Cabinet Construction',
    description: 'Build traditional face frame cabinets with proper joinery, squaring, and installation of backs and shelves.',
    instructions: `1. Study face frame cabinet design: frame members, panel insets, door overlays
2. Design cabinet in Fusion 360: overall dimensions, shelf spacing, door sizes
3. Build cabinet case: dadoes for shelves, rabbets for back panel
4. Build face frame: pocket screws, dowels, or mortise-and-tenon joints
5. Attach face frame to case: glue and brads, clamps for alignment
6. Install adjustable shelf pins: drill jig for perfect alignment
7. Fit inset doors or build for overlay doors: proper gaps and reveals
8. Install back panel: plywood in rabbet or shiplap boards
9. Add face frame moldings: applied details, crown, or base
10. Complete face frame cabinet ready for finishing and hardware`,
    objectives: [
      'Design and build face frame cabinet case',
      'Join face frame members with chosen method',
      'Attach face frame flush and square to case',
      'Install adjustable shelf system',
      'Fit doors with proper reveals',
      'Add traditional molding details',
    ],
    skills: ['Face frame construction', 'Cabinet design', 'Case joinery', 'Door fitting', 'Molding application', 'Shelf systems'],
    expectedOutcome: 'Complete face frame cabinet, square and sturdy, ready for doors, drawers, and finishing.',
    passingCriteria: 'Cabinet is square, face frame is flush with case, shelves are adjustable and level, doors fit with even gaps',
    referencePhotos: ['/curriculum/woodworking/face-frame.jpg', '/curriculum/woodworking/face-frame-cabinet.jpg'],
    estimatedHours: 38,
    difficulty: 'advanced',
    category: 'case-construction',
    subcategory: 'cabinets',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Building Traditional Kitchen Cabinets" by Jim Tolpin',
      'Face frame joinery comparison',
      'Cabinet design proportions and standards',
    ],
  },

  {
    level: 4,
    moduleNumber: '4.7',
    assignmentNumber: 'WA-4.7.3',
    orderIndex: 53,
    title: 'Drawer Construction - Multiple Methods',
    description: 'Master multiple drawer construction techniques from simple to complex.',
    instructions: `1. Study drawer design: proportions, clearances, joinery options
2. Build drawer with rabbet joints: simple, strong construction
3. Build drawer with half-blind dovetails: front joinery
4. Build drawer with through dovetails: decorative joinery
5. Build drawer with locking rabbet joints: quick production method
6. Install drawer bottom: solid wood (grain perpendicular) or plywood
7. Fit drawer to opening: proper clearances all around
8. Add drawer stops: various methods
9. Apply wax or paste to runners for smooth sliding
10. Build set of 3 drawers using different joinery methods`,
    objectives: [
      'Select appropriate drawer joinery for application',
      'Build drawers with various joint types',
      'Fit drawers with proper clearances',
      'Install drawer bottoms correctly',
      'Add functional drawer stops',
      'Compare strength and aesthetics of different methods',
    ],
    skills: ['Drawer construction', 'Multiple joinery methods', 'Drawer fitting', 'Dovetails', 'Production techniques'],
    expectedOutcome: 'Three drawers demonstrating different construction methods, all fitting and sliding smoothly.',
    passingCriteria: 'All drawers fit with consistent clearances, joints are tight, drawers slide smoothly, bottoms are secure',
    referencePhotos: ['/curriculum/woodworking/drawer-joinery.jpg', '/curriculum/woodworking/fitted-drawer.jpg'],
    estimatedHours: 35,
    difficulty: 'advanced',
    category: 'case-construction',
    subcategory: 'drawers',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"The Complete Illustrated Guide to Furniture and Cabinet Construction" - drawer chapter',
      'Drawer fitting and clearances guide',
      'Comparing drawer joinery methods',
    ],
    crossReferences: ['Builds on WA-2 dovetail skills'],
  },

  // Module 4.8: Level 4 Final Project
  {
    level: 4,
    moduleNumber: '4.8',
    assignmentNumber: 'WA-4.8.1',
    orderIndex: 54,
    title: 'Level 4 Capstone: Sideboard or Credenza with Advanced Techniques',
    description: 'Integrate all Level 4 skills in a complete furniture piece: sideboard or credenza with doors, drawers, veneered panels, and sprayed finish.',
    instructions: `1. Design sideboard in Fusion 360: proportions, door/drawer layout, leg style
2. Create cut list and materials plan: solid wood, plywood, veneer
3. Mill all solid wood components: legs, rails, stiles, face frame
4. Build carcase with dados and rabbets: sturdy case construction
5. Veneer top panel with bookmatched figure: vacuum bag application
6. Build frame-and-panel doors or veneered slab doors
7. Construct drawers with half-blind dovetails
8. Install all hardware: European hinges, undermount slides, pulls
9. Apply sprayed finish: multiple coats, rub out to desired sheen
10. Final assembly and adjustment: perfect door alignment, smooth operation`,
    objectives: [
      'Design complete furniture piece integrating Level 4 skills',
      'Execute advanced joinery throughout project',
      'Apply veneering skills to create focal point',
      'Install hardware for smooth operation',
      'Achieve professional spray finish',
      'Deliver furniture-quality finished piece',
    ],
    skills: ['Complete furniture construction', 'Project planning', 'Advanced joinery', 'Veneering', 'Hardware', 'Spray finishing'],
    expectedOutcome: 'Complete sideboard or credenza demonstrating mastery of Level 4 techniques, ready for use.',
    passingCriteria: 'Furniture is square and sturdy, all joints tight, veneer flawless, hardware operates smoothly, finish is professional quality',
    referencePhotos: ['/curriculum/woodworking/sideboard-design.jpg', '/curriculum/woodworking/sideboard-construction.jpg', '/curriculum/woodworking/finished-sideboard.jpg'],
    estimatedHours: 80,
    difficulty: 'advanced',
    category: 'projects',
    subcategory: 'level-4',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Review ALL Level 4 reading materials before starting',
      '"Fine Furniture for the Amateur Cabinetmaker" by A.W. Marlow',
      'Sideboard design and construction articles',
    ],
    crossReferences: ['Integrates all WA-4 skills'],
  },

  // ============================================================================
  // LEVEL 5: WOOD BENDING & COMPOSITE MATERIALS (Months 13-15)
  // ============================================================================

  // Module 5.1: Steam Bending
  {
    level: 5,
    moduleNumber: '5.1',
    assignmentNumber: 'WA-5.1.1',
    orderIndex: 55,
    title: 'Steam Bending Fundamentals - Equipment & Theory',
    description: 'Build steam bending equipment and learn the theory of plasticizing wood with steam.',
    instructions: `1. Study steam bending theory: lignin plasticization, moisture content, species selection
2. Design and build steam box: PVC pipe or plywood box, steam generator
3. Learn wood species selection: white oak, ash, hickory (good); maple (moderate); walnut (poor)
4. Calculate steaming time: 1 hour per inch of thickness as baseline
5. Study bending form design: accounting for springback (10-20%)
6. Learn compression strap technique: prevents wood from breaking on outside of bend
7. Practice safe steam handling: hot steam burns, pressure release
8. Steam and bend test pieces: various species, thickness, bend radii
9. Document springback for different species and radii
10. Build functional steaming setup ready for production bending`,
    objectives: [
      'Build functional steam bending equipment',
      'Understand wood plasticization theory',
      'Select appropriate species for bending',
      'Calculate steaming times accurately',
      'Use compression strap to prevent failure',
      'Measure and predict springback',
    ],
    skills: ['Steam bending', 'Equipment building', 'Wood science', 'Compression strap', 'Springback calculation'],
    expectedOutcome: 'Working steam bending setup and documented test results for multiple species.',
    passingCriteria: 'Steam box produces adequate steam, test bends complete without breaking, springback measured and documented',
    referencePhotos: ['/curriculum/woodworking/steam-box.jpg', '/curriculum/woodworking/compression-strap.jpg'],
    estimatedHours: 32,
    difficulty: 'advanced',
    category: 'bending',
    subcategory: 'steam-bending',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Bending Wood" by Michael Podmaniczky - steam bending chapter',
      'USDA Forest Products Laboratory - wood bending research',
      '"The Bent Wood Handbook" by Lon Schleining',
    ],
    crossReferences: ['See WA-4.2.1 for bent lamination alternative'],
  },

  {
    level: 5,
    moduleNumber: '5.1',
    assignmentNumber: 'WA-5.1.2',
    orderIndex: 56,
    title: 'Steam Bent Chair Parts - Back Slats & Legs',
    description: 'Apply steam bending to create graceful chair components.',
    instructions: `1. Design chair with steam bent components in Fusion 360
2. Mill bending stock: straight grain, no defects, proper dimensions
3. Build bending forms: curved chair back, curved legs
4. Steam parts for calculated time based on thickness
5. Quickly transfer to form and clamp with compression strap
6. Hold on form until fully dry (48-72 hours minimum)
7. Remove from form and measure actual vs intended curve
8. Trim ends and clean up steam bent parts
9. Test fit in chair design: adjust joinery as needed
10. Complete set of steam bent chair components ready for assembly`,
    objectives: [
      'Design furniture incorporating steam bent parts',
      'Mill appropriate stock for steam bending',
      'Execute successful steam bend without failures',
      'Dry bent parts completely on form',
      'Integrate bent parts into furniture design',
      'Achieve graceful curves in functional furniture',
    ],
    skills: ['Steam bending', 'Form work', 'Furniture design', 'Joinery adaptation', 'Curve design'],
    expectedOutcome: 'Set of steam bent chair parts demonstrating successful bending technique.',
    passingCriteria: 'Parts bend to form without breaking, curves are smooth and fair, parts fit chair design properly',
    referencePhotos: ['/curriculum/woodworking/steam-bent-back.jpg', '/curriculum/woodworking/bent-chair-parts.jpg'],
    estimatedHours: 36,
    difficulty: 'expert',
    category: 'bending',
    subcategory: 'steam-bending',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Windsor chair steam bending techniques',
      'Shaker ladder-back chair construction',
    ],
  },

  // Module 5.2: Advanced Bent Lamination
  {
    level: 5,
    moduleNumber: '5.2',
    assignmentNumber: 'WA-5.2.1',
    orderIndex: 57,
    title: 'Compound Curve Lamination - 3D Forms',
    description: 'Create complex compound curved forms using advanced bent lamination techniques.',
    instructions: `1. Study compound curves: curves in multiple planes simultaneously
2. Design 3D form in Fusion 360: chair seat, sculptural element, or bowl
3. Build male and female forms: matching curves, CNC or hand-shaped
4. Calculate lamination strip thickness for compound bends (thinner than simple curves)
5. Prepare flexible laminating material: thin wood strips or bendable plywood
6. Practice glue application for complex forms: work quickly, even coverage
7. Clamp with vacuum bag, cauls, or creative clamping solutions
8. Allow extended cure time for thick laminations (24-48 hours)
9. Remove and clean up compound curved lamination
10. Complete compound curved project: chair seat or sculptural piece`,
    objectives: [
      'Design and build forms for compound curves',
      'Calculate appropriate strip thickness',
      'Execute complex lamination glue-up',
      'Develop creative clamping strategies',
      'Produce strong 3D curved components',
      'Finish compound curved surfaces',
    ],
    skills: ['Compound curves', '3D lamination', 'Form building', 'Advanced clamping', 'Sculptural forms'],
    expectedOutcome: 'Compound curved lamination demonstrating complex 3D form.',
    passingCriteria: 'Lamination follows form accurately, no delamination, curves are smooth, final shape is structurally sound',
    referencePhotos: ['/curriculum/woodworking/compound-curve-form.jpg', '/curriculum/woodworking/3d-lamination.jpg'],
    estimatedHours: 40,
    difficulty: 'expert',
    category: 'bending',
    subcategory: 'advanced-lamination',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Compound curve lamination techniques',
      'Charles and Ray Eames molded plywood work',
      '"Laminating and Bending Wood" by Patrick Spielman',
    ],
    crossReferences: ['Builds on WA-4.2.1 bent lamination'],
  },

  {
    level: 5,
    moduleNumber: '5.2',
    assignmentNumber: 'WA-5.2.2',
    orderIndex: 57.5,
    title: 'Kerf Bending - Curves Without Steam or Lamination',
    description: 'Use kerf bending to create curves in solid wood by making relief cuts.',
    instructions: `1. Study kerf bending theory: removing material on inside of curve allows bending
2. Calculate kerf spacing: depth, spacing, radius relationship
3. Set up table saw for kerfing: blade height leaves 1/8" backing minimum
4. Practice on scrap: different spacings for different radii
5. Learn kerf fill methods: glue + sawdust, wood strips, epoxy
6. Execute kerf bending: careful clamping to form, avoid splitting backing
7. Fill kerfs for strength and appearance
8. Sand and finish curved kerf-bent part
9. Complete project using kerf bending: curved trim or shelf edge
10. Understand when kerf bending is appropriate vs other methods`,
    objectives: [
      'Calculate kerf spacing for desired radius',
      'Execute safe and accurate kerfing',
      'Bend kerfed wood without breaking backing',
      'Fill kerfs for strength',
      'Finish kerfed curves smoothly',
      'Apply kerf bending appropriately',
    ],
    skills: ['Kerf bending', 'Curve calculation', 'Saw technique', 'Filling methods'],
    expectedOutcome: 'Curved part via kerf bending with filled, finished kerfs.',
    passingCriteria: 'Kerfs evenly spaced, curve smooth, backing intact, kerfs filled flush',
    referencePhotos: ['/curriculum/woodworking/kerfing.jpg', '/curriculum/woodworking/kerf-filled.jpg'],
    estimatedHours: 22,
    difficulty: 'intermediate',
    category: 'bending',
    subcategory: 'kerf-bending',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Kerf bending calculations',
      'Kerf spacing calculators',
      'Filling and reinforcing kerfs',
    ],
  },

  {
    level: 5,
    moduleNumber: '5.2',
    assignmentNumber: 'WA-5.2.3',
    orderIndex: 57.8,
    title: 'Moldless Lamination - Freeform Sculpting',
    description: 'Create organic forms without molds using thin flexible laminations.',
    instructions: `1. Study moldless lamination: flex to shape, holds after cure
2. Select ultra-thin materials: 1/16" strips or veneer
3. Practice epoxy application: slow-cure for working time
4. Learn freehand bending: gradual curves, smooth transitions
5. Use temporary forms: PVC pipe, buckets, cardboard
6. Create sculptural basket or bowl: weave in 3D
7. Hold shape with clamps/tape until cure
8. Build thickness with layers if needed
9. Trim and sand after cure
10. Complete freeform sculptural piece`,
    objectives: [
      'Work with ultra-thin flexible wood',
      'Apply epoxy for freehand lamination',
      'Shape wood sculpturally',
      'Hold complex shapes during cure',
      'Create organic artistic forms',
      'Finish sculptural pieces',
    ],
    skills: ['Moldless lamination', 'Sculptural forming', 'Freehand bending', 'Artistic woodworking'],
    expectedOutcome: 'Organic sculptural form via moldless lamination.',
    passingCriteria: 'Structurally sound, smooth curves, clean finish, artistic merit',
    referencePhotos: ['/curriculum/woodworking/moldless.jpg', '/curriculum/woodworking/sculptural.jpg'],
    estimatedHours: 30,
    difficulty: 'advanced',
    category: 'bending',
    subcategory: 'freeform',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Sculptural wood bending',
      'Martin Puryear, David Nash works',
      'Thin wood lamination',
    ],
  },

  // Module 5.3: Epoxy & Resin Systems
  {
    level: 5,
    moduleNumber: '5.3',
    assignmentNumber: 'WA-5.3.1',
    orderIndex: 58,
    title: 'Epoxy Resin Fundamentals - Safety & Application',
    description: 'Learn to work safely with epoxy resin systems for woodworking and composites.',
    instructions: `1. Study epoxy chemistry: two-part systems, cure time, exotherm
2. Learn safety protocols: ventilation, gloves, skin protection, sensitization risks
3. Practice accurate mixing: by weight (digital scale), proper ratios
4. Study working time vs pot life: temperature effects, batch size
5. Learn surface preparation: sanding, cleaning, acetone wipe
6. Practice various application methods: brush, squeegee, pour
7. Create epoxy/wood test samples: gap filling, laminating, coating
8. Study troubleshooting: amine blush, incomplete cure, bubbles
9. Learn finishing epoxy: sanding techniques, polishing, topcoats
10. Complete project using epoxy: river table section or filled voids`,
    objectives: [
      'Handle epoxy safely with proper PPE',
      'Mix epoxy accurately by weight',
      'Understand working time and cure characteristics',
      'Apply epoxy with various techniques',
      'Prepare surfaces properly for epoxy',
      'Finish cured epoxy to desired sheen',
    ],
    skills: ['Epoxy resin', 'Safety protocols', 'Accurate mixing', 'Surface preparation', 'Finishing techniques'],
    expectedOutcome: 'Completed epoxy/wood project demonstrating proper resin technique.',
    passingCriteria: 'Epoxy is fully cured, no bubbles or defects, interface with wood is clean, finish is smooth',
    referencePhotos: ['/curriculum/woodworking/epoxy-mixing.jpg', '/curriculum/woodworking/epoxy-application.jpg'],
    estimatedHours: 28,
    difficulty: 'intermediate',
    category: 'composites',
    subcategory: 'epoxy-resin',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'West System Epoxy User Manual',
      'Epoxy safety data sheets (SDS)',
      '"The Epoxy Book" by System Three',
    ],
  },

  {
    level: 5,
    moduleNumber: '5.3',
    assignmentNumber: 'WA-5.3.2',
    orderIndex: 59,
    title: 'River Tables & Epoxy Inlay Work',
    description: 'Create decorative epoxy river tables and inlay projects.',
    instructions: `1. Select live edge wood slabs: check for stability, flatten faces
2. Design river table layout: gap width, depth, color scheme
3. Build mold/dam system: melamine, caulk for seal, mold release
4. Calculate epoxy volume needed: measure carefully, add 10% extra
5. Learn pigment and dye use: transparent vs opaque, color mixing
6. Practice pour technique: thin layers to avoid excessive heat
7. Allow cure between layers if needed: thick pours generate heat
8. Level and flatten epoxy surface after cure: router sled or planer
9. Sand through grits: 80, 120, 180, 220, 320, 400, 600
10. Finish to high gloss: wet sanding, polishing compounds, buffing`,
    objectives: [
      'Design and execute river table project',
      'Build effective mold and dam system',
      'Calculate and mix large epoxy volumes',
      'Pour epoxy in layers without defects',
      'Flatten and level cured epoxy',
      'Achieve high-gloss polished finish',
    ],
    skills: ['River tables', 'Mold building', 'Large pours', 'Pigment mixing', 'Polishing', 'Live edge work'],
    expectedOutcome: 'Completed river table section or epoxy inlay project with professional finish.',
    passingCriteria: 'Epoxy is crystal clear, no bubbles or voids, edges are clean, finish is high-gloss, wood/epoxy interface is clean',
    referencePhotos: ['/curriculum/woodworking/river-table-mold.jpg', '/curriculum/woodworking/epoxy-polish.jpg'],
    estimatedHours: 42,
    difficulty: 'advanced',
    category: 'composites',
    subcategory: 'epoxy-inlay',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'River table techniques and tips',
      'Large epoxy pour best practices',
      'Polishing epoxy to high gloss',
    ],
  },

  // Module 5.4: Fiber Reinforced Composites
  {
    level: 5,
    moduleNumber: '5.4',
    assignmentNumber: 'WA-5.4.1',
    orderIndex: 60,
    title: 'Fiberglass Composites - Wet Layup Technique',
    description: 'Learn fiberglass wet layup for creating strong, lightweight composite parts.',
    instructions: `1. Study composite materials: fiber types (glass, carbon, kevlar), matrix (epoxy, polyester)
2. Learn fiberglass fabric types: plain weave, twill, unidirectional, chopped strand
3. Practice mold preparation: wax, PVA release, gelcoat application
4. Master wet layup technique: resin saturation, avoiding dry spots
5. Learn to remove air bubbles: squeegee, roller, vacuum bagging
6. Study fiber orientation: strength direction, layup schedule
7. Create simple fiberglass part: flat panel or shallow mold
8. Allow proper cure: room temp or heat acceleration
9. Demold and trim part: Dremel, sanding, clean edges
10. Test part strength: compare to solid wood weight-to-strength ratio`,
    objectives: [
      'Prepare molds with proper release',
      'Execute wet layup with full saturation',
      'Remove air and ensure fiber wet-out',
      'Understand fiber orientation and strength',
      'Demold and trim composite parts',
      'Evaluate weight-to-strength benefits',
    ],
    skills: ['Fiberglass', 'Wet layup', 'Mold preparation', 'Composite materials', 'Vacuum bagging basics'],
    expectedOutcome: 'Completed fiberglass part demonstrating proper wet layup technique.',
    passingCriteria: 'Part is fully saturated, no dry spots or voids, demolded cleanly, edges trimmed neatly',
    referencePhotos: ['/curriculum/composites/fiberglass-layup.jpg', '/curriculum/composites/wet-out.jpg'],
    estimatedHours: 30,
    difficulty: 'advanced',
    category: 'composites',
    subcategory: 'fiberglass',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Fiberglass and Composite Materials" by Forbes Aird',
      'Composite layup techniques',
      'Release agent selection guide',
    ],
    crossReferences: ['Foundation for carbon fiber work later'],
  },

  {
    level: 5,
    moduleNumber: '5.4',
    assignmentNumber: 'WA-5.4.2',
    orderIndex: 61,
    title: 'Carbon Fiber Composites - Introduction',
    description: 'Learn to work with carbon fiber for high-performance lightweight structures.',
    instructions: `1. Study carbon fiber properties: strength-to-weight, cost, appearance
2. Learn carbon fiber fabric types: twill weave, plain weave, uni-directional
3. Practice cutting carbon fiber: sharp scissors, minimize fraying
4. Master epoxy selection for carbon: proper viscosity, cure characteristics
5. Execute carbon fiber wet layup on simple mold
6. Learn vacuum bagging for carbon fiber: improved fiber-to-resin ratio
7. Study post-cure for maximum strength: temperature, time
8. Sand and finish carbon fiber: minimize dust, proper PPE
9. Create carbon fiber panel or small part
10. Test and compare to fiberglass: weight, strength, stiffness`,
    objectives: [
      'Handle carbon fiber safely (respirator for dust)',
      'Cut and orient carbon fiber properly',
      'Achieve good fiber wet-out with epoxy',
      'Use vacuum bagging for better results',
      'Post-cure for maximum properties',
      'Finish carbon fiber surfaces properly',
    ],
    skills: ['Carbon fiber', 'Advanced composites', 'Vacuum bagging', 'Post-cure', 'High-performance materials'],
    expectedOutcome: 'Completed carbon fiber part with professional finish.',
    passingCriteria: 'Part shows consistent weave pattern, full saturation, no voids, finished surface is smooth',
    referencePhotos: ['/curriculum/composites/carbon-fiber-layup.jpg', '/curriculum/composites/carbon-part.jpg'],
    estimatedHours: 35,
    difficulty: 'expert',
    category: 'composites',
    subcategory: 'carbon-fiber',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Carbon fiber safety and handling',
      'Vacuum bagging for composites',
      'Carbon fiber finishing techniques',
    ],
    crossReferences: ['Critical skill for aerospace applications in Level 11-12'],
  },

  // Module 5.5: Engineered Wood Products
  {
    level: 5,
    moduleNumber: '5.5',
    assignmentNumber: 'WA-5.5.1',
    orderIndex: 62,
    title: 'Plywood Engineering - Selection & Applications',
    description: 'Master the selection and use of plywood and engineered wood products.',
    instructions: `1. Study plywood construction: veneer orientation, core types (veneer, MDF, lumber)
2. Learn plywood grading: A, B, C, D faces; interior vs exterior
3. Study specialty plywoods: Baltic birch, ApplePly, marine grade, bendy ply
4. Learn MDF vs particleboard: density, strength, applications
5. Study dimensional stability: movement compared to solid wood
6. Practice edge treatment: veneer, solid wood, paint
7. Learn cutting techniques: minimize tearout, proper blade selection
8. Study fastening methods: screws, biscuits, dominos for plywood
9. Design project using engineered wood: case goods, jig, or fixture
10. Complete project demonstrating appropriate plywood selection`,
    objectives: [
      'Select appropriate plywood grade for application',
      'Understand plywood construction and properties',
      'Treat plywood edges professionally',
      'Cut plywood with minimal tearout',
      'Join plywood with appropriate methods',
      'Design projects leveraging plywood strengths',
    ],
    skills: ['Plywood selection', 'Engineered wood', 'Edge treatment', 'Material properties', 'Design for materials'],
    expectedOutcome: 'Completed project using plywood appropriately for its properties.',
    passingCriteria: 'Appropriate grade selected, edges finished properly, joinery is strong, project is square and sturdy',
    referencePhotos: ['/curriculum/woodworking/plywood-types.jpg', '/curriculum/woodworking/plywood-edges.jpg'],
    estimatedHours: 24,
    difficulty: 'intermediate',
    category: 'materials',
    subcategory: 'engineered-wood',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'APA plywood design specifications',
      'Engineered wood products comparison',
      'Working with sheet goods',
    ],
  },

  {
    level: 5,
    moduleNumber: '5.5',
    assignmentNumber: 'WA-5.5.2',
    orderIndex: 63,
    title: 'Torsion Box Construction - Lightweight Panels',
    description: 'Build ultra-stable, lightweight torsion box panels for workbenches and assembly tables.',
    instructions: `1. Study torsion box theory: skin and core create rigid structure
2. Design torsion box: overall dimensions, grid spacing, skin thickness
3. Calculate material needs: plywood skins, core strips (MDF or plywood)
4. Mill core strips to consistent width and thickness
5. Create grid layout: dado or pocket hole joinery for core
6. Assemble core structure: square and flat
7. Apply first skin: glue and clamps or vacuum bag
8. Flip and apply second skin after first cures
9. Trim edges flush and apply edge banding
10. Test flatness with straightedge: should be incredibly flat and stable`,
    objectives: [
      'Understand torsion box structural principles',
      'Design efficient torsion box structure',
      'Build flat, square core grid',
      'Apply skins with even pressure',
      'Achieve ultra-flat finished panel',
      'Verify structural rigidity',
    ],
    skills: ['Torsion box', 'Structural design', 'Grid construction', 'Panel lamination', 'Precision assembly'],
    expectedOutcome: 'Completed torsion box panel that is flat, lightweight, and extremely rigid.',
    passingCriteria: 'Panel is flat within 0.005" per foot, core grid is square, skins are fully bonded, edges are clean',
    referencePhotos: ['/curriculum/woodworking/torsion-box-grid.jpg', '/curriculum/woodworking/torsion-box-assembly.jpg'],
    estimatedHours: 32,
    difficulty: 'advanced',
    category: 'materials',
    subcategory: 'engineered-structures',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Torsion box design and construction',
      '"The Workbench Book" by Scott Landis - torsion box chapter',
      'Structural sandwich panel theory',
    ],
  },

  // Module 5.6: Advanced Form Making
  {
    level: 5,
    moduleNumber: '5.6',
    assignmentNumber: 'WA-5.6.1',
    orderIndex: 64,
    title: 'CNC-Machined Molds & Forms for Lamination',
    description: 'Design and CNC machine precision molds for bent lamination and composites.',
    instructions: `1. Design curved form in Fusion 360: single curve or compound curve
2. Account for springback in form design: add extra curve (10-20%)
3. Create CAM toolpath: surfacing operation, ball-nose endmill
4. Select mold material: MDF (easy to machine), plywood (stronger)
5. Set up CNC router: proper work holding, zeroing
6. Machine form: rough pass, finish pass, smooth surface
7. Sand and seal mold surface: smooth finish critical for glue cleanup
8. Apply mold release or build sacrificial surface
9. Test form with bent lamination or composite layup
10. Document form performance: actual springback, ease of use`,
    objectives: [
      'Design precision molds in CAD',
      'Generate 3D surfacing toolpaths',
      'Machine smooth mold surfaces with CNC',
      'Prepare molds for use (sealing, release)',
      'Validate mold accuracy with test parts',
      'Refine form design based on results',
    ],
    skills: ['CNC mold making', '3D CAM', 'Form design', 'Surface finishing', 'Mold preparation'],
    expectedOutcome: 'CNC-machined mold producing accurate bent laminations or composite parts.',
    passingCriteria: 'Mold surface is smooth, parts release cleanly, final part shape matches design intent accounting for springback',
    referencePhotos: ['/curriculum/woodworking/cnc-mold-cam.jpg', '/curriculum/woodworking/machined-form.jpg'],
    estimatedHours: 36,
    difficulty: 'advanced',
    category: 'form-making',
    subcategory: 'cnc-molds',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Fusion 360 3D surfacing CAM',
      'Mold making for lamination',
      'CNC form and mold techniques',
    ],
    crossReferences: ['Builds on WA-4.3.2 CNC skills', 'See WA-9 for advanced CNC'],
  },

  {
    level: 5,
    moduleNumber: '5.6',
    assignmentNumber: 'WA-5.6.2',
    orderIndex: 65,
    title: 'Multi-Part Molds for Complex Geometry',
    description: 'Design and build multi-part molds for creating complex composite or laminated structures.',
    instructions: `1. Study multi-part mold design: parting lines, draft angles, registration
2. Design complex part in Fusion 360: undercuts, compound curves
3. Design mold in multiple sections: male, female, or split molds
4. Create registration system: dowel pins, keys, or machined features
5. Machine or build each mold section: CNC, hand-shaping, or combination
6. Test mold fit and alignment: sections should mate precisely
7. Apply release to molds: wax, PVA, or Partall
8. Execute layup or lamination in mold: work systematically
9. Clamp or bag mold sections together: even pressure throughout
10. Demold and evaluate: refine mold if needed`,
    objectives: [
      'Design effective multi-part molds',
      'Create accurate parting lines and registration',
      'Build or machine mold sections precisely',
      'Achieve tight fit between mold sections',
      'Execute complex layups in assembled molds',
      'Demold parts without damage',
    ],
    skills: ['Multi-part molds', 'Complex geometry', 'Registration systems', 'Mold design', 'Advanced molding'],
    expectedOutcome: 'Multi-part mold system producing complex parts with accurate geometry.',
    passingCriteria: 'Mold sections align precisely, parts demold cleanly, geometry matches design, no flash or defects at parting line',
    referencePhotos: ['/curriculum/composites/split-mold.jpg', '/curriculum/composites/mold-registration.jpg'],
    estimatedHours: 44,
    difficulty: 'expert',
    category: 'form-making',
    subcategory: 'complex-molds',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Multi-part mold design principles',
      'Composite mold making techniques',
      'Registration and alignment systems',
    ],
  },

  // Module 5.7: Hybrid Wood/Composite Structures
  {
    level: 5,
    moduleNumber: '5.7',
    assignmentNumber: 'WA-5.7.1',
    orderIndex: 66,
    title: 'Wood-Composite Hybrid Structures',
    description: 'Combine wood and composites to leverage strengths of both materials.',
    instructions: `1. Study hybrid structure principles: wood for compression, composites for tension
2. Design hybrid beam or panel: wood core, composite skins or reinforcement
3. Learn surface preparation: sanding, cleaning for good adhesion
4. Practice bonding composites to wood: epoxy, proper surface prep
5. Create test specimens: wood beams with carbon fiber reinforcement
6. Load test hybrid structures: compare to unreinforced wood
7. Design furniture part using hybrid construction: chair leg, table support
8. Execute layup: wood substrate, composite reinforcement, proper cure
9. Finish hybrid part: blend wood and composite aesthetics
10. Document strength and weight improvements`,
    objectives: [
      'Design effective hybrid wood/composite structures',
      'Prepare wood surfaces for composite bonding',
      'Apply composites to wood substrate',
      'Test and validate strength improvements',
      'Create functional hybrid furniture components',
      'Finish hybrid structures aesthetically',
    ],
    skills: ['Hybrid structures', 'Composite integration', 'Structural design', 'Material bonding', 'Load testing'],
    expectedOutcome: 'Hybrid wood/composite structure demonstrating improved strength-to-weight ratio.',
    passingCriteria: 'Composite bonds well to wood, structure shows improved strength in testing, finish integrates both materials',
    referencePhotos: ['/curriculum/composites/hybrid-beam.jpg', '/curriculum/composites/wood-carbon-hybrid.jpg'],
    estimatedHours: 38,
    difficulty: 'expert',
    category: 'composites',
    subcategory: 'hybrid-structures',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Hybrid composite structures',
      'Bonding composites to dissimilar materials',
      'Structural composite design',
    ],
    crossReferences: ['Foundation for aerospace structures in Level 11-12'],
  },

  // Module 5.8: Level 5 Final Project
  {
    level: 5,
    moduleNumber: '5.8',
    assignmentNumber: 'WA-5.8.1',
    orderIndex: 67,
    title: 'Level 5 Capstone: Laminated & Composite Chair',
    description: 'Design and build complete chair using bent lamination, steam bending, and composite reinforcement.',
    instructions: `1. Design chair in Fusion 360: bent laminated back, steam bent parts, composite reinforcement
2. Create full-scale mockup in cardboard or foam: test ergonomics
3. Build all necessary forms and molds: lamination forms, steam bending forms
4. Mill wood components: straight parts and bending stock
5. Execute steam bending: curved legs or stretchers
6. Laminate chair back or seat: compound curves if applicable
7. Add composite reinforcement where needed: high-stress joints
8. Join components: traditional joinery with modern materials
9. Apply finish: showcase wood grain and composite elements
10. Test chair: sit in it, load test if possible, evaluate comfort`,
    objectives: [
      'Integrate all Level 5 techniques in complete project',
      'Design ergonomic, beautiful chair',
      'Execute complex bending and lamination',
      'Reinforce strategically with composites',
      'Achieve structural soundness and comfort',
      'Finish to professional furniture standards',
    ],
    skills: ['Complete chair construction', 'Bent lamination', 'Steam bending', 'Composites', 'Furniture design', 'Ergonomics'],
    expectedOutcome: 'Completed chair demonstrating mastery of Level 5 bending and composite techniques.',
    passingCriteria: 'Chair is structurally sound, comfortable, graceful curves, composites integrated seamlessly, finish is professional',
    referencePhotos: ['/curriculum/woodworking/bent-chair-design.jpg', '/curriculum/woodworking/laminated-chair.jpg'],
    estimatedHours: 90,
    difficulty: 'expert',
    category: 'projects',
    subcategory: 'level-5',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Review ALL Level 5 reading materials',
      '"The Art of Chairmaking" by Brian Boggs',
      'Mid-century modern chair construction techniques',
    ],
    crossReferences: ['Integrates all WA-5 skills', 'Preparation for aerospace composites in Levels 11-12'],
  },

  {
    level: 5,
    moduleNumber: '5.9',
    assignmentNumber: 'WA-5.9.1',
    orderIndex: 68,
    title: 'Vacuum Forming Plastics - Tooling for Aerospace',
    description: 'Learn vacuum forming to create plastic molds, tooling, and protective covers for aerospace work.',
    instructions: `1. Study vacuum forming process: thermoplastics, heating, forming over mold
2. Build or acquire vacuum forming table: platen with holes, vacuum pump
3. Learn plastic selection: PETG, ABS, acrylic - applications and temperatures
4. Design and build vacuum form molds: draft angles, vent holes
5. Practice heating plastic sheet: even heat, proper forming temperature
6. Execute vacuum form: quick transfer, full vacuum, hold until cool
7. Trim formed parts: bandsaw, router, sanding
8. Create tooling for aerospace work: protective covers, forming molds
9. Make storage solutions: custom foam inserts for tools or parts
10. Document process and create library of useful formed parts`,
    objectives: [
      'Build or set up vacuum forming equipment',
      'Select appropriate thermoplastics',
      'Design molds with proper draft and vents',
      'Form plastic parts accurately',
      'Trim and finish formed parts',
      'Create practical tooling and storage solutions',
    ],
    skills: ['Vacuum forming', 'Thermoplastics', 'Mold design', 'Tool making', 'Plastic fabrication'],
    expectedOutcome: 'Library of vacuum formed parts including tooling aids and storage solutions.',
    passingCriteria: 'Parts form completely over molds, detail is captured, trimmed cleanly, functional for intended use',
    referencePhotos: ['/curriculum/composites/vacuum-former.jpg', '/curriculum/composites/formed-parts.jpg'],
    estimatedHours: 28,
    difficulty: 'intermediate',
    category: 'tooling',
    subcategory: 'vacuum-forming',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Vacuum forming basics',
      'Thermoplastic properties and selection',
      'Mold design for vacuum forming',
    ],
    crossReferences: ['Useful for creating aerospace composite tooling'],
  },

  // ============================================================================
  // LEVEL 6: METALWORKING FUNDAMENTALS (Months 19-21)
  // ============================================================================

  {
    level: 6,
    moduleNumber: '6.1',
    assignmentNumber: 'WA-6.1.1',
    orderIndex: 60,
    title: 'Metal Shop Safety & Material Science',
    description: 'Transition from wood to metal. Learn metal shop safety, material properties, and how metals differ fundamentally from wood.',
    instructions: `1. Study metal shop hazards: hot metal, grinding sparks, cutting fluids, sharp edges
2. Learn proper PPE for metalworking: safety glasses (side shields), face shields, gloves, hearing protection
3. Understand metal types: steel (mild, tool, stainless), aluminum, brass, copper, cast iron
4. Study metallurgy basics: crystal structure, work hardening, annealing, quenching, tempering
5. Learn metal identification: spark test, magnet test, file test, appearance
6. Practice safe grinding technique: tool rest 1/8" from wheel, eye level with center
7. Study metal cutting hazards: chips, coolant, rotating tools
8. Create metal sample board: 10+ alloys with properties documented
9. Pass metal shop safety certification`,
    objectives: [
      'Understand metal shop hazards and controls',
      'Identify common metals and alloys',
      'Apply proper PPE for all metal operations',
      'Understand basic metallurgy concepts',
      'Work safely with grinding equipment',
    ],
    skills: ['Metal shop safety', 'Material identification', 'Metallurgy basics', 'Hazard assessment'],
    expectedOutcome: 'Metal shop safety certification, metal sample board with identification notes.',
    passingCriteria: '100% on safety exam, correctly identify 9 out of 10 common metals, demonstrate safe grinding technique',
    referencePhotos: ['/curriculum/metal/safety-ppe.jpg', '/curriculum/metal/metal-samples.jpg', '/curriculum/metal/grinding-safety.jpg'],
    estimatedHours: 16,
    difficulty: 'advanced',
    category: 'metalworking',
    subcategory: 'foundations',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Metals Handbook" - ASM International (desk reference)',
      '"Machinery\'s Handbook" - Industrial Press (essential reference for all metalwork)',
      '"The Home Machinist\'s Handbook" by Doug Briney',
    ],
  },

  {
    level: 6,
    moduleNumber: '6.2',
    assignmentNumber: 'WA-6.2.1',
    orderIndex: 62,
    title: 'MIG Welding Fundamentals',
    description: 'Learn MIG (GMAW) welding - the most versatile welding process for fabrication. Master the fundamentals that will carry into TIG and stick welding.',
    instructions: `1. Study MIG welding theory: wire feed, shielding gas (75/25 Ar/CO2), heat input
2. Learn machine setup: voltage, wire speed, stick-out (3/8")
3. Practice gun technique: push vs drag, travel angle (10-15°), work angle
4. Master bead practice: stringer beads on flat steel plate
5. Learn joint types: butt, lap, T-joint, corner
6. Practice welding positions: flat, horizontal, vertical, overhead
7. Understand welding defects: porosity, undercut, lack of fusion, spatter
8. Study metal prep: clean, grind, fit-up (1/16" gap)
9. Complete AWS D1.1 practice welds for certification prep
10. Build simple welded project: workbench frame`,
    objectives: [
      'Set up MIG welder for different metal thicknesses',
      'Produce clean, consistent weld beads',
      'Weld in all positions with proper technique',
      'Identify and correct welding defects',
      'Prepare metal properly for welding',
      'Complete simple fabrication project',
    ],
    skills: ['MIG welding', 'Joint preparation', 'Machine setup', 'Defect analysis', 'Metal fabrication'],
    expectedOutcome: 'Series of practice welds demonstrating proficiency, completed welded workbench frame.',
    passingCriteria: 'Welds show good fusion, minimal spatter, consistent bead, workbench frame is square and strong',
    referencePhotos: ['/curriculum/metal/mig-welding.jpg', '/curriculum/metal/weld-bead.jpg', '/curriculum/metal/welded-frame.jpg'],
    estimatedHours: 40,
    difficulty: 'advanced',
    category: 'metalworking',
    subcategory: 'welding',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Welding: Principles and Applications" by Larry Jeffus',
      'AWS D1.1 Structural Welding Code (reference)',
      '"The Welding Business Owner\'s Handbook" by David Zielinski',
    ],
  },

  // Module 6.2: Metal Cutting & Grinding (continued)
  {
    level: 6,
    moduleNumber: '6.2',
    assignmentNumber: 'WA-6.2.2',
    orderIndex: 63,
    title: 'Oxy-Acetylene Cutting & Heating',
    description: 'Learn oxy-fuel cutting and heating - essential skills for fabrication, repair, and metal forming.',
    instructions: `1. Study oxy-acetylene safety: cylinder handling, flashback arrestors, regulator setup
2. Learn gas pressures: cutting oxygen (40-60 psi), fuel gas (5-10 psi), heating tips
3. Practice torch lighting: neutral flame, carburizing flame, oxidizing flame
4. Master cutting technique: preheat to cherry red, squeeze cutting lever, maintain travel speed
5. Learn gouging: remove weld defects, prepare joints
6. Practice heating for bending: even heating, avoid overheating
7. Study brazing fundamentals: flux, filler rod selection, heat control
8. Understand cutting different metals: steel, stainless, aluminum considerations
9. Complete cutting exercises: straight cuts, curves, bevel cuts`,
    objectives: [
      'Set up oxy-acetylene equipment safely',
      'Light and adjust torch to proper flame',
      'Cut steel plate with clean, square edges',
      'Heat metal for bending without warping',
      'Braze simple joints with proper penetration',
      'Understand gas cutting limitations',
    ],
    skills: ['Oxy-acetylene cutting', 'Torch heating', 'Brazing', 'Gas safety', 'Metal prep'],
    expectedOutcome: 'Series of cut plates demonstrating straight and curved cuts, bent metal samples, brazed practice joints.',
    passingCriteria: 'Cuts are square (within 5°), minimal slag, no excessive melting, proper heat control',
    referencePhotos: ['/curriculum/metal/oxy-cutting.jpg', '/curriculum/metal/torch-flame.jpg', '/curriculum/metal/cut-samples.jpg'],
    estimatedHours: 20,
    difficulty: 'advanced',
    category: 'metalworking',
    subcategory: 'cutting',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Oxy-Acetylene Welding" - Lincoln Electric handbook',
      'Gas cylinder safety standards - CGA publications',
      '"The Oxy-Acetylene Handbook" by Harold P. Manly',
    ],
  },

  // Module 6.3: Metalworking Hand Tools
  {
    level: 6,
    moduleNumber: '6.3',
    assignmentNumber: 'WA-6.3.1',
    orderIndex: 64,
    title: 'Metal Hand Tools - Files, Hacksaws, Taps & Dies',
    description: 'Master traditional metalworking hand tools for finishing, cutting, and threading.',
    instructions: `1. Study file types: flat, round, half-round, triangular, mill bastard, smooth
2. Learn proper filing technique: cross-filing, draw-filing, lathe filing
3. Practice hacksaw technique: 18-32 TPI selection, proper blade tension, cutting fluids
4. Master tap and die use: cutting threads in holes and on rods
5. Learn tap drill sizes: calculate for 75% thread engagement
6. Practice thread repair: helicoil installation, oversized taps
7. Study deburring techniques: hand deburring, wire wheels, abrasive methods
8. Learn hand scraping: precision surface finishing (traditional method)
9. Create threaded fastener samples: 5 different thread sizes`,
    objectives: [
      'File metal to precise dimensions (±0.005")',
      'Cut metal with hacksaw cleanly',
      'Tap threads that properly engage with fasteners',
      'Cut external threads with die',
      'Select proper cutting speeds and lubricants',
      'Deburr parts professionally',
    ],
    skills: ['Filing', 'Hand threading', 'Hacksaw technique', 'Deburring', 'Precision hand work'],
    expectedOutcome: 'Filed metal samples showing smooth finish, threaded holes and rods with clean threads.',
    passingCriteria: 'Filed surfaces are flat and smooth, threads engage properly with gauge, no cross-threading',
    referencePhotos: ['/curriculum/metal/filing.jpg', '/curriculum/metal/tapping.jpg', '/curriculum/metal/threaded-samples.jpg'],
    estimatedHours: 18,
    difficulty: 'advanced',
    category: 'metalworking',
    subcategory: 'hand-tools',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Metalworking: Doing It Better" by Tom Lipton',
      '"Machinery\'s Handbook" - Threading section',
      'Thread standards: Unified, Metric, NPT',
    ],
  },

  {
    level: 6,
    moduleNumber: '6.3',
    assignmentNumber: 'WA-6.3.2',
    orderIndex: 65,
    title: 'Bench Grinder & Pedestal Grinder Techniques',
    description: 'Master the bench grinder for tool sharpening, shaping, and surface preparation.',
    instructions: `1. Study grinder safety: eye protection, wheel guards, tool rest positioning
2. Learn wheel types: aluminum oxide, silicon carbide, CBN, grit sizes
3. Practice tool rest setup: 1/8" from wheel, proper height
4. Master tool grinding: lathe tools, drill bits, chisels, punches
5. Learn wheel dressing: diamond dresser, star wheel dresser
6. Study grinding angles: lathe tool geometry, drill bit angles (118°, 135°)
7. Practice surface grinding on hand grinder: flat surfaces, removing rust
8. Understand grinding heat: avoid bluing high-speed steel, water quench
9. Create grinding fixtures: drill bit sharpening jig, tool holder`,
    objectives: [
      'Grind cutting tools to proper geometry',
      'Maintain grinding wheel (dress, true)',
      'Sharpen drill bits by hand',
      'Grind lathe tool bits to correct angles',
      'Work safely at high-speed grinder',
      'Build simple grinding fixtures',
    ],
    skills: ['Tool grinding', 'Wheel dressing', 'Tool sharpening', 'Fixture building', 'Precision grinding'],
    expectedOutcome: 'Set of ground cutting tools: lathe tools, drill bits, chisels - all with correct geometry.',
    passingCriteria: 'Tools cut properly when tested, angles are correct (verified with gauge), no heat damage',
    referencePhotos: ['/curriculum/metal/grinding-lathe-tool.jpg', '/curriculum/metal/drill-sharpening.jpg', '/curriculum/metal/grinding-fixture.jpg'],
    estimatedHours: 16,
    difficulty: 'advanced',
    category: 'metalworking',
    subcategory: 'grinding',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Grinding Wheels and Operations" - Norton Abrasives handbook',
      '"Sharpening Basics" - Fine Woodworking (applies to metal tools)',
      'Tool geometry charts for lathe tools and drills',
    ],
  },

  // Module 6.4: Sheet Metal Work
  {
    level: 6,
    moduleNumber: '6.4',
    assignmentNumber: 'WA-6.4.1',
    orderIndex: 66,
    title: 'Sheet Metal Layout & Development',
    description: 'Learn to develop flat patterns for sheet metal parts - the foundation of all sheet metal fabrication.',
    instructions: `1. Study sheet metal terminology: bend allowance, setback, bend deduction, K-factor
2. Learn layout tools: scribe, dividers, square, punch, layout fluid
3. Practice parallel line development: rectangular boxes, ducts
4. Master radial line development: cones, hoppers, funnels
5. Understand triangulation: complex transitions, irregular shapes
6. Learn bend allowance calculation: compensate for material stretch
7. Practice notching and relief cuts: allow for clean bends
8. Study hem types: open hem, closed hem, wire edge
9. Develop flat pattern for complex sheet metal part`,
    objectives: [
      'Calculate bend allowances accurately',
      'Develop flat patterns for 3D sheet metal parts',
      'Layout patterns directly on sheet metal',
      'Understand different development methods',
      'Design relief cuts to prevent tearing',
    ],
    skills: ['Sheet metal layout', 'Flat pattern development', 'Bend calculation', 'Precision layout', 'Geometry'],
    expectedOutcome: 'Developed patterns for box, cone, and transition piece - ready for cutting and forming.',
    passingCriteria: 'Patterns fold into correct 3D shape, dimensions are accurate, proper relief cuts included',
    referencePhotos: ['/curriculum/metal/layout.jpg', '/curriculum/metal/flat-pattern.jpg', '/curriculum/metal/developed-parts.jpg'],
    estimatedHours: 20,
    difficulty: 'advanced',
    category: 'sheet-metal',
    subcategory: 'layout',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Sheet Metal Handbook" by Ron Fournier',
      '"Modern Sheet Metal Practice" by Frank Scully',
      'Bend allowance charts for various materials',
    ],
  },

  {
    level: 6,
    moduleNumber: '6.4',
    assignmentNumber: 'WA-6.4.2',
    orderIndex: 67,
    title: 'Sheet Metal Cutting & Shearing',
    description: 'Master various methods of cutting sheet metal accurately and safely.',
    instructions: `1. Study cutting methods: hand shears, power shears, nibblers, plasma, laser, waterjet
2. Learn hand shear technique: straight, curved, notching shears
3. Practice bench shear operation: backgauge setup, hold-down pressure
4. Master nibbler use: tight radius cutting, minimal distortion
5. Study plasma cutting: air plasma for ferrous and non-ferrous metals
6. Learn deburring: edge finishing after cutting
7. Practice cutting accuracy: hold tolerances ±1/16"
8. Understand kerf compensation: account for material removed by cutting
9. Cut parts from developed patterns`,
    objectives: [
      'Cut sheet metal with various methods',
      'Select appropriate cutting method for job',
      'Maintain cutting accuracy within tolerance',
      'Operate power shears safely',
      'Deburr cut edges properly',
    ],
    skills: ['Sheet metal cutting', 'Shearing', 'Nibbling', 'Plasma cutting', 'Edge finishing'],
    expectedOutcome: 'Cut sheet metal parts from developed patterns with clean, deburred edges.',
    passingCriteria: 'Cuts are within tolerance, edges are deburred, minimal distortion, proper safety practices',
    referencePhotos: ['/curriculum/metal/power-shear.jpg', '/curriculum/metal/plasma-cut.jpg', '/curriculum/metal/cut-parts.jpg'],
    estimatedHours: 18,
    difficulty: 'advanced',
    category: 'sheet-metal',
    subcategory: 'cutting',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Sheet metal cutting methods comparison charts',
      'Plasma cutter manufacturer guides',
      '"The FABRICATOR" magazine - cutting technology articles',
    ],
  },

  {
    level: 6,
    moduleNumber: '6.4',
    assignmentNumber: 'WA-6.4.3',
    orderIndex: 68,
    title: 'Press Brake & Sheet Metal Bending',
    description: 'Learn to bend sheet metal with press brake and hand tools to create precise angles and forms.',
    instructions: `1. Study press brake anatomy: ram, bed, back gauge, tonnage rating
2. Learn tooling: V-dies (6-8× material thickness), punches, radius dies
3. Practice bend angle calculation: springback compensation
4. Master back gauge setup: dimension to bend line
5. Learn bending sequence: inside bends first, avoid interference
6. Practice hemming: open hem, closed hem, edge stiffening
7. Study hand bending: brake, slip roll, manual folders
8. Learn joggling: offset bends for lap joints
9. Bend box from flat pattern with square corners`,
    objectives: [
      'Set up press brake for accurate bending',
      'Compensate for springback',
      'Bend sheet metal to precise angles',
      'Execute proper bending sequence',
      'Create hems and jogs',
      'Produce square corners and clean bends',
    ],
    skills: ['Press brake operation', 'Bend calculation', 'Hand bending', 'Hemming', 'Forming sequence'],
    expectedOutcome: 'Bent sheet metal box with square corners and accurate angles, hem samples.',
    passingCriteria: 'Bends are within ±2° of target, corners are square, no distortion or cracking',
    referencePhotos: ['/curriculum/metal/press-brake.jpg', '/curriculum/metal/bending.jpg', '/curriculum/metal/bent-box.jpg'],
    estimatedHours: 22,
    difficulty: 'advanced',
    category: 'sheet-metal',
    subcategory: 'forming',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Press Brake Technology" by Steve Benson',
      'Bend allowance and springback charts',
      'Press brake tonnage calculation guides',
    ],
  },

  // Module 6.5: Metal Joining
  {
    level: 6,
    moduleNumber: '6.5',
    assignmentNumber: 'WA-6.5.1',
    orderIndex: 69,
    title: 'Riveting - Solid Rivets & Blind Rivets',
    description: 'Master riveting for permanent mechanical fastening - critical for aerospace and sheet metal work.',
    instructions: `1. Study rivet types: solid (round head, countersunk), blind (pop rivets), structural
2. Learn rivet sizing: grip length, diameter (3× material thickness)
3. Practice drilling for rivets: hole size (rivet dia + 0.003-0.005")
4. Master bucking technique: solid rivet installation with rivet gun and bucking bar
5. Learn blind rivet installation: proper setting, material compatibility
6. Study countersunk rivets: flush installation, dimpling vs machine countersinking
7. Practice rivet spacing: edge distance (2× dia), pitch (3× dia minimum)
8. Understand rivet patterns: single row, double row, staggered
9. Rivet sheet metal assembly with structural integrity`,
    objectives: [
      'Install solid rivets with proper bucking',
      'Set blind rivets correctly',
      'Calculate proper rivet size and spacing',
      'Drill rivet holes to correct tolerance',
      'Install countersunk rivets flush',
      'Create strong, permanent joints',
    ],
    skills: ['Riveting', 'Bucking', 'Rivet layout', 'Hole preparation', 'Mechanical fastening'],
    expectedOutcome: 'Riveted assembly demonstrating various rivet types, properly set and spaced.',
    passingCriteria: 'Rivets are properly formed, holes are not elongated, flush rivets are smooth, joints are tight',
    referencePhotos: ['/curriculum/metal/solid-rivet.jpg', '/curriculum/metal/bucking.jpg', '/curriculum/metal/riveted-assembly.jpg'],
    estimatedHours: 18,
    difficulty: 'advanced',
    category: 'metal-joining',
    subcategory: 'riveting',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Aircraft Sheet Metal" - AC 43.13-1B (FAA Advisory Circular)',
      'Rivet installation standards - NASM, NAS specifications',
      '"Sheet Metal Forming" by Heinz Tschaetsch - Riveting chapter',
    ],
  },

  {
    level: 6,
    moduleNumber: '6.5',
    assignmentNumber: 'WA-6.5.2',
    orderIndex: 70,
    title: 'Mechanical Fasteners & Assembly',
    description: 'Learn to select and install mechanical fasteners - bolts, screws, and specialized fasteners.',
    instructions: `1. Study fastener types: machine screws, cap screws, bolts, nuts, washers
2. Learn thread designations: UNC, UNF, metric (M6×1.0), pipe threads
3. Practice torque specifications: proper tightening, torque wrench use
4. Master locking methods: locknuts, lock washers, thread locker, safety wire
5. Study specialized fasteners: clecos, dzus fasteners, camlocks
6. Learn safety wiring: double-twist technique, pigtails
7. Practice helicoil installation: repair stripped threads
8. Understand fastener grades: SAE J429, property class 8.8, 10.9
9. Assemble mechanical joint with proper torque and safety`,
    objectives: [
      'Select appropriate fasteners for application',
      'Identify thread types and sizes',
      'Torque fasteners to specification',
      'Install locking devices properly',
      'Safety wire fasteners correctly',
      'Repair damaged threads',
    ],
    skills: ['Fastener selection', 'Torque application', 'Safety wiring', 'Thread repair', 'Assembly'],
    expectedOutcome: 'Assembled mechanical joint with various fastener types, proper torque, and safety wiring.',
    passingCriteria: 'Correct fasteners selected, proper torque applied (verified), safety wire meets standards',
    referencePhotos: ['/curriculum/metal/fasteners.jpg', '/curriculum/metal/safety-wire.jpg', '/curriculum/metal/torque-wrench.jpg'],
    estimatedHours: 16,
    difficulty: 'advanced',
    category: 'metal-joining',
    subcategory: 'fasteners',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Fastener Standards" - Industrial Fasteners Institute handbook',
      'FAA safety wiring standards - AC 43.13-1B Chapter 7',
      '"Machinery\'s Handbook" - Fastener section',
    ],
  },

  // Module 6.6: Metal Forming
  {
    level: 6,
    moduleNumber: '6.6',
    assignmentNumber: 'WA-6.6.1',
    orderIndex: 71,
    title: 'English Wheel & Planishing - Shaping Sheet Metal',
    description: 'Learn hand metal forming techniques using English wheel and planishing hammer.',
    instructions: `1. Study metal forming theory: stretching vs shrinking, compound curves
2. Learn English wheel technique: wheel selection, pressure control, rolling pattern
3. Practice wheeling flat sheet: create gentle curve, avoid oil-canning
4. Master planishing: smooth hammer marks, refine curves
5. Study shrinking techniques: shrinking disk, heat shrinking, tucking
6. Learn stretching: create convex curves, dome shapes
7. Practice making patterns: work from center outward, symmetrical curves
8. Understand spring-back and material memory
9. Shape automotive body panel or decorative bowl`,
    objectives: [
      'Use English wheel to create smooth curves',
      'Planish metal surfaces smooth',
      'Understand shrinking and stretching',
      'Create compound curves',
      'Control metal movement',
    ],
    skills: ['English wheel', 'Planishing', 'Metal forming', 'Curve creation', 'Panel shaping'],
    expectedOutcome: 'Formed metal panel with smooth compound curve, planished to remove tool marks.',
    passingCriteria: 'Curves are smooth and symmetrical, no oil-canning, planished surface is uniform',
    referencePhotos: ['/curriculum/metal/english-wheel.jpg', '/curriculum/metal/planishing.jpg', '/curriculum/metal/formed-panel.jpg'],
    estimatedHours: 24,
    difficulty: 'advanced',
    category: 'metal-forming',
    subcategory: 'hand-forming',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Metal Fabricator\'s Handbook" by Ron Fournier',
      '"Automotive Sheet Metal Forming & Fabrication" by Matt Joseph',
      'English wheel technique videos (Ron Covell)',
    ],
  },

  {
    level: 6,
    moduleNumber: '6.6',
    assignmentNumber: 'WA-6.6.2',
    orderIndex: 72,
    title: 'Metal Spinning & Rotary Forming',
    description: 'Learn metal spinning on lathe to create axially symmetric parts - bowls, cones, cylinders.',
    instructions: `1. Study spinning theory: progressive forming, metal flow, tooling pressure
2. Learn lathe setup for spinning: faceplate, tailstock pressure, follow rest
3. Practice making mandrels: wood, metal, multi-piece for undercuts
4. Master spinning tools: flat tool, ball tool, roller tools
5. Learn spinning technique: start from center, work outward, multiple passes
6. Practice making simple forms: bowls, cones, cylinders
7. Study shear forming: thinner wall, higher strength
8. Learn spinning aluminum: soft, workable (3003-H14)
9. Spin decorative bowl and functional funnel`,
    objectives: [
      'Set up lathe for metal spinning',
      'Create mandrels for spinning forms',
      'Spin sheet metal into axisymmetric shapes',
      'Control wall thickness during forming',
      'Produce smooth finished surfaces',
    ],
    skills: ['Metal spinning', 'Lathe spinning setup', 'Mandrel making', 'Progressive forming', 'Rotary metalwork'],
    expectedOutcome: 'Spun metal bowl and funnel with uniform wall thickness and smooth finish.',
    passingCriteria: 'Parts match mandrel shape, wall thickness is consistent, surface is smooth (minimal tool marks)',
    referencePhotos: ['/curriculum/metal/spinning-lathe.jpg', '/curriculum/metal/spinning-process.jpg', '/curriculum/metal/spun-parts.jpg'],
    estimatedHours: 22,
    difficulty: 'advanced',
    category: 'metal-forming',
    subcategory: 'spinning',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Metal Spinning" by Fred H. Wendel',
      'Metal spinning technique articles and videos',
      'Mandrel design for spinning',
    ],
  },

  // Module 6.7: Surface Finishing
  {
    level: 6,
    moduleNumber: '6.7',
    assignmentNumber: 'WA-6.7.1',
    orderIndex: 73,
    title: 'Metal Surface Preparation & Finishing',
    description: 'Learn to prepare and finish metal surfaces for corrosion protection and aesthetics.',
    instructions: `1. Study surface prep methods: grinding, sanding, wire brushing, sandblasting, chemical cleaning
2. Learn grit progression: 80, 120, 180, 220, 320, 400+ for polishing
3. Practice degreasing: solvent cleaning, alkaline cleaners
4. Master rust removal: mechanical, chemical (phosphoric acid), electrolysis
5. Study metal finishing: clear coat, powder coating, painting, plating
6. Learn buffing and polishing: compound selection, wheel types
7. Practice creating surface finishes: brushed, mirror polish, satin
8. Understand passivation: stainless steel treatment
9. Finish metal samples with various surface treatments`,
    objectives: [
      'Prepare metal surfaces for finishing',
      'Remove rust and contaminants completely',
      'Create various surface finishes',
      'Polish metal to mirror finish',
      'Apply protective coatings',
    ],
    skills: ['Surface preparation', 'Polishing', 'Finishing', 'Rust removal', 'Coating application'],
    expectedOutcome: 'Metal sample board showing various finishes: brushed, polished, coated, etc.',
    passingCriteria: 'Surfaces are properly prepared, finishes are uniform, no contamination, proper protection applied',
    referencePhotos: ['/curriculum/metal/surface-prep.jpg', '/curriculum/metal/polishing.jpg', '/curriculum/metal/finished-samples.jpg'],
    estimatedHours: 18,
    difficulty: 'advanced',
    category: 'finishing',
    subcategory: 'metal-finishing',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Metal Finishing Guidebook" - Products Finishing magazine',
      'Powder coating process guides',
      'Surface preparation standards - SSPC, NACE',
    ],
  },

  {
    level: 6,
    moduleNumber: '6.7',
    assignmentNumber: 'WA-6.7.2',
    orderIndex: 74,
    title: 'Patination & Chemical Metal Coloring',
    description: 'Learn chemical processes to color and patinate metals for artistic and functional purposes.',
    instructions: `1. Study patina chemistry: oxidation, sulfidation, chemical reactions with metal surfaces
2. Learn copper patinas: liver of sulfur (black), cupric nitrate (blue-green), ferric nitrate (rust brown)
3. Practice steel bluing: cold blue, hot caustic blue, heat bluing
4. Master brass and bronze patinas: verde antique, statuary bronze
5. Study safety: acid handling, fume ventilation, PPE
6. Learn surface preparation for patina: critical for even results
7. Practice layering and sealing: wax, lacquer, oil
8. Understand accelerated aging vs natural patina
9. Create sample board with various metal patinas`,
    objectives: [
      'Apply chemical patinas safely',
      'Create even, attractive surface colors',
      'Understand patina chemistry',
      'Prepare surfaces properly for patination',
      'Seal and protect patinated surfaces',
    ],
    skills: ['Patination', 'Chemical processes', 'Surface treatment', 'Metal coloring', 'Artistic finishing'],
    expectedOutcome: 'Sample board of patinated metals: copper, brass, steel with various colors and textures.',
    passingCriteria: 'Patinas are even and attractive, proper safety protocols followed, sealed appropriately',
    referencePhotos: ['/curriculum/metal/patina-copper.jpg', '/curriculum/metal/steel-blue.jpg', '/curriculum/metal/patina-samples.jpg'],
    estimatedHours: 16,
    difficulty: 'advanced',
    category: 'finishing',
    subcategory: 'patination',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"The Colouring, Bronzing and Patination of Metals" by Richard Hughes',
      '"Metal Techniques for Craftsmen" by Oppi Untracht - Patina section',
      'Chemical safety data sheets for all chemicals used',
    ],
  },

  // Module 6.8: Precision Layout
  {
    level: 6,
    moduleNumber: '6.8',
    assignmentNumber: 'WA-6.8.1',
    orderIndex: 75,
    title: 'Precision Layout & Measurement',
    description: 'Master precision layout and measurement techniques - critical for all metalworking.',
    instructions: `1. Study layout tools: surface plate, height gauge, surface gauge, scribers, dividers
2. Learn bluing methods: layout fluid, Dykem, machinist\'s blue
3. Practice using combination square: squareness, 45°, depth, layout
4. Master height gauge technique: precise vertical measurements and scribing
5. Study precision measurement: calipers (±0.001"), micrometers (±0.0001")
6. Learn gauge blocks: building precision stack heights, calibration standards
7. Practice center finding: edge finder, wiggler, dial indicator
8. Study coordinate layout: X-Y dimensions from datum
9. Layout complex part with ±0.005" accuracy`,
    objectives: [
      'Use precision measuring tools correctly',
      'Layout parts to tight tolerances',
      'Read and apply GD&T symbols',
      'Establish datums and work from them',
      'Verify dimensions with multiple tools',
    ],
    skills: ['Precision measurement', 'Layout', 'Metrology', 'Tool use', 'Dimensional accuracy'],
    expectedOutcome: 'Complex part layout on blued metal with precision scribed lines, ready for machining.',
    passingCriteria: 'Layout is within ±0.005" of print, lines are fine and clear, proper datum references',
    referencePhotos: ['/curriculum/metal/layout-plate.jpg', '/curriculum/metal/height-gauge.jpg', '/curriculum/metal/precision-layout.jpg'],
    estimatedHours: 20,
    difficulty: 'advanced',
    category: 'metrology',
    subcategory: 'layout',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Machinery\'s Handbook" - Measurement section',
      'GD&T basics - ASME Y14.5 introduction',
      '"Fundamentals of Dimensional Metrology" by Ted Busch',
    ],
  },

  {
    level: 6,
    moduleNumber: '6.8',
    assignmentNumber: 'WA-6.8.2',
    orderIndex: 76,
    title: 'Dial Indicators & Precision Setup',
    description: 'Master dial indicators for machine setup, part alignment, and precision measurement.',
    instructions: `1. Study indicator types: dial test indicator (DTI), dial indicator, digital indicators
2. Learn mounting: magnetic base, indicator holder, test stands
3. Practice tramming: align machine head perpendicular to table
4. Master edge finding: locate part edges precisely
5. Learn runout measurement: shaft concentricity, chuck jaw alignment
6. Study surface flatness testing: sweep across surface plate
7. Practice CNC machine work offset setup: touch-off, zero setting
8. Learn comparative measurement: check parts against master
9. Set up 4-jaw chuck with <0.001" runout using indicator`,
    objectives: [
      'Use dial indicators for precision setup',
      'Tram machine head accurately',
      'Find edges and center points',
      'Measure runout and concentricity',
      'Align parts within 0.001"',
    ],
    skills: ['Indicator use', 'Machine tramming', 'Runout measurement', 'Precision setup', 'Alignment'],
    expectedOutcome: 'Machine tramming verified with indicator, part aligned in 4-jaw chuck with <0.001" runout.',
    passingCriteria: 'Indicator reads <0.001" TIR for tramming and chuck setup, proper technique demonstrated',
    referencePhotos: ['/curriculum/metal/dial-indicator.jpg', '/curriculum/metal/tramming.jpg', '/curriculum/metal/chuck-setup.jpg'],
    estimatedHours: 18,
    difficulty: 'advanced',
    category: 'metrology',
    subcategory: 'indicators',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Machine Tool Practices" by Richard R. Kibbe - Indicator chapter',
      'Starrett indicator handbook',
      'CNC setup and work offset procedures',
    ],
  },

  // Module 6.9: Level 6 Project
  {
    level: 6,
    moduleNumber: '6.9',
    assignmentNumber: 'WA-6.9.1',
    orderIndex: 77,
    title: 'Level 6 Project: Welded Metal Workbench with Sheet Metal Enclosures',
    description: 'Integrate all Level 6 metalworking skills to build a professional metal workbench with storage.',
    instructions: `1. Design workbench: 48" × 24" top, height 36", steel tube frame (2" × 2" × 1/8" wall)
2. Create full shop drawings: dimensions, weld symbols, BOM, cut list
3. Cut all tubing: saw, deburr, verify lengths
4. Lay out and drill mounting holes with precision
5. Tack weld frame: check for square before final welding
6. Complete all welds: MIG welding on frame, grind smooth
7. Fabricate sheet metal drawer enclosure: layout, cut, bend, rivet
8. Install hardware: drawer slides, handles, feet
9. Apply finish: grind, prep, paint or powder coat
10. Assemble complete workbench and verify functionality`,
    objectives: [
      'Design functional metal furniture',
      'Execute complete fabrication workflow',
      'Integrate welding, sheet metal, and fastening',
      'Produce professional-quality build',
      'Apply proper finishing techniques',
      'Create something useful for the shop',
    ],
    skills: ['Complete metalworking workflow', 'Welded fabrication', 'Sheet metal enclosures', 'Finishing', 'Design execution'],
    expectedOutcome: 'Fully functional welded metal workbench with sheet metal drawer enclosure, professionally finished.',
    passingCriteria: 'Bench is square and rigid, welds are clean, sheet metal fits properly, finish is professional',
    referencePhotos: ['/curriculum/projects/metal-bench-design.jpg', '/curriculum/projects/bench-welding.jpg', '/curriculum/projects/completed-bench.jpg'],
    estimatedHours: 60,
    difficulty: 'advanced',
    category: 'projects',
    subcategory: 'level-6',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Review ALL Level 6 reading materials',
      'Workbench design articles and plans',
      'Welding fabrication project guides',
    ],
  },

  {
    level: 6,
    moduleNumber: '6.9',
    assignmentNumber: 'WA-6.9.2',
    orderIndex: 77.5,
    title: 'Metal Surface Finishing & Corrosion Protection',
    description: 'Master surface finishing techniques for metal including grinding, polishing, painting, powder coating, and corrosion protection.',
    instructions: `1. Study surface preparation importance: clean metal accepts coatings better
2. Learn grinding techniques: 36 grit to 120 grit progression, scratch removal
3. Practice sanding and polishing: orbital sander, buffing wheel, polishing compound
4. Master metal cleaning: solvent wipe, phosphate treatment, metal prep
5. Learn painting metal: primer selection, spray technique, cure time
6. Study powder coating process: electrostatic application, oven cure
7. Understand corrosion protection: galvanizing, zinc-rich primer, stainless options
8. Practice patina techniques: gun bluing, rust patina, chemical darkening
9. Apply multiple finishes to sample pieces: paint, powder coat, polish, patina
10. Complete finish comparison board with labeled samples`,
    objectives: [
      'Prepare metal surfaces for finishing',
      'Grind welds smooth and flush',
      'Polish metal to mirror finish',
      'Apply paint and primer with spray gun',
      'Understand powder coating process',
      'Select appropriate corrosion protection',
    ],
    skills: ['Surface grinding', 'Metal polishing', 'Spray painting', 'Powder coating', 'Corrosion prevention', 'Finishing techniques'],
    expectedOutcome: 'Sample board with 6+ different metal finishes demonstrating proper surface preparation and application techniques.',
    passingCriteria: 'Surfaces are properly prepared, no grinding marks under paint, polished surfaces are mirror-like, coatings are even',
    referencePhotos: ['/curriculum/metal/grinding-progression.jpg', '/curriculum/metal/polished-metal.jpg', '/curriculum/metal/finish-samples.jpg'],
    estimatedHours: 24,
    difficulty: 'advanced',
    category: 'metalworking',
    subcategory: 'finishing',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Metal Finishing Guidebook" - Products Finishing Magazine',
      '"Powder Coating: The Complete Finisher\'s Handbook" by Jeff Struven',
      'Corrosion protection standards - NACE/SSPC',
    ],
  },

  // ============================================================================
  // LEVEL 7: WELDING & METAL FABRICATION (Months 22-24)
  // ============================================================================

  // Module 7.1: Advanced MIG/TIG Welding
  {
    level: 7,
    moduleNumber: '7.1',
    assignmentNumber: 'WA-7.1.1',
    orderIndex: 80,
    title: 'TIG Welding Fundamentals - GTAW',
    description: 'Master TIG (GTAW) welding - the most precise and clean welding process. Essential for aluminum and thin materials.',
    instructions: `1. Study TIG welding theory: tungsten electrode, shielding gas (100% argon), AC/DC
2. Learn machine setup: amperage, gas flow (15-20 CFH), electrode prep
3. Practice torch control: cup walk, freehand, foot pedal current control
4. Master filler rod feeding: dab technique, lay wire technique
5. Learn steel TIG: DCEN (electrode negative), 2% lanthanated tungsten
6. Practice aluminum TIG: AC with balance control, cleaning action
7. Study stainless TIG: DCEN, purge gas for back side, sugar prevention
8. Learn scratch start vs lift arc vs high frequency
9. Complete TIG qualification coupons: 2G, 3G, 4G positions`,
    objectives: [
      'Set up TIG welder for steel, stainless, aluminum',
      'Control heat with foot pedal or hand control',
      'Feed filler rod smoothly',
      'Weld in all positions with TIG',
      'Produce clean, precise welds',
      'Pass visual inspection for certification prep',
    ],
    skills: ['TIG welding', 'Torch control', 'Filler rod technique', 'AC/DC welding', 'Precision welding'],
    expectedOutcome: 'TIG-welded test coupons in steel, stainless, and aluminum demonstrating quality welds.',
    passingCriteria: 'Welds are uniform, no tungsten inclusions, proper penetration, minimal discoloration',
    referencePhotos: ['/curriculum/welding/tig-setup.jpg', '/curriculum/welding/tig-bead.jpg', '/curriculum/welding/tig-aluminum.jpg'],
    estimatedHours: 40,
    difficulty: 'expert',
    category: 'welding',
    subcategory: 'tig-gtaw',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"TIG Welding Handbook" by Richard Finch',
      'AWS D17.1 Aerospace Welding Specification',
      '"Welding Metallurgy" by Sindo Kou',
    ],
  },

  {
    level: 7,
    moduleNumber: '7.1',
    assignmentNumber: 'WA-7.1.2',
    orderIndex: 81,
    title: 'Stick Welding (SMAW) - All Position Welding',
    description: 'Master stick welding - the most versatile process for field work, thick materials, and all-position welding.',
    instructions: `1. Study SMAW theory: electrode coating, arc characteristics, polarity
2. Learn electrode selection: 6010, 6011 (deep penetration), 7018 (low hydrogen)
3. Practice striking arc: scratch start, tap start, maintaining arc length
4. Master bead progression: drag 7018, push 6010, weave patterns
5. Learn vertical up welding: shelf technique, triangular weave
6. Practice overhead welding: electrode angle, travel speed, safety
7. Study root pass welding: open root joints, keyhole technique (6010)
8. Learn hot pass, fill, and cap passes: multi-pass welding sequence
9. Complete 3G and 4G qualification plates`,
    objectives: [
      'Select proper electrode for application',
      'Weld in all positions (flat, horizontal, vertical, overhead)',
      'Produce sound root passes in open root joints',
      'Execute multi-pass welding procedures',
      'Pass bend tests for weld quality',
    ],
    skills: ['Stick welding', 'All-position welding', 'Electrode selection', 'Multi-pass welding', 'Root pass technique'],
    expectedOutcome: '3G and 4G welded plates demonstrating all-position skill, ready for bend testing.',
    passingCriteria: 'Welds pass visual inspection, bend tests show no defects, proper tie-in between passes',
    referencePhotos: ['/curriculum/welding/stick-vertical.jpg', '/curriculum/welding/stick-overhead.jpg', '/curriculum/welding/stick-root.jpg'],
    estimatedHours: 40,
    difficulty: 'expert',
    category: 'welding',
    subcategory: 'stick-smaw',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Stick Electrode Welding Handbook" - Lincoln Electric',
      'AWS D1.1 Structural Welding Code - Steel',
      'ASME Section IX welding qualifications',
    ],
  },

  // Module 7.2: Specialized Welding Processes
  {
    level: 7,
    moduleNumber: '7.2',
    assignmentNumber: 'WA-7.2.1',
    orderIndex: 82,
    title: 'Flux-Core Arc Welding (FCAW) - Self-Shielded & Gas-Shielded',
    description: 'Learn flux-core welding for high-deposition fabrication and outdoor welding.',
    instructions: `1. Study FCAW types: self-shielded (FCAW-S), gas-shielded (FCAW-G)
2. Learn wire selection: E71T-1 (gas), E71T-8 (self-shielded)
3. Practice machine setup: voltage, wire speed, gas flow (FCAW-G)
4. Master drag technique: proper gun angle, slag removal
5. Study outdoor welding: self-shielded for wind resistance
6. Learn high-deposition welding: thick materials, production rates
7. Practice out-of-position FCAW: vertical up, overhead
8. Understand slag system: fast-freeze slag, proper cleaning
9. Weld heavy structural joint with FCAW`,
    objectives: [
      'Set up flux-core welding equipment',
      'Select appropriate flux-core wire',
      'Weld outdoors with self-shielded wire',
      'Achieve high deposition rates',
      'Remove slag properly',
      'Weld thick materials efficiently',
    ],
    skills: ['Flux-core welding', 'High-deposition welding', 'Outdoor welding', 'Slag management', 'Production welding'],
    expectedOutcome: 'Heavy structural T-joint welded with flux-core, demonstrating proper penetration and slag removal.',
    passingCriteria: 'Full penetration achieved, slag removes cleanly, no slag inclusions in weld',
    referencePhotos: ['/curriculum/welding/fcaw-welding.jpg', '/curriculum/welding/fcaw-slag.jpg', '/curriculum/welding/fcaw-joint.jpg'],
    estimatedHours: 24,
    difficulty: 'expert',
    category: 'welding',
    subcategory: 'flux-core',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Flux-cored wire specifications and selection guides',
      'FCAW troubleshooting guides',
      'AWS D1.1 FCAW procedures',
    ],
  },

  {
    level: 7,
    moduleNumber: '7.2',
    assignmentNumber: 'WA-7.2.2',
    orderIndex: 83,
    title: 'Orbital TIG Welding - Automated Pipe Welding',
    description: 'Learn orbital TIG welding for precision, repeatable pipe and tube welding.',
    instructions: `1. Study orbital welding systems: weld head, power supply, programming
2. Learn tube preparation: clean cut, deburring, oxide removal
3. Practice fit-up: gap tolerance (0.000-0.005"), alignment
4. Master purge gas setup: trailing shields, purge dams, oxygen monitoring
5. Study weld schedules: primary current, background current, pulsing
6. Learn programming: ramp up, main weld, crater fill, cool-down
7. Practice weld head setup: centering, clamping, electrode positioning
8. Understand penetration control: consistent root reinforcement
9. Weld stainless steel tubing with orbital TIG system`,
    objectives: [
      'Set up orbital TIG welding system',
      'Prepare tubes for orbital welding',
      'Program weld schedules',
      'Achieve consistent root penetration',
      'Produce aerospace-quality tube welds',
    ],
    skills: ['Orbital welding', 'Weld programming', 'Purge gas systems', 'Tube preparation', 'Precision welding'],
    expectedOutcome: 'Orbitally-welded stainless tube assembly with consistent, high-quality welds.',
    passingCriteria: 'Welds have uniform penetration, no oxidation inside or outside, passes X-ray or visual inspection',
    referencePhotos: ['/curriculum/welding/orbital-head.jpg', '/curriculum/welding/orbital-weld.jpg', '/curriculum/welding/tube-weld.jpg'],
    estimatedHours: 28,
    difficulty: 'expert',
    category: 'welding',
    subcategory: 'orbital-tig',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Orbital welding system manuals (ARC Machines, Swagelok)',
      'AWS D17.1 orbital welding requirements',
      'ASME BPE bioprocessing equipment standards',
    ],
  },

  // Module 7.3: Welding Metallurgy & Inspection
  {
    level: 7,
    moduleNumber: '7.3',
    assignmentNumber: 'WA-7.3.1',
    orderIndex: 84,
    title: 'Welding Metallurgy - Heat Affected Zones & Microstructure',
    description: 'Understand the metallurgical changes that occur during welding and how they affect weld properties.',
    instructions: `1. Study weld zones: fusion zone, heat-affected zone (HAZ), base metal
2. Learn phase diagrams: iron-carbon, understanding austenite, ferrite, martensite
3. Practice etching weld samples: reveal microstructure with nital etch
4. Study grain growth in HAZ: coarse-grained vs fine-grained HAZ
5. Understand heat input calculation: volts × amps ÷ travel speed
6. Learn about hydrogen cracking: preheating requirements, low-hydrogen electrodes
7. Study weld solidification: columnar grain structure, centerline segregation
8. Practice hardness testing: measure HAZ hardness, correlate with toughness
9. Analyze failed weld samples: identify defect causes`,
    objectives: [
      'Identify weld metallurgical zones',
      'Understand how heat input affects properties',
      'Calculate and control heat input',
      'Prevent hydrogen cracking',
      'Interpret weld microstructure',
      'Correlate structure to properties',
    ],
    skills: ['Welding metallurgy', 'Microstructure analysis', 'Heat input control', 'Defect analysis', 'Material science'],
    expectedOutcome: 'Etched and analyzed weld samples with documented microstructures and hardness measurements.',
    passingCriteria: 'Correct identification of weld zones, proper etching technique, accurate hardness measurements',
    referencePhotos: ['/curriculum/welding/weld-macro.jpg', '/curriculum/welding/haz-microstructure.jpg', '/curriculum/welding/hardness-testing.jpg'],
    estimatedHours: 20,
    difficulty: 'expert',
    category: 'welding-theory',
    subcategory: 'metallurgy',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Welding Metallurgy" by Sindo Kou (essential textbook)',
      '"Metals Handbook" Volume 6 - Welding, Brazing, and Soldering',
      'AWS welding metallurgy resources',
    ],
  },

  {
    level: 7,
    moduleNumber: '7.3',
    assignmentNumber: 'WA-7.3.2',
    orderIndex: 85,
    title: 'Weld Inspection & Non-Destructive Testing',
    description: 'Learn to inspect welds using visual and non-destructive testing (NDT) methods.',
    instructions: `1. Study visual inspection: AWS D1.1 acceptance criteria, weld gauges
2. Learn liquid penetrant testing (PT): cleaner, penetrant, developer, crack detection
3. Practice magnetic particle testing (MT): detect surface and subsurface defects in ferrous metals
4. Understand radiographic testing (RT): X-ray interpretation, film reading
5. Study ultrasonic testing (UT): pulse-echo, angle beam, thickness measurement
6. Learn destructive testing: bend tests, tensile tests, macro etch
7. Practice using weld gauges: fillet weld gauge, undercut gauge, pit gauge
8. Understand weld symbols: read and interpret welding symbols on drawings
9. Inspect and document weld quality per code requirements`,
    objectives: [
      'Perform visual weld inspection to code',
      'Conduct liquid penetrant testing',
      'Use weld inspection gauges correctly',
      'Interpret NDT results',
      'Read and apply weld symbols',
      'Document inspection results',
    ],
    skills: ['Weld inspection', 'NDT methods', 'Visual inspection', 'Code compliance', 'Quality documentation'],
    expectedOutcome: 'Inspection report for welded assembly with PT results, visual inspection findings, documentation.',
    passingCriteria: 'Correct application of inspection methods, accurate defect identification, proper documentation',
    referencePhotos: ['/curriculum/welding/visual-inspection.jpg', '/curriculum/welding/penetrant-test.jpg', '/curriculum/welding/weld-gauge.jpg'],
    estimatedHours: 24,
    difficulty: 'expert',
    category: 'quality-control',
    subcategory: 'inspection',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'AWS D1.1 - Inspection requirements',
      '"Welding Inspection Handbook" - AWS',
      'ASNT NDT Level II study materials',
    ],
  },

  // Module 7.4: Advanced Fabrication
  {
    level: 7,
    moduleNumber: '7.4',
    assignmentNumber: 'WA-7.4.1',
    orderIndex: 86,
    title: 'Welded Tube & Pipe Fabrication',
    description: 'Master tube and pipe welding and fabrication - critical for structural and aerospace work.',
    instructions: `1. Study tube vs pipe: dimensional standards, wall thickness, schedules
2. Learn tube notching: cope cuts, fish-mouth joints, miter cuts
3. Practice tube bending: rotary draw bender, mandrels, centerline radius
4. Master tube fit-up: tack spacing, gap control, joint alignment
5. Study pipe positions: 1G, 2G, 5G, 6G (all-position pipe)
6. Learn root pass technique: consistent keyhole, proper tie-in
7. Practice TIG pipe welding: walking the cup, filler rod control
8. Understand purge requirements: prevent sugaring on stainless
9. Weld 6G pipe qualification coupon`,
    objectives: [
      'Fabricate tube assemblies with proper fit-up',
      'Notch and miter tubes accurately',
      'Weld pipe in all positions',
      'Achieve 100% root penetration',
      'Prevent internal oxidation',
      'Pass pipe welding qualification',
    ],
    skills: ['Pipe welding', 'Tube fabrication', 'Tube notching', 'Root pass welding', 'Purge gas control'],
    expectedOutcome: '6G pipe weld qualification coupon and welded tube frame assembly.',
    passingCriteria: 'Root pass has 100% penetration, no wagon tracks, passes bend test or X-ray',
    referencePhotos: ['/curriculum/welding/pipe-welding.jpg', '/curriculum/welding/tube-notching.jpg', '/curriculum/welding/6g-position.jpg'],
    estimatedHours: 36,
    difficulty: 'expert',
    category: 'fabrication',
    subcategory: 'pipe-tube',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'ASME B31.3 Process Piping Code',
      'Tube bending manuals and bend allowance charts',
      'AWS D10.9 Qualification of Welding Procedures and Welders for Piping',
    ],
  },

  {
    level: 7,
    moduleNumber: '7.4',
    assignmentNumber: 'WA-7.4.2',
    orderIndex: 87,
    title: 'Structural Steel Fabrication & Erection',
    description: 'Learn to fabricate and assemble structural steel components - beams, columns, trusses.',
    instructions: `1. Study structural shapes: W-beams, channels, angles, HSS (hollow structural sections)
2. Learn beam connections: clip angles, shear tabs, moment connections
3. Practice column base plates: layout, drilling, anchor bolt patterns
4. Master truss fabrication: gusset plates, member orientation, geometry
5. Study welding sequences: minimize distortion, control heat input
6. Learn fit-up techniques: strongbacks, come-alongs, alignment
7. Practice fillet welds: sizing, leg length, convexity
8. Understand weld symbols on structural drawings
9. Fabricate small structural frame with beam-to-column connections`,
    objectives: [
      'Interpret structural steel drawings',
      'Fabricate structural connections',
      'Control welding distortion',
      'Produce properly-sized fillet welds',
      'Assemble structural frames square and plumb',
    ],
    skills: ['Structural fabrication', 'Connection design', 'Fillet welding', 'Distortion control', 'Steel erection'],
    expectedOutcome: 'Fabricated structural steel frame with welded beam-to-column connections.',
    passingCriteria: 'Frame is square and plumb, fillet welds are correct size, connections are strong',
    referencePhotos: ['/curriculum/welding/structural-frame.jpg', '/curriculum/welding/beam-connection.jpg', '/curriculum/welding/fillet-weld.jpg'],
    estimatedHours: 32,
    difficulty: 'expert',
    category: 'fabrication',
    subcategory: 'structural-steel',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'AWS D1.1 Structural Welding Code - Steel',
      'AISC Steel Construction Manual',
      '"Structural Steel Drafting and Design" by David Madsen',
    ],
  },

  {
    level: 7,
    moduleNumber: '7.4',
    assignmentNumber: 'WA-7.4.3',
    orderIndex: 88,
    title: 'Pressure Vessel & Tank Fabrication Basics',
    description: 'Introduction to pressure vessel fabrication and the codes that govern it.',
    instructions: `1. Study pressure vessel basics: cylindrical shells, heads (elliptical, hemispherical, flat)
2. Learn ASME Section VIII: Unfired Pressure Vessels code basics
3. Practice shell rolling: pyramid roller, initial pinch, rolling technique
4. Master longitudinal seam welding: backing strips, root pass, multi-pass
5. Study head-to-shell attachment: fit-up, tack welding, welding sequence
6. Learn nozzle attachment: reinforcement pads, compensation, penetration inspection
7. Practice hydrostatic testing: pressure calculations, leak detection
8. Understand radiographic inspection requirements for pressure vessels
9. Fabricate small air receiver tank (non-code practice vessel)`,
    objectives: [
      'Understand pressure vessel code basics',
      'Roll cylindrical shells',
      'Weld longitudinal and circumferential seams',
      'Attach nozzles with proper reinforcement',
      'Perform hydrostatic testing',
    ],
    skills: ['Pressure vessel fabrication', 'Shell rolling', 'Code welding', 'Hydrostatic testing', 'Quality requirements'],
    expectedOutcome: 'Small practice air tank with welded seams, attached nozzles, hydrostatically tested.',
    passingCriteria: 'Welds pass visual inspection, tank holds hydrostatic test pressure with no leaks',
    referencePhotos: ['/curriculum/welding/shell-rolling.jpg', '/curriculum/welding/vessel-welding.jpg', '/curriculum/welding/hydro-test.jpg'],
    estimatedHours: 32,
    difficulty: 'expert',
    category: 'fabrication',
    subcategory: 'pressure-vessels',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'ASME Boiler and Pressure Vessel Code Section VIII Division 1',
      '"Pressure Vessel Design Manual" by Dennis R. Moss',
      'AWS D1.1 and ASME Section IX welding requirements',
    ],
  },

  // Module 7.5: Aluminum & Exotic Materials
  {
    level: 7,
    moduleNumber: '7.5',
    assignmentNumber: 'WA-7.5.1',
    orderIndex: 89,
    title: 'Aluminum Welding - MIG & TIG Techniques',
    description: 'Master aluminum welding - critical skill for aerospace, automotive, and marine applications.',
    instructions: `1. Study aluminum alloys: 1xxx, 3xxx, 5xxx (non-heat treatable), 6xxx (heat treatable)
2. Learn surface preparation: remove oxide layer, stainless brush, solvent clean
3. Practice aluminum MIG (GMAW): push technique, spray transfer, spool gun
4. Master aluminum TIG: AC balance control, cleaning action, filler rod selection
5. Understand heat management: aluminum conducts heat 5× faster than steel
6. Study porosity prevention: hydrogen source, proper cleaning, travel speed
7. Learn about heat-affected zone softening in 6xxx series
8. Practice crack repair: stop-drilling, proper joint prep
9. Weld aluminum boat hull repair or fabrication project`,
    objectives: [
      'Prepare aluminum properly for welding',
      'MIG weld aluminum with spool gun',
      'TIG weld aluminum with AC',
      'Prevent porosity and oxidation',
      'Manage heat input for thin aluminum',
      'Select proper filler alloy',
    ],
    skills: ['Aluminum welding', 'TIG AC welding', 'Aluminum MIG', 'Heat management', 'Porosity prevention'],
    expectedOutcome: 'Welded aluminum assembly (boat patch, frame, or enclosure) with clean, sound welds.',
    passingCriteria: 'Welds are free of porosity, proper penetration, no burn-through, good bead appearance',
    referencePhotos: ['/curriculum/welding/aluminum-tig.jpg', '/curriculum/welding/aluminum-mig.jpg', '/curriculum/welding/aluminum-project.jpg'],
    estimatedHours: 30,
    difficulty: 'expert',
    category: 'welding',
    subcategory: 'aluminum',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Welding Aluminum: Theory and Practice" - Lincoln Electric',
      'Aluminum Association welding specifications',
      'AWS C3.7 Aluminum Brazing and Soldering',
    ],
  },

  {
    level: 7,
    moduleNumber: '7.5',
    assignmentNumber: 'WA-7.5.2',
    orderIndex: 90,
    title: 'Stainless Steel Welding - Preventing Sensitization',
    description: 'Learn stainless steel welding with focus on preventing carbide precipitation and corrosion.',
    instructions: `1. Study stainless types: austenitic (304, 316), ferritic (430), martensitic (410)
2. Learn sensitization: carbide precipitation at grain boundaries (800-1500°F)
3. Practice low-heat-input welding: minimize time in sensitization range
4. Master purge gas technique: prevent sugaring (oxidation on backside)
5. Study filler metal selection: 308, 309, 316 for various base metals
6. Learn passivation: restore chromium oxide layer, citric or nitric acid
7. Practice inter-pass temperature control: max 350°F for austenitic
8. Understand dissimilar metal welding: stainless to carbon steel (309 filler)
9. Weld stainless exhaust system or food-grade equipment`,
    objectives: [
      'Weld stainless without sensitization',
      'Use purge gas to prevent oxidation',
      'Select appropriate stainless filler metal',
      'Passivate stainless after welding',
      'Control inter-pass temperature',
      'Weld dissimilar metals properly',
    ],
    skills: ['Stainless welding', 'Purge gas systems', 'Sensitization prevention', 'Passivation', 'Dissimilar metals'],
    expectedOutcome: 'Welded stainless steel assembly with no sugaring, proper purging, passivated surface.',
    passingCriteria: 'Backside is shiny (no oxidation), HAZ shows minimal discoloration, passes corrosion resistance test',
    referencePhotos: ['/curriculum/welding/stainless-tig.jpg', '/curriculum/welding/purge-setup.jpg', '/curriculum/welding/stainless-weld.jpg'],
    estimatedHours: 28,
    difficulty: 'expert',
    category: 'welding',
    subcategory: 'stainless',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Welding Stainless Steel" - Nickel Development Institute',
      'ASTM A380 - Descaling and Passivation of Stainless',
      'AWS D18.1 Stainless Steel Welding Code',
    ],
  },

  {
    level: 7,
    moduleNumber: '7.5',
    assignmentNumber: 'WA-7.5.3',
    orderIndex: 91,
    title: 'Titanium Welding - Aerospace Grade Material',
    description: 'Introduction to titanium welding - extremely reactive metal requiring inert atmosphere.',
    instructions: `1. Study titanium properties: high strength-to-weight, reactive above 800°F, expensive
2. Learn contamination sources: oxygen, nitrogen, hydrogen cause embrittlement
3. Practice trailing shield setup: large gas lens, extended coverage
4. Master purge box welding: weld inside argon-filled chamber
5. Study titanium alloys: commercially pure (Grade 2), Ti-6Al-4V (Grade 5)
6. Learn color inspection: silver = good, gold = acceptable, blue/purple = contaminated
7. Practice filler wire handling: keep clean, no touching, dedicated storage
8. Understand hot cracking in titanium: slow cooling, proper filler selection
9. Weld titanium sample coupons with trailing shield`,
    objectives: [
      'Set up inert atmosphere for titanium welding',
      'Prevent contamination during welding and cooling',
      'Use trailing shields effectively',
      'Inspect titanium welds by color',
      'Understand titanium welding challenges',
    ],
    skills: ['Titanium welding', 'Inert atmosphere control', 'Contamination prevention', 'Trailing shields', 'Exotic materials'],
    expectedOutcome: 'Titanium weld samples with silver color (no contamination), proper shielding demonstrated.',
    passingCriteria: 'Weld and HAZ are silver color, no blue or purple contamination, proper shield coverage',
    referencePhotos: ['/curriculum/welding/titanium-setup.jpg', '/curriculum/welding/trailing-shield.jpg', '/curriculum/welding/titanium-weld-color.jpg'],
    estimatedHours: 20,
    difficulty: 'expert',
    category: 'welding',
    subcategory: 'exotic-materials',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Welding Titanium" - RMI Titanium Company',
      'AWS D17.1 Specification for Fusion Welding for Aerospace Applications',
      '"Titanium: A Technical Guide" by Matthew J. Donachie',
    ],
  },

  // Module 7.6: Weld Joint Design & WPS
  {
    level: 7,
    moduleNumber: '7.6',
    assignmentNumber: 'WA-7.6.1',
    orderIndex: 92,
    title: 'Weld Joint Design & Engineering',
    description: 'Learn to design welded joints for strength, manufacturability, and cost-effectiveness.',
    instructions: `1. Study joint types: butt, lap, T-joint, corner, edge
2. Learn edge preparation: bevel angle, root opening, root face, land
3. Practice stress analysis: tensile, shear, bending loads on welds
4. Master fillet weld sizing: effective throat, leg size, strength calculation
5. Study joint access: can you reach it to weld?, can you inspect it?
6. Learn design for manufacturability: minimize welding, use standard joints
7. Practice weld symbol application: complete specification on drawings
8. Understand codes and standards: AWS D1.1, ASME Section VIII, API 1104
9. Design welded bracket with proper joint design and weld sizing`,
    objectives: [
      'Select appropriate joint type for application',
      'Calculate required weld size for loads',
      'Design joints for accessibility',
      'Apply weld symbols correctly',
      'Design to relevant codes',
      'Balance strength, cost, and manufacturability',
    ],
    skills: ['Joint design', 'Weld sizing', 'Stress analysis', 'Code compliance', 'Engineering design'],
    expectedOutcome: 'Engineered welded bracket design with complete weld symbols, stress calculations, code compliance.',
    passingCriteria: 'Welds are properly sized for loads, joints are accessible, design meets code requirements',
    referencePhotos: ['/curriculum/welding/joint-design.jpg', '/curriculum/welding/weld-symbols.jpg', '/curriculum/welding/bracket-design.jpg'],
    estimatedHours: 24,
    difficulty: 'expert',
    category: 'engineering',
    subcategory: 'joint-design',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Design of Welded Structures" by Omer W. Blodgett (classic reference)',
      'AWS D1.1 - Design of welded connections',
      '"Structural Welding Code - Steel" AWS D1.1',
    ],
  },

  {
    level: 7,
    moduleNumber: '7.6',
    assignmentNumber: 'WA-7.6.2',
    orderIndex: 93,
    title: 'Welding Procedure Specifications (WPS) & Qualification',
    description: 'Learn to write and qualify welding procedures per ASME Section IX and AWS codes.',
    instructions: `1. Study WPS components: base metals, filler metals, positions, variables
2. Learn essential variables: changes that require re-qualification
3. Practice writing Preliminary WPS (pWPS): specify all parameters
4. Master Procedure Qualification Record (PQR): document actual test weld
5. Study Welder Performance Qualification (WPQ): certify welders
6. Learn destructive testing: tensile test, bend tests, macro etch
7. Practice welding to procedure: follow WPS exactly, document
8. Understand variable ranges: what's covered by each qualification
9. Write WPS, perform PQR testing, qualify procedure per ASME IX`,
    objectives: [
      'Write complete Welding Procedure Specification',
      'Perform Procedure Qualification Record testing',
      'Understand essential variables',
      'Conduct required destructive tests',
      'Document qualification results',
      'Maintain welder qualification records',
    ],
    skills: ['WPS development', 'Procedure qualification', 'Destructive testing', 'Quality documentation', 'Code compliance'],
    expectedOutcome: 'Complete WPS with supporting PQR documentation, including bend test results and macro photos.',
    passingCriteria: 'WPS is complete and code-compliant, PQR tests pass acceptance criteria, proper documentation',
    referencePhotos: ['/curriculum/welding/wps-document.jpg', '/curriculum/welding/bend-testing.jpg', '/curriculum/welding/macro-etch.jpg'],
    estimatedHours: 28,
    difficulty: 'expert',
    category: 'quality-control',
    subcategory: 'wps',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'ASME Boiler and Pressure Vessel Code Section IX - Welding Qualifications',
      'AWS D1.1 - Qualification requirements',
      '"Welding Procedure Specification Guide" - AWS',
    ],
  },

  // Module 7.7: Production Welding & Automation
  {
    level: 7,
    moduleNumber: '7.7',
    assignmentNumber: 'WA-7.7.1',
    orderIndex: 94,
    title: 'Robotic Welding Fundamentals - Programming & Setup',
    description: 'Introduction to robotic welding systems - the future of production welding.',
    instructions: `1. Study robotic welding systems: teach pendant, controller, robot arm, welding power source
2. Learn safety systems: light curtains, e-stops, safeguarding
3. Practice teach pendant operation: move robot, save points, create program
4. Master coordinate systems: world, tool, user frames
5. Study weld parameters: wire feed speed, voltage, travel speed
6. Learn touch sensing: automatic seam finding, adaptive programs
7. Practice fixturing for robots: repeatability, access, clamping
8. Understand offline programming: simulation software, CAD-based programming
9. Program robot to weld simple part with multiple welds`,
    objectives: [
      'Operate robotic welding teach pendant',
      'Create simple weld programs',
      'Set welding parameters for robot',
      'Design fixtures for robotic welding',
      'Understand robot safety systems',
    ],
    skills: ['Robotic welding', 'Robot programming', 'Fixturing', 'Production welding', 'Automation'],
    expectedOutcome: 'Programmed robotic weld sequence producing consistent parts, documented program and parameters.',
    passingCriteria: 'Robot produces consistent welds, program runs without errors, welds meet quality standards',
    referencePhotos: ['/curriculum/welding/robot-welding.jpg', '/curriculum/welding/teach-pendant.jpg', '/curriculum/welding/robot-fixture.jpg'],
    estimatedHours: 32,
    difficulty: 'expert',
    category: 'automation',
    subcategory: 'robotic-welding',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Robotic welding system manuals (Fanuc, ABB, Yaskawa)',
      'AWS D16.4 Robotic Arc Welding Safety',
      'Robot programming fundamentals',
    ],
  },

  {
    level: 7,
    moduleNumber: '7.7',
    assignmentNumber: 'WA-7.7.2',
    orderIndex: 95,
    title: 'Welding Jigs & Fixtures - Design for Production',
    description: 'Design and build welding fixtures to ensure repeatability, quality, and efficiency.',
    instructions: `1. Study fixture design principles: 3-2-1 locating, clamp near support, repeatability
2. Learn fixturing materials: steel, cast iron, aluminum, ceramics (heat resistance)
3. Practice quick-release clamping: toggle clamps, cam locks, air cylinders
4. Master access planning: weld gun clearance, fixture design for minimal interference
5. Study modular fixturing systems: build tables, BuildPro, Fireball Tool
6. Learn distortion control: fixture restraint, welding sequence, heat sinks
7. Practice fixture verification: check dimensions, adjust as needed
8. Understand production flow: minimize handling, batch similar parts
9. Design and build fixture for recurring welded part`,
    objectives: [
      'Design fixtures using 3-2-1 locating principle',
      'Select appropriate clamping methods',
      'Provide weld access in fixture design',
      'Use modular fixturing systems',
      'Control distortion with fixtures',
      'Optimize for production efficiency',
    ],
    skills: ['Fixture design', 'Jig building', 'Production planning', 'Distortion control', 'Manufacturing engineering'],
    expectedOutcome: 'Custom welding fixture producing repeatable parts, documented design and setup instructions.',
    passingCriteria: 'Fixture locates parts accurately, parts are square and dimensionally correct, easy to load/unload',
    referencePhotos: ['/curriculum/welding/weld-fixture.jpg', '/curriculum/welding/modular-table.jpg', '/curriculum/welding/toggle-clamps.jpg'],
    estimatedHours: 28,
    difficulty: 'expert',
    category: 'production',
    subcategory: 'fixturing',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Jigs and Fixtures Design Manual" by Erik Karl Henriksen',
      'Modular fixturing system catalogs (Stronghand, BuildPro)',
      'Welding distortion control techniques',
    ],
  },

  // Module 7.8: Specialty Welding Applications
  {
    level: 7,
    moduleNumber: '7.8',
    assignmentNumber: 'WA-7.8.1',
    orderIndex: 96,
    title: 'Cast Iron Welding & Repair',
    description: 'Learn specialized techniques for welding and repairing cast iron - challenging but valuable skill.',
    instructions: `1. Study cast iron types: gray, ductile, malleable, white (unweldable)
2. Learn preheating requirements: 500-1200°F to prevent cracking
3. Practice nickel rod welding: Ni-55 filler, produces machinable weld
4. Master stud welding: drill/tap holes, weld studs, build up surface
5. Study brazing cast iron: lower temperature, less stress, excellent for repairs
6. Learn peening technique: peen each weld bead while hot, relieve stress
7. Practice slow cooling: bury in sand, lime, or vermiculite
8. Understand when NOT to weld: white cast iron, heavily cracked parts
9. Repair cracked cast iron engine block or machine casting`,
    objectives: [
      'Identify weldable cast iron types',
      'Preheat cast iron properly',
      'Weld cast iron with nickel rod',
      'Braze cast iron repairs',
      'Control cooling rate to prevent cracking',
      'Make successful cast iron repairs',
    ],
    skills: ['Cast iron welding', 'Preheating', 'Nickel rod welding', 'Brazing', 'Repair techniques'],
    expectedOutcome: 'Repaired cast iron part with sound weld, no additional cracking, proper heat treatment.',
    passingCriteria: 'Repair is sound (no cracks), part can be machined if needed, proper preheat and cool-down used',
    referencePhotos: ['/curriculum/welding/cast-iron-preheat.jpg', '/curriculum/welding/nickel-weld.jpg', '/curriculum/welding/cast-iron-repair.jpg'],
    estimatedHours: 20,
    difficulty: 'expert',
    category: 'repair',
    subcategory: 'cast-iron',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Cast Iron Welding and Repair" - Lincoln Electric guide',
      'Nickel electrode selection guides',
      'Cast iron metallurgy basics',
    ],
  },

  {
    level: 7,
    moduleNumber: '7.8',
    assignmentNumber: 'WA-7.8.2',
    orderIndex: 97,
    title: 'Hard-facing & Wear Resistant Surfacing',
    description: 'Apply wear-resistant coatings to extend service life of parts subjected to abrasion, impact, or erosion.',
    instructions: `1. Study wear types: abrasion, impact, erosion, corrosion
2. Learn hard-facing electrodes: high-carbon, tungsten carbide, chromium carbide
3. Practice buildup welding: repair worn surfaces before hard-facing
4. Master butter layers: intermediate layer between base and hardfacing
5. Study hardfacing patterns: stringer beads, weave beads, checkering
6. Learn grinding hardfacing: carbide tools required, very hard material
7. Practice tempering: reduce cracking risk with post-weld heat
8. Understand dilution: mixing of base metal reduces hardness
9. Hardface bucket teeth, plow shares, or crusher hammers`,
    objectives: [
      'Select appropriate hardfacing alloy for wear type',
      'Apply hardfacing with proper technique',
      'Build up worn parts before hardfacing',
      'Use butter layers when needed',
      'Minimize dilution for maximum hardness',
      'Prevent cracking in hardfacing',
    ],
    skills: ['Hardfacing', 'Wear resistance', 'Buildup welding', 'Alloy selection', 'Surface engineering'],
    expectedOutcome: 'Hardfaced parts showing proper bead pattern, minimal cracking, significantly extended wear life.',
    passingCriteria: 'Hardfacing is well-bonded, minimal cracking, proper hardness (file test), good coverage',
    referencePhotos: ['/curriculum/welding/hardfacing-beads.jpg', '/curriculum/welding/hardfaced-part.jpg', '/curriculum/welding/wear-comparison.jpg'],
    estimatedHours: 22,
    difficulty: 'expert',
    category: 'surfacing',
    subcategory: 'hardfacing',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Hardfacing and It\'s Application" - Stoody Company',
      'Hardfacing electrode selection guides',
      'Wear mechanisms and alloy selection',
    ],
  },

  // Module 7.9: Level 7 Project
  {
    level: 7,
    moduleNumber: '7.9',
    assignmentNumber: 'WA-7.9.1',
    orderIndex: 98,
    title: 'Level 7 Project: Welded Aluminum Fuel Tank for Rocket',
    description: 'Integrate all Level 7 welding skills to fabricate aluminum fuel tank for rocket project - aerospace quality work.',
    instructions: `1. Design aluminum fuel tank: cylindrical, hemispherical ends, welded seams, pressure-rated
2. Calculate wall thickness: pressure rating, safety factor, alloy selection (5052-H32)
3. Create complete WPS for aluminum tank welding: TIG process, filler (5356), positions
4. Roll aluminum cylinder from flat sheet: forming, fit-up, tack welding
5. Weld longitudinal seam with TIG: root pass, fill passes, proper purging
6. Fabricate hemispherical heads: segmented gore method or spun heads
7. Weld circumferential seams: head-to-cylinder, complete penetration
8. Perform non-destructive testing: liquid penetrant, leak test (bubble test)
9. Conduct hydrostatic test: 1.5× design pressure, no leaks
10. Document entire process: WPS, welding logs, inspection results`,
    objectives: [
      'Design pressure vessel to code',
      'Fabricate aluminum pressure vessel',
      'Produce aerospace-quality TIG welds',
      'Execute complete welding procedure',
      'Perform all required inspections',
      'Create professional documentation',
    ],
    skills: ['Complete welding workflow', 'Aluminum TIG welding', 'Pressure vessel fabrication', 'Inspection', 'Quality documentation'],
    expectedOutcome: 'Completed aluminum fuel tank, hydrostatically tested and documented, ready for rocket integration.',
    passingCriteria: 'All welds pass visual and PT inspection, tank holds hydrostatic test, complete documentation package',
    referencePhotos: ['/curriculum/projects/tank-design.jpg', '/curriculum/projects/tank-welding.jpg', '/curriculum/projects/completed-tank.jpg'],
    estimatedHours: 80,
    difficulty: 'expert',
    category: 'projects',
    subcategory: 'level-7',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Review ALL Level 7 reading materials',
      'ASME Section VIII - Pressure Vessels',
      'Aluminum tank fabrication guides',
    ],
    crossReferences: ['Level 12 Rocket Project will use this tank'],
  },

  {
    level: 7,
    moduleNumber: '7.9',
    assignmentNumber: 'WA-7.9.2',
    orderIndex: 98.5,
    title: 'Welding Inspection & Quality Control',
    description: 'Learn to inspect welds, identify defects, and perform quality control procedures to aerospace standards.',
    instructions: `1. Study welding defects: porosity, undercut, overlap, lack of fusion, cracks, spatter
2. Learn visual inspection techniques: proper lighting, magnification, inspection sequence
3. Practice weld gauges: fillet weld gauge, undercut gauge, crown height
4. Master liquid penetrant testing (PT): cleaner, penetrant, developer, defect interpretation
5. Learn magnetic particle testing (MT): yoke method, current requirements, defect patterns
6. Study ultrasonic testing (UT) basics: sound waves, coupling, reflection patterns
7. Practice radiographic interpretation: reading X-ray films, defect identification
8. Understand acceptance criteria: AWS D1.1, ASME Section IX, aerospace specs
9. Complete weld inspection certification prep: CWI study materials
10. Inspect sample welds and document findings with rejection/acceptance decisions`,
    objectives: [
      'Perform visual weld inspection to code',
      'Conduct liquid penetrant testing',
      'Identify all major weld defects',
      'Use weld gauges correctly',
      'Apply acceptance criteria from codes',
      'Document inspection results professionally',
    ],
    skills: ['Visual inspection', 'NDT methods', 'Defect identification', 'Code interpretation', 'Quality documentation', 'Acceptance criteria'],
    expectedOutcome: 'Complete inspection report of 10 sample welds with defect identification, measurements, and accept/reject decisions per code.',
    passingCriteria: 'Correctly identify 90% of planted defects, proper gauge use, inspection report meets code documentation requirements',
    referencePhotos: ['/curriculum/welding/visual-inspection.jpg', '/curriculum/welding/pt-testing.jpg', '/curriculum/welding/weld-gauges.jpg'],
    estimatedHours: 32,
    difficulty: 'expert',
    category: 'welding',
    subcategory: 'quality-control',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'AWS D1.1 - Structural Welding Code (inspection sections)',
      'ASME Section IX - Welding qualifications and inspection',
      '"Welding Inspection Technology" by AWS',
      'CWI (Certified Welding Inspector) study guide',
    ],
    crossReferences: ['Critical for aerospace work in Levels 11-12'],
  },

  // ============================================================================
  // LEVEL 8: MACHINING & PRECISION METALWORK (Months 25-27)
  // ============================================================================

  {
    level: 8,
    moduleNumber: '8.1',
    assignmentNumber: 'WA-8.1.1',
    orderIndex: 100,
    title: 'Manual Lathe Operation - Turning Between Centers',
    description: 'Master the lathe - the king of machine tools. Learn to turn cylindrical parts, faces, and tapers with precision.',
    instructions: `1. Study lathe anatomy: headstock, tailstock, carriage, compound, cross-slide, ways
2. Learn work holding: 3-jaw chuck, 4-jaw chuck, collets, between centers
3. Practice tool setup: cutting tool height (on center), tool bit grinding
4. Master turning operations: facing, straight turning, taper turning, grooving
5. Learn to read dial indicators: 0.001" precision
6. Practice speed and feed selection: calculate RPM from surface feet per minute (SFM)
7. Study cutting fluids: when to use, which type for each material
8. Turn precision shafts to ±0.001" tolerance
9. Create internal tapers using compound rest
10. Turn Morse taper arbors for tool holding`,
    objectives: [
      'Set up and operate manual lathe safely',
      'Turn parts to precision tolerances (±0.001")',
      'Calculate proper speeds and feeds for different materials',
      'Use cutting tools correctly for various operations',
      'Measure parts accurately with micrometers and calipers',
    ],
    skills: ['Lathe operation', 'Precision turning', 'Tool grinding', 'Metrology', 'Speed/feed calculation'],
    expectedOutcome: 'Series of turned parts demonstrating precision: shafts, tapers, grooves, all within tolerance.',
    passingCriteria: 'All dimensions within ±0.001", surface finish is smooth, tapers are accurate, no chatter marks',
    referencePhotos: ['/curriculum/metal/lathe-operation.jpg', '/curriculum/metal/turning-precision.jpg', '/curriculum/metal/turned-parts.jpg'],
    estimatedHours: 50,
    difficulty: 'advanced',
    category: 'machining',
    subcategory: 'lathe',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"How to Run a Lathe" - South Bend Lathe Company (classic reference)',
      '"Machinery\'s Handbook" - sections on turning and speeds/feeds',
      '"Machine Shop Practice" by K.H. Moltrecht (volumes 1 & 2)',
    ],
  },

  {
    level: 8,
    moduleNumber: '8.1',
    assignmentNumber: 'WA-8.1.2',
    orderIndex: 101,
    title: 'Advanced Lathe Operations - Boring, Knurling & Form Tools',
    description: 'Master advanced lathe techniques including precision boring, knurling, form tools, and parting off.',
    instructions: `1. Study boring bar setup: rigidity, overhang, carbide vs HSS boring bars
2. Learn boring operations: bore to precise diameter, bore to depth, counterbore
3. Practice precision boring: internal diameter within ±0.0005", concentricity to OD
4. Master knurling: diamond knurl, straight knurl, proper pressure and feed
5. Learn form tool design: grind custom radius and contour tools
6. Practice form tool use: create complex profiles in single pass
7. Study parting off: blade height, feed rate, coolant importance, chip clearance
8. Learn deep hole drilling: pilot hole, peck cycle, coolant through spindle
9. Practice compound operations: bore, face internal shoulder, internal groove
10. Create precision bushings: bore ID, turn OD, both concentric within 0.001"`,
    objectives: [
      'Bore precision internal diameters (±0.0005")',
      'Produce professional knurled surfaces',
      'Design and use form tools',
      'Part off without burrs or distortion',
      'Maintain concentricity between ID and OD',
      'Execute complex multi-operation parts',
    ],
    skills: ['Precision boring', 'Knurling', 'Form tools', 'Parting off', 'Concentricity control', 'Tool design'],
    expectedOutcome: 'Set of precision bushings with knurled exterior, parts with formed radii, successful parting operations.',
    passingCriteria: 'Bored holes within ±0.0005", knurl is complete and uniform, form tools produce smooth contours, parted parts have no burrs',
    referencePhotos: ['/curriculum/machining/boring-operation.jpg', '/curriculum/machining/knurling.jpg', '/curriculum/machining/form-tool-parts.jpg'],
    estimatedHours: 32,
    difficulty: 'expert',
    category: 'machining',
    subcategory: 'lathe',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Precision Boring Techniques" - machining handbooks',
      '"Form Tool Design and Use" - technical articles',
      'Knurling standards and best practices',
    ],
  },

  {
    level: 8,
    moduleNumber: '8.2',
    assignmentNumber: 'WA-8.2.1',
    orderIndex: 105,
    title: 'Manual Milling Machine Operation',
    description: 'Master the milling machine for creating flat surfaces, slots, gears, and complex shapes. Precision is paramount.',
    instructions: `1. Study milling machine types: vertical mill, horizontal mill, knee mill
2. Learn work holding: vise, clamps, angle plate, rotary table
3. Practice edge finding: wiggler, edge finder, precision to 0.001"
4. Master milling operations: face milling, end milling, slot cutting, drilling
5. Learn cutter selection: HSS vs carbide, number of flutes, coating
6. Calculate speeds and feeds for milling: chip load, feed rate
7. Practice climb milling vs conventional milling (when to use each)
8. Create precision flat surfaces (within 0.001" across 12")
9. Mill slots and pockets with dimensional accuracy
10. Use dividing head for gear and polygon cutting`,
    objectives: [
      'Set up and operate manual milling machine',
      'Hold work securely and accurately',
      'Find edges and zero coordinates precisely',
      'Mill parts to drawing specifications (±0.002")',
      'Select appropriate cutters and parameters',
      'Produce flat surfaces and accurate features',
    ],
    skills: ['Milling operation', 'Work holding', 'Edge finding', 'Precision machining', 'Cutter selection'],
    expectedOutcome: 'Milled parts demonstrating: flat surfaces, precise slots, accurate holes, good surface finish.',
    passingCriteria: 'All dimensions within ±0.002", surfaces are flat and square, slots are parallel, finish is smooth',
    referencePhotos: ['/curriculum/metal/milling-machine.jpg', '/curriculum/metal/work-holding.jpg', '/curriculum/metal/milled-parts.jpg'],
    estimatedHours: 50,
    difficulty: 'advanced',
    category: 'machining',
    subcategory: 'milling',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Milling Machine Practices" by John R. Walker',
      '"Machinery\'s Handbook" - sections on milling',
      '"Machine Shop Trade Secrets" by James A. Harvey',
    ],
  },

  {
    level: 8,
    moduleNumber: '8.2',
    assignmentNumber: 'WA-8.2.2',
    orderIndex: 105.5,
    title: 'Precision Mill Work - Angles, Dovetails & Complex Setups',
    description: 'Advanced milling techniques for angular cuts, dovetail ways, sine plates, and complex multi-axis setups.',
    instructions: `1. Study angle milling methods: swivel vise, sine plate, tilting table, compound angle
2. Learn sine plate mathematics: sine bar length, gauge block height for desired angle
3. Practice dovetail cutting: male and female dovetails, slide ways, fitting to tolerance
4. Master rotary table use: indexing, circular milling, bolt circle patterns
5. Learn boring head use: precision diameter adjustment, boring internal features
6. Practice T-slot cutting: proper cutter selection, depth control, chip clearance
7. Study tramming: align mill head perpendicular to table within 0.0005"
8. Learn multi-axis setups: compound angles, complex fixtures, workpiece orientation
9. Practice precision squaring: perpendicular faces, parallelism, flatness
10. Create dovetail slide assembly: male and female parts that fit with 0.002" clearance`,
    objectives: [
      'Set up sine plate for precise angles',
      'Mill dovetail ways to tight tolerance',
      'Use rotary table for circular and indexed operations',
      'Bore precision holes with boring head',
      'Tram mill head for perpendicularity',
      'Execute complex multi-axis setups',
    ],
    skills: ['Angle milling', 'Dovetail cutting', 'Sine plate setup', 'Rotary table', 'Boring head', 'Tramming', 'Complex setups'],
    expectedOutcome: 'Dovetail slide assembly, parts with precision angles, bolt circle patterns, demonstrating advanced mill work.',
    passingCriteria: 'Angles within ±0.1°, dovetails fit with proper clearance, surfaces are square and perpendicular, bored holes concentric',
    referencePhotos: ['/curriculum/machining/sine-plate.jpg', '/curriculum/machining/dovetail-cutting.jpg', '/curriculum/machining/rotary-table.jpg'],
    estimatedHours: 36,
    difficulty: 'expert',
    category: 'machining',
    subcategory: 'milling',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Advanced Milling Techniques" - machining handbooks',
      '"Sine Bar and Sine Plate Handbook"',
      '"Dovetail Ways Construction" - technical articles',
    ],
  },

  // Module 8.3: Threading & Boring
  {
    level: 8,
    moduleNumber: '8.3',
    assignmentNumber: 'WA-8.3.1',
    orderIndex: 106,
    title: 'Thread Cutting on the Lathe - External & Internal',
    description: 'Learn to cut precision threads on the lathe using change gears or quick-change gearbox.',
    instructions: `1. Study thread forms: 60° unified, 55° Whitworth, 29° Acme, square thread
2. Learn thread calculations: major diameter, minor diameter, pitch diameter, threads per inch
3. Practice change gear calculation: drive gear ratio for specific pitch
4. Master compound rest angle: 29° for American 60° thread (cutting on one flank)
5. Learn thread tool grinding: proper angles, relief, rake
6. Practice engaging half-nuts: thread dial indicator, consistent engagement point
7. Study spring passes: final light passes for smooth finish
8. Practice internal threading: boring first, then threading
9. Cut precision external threads: check with thread gauge and ring gauge
10. Cut precision internal threads: check with plug gauge`,
    objectives: [
      'Calculate and set up gear train for thread pitch',
      'Grind thread cutting tools properly',
      'Cut external threads to gauge',
      'Cut internal threads accurately',
      'Achieve proper thread form and fit',
      'Produce class 2A and 2B thread fits',
    ],
    skills: ['Thread cutting', 'Gear calculation', 'Tool grinding', 'Thread measurement', 'Precision machining'],
    expectedOutcome: 'Threaded parts (bolts and nuts) that properly engage, checked with thread gauges.',
    passingCriteria: 'Threads pass go/no-go gauge inspection, smooth operation, proper thread form visible',
    referencePhotos: ['/curriculum/machining/thread-cutting.jpg', '/curriculum/machining/thread-tool.jpg', '/curriculum/machining/threaded-parts.jpg'],
    estimatedHours: 28,
    difficulty: 'expert',
    category: 'machining',
    subcategory: 'threading',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Machinery\'s Handbook" - Threading section (essential)',
      'Thread standards: ANSI/ASME B1.1',
      '"Thread Cutting Methods" - South Bend Lathe manual',
    ],
  },

  {
    level: 8,
    moduleNumber: '8.3',
    assignmentNumber: 'WA-8.3.2',
    orderIndex: 107,
    title: 'Boring & Internal Machining',
    description: 'Master boring operations for creating precise internal diameters and features.',
    instructions: `1. Study boring bar types: solid, carbide insert, adjustable, fly cutter
2. Learn boring bar setup: minimize overhang, rigidity critical
3. Practice boring to size: incremental cuts, measure frequently
4. Master finish boring: achieve Ra 32 surface finish or better
5. Study chatter prevention: increase rigidity, reduce overhang, change speed
6. Learn taper boring: compound rest method, taper attachment
7. Practice precision hole sizing: bore to ±0.0005" tolerance
8. Study internal grooving and recessing
9. Machine internal features: keyways, splines (with broach)
10. Bore bearing fits: press fit (0.001" interference), running fit (0.0005" clearance)`,
    objectives: [
      'Set up boring bars for rigidity',
      'Bore holes to precision diameters',
      'Achieve excellent surface finish in bores',
      'Eliminate or minimize chatter',
      'Create internal tapers accurately',
      'Machine bearing fits to specification',
    ],
    skills: ['Boring operations', 'Internal machining', 'Chatter control', 'Precision measurement', 'Fit tolerances'],
    expectedOutcome: 'Bored parts with precision internal diameters, tested with plug gauges and bearing fits.',
    passingCriteria: 'All bores within ±0.0005", surface finish is smooth, proper fits achieved, no chatter marks',
    referencePhotos: ['/curriculum/machining/boring-operation.jpg', '/curriculum/machining/boring-bar.jpg', '/curriculum/machining/precision-bore.jpg'],
    estimatedHours: 24,
    difficulty: 'expert',
    category: 'machining',
    subcategory: 'boring',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Boring Operations" - Machinery\'s Handbook section',
      'Boring bar selection guides - Kennametal, Sandvik',
      'Surface finish standards and measurement',
    ],
  },

  // Module 8.4: Grinding Operations
  {
    level: 8,
    moduleNumber: '8.4',
    assignmentNumber: 'WA-8.4.1',
    orderIndex: 108,
    title: 'Surface Grinder Operation - Precision Flat Grinding',
    description: 'Master the surface grinder to achieve extremely flat, parallel surfaces with excellent finish.',
    instructions: `1. Study surface grinder types: horizontal spindle, vertical spindle, rotary table
2. Learn magnetic chuck: magnetize/demagnetize, workpiece setup, non-ferrous work holding
3. Practice wheel dressing: diamond dresser, frequency, dress for finish vs stock removal
4. Master spark-out: final pass with no infeed for dimensional accuracy
5. Study grinding wheel selection: aluminum oxide (steel), silicon carbide (carbide)
6. Learn downfeed increments: 0.001" rough, 0.0002" finish
7. Practice achieving flatness: 0.0002" across 12" surface
8. Study parallel grinding: flip and grind, check with indicator
9. Grind precision gage blocks and parallels
10. Achieve mirror finish with fine grit wheel (120-220 grit)`,
    objectives: [
      'Set up and operate surface grinder safely',
      'Dress grinding wheels properly',
      'Grind surfaces flat to 0.0002"',
      'Achieve parallel surfaces (±0.0001")',
      'Produce excellent surface finish (Ra 8-16)',
      'Work to precision tolerances',
    ],
    skills: ['Surface grinding', 'Wheel dressing', 'Magnetic chuck use', 'Precision measurement', 'Flatness achievement'],
    expectedOutcome: 'Ground parts with precision flatness, parallelism, and surface finish - verified with indicators.',
    passingCriteria: 'Surfaces flat within 0.0002", parallel within 0.0001", finish is mirror-smooth',
    referencePhotos: ['/curriculum/machining/surface-grinder.jpg', '/curriculum/machining/wheel-dressing.jpg', '/curriculum/machining/ground-surface.jpg'],
    estimatedHours: 32,
    difficulty: 'expert',
    category: 'machining',
    subcategory: 'grinding',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Grinding Technology" by Stephen Malkin',
      '"Machinery\'s Handbook" - Grinding section',
      'Norton grinding wheel selection guide',
    ],
  },

  {
    level: 8,
    moduleNumber: '8.4',
    assignmentNumber: 'WA-8.4.2',
    orderIndex: 109,
    title: 'Cylindrical Grinding - OD & ID Grinding',
    description: 'Learn cylindrical grinding for precision shafts, pins, and internal diameters.',
    instructions: `1. Study cylindrical grinder: work head, tailstock, wheel head, traverse
2. Learn work holding: centers, chucks, collets, mandrels for ID grinding
3. Practice wheel trueing: dress for cylindricity, balance wheel
4. Master traverse grinding: table speed, wheel depth, overlap
5. Study plunge grinding: grind to shoulder, form grinding
6. Learn internal grinding: small wheels, ID grinding attachments
7. Practice size control: work to ±0.0002" on diameter
8. Study taper grinding: swivel table, taper attachment
9. Grind precision shafts: roundness, straightness, surface finish
10. Achieve bearing-quality finish: Ra 8 or better`,
    objectives: [
      'Set up cylindrical grinder for OD grinding',
      'Grind cylindrical parts to tight tolerances',
      'Achieve roundness within 0.0001"',
      'Produce excellent surface finish',
      'Grind tapers accurately',
      'Perform internal grinding operations',
    ],
    skills: ['Cylindrical grinding', 'Roundness control', 'Taper grinding', 'ID grinding', 'Precision tolerances'],
    expectedOutcome: 'Ground shafts and bores with precision dimensions, excellent roundness and surface finish.',
    passingCriteria: 'Diameters within ±0.0002", roundness <0.0001", surface finish Ra 8-16, no grinding burns',
    referencePhotos: ['/curriculum/machining/cylindrical-grinder.jpg', '/curriculum/machining/od-grinding.jpg', '/curriculum/machining/ground-shaft.jpg'],
    estimatedHours: 30,
    difficulty: 'expert',
    category: 'machining',
    subcategory: 'grinding',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Cylindrical grinding handbooks - Studer, Landis',
      '"Precision Grinding" technical articles',
      'Grinding burn prevention and detection',
    ],
  },

  // Module 8.5: Toolmaking & Fixture Building
  {
    level: 8,
    moduleNumber: '8.5',
    assignmentNumber: 'WA-8.5.1',
    orderIndex: 110,
    title: 'Jig Boring & Precision Hole Location',
    description: 'Learn jig boring for extremely accurate hole positioning - critical for toolmaking and aerospace.',
    instructions: `1. Study jig boring machines: coordinate positioning, precision screws, optical measurement
2. Learn layout from datum: establish reference surfaces, coordinate system
3. Practice edge finding to 0.0001": electronic edge finder, precision techniques
4. Master hole location: calculate coordinates, position accurately
5. Study line boring: multiple holes on exact centerline
6. Learn precision reaming: achieve H7 hole tolerance (±0.0004")
7. Practice bolt hole circle layout: equally-spaced holes, precise angular positions
8. Study tooling plate drilling: precision hole patterns for fixtures
9. Create precision drill jig with ±0.001" hole location
10. Machine coordinate inspection plate for CMM verification`,
    objectives: [
      'Locate holes to ±0.001" positional accuracy',
      'Use precision measurement for hole positioning',
      'Create precision hole patterns',
      'Achieve tight hole tolerances',
      'Build tooling and fixtures with accuracy',
    ],
    skills: ['Jig boring', 'Precision layout', 'Hole location', 'Coordinate measurement', 'Toolmaking'],
    expectedOutcome: 'Precision-drilled tooling plate or fixture with holes located within ±0.001".',
    passingCriteria: 'All holes within ±0.001" of nominal position, hole-to-hole spacing accurate, proper fit',
    referencePhotos: ['/curriculum/machining/jig-boring.jpg', '/curriculum/machining/precision-layout.jpg', '/curriculum/machining/tooling-plate.jpg'],
    estimatedHours: 28,
    difficulty: 'expert',
    category: 'toolmaking',
    subcategory: 'jig-boring',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Toolmaking" by Frederic R. Palmer',
      'GD&T positional tolerance standards - ASME Y14.5',
      'Precision hole location techniques',
    ],
  },

  {
    level: 8,
    moduleNumber: '8.5',
    assignmentNumber: 'WA-8.5.2',
    orderIndex: 111,
    title: 'Hardening & Tempering Tool Steel',
    description: 'Learn heat treatment of tool steels - transform soft steel into hardened cutting tools and dies.',
    instructions: `1. Study tool steel types: O1 (oil hardening), A2 (air hardening), D2 (high chrome), S7 (shock resistant)
2. Learn heat treat process: normalize, harden, quench, temper
3. Practice temperature measurement: Tempilstiks, pyrometer, color (yellow=400°F, blue=600°F)
4. Master hardening: heat to critical temp (1475°F for O1), soak, quench
5. Study quenching media: water (severe), oil (moderate), air (mild)
6. Learn tempering: reduce hardness for toughness, temper curves
7. Practice testing hardness: file test, Rockwell hardness tester (HRC scale)
8. Study stress relief: prevent cracking, dimensional stability
9. Heat treat punches, dies, and cutting tools
10. Achieve target hardness: HRC 58-62 for cutting tools`,
    objectives: [
      'Select appropriate tool steel for application',
      'Heat treat tool steel to specification',
      'Achieve target hardness (HRC 58-62)',
      'Prevent cracking and distortion',
      'Temper for proper toughness',
      'Verify hardness with testing',
    ],
    skills: ['Heat treatment', 'Tool steel metallurgy', 'Hardness testing', 'Tempering', 'Quality control'],
    expectedOutcome: 'Heat-treated cutting tools and dies with proper hardness, minimal distortion, no cracks.',
    passingCriteria: 'Hardness within HRC ±2 of target, no cracks, tools cut properly when tested',
    referencePhotos: ['/curriculum/machining/heat-treat-furnace.jpg', '/curriculum/machining/quenching.jpg', '/curriculum/machining/hardness-test.jpg'],
    estimatedHours: 24,
    difficulty: 'expert',
    category: 'heat-treatment',
    subcategory: 'tool-steel',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Tool Steels" by George A. Roberts',
      'ASM Heat Treater\'s Guide',
      'Tool steel data sheets - Crucible, Bohler',
    ],
  },

  // Module 8.6: Inspection & Quality Control
  {
    level: 8,
    moduleNumber: '8.6',
    assignmentNumber: 'WA-8.6.1',
    orderIndex: 112,
    title: 'Advanced Metrology & CMM Inspection',
    description: 'Master precision measurement tools and coordinate measuring machine (CMM) for quality inspection.',
    instructions: `1. Study CMM basics: touch probe, 3-axis motion, coordinate system, datum establishment
2. Learn measurement tools: height gauge, optical comparator, vision system
3. Practice CMM programming: probe calibration, part alignment, feature measurement
4. Master GD&T inspection: flatness, perpendicularity, position, profile, runout
5. Study statistical process control (SPC): Cpk, control charts, capability analysis
6. Learn gauge calibration: traceability to NIST standards, calibration intervals
7. Practice first article inspection (FAI): complete dimensional report per AS9102
8. Study measurement uncertainty: understanding accuracy vs precision
9. Create inspection report with CMM data and GD&T callouts
10. Perform capability study on machined parts`,
    objectives: [
      'Operate CMM for dimensional inspection',
      'Measure GD&T features correctly',
      'Create professional inspection reports',
      'Understand measurement uncertainty',
      'Perform statistical analysis of parts',
      'Establish measurement traceability',
    ],
    skills: ['CMM operation', 'GD&T inspection', 'Metrology', 'SPC', 'Quality documentation'],
    expectedOutcome: 'Complete inspection report with CMM measurements, GD&T verification, statistical analysis.',
    passingCriteria: 'All measurements traceable, GD&T properly evaluated, report meets AS9102 requirements',
    referencePhotos: ['/curriculum/machining/cmm-machine.jpg', '/curriculum/machining/inspection-report.jpg', '/curriculum/machining/measurement.jpg'],
    estimatedHours: 26,
    difficulty: 'expert',
    category: 'quality-control',
    subcategory: 'metrology',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Fundamentals of Dimensional Metrology" by Ted Busch',
      'ASME Y14.5 GD&T standard',
      'AS9102 First Article Inspection requirements',
    ],
  },

  {
    level: 8,
    moduleNumber: '8.6',
    assignmentNumber: 'WA-8.6.2',
    orderIndex: 113,
    title: 'Optical Measurement & Surface Finish Analysis',
    description: 'Learn advanced optical measurement and surface texture analysis techniques.',
    instructions: `1. Study optical comparator: shadow projection, magnification (10×, 20×, 50×)
2. Learn vision systems: edge detection, automated measurement
3. Practice thread inspection: optical comparator with overlay charts
4. Master profilometer use: measure surface roughness Ra, Rz, Rt
5. Study surface finish standards: Ra values, roughness grades, manufacturing processes
6. Learn interferometry: flatness measurement to λ/10 (0.000002")
7. Practice radius measurement: optical comparator, radius gauges
8. Study form measurement: roundness, cylindricity, taper
9. Measure complex features: thread forms, gear teeth, cams
10. Create surface finish specification for machined parts`,
    objectives: [
      'Use optical comparator for precise measurement',
      'Measure surface finish with profilometer',
      'Inspect thread forms optically',
      'Understand surface finish specifications',
      'Measure complex geometric features',
      'Specify appropriate surface finishes',
    ],
    skills: ['Optical measurement', 'Surface finish analysis', 'Thread inspection', 'Form measurement', 'Quality specification'],
    expectedOutcome: 'Inspection report including optical measurements, surface finish data, thread verification.',
    passingCriteria: 'Measurements accurate and repeatable, surface finish documented, thread forms verified',
    referencePhotos: ['/curriculum/machining/optical-comparator.jpg', '/curriculum/machining/profilometer.jpg', '/curriculum/machining/surface-finish.jpg'],
    estimatedHours: 22,
    difficulty: 'expert',
    category: 'quality-control',
    subcategory: 'optical-measurement',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Surface texture standards - ASME B46.1',
      'Optical comparator operation manuals',
      '"Surface Texture Analysis" technical papers',
    ],
  },

  // Module 8.7: Advanced Machining Techniques
  {
    level: 8,
    moduleNumber: '8.7',
    assignmentNumber: 'WA-8.7.1',
    orderIndex: 114,
    title: 'EDM - Electrical Discharge Machining',
    description: 'Learn EDM for machining hardened steel and complex shapes impossible with conventional methods.',
    instructions: `1. Study EDM principles: spark erosion, dielectric fluid, electrode erosion
2. Learn wire EDM: wire path, submerged cutting, no cutting forces
3. Practice ram/sinker EDM: graphite electrodes, cavity machining
4. Master EDM parameters: on-time, off-time, current, voltage
5. Study surface finish control: rough cut vs finish cut
6. Learn electrode design: graphite machining, copper electrodes
7. Practice small hole drilling: EDM drill, 0.010" holes in hardened steel
8. Study flushing: remove debris, maintain dielectric properties
9. Machine hardened tool steel (HRC 60+) with EDM
10. Create complex cavity in die steel for injection molding`,
    objectives: [
      'Understand EDM process and parameters',
      'Set up and operate wire EDM',
      'Machine hardened materials',
      'Create complex cavities and features',
      'Control surface finish with EDM',
      'Design and make EDM electrodes',
    ],
    skills: ['EDM operation', 'Wire EDM', 'Electrode design', 'Hardened steel machining', 'Die making'],
    expectedOutcome: 'EDM-machined parts in hardened steel showing complex features, good surface finish.',
    passingCriteria: 'Parts meet dimensional requirements, surface finish is acceptable, no thermal damage',
    referencePhotos: ['/curriculum/machining/wire-edm.jpg', '/curriculum/machining/edm-electrodes.jpg', '/curriculum/machining/edm-parts.jpg'],
    estimatedHours: 30,
    difficulty: 'expert',
    category: 'advanced-machining',
    subcategory: 'edm',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'EDM operation manuals - Mitsubishi, GF Machining',
      '"EDM Handbook" technical references',
      'Electrode design and material selection guides',
    ],
  },

  {
    level: 8,
    moduleNumber: '8.7',
    assignmentNumber: 'WA-8.7.2',
    orderIndex: 115,
    title: 'Broaching & Gear Cutting',
    description: 'Learn broaching for internal features and basic gear cutting techniques.',
    instructions: `1. Study broaching process: linear cutting tool, progressive teeth
2. Learn broach types: keyway broach, spline broach, surface broach
3. Practice keyway broaching: internal keyway in shaft bore
4. Master broach setup: alignment, support, proper pressing
5. Study gear cutting: involute profile, gear terminology
6. Learn gear hobbing: generate gears with rotating hob
7. Practice spur gear cutting on mill with indexing head
8. Study module and diametral pitch systems
9. Cut keyway using broach in hydraulic press
10. Cut spur gear with proper tooth form and spacing`,
    objectives: [
      'Understand broaching principles',
      'Broach keyways and splines accurately',
      'Calculate gear parameters',
      'Cut spur gears with correct tooth form',
      'Use indexing head for gear cutting',
      'Inspect gear tooth form',
    ],
    skills: ['Broaching', 'Gear cutting', 'Indexing', 'Gear design', 'Internal features'],
    expectedOutcome: 'Broached keyways and cut spur gears with proper dimensions and tooth form.',
    passingCriteria: 'Keyways fit properly, gears mesh correctly, tooth form is accurate',
    referencePhotos: ['/curriculum/machining/broaching.jpg', '/curriculum/machining/gear-cutting.jpg', '/curriculum/machining/cut-gears.jpg'],
    estimatedHours: 26,
    difficulty: 'expert',
    category: 'specialized-machining',
    subcategory: 'broaching-gears',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Broaching" - Machinery\'s Handbook section',
      '"Gear Handbook" by Darle W. Dudley',
      'AGMA gear standards and calculations',
    ],
  },

  // Module 8.8: Multi-Axis Manual Machining
  {
    level: 8,
    moduleNumber: '8.8',
    assignmentNumber: 'WA-8.8.1',
    orderIndex: 116,
    title: 'Rotary Table & Indexing Head Mastery',
    description: 'Master rotary table and indexing head for complex angle work and multi-sided parts.',
    instructions: `1. Study rotary table: horizontal, vertical mounting, 90:1 worm ratio
2. Learn angular indexing: calculate handle turns for any angle
3. Practice bolt hole circles: equally-spaced holes, precision angular positions
4. Master indexing head: direct indexing, simple indexing, differential indexing
5. Study compound angles: combine table rotation with head tilt
6. Learn spiral milling: generate helical grooves
7. Practice making hex stock: index 6 times, mill flats
8. Study cam milling: rotary table coordinated with feed
9. Mill precision polygon (hexagon, octagon) on round stock
10. Create complex part requiring multiple indexing operations`,
    objectives: [
      'Calculate indexing for any angle or division',
      'Use rotary table for precision angle work',
      'Mill polygons and flats on round stock',
      'Create bolt hole patterns accurately',
      'Perform compound angle machining',
      'Coordinate rotary motion with linear feeds',
    ],
    skills: ['Rotary table use', 'Indexing calculations', 'Angular machining', 'Compound setups', 'Multi-axis work'],
    expectedOutcome: 'Multi-sided parts and bolt hole patterns with precision angular spacing.',
    passingCriteria: 'All angles within ±0.1°, hole spacing is equal, polygons are symmetrical',
    referencePhotos: ['/curriculum/machining/rotary-table.jpg', '/curriculum/machining/indexing-head.jpg', '/curriculum/machining/polygon-milling.jpg'],
    estimatedHours: 28,
    difficulty: 'expert',
    category: 'advanced-machining',
    subcategory: 'multi-axis',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Dividing Head Manual" - Brown & Sharpe',
      'Indexing calculations and tables',
      '"Advanced Milling Techniques" articles',
    ],
  },

  {
    level: 8,
    moduleNumber: '8.8',
    assignmentNumber: 'WA-8.8.2',
    orderIndex: 117,
    title: 'Manual Multi-Axis Machining Integration',
    description: 'Combine all manual machining skills to create complex aerospace-grade components.',
    instructions: `1. Study complex part setup: multiple operations, datum transformation
2. Learn operation sequencing: rough first, finish last, maintain datums
3. Practice workpiece coordination: transfer from lathe to mill to grinder
4. Master fixturing: design holding fixtures for complex geometries
5. Study tolerance stack-up: how tolerances accumulate through operations
6. Learn in-process inspection: verify critical dimensions before proceeding
7. Practice deburring and edge break: cosmetic and functional requirements
8. Study cleanliness: chip removal, coolant management, rust prevention
9. Machine complex part requiring lathe, mill, grinder, and heat treat
10. Create manufacturing process plan for multi-operation part`,
    objectives: [
      'Plan complete machining sequence',
      'Maintain tolerances through multiple operations',
      'Design fixtures for complex parts',
      'Coordinate between different machines',
      'Perform in-process inspection',
      'Produce aerospace-quality components',
    ],
    skills: ['Process planning', 'Multi-operation machining', 'Tolerance management', 'Fixture design', 'Manufacturing engineering'],
    expectedOutcome: 'Complex machined part meeting all specifications, with complete process documentation.',
    passingCriteria: 'All dimensions and GD&T within spec, surface finish correct, part functions as intended',
    referencePhotos: ['/curriculum/machining/complex-part.jpg', '/curriculum/machining/multi-setup.jpg', '/curriculum/machining/finished-component.jpg'],
    estimatedHours: 32,
    difficulty: 'expert',
    category: 'manufacturing',
    subcategory: 'integration',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Manufacturing Processes for Engineering Materials" by Kalpakjian',
      'Process planning methodologies',
      'Aerospace machining standards',
    ],
  },

  {
    level: 8,
    moduleNumber: '8.8',
    assignmentNumber: 'WA-8.8.3',
    orderIndex: 117.5,
    title: 'Heat Treatment & Hardening - Steel Metallurgy',
    description: 'Learn heat treatment fundamentals: hardening, tempering, annealing, and case hardening for aerospace applications.',
    instructions: `1. Study steel metallurgy: carbon content, alloy elements, phase diagrams
2. Learn hardening process: austenitizing temperature, quench media selection, hardness prediction
3. Practice tempering: temperature vs hardness curves, color indication, stress relief
4. Master annealing: full anneal, stress relief anneal, process anneal
5. Study case hardening: carburizing, nitriding, carbonitriding, surface vs core hardness
6. Learn quench media: water, oil, brine, polymer, air - pros and cons
7. Practice Rockwell hardness testing: proper technique, B and C scales
8. Study heat treat furnaces: temperature control, atmosphere control, pyrometry
9. Heat treat tool steel samples: O1, A2, D2 - measure results
10. Heat treat aerospace fasteners: 4340 steel bolts, verify strength`,
    objectives: [
      'Understand steel phase transformations',
      'Harden steel to target Rockwell hardness',
      'Temper hardened steel to desired toughness',
      'Perform case hardening operations',
      'Measure and verify hardness accurately',
      'Heat treat aerospace components to specification',
    ],
    skills: ['Heat treatment', 'Metallurgy', 'Hardness testing', 'Quenching', 'Tempering', 'Quality control'],
    expectedOutcome: 'Heat-treated samples demonstrating hardening, tempering, and case hardening with measured hardness values.',
    passingCriteria: 'Achieve target Rockness within ±2 HRC, no quench cracks, proper microstructure visible under microscope',
    referencePhotos: ['/curriculum/machining/heat-treat-furnace.jpg', '/curriculum/machining/quenching.jpg', '/curriculum/machining/hardness-testing.jpg'],
    estimatedHours: 28,
    difficulty: 'expert',
    category: 'machining',
    subcategory: 'heat-treatment',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Practical Heat Treating" by ASM International',
      '"Steel Heat Treatment Handbook" by George E. Totten',
      'Heat treatment standards: AMS 2759, AMS 2750',
      '"Metallurgy for the Non-Metallurgist" by ASM',
    ],
    crossReferences: ['Critical for rocket engine components in Levels 11-12'],
  },

  // Module 8.9: Level 8 Project
  {
    level: 8,
    moduleNumber: '8.9',
    assignmentNumber: 'WA-8.9.1',
    orderIndex: 118,
    title: 'Level 8 Project: Precision Rocket Engine Injector Plate',
    description: 'Machine a rocket engine injector plate - ultimate test of precision machining skills. Requires lathe, mill, drill, and inspection.',
    instructions: `1. Study injector plate design: impinging jets, hole patterns, precision requirements
2. Design injector plate: hole pattern, thread mounting, pressure sealing
3. Create complete manufacturing plan: operations, fixtures, tooling, inspection
4. Select material: 6061-T6 aluminum, 304 stainless, or brass
5. Machine blank: face both sides parallel, precision thickness
6. Drill precision hole pattern: jig bore or DRO mill, ±0.001" location
7. Machine central threads and O-ring grooves
8. Deburr all holes: critical for flow, prevent particle generation
9. Surface grind mounting face: flatness for sealing
10. Perform complete dimensional inspection: CMM or optical comparator
11. Pressure test if possible: verify no leaks`,
    objectives: [
      'Design functional rocket engine component',
      'Machine precision hole patterns',
      'Achieve tight tolerances (±0.001")',
      'Integrate multiple machining operations',
      'Perform complete quality inspection',
      'Produce aerospace-quality hardware',
    ],
    skills: ['Complete machining workflow', 'Precision drilling', 'Process planning', 'Inspection', 'Aerospace quality'],
    expectedOutcome: 'Precision-machined injector plate ready for rocket engine integration, fully inspected and documented.',
    passingCriteria: 'All holes within ±0.001" positional tolerance, surface finish per spec, passes pressure test',
    referencePhotos: ['/curriculum/projects/injector-design.jpg', '/curriculum/projects/injector-machining.jpg', '/curriculum/projects/completed-injector.jpg'],
    estimatedHours: 60,
    difficulty: 'expert',
    category: 'projects',
    subcategory: 'level-8',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Review ALL Level 8 reading materials',
      'Rocket engine injector design papers',
      'Precision hole pattern drilling techniques',
    ],
    crossReferences: ['Level 12 Rocket Engine will use this injector'],
  },

  // ============================================================================
  // LEVEL 9: CNC MACHINING & CAM PROGRAMMING (Months 28-30)
  // ============================================================================

  // Module 9.1: CNC Mill Programming & Operation
  {
    level: 9,
    moduleNumber: '9.1',
    assignmentNumber: 'WA-9.1.1',
    orderIndex: 120,
    title: 'CNC Mill Fundamentals - G-Code & Setup',
    description: 'Learn CNC milling machine operation, G-code programming, and work coordinate systems.',
    instructions: `1. Study CNC mill anatomy: controller, servos, spindle, tool changer, coolant
2. Learn G-code basics: G00 (rapid), G01 (linear), G02/G03 (arcs), G90/G91 (absolute/incremental)
3. Practice work coordinate systems: G54-G59, work offsets, tool length offsets
4. Master tool touch-off: edge finder, probe, tool length measurement
5. Study canned cycles: G81 (drill), G83 (peck drill), G73 (chip break)
6. Learn M-codes: M03/M04 (spindle), M08/M09 (coolant), M06 (tool change)
7. Practice manual data input (MDI): single block execution
8. Study feeds and speeds for CNC: chip load calculation, tool deflection
9. Write simple G-code program: face, contour, drill pattern
10. Run first CNC program with proper setup and verification`,
    objectives: [
      'Understand G-code programming fundamentals',
      'Set up work coordinate systems accurately',
      'Perform tool touch-off and offsets',
      'Write basic G-code programs manually',
      'Operate CNC mill safely',
      'Execute programs with proper verification',
    ],
    skills: ['G-code programming', 'CNC setup', 'Work offsets', 'Tool management', 'CNC operation'],
    expectedOutcome: 'Simple CNC-machined part with multiple features, hand-coded G-code program.',
    passingCriteria: 'Part meets dimensions, G-code is correct, proper setup procedures followed, safe operation',
    referencePhotos: ['/curriculum/cnc/cnc-mill-setup.jpg', '/curriculum/cnc/gcode-program.jpg', '/curriculum/cnc/first-cnc-part.jpg'],
    estimatedHours: 36,
    difficulty: 'expert',
    category: 'cnc',
    subcategory: 'mill-programming',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"CNC Programming Handbook" by Peter Smid',
      'Haas CNC Mill Operator Manual (or equivalent)',
      'G-code reference guide - FANUC or equivalent',
    ],
  },

  {
    level: 9,
    moduleNumber: '9.1',
    assignmentNumber: 'WA-9.1.2',
    orderIndex: 121,
    title: 'CAM Programming with Fusion 360 - 2.5D Milling',
    description: 'Learn computer-aided manufacturing (CAM) to automatically generate CNC toolpaths from 3D models.',
    instructions: `1. Study CAM workflow: model → setup → toolpaths → simulation → post-process → CNC
2. Learn setup creation: stock definition, work coordinate system, fixtures
3. Practice 2D adaptive clearing: efficient roughing, constant engagement
4. Master 2D contour: finish walls, multiple depths, stock to leave
5. Study facing operations: face mill, smooth top surface
6. Learn drilling operations: spot drill, drill, chamfer, tap
7. Practice pocket milling: clear material, finish floor and walls
8. Study toolpath verification: simulation, gouge detection, tool collisions
9. Learn post-processing: generate machine-specific G-code
10. Create complete CAM program for bracket part`,
    objectives: [
      'Set up CAM job from 3D model',
      'Generate efficient roughing toolpaths',
      'Create finishing toolpaths',
      'Simulate and verify toolpaths',
      'Post-process for specific CNC machine',
      'Produce production-ready G-code',
    ],
    skills: ['CAM programming', 'Toolpath generation', 'Simulation', 'Post-processing', 'Manufacturing planning'],
    expectedOutcome: 'Complete CAM project with simulated toolpaths and post-processed G-code ready for CNC.',
    passingCriteria: 'Toolpaths are efficient, simulation shows no errors, G-code runs correctly on machine',
    referencePhotos: ['/curriculum/cnc/cam-setup.jpg', '/curriculum/cnc/toolpath-simulation.jpg', '/curriculum/cnc/cam-program.jpg'],
    estimatedHours: 32,
    difficulty: 'expert',
    category: 'cam',
    subcategory: 'fusion-cam',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Autodesk Fusion 360 CAM tutorials',
      '"CAM Programming Principles" documentation',
      'High-efficiency milling strategies',
    ],
  },

  // Module 9.2: Advanced CAM & 3D Machining
  {
    level: 9,
    moduleNumber: '9.2',
    assignmentNumber: 'WA-9.2.1',
    orderIndex: 122,
    title: '3-Axis Contouring & Surface Machining',
    description: 'Master 3D surface machining with ball end mills and advanced toolpath strategies.',
    instructions: `1. Study 3D toolpaths: scallop, parallel, radial, spiral, morphed spiral
2. Learn ball end mill selection: minimize scallop height, cusp calculation
3. Practice parallel finishing: along surface, constant Z, smooth finish
4. Master rest machining: cleanup after previous operations
5. Study steep and shallow: optimize for surface angle
6. Learn pencil milling: tight radius corners, small ball mills
7. Practice morphed spiral: efficient 3D roughing and finishing
8. Study stepover calculation: balance cycle time vs surface finish
9. Machine 3D sculptural part or mold cavity
10. Optimize toolpaths for minimum cycle time`,
    objectives: [
      'Generate 3D surface toolpaths',
      'Select appropriate 3D strategies',
      'Optimize stepover for finish quality',
      'Machine complex 3D surfaces',
      'Minimize cycle time',
      'Achieve excellent surface finish',
    ],
    skills: ['3D CAM', 'Surface machining', 'Ball mill techniques', 'Toolpath optimization', 'Complex geometry'],
    expectedOutcome: '3D machined part with smooth surfaces, efficient toolpaths, good surface finish.',
    passingCriteria: 'Surfaces are smooth (no visible scallops), cycle time is reasonable, no tool collisions',
    referencePhotos: ['/curriculum/cnc/3d-toolpath.jpg', '/curriculum/cnc/ball-mill-finishing.jpg', '/curriculum/cnc/3d-machined-part.jpg'],
    estimatedHours: 30,
    difficulty: 'expert',
    category: 'cam',
    subcategory: '3d-machining',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '3D machining strategies white papers',
      'Ball end mill selection guides',
      'Surface finish optimization techniques',
    ],
  },

  {
    level: 9,
    moduleNumber: '9.2',
    assignmentNumber: 'WA-9.2.2',
    orderIndex: 123,
    title: 'Multi-Axis CAM - 4th Axis Rotary Machining',
    description: 'Learn 4-axis simultaneous machining with rotary table for cylindrical and complex parts.',
    instructions: `1. Study 4-axis machining: A-axis rotation, simultaneous 4-axis motion
2. Learn rotary setup in CAM: axis definition, part orientation, stock
3. Practice swarf milling: cut along surface with side of tool
4. Master rotary contour: wrap 2D profile around cylinder
5. Study drilling on cylinder: radial holes, compound angles
6. Learn multi-axis toolpath strategies: rotary vs indexed positioning
7. Practice collision avoidance: check tool holder, workholding, rotary limits
8. Study chip evacuation in rotary machining
9. Machine part with radial features on cylinder
10. Create cam lobe or impeller blade with 4-axis`,
    objectives: [
      'Set up 4-axis rotary machining',
      'Generate simultaneous 4-axis toolpaths',
      'Machine cylindrical features efficiently',
      'Avoid collisions in rotary setup',
      'Produce complex rotary parts',
      'Understand when to use 4-axis vs 3-axis',
    ],
    skills: ['4-axis CAM', 'Rotary machining', 'Simultaneous motion', 'Collision detection', 'Advanced CAM'],
    expectedOutcome: '4-axis machined part showing rotary features, efficient simultaneous toolpaths.',
    passingCriteria: 'Part is accurate, no collisions, proper use of 4-axis capabilities, good surface finish',
    referencePhotos: ['/curriculum/cnc/4axis-setup.jpg', '/curriculum/cnc/rotary-toolpath.jpg', '/curriculum/cnc/4axis-part.jpg'],
    estimatedHours: 34,
    difficulty: 'expert',
    category: 'cam',
    subcategory: 'multi-axis',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '4-axis machining fundamentals',
      'Fusion 360 multi-axis CAM tutorials',
      'Rotary machining best practices',
    ],
  },

  // Module 9.3: CNC Lathe Programming
  {
    level: 9,
    moduleNumber: '9.3',
    assignmentNumber: 'WA-9.3.1',
    orderIndex: 124,
    title: 'CNC Lathe Programming - Turning & Facing',
    description: 'Learn CNC lathe operation and programming for precision turned parts.',
    instructions: `1. Study CNC lathe anatomy: chuck, turret, spindle, tailstock, live tooling
2. Learn lathe G-code: G00/G01 in X-Z, G02/G03 (arcs), G70-G76 (canned cycles)
3. Practice tool nose radius compensation: G41/G42, avoid gouging
4. Master roughing cycles: G71 (rough turn), stock removal strategies
5. Study finishing cycles: G70 (finish), precise contours
6. Learn threading cycles: G76, pitch, depth, multiple passes
7. Practice grooving and parting: G75, narrow tools, chip control
8. Study constant surface speed: G96, maintain cutting speed in facing
9. Write CNC lathe program for shaft with multiple diameters
10. Run program with proper setup and tooling`,
    objectives: [
      'Program CNC lathe with G-code',
      'Use canned cycles effectively',
      'Apply tool nose radius compensation',
      'Machine precision turned parts',
      'Cut threads on CNC lathe',
      'Optimize for cycle time and tool life',
    ],
    skills: ['CNC lathe programming', 'Turning cycles', 'Threading', 'Tool compensation', 'Lathe operation'],
    expectedOutcome: 'CNC-turned shaft with multiple diameters, threads, and grooves - programmed and machined.',
    passingCriteria: 'All dimensions within tolerance, threads pass gauge, good surface finish, efficient program',
    referencePhotos: ['/curriculum/cnc/cnc-lathe-setup.jpg', '/curriculum/cnc/lathe-program.jpg', '/curriculum/cnc/turned-part.jpg'],
    estimatedHours: 32,
    difficulty: 'expert',
    category: 'cnc',
    subcategory: 'lathe-programming',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'CNC lathe programming manuals',
      '"CNC Lathe Programming" by Peter Smid',
      'Turning toolpath optimization guides',
    ],
  },

  {
    level: 9,
    moduleNumber: '9.3',
    assignmentNumber: 'WA-9.3.2',
    orderIndex: 125,
    title: 'CAM for CNC Lathe - Turned Parts with Fusion 360',
    description: 'Use CAM software to generate CNC lathe programs from 3D models.',
    instructions: `1. Study turning CAM setup: part orientation, stock definition, chuck setup
2. Learn roughing operations: adaptive roughing, efficient stock removal
3. Practice finishing operations: finish contour, smooth surface finish
4. Master threading operations: CAM-generated thread toolpaths
5. Study grooving and cutoff: tool selection, depths, chip breaking
6. Learn drilling on centerline: spot drill, drill, bore
7. Practice multi-operation sequencing: rough-finish-thread-part
8. Study tool selection in CAM: insert selection, holder clearance
9. Generate complete CNC lathe program from 3D model
10. Post-process and verify on CNC lathe`,
    objectives: [
      'Set up turning CAM from 3D model',
      'Generate efficient turning toolpaths',
      'Program threads with CAM',
      'Select appropriate turning tools',
      'Sequence operations logically',
      'Post-process for CNC lathe',
    ],
    skills: ['Turning CAM', 'CAM programming', 'Tool selection', 'Operation sequencing', 'Post-processing'],
    expectedOutcome: 'CAM-generated CNC lathe program producing precision turned part.',
    passingCriteria: 'CAM program is efficient, part meets all specs, proper tool selection, optimized cycle time',
    referencePhotos: ['/curriculum/cnc/turning-cam-setup.jpg', '/curriculum/cnc/turning-toolpaths.jpg', '/curriculum/cnc/cam-turned-part.jpg'],
    estimatedHours: 28,
    difficulty: 'expert',
    category: 'cam',
    subcategory: 'turning-cam',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Fusion 360 Turning CAM documentation',
      'Turning insert selection guides',
      'CNC lathe post-processor configuration',
    ],
  },

  // Module 9.4: Advanced CNC Techniques
  {
    level: 9,
    moduleNumber: '9.4',
    assignmentNumber: 'WA-9.4.1',
    orderIndex: 126,
    title: 'High-Speed Machining (HSM) Strategies',
    description: 'Learn high-speed machining techniques for efficient material removal and long tool life.',
    instructions: `1. Study HSM principles: trochoidal milling, constant engagement, light radial depth
2. Learn adaptive clearing: dynamic toolpaths, optimal chip load throughout
3. Practice high feed rates: 3× conventional, reduced radial engagement
4. Master chip thinning: calculate adjusted chip load for slotting
5. Study climb vs conventional in HSM: always climb mill for HSM
6. Learn tooling for HSM: variable helix, unequal spacing, coatings
7. Practice rest machining: cleanup efficiently after roughing
8. Study machine requirements: high spindle speed, fast rapids, rigid machine
9. Program HSM toolpaths for aluminum part
10. Compare cycle times: conventional vs HSM strategies`,
    objectives: [
      'Understand HSM principles and benefits',
      'Program adaptive clearing toolpaths',
      'Calculate proper feeds for HSM',
      'Select appropriate HSM tooling',
      'Reduce cycle times significantly',
      'Extend tool life with HSM',
    ],
    skills: ['HSM programming', 'Adaptive toolpaths', 'High-speed techniques', 'Tool selection', 'Optimization'],
    expectedOutcome: 'HSM-programmed part with significantly reduced cycle time vs conventional methods.',
    passingCriteria: 'Cycle time reduced by 40%+, excellent tool life, good surface finish, efficient material removal',
    referencePhotos: ['/curriculum/cnc/hsm-toolpath.jpg', '/curriculum/cnc/trochoidal-milling.jpg', '/curriculum/cnc/hsm-part.jpg'],
    estimatedHours: 30,
    difficulty: 'expert',
    category: 'advanced-cnc',
    subcategory: 'hsm',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'High-speed machining white papers',
      '"High Speed Machining" by Schulz & Moriwaki',
      'Adaptive clearing strategy guides',
    ],
  },

  {
    level: 9,
    moduleNumber: '9.4',
    assignmentNumber: 'WA-9.4.2',
    orderIndex: 127,
    title: 'Probing & In-Process Measurement',
    description: 'Learn to use CNC probes for part setup, in-process inspection, and adaptive machining.',
    instructions: `1. Study probe types: touch trigger, strain gauge, optical, laser
2. Learn probing cycles: G65 (Fanuc), protected positioning, measurement storage
3. Practice work offset setup: probe edges, corners, bore centers, set G54-G59
4. Master part inspection: measure features, compare to nominal, tolerance checking
5. Study tool length measurement: automatic tool setting, broken tool detection
6. Learn adaptive machining: measure stock, adjust roughing allowance
7. Practice feature location: find hole centers, bore diameters, pocket locations
8. Study coordinate rotation: probe angled parts, align to features
9. Create probing routine for complex part setup
10. Implement in-process inspection with statistical feedback`,
    objectives: [
      'Use CNC probe for work setup',
      'Measure parts in-process',
      'Set work offsets with probe',
      'Detect tool breakage',
      'Implement adaptive machining',
      'Perform statistical process control with probe data',
    ],
    skills: ['CNC probing', 'In-process measurement', 'Adaptive machining', 'Setup automation', 'Quality control'],
    expectedOutcome: 'Probe-based setup and inspection routine, verified part dimensions, documented measurements.',
    passingCriteria: 'Probing routines work correctly, setup time reduced, measurements are accurate and repeatable',
    referencePhotos: ['/curriculum/cnc/cnc-probe.jpg', '/curriculum/cnc/probe-routine.jpg', '/curriculum/cnc/probe-measurement.jpg'],
    estimatedHours: 26,
    difficulty: 'expert',
    category: 'cnc',
    subcategory: 'probing',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Renishaw probing system manuals',
      'CNC probing macro programming',
      'Adaptive machining techniques',
    ],
  },

  // Module 9.5: Production CNC Programming
  {
    level: 9,
    moduleNumber: '9.5',
    assignmentNumber: 'WA-9.5.1',
    orderIndex: 128,
    title: 'Macro Programming & Parametric Programs',
    description: 'Learn macro programming for flexible, parametric CNC programs that adapt to different part sizes.',
    instructions: `1. Study macro variables: #1-#33 (local), #100-#199 (common), #500+ (system)
2. Learn parametric programming: use variables for dimensions, create families of parts
3. Practice conditional statements: IF-THEN-ELSE, GOTO, WHILE loops
4. Master mathematical operations: calculations within G-code (#3=#1+#2)
5. Study subroutines: M98/M99, parametric subroutine calls
6. Learn user macros: custom canned cycles, complex patterns
7. Practice bolt hole patterns: parametric circle of holes, any quantity/diameter
8. Study macro libraries: reusable code modules
9. Write parametric program for family of parts (various sizes)
10. Create custom canned cycle macro`,
    objectives: [
      'Write programs using macro variables',
      'Create parametric programs for part families',
      'Use conditional logic in G-code',
      'Build reusable subroutines',
      'Develop custom canned cycles',
      'Reduce programming time with macros',
    ],
    skills: ['Macro programming', 'Parametric programming', 'Logic in G-code', 'Code reusability', 'Advanced programming'],
    expectedOutcome: 'Parametric CNC program producing multiple part sizes from single program with variable input.',
    passingCriteria: 'Macro program works for full range of sizes, logic is correct, code is well-documented',
    referencePhotos: ['/curriculum/cnc/macro-program.jpg', '/curriculum/cnc/parametric-parts.jpg', '/curriculum/cnc/variable-programming.jpg'],
    estimatedHours: 28,
    difficulty: 'expert',
    category: 'cnc',
    subcategory: 'macro-programming',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Fanuc Macro Programming Manual',
      '"CNC Macro Programming" by Peter Smid',
      'Parametric programming examples',
    ],
  },

  {
    level: 9,
    moduleNumber: '9.5',
    assignmentNumber: 'WA-9.5.2',
    orderIndex: 129,
    title: 'Fixture Design & Work Holding for CNC',
    description: 'Design and build CNC fixtures for repeatability, accessibility, and efficient production.',
    instructions: `1. Study modular fixturing: tombstones, sub-plates, precision dowel pins
2. Learn fixture design principles: 3-2-1 locating, rigidity, chip clearance
3. Practice soft jaw design: machine jaws to part, repeatable clamping
4. Master vise fixture plates: drill/tap patterns, precision location
5. Study pallet systems: quick-change pallets, offline setup
6. Learn fixture verification: probe fixture features, verify locations
7. Practice designing for multiple operations: maintain datums through ops
8. Study clamping force: prevent movement, avoid distortion
9. Design and build fixture for CNC production part
10. Document fixture setup and operation procedures`,
    objectives: [
      'Design fixtures using 3-2-1 principle',
      'Create modular fixture components',
      'Machine soft jaws for production',
      'Design for minimal setup time',
      'Ensure repeatability between runs',
      'Optimize for chip evacuation and tool access',
    ],
    skills: ['Fixture design', 'Work holding', 'Modular fixturing', 'Production setup', 'Manufacturing engineering'],
    expectedOutcome: 'CNC fixture producing repeatable parts, documented setup procedures, efficient operation.',
    passingCriteria: 'Parts repeat within 0.001", setup time minimized, fixture is rigid and accessible',
    referencePhotos: ['/curriculum/cnc/cnc-fixture.jpg', '/curriculum/cnc/soft-jaws.jpg', '/curriculum/cnc/modular-fixturing.jpg'],
    estimatedHours: 30,
    difficulty: 'expert',
    category: 'fixturing',
    subcategory: 'cnc-workholding',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Jigs and Fixtures for CNC" resources',
      'Modular fixturing system catalogs',
      'Fixture design best practices',
    ],
  },

  // Module 9.6: CNC Optimization & Production
  {
    level: 9,
    moduleNumber: '9.6',
    assignmentNumber: 'WA-9.6.1',
    orderIndex: 130,
    title: 'Toolpath Optimization & Cycle Time Reduction',
    description: 'Learn advanced techniques to minimize cycle time while maintaining quality.',
    instructions: `1. Study cycle time analysis: identify bottlenecks, time each operation
2. Learn tooling optimization: fewer tools, combined operations, standard tools
3. Practice cut parameter optimization: find sweet spot for speed/feed/depth
4. Master rapid motion optimization: minimize non-cutting time, reorder operations
5. Study simultaneous roughing-finishing: optimize for single-tool operations
6. Learn rest machining strategies: efficient cleanup, minimal air cutting
7. Practice tool life management: balance cycle time vs tool changes
8. Study trochoidal strategies: replace plunge roughing with adaptive
9. Analyze and optimize production part program
10. Achieve 30%+ cycle time reduction through optimization`,
    objectives: [
      'Analyze programs for optimization opportunities',
      'Reduce non-cutting time',
      'Optimize cutting parameters',
      'Minimize tool changes',
      'Balance cycle time and tool life',
      'Achieve significant time savings',
    ],
    skills: ['Program optimization', 'Cycle time analysis', 'Efficiency improvement', 'Manufacturing optimization', 'Cost reduction'],
    expectedOutcome: 'Optimized CNC program with documented cycle time reduction and analysis.',
    passingCriteria: 'Cycle time reduced 30%+, quality maintained, tool life acceptable, documented improvements',
    referencePhotos: ['/curriculum/cnc/cycle-time-analysis.jpg', '/curriculum/cnc/optimized-toolpaths.jpg', '/curriculum/cnc/before-after-optimization.jpg'],
    estimatedHours: 26,
    difficulty: 'expert',
    category: 'optimization',
    subcategory: 'cycle-time',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Lean manufacturing for CNC',
      'Cycle time reduction case studies',
      'Manufacturing optimization techniques',
    ],
  },

  {
    level: 9,
    moduleNumber: '9.6',
    assignmentNumber: 'WA-9.6.2',
    orderIndex: 131,
    title: 'Lights-Out Manufacturing & Automation',
    description: 'Implement unmanned CNC operations with automation, monitoring, and error recovery.',
    instructions: `1. Study lights-out requirements: reliable programs, tool management, chip control
2. Learn pallet systems: automatic pallet changers, queue multiple jobs
3. Practice tool life monitoring: predict tool wear, automatic replacement
4. Master program reliability: error handling, recovery routines, fail-safes
5. Study remote monitoring: machine status, alerts, video surveillance
6. Learn chip management: high-pressure coolant, chip conveyors, chip breaking
7. Practice part verification: in-process probing, post-machining inspection
8. Study backup tooling: sister tools, automatic tool change on breakage
9. Set up unattended machining run: overnight or weekend operation
10. Monitor and document lights-out run results`,
    objectives: [
      'Set up reliable unattended operation',
      'Implement tool monitoring and management',
      'Handle chips effectively for long runs',
      'Monitor machines remotely',
      'Recover from errors automatically',
      'Achieve true lights-out manufacturing',
    ],
    skills: ['Automation', 'Lights-out manufacturing', 'Tool management', 'Remote monitoring', 'Production systems'],
    expectedOutcome: 'Successful unattended CNC run producing multiple parts without intervention.',
    passingCriteria: 'Unattended run completes successfully, all parts within spec, no operator intervention needed',
    referencePhotos: ['/curriculum/cnc/pallet-system.jpg', '/curriculum/cnc/lights-out-setup.jpg', '/curriculum/cnc/remote-monitoring.jpg'],
    estimatedHours: 32,
    difficulty: 'expert',
    category: 'automation',
    subcategory: 'lights-out',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Lights-out manufacturing implementation guides',
      'Pallet system operation manuals',
      'Industrial automation for machine shops',
    ],
  },

  // Module 9.7: Advanced Materials Machining
  {
    level: 9,
    moduleNumber: '9.7',
    assignmentNumber: 'WA-9.7.1',
    orderIndex: 132,
    title: 'Machining Titanium & Aerospace Alloys',
    description: 'Learn specialized techniques for machining difficult aerospace materials.',
    instructions: `1. Study titanium properties: work hardening, low thermal conductivity, chemical reactivity
2. Learn titanium machining parameters: low speed (50-150 SFM), high feed, sharp tools
3. Practice tool selection: carbide (uncoated), high positive rake, sharp edges
4. Master coolant application: flood coolant, high pressure through-spindle
5. Study chip formation: avoid rubbing, maintain cutting, continuous chips
6. Learn about titanium fire hazard: chip management, no sparks near chips
7. Practice machining Ti-6Al-4V: aerospace grade titanium alloy
8. Study Inconel machining: heat-resistant superalloy, even more challenging
9. Machine titanium aerospace component
10. Document cutting data and tool life for titanium`,
    objectives: [
      'Machine titanium safely and effectively',
      'Select proper tools and parameters',
      'Manage heat and chips in titanium',
      'Prevent work hardening',
      'Achieve aerospace surface finish',
      'Understand fire hazards and prevention',
    ],
    skills: ['Titanium machining', 'Difficult materials', 'Aerospace machining', 'Safety', 'Specialized techniques'],
    expectedOutcome: 'Machined titanium aerospace component with proper finish, documented machining data.',
    passingCriteria: 'Part meets aerospace specs, proper surface finish, safe chip management, reasonable tool life',
    referencePhotos: ['/curriculum/cnc/titanium-machining.jpg', '/curriculum/cnc/titanium-chips.jpg', '/curriculum/cnc/titanium-part.jpg'],
    estimatedHours: 28,
    difficulty: 'expert',
    category: 'advanced-materials',
    subcategory: 'titanium',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Machining Titanium" - Kennametal guide',
      'Titanium machining safety protocols',
      'Aerospace material machining standards',
    ],
  },

  {
    level: 9,
    moduleNumber: '9.7',
    assignmentNumber: 'WA-9.7.2',
    orderIndex: 133,
    title: 'Composite Machining & Carbon Fiber Trimming',
    description: 'Learn to machine composite materials and carbon fiber without delamination or damage.',
    instructions: `1. Study composite structure: fibers, matrix, anisotropic properties
2. Learn composite machining challenges: delamination, fiber pullout, dust hazards
3. Practice tool selection: PCD (diamond), very sharp, high helix angle
4. Master feed direction: climb mill only, support exit side
5. Study backing plates: prevent delamination on breakthrough
6. Learn dust collection: carbon fiber dust is hazardous, HEPA filtration required
7. Practice drilling composites: brad point drills, peck cycle, backup plate
8. Study trimming strategies: router bits, compression cutters
9. Machine carbon fiber composite part (with proper safety)
10. Implement dust collection and PPE protocols`,
    objectives: [
      'Machine composites without delamination',
      'Select appropriate tooling (PCD)',
      'Prevent fiber pullout and damage',
      'Manage hazardous dust safely',
      'Drill clean holes in composites',
      'Achieve clean edge trimming',
    ],
    skills: ['Composite machining', 'Carbon fiber trimming', 'PCD tooling', 'Safety protocols', 'Specialized materials'],
    expectedOutcome: 'Machined composite part with no delamination, clean edges, proper safety procedures followed.',
    passingCriteria: 'No delamination visible, fibers are cut cleanly, proper dust collection used, PPE worn',
    referencePhotos: ['/curriculum/cnc/composite-machining.jpg', '/curriculum/cnc/carbon-fiber-trimming.jpg', '/curriculum/cnc/composite-part.jpg'],
    estimatedHours: 24,
    difficulty: 'expert',
    category: 'advanced-materials',
    subcategory: 'composites',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Composite machining best practices',
      'Carbon fiber safety data sheets',
      'PCD tooling for composites guides',
    ],
  },

  // Module 9.8: CNC Process Control
  {
    level: 9,
    moduleNumber: '9.8',
    assignmentNumber: 'WA-9.8.1',
    orderIndex: 134,
    title: 'Statistical Process Control (SPC) for CNC',
    description: 'Implement SPC to monitor and control CNC machining processes for consistent quality.',
    instructions: `1. Study SPC basics: control charts, Cpk, process capability
2. Learn data collection: manual measurement, automated probing, sampling plans
3. Practice X-bar and R charts: track process mean and range
4. Master process capability analysis: Cp, Cpk, understanding capability
5. Study control limits: UCL, LCL, out-of-control conditions
6. Learn corrective action: tool wear compensation, process adjustments
7. Practice trend analysis: detect tool wear, thermal drift, other issues
8. Study sampling strategies: frequency, sample size, measurement points
9. Implement SPC for production CNC part
10. Generate control charts and capability reports`,
    objectives: [
      'Collect dimensional data systematically',
      'Create and interpret control charts',
      'Calculate process capability (Cpk)',
      'Detect out-of-control conditions',
      'Implement corrective actions',
      'Maintain process in statistical control',
    ],
    skills: ['SPC', 'Quality control', 'Statistical analysis', 'Process monitoring', 'Data-driven manufacturing'],
    expectedOutcome: 'SPC implementation with control charts, capability analysis, corrective action procedures.',
    passingCriteria: 'Process is in statistical control, Cpk > 1.33, proper sampling and charting demonstrated',
    referencePhotos: ['/curriculum/cnc/control-chart.jpg', '/curriculum/cnc/spc-analysis.jpg', '/curriculum/cnc/capability-study.jpg'],
    estimatedHours: 26,
    difficulty: 'expert',
    category: 'quality-control',
    subcategory: 'spc',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Statistical Quality Control" by Montgomery',
      'SPC for machining processes guides',
      'Process capability analysis standards',
    ],
  },

  {
    level: 9,
    moduleNumber: '9.8',
    assignmentNumber: 'WA-9.8.2',
    orderIndex: 135,
    title: 'Tool Management & Tool Life Optimization',
    description: 'Implement comprehensive tool management for predictable tool life and optimal performance.',
    instructions: `1. Study tool life factors: cutting speed, feed, depth, coolant, material
2. Learn tool wear modes: flank wear, crater wear, chipping, fracture
3. Practice tool life testing: cut until failure criteria, document life
4. Master tool presetting: measure tools offline, load offsets, reduce setup time
5. Study predictive tool management: calculate life, schedule changes
6. Learn tool inventory systems: crib management, min/max levels, costs
7. Practice reconditioning economics: when to resharpen vs replace
8. Study insert indexing strategies: maximize insert life, reduce costs
9. Create tool management database for CNC shop
10. Optimize tool life through parameter adjustments`,
    objectives: [
      'Predict and manage tool life',
      'Implement tool presetting system',
      'Optimize cutting parameters for tool life',
      'Manage tool inventory effectively',
      'Reduce tooling costs',
      'Prevent unexpected tool failures',
    ],
    skills: ['Tool management', 'Tool life optimization', 'Inventory control', 'Cost reduction', 'Predictive maintenance'],
    expectedOutcome: 'Tool management system with life predictions, presetting procedures, inventory tracking.',
    passingCriteria: 'Tool life is predictable and optimized, inventory is managed, costs are tracked and reduced',
    referencePhotos: ['/curriculum/cnc/tool-presetter.jpg', '/curriculum/cnc/tool-wear.jpg', '/curriculum/cnc/tool-management-system.jpg'],
    estimatedHours: 24,
    difficulty: 'expert',
    category: 'tool-management',
    subcategory: 'optimization',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Tool life optimization guides',
      'Tool management software documentation',
      'Insert selection and economics',
    ],
  },

  {
    level: 9,
    moduleNumber: '9.8',
    assignmentNumber: 'WA-9.8.3',
    orderIndex: 135.3,
    title: 'Advanced Toolpath Strategies - High-Speed Machining',
    description: 'Master high-speed machining (HSM) strategies for fast, efficient material removal with excellent surface finish.',
    instructions: `1. Study HSM theory: trochoidal milling, constant engagement, light depth/high speed
2. Learn adaptive clearing: AI-based toolpath, constant load, maximum efficiency
3. Practice dynamic milling: varying stepover, optimized toolpaths for corners
4. Master high-efficiency roughing: remove maximum material quickly, minimize cycle time
5. Study rest machining: automatically machine areas missed by larger tools
6. Learn steep and shallow finishing strategies: proper for different wall angles
7. Practice spiral/helical ramping: gentle entry, reduced tool load
8. Study chip thinning effect: why high speed with light cuts works
9. Optimize toolpath parameters: feed rate, spindle speed, stepover, stepdown
10. Compare traditional vs HSM: cycle time, tool life, surface finish`,
    objectives: [
      'Understand high-speed machining principles',
      'Generate adaptive clearing toolpaths',
      'Optimize for minimum cycle time',
      'Achieve superior surface finish at high speed',
      'Extend tool life through better strategies',
      'Reduce air cutting and wasted motion',
    ],
    skills: ['High-speed machining', 'Adaptive toolpaths', 'Cycle time optimization', 'Advanced CAM', 'Tool load management'],
    expectedOutcome: 'Part machined with HSM strategies demonstrating reduced cycle time and improved finish vs traditional methods.',
    passingCriteria: 'HSM part has 30%+ faster cycle time, equal or better surface finish, no tool breakage, smooth operation',
    referencePhotos: ['/curriculum/cnc/hsm-toolpath.jpg', '/curriculum/cnc/adaptive-clearing.jpg', '/curriculum/cnc/hsm-results.jpg'],
    estimatedHours: 28,
    difficulty: 'expert',
    category: 'cam-programming',
    subcategory: 'high-speed-machining',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"High-Speed Machining" by Modern Machine Shop',
      'Adaptive toolpath theory and applications',
      'HSM best practices for aerospace',
    ],
  },

  {
    level: 9,
    moduleNumber: '9.8',
    assignmentNumber: 'WA-9.8.4',
    orderIndex: 135.6,
    title: 'Multi-Axis CAM - 5-Axis Simultaneous Machining',
    description: 'Introduction to 5-axis simultaneous machining for complex aerospace geometries impossible with 3-axis.',
    instructions: `1. Study 5-axis machine kinematics: trunnion vs swivel head, A/B/C rotary axes
2. Learn 5-axis advantages: undercuts, complex surfaces, single setup, tool access
3. Practice 5-axis positioning (3+2): fix rotation, machine with 3 axes
4. Master 5-axis simultaneous: all 5 axes move together, continuous surface machining
5. Study collision avoidance: tool holder, machine components, fixture interference
6. Learn swarf milling: side of tool on surface, efficient material removal
7. Practice port/cavity machining: internal features, undercuts, complex geometries
8. Study tool axis control: lead/lag angle, tilt angle, rotation about tool axis
9. Generate 5-axis toolpaths for impeller or turbine blade
10. Simulate and verify 5-axis program: collision detection, out-of-limits warnings`,
    objectives: [
      'Understand 5-axis machine kinematics',
      'Generate 3+2 and simultaneous 5-axis toolpaths',
      'Avoid collisions through simulation',
      'Machine complex surfaces impossible with 3-axis',
      'Use swarf milling effectively',
      'Produce aerospace-quality 5-axis parts',
    ],
    skills: ['5-axis CAM', 'Collision avoidance', 'Swarf milling', 'Complex surface machining', 'Advanced simulation'],
    expectedOutcome: '5-axis machined part with complex surfaces, undercuts, or features requiring multi-axis access.',
    passingCriteria: 'Part geometry is correct, no collisions, surface finish is excellent, dimensional accuracy maintained',
    referencePhotos: ['/curriculum/cnc/5-axis-machine.jpg', '/curriculum/cnc/swarf-milling.jpg', '/curriculum/cnc/5-axis-part.jpg'],
    estimatedHours: 36,
    difficulty: 'expert',
    category: 'cam-programming',
    subcategory: '5-axis-machining',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"5-Axis Machining" by CGTech',
      'Multi-axis CAM strategies',
      '5-axis applications in aerospace',
    ],
    crossReferences: ['Critical for Level 12 rocket turbopump components'],
  },

  {
    level: 9,
    moduleNumber: '9.8',
    assignmentNumber: 'WA-9.8.5',
    orderIndex: 135.9,
    title: 'CNC Lathe with Live Tooling - Mill-Turn Integration',
    description: 'Learn CNC lathe with live tooling (C-axis) for complete parts in one setup - turn, mill, drill, tap.',
    instructions: `1. Study mill-turn machine capabilities: C-axis rotation, live tool spindle, Y-axis
2. Learn C-axis programming: angular positioning, polar interpolation
3. Practice off-center milling on turned parts: flats, slots, cross-holes
4. Master live tool operations: milling, drilling, tapping on rotating part
5. Study synchronization: main spindle and sub-spindle coordination, part transfer
6. Learn bar feeding: continuous production, minimize material waste
7. Practice complex mill-turn part: turn OD, mill flats, drill cross-holes, thread
8. Study chip management for mill-turn: chips from multiple operations
9. Generate complete mill-turn program: turning and milling in one setup
10. Produce aerospace fitting with mill-turn process`,
    objectives: [
      'Program CNC lathe with C-axis and live tools',
      'Perform milling operations on turned parts',
      'Use polar interpolation for angular features',
      'Complete complex parts in single setup',
      'Coordinate multiple spindles if available',
      'Optimize mill-turn workflow',
    ],
    skills: ['Mill-turn programming', 'C-axis machining', 'Live tooling', 'Polar interpolation', 'Single-setup manufacturing'],
    expectedOutcome: 'Complex part machined on mill-turn with turned features, milled flats, cross-holes, all in one setup.',
    passingCriteria: 'All features correct, no secondary operations needed, dimensional accuracy maintained, excellent finish',
    referencePhotos: ['/curriculum/cnc/mill-turn-machine.jpg', '/curriculum/cnc/live-tooling.jpg', '/curriculum/cnc/mill-turn-part.jpg'],
    estimatedHours: 32,
    difficulty: 'expert',
    category: 'cnc-programming',
    subcategory: 'mill-turn',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Mill-turn programming guides',
      'C-axis and polar interpolation techniques',
      'Single-setup manufacturing strategies',
    ],
  },

  // Module 9.9: Level 9 Project
  {
    level: 9,
    moduleNumber: '9.9',
    assignmentNumber: 'WA-9.9.1',
    orderIndex: 136,
    title: 'Level 9 Project: CNC-Machined Rocket Nozzle',
    description: 'Design and CNC machine a rocket nozzle - complex geometry requiring 4-axis machining and precision.',
    instructions: `1. Design rocket nozzle: convergent-divergent geometry, throat diameter, expansion ratio
2. Model in Fusion 360: revolve profile, create 3D geometry
3. Plan machining strategy: 4-axis rotary, roughing, finishing, threading
4. Generate CAM toolpaths: adaptive roughing, swarf milling, rotary contour
5. Select material: aluminum 6061-T6 or stainless 304
6. Set up 4-axis rotary on CNC mill
7. Machine nozzle exterior: roughing and finishing with 4-axis
8. Machine nozzle interior: boring, contouring, polishing
9. Thread mounting features for rocket engine
10. Inspect with CMM or optical comparator
11. Polish interior for smooth gas flow`,
    objectives: [
      'Design functional rocket nozzle',
      'Program complex 4-axis CAM',
      'Machine precise internal contour',
      'Achieve aerospace surface finish',
      'Integrate multiple CNC techniques',
      'Produce flight-ready hardware',
    ],
    skills: ['Complete CNC workflow', '4-axis machining', 'Nozzle design', 'CAM programming', 'Aerospace quality'],
    expectedOutcome: 'CNC-machined rocket nozzle with proper geometry, excellent finish, ready for engine integration.',
    passingCriteria: 'Nozzle geometry is accurate, throat diameter within ±0.002", surface is smooth, passes inspection',
    referencePhotos: ['/curriculum/projects/nozzle-design.jpg', '/curriculum/projects/nozzle-cam.jpg', '/curriculum/projects/machined-nozzle.jpg'],
    estimatedHours: 70,
    difficulty: 'expert',
    category: 'projects',
    subcategory: 'level-9',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Review ALL Level 9 reading materials',
      'Rocket nozzle design theory',
      '4-axis machining for aerospace',
    ],
    crossReferences: ['Level 12 Rocket Engine will use this nozzle'],
  },

  // ============================================================================
  // LEVEL 10: FOUNDRY & CASTING (Months 31-33)
  // ============================================================================

  {
    level: 10,
    moduleNumber: '10.1',
    assignmentNumber: 'WA-10.1.1',
    orderIndex: 140,
    title: 'Foundry Safety & Furnace Construction',
    description: 'Learn to safely melt and cast metal. Build a furnace capable of melting aluminum, brass, and eventually iron. This is serious, dangerous work - respect the molten metal.',
    instructions: `1. Study foundry safety: molten metal hazards, steam explosions, furnace design, PPE requirements
2. Learn furnace types: propane (2500°F), electric (2200°F), coke/coal (3000°F+)
3. Build propane foundry furnace: refractory lining, burner setup, lid design
4. Understand crucible selection: graphite, silicon carbide, clay-graphite
5. Study melting temperatures: aluminum (1220°F), brass (1700°F), iron (2800°F), steel (2500°F)
6. Learn degassing and fluxing for clean castings
7. Practice furnace operation: lighting, temperature control, safety monitoring
8. Study steam explosion prevention: moisture is your enemy
9. Create comprehensive safety protocols for foundry operations
10. Demonstrate emergency procedures (metal spill, fire, injury)`,
    objectives: [
      'Build functional foundry furnace safely',
      'Understand molten metal hazards thoroughly',
      'Select appropriate crucibles for each metal',
      'Operate furnace to achieve target temperatures',
      'Prevent steam explosions through proper procedures',
      'Respond appropriately to foundry emergencies',
    ],
    skills: ['Foundry safety', 'Furnace construction', 'Temperature control', 'Emergency response', 'Hazard prevention'],
    expectedOutcome: 'Functional foundry furnace with safety systems, demonstrated safe operation, comprehensive safety manual.',
    passingCriteria: '100% on foundry safety exam, furnace reaches target temps, all safety systems functional, emergency procedures memorized',
    referencePhotos: ['/curriculum/foundry/furnace-construction.jpg', '/curriculum/foundry/crucible-types.jpg', '/curriculum/foundry/safety-ppe.jpg'],
    estimatedHours: 30,
    difficulty: 'expert',
    category: 'foundry',
    subcategory: 'safety-setup',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"The Backyard Foundry" by Terry Aspin',
      '"Foundry Work" by Robert A. Lathrop (classic)',
      '"The Complete Handbook of Sand Casting" by C.W. Ammen',
      'Metal casting safety standards - American Foundry Society',
    ],
  },

  {
    level: 10,
    moduleNumber: '10.2',
    assignmentNumber: 'WA-10.2.1',
    orderIndex: 145,
    title: 'Aluminum Sand Casting',
    description: 'Master sand casting - one of the oldest metalworking techniques. Create molds from patterns and pour aluminum castings.',
    instructions: `1. Study sand casting process: pattern making, molding, pouring, cooling, shakeout
2. Learn molding sand types: green sand (clay-bonded), sodium silicate, resin-bonded
3. Practice pattern making: allowances for shrinkage (aluminum: 1.3%), draft angles (3-5°)
4. Master cope and drag flask molding technique
5. Learn gating system design: sprue, runner, riser, ingate
6. Practice aluminum melting: degassing, temperature control (1350°F pour temp)
7. Pour aluminum castings: smooth pour, avoid turbulence, fill mold completely
8. Study defects: porosity, cold shut, misrun, shrinkage
9. Cast 5 increasingly complex aluminum parts
10. Machine castings to final dimensions`,
    objectives: [
      'Create patterns with proper shrinkage allowance',
      'Make sand molds with good surface finish',
      'Design gating systems for complete mold filling',
      'Melt and pour aluminum safely',
      'Identify and correct casting defects',
      'Machine castings to engineering tolerances',
    ],
    skills: ['Pattern making', 'Sand molding', 'Aluminum melting', 'Casting pouring', 'Defect analysis'],
    expectedOutcome: 'Five aluminum castings of increasing complexity, machined to final dimensions.',
    passingCriteria: 'Castings are sound (no porosity), dimensions within 2% of pattern, minimal defects, good surface finish after machining',
    referencePhotos: ['/curriculum/foundry/sand-mold.jpg', '/curriculum/foundry/aluminum-pour.jpg', '/curriculum/foundry/cast-parts.jpg'],
    estimatedHours: 60,
    difficulty: 'expert',
    category: 'foundry',
    subcategory: 'sand-casting',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Foundry Practice" by Charles F. Walton',
      '"Casting Aluminum Alloys" - American Foundry Society',
      '"Pattern Making" by James Ritchey',
    ],
  },

  {
    level: 10,
    moduleNumber: '10.3',
    assignmentNumber: 'WA-10.3.1',
    orderIndex: 150,
    title: 'Iron Casting - From Ore to Metal',
    description: 'The ultimate foundry challenge: melt and cast iron. Understand the complete process from raw materials to finished casting.',
    instructions: `1. Study iron metallurgy: cast iron types (gray, white, ductile, malleable)
2. Learn coke furnace operation: achieve 2800°F for iron melting
3. Understand carbon content effects: 2-4% carbon for cast iron
4. Study iron ore reduction (for historical understanding): Fe2O3 + C → Fe + CO2
5. Practice cupola furnace design (if scaling up from backyard furnace)
6. Learn inoculation and nodularization for ductile iron
7. Melt iron safely: extreme temperature hazards, proper crucibles
8. Pour iron castings: high-temperature pouring (2600°F+)
9. Cast iron parts: engine blocks, machine bases, decorative work
10. Machine cast iron: carbide tooling, cutting speeds`,
    objectives: [
      'Understand iron metallurgy and carbon content',
      'Operate furnace at iron melting temperatures (2800°F)',
      'Safely melt and pour iron',
      'Create iron castings for structural and decorative use',
      'Machine cast iron to dimensional accuracy',
      'Understand the complete iron production process',
    ],
    skills: ['Iron melting', 'High-temperature operations', 'Metallurgy application', 'Extreme safety protocols'],
    expectedOutcome: 'Iron castings demonstrating: structural capability, decorative detail, machined accuracy.',
    passingCriteria: 'Castings are sound, appropriate carbon content, machine to tolerance, demonstrate understanding of iron science',
    referencePhotos: ['/curriculum/foundry/iron-pour.jpg', '/curriculum/foundry/iron-casting.jpg', '/curriculum/foundry/cupola-furnace.jpg'],
    estimatedHours: 80,
    difficulty: 'expert',
    category: 'foundry',
    subcategory: 'iron-casting',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Gray, Ductile, and Malleable Iron Castings" - ASM',
      '"The Iron Founder" by Joseph Webb Cochran (historical reference)',
      '"Metallurgy for Non-Metallurgists" - ASM International',
      '"From the Blast Furnace to the Foundry" - technical papers',
    ],
  },

  // Additional Level 10 assignments to complete foundry curriculum
  {
    level: 10,
    moduleNumber: '10.4',
    assignmentNumber: 'WA-10.4.1',
    orderIndex: 151,
    title: 'Lost-Wax Investment Casting',
    description: 'Learn investment casting for complex shapes and excellent surface finish - used for jewelry, aerospace, and dental prosthetics.',
    instructions: `1. Study investment casting process: wax pattern, investment (plaster), burnout, pour, break out
2. Learn wax pattern making: carve, 3D print, or mold wax patterns
3. Practice sprue and gating for investment: proper attachment points, feeding
4. Master investment mixing: plaster/silica ratio, vacuum degassing
5. Study burnout schedule: slow heating to prevent cracking, complete wax removal
6. Learn metal selection: bronze, silver, gold, stainless steel
7. Pour investment castings: centrifugal, vacuum, gravity
8. Practice devesting: break out investment, clean castings
9. Cast intricate jewelry or small mechanical parts
10. Finish castings: filing, sanding, polishing`,
    objectives: [
      'Create wax patterns with fine detail',
      'Mix and apply investment properly',
      'Execute proper burnout schedule',
      'Pour castings without defects',
      'Achieve excellent surface finish',
      'Cast complex geometries impossible with sand',
    ],
    skills: ['Investment casting', 'Wax working', 'Fine detail casting', 'Burnout control', 'Precious metal casting'],
    expectedOutcome: 'Investment cast parts with fine detail and excellent finish: jewelry, mechanical parts, or art pieces.',
    passingCriteria: 'Castings capture all detail from wax, surface finish is excellent, no porosity or investment inclusions',
    referencePhotos: ['/curriculum/foundry/wax-pattern.jpg', '/curriculum/foundry/investment-mold.jpg', '/curriculum/foundry/investment-casting.jpg'],
    estimatedHours: 35,
    difficulty: 'expert',
    category: 'foundry',
    subcategory: 'investment-casting',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Investment Casting Handbook" by Investment Casting Institute',
      '"The Complete Metalsmith" by Tim McCreight (jewelry focus)',
      'Investment casting process controls and quality',
    ],
  },

  {
    level: 10,
    moduleNumber: '10.4',
    assignmentNumber: 'WA-10.4.2',
    orderIndex: 152,
    title: 'Permanent Mold & Die Casting Basics',
    description: 'Learn permanent mold casting for production runs and improved dimensional accuracy.',
    instructions: `1. Study permanent mold design: split mold, cores, gating, venting
2. Learn mold materials: cast iron, steel, graphite (for aluminum casting)
3. Practice mold making: machine or cast mold halves
4. Master mold coating: graphite wash, release agents
5. Study gravity permanent mold: pour into metal mold, better accuracy than sand
6. Learn low-pressure die casting: pressure-fed mold filling
7. Practice mold temperature management: preheat, maintain temp for quality
8. Study production considerations: cycle time, mold life, cost per part
9. Create permanent mold and cast production run (50+ parts)
10. Measure dimensional consistency across casting run`,
    objectives: [
      'Design and fabricate permanent molds',
      'Cast parts with better dimensional accuracy than sand',
      'Manage mold temperature for consistent quality',
      'Produce production quantities economically',
      'Achieve repeatability in casting dimensions',
      'Understand economics of permanent mold vs sand casting',
    ],
    skills: ['Permanent mold design', 'Production casting', 'Mold fabrication', 'Dimensional control', 'Manufacturing economics'],
    expectedOutcome: 'Permanent mold producing consistent parts, production run of 50+ castings with measured consistency.',
    passingCriteria: 'Dimensional variation <2% across production run, good surface finish, economical cycle time',
    referencePhotos: ['/curriculum/foundry/permanent-mold.jpg', '/curriculum/foundry/production-casting.jpg', '/curriculum/foundry/dimensional-consistency.jpg'],
    estimatedHours: 40,
    difficulty: 'expert',
    category: 'foundry',
    subcategory: 'permanent-mold',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Permanent mold casting guides - American Foundry Society',
      'Die casting process parameters',
      'Production casting economics',
    ],
  },

  {
    level: 10,
    moduleNumber: '10.5',
    assignmentNumber: 'WA-10.5.1',
    orderIndex: 153,
    title: 'Bronze & Brass Casting for Art and Function',
    description: 'Master bronze and brass casting for sculpture, functional hardware, and decorative work.',
    instructions: `1. Study bronze alloys: silicon bronze (art), phosphor bronze (bearings), aluminum bronze (marine)
2. Learn brass compositions: yellow brass (60/40), red brass (85/15), naval brass
3. Practice melting copper alloys: 1700-1950°F, oxidation prevention
4. Master art casting: figurative sculpture, decorative elements
5. Study patination for bronze: liver of sulfur, ferric nitrate, heat patina
6. Learn functional bronze casting: bearings, bushings, gears
7. Practice lost-wax bronze sculpture casting
8. Study monumental bronze casting: section casting, chasing, assembly
9. Cast bronze sculpture or functional hardware
10. Apply and seal patina finish`,
    objectives: [
      'Melt and cast copper alloys safely',
      'Create art castings with fine detail',
      'Cast functional bronze components',
      'Apply beautiful patina finishes',
      'Understand bronze alloy selection',
      'Produce museum-quality bronze work',
    ],
    skills: ['Bronze casting', 'Artistic casting', 'Patination', 'Functional casting', 'Copper alloy metallurgy'],
    expectedOutcome: 'Bronze cast sculpture or hardware with professional patina, demonstrating art and function.',
    passingCriteria: 'Casting captures detail, bronze is sound, patina is even and attractive, functional parts work correctly',
    referencePhotos: ['/curriculum/foundry/bronze-pour.jpg', '/curriculum/foundry/bronze-sculpture.jpg', '/curriculum/foundry/bronze-patina.jpg'],
    estimatedHours: 45,
    difficulty: 'expert',
    category: 'foundry',
    subcategory: 'bronze-brass',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Bronze and Brass Casting" by C. W. Ammen',
      '"The Art of Bronze Casting" - sculpture focus',
      'Copper alloy selection guides',
    ],
  },

  {
    level: 10,
    moduleNumber: '10.5',
    assignmentNumber: 'WA-10.5.2',
    orderIndex: 154,
    title: 'Centrifugal & Spin Casting',
    description: 'Learn centrifugal casting for jewelry production and small parts manufacturing.',
    instructions: `1. Study centrifugal casting: spring-loaded arm, rotational force for mold filling
2. Learn spin casting equipment: centrifuge, vulcanized rubber molds
3. Practice rubber mold making: carve or 3D print master, vulcanize rubber
4. Master centrifugal casting technique: heat mold, pour metal, release arm
5. Study applications: jewelry, small parts, production quantities
6. Learn metals for spin casting: pewter, bronze, silver, low-temp alloys
7. Practice production spin casting: 100+ identical parts
8. Study quality control: inspecting small castings, sorting defects
9. Set up jewelry casting operation with centrifugal caster
10. Produce production run of cast jewelry or parts`,
    objectives: [
      'Operate centrifugal casting equipment',
      'Create vulcanized rubber production molds',
      'Cast identical parts consistently',
      'Achieve jewelry-quality surface finish',
      'Understand production casting economics',
      'Inspect and quality-control small castings',
    ],
    skills: ['Centrifugal casting', 'Rubber mold making', 'Jewelry production', 'Production quality control', 'Small parts manufacturing'],
    expectedOutcome: 'Production run of 100+ identical cast parts demonstrating consistency and quality.',
    passingCriteria: 'Reject rate <5%, consistent dimensions, good surface finish, economical production',
    referencePhotos: ['/curriculum/foundry/centrifugal-caster.jpg', '/curriculum/foundry/rubber-mold.jpg', '/curriculum/foundry/cast-jewelry.jpg'],
    estimatedHours: 32,
    difficulty: 'expert',
    category: 'foundry',
    subcategory: 'centrifugal-casting',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Centrifugal casting equipment manuals',
      'Rubber mold making techniques',
      'Jewelry casting production methods',
    ],
  },

  {
    level: 10,
    moduleNumber: '10.6',
    assignmentNumber: 'WA-10.6.1',
    orderIndex: 155,
    title: 'Ceramic Shell Casting for Aerospace',
    description: 'Learn ceramic shell investment casting - the process used for jet engine turbine blades.',
    instructions: `1. Study ceramic shell process: wax pattern, multiple ceramic dips, dewax, fire, pour
2. Learn slurry composition: colloidal silica, zircon flour, alumina
3. Practice dipping and stuccoing: build shell thickness (5-10 coats)
4. Master dewaxing: autoclave or flash fire to remove wax
5. Study shell firing: 1800°F to strengthen ceramic
6. Learn preheating and pouring: hot mold for thin sections, directional solidification
7. Practice shell removal: vibration, chemical dissolution, waterblasting
8. Study applications: turbine blades, complex aerospace parts, art casting
9. Cast thin-wall, complex geometry part with ceramic shell
10. Achieve aerospace-quality surface finish and dimensional accuracy`,
    objectives: [
      'Build ceramic shell molds with proper thickness',
      'Execute complete ceramic shell process',
      'Cast thin-wall, complex aerospace parts',
      'Achieve excellent surface finish',
      'Understand directional solidification',
      'Produce aerospace-quality castings',
    ],
    skills: ['Ceramic shell casting', 'Aerospace casting', 'Complex geometry', 'Thin-wall casting', 'Process control'],
    expectedOutcome: 'Ceramic shell cast part with thin walls, complex geometry, aerospace surface finish.',
    passingCriteria: 'Part captures all detail, walls <0.100" achieved, surface finish Ra 125 or better, dimensional accuracy ±1%',
    referencePhotos: ['/curriculum/foundry/ceramic-shell.jpg', '/curriculum/foundry/turbine-blade-casting.jpg', '/curriculum/foundry/shell-process.jpg'],
    estimatedHours: 50,
    difficulty: 'expert',
    category: 'foundry',
    subcategory: 'ceramic-shell',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Investment Casting" by Doru M. Stefanescu',
      'Ceramic shell casting technical papers',
      'Aerospace casting specifications',
    ],
  },

  {
    level: 10,
    moduleNumber: '10.6',
    assignmentNumber: 'WA-10.6.2',
    orderIndex: 156,
    title: 'Casting Defects Analysis & Quality Control',
    description: 'Master identification, analysis, and prevention of casting defects.',
    instructions: `1. Study defect types: porosity, shrinkage, cold shut, misrun, inclusions, hot tears
2. Learn defect causes: gating issues, pouring temperature, mold design, metallurgy
3. Practice sectioning castings: cut, polish, etch, microscopic examination
4. Master X-ray interpretation: identify internal defects, porosity, shrinkage
5. Study ultrasonic testing: detect subsurface defects
6. Learn dye penetrant testing: find surface cracks
7. Practice defect prevention: improve gating, modify mold, adjust chemistry
8. Study feeding and risering: eliminate shrinkage defects
9. Create defect atlas: photograph and document various defect types
10. Implement quality control system for foundry operations`,
    objectives: [
      'Identify all common casting defects',
      'Determine root causes of defects',
      'Apply NDT methods appropriately',
      'Prevent defects through process improvements',
      'Implement systematic quality control',
      'Achieve industry-standard reject rates',
    ],
    skills: ['Defect analysis', 'NDT methods', 'Quality control', 'Root cause analysis', 'Process improvement'],
    expectedOutcome: 'Defect atlas with documented examples, quality control procedures, improved casting yield.',
    passingCriteria: 'Correctly identify 90%+ of defects, implement corrective actions, reduce scrap rate by 50%',
    referencePhotos: ['/curriculum/foundry/casting-defects.jpg', '/curriculum/foundry/xray-analysis.jpg', '/curriculum/foundry/defect-atlas.jpg'],
    estimatedHours: 30,
    difficulty: 'expert',
    category: 'quality-control',
    subcategory: 'casting-defects',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Analysis of Casting Defects" by American Foundry Society',
      'NDT handbook for castings',
      'Quality control standards for foundries',
    ],
  },

  {
    level: 10,
    moduleNumber: '10.7',
    assignmentNumber: 'WA-10.7.1',
    orderIndex: 157,
    title: 'Advanced Gating & Risering Design',
    description: 'Master gating system design for complete mold filling and sound castings.',
    instructions: `1. Study fluid flow in casting: Reynolds number, turbulence, velocity control
2. Learn gating system components: pouring basin, sprue, runner, gate, riser
3. Practice sprue design: tapered sprue prevents aspiration, maintains flow
4. Master runner design: distribute metal evenly to multiple gates
5. Study gate design: minimize turbulence, direct flow, easy removal
6. Learn riser design and placement: feed shrinkage, calculate riser size
7. Practice simulation software: model fill patterns, predict defects (if available)
8. Study pressurized vs unpressurized gating: when to use each
9. Design complete gating system for complex part
10. Validate design through test castings`,
    objectives: [
      'Design gating systems from first principles',
      'Calculate proper runner and gate sizes',
      'Size risers to prevent shrinkage',
      'Minimize turbulence and defects',
      'Validate designs through simulation or testing',
      'Achieve complete, sound castings',
    ],
    skills: ['Gating design', 'Fluid dynamics application', 'Riser calculation', 'System optimization', 'Technical design'],
    expectedOutcome: 'Gating system design documentation with calculations, test castings validating design.',
    passingCriteria: 'Gating system fills mold completely, no cold shuts, shrinkage is fed, casting is sound',
    referencePhotos: ['/curriculum/foundry/gating-design.jpg', '/curriculum/foundry/simulation.jpg', '/curriculum/foundry/gating-system.jpg'],
    estimatedHours: 28,
    difficulty: 'expert',
    category: 'foundry',
    subcategory: 'gating-risering',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Principles of Metal Casting" by Richard W. Heine',
      'Gating and risering calculation methods',
      'Casting simulation software tutorials (if available)',
    ],
  },

  {
    level: 10,
    moduleNumber: '10.7',
    assignmentNumber: 'WA-10.7.2',
    orderIndex: 158,
    title: 'Special Alloys: Magnesium, Zinc, & White Metals',
    description: 'Learn to cast specialty alloys with unique properties and challenges.',
    instructions: `1. Study magnesium casting: lightest structural metal, fire hazard when molten
2. Learn magnesium safety: SF6 or SO2 cover gas, no water, special fire extinguishers
3. Practice zinc die casting: excellent fluidity, low melting point (780°F)
4. Master white metal (Babbitt) casting: bearing material, low friction
5. Study pewter casting: decorative, safe for food contact, easy to work
6. Learn lead-free alloys: modern pewter, plumbing fittings
7. Practice specialty alloy melting and pouring
8. Study applications: aerospace (mag), die casting (zinc), bearings (babbitt)
9. Cast parts in three specialty alloys
10. Compare properties: weight, strength, corrosion resistance, cost`,
    objectives: [
      'Safely cast magnesium (extreme fire hazard)',
      'Cast zinc for high-detail parts',
      'Pour bearing metals for functional components',
      'Understand specialty alloy applications',
      'Select appropriate alloy for requirements',
      'Manage unique safety hazards',
    ],
    skills: ['Specialty alloy casting', 'Magnesium safety', 'Alloy selection', 'Functional casting', 'Material properties'],
    expectedOutcome: 'Cast parts in magnesium, zinc, and white metal demonstrating proper technique and safety.',
    passingCriteria: 'All castings are sound, proper safety procedures followed (especially Mg), functional testing validates properties',
    referencePhotos: ['/curriculum/foundry/magnesium-casting.jpg', '/curriculum/foundry/zinc-die-casting.jpg', '/curriculum/foundry/babbitt-bearing.jpg'],
    estimatedHours: 35,
    difficulty: 'expert',
    category: 'foundry',
    subcategory: 'specialty-alloys',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Magnesium Casting Technology" by American Foundry Society',
      'Zinc die casting handbook',
      'Bearing alloys and their applications',
    ],
  },

  {
    level: 10,
    moduleNumber: '10.8',
    assignmentNumber: 'WA-10.8.1',
    orderIndex: 159,
    title: 'Heat Treatment of Castings',
    description: 'Learn heat treatment to improve mechanical properties of cast parts.',
    instructions: `1. Study heat treatment fundamentals: annealing, normalizing, hardening, tempering
2. Learn aluminum T6 treatment: solution heat treat (990°F), quench, age (350°F/8hr)
3. Practice stress relieving: reduce residual stresses from casting and cooling
4. Master annealing cast iron: improve machinability, reduce hardness
5. Study precipitation hardening: aluminum alloys (2xxx, 6xxx, 7xxx series)
6. Learn austempering ductile iron: high strength, toughness
7. Practice furnace operation: temperature control, atmosphere control
8. Study quenching media: water, oil, polymer, air
9. Heat treat aluminum castings to T6 condition
10. Test mechanical properties: hardness, tensile strength, verify improvement`,
    objectives: [
      'Heat treat aluminum castings to T6',
      'Stress relieve castings to prevent distortion',
      'Improve mechanical properties through heat treatment',
      'Control heat treat atmosphere and temperature',
      'Verify results through hardness and tensile testing',
      'Understand precipitation hardening mechanisms',
    ],
    skills: ['Heat treatment', 'Metallurgy application', 'Property enhancement', 'Testing and verification', 'Process control'],
    expectedOutcome: 'Heat-treated castings with documented property improvements, hardness testing data.',
    passingCriteria: 'Achieve target hardness (aluminum T6: HRB 95), tensile strength meets specification, minimal distortion',
    referencePhotos: ['/curriculum/foundry/heat-treat-furnace.jpg', '/curriculum/foundry/quenching-castings.jpg', '/curriculum/foundry/hardness-testing-casting.jpg'],
    estimatedHours: 30,
    difficulty: 'expert',
    category: 'heat-treatment',
    subcategory: 'casting-heat-treat',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'ASM Heat Treater\'s Guide - Aluminum',
      '"Heat Treatment of Aluminum Alloys" - ASM',
      'Precipitation hardening mechanisms and practice',
    ],
  },

  {
    level: 10,
    moduleNumber: '10.8',
    assignmentNumber: 'WA-10.8.2',
    orderIndex: 160,
    title: 'Finishing Cast Parts - Machining, Grinding, Polishing',
    description: 'Master finishing techniques to bring castings to final dimensional and surface requirements.',
    instructions: `1. Study machining cast materials: interrupted cuts, hard spots, abrasive inclusions
2. Learn fixture design for castings: irregular shapes, thin walls, internal features
3. Practice machining cast iron: carbide tools, interrupted cuts, chip control
4. Master machining aluminum castings: high speed, chip evacuation
5. Study grinding cast surfaces: remove cast skin, achieve flatness
6. Learn EDM for complex cast features: machine hardened castings, intricate detail
7. Practice polishing: progression from coarse to fine, buffing compounds
8. Study chemical finishing: passivation, anodizing, plating
9. Machine and finish complex casting to engineering drawing
10. Achieve aerospace surface finish on cast aerospace part`,
    objectives: [
      'Machine castings to engineering tolerances',
      'Fixture irregular casting shapes securely',
      'Remove casting defects through grinding',
      'Achieve required surface finishes',
      'Apply appropriate chemical finishes',
      'Integrate casting with machining for final part',
    ],
    skills: ['Cast part machining', 'Fixture design', 'Surface finishing', 'Chemical finishing', 'Complete part workflow'],
    expectedOutcome: 'Machined and finished casting meeting all dimensional and surface finish requirements.',
    passingCriteria: 'All dimensions within drawing tolerance, surface finish meets specification, casting defects removed',
    referencePhotos: ['/curriculum/foundry/machining-casting.jpg', '/curriculum/foundry/grinding-cast-surface.jpg', '/curriculum/foundry/finished-casting.jpg'],
    estimatedHours: 35,
    difficulty: 'expert',
    category: 'finishing',
    subcategory: 'cast-finishing',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Machining cast materials guides',
      'Fixture design for irregular shapes',
      'Surface finish specifications and standards',
    ],
  },

  {
    level: 10,
    moduleNumber: '10.9',
    assignmentNumber: 'WA-10.9.1',
    orderIndex: 161,
    title: 'Foundry Economics & Production Planning',
    description: 'Understand the business side of casting: costing, production planning, and make vs buy decisions.',
    instructions: `1. Study casting cost components: pattern cost, metal cost, labor, energy, finishing
2. Learn break-even analysis: sand vs permanent mold, casting vs machining from solid
3. Practice pattern cost amortization: spread cost over production quantity
4. Master yield calculation: casting weight vs metal poured, optimize gating
5. Study production scheduling: furnace campaigns, mold making capacity
6. Learn metal pricing: commodity pricing, scrap recycling value
7. Practice make-vs-buy analysis: when to cast vs machine, cast vs weld
8. Study environmental compliance: emissions, sand disposal, wastewater
9. Create complete cost estimate for production casting job
10. Develop foundry production schedule for mixed product run`,
    objectives: [
      'Calculate complete casting costs accurately',
      'Perform break-even analysis for process selection',
      'Make informed make-vs-buy decisions',
      'Schedule foundry production efficiently',
      'Optimize yield to reduce material costs',
      'Understand environmental requirements',
    ],
    skills: ['Cost estimating', 'Production planning', 'Economics analysis', 'Process selection', 'Business fundamentals'],
    expectedOutcome: 'Complete casting cost estimate with break-even analysis, production schedule for foundry.',
    passingCriteria: 'Cost estimate is within 10% of actual, production schedule is feasible and optimized',
    referencePhotos: ['/curriculum/foundry/cost-analysis.jpg', '/curriculum/foundry/production-schedule.jpg', '/curriculum/foundry/foundry-economics.jpg'],
    estimatedHours: 24,
    difficulty: 'expert',
    category: 'business',
    subcategory: 'foundry-economics',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Foundry cost estimating guides',
      'Manufacturing economics textbooks',
      'Make-vs-buy decision frameworks',
    ],
  },

  {
    level: 10,
    moduleNumber: '10.10',
    assignmentNumber: 'WA-10.10.1',
    orderIndex: 162,
    title: '3D Printing for Foundry - Patterns, Molds, & Direct Casting',
    description: 'Integrate modern 3D printing technology with traditional foundry techniques.',
    instructions: `1. Study 3D printing for patterns: FDM, SLA, binder jetting for investment patterns
2. Learn direct sand printing: print sand molds without patterns
3. Practice SLA casting patterns: burn out cleanly for investment casting
4. Master FDM patterns for sand casting: coating, surface finish
5. Study metal 3D printing castable files: design for casting from 3D models
6. Learn topology optimization: lightweight designs impossible to machine
7. Practice hybrid workflow: 3D print pattern, traditional casting
8. Study limitations: minimum wall thickness, draft angles still apply
9. Design complex part in CAD, 3D print pattern, cast in metal
10. Compare traditional pattern making vs 3D printing: cost, time, complexity`,
    objectives: [
      'Create casting patterns with 3D printing',
      'Design parts optimized for cast+machined hybrid',
      'Use 3D printing to reduce pattern costs',
      'Integrate digital design with foundry work',
      'Produce complex geometries via cast+print workflow',
      'Understand when 3D printing adds value to casting',
    ],
    skills: ['3D printing for foundry', 'Digital pattern making', 'Hybrid manufacturing', 'CAD for casting', 'Modern foundry techniques'],
    expectedOutcome: '3D-printed patterns successfully cast in metal, comparison of traditional vs 3D-printed methods.',
    passingCriteria: 'Castings from 3D-printed patterns are sound, dimensional accuracy maintained, process documented',
    referencePhotos: ['/curriculum/foundry/3d-printed-pattern.jpg', '/curriculum/foundry/printed-sand-mold.jpg', '/curriculum/foundry/hybrid-casting.jpg'],
    estimatedHours: 32,
    difficulty: 'expert',
    category: 'advanced-foundry',
    subcategory: '3d-printing-integration',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '3D printing for investment casting guides',
      'Binder jetting sand printing technology',
      'Topology optimization for additive+casting',
    ],
  },

  {
    level: 10,
    moduleNumber: '10.11',
    assignmentNumber: 'WA-10.11.1',
    orderIndex: 163,
    title: 'Level 10 Project: Cast Aluminum Rocket Engine Mount',
    description: 'Design, cast, machine, and test an aluminum rocket engine mount - integrating all foundry and machining skills.',
    instructions: `1. Design engine mount in Fusion 360: structural ribs, bolt patterns, lightweighting
2. Perform FEA: thrust loads, vibration, safety factors
3. Optimize for casting: draft angles, wall thickness, gating design
4. Create pattern: 3D print or machine from wood/foam with 1.3% oversize
5. Design complete gating system: calculate runner sizes, riser placement
6. Build sand mold with proper venting and gating
7. Melt and pour aluminum 6061 or A356 (castable alloy)
8. Shake out, clean, and inspect casting
9. Heat treat to T6 condition: solution treat, quench, age
10. Machine to final dimensions: drill bolt holes, face mounting surfaces
11. Inspect with CMM: verify all critical dimensions
12. Load test: apply 3x expected rocket thrust load, measure deflection`,
    objectives: [
      'Design optimized casting for aerospace application',
      'Execute complete foundry workflow',
      'Cast sound aluminum aerospace component',
      'Heat treat to T6 for maximum strength',
      'Machine to aerospace tolerances',
      'Validate design through structural testing',
    ],
    skills: ['Complete foundry+machining workflow', 'Aerospace casting design', 'FEA validation', 'Heat treatment', 'Structural testing'],
    expectedOutcome: 'Heat-treated, machined aluminum rocket engine mount, load tested and ready for rocket integration.',
    passingCriteria: 'Casting is sound, heat treatment achieves target hardness, all dimensions within tolerance, passes load test at 3x thrust',
    referencePhotos: ['/curriculum/projects/engine-mount-design.jpg', '/curriculum/projects/engine-mount-casting.jpg', '/curriculum/projects/completed-engine-mount.jpg'],
    estimatedHours: 80,
    difficulty: 'expert',
    category: 'projects',
    subcategory: 'level-10',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Review ALL Level 10 reading materials',
      'Aluminum aerospace casting specifications',
      'Structural design and testing for rocket components',
    ],
    crossReferences: ['Level 12 Rocket Assembly will use this engine mount'],
  },

  {
    level: 10,
    moduleNumber: '10.11',
    assignmentNumber: 'WA-10.11.2',
    orderIndex: 163.5,
    title: 'Investment Casting - Lost Wax Process',
    description: 'Learn precision investment casting for complex aerospace parts impossible to machine or requiring internal features.',
    instructions: `1. Study investment casting process: wax pattern, shell building, burnout, pouring
2. Learn wax injection: create wax patterns from silicone or metal molds
3. Practice sprue design for investment: feeding, venting, multiple parts per tree
4. Master shell building: prime coat, stucco coats, ceramic slurry, drying
5. Learn dewaxing process: steam autoclave or flash fire, shell integrity
6. Study burnout schedule: ramp rates, soak times, eliminate all organic material
7. Practice metal pouring into hot shell: aluminum, bronze, stainless steel
8. Learn shell knockout: vibration, media blasting, chemical dissolution
9. Study casting finishing: cut sprues, grind gates, polish surfaces
10. Create investment cast part: complex geometry with internal features`,
    objectives: [
      'Create wax patterns for investment casting',
      'Build ceramic shell properly',
      'Execute complete dewax and burnout cycle',
      'Pour metal into investment shell',
      'Finish investment castings to specification',
      'Achieve tight tolerances vs sand casting',
    ],
    skills: ['Investment casting', 'Wax patterns', 'Shell building', 'Precision casting', 'Complex geometry casting'],
    expectedOutcome: 'Investment cast part with complex geometry, smooth surface, tight tolerances (+/- 0.010").',
    passingCriteria: 'Casting is sound, dimensions within +/- 0.010", surface is smooth, internal features are present if designed',
    referencePhotos: ['/curriculum/foundry/wax-pattern.jpg', '/curriculum/foundry/ceramic-shell.jpg', '/curriculum/foundry/investment-casting.jpg'],
    estimatedHours: 40,
    difficulty: 'expert',
    category: 'foundry',
    subcategory: 'investment-casting',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Investment Casting Handbook" by Investment Casting Institute',
      'Lost wax process detailed guides',
      'Aerospace investment casting standards',
    ],
    crossReferences: ['Used for rocket turbopump impellers in Level 12'],
  },

  {
    level: 10,
    moduleNumber: '10.11',
    assignmentNumber: 'WA-10.11.3',
    orderIndex: 163.8,
    title: 'Casting Defect Analysis & Quality Control',
    description: 'Learn to identify, analyze, and prevent casting defects to produce aerospace-quality castings.',
    instructions: `1. Study common casting defects: porosity, shrinkage, cold shut, sand inclusion, hot tear
2. Learn defect causes: gating issues, cooling rate, moisture, temperature, alloy chemistry
3. Practice visual inspection: surface defects, dimensional accuracy, warping
4. Master X-ray radiography interpretation: internal porosity, inclusions, cracks
5. Learn ultrasonic testing for castings: detect internal defects non-destructively
6. Study destructive testing: cut castings open, examine microstructure, measure porosity
7. Practice defect root cause analysis: identify why defect occurred, implement fix
8. Learn gating system optimization: simulate flow, prevent turbulence, ensure feeding
9. Study statistical process control for foundry: track defect rates, improve yield
10. Create casting quality plan: inspection procedures, acceptance criteria, documentation`,
    objectives: [
      'Identify all major casting defects',
      'Perform root cause analysis on defective castings',
      'Use NDT to inspect castings',
      'Optimize gating to prevent defects',
      'Implement quality control systems',
      'Achieve aerospace casting quality standards',
    ],
    skills: ['Defect identification', 'Root cause analysis', 'NDT for castings', 'Quality systems', 'Process optimization'],
    expectedOutcome: 'Complete casting quality plan with defect identification guide, inspection procedures, and corrective actions.',
    passingCriteria: 'Correctly identify 90% of defects, root cause analysis is accurate, quality plan meets aerospace standards',
    referencePhotos: ['/curriculum/foundry/casting-defects.jpg', '/curriculum/foundry/xray-inspection.jpg', '/curriculum/foundry/quality-control.jpg'],
    estimatedHours: 28,
    difficulty: 'expert',
    category: 'foundry',
    subcategory: 'quality-control',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Analysis of Casting Defects" by ASM International',
      'Aerospace casting inspection standards',
      'Statistical process control for foundry operations',
    ],
  },

  // ============================================================================
  // LEVEL 11: AEROSPACE STANDARDS & CERTIFICATION (Months 34-36)
  // ============================================================================

  // Module 11.1: Aerospace Quality Systems
  {
    level: 11,
    moduleNumber: '11.1',
    assignmentNumber: 'WA-11.1.1',
    orderIndex: 165,
    title: 'AS9100 Quality Management System',
    description: 'Master the aerospace quality standard that governs all aerospace manufacturing.',
    instructions: `1. Study AS9100 Rev D: quality management for aerospace, based on ISO 9001
2. Learn key requirements: configuration management, product safety, counterfeit parts prevention
3. Understand document control: revisions, approvals, distribution, retention
4. Master traceability: material certs, process logs, inspection records, serial numbers
5. Study corrective and preventive action (CAPA): root cause analysis, effectiveness verification
6. Learn internal audit procedures: plan, conduct, report, follow-up
7. Practice risk management: FMEA (Failure Mode Effects Analysis), risk mitigation
8. Understand first article inspection (FAI): AS9102 requirements, balloon drawings
9. Create quality manual for aerospace shop
10. Pass AS9100 Lead Auditor exam (if available)`,
    objectives: [
      'Understand all AS9100 requirements',
      'Implement quality management system',
      'Maintain complete traceability',
      'Conduct internal quality audits',
      'Perform root cause analysis and CAPA',
      'Execute first article inspections to AS9102',
    ],
    skills: ['Quality management', 'AS9100 compliance', 'Auditing', 'Traceability', 'Documentation'],
    expectedOutcome: 'Complete quality manual, documented procedures, mock AS9100 audit with findings closed.',
    passingCriteria: 'Pass AS9100 exam (85%+), quality manual meets standard, audit demonstrates competence',
    referencePhotos: ['/curriculum/aerospace/as9100-manual.jpg', '/curriculum/aerospace/audit-checklist.jpg', '/curriculum/aerospace/quality-docs.jpg'],
    estimatedHours: 40,
    difficulty: 'expert',
    category: 'quality-systems',
    subcategory: 'as9100',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'AS9100 Rev D standard (full text)',
      '"AS9100 Essentials" - ASQ Quality Press',
      'AS9102 First Article Inspection standard',
      'IAQG guidance documents',
    ],
  },

  {
    level: 11,
    moduleNumber: '11.1',
    assignmentNumber: 'WA-11.1.2',
    orderIndex: 166,
    title: 'NADCAP Special Process Certification',
    description: 'Understand NADCAP accreditation for special processes: welding, heat treat, NDT, chemical processing.',
    instructions: `1. Study NADCAP program: Performance Review Institute (PRI), industry-managed accreditation
2. Learn special processes requiring NADCAP: welding, heat treat, NDT, plating, composites
3. Understand audit criteria: technical requirements, equipment calibration, operator qualification
4. Study welding NADCAP: WPS qualification, welder certs, destructive testing
5. Learn heat treat NADCAP: pyrometry, SATs (system accuracy tests), TUS (temperature uniformity surveys)
6. Practice NDT NADCAP: Level II/III certification, procedure development, technique sheets
7. Study NADCAP audit process: pre-assessment, audit, findings, closure, surveillance
8. Learn merit system: findings classification (major, minor, observation)
9. Prepare for mock NADCAP audit in one special process
10. Document corrective actions and preventive measures`,
    objectives: [
      'Understand NADCAP accreditation requirements',
      'Prepare facility for special process accreditation',
      'Qualify operators to aerospace standards',
      'Maintain calibration and equipment validation',
      'Pass mock NADCAP audit',
      'Implement continuous improvement for special processes',
    ],
    skills: ['NADCAP compliance', 'Special process control', 'Operator qualification', 'Equipment validation', 'Audit preparation'],
    expectedOutcome: 'NADCAP-ready special process with qualified operators, calibrated equipment, documented procedures.',
    passingCriteria: 'Mock audit results in zero major findings, all equipment calibrated, operators qualified',
    referencePhotos: ['/curriculum/aerospace/nadcap-audit.jpg', '/curriculum/aerospace/welding-qualification.jpg', '/curriculum/aerospace/pyrometry-setup.jpg'],
    estimatedHours: 45,
    difficulty: 'expert',
    category: 'quality-systems',
    subcategory: 'nadcap',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'NADCAP audit criteria checklists (AC7xxx series)',
      'PRI auditor guidance documents',
      'Special process specifications (AMS, AWS, ASTM)',
    ],
  },

  // Module 11.2: Materials & Testing
  {
    level: 11,
    moduleNumber: '11.2',
    assignmentNumber: 'WA-11.2.1',
    orderIndex: 167,
    title: 'Material Certification & Traceability',
    description: 'Master material identification, certification, and traceability from receipt to final product.',
    instructions: `1. Study material certifications: C of C (Certificate of Conformance), mill test reports
2. Learn AMS specifications: AMS2770 (heat treat), AMS-QQ-A-250 (aluminum plate)
3. Practice material receiving inspection: verify cert, check dimensions, visual inspection
4. Master traceability methods: stamping, etching, color coding, barcoding
5. Study heat lot control: maintain heat lot identity through all operations
6. Learn counterfeit parts prevention: approved supplier lists, material testing
7. Practice material segregation: raw vs processed, conforming vs non-conforming
8. Study positive material identification (PMI): XRF testing, verify alloy
9. Implement complete material traceability system
10. Trace material from receipt through machining to final part`,
    objectives: [
      'Read and verify material certifications',
      'Implement traceability through all operations',
      'Prevent mixing or misidentification of materials',
      'Use PMI equipment to verify alloys',
      'Maintain heat lot control',
      'Prevent counterfeit materials from entering production',
    ],
    skills: ['Material traceability', 'Certification verification', 'PMI testing', 'Material control', 'Counterfeit prevention'],
    expectedOutcome: 'Traceability system from raw material to finished part, demonstrated with example parts and documentation.',
    passingCriteria: 'Complete traceability demonstrated, PMI results match certs, no gaps in chain of custody',
    referencePhotos: ['/curriculum/aerospace/material-certs.jpg', '/curriculum/aerospace/pmi-testing.jpg', '/curriculum/aerospace/traceability-system.jpg'],
    estimatedHours: 28,
    difficulty: 'expert',
    category: 'materials',
    subcategory: 'traceability',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'AS6174 Counterfeit Parts Avoidance',
      'Material certification requirements by customer',
      'PMI equipment operation manuals',
    ],
  },

  {
    level: 11,
    moduleNumber: '11.2',
    assignmentNumber: 'WA-11.2.2',
    orderIndex: 168,
    title: 'Mechanical Testing & Material Properties',
    description: 'Learn to perform and interpret mechanical property tests for aerospace materials.',
    instructions: `1. Study tensile testing: ASTM E8, yield strength, ultimate strength, elongation
2. Learn hardness testing: Rockwell, Brinell, Vickers scales and conversions
3. Practice impact testing: Charpy, Izod, toughness measurement
4. Master fatigue testing: S-N curves, endurance limit, crack propagation
5. Study fracture mechanics: stress intensity factor, critical crack size
6. Learn metallography: sample prep, etching, microstructure analysis
7. Practice grain size measurement: ASTM E112, effect on properties
8. Study property correlations: hardness to tensile strength conversions
9. Perform complete material property characterization
10. Interpret test results and compare to specifications`,
    objectives: [
      'Perform tensile, hardness, and impact tests',
      'Interpret mechanical property data',
      'Understand structure-property relationships',
      'Verify materials meet aerospace specifications',
      'Prepare metallographic samples properly',
      'Correlate test results to real-world performance',
    ],
    skills: ['Mechanical testing', 'Metallography', 'Data interpretation', 'Material characterization', 'Laboratory procedures'],
    expectedOutcome: 'Complete test report with tensile, hardness, impact, and metallographic data for aerospace alloy.',
    passingCriteria: 'All tests performed per standards, data is accurate and repeatable, interpretation is correct',
    referencePhotos: ['/curriculum/aerospace/tensile-test.jpg', '/curriculum/aerospace/metallography.jpg', '/curriculum/aerospace/test-data.jpg'],
    estimatedHours: 35,
    difficulty: 'expert',
    category: 'testing',
    subcategory: 'mechanical-properties',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'ASTM E8 Standard Test Methods for Tension Testing',
      '"Mechanical Behavior of Materials" by Dowling',
      'ASM Metals Handbook - Mechanical Testing',
    ],
  },

  // Module 11.3: Non-Destructive Testing (NDT)
  {
    level: 11,
    moduleNumber: '11.3',
    assignmentNumber: 'WA-11.3.1',
    orderIndex: 169,
    title: 'Liquid Penetrant Testing (PT) - Level II',
    description: 'Master penetrant testing for surface crack detection - critical for aerospace parts.',
    instructions: `1. Study PT principles: capillary action, dwell time, surface breaking defects only
2. Learn penetrant types: visible dye, fluorescent, water-washable, post-emulsifiable
3. Practice surface preparation: cleaning, degreasing, removal of scale/paint
4. Master penetrant application: spray, brush, dip, proper coverage
5. Study dwell time: 10-30 minutes depending on material and defect type
6. Learn excess penetrant removal: avoid over-washing, maintain background
7. Practice developer application: dry, wet, creates white contrasting background
8. Study defect interpretation: linear, rounded, relevant vs non-relevant
9. Perform PT inspection on aerospace parts with known defects
10. Document findings per aerospace requirements`,
    objectives: [
      'Perform PT inspections to aerospace standards',
      'Select appropriate penetrant system for application',
      'Detect surface cracks and discontinuities',
      'Interpret indications correctly',
      'Document findings with photos and reports',
      'Qualify for ASNT Level II PT certification',
    ],
    skills: ['Penetrant testing', 'Surface inspection', 'Defect interpretation', 'NDT documentation', 'Quality verification'],
    expectedOutcome: 'PT inspection reports on aerospace parts, detected defects documented and verified.',
    passingCriteria: 'All known defects detected, no false calls, documentation meets aerospace requirements',
    referencePhotos: ['/curriculum/aerospace/penetrant-application.jpg', '/curriculum/aerospace/pt-defects.jpg', '/curriculum/aerospace/pt-report.jpg'],
    estimatedHours: 32,
    difficulty: 'expert',
    category: 'ndt',
    subcategory: 'penetrant-testing',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'ASTM E1417 Standard Practice for Liquid Penetrant Testing',
      'ASNT Level II PT study guide',
      'Aerospace PT specifications (ASTM E1417, AMS 2644)',
    ],
  },

  {
    level: 11,
    moduleNumber: '11.3',
    assignmentNumber: 'WA-11.3.2',
    orderIndex: 170,
    title: 'Radiographic Testing (RT) - Interpretation',
    description: 'Learn to interpret X-ray and radiographic images for internal defect detection.',
    instructions: `1. Study RT principles: X-ray penetration, film density, sensitivity
2. Learn radiographic setup: source-to-film distance, exposure time, kilovoltage
3. Practice film reading: use illuminator, check IQI (image quality indicator)
4. Master defect identification: porosity, cracks, inclusions, lack of fusion
5. Study welding defects on radiographs: root concavity, undercut, incomplete penetration
6. Learn casting defect identification: shrinkage, gas porosity, inclusions
7. Practice density measurement: densitometer use, acceptable range 2.0-4.0
8. Study digital radiography: computed radiography, advantages over film
9. Interpret radiographs of welded and cast aerospace parts
10. Document findings per AWS D17.1 and aerospace standards`,
    objectives: [
      'Interpret radiographic images accurately',
      'Identify internal defects in welds and castings',
      'Measure film density and verify quality',
      'Determine accept/reject based on codes',
      'Document findings professionally',
      'Prepare for ASNT Level II RT certification',
    ],
    skills: ['Radiographic interpretation', 'Defect identification', 'Film reading', 'Code compliance', 'Technical documentation'],
    expectedOutcome: 'Interpreted radiographs with defect identification, accept/reject decisions, documented reports.',
    passingCriteria: 'Correctly identify 90%+ of defects, proper density measurements, documentation is complete',
    referencePhotos: ['/curriculum/aerospace/xray-setup.jpg', '/curriculum/aerospace/radiograph-defects.jpg', '/curriculum/aerospace/rt-interpretation.jpg'],
    estimatedHours: 38,
    difficulty: 'expert',
    category: 'ndt',
    subcategory: 'radiographic-testing',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'ASTM E1742 Practice for Radiographic Examination',
      'ASNT Level II RT study guide',
      'AWS D17.1 Section 6 - Radiographic Inspection',
    ],
  },

  {
    level: 11,
    moduleNumber: '11.3',
    assignmentNumber: 'WA-11.3.3',
    orderIndex: 171,
    title: 'Ultrasonic Testing (UT) - Thickness & Flaw Detection',
    description: 'Learn ultrasonic testing for thickness measurement and subsurface defect detection.',
    instructions: `1. Study UT principles: sound wave propagation, reflection, velocity in materials
2. Learn transducer types: straight beam, angle beam, dual element
3. Practice calibration: reference standards, distance calibration, sensitivity
4. Master thickness measurement: corrosion monitoring, wall thickness verification
5. Study angle beam technique: detect angled defects, weld inspection
6. Learn A-scan interpretation: time-based display, peak amplitude, distance to defect
7. Practice scanning techniques: grid patterns, coverage maps
8. Study couplant selection: water, gel, oil for different applications
9. Perform UT inspection on aerospace parts and welds
10. Document findings with A-scan screenshots and position data`,
    objectives: [
      'Calibrate UT equipment properly',
      'Perform thickness measurements accurately',
      'Detect subsurface defects with angle beam',
      'Interpret A-scan displays correctly',
      'Map defect locations precisely',
      'Prepare for ASNT Level II UT certification',
    ],
    skills: ['Ultrasonic testing', 'Thickness gauging', 'Angle beam technique', 'Defect mapping', 'Equipment calibration'],
    expectedOutcome: 'UT inspection reports with thickness data, defect locations, A-scan documentation.',
    passingCriteria: 'Thickness measurements within ±0.001", defects located accurately, proper calibration documented',
    referencePhotos: ['/curriculum/aerospace/ut-equipment.jpg', '/curriculum/aerospace/angle-beam-technique.jpg', '/curriculum/aerospace/ut-ascan.jpg'],
    estimatedHours: 36,
    difficulty: 'expert',
    category: 'ndt',
    subcategory: 'ultrasonic-testing',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'ASTM E114 Practice for Ultrasonic Testing',
      'ASNT Level II UT study guide',
      'Ultrasonic testing equipment manuals',
    ],
  },

  // Module 11.4: Aerospace Regulations & Documentation
  {
    level: 11,
    moduleNumber: '11.4',
    assignmentNumber: 'WA-11.4.1',
    orderIndex: 172,
    title: 'FAA Regulations for Experimental Rocketry',
    description: 'Understand FAA regulations, waivers, and safety requirements for amateur/experimental rocketry.',
    instructions: `1. Study FAA Part 101: unmanned rockets, altitude limits, notification requirements
2. Learn waiver process: FAA Form 7711-2, flight parameters, safety plan
3. Understand airspace classifications: Class A, B, C, D, E, G and restrictions
4. Study NOTAM requirements: Notice to Airmen for rocket launches
5. Learn insurance requirements: liability coverage, third-party damage
6. Practice safety distance calculations: 1500 ft per 1000 lbs impulse
7. Study range safety: flight termination systems, tracking, recovery
8. Learn spectator safety: minimum distances, shelters, evacuation plans
9. Prepare complete FAA waiver application for rocket launch
10. Understand NAR/Tripoli high-power certification requirements`,
    objectives: [
      'Navigate FAA regulations for rocket launches',
      'Prepare and submit FAA waiver applications',
      'Calculate safety distances properly',
      'Implement range safety procedures',
      'Obtain necessary insurance and approvals',
      'Comply with all airspace and notification requirements',
    ],
    skills: ['Regulatory compliance', 'Safety planning', 'Documentation', 'Risk assessment', 'Waiver applications'],
    expectedOutcome: 'Complete FAA waiver application package with safety plan, insurance, and all required documentation.',
    passingCriteria: 'Waiver application is complete and accurate, safety plan is comprehensive, all requirements addressed',
    referencePhotos: ['/curriculum/aerospace/faa-waiver.jpg', '/curriculum/aerospace/safety-plan.jpg', '/curriculum/aerospace/launch-site.jpg'],
    estimatedHours: 24,
    difficulty: 'expert',
    category: 'regulations',
    subcategory: 'faa-compliance',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'FAA Part 101 Subpart C - Amateur Rockets',
      'NAR High Power Rocketry Safety Code',
      'Tripoli Rocketry Association safety guidelines',
      'FAA waiver application instructions',
    ],
  },

  {
    level: 11,
    moduleNumber: '11.4',
    assignmentNumber: 'WA-11.4.2',
    orderIndex: 173,
    title: 'Engineering Documentation & Drawing Control',
    description: 'Master engineering drawing creation, GD&T application, and document control for aerospace.',
    instructions: `1. Study engineering drawing standards: ASME Y14.5 (GD&T), Y14.100 (practices)
2. Learn title block requirements: part number, revision, approvals, material callout
3. Practice GD&T application: datum structure, positional tolerance, profile control
4. Master drawing views: orthographic projection, section views, detail views
5. Study notes and callouts: surface finish, heat treat, plating, inspection requirements
6. Learn revision control: ECN/ECR process, effectivity, supersession
7. Practice CAD to drawing workflow: Fusion 360 drawing creation
8. Study drawing approval process: engineering, quality, manufacturing review
9. Create complete engineering drawing package for rocket component
10. Implement drawing change management system`,
    objectives: [
      'Create aerospace-quality engineering drawings',
      'Apply GD&T correctly and completely',
      'Control drawing revisions systematically',
      'Include all necessary manufacturing information',
      'Obtain proper approvals before release',
      'Maintain drawing configuration management',
    ],
    skills: ['Engineering drawings', 'GD&T', 'CAD documentation', 'Revision control', 'Configuration management'],
    expectedOutcome: 'Complete drawing package for rocket component with proper GD&T, notes, and revision control.',
    passingCriteria: 'Drawings are complete and unambiguous, GD&T is correct, all manufacturing info included',
    referencePhotos: ['/curriculum/aerospace/engineering-drawing.jpg', '/curriculum/aerospace/gdt-callouts.jpg', '/curriculum/aerospace/drawing-package.jpg'],
    estimatedHours: 30,
    difficulty: 'expert',
    category: 'documentation',
    subcategory: 'engineering-drawings',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'ASME Y14.5-2018 Dimensioning and Tolerancing',
      'ASME Y14.100 Engineering Drawing Practices',
      '"Geometric Dimensioning and Tolerancing" by Alex Krulikowski',
    ],
  },

  // Module 11.5: Testing & Validation
  {
    level: 11,
    moduleNumber: '11.5',
    assignmentNumber: 'WA-11.5.1',
    orderIndex: 174,
    title: 'Structural Testing & Load Verification',
    description: 'Design and execute structural tests to verify aerospace component strength and safety.',
    instructions: `1. Study test planning: identify critical loads, safety factors, test matrix
2. Learn fixture design for testing: load application, constraint, measurement
3. Practice strain gauge installation: surface prep, adhesive, wiring, calibration
4. Master load application: hydraulic rams, weights, controlled loading
5. Study data acquisition: strain, displacement, load cells, sampling rates
6. Learn FEA correlation: compare test to simulation, validate models
7. Practice proof testing: load to 1.5× design, hold, inspect
8. Study destructive testing: ultimate load, failure mode identification
9. Design and execute structural test for rocket component
10. Document test results with photos, data plots, and analysis`,
    objectives: [
      'Plan comprehensive structural test programs',
      'Install and calibrate strain gauges correctly',
      'Apply loads safely and in controlled manner',
      'Acquire and analyze test data',
      'Correlate test results to FEA predictions',
      'Determine safety margins and failure modes',
    ],
    skills: ['Structural testing', 'Strain measurement', 'Load application', 'Data analysis', 'Test-analysis correlation'],
    expectedOutcome: 'Complete structural test report with load-deflection curves, strain data, FEA correlation, photos.',
    passingCriteria: 'Part survives proof test, data correlates to FEA within 15%, failure mode matches prediction',
    referencePhotos: ['/curriculum/aerospace/structural-test-setup.jpg', '/curriculum/aerospace/strain-gauges.jpg', '/curriculum/aerospace/test-data-plot.jpg'],
    estimatedHours: 42,
    difficulty: 'expert',
    category: 'testing',
    subcategory: 'structural-testing',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Experimental Stress Analysis" by James W. Dally',
      'Strain gauge installation guides - Vishay',
      'Structural test planning methodologies',
    ],
  },

  {
    level: 11,
    moduleNumber: '11.5',
    assignmentNumber: 'WA-11.5.2',
    orderIndex: 175,
    title: 'Pressure Testing & Burst Analysis',
    description: 'Perform hydrostatic and pneumatic testing of pressure vessels and propellant tanks.',
    instructions: `1. Study pressure test requirements: proof (1.5×), burst (2.5-4×), leak test
2. Learn hydrostatic testing: water-filled, safer than pneumatic, volume compensation
3. Practice test setup: fill, vent air, pressurize, hold, measure expansion
4. Master leak detection: bubble test, pressure decay, helium mass spectrometer
5. Study pneumatic testing: higher risk, safety precautions, remote operation
6. Learn burst testing: destructive, determine ultimate pressure, failure mode
7. Practice safety procedures: barricades, remote operation, PPE
8. Study volume expansion measurement: water displacement, strain measurement
9. Perform hydrostatic proof test on rocket propellant tank
10. Document test with pressure-time plots, leak rates, and photos`,
    objectives: [
      'Perform hydrostatic proof tests safely',
      'Detect and quantify leaks accurately',
      'Measure pressure vessel expansion',
      'Execute pneumatic tests with proper safety',
      'Conduct destructive burst tests',
      'Determine safety margins for pressure systems',
    ],
    skills: ['Pressure testing', 'Leak detection', 'Hydrostatic testing', 'Burst analysis', 'Safety procedures'],
    expectedOutcome: 'Pressure test report with proof test results, leak test data, and burst test analysis.',
    passingCriteria: 'Tank holds proof pressure without leaks, expansion is within prediction, burst pressure exceeds 2.5× design',
    referencePhotos: ['/curriculum/aerospace/hydrostatic-test.jpg', '/curriculum/aerospace/pressure-plot.jpg', '/curriculum/aerospace/burst-test.jpg'],
    estimatedHours: 35,
    difficulty: 'expert',
    category: 'testing',
    subcategory: 'pressure-testing',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'ASME BPVC Section VIII - Pressure vessel testing',
      'Hydrostatic and pneumatic test procedures',
      'Pressure vessel safety standards',
    ],
  },

  {
    level: 11,
    moduleNumber: '11.5',
    assignmentNumber: 'WA-11.5.3',
    orderIndex: 176,
    title: 'Vibration Testing & Modal Analysis',
    description: 'Understand vibration testing for aerospace components subjected to launch and flight loads.',
    instructions: `1. Study vibration fundamentals: frequency, amplitude, acceleration (g-forces)
2. Learn random vibration: power spectral density (PSD), flight profile simulation
3. Practice sine sweep testing: identify resonant frequencies
4. Master accelerometer installation: mounting, orientation, mass loading effects
5. Study modal analysis: identify mode shapes, natural frequencies, damping
6. Learn vibration fixture design: attach part, transmit vibration, avoid fixture modes
7. Practice test setup: shaker table, control system, safety limits
8. Study acceptance testing: verify part survives launch environment
9. Perform vibration test on rocket component (avionics bay, payload)
10. Document resonant frequencies, transmissibility, test levels`,
    objectives: [
      'Set up vibration test equipment',
      'Define appropriate test profiles',
      'Install accelerometers correctly',
      'Identify resonant frequencies and mode shapes',
      'Verify components survive vibration environment',
      'Document test results professionally',
    ],
    skills: ['Vibration testing', 'Modal analysis', 'Accelerometer use', 'Test setup', 'Data interpretation'],
    expectedOutcome: 'Vibration test report with frequency response, mode shapes, and acceptance test results.',
    passingCriteria: 'Part survives acceptance test, resonances identified correctly, data quality is good',
    referencePhotos: ['/curriculum/aerospace/vibration-shaker.jpg', '/curriculum/aerospace/accelerometers.jpg', '/curriculum/aerospace/frequency-response.jpg'],
    estimatedHours: 38,
    difficulty: 'expert',
    category: 'testing',
    subcategory: 'vibration',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Random Vibration and Shock Testing" by Wayne Tustin',
      'NASA-STD-7001 Payload Vibroacoustic Test Criteria',
      'Vibration test specifications - MIL-STD-810',
    ],
  },

  // Module 11.6: Propulsion Testing & Safety
  {
    level: 11,
    moduleNumber: '11.6',
    assignmentNumber: 'WA-11.6.1',
    orderIndex: 177,
    title: 'Rocket Motor Static Testing',
    description: 'Design and execute static fire tests of rocket motors to measure thrust, ISP, and validate performance.',
    instructions: `1. Study static test stand design: thrust measurement, motor restraint, blast deflector
2. Learn load cell selection and calibration: thrust measurement accuracy
3. Practice pressure transducer installation: measure chamber pressure
4. Master data acquisition: high-speed sampling (1000 Hz+), synchronization
5. Study safety systems: remote ignition, abort switches, fire suppression
6. Learn thrust curve analysis: total impulse, peak thrust, average thrust, burn time
7. Practice specific impulse calculation: Isp = total impulse / propellant weight
8. Study test site safety: bunkers, minimum distances, fire hazards
9. Build static test stand for rocket motor
10. Conduct static fire test and analyze performance data`,
    objectives: [
      'Design safe static test stand',
      'Install instrumentation correctly',
      'Conduct remote static fire test',
      'Measure thrust and chamber pressure',
      'Calculate motor performance (Isp, total impulse)',
      'Validate motor performance vs design',
    ],
    skills: ['Static testing', 'Thrust measurement', 'Data acquisition', 'Performance analysis', 'Test safety'],
    expectedOutcome: 'Static test stand and complete test report with thrust curve, chamber pressure, calculated Isp.',
    passingCriteria: 'Test conducted safely, thrust within 10% of prediction, data quality is good, Isp calculated correctly',
    referencePhotos: ['/curriculum/aerospace/test-stand.jpg', '/curriculum/aerospace/static-fire.jpg', '/curriculum/aerospace/thrust-curve.jpg'],
    estimatedHours: 50,
    difficulty: 'expert',
    category: 'propulsion',
    subcategory: 'static-testing',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Rocket Propulsion Elements" by Sutton & Biblarz - Testing chapter',
      'Amateur rocket motor testing safety guidelines',
      'Load cell and pressure transducer calibration procedures',
    ],
  },

  {
    level: 11,
    moduleNumber: '11.6',
    assignmentNumber: 'WA-11.6.2',
    orderIndex: 178,
    title: 'Propellant Safety & Handling',
    description: 'Learn safe handling, storage, and use of rocket propellants - critical for not exploding.',
    instructions: `1. Study propellant types: solid (APCP, black powder), liquid (LOX, kerosene, peroxide)
2. Learn APCP safety: ammonium perchlorate composite, DOT classification 1.3C
3. Practice solid propellant storage: magazines, distance tables, quantity limits
4. Master liquid oxidizer handling: LOX compatibility, ignition sources, cleanliness
5. Study propellant mixing safety: static electricity, friction, impact sensitivity
6. Learn fire prevention: grounding, no sparks, proper tools (non-sparking)
7. Practice emergency procedures: propellant fires, spills, exposure
8. Study transport regulations: DOT hazmat, placarding, manifest
9. Create propellant safety manual for rocket project
10. Demonstrate safe propellant handling procedures`,
    objectives: [
      'Handle solid and liquid propellants safely',
      'Store propellants per regulations',
      'Prevent ignition sources near propellants',
      'Respond to propellant emergencies',
      'Transport hazardous materials legally',
      'Implement comprehensive safety program',
    ],
    skills: ['Propellant safety', 'Hazmat handling', 'Emergency response', 'Regulatory compliance', 'Risk management'],
    expectedOutcome: 'Propellant safety manual, demonstrated safe handling, emergency response plan.',
    passingCriteria: '100% on propellant safety exam, proper handling demonstrated, safety manual is comprehensive',
    referencePhotos: ['/curriculum/aerospace/propellant-storage.jpg', '/curriculum/aerospace/lox-handling.jpg', '/curriculum/aerospace/safety-procedures.jpg'],
    estimatedHours: 30,
    difficulty: 'expert',
    category: 'safety',
    subcategory: 'propellant-handling',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'NFPA 1127 Code for High Power Rocketry',
      'DOT hazmat regulations for propellants',
      'Propellant safety data sheets (SDS)',
      '"Ignition!" by John D. Clark (historical, cautionary tales)',
    ],
  },

  // Module 11.7: Launch Operations
  {
    level: 11,
    moduleNumber: '11.7',
    assignmentNumber: 'WA-11.7.1',
    orderIndex: 179,
    title: 'Launch Procedures & Checklist Development',
    description: 'Develop comprehensive launch procedures and checklists to ensure safe, successful launches.',
    instructions: `1. Study launch operations: countdown, holds, abort criteria, go/no-go polls
2. Learn checklist development: task analysis, failure modes, verification steps
3. Practice countdown timeline: T-minus format, sequence critical events
4. Master go/no-go criteria: weather, systems status, range clearance
5. Study launch commit criteria: wind limits, visibility, cloud ceiling
6. Learn abort procedures: safe motor, flight termination, range safety
7. Practice communications: launch director, RSO, tracking, recovery
8. Study post-launch procedures: range clear, recovery operations, data review
9. Develop complete launch operations manual for rocket
10. Conduct launch readiness review with team`,
    objectives: [
      'Develop comprehensive launch checklists',
      'Create countdown timeline',
      'Define go/no-go criteria clearly',
      'Implement abort procedures',
      'Coordinate launch team communications',
      'Conduct launch readiness reviews',
    ],
    skills: ['Operations planning', 'Checklist development', 'Team coordination', 'Risk management', 'Launch procedures'],
    expectedOutcome: 'Complete launch operations manual with checklists, countdown timeline, abort procedures.',
    passingCriteria: 'All critical steps included, abort criteria clear, checklists are unambiguous and complete',
    referencePhotos: ['/curriculum/aerospace/launch-checklist.jpg', '/curriculum/aerospace/countdown.jpg', '/curriculum/aerospace/launch-operations.jpg'],
    estimatedHours: 28,
    difficulty: 'expert',
    category: 'operations',
    subcategory: 'launch-procedures',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'NASA launch operations procedures (public domain)',
      'Amateur rocketry launch procedures - NAR/Tripoli',
      '"Human Spaceflight and Exploration" - Logsdon (operations insights)',
    ],
  },

  {
    level: 11,
    moduleNumber: '11.7',
    assignmentNumber: 'WA-11.7.2',
    orderIndex: 180,
    title: 'Recovery Systems & Parachute Design',
    description: 'Design, test, and implement rocket recovery systems for safe return to earth.',
    instructions: `1. Study recovery methods: parachute, streamer, helicopter recovery, glide recovery
2. Learn parachute sizing: descent rate (15-20 fps), drag coefficient, weight
3. Practice parachute construction: ripstop nylon, shroud lines, attachment
4. Master deployment systems: ejection charge, piston, spring, CO2
5. Study dual deployment: drogue at apogee, main at low altitude (500-1000 ft)
6. Learn shock cord sizing: kinetic energy absorption, length (3-5× rocket length)
7. Practice altimeter programming: apogee detection, backup deployment
8. Study packing techniques: Z-fold, burrito wrap, deployment bag
9. Design and build dual-deployment recovery system
10. Ground test recovery system (deployment, no flight)`,
    objectives: [
      'Size parachutes for safe descent rates',
      'Construct parachutes properly',
      'Design reliable deployment systems',
      'Implement dual deployment with electronics',
      'Calculate shock cord requirements',
      'Pack parachutes for reliable deployment',
    ],
    skills: ['Parachute design', 'Recovery systems', 'Pyrotechnic deployment', 'Altimeter programming', 'Sewing and fabrication'],
    expectedOutcome: 'Complete dual-deployment recovery system with main and drogue chutes, tested on ground.',
    passingCriteria: 'Parachutes are correctly sized, ground test deployment works 100%, electronics are programmed correctly',
    referencePhotos: ['/curriculum/aerospace/parachute-construction.jpg', '/curriculum/aerospace/dual-deployment.jpg', '/curriculum/aerospace/recovery-test.jpg'],
    estimatedHours: 35,
    difficulty: 'expert',
    category: 'recovery',
    subcategory: 'parachute-systems',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Parachute Recovery for UAV" by Knacke (classic reference)',
      'Recovery system design guides - Apogee Rockets',
      'Altimeter manuals (Perfectflite, Jolly Logic)',
    ],
    crossReferences: ['See Tailoring Curriculum for advanced parachute sewing techniques'],
  },

  // Module 11.8: Level 11 Project
  {
    level: 11,
    moduleNumber: '11.8',
    assignmentNumber: 'WA-11.8.1',
    orderIndex: 181,
    title: 'Level 11 Project: Complete Aerospace Quality System Implementation',
    description: 'Implement complete aerospace quality system for rocket project: AS9100, traceability, testing, documentation.',
    instructions: `1. Create quality manual addressing all AS9100 requirements
2. Develop procedures: document control, CAPA, internal audit, material control
3. Implement traceability system: materials through all operations to final assembly
4. Establish calibration program: all measuring equipment, calibration intervals
5. Create inspection plan for rocket components: in-process, final, NDT
6. Develop test plans: structural, pressure, vibration, static fire
7. Create complete documentation package: drawings, procedures, test reports
8. Conduct internal quality audit and close all findings
9. Perform first article inspection (FAI) on critical rocket component
10. Prepare for customer audit (simulated AS9100 surveillance)
11. Document complete quality system with metrics and improvements`,
    objectives: [
      'Implement functioning AS9100 quality system',
      'Maintain complete traceability from materials to product',
      'Execute comprehensive test program',
      'Create aerospace-quality documentation',
      'Pass internal and simulated external audits',
      'Demonstrate continuous improvement',
    ],
    skills: ['Complete quality system', 'AS9100 implementation', 'Audit management', 'Documentation control', 'Aerospace quality'],
    expectedOutcome: 'Functioning aerospace quality system with manual, procedures, traceability, testing, and audit results.',
    passingCriteria: 'Quality system is complete and functional, simulated audit has zero major findings, all documentation present',
    referencePhotos: ['/curriculum/projects/quality-manual.jpg', '/curriculum/projects/traceability-system.jpg', '/curriculum/projects/audit-results.jpg'],
    estimatedHours: 80,
    difficulty: 'expert',
    category: 'projects',
    subcategory: 'level-11',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Review ALL Level 11 reading materials',
      'AS9100 implementation guides',
      'Quality system best practices for small aerospace companies',
    ],
    crossReferences: ['Quality system supports all Level 12 rocket fabrication and assembly'],
  },

  {
    level: 11,
    moduleNumber: '11.8',
    assignmentNumber: 'WA-11.8.2',
    orderIndex: 181.5,
    title: 'Environmental & Safety Compliance for Aerospace Manufacturing',
    description: 'Understand and implement environmental, health, and safety regulations for aerospace manufacturing operations.',
    instructions: `1. Study OSHA requirements for aerospace manufacturing: machine guarding, PPE, hazard communication
2. Learn chemical safety: SDS (Safety Data Sheets), hazardous material storage, disposal
3. Master respiratory protection program: fit testing, cartridge selection, maintenance
4. Study environmental regulations: EPA, waste disposal, air emissions, water discharge
5. Learn hexavalent chromium regulations: exposure limits, controls, medical surveillance
6. Practice lockout/tagout procedures: energy isolation, group lockout, verification
7. Study confined space entry: permit required spaces, atmospheric testing, rescue
8. Learn arc flash and electrical safety: NFPA 70E, arc flash boundaries, PPE
9. Implement hearing conservation program: noise monitoring, audiometric testing
10. Create comprehensive EHS manual for aerospace shop`,
    objectives: [
      'Understand all OSHA requirements for aerospace',
      'Implement chemical safety programs',
      'Manage hazardous waste properly',
      'Protect workers from aerospace-specific hazards',
      'Maintain regulatory compliance',
      'Create safety culture in manufacturing',
    ],
    skills: ['OSHA compliance', 'Chemical safety', 'Environmental regulations', 'PPE programs', 'Hazard analysis', 'Safety management'],
    expectedOutcome: 'Complete EHS manual with all required programs, training materials, and compliance documentation.',
    passingCriteria: 'EHS manual addresses all aerospace hazards, programs are functional, training is documented, zero compliance gaps',
    referencePhotos: ['/curriculum/aerospace/safety-program.jpg', '/curriculum/aerospace/ppe-station.jpg', '/curriculum/aerospace/hazmat-storage.jpg'],
    estimatedHours: 32,
    difficulty: 'expert',
    category: 'aerospace',
    subcategory: 'compliance',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'OSHA 1910 General Industry Standards',
      'OSHA 1926 Construction Standards (if applicable)',
      'EPA hazardous waste regulations (40 CFR)',
      'NFPA 70E - Electrical Safety',
      'ANSI Z49.1 - Safety in Welding',
    ],
  },

  {
    level: 11,
    moduleNumber: '11.8',
    assignmentNumber: 'WA-11.8.3',
    orderIndex: 181.8,
    title: 'Supply Chain Management & Vendor Qualification for Aerospace',
    description: 'Learn to select, qualify, and manage suppliers to ensure aerospace quality throughout the supply chain.',
    instructions: `1. Study supplier selection criteria: capability, capacity, quality, cost, delivery
2. Learn supplier qualification process: initial assessment, on-site audit, capability review
3. Practice purchase order requirements: material specs, traceability, certifications
4. Master incoming inspection: verify material certs, dimensional check, material testing
5. Study counterfeit parts prevention: authorized distributors, material testing, documentation
6. Learn supplier performance monitoring: on-time delivery, quality metrics, cost
7. Practice supplier corrective action: issue identification, root cause, verification
8. Study strategic sourcing: make vs buy decisions, long-term partnerships, cost reduction
9. Implement approved supplier list (ASL) with periodic reassessment
10. Create supplier quality manual and qualification procedures`,
    objectives: [
      'Select and qualify aerospace suppliers',
      'Ensure material traceability from suppliers',
      'Prevent counterfeit parts from entering supply chain',
      'Monitor and improve supplier performance',
      'Implement incoming inspection procedures',
      'Manage strategic supplier relationships',
    ],
    skills: ['Supplier qualification', 'Supply chain management', 'Incoming inspection', 'Counterfeit prevention', 'Vendor management'],
    expectedOutcome: 'Complete supplier management system with ASL, qualification procedures, performance metrics, and inspection plans.',
    passingCriteria: 'Supplier system is complete, all suppliers are qualified and monitored, incoming inspection catches defects, no counterfeit parts',
    referencePhotos: ['/curriculum/aerospace/supplier-audit.jpg', '/curriculum/aerospace/incoming-inspection.jpg', '/curriculum/aerospace/supplier-metrics.jpg'],
    estimatedHours: 28,
    difficulty: 'expert',
    category: 'aerospace',
    subcategory: 'supply-chain',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'AS9100 supplier management requirements',
      'AS5553 - Counterfeit Parts Prevention',
      'ISO 9001 supplier management clauses',
      'Supply chain risk management for aerospace',
    ],
  },

  // ============================================================================
  // LEVEL 12: AEROSPACE MANUFACTURING & ROCKET COMPONENTS (Months 37-42)
  // ============================================================================

  {
    level: 12,
    moduleNumber: '12.1',
    assignmentNumber: 'WA-12.1.1',
    orderIndex: 180,
    title: 'Aerospace Materials & Standards',
    description: 'Enter the world of aerospace manufacturing. Learn materials, standards, and quality requirements that keep rockets from exploding.',
    instructions: `1. Study aerospace aluminum alloys: 6061-T6 (general), 7075-T6 (high strength), 2024-T3 (fuselage)
2. Learn aerospace steel alloys: 4130 chromoly (airframe), 17-4PH stainless (fasteners)
3. Understand titanium alloys: Ti-6Al-4V (high temp, weight savings)
4. Study superalloys: Inconel (turbines, exhaust), Hastelloy (chemical resistance)
5. Learn aerospace standards: AS9100 (quality), AMS (material specs), NADCAP (special processes)
6. Understand traceability requirements: material certs, heat lots, inspection records
7. Study non-destructive testing: X-ray, ultrasonic, dye penetrant, magnetic particle
8. Learn aerospace welding codes: AWS D17.1 for aerospace fusion welding
9. Create material identification system for aerospace shop
10. Pass AS9100 fundamentals exam`,
    objectives: [
      'Identify aerospace materials and their applications',
      'Understand aerospace quality standards and requirements',
      'Implement traceability systems for all materials',
      'Apply non-destructive testing appropriately',
      'Follow aerospace welding and fabrication codes',
      'Maintain documentation to aerospace standards',
    ],
    skills: ['Aerospace materials', 'Quality standards', 'Traceability', 'NDT methods', 'Documentation'],
    expectedOutcome: 'Aerospace materials sample board with specifications, traceability documentation system, AS9100 certification.',
    passingCriteria: 'Pass AS9100 exam (85%+), correctly identify all aerospace alloys, demonstrate traceability procedures',
    referencePhotos: ['/curriculum/aerospace/aerospace-materials.jpg', '/curriculum/aerospace/ndt-testing.jpg', '/curriculum/aerospace/quality-docs.jpg'],
    estimatedHours: 40,
    difficulty: 'expert',
    category: 'aerospace',
    subcategory: 'standards',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Aerospace Materials and Material Technologies" - Indian Institute of Metals',
      'AMS (Aerospace Material Specifications) - SAE database',
      'AS9100 Rev D Quality Management System requirements',
      '"Introduction to Aerospace Materials" by Adrian P. Mouritz',
    ],
    crossReferences: [
      'See Electronics Curriculum (Level 4-5) for avionics and sensor integration',
      'See Computing Curriculum for flight computer programming',
    ],
  },

  {
    level: 12,
    moduleNumber: '12.2',
    assignmentNumber: 'WA-12.2.1',
    orderIndex: 185,
    title: 'Rocket Motor Case Fabrication',
    description: 'Design and fabricate a rocket motor case in Fusion 360, then manufacture it to aerospace tolerances. This is where everything comes together.',
    instructions: `1. Study rocket motor theory: combustion chamber, nozzle, igniter, propellant grain
2. Learn pressure vessel design: wall thickness calculation (t = PD/2SE), safety factors (3-4x)
3. Design motor case in Fusion 360: CAD model with all dimensions, assembly structure
4. Perform FEA (Finite Element Analysis) in Fusion 360: stress analysis, pressure loads, safety verification
5. Generate CAM toolpaths in Fusion 360: turning, milling, threading operations
6. Select material: 6061-T6 aluminum for low-pressure demo, 4130 steel for high-performance
7. Machine motor case on lathe and mill: precision threads, O-ring grooves, nozzle mounting
8. Create nozzle: machine graphite or cast phenolic, convergent-divergent design
9. Hydrostatically test motor case to 1.5x working pressure
10. Document all processes to aerospace standards (work instructions, inspection reports, material certs)`,
    objectives: [
      'Design rocket motor in Fusion 360 with engineering analysis',
      'Calculate pressure vessel wall thickness with safety factors',
      'Generate CAM toolpaths from CAD model',
      'Machine motor case to tight tolerances (±0.002")',
      'Create nozzle with proper throat and expansion ratio',
      'Pressure test vessel to verify safety',
      'Maintain complete aerospace documentation',
    ],
    skills: ['Fusion 360 CAD/CAM', 'Pressure vessel design', 'FEA analysis', 'Precision machining', 'Pressure testing', 'Aerospace documentation'],
    expectedOutcome: 'Complete rocket motor case: designed, analyzed, machined, tested, and documented to aerospace standards.',
    passingCriteria: 'FEA shows safety factor >3, machining within ±0.002", pressure test successful at 1.5x, complete documentation',
    referencePhotos: ['/curriculum/aerospace/motor-case-cad.jpg', '/curriculum/aerospace/motor-machining.jpg', '/curriculum/aerospace/pressure-test.jpg'],
    estimatedHours: 100,
    difficulty: 'expert',
    category: 'aerospace',
    subcategory: 'rocket-propulsion',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Rocket Propulsion Elements" by George P. Sutton (industry standard)',
      '"Design of Liquid Propellant Rocket Engines" - NASA SP-125',
      '"Amateur Rocketry" - Tripoli Rocketry Association resources',
      'Fusion 360 CAM for manufacturing (Autodesk tutorials)',
    ],
    crossReferences: [
      'See Electronics Curriculum (Level 6) for igniter circuit design and deployment electronics',
      'See Computing Curriculum (Advanced) for flight computer and telemetry systems',
    ],
  },

  // Continue Level 12 with more rocket component assignments before final capstone
  {
    level: 12,
    moduleNumber: '12.2',
    assignmentNumber: 'WA-12.2.2',
    orderIndex: 186,
    title: 'Airframe Design & Fabrication - Filament Winding',
    description: 'Design and fabricate composite airframe tubes using filament winding for maximum strength-to-weight ratio.',
    instructions: `1. Study composite airframe design: cylinder theory, hoop stress, axial stress
2. Learn fiber types: carbon fiber (stiffness), fiberglass (cost), aramid (impact)
3. Practice filament winding: mandrel, tension control, wind angle, wet layup
4. Master resin systems: epoxy (strength), polyester (cost), vinyl ester (chemical resistance)
5. Study winding patterns: hoop (90°), helical (±45-60°), axial (0°)
6. Learn cure cycles: room temp vs oven cure, post-cure for max properties
7. Practice mandrel release: release agents, mandrel extraction
8. Study fin attachment: through-the-wall, external fillets, internal mounting
9. Wind and cure rocket airframe tube (4-6" diameter)
10. Machine ends, sand, and finish airframe`,
    objectives: [
      'Design airframe for required loads',
      'Set up filament winding equipment',
      'Wind composite tube with proper fiber orientation',
      'Achieve complete wet-out and consolidation',
      'Cure composite to full strength',
      'Finish airframe to aerospace quality',
    ],
    skills: ['Composite fabrication', 'Filament winding', 'Resin systems', 'Cure cycles', 'Composite finishing'],
    expectedOutcome: 'Filament-wound composite airframe tube, cured and finished, ready for rocket integration.',
    passingCriteria: 'Tube is straight and round, no voids or dry spots, proper fiber content (55-65%), finished professionally',
    referencePhotos: ['/curriculum/aerospace/filament-winding.jpg', '/curriculum/aerospace/composite-airframe.jpg', '/curriculum/aerospace/cured-tube.jpg'],
    estimatedHours: 45,
    difficulty: 'expert',
    category: 'composites',
    subcategory: 'filament-winding',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Composite Airframe Structures" by Michael Chun-Yung Niu',
      'Filament winding process guides',
      'Composite materials handbook - MIL-HDBK-17',
    ],
  },

  {
    level: 12,
    moduleNumber: '12.2',
    assignmentNumber: 'WA-12.2.3',
    orderIndex: 187,
    title: 'Nose Cone Aerodynamics & Fabrication',
    description: 'Design aerodynamically optimized nose cone and fabricate using lathe or composite layup.',
    instructions: `1. Study nose cone shapes: ogive, von Karman, elliptical, parabolic
2. Learn drag coefficients: ogive (lowest drag), conical (simple), haack series (optimal)
3. Practice nose cone design: length-to-diameter ratio, fineness ratio
4. Master turning techniques: aluminum or wood, smooth profile, fine finish
5. Study composite nose cone: foam core, fiberglass layup, wet layup or vacuum bag
6. Learn tip reinforcement: prevent damage on landing
7. Practice shoulder design: coupler fit, attachment method
8. Study center of gravity effects: nose weight for stability
9. Turn or layup nose cone for rocket (4-6" diameter)
10. Finish to aerodynamic smoothness (Ra 32 or better)`,
    objectives: [
      'Select optimal nose cone shape for application',
      'Calculate drag coefficient and impact on performance',
      'Fabricate nose cone to precise aerodynamic profile',
      'Achieve smooth surface finish for low drag',
      'Design proper shoulder for secure attachment',
      'Balance nose weight for stability',
    ],
    skills: ['Aerodynamic design', 'Precision turning', 'Composite layup', 'Surface finishing', 'Weight optimization'],
    expectedOutcome: 'Aerodynamically optimized nose cone, fabricated and finished to aerospace standards.',
    passingCriteria: 'Profile matches design within ±0.010", surface is smooth (no steps or bumps), proper shoulder fit',
    referencePhotos: ['/curriculum/aerospace/nose-cone-turning.jpg', '/curriculum/aerospace/composite-nose.jpg', '/curriculum/aerospace/finished-nosecone.jpg'],
    estimatedHours: 28,
    difficulty: 'expert',
    category: 'aerodynamics',
    subcategory: 'nose-cone',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"The Handbook of Model Rocketry" by G. Harry Stine - Nose cone design',
      'Nose cone drag coefficient data',
      'Aerodynamic shape optimization papers',
    ],
  },

  {
    level: 12,
    moduleNumber: '12.2',
    assignmentNumber: 'WA-12.2.4',
    orderIndex: 188,
    title: 'Fin Design, Fabrication & Alignment',
    description: 'Design stable fins using aerodynamic principles and fabricate with precision alignment.',
    instructions: `1. Study fin design: sweep angle, chord length, tip chord, root chord
2. Learn stability theory: CP (center of pressure), CG (center of gravity), static margin (1-2 calibers)
3. Practice Barrowman equations: calculate CP location from fin geometry
4. Master fin fabrication: aluminum (waterjet/CNC), G10 fiberglass, carbon fiber
5. Study fin attachment: through-the-wall (strongest), surface mount, internal fillets
6. Learn alignment jig design: ensure fins perpendicular and evenly spaced
7. Practice precision alignment: fins within 0.5° of perpendicular, 120° spacing for 3 fins
8. Study fin flutter: critical velocity, thickness requirements, leading edge radius
9. Fabricate and attach 3 or 4 fins to airframe with precision
10. Verify alignment with measurement and visual inspection`,
    objectives: [
      'Design fins for required stability margin',
      'Calculate CP location accurately',
      'Fabricate fins with aerodynamic profiles',
      'Align fins precisely (±0.5°)',
      'Attach fins with adequate strength',
      'Prevent fin flutter at max velocity',
    ],
    skills: ['Aerodynamic design', 'Stability analysis', 'Precision fabrication', 'Alignment jigs', 'Structural attachment'],
    expectedOutcome: 'Precisely aligned fins providing required stability margin, fabricated and attached professionally.',
    passingCriteria: 'Fins within ±0.5° of perpendicular, even angular spacing, static margin 1-2 calibers, strong attachment',
    referencePhotos: ['/curriculum/aerospace/fin-fabrication.jpg', '/curriculum/aerospace/fin-alignment-jig.jpg', '/curriculum/aerospace/installed-fins.jpg'],
    estimatedHours: 35,
    difficulty: 'expert',
    category: 'aerodynamics',
    subcategory: 'fins',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Barrowman stability equations',
      '"Topics in Advanced Model Rocketry" by Mandell, Caporaso, Bengen',
      'Fin flutter analysis and prevention',
    ],
  },

  {
    level: 12,
    moduleNumber: '12.2',
    assignmentNumber: 'WA-12.2.5',
    orderIndex: 189,
    title: 'Motor Retention & Centering System',
    description: 'Design and fabricate motor retention system to safely contain rocket motor during thrust.',
    instructions: `1. Study motor retention methods: threaded, snap-ring, friction-fit, bolted
2. Learn thrust loads: calculate retention force needed (thrust + 5g landing)
3. Practice centering ring design: precise motor diameter fit, airframe bonding surface
4. Master motor mount tube selection: thick-wall phenolic or aluminum
5. Study retention threads: Acme threads, fine threads, thread engagement length
6. Learn retention safety: prevent motor ejection, allow intentional removal
7. Practice precision machining: motor mount threads, centering ring bore
8. Study alignment: motor centerline must match rocket centerline
9. Fabricate complete motor retention system for rocket
10. Load test retention at 3× expected thrust`,
    objectives: [
      'Calculate retention forces for motor size',
      'Design retention system with adequate safety factor',
      'Machine precise threads for retention',
      'Fabricate centering rings with tight tolerances',
      'Align motor perfectly with rocket centerline',
      'Verify retention strength through testing',
    ],
    skills: ['Structural design', 'Thread cutting', 'Centering system design', 'Load testing', 'Precision alignment'],
    expectedOutcome: 'Complete motor retention system, load tested to 3× thrust, with perfect motor alignment.',
    passingCriteria: 'Motor fits snugly, retention withstands 3× thrust, motor aligned within 0.5° of centerline',
    referencePhotos: ['/curriculum/aerospace/motor-retention.jpg', '/curriculum/aerospace/centering-rings.jpg', '/curriculum/aerospace/retention-test.jpg'],
    estimatedHours: 30,
    difficulty: 'expert',
    category: 'structural',
    subcategory: 'motor-retention',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Motor retention design standards - NAR/Tripoli',
      'Thrust load calculations for retention',
      'Thread design for high-load applications',
    ],
  },

  // WA-12.3.1: Propellant Grain Design - BATES Configuration
  {
    level: 12,
    moduleNumber: '12.3',
    assignmentNumber: 'WA-12.3.1',
    orderIndex: 190,
    title: 'Propellant Grain Design - BATES Configuration',
    description: 'Design the propellant grain geometry for predictable thrust curve and burn characteristics.',
    instructions: `1. Study solid rocket motor theory: Kn (Kappa), burn rate, thrust curves
2. Calculate required total impulse and average thrust for your rocket design
3. Choose propellant type (APCP, KNDX, sugar-based) and research burn rate
4. Design BATES grain geometry: segment length, core diameter, number of segments
5. Use propellant simulation software (BurnSim, ProPEP) to predict thrust curve
6. Iterate design to achieve desired Kn and avoid over-pressure or chuffing
7. Calculate inhibitor requirements (ends, outer diameter)
8. Design spacers and grain support system
9. Create detailed grain casting drawings with dimensions and tolerances
10. Document safety margins and failure modes`,
    objectives: [
      'Understand solid rocket motor internal ballistics',
      'Calculate Kn and predict burn characteristics',
      'Use simulation software to validate design',
      'Design BATES grain configuration',
      'Create manufacturing drawings for grain casting',
      'Document safety margins and test requirements',
    ],
    skills: ['Rocket propulsion', 'Internal ballistics', 'CAD for propellant', 'Simulation software', 'Safety analysis'],
    expectedOutcome: 'Complete propellant grain design with predicted thrust curve, manufacturing drawings, and safety documentation.',
    passingCriteria: 'Design achieves target total impulse, Kn stays in safe range (50-200), simulation shows stable burn, all dimensions specified',
    referencePhotos: ['/curriculum/rocket/grain-design.jpg', '/curriculum/rocket/bates-config.jpg'],
    estimatedHours: 35,
    difficulty: 'expert',
    category: 'rocket_building',
    subcategory: 'propulsion',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Rocket Propulsion Elements" by George Sutton',
      '"Modern High-Power Rocketry" by Mark Canepa',
      'Nakka Rocketry website - propellant formulations',
    ],
    crossReferences: ['See WA-11.13.1 for motor static testing'],
  },

  // WA-12.3.2: Propellant Mixing & Casting (Sugar Propellant)
  {
    level: 12,
    moduleNumber: '12.3',
    assignmentNumber: 'WA-12.3.2',
    orderIndex: 191,
    title: 'Propellant Mixing & Casting (Sugar Propellant)',
    description: 'Safely mix and cast sugar-based rocket propellant following proven formulations.',
    instructions: `1. Review propellant safety protocols - work outdoors, no ignition sources, PPE
2. Choose formulation (KN/Sucrose 65/35 or KN/Sorbitol for beginner builds)
3. Measure chemicals accurately with scale (±0.1g precision)
4. Heat and mix propellant using double-boiler method or recrystallization
5. Prepare casting tubes with inhibitor sleeves and core mandrel
6. Cast propellant in thin lifts to avoid voids and air pockets
7. Allow proper cure time (24-72 hours depending on formulation)
8. Extract grain from mold and inspect for cracks, voids, or defects
9. Weigh finished grain and compare to theoretical weight
10. Store propellant safely in cool, dry location away from ignition sources`,
    objectives: [
      'Mix propellant safely following proven formulations',
      'Cast grain with minimal voids and defects',
      'Use proper inhibitor and core mandrel techniques',
      'Inspect and qualify finished propellant grain',
      'Follow all safety protocols for energetic materials',
      'Document batch numbers and traceability',
    ],
    skills: ['Propellant chemistry', 'Casting techniques', 'Safety protocols', 'Quality inspection', 'Hazmat handling'],
    expectedOutcome: 'Cast propellant grain meeting weight and geometry specifications, free of defects, ready for motor assembly.',
    passingCriteria: 'Grain weight within 5% of theoretical, no visible cracks or voids, proper inhibitor coverage, core diameter ±0.5mm',
    referencePhotos: ['/curriculum/rocket/propellant-mixing.jpg', '/curriculum/rocket/grain-casting.jpg'],
    estimatedHours: 28,
    difficulty: 'expert',
    category: 'rocket_building',
    subcategory: 'propulsion',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Amateur Rocket Motor Construction" by David Sleeter',
      'Richard Nakka\'s Sugar Motor Chemistry',
      'ATF regulations for amateur rocketry',
    ],
    crossReferences: ['Requires completion of WA-12.3.1'],
  },

  // WA-12.3.3: Ignition System Design & Fabrication
  {
    level: 12,
    moduleNumber: '12.3',
    assignmentNumber: 'WA-12.3.3',
    orderIndex: 192,
    title: 'Ignition System Design & Fabrication',
    description: 'Design and build reliable electric ignition system for rocket motor.',
    instructions: `1. Study ignition theory: pyrogen composition, heat transfer, flame propagation
2. Choose igniter type (nichrome wire, e-match, or commercial igniter)
3. Design pyrogen composition (black powder, thermite, or commercial)
4. Fabricate igniters: coat nichrome wire with pyrogen slurry, dry properly
5. Test igniters for continuity (1-2 ohms typical) and current requirements
6. Design igniter mounting: bulkhead feed-through, strain relief, contact protection
7. Build ignition controller with safety interlock and continuity check
8. Test complete system with dummy motor (no propellant)
9. Document ignition sequence and safety protocols
10. Create launch checklist with igniter installation and arming steps`,
    objectives: [
      'Fabricate reliable electric igniters',
      'Design igniter mounting and feed-through',
      'Build launch controller with safety features',
      'Test ignition system reliability',
      'Document ignition procedures and safety',
      'Create launch day checklist',
    ],
    skills: ['Pyrotechnics', 'Electronics', 'Safety systems', 'Testing protocols', 'Launch procedures'],
    expectedOutcome: 'Complete ignition system with tested igniters, launch controller, and documented procedures.',
    passingCriteria: 'Igniters show proper continuity, controller has functional safety interlock, successful bench test, documented procedures',
    referencePhotos: ['/curriculum/rocket/igniter-fab.jpg', '/curriculum/rocket/launch-controller.jpg'],
    estimatedHours: 22,
    difficulty: 'advanced',
    category: 'rocket_building',
    subcategory: 'propulsion',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Tripoli Rocketry Association Safety Code',
      '"Igniter Design for Amateur Rocketry"',
    ],
    crossReferences: ['Integrates with WA-12.12.1 avionics', 'See ELEC-8 for electronics'],
  },

  // WA-12.4.1: Nozzle Throat & Expansion Ratio Design
  {
    level: 12,
    moduleNumber: '12.4',
    assignmentNumber: 'WA-12.4.1',
    orderIndex: 193,
    title: 'Nozzle Throat & Expansion Ratio Design',
    description: 'Design De Laval nozzle with optimized throat diameter and expansion ratio for maximum efficiency.',
    instructions: `1. Calculate throat diameter based on desired thrust and chamber pressure
2. Use isentropic flow equations to determine mass flow rate
3. Calculate expansion ratio for altitude-optimized nozzle (ε = 6-10 typical)
4. Design nozzle contour: convergent angle (30°), divergent angle (12-18°)
5. Optimize for sea level or altitude performance based on flight profile
6. Choose nozzle material: graphite, phenolic, ablative, or refractory metal
7. Design thermal protection and erosion resistance strategy
8. Model nozzle in CAD with precise dimensions and surface finish requirements
9. Calculate nozzle mass and center of gravity impact
10. Simulate nozzle performance using CFD or analytical tools (NASA CEA)`,
    objectives: [
      'Calculate optimal throat diameter for target thrust',
      'Design expansion ratio for flight altitude',
      'Model nozzle contour with proper angles',
      'Select appropriate nozzle material',
      'Predict nozzle performance and efficiency',
      'Create manufacturing drawings',
    ],
    skills: ['Nozzle design', 'Compressible flow', 'CFD analysis', 'Material selection', 'Thermal analysis'],
    expectedOutcome: 'Complete nozzle design with calculated performance, CAD model, and manufacturing specifications.',
    passingCriteria: 'Throat diameter sized for target pressure, expansion ratio optimized, contour angles correct, material selected, drawings complete',
    referencePhotos: ['/curriculum/rocket/nozzle-design.jpg', '/curriculum/rocket/nozzle-contour.jpg'],
    estimatedHours: 30,
    difficulty: 'expert',
    category: 'rocket_building',
    subcategory: 'propulsion',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      '"Rocket Propulsion Elements" Chapter 3 - Nozzle Theory',
      'NASA CEA (Chemical Equilibrium with Applications) manual',
    ],
    crossReferences: ['See WA-9.18.1 for CNC nozzle machining'],
  },

  // WA-12.4.2: Nozzle Machining & Finishing
  {
    level: 12,
    moduleNumber: '12.4',
    assignmentNumber: 'WA-12.4.2',
    orderIndex: 194,
    title: 'Nozzle Machining & Finishing',
    description: 'Machine rocket nozzle to precise dimensions with smooth surface finish for optimal performance.',
    instructions: `1. Review nozzle design and create CNC toolpaths in Fusion 360
2. Select tooling: ball end mills for contour, boring bar for throat
3. Choose feeds and speeds for nozzle material (graphite, phenolic, or aluminum)
4. Set up CNC lathe or mill with precise work holding and alignment
5. Rough machine nozzle contour leaving 0.5mm stock for finishing
6. Finish machine throat diameter to ±0.05mm tolerance
7. Finish machine expansion contour with smooth blending (Ra 0.8μm or better)
8. Inspect throat diameter with pin gauges and optical comparator
9. Polish interior surfaces if required for material (graphite may be left as-machined)
10. Clean nozzle thoroughly and protect from damage during assembly`,
    objectives: [
      'Machine nozzle throat to tight tolerance (±0.05mm)',
      'Achieve smooth contour surface finish',
      'Maintain precise expansion ratio geometry',
      'Inspect critical dimensions with precision tools',
      'Document as-built dimensions',
      'Protect finished nozzle from damage',
    ],
    skills: ['CNC machining', 'Precision turning', 'Surface finishing', 'Inspection', 'Graphite machining'],
    expectedOutcome: 'Finished rocket nozzle meeting all dimensional and surface finish requirements, ready for motor assembly.',
    passingCriteria: 'Throat diameter within ±0.05mm, contour smooth and continuous, no tool marks or gouges, inspection report complete',
    referencePhotos: ['/curriculum/rocket/nozzle-machining.jpg', '/curriculum/rocket/nozzle-inspection.jpg'],
    estimatedHours: 38,
    difficulty: 'expert',
    category: 'rocket_building',
    subcategory: 'propulsion',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Machining graphite best practices',
      'CNC precision machining techniques',
    ],
    crossReferences: ['Requires WA-9 CNC skills', 'See WA-8.13.1 for precision machining'],
  },

  // WA-12.5.1: Recovery Bay Design & Bulkhead Fabrication
  {
    level: 12,
    moduleNumber: '12.5',
    assignmentNumber: 'WA-12.5.1',
    orderIndex: 195,
    title: 'Recovery Bay Design & Bulkhead Fabrication',
    description: 'Design and fabricate recovery bay with strong bulkheads to withstand parachute deployment forces.',
    instructions: `1. Calculate parachute deployment forces based on rocket mass and descent velocity
2. Design recovery bay length to accommodate packed parachutes and shock cord
3. Design bulkheads: material (plywood, G10 fiberglass, aluminum), thickness, U-bolt mounting
4. Calculate bulkhead strength using beam theory and FEA if needed
5. Design shock cord attachment with 10:1 safety margin minimum
6. Create shear pin system for controlled separation at apogee
7. Machine or fabricate bulkheads with precise diameter fit (interference fit)
8. Install U-bolts, eyebolts, or swivel attachments for shock cord
9. Test fit bulkheads in airframe tubes
10. Load test shock cord attachment to 5x expected deployment force`,
    objectives: [
      'Design bulkheads for calculated deployment loads',
      'Fabricate bulkheads to precise diameter',
      'Install shock cord attachment hardware',
      'Size recovery bay for parachute volume',
      'Test structural integrity of bulkheads',
      'Document assembly procedures',
    ],
    skills: ['Structural design', 'Load analysis', 'Bulkhead fabrication', 'Hardware installation', 'Load testing'],
    expectedOutcome: 'Recovery bay bulkheads fabricated and load-tested, ready for integration with airframe.',
    passingCriteria: 'Bulkheads fit airframe with interference fit, shock cord attachment survives 5x load test, shear pins sized correctly',
    referencePhotos: ['/curriculum/rocket/bulkhead-design.jpg', '/curriculum/rocket/recovery-bay.jpg'],
    estimatedHours: 26,
    difficulty: 'advanced',
    category: 'rocket_building',
    subcategory: 'recovery',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Apogee Rockets "Parachute Recovery Systems" handbook',
      'Bulkhead design for high-power rocketry',
    ],
    crossReferences: ['See WA-12.6.1 for parachute design'],
  },

  // WA-12.6.1: Parachute Design, Fabrication & Packing
  {
    level: 12,
    moduleNumber: '12.6',
    assignmentNumber: 'WA-12.6.1',
    orderIndex: 196,
    title: 'Parachute Design, Fabrication & Packing',
    description: 'Design, sew, and pack parachute recovery system for safe rocket descent.',
    instructions: `1. Calculate required parachute diameter for target descent rate (15-20 ft/s)
2. Choose parachute type: flat circular, elliptical, or cruciform
3. Design gore pattern and shroud line attachment points
4. Select fabric: ripstop nylon 1.1oz or 1.5oz depending on rocket weight
5. Cut gore panels with hot knife or laser cutter to prevent fraying
6. Sew gore panels with double-stitch or French seam (strong and flat)
7. Install reinforcement patches at apex and shroud line attachment points
8. Attach shroud lines: 8-12 lines, nylon cord or Kevlar, equal length ±5mm
9. Test parachute deployment: drop test from height or compressed air ejection
10. Learn proper packing technique: Z-fold or burrito wrap for reliable deployment`,
    objectives: [
      'Calculate parachute size for safe descent rate',
      'Fabricate parachute with reinforced construction',
      'Attach shroud lines with proper length and strength',
      'Test parachute deployment reliability',
      'Pack parachute for consistent ejection',
      'Document packing procedures',
    ],
    skills: ['Parachute design', 'Sewing', 'Descent rate calculation', 'Drop testing', 'Packing techniques'],
    expectedOutcome: 'Functional parachute system sized for rocket, tested for deployment, with documented packing procedure.',
    passingCriteria: 'Parachute achieves target descent rate in drop test, deploys reliably, construction is strong and even, packing repeatable',
    referencePhotos: ['/curriculum/rocket/parachute-sewing.jpg', '/curriculum/rocket/parachute-packing.jpg'],
    estimatedHours: 24,
    difficulty: 'intermediate',
    category: 'rocket_building',
    subcategory: 'recovery',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Apogee Rockets Parachute Design Guide',
      '"Make: Rockets" Chapter 7 - Recovery Systems',
    ],
    crossReferences: ['See TAIL-4 for sewing techniques', 'Integrates with WA-12.5.1'],
  },

  // WA-12.7.1: Black Powder Ejection Charge Sizing
  {
    level: 12,
    moduleNumber: '12.7',
    assignmentNumber: 'WA-12.7.1',
    orderIndex: 197,
    title: 'Black Powder Ejection Charge Sizing',
    description: 'Calculate and test black powder ejection charges for reliable parachute deployment.',
    instructions: `1. Calculate recovery bay volume (cylinder or conical frustum formula)
2. Use sizing formula: 0.5-0.7 grams FFFG black powder per cubic inch of volume
3. Consider altitude compensation: higher altitude = larger charge needed
4. Build ground test setup: attach parachute bay to launch rail, use electric match
5. Load calculated charge in deployment canister or tape to bulkhead
6. Perform ground test in safe area with hearing protection
7. Observe separation force, shear pin breakage, and parachute ejection
8. Adjust charge size if needed: too weak (no separation) or too strong (damage)
9. Test main and drogue charges separately if using dual-deployment
10. Document final charge weights and prepare flight charges`,
    objectives: [
      'Calculate ejection charge based on bay volume',
      'Build safe ground test setup',
      'Test charge for proper separation force',
      'Adjust charge size based on test results',
      'Document final charge specifications',
      'Prepare flight-ready ejection charges',
    ],
    skills: ['Pyrotechnic sizing', 'Ground testing', 'Safety protocols', 'Volume calculation', 'Test procedures'],
    expectedOutcome: 'Properly sized ejection charges tested and documented, ready for flight installation.',
    passingCriteria: 'Ground test achieves clean separation, parachute deploys fully, no damage to airframe, charge weight documented',
    referencePhotos: ['/curriculum/rocket/ejection-test.jpg', '/curriculum/rocket/charge-prep.jpg'],
    estimatedHours: 18,
    difficulty: 'advanced',
    category: 'rocket_building',
    subcategory: 'recovery',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Tripoli Ejection Charge Sizing Guide',
      'Black powder safety and handling',
    ],
    crossReferences: ['See WA-12.12.1 for altimeter integration'],
  },

  // WA-12.8.1: Rocket Finishing - Paint & Surface Preparation
  {
    level: 12,
    moduleNumber: '12.8',
    assignmentNumber: 'WA-12.8.1',
    orderIndex: 198,
    title: 'Rocket Finishing - Paint & Surface Preparation',
    description: 'Prepare and finish rocket exterior for smooth surface, visibility, and aerodynamic performance.',
    instructions: `1. Sand all body tube spiral seams with 220-grit sandpaper
2. Fill spiral seams and imperfections with lightweight spackling or automotive filler
3. Sand smooth with progressive grits: 220, 320, 400
4. Seal balsa or wood fins with sanding sealer or thin CA glue
5. Apply primer coat (automotive sandable primer or epoxy primer)
6. Wet sand primer with 400-600 grit for smooth base
7. Apply 2-3 coats of high-quality paint (automotive or epoxy paint)
8. Allow proper cure time between coats (read manufacturer specs)
9. Apply clear coat for UV protection and gloss (optional)
10. Add vinyl decals, registration numbers, and tracking visibility aids`,
    objectives: [
      'Prepare smooth surface by filling and sanding',
      'Apply primer and paint with professional finish',
      'Seal wood components against moisture',
      'Achieve smooth aerodynamic surface',
      'Add required markings and visibility aids',
      'Document paint system for touch-ups',
    ],
    skills: ['Surface preparation', 'Painting techniques', 'Sanding', 'Finishing', 'Aesthetic design'],
    expectedOutcome: 'Rocket with smooth, professional paint finish ready for flight, with required markings and visibility.',
    passingCriteria: 'Surface smooth to touch, no visible spiral seams, paint evenly applied, markings clear and durable',
    referencePhotos: ['/curriculum/rocket/surface-prep.jpg', '/curriculum/rocket/painted-rocket.jpg'],
    estimatedHours: 20,
    difficulty: 'intermediate',
    category: 'rocket_building',
    subcategory: 'finishing',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Apogee Rockets Finishing Guide',
      'Automotive painting techniques for rocketry',
    ],
    crossReferences: ['See WA-6.11.1 for metal finishing techniques'],
  },

  // WA-12.9.1: Build Documentation & Engineering Log
  {
    level: 12,
    moduleNumber: '12.9',
    assignmentNumber: 'WA-12.9.1',
    orderIndex: 199,
    title: 'Build Documentation & Engineering Log',
    description: 'Maintain comprehensive build log documenting all design decisions, measurements, and assembly steps.',
    instructions: `1. Set up engineering notebook: bound notebook or digital system (OneNote, Notion)
2. Document design phase: sketches, calculations, CAD screenshots, design rationale
3. Record all measurements: component weights, dimensions, CG location
4. Photo document each major assembly step with date and notes
5. Log all component serial numbers, materials, and suppliers
6. Document deviations from plan: design changes, fixes, lessons learned
7. Create assembly procedures: step-by-step with photos and notes
8. Maintain test log: ground tests, static tests, inspection results
9. Record flight data: weather, motor used, altitude, recovery, observations
10. Create final as-built documentation package: drawings, photos, data`,
    objectives: [
      'Maintain detailed engineering notebook throughout build',
      'Document all key measurements and component data',
      'Photo document assembly process',
      'Record test results and flight data',
      'Create reproducible assembly procedures',
      'Compile final as-built documentation',
    ],
    skills: ['Technical documentation', 'Photography', 'Data recording', 'Organization', 'Communication'],
    expectedOutcome: 'Complete build log with design documentation, assembly photos, test data, and flight records.',
    passingCriteria: 'Log includes all major assembly steps with photos, measurements recorded, test data documented, organized and readable',
    referencePhotos: ['/curriculum/rocket/build-log.jpg', '/curriculum/rocket/documentation.jpg'],
    estimatedHours: 15,
    difficulty: 'beginner',
    category: 'rocket_building',
    subcategory: 'documentation',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'NASA Engineering Notebook guidelines',
      'Technical writing for engineering projects',
    ],
    crossReferences: ['See WA-11.8.1 for engineering documentation standards'],
  },

  // WA-12.10.1: Failure Modes & Risk Analysis (FMEA)
  {
    level: 12,
    moduleNumber: '12.10',
    assignmentNumber: 'WA-12.10.1',
    orderIndex: 200,
    title: 'Failure Modes & Risk Analysis (FMEA)',
    description: 'Conduct systematic analysis of potential failure modes and implement risk mitigation strategies.',
    instructions: `1. List all major rocket subsystems: motor, airframe, recovery, avionics, fins
2. For each subsystem, identify potential failure modes (motor CATO, fin failure, chute failure, etc.)
3. Rate each failure: Severity (1-10), Likelihood (1-10), Detectability (1-10)
4. Calculate Risk Priority Number (RPN = S × L × D) for each failure mode
5. Prioritize highest-RPN failures for mitigation
6. Implement design changes or redundancy to reduce risk (stronger fins, dual deployment, etc.)
7. Create pre-flight inspection checklist addressing high-risk items
8. Plan for on-pad abort scenarios and emergency procedures
9. Re-calculate RPN after mitigations to verify risk reduction
10. Document FMEA in build log and share with launch team`,
    objectives: [
      'Identify all credible failure modes',
      'Quantify risk using severity, likelihood, detectability',
      'Prioritize failures by Risk Priority Number',
      'Implement design changes to mitigate high risks',
      'Create inspection procedures targeting failure modes',
      'Document risk analysis and mitigations',
    ],
    skills: ['Risk analysis', 'FMEA methodology', 'Systems thinking', 'Safety engineering', 'Critical thinking'],
    expectedOutcome: 'Complete FMEA document with identified risks, mitigation strategies, and inspection procedures.',
    passingCriteria: 'All major subsystems analyzed, RPN calculated for each failure, mitigations implemented for highest risks, checklist created',
    referencePhotos: ['/curriculum/rocket/fmea-table.jpg', '/curriculum/rocket/risk-matrix.jpg'],
    estimatedHours: 22,
    difficulty: 'advanced',
    category: 'rocket_building',
    subcategory: 'safety',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'FMEA methodology for aerospace',
      'Tripoli Safety Code and failure analysis',
    ],
    crossReferences: ['See WA-11.14.1 for propellant safety'],
  },

  // WA-12.10.2: Structural Load Testing & Verification
  {
    level: 12,
    moduleNumber: '12.10',
    assignmentNumber: 'WA-12.10.2',
    orderIndex: 201,
    title: 'Structural Load Testing & Verification',
    description: 'Test critical rocket structures to verify they can withstand flight loads with safety margin.',
    instructions: `1. Identify critical structures: fin attachment, motor mount, recovery bulkheads, shock cord
2. Calculate expected flight loads: acceleration (10-20G), aerodynamic forces, recovery forces
3. Design load test fixtures to apply forces to critical areas
4. Test fin attachment: apply side load simulating aerodynamic forces at 1.5x design load
5. Test motor mount retention: apply thrust load at 2x motor thrust rating
6. Test recovery bulkhead: apply tensile load at 5x expected parachute deployment force
7. Test shock cord attachment: pull test to 5x expected load
8. Observe for failures: cracks, separation, permanent deformation
9. Document test setup, loads applied, and results with photos
10. Re-design and re-test any components that fail`,
    objectives: [
      'Calculate expected flight loads for all structures',
      'Design and build load test fixtures',
      'Test critical structures at 1.5-5x design loads',
      'Verify safety margins before flight',
      'Document test procedures and results',
      'Re-design any components that fail testing',
    ],
    skills: ['Load testing', 'Test fixture design', 'Structural analysis', 'Data collection', 'Safety verification'],
    expectedOutcome: 'All critical structures tested and verified to withstand flight loads with documented safety margins.',
    passingCriteria: 'All tests completed at required load levels, no structural failures, test data documented, photos of test setup included',
    referencePhotos: ['/curriculum/rocket/fin-load-test.jpg', '/curriculum/rocket/bulkhead-test.jpg'],
    estimatedHours: 28,
    difficulty: 'advanced',
    category: 'rocket_building',
    subcategory: 'testing',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Structural testing for high-power rocketry',
      'Load test fixture design',
    ],
    crossReferences: ['See WA-11.10.1 for structural testing methods'],
  },

  // WA-12.10.3: Motor Static Test & Performance Validation
  {
    level: 12,
    moduleNumber: '12.10',
    assignmentNumber: 'WA-12.10.3',
    orderIndex: 202,
    title: 'Motor Static Test & Performance Validation',
    description: 'Conduct static test of rocket motor to measure thrust, total impulse, and verify safe operation.',
    instructions: `1. Build or acquire static test stand: thrust measurement (load cell), data acquisition
2. Design motor retention system matching flight configuration
3. Install motor in test stand with thrust alignment and proper restraint
4. Set up data acquisition: thrust (load cell), pressure (optional), video (high-speed if possible)
5. Perform range safety check: clear area, fire suppression ready, personnel at safe distance
6. Ignite motor remotely using tested ignition system
7. Record thrust curve throughout burn: peak thrust, average thrust, burn time
8. Calculate total impulse by integrating thrust curve (area under curve)
9. Compare measured performance to predicted values from simulation
10. Inspect motor casing post-burn for erosion, damage, or failure modes`,
    objectives: [
      'Build or set up static test stand with instrumentation',
      'Safely conduct motor static fire',
      'Record thrust curve and calculate total impulse',
      'Validate motor performance against predictions',
      'Inspect motor for safe operation and durability',
      'Document test data and observations',
    ],
    skills: ['Static testing', 'Data acquisition', 'Instrumentation', 'Safety procedures', 'Performance analysis'],
    expectedOutcome: 'Completed motor static test with recorded thrust curve, total impulse calculation, and post-test inspection.',
    passingCriteria: 'Motor fires successfully, thrust curve recorded, total impulse within 10% of prediction, no catastrophic failures, data documented',
    referencePhotos: ['/curriculum/rocket/static-test-stand.jpg', '/curriculum/rocket/thrust-curve.jpg'],
    estimatedHours: 32,
    difficulty: 'expert',
    category: 'rocket_building',
    subcategory: 'testing',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Amateur rocket motor testing procedures',
      '"Motor Static Testing" by Richard Nakka',
    ],
    crossReferences: ['See WA-11.12.1 for static testing procedures'],
  },

  // WA-12.10.4: Pre-Flight Inspection & Systems Check
  {
    level: 12,
    moduleNumber: '12.10',
    assignmentNumber: 'WA-12.10.4',
    orderIndex: 203,
    title: 'Pre-Flight Inspection & Systems Check',
    description: 'Conduct comprehensive pre-flight inspection using checklist to verify rocket airworthiness.',
    instructions: `1. Create comprehensive pre-flight checklist based on FMEA and build experience
2. Inspect airframe: cracks, damage, fin attachment security, paint condition
3. Inspect motor mount: retention system, thrust ring, centering rings secure
4. Inspect recovery system: shock cord condition, parachute packing, shear pins installed
5. Test avionics: altimeter battery voltage, continuity check, arming sequence
6. Verify ejection charges: correct weight, proper installation, e-match continuity
7. Check center of gravity and stability margin (1.5-2.0 calibers minimum)
8. Verify motor installation: proper fit, retention clip engaged, igniter installed
9. Final walkthrough with launch team: review flight plan, abort procedures, range safety
10. Sign off on inspection checklist and declare rocket airworthy (or identify issues)`,
    objectives: [
      'Create detailed pre-flight inspection checklist',
      'Inspect all rocket systems methodically',
      'Verify avionics and recovery system function',
      'Confirm stability and CG location',
      'Document inspection results and airworthiness',
      'Coordinate with launch team and RSO',
    ],
    skills: ['Inspection procedures', 'Checklist usage', 'Systems verification', 'Attention to detail', 'Safety culture'],
    expectedOutcome: 'Completed pre-flight inspection checklist with all systems verified airworthy or issues identified for correction.',
    passingCriteria: 'All checklist items addressed, avionics tested functional, stability verified, no safety issues identified, checklist signed',
    referencePhotos: ['/curriculum/rocket/pre-flight-inspection.jpg', '/curriculum/rocket/checklist.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'rocket_building',
    subcategory: 'testing',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Tripoli Pre-Flight Checklist templates',
      'NAR Safety Code inspection requirements',
    ],
    crossReferences: ['See WA-12.15.1 for launch day procedures'],
  },

  {
    level: 12,
    moduleNumber: '12.11',
    assignmentNumber: 'WA-12.11.1',
    orderIndex: 220,
    title: 'Flight Simulation & Performance Prediction',
    description: 'Simulate rocket flight using OpenRocket or RASAero to predict performance and optimize design.',
    instructions: `1. Study rocket flight simulation: equations of motion, drag, thrust curve
2. Learn OpenRocket software: build virtual rocket, input all dimensions
3. Practice drag coefficient modeling: nose, body, fins, interference
4. Master thrust curve input: import static test data or use stock motor
5. Study atmospheric model: standard atmosphere, density altitude effects
6. Learn stability simulation: CP/CG throughout flight, propellant burnout
7. Practice trajectory simulation: altitude, velocity, acceleration profiles
8. Study deployment simulation: apogee detection, dual deployment timing
9. Build complete rocket model in OpenRocket
10. Run simulations, optimize design, predict flight performance`,
    objectives: [
      'Build accurate simulation model of rocket',
      'Input all physical and aerodynamic parameters',
      'Simulate complete flight profile',
      'Predict altitude, velocity, and acceleration',
      'Verify stability throughout flight',
      'Optimize design based on simulation results',
    ],
    skills: ['Flight simulation', 'Performance prediction', 'Software modeling', 'Design optimization', 'Data analysis'],
    expectedOutcome: 'Complete flight simulation with predicted altitude, velocity, stability, and deployment events.',
    passingCriteria: 'Simulation model accurately represents physical rocket, predictions are reasonable, stability verified',
    referencePhotos: ['/curriculum/aerospace/openrocket-model.jpg', '/curriculum/aerospace/flight-simulation.jpg', '/curriculum/aerospace/trajectory-plot.jpg'],
    estimatedHours: 24,
    difficulty: 'expert',
    category: 'simulation',
    subcategory: 'flight-performance',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'OpenRocket user manual and tutorials',
      'RASAero II documentation (alternative)',
      'Rocket flight dynamics and simulation methods',
    ],
  },

  {
    level: 12,
    moduleNumber: '12.12',
    assignmentNumber: 'WA-12.12.1',
    orderIndex: 221,
    title: 'Avionics Integration - Flight Computer, GPS, Telemetry',
    description: 'Integrate electronics for flight control, data logging, and telemetry transmission.',
    instructions: `1. Study avionics requirements: altimeter, accelerometer, GPS, telemetry
2. Learn flight computer programming: apogee detection, deployment control
3. Practice GPS tracker integration: location transmission, recovery aid
4. Master telemetry systems: real-time data downlink, ground station
5. Study power systems: battery selection, voltage regulation, backup power
6. Learn wiring and harnessing: strain relief, connector selection, shielding
7. Practice avionics bay design: access, protection, mounting
8. Study data logging: flight profile recording, post-flight analysis
9. Integrate complete avionics system in rocket
10. Ground test all functions before flight`,
    objectives: [
      'Select appropriate avionics for mission',
      'Program flight computer correctly',
      'Integrate GPS and telemetry',
      'Design reliable power system',
      'Wire avionics professionally',
      'Test all systems thoroughly',
    ],
    skills: ['Avionics integration', 'Electronics assembly', 'Programming', 'System testing', 'Data systems'],
    expectedOutcome: 'Functioning avionics system with flight computer, GPS, telemetry, tested and ready for flight.',
    passingCriteria: 'All systems function correctly, deployment tests successful, telemetry receives data, GPS acquires lock',
    referencePhotos: ['/curriculum/aerospace/avionics-bay.jpg', '/curriculum/aerospace/flight-computer.jpg', '/curriculum/aerospace/telemetry-test.jpg'],
    estimatedHours: 40,
    difficulty: 'expert',
    category: 'avionics',
    subcategory: 'integration',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Flight computer manuals (Perfectflite, Missile Works, Altus Metrum)',
      'GPS tracker integration guides',
      'Telemetry system documentation',
    ],
    crossReferences: [
      'See Electronics Curriculum (Level 5-6) for circuit design and embedded programming',
      'See Computing Curriculum for data logging and telemetry protocols',
    ],
  },

  {
    level: 12,
    moduleNumber: '12.13',
    assignmentNumber: 'WA-12.13.1',
    orderIndex: 222,
    title: 'Final Assembly & System Integration',
    description: 'Integrate all rocket subsystems into complete vehicle, ensuring all interfaces work correctly.',
    instructions: `1. Study assembly sequence: build from tail to nose, test at each stage
2. Learn interface management: mechanical, electrical, structural connections
3. Practice fit verification: all parts mate correctly, no interference
4. Master fastener selection: screws, rivets, shear pins for recovery
5. Study mass properties: measure CG, verify stability margin
6. Learn electrical integration: route wires, connect systems, test continuity
7. Practice recovery system integration: pack parachutes, connect e-matches
8. Study final inspection checklist: verify all systems before transport
9. Assemble complete rocket, testing at each stage
10. Weigh, measure CG, verify all functions`,
    objectives: [
      'Assemble rocket in logical sequence',
      'Verify all mechanical interfaces',
      'Connect all electrical systems',
      'Test all functions after integration',
      'Measure and verify mass properties',
      'Create pre-flight inspection checklist',
    ],
    skills: ['System integration', 'Assembly procedures', 'Interface management', 'Testing protocols', 'Quality verification'],
    expectedOutcome: 'Completely assembled rocket with all systems integrated, tested, and verified ready for flight.',
    passingCriteria: 'All systems function, CG in correct location, stability verified, no loose fasteners, passes inspection',
    referencePhotos: ['/curriculum/aerospace/rocket-assembly.jpg', '/curriculum/aerospace/system-integration.jpg', '/curriculum/aerospace/pre-flight-check.jpg'],
    estimatedHours: 32,
    difficulty: 'expert',
    category: 'integration',
    subcategory: 'final-assembly',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Assembly and integration procedures',
      'Pre-flight inspection checklists',
      'System-level testing protocols',
    ],
  },

  {
    level: 12,
    moduleNumber: '12.14',
    assignmentNumber: 'WA-12.14.1',
    orderIndex: 223,
    title: 'Launch Site Preparation & Range Safety',
    description: 'Prepare launch site, establish range safety, and conduct launch readiness review.',
    instructions: `1. Study launch site requirements: clear area, wind conditions, waiver compliance
2. Learn range layout: launch controller location, safety distance, spectator area
3. Practice launch pad setup: rail or tower, stability, launch angle
4. Master ignition system: continuity test, safety key, remote launch controller
5. Study range safety officer duties: airspace clear, weather check, abort authority
6. Learn launch procedures: countdown, holds, range clear verification
7. Practice recovery area prediction: drift calculation, wind effects
8. Study emergency procedures: fire, injury, off-nominal flight
9. Set up complete launch range for rocket
10. Conduct launch readiness review with team`,
    objectives: [
      'Select and prepare suitable launch site',
      'Establish range safety procedures',
      'Set up launch pad and ignition system',
      'Define safety distances for rocket size',
      'Predict recovery area based on conditions',
      'Conduct pre-launch safety checks',
    ],
    skills: ['Launch operations', 'Range safety', 'Site preparation', 'Safety procedures', 'Team coordination'],
    expectedOutcome: 'Complete launch range setup with pad, controller, safety systems, ready for launch operations.',
    passingCriteria: 'Site meets waiver requirements, safety distances correct, ignition system tested, team briefed',
    referencePhotos: ['/curriculum/aerospace/launch-site.jpg', '/curriculum/aerospace/launch-pad-setup.jpg', '/curriculum/aerospace/range-safety.jpg'],
    estimatedHours: 20,
    difficulty: 'expert',
    category: 'operations',
    subcategory: 'launch-site',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'NAR/Tripoli launch safety procedures',
      'FAA waiver compliance requirements',
      'Launch site setup and range safety guidelines',
    ],
  },

  {
    level: 12,
    moduleNumber: '12.15',
    assignmentNumber: 'WA-12.15.1',
    orderIndex: 224,
    title: 'Pre-Flight Testing & Verification',
    description: 'Conduct comprehensive ground testing to verify all systems before committing to flight.',
    instructions: `1. Study ground test plan: structural, pressure, electrical, recovery deployment
2. Learn fit check procedures: motor installation, nose cone fit, fin alignment
3. Practice continuity testing: e-match resistance, circuit verification
4. Master recovery deployment test: ejection charge sizing, separation force
5. Study avionics functional test: power-on, acquisition, logging, deployment simulation
6. Learn thrust-to-weight verification: weigh rocket with motor, calculate performance
7. Practice center of gravity measurement: balance point, stability margin verification
8. Study pre-flight inspection: visual check, fastener torque, no damage
9. Complete all ground tests per test plan
10. Document results and obtain go/no-go for flight`,
    objectives: [
      'Execute comprehensive ground test program',
      'Verify all mechanical systems',
      'Test all electrical systems',
      'Validate recovery deployment',
      'Measure mass properties accurately',
      'Document all test results',
    ],
    skills: ['Ground testing', 'System verification', 'Test documentation', 'Go/no-go decisions', 'Quality assurance'],
    expectedOutcome: 'Complete ground test report with all systems verified, documented go/no-go decision for flight.',
    passingCriteria: 'All tests pass, no anomalies, documentation complete, team concurs on flight readiness',
    referencePhotos: ['/curriculum/aerospace/ground-testing.jpg', '/curriculum/aerospace/deployment-test.jpg', '/curriculum/aerospace/test-documentation.jpg'],
    estimatedHours: 28,
    difficulty: 'expert',
    category: 'testing',
    subcategory: 'pre-flight',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Ground test procedures for rockets',
      'Pre-flight inspection checklists',
      'Test documentation standards',
    ],
  },

  {
    level: 12,
    moduleNumber: '12.3',
    assignmentNumber: 'WA-12.3.1',
    orderIndex: 225,
    title: 'CAPSTONE PROJECT: Complete Rocket Fabrication',
    description: 'Build a complete rocket from raw materials: airframe, motor, recovery system, avionics. This is your masterwork - the culmination of everything you have learned.',
    instructions: `1. Design complete rocket in Fusion 360: airframe, motor mount, fins, nose cone, recovery bay
2. Perform stability analysis: CP/CG relationship, static margin, fin design
3. Simulate flight profile: OpenRocket or RASAero II
4. Fabricate airframe: filament-wound fiberglass or machined aluminum
5. Machine motor mount: precision fit to motor case, centering rings
6. Fabricate fins: aluminum or composite, precision alignment (within 0.5°)
7. Turn nose cone: aerodynamic profile, ogive or von Karman shape
8. Integrate recovery system: parachute, shock cord, deployment mechanism
9. Install avionics: flight computer, altimeter, GPS telemetry
10. Integrate motor you fabricated in previous assignment
11. Perform ground testing: structural, pressure, electrical, recovery deployment
12. Document complete build: drawings, procedures, test reports, risk assessment
13. Static fire test motor (on test stand, remote location)
14. Launch rocket under supervision with proper certifications`,
    objectives: [
      'Design complete rocket system with all subsystems',
      'Analyze stability and flight performance',
      'Fabricate all structural components to specifications',
      'Integrate propulsion, recovery, and avionics systems',
      'Test all systems before flight',
      'Document project to professional standards',
      'Successfully launch and recover rocket',
    ],
    skills: ['System integration', 'Complete fabrication workflow', 'Testing protocols', 'Risk management', 'Project documentation'],
    expectedOutcome: 'Complete rocket: designed, fabricated, tested, flown, and recovered. Full documentation package.',
    passingCriteria: 'All subsystems functional, rocket stable and recoverable, successful flight, complete documentation, professional quality throughout',
    referencePhotos: ['/curriculum/aerospace/complete-rocket.jpg', '/curriculum/aerospace/launch-prep.jpg', '/curriculum/aerospace/successful-flight.jpg'],
    estimatedHours: 200,
    difficulty: 'expert',
    category: 'aerospace',
    subcategory: 'capstone',
    serviceTrack: 'woodworking_aerospace' as ServiceTrack,
    requiredReading: [
      'Review ALL previous curriculum reading materials',
      '"Modern High-Power Rocketry" by Mark Canepa',
      '"Make: Rockets" by Mike Westerfield',
      'Tripoli Rocketry Association Level 3 certification requirements',
      '"Ignition!" by John D. Clark (for your inspiration and entertainment)',
    ],
    crossReferences: [
      'See Tailoring Curriculum (Advanced) for parachute fabrication and harness design',
      'See Electronics Curriculum (Complete) for flight computer, sensors, telemetry, and igniter circuits',
      'See Computing Curriculum (Advanced) for flight software, data logging, and ground station',
    ],
  },
]

export async function seedWoodworkingAerospaceCurriculum() {
  console.log('🚀 Seeding Woodworking to Aerospace Manufacturing Curriculum...')
  console.log('This curriculum takes an apprentice from basic woodworking to building rockets from scratch.')
  console.log('Includes: Woodworking → Metalworking → Fusion 360 CAD/CAM → Machining → Foundry → Aerospace Manufacturing')

  for (const assignment of woodworkingAerospaceCurriculum) {
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

  console.log(`\n✅ Woodworking to Aerospace Curriculum seeded successfully!`)
  console.log(`   Total assignments: ${woodworkingAerospaceCurriculum.length}`)
  console.log(`   Level 1 (Workshop Foundations): ${woodworkingAerospaceCurriculum.filter(a => a.level === 1).length} assignments`)
  console.log(`   Level 2 (Joinery): ${woodworkingAerospaceCurriculum.filter(a => a.level === 2).length} assignments`)
  console.log(`   Level 3 (Fusion 360 Intro): ${woodworkingAerospaceCurriculum.filter(a => a.level === 3).length} assignments`)
  console.log(`   Level 6 (Metalworking): ${woodworkingAerospaceCurriculum.filter(a => a.level === 6).length} assignments`)
  console.log(`   Level 8 (Machining): ${woodworkingAerospaceCurriculum.filter(a => a.level === 8).length} assignments`)
  console.log(`   Level 10 (Foundry): ${woodworkingAerospaceCurriculum.filter(a => a.level === 10).length} assignments`)
  console.log(`   Level 12 (Aerospace): ${woodworkingAerospaceCurriculum.filter(a => a.level === 12).length} assignments`)
  console.log(`\n📚 This is a SAMPLE showing the structure. The complete curriculum would have 200+ assignments across 12 levels.`)
  console.log(`   The full version will take apprentices 3.5+ years and cover every skill needed to build a rocket from scratch.`)
}

// Run if called directly
if (require.main === module) {
  seedWoodworkingAerospaceCurriculum()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

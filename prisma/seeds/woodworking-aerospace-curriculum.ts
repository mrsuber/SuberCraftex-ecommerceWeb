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

  // Continue with Level 2 assignments...
  // I'll create a representative sample of the curriculum structure
  // The complete version would have 200+ assignments across all levels

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

  {
    level: 12,
    moduleNumber: '12.3',
    assignmentNumber: 'WA-12.3.1',
    orderIndex: 190,
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

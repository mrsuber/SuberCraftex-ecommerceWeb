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

const embroideryCurriculum: AssignmentTemplateData[] = [
  // ============================================================================
  // LEVEL 1: HAND EMBROIDERY FOUNDATIONS (Months 1-2)
  // ============================================================================

  {
    level: 1,
    moduleNumber: '1.1',
    assignmentNumber: 'EMB-1.1.1',
    orderIndex: 1,
    title: 'Hand Embroidery Tools & Materials',
    description: 'Master the identification and use of hand embroidery tools, threads, needles, and fabrics. Build your essential embroidery toolkit.',
    instructions: `1. Study embroidery needles: crewel (sharp), tapestry (blunt), chenille (large eye)
2. Learn thread types: stranded cotton (DMC, Anchor), perle cotton, silk, metallic
3. Understand fabric choices: linen, cotton, evenweave, Aida cloth
4. Learn hoop types: wooden, plastic, spring tension, q-snap frames
5. Study scissors: embroidery scissors (sharp points), thread snips
6. Understand stabilizers: tear-away, cut-away, wash-away, heat-away
7. Practice threading needles and separating thread strands
8. Create embroidery tool kit with all essentials
9. Build thread color palette (50+ colors organized)`,
    objectives: [
      'Identify all essential hand embroidery tools',
      'Select appropriate needles for different threads and fabrics',
      'Understand thread types and their applications',
      'Choose fabrics suitable for various embroidery techniques',
      'Organize and maintain embroidery supplies',
    ],
    skills: ['Tool identification', 'Material selection', 'Thread management', 'Organization'],
    expectedOutcome: 'Complete embroidery toolkit with organized threads, needles, hoops, and reference materials.',
    passingCriteria: 'Correctly identify all tools, select appropriate materials for 5 different project scenarios',
    referencePhotos: ['/curriculum/embroidery/tools.jpg', '/curriculum/embroidery/threads.jpg', '/curriculum/embroidery/needles.jpg'],
    estimatedHours: 6,
    difficulty: 'beginner',
    category: 'foundations',
    subcategory: 'tools',
    serviceTrack: 'embroidery' as ServiceTrack,
    requiredReading: [
      '"The Embroidery Stitch Bible" by Betty Barnden',
      '"Royal School of Needlework Essential Stitch Guide" by Jacqui McDonald',
      'DMC thread color chart and conversion guide',
    ],
  },

  {
    level: 1,
    moduleNumber: '1.2',
    assignmentNumber: 'EMB-1.2.1',
    orderIndex: 2,
    title: 'Basic Hand Embroidery Stitches',
    description: 'Learn the fundamental stitches that form the foundation of all hand embroidery: running stitch, backstitch, stem stitch, satin stitch, and French knots.',
    instructions: `1. Practice running stitch: even spacing, consistent length
2. Master backstitch: solid line, no gaps between stitches
3. Learn stem stitch: curved lines, consistent angle
4. Practice split stitch: fine lines, good for outlining
5. Master satin stitch: smooth fill, parallel threads, no gaps
6. Learn French knots: single and double wrap, consistent size
7. Practice seed stitch: random filling technique
8. Complete sampler with all basic stitches
9. Stitch 10 practice pieces demonstrating each stitch`,
    objectives: [
      'Execute 20+ basic embroidery stitches accurately',
      'Maintain consistent tension throughout',
      'Start and end threads invisibly',
      'Create smooth satin stitch fills',
      'Form perfect French knots every time',
    ],
    skills: ['Hand stitching', 'Tension control', 'Stitch consistency', 'Technique precision'],
    expectedOutcome: 'Embroidery sampler displaying all basic stitches with consistent quality.',
    passingCriteria: 'All stitches are even, tension is consistent, no thread showing on back, professional appearance',
    referencePhotos: ['/curriculum/embroidery/basic-stitches.jpg', '/curriculum/embroidery/sampler.jpg', '/curriculum/embroidery/french-knots.jpg'],
    estimatedHours: 16,
    difficulty: 'beginner',
    category: 'technique',
    subcategory: 'hand-stitching',
    serviceTrack: 'embroidery' as ServiceTrack,
    requiredReading: [
      '"Embroidery Basics: A Needle Knowledge Book" by Beth Colletti',
      '"A-Z of Embroidery Stitches" - Search Press',
    ],
    crossReferences: [
      'Builds on Tailoring Curriculum (Level 1) - Hand Stitching Fundamentals',
    ],
  },

  // ============================================================================
  // LEVEL 2: MACHINE EMBROIDERY BASICS (Months 3-4)
  // ============================================================================

  {
    level: 2,
    moduleNumber: '2.1',
    assignmentNumber: 'EMB-2.1.1',
    orderIndex: 5,
    title: 'Embroidery Machine Setup & Operation',
    description: 'Learn to set up and operate a computerized embroidery machine. Understand hooping, stabilizing, and thread tension.',
    instructions: `1. Study embroidery machine anatomy: needle, hoop arm, thread path, bobbin case
2. Learn machine threading: top thread path, bobbin winding, thread tension
3. Practice proper hooping technique: fabric taut but not stretched
4. Understand stabilizer selection for different fabrics
5. Learn design loading: USB, built-in designs, file formats (.dst, .pes, .jef)
6. Master machine calibration: hoop centering, design placement
7. Practice thread color changes during stitching
8. Learn basic troubleshooting: thread breaks, skipped stitches, tension issues
9. Complete 10 practice embroideries with different settings`,
    objectives: [
      'Set up embroidery machine correctly',
      'Hoop fabric with proper tension',
      'Select appropriate stabilizers',
      'Load and position designs accurately',
      'Troubleshoot common machine issues',
      'Achieve quality embroidery output',
    ],
    skills: ['Machine operation', 'Hooping technique', 'Stabilizer selection', 'Design loading', 'Troubleshooting'],
    expectedOutcome: 'Ten successful machine embroideries demonstrating proper setup and technique.',
    passingCriteria: 'All embroideries have good registration, no puckering, clean stitching, proper density',
    referencePhotos: ['/curriculum/embroidery/machine-setup.jpg', '/curriculum/embroidery/hooping.jpg', '/curriculum/embroidery/stabilizers.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'machine',
    subcategory: 'operation',
    serviceTrack: 'embroidery' as ServiceTrack,
    requiredReading: [
      'Your embroidery machine manual (Brother, Janome, Bernina, etc.)',
      '"Machine Embroidery Basics" by Sulky',
      '"The Complete Photo Guide to Machine Embroidery" by Deborah Jones',
    ],
  },

  {
    level: 2,
    moduleNumber: '2.2',
    assignmentNumber: 'EMB-2.2.1',
    orderIndex: 7,
    title: 'Embroidery Digitizing Fundamentals',
    description: 'Learn to create custom embroidery designs using digitizing software. Convert artwork to stitch files.',
    instructions: `1. Study digitizing software: Wilcom, Hatch, Embrilliance, PE-Design
2. Learn design elements: underlay, fill stitches, satin stitches, running stitches
3. Understand stitch direction: angle affects light reflection and appearance
4. Practice auto-digitizing: convert images to stitches automatically
5. Learn manual digitizing: create designs from scratch with precise control
6. Study density settings: too dense = puckering, too sparse = gaps
7. Master push/pull compensation: account for fabric distortion
8. Learn lettering: font selection, sizing, spacing
9. Digitize 10 custom designs from artwork
10. Test-stitch all designs and refine`,
    objectives: [
      'Use digitizing software to create stitch files',
      'Convert artwork to embroidery designs',
      'Set appropriate stitch density and direction',
      'Create clean, professional digitized designs',
      'Understand underlay and its importance',
      'Optimize designs for different fabrics',
    ],
    skills: ['Digitizing software', 'Design conversion', 'Stitch planning', 'Density control', 'Quality optimization'],
    expectedOutcome: 'Ten digitized designs in machine format, test-stitched and refined.',
    passingCriteria: 'Designs stitch cleanly without puckering, density is appropriate, registration is accurate',
    referencePhotos: ['/curriculum/embroidery/digitizing-software.jpg', '/curriculum/embroidery/stitch-angles.jpg', '/curriculum/embroidery/digitized-design.jpg'],
    estimatedHours: 24,
    difficulty: 'intermediate',
    category: 'digitizing',
    subcategory: 'software',
    serviceTrack: 'embroidery' as ServiceTrack,
    requiredReading: [
      '"Digitizing Made Easy" by John Deer',
      'Wilcom/Hatch software tutorials (official)',
      '"The Embroidery Business" by Joyce Jagger',
    ],
  },

  // ============================================================================
  // LEVEL 3: ADVANCED TECHNIQUES (Months 5-6)
  // ============================================================================

  {
    level: 3,
    moduleNumber: '3.1',
    assignmentNumber: 'EMB-3.1.1',
    orderIndex: 10,
    title: '3D Puff Embroidery & Specialty Techniques',
    description: 'Master specialty embroidery techniques: 3D puff, appliqué, sequins, and dimensional effects.',
    instructions: `1. Learn 3D puff embroidery: foam application, design requirements, stitch density
2. Practice appliqué embroidery: fabric placement, tack-down, satin border
3. Master sequin application: sequin feed attachment, design digitizing
4. Study chenille embroidery: looped thread technique, moss effect
5. Learn metallic thread embroidery: special needles, tension adjustment, slow speed
6. Practice photo stitch: fine detail, color blending, high stitch count
7. Create specialty sample board with all techniques
8. Digitize designs optimized for each specialty technique
9. Complete 5 projects using advanced techniques`,
    objectives: [
      'Create 3D puff embroidery effects',
      'Execute appliqué with clean edges',
      'Apply sequins using machine attachment',
      'Work with specialty threads (metallic, chenille)',
      'Digitize designs for specialty techniques',
      'Troubleshoot specialty technique issues',
    ],
    skills: ['3D puff', 'Appliqué', 'Sequin application', 'Specialty threads', 'Advanced digitizing'],
    expectedOutcome: 'Sample board and 5 projects demonstrating all advanced embroidery techniques.',
    passingCriteria: 'All techniques executed professionally, puff has good height, appliqué edges are clean, sequins are secure',
    referencePhotos: ['/curriculum/embroidery/puff-embroidery.jpg', '/curriculum/embroidery/applique.jpg', '/curriculum/embroidery/specialty-samples.jpg'],
    estimatedHours: 20,
    difficulty: 'advanced',
    category: 'advanced',
    subcategory: 'specialty',
    serviceTrack: 'embroidery' as ServiceTrack,
    requiredReading: [
      '"Dimensional Embroidery" by Kristen Dibbs',
      '"Appliqué Made Easy" by Mimi Dietrich',
      'Madeira specialty thread guide',
    ],
  },

  // ============================================================================
  // LEVEL 4: COMMERCIAL EMBROIDERY (Months 7-8)
  // ============================================================================

  {
    level: 4,
    moduleNumber: '4.1',
    assignmentNumber: 'EMB-4.1.1',
    orderIndex: 13,
    title: 'Logo Embroidery & Corporate Branding',
    description: 'Master logo digitizing and embroidery for corporate apparel, uniforms, and promotional products.',
    instructions: `1. Study logo digitizing: clean lines, readable text, small details
2. Learn left chest sizing: standard 3.5-4" wide for polo/dress shirt
3. Practice back logo sizing: 9-12" wide depending on garment
4. Master cap embroidery: hoop techniques, foam inserts, flat/3D designs
5. Learn jacket back embroidery: large designs, fill optimization
6. Study color matching: thread to PMS/logo colors
7. Practice small lettering: minimum 0.25" height for readability
8. Create logo samples on multiple garment types
9. Digitize and produce 10 corporate logo projects`,
    objectives: [
      'Digitize corporate logos for embroidery',
      'Size designs appropriately for garment placement',
      'Embroider caps with professional results',
      'Match thread colors to brand standards',
      'Handle small text legibly',
      'Produce commercial-quality logo embroidery',
    ],
    skills: ['Logo digitizing', 'Sizing standards', 'Cap embroidery', 'Color matching', 'Commercial production'],
    expectedOutcome: 'Ten corporate logo embroidery projects on various garments (shirts, caps, jackets).',
    passingCriteria: 'Logos are clean and readable, sizing is appropriate, colors match brand, professional quality throughout',
    referencePhotos: ['/curriculum/embroidery/logo-samples.jpg', '/curriculum/embroidery/cap-embroidery.jpg', '/curriculum/embroidery/corporate-apparel.jpg'],
    estimatedHours: 18,
    difficulty: 'advanced',
    category: 'commercial',
    subcategory: 'logo',
    serviceTrack: 'embroidery' as ServiceTrack,
    requiredReading: [
      '"How to Start a Home-Based Embroidery Business" by Suzanne Hinshaw',
      '"Corporate Embroidery Best Practices" - trade publications',
      'Industry standard sizing guidelines',
    ],
    crossReferences: [
      'Integrates with Printing Press Curriculum (Level 4) - can combine embroidery with screen printing for premium products',
    ],
  },

  // ============================================================================
  // LEVEL 5: DECORATIVE & HEIRLOOM TECHNIQUES (Months 9-10)
  // ============================================================================

  {
    level: 5,
    moduleNumber: '5.1',
    assignmentNumber: 'EMB-5.1.1',
    orderIndex: 16,
    title: 'Heirloom Embroidery & Fine Detailing',
    description: 'Master delicate heirloom embroidery techniques for luxury garments, monogramming, and decorative textiles.',
    instructions: `1. Study heirloom techniques: shadow work, cutwork, drawn thread
2. Learn monogramming: traditional styles, letter placement, sizing
3. Practice Madeira embroidery: eyelet, satin stitch borders
4. Master whitework: tone-on-tone embroidery, delicate stitching
5. Study lace insertion: entredeux, pin stitching
6. Learn smocking by machine: gathering, stitch patterns
7. Practice heirloom stitches on fine fabrics: batiste, organdy, silk
8. Create christening gown or formal garment with heirloom techniques
9. Complete monogramming on luxury items: towels, robes, linens`,
    objectives: [
      'Execute delicate heirloom embroidery techniques',
      'Create traditional monograms in various styles',
      'Work with fine fabrics without damage',
      'Combine techniques for luxury appearance',
      'Produce heirloom-quality finished pieces',
    ],
    skills: ['Heirloom techniques', 'Monogramming', 'Fine fabric handling', 'Delicate stitching', 'Luxury finishing'],
    expectedOutcome: 'Heirloom garment or textile featuring multiple techniques, plus monogrammed luxury items.',
    passingCriteria: 'Work is delicate and precise, no fabric damage, monograms are perfectly placed and stitched',
    referencePhotos: ['/curriculum/embroidery/heirloom-gown.jpg', '/curriculum/embroidery/monogram.jpg', '/curriculum/embroidery/whitework.jpg'],
    estimatedHours: 24,
    difficulty: 'advanced',
    category: 'decorative',
    subcategory: 'heirloom',
    serviceTrack: 'embroidery' as ServiceTrack,
    requiredReading: [
      '"French Hand Sewing by Machine" by Karen McTavish',
      '"Heirloom Machine Embroidery" by Suzanne Hinshaw',
      '"The Art of Monogramming" by Susan O\'Connor',
    ],
    crossReferences: [
      'Complements Tailoring Curriculum (Level 3-5) - embellishment for couture garments',
      'Referenced in Beadwork Curriculum - can combine embroidery with beading',
    ],
  },

  // ============================================================================
  // LEVEL 6: TECHNICAL EMBROIDERY & APPLICATIONS (Months 11-12)
  // ============================================================================

  {
    level: 6,
    moduleNumber: '6.1',
    assignmentNumber: 'EMB-6.1.1',
    orderIndex: 19,
    title: 'Aerospace & Technical Embroidery',
    description: 'Master embroidery for technical applications: mission patches, flags, emblems, and durable outdoor embroidery.',
    instructions: `1. Study mission patch design: NASA standards, symbolism, readability
2. Learn flag embroidery: proper colors, proportions, durability
3. Practice emblem digitizing: badges, rank insignia, organizational logos
4. Master heavy-duty materials: leather, canvas, nylon, outdoor fabrics
5. Learn reinforcement techniques: extra underlay, multiple layers, edge reinforcement
6. Study UV-resistant threads: polyester vs rayon for outdoor durability
7. Practice embroidery on difficult materials: thick leather, thin ripstop
8. Create mission patch from concept to finished embroidered patch
9. Embroider flags, emblems, and technical insignia`,
    objectives: [
      'Design and digitize mission patches',
      'Embroider on heavy-duty technical fabrics',
      'Create durable outdoor embroidery',
      'Follow standards for flags and emblems',
      'Use appropriate threads for longevity',
      'Produce aerospace-quality patches and insignia',
    ],
    skills: ['Mission patch design', 'Technical digitizing', 'Heavy material embroidery', 'Durability optimization', 'Standards compliance'],
    expectedOutcome: 'Mission patch, flags, and emblems demonstrating technical embroidery mastery.',
    passingCriteria: 'Patches meet NASA/aerospace standards, embroidery is durable, colors are accurate, professional finish',
    referencePhotos: ['/curriculum/embroidery/mission-patch.jpg', '/curriculum/embroidery/flag-embroidery.jpg', '/curriculum/embroidery/technical-emblem.jpg'],
    estimatedHours: 20,
    difficulty: 'expert',
    category: 'technical',
    subcategory: 'aerospace',
    serviceTrack: 'embroidery' as ServiceTrack,
    requiredReading: [
      'NASA mission patch design guidelines',
      '"Embroidery on Difficult Materials" - industry guides',
      '"Flag Etiquette and Specifications" - US Flag Code',
    ],
    crossReferences: [
      'CRITICAL for Woodworking-Aerospace Curriculum (Level 12) - mission patches for rockets',
      'Integrates with Tailoring Curriculum (Level 5-6) - parachute decoration and rigging labels',
    ],
  },

  {
    level: 6,
    moduleNumber: '6.2',
    assignmentNumber: 'EMB-6.2.1',
    orderIndex: 21,
    title: 'Production Embroidery & Business Operations',
    description: 'Master high-volume embroidery production, multi-head machines, and embroidery business management.',
    instructions: `1. Learn multi-head machine operation: 4, 6, 8, or 15-head systems
2. Study production workflow: hooping systems, quality control, thread changes
3. Master production digitizing: minimize trims, optimize efficiency, reduce time
4. Practice gang runs: multiple items hooped at once
5. Learn pricing strategies: per-stitch pricing, setup charges, rush fees
6. Study production planning: order batching, color grouping, machine scheduling
7. Master quality control: inspection standards, acceptable defects, rework procedures
8. Create standard operating procedures (SOPs) for all processes
9. Complete simulated 500-piece production run`,
    objectives: [
      'Operate multi-head embroidery systems',
      'Optimize designs for production efficiency',
      'Plan and execute large production runs',
      'Maintain quality across high volumes',
      'Price embroidery services competitively and profitably',
      'Manage embroidery business operations',
    ],
    skills: ['Multi-head operation', 'Production planning', 'Efficiency optimization', 'Quality control', 'Business management'],
    expectedOutcome: 'Completed 500-piece simulated production run with quality documentation.',
    passingCriteria: 'Production completed on schedule, quality is consistent, pricing is profitable, all SOPs documented',
    referencePhotos: ['/curriculum/embroidery/multi-head-machine.jpg', '/curriculum/embroidery/production-floor.jpg', '/curriculum/embroidery/quality-inspection.jpg'],
    estimatedHours: 30,
    difficulty: 'expert',
    category: 'business',
    subcategory: 'production',
    serviceTrack: 'embroidery' as ServiceTrack,
    requiredReading: [
      '"Embroidery Business From Home" by Suzanne Hinshaw',
      '"Production Embroidery Best Practices" - Impressions Magazine',
      '"Pricing for Profit in Embroidery" - industry guides',
    ],
  },
]

export async function seedEmbroideryCurriculum() {
  console.log('🧵 Seeding Embroidery Curriculum...')
  console.log('Embroidery connects Tailoring, Woodworking-Aerospace, and commercial decoration')

  for (const assignment of embroideryCurriculum) {
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

  console.log(`\n✅ Embroidery Curriculum seeded successfully!`)
  console.log(`   Total assignments: ${embroideryCurriculum.length}`)
  console.log(`   Level 1 (Hand Embroidery): ${embroideryCurriculum.filter(a => a.level === 1).length} assignments`)
  console.log(`   Level 2 (Machine & Digitizing): ${embroideryCurriculum.filter(a => a.level === 2).length} assignments`)
  console.log(`   Level 3 (Advanced Techniques): ${embroideryCurriculum.filter(a => a.level === 3).length} assignments`)
  console.log(`   Level 4 (Commercial): ${embroideryCurriculum.filter(a => a.level === 4).length} assignments`)
  console.log(`   Level 5 (Heirloom): ${embroideryCurriculum.filter(a => a.level === 5).length} assignments`)
  console.log(`   Level 6 (Technical & Business): ${embroideryCurriculum.filter(a => a.level === 6).length} assignments`)
  console.log(`\n🔗 Cross-references: Tailoring, Woodworking-Aerospace, Beadwork, Printing Press`)
}

// Run if called directly
if (require.main === module) {
  seedEmbroideryCurriculum()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

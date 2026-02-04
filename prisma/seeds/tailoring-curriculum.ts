import { PrismaClient } from '@prisma/client'

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
}

const tailoringCurriculum: AssignmentTemplateData[] = [
  // ============================================================================
  // LEVEL 1: FOUNDATION (Months 1-3)
  // ============================================================================

  // Module 1.1: Introduction to Tailoring
  {
    level: 1,
    moduleNumber: '1.1',
    assignmentNumber: '1.1.1',
    orderIndex: 1,
    title: 'Tool Identification Test',
    description: 'Learn to identify and properly use all essential tailoring tools. This foundational assignment ensures you understand the purpose and proper handling of each tool in a tailor\'s workshop.',
    instructions: `1. Study each of the 15 basic tailoring tools
2. Practice proper handling techniques for each tool
3. Learn maintenance requirements (cleaning, storage, sharpening)
4. Complete the written identification test
5. Demonstrate proper use of each tool to your mentor`,
    objectives: [
      'Identify all 15 basic tailoring tools by name',
      'Explain the purpose of each tool',
      'Demonstrate proper handling technique',
      'Understand maintenance and care requirements',
    ],
    skills: ['Tool identification', 'Workshop organization', 'Safety protocols'],
    expectedOutcome: 'Correctly identify and demonstrate use of: tape measure, fabric shears, pinking shears, seam ripper, hand needles, thimble, pin cushion, dressmaker pins, tailor\'s chalk, tracing wheel, iron, pressing board, sleeve board, tailor\'s ham, and clapper.',
    passingCriteria: 'Score 90% or higher on written test and successfully demonstrate all tools',
    referencePhotos: ['/curriculum/tools/tape-measure.jpg', '/curriculum/tools/fabric-shears.jpg', '/curriculum/tools/tailors-ham.jpg'],
    estimatedHours: 8,
    difficulty: 'beginner',
    category: 'tools',
    subcategory: 'identification',
  },
  {
    level: 1,
    moduleNumber: '1.1',
    assignmentNumber: '1.1.2',
    orderIndex: 2,
    title: 'Workshop Setup & Organization',
    description: 'Learn to organize a professional tailoring workspace for efficiency and safety.',
    instructions: `1. Study the standard workshop layout
2. Organize your assigned workspace
3. Set up proper lighting for detail work
4. Arrange tools for right or left-handed use
5. Create a daily cleaning routine`,
    objectives: [
      'Understand ergonomic workspace principles',
      'Organize tools for efficient workflow',
      'Maintain a clean, safe environment',
    ],
    skills: ['Organization', 'Ergonomics', 'Professionalism'],
    expectedOutcome: 'A well-organized, efficient workspace that promotes quality work and prevents injury.',
    passingCriteria: 'Workspace passes mentor inspection checklist',
    referencePhotos: ['/curriculum/workshop/organized-bench.jpg'],
    estimatedHours: 4,
    difficulty: 'beginner',
    category: 'tools',
    subcategory: 'workshop',
  },

  // Module 1.2: Understanding Fabrics
  {
    level: 1,
    moduleNumber: '1.2',
    assignmentNumber: '1.2.1',
    orderIndex: 3,
    title: 'Fabric Swatch Book - Natural Fibers',
    description: 'Create a comprehensive swatch book of natural fiber fabrics including wool, cotton, linen, and silk varieties.',
    instructions: `1. Collect minimum 20 fabric samples of natural fibers
2. Mount each swatch neatly in your book
3. Document for each: fiber content, weight, weave type, appropriate uses
4. Include care instructions for each fabric
5. Organize by fiber type (wool, cotton, linen, silk)`,
    objectives: [
      'Identify natural fiber fabrics by touch and appearance',
      'Understand weight classifications (light, medium, heavy)',
      'Know appropriate uses for each fabric type',
      'Understand care requirements',
    ],
    skills: ['Fabric identification', 'Material knowledge', 'Documentation'],
    expectedOutcome: 'A professional swatch book with at least 20 natural fiber samples, properly documented.',
    passingCriteria: 'Book contains minimum 20 samples with complete documentation',
    referencePhotos: ['/curriculum/fabric/wool-samples.jpg', '/curriculum/fabric/cotton-samples.jpg', '/curriculum/fabric/linen-samples.jpg', '/curriculum/fabric/silk-samples.jpg'],
    estimatedHours: 12,
    difficulty: 'beginner',
    category: 'fabric',
    subcategory: 'natural-fibers',
  },
  {
    level: 1,
    moduleNumber: '1.2',
    assignmentNumber: '1.2.2',
    orderIndex: 4,
    title: 'Weave Pattern Recognition',
    description: 'Learn to identify and understand different fabric weave patterns used in tailoring.',
    instructions: `1. Study the 10 primary weave types
2. Collect samples of each weave type
3. Document characteristics of each weave
4. Practice identifying weaves blindfolded by touch
5. Understand which weaves suit which garments`,
    objectives: [
      'Identify plain, twill, satin, herringbone, and houndstooth weaves',
      'Understand how weave affects drape and durability',
      'Know which weaves are formal vs casual',
    ],
    skills: ['Pattern recognition', 'Tactile identification', 'Weave analysis'],
    expectedOutcome: 'Correctly identify 10 different weave types by sight and touch.',
    passingCriteria: 'Score 90% on weave identification test',
    referencePhotos: ['/curriculum/fabric/plain-weave.jpg', '/curriculum/fabric/twill-weave.jpg', '/curriculum/fabric/herringbone.jpg', '/curriculum/fabric/houndstooth.jpg'],
    estimatedHours: 8,
    difficulty: 'beginner',
    category: 'fabric',
    subcategory: 'weaves',
  },
  {
    level: 1,
    moduleNumber: '1.2',
    assignmentNumber: '1.2.3',
    orderIndex: 5,
    title: 'Grain Line Exercise',
    description: 'Master the concept of fabric grain and its importance in garment construction.',
    instructions: `1. Mark grain lines on 5 different fabric samples
2. Cut squares on grain and on bias from each sample
3. Pull and stretch each piece, document behavior
4. Understand why grain direction matters
5. Practice finding true grain on various fabrics`,
    objectives: [
      'Identify lengthwise grain (warp), crosswise grain (weft), and bias',
      'Understand how grain affects stretch and drape',
      'Know how to find and mark true grain',
    ],
    skills: ['Grain identification', 'Fabric behavior', 'Cutting accuracy'],
    expectedOutcome: 'Documented comparison of on-grain vs bias-cut fabric behavior.',
    passingCriteria: 'Correctly identify grain direction on 5 different fabrics',
    referencePhotos: ['/curriculum/fabric/grain-lines.jpg', '/curriculum/fabric/bias-cut.jpg'],
    estimatedHours: 6,
    difficulty: 'beginner',
    category: 'fabric',
    subcategory: 'grain',
  },

  // Module 1.3: Hand Stitching Fundamentals
  {
    level: 1,
    moduleNumber: '1.3',
    assignmentNumber: '1.3.1',
    orderIndex: 6,
    title: 'Running Stitch & Basting Practice',
    description: 'Master the foundational stitches used for temporary assembly and gathering.',
    instructions: `1. Thread needle properly with appropriate thread length
2. Practice running stitch on muslin: 1/4" even stitches
3. Practice basting stitch: 1/2" to 1" stitches
4. Create 10" sample of each stitch type
5. Practice removing basting stitches cleanly`,
    objectives: [
      'Execute even, consistent running stitches',
      'Understand when to use running vs basting',
      'Remove basting without fabric damage',
    ],
    skills: ['Running stitch', 'Basting', 'Thread handling'],
    expectedOutcome: 'Clean, even stitch samples showing consistent spacing and tension.',
    passingCriteria: 'Stitches are even with consistent 1/4" spacing',
    referencePhotos: ['/curriculum/stitches/running-stitch.jpg', '/curriculum/stitches/basting-stitch.jpg'],
    estimatedHours: 4,
    difficulty: 'beginner',
    category: 'stitching',
    subcategory: 'hand-basic',
  },
  {
    level: 1,
    moduleNumber: '1.3',
    assignmentNumber: '1.3.2',
    orderIndex: 7,
    title: 'Backstitch Mastery',
    description: 'Learn the strongest hand stitch for permanent seams and repairs.',
    instructions: `1. Practice the forward-back-forward motion
2. Maintain 1/8" stitch length
3. Create a 12" backstitch seam on two fabric pieces
4. Test seam strength by pulling
5. Compare to machine stitch strength`,
    objectives: [
      'Execute consistent backstitches',
      'Create strong, durable seams by hand',
      'Know when backstitch is appropriate',
    ],
    skills: ['Backstitch', 'Seam strength', 'Hand control'],
    expectedOutcome: 'Strong, even backstitch seam that can withstand stress.',
    passingCriteria: 'Seam withstands 10lb pull test without breaking',
    referencePhotos: ['/curriculum/stitches/backstitch.jpg', '/curriculum/stitches/backstitch-detail.jpg'],
    estimatedHours: 6,
    difficulty: 'beginner',
    category: 'stitching',
    subcategory: 'hand-basic',
  },
  {
    level: 1,
    moduleNumber: '1.3',
    assignmentNumber: '1.3.3',
    orderIndex: 8,
    title: 'Slip Stitch (Invisible Stitch)',
    description: 'Master the invisible stitch used for hems and lining attachment.',
    instructions: `1. Practice catching just a few threads from base fabric
2. Hide thread inside fold
3. Maintain even spacing (1/4" to 3/8")
4. Complete a 12" hem using slip stitch
5. Evaluate invisibility from right side`,
    objectives: [
      'Create virtually invisible stitches',
      'Understand fold and base fabric relationship',
      'Apply to hem finishing',
    ],
    skills: ['Slip stitch', 'Invisible finishing', 'Hem work'],
    expectedOutcome: 'Hem that shows no visible stitching from the right side.',
    passingCriteria: 'No stitches visible from right side at arm\'s length',
    referencePhotos: ['/curriculum/stitches/slip-stitch.jpg', '/curriculum/stitches/invisible-hem.jpg'],
    estimatedHours: 6,
    difficulty: 'beginner',
    category: 'stitching',
    subcategory: 'hand-basic',
  },
  {
    level: 1,
    moduleNumber: '1.3',
    assignmentNumber: '1.3.4',
    orderIndex: 9,
    title: 'Catch Stitch (Herringbone Stitch)',
    description: 'Learn the flexible stitch for hems that allows fabric movement.',
    instructions: `1. Work from left to right (right-handed)
2. Create X-pattern with alternating stitches
3. Keep stitches loose enough for flexibility
4. Practice on stretch fabric hem
5. Compare to slip stitch flexibility`,
    objectives: [
      'Execute proper catch stitch technique',
      'Understand when flexibility is needed',
      'Apply to stretch fabrics appropriately',
    ],
    skills: ['Catch stitch', 'Flexible hems', 'Stretch fabric handling'],
    expectedOutcome: 'Hem that allows natural fabric movement and stretch.',
    passingCriteria: 'Hem stretches with fabric without breaking stitches',
    referencePhotos: ['/curriculum/stitches/catch-stitch.jpg', '/curriculum/stitches/herringbone-stitch.jpg'],
    estimatedHours: 4,
    difficulty: 'beginner',
    category: 'stitching',
    subcategory: 'hand-basic',
  },
  {
    level: 1,
    moduleNumber: '1.3',
    assignmentNumber: '1.3.5',
    orderIndex: 10,
    title: 'Blanket Stitch & Buttonhole Stitch',
    description: 'Master decorative edge finishes and hand buttonhole foundation.',
    instructions: `1. Practice blanket stitch on raw edge
2. Keep loops even and consistent spacing
3. Learn buttonhole stitch variation (tighter)
4. Create decorative edge sample
5. Practice on curved edges`,
    objectives: [
      'Create consistent blanket stitch edges',
      'Understand buttonhole stitch variation',
      'Apply to decorative and functional uses',
    ],
    skills: ['Blanket stitch', 'Buttonhole stitch', 'Edge finishing'],
    expectedOutcome: 'Even, decorative edge finish and buttonhole stitch sample.',
    passingCriteria: 'Consistent loop height within 1mm tolerance',
    referencePhotos: ['/curriculum/stitches/blanket-stitch.jpg', '/curriculum/stitches/buttonhole-stitch.jpg'],
    estimatedHours: 6,
    difficulty: 'beginner',
    category: 'stitching',
    subcategory: 'hand-basic',
  },

  // Module 1.4: Basic Measurements
  {
    level: 1,
    moduleNumber: '1.4',
    assignmentNumber: '1.4.1',
    orderIndex: 11,
    title: 'Body Measurement Fundamentals',
    description: 'Learn to take accurate body measurements for garment construction.',
    instructions: `1. Study all measurement points on the body
2. Practice measuring technique on dress form
3. Take complete measurements of 3 different people
4. Document measurements in standard format
5. Compare measurements and note variations`,
    objectives: [
      'Take 20 standard body measurements accurately',
      'Understand measurement landmarks on the body',
      'Record measurements systematically',
    ],
    skills: ['Measuring', 'Body landmarks', 'Documentation'],
    expectedOutcome: 'Complete measurement cards for 3 individuals with all 20 measurements.',
    passingCriteria: 'Measurements within 1/4" of mentor verification',
    referencePhotos: ['/curriculum/measurement/chest-measure.jpg', '/curriculum/measurement/shoulder-measure.jpg', '/curriculum/measurement/sleeve-measure.jpg'],
    estimatedHours: 8,
    difficulty: 'beginner',
    category: 'measurement',
    subcategory: 'body',
  },
  {
    level: 1,
    moduleNumber: '1.4',
    assignmentNumber: '1.4.2',
    orderIndex: 12,
    title: 'Jacket Measurements',
    description: 'Master the specific measurements needed for jacket and coat construction.',
    instructions: `1. Learn jacket-specific measurement points
2. Understand ease allowances for jackets
3. Take complete jacket measurements from 2 individuals
4. Calculate ease additions
5. Document shoulder slope and posture notes`,
    objectives: [
      'Take all jacket-specific measurements',
      'Understand and calculate ease allowances',
      'Note posture and fitting considerations',
    ],
    skills: ['Jacket measuring', 'Ease calculation', 'Posture analysis'],
    expectedOutcome: 'Complete jacket measurement cards with ease calculations.',
    passingCriteria: 'Correct ease calculations and posture notes',
    referencePhotos: ['/curriculum/measurement/jacket-chest.jpg', '/curriculum/measurement/jacket-back.jpg'],
    estimatedHours: 6,
    difficulty: 'beginner',
    category: 'measurement',
    subcategory: 'jacket',
  },
  {
    level: 1,
    moduleNumber: '1.4',
    assignmentNumber: '1.4.3',
    orderIndex: 13,
    title: 'Trouser Measurements',
    description: 'Learn accurate measurements for trouser and pant construction.',
    instructions: `1. Study trouser measurement points
2. Understand rise measurements (front and back)
3. Take complete trouser measurements from 2 individuals
4. Calculate pleat and style allowances
5. Document leg shape preferences`,
    objectives: [
      'Take accurate inseam, outseam, and rise measurements',
      'Understand waist placement variations',
      'Calculate style-specific allowances',
    ],
    skills: ['Trouser measuring', 'Rise calculation', 'Fit preferences'],
    expectedOutcome: 'Complete trouser measurement cards with style notes.',
    passingCriteria: 'Rise measurements within 1/4" accuracy',
    referencePhotos: ['/curriculum/measurement/trouser-waist.jpg', '/curriculum/measurement/trouser-inseam.jpg'],
    estimatedHours: 4,
    difficulty: 'beginner',
    category: 'measurement',
    subcategory: 'trouser',
  },

  // Module 1.5: Pattern Basics
  {
    level: 1,
    moduleNumber: '1.5',
    assignmentNumber: '1.5.1',
    orderIndex: 14,
    title: 'Pattern Reading & Symbols',
    description: 'Learn to read and understand commercial pattern markings and symbols.',
    instructions: `1. Study standard pattern symbols
2. Identify grain lines, notches, darts, and seam allowances
3. Practice tracing a commercial pattern
4. Mark all symbols accurately on tracing
5. Cut out traced pattern pieces`,
    objectives: [
      'Identify all standard pattern markings',
      'Understand seam allowance conventions',
      'Accurately trace and cut patterns',
    ],
    skills: ['Pattern reading', 'Symbol recognition', 'Tracing'],
    expectedOutcome: 'Accurately traced pattern with all markings transferred.',
    passingCriteria: 'All symbols correctly identified and transferred',
    referencePhotos: ['/curriculum/pattern/pattern-symbols.jpg', '/curriculum/pattern/grain-marking.jpg'],
    estimatedHours: 6,
    difficulty: 'beginner',
    category: 'pattern',
    subcategory: 'reading',
  },
  {
    level: 1,
    moduleNumber: '1.5',
    assignmentNumber: '1.5.2',
    orderIndex: 15,
    title: 'Pattern Layout & Cutting',
    description: 'Master efficient pattern layout and accurate fabric cutting.',
    instructions: `1. Study layout guidelines for different fabric widths
2. Practice layout on 45" and 60" fabric
3. Consider grain line and pattern matching
4. Cut out a simple garment (pillowcase or tote)
5. Minimize fabric waste`,
    objectives: [
      'Layout patterns efficiently',
      'Maintain grain line accuracy',
      'Cut accurately following pattern edges',
    ],
    skills: ['Pattern layout', 'Cutting', 'Fabric efficiency'],
    expectedOutcome: 'Efficiently laid out and accurately cut pattern pieces.',
    passingCriteria: 'Grain lines within 1/8" of parallel, clean cuts',
    referencePhotos: ['/curriculum/pattern/fabric-layout.jpg', '/curriculum/pattern/cutting-technique.jpg'],
    estimatedHours: 6,
    difficulty: 'beginner',
    category: 'pattern',
    subcategory: 'cutting',
  },

  // Module 1.6: Level 1 Final Project
  {
    level: 1,
    moduleNumber: '1.6',
    assignmentNumber: '1.6.1',
    orderIndex: 16,
    title: 'FINAL PROJECT: Classic Dress Shirt',
    description: 'Construct a complete dress shirt demonstrating all Level 1 skills.',
    instructions: `1. Take client measurements
2. Select appropriate shirting fabric
3. Cut all pattern pieces with proper grain
4. Construct collar and collar band
5. Set sleeves with placket
6. Attach cuffs
7. Complete buttonhole and button placement
8. Press finished garment professionally`,
    objectives: [
      'Apply all Level 1 skills in one garment',
      'Construct a wearable dress shirt',
      'Demonstrate proper finishing techniques',
    ],
    skills: ['Complete garment construction', 'Collar setting', 'Sleeve setting', 'Button attachment'],
    expectedOutcome: 'A wearable, professionally finished dress shirt.',
    passingCriteria: 'Shirt passes quality inspection checklist with 85% score',
    referencePhotos: ['/curriculum/projects/dress-shirt-complete.jpg', '/curriculum/projects/shirt-collar.jpg', '/curriculum/projects/shirt-cuff.jpg'],
    estimatedHours: 40,
    difficulty: 'beginner',
    category: 'construction',
    subcategory: 'project',
  },

  // ============================================================================
  // LEVEL 2: INTERMEDIATE (Months 4-7)
  // ============================================================================

  // Module 2.1: Garment Parts - Collars
  {
    level: 2,
    moduleNumber: '2.1',
    assignmentNumber: '2.1.1',
    orderIndex: 17,
    title: 'Collar Types Study',
    description: 'Study and identify all major collar types used in tailoring.',
    instructions: `1. Study 10 collar types: Spread, Point, Button-down, Club, Tab, Mandarin, Wing, Notch Lapel, Peak Lapel, Shawl
2. Create sketches of each collar type
3. Document characteristics and appropriate uses
4. Identify collar types on 10 different garments
5. Note construction differences`,
    objectives: [
      'Identify all major collar types',
      'Understand style appropriateness',
      'Know construction variations',
    ],
    skills: ['Collar identification', 'Style knowledge', 'Design elements'],
    expectedOutcome: 'Illustrated collar reference guide with construction notes.',
    passingCriteria: 'Correctly identify 10 collar types in test',
    referencePhotos: ['/curriculum/collars/spread-collar.jpg', '/curriculum/collars/point-collar.jpg', '/curriculum/collars/notch-lapel.jpg', '/curriculum/collars/peak-lapel.jpg', '/curriculum/collars/shawl-collar.jpg'],
    estimatedHours: 6,
    difficulty: 'intermediate',
    category: 'garment-parts',
    subcategory: 'collars',
  },
  {
    level: 2,
    moduleNumber: '2.1',
    assignmentNumber: '2.1.2',
    orderIndex: 18,
    title: 'Shirt Collar Construction',
    description: 'Master the construction of professional shirt collars with band.',
    instructions: `1. Cut collar and collar band pieces
2. Apply interfacing to collar
3. Stitch collar points accurately
4. Turn and press collar
5. Attach collar to band
6. Set collar band to shirt neckline`,
    objectives: [
      'Construct clean, symmetrical collar points',
      'Properly interface collar',
      'Achieve smooth collar roll',
    ],
    skills: ['Collar construction', 'Interfacing', 'Point turning'],
    expectedOutcome: 'Three practice collars with professional finish.',
    passingCriteria: 'Collar points symmetrical within 1/8"',
    referencePhotos: ['/curriculum/collars/collar-construction.jpg', '/curriculum/collars/collar-interfacing.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'construction',
    subcategory: 'collars',
  },

  // Module 2.2: Garment Parts - Shoulders
  {
    level: 2,
    moduleNumber: '2.2',
    assignmentNumber: '2.2.1',
    orderIndex: 19,
    title: 'Shoulder Styles Study',
    description: 'Understand different shoulder constructions and their effects on silhouette.',
    instructions: `1. Study 7 shoulder types: Natural, Padded, Roped, Soft, Extended, Dropped, Pagoda
2. Examine actual garments with each shoulder type
3. Note padding and structure differences
4. Understand regional style preferences (British, Italian, American)
5. Document silhouette effects`,
    objectives: [
      'Identify shoulder construction types',
      'Understand structure vs. natural approaches',
      'Know regional style differences',
    ],
    skills: ['Shoulder identification', 'Style analysis', 'Regional knowledge'],
    expectedOutcome: 'Comparative analysis document with photos.',
    passingCriteria: 'Correctly explain 7 shoulder types',
    referencePhotos: ['/curriculum/shoulders/natural-shoulder.jpg', '/curriculum/shoulders/padded-shoulder.jpg', '/curriculum/shoulders/roped-shoulder.jpg'],
    estimatedHours: 6,
    difficulty: 'intermediate',
    category: 'garment-parts',
    subcategory: 'shoulders',
  },
  {
    level: 2,
    moduleNumber: '2.2',
    assignmentNumber: '2.2.2',
    orderIndex: 20,
    title: 'Shoulder Pad Application',
    description: 'Learn to select and apply shoulder pads for different garment styles.',
    instructions: `1. Study shoulder pad types (raglan, set-in, extended)
2. Learn pad placement techniques
3. Practice hand-sewing pads to muslin jackets
4. Adjust pad positioning for different body types
5. Create custom shoulder shape`,
    objectives: [
      'Select appropriate shoulder pads',
      'Position pads accurately',
      'Adjust for body variations',
    ],
    skills: ['Pad selection', 'Pad attachment', 'Shoulder shaping'],
    expectedOutcome: 'Properly padded shoulder samples for different styles.',
    passingCriteria: 'Pads positioned correctly and sewn securely',
    referencePhotos: ['/curriculum/shoulders/shoulder-pad-types.jpg', '/curriculum/shoulders/pad-placement.jpg'],
    estimatedHours: 8,
    difficulty: 'intermediate',
    category: 'construction',
    subcategory: 'shoulders',
  },

  // Module 2.3: Garment Parts - Sleeves
  {
    level: 2,
    moduleNumber: '2.3',
    assignmentNumber: '2.3.1',
    orderIndex: 21,
    title: 'Sleeve Types Study',
    description: 'Study all major sleeve types and their construction methods.',
    instructions: `1. Study 10 sleeve types: Set-in, Raglan, Kimono, Dolman, Bishop, Bell, Cap, Puff, Leg-of-mutton, Two-piece
2. Draw each sleeve type
3. Note ease requirements and movement characteristics
4. Identify sleeves on existing garments
5. Understand which sleeve suits which garment`,
    objectives: [
      'Identify all major sleeve types',
      'Understand ease and movement',
      'Know appropriate applications',
    ],
    skills: ['Sleeve identification', 'Ease understanding', 'Style matching'],
    expectedOutcome: 'Illustrated sleeve guide with construction notes.',
    passingCriteria: 'Correctly identify 10 sleeve types',
    referencePhotos: ['/curriculum/sleeves/set-in-sleeve.jpg', '/curriculum/sleeves/raglan-sleeve.jpg', '/curriculum/sleeves/two-piece-sleeve.jpg'],
    estimatedHours: 6,
    difficulty: 'intermediate',
    category: 'garment-parts',
    subcategory: 'sleeves',
  },
  {
    level: 2,
    moduleNumber: '2.3',
    assignmentNumber: '2.3.2',
    orderIndex: 22,
    title: 'Set-In Sleeve Construction',
    description: 'Master the fundamental technique of setting a sleeve into an armhole.',
    instructions: `1. Cut sleeve and bodice pieces
2. Sew sleeve seam
3. Ease stitch sleeve cap
4. Match notches and pin sleeve to armhole
5. Distribute ease evenly
6. Stitch, press, and finish`,
    objectives: [
      'Properly ease a sleeve cap',
      'Set sleeve without puckers',
      'Press sleeve head properly',
    ],
    skills: ['Sleeve easing', 'Sleeve setting', 'Armhole finishing'],
    expectedOutcome: 'Three practice sleeves set smoothly without puckers.',
    passingCriteria: 'No visible puckers, smooth sleeve cap',
    referencePhotos: ['/curriculum/sleeves/sleeve-easing.jpg', '/curriculum/sleeves/sleeve-setting.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'construction',
    subcategory: 'sleeves',
  },

  // Module 2.4: Garment Parts - Pockets
  {
    level: 2,
    moduleNumber: '2.4',
    assignmentNumber: '2.4.1',
    orderIndex: 23,
    title: 'Pocket Types Study',
    description: 'Study all major pocket types used in tailoring.',
    instructions: `1. Study 10 pocket types: Patch, Welt, Jetted, Flap, Slash, In-seam, Kangaroo, Ticket, Bellows, Western
2. Examine actual garments with each pocket type
3. Note formality levels (welt = formal, patch = casual)
4. Document construction complexity
5. Understand functional vs decorative use`,
    objectives: [
      'Identify all major pocket types',
      'Understand formality hierarchy',
      'Know construction requirements',
    ],
    skills: ['Pocket identification', 'Style appropriateness', 'Construction knowledge'],
    expectedOutcome: 'Pocket reference guide with samples.',
    passingCriteria: 'Correctly identify 10 pocket types',
    referencePhotos: ['/curriculum/pockets/patch-pocket.jpg', '/curriculum/pockets/welt-pocket.jpg', '/curriculum/pockets/jetted-pocket.jpg', '/curriculum/pockets/flap-pocket.jpg'],
    estimatedHours: 6,
    difficulty: 'intermediate',
    category: 'garment-parts',
    subcategory: 'pockets',
  },
  {
    level: 2,
    moduleNumber: '2.4',
    assignmentNumber: '2.4.2',
    orderIndex: 24,
    title: 'Patch Pocket Construction',
    description: 'Master the construction of professional patch pockets.',
    instructions: `1. Cut pocket pieces with proper seam allowance
2. Interface pocket if needed
3. Press and fold pocket edges
4. Miter corners cleanly
5. Attach pocket to garment with topstitching or invisible stitch
6. Create unlined and lined versions`,
    objectives: [
      'Construct clean, symmetrical patch pockets',
      'Miter corners properly',
      'Attach invisibly or with clean topstitching',
    ],
    skills: ['Pocket construction', 'Corner mitering', 'Pocket attachment'],
    expectedOutcome: 'Four patch pockets: unlined, lined, square corners, rounded corners.',
    passingCriteria: 'Corners clean, pockets symmetrical',
    referencePhotos: ['/curriculum/pockets/patch-pocket-construction.jpg', '/curriculum/pockets/mitered-corner.jpg'],
    estimatedHours: 8,
    difficulty: 'intermediate',
    category: 'construction',
    subcategory: 'pockets',
  },
  {
    level: 2,
    moduleNumber: '2.4',
    assignmentNumber: '2.4.3',
    orderIndex: 25,
    title: 'Welt Pocket Construction',
    description: 'Learn to construct the classic single and double welt pocket.',
    instructions: `1. Mark pocket placement precisely
2. Cut and prepare welt strips
3. Stitch welts to pocket opening
4. Cut opening accurately between stitching
5. Turn and press welts
6. Attach pocket bag
7. Create both single and double welt versions`,
    objectives: [
      'Mark and cut pocket openings accurately',
      'Create even, symmetrical welts',
      'Attach pocket bags correctly',
    ],
    skills: ['Welt construction', 'Precision marking', 'Pocket bag attachment'],
    expectedOutcome: 'Two single welt and two double welt pocket samples.',
    passingCriteria: 'Welts even, corners sharp, no fabric showing at ends',
    referencePhotos: ['/curriculum/pockets/welt-pocket-steps.jpg', '/curriculum/pockets/double-welt.jpg'],
    estimatedHours: 16,
    difficulty: 'intermediate',
    category: 'construction',
    subcategory: 'pockets',
  },

  // Module 2.5: Machine Stitching
  {
    level: 2,
    moduleNumber: '2.5',
    assignmentNumber: '2.5.1',
    orderIndex: 26,
    title: 'Machine Setup & Maintenance',
    description: 'Learn proper industrial sewing machine setup and maintenance.',
    instructions: `1. Study machine parts and their functions
2. Learn proper threading (upper and bobbin)
3. Practice tension adjustment for different fabrics
4. Learn to change needles and select correct size
5. Perform basic maintenance (oiling, cleaning)`,
    objectives: [
      'Thread machine correctly',
      'Adjust tension for different fabrics',
      'Maintain machine properly',
    ],
    skills: ['Machine operation', 'Tension adjustment', 'Maintenance'],
    expectedOutcome: 'Properly threaded, tensioned machine with clean stitches on multiple fabrics.',
    passingCriteria: 'Correct tension on 5 different fabric weights',
    referencePhotos: ['/curriculum/machine/machine-threading.jpg', '/curriculum/machine/tension-adjustment.jpg'],
    estimatedHours: 6,
    difficulty: 'intermediate',
    category: 'stitching',
    subcategory: 'machine',
  },
  {
    level: 2,
    moduleNumber: '2.5',
    assignmentNumber: '2.5.2',
    orderIndex: 27,
    title: 'Straight Seam Mastery',
    description: 'Master straight seams with various seam allowances and finishes.',
    instructions: `1. Practice 1/4", 3/8", 1/2", 5/8" seam allowances
2. Sew seams on lightweight, medium, and heavy fabrics
3. Learn to pivot at corners
4. Practice backstitching at seam ends
5. Press seams open and to one side`,
    objectives: [
      'Sew accurate seam allowances',
      'Handle different fabric weights',
      'Finish seams professionally',
    ],
    skills: ['Straight seaming', 'Seam allowance accuracy', 'Seam finishing'],
    expectedOutcome: 'Sample board with seams at all allowances on various fabrics.',
    passingCriteria: 'Seam allowances within 1/16" of marked line',
    referencePhotos: ['/curriculum/machine/straight-seam.jpg', '/curriculum/machine/seam-finishes.jpg'],
    estimatedHours: 8,
    difficulty: 'intermediate',
    category: 'stitching',
    subcategory: 'machine',
  },

  // Module 2.6: Professional Pressing
  {
    level: 2,
    moduleNumber: '2.6',
    assignmentNumber: '2.6.1',
    orderIndex: 28,
    title: 'Pressing Fundamentals',
    description: 'Master the art of professional pressing - the key to quality tailoring.',
    instructions: `1. Learn iron temperature settings for different fabrics
2. Practice using press cloth
3. Master press vs iron technique
4. Use tailor\'s ham for curved surfaces
5. Use sleeve board for sleeves
6. Practice seam pressing (open and to side)`,
    objectives: [
      'Select correct temperature for each fabric',
      'Understand press vs iron difference',
      'Use all pressing equipment correctly',
    ],
    skills: ['Pressing technique', 'Temperature control', 'Equipment use'],
    expectedOutcome: 'Demonstration of proper pressing on various fabrics.',
    passingCriteria: 'No shine, scorch marks, or distortion',
    referencePhotos: ['/curriculum/pressing/press-vs-iron.jpg', '/curriculum/pressing/tailors-ham-use.jpg'],
    estimatedHours: 6,
    difficulty: 'intermediate',
    category: 'finishing',
    subcategory: 'pressing',
  },

  // Module 2.7: Trouser Construction
  {
    level: 2,
    moduleNumber: '2.7',
    assignmentNumber: '2.7.1',
    orderIndex: 29,
    title: 'Basic Trouser Construction',
    description: 'Construct a complete pair of trousers from start to finish.',
    instructions: `1. Take trouser measurements
2. Cut front, back, waistband, and pocket pieces
3. Construct front pockets (slant or on-seam)
4. Sew inseam and outseam
5. Construct fly front with zipper
6. Attach waistband
7. Hem to proper length
8. Press crease and finish`,
    objectives: [
      'Construct complete trousers',
      'Install fly front correctly',
      'Attach waistband professionally',
    ],
    skills: ['Trouser construction', 'Fly installation', 'Waistband attachment'],
    expectedOutcome: 'Wearable pair of trousers with proper fit.',
    passingCriteria: 'Trousers fit correctly with professional finish',
    referencePhotos: ['/curriculum/trousers/trouser-front.jpg', '/curriculum/trousers/fly-construction.jpg', '/curriculum/trousers/waistband.jpg'],
    estimatedHours: 24,
    difficulty: 'intermediate',
    category: 'construction',
    subcategory: 'trousers',
  },

  // Module 2.8: Level 2 Final Project
  {
    level: 2,
    moduleNumber: '2.8',
    assignmentNumber: '2.8.1',
    orderIndex: 30,
    title: 'FINAL PROJECT: Unlined Sport Coat',
    description: 'Construct an unlined sport coat demonstrating all Level 2 skills.',
    instructions: `1. Take complete jacket measurements
2. Select appropriate sport coat fabric
3. Cut all pieces with pattern matching consideration
4. Construct front with welt pocket
5. Set shoulders with minimal padding
6. Set sleeves with proper ease
7. Construct and attach collar
8. Finish interior seams cleanly
9. Press finished garment`,
    objectives: [
      'Construct complete unlined jacket',
      'Apply all Level 2 techniques',
      'Achieve professional finish without lining',
    ],
    skills: ['Jacket construction', 'Interior finishing', 'Professional pressing'],
    expectedOutcome: 'Wearable, professionally finished unlined sport coat.',
    passingCriteria: 'Jacket passes quality inspection with 85% score',
    referencePhotos: ['/curriculum/projects/sport-coat-complete.jpg', '/curriculum/projects/unlined-interior.jpg'],
    estimatedHours: 60,
    difficulty: 'intermediate',
    category: 'construction',
    subcategory: 'project',
  },

  // ============================================================================
  // LEVEL 3: ADVANCED (Months 8-12)
  // ============================================================================

  // Module 3.1: Canvas Construction
  {
    level: 3,
    moduleNumber: '3.1',
    assignmentNumber: '3.1.1',
    orderIndex: 31,
    title: 'Canvas and Interfacing Study',
    description: 'Study the materials and purposes of canvas and interfacing in structured garments.',
    instructions: `1. Study different canvas types (hair canvas, hymo, French canvas)
2. Understand fusible vs sewn-in interfacing
3. Learn which areas require structure
4. Examine actual garments with different canvas types
5. Compare fused, half-canvas, and full-canvas construction`,
    objectives: [
      'Identify canvas types by touch',
      'Understand when each is appropriate',
      'Know construction method differences',
    ],
    skills: ['Canvas knowledge', 'Structure understanding', 'Construction methods'],
    expectedOutcome: 'Canvas sample book with documentation.',
    passingCriteria: 'Correctly identify 5 canvas types',
    referencePhotos: ['/curriculum/canvas/hair-canvas.jpg', '/curriculum/canvas/canvas-layers.jpg'],
    estimatedHours: 6,
    difficulty: 'advanced',
    category: 'construction',
    subcategory: 'canvas',
  },
  {
    level: 3,
    moduleNumber: '3.1',
    assignmentNumber: '3.1.2',
    orderIndex: 32,
    title: 'Pad Stitching',
    description: 'Master the fundamental hand stitch for building canvas structure.',
    instructions: `1. Learn the pad stitch technique
2. Practice on muslin with canvas
3. Build lapel roll with pad stitching
4. Create chest piece shape
5. Understand stitch direction and tension`,
    objectives: [
      'Execute consistent pad stitches',
      'Build proper lapel roll',
      'Shape canvas to body contour',
    ],
    skills: ['Pad stitching', 'Lapel shaping', 'Canvas work'],
    expectedOutcome: 'Pad-stitched lapel sample with proper roll.',
    passingCriteria: 'Lapel has natural roll and shape',
    referencePhotos: ['/curriculum/canvas/pad-stitching.jpg', '/curriculum/canvas/lapel-roll.jpg'],
    estimatedHours: 16,
    difficulty: 'advanced',
    category: 'stitching',
    subcategory: 'hand-advanced',
  },
  {
    level: 3,
    moduleNumber: '3.1',
    assignmentNumber: '3.1.3',
    orderIndex: 33,
    title: 'Half-Canvas Front Construction',
    description: 'Construct a jacket front with half-canvas structure.',
    instructions: `1. Cut canvas pieces for chest and lapel
2. Shape canvas with pad stitching
3. Attach canvas to jacket front
4. Apply lapel tape
5. Set facing over canvas
6. Press and check roll`,
    objectives: [
      'Build proper half-canvas structure',
      'Achieve correct lapel roll',
      'Create smooth chest drape',
    ],
    skills: ['Half-canvas construction', 'Tape application', 'Structure building'],
    expectedOutcome: 'Half-canvas jacket front with professional structure.',
    passingCriteria: 'Lapel rolls correctly, chest drapes smoothly',
    referencePhotos: ['/curriculum/canvas/half-canvas-construction.jpg'],
    estimatedHours: 24,
    difficulty: 'advanced',
    category: 'construction',
    subcategory: 'canvas',
  },

  // Module 3.2: Advanced Collar Construction
  {
    level: 3,
    moduleNumber: '3.2',
    assignmentNumber: '3.2.1',
    orderIndex: 34,
    title: 'Notch Lapel Collar Construction',
    description: 'Master the construction of the classic notch lapel collar.',
    instructions: `1. Cut collar, under collar, and melton
2. Pad stitch under collar
3. Shape collar roll
4. Construct gorge line
5. Create clean notch
6. Attach collar to jacket body`,
    objectives: [
      'Construct professional notch lapel',
      'Create clean, sharp notch',
      'Achieve proper collar roll',
    ],
    skills: ['Notch lapel construction', 'Gorge line finishing', 'Collar attachment'],
    expectedOutcome: 'Two notch lapel collar samples.',
    passingCriteria: 'Notch is clean, collar rolls correctly',
    referencePhotos: ['/curriculum/collars/notch-lapel-construction.jpg', '/curriculum/collars/gorge-line.jpg'],
    estimatedHours: 16,
    difficulty: 'advanced',
    category: 'construction',
    subcategory: 'collars',
  },
  {
    level: 3,
    moduleNumber: '3.2',
    assignmentNumber: '3.2.2',
    orderIndex: 35,
    title: 'Peak Lapel Collar Construction',
    description: 'Construct the formal peak lapel collar.',
    instructions: `1. Cut collar, under collar with peak extensions
2. Pad stitch under collar
3. Create peak points
4. Construct continuous collar/lapel line
5. Turn and press peaks
6. Attach to jacket body`,
    objectives: [
      'Construct symmetrical peak lapels',
      'Create sharp peak points',
      'Achieve correct collar line',
    ],
    skills: ['Peak lapel construction', 'Point turning', 'Collar shaping'],
    expectedOutcome: 'Two peak lapel collar samples.',
    passingCriteria: 'Peaks symmetrical, points sharp',
    referencePhotos: ['/curriculum/collars/peak-lapel-construction.jpg', '/curriculum/collars/peak-point.jpg'],
    estimatedHours: 20,
    difficulty: 'advanced',
    category: 'construction',
    subcategory: 'collars',
  },

  // Module 3.3: Advanced Sleeve Work
  {
    level: 3,
    moduleNumber: '3.3',
    assignmentNumber: '3.3.1',
    orderIndex: 36,
    title: 'Two-Piece Sleeve Construction',
    description: 'Master the tailored two-piece sleeve with proper shaping.',
    instructions: `1. Cut upper and under sleeve pieces
2. Sew front and back seams
3. Press seams open
4. Create proper elbow shaping
5. Construct functional button cuff
6. Set sleeve with proper pitch`,
    objectives: [
      'Construct smooth two-piece sleeve',
      'Achieve proper elbow shaping',
      'Set sleeve with correct pitch',
    ],
    skills: ['Two-piece sleeve', 'Elbow shaping', 'Sleeve pitch'],
    expectedOutcome: 'Two two-piece sleeves set in practice jacket.',
    passingCriteria: 'Sleeves hang correctly, no pulling',
    referencePhotos: ['/curriculum/sleeves/two-piece-sleeve-pattern.jpg', '/curriculum/sleeves/sleeve-pitch.jpg'],
    estimatedHours: 16,
    difficulty: 'advanced',
    category: 'construction',
    subcategory: 'sleeves',
  },
  {
    level: 3,
    moduleNumber: '3.3',
    assignmentNumber: '3.3.2',
    orderIndex: 37,
    title: 'Functional Sleeve Buttons',
    description: 'Construct working sleeve buttonholes (surgeon\'s cuffs).',
    instructions: `1. Mark buttonhole placement
2. Create hand or machine buttonholes
3. Overlap placement with buttons on top
4. Ensure buttons actually function
5. Finish interior cleanly`,
    objectives: [
      'Create functional sleeve buttonholes',
      'Place buttons for actual use',
      'Finish professionally',
    ],
    skills: ['Working buttonholes', 'Button placement', 'Cuff finishing'],
    expectedOutcome: 'Two sleeves with working buttons.',
    passingCriteria: 'Buttons actually function, clean finish',
    referencePhotos: ['/curriculum/sleeves/working-buttons.jpg', '/curriculum/sleeves/surgeons-cuff.jpg'],
    estimatedHours: 12,
    difficulty: 'advanced',
    category: 'construction',
    subcategory: 'sleeves',
  },

  // Module 3.4: Advanced Pocket Work
  {
    level: 3,
    moduleNumber: '3.4',
    assignmentNumber: '3.4.1',
    orderIndex: 38,
    title: 'Jetted Pocket with Flap',
    description: 'Construct the classic tailored pocket with welts and flap.',
    instructions: `1. Mark pocket placement
2. Construct pocket flap with proper interlining
3. Create double jetted opening
4. Insert flap into jetting
5. Attach pocket bag
6. Finish cleanly`,
    objectives: [
      'Construct symmetrical jets',
      'Create properly shaped flap',
      'Insert flap cleanly',
    ],
    skills: ['Jetted pocket', 'Flap construction', 'Pocket finishing'],
    expectedOutcome: 'Two jetted pockets with flaps.',
    passingCriteria: 'Jets even, flap fits perfectly',
    referencePhotos: ['/curriculum/pockets/jetted-with-flap.jpg', '/curriculum/pockets/flap-insertion.jpg'],
    estimatedHours: 16,
    difficulty: 'advanced',
    category: 'construction',
    subcategory: 'pockets',
  },
  {
    level: 3,
    moduleNumber: '3.4',
    assignmentNumber: '3.4.2',
    orderIndex: 39,
    title: 'Ticket Pocket & Breast Pocket',
    description: 'Construct specialty pockets: ticket pocket and welted breast pocket.',
    instructions: `1. Construct angled ticket pocket above main pocket
2. Create single-welt breast pocket
3. Match any fabric patterns at pocket
4. Ensure pockets are functional
5. Finish all edges`,
    objectives: [
      'Construct ticket pocket at correct angle',
      'Create clean breast pocket welt',
      'Pattern match where needed',
    ],
    skills: ['Specialty pockets', 'Angled construction', 'Pattern matching'],
    expectedOutcome: 'Practice piece with ticket and breast pockets.',
    passingCriteria: 'Angle correct, welts clean',
    referencePhotos: ['/curriculum/pockets/ticket-pocket.jpg', '/curriculum/pockets/breast-pocket.jpg'],
    estimatedHours: 12,
    difficulty: 'advanced',
    category: 'construction',
    subcategory: 'pockets',
  },

  // Module 3.5: Fitting Adjustments
  {
    level: 3,
    moduleNumber: '3.5',
    assignmentNumber: '3.5.1',
    orderIndex: 40,
    title: 'Common Fitting Issues',
    description: 'Learn to identify and correct common fitting problems.',
    instructions: `1. Study 10 common fitting issues
2. Practice identifying issues on fitting models
3. Document cause and solution for each
4. Practice making adjustments
5. Create reference guide`,
    objectives: [
      'Identify fitting problems by sight',
      'Understand cause of each issue',
      'Know correction methods',
    ],
    skills: ['Fitting analysis', 'Problem diagnosis', 'Correction techniques'],
    expectedOutcome: 'Fitting issues reference guide with before/after photos.',
    passingCriteria: 'Correctly diagnose 10 fitting issues',
    referencePhotos: ['/curriculum/fitting/collar-gap.jpg', '/curriculum/fitting/pulling-wrinkles.jpg'],
    estimatedHours: 12,
    difficulty: 'advanced',
    category: 'fitting',
    subcategory: 'diagnosis',
  },

  // Module 3.6: Hand Finishing Techniques
  {
    level: 3,
    moduleNumber: '3.6',
    assignmentNumber: '3.6.1',
    orderIndex: 41,
    title: 'Pick Stitching (AMF Stitch)',
    description: 'Master the decorative hand stitch for lapel edges.',
    instructions: `1. Learn proper pick stitch technique
2. Practice on scrap lapel
3. Maintain even stitch spacing (1/8")
4. Keep stitches same size
5. Complete full lapel edge`,
    objectives: [
      'Execute consistent pick stitches',
      'Maintain even spacing',
      'Create professional finish',
    ],
    skills: ['Pick stitching', 'Decorative finishing', 'Hand control'],
    expectedOutcome: 'Lapel with professional pick stitching.',
    passingCriteria: 'Stitches even, spacing consistent within 1/32"',
    referencePhotos: ['/curriculum/finishing/pick-stitching.jpg', '/curriculum/finishing/amf-stitch.jpg'],
    estimatedHours: 12,
    difficulty: 'advanced',
    category: 'finishing',
    subcategory: 'hand-finishing',
  },
  {
    level: 3,
    moduleNumber: '3.6',
    assignmentNumber: '3.6.2',
    orderIndex: 42,
    title: 'Hand Buttonholes',
    description: 'Master traditional hand-worked buttonholes.',
    instructions: `1. Mark buttonhole placement and length
2. Cut buttonhole opening
3. Work buttonhole stitch around opening
4. Create keyhole at one end (for suit)
5. Bar tack at other end
6. Create gimp cord insert for structure`,
    objectives: [
      'Create professional hand buttonholes',
      'Construct proper keyhole',
      'Achieve consistent tension',
    ],
    skills: ['Hand buttonholes', 'Keyhole formation', 'Buttonhole stitch'],
    expectedOutcome: 'Six hand-worked buttonholes including keyhole style.',
    passingCriteria: 'Buttonholes even, keyholes centered',
    referencePhotos: ['/curriculum/finishing/hand-buttonhole.jpg', '/curriculum/finishing/keyhole-buttonhole.jpg'],
    estimatedHours: 16,
    difficulty: 'advanced',
    category: 'finishing',
    subcategory: 'hand-finishing',
  },

  // Module 3.7: Lining
  {
    level: 3,
    moduleNumber: '3.7',
    assignmentNumber: '3.7.1',
    orderIndex: 43,
    title: 'Full Lining Construction',
    description: 'Master the construction and insertion of a full jacket lining.',
    instructions: `1. Cut lining with proper ease
2. Construct lining body
3. Attach lining to facing
4. Set lining sleeves
5. Hand-finish lining edges
6. Create proper pleat at center back`,
    objectives: [
      'Cut lining with appropriate ease',
      'Attach lining cleanly to facing',
      'Finish all edges invisibly',
    ],
    skills: ['Lining construction', 'Ease allowance', 'Hand finishing'],
    expectedOutcome: 'Fully lined practice jacket.',
    passingCriteria: 'Lining smooth, no pulling, proper ease',
    referencePhotos: ['/curriculum/lining/lining-insertion.jpg', '/curriculum/lining/center-back-pleat.jpg'],
    estimatedHours: 16,
    difficulty: 'advanced',
    category: 'construction',
    subcategory: 'lining',
  },

  // Module 3.8: Level 3 Final Project
  {
    level: 3,
    moduleNumber: '3.8',
    assignmentNumber: '3.8.1',
    orderIndex: 44,
    title: 'FINAL PROJECT: Two-Piece Suit',
    description: 'Construct a complete two-piece suit demonstrating all Level 3 skills.',
    instructions: `1. Take complete measurements
2. Construct half-canvas jacket with notch lapel
3. Set two-piece sleeves with functional buttons
4. Construct jetted pockets
5. Full lining with proper ease
6. Matching trousers with all details
7. Pattern match if using patterned fabric
8. Complete pick stitching on lapels`,
    objectives: [
      'Construct complete matching suit',
      'Apply all Level 3 techniques',
      'Achieve professional finish throughout',
    ],
    skills: ['Complete suit construction', 'Canvas work', 'Advanced finishing'],
    expectedOutcome: 'Wearable, professionally finished two-piece suit.',
    passingCriteria: 'Suit passes quality inspection with 90% score',
    referencePhotos: ['/curriculum/projects/two-piece-suit.jpg', '/curriculum/projects/suit-details.jpg'],
    estimatedHours: 100,
    difficulty: 'advanced',
    category: 'construction',
    subcategory: 'project',
  },

  // ============================================================================
  // LEVEL 4: MASTER CRAFTSMAN (Months 13-18)
  // ============================================================================

  // Module 4.1: Full Canvas Construction
  {
    level: 4,
    moduleNumber: '4.1',
    assignmentNumber: '4.1.1',
    orderIndex: 45,
    title: 'Full Canvas Jacket Construction',
    description: 'Master complete full-canvas bespoke jacket construction.',
    instructions: `1. Cut full canvas including side body
2. Shape canvas with extensive pad stitching
3. Build chest structure completely by hand
4. Float canvas (unattached to shell)
5. Create natural drape and shape
6. Complete full jacket with this method`,
    objectives: [
      'Construct floating full canvas',
      'Build complete chest structure',
      'Achieve superior drape and shape',
    ],
    skills: ['Full canvas construction', 'Advanced pad stitching', 'Structure building'],
    expectedOutcome: 'Full canvas jacket front with floating canvas.',
    passingCriteria: 'Canvas floats properly, drape is superior',
    referencePhotos: ['/curriculum/canvas/full-canvas-construction.jpg', '/curriculum/canvas/floating-canvas.jpg'],
    estimatedHours: 40,
    difficulty: 'expert',
    category: 'construction',
    subcategory: 'canvas',
  },

  // Module 4.2: Double-Breasted Construction
  {
    level: 4,
    moduleNumber: '4.2',
    assignmentNumber: '4.2.1',
    orderIndex: 46,
    title: 'Double-Breasted Jacket',
    description: 'Construct a classic 6x2 double-breasted jacket.',
    instructions: `1. Draft or adjust pattern for double-breast
2. Plan button stance and overlap
3. Construct with peak lapels
4. Set buttons symmetrically
5. Create hidden button stay
6. Ensure proper closure and drape`,
    objectives: [
      'Construct proper double-breast overlap',
      'Position buttons correctly',
      'Achieve clean closure',
    ],
    skills: ['Double-breasted construction', 'Button placement', 'Overlap construction'],
    expectedOutcome: 'Complete double-breasted jacket.',
    passingCriteria: 'Jacket closes correctly, buttons aligned',
    referencePhotos: ['/curriculum/double-breasted/db-jacket.jpg', '/curriculum/double-breasted/button-stance.jpg'],
    estimatedHours: 80,
    difficulty: 'expert',
    category: 'construction',
    subcategory: 'jacket',
  },

  // Module 4.3: Overcoat Construction
  {
    level: 4,
    moduleNumber: '4.3',
    assignmentNumber: '4.3.1',
    orderIndex: 47,
    title: 'Overcoat/Topcoat Construction',
    description: 'Construct a heavyweight overcoat with proper structure.',
    instructions: `1. Select appropriate heavy fabric
2. Adjust patterns for outerwear ease
3. Construct with heavier canvas
4. Set raglan or set-in sleeves
5. Create proper vent structure
6. Line with appropriate weight lining`,
    objectives: [
      'Work with heavy materials',
      'Adjust for outerwear proportions',
      'Create proper weather protection',
    ],
    skills: ['Heavyweight construction', 'Outerwear techniques', 'Vent construction'],
    expectedOutcome: 'Wearable, professional overcoat.',
    passingCriteria: 'Coat fits over suit jacket, professional finish',
    referencePhotos: ['/curriculum/overcoat/overcoat-complete.jpg', '/curriculum/overcoat/overcoat-details.jpg'],
    estimatedHours: 80,
    difficulty: 'expert',
    category: 'construction',
    subcategory: 'outerwear',
  },

  // Module 4.4: Waistcoat/Vest
  {
    level: 4,
    moduleNumber: '4.4',
    assignmentNumber: '4.4.1',
    orderIndex: 48,
    title: 'Waistcoat Construction',
    description: 'Construct a traditional single-breasted waistcoat.',
    instructions: `1. Cut front, back, and lining
2. Construct welt pockets
3. Apply proper interlining
4. Set buttons correctly
5. Construct back with adjuster
6. Line and finish`,
    objectives: [
      'Construct properly fitted waistcoat',
      'Create working back adjuster',
      'Finish all edges cleanly',
    ],
    skills: ['Waistcoat construction', 'Adjuster mechanisms', 'Vest finishing'],
    expectedOutcome: 'Matching waistcoat for three-piece suit.',
    passingCriteria: 'Waistcoat fits properly, adjuster works',
    referencePhotos: ['/curriculum/waistcoat/waistcoat-front.jpg', '/curriculum/waistcoat/waistcoat-back.jpg'],
    estimatedHours: 40,
    difficulty: 'expert',
    category: 'construction',
    subcategory: 'waistcoat',
  },

  // Module 4.5: Pattern Drafting
  {
    level: 4,
    moduleNumber: '4.5',
    assignmentNumber: '4.5.1',
    orderIndex: 49,
    title: 'Jacket Pattern Drafting',
    description: 'Learn to draft jacket patterns from measurements.',
    instructions: `1. Study drafting systems (British, Italian)
2. Learn to draft basic jacket block
3. Add style elements
4. Create patterns for different body types
5. Make toile and adjust
6. Create personal block collection`,
    objectives: [
      'Draft basic jacket pattern from measurements',
      'Adjust for different bodies',
      'Create reusable pattern blocks',
    ],
    skills: ['Pattern drafting', 'Block creation', 'Adjustment techniques'],
    expectedOutcome: 'Drafted jacket pattern that fits test model.',
    passingCriteria: 'Toile fits within acceptable tolerances',
    referencePhotos: ['/curriculum/drafting/jacket-draft.jpg', '/curriculum/drafting/pattern-adjustment.jpg'],
    estimatedHours: 40,
    difficulty: 'expert',
    category: 'pattern',
    subcategory: 'drafting',
  },

  // Module 4.6: Bespoke Fitting Process
  {
    level: 4,
    moduleNumber: '4.6',
    assignmentNumber: '4.6.1',
    orderIndex: 50,
    title: 'Three-Fitting Bespoke Process',
    description: 'Master the traditional bespoke fitting sequence.',
    instructions: `1. Conduct initial measurement session
2. Create and fit basted toile (1st fitting)
3. Adjust and refit with forward construction (2nd fitting)
4. Final fitting with nearly complete garment (3rd fitting)
5. Complete garment and final handover
6. Document entire process`,
    objectives: [
      'Conduct professional fitting sessions',
      'Make appropriate adjustments between fittings',
      'Communicate effectively with client',
    ],
    skills: ['Bespoke fitting', 'Client communication', 'Adjustment techniques'],
    expectedOutcome: 'Complete documentation of three-fitting process.',
    passingCriteria: 'Client approves final garment',
    referencePhotos: ['/curriculum/fitting/first-fitting.jpg', '/curriculum/fitting/bespoke-process.jpg'],
    estimatedHours: 24,
    difficulty: 'expert',
    category: 'fitting',
    subcategory: 'bespoke',
  },

  // Module 4.7: Level 4 Final Project
  {
    level: 4,
    moduleNumber: '4.7',
    assignmentNumber: '4.7.1',
    orderIndex: 51,
    title: 'FINAL PROJECT: Three-Piece Bespoke Suit',
    description: 'Create a complete bespoke three-piece suit from measurement to delivery.',
    instructions: `1. Take comprehensive measurements
2. Draft personal pattern
3. Conduct three-fitting process
4. Construct full-canvas jacket
5. Construct matching trousers
6. Construct matching waistcoat
7. Complete all hand finishing
8. Final press and presentation`,
    objectives: [
      'Complete entire bespoke process',
      'Produce suit to bespoke standards',
      'Demonstrate all Level 4 skills',
    ],
    skills: ['Complete bespoke construction', 'Pattern drafting', 'Three-fitting process'],
    expectedOutcome: 'Bespoke three-piece suit meeting professional standards.',
    passingCriteria: 'Suit passes master tailor evaluation',
    referencePhotos: ['/curriculum/projects/three-piece-bespoke.jpg'],
    estimatedHours: 200,
    difficulty: 'expert',
    category: 'construction',
    subcategory: 'project',
  },

  // ============================================================================
  // LEVEL 5: ARTISAN SPECIALIZATION (Months 19-24)
  // ============================================================================

  // Module 5.1: Specialty Formal Wear
  {
    level: 5,
    moduleNumber: '5.1',
    assignmentNumber: '5.1.1',
    orderIndex: 52,
    title: 'Dinner Jacket (Tuxedo)',
    description: 'Construct a formal dinner jacket with satin-faced lapels.',
    instructions: `1. Select appropriate fabric (black barathea or midnight blue)
2. Cut satin for lapel facing
3. Construct shawl or peak lapel with satin
4. Use covered buttons
5. Create satin side stripe for trousers
6. Complete all formal details`,
    objectives: [
      'Construct formal satin-faced lapels',
      'Apply formal wear conventions',
      'Achieve appropriate formal finish',
    ],
    skills: ['Formal wear construction', 'Satin work', 'Formal details'],
    expectedOutcome: 'Complete dinner jacket and trousers.',
    passingCriteria: 'Meets formal wear standards',
    referencePhotos: ['/curriculum/formal/dinner-jacket.jpg', '/curriculum/formal/satin-lapel.jpg'],
    estimatedHours: 80,
    difficulty: 'expert',
    category: 'construction',
    subcategory: 'formal',
  },
  {
    level: 5,
    moduleNumber: '5.1',
    assignmentNumber: '5.1.2',
    orderIndex: 53,
    title: 'Morning Dress',
    description: 'Construct traditional morning dress for formal day occasions.',
    instructions: `1. Construct morning coat with tails
2. Create waistcoat in appropriate style
3. Construct striped trousers
4. Apply all traditional details
5. Complete set for formal day wear`,
    objectives: [
      'Construct formal morning coat',
      'Create proper tails construction',
      'Apply traditional details',
    ],
    skills: ['Morning dress construction', 'Tails', 'Traditional formal'],
    expectedOutcome: 'Complete morning dress ensemble.',
    passingCriteria: 'Meets traditional standards',
    referencePhotos: ['/curriculum/formal/morning-coat.jpg', '/curriculum/formal/morning-dress-complete.jpg'],
    estimatedHours: 120,
    difficulty: 'expert',
    category: 'construction',
    subcategory: 'formal',
  },

  // Module 5.2: Regional Styles
  {
    level: 5,
    moduleNumber: '5.2',
    assignmentNumber: '5.2.1',
    orderIndex: 54,
    title: 'British Style Study',
    description: 'Study and construct garments in traditional British style.',
    instructions: `1. Study Savile Row traditions
2. Learn structured shoulder construction
3. Create British proportions (longer jacket, higher gorge)
4. Construct sample in British style
5. Document distinctive elements`,
    objectives: [
      'Understand British tailoring traditions',
      'Construct British-style garments',
      'Apply correct proportions',
    ],
    skills: ['British style', 'Structured construction', 'Traditional tailoring'],
    expectedOutcome: 'Sport coat in British style.',
    passingCriteria: 'Demonstrates British characteristics',
    referencePhotos: ['/curriculum/styles/british-jacket.jpg', '/curriculum/styles/savile-row.jpg'],
    estimatedHours: 60,
    difficulty: 'expert',
    category: 'construction',
    subcategory: 'styles',
  },
  {
    level: 5,
    moduleNumber: '5.2',
    assignmentNumber: '5.2.2',
    orderIndex: 55,
    title: 'Italian Style Study',
    description: 'Study and construct garments in Neapolitan Italian style.',
    instructions: `1. Study Neapolitan traditions
2. Learn soft shoulder (spalla camicia)
3. Create Italian proportions (shorter, lighter)
4. Construct sample in Italian style
5. Practice hand-finished details`,
    objectives: [
      'Understand Italian tailoring traditions',
      'Construct soft shoulder technique',
      'Apply correct proportions',
    ],
    skills: ['Italian style', 'Soft shoulder', 'Light construction'],
    expectedOutcome: 'Sport coat in Italian style.',
    passingCriteria: 'Demonstrates Italian characteristics',
    referencePhotos: ['/curriculum/styles/italian-jacket.jpg', '/curriculum/styles/spalla-camicia.jpg'],
    estimatedHours: 60,
    difficulty: 'expert',
    category: 'construction',
    subcategory: 'styles',
  },

  // Module 5.3: Business Operations
  {
    level: 5,
    moduleNumber: '5.3',
    assignmentNumber: '5.3.1',
    orderIndex: 56,
    title: 'Pricing & Client Management',
    description: 'Learn to price work and manage client relationships.',
    instructions: `1. Study pricing methods (hourly, per garment)
2. Calculate true costs (materials, labor, overhead)
3. Develop pricing structure
4. Learn client consultation techniques
5. Practice difficult client scenarios`,
    objectives: [
      'Price work profitably',
      'Manage client expectations',
      'Build lasting relationships',
    ],
    skills: ['Pricing', 'Client relations', 'Business management'],
    expectedOutcome: 'Personal pricing guide and consultation script.',
    passingCriteria: 'Pricing covers costs with profit margin',
    referencePhotos: [],
    estimatedHours: 16,
    difficulty: 'expert',
    category: 'business',
    subcategory: 'operations',
  },

  // Module 5.4: Teaching & Mentorship
  {
    level: 5,
    moduleNumber: '5.4',
    assignmentNumber: '5.4.1',
    orderIndex: 57,
    title: 'Teaching Fundamentals',
    description: 'Learn to teach and mentor apprentice tailors.',
    instructions: `1. Study teaching methodology
2. Create lesson plans for Level 1 assignments
3. Practice demonstrations
4. Conduct supervised teaching session
5. Learn to give constructive feedback`,
    objectives: [
      'Communicate techniques clearly',
      'Break down complex skills',
      'Give effective feedback',
    ],
    skills: ['Teaching', 'Demonstration', 'Feedback'],
    expectedOutcome: 'Lesson plan portfolio and teaching demonstration.',
    passingCriteria: 'Student shows improvement after teaching',
    referencePhotos: [],
    estimatedHours: 24,
    difficulty: 'expert',
    category: 'teaching',
    subcategory: 'mentorship',
  },

  // Module 5.5: Level 5 Final Project
  {
    level: 5,
    moduleNumber: '5.5',
    assignmentNumber: '5.5.1',
    orderIndex: 58,
    title: 'MASTER PORTFOLIO PROJECT',
    description: 'Create a master portfolio demonstrating all acquired skills.',
    instructions: `1. Select three pieces showcasing your best work:
   - One formal piece (tuxedo or morning dress)
   - One business piece in British or Italian style
   - One creative/innovative design
2. Document construction process with photos
3. Include measurements, patterns, fabric choices
4. Write technical notes for each piece
5. Present portfolio for evaluation`,
    objectives: [
      'Demonstrate mastery of all techniques',
      'Show personal style development',
      'Document at professional level',
    ],
    skills: ['Complete mastery', 'Documentation', 'Professional presentation'],
    expectedOutcome: 'Professional portfolio with three masterwork pieces.',
    passingCriteria: 'Portfolio approved by master tailor panel',
    referencePhotos: [],
    estimatedHours: 300,
    difficulty: 'expert',
    category: 'construction',
    subcategory: 'project',
  },

  // ============================================================================
  // LEVEL 6: DIGITAL TAILORING TECHNOLOGY (Months 25-30)
  // ============================================================================

  // Module 6.1: Digital Pattern Making Fundamentals
  {
    level: 6,
    moduleNumber: '6.1',
    assignmentNumber: '6.1.1',
    orderIndex: 59,
    title: 'Introduction to CAD Pattern Software',
    description: 'Learn the fundamentals of computer-aided design (CAD) software for pattern making. Understand digital pattern creation, editing, and management.',
    instructions: `1. Install and set up pattern design software (Optitex, Gerber, or Lectra)
2. Learn the interface navigation and tool palettes
3. Understand digital measurement input
4. Create basic pattern shapes using CAD tools
5. Practice saving, organizing, and exporting patterns
6. Compare digital vs traditional pattern creation`,
    objectives: [
      'Navigate CAD pattern software confidently',
      'Create basic geometric pattern pieces',
      'Understand file formats and export options',
      'Set up proper measurement systems',
    ],
    skills: ['CAD software basics', 'Digital navigation', 'File management'],
    expectedOutcome: 'Create a basic bodice block using CAD software.',
    passingCriteria: 'Pattern is accurate to measurements within 2mm',
    referencePhotos: ['/curriculum/digital/cad-interface.jpg', '/curriculum/digital/digital-pattern.jpg'],
    estimatedHours: 16,
    difficulty: 'intermediate',
    category: 'digital',
    subcategory: 'cad-basics',
  },
  {
    level: 6,
    moduleNumber: '6.1',
    assignmentNumber: '6.1.2',
    orderIndex: 60,
    title: 'Pattern Digitization with Adobe Illustrator',
    description: 'Master pattern digitization using Adobe Illustrator - converting physical patterns to digital format and creating patterns from scratch.',
    instructions: `1. Scan or photograph existing patterns at correct scale
2. Import into Adobe Illustrator and set up artboard
3. Use pen tool to trace pattern pieces accurately
4. Add seam allowances, notches, and grain lines
5. Create proper layering system for pattern organization
6. Export patterns in industry-standard formats (DXF, PDF)`,
    objectives: [
      'Digitize physical patterns accurately',
      'Use Illustrator tools for pattern creation',
      'Apply proper technical markings digitally',
      'Export in multiple formats',
    ],
    skills: ['Adobe Illustrator', 'Pattern digitization', 'Vector graphics'],
    expectedOutcome: 'Digitized shirt pattern with all markings.',
    passingCriteria: 'Digital pattern matches physical within 1mm tolerance',
    referencePhotos: ['/curriculum/digital/illustrator-pattern.jpg', '/curriculum/digital/digitization-process.jpg'],
    estimatedHours: 20,
    difficulty: 'intermediate',
    category: 'digital',
    subcategory: 'digitization',
  },
  {
    level: 6,
    moduleNumber: '6.1',
    assignmentNumber: '6.1.3',
    orderIndex: 61,
    title: 'Advanced CAD Pattern Manipulation',
    description: 'Learn advanced pattern manipulation techniques: grading, scaling, style modifications, and pattern nesting for production.',
    instructions: `1. Master pattern grading for size ranges (XS-XXL)
2. Create grade rules based on body measurements
3. Practice dart manipulation digitally
4. Learn pattern nesting for fabric efficiency
5. Calculate fabric requirements automatically
6. Generate production-ready cut markers`,
    objectives: [
      'Grade patterns across size ranges',
      'Manipulate darts and style lines digitally',
      'Create efficient marker layouts',
      'Calculate material requirements',
    ],
    skills: ['Pattern grading', 'Marker making', 'Production planning'],
    expectedOutcome: 'Complete graded pattern set with nested markers.',
    passingCriteria: 'Grades maintain proper proportions, markers achieve 80%+ efficiency',
    referencePhotos: ['/curriculum/digital/pattern-grading.jpg', '/curriculum/digital/marker-nesting.jpg'],
    estimatedHours: 24,
    difficulty: 'advanced',
    category: 'digital',
    subcategory: 'cad-advanced',
  },

  // Module 6.2: 3D Garment Design Introduction
  {
    level: 6,
    moduleNumber: '6.2',
    assignmentNumber: '6.2.1',
    orderIndex: 62,
    title: 'Introduction to CLO3D / Marvelous Designer',
    description: 'Begin learning industry-standard 3D garment design software used by major fashion houses worldwide.',
    instructions: `1. Install and configure CLO3D or Marvelous Designer
2. Learn avatar creation and customization
3. Understand 3D workspace navigation (rotate, pan, zoom)
4. Import 2D patterns into 3D environment
5. Learn arrangement points and sewing tool
6. Practice basic draping and simulation`,
    objectives: [
      'Navigate 3D garment software confidently',
      'Create and customize digital avatars',
      'Import and arrange pattern pieces',
      'Execute basic garment simulation',
    ],
    skills: ['3D software navigation', 'Digital avatar creation', '3D pattern arrangement'],
    expectedOutcome: 'Simple 3D t-shirt created from 2D patterns.',
    passingCriteria: 'Garment simulates correctly on avatar without errors',
    referencePhotos: ['/curriculum/digital/clo3d-interface.jpg', '/curriculum/digital/3d-tshirt.jpg'],
    estimatedHours: 20,
    difficulty: 'intermediate',
    category: 'digital',
    subcategory: '3d-basics',
  },
  {
    level: 6,
    moduleNumber: '6.2',
    assignmentNumber: '6.2.2',
    orderIndex: 63,
    title: 'Fabric Simulation and Material Properties',
    description: 'Master digital fabric simulation - understanding how to replicate real fabric behavior in 3D software.',
    instructions: `1. Study fabric property parameters (bend, stretch, weight)
2. Create fabric presets for common materials (wool, cotton, silk, linen)
3. Adjust physical properties to match real fabric behavior
4. Apply textures and patterns to 3D fabrics
5. Test simulation accuracy against physical samples
6. Build personal fabric library`,
    objectives: [
      'Understand fabric physics parameters',
      'Create accurate fabric simulations',
      'Apply realistic textures and patterns',
      'Build reusable fabric library',
    ],
    skills: ['Fabric simulation', 'Material properties', 'Texture mapping'],
    expectedOutcome: 'Digital fabric library with 10 accurately simulated materials.',
    passingCriteria: 'Simulated fabrics match physical drape behavior',
    referencePhotos: ['/curriculum/digital/fabric-physics.jpg', '/curriculum/digital/texture-mapping.jpg'],
    estimatedHours: 16,
    difficulty: 'intermediate',
    category: 'digital',
    subcategory: 'fabric-simulation',
  },
  {
    level: 6,
    moduleNumber: '6.2',
    assignmentNumber: '6.2.3',
    orderIndex: 64,
    title: '3D Jacket Prototype',
    description: 'Create a complete 3D jacket prototype including canvas structure, lining, and construction details.',
    instructions: `1. Import jacket pattern pieces to 3D software
2. Set up proper layering (shell, canvas, lining)
3. Apply appropriate fabrics to each layer
4. Add construction details (buttons, pockets, topstitching)
5. Simulate and adjust fit on avatar
6. Create turntable renders and tech pack views`,
    objectives: [
      'Build complex multi-layer garments in 3D',
      'Add realistic construction details',
      'Adjust fit virtually before cutting fabric',
      'Generate presentation-ready renders',
    ],
    skills: ['Complex 3D garment construction', 'Multi-layer assembly', '3D rendering'],
    expectedOutcome: '3D jacket with accurate simulation and renders.',
    passingCriteria: 'Jacket shows correct drape and construction details',
    referencePhotos: ['/curriculum/digital/3d-jacket.jpg', '/curriculum/digital/jacket-layers.jpg'],
    estimatedHours: 30,
    difficulty: 'advanced',
    category: 'digital',
    subcategory: '3d-construction',
  },

  // Module 6.3: Blender for Garment Visualization
  {
    level: 6,
    moduleNumber: '6.3',
    assignmentNumber: '6.3.1',
    orderIndex: 65,
    title: 'Blender Fundamentals for Fashion',
    description: 'Learn Blender 3D software for creating stunning garment visualizations, animations, and marketing materials.',
    instructions: `1. Install Blender and configure workspace for fashion work
2. Learn basic navigation and object manipulation
3. Understand mesh modeling basics
4. Import garments from CLO3D/Marvelous Designer
5. Set up basic lighting and camera
6. Practice simple render output`,
    objectives: [
      'Navigate Blender 3D environment',
      'Import and manipulate 3D garments',
      'Set up basic scene lighting',
      'Create simple renders',
    ],
    skills: ['Blender navigation', '3D import/export', 'Basic rendering'],
    expectedOutcome: 'Rendered 3D garment image from imported CLO3D file.',
    passingCriteria: 'Clean render with proper lighting and composition',
    referencePhotos: ['/curriculum/digital/blender-interface.jpg', '/curriculum/digital/blender-garment.jpg'],
    estimatedHours: 20,
    difficulty: 'intermediate',
    category: 'digital',
    subcategory: 'blender-basics',
  },
  {
    level: 6,
    moduleNumber: '6.3',
    assignmentNumber: '6.3.2',
    orderIndex: 66,
    title: 'Advanced Blender: Materials and Texturing',
    description: 'Master realistic material creation in Blender using shader nodes for photorealistic fabric rendering.',
    instructions: `1. Study PBR (Physically Based Rendering) concepts
2. Create fabric shaders using node editor
3. Add realistic fabric textures (weave, grain)
4. Create subsurface scattering for light fabrics
5. Build shader library for different materials
6. Practice with wool, silk, leather, and cotton`,
    objectives: [
      'Create photorealistic fabric materials',
      'Use node-based shader creation',
      'Apply proper texture mapping',
      'Build reusable material library',
    ],
    skills: ['PBR materials', 'Shader node editing', 'Texture creation'],
    expectedOutcome: 'Material library with 8 photorealistic fabric shaders.',
    passingCriteria: 'Materials are photorealistic and physically accurate',
    referencePhotos: ['/curriculum/digital/shader-nodes.jpg', '/curriculum/digital/fabric-materials.jpg'],
    estimatedHours: 24,
    difficulty: 'advanced',
    category: 'digital',
    subcategory: 'blender-materials',
  },
  {
    level: 6,
    moduleNumber: '6.3',
    assignmentNumber: '6.3.3',
    orderIndex: 67,
    title: 'Blender Animation: Virtual Fashion Show',
    description: 'Create animated garment presentations including turntable views, fabric motion, and virtual runway walks.',
    instructions: `1. Set up animated turntable for garment display
2. Create walking cycle for virtual model
3. Animate fabric simulation for movement
4. Design multi-camera sequence
5. Add music and timing
6. Render complete fashion presentation video`,
    objectives: [
      'Create animated garment presentations',
      'Simulate fabric in motion',
      'Produce professional video output',
      'Compose multi-shot sequences',
    ],
    skills: ['Animation', 'Video production', 'Fabric motion simulation'],
    expectedOutcome: '30-second virtual fashion presentation video.',
    passingCriteria: 'Smooth animation, realistic fabric motion, professional quality',
    referencePhotos: ['/curriculum/digital/animation-timeline.jpg', '/curriculum/digital/virtual-runway.jpg'],
    estimatedHours: 30,
    difficulty: 'advanced',
    category: 'digital',
    subcategory: 'animation',
  },

  // Module 6.4: Digital Measurement & Body Scanning
  {
    level: 6,
    moduleNumber: '6.4',
    assignmentNumber: '6.4.1',
    orderIndex: 68,
    title: '3D Body Scanning Technology',
    description: 'Learn to use 3D body scanning technology for accurate digital measurements and custom avatar creation.',
    instructions: `1. Study 3D body scanning technologies (smartphone apps, booth scanners)
2. Practice scanning with smartphone apps (3D Scanner App, Measure)
3. Understand scanning best practices (lighting, posture, clothing)
4. Process scan data for measurement extraction
5. Create custom avatars from scan data
6. Compare scan accuracy to manual measurements`,
    objectives: [
      'Operate 3D body scanning equipment/apps',
      'Extract accurate measurements from scans',
      'Create custom fit avatars',
      'Validate scan accuracy',
    ],
    skills: ['3D scanning', 'Data processing', 'Digital measurement'],
    expectedOutcome: 'Custom avatar created from 3D body scan with extracted measurements.',
    passingCriteria: 'Measurements within 1cm of manual verification',
    referencePhotos: ['/curriculum/digital/body-scanning.jpg', '/curriculum/digital/scan-measurements.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'digital',
    subcategory: 'body-scanning',
  },
  {
    level: 6,
    moduleNumber: '6.4',
    assignmentNumber: '6.4.2',
    orderIndex: 69,
    title: 'Virtual Fitting Technology',
    description: 'Master virtual fitting techniques - using digital tools to predict fit before cutting fabric.',
    instructions: `1. Import custom avatar into CLO3D
2. Fit 3D garment to custom avatar
3. Analyze fit using strain map and fit analysis tools
4. Identify problem areas virtually
5. Make pattern adjustments based on virtual fitting
6. Document virtual fitting workflow for client presentations`,
    objectives: [
      'Conduct virtual fittings on custom avatars',
      'Use fit analysis tools effectively',
      'Predict fit problems before production',
      'Communicate fit issues visually',
    ],
    skills: ['Virtual fitting', 'Fit analysis', 'Predictive adjustment'],
    expectedOutcome: 'Virtual fitting report with recommended adjustments.',
    passingCriteria: 'Virtual predictions match actual fitting results',
    referencePhotos: ['/curriculum/digital/virtual-fitting.jpg', '/curriculum/digital/strain-map.jpg'],
    estimatedHours: 16,
    difficulty: 'advanced',
    category: 'digital',
    subcategory: 'virtual-fitting',
  },

  // Module 6.5: Production Technology
  {
    level: 6,
    moduleNumber: '6.5',
    assignmentNumber: '6.5.1',
    orderIndex: 70,
    title: 'CNC and Laser Cutting Systems',
    description: 'Learn computer-controlled cutting technology used in modern production environments.',
    instructions: `1. Study CNC cutting machine operation
2. Understand file formats for automated cutting (PLT, DXF)
3. Prepare markers for automated cutting
4. Learn laser cutting for precision work
5. Practice cutting simple patterns on CNC/laser
6. Compare automated vs manual cutting efficiency`,
    objectives: [
      'Prepare files for automated cutting',
      'Operate basic CNC/laser cutting equipment',
      'Understand production efficiency gains',
      'Troubleshoot common cutting issues',
    ],
    skills: ['CNC operation', 'Laser cutting', 'Digital production'],
    expectedOutcome: 'Complete garment cut using automated cutting system.',
    passingCriteria: 'Cuts are accurate with clean edges, minimal waste',
    referencePhotos: ['/curriculum/digital/cnc-cutter.jpg', '/curriculum/digital/laser-cutting.jpg'],
    estimatedHours: 16,
    difficulty: 'advanced',
    category: 'digital',
    subcategory: 'production-tech',
  },
  {
    level: 6,
    moduleNumber: '6.5',
    assignmentNumber: '6.5.2',
    orderIndex: 71,
    title: 'Digital Print Integration',
    description: 'Learn to work with digital fabric printing - from design to printed fabric for garment construction.',
    instructions: `1. Study digital fabric printing technologies (sublimation, DTG, reactive)
2. Create print-ready files with proper color management
3. Design custom print for garment (engineered print)
4. Position prints to align with pattern pieces
5. Send files for digital printing
6. Construct garment with custom printed fabric`,
    objectives: [
      'Prepare files for digital fabric printing',
      'Understand color management for textile',
      'Create engineered prints matching patterns',
      'Work with digitally printed fabrics',
    ],
    skills: ['Digital printing', 'Color management', 'Engineered prints'],
    expectedOutcome: 'Garment constructed from custom digitally printed fabric.',
    passingCriteria: 'Print aligns correctly, colors match design intent',
    referencePhotos: ['/curriculum/digital/digital-printing.jpg', '/curriculum/digital/engineered-print.jpg'],
    estimatedHours: 20,
    difficulty: 'advanced',
    category: 'digital',
    subcategory: 'digital-printing',
  },

  // Module 6.6: Business Technology
  {
    level: 6,
    moduleNumber: '6.6',
    assignmentNumber: '6.6.1',
    orderIndex: 72,
    title: 'Tailoring Business Software Systems',
    description: 'Master essential business software for running a modern tailoring business.',
    instructions: `1. Set up inventory management system for fabrics and supplies
2. Learn CRM (Customer Relationship Management) basics
3. Configure appointment scheduling software
4. Set up order tracking and production pipeline
5. Integrate measurement database with orders
6. Practice generating reports and analytics`,
    objectives: [
      'Manage inventory digitally',
      'Track customer information and history',
      'Schedule and manage appointments',
      'Monitor production workflow',
    ],
    skills: ['Business software', 'CRM', 'Inventory management'],
    expectedOutcome: 'Functional business system setup with sample data.',
    passingCriteria: 'System handles complete order lifecycle',
    referencePhotos: ['/curriculum/digital/business-software.jpg', '/curriculum/digital/crm-dashboard.jpg'],
    estimatedHours: 16,
    difficulty: 'intermediate',
    category: 'digital',
    subcategory: 'business-software',
  },
  {
    level: 6,
    moduleNumber: '6.6',
    assignmentNumber: '6.6.2',
    orderIndex: 73,
    title: 'E-Commerce and Digital Presence',
    description: 'Build digital presence for tailoring business including website, social media, and online ordering.',
    instructions: `1. Study successful tailoring business websites
2. Create professional portfolio website
3. Set up online measurement submission system
4. Configure e-commerce for fabric samples or gift cards
5. Develop social media content strategy
6. Practice creating visual content for marketing`,
    objectives: [
      'Build professional online presence',
      'Enable online client interaction',
      'Create marketing content',
      'Understand digital marketing basics',
    ],
    skills: ['Web presence', 'Social media', 'Digital marketing'],
    expectedOutcome: 'Live portfolio website with online inquiry system.',
    passingCriteria: 'Website is professional and functional',
    referencePhotos: ['/curriculum/digital/tailor-website.jpg', '/curriculum/digital/social-media.jpg'],
    estimatedHours: 20,
    difficulty: 'intermediate',
    category: 'digital',
    subcategory: 'e-commerce',
  },

  // Module 6.7: Digital Technology Final Project
  {
    level: 6,
    moduleNumber: '6.7',
    assignmentNumber: '6.7.1',
    orderIndex: 74,
    title: 'FINAL PROJECT: Complete Digital Workflow',
    description: 'Execute a complete garment from concept to completion using fully digital workflow.',
    instructions: `1. Take client measurements using 3D body scanning
2. Create custom avatar from scan data
3. Design garment in 3D software (CLO3D/Blender)
4. Create patterns digitally with proper grading
5. Conduct virtual fitting and adjustments
6. Generate automated cutting files
7. Produce marketing renders and animation
8. Construct physical garment
9. Compare virtual to actual fit
10. Document complete digital workflow`,
    objectives: [
      'Execute complete digital production workflow',
      'Integrate all digital tools learned',
      'Compare digital predictions to reality',
      'Demonstrate modern tailoring technology mastery',
    ],
    skills: ['Complete digital workflow', 'Technology integration', 'Modern production'],
    expectedOutcome: 'Finished garment with complete digital documentation.',
    passingCriteria: 'Virtual and physical garments match within acceptable tolerance',
    referencePhotos: ['/curriculum/digital/digital-workflow.jpg', '/curriculum/digital/final-comparison.jpg'],
    estimatedHours: 60,
    difficulty: 'expert',
    category: 'digital',
    subcategory: 'project',
  },
]

export async function seedTailoringCurriculum() {
  console.log('Seeding tailoring curriculum...')

  for (const assignment of tailoringCurriculum) {
    await prisma.assignmentTemplate.upsert({
      where: { assignmentNumber: assignment.assignmentNumber },
      update: {
        ...assignment,
        isActive: true,
      },
      create: {
        ...assignment,
        isActive: true,
      },
    })
    console.log(`  Created/Updated: ${assignment.assignmentNumber} - ${assignment.title}`)
  }

  console.log(`\nSeeded ${tailoringCurriculum.length} assignment templates`)
}

// Run if called directly
if (require.main === module) {
  seedTailoringCurriculum()
    .then(() => prisma.$disconnect())
    .catch((e) => {
      console.error(e)
      prisma.$disconnect()
      process.exit(1)
    })
}

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

const beadworkCurriculum: AssignmentTemplateData[] = [
  // ============================================================================
  // LEVEL 1: FOUNDATION (Months 1-3)
  // ============================================================================

  // Module 1.1: Introduction to Beadwork
  {
    level: 1,
    moduleNumber: '1.1',
    assignmentNumber: 'BW-1.1.1',
    orderIndex: 1,
    title: 'Beadwork Tool Identification & Setup',
    description: 'Learn to identify and properly use all essential beadwork tools. This foundational assignment ensures you understand the purpose, handling, and care of every tool in a beadworker\'s kit.',
    instructions: `1. Study each of the essential beadwork tools: beading needles (sizes 10, 12, 13, 15), beading thread (Nymo, FireLine, KO, C-Lon), bead mats, bead boards, scissors, thread conditioner, and storage containers
2. Practice threading beading needles of different sizes
3. Learn the difference between flexible and rigid needles
4. Set up a proper beading workstation with good lighting and ergonomic posture
5. Organize beads by type, size, and color in appropriate storage
6. Demonstrate proper use of each tool to your mentor`,
    objectives: [
      'Identify all essential beadwork tools by name and purpose',
      'Understand needle sizes and when to use each',
      'Know the properties of different beading threads',
      'Set up an organized, ergonomic beading workspace',
    ],
    skills: ['Tool identification', 'Workspace organization', 'Thread selection'],
    expectedOutcome: 'Correctly identify and demonstrate use of: beading needles (4 sizes), 4 thread types, bead mat, bead board, thread conditioner, beeswax, scissors, pliers (round-nose, flat-nose, chain-nose), crimping tool, and storage system.',
    passingCriteria: 'Score 90% or higher on tool identification test and demonstrate proper workspace setup',
    referencePhotos: ['/curriculum/beadwork/tools-overview.jpg', '/curriculum/beadwork/needle-sizes.jpg', '/curriculum/beadwork/thread-types.jpg'],
    estimatedHours: 6,
    difficulty: 'beginner',
    category: 'tools',
    subcategory: 'identification',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 1,
    moduleNumber: '1.1',
    assignmentNumber: 'BW-1.1.2',
    orderIndex: 2,
    title: 'Bead Types & Materials Knowledge',
    description: 'Build comprehensive knowledge of bead types, materials, sizes, and finishes used in professional beadwork.',
    instructions: `1. Study seed beads: Miyuki Delica, Toho, Czech Preciosa — understand size numbering (15/0, 11/0, 8/0, 6/0)
2. Learn about specialty beads: bugle beads, drop beads, magatama, crystal bicones, fire-polished, pearls, and gemstone beads
3. Understand bead finishes: opaque, transparent, matte, metallic, AB (Aurora Borealis), luster, Ceylon, galvanized
4. Create a reference bead sample card with at least 30 different beads mounted and labeled
5. Learn about bead quality — identifying irregularities and sorting techniques
6. Study which beads are best for specific techniques (loomwork, off-loom, embroidery)`,
    objectives: [
      'Identify bead types by size, shape, and material',
      'Understand bead finish terminology and appearance',
      'Know which beads suit which techniques',
      'Assess bead quality and consistency',
    ],
    skills: ['Bead identification', 'Material knowledge', 'Quality assessment'],
    expectedOutcome: 'A professional bead reference card with 30+ labeled samples organized by type, size, and finish.',
    passingCriteria: 'Reference card contains minimum 30 samples with complete documentation and passes mentor review',
    referencePhotos: ['/curriculum/beadwork/seed-bead-sizes.jpg', '/curriculum/beadwork/bead-finishes.jpg', '/curriculum/beadwork/specialty-beads.jpg'],
    estimatedHours: 10,
    difficulty: 'beginner',
    category: 'materials',
    subcategory: 'bead-types',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 1,
    moduleNumber: '1.1',
    assignmentNumber: 'BW-1.1.3',
    orderIndex: 3,
    title: 'Thread & Stringing Materials Mastery',
    description: 'Master the selection and handling of all thread and stringing materials used in beadwork, from flexible beading thread to wire and cord.',
    instructions: `1. Practice working with Nymo thread: conditioning, threading, tension control
2. Learn FireLine braided thread: cutting techniques, knotting properties
3. Study KO and C-Lon thread for micro-macramé and bead crochet
4. Practice with beading wire (Soft Flex, Beadalon) and crimping
5. Learn elastic cord stringing for stretch bracelets
6. Create a thread sample board comparing properties of each material`,
    objectives: [
      'Select the right thread for each beading technique',
      'Properly condition and handle each thread type',
      'Master crimping techniques for beading wire',
      'Understand thread tension and its effect on beadwork',
    ],
    skills: ['Thread selection', 'Crimping', 'Tension control', 'Material handling'],
    expectedOutcome: 'Thread sample board with 8 materials tested, plus demonstration of proper crimping and knotting.',
    passingCriteria: 'Demonstrate proper handling of all thread types and achieve clean crimps on beading wire',
    referencePhotos: ['/curriculum/beadwork/thread-types-board.jpg', '/curriculum/beadwork/crimping-technique.jpg'],
    estimatedHours: 8,
    difficulty: 'beginner',
    category: 'materials',
    subcategory: 'threads',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // Module 1.2: Basic Stringing & Knotting
  {
    level: 1,
    moduleNumber: '1.2',
    assignmentNumber: 'BW-1.2.1',
    orderIndex: 4,
    title: 'Simple Bead Stringing — First Necklace',
    description: 'Learn fundamental bead stringing to create your first complete beaded necklace using beading wire and crimps.',
    instructions: `1. Select beads for a simple pattern design (alternating colors or graduated sizes)
2. Measure and cut appropriate length of beading wire
3. Attach one half of clasp using crimp beads and crimp covers
4. String beads following your planned pattern
5. Attach the other half of clasp, ensuring proper length
6. Trim excess wire and inspect all connections for security`,
    objectives: [
      'Plan a bead stringing pattern with color harmony',
      'Execute clean crimp connections at both ends',
      'Achieve proper necklace length and drape',
      'Install a lobster claw or toggle clasp correctly',
    ],
    skills: ['Bead stringing', 'Crimping', 'Clasp attachment', 'Pattern planning'],
    expectedOutcome: 'A completed 18-inch beaded necklace with secure crimped connections and professional clasp attachment.',
    passingCriteria: 'Necklace hangs evenly, crimps are secure and covered, clasp functions properly',
    referencePhotos: ['/curriculum/beadwork/strung-necklace.jpg', '/curriculum/beadwork/crimp-closeup.jpg'],
    estimatedHours: 6,
    difficulty: 'beginner',
    category: 'stringing',
    subcategory: 'basic-necklace',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 1,
    moduleNumber: '1.2',
    assignmentNumber: 'BW-1.2.2',
    orderIndex: 5,
    title: 'Pearl Knotting Technique',
    description: 'Master the traditional pearl knotting technique used to separate and protect beads on silk thread.',
    instructions: `1. Study why knotting is used (protection, drape, security)
2. Practice tying overhand knots using a knotting tool or awl
3. Learn to knot between beads consistently — knots must sit tight against each bead
4. Create a knotted pearl bracelet using glass pearls on silk cord
5. Attach a clasp using French wire (gimp) for a professional finish
6. Compare your knot consistency and tightness against reference samples`,
    objectives: [
      'Execute consistent, tight knots between each bead',
      'Use a knotting tool or awl for precision placement',
      'Attach clasps using French wire/gimp',
      'Understand when knotting is appropriate vs other methods',
    ],
    skills: ['Pearl knotting', 'Silk thread handling', 'French wire technique'],
    expectedOutcome: 'A knotted pearl bracelet with even, tight knots and professional clasp attachment using French wire.',
    passingCriteria: 'All knots sit flush against beads with no gaps, French wire is neat',
    referencePhotos: ['/curriculum/beadwork/pearl-knotting.jpg', '/curriculum/beadwork/french-wire.jpg'],
    estimatedHours: 8,
    difficulty: 'beginner',
    category: 'stringing',
    subcategory: 'knotting',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 1,
    moduleNumber: '1.2',
    assignmentNumber: 'BW-1.2.3',
    orderIndex: 6,
    title: 'Multi-Strand Design & Spacing',
    description: 'Learn to create multi-strand necklaces and bracelets using spacer bars, cones, and multi-strand clasps.',
    instructions: `1. Design a 3-strand bracelet with complementary bead patterns
2. Learn to use spacer bars to keep strands aligned
3. Practice attaching multiple strands to a multi-strand clasp
4. Use cone findings to gather multiple strands neatly
5. Ensure all strands have proper tension — not too tight, not too loose
6. Create a finished 3-strand bracelet with professional findings`,
    objectives: [
      'Design cohesive multi-strand patterns',
      'Use spacer bars and cones correctly',
      'Attach multiple strands to clasps securely',
      'Maintain even tension across all strands',
    ],
    skills: ['Multi-strand design', 'Spacer bar use', 'Cone finishing', 'Tension management'],
    expectedOutcome: 'A completed 3-strand bracelet with even tension, spacer bars, and multi-strand clasp.',
    passingCriteria: 'Strands hang evenly, spacers are aligned, clasp functions smoothly',
    referencePhotos: ['/curriculum/beadwork/multi-strand.jpg', '/curriculum/beadwork/cone-finish.jpg'],
    estimatedHours: 8,
    difficulty: 'beginner',
    category: 'stringing',
    subcategory: 'multi-strand',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // Module 1.3: Color Theory & Pattern Basics
  {
    level: 1,
    moduleNumber: '1.3',
    assignmentNumber: 'BW-1.3.1',
    orderIndex: 7,
    title: 'Color Theory for Beadwork',
    description: 'Study color theory principles as they apply to bead selection and pattern design.',
    instructions: `1. Study the color wheel: primary, secondary, and tertiary colors
2. Learn color harmonies: complementary, analogous, triadic, split-complementary
3. Understand warm vs cool colors and their visual effects
4. Study how bead finishes affect color perception (matte dulls, metallic intensifies)
5. Create 6 small bead swatches demonstrating different color harmonies
6. Document which color combinations work best for different product types`,
    objectives: [
      'Apply color wheel theory to bead selection',
      'Create harmonious color palettes for beadwork projects',
      'Understand how bead finishes alter color appearance',
      'Select appropriate palettes for different aesthetics (elegant, vibrant, earthy)',
    ],
    skills: ['Color theory', 'Palette creation', 'Visual design', 'Bead selection'],
    expectedOutcome: 'Six bead color swatches demonstrating complementary, analogous, triadic, monochromatic, split-complementary, and earth-tone palettes.',
    passingCriteria: 'Each swatch correctly demonstrates its color harmony and is visually appealing',
    referencePhotos: ['/curriculum/beadwork/color-wheel-beads.jpg', '/curriculum/beadwork/color-swatches.jpg'],
    estimatedHours: 6,
    difficulty: 'beginner',
    category: 'design',
    subcategory: 'color-theory',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 1,
    moduleNumber: '1.3',
    assignmentNumber: 'BW-1.3.2',
    orderIndex: 8,
    title: 'Reading & Creating Bead Patterns',
    description: 'Learn to read beading pattern charts and create your own simple patterns on graph paper and digitally.',
    instructions: `1. Study how bead pattern charts work (word charts vs graph charts)
2. Learn the difference between peyote charts, loom charts, and brick stitch charts
3. Practice reading 3 existing patterns and identifying stitch type, bead count, and color changes
4. Create a simple geometric pattern on beading graph paper (minimum 20 rows)
5. Transfer your pattern to a digital tool (BeadTool, Inkscape, or Excel)
6. Color-code your pattern with bead color references`,
    objectives: [
      'Read and interpret standard bead pattern charts',
      'Distinguish between chart types for different stitches',
      'Create original patterns on graph paper',
      'Use digital tools for pattern design',
    ],
    skills: ['Pattern reading', 'Pattern creation', 'Digital design', 'Chart interpretation'],
    expectedOutcome: 'Three completed pattern interpretations plus one original digital pattern ready for beading.',
    passingCriteria: 'Patterns are accurately read, original pattern is clear and executable',
    referencePhotos: ['/curriculum/beadwork/pattern-chart.jpg', '/curriculum/beadwork/graph-paper-pattern.jpg'],
    estimatedHours: 8,
    difficulty: 'beginner',
    category: 'design',
    subcategory: 'patterns',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // ============================================================================
  // LEVEL 2: CORE STITCHING TECHNIQUES (Months 4-6)
  // ============================================================================

  // Module 2.1: Flat Peyote Stitch
  {
    level: 2,
    moduleNumber: '2.1',
    assignmentNumber: 'BW-2.1.1',
    orderIndex: 9,
    title: 'Even-Count Flat Peyote Stitch',
    description: 'Master the most fundamental off-loom beading stitch — even-count flat peyote. This stitch forms the backbone of countless beadwork projects.',
    instructions: `1. Learn the peyote stitch structure: how beads interlock in an offset grid
2. Practice the initial row setup with a stop bead and even number of beads
3. Work rows back and forth, maintaining consistent tension
4. Create a flat peyote swatch minimum 20 beads wide x 30 rows using Delica 11/0
5. Practice "zipping" two peyote pieces together
6. Create a simple geometric pattern within your peyote swatch`,
    objectives: [
      'Execute consistent even-count flat peyote stitch',
      'Maintain even tension throughout the work',
      'Read and follow a peyote pattern chart',
      'Zip two peyote panels together seamlessly',
    ],
    skills: ['Peyote stitch', 'Tension control', 'Pattern following', 'Zipping technique'],
    expectedOutcome: 'A flat peyote swatch (20 beads x 30 rows) with a geometric pattern and demonstrated zipping technique.',
    passingCriteria: 'Stitch is consistent with no missing beads, tension is even, pattern is accurate',
    referencePhotos: ['/curriculum/beadwork/flat-peyote.jpg', '/curriculum/beadwork/peyote-pattern.jpg'],
    estimatedHours: 12,
    difficulty: 'beginner',
    category: 'stitching',
    subcategory: 'peyote',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 2,
    moduleNumber: '2.1',
    assignmentNumber: 'BW-2.1.2',
    orderIndex: 10,
    title: 'Odd-Count Flat Peyote & Thread Turns',
    description: 'Learn the more complex odd-count peyote stitch which allows for centered designs and symmetrical patterns.',
    instructions: `1. Understand why odd-count peyote requires a special turn at the end of every other row
2. Practice the figure-eight thread path for odd-count turns
3. Create an odd-count peyote swatch (21 beads wide x 30 rows)
4. Design a symmetrical pattern that takes advantage of the center column
5. Practice adding and ending thread mid-work cleanly
6. Compare your odd-count and even-count swatches side by side`,
    objectives: [
      'Execute the odd-count peyote turn correctly',
      'Add and end thread without visible knots',
      'Create symmetrical designs using odd-count advantage',
      'Maintain consistency through thread changes',
    ],
    skills: ['Odd-count peyote', 'Thread turns', 'Thread addition', 'Symmetrical design'],
    expectedOutcome: 'An odd-count peyote swatch with a symmetrical pattern and clean thread additions.',
    passingCriteria: 'Turns are invisible, thread additions are hidden, pattern is centered and symmetrical',
    referencePhotos: ['/curriculum/beadwork/odd-count-peyote.jpg', '/curriculum/beadwork/thread-turn.jpg'],
    estimatedHours: 10,
    difficulty: 'intermediate',
    category: 'stitching',
    subcategory: 'peyote',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 2,
    moduleNumber: '2.1',
    assignmentNumber: 'BW-2.1.3',
    orderIndex: 11,
    title: 'Tubular Peyote Stitch — Beaded Tube',
    description: 'Learn tubular peyote stitch to create seamless beaded tubes used for bangle bracelets, amulet bags, and vessel forms.',
    instructions: `1. Learn the step-up technique required for tubular peyote
2. Practice starting tubular peyote around a form (dowel or mandrel)
3. Create a tubular peyote bracelet using 11/0 Delica beads
4. Incorporate a 2-color spiral pattern into your tube
5. Learn to decrease and increase within tubular peyote
6. Finish the tube with a clean closure or clasp attachment`,
    objectives: [
      'Execute tubular peyote with proper step-ups',
      'Create even, round tubes without distortion',
      'Incorporate spiral patterns into tubular work',
      'Perform increases and decreases in tubular form',
    ],
    skills: ['Tubular peyote', 'Step-up technique', 'Spiral patterns', 'Tube construction'],
    expectedOutcome: 'A tubular peyote bracelet with a spiral pattern, even diameter, and clean closure.',
    passingCriteria: 'Tube is round and even, spiral pattern is consistent, closure is clean',
    referencePhotos: ['/curriculum/beadwork/tubular-peyote.jpg', '/curriculum/beadwork/peyote-spiral.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'stitching',
    subcategory: 'peyote-tubular',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // Module 2.2: Brick Stitch
  {
    level: 2,
    moduleNumber: '2.2',
    assignmentNumber: 'BW-2.2.1',
    orderIndex: 12,
    title: 'Flat Brick Stitch Fundamentals',
    description: 'Learn brick stitch — a versatile technique where beads are stacked like bricks in a wall. Essential for earrings, pendants, and shaped pieces.',
    instructions: `1. Create a ladder stitch base row (the foundation for brick stitch)
2. Practice adding beads in brick stitch formation on subsequent rows
3. Learn increasing and decreasing at row edges for shaping
4. Create a flat brick stitch swatch minimum 15 beads wide x 20 rows
5. Design and execute a simple motif (flower, geometric, or animal)
6. Create a pair of brick stitch earrings with fringe`,
    objectives: [
      'Execute ladder stitch base row evenly',
      'Build consistent brick stitch rows',
      'Shape pieces using increases and decreases',
      'Create a finished pair of earrings',
    ],
    skills: ['Brick stitch', 'Ladder stitch', 'Shaping', 'Earring construction'],
    expectedOutcome: 'A brick stitch swatch with motif plus a completed pair of brick stitch earrings with fringe.',
    passingCriteria: 'Ladder base is even, brick rows are consistent, earrings match as a pair',
    referencePhotos: ['/curriculum/beadwork/brick-stitch.jpg', '/curriculum/beadwork/brick-earrings.jpg'],
    estimatedHours: 10,
    difficulty: 'beginner',
    category: 'stitching',
    subcategory: 'brick-stitch',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 2,
    moduleNumber: '2.2',
    assignmentNumber: 'BW-2.2.2',
    orderIndex: 13,
    title: 'Brick Stitch Shaped Pieces & Charms',
    description: 'Use brick stitch increases and decreases to create shaped pieces — animals, flowers, and decorative charms.',
    instructions: `1. Study how to read shaped brick stitch patterns
2. Practice controlled increasing (adding 2 beads at row start/end)
3. Practice controlled decreasing (skipping threads at edges)
4. Create 3 shaped brick stitch charms from patterns (e.g., butterfly, leaf, star)
5. Add jump rings and lobster clasps for use as keychains or zipper pulls
6. Design one original shaped piece from scratch`,
    objectives: [
      'Read and follow shaped brick stitch patterns',
      'Control increases and decreases for precise shaping',
      'Create matched pairs and consistent shapes',
      'Design original shaped pieces',
    ],
    skills: ['Shaped beadwork', 'Pattern following', 'Increasing/decreasing', 'Charm finishing'],
    expectedOutcome: 'Three completed brick stitch charms from patterns plus one original design, all with findings attached.',
    passingCriteria: 'Shapes are accurate to pattern, edges are clean, findings are secure',
    referencePhotos: ['/curriculum/beadwork/brick-charms.jpg', '/curriculum/beadwork/shaped-pieces.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'stitching',
    subcategory: 'brick-stitch',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // Module 2.3: Herringbone (Ndebele) Stitch
  {
    level: 2,
    moduleNumber: '2.3',
    assignmentNumber: 'BW-2.3.1',
    orderIndex: 14,
    title: 'Flat Herringbone Stitch',
    description: 'Learn the Ndebele herringbone stitch — a beautiful technique that creates a distinctive V-shaped pattern resembling a herringbone textile weave.',
    instructions: `1. Study the herringbone stitch structure and bead alignment
2. Create a ladder stitch base row for herringbone
3. Practice the herringbone stitch: adding pairs of beads that lean against each other
4. Work a flat herringbone swatch minimum 6 columns x 30 rows
5. Learn to add edge beads for a clean border
6. Experiment with color placement to highlight the V-pattern`,
    objectives: [
      'Execute consistent herringbone columns',
      'Maintain proper bead angle throughout',
      'Add clean edge treatments',
      'Use color to enhance the herringbone pattern',
    ],
    skills: ['Herringbone stitch', 'Column alignment', 'Edge treatment', 'Color placement'],
    expectedOutcome: 'A flat herringbone swatch with clean edges and color-enhanced V-pattern.',
    passingCriteria: 'Columns are straight, V-pattern is visible, edges are neat',
    referencePhotos: ['/curriculum/beadwork/herringbone-flat.jpg', '/curriculum/beadwork/herringbone-detail.jpg'],
    estimatedHours: 10,
    difficulty: 'intermediate',
    category: 'stitching',
    subcategory: 'herringbone',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 2,
    moduleNumber: '2.3',
    assignmentNumber: 'BW-2.3.2',
    orderIndex: 15,
    title: 'Tubular Herringbone Rope',
    description: 'Create tubular herringbone ropes — a popular technique for necklace ropes and bracelet bases.',
    instructions: `1. Start tubular herringbone with a ladder base joined into a ring
2. Practice the step-up between rounds
3. Create a 4-column tubular herringbone rope (minimum 8 inches)
4. Experiment with a twisted/spiral variation using color changes
5. Learn to attach a clasp or create a toggle closure
6. Create a finished herringbone rope necklace or bracelet`,
    objectives: [
      'Build consistent tubular herringbone ropes',
      'Execute proper step-ups between rounds',
      'Create spiral effects with color placement',
      'Attach professional closures',
    ],
    skills: ['Tubular herringbone', 'Rope construction', 'Spiral design', 'Closure techniques'],
    expectedOutcome: 'A finished herringbone rope necklace or bracelet with spiral pattern and clasp.',
    passingCriteria: 'Rope is even diameter, spiral is consistent, closure is functional and attractive',
    referencePhotos: ['/curriculum/beadwork/herringbone-rope.jpg', '/curriculum/beadwork/herringbone-spiral.jpg'],
    estimatedHours: 14,
    difficulty: 'intermediate',
    category: 'stitching',
    subcategory: 'herringbone',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // Module 2.4: Right Angle Weave (RAW)
  {
    level: 2,
    moduleNumber: '2.4',
    assignmentNumber: 'BW-2.4.1',
    orderIndex: 16,
    title: 'Single-Needle Right Angle Weave',
    description: 'Master Right Angle Weave (RAW) — a flexible, fabric-like stitch that forms the foundation for beaded bags, vessels, and 3D structures.',
    instructions: `1. Study the RAW structure: groups of 4 beads forming cross-shaped units
2. Learn the thread path for single-needle RAW (figure-eight pattern)
3. Create the first row of RAW units
4. Build subsequent rows by connecting new units to existing ones
5. Create a flat RAW swatch minimum 10 units wide x 15 rows
6. Practice maintaining consistent tension for an even, flexible fabric`,
    objectives: [
      'Understand the RAW unit structure and thread path',
      'Build rows and connect them consistently',
      'Maintain even tension for flexible beadwork fabric',
      'Identify top, bottom, and side beads in RAW units',
    ],
    skills: ['Right angle weave', 'Thread path navigation', 'Fabric-like beadwork', 'Structural understanding'],
    expectedOutcome: 'A flat RAW swatch that is flexible, even, and demonstrates proper unit construction.',
    passingCriteria: 'All units are consistent, fabric is flexible and lies flat, no thread showing',
    referencePhotos: ['/curriculum/beadwork/raw-flat.jpg', '/curriculum/beadwork/raw-thread-path.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'stitching',
    subcategory: 'right-angle-weave',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 2,
    moduleNumber: '2.4',
    assignmentNumber: 'BW-2.4.2',
    orderIndex: 17,
    title: 'Cubic Right Angle Weave (CRAW)',
    description: 'Learn Cubic RAW to create solid, 3-dimensional beaded structures — essential for beaded beads, bezels, and structural components.',
    instructions: `1. Study how CRAW extends RAW into 3 dimensions
2. Practice building a single CRAW unit (cube)
3. Connect CRAW units into a chain/rope
4. Create a CRAW rope minimum 4 inches long
5. Learn to embellish CRAW with accent beads on the surface
6. Create a CRAW beaded bead or pendant`,
    objectives: [
      'Construct consistent CRAW cubes',
      'Build CRAW chains and ropes',
      'Embellish CRAW surfaces with accent beads',
      'Create 3D structural components',
    ],
    skills: ['Cubic RAW', '3D construction', 'Surface embellishment', 'Structural beadwork'],
    expectedOutcome: 'A CRAW rope with embellishment plus a CRAW beaded bead or pendant.',
    passingCriteria: 'Cubes are uniform, rope is straight, embellishment is even',
    referencePhotos: ['/curriculum/beadwork/craw-rope.jpg', '/curriculum/beadwork/craw-bead.jpg'],
    estimatedHours: 14,
    difficulty: 'intermediate',
    category: 'stitching',
    subcategory: 'right-angle-weave',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // Module 2.5: Loom Beadwork
  {
    level: 2,
    moduleNumber: '2.5',
    assignmentNumber: 'BW-2.5.1',
    orderIndex: 18,
    title: 'Bead Loom Setup & Basic Weaving',
    description: 'Learn to set up and use a bead loom to create flat, woven beadwork panels with precise geometric patterns.',
    instructions: `1. Study loom types: traditional frame loom, adjustable loom, and improvised looms
2. Set up warp threads with proper tension and spacing for 11/0 seed beads
3. Learn the basic loom weaving technique: loading beads on the weft, passing under and over warp threads
4. Create a loom-woven swatch minimum 1 inch wide x 6 inches long
5. Follow a geometric loom pattern with at least 3 colors
6. Learn proper thread management to avoid tangling`,
    objectives: [
      'Set up a bead loom with correct warp tension',
      'Execute basic loom weaving consistently',
      'Follow loom pattern charts accurately',
      'Manage warp and weft threads without tangling',
    ],
    skills: ['Loom setup', 'Loom weaving', 'Warp/weft management', 'Pattern following'],
    expectedOutcome: 'A loom-woven swatch with a 3-color geometric pattern, consistent width, and even rows.',
    passingCriteria: 'Warp threads are hidden, rows are straight and even, pattern matches chart',
    referencePhotos: ['/curriculum/beadwork/loom-setup.jpg', '/curriculum/beadwork/loom-weaving.jpg'],
    estimatedHours: 10,
    difficulty: 'beginner',
    category: 'stitching',
    subcategory: 'loom-work',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 2,
    moduleNumber: '2.5',
    assignmentNumber: 'BW-2.5.2',
    orderIndex: 19,
    title: 'Loom Finishing — Warp Thread Removal',
    description: 'Master the critical skill of finishing loom work by properly securing and hiding warp threads.',
    instructions: `1. Study the 3 main warp finishing methods: weaving back, sewing to backing, and looping
2. Practice weaving warp threads back into the beadwork one at a time
3. Learn the needle-and-thread warp finishing method for cleaner results
4. Practice finishing with a fabric or ultra-suede backing
5. Create a finished loom piece as a bookmark or cuff bracelet
6. Add edge finishing (picot edge or brick stitch border)`,
    objectives: [
      'Finish loom pieces without visible warp threads',
      'Apply backing material professionally',
      'Add decorative edge finishes',
      'Create a polished, professional final product',
    ],
    skills: ['Warp finishing', 'Backing application', 'Edge finishing', 'Professional presentation'],
    expectedOutcome: 'A finished loom-woven bookmark or cuff bracelet with hidden warps and clean edges.',
    passingCriteria: 'No warp threads visible, edges are clean, backing (if used) is neat',
    referencePhotos: ['/curriculum/beadwork/loom-finishing.jpg', '/curriculum/beadwork/loom-bracelet.jpg'],
    estimatedHours: 8,
    difficulty: 'intermediate',
    category: 'stitching',
    subcategory: 'loom-work',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // Module 2.6: Netting Stitch
  {
    level: 2,
    moduleNumber: '2.6',
    assignmentNumber: 'BW-2.6.1',
    orderIndex: 20,
    title: 'Horizontal & Vertical Netting',
    description: 'Learn netting stitches to create open, lace-like beadwork used for necklace draping, vessel covers, and decorative overlays.',
    instructions: `1. Study netting structure: shared beads, net beads, and turning beads
2. Practice 3-bead horizontal netting on a straight strip
3. Practice 5-bead netting for a more open, lacy look
4. Create a vertical netting sample for comparison
5. Experiment with adding accent beads (crystals or drops) at net points
6. Create a netted necklace collar or choker`,
    objectives: [
      'Execute consistent 3-bead and 5-bead netting',
      'Understand horizontal vs vertical netting orientation',
      'Embellish netting with accent beads',
      'Create a wearable netted piece',
    ],
    skills: ['Horizontal netting', 'Vertical netting', 'Embellishment', 'Collar construction'],
    expectedOutcome: 'A completed netted necklace collar with accent beads and professional clasp.',
    passingCriteria: 'Netting is even and symmetrical, accent beads enhance design, fits properly',
    referencePhotos: ['/curriculum/beadwork/netting-horizontal.jpg', '/curriculum/beadwork/netted-collar.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'stitching',
    subcategory: 'netting',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // ============================================================================
  // LEVEL 3: INTERMEDIATE PROJECTS (Months 7-9)
  // ============================================================================

  // Module 3.1: Beaded Jewelry Projects
  {
    level: 3,
    moduleNumber: '3.1',
    assignmentNumber: 'BW-3.1.1',
    orderIndex: 21,
    title: 'Statement Necklace with Mixed Techniques',
    description: 'Combine multiple stitches learned so far to create a statement necklace that showcases your technical range.',
    instructions: `1. Design a statement necklace incorporating at least 3 different stitches
2. Create a focal element using peyote or brick stitch
3. Build a herringbone or RAW chain for the necklace body
4. Add netting or fringe embellishments
5. Incorporate different bead types (seed beads, crystals, drops)
6. Attach a professional clasp and finish all thread ends securely`,
    objectives: [
      'Combine multiple beading techniques in one piece',
      'Design a cohesive piece with visual hierarchy',
      'Create professional-quality findings attachment',
      'Demonstrate mastery of at least 3 stitches',
    ],
    skills: ['Multi-technique design', 'Focal element creation', 'Design cohesion', 'Professional finishing'],
    expectedOutcome: 'A statement necklace combining 3+ stitches with professional finishing.',
    passingCriteria: 'Techniques are well-executed, design is cohesive, finishing is professional',
    referencePhotos: ['/curriculum/beadwork/statement-necklace.jpg', '/curriculum/beadwork/focal-element.jpg'],
    estimatedHours: 20,
    difficulty: 'intermediate',
    category: 'jewelry',
    subcategory: 'necklace',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 3,
    moduleNumber: '3.1',
    assignmentNumber: 'BW-3.1.2',
    orderIndex: 22,
    title: 'Beaded Cuff Bracelet',
    description: 'Create a wide beaded cuff bracelet using peyote stitch with a custom pattern and professional clasp system.',
    instructions: `1. Design a pattern for a cuff bracelet (minimum 1.5 inches wide)
2. Choose between flat peyote or loom technique for the body
3. Create the cuff panel with your custom pattern
4. Install a slide clasp, button closure, or magnetic clasp
5. Add edge embellishment (picot, fringe, or crystal drops)
6. Ensure proper sizing for comfortable wear`,
    objectives: [
      'Create wide beadwork panels for wearable pieces',
      'Install various clasp types on flat beadwork',
      'Design patterns appropriate for cuff bracelet format',
      'Size bracelets correctly for comfort',
    ],
    skills: ['Cuff construction', 'Clasp installation', 'Wide panel beadwork', 'Sizing'],
    expectedOutcome: 'A finished beaded cuff bracelet with custom pattern, professional clasp, and edge embellishment.',
    passingCriteria: 'Cuff fits comfortably, clasp functions well, pattern is clean, edges are finished',
    referencePhotos: ['/curriculum/beadwork/cuff-bracelet.jpg', '/curriculum/beadwork/slide-clasp.jpg'],
    estimatedHours: 16,
    difficulty: 'intermediate',
    category: 'jewelry',
    subcategory: 'bracelet',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 3,
    moduleNumber: '3.1',
    assignmentNumber: 'BW-3.1.3',
    orderIndex: 23,
    title: 'Beaded Earring Collection',
    description: 'Create a collection of 4 different earring styles demonstrating various techniques and design aesthetics.',
    instructions: `1. Design and create brick stitch drop earrings with fringe
2. Design and create peyote triangle or geometric earrings
3. Design and create RAW crystal bezel earrings
4. Design and create herringbone leaf or feather earrings
5. Attach proper ear wires or posts with jump rings
6. Package each pair professionally for portfolio photography`,
    objectives: [
      'Create matched pairs with consistent quality',
      'Apply different techniques to earring formats',
      'Select appropriate ear wire styles for each design',
      'Develop a cohesive collection aesthetic',
    ],
    skills: ['Earring construction', 'Pair matching', 'Findings attachment', 'Collection design'],
    expectedOutcome: 'Four pairs of earrings in different styles, all matched and professionally finished.',
    passingCriteria: 'All pairs match, techniques are clean, findings are secure, collection has visual cohesion',
    referencePhotos: ['/curriculum/beadwork/earring-collection.jpg', '/curriculum/beadwork/earring-variety.jpg'],
    estimatedHours: 18,
    difficulty: 'intermediate',
    category: 'jewelry',
    subcategory: 'earrings',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // Module 3.2: Introduction to Beaded Bags
  {
    level: 3,
    moduleNumber: '3.2',
    assignmentNumber: 'BW-3.2.1',
    orderIndex: 24,
    title: 'Small Beaded Pouch — Amulet Bag',
    description: 'Create your first beaded bag — a small amulet pouch using tubular peyote stitch. This introduces bag construction principles.',
    instructions: `1. Design a pattern for a small amulet bag (approximately 2" x 3")
2. Start with tubular peyote at the desired width
3. Work the body of the bag in tubular peyote with your pattern
4. Create a flat peyote bottom by decreasing
5. Add a strap using peyote, herringbone rope, or spiral rope
6. Add a flap closure or drawstring top with fringe embellishment`,
    objectives: [
      'Construct a 3D bag form from tubular beadwork',
      'Create a flat bottom through decreases',
      'Attach a functional strap',
      'Add closure and decorative embellishment',
    ],
    skills: ['Bag construction', 'Tubular-to-flat transition', 'Strap creation', 'Closure design'],
    expectedOutcome: 'A completed amulet bag with patterned body, flat bottom, strap, closure, and fringe.',
    passingCriteria: 'Bag holds shape, bottom is flat, strap is secure, closure functions',
    referencePhotos: ['/curriculum/beadwork/amulet-bag.jpg', '/curriculum/beadwork/bag-bottom.jpg'],
    estimatedHours: 20,
    difficulty: 'intermediate',
    category: 'bags',
    subcategory: 'pouch',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 3,
    moduleNumber: '3.2',
    assignmentNumber: 'BW-3.2.2',
    orderIndex: 25,
    title: 'Beaded Phone Pouch / Small Clutch',
    description: 'Scale up your bag-making skills to create a phone-sized beaded pouch or small clutch using RAW or peyote stitch.',
    instructions: `1. Measure and plan dimensions for a phone pouch or small clutch (approx 4" x 7")
2. Choose RAW for flexibility or peyote for structure
3. Create front and back panels with matching or complementary patterns
4. Join panels at the sides and bottom
5. Add a flap closure with magnetic snap or button-loop
6. Create a wrist strap or short handle and add a lining if desired`,
    objectives: [
      'Scale beadwork to larger functional dimensions',
      'Create and join multiple panels',
      'Install functional hardware (snaps, magnets)',
      'Construct wearable straps/handles',
    ],
    skills: ['Panel construction', 'Panel joining', 'Hardware installation', 'Functional design'],
    expectedOutcome: 'A phone-sized beaded pouch or clutch with closure, strap, and optional lining.',
    passingCriteria: 'Fits a phone, closure is secure, panels are aligned, strap is comfortable',
    referencePhotos: ['/curriculum/beadwork/phone-pouch.jpg', '/curriculum/beadwork/small-clutch.jpg'],
    estimatedHours: 30,
    difficulty: 'intermediate',
    category: 'bags',
    subcategory: 'clutch',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // Module 3.3: Bead Embroidery Basics
  {
    level: 3,
    moduleNumber: '3.3',
    assignmentNumber: 'BW-3.3.1',
    orderIndex: 26,
    title: 'Bead Embroidery on Fabric — Flat Techniques',
    description: 'Learn to embroider beads onto fabric using backstitch, couching, and scatter techniques for embellishing bags, clothing, and accessories.',
    instructions: `1. Study bead embroidery stitches: backstitch (1-bead, 2-bead, 3-bead), couching, scatter/random
2. Transfer a design onto stiff interfacing or felt
3. Practice backstitch beading along lines and curves
4. Practice couching for long straight lines and outlines
5. Fill areas using scatter/random technique with mixed bead sizes
6. Create a 4" x 4" embroidered sample combining all techniques`,
    objectives: [
      'Execute backstitch bead embroidery cleanly',
      'Couch lines of beads for outlines and borders',
      'Fill areas with scatter technique',
      'Combine techniques for visual impact',
    ],
    skills: ['Bead embroidery', 'Backstitch', 'Couching', 'Area filling'],
    expectedOutcome: 'A 4"x4" bead embroidery sample combining backstitch, couching, and scatter fill techniques.',
    passingCriteria: 'Beads are securely attached, lines are smooth, fills are even, design is readable',
    referencePhotos: ['/curriculum/beadwork/bead-embroidery-sample.jpg', '/curriculum/beadwork/embroidery-stitches.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'embroidery',
    subcategory: 'flat-techniques',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 3,
    moduleNumber: '3.3',
    assignmentNumber: 'BW-3.3.2',
    orderIndex: 27,
    title: 'Cabochon Bezel & Bead Embroidered Pendant',
    description: 'Learn to bezel a cabochon stone using bead embroidery and peyote stitch, then create a finished pendant.',
    instructions: `1. Select a cabochon stone (oval or round, 25-40mm)
2. Glue cabochon to a stiff beading foundation (Lacy's Stiff Stuff or Nicole's BeadBacking)
3. Create a bezel around the cabochon using backstitch and peyote decrease rows
4. Embellish the area around the cabochon with seed beads, crystals, and accent beads
5. Cut and back with ultra-suede, hiding all thread work
6. Add a bail or loop for pendant hanging and edge-stitch (brick stitch edge) for finishing`,
    objectives: [
      'Bezel a cabochon securely with beadwork',
      'Create attractive surrounding embroidery',
      'Apply backing cleanly',
      'Finish edges with brick stitch edging',
    ],
    skills: ['Cabochon bezeling', 'Bead embroidery design', 'Backing application', 'Edge finishing'],
    expectedOutcome: 'A bead-embroidered pendant with bezeled cabochon, embellished surround, and finished edges.',
    passingCriteria: 'Cabochon is secure, bezel is snug, backing is clean, edges are uniform',
    referencePhotos: ['/curriculum/beadwork/cabochon-bezel.jpg', '/curriculum/beadwork/embroidered-pendant.jpg'],
    estimatedHours: 14,
    difficulty: 'intermediate',
    category: 'embroidery',
    subcategory: 'cabochon',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // Module 3.4: Beaded Accessories
  {
    level: 3,
    moduleNumber: '3.4',
    assignmentNumber: 'BW-3.4.1',
    orderIndex: 28,
    title: 'Beaded Keychain & Bag Charms',
    description: 'Create beaded keychains and bag charms as saleable accessories — combining brick stitch, peyote, and stringing.',
    instructions: `1. Design 3 different keychain/bag charm concepts
2. Create a 3D beaded animal or fruit charm using brick or peyote stitch
3. Create a tassel charm with seed beads and crystals
4. Create a beaded name tag or initial charm
5. Attach all charms to keychain hardware or lobster clasps
6. Package each charm attractively for sale`,
    objectives: [
      'Create small, saleable beaded items quickly',
      'Attach hardware for functional accessories',
      'Design appealing, marketable charms',
      'Package products for retail presentation',
    ],
    skills: ['Small item production', 'Hardware attachment', 'Quick production', 'Product packaging'],
    expectedOutcome: 'Three different keychain/bag charms with hardware, ready for sale.',
    passingCriteria: 'Charms are well-crafted, hardware is secure, presentation is professional',
    referencePhotos: ['/curriculum/beadwork/keychain-charms.jpg', '/curriculum/beadwork/bag-charms.jpg'],
    estimatedHours: 10,
    difficulty: 'intermediate',
    category: 'accessories',
    subcategory: 'keychains',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 3,
    moduleNumber: '3.4',
    assignmentNumber: 'BW-3.4.2',
    orderIndex: 29,
    title: 'Beaded Hair Accessories',
    description: 'Create beaded hair accessories including headbands, hair clips, and hair pins using bead embroidery and wire work.',
    instructions: `1. Study hair accessory construction methods
2. Create a bead-embroidered hair clip by stitching onto felt and attaching to a clip base
3. Create a beaded headband by wrapping a metal headband base with beaded wire or embroidered band
4. Create beaded hair pins using wire wrapping and bead clusters
5. Ensure all pieces are comfortable and hair-safe (no sharp edges)
6. Test durability by wearing each piece for daily activities`,
    objectives: [
      'Construct beaded accessories for hair',
      'Attach beadwork to hair hardware securely',
      'Design comfortable, wearable pieces',
      'Ensure durability for daily use',
    ],
    skills: ['Hair accessory construction', 'Wire wrapping', 'Hardware attachment', 'Wearability design'],
    expectedOutcome: 'Three hair accessories: a clip, a headband, and hair pins — all wearable and durable.',
    passingCriteria: 'Pieces stay in hair securely, are comfortable, beadwork is clean',
    referencePhotos: ['/curriculum/beadwork/hair-clip.jpg', '/curriculum/beadwork/beaded-headband.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'accessories',
    subcategory: 'hair',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // ============================================================================
  // LEVEL 4: ADVANCED TECHNIQUES (Months 10-12)
  // ============================================================================

  // Module 4.1: Advanced Bag Construction
  {
    level: 4,
    moduleNumber: '4.1',
    assignmentNumber: 'BW-4.1.1',
    orderIndex: 30,
    title: 'Beaded Evening Clutch Bag',
    description: 'Construct a full-sized evening clutch bag using advanced beading techniques with professional hardware and lining.',
    instructions: `1. Design an evening clutch (approximately 6" x 10") with pattern mockup
2. Create the bag body using RAW or peyote stitch panels with a sophisticated pattern
3. Construct internal structure with stiff interfacing for shape retention
4. Install a metal frame, magnetic snap, or kiss-lock clasp
5. Line the interior with satin or silk fabric using hand-stitching
6. Add a wrist chain or detachable shoulder chain`,
    objectives: [
      'Construct a structurally sound full-sized beaded clutch',
      'Install professional bag hardware (frame/clasp)',
      'Line a beaded bag with fabric',
      'Create a piece suitable for formal occasions',
    ],
    skills: ['Full-size bag construction', 'Frame installation', 'Fabric lining', 'Structural engineering'],
    expectedOutcome: 'A completed beaded evening clutch with professional hardware, lining, and chain strap.',
    passingCriteria: 'Bag holds shape, hardware functions smoothly, lining is clean, overall quality is retail-ready',
    referencePhotos: ['/curriculum/beadwork/evening-clutch.jpg', '/curriculum/beadwork/clutch-interior.jpg'],
    estimatedHours: 40,
    difficulty: 'advanced',
    category: 'bags',
    subcategory: 'evening-clutch',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 4,
    moduleNumber: '4.1',
    assignmentNumber: 'BW-4.1.2',
    orderIndex: 31,
    title: 'Beaded Shoulder Bag with Strap',
    description: 'Create a beaded shoulder bag with a fully beaded or mixed-material strap, zipper closure, and interior pockets.',
    instructions: `1. Design a shoulder bag (approximately 7" x 9") with front, back, and gusset panels
2. Create panels using RAW with crystal embellishment or patterned peyote
3. Construct gusset panels for bag depth (2-3 inches)
4. Install a zipper closure by stitching beadwork around zipper tape
5. Create a beaded or chain shoulder strap with adjustable length
6. Add interior fabric lining with a small pocket`,
    objectives: [
      'Construct a multi-panel bag with gussets',
      'Install a zipper into beadwork',
      'Create a comfortable, functional shoulder strap',
      'Add professional interior finishing',
    ],
    skills: ['Gusset construction', 'Zipper installation', 'Strap engineering', 'Interior finishing'],
    expectedOutcome: 'A beaded shoulder bag with zipper, shoulder strap, lined interior, and pocket.',
    passingCriteria: 'Bag is functional, zipper works smoothly, strap is comfortable, all seams are secure',
    referencePhotos: ['/curriculum/beadwork/shoulder-bag.jpg', '/curriculum/beadwork/bag-gusset.jpg'],
    estimatedHours: 50,
    difficulty: 'advanced',
    category: 'bags',
    subcategory: 'shoulder-bag',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 4,
    moduleNumber: '4.1',
    assignmentNumber: 'BW-4.1.3',
    orderIndex: 32,
    title: 'Beaded Crossbody / Mini Bag',
    description: 'Create a compact crossbody or mini bag combining beadwork with leather or fabric elements for durability.',
    instructions: `1. Design a crossbody bag (approximately 5" x 7") combining beadwork with leather/fabric
2. Create the beaded front panel as the showcase piece
3. Construct the back panel and sides using leather or sturdy fabric
4. Attach beadwork to fabric components using hand-stitching
5. Install D-rings, swivel hooks, and an adjustable crossbody strap
6. Add a secure closure (zipper or flap with magnetic snap)`,
    objectives: [
      'Combine beadwork with other materials professionally',
      'Install bag hardware (D-rings, swivel hooks)',
      'Create mixed-material designs that are durable',
      'Engineer adjustable strap systems',
    ],
    skills: ['Mixed-material construction', 'D-ring installation', 'Beadwork-to-fabric attachment', 'Strap systems'],
    expectedOutcome: 'A crossbody bag with beaded front panel, leather/fabric body, and adjustable strap.',
    passingCriteria: 'Beadwork attachment is secure, hardware functions smoothly, bag is durable and wearable',
    referencePhotos: ['/curriculum/beadwork/crossbody-bag.jpg', '/curriculum/beadwork/mixed-material.jpg'],
    estimatedHours: 35,
    difficulty: 'advanced',
    category: 'bags',
    subcategory: 'crossbody',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // Module 4.2: Advanced Bead Embroidery
  {
    level: 4,
    moduleNumber: '4.2',
    assignmentNumber: 'BW-4.2.1',
    orderIndex: 33,
    title: 'Bead Embroidered Bag Panel',
    description: 'Create a large-scale bead embroidery panel for a bag front, incorporating cabochons, crystals, and mixed materials.',
    instructions: `1. Design a complex embroidery layout for a bag panel (minimum 5" x 7")
2. Begin with focal cabochons — bezel and secure them
3. Build outward with bezeled crystals, rivoli settings, and accent stones
4. Fill surrounding areas with seed bead embroidery in flowing patterns
5. Add dimensional elements: stacked beads, raised bezels, textured fills
6. Back the panel cleanly and prepare edges for attachment to bag body`,
    objectives: [
      'Create large-scale bead embroidery compositions',
      'Bezel multiple focal elements cohesively',
      'Fill large areas with varied embroidery techniques',
      'Prepare embroidered panels for bag construction',
    ],
    skills: ['Large-scale embroidery', 'Multiple bezeling', 'Composition design', 'Panel preparation'],
    expectedOutcome: 'A completed bead embroidery panel ready for bag attachment, featuring multiple bezeled elements.',
    passingCriteria: 'Composition is balanced, bezels are secure, fills are even, panel is flat and ready for mounting',
    referencePhotos: ['/curriculum/beadwork/embroidered-panel.jpg', '/curriculum/beadwork/multi-bezel.jpg'],
    estimatedHours: 30,
    difficulty: 'advanced',
    category: 'embroidery',
    subcategory: 'large-panel',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 4,
    moduleNumber: '4.2',
    assignmentNumber: 'BW-4.2.2',
    orderIndex: 34,
    title: 'Bead Embroidery on Garments & Fabric Items',
    description: 'Learn to embroider beads directly onto garments, shoes, and fabric accessories for custom embellishment.',
    instructions: `1. Study fabric preparation for bead embroidery (stabilizers, hoops, transfer methods)
2. Practice embroidering on different fabrics: denim, silk, velvet, leather
3. Create a beaded collar or neckline embellishment on a garment
4. Embroider a design on a fabric clutch or pouch
5. Learn weight management — ensuring embroidery doesn't distort fabric
6. Understand care instructions for bead-embroidered garments`,
    objectives: [
      'Embroider beads onto various fabric types',
      'Use proper stabilization for each material',
      'Manage weight and tension on garments',
      'Create wearable embroidered pieces',
    ],
    skills: ['Garment embroidery', 'Fabric stabilization', 'Weight management', 'Care instructions'],
    expectedOutcome: 'A bead-embroidered garment piece and a bead-embroidered fabric accessory.',
    passingCriteria: 'Embroidery is secure, fabric is not distorted, design enhances the garment',
    referencePhotos: ['/curriculum/beadwork/garment-embroidery.jpg', '/curriculum/beadwork/embroidered-collar.jpg'],
    estimatedHours: 20,
    difficulty: 'advanced',
    category: 'embroidery',
    subcategory: 'garment',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // Module 4.3: 3D Beadwork & Sculptural Techniques
  {
    level: 4,
    moduleNumber: '4.3',
    assignmentNumber: 'BW-4.3.1',
    orderIndex: 35,
    title: '3D Beaded Flowers & Botanical Elements',
    description: 'Create three-dimensional beaded flowers using French beading (wire and bead) technique for bag embellishments and accessories.',
    instructions: `1. Study French beading technique: wrapping beads on wire to form petals and leaves
2. Create basic petals using continuous crossover loops
3. Learn pointed and rounded petal variations
4. Assemble a complete flower with stem, leaves, and stamen
5. Create at least 3 different flower types (rose, daisy, lily)
6. Learn to attach 3D flowers to bags, brooches, and hair accessories`,
    objectives: [
      'Execute French beading wire-and-bead technique',
      'Create varied petal shapes and leaf forms',
      'Assemble multi-component 3D flowers',
      'Attach 3D elements to flat beadwork and accessories',
    ],
    skills: ['French beading', 'Wire work', '3D assembly', 'Floral design'],
    expectedOutcome: 'Three different 3D beaded flower types, plus demonstration of attachment to accessories.',
    passingCriteria: 'Flowers are dimensional and realistic, petals are even, attachment is secure',
    referencePhotos: ['/curriculum/beadwork/3d-flowers.jpg', '/curriculum/beadwork/french-beading.jpg'],
    estimatedHours: 18,
    difficulty: 'advanced',
    category: 'sculptural',
    subcategory: 'flowers',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 4,
    moduleNumber: '4.3',
    assignmentNumber: 'BW-4.3.2',
    orderIndex: 36,
    title: '3D Beaded Vessels & Containers',
    description: 'Create three-dimensional beaded vessels, bowls, and decorative containers using advanced shaping techniques.',
    instructions: `1. Study 3D shaping methods: tubular peyote with increases/decreases, RAW shaping
2. Create a small beaded bowl using peyote with graduated increases
3. Build a beaded vessel/vase using tubular RAW with shaping
4. Add decorative elements: ruffled edges, applied embellishment, lid
5. Reinforce structure internally if needed
6. Create a matched set of 2 vessels with complementary designs`,
    objectives: [
      'Shape 3D forms using increase/decrease control',
      'Build structurally sound vessels',
      'Add decorative dimensional elements',
      'Create matched sets with design consistency',
    ],
    skills: ['3D shaping', 'Vessel construction', 'Structural reinforcement', 'Set design'],
    expectedOutcome: 'Two complementary beaded vessels demonstrating 3D shaping and embellishment.',
    passingCriteria: 'Vessels hold shape without support, shaping is smooth, designs complement each other',
    referencePhotos: ['/curriculum/beadwork/beaded-vessel.jpg', '/curriculum/beadwork/beaded-bowl.jpg'],
    estimatedHours: 24,
    difficulty: 'advanced',
    category: 'sculptural',
    subcategory: 'vessels',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // Module 4.4: Advanced Pattern Design
  {
    level: 4,
    moduleNumber: '4.4',
    assignmentNumber: 'BW-4.4.1',
    orderIndex: 37,
    title: 'Custom Pattern Design — Geometric & Abstract',
    description: 'Design original geometric and abstract beading patterns for bags, jewelry, and accessories using digital tools.',
    instructions: `1. Study geometric pattern principles: symmetry, repetition, tessellation
2. Learn to use BeadTool 4 or similar pattern design software
3. Design 3 original geometric patterns suitable for peyote stitch bags
4. Design 2 abstract/artistic patterns for statement pieces
5. Create color variations of each pattern
6. Test one pattern by beading a sample swatch`,
    objectives: [
      'Use pattern design software proficiently',
      'Create original geometric patterns with proper repeats',
      'Design abstract patterns with visual impact',
      'Generate color variations for client options',
    ],
    skills: ['Digital pattern design', 'Geometric design', 'Color variation', 'Software proficiency'],
    expectedOutcome: 'Five original patterns with color variations, plus one beaded sample swatch.',
    passingCriteria: 'Patterns are original and well-designed, repeats are correct, sample matches digital design',
    referencePhotos: ['/curriculum/beadwork/digital-pattern.jpg', '/curriculum/beadwork/geometric-design.jpg'],
    estimatedHours: 16,
    difficulty: 'advanced',
    category: 'design',
    subcategory: 'pattern-design',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 4,
    moduleNumber: '4.4',
    assignmentNumber: 'BW-4.4.2',
    orderIndex: 38,
    title: 'Custom Pattern Design — African & Cultural Motifs',
    description: 'Research and design beading patterns inspired by African cultural motifs, incorporating traditional symbols and color palettes.',
    instructions: `1. Research traditional African beadwork patterns: Zulu, Maasai, Ndebele, Yoruba, Bamum
2. Study the meaning behind traditional color choices and symbols
3. Design 3 patterns inspired by African motifs (not direct copies — original interpretations)
4. Incorporate traditional color palettes: earth tones, primary colors, black-white-red
5. Create patterns suitable for bag panels, cuffs, and necklaces
6. Document the cultural inspiration and meaning behind each design`,
    objectives: [
      'Research and understand African beadwork traditions',
      'Create respectful, original interpretations of cultural motifs',
      'Apply traditional color palettes meaningfully',
      'Document cultural context and inspiration',
    ],
    skills: ['Cultural research', 'Motif interpretation', 'Traditional color palettes', 'Design documentation'],
    expectedOutcome: 'Three original patterns with cultural documentation, suitable for multiple product formats.',
    passingCriteria: 'Designs are respectful and original, documentation is thorough, patterns are technically sound',
    referencePhotos: ['/curriculum/beadwork/african-motifs.jpg', '/curriculum/beadwork/cultural-patterns.jpg'],
    estimatedHours: 14,
    difficulty: 'advanced',
    category: 'design',
    subcategory: 'cultural-motifs',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // ============================================================================
  // LEVEL 5: MASTERY & SPECIALIZATION (Months 13-15)
  // ============================================================================

  // Module 5.1: Signature Bag Collection
  {
    level: 5,
    moduleNumber: '5.1',
    assignmentNumber: 'BW-5.1.1',
    orderIndex: 39,
    title: 'Design Your Signature Bag Style',
    description: 'Develop your personal signature bag design that will define your brand. Create detailed technical drawings and prototypes.',
    instructions: `1. Research current beaded bag trends and identify your unique design voice
2. Sketch at least 10 bag concepts exploring shape, size, pattern, and hardware
3. Select your top 3 designs and create detailed technical drawings with dimensions
4. Specify materials: bead types, colors, hardware, lining, closures
5. Create a mini prototype (half-scale) of your top design
6. Present your designs to mentors for feedback and refinement`,
    objectives: [
      'Develop a personal design aesthetic',
      'Create professional technical drawings',
      'Build design prototypes for testing',
      'Present and defend design decisions',
    ],
    skills: ['Design development', 'Technical drawing', 'Prototyping', 'Design presentation'],
    expectedOutcome: 'Ten concept sketches, 3 technical drawings, and 1 half-scale prototype.',
    passingCriteria: 'Designs show originality and commercial viability, prototype validates the concept',
    referencePhotos: ['/curriculum/beadwork/design-sketches.jpg', '/curriculum/beadwork/bag-prototype.jpg'],
    estimatedHours: 20,
    difficulty: 'advanced',
    category: 'design',
    subcategory: 'signature-style',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 5,
    moduleNumber: '5.1',
    assignmentNumber: 'BW-5.1.2',
    orderIndex: 40,
    title: 'Signature Bag — Full Production',
    description: 'Produce your signature beaded bag at full scale with professional-grade materials, hardware, and finishing.',
    instructions: `1. Source all materials: premium beads, quality hardware, lining fabric
2. Create the beadwork panels following your finalized pattern
3. Construct the bag structure with professional interior finishing
4. Install all hardware: clasp, chain, feet, logo plate (if applicable)
5. Quality-check every aspect: bead alignment, thread security, hardware function
6. Create product photography of the finished bag`,
    objectives: [
      'Execute a complete bag from design to finished product',
      'Use professional-grade materials throughout',
      'Achieve retail-ready quality in every detail',
      'Document the creation process',
    ],
    skills: ['Full production', 'Quality control', 'Professional finishing', 'Product documentation'],
    expectedOutcome: 'A retail-ready signature beaded bag with professional photography.',
    passingCriteria: 'Bag meets retail quality standards, all hardware functions, photography is professional',
    referencePhotos: ['/curriculum/beadwork/signature-bag.jpg', '/curriculum/beadwork/bag-details.jpg'],
    estimatedHours: 60,
    difficulty: 'expert',
    category: 'bags',
    subcategory: 'signature',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 5,
    moduleNumber: '5.1',
    assignmentNumber: 'BW-5.1.3',
    orderIndex: 41,
    title: 'Mini Collection — 3 Coordinated Bags',
    description: 'Create a cohesive mini collection of 3 bags in different sizes/styles that share a design DNA — your first "collection".',
    instructions: `1. Define your collection theme: color palette, motif family, hardware style
2. Design 3 bags: a clutch, a crossbody/shoulder bag, and a tote or large bag
3. Ensure design consistency through shared elements (pattern, color, hardware)
4. Produce all 3 bags to retail-ready standard
5. Create lookbook-style photography of the collection
6. Write collection descriptions and pricing for each piece`,
    objectives: [
      'Design a cohesive product collection',
      'Maintain quality across multiple pieces',
      'Create consistent brand identity through design elements',
      'Produce collection photography and descriptions',
    ],
    skills: ['Collection design', 'Brand consistency', 'Multi-piece production', 'Lookbook creation'],
    expectedOutcome: 'Three coordinated beaded bags with lookbook photography and collection descriptions.',
    passingCriteria: 'Collection is cohesive, all pieces are retail-ready, photography is professional',
    referencePhotos: ['/curriculum/beadwork/bag-collection.jpg', '/curriculum/beadwork/lookbook.jpg'],
    estimatedHours: 80,
    difficulty: 'expert',
    category: 'bags',
    subcategory: 'collection',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // Module 5.2: Advanced Jewelry Mastery
  {
    level: 5,
    moduleNumber: '5.2',
    assignmentNumber: 'BW-5.2.1',
    orderIndex: 42,
    title: 'Bridal / Formal Beaded Jewelry Set',
    description: 'Create a complete matching jewelry set (necklace, bracelet, earrings) for bridal or formal occasions.',
    instructions: `1. Design a coordinated bridal/formal jewelry set with sketches
2. Select premium materials: Swarovski crystals, glass pearls, silver/gold seed beads
3. Create the necklace as the statement piece using advanced techniques
4. Create matching bracelet and earrings maintaining design consistency
5. Ensure comfort for all-day wear
6. Package the set in a presentation box with care instructions`,
    objectives: [
      'Design and produce a coordinated jewelry set',
      'Work with premium materials for formal wear',
      'Ensure comfort for extended wear',
      'Present products in retail-quality packaging',
    ],
    skills: ['Set design', 'Premium materials', 'Comfort engineering', 'Luxury packaging'],
    expectedOutcome: 'A complete bridal/formal jewelry set in presentation packaging.',
    passingCriteria: 'Set is coordinated, quality is premium, comfortable for all-day wear',
    referencePhotos: ['/curriculum/beadwork/bridal-set.jpg', '/curriculum/beadwork/jewelry-box.jpg'],
    estimatedHours: 40,
    difficulty: 'expert',
    category: 'jewelry',
    subcategory: 'bridal',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 5,
    moduleNumber: '5.2',
    assignmentNumber: 'BW-5.2.2',
    orderIndex: 43,
    title: 'Mixed Media Beadwork — Combining Materials',
    description: 'Create pieces that combine beadwork with leather, metal, fabric, and other craft materials for unique mixed-media designs.',
    instructions: `1. Study mixed-media beadwork examples and identify material combinations
2. Create a leather-and-bead cuff bracelet with inlaid beadwork
3. Create a metal-framed pendant with bead embroidery insert
4. Create a fabric bag with beaded panels and fabric body
5. Experiment with resin, polymer clay, or wood as beadwork substrates
6. Document which adhesives and techniques work for each material combination`,
    objectives: [
      'Combine beadwork with diverse materials',
      'Select appropriate adhesives and attachment methods',
      'Create durable mixed-media pieces',
      'Expand design vocabulary beyond pure beadwork',
    ],
    skills: ['Mixed media', 'Material combination', 'Adhesive knowledge', 'Cross-craft techniques'],
    expectedOutcome: 'Four mixed-media pieces demonstrating different material combinations.',
    passingCriteria: 'Combinations are secure and durable, designs are cohesive, craftsmanship is high',
    referencePhotos: ['/curriculum/beadwork/mixed-media.jpg', '/curriculum/beadwork/leather-bead.jpg'],
    estimatedHours: 24,
    difficulty: 'expert',
    category: 'jewelry',
    subcategory: 'mixed-media',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // Module 5.3: Quality Control & Repair
  {
    level: 5,
    moduleNumber: '5.3',
    assignmentNumber: 'BW-5.3.1',
    orderIndex: 44,
    title: 'Quality Control Standards & Inspection',
    description: 'Develop a professional quality control system for beaded products — inspection checklists, common defects, and grading.',
    instructions: `1. Study common beadwork defects: loose beads, visible thread, uneven tension, pattern errors
2. Create a QC inspection checklist for bags, jewelry, and accessories
3. Practice inspecting 5 different pieces (your own and classmates') using the checklist
4. Learn repair techniques for common defects
5. Develop a grading system: A-grade (retail), B-grade (discount), reject
6. Document QC standards in a reference guide`,
    objectives: [
      'Identify common beadwork defects',
      'Create and use professional QC checklists',
      'Grade finished products objectively',
      'Develop a documented QC standard',
    ],
    skills: ['Quality inspection', 'Defect identification', 'Grading systems', 'Standards documentation'],
    expectedOutcome: 'A comprehensive QC checklist, grading rubric, and 5 inspected pieces with written reports.',
    passingCriteria: 'Checklist is thorough, inspections are accurate, grading is consistent',
    referencePhotos: ['/curriculum/beadwork/qc-inspection.jpg', '/curriculum/beadwork/defect-examples.jpg'],
    estimatedHours: 10,
    difficulty: 'advanced',
    category: 'quality',
    subcategory: 'inspection',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 5,
    moduleNumber: '5.3',
    assignmentNumber: 'BW-5.3.2',
    orderIndex: 45,
    title: 'Beadwork Repair & Restoration',
    description: 'Learn to repair and restore damaged beaded items — replacing broken threads, missing beads, and restoring structure.',
    instructions: `1. Study common damage types: broken threads, missing beads, stretched/distorted panels, broken clasps
2. Practice re-threading a section of peyote stitch with replacement beads
3. Repair a RAW panel with a hole from broken thread
4. Replace a broken clasp on a beaded necklace
5. Restore structure to a distorted beaded bag panel
6. Document repair procedures for each damage type`,
    objectives: [
      'Diagnose beadwork damage accurately',
      'Repair broken threads without visible joins',
      'Replace missing beads with matching replacements',
      'Restore structural integrity to damaged pieces',
    ],
    skills: ['Damage diagnosis', 'Thread repair', 'Bead replacement', 'Structural restoration'],
    expectedOutcome: 'Four completed repairs on different damage types with before/after documentation.',
    passingCriteria: 'Repairs are invisible or nearly invisible, structural integrity is restored',
    referencePhotos: ['/curriculum/beadwork/repair-before.jpg', '/curriculum/beadwork/repair-after.jpg'],
    estimatedHours: 12,
    difficulty: 'advanced',
    category: 'quality',
    subcategory: 'repair',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // Module 5.4: Production Efficiency
  {
    level: 5,
    moduleNumber: '5.4',
    assignmentNumber: 'BW-5.4.1',
    orderIndex: 46,
    title: 'Batch Production Techniques',
    description: 'Learn efficient batch production methods for creating multiple identical beaded items for retail.',
    instructions: `1. Select a design suitable for batch production (earrings, keychains, or bracelets)
2. Create a production plan: materials list, step sequence, time estimates
3. Prepare all materials in advance: pre-cut thread, sorted beads, organized findings
4. Produce a batch of 10 identical items using assembly-line technique
5. Time yourself and calculate production rate and cost per item
6. QC inspect all 10 items for consistency`,
    objectives: [
      'Plan efficient batch production workflows',
      'Prepare materials for production runs',
      'Maintain consistency across identical items',
      'Calculate production time and cost per unit',
    ],
    skills: ['Batch production', 'Production planning', 'Consistency', 'Cost calculation'],
    expectedOutcome: 'Ten identical beaded items with production time/cost analysis and QC report.',
    passingCriteria: 'All 10 items pass QC, production time improves over the batch, cost analysis is complete',
    referencePhotos: ['/curriculum/beadwork/batch-production.jpg', '/curriculum/beadwork/production-line.jpg'],
    estimatedHours: 16,
    difficulty: 'advanced',
    category: 'production',
    subcategory: 'batch',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // ============================================================================
  // LEVEL 6: BUSINESS & DIGITAL (Months 16-18)
  // ============================================================================

  // Module 6.1: Product Photography
  {
    level: 6,
    moduleNumber: '6.1',
    assignmentNumber: 'BW-6.1.1',
    orderIndex: 47,
    title: 'Product Photography for Beadwork',
    description: 'Learn to photograph beaded products professionally for e-commerce, social media, and portfolio use.',
    instructions: `1. Set up a product photography station with proper lighting (natural or lightbox)
2. Learn camera/phone settings for macro and product shots
3. Practice white-background product photography for e-commerce
4. Practice lifestyle/styled photography for social media
5. Learn basic photo editing: color correction, background removal, cropping
6. Create a product photography guide for consistent results`,
    objectives: [
      'Set up and use a product photography station',
      'Capture detail shots of beadwork at macro level',
      'Create both white-background and styled product photos',
      'Edit photos for web-ready output',
    ],
    skills: ['Product photography', 'Lighting setup', 'Photo editing', 'Image consistency'],
    expectedOutcome: 'A portfolio of product photos: 5 white-background and 5 styled shots of your beadwork.',
    passingCriteria: 'Photos are well-lit, sharp, color-accurate, and suitable for e-commerce',
    referencePhotos: ['/curriculum/beadwork/product-photo-setup.jpg', '/curriculum/beadwork/styled-photo.jpg'],
    estimatedHours: 10,
    difficulty: 'intermediate',
    category: 'business',
    subcategory: 'photography',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 6,
    moduleNumber: '6.1',
    assignmentNumber: 'BW-6.1.2',
    orderIndex: 48,
    title: 'Video Content Creation — Process & Tutorials',
    description: 'Create video content showcasing your beading process for social media marketing and customer engagement.',
    instructions: `1. Study popular beadwork content on Instagram Reels, TikTok, and YouTube
2. Set up video recording station with stable phone/camera mount
3. Create a 30-60 second time-lapse of a beading process
4. Create a short tutorial video teaching a basic technique
5. Learn basic video editing: trimming, text overlays, music
6. Post content to at least one social media platform`,
    objectives: [
      'Record clean, well-lit process videos',
      'Edit videos for social media formats',
      'Create engaging educational content',
      'Understand social media best practices for craft content',
    ],
    skills: ['Video recording', 'Video editing', 'Social media content', 'Tutorial creation'],
    expectedOutcome: 'One time-lapse video and one tutorial video, edited and posted to social media.',
    passingCriteria: 'Videos are well-lit, stable, and engaging with appropriate length for platform',
    referencePhotos: ['/curriculum/beadwork/video-setup.jpg', '/curriculum/beadwork/social-media.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'business',
    subcategory: 'video-content',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // Module 6.2: Pricing & Business Fundamentals
  {
    level: 6,
    moduleNumber: '6.2',
    assignmentNumber: 'BW-6.2.1',
    orderIndex: 49,
    title: 'Materials Costing & Product Pricing',
    description: 'Learn to accurately calculate material costs and set profitable prices for beaded products.',
    instructions: `1. Create a comprehensive materials cost spreadsheet (beads, thread, findings, packaging per item)
2. Track your time on 3 different projects — calculate hourly rate
3. Learn pricing formulas: Materials + Labor + Overhead + Profit Margin
4. Research market prices for comparable beaded products
5. Set wholesale and retail prices for 10 of your products
6. Create a price list ready for customers and stockists`,
    objectives: [
      'Calculate accurate material costs per product',
      'Track and value labor time fairly',
      'Apply pricing formulas for profitability',
      'Set competitive yet profitable prices',
    ],
    skills: ['Cost calculation', 'Pricing strategy', 'Market research', 'Spreadsheet management'],
    expectedOutcome: 'A materials cost spreadsheet, time tracking for 3 projects, and a 10-product price list.',
    passingCriteria: 'Costs are accurate, pricing covers expenses plus profit, prices are market-competitive',
    referencePhotos: ['/curriculum/beadwork/pricing-spreadsheet.jpg', '/curriculum/beadwork/price-list.jpg'],
    estimatedHours: 8,
    difficulty: 'intermediate',
    category: 'business',
    subcategory: 'pricing',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 6,
    moduleNumber: '6.2',
    assignmentNumber: 'BW-6.2.2',
    orderIndex: 50,
    title: 'Custom Order Management',
    description: 'Learn to manage custom beadwork orders from client consultation through delivery.',
    instructions: `1. Create a custom order form capturing: design preferences, colors, size, deadline, budget
2. Develop a consultation process: mood boards, bead samples, design sketches for client approval
3. Create a production timeline template for custom orders
4. Practice taking a mock custom order through the full process
5. Learn deposit and payment milestone structures
6. Create a client communication template set (confirmation, progress updates, completion)`,
    objectives: [
      'Conduct professional client consultations',
      'Manage custom orders from inquiry to delivery',
      'Set realistic timelines and communicate clearly',
      'Handle deposits and payment milestones',
    ],
    skills: ['Client management', 'Order processing', 'Timeline planning', 'Communication'],
    expectedOutcome: 'Complete custom order management system: forms, templates, timeline, and payment structure.',
    passingCriteria: 'System is comprehensive, professional, and handles the full order lifecycle',
    referencePhotos: ['/curriculum/beadwork/order-form.jpg', '/curriculum/beadwork/mood-board.jpg'],
    estimatedHours: 8,
    difficulty: 'intermediate',
    category: 'business',
    subcategory: 'order-management',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // Module 6.3: E-Commerce & Online Sales
  {
    level: 6,
    moduleNumber: '6.3',
    assignmentNumber: 'BW-6.3.1',
    orderIndex: 51,
    title: 'Online Store Setup & Product Listings',
    description: 'Set up an online presence for selling beaded products — create product listings with professional descriptions and photos.',
    instructions: `1. Study e-commerce platforms for handmade goods (Etsy, Shopify, Instagram Shop)
2. Set up a shop on at least one platform
3. Create product listings for 10 items with professional photos, descriptions, and pricing
4. Write compelling product descriptions that highlight craftsmanship and materials
5. Set up shipping profiles, return policies, and shop policies
6. Optimize listings with relevant keywords and tags`,
    objectives: [
      'Set up and configure an online shop',
      'Create compelling product listings',
      'Write SEO-optimized descriptions',
      'Establish professional shop policies',
    ],
    skills: ['E-commerce setup', 'Product listing', 'Copywriting', 'SEO basics'],
    expectedOutcome: 'A live online shop with 10 product listings, photos, and complete shop policies.',
    passingCriteria: 'Shop is professional, listings are complete with quality photos and descriptions',
    referencePhotos: ['/curriculum/beadwork/online-shop.jpg', '/curriculum/beadwork/product-listing.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'business',
    subcategory: 'e-commerce',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 6,
    moduleNumber: '6.3',
    assignmentNumber: 'BW-6.3.2',
    orderIndex: 52,
    title: 'Social Media Marketing for Beadwork',
    description: 'Develop and execute a social media marketing strategy to attract customers and build a following for your beadwork brand.',
    instructions: `1. Define your brand identity: name, aesthetic, target customer, voice
2. Set up professional profiles on Instagram and one additional platform
3. Create a content calendar with 2 weeks of planned posts
4. Create content: product photos, process videos, behind-the-scenes, customer testimonials
5. Learn hashtag strategy and community engagement techniques
6. Execute your content plan for 2 weeks and analyze engagement`,
    objectives: [
      'Define a brand identity for your beadwork business',
      'Create consistent, engaging social media content',
      'Use hashtags and engagement strategies effectively',
      'Analyze content performance and adjust strategy',
    ],
    skills: ['Brand identity', 'Content creation', 'Social media strategy', 'Analytics'],
    expectedOutcome: 'Professional social media profiles with 2 weeks of executed content and engagement analysis.',
    passingCriteria: 'Brand is clear and consistent, content is high-quality, engagement is measured',
    referencePhotos: ['/curriculum/beadwork/brand-identity.jpg', '/curriculum/beadwork/content-calendar.jpg'],
    estimatedHours: 14,
    difficulty: 'intermediate',
    category: 'business',
    subcategory: 'marketing',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // Module 6.4: Portfolio & Professional Development
  {
    level: 6,
    moduleNumber: '6.4',
    assignmentNumber: 'BW-6.4.1',
    orderIndex: 53,
    title: 'Professional Portfolio Development',
    description: 'Compile a professional portfolio showcasing your best beadwork, documenting your skills and design range.',
    instructions: `1. Select your 15-20 best pieces across all categories (bags, jewelry, accessories)
2. Photograph each piece professionally with multiple angles
3. Write descriptions for each piece: materials, techniques, inspiration
4. Organize portfolio by category or chronologically showing progression
5. Create both digital (PDF) and physical portfolio versions
6. Include your artist statement, bio, and contact information`,
    objectives: [
      'Curate a professional portfolio of best work',
      'Photograph and document pieces comprehensively',
      'Create polished digital and physical presentations',
      'Write an artist statement reflecting your design philosophy',
    ],
    skills: ['Portfolio curation', 'Documentation', 'Artist statement writing', 'Professional presentation'],
    expectedOutcome: 'A digital PDF portfolio and physical portfolio with 15-20 documented pieces.',
    passingCriteria: 'Portfolio is professional, photography is excellent, descriptions are well-written',
    referencePhotos: ['/curriculum/beadwork/portfolio-spread.jpg', '/curriculum/beadwork/artist-statement.jpg'],
    estimatedHours: 16,
    difficulty: 'intermediate',
    category: 'business',
    subcategory: 'portfolio',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
  {
    level: 6,
    moduleNumber: '6.4',
    assignmentNumber: 'BW-6.4.2',
    orderIndex: 54,
    title: 'Craft Fair & Market Preparation',
    description: 'Learn to prepare for and sell at craft fairs, markets, and pop-up events.',
    instructions: `1. Research local craft fairs and markets — application process, fees, requirements
2. Design your booth layout: display stands, signage, tablecloths, lighting
3. Create branded packaging: boxes, bags, business cards, care instruction cards
4. Prepare inventory and pricing display
5. Practice your sales pitch and customer interaction skills
6. Participate in one craft fair or market event (or simulate one)`,
    objectives: [
      'Prepare a professional market booth setup',
      'Create branded packaging and marketing materials',
      'Build inventory for market selling',
      'Develop in-person sales skills',
    ],
    skills: ['Market preparation', 'Booth design', 'Branded packaging', 'Sales skills'],
    expectedOutcome: 'Complete market kit: booth design plan, branded packaging, inventory list, and sales experience.',
    passingCriteria: 'Booth presentation is professional, packaging is branded, sales skills are demonstrated',
    referencePhotos: ['/curriculum/beadwork/craft-fair-booth.jpg', '/curriculum/beadwork/branded-packaging.jpg'],
    estimatedHours: 14,
    difficulty: 'intermediate',
    category: 'business',
    subcategory: 'markets',
    serviceTrack: 'beadwork' as ServiceTrack,
  },

  // Module 6.5: Final Capstone Project
  {
    level: 6,
    moduleNumber: '6.5',
    assignmentNumber: 'BW-6.5.1',
    orderIndex: 55,
    title: 'FINAL PROJECT: Complete Beaded Bag from Concept to Market',
    description: 'Execute a complete beaded bag project from initial concept through to market-ready product with full business documentation.',
    instructions: `1. Conceptualize an original beaded bag design with mood board and sketches
2. Create a detailed pattern and materials sourcing plan
3. Produce the bag to the highest quality standard using advanced techniques
4. Line the bag, install hardware, and add all professional finishing
5. Photograph the finished bag for e-commerce and social media
6. Create a complete product listing with pricing, description, and marketing content
7. Present the finished project to mentors and peers with a design defense
8. Demonstrate the full journey from concept to market-ready product`,
    objectives: [
      'Execute the complete product development lifecycle',
      'Demonstrate mastery of advanced beading techniques',
      'Produce retail-quality professional finishing',
      'Create market-ready business documentation',
    ],
    skills: ['Complete product lifecycle', 'Advanced technique mastery', 'Professional finishing', 'Business readiness'],
    expectedOutcome: 'A market-ready beaded bag with complete business documentation, photography, and product listing.',
    passingCriteria: 'Bag is retail-quality, documentation is complete, presentation demonstrates mastery of all skills learned',
    referencePhotos: ['/curriculum/beadwork/final-project.jpg', '/curriculum/beadwork/capstone-presentation.jpg'],
    estimatedHours: 60,
    difficulty: 'expert',
    category: 'capstone',
    subcategory: 'final-project',
    serviceTrack: 'beadwork' as ServiceTrack,
  },
]

export async function seedBeadworkCurriculum() {
  console.log('Seeding beadwork curriculum...')

  for (const assignment of beadworkCurriculum) {
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

  console.log(`\nSeeded ${beadworkCurriculum.length} beadwork assignment templates`)
}

// Run if called directly
if (require.main === module) {
  seedBeadworkCurriculum()
    .then(() => prisma.$disconnect())
    .catch((e) => {
      console.error(e)
      prisma.$disconnect()
      process.exit(1)
    })
}

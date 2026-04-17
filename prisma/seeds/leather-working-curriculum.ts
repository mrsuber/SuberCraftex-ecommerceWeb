import { PrismaClient, ServiceTrack } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Leather Working Curriculum Seed
 *
 * Complete leather craftsmanship journey from raw hide to finished products
 * 6 levels, 70 assignments total
 *
 * Level 1: Foundations - Tools, Materials, Basic Techniques (12 assignments)
 * Level 2: Hand Stitching & Small Goods (12 assignments)
 * Level 3: Bags & Complex Projects (12 assignments)
 * Level 4: Shoe Making Fundamentals (12 assignments)
 * Level 5: Advanced Footwear & Furniture (12 assignments)
 * Level 6: Business & Production (10 assignments)
 *
 * Total: 70 assignments covering raw hide tanning to running a leather business
 */

export async function seedLeatherWorkingCurriculum() {
  console.log('🧰 Seeding Leather Working Curriculum...')

  const assignments = [
    // ========================================================================
    // LEVEL 1: FOUNDATIONS - Tools, Materials, Basic Techniques
    // ========================================================================
    {
      level: 1,
      moduleNumber: '1.1',
      assignmentNumber: 'LW-1.1.1',
      orderIndex: 1,
      title: 'Leather Shop Safety & Workshop Setup',
      description: 'Learn essential safety practices for leather working and set up a functional leather workshop with proper ventilation, lighting, and tool organization.',
      instructions: `1. Study leather shop hazards: sharp tools, chemical fumes, dust, repetitive strain
2. Learn proper ventilation requirements: fume extraction for dyes, dust collection
3. Set up lighting: bright task lighting at work surface, no shadows on cutting area
4. Organize cutting station: self-healing mat, ruler storage, blade disposal container
5. Create stitching station: stitching pony, thread storage, needle organization
6. Set up finishing area: separate from cutting to avoid contamination
7. Install tool wall or pegboard: outline each tool for quick return
8. Prepare chemical storage: ventilated cabinet for dyes, finishes, cleaners
9. Create material storage: flat storage for hides, rolled storage for smaller pieces
10. Complete safety checklist and photograph your organized workspace`,
      objectives: [
        'Identify all safety hazards in leather working',
        'Set up proper ventilation for chemicals',
        'Organize tools for efficient workflow',
        'Create dedicated work zones',
        'Establish safe chemical storage',
        'Develop good shop-keeping habits',
      ],
      skills: ['Workshop safety', 'Space organization', 'Ventilation setup', 'Tool storage', 'Hazard identification', 'Ergonomics'],
      expectedOutcome: 'Fully organized leather workshop with proper safety equipment, ventilation, lighting, and tool storage. Safety checklist completed.',
      passingCriteria: 'Workshop has adequate ventilation, all tools have designated storage, lighting is sufficient, chemicals are safely stored, cutting and finishing areas are separate',
      referencePhotos: ['/curriculum/leather/workshop-layout.jpg', '/curriculum/leather/tool-organization.jpg', '/curriculum/leather/safety-equipment.jpg'],
      estimatedHours: 8,
      difficulty: 'beginner',
      category: 'setup',
      subcategory: 'safety',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"The Leather Working Handbook" by Valerie Michael - Chapter 1: Safety',
        '"Leathercraft Tools" by Al Stohlman',
        'OSHA guidelines for craft workshops',
      ],
    },
    {
      level: 1,
      moduleNumber: '1.1',
      assignmentNumber: 'LW-1.1.2',
      orderIndex: 2,
      title: 'Essential Leather Working Tools',
      description: 'Learn to identify, use, and maintain essential leather working tools including cutting knives, edge bevelers, stitching tools, and punches.',
      instructions: `1. Study cutting tools: swivel knife, round knife, utility knife, skiving knife
2. Learn edge tools: edge beveler (#1-5), slicker, burnisher, sandpaper
3. Identify stitching tools: diamond chisel set, pricking iron, stitching awl, harness needle
4. Study punches: rotary punch, drive punch set, oblong punch, slot punch
5. Learn marking tools: wing divider, scratch compass, ruler, templates
6. Practice knife sharpening: strop, compound, proper angle, leather test
7. Use edge beveler on scrap: consistent angle, smooth pass, no gouges
8. Practice punch technique: proper backing board, straight strikes, clean holes
9. Test chisel vs pricking iron: understand difference, when to use each
10. Create tool identification board with photos and uses for each tool`,
      objectives: [
        'Identify all essential leather working tools',
        'Understand the purpose of each tool',
        'Sharpen cutting knives properly',
        'Use edge bevelers without gouging',
        'Punch clean holes with proper technique',
        'Differentiate between similar tools',
      ],
      skills: ['Tool identification', 'Knife sharpening', 'Edge beveling', 'Hole punching', 'Tool maintenance', 'Proper technique'],
      expectedOutcome: 'Tool identification board showing all essential tools with descriptions. Sample pieces demonstrating proper use of each tool category.',
      passingCriteria: 'All tools correctly identified, knives are properly sharpened, edge beveling is smooth and consistent, punched holes are clean and round',
      referencePhotos: ['/curriculum/leather/essential-tools.jpg', '/curriculum/leather/knife-sharpening.jpg', '/curriculum/leather/edge-beveling.jpg'],
      estimatedHours: 10,
      difficulty: 'beginner',
      category: 'fundamentals',
      subcategory: 'tools',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"The Art of Hand Sewing Leather" by Al Stohlman - Tool Section',
        '"Leather Tools Guide" - Tandy Leather',
        'YouTube: "Knife Sharpening for Leather Work" by Nigel Armitage',
      ],
    },
    {
      level: 1,
      moduleNumber: '1.2',
      assignmentNumber: 'LW-1.2.1',
      orderIndex: 3,
      title: 'Leather Types & Properties',
      description: 'Study different types of leather including vegetable-tanned, chrome-tanned, suede, nubuck, and exotic leathers. Learn properties, uses, and selection criteria.',
      instructions: `1. Study vegetable-tanned leather: tooling leather, natural color, takes dye well
2. Learn chrome-tanned leather: soft, flexible, pre-colored, garment leather
3. Examine suede and nubuck: napped surface, care requirements, uses
4. Study leather weights: measured in ounces, 1 oz = 1/64", selection by project
5. Learn leather grades: full-grain, top-grain, genuine, bonded
6. Examine leather hand: stiffness, drape, temper (soft/medium/firm)
7. Study exotic leathers: alligator, ostrich, python, usage and regulations
8. Create sample board: 2"×2" squares of 10+ leather types with labels
9. Test each leather: burnishing, dyeing, tooling, wet-forming capability
10. Write leather selection guide for common projects (wallet, bag, belt, shoe)`,
      objectives: [
        'Differentiate between leather tanning methods',
        'Understand leather weight and thickness',
        'Identify leather grades and quality',
        'Select appropriate leather for each project type',
        'Test leather properties',
        'Recognize exotic leathers',
      ],
      skills: ['Leather identification', 'Material selection', 'Quality assessment', 'Tanning knowledge', 'Grain recognition', 'Project planning'],
      expectedOutcome: 'Sample board with 10+ leather types, each tested and labeled. Written guide matching leather types to common projects.',
      passingCriteria: 'All leather types correctly identified, sample board is well-organized, testing results are documented, selection guide is practical and accurate',
      referencePhotos: ['/curriculum/leather/leather-types.jpg', '/curriculum/leather/leather-grain.jpg', '/curriculum/leather/sample-board.jpg'],
      estimatedHours: 8,
      difficulty: 'beginner',
      category: 'materials',
      subcategory: 'leather',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"Leather: Preparation to Tanning" by K.T. Sastry',
        '"The Leather Crafters & Saddlers Journal" - Leather Basics series',
        'Leather types guide - Weaver Leather Supply',
      ],
    },
    {
      level: 1,
      moduleNumber: '1.2',
      assignmentNumber: 'LW-1.2.2',
      orderIndex: 4,
      title: 'Raw Hide to Leather: Tanning Basics',
      description: 'Understand the process of converting raw animal hide into usable leather through vegetable tanning, chrome tanning, and brain tanning methods.',
      instructions: `1. Study hide preparation: fleshing, dehairing, cleaning, trimming
2. Learn vegetable tanning: tannic acid from tree bark, slow process, natural result
3. Understand chrome tanning: chromium salts, fast process, soft leather
4. Study brain tanning: traditional method, brains contain oils, labor intensive
5. Learn commercial tanning process: soaking, liming, bating, tanning, dyeing, finishing
6. Examine tanning time: veg-tan takes weeks, chrome-tan takes days
7. Study environmental impact: chrome tanning chemicals vs veg-tan waste
8. Visit a local tannery or watch documentary: observe commercial process
9. Try simple veg-tan experiment: small hide piece, oak bark tea, week-long soak
10. Document the process with photos and notes, compare before/after hide properties`,
      objectives: [
        'Understand hide-to-leather conversion process',
        'Compare different tanning methods',
        'Learn commercial tanning workflow',
        'Appreciate labor involved in leather production',
        'Perform simple vegetable tanning',
        'Evaluate environmental considerations',
      ],
      skills: ['Tanning knowledge', 'Hide preparation', 'Chemical understanding', 'Process documentation', 'Traditional methods', 'Quality evaluation'],
      expectedOutcome: 'Photo-documented simple vegetable tanning experiment with before/after hide samples. Written comparison of tanning methods.',
      passingCriteria: 'Hide preparation steps are understood, tanning methods are correctly explained, experiment is well-documented, leather is properly tanned',
      referencePhotos: ['/curriculum/leather/hide-preparation.jpg', '/curriculum/leather/tanning-process.jpg', '/curriculum/leather/veg-tan-experiment.jpg'],
      estimatedHours: 12,
      difficulty: 'beginner',
      category: 'materials',
      subcategory: 'tanning',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"Brain Tan Buckskin" by Matt Richards',
        '"The Art of Tanning Leather" by Lotta Rahme',
        'YouTube: "How Leather is Made" - Discovery Channel',
        'Traditional tanning methods - historical documentation',
      ],
    },
    {
      level: 1,
      moduleNumber: '1.3',
      assignmentNumber: 'LW-1.3.1',
      orderIndex: 5,
      title: 'Basic Cutting Techniques',
      description: 'Master fundamental leather cutting skills using round knife, utility knife, and rotary cutter. Learn straight cuts, curves, and pattern cutting.',
      instructions: `1. Study cutting mat usage: self-healing surface, grid lines, rotation
2. Learn proper knife grip: round knife held like apple peeler, utility knife like pencil
3. Practice straight cuts: metal ruler guide, single smooth pass, no sawing motion
4. Learn curve cutting: rotate leather not knife, smooth flowing motion, inside hand guides
5. Practice circle cutting: compass cutter or circle template, consistent pressure
6. Study pattern layout: minimize waste, grain direction, matching pieces
7. Learn skiving: thinning leather edges, gradual taper, consistent angle
8. Practice corner cutting: sharp corners vs rounded, clean meeting lines
9. Cut complex shapes: use paper pattern first, transfer to leather, cut accurately
10. Create sample board: various cuts demonstrating each technique with clean edges`,
      objectives: [
        'Hold and control cutting knives safely',
        'Cut straight lines without ruler slipping',
        'Cut smooth curves without choppy edges',
        'Layout patterns to minimize waste',
        'Skive edges to consistent thickness',
        'Cut complex shapes accurately',
      ],
      skills: ['Knife control', 'Straight cutting', 'Curve cutting', 'Pattern layout', 'Skiving technique', 'Material efficiency'],
      expectedOutcome: 'Sample board showing straight cuts, curves, circles, corners, and complex shapes with clean edges. Skived samples showing gradual taper.',
      passingCriteria: 'All cuts are smooth with no ragged edges, curves flow naturally, corners are crisp, skiving is gradual and even, no knife slips',
      referencePhotos: ['/curriculum/leather/cutting-technique.jpg', '/curriculum/leather/curve-cutting.jpg', '/curriculum/leather/skiving.jpg'],
      estimatedHours: 10,
      difficulty: 'beginner',
      category: 'fundamentals',
      subcategory: 'cutting',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"Leatherwork Manual" by Al Stohlman - Cutting section',
        '"The Leather Crafters Guide" - cutting techniques chapter',
        'YouTube: "Leather Cutting Basics" by Weaver Leather',
      ],
    },
    {
      level: 1,
      moduleNumber: '1.3',
      assignmentNumber: 'LW-1.3.2',
      orderIndex: 6,
      title: 'Edge Finishing Fundamentals',
      description: 'Learn to finish leather edges to a professional standard using beveling, sanding, burnishing, and edge paint techniques.',
      instructions: `1. Study why edge finishing matters: prevents fraying, professional appearance, durability
2. Learn edge beveling: #1-5 beveler sizes, 45-degree angle, consistent pressure
3. Practice sanding edges: 220 grit to 600 grit progression, rounded profile
4. Learn burnishing: wood slicker, canvas, water or gum tragacanth, friction heat
5. Study edge paint/dye: application methods, build up layers, seal edge
6. Practice on scrap pieces: bevel, sand, burnish to glass-smooth finish
7. Compare edge finishes: burnished vs painted vs raw, durability test
8. Learn edge types: single layer, folded edge, flesh edge, lined edge
9. Master edge consistency: same finish quality around entire project perimeter
10. Create edge finish sample board: 5+ techniques with labeled process and results`,
      objectives: [
        'Bevel edges without gouging leather',
        'Sand edges to smooth rounded profile',
        'Burnish edges to glass-smooth finish',
        'Apply edge paint evenly',
        'Select appropriate edge finish for project',
        'Maintain consistent finish quality',
      ],
      skills: ['Edge beveling', 'Progressive sanding', 'Burnishing technique', 'Edge painting', 'Finish consistency', 'Quality control'],
      expectedOutcome: 'Sample board demonstrating 5+ edge finishing techniques with mirror-smooth burnished edges and evenly painted edges.',
      passingCriteria: 'Beveling is consistent around perimeter, sanding removes roughness, burnished edges are glass-smooth, edge paint has no drips or gaps',
      referencePhotos: ['/curriculum/leather/edge-beveling.jpg', '/curriculum/leather/burnishing.jpg', '/curriculum/leather/edge-finishes.jpg'],
      estimatedHours: 8,
      difficulty: 'beginner',
      category: 'fundamentals',
      subcategory: 'finishing',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"The Art of Hand Sewing Leather" by Al Stohlman - Edge finishing',
        'Burnishing techniques - Nigel Armitage tutorials',
        'Edge paint application guide - Uniters or Feibings',
      ],
    },
    {
      level: 1,
      moduleNumber: '1.4',
      assignmentNumber: 'LW-1.4.1',
      orderIndex: 7,
      title: 'Hand Stitching Basics: Saddle Stitch',
      description: 'Master the saddle stitch, the fundamental hand-stitching technique in leather craft, including thread preparation, hole marking, and consistent stitching.',
      instructions: `1. Study saddle stitch: two needles, one thread, crosses in each hole, strongest stitch
2. Learn thread selection: waxed linen, polyester, nylon, thickness by project
3. Practice thread preparation: cut 4× length of seam, wax thread, attach needles
4. Learn stitching line marking: wing divider or ruler, consistent distance from edge
5. Practice hole punching: pricking iron or diamond chisel, consistent spacing, straight line
6. Master the saddle stitch: needle through from both sides, cross in middle, pull tight
7. Learn to maintain tension: each stitch same tightness, no loose or over-tight spots
8. Practice backstitching: secure start and end, no unraveling
9. Complete practice seams: straight, curved, corner, consistent stitch length
10. Create sample booklet: multiple seam types, labeled with thread type and stitch count`,
      objectives: [
        'Prepare thread correctly for hand stitching',
        'Mark consistent stitch lines',
        'Punch evenly-spaced holes',
        'Execute saddle stitch properly',
        'Maintain consistent tension throughout',
        'Secure stitching at start and end',
      ],
      skills: ['Saddle stitch technique', 'Thread preparation', 'Hole spacing', 'Stitch tension', 'Seam consistency', 'Hand-eye coordination'],
      expectedOutcome: 'Sample booklet with straight, curved, and corner seams demonstrating consistent saddle stitch with even spacing and tension.',
      passingCriteria: 'All stitches are evenly spaced, tension is consistent, no skipped holes, backstitching is secure, stitching follows marked line',
      referencePhotos: ['/curriculum/leather/saddle-stitch.jpg', '/curriculum/leather/thread-preparation.jpg', '/curriculum/leather/stitch-samples.jpg'],
      estimatedHours: 12,
      difficulty: 'beginner',
      category: 'fundamentals',
      subcategory: 'stitching',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"The Art of Hand Sewing Leather" by Al Stohlman',
        '"Hand Stitching Leather" - Tandy Leather guide',
        'YouTube: "Perfect Saddle Stitch" by Corter Leather',
      ],
    },
    {
      level: 1,
      moduleNumber: '1.4',
      assignmentNumber: 'LW-1.4.2',
      orderIndex: 8,
      title: 'Leather Dyeing & Color Application',
      description: 'Learn to apply dyes and stains to vegetable-tanned leather, including surface preparation, even application, and color blending.',
      instructions: `1. Study dye types: spirit-based, water-based, oil-based, gel antique
2. Learn surface preparation: clean leather, deglaze if needed, slightly damp for even absorption
3. Practice dye application methods: wool dauber, sponge, airbrush, rag
4. Learn to achieve even coverage: work quickly, overlap strokes, multiple light coats
5. Study color mixing: primary colors, achieving custom shades, test on scrap
6. Practice edge dyeing: small brush, steady hand, no overflow onto surface
7. Learn antiquing: apply dark gel, wipe highlights, enhance tooling depth
8. Master color gradients: fade from dark to light, blend colors, no harsh lines
9. Study sealers: resolene, leather sheen, tan kote, when to apply
10. Create color sample chart: 15+ colors/techniques with application method notes`,
      objectives: [
        'Prepare leather surface for dye',
        'Apply dye evenly without streaks',
        'Mix custom colors accurately',
        'Dye edges without overflow',
        'Create color gradients and blends',
        'Select and apply appropriate sealer',
      ],
      skills: ['Dye application', 'Color mixing', 'Even coverage', 'Edge dyeing', 'Antiquing technique', 'Surface preparation'],
      expectedOutcome: 'Color sample chart with 15+ colors showing even application, gradients, antiquing, and edge dyeing. All samples sealed.',
      passingCriteria: 'Dye coverage is streak-free, edges are cleanly dyed, gradients blend smoothly, colors match intended shade, sealer is evenly applied',
      referencePhotos: ['/curriculum/leather/dye-application.jpg', '/curriculum/leather/color-samples.jpg', '/curriculum/leather/antiquing.jpg'],
      estimatedHours: 10,
      difficulty: 'beginner',
      category: 'fundamentals',
      subcategory: 'finishing',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"Leather Coloring" by Al Stohlman',
        'Fiebing\'s dye application guides',
        'YouTube: "Leather Dyeing Tips" by Weaver Leather',
      ],
    },
    {
      level: 1,
      moduleNumber: '1.5',
      assignmentNumber: 'LW-1.5.1',
      orderIndex: 9,
      title: 'Simple Leather Bookmark',
      description: 'Create your first complete leather project: a bookmark incorporating cutting, edge finishing, hole punching, and optional dyeing.',
      instructions: `1. Design bookmark: 2" × 6" rectangle with decorative top (pointed, rounded, or notched)
2. Create paper pattern: finalize design, verify dimensions
3. Cut leather: trace pattern, cut smoothly, clean edges
4. Bevel all edges: consistent #2 beveler around perimeter
5. Sand edges: 220 to 400 grit, smooth rounded profile
6. Optional: dye leather: even application, let dry completely
7. Burnish edges: slicker with water, friction until glass-smooth
8. Punch decorative hole at top: 1/4" hole centered, 1/2" from top
9. Optional: add tassel through hole (leather lace or cord)
10. Apply leather finish: resolene or leather balm, buff to shine`,
      objectives: [
        'Complete first project start to finish',
        'Apply cutting skills to real project',
        'Finish edges to professional standard',
        'Execute optional dyeing cleanly',
        'Create functional finished product',
        'Experience full workflow',
      ],
      skills: ['Pattern making', 'Precise cutting', 'Edge finishing workflow', 'Dye application', 'Hardware installation', 'Final finishing'],
      expectedOutcome: 'Completed leather bookmark with clean cut edges, professional edge finish, optional even dye job, and smooth sealed surface.',
      passingCriteria: 'Bookmark is precisely cut, all edges are beveled and burnished smooth, dye is even if applied, no rough spots, functional and attractive',
      referencePhotos: ['/curriculum/leather/bookmark-pattern.jpg', '/curriculum/leather/bookmark-progress.jpg', '/curriculum/leather/completed-bookmark.jpg'],
      estimatedHours: 3,
      difficulty: 'beginner',
      category: 'projects',
      subcategory: 'small_goods',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"Easy Leatherwork" by Al Stohlman - Bookmark project',
        'Beginner project tutorials - Tandy Leather',
      ],
    },
    {
      level: 1,
      moduleNumber: '1.5',
      assignmentNumber: 'LW-1.5.2',
      orderIndex: 10,
      title: 'Leather Keychain with Hardware',
      description: 'Create a simple keychain using leather, rivets, and key ring hardware. Learn to install rivets and work with metal findings.',
      instructions: `1. Design keychain: 1" × 4" strap or decorative shape with hardware attachment
2. Cut two pieces of leather: will be layered for strength
3. Mark rivet placement: functional and decorative, symmetric spacing
4. Punch rivet holes: correct size for rivet shaft, clean round holes
5. Learn rivet types: double-cap, rapid rivet, Chicago screw, when to use each
6. Install rivets: setter and anvil, straight setting, mushroomed back
7. Punch key ring hole: 1/4" or 3/8", reinforced with rivet if needed
8. Finish all edges: bevel, sand, burnish to smooth
9. Optional: dye, stamp, or personalize leather
10. Attach key ring hardware and test durability`,
      objectives: [
        'Work with layered leather pieces',
        'Mark and punch holes accurately',
        'Install rivets properly',
        'Attach hardware securely',
        'Create durable functional item',
        'Understand hardware selection',
      ],
      skills: ['Rivet installation', 'Hardware attachment', 'Hole punching', 'Layered construction', 'Durability testing', 'Finishing'],
      expectedOutcome: 'Completed leather keychain with properly installed rivets, attached key ring hardware, finished edges, durable construction.',
      passingCriteria: 'Rivets are straight and secure, key ring is firmly attached, edges are finished, no sharp spots, keychain withstands pull test',
      referencePhotos: ['/curriculum/leather/keychain-pattern.jpg', '/curriculum/leather/rivet-installation.jpg', '/curriculum/leather/completed-keychain.jpg'],
      estimatedHours: 4,
      difficulty: 'beginner',
      category: 'projects',
      subcategory: 'small_goods',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"Riveting Guide" - Ohio Travel Bag',
        'Hardware installation tutorials - Tandy Leather',
        'YouTube: "Setting Leather Rivets" by Weaver Leather',
      ],
    },
    {
      level: 1,
      moduleNumber: '1.6',
      assignmentNumber: 'LW-1.6.1',
      orderIndex: 11,
      title: 'Simple Coin Pouch',
      description: 'Create a folded coin pouch with snap closure, applying cutting, folding, stitching, and snap installation skills.',
      instructions: `1. Design pouch: 3" × 6" rectangle that folds into 3" × 3" pouch
2. Create pattern: mark fold lines, snap placement, stitch lines
3. Cut leather: single piece, clean edges, precise dimensions
4. Skive fold areas: thin leather at fold lines for clean folding
5. Mark and install bottom snap: male half on flap, female on body
6. Fold pouch and mark stitch lines: 1/4" from edges on both sides
7. Punch stitching holes: diamond chisel, consistent spacing
8. Saddle stitch both sides: secure backstitching, consistent tension
9. Finish edges: bevel, sand, burnish all exposed edges
10. Test functionality: snap closes securely, pouch holds coins without gaps`,
      objectives: [
        'Create folded leather construction',
        'Install snap closures accurately',
        'Execute clean saddle stitching',
        'Skive leather for folding',
        'Complete functional pouch',
        'Apply all Level 1 skills',
      ],
      skills: ['Folded construction', 'Snap installation', 'Saddle stitching', 'Skiving', 'Pattern design', 'Functional testing'],
      expectedOutcome: 'Completed coin pouch with secure snap, clean stitching, finished edges, holds coins securely, professional appearance.',
      passingCriteria: 'Snap is centered and secure, stitching is even and tight, edges are smooth, pouch folds flat, no gaps when closed',
      referencePhotos: ['/curriculum/leather/coin-pouch-pattern.jpg', '/curriculum/leather/snap-installation.jpg', '/curriculum/leather/completed-pouch.jpg'],
      estimatedHours: 6,
      difficulty: 'beginner',
      category: 'projects',
      subcategory: 'small_goods',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"Leather Pouches and Purses" by Al Stohlman',
        'Snap installation guide - Line 24',
        'Folded leather construction techniques',
      ],
    },
    {
      level: 1,
      moduleNumber: '1.6',
      assignmentNumber: 'LW-1.6.2',
      orderIndex: 12,
      title: 'Level 1 Final Project: Card Holder',
      description: 'Synthesize all Level 1 skills to create a vertical or horizontal card holder with multiple pockets and finished edges.',
      instructions: `1. Design card holder: vertical or horizontal orientation, 2-4 pockets
2. Create pattern: main body, pocket pieces, measure credit card for sizing
3. Cut all pieces: precise cutting, grain direction considered
4. Skive pocket tops: thin for comfort, 1/8" from top edge
5. Finish pocket top edges: bevel, sand, burnish before assembly
6. Position and glue pockets: rubber cement or contact cement, accurate alignment
7. Mark and punch stitching holes: around perimeter, through all layers
8. Saddle stitch assembly: consistent tension, secure backstitching
9. Finish all outer edges: bevel, sand, burnish to professional standard
10. Test with cards: smooth insertion, secure hold, no stretching`,
      objectives: [
        'Design functional multi-pocket item',
        'Execute precise pattern making',
        'Assemble multiple leather pieces',
        'Finish edges before assembly',
        'Complete professional-quality product',
        'Demonstrate mastery of Level 1 skills',
      ],
      skills: ['Multi-piece assembly', 'Gluing technique', 'Pocket construction', 'Edge finishing workflow', 'Quality control', 'Functional design'],
      expectedOutcome: 'Professional card holder with 2-4 pockets, finished edges, consistent stitching, holds cards securely, retail-quality appearance.',
      passingCriteria: 'All pockets are evenly spaced, stitching is consistent, edges are smooth, cards slide in smoothly, holder maintains shape, professional quality',
      referencePhotos: ['/curriculum/leather/card-holder-pattern.jpg', '/curriculum/leather/pocket-assembly.jpg', '/curriculum/leather/completed-card-holder.jpg'],
      estimatedHours: 8,
      difficulty: 'beginner',
      category: 'projects',
      subcategory: 'small_goods',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"Leather Wallet Patterns" - Makesupply',
        '"The Art of Hand Sewing Leather" - pocket construction',
        'Card holder construction tutorials - multiple sources',
      ],
      crossReferences: [
        'LW-1.4.1: Hand Stitching Basics',
        'LW-1.3.2: Edge Finishing',
        'LW-1.3.1: Cutting Techniques',
      ],
    },

    // ========================================================================
    // LEVEL 2: HAND STITCHING & SMALL GOODS
    // ========================================================================
    {
      level: 2,
      moduleNumber: '2.1',
      assignmentNumber: 'LW-2.1.1',
      orderIndex: 13,
      title: 'Advanced Stitching: Cross Stitch & Box Stitch',
      description: 'Learn decorative and structural stitching patterns including cross stitch for corners and box stitch for handles and straps.',
      instructions: `1. Study cross stitch: decorative corner reinforcement, X pattern, thread color contrast
2. Practice marking cross stitch pattern: 45-degree angles, centered in corner
3. Execute cross stitch on sample: even legs, consistent tension, centered cross
4. Learn box stitch: rectangle with X through it, ultimate strap reinforcement
5. Practice box stitch on strap ends: mark square, stitch perimeter, add X
6. Study running stitch variations: single line, double line, decorative spacing
7. Learn whip stitch: edge-to-edge joining, diagonal over edge, consistent spacing
8. Practice baseball stitch: alternating sides, creates raised seam, decorative
9. Study thread color contrast: matching vs contrasting, visual impact
10. Create stitch sampler: 8+ stitch types demonstrated on leather samples`,
      objectives: [
        'Execute cross stitch accurately',
        'Perform box stitch for strap reinforcement',
        'Differentiate between stitch types',
        'Select appropriate stitch for application',
        'Maintain consistency in decorative stitching',
        'Use thread color for visual effect',
      ],
      skills: ['Cross stitch', 'Box stitch', 'Whip stitch', 'Baseball stitch', 'Decorative stitching', 'Pattern marking'],
      expectedOutcome: 'Stitch sampler demonstrating 8+ different stitch types with consistent spacing and tension. Each stitch labeled with name and typical use.',
      passingCriteria: 'All stitches are evenly spaced, crosses are centered, box stitches are square, thread tension is consistent, sampler is well-organized',
      referencePhotos: ['/curriculum/leather/cross-stitch.jpg', '/curriculum/leather/box-stitch.jpg', '/curriculum/leather/stitch-sampler.jpg'],
      estimatedHours: 8,
      difficulty: 'intermediate',
      category: 'stitching',
      subcategory: 'decorative',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"The Art of Hand Sewing Leather" by Al Stohlman - Advanced stitches',
        'Decorative stitching guide - Tandy Leather',
        'YouTube: "Box Stitch Tutorial" by Little King Goods',
      ],
    },
    {
      level: 2,
      moduleNumber: '2.1',
      assignmentNumber: 'LW-2.1.2',
      orderIndex: 14,
      title: 'Leather Tooling: Basic Stamping',
      description: 'Introduction to leather tooling using basic stamps including bevelers, camouflage, and geometric patterns on vegetable-tanned leather.',
      instructions: `1. Study tooling leather requirements: veg-tan, 6-8 oz, natural color, cased properly
2. Learn casing process: water spray or sponge, wait 10-15 minutes, right moisture level
3. Practice beveler stamps: angled impression, creates shadows, defines borders
4. Learn camouflage stamps: background texture, uniform coverage, consistent depth
5. Study geometric stamps: basketweave, border, corner, consistent pattern
6. Practice swivel knife: trace design, consistent depth, smooth curves
7. Learn tooling sequence: swivel knife first, bevel edges, add background, add detail
8. Study spacing and pattern repeat: consistent spacing creates professional look
9. Complete practice board: 4 different border patterns using basic stamps
10. Tool a coaster: 4" circle, border pattern, background texture, beveled edges`,
      objectives: [
        'Case leather to correct moisture level',
        'Use swivel knife for clean lines',
        'Apply stamps with consistent depth',
        'Create repeating border patterns',
        'Complete tooled project',
        'Understand tooling sequence',
      ],
      skills: ['Leather casing', 'Swivel knife technique', 'Stamp placement', 'Pattern consistency', 'Tooling depth control', 'Background texture'],
      expectedOutcome: 'Practice board with 4 border patterns and completed tooled coaster with even depth, consistent pattern, professional appearance.',
      passingCriteria: 'Leather is properly cased, swivel knife cuts are clean, stamps are evenly spaced and same depth, patterns are consistent, no over-stamping',
      referencePhotos: ['/curriculum/leather/tooling-stamps.jpg', '/curriculum/leather/border-patterns.jpg', '/curriculum/leather/tooled-coaster.jpg'],
      estimatedHours: 10,
      difficulty: 'intermediate',
      category: 'tooling',
      subcategory: 'basic',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"The Art of Leather Carving" by Al Stohlman',
        '"Leathercraft Tools" - basic stamp guide',
        'Casing leather properly - Tandy tutorials',
      ],
    },
    {
      level: 2,
      moduleNumber: '2.2',
      assignmentNumber: 'LW-2.2.1',
      orderIndex: 15,
      title: 'Simple Bifold Wallet',
      description: 'Create a classic bifold wallet with card pockets, bill compartment, and optional ID window. Apply pattern making and multi-layer assembly.',
      instructions: `1. Study bifold design: two sides connected, folds in half, card slots and bill pocket
2. Create pattern: measure bills and cards, add seam allowance, plan pocket layout
3. Cut pieces: main body (2), card pockets (4-6), optional ID window frame
4. Skive all pocket tops and edges: comfort and bulk reduction
5. Install ID window if desired: clear vinyl, frame stitched around perimeter
6. Position and glue card pockets: stagger heights for easy access, accurate alignment
7. Stitch card pocket sides: down sides only, leave tops open
8. Position main body pieces: align perfectly, pockets inside
9. Stitch perimeter: leave top open for bills, consistent stitching
10. Finish edges, test function: cards slide smoothly, bills fit, wallet folds flat`,
      objectives: [
        'Design functional wallet layout',
        'Manage multiple pocket layers',
        'Execute pocket stitching correctly',
        'Assemble complex multi-piece project',
        'Create professional wallet',
        'Balance functionality and aesthetics',
      ],
      skills: ['Wallet construction', 'Multi-layer assembly', 'Pocket layout', 'Bulk management', 'Pattern development', 'Functional design'],
      expectedOutcome: 'Completed bifold wallet with 4-6 card slots, bill compartment, optional ID window, finished edges, professional quality.',
      passingCriteria: 'All pockets are evenly spaced and accessible, stitching is consistent, wallet folds flat, bills and cards fit properly, edges are finished',
      referencePhotos: ['/curriculum/leather/bifold-pattern.jpg', '/curriculum/leather/wallet-assembly.jpg', '/curriculum/leather/completed-bifold.jpg'],
      estimatedHours: 12,
      difficulty: 'intermediate',
      category: 'projects',
      subcategory: 'wallets',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"Leather Wallet Patterns" by Makesupply',
        'Bifold construction guide - Corter Leather',
        'Managing bulk in leather wallets - techniques',
      ],
    },
    {
      level: 2,
      moduleNumber: '2.2',
      assignmentNumber: 'LW-2.2.2',
      orderIndex: 16,
      title: 'Long Wallet with Zipper Pocket',
      description: 'Construct a long wallet with card slots, bill compartments, and zippered coin pocket. Learn to install zippers in leather.',
      instructions: `1. Design long wallet: 4" × 8" when closed, multiple compartments, zipper pocket
2. Create pattern: all pieces laid out, zipper pocket separate panel
3. Cut main pieces: wallet body (2), card pockets (6-8), zipper pocket pieces (2)
4. Install zipper: baste or glue zipper between two pocket pieces, stitch both sides
5. Practice zipper installation: even spacing from zipper, backstitch ends, clean finish
6. Assemble card pocket side: glue and stitch pockets to one main body
7. Attach zipper pocket: position centrally on opposite main body, stitch perimeter
8. Join both sides: align carefully, stitch down center creating spine
9. Stitch outer perimeter: leave one end open, consistent stitching
10. Finish all edges: bevel, sand, burnish, test all functions`,
      objectives: [
        'Install zipper in leather correctly',
        'Create long wallet design',
        'Manage multiple compartments',
        'Execute center spine construction',
        'Complete advanced wallet project',
        'Integrate hardware with leather',
      ],
      skills: ['Zipper installation', 'Long wallet construction', 'Multi-compartment design', 'Center spine technique', 'Hardware integration', 'Complex assembly'],
      expectedOutcome: 'Completed long wallet with 6-8 card slots, bill compartments, functional zipper pocket, finished edges, professional quality.',
      passingCriteria: 'Zipper operates smoothly, all pockets are accessible, stitching is even, wallet maintains structure, edges are finished, functions perfectly',
      referencePhotos: ['/curriculum/leather/long-wallet-pattern.jpg', '/curriculum/leather/zipper-installation.jpg', '/curriculum/leather/completed-long-wallet.jpg'],
      estimatedHours: 14,
      difficulty: 'intermediate',
      category: 'projects',
      subcategory: 'wallets',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Zipper installation in leather - Sailrite',
        '"Leather Goods" by Andrea Borrmann - wallet chapter',
        'Long wallet construction tutorials',
      ],
    },
    {
      level: 2,
      moduleNumber: '2.3',
      assignmentNumber: 'LW-2.3.1',
      orderIndex: 17,
      title: 'Leather Belt from Scratch',
      description: 'Create a complete leather belt including strap cutting, edge finishing, buckle installation, and hole spacing. Learn belt measurement standards.',
      instructions: `1. Study belt anatomy: strap, buckle, keeper, tip, holes for adjustment
2. Learn belt sizing: measure at pant loops, add 6-8" for buckle and adjustment
3. Select leather: 8-10 oz veg-tan, full-grain, 1.5" width standard
4. Cut belt strap: straight edges, square ends, exact width throughout
5. Cut and shape tip: taper or point, smooth curves, centered
6. Finish all edges: bevel, sand, burnish to perfection before assembly
7. Mark and punch holes: 1" apart, centered, start 3" from buckle end
8. Install buckle: fold 3" over buckle bar, punch and rivet or stitch
9. Create keeper loop: 2.5" piece, fold and rivet, slides over belt
10. Optional: dye, oil, stamp name or design, final finish with leather balm`,
      objectives: [
        'Understand belt sizing and standards',
        'Cut long straight strap accurately',
        'Space and punch holes evenly',
        'Install buckle securely',
        'Create functional keeper loop',
        'Complete wearable belt',
      ],
      skills: ['Belt construction', 'Buckle installation', 'Hole spacing', 'Long edge finishing', 'Keeper creation', 'Sizing standards'],
      expectedOutcome: 'Completed leather belt with proper sizing, evenly-spaced holes, secure buckle, functional keeper, burnished edges, wearable quality.',
      passingCriteria: 'Belt is straight and consistent width, holes are evenly spaced and centered, buckle is secure, edges are mirror-smooth, keeper slides freely',
      referencePhotos: ['/curriculum/leather/belt-cutting.jpg', '/curriculum/leather/buckle-installation.jpg', '/curriculum/leather/completed-belt.jpg'],
      estimatedHours: 8,
      difficulty: 'intermediate',
      category: 'projects',
      subcategory: 'belts',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"Belt Making" by Al Stohlman',
        'Standard belt sizing guide',
        'Buckle installation techniques - Tandy Leather',
      ],
    },
    {
      level: 2,
      moduleNumber: '2.3',
      assignmentNumber: 'LW-2.3.2',
      orderIndex: 18,
      title: 'Carved and Tooled Belt',
      description: 'Create an ornate belt with hand-carved design, stamped background, antiquing, and decorative edging.',
      instructions: `1. Design belt pattern: floral, geometric, western, or custom design repeating
2. Transfer design to cased leather: trace or freehand, consistent spacing
3. Swivel knife carving: cut all design lines, consistent depth, smooth curves
4. Bevel all carved edges: creates definition and dimension
5. Add background texture: camouflage or geometric stamp, consistent depth
6. Tool border design: consistent pattern down both edges
7. Dye belt: base color first, let dry completely
8. Apply antique gel: dark brown or black, work into tooling, wipe highlights
9. Seal with finish: leather sheen or tan kote, multiple light coats
10. Assemble belt: install buckle, punch holes, add keeper, final burnish`,
      objectives: [
        'Design repeating belt pattern',
        'Execute carving and tooling',
        'Apply antiquing for depth',
        'Create artistic belt',
        'Integrate tooling with function',
        'Complete wearable art piece',
      ],
      skills: ['Belt design', 'Leather carving', 'Tooling patterns', 'Antiquing technique', 'Artistic finishing', 'Functional art'],
      expectedOutcome: 'Completed carved and tooled belt with repeating design, antiqued tooling, finished edges, installed buckle, artistic and functional.',
      passingCriteria: 'Design is consistent throughout, carving is even depth, tooling is clear, antiquing enhances depth, belt is functional and beautiful',
      referencePhotos: ['/curriculum/leather/belt-design.jpg', '/curriculum/leather/carved-belt.jpg', '/curriculum/leather/antiqued-belt.jpg'],
      estimatedHours: 16,
      difficulty: 'intermediate',
      category: 'projects',
      subcategory: 'belts',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"The Art of Leather Carving" by Al Stohlman',
        'Belt design patterns - multiple sources',
        'Antiquing techniques for tooled leather',
      ],
      crossReferences: [
        'LW-2.1.2: Basic Stamping',
      ],
    },
    {
      level: 2,
      moduleNumber: '2.4',
      assignmentNumber: 'LW-2.4.1',
      orderIndex: 19,
      title: 'Leather Watch Strap',
      description: 'Create a custom watch strap with spring bar attachment, buckle, and precise sizing. Learn to work with watch hardware.',
      instructions: `1. Measure watch case: lug width determines strap width (18mm, 20mm, 22mm common)
2. Design strap: single piece or two-piece, with or without padding
3. Create pattern: wrist size + 4" for overlap and buckle, lug width exact
4. Cut leather: 3-4 oz for flexibility, precise width, clean edges
5. Skive ends: thin for comfort and buckle folding
6. Punch spring bar slots: 1/16" wide × 1/4" deep, precise spacing to match lug width
7. Install buckle: fold and stitch or rivet 1" from end
8. Punch adjustment holes: 5-7 holes spaced 1/2" apart
9. Finish edges: bevel, sand, burnish all edges including slots
10. Install spring bars, attach to watch, test fit and comfort`,
      objectives: [
        'Measure and match watch lug width',
        'Cut precise narrow strap',
        'Create spring bar slots accurately',
        'Execute fine detail edge finishing',
        'Install watch hardware',
        'Create comfortable custom strap',
      ],
      skills: ['Watch strap construction', 'Precision measuring', 'Spring bar installation', 'Narrow leather work', 'Comfort design', 'Hardware integration'],
      expectedOutcome: 'Completed watch strap fitting specific watch, spring bars attach securely, comfortable to wear, edges finished, professional quality.',
      passingCriteria: 'Strap width matches lug width exactly, spring bar slots are precise, buckle is secure, holes are evenly spaced, comfortable on wrist',
      referencePhotos: ['/curriculum/leather/watch-strap-pattern.jpg', '/curriculum/leather/spring-bar-slots.jpg', '/curriculum/leather/completed-watch-strap.jpg'],
      estimatedHours: 6,
      difficulty: 'intermediate',
      category: 'projects',
      subcategory: 'straps',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Watch strap sizing guide - Hodinkee',
        'Spring bar installation techniques',
        'Watch strap patterns - Makesupply',
      ],
    },
    {
      level: 2,
      moduleNumber: '2.4',
      assignmentNumber: 'LW-2.4.2',
      orderIndex: 20,
      title: 'Padded Watch Strap with Lining',
      description: 'Create a padded and lined watch strap using layered construction, skiving for comfort, and edge finishing techniques.',
      instructions: `1. Design padded strap: outer leather, padding layer, lining leather
2. Cut pieces: outer (decorative), padding (pigskin or soft leather), lining (soft)
3. Skive outer edges: taper all edges to 50% thickness for layering
4. Skive padding perimeter: taper to feathered edge, center remains full thickness
5. Skive lining edges: match outer skive for alignment
6. Glue layers: rubber cement, accurate alignment, no wrinkles
7. Punch spring bar slots: through all layers, test spring bar fit
8. Stitch perimeter: close to edge, through all layers, consistent spacing
9. Trim and finish edges: flush trim, bevel, sand, burnish to smooth
10. Install hardware: buckle, spring bars, test comfort and flexibility`,
      objectives: [
        'Execute layered construction',
        'Skive multiple layers for bulk reduction',
        'Align layers accurately',
        'Stitch through multiple layers',
        'Create padded comfortable strap',
        'Finish edges of layered construction',
      ],
      skills: ['Layered construction', 'Multi-layer skiving', 'Padding technique', 'Edge matching', 'Comfort engineering', 'Advanced finishing'],
      expectedOutcome: 'Completed padded watch strap with smooth even padding, comfortable fit, well-finished edges, professional layered construction.',
      passingCriteria: 'All layers align perfectly, padding is even throughout, edges are smooth with no layer separation, comfortable to wear, looks professional',
      referencePhotos: ['/curriculum/leather/padded-strap-layers.jpg', '/curriculum/leather/skived-edges.jpg', '/curriculum/leather/completed-padded-strap.jpg'],
      estimatedHours: 10,
      difficulty: 'intermediate',
      category: 'projects',
      subcategory: 'straps',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Layered leather construction techniques',
        'Skiving for comfort - advanced guide',
        'Padded strap construction tutorials',
      ],
    },
    {
      level: 2,
      moduleNumber: '2.5',
      assignmentNumber: 'LW-2.5.1',
      orderIndex: 21,
      title: 'Leather Notebook Cover',
      description: 'Create a notebook cover with pen loop, card pockets, and closure strap. Learn to work with larger pieces and multiple features.',
      instructions: `1. Measure notebook: width, height, spine thickness, add seam allowance
2. Design cover: front, spine, back as one piece, plus interior pockets and pen loop
3. Create pattern: main body, corner pockets or full pockets, pen loop, closure strap
4. Cut main body: large piece, precise dimensions, straight edges
5. Cut and prepare interior features: pockets, pen loop, closure strap
6. Finish pocket and pen loop edges before assembly: efficiency and quality
7. Position and glue pockets to interior: accurate placement, no wrinkles
8. Stitch pockets: down sides and bottom, leave tops open
9. Attach pen loop: elastic or leather, sized for pen, secure stitching
10. Add closure: elastic cord, snap, or strap, test function, finish remaining edges`,
      objectives: [
        'Work with larger leather pieces',
        'Design multi-feature project',
        'Integrate multiple functions',
        'Execute interior pocket construction',
        'Create closure system',
        'Complete practical accessory',
      ],
      skills: ['Large piece construction', 'Multi-feature design', 'Pen loop creation', 'Interior pockets', 'Closure systems', 'Practical design'],
      expectedOutcome: 'Completed notebook cover fitting specific notebook, with functional pockets, pen loop, and closure, finished edges, professional quality.',
      passingCriteria: 'Cover fits notebook snugly, pockets are accessible, pen loop holds pen securely, closure works smoothly, all edges finished, looks professional',
      referencePhotos: ['/curriculum/leather/notebook-cover-pattern.jpg', '/curriculum/leather/interior-features.jpg', '/curriculum/leather/completed-notebook-cover.jpg'],
      estimatedHours: 12,
      difficulty: 'intermediate',
      category: 'projects',
      subcategory: 'covers',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Notebook cover construction - Makesupply',
        'Interior pocket techniques',
        'Closure systems for leather goods',
      ],
    },
    {
      level: 2,
      moduleNumber: '2.5',
      assignmentNumber: 'LW-2.5.2',
      orderIndex: 22,
      title: 'Passport Wallet with Multiple Pockets',
      description: 'Create a passport wallet with passport pocket, card slots, pen loop, and currency pockets. Learn to design for specific functionality.',
      instructions: `1. Measure passport: 5" × 3.5" standard, add clearance, design around it
2. Design layout: passport pocket, 4+ card slots, pen loop, currency pockets
3. Create pattern: main body bifold style, interior pockets optimized for passport
4. Cut all pieces: main body, card pockets, passport pockets (2 for each side)
5. Skive all pocket edges: bulk reduction critical in multi-layer design
6. Assemble interior: glue then stitch card pockets, passport pockets, pen loop
7. Test fit with actual passport: smooth insertion, secure hold, easy removal
8. Join main body pieces: align carefully, stitch perimeter
9. Finish edges: bevel, sand, burnish all exposed edges
10. Optional: emboss or stamp cover, add elastic closure, test all functions`,
      objectives: [
        'Design for specific function (passport)',
        'Manage many pockets efficiently',
        'Create specialized travel accessory',
        'Execute compact multi-pocket design',
        'Test functionality thoroughly',
        'Complete travel-ready wallet',
      ],
      skills: ['Functional design', 'Compact layout', 'Multi-pocket construction', 'Travel accessory design', 'Bulk management', 'Specialized fitting'],
      expectedOutcome: 'Completed passport wallet with secure passport pocket, multiple card slots, pen loop, finished edges, compact design, travel-ready.',
      passingCriteria: 'Passport slides in smoothly, all cards accessible, compact when closed, all edges finished, functions perfectly for travel use',
      referencePhotos: ['/curriculum/leather/passport-wallet-pattern.jpg', '/curriculum/leather/passport-pocket-fitting.jpg', '/curriculum/leather/completed-passport-wallet.jpg'],
      estimatedHours: 14,
      difficulty: 'intermediate',
      category: 'projects',
      subcategory: 'wallets',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Passport wallet design standards',
        'Travel accessory functionality',
        'Compact multi-pocket construction',
      ],
    },
    {
      level: 2,
      moduleNumber: '2.6',
      assignmentNumber: 'LW-2.6.1',
      orderIndex: 23,
      title: 'Leather Dopp Kit (Toiletry Bag)',
      description: 'Create a zippered dopp kit with water-resistant lining, learn to work with fabric lining, zippers, and create three-dimensional bags.',
      instructions: `1. Design dopp kit: rectangular bag 10" × 5" × 5", zipper top, gusseted sides
2. Create pattern: main body, end pieces, gussets, lining pieces
3. Select materials: 4-6 oz outer leather, water-resistant fabric lining, 10" zipper
4. Cut leather pieces: main body, two end pieces, two gusset pieces
5. Cut lining pieces: match leather pieces, add 1/4" seam allowance for sewing
6. Install zipper to main body: baste or glue, stitch both sides, even spacing
7. Attach end pieces to main body: stitch sides, creating bag shape
8. Sew lining: stitch fabric pieces creating bag shape, leave opening for turning
9. Insert lining into leather bag: align zipper, hand-stitch lining to zipper tape
10. Close lining opening, finish all edges, test function and capacity`,
      objectives: [
        'Create three-dimensional bag shape',
        'Install long zipper in bag',
        'Work with fabric lining',
        'Execute gusseted construction',
        'Combine leather and fabric',
        'Create practical toiletry bag',
      ],
      skills: ['3D bag construction', 'Zipper installation', 'Fabric lining', 'Gusset design', 'Mixed materials', 'Practical design'],
      expectedOutcome: 'Completed dopp kit with functional zipper, water-resistant lining, gusseted shape, holds toiletries, finished edges, travel-ready.',
      passingCriteria: 'Zipper operates smoothly, bag holds shape, lining is neatly installed, corners are crisp, holds toiletries securely, professional quality',
      referencePhotos: ['/curriculum/leather/dopp-kit-pattern.jpg', '/curriculum/leather/zipper-installation-bag.jpg', '/curriculum/leather/completed-dopp-kit.jpg'],
      estimatedHours: 16,
      difficulty: 'intermediate',
      category: 'projects',
      subcategory: 'bags',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Gusseted bag construction techniques',
        'Lining installation in leather bags',
        'Zipper installation for bags - Sailrite',
      ],
    },
    {
      level: 2,
      moduleNumber: '2.6',
      assignmentNumber: 'LW-2.6.2',
      orderIndex: 24,
      title: 'Level 2 Final Project: Leather Satchel Bag',
      description: 'Synthesize all Level 2 skills to create a small satchel bag with flap closure, adjustable strap, interior pockets, and hardware.',
      instructions: `1. Design satchel: 10" × 8" × 3" bag with flap, front pocket, interior organization
2. Create complete pattern: front, back, flap, gussets, pockets, strap
3. Cut all pieces: 4-6 oz leather, consistent thickness, grain direction considered
4. Prepare all pockets: skive edges, finish top edges before assembly
5. Assemble front: attach exterior pocket with stitching
6. Assemble back: attach interior pockets or dividers
7. Attach gussets to front and back: stitching or rivets, creating bag shape
8. Create and attach flap: lined for structure, attach to back, add closure
9. Create adjustable strap: Chicago screws or buckles for adjustment, box stitch ends
10. Finish all edges, install hardware, test function: strap adjusts, closure works, bag holds shape`,
      objectives: [
        'Design complete functional bag',
        'Execute complex multi-piece assembly',
        'Integrate hardware and closures',
        'Create adjustable strap system',
        'Demonstrate mastery of Level 2 skills',
        'Complete wearable bag',
      ],
      skills: ['Bag design', 'Complex assembly', 'Strap creation', 'Hardware integration', 'Closure systems', 'Structural design'],
      expectedOutcome: 'Completed satchel bag with flap closure, adjustable strap, interior pockets, finished edges, holds shape, professional quality, wearable.',
      passingCriteria: 'Bag holds shape when filled, strap adjusts smoothly, closure is secure, all pockets accessible, edges finished, professional appearance, functional',
      referencePhotos: ['/curriculum/leather/satchel-pattern.jpg', '/curriculum/leather/satchel-assembly.jpg', '/curriculum/leather/completed-satchel.jpg'],
      estimatedHours: 24,
      difficulty: 'intermediate',
      category: 'projects',
      subcategory: 'bags',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"Making Leather Bags" by Andrea Borrmann',
        'Bag construction techniques - multiple sources',
        'Strap attachment and reinforcement methods',
      ],
      crossReferences: [
        'LW-2.1.1: Advanced Stitching (box stitch for strap)',
        'LW-2.4.1: Strap construction principles',
        'LW-2.5.1: Multi-feature design',
      ],
    },

    // ========================================================================
    // LEVEL 3: BAGS & COMPLEX PROJECTS
    // ========================================================================
    {
      level: 3,
      moduleNumber: '3.1',
      assignmentNumber: 'LW-3.1.1',
      orderIndex: 25,
      title: 'Advanced Pattern Making & Prototyping',
      description: 'Learn professional pattern development techniques including mock-ups, scaling, and template creation for repeatable production.',
      instructions: `1. Study pattern development process: concept sketch, measurements, paper pattern, prototype, refinement
2. Learn to create accurate measurements: use existing bag as reference, measure all dimensions
3. Practice making paper patterns: add seam allowance, label all pieces, mark grain direction
4. Create prototype in cheap leather: test fit and function, identify issues
5. Refine pattern based on prototype: adjust dimensions, fix alignment issues
6. Transfer final pattern to template material: plastic, hardboard, or cardboard
7. Label templates permanently: piece name, grain direction, quantity needed
8. Create pattern library system: organized storage, pattern numbering
9. Document construction notes: assembly order, special techniques for each pattern
10. Test template by cutting and assembling new project from it`,
      objectives: [
        'Develop accurate patterns from concept',
        'Create functional prototypes',
        'Refine designs based on testing',
        'Make durable pattern templates',
        'Organize pattern library',
        'Document construction process',
      ],
      skills: ['Pattern development', 'Prototyping', 'Template creation', 'Design refinement', 'Documentation', 'Organization systems'],
      expectedOutcome: 'Complete pattern template set for a bag design with labeled pieces, grain direction, and construction notes. Successfully assembled test project.',
      passingCriteria: 'Patterns are accurate, template is durable, all pieces labeled, construction notes are clear, test project fits together perfectly',
      referencePhotos: ['/curriculum/leather/pattern-development.jpg', '/curriculum/leather/template-library.jpg', '/curriculum/leather/prototype-testing.jpg'],
      estimatedHours: 12,
      difficulty: 'advanced',
      category: 'design',
      subcategory: 'patterns',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"Pattern Making for Bags" by Zongzheng Yuan',
        'Professional pattern development techniques',
        'Template materials and storage systems',
      ],
    },
    {
      level: 3,
      moduleNumber: '3.1',
      assignmentNumber: 'LW-3.1.2',
      orderIndex: 26,
      title: 'Leather Molding & Wet Forming',
      description: 'Master the art of shaping leather using water and molds to create three-dimensional forms, cases, and sculptural elements.',
      instructions: `1. Study wet forming basics: veg-tan only, water saturation, form while wet, dry in shape
2. Learn leather casing for forming: soak in water 30 seconds to 5 minutes depending on thickness
3. Practice simple bowl forming: press leather into bowl, let dry, holds shape permanently
4. Create mask or phone case: wet leather, press over form, use clamps or straps
5. Learn to make custom forms: wood, foam, plaster, 3D printed forms
6. Practice detail forming: use modeling tools to emboss details while wet
7. Study drying techniques: slow drying prevents cracking, maintain even moisture
8. Learn to preserve wet-formed shapes: finish with oils or waxes after drying
9. Create knife sheath using wet forming: mold around knife, perfect fit
10. Complete complex project: wet-form a leather mask or 3D sculptural piece`,
      objectives: [
        'Understand wet forming principles',
        'Case leather to proper moisture level',
        'Form leather over molds',
        'Create custom forming tools',
        'Add detail to wet leather',
        'Complete 3D formed project',
      ],
      skills: ['Wet forming', 'Mold making', 'Detail embossing', 'Moisture control', '3D shaping', 'Sculptural leather work'],
      expectedOutcome: 'Completed wet-formed knife sheath with perfect fit and complex wet-formed sculptural piece demonstrating mastery of technique.',
      passingCriteria: 'Formed pieces hold shape permanently, no cracking, details are crisp, fit is accurate, professional finish',
      referencePhotos: ['/curriculum/leather/wet-forming.jpg', '/curriculum/leather/molding-process.jpg', '/curriculum/leather/formed-pieces.jpg'],
      estimatedHours: 14,
      difficulty: 'advanced',
      category: 'techniques',
      subcategory: 'forming',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"Leatherwork: A Manual of Techniques" by Geoffrey West - wet forming chapter',
        'Wet forming techniques - Al Stohlman',
        'Custom mold creation methods',
      ],
    },
    {
      level: 3,
      moduleNumber: '3.2',
      assignmentNumber: 'LW-3.2.1',
      orderIndex: 27,
      title: 'Tote Bag Construction',
      description: 'Create a professional tote bag with reinforced handles, flat bottom, interior pockets, and optional zipper closure.',
      instructions: `1. Design tote bag: 14" × 12" × 4" size, flat bottom, reinforced handles, interior pockets
2. Create pattern: front/back panels, bottom panel, two gusset pieces, handles, pockets
3. Cut all pieces: 4-6 oz leather for body, 8-10 oz for handles
4. Prepare interior pockets: skive edges, finish tops, position on interior of panels
5. Attach pockets to front and back panels: stitch three sides, leave tops open
6. Assemble bottom and gussets: stitch bottom panel to gussets creating U-shape
7. Attach front and back panels: stitch to gusset assembly, creating bag shape
8. Reinforce handle attachment points: add leather patches or rivets
9. Attach handles: box stitch or rivet securely, test weight capacity
10. Optional: add magnetic snap or zipper closure, finish all edges`,
      objectives: [
        'Construct flat-bottom bag',
        'Create and attach reinforced handles',
        'Execute gusseted construction',
        'Add interior organization',
        'Ensure structural integrity',
        'Complete professional tote',
      ],
      skills: ['Tote construction', 'Handle reinforcement', 'Flat bottom technique', 'Load-bearing design', 'Interior pockets', 'Structural engineering'],
      expectedOutcome: 'Completed tote bag with flat bottom, reinforced handles, interior pockets, professional finish, carries 20+ lbs safely.',
      passingCriteria: 'Bag stands upright on flat bottom, handles support weight, all stitching is secure, interior pockets functional, professional appearance',
      referencePhotos: ['/curriculum/leather/tote-pattern.jpg', '/curriculum/leather/handle-reinforcement.jpg', '/curriculum/leather/completed-tote.jpg'],
      estimatedHours: 16,
      difficulty: 'advanced',
      category: 'projects',
      subcategory: 'bags',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"Making Leather Bags" by Andrea Borrmann - tote chapter',
        'Handle reinforcement techniques',
        'Load-bearing bag construction',
      ],
    },
    {
      level: 3,
      moduleNumber: '3.2',
      assignmentNumber: 'LW-3.2.2',
      orderIndex: 28,
      title: 'Messenger Bag with Multiple Compartments',
      description: 'Build a messenger bag with laptop sleeve, organizer pockets, adjustable strap, and weather flap closure.',
      instructions: `1. Design messenger bag: 15" × 11" × 4", padded laptop sleeve, front organizer, weather flap
2. Create complete pattern: body panels, flap, laptop sleeve, dividers, pockets, strap
3. Build padded laptop sleeve: outer leather, foam padding, soft lining, test with actual laptop
4. Create front organizer panel: multiple pockets for phone, pens, cards
5. Assemble main body: attach laptop sleeve and dividers inside, creating compartments
6. Add front organizer: attach to front panel before main assembly
7. Attach gussets and bottom: creating structured bag shape
8. Create weather flap: lined, attaches to back, covers zipper or opening
9. Add quick-release buckles or magnetic closure to flap
10. Create padded adjustable strap: shoulder pad, adjustment hardware, box stitch attachment`,
      objectives: [
        'Design multi-compartment bag',
        'Create padded laptop protection',
        'Build organizer system',
        'Execute weather flap closure',
        'Create comfortable strap system',
        'Complete professional messenger bag',
      ],
      skills: ['Messenger bag construction', 'Padded sleeve creation', 'Organizer design', 'Weather flap', 'Strap padding', 'Complex assembly'],
      expectedOutcome: 'Completed messenger bag with protected laptop sleeve, organized pockets, weather flap, comfortable strap, professional quality.',
      passingCriteria: 'Laptop fits securely in padded sleeve, all pockets accessible, flap protects contents, strap is comfortable, bag holds shape',
      referencePhotos: ['/curriculum/leather/messenger-pattern.jpg', '/curriculum/leather/laptop-sleeve.jpg', '/curriculum/leather/completed-messenger.jpg'],
      estimatedHours: 24,
      difficulty: 'advanced',
      category: 'projects',
      subcategory: 'bags',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Messenger bag construction guides - multiple sources',
        'Padded computer sleeve techniques',
        'Weather flap design and function',
      ],
    },
    {
      level: 3,
      moduleNumber: '3.3',
      assignmentNumber: 'LW-3.3.1',
      orderIndex: 29,
      title: 'Hardware Installation: D-rings, Buckles, Magnetic Snaps',
      description: 'Master installation of various bag hardware including D-rings, square rings, swivel hooks, buckles, and magnetic snaps.',
      instructions: `1. Study hardware types: D-rings for strap attachment, square rings, swivel hooks, lobster clasps
2. Learn to install D-rings: fold leather tab, reinforce with rivet or box stitch
3. Practice buckle installation: tongue buckle, roller buckle, side-release buckle
4. Master magnetic snap installation: mark center, punch holes, install post and cap
5. Learn heavy-duty snap press: hand press vs bench press, die sizes
6. Practice swivel hook attachment: split ring connection, strap tab construction
7. Install Chicago screws: allows adjustment and replacement, proper sizing
8. Learn slider and adjustment hardware: strap adjusters, cam locks, ladder locks
9. Create hardware sample board: each type installed and labeled
10. Design and build small bag incorporating 5+ different hardware types`,
      objectives: [
        'Install D-rings and strap hardware',
        'Set magnetic snaps accurately',
        'Work with buckles and adjusters',
        'Use snap press for heavy duty snaps',
        'Select appropriate hardware',
        'Integrate hardware into design',
      ],
      skills: ['Hardware installation', 'D-ring attachment', 'Magnetic snap setting', 'Buckle installation', 'Strap hardware', 'Hardware selection'],
      expectedOutcome: 'Hardware sample board with 10+ hardware types properly installed. Small bag project using multiple hardware types functionally.',
      passingCriteria: 'All hardware is securely installed, operates smoothly, properly sized, reinforced adequately, professional appearance',
      referencePhotos: ['/curriculum/leather/hardware-types.jpg', '/curriculum/leather/d-ring-installation.jpg', '/curriculum/leather/hardware-samples.jpg'],
      estimatedHours: 10,
      difficulty: 'advanced',
      category: 'techniques',
      subcategory: 'hardware',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Bag hardware guide - Ohio Travel Bag',
        'Hardware installation techniques - Tandy Leather',
        'Heavy-duty snap press operation',
      ],
    },
    {
      level: 3,
      moduleNumber: '3.3',
      assignmentNumber: 'LW-3.3.2',
      orderIndex: 30,
      title: 'Lining Techniques & Interior Organization',
      description: 'Learn professional bag lining methods using fabric, creating interior pockets, dividers, and organization systems.',
      instructions: `1. Study lining purposes: protection, aesthetics, structure, pocket mounting surface
2. Learn fabric selection: canvas, cotton duck, nylon, polyester, water-resistant coatings
3. Practice sewing machine basics: straight stitch, backstitch, tension adjustment
4. Create lined pouch: sew fabric lining, insert into leather exterior, attach at opening
5. Learn interior pocket construction: fabric pockets, zipper pockets, elastic loops
6. Practice divider creation: padded dividers for camera bags, removable vs fixed
7. Learn top-stitching lining to leather: fold edges, topstitch visible from exterior
8. Create key leash attachment: D-ring on interior, long strap, easy key access
9. Build organizer panel: multiple pockets on fabric panel, insert into bag
10. Complete lined tote: fabric lining with interior pockets, divider, and organization`,
      objectives: [
        'Select appropriate lining fabric',
        'Sew fabric components',
        'Create interior pocket system',
        'Install lining professionally',
        'Build organizer panels',
        'Complete fully-lined bag',
      ],
      skills: ['Lining installation', 'Fabric sewing', 'Interior pockets', 'Divider creation', 'Organization design', 'Mixed materials'],
      expectedOutcome: 'Completed lined tote bag with fabric lining, multiple interior pockets, divider, key leash, professional finish.',
      passingCriteria: 'Lining is smoothly installed, all interior pockets functional, divider is secure, organization is practical, looks professional',
      referencePhotos: ['/curriculum/leather/lining-installation.jpg', '/curriculum/leather/interior-organization.jpg', '/curriculum/leather/lined-bag.jpg'],
      estimatedHours: 14,
      difficulty: 'advanced',
      category: 'techniques',
      subcategory: 'lining',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Bag lining techniques - Sailrite',
        '"Making Leather Bags" - lining chapter',
        'Sewing machine basics for leather workers',
      ],
    },
    {
      level: 3,
      moduleNumber: '3.4',
      assignmentNumber: 'LW-3.4.1',
      orderIndex: 31,
      title: 'Backpack Construction Fundamentals',
      description: 'Learn the basics of backpack construction including shoulder straps, back panel, main compartment, and top closure.',
      instructions: `1. Study backpack anatomy: main compartment, shoulder straps, back panel, top closure, adjustment system
2. Design simple backpack: 12" × 16" × 6", drawstring top, flap cover
3. Create pattern: front panel, back panel, bottom, two side gussets, flap, straps
4. Build padded shoulder straps: layered construction, curved shape, adjustment hardware
5. Create padded back panel: foam or leather padding, breathable if possible
6. Assemble main body: bottom and gussets creating box shape
7. Attach front panel and back panel: main compartment complete
8. Install drawstring closure: grommets around top, cord threaded through
9. Attach flap to back panel: buckle or snap closure to front
10. Attach shoulder straps to back panel: reinforced attachment, box stitch, test weight`,
      objectives: [
        'Understand backpack structure',
        'Create padded shoulder straps',
        'Build padded back panel',
        'Execute drawstring closure',
        'Reinforce stress points',
        'Complete functional backpack',
      ],
      skills: ['Backpack construction', 'Strap padding', 'Back panel design', 'Drawstring closure', 'Load distribution', 'Reinforcement'],
      expectedOutcome: 'Completed simple backpack with padded straps, padded back panel, drawstring closure, flap cover, carries weight comfortably.',
      passingCriteria: 'Straps are comfortable and secure, back panel provides support, drawstring operates smoothly, backpack distributes weight evenly',
      referencePhotos: ['/curriculum/leather/backpack-pattern.jpg', '/curriculum/leather/strap-padding.jpg', '/curriculum/leather/simple-backpack.jpg'],
      estimatedHours: 20,
      difficulty: 'advanced',
      category: 'projects',
      subcategory: 'bags',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Backpack construction basics - multiple sources',
        'Shoulder strap design and ergonomics',
        'Load distribution in backpacks',
      ],
    },
    {
      level: 3,
      moduleNumber: '3.4',
      assignmentNumber: 'LW-3.4.2',
      orderIndex: 32,
      title: 'Reinforcement Techniques for High-Stress Areas',
      description: 'Learn to identify and reinforce high-stress areas in bags including strap attachments, corners, and stress points.',
      instructions: `1. Study stress points in bags: strap attachment, handle connection, bottom corners, zipper ends
2. Learn reinforcement patches: leather patches under strap attachments, double thickness
3. Practice bar-tack stitching: machine stitching for maximum strength, back-and-forth pattern
4. Master riveting for reinforcement: multiple rivets at stress points, proper spacing
5. Learn corner reinforcement: extra leather layer, metal corners, protective caps
6. Study bottom protection: feet, metal studs, thick leather base, sacrificial layer
7. Practice zipper end reinforcement: bar-tack or rivet at zipper ends prevents tearing
8. Create strap attachment reinforcement: both sides of leather, box stitch, backing patch
9. Learn edge binding for protection: folded leather or fabric binding on edges
10. Build sample bag with all reinforcement techniques: demonstrate each method`,
      objectives: [
        'Identify high-stress areas',
        'Execute reinforcement patches',
        'Master bar-tack stitching',
        'Reinforce corners and bottoms',
        'Protect zippers and closures',
        'Build durable long-lasting bags',
      ],
      skills: ['Stress analysis', 'Reinforcement techniques', 'Bar-tack stitching', 'Corner protection', 'Durability design', 'Professional construction'],
      expectedOutcome: 'Sample bag demonstrating 8+ reinforcement techniques at all stress points. Each technique labeled and tested for strength.',
      passingCriteria: 'All stress points are reinforced, techniques are correctly applied, bag withstands 50 lb load test, reinforcements are neat',
      referencePhotos: ['/curriculum/leather/stress-points.jpg', '/curriculum/leather/reinforcement-techniques.jpg', '/curriculum/leather/reinforced-bag.jpg'],
      estimatedHours: 12,
      difficulty: 'advanced',
      category: 'techniques',
      subcategory: 'reinforcement',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Bag reinforcement techniques - industrial methods',
        'Stress point identification in leather goods',
        'Bar-tack stitching guide',
      ],
    },
    {
      level: 3,
      moduleNumber: '3.5',
      assignmentNumber: 'LW-3.5.1',
      orderIndex: 33,
      title: 'Briefcase Construction',
      description: 'Build a professional briefcase with compartments, handles, shoulder strap option, and frame or structure system.',
      instructions: `1. Design briefcase: 16" × 12" × 3", divided interior, document pockets, handles
2. Create pattern: front/back panels, bottom, gussets, dividers, handles, flap or frame
3. Cut all pieces: 4-6 oz leather for panels, 8-10 oz for handles and structure
4. Build interior divider system: separate compartment for documents, laptop, supplies
5. Create briefcase handles: two top handles, reinforced attachment, comfortable grip
6. Optional: install metal frame system for rigid opening (traditional briefcase)
7. Assemble main body: bottom, gussets, panels, creating structured box
8. Install closure system: buckles, latches, or zipper, secure when closed
9. Add shoulder strap attachments: D-rings on sides, removable shoulder strap
10. Finish all edges, add feet to bottom, test structure and function`,
      objectives: [
        'Design professional briefcase',
        'Create structured box construction',
        'Build interior compartment system',
        'Install handles and straps',
        'Execute rigid framing system',
        'Complete business-quality briefcase',
      ],
      skills: ['Briefcase construction', 'Structured box design', 'Handle creation', 'Frame installation', 'Professional finishing', 'Interior dividers'],
      expectedOutcome: 'Completed professional briefcase with divided interior, reinforced handles, closure system, optional shoulder strap, stands upright.',
      passingCriteria: 'Briefcase holds shape when empty, handles support weight, interior compartments functional, closure secure, professional appearance',
      referencePhotos: ['/curriculum/leather/briefcase-pattern.jpg', '/curriculum/leather/frame-system.jpg', '/curriculum/leather/completed-briefcase.jpg'],
      estimatedHours: 26,
      difficulty: 'advanced',
      category: 'projects',
      subcategory: 'bags',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Briefcase construction techniques',
        'Metal frame installation in leather goods',
        'Professional bag structure and support',
      ],
    },
    {
      level: 3,
      moduleNumber: '3.5',
      assignmentNumber: 'LW-3.5.2',
      orderIndex: 34,
      title: 'Camera Bag or Equipment Case',
      description: 'Create a protective camera bag with padded dividers, weather resistance, and organization for expensive equipment.',
      instructions: `1. Design camera bag: size for specific camera and lenses, removable dividers, top access
2. Create pattern: main body, padded dividers, lid, pockets, strap
3. Build padded removable dividers: foam core, fabric covered, velcro attachment
4. Create exterior with weather-resistant treatment: waterproof lining or treated leather
5. Build main body: padded bottom, padded sides for impact protection
6. Install divider attachment system: velcro on interior walls and dividers
7. Create quick-access lid: magnetic closure or quick-release buckles
8. Add exterior accessory pockets: memory cards, batteries, lens cloths
9. Create padded shoulder strap: wide comfortable strap, quick-adjust hardware
10. Test with actual camera equipment: fit, protection, accessibility, comfort`,
      objectives: [
        'Design equipment protection system',
        'Create padded removable dividers',
        'Build impact-resistant structure',
        'Add weather resistance',
        'Ensure quick equipment access',
        'Complete professional camera bag',
      ],
      skills: ['Camera bag design', 'Padding systems', 'Divider construction', 'Weather resistance', 'Quick-access design', 'Equipment protection'],
      expectedOutcome: 'Completed camera bag with adjustable padded dividers, weather-resistant exterior, quick-access lid, protective structure, comfortable carry.',
      passingCriteria: 'Equipment fits securely, dividers adjust and stay in place, adequate padding protection, weather-resistant, easy access, professional',
      referencePhotos: ['/curriculum/leather/camera-bag-design.jpg', '/curriculum/leather/padded-dividers.jpg', '/curriculum/leather/completed-camera-bag.jpg'],
      estimatedHours: 22,
      difficulty: 'advanced',
      category: 'projects',
      subcategory: 'bags',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Camera bag design principles',
        'Equipment protection and padding',
        'Weather-resistant leather treatments',
      ],
    },
    {
      level: 3,
      moduleNumber: '3.6',
      assignmentNumber: 'LW-3.6.1',
      orderIndex: 35,
      title: 'Custom Bag Design Project',
      description: 'Design and prototype a custom bag concept incorporating all Level 3 skills. Create pattern, prototype, refine, and document.',
      instructions: `1. Develop original bag concept: identify purpose, user needs, unique features
2. Sketch multiple design variations: explore different solutions, select best option
3. Create detailed technical drawings: dimensions, materials, hardware list
4. Develop complete pattern set: all pieces, grain direction, assembly notes
5. Source all materials and hardware: leather, lining, hardware, closures
6. Build prototype: assemble bag, test function, identify issues
7. Refine design based on prototype: adjust dimensions, improve features
8. Create final pattern templates: permanent templates for future production
9. Build final version: improved design, professional execution
10. Document entire process: photos, notes, lessons learned, time tracking`,
      objectives: [
        'Develop original design concept',
        'Create technical design drawings',
        'Build and test prototype',
        'Refine design iteratively',
        'Execute professional final version',
        'Document design process',
      ],
      skills: ['Design development', 'Technical drawing', 'Prototyping', 'Design refinement', 'Problem solving', 'Documentation'],
      expectedOutcome: 'Completed custom bag design with prototype and final version, complete pattern templates, full process documentation.',
      passingCriteria: 'Design is original and functional, prototype demonstrates concept, final version is refined and professional, documentation is thorough',
      referencePhotos: ['/curriculum/leather/design-sketches.jpg', '/curriculum/leather/prototype-process.jpg', '/curriculum/leather/final-custom-bag.jpg'],
      estimatedHours: 30,
      difficulty: 'advanced',
      category: 'projects',
      subcategory: 'design',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Product design process for leather goods',
        'From concept to prototype - design thinking',
        'Portfolio documentation techniques',
      ],
      crossReferences: [
        'LW-3.1.1: Advanced Pattern Making',
        'LW-3.3.2: Lining Techniques',
        'LW-3.4.2: Reinforcement Techniques',
      ],
    },
    {
      level: 3,
      moduleNumber: '3.6',
      assignmentNumber: 'LW-3.6.2',
      orderIndex: 36,
      title: 'Level 3 Final: Professional Leather Backpack',
      description: 'Synthesize all Level 3 skills to create a full-size professional backpack with laptop sleeve, organization pockets, padded straps, and water resistance.',
      instructions: `1. Design professional backpack: 18" × 14" × 7", laptop sleeve, multiple compartments, ergonomic
2. Create complete pattern set: main panels, gussets, straps, pockets, dividers, flap
3. Build padded laptop compartment: fits 15" laptop, foam padded, soft lining
4. Create front organizer panel: pockets for phone, wallet, pens, cables, sunglasses
5. Build main compartment: large interior, side access if desired, water-resistant lining
6. Create ergonomic shoulder straps: S-curved, padded, breathable mesh back
7. Add sternum strap and waist belt: load distribution, adjustable, removable
8. Install compression straps: sides and bottom, adjust load, attach gear
9. Add water bottle pockets: stretch panels or open pockets on sides
10. Finish all edges, add reflective elements, test with 25 lb load for comfort`,
      objectives: [
        'Design full-featured backpack',
        'Execute complex multi-compartment construction',
        'Create ergonomic strap system',
        'Build laptop protection',
        'Add organizational features',
        'Demonstrate mastery of Level 3 skills',
      ],
      skills: ['Advanced bag construction', 'Ergonomic design', 'Complex assembly', 'Load distribution', 'Organizational systems', 'Professional finishing'],
      expectedOutcome: 'Completed professional backpack with laptop sleeve, organized pockets, ergonomic straps, water-resistant, comfortable with 25 lb load.',
      passingCriteria: 'All compartments functional, laptop fits securely, straps distribute weight well, backpack is comfortable, organization is practical, professional quality',
      referencePhotos: ['/curriculum/leather/professional-backpack-pattern.jpg', '/curriculum/leather/ergonomic-straps.jpg', '/curriculum/leather/completed-backpack.jpg'],
      estimatedHours: 40,
      difficulty: 'advanced',
      category: 'projects',
      subcategory: 'bags',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"Backpack Design and Construction" - professional methods',
        'Ergonomics in bag design',
        'Load distribution and comfort engineering',
      ],
      crossReferences: [
        'LW-3.4.1: Backpack Construction Fundamentals',
        'LW-3.3.2: Lining Techniques',
        'LW-3.4.2: Reinforcement Techniques',
        'LW-3.3.1: Hardware Installation',
      ],
    },

    // ========================================================================
    // LEVEL 4: SHOE MAKING FUNDAMENTALS
    // ========================================================================
    {
      level: 4,
      moduleNumber: '4.1',
      assignmentNumber: 'LW-4.1.1',
      orderIndex: 37,
      title: 'Introduction to Shoe Lasts & Sizing',
      description: 'Learn about shoe lasts, sizing systems, foot anatomy, and how lasts determine shoe fit and comfort.',
      instructions: `1. Study foot anatomy: arch, heel, ball, toe box, instep, understanding pressure points
2. Learn shoe sizing systems: US, UK, EU, Mondopoint, women vs men sizes
3. Study last anatomy: toe spring, heel height, instep, ball position, last length
4. Practice measuring feet: length, width, arch length, instep height
5. Learn last types: straight, curved, semi-curved, left vs right specific
6. Study last materials: wood, plastic, aluminum, adjustable lasts
7. Practice last fitting: add padding, adjust fit, customize for specific feet
8. Create foot measurement chart: standard measurements for common sizes
9. Learn to select appropriate last: match last to desired shoe style and foot shape
10. Acquire or make simple last: beginner-friendly last for practice projects`,
      objectives: [
        'Understand foot anatomy and pressure points',
        'Learn sizing systems and conversions',
        'Identify last components and purposes',
        'Measure feet accurately',
        'Select appropriate last for project',
        'Prepare last for shoe making',
      ],
      skills: ['Foot anatomy', 'Last knowledge', 'Sizing systems', 'Measurement techniques', 'Last selection', 'Fit analysis'],
      expectedOutcome: 'Foot measurement chart completed, understanding of sizing systems demonstrated, appropriate last selected and prepared for use.',
      passingCriteria: 'Can accurately measure feet, understand last anatomy, select appropriate last for foot shape, explain sizing system conversions',
      referencePhotos: ['/curriculum/leather/foot-anatomy.jpg', '/curriculum/leather/shoe-lasts.jpg', '/curriculum/leather/measuring-feet.jpg'],
      estimatedHours: 8,
      difficulty: 'advanced',
      category: 'footwear',
      subcategory: 'fundamentals',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"Handmade Shoes for Men" by László Vass - last section',
        '"The Shoe Book" by Nancy Lawson - sizing chapter',
        'Shoe last anatomy and selection guides',
      ],
    },
    {
      level: 4,
      moduleNumber: '4.1',
      assignmentNumber: 'LW-4.1.2',
      orderIndex: 38,
      title: 'Shoe Pattern Development',
      description: 'Learn to create shoe patterns from lasts, develop upper patterns, and understand pattern grading for different sizes.',
      instructions: `1. Study basic shoe upper components: vamp, quarter, tongue, lining, toe cap, heel counter
2. Learn to tape up last: masking tape, draw pattern lines on tape, establish seam placement
3. Practice removing tape pattern: carefully cut and remove, flatten on paper
4. Transfer pattern to paper: trace, add seam allowance, label all pieces
5. Learn pattern piece identification: vamp, quarters (inside/outside), tongue, lining pieces
6. Study pattern grading basics: how patterns change with size, proportion rules
7. Create test pattern in scrap leather: cut pieces, assemble on last, check fit
8. Refine pattern based on test: adjust for better fit, ease of construction
9. Create final pattern templates: transfer to durable template material, label permanently
10. Document pattern with construction notes: assembly order, seam types, special techniques`,
      objectives: [
        'Develop patterns from lasts',
        'Create accurate upper patterns',
        'Test and refine patterns',
        'Understand pattern components',
        'Make durable pattern templates',
        'Document construction process',
      ],
      skills: ['Pattern development', 'Last taping', 'Pattern drafting', 'Test fitting', 'Pattern refinement', 'Template creation'],
      expectedOutcome: 'Complete shoe upper pattern set with all components, tested and refined, transferred to permanent templates, construction notes included.',
      passingCriteria: 'Pattern pieces fit last accurately, seam allowances correct, all pieces labeled, templates are durable, construction notes are clear',
      referencePhotos: ['/curriculum/leather/last-taping.jpg', '/curriculum/leather/pattern-development.jpg', '/curriculum/leather/shoe-patterns.jpg'],
      estimatedHours: 12,
      difficulty: 'advanced',
      category: 'footwear',
      subcategory: 'patterns',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"Shoemaking" by Will Weston - pattern chapter',
        'Shoe pattern development from lasts',
        'Pattern grading for shoes',
      ],
    },
    {
      level: 4,
      moduleNumber: '4.2',
      assignmentNumber: 'LW-4.2.1',
      orderIndex: 39,
      title: 'Upper Construction: Sandal',
      description: 'Create a simple leather sandal with straps, learning to work with sole attachment, strap construction, and footbed comfort.',
      instructions: `1. Design sandal: identify strap placement for secure fit, footbed shaping, sole attachment
2. Create pattern: footbed, sole, multiple strap pieces, toe loop or ankle strap
3. Cut leather pieces: 4-6 oz for straps, footbed can be layered for comfort
4. Create comfortable footbed: consider arch support, contoured footbed, soft top layer
5. Construct straps: skive ends, finish edges, add adjustment holes if needed
6. Attach straps to footbed: rivet or stitch securely, test placement for comfort
7. Add buckles or closures: ankle strap adjustability, secure closure
8. Attach sole: glue and stitch sole to footbed, or use sandal-specific attachment
9. Finish all edges: straps, footbed edge, sole edge if exposed
10. Test fit and comfort: wear for extended period, adjust strap placement if needed`,
      objectives: [
        'Design comfortable sandal',
        'Create contoured footbed',
        'Construct and attach straps',
        'Execute sole attachment',
        'Ensure secure fit',
        'Complete wearable sandal',
      ],
      skills: ['Sandal construction', 'Footbed shaping', 'Strap design', 'Sole attachment', 'Comfort engineering', 'Adjustable closures'],
      expectedOutcome: 'Completed wearable leather sandal with comfortable footbed, secure straps, attached sole, adjustable closure, finished edges.',
      passingCriteria: 'Sandal fits securely, footbed is comfortable, straps distribute pressure evenly, sole is firmly attached, can be worn for walking',
      referencePhotos: ['/curriculum/leather/sandal-design.jpg', '/curriculum/leather/footbed-construction.jpg', '/curriculum/leather/completed-sandal.jpg'],
      estimatedHours: 10,
      difficulty: 'advanced',
      category: 'projects',
      subcategory: 'footwear',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Sandal making basics - various sources',
        'Footbed design for comfort',
        'Strap placement and fit',
      ],
    },
    {
      level: 4,
      moduleNumber: '4.2',
      assignmentNumber: 'LW-4.2.2',
      orderIndex: 40,
      title: 'Sole Attachment Methods',
      description: 'Learn various methods of attaching soles to uppers including cemented, stitched, and combination methods.',
      instructions: `1. Study sole attachment methods: cemented, blake stitch, goodyear welt, hand-welted, turnshoe
2. Learn cement method: sole cement application, pressing, curing time, durable casual shoes
3. Practice blake stitch: uppers stitched directly to sole from inside, machine or hand
4. Study stitch-and-cement: combination method, glue plus stitching for strength
5. Learn rapid stitch: visible stitching around sole edge, decorative and functional
6. Practice sole preparation: roughing outsole, deglazing, proper adhesion surface
7. Learn upper preparation: lasting process, shaping upper to last before sole attachment
8. Create sample sole attachments: demonstrate each method on test pieces
9. Study sole types: leather sole, rubber sole, crepe, vibram, when to use each
10. Attach sole using three different methods: cement, rapid stitch, combination`,
      objectives: [
        'Understand sole attachment methods',
        'Execute cemented sole attachment',
        'Perform rapid stitch technique',
        'Prepare surfaces for adhesion',
        'Select appropriate method for shoe type',
        'Complete durable sole attachments',
      ],
      skills: ['Sole attachment', 'Cement method', 'Rapid stitching', 'Surface preparation', 'Lasting basics', 'Construction methods'],
      expectedOutcome: 'Sample pieces demonstrating three sole attachment methods. Understanding of when to use each method. Properly attached soles with good adhesion.',
      passingCriteria: 'Soles are firmly attached, appropriate method selected for each application, no gaps or lifting, stitching is even, adhesion is strong',
      referencePhotos: ['/curriculum/leather/sole-methods.jpg', '/curriculum/leather/rapid-stitch.jpg', '/curriculum/leather/sole-attachment.jpg'],
      estimatedHours: 14,
      difficulty: 'advanced',
      category: 'footwear',
      subcategory: 'construction',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"The Art and Craft of Shoe Making" - sole construction chapter',
        'Sole attachment methods comparison',
        'Shoe cement and adhesive guide',
      ],
    },
    {
      level: 4,
      moduleNumber: '4.3',
      assignmentNumber: 'LW-4.3.1',
      orderIndex: 41,
      title: 'Moccasin Construction',
      description: 'Create a traditional soft-sole moccasin learning basic shoe construction, upper assembly, and comfortable soft soles.',
      instructions: `1. Study moccasin styles: one-piece, two-piece, pucker toe, plain toe, hard sole vs soft sole
2. Create moccasin pattern: wrap-around style or vamp-and-plug style
3. Select leather: 4-6 oz soft leather for uppers, thick sole leather or double layer
4. Cut pattern pieces: main body, vamp, sole, lace/strap
5. Prepare upper assembly: sew vamp seam, gather pucker at toe if applicable
6. Create lasting stitch: running stitch around foot opening, draw up to fit last
7. Attach sole: stitch upper to sole from exterior, whip stitch or running stitch
8. Add heel: separate heel piece or build up layers for comfort
9. Create lace or strap: leather lace threaded through slits, ankle wrap
10. Test fit and comfort: soft flexible shoe, break-in period, comfortable for indoor wear`,
      objectives: [
        'Understand moccasin construction',
        'Create wrap-around upper',
        'Execute pucker toe technique',
        'Attach soft sole',
        'Create flexible comfortable shoe',
        'Complete traditional moccasin',
      ],
      skills: ['Moccasin construction', 'Soft sole attachment', 'Pucker toe technique', 'Upper gathering', 'Traditional methods', 'Hand stitching'],
      expectedOutcome: 'Completed soft-sole moccasin with gathered upper, stitched sole, comfortable fit, traditional construction, wearable indoors.',
      passingCriteria: 'Moccasin fits comfortably, upper is smoothly gathered, sole is securely stitched, flexible and comfortable, traditional appearance',
      referencePhotos: ['/curriculum/leather/moccasin-pattern.jpg', '/curriculum/leather/pucker-toe.jpg', '/curriculum/leather/completed-moccasin.jpg'],
      estimatedHours: 12,
      difficulty: 'advanced',
      category: 'projects',
      subcategory: 'footwear',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"Moccasins and Their Making" by George Wampler',
        'Traditional moccasin construction techniques',
        'Native American moccasin styles',
      ],
    },
    {
      level: 4,
      moduleNumber: '4.3',
      assignmentNumber: 'LW-4.3.2',
      orderIndex: 42,
      title: 'Shoe Lasting Techniques',
      description: 'Learn the critical process of lasting shoes - shaping the upper to the last before sole attachment - using various methods.',
      instructions: `1. Study lasting process: purpose is to shape upper permanently to last's contours
2. Learn last preparation: cover last with plastic, mark sock line, temporary insole
3. Practice pulling upper onto last: start at heel, work to toe, even tension
4. Learn tacking method: tack upper to insole temporarily, maintain shape during construction
5. Study cement lasting: cement upper directly to temporary insole on last
6. Practice heel lasting: pulling heel leather tight, no wrinkles, smooth counter area
7. Learn toe lasting: pull toe smoothly, avoid puckers, crisp toe shape
8. Study force lasting: use lasting pliers, proper pulling technique, avoid stretching
9. Practice waist lasting: shape at arch area, snug fit, support instep
10. Complete lasted upper: ready for sole attachment, proper shape maintained`,
      objectives: [
        'Understand lasting purpose',
        'Pull upper onto last evenly',
        'Execute tacking method',
        'Create smooth heel lasting',
        'Shape toe properly',
        'Prepare upper for sole attachment',
      ],
      skills: ['Lasting technique', 'Upper shaping', 'Tension control', 'Tacking method', 'Lasting pliers use', 'Shape forming'],
      expectedOutcome: 'Properly lasted upper on last with smooth contours, no wrinkles, even tension, ready for sole attachment.',
      passingCriteria: 'Upper is smoothly pulled, no wrinkles in heel or toe, maintains last shape, properly tacked, ready for next construction step',
      referencePhotos: ['/curriculum/leather/lasting-process.jpg', '/curriculum/leather/heel-lasting.jpg', '/curriculum/leather/lasted-upper.jpg'],
      estimatedHours: 10,
      difficulty: 'advanced',
      category: 'footwear',
      subcategory: 'techniques',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"Handmade Shoes for Men" - lasting chapter',
        'Shoe lasting techniques and tools',
        'Professional lasting methods',
      ],
    },
    {
      level: 4,
      moduleNumber: '4.4',
      assignmentNumber: 'LW-4.4.1',
      orderIndex: 43,
      title: 'Boot Upper Construction',
      description: 'Create a boot upper learning pattern assembly, counter and toe cap installation, and shaft construction.',
      instructions: `1. Design boot upper: ankle boot or tall boot, pattern layout, seam placement
2. Create pattern: vamp, quarters, shaft, lining, toe cap, heel counter
3. Cut all pieces: outer leather, lining, reinforcement pieces
4. Skive and prepare edges: reduce bulk at seams, prepare for assembly
5. Assemble vamp to quarters: stitch main seams, press open, even stitching
6. Install toe cap: between outer and lining, or visible decorative cap
7. Install heel counter: rigid reinforcement between outer and lining, shape heel
8. Add shaft to ankle: stitch quarters to shaft pieces, creating boot height
9. Install zipper or lacing system: accessibility, secure closure
10. Complete upper assembly: join lining, finish top edge, ready for lasting`,
      objectives: [
        'Design and pattern boot upper',
        'Execute multi-piece upper assembly',
        'Install toe cap and heel counter',
        'Create boot shaft',
        'Add closure system',
        'Complete upper ready for lasting',
      ],
      skills: ['Boot upper construction', 'Counter installation', 'Toe cap technique', 'Shaft assembly', 'Zipper installation', 'Multi-piece assembly'],
      expectedOutcome: 'Completed boot upper with installed counter and toe cap, attached shaft, zipper or lacing, ready to last and attach sole.',
      passingCriteria: 'All seams are straight and even, toe cap is positioned correctly, heel counter provides structure, shaft height is correct, closure functions',
      referencePhotos: ['/curriculum/leather/boot-pattern.jpg', '/curriculum/leather/counter-installation.jpg', '/curriculum/leather/boot-upper.jpg'],
      estimatedHours: 16,
      difficulty: 'advanced',
      category: 'projects',
      subcategory: 'footwear',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"Making Handmade Boots" by Randy Miller',
        'Boot construction techniques',
        'Counter and toe cap installation',
      ],
    },
    {
      level: 4,
      moduleNumber: '4.4',
      assignmentNumber: 'LW-4.4.2',
      orderIndex: 44,
      title: 'Welted Shoe Construction',
      description: 'Learn Goodyear welt construction - the traditional method for repairable, durable, high-quality shoes.',
      instructions: `1. Study Goodyear welt construction: welt strip, insole, outsole, how they connect
2. Prepare insole: create rib or holdfast for stitching attachment
3. Last upper: pull upper onto last, tack to insole rib
4. Attach welt strip: stitch upper, insole rib, and welt together (hand or machine)
5. Learn welt stitching technique: lockstitch through all three layers
6. Trim welt to proper width: usually 1/4" to 3/8" exposed
7. Attach midsole: glue midsole to insole area, filler between insole and outsole
8. Attach outsole to welt: rapid stitch or lock stitch around perimeter
9. Finish sole edge: trim, sand, burnish or finish welt edge
10. Remove from last: completed welted shoe, resole-able construction`,
      objectives: [
        'Understand Goodyear welt construction',
        'Attach welt to upper and insole',
        'Execute welt stitching',
        'Attach outsole to welt',
        'Complete durable resoleable shoe',
        'Demonstrate traditional construction',
      ],
      skills: ['Goodyear welt method', 'Welt stitching', 'Traditional construction', 'Resoleable design', 'Professional techniques', 'Sole attachment'],
      expectedOutcome: 'Completed welted shoe demonstrating traditional Goodyear welt construction, resoleable design, professional finish.',
      passingCriteria: 'Welt is securely attached to upper and insole, welt stitching is consistent, outsole firmly attached, construction allows for resoling',
      referencePhotos: ['/curriculum/leather/goodyear-welt.jpg', '/curriculum/leather/welt-stitching.jpg', '/curriculum/leather/welted-shoe.jpg'],
      estimatedHours: 20,
      difficulty: 'advanced',
      category: 'footwear',
      subcategory: 'construction',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"Handmade Shoes for Men" - Goodyear welt chapter',
        'Traditional welt construction methods',
        'Resoleable shoe construction',
      ],
    },
    {
      level: 4,
      moduleNumber: '4.5',
      assignmentNumber: 'LW-4.5.1',
      orderIndex: 45,
      title: 'Shoe Finishing & Polish',
      description: 'Learn professional shoe finishing including edge finishing, burnishing, polishing, and protective treatments.',
      instructions: `1. Study shoe finishing importance: appearance, protection, longevity
2. Learn sole edge preparation: trim flush, sand edges, multiple grits
3. Practice sole edge finishing: ink, paint, or polish, burnish to shine
4. Master heel finishing: stack and shape, sand smooth, finish edge
5. Study leather upper finishing: conditioning, cream, polish, shine
6. Learn color touch-up: edge dye, color matching, feathering technique
7. Practice mirror shine: multiple thin layers of polish, buffing, water method
8. Study protective treatments: waterproofing spray, leather protector, when to apply
9. Learn lace finishing: waxed laces, proper lacing patterns, knot tying
10. Complete full shoe finishing: from raw assembled shoe to polished professional product`,
      objectives: [
        'Finish sole and heel edges',
        'Polish leather to shine',
        'Apply color touch-ups',
        'Execute protective treatments',
        'Create mirror shine',
        'Complete professional finishing',
      ],
      skills: ['Edge finishing', 'Shoe polishing', 'Mirror shine technique', 'Color touch-up', 'Protective treatments', 'Professional presentation'],
      expectedOutcome: 'Completed shoe with finished edges, polished upper, mirror shine achieved, protective treatment applied, professional appearance.',
      passingCriteria: 'Edges are smooth and finished, upper has rich color and shine, polish is evenly applied, no rough areas, professional quality',
      referencePhotos: ['/curriculum/leather/edge-finishing.jpg', '/curriculum/leather/mirror-shine.jpg', '/curriculum/leather/finished-shoe.jpg'],
      estimatedHours: 8,
      difficulty: 'advanced',
      category: 'footwear',
      subcategory: 'finishing',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Shoe polishing and finishing guide',
        '"The Shoe Care Book" - polishing chapter',
        'Mirror shine technique tutorials',
      ],
    },
    {
      level: 4,
      moduleNumber: '4.5',
      assignmentNumber: 'LW-4.5.2',
      orderIndex: 46,
      title: 'Orthopedic Considerations',
      description: 'Learn about common foot issues, orthopedic modifications, and how to design shoes for comfort and foot health.',
      instructions: `1. Study common foot issues: flat feet, high arch, bunions, hammer toes, plantar fasciitis
2. Learn orthopedic modifications: arch support, metatarsal pad, heel cup, toe box shaping
3. Practice adding arch support: built into insole or footbed, custom molded
4. Study pressure point relief: identify areas, add padding, adjust fit
5. Learn about diabetic foot care: seamless interior, soft materials, no pressure points
6. Practice wide toe box construction: accommodate bunions, toe spread, comfort
7. Study heel height and foot health: proper heel height, transition, support
8. Learn custom footbed creation: foam molding, cork footbed, contoured support
9. Practice fitting for specific issues: evaluate foot, recommend modifications
10. Create modified shoe: incorporating orthopedic features for specific foot issue`,
      objectives: [
        'Understand common foot issues',
        'Design for foot health',
        'Add arch support',
        'Modify for pressure relief',
        'Create custom footbeds',
        'Build shoes for specific needs',
      ],
      skills: ['Foot health knowledge', 'Orthopedic modifications', 'Custom footbeds', 'Pressure point relief', 'Supportive design', 'Fitting analysis'],
      expectedOutcome: 'Understanding of foot issues and modifications demonstrated. Sample shoe with orthopedic features added. Custom footbed created.',
      passingCriteria: 'Can identify common foot issues, select appropriate modifications, execute custom footbed, design for comfort and health',
      referencePhotos: ['/curriculum/leather/foot-issues.jpg', '/curriculum/leather/orthopedic-modifications.jpg', '/curriculum/leather/custom-footbed.jpg'],
      estimatedHours: 10,
      difficulty: 'advanced',
      category: 'footwear',
      subcategory: 'fit',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Orthopedic footwear design principles',
        'Common foot problems and solutions',
        'Custom footbed creation methods',
      ],
    },
    {
      level: 4,
      moduleNumber: '4.6',
      assignmentNumber: 'LW-4.6.1',
      orderIndex: 47,
      title: 'Repair & Resoling Techniques',
      description: 'Learn to repair and resole existing shoes, replace heels, fix stitching, and restore worn footwear.',
      instructions: `1. Study common shoe repairs: resoling, heel replacement, stitching repair, upper fixes
2. Learn to remove old sole: cutting, pulling, heat, preserve upper integrity
3. Practice sole replacement: prepare upper, attach new sole, match original method
4. Master heel replacement: remove old heel, prepare, attach new heel, finish
5. Learn stitching repair: restitch seams, reinforce weak areas, match original
6. Practice upper patching: leather patches, color matching, invisible repairs
7. Study zipper replacement: remove old zipper, install new, match original placement
8. Learn stretching techniques: stretch tight shoes, targeted stretching, lasting
9. Practice leather restoration: clean, condition, revive color, restore finish
10. Complete full shoe restoration: resole, repair upper, refinish, like new condition`,
      objectives: [
        'Execute sole replacement',
        'Replace heels',
        'Repair stitching and seams',
        'Patch damaged uppers',
        'Replace zippers',
        'Restore shoes to wearable condition',
      ],
      skills: ['Shoe repair', 'Resoling', 'Heel replacement', 'Stitching repair', 'Upper restoration', 'Complete refurbishment'],
      expectedOutcome: 'Completed shoe restoration with new sole, repaired or replaced components, refinished leather, restored to wearable condition.',
      passingCriteria: 'Sole is properly attached, repairs are secure and invisible, upper is restored, shoe is comfortable and wearable, professional work',
      referencePhotos: ['/curriculum/leather/resoling-process.jpg', '/curriculum/leather/heel-replacement.jpg', '/curriculum/leather/restored-shoe.jpg'],
      estimatedHours: 12,
      difficulty: 'advanced',
      category: 'footwear',
      subcategory: 'repair',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Shoe repair techniques - professional methods',
        'Resoling guide for various constructions',
        'Leather restoration for footwear',
      ],
    },
    {
      level: 4,
      moduleNumber: '4.6',
      assignmentNumber: 'LW-4.6.2',
      orderIndex: 48,
      title: 'Level 4 Final: Complete Leather Boot',
      description: 'Synthesize all Level 4 skills to create a complete pair of wearable leather boots from last to finished product.',
      instructions: `1. Design boot: select style (work boot, dress boot, hiking boot), determine features
2. Create complete patterns: upper components, lining, reinforcements, all pieces
3. Cut all leather pieces: outer leather, lining, toe caps, heel counters
4. Assemble uppers: stitch all seams, install toe caps and heel counters, add closures
5. Last uppers: pull onto lasts, smooth and even, tack securely
6. Attach insoles and welts: execute chosen construction method (cement, welt, or combination)
7. Attach outsoles: glue and stitch, appropriate method for boot style
8. Build and attach heels: stack leather, shape, attach securely, finish
9. Complete all edge finishing: sole edges, heel edges, burnish and polish
10. Remove from last, final finishing: condition, polish, lace, professional presentation`,
      objectives: [
        'Design complete boot from scratch',
        'Execute all pattern development and cutting',
        'Assemble complex upper construction',
        'Last and attach sole properly',
        'Complete professional finishing',
        'Demonstrate mastery of Level 4 skills',
      ],
      skills: ['Complete boot making', 'Upper assembly', 'Lasting', 'Sole attachment', 'Finishing', 'Professional construction'],
      expectedOutcome: 'Completed pair of wearable leather boots demonstrating all Level 4 skills, professional construction, comfortable fit, durable quality.',
      passingCriteria: 'Boots fit properly, construction is sound, all seams secure, soles firmly attached, finishing is professional, comfortable to wear',
      referencePhotos: ['/curriculum/leather/boot-construction-process.jpg', '/curriculum/leather/lasting-and-sole.jpg', '/curriculum/leather/completed-boots.jpg'],
      estimatedHours: 50,
      difficulty: 'advanced',
      category: 'projects',
      subcategory: 'footwear',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"Making Handmade Boots" by Randy Miller',
        '"Handmade Shoes for Men" by László Vass',
        'Complete boot making process documentation',
      ],
      crossReferences: [
        'LW-4.1.2: Shoe Pattern Development',
        'LW-4.3.2: Shoe Lasting Techniques',
        'LW-4.2.2: Sole Attachment Methods',
        'LW-4.5.1: Shoe Finishing & Polish',
      ],
    },

    // ========================================================================
    // LEVEL 5: ADVANCED FOOTWEAR & FURNITURE
    // ========================================================================
    {
      level: 5,
      moduleNumber: '5.1',
      assignmentNumber: 'LW-5.1.1',
      orderIndex: 49,
      title: 'Advanced Boot Making: Tall Boots',
      description: 'Create tall boots (knee-high or higher) learning pattern scaling, shaft support, and maintaining shape over extended height.',
      instructions: `1. Study tall boot construction: shaft support, calf shaping, knee articulation, weight distribution
2. Measure for tall boots: calf circumference, knee height, total height, ankle girth
3. Scale pattern from ankle boot: extend shaft, add shaping darts, calf muscle accommodation
4. Cut all pieces: longer shaft pieces, reinforcements at stress points
5. Create internal support: stiff shank for arch support, heel counter extends higher
6. Assemble shaft with shaping: darts or gussets for calf fit, smooth curves
7. Attach shaft to foot: strong seam, reinforced stitching, proper alignment
8. Last and attach sole: same methods as shorter boots, extra care with height
9. Add closure system: full-length zipper, laces, or combination, easy on/off
10. Finish and condition: tall boots require more leather care, conditioning throughout`,
      objectives: [
        'Scale patterns for tall boots',
        'Create shaped shaft for calf',
        'Provide adequate internal support',
        'Execute long shaft seams',
        'Install full-length closures',
        'Complete wearable tall boots',
      ],
      skills: ['Tall boot construction', 'Pattern scaling', 'Shaft shaping', 'Long zipper installation', 'Internal support systems', 'Advanced lasting'],
      expectedOutcome: 'Completed pair of tall boots (knee-high minimum) with shaped shaft, internal support, full closure, professional finish, comfortable fit.',
      passingCriteria: 'Boots fit properly up entire leg, shaft holds shape, closures function smoothly, adequate support, comfortable for walking',
      referencePhotos: ['/curriculum/leather/tall-boot-pattern.jpg', '/curriculum/leather/shaft-shaping.jpg', '/curriculum/leather/completed-tall-boots.jpg'],
      estimatedHours: 40,
      difficulty: 'expert',
      category: 'projects',
      subcategory: 'footwear',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Tall boot construction techniques',
        'Shaft shaping and support methods',
        'Long zipper installation in boots',
      ],
      crossReferences: [
        'LW-4.4.1: Boot Upper Construction',
        'LW-4.6.2: Complete Leather Boot',
      ],
    },
    {
      level: 5,
      moduleNumber: '5.1',
      assignmentNumber: 'LW-5.1.2',
      orderIndex: 50,
      title: 'Dress Shoe Construction',
      description: 'Create elegant dress shoes with refined details, high-quality finishing, and traditional construction methods.',
      instructions: `1. Study dress shoe aesthetics: sleek lines, minimal decoration, quality materials, refined proportions
2. Select premium leather: calf leather for uppers, quality sole leather, luxury lining
3. Create dress shoe pattern: oxford, derby, or monk strap style, refined proportions
4. Cut pieces with precision: extremely accurate cutting, minimal waste, quality selection
5. Assemble upper with fine stitching: small stitch spacing, perfect alignment, hidden seams where possible
6. Last with extreme care: smooth pulls, no wrinkles, perfect toe shape, crisp lines
7. Execute Goodyear welt: traditional method, fine stitching, narrow welt
8. Attach premium outsole: leather sole, tight stitching, flush trim
9. Finish to luxury standard: mirror polish, perfect edge finish, premium laces
10. Present in shoe box: tissue paper, care instructions, luxury presentation`,
      objectives: [
        'Execute refined dress shoe design',
        'Work with premium materials',
        'Achieve luxury-level finishing',
        'Master subtle proportions',
        'Create investment-quality footwear',
        'Present professionally',
      ],
      skills: ['Dress shoe construction', 'Premium material handling', 'Luxury finishing', 'Refined proportions', 'Traditional methods', 'Presentation'],
      expectedOutcome: 'Pair of dress shoes with refined design, premium materials, luxury finishing, mirror polish, suitable for formal wear.',
      passingCriteria: 'Shoes have sleek proportions, premium materials throughout, mirror polish achieved, no visible flaws, luxury quality throughout',
      referencePhotos: ['/curriculum/leather/dress-shoe-lasts.jpg', '/curriculum/leather/luxury-finishing.jpg', '/curriculum/leather/completed-dress-shoes.jpg'],
      estimatedHours: 50,
      difficulty: 'expert',
      category: 'projects',
      subcategory: 'footwear',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        '"Handmade Shoes for Men" by László Vass - dress shoe chapter',
        'Luxury shoe finishing techniques',
        'Premium leather selection guide',
      ],
    },
    {
      level: 5,
      moduleNumber: '5.2',
      assignmentNumber: 'LW-5.2.1',
      orderIndex: 51,
      title: 'Leather Furniture: Seat Cushion',
      description: 'Create a leather seat cushion learning upholstery basics, foam padding, and furniture-grade construction.',
      instructions: `1. Study seat cushion construction: foam core, leather cover, attachment methods, durability
2. Measure existing seat or create dimensions: width, depth, thickness, shape
3. Select materials: furniture-grade leather (thick, durable), high-density foam, batting
4. Cut foam to size: electric knife or foam cutter, smooth edges, proper density
5. Wrap foam in batting: creates smooth surface, prevents foam breakdown
6. Create leather cover pattern: top, bottom, boxing strip (sides), seam allowance
7. Cut leather pieces: grain direction considered, quality selection
8. Sew cover: industrial sewing machine, heavy thread, strong seams
9. Insert foam into cover: tight fit, smooth surface, no wrinkles
10. Attach to seat base: staples, screws, or straps, secure attachment, test durability`,
      objectives: [
        'Understand upholstery basics',
        'Work with foam padding',
        'Create furniture-grade leather cover',
        'Execute tight upholstery',
        'Attach cushion securely',
        'Complete durable seat cushion',
      ],
      skills: ['Upholstery basics', 'Foam cutting', 'Furniture leather selection', 'Industrial sewing', 'Cushion construction', 'Attachment methods'],
      expectedOutcome: 'Completed leather seat cushion with high-density foam, smooth leather cover, secure attachment, comfortable and durable.',
      passingCriteria: 'Cushion is smooth and even, leather is taut without wrinkles, attachment is secure, comfortable to sit on, durable construction',
      referencePhotos: ['/curriculum/leather/cushion-construction.jpg', '/curriculum/leather/foam-wrapping.jpg', '/curriculum/leather/completed-cushion.jpg'],
      estimatedHours: 12,
      difficulty: 'expert',
      category: 'projects',
      subcategory: 'furniture',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Upholstery basics for leather',
        'Foam selection and cutting',
        'Furniture-grade leather characteristics',
      ],
    },
    {
      level: 5,
      moduleNumber: '5.2',
      assignmentNumber: 'LW-5.2.2',
      orderIndex: 52,
      title: 'Leather Upholstery Techniques',
      description: 'Learn professional upholstery techniques including stretching, stapling, piping, and creating smooth surfaces.',
      instructions: `1. Study upholstery tools: staple gun, tack hammer, upholstery needles, stretching pliers
2. Learn leather stretching: pull evenly, work from center out, no wrinkles
3. Practice stapling technique: proper angle, depth, spacing, hidden placement
4. Create piping: cord wrapped in leather strip, sewn into seams, professional edge
5. Learn double-welt technique: two cords for heavy-duty furniture, structural and decorative
6. Practice pleating and gathering: decorative techniques, even spacing, secure stitching
7. Study diamond tufting basics: button placement, depth control, pattern symmetry
8. Learn edge treatments: blind stitching, fold-over edges, clean finishes
9. Practice on sample board: demonstrate all techniques on test piece
10. Complete upholstered ottoman: apply all techniques, professional result`,
      objectives: [
        'Master leather stretching',
        'Execute professional stapling',
        'Create and install piping',
        'Perform edge treatments',
        'Understand tufting basics',
        'Complete upholstered piece',
      ],
      skills: ['Leather stretching', 'Professional stapling', 'Piping creation', 'Edge treatments', 'Tufting basics', 'Upholstery tools'],
      expectedOutcome: 'Sample board demonstrating all upholstery techniques and completed ottoman applying these skills professionally.',
      passingCriteria: 'All techniques correctly demonstrated, leather is smooth and taut, piping is even, edges are clean, ottoman is professional quality',
      referencePhotos: ['/curriculum/leather/upholstery-techniques.jpg', '/curriculum/leather/piping-detail.jpg', '/curriculum/leather/upholstered-ottoman.jpg'],
      estimatedHours: 16,
      difficulty: 'expert',
      category: 'techniques',
      subcategory: 'upholstery',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Professional upholstery techniques',
        'Piping and welt construction',
        'Leather furniture upholstery guide',
      ],
    },
    {
      level: 5,
      moduleNumber: '5.3',
      assignmentNumber: 'LW-5.3.1',
      orderIndex: 53,
      title: 'Leather Chair Construction',
      description: 'Build a complete leather chair from frame to finished upholstery, integrating woodworking and leather working skills.',
      instructions: `1. Design chair: style selection (dining, accent, office), dimensions, leather placement
2. Build or source frame: wood or metal frame, structural integrity, upholstery-ready
3. Add webbing or spring system: seat support, tension, durability
4. Install base padding: foam, batting, proper density for use
5. Create pattern for each section: seat, back, arms (if applicable), pattern each separately
6. Cut leather pieces: quality selection, grain direction, minimize waste
7. Upholster seat: stretch and staple, smooth surface, no wrinkles
8. Upholster back: align pattern (if applicable), proper tension, clean edges
9. Add decorative elements: nailhead trim, tufting, piping as designed
10. Final assembly: attach all components, test structure, quality check`,
      objectives: [
        'Design complete chair',
        'Integrate frame and upholstery',
        'Execute multi-section upholstery',
        'Add decorative elements',
        'Create functional furniture',
        'Ensure structural integrity',
      ],
      skills: ['Chair construction', 'Frame integration', 'Multi-section upholstery', 'Decorative elements', 'Structural design', 'Furniture assembly'],
      expectedOutcome: 'Completed leather chair with solid frame, professionally upholstered surfaces, decorative elements, comfortable and durable.',
      passingCriteria: 'Chair is structurally sound, all upholstery smooth and taut, decorative elements properly applied, comfortable to sit in, professional quality',
      referencePhotos: ['/curriculum/leather/chair-frame.jpg', '/curriculum/leather/chair-upholstery.jpg', '/curriculum/leather/completed-chair.jpg'],
      estimatedHours: 35,
      difficulty: 'expert',
      category: 'projects',
      subcategory: 'furniture',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Chair frame construction basics',
        'Multi-section upholstery techniques',
        'Decorative furniture elements',
      ],
    },
    {
      level: 5,
      moduleNumber: '5.3',
      assignmentNumber: 'LW-5.3.2',
      orderIndex: 54,
      title: 'Tufting & Buttoning Techniques',
      description: 'Master diamond tufting and button placement for creating luxurious tufted leather furniture and headboards.',
      instructions: `1. Study tufting patterns: diamond, biscuit, square, channel tufting, aesthetic and structural
2. Learn button types: covered buttons, nail-head buttons, custom leather buttons
3. Create covered buttons: leather over button forms, smooth wrapping, secure backing
4. Mark tufting pattern: precise measurement, symmetrical layout, pattern template
5. Drill holes in backing: correct size for button attachment, pattern alignment
6. Prepare padding: extra-deep foam for tufting depth, cuts between buttons
7. Attach buttons from back: twine through padding and leather, secure knot, even tension
8. Create tufting depth: pull each button to consistent depth, create valleys
9. Pleat fabric between buttons: even folds, symmetrical pattern, secure pleats
10. Complete tufted headboard: full pattern execution, professional finish, mounted`,
      objectives: [
        'Execute diamond tufting pattern',
        'Create covered buttons',
        'Maintain consistent tufting depth',
        'Create even pleating',
        'Complete tufted project',
        'Achieve luxury appearance',
      ],
      skills: ['Diamond tufting', 'Button covering', 'Pattern layout', 'Depth control', 'Pleating technique', 'Luxury finishing'],
      expectedOutcome: 'Completed tufted leather headboard with symmetrical diamond pattern, covered buttons, consistent depth, professional luxury finish.',
      passingCriteria: 'Pattern is perfectly symmetrical, all buttons at same depth, pleats are even, leather is smooth, luxury quality achieved',
      referencePhotos: ['/curriculum/leather/tufting-pattern.jpg', '/curriculum/leather/button-placement.jpg', '/curriculum/leather/tufted-headboard.jpg'],
      estimatedHours: 20,
      difficulty: 'expert',
      category: 'techniques',
      subcategory: 'upholstery',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Diamond tufting comprehensive guide',
        'Button covering techniques',
        'Luxury upholstery methods',
      ],
    },
    {
      level: 5,
      moduleNumber: '5.4',
      assignmentNumber: 'LW-5.4.1',
      orderIndex: 55,
      title: 'Exotic Leather Working',
      description: 'Learn to work with exotic leathers including alligator, ostrich, python, and stingray, understanding their unique properties.',
      instructions: `1. Study exotic leather regulations: CITES, legal sourcing, documentation requirements
2. Learn exotic leather properties: alligator (tile pattern), ostrich (quill marks), python (scales), stingray (bumpy)
3. Study cutting techniques: work with scale direction, avoid waste, maximize pattern
4. Learn edge finishing for exotics: some cannot be burnished, edge paint required
5. Practice stitching exotics: pre-punch all holes, scales can be brittle, careful tension
6. Study exotic leather care: special conditioning, water sensitivity, storage
7. Create small project in alligator: wallet or card holder, showcase tile pattern
8. Create project in ostrich: utilize quill marks decoratively, smooth areas
9. Study pricing and sourcing: exotic leathers are expensive, quality grading
10. Complete exotic leather portfolio piece: demonstrate understanding of unique properties`,
      objectives: [
        'Understand exotic leather regulations',
        'Work with unique leather properties',
        'Execute appropriate techniques for each type',
        'Create exotic leather projects',
        'Source legally and ethically',
        'Demonstrate material knowledge',
      ],
      skills: ['Exotic leather knowledge', 'Legal compliance', 'Specialized techniques', 'Material sourcing', 'Unique properties handling', 'Luxury materials'],
      expectedOutcome: 'Completed projects in 2+ exotic leathers demonstrating understanding of each material\'s unique properties and appropriate techniques.',
      passingCriteria: 'Projects showcase exotic leathers properly, techniques appropriate for material, legal sourcing documented, professional execution',
      referencePhotos: ['/curriculum/leather/exotic-leathers.jpg', '/curriculum/leather/alligator-wallet.jpg', '/curriculum/leather/ostrich-project.jpg'],
      estimatedHours: 16,
      difficulty: 'expert',
      category: 'materials',
      subcategory: 'exotic',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'CITES regulations for exotic leathers',
        'Exotic leather working guide',
        'Legal sourcing and documentation',
      ],
    },
    {
      level: 5,
      moduleNumber: '5.4',
      assignmentNumber: 'LW-5.4.2',
      orderIndex: 56,
      title: 'Advanced Surface Treatments',
      description: 'Master advanced leather finishing including antiquing, distressing, embossing, foiling, and custom textures.',
      instructions: `1. Study antiquing techniques: gel vs liquid, color selection, highlight wiping, depth creation
2. Learn controlled distressing: natural wear patterns, edge scuffing, color variation
3. Practice embossing: heat embossing, blind embossing, foil embossing, pressure control
4. Learn foil application: heat-activated foil, pattern placement, adhesion control
5. Study resist dyeing: wax resist, masked areas, multi-color effects
6. Practice airbrush techniques: color gradients, stenciled patterns, controlled overspray
7. Learn texture creation: stamping, carving, molding, surface manipulation
8. Study protective finishes: maintain texture while protecting, appropriate sealers
9. Create sample board: demonstrate 8+ advanced surface treatments
10. Execute custom project: combine multiple techniques, original design, professional finish`,
      objectives: [
        'Master antiquing techniques',
        'Create controlled distressing',
        'Execute embossing and foiling',
        'Use airbrushing effectively',
        'Create custom textures',
        'Combine multiple techniques',
      ],
      skills: ['Antiquing', 'Distressing', 'Embossing', 'Foil application', 'Airbrushing', 'Surface texturing', 'Creative finishing'],
      expectedOutcome: 'Sample board with 8+ surface treatments and custom project combining multiple techniques to create unique artistic piece.',
      passingCriteria: 'All techniques correctly executed, effects are controlled and intentional, custom project shows creativity, professional quality',
      referencePhotos: ['/curriculum/leather/surface-treatments.jpg', '/curriculum/leather/embossing-foiling.jpg', '/curriculum/leather/artistic-finish.jpg'],
      estimatedHours: 18,
      difficulty: 'expert',
      category: 'techniques',
      subcategory: 'finishing',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Advanced leather finishing techniques',
        'Embossing and foiling guide',
        'Creative surface treatments',
      ],
    },
    {
      level: 5,
      moduleNumber: '5.5',
      assignmentNumber: 'LW-5.5.1',
      orderIndex: 57,
      title: 'Leather Furniture: Ottoman',
      description: 'Create a complete leather ottoman with internal structure, padding, upholstery, and optional storage.',
      instructions: `1. Design ottoman: size, shape (square, round, rectangular), storage vs solid
2. Build frame: wood frame, structural integrity, upholstery-ready
3. Add optional storage: hinged top, internal box, safe hinge placement
4. Create webbing or base: seat support, tension, appropriate for use
5. Add foam layers: high-density base, softer top, proper heights
6. Wrap in batting: smooth transition, edge padding, no hard corners
7. Create leather cover pattern: top, sides, boxing if needed, piping
8. Cut and prepare leather: quality selection, grain direction
9. Upholster ottoman: stretch evenly, staple securely, piping at seams, clean edges
10. Add feet or base: screw-in furniture feet, glides, or upholstered base, finish touches`,
      objectives: [
        'Design functional ottoman',
        'Build structural frame',
        'Execute padding layers',
        'Create fitted leather cover',
        'Apply upholstery techniques',
        'Complete furniture piece',
      ],
      skills: ['Ottoman construction', 'Frame building', 'Multi-layer padding', 'Fitted upholstery', 'Furniture finishing', 'Optional storage integration'],
      expectedOutcome: 'Completed leather ottoman with solid frame, comfortable padding, professionally upholstered, optional storage, functional furniture.',
      passingCriteria: 'Ottoman is structurally sound, padding is comfortable, leather is smooth and taut, all edges clean, feet attached securely',
      referencePhotos: ['/curriculum/leather/ottoman-frame.jpg', '/curriculum/leather/ottoman-upholstery.jpg', '/curriculum/leather/completed-ottoman.jpg'],
      estimatedHours: 24,
      difficulty: 'expert',
      category: 'projects',
      subcategory: 'furniture',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Ottoman construction guide',
        'Furniture frame building',
        'Professional upholstery methods',
      ],
      crossReferences: [
        'LW-5.2.1: Seat Cushion',
        'LW-5.2.2: Upholstery Techniques',
      ],
    },
    {
      level: 5,
      moduleNumber: '5.5',
      assignmentNumber: 'LW-5.5.2',
      orderIndex: 58,
      title: 'Leather Furniture: Accent Chair',
      description: 'Create a complete accent chair with arms, decorative elements, and luxury finishing.',
      instructions: `1. Design accent chair: style (mid-century, traditional, modern), dimensions, decorative elements
2. Source or build frame: arms, legs, back support, structural integrity
3. Plan upholstery approach: inside back, outside back, seat, inside arms, outside arms
4. Add support systems: webbing, springs, foam layers for each section
5. Create pattern for all sections: measure each area, add seam allowance, match grain
6. Cut all leather pieces: quality selection, grain direction, pattern matching if applicable
7. Upholster seat first: foundation for other sections, proper support
8. Upholster inside sections: back and arms, smooth surfaces, proper tension
9. Apply decorative elements: nailhead trim, tufting, piping, welt cord
10. Upholster outside sections: clean finish, hidden seams, professional back, attach legs`,
      objectives: [
        'Design complete accent chair',
        'Execute multi-section upholstery',
        'Create decorative elements',
        'Achieve professional finishing',
        'Complete luxury furniture piece',
        'Demonstrate all Level 5 skills',
      ],
      skills: ['Accent chair construction', 'Multi-section upholstery', 'Decorative trim', 'Arms upholstery', 'Professional back finishing', 'Luxury furniture'],
      expectedOutcome: 'Completed leather accent chair with arms, decorative elements, professional upholstery throughout, comfortable and beautiful.',
      passingCriteria: 'Chair is comfortable, all upholstery smooth and professional, decorative elements properly applied, structurally sound, luxury quality',
      referencePhotos: ['/curriculum/leather/accent-chair-design.jpg', '/curriculum/leather/chair-upholstery-process.jpg', '/curriculum/leather/completed-accent-chair.jpg'],
      estimatedHours: 40,
      difficulty: 'expert',
      category: 'projects',
      subcategory: 'furniture',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Accent chair construction',
        'Arms upholstery techniques',
        'Luxury furniture finishing',
      ],
    },
    {
      level: 5,
      moduleNumber: '5.6',
      assignmentNumber: 'LW-5.6.1',
      orderIndex: 59,
      title: 'Custom Furniture Project',
      description: 'Design and create an original leather furniture piece applying all Level 5 skills and demonstrating creativity.',
      instructions: `1. Develop original furniture concept: identify need, unique design, functionality
2. Create detailed design drawings: multiple views, dimensions, material list
3. Build or source frame: custom fabrication or modification, structural planning
4. Develop complete pattern set: all sections measured and patterned
5. Source all materials: leather, foam, webbing, hardware, decorative elements
6. Build prototype or mock-up: test design, identify issues, refine
7. Execute final version: apply all learned techniques, professional execution
8. Add unique elements: showcase specialty skills, creative solutions
9. Complete finishing: luxury-level detail, perfect execution
10. Document process: photos, notes, lessons learned, portfolio piece`,
      objectives: [
        'Design original furniture',
        'Execute complete project independently',
        'Solve design challenges',
        'Apply all Level 5 skills',
        'Create portfolio piece',
        'Demonstrate creativity and mastery',
      ],
      skills: ['Furniture design', 'Problem solving', 'Creative application', 'Independent execution', 'Portfolio development', 'Professional documentation'],
      expectedOutcome: 'Completed original leather furniture piece demonstrating all Level 5 skills, creativity, and professional execution with full documentation.',
      passingCriteria: 'Design is original and functional, all techniques correctly applied, professional quality throughout, well-documented, portfolio-ready',
      referencePhotos: ['/curriculum/leather/custom-furniture-design.jpg', '/curriculum/leather/custom-build-process.jpg', '/curriculum/leather/completed-custom-furniture.jpg'],
      estimatedHours: 50,
      difficulty: 'expert',
      category: 'projects',
      subcategory: 'furniture',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Furniture design principles',
        'Portfolio development for craftspeople',
        'Creative problem solving in crafts',
      ],
    },
    {
      level: 5,
      moduleNumber: '5.6',
      assignmentNumber: 'LW-5.6.2',
      orderIndex: 60,
      title: 'Level 5 Final: Leather Lounge Chair',
      description: 'Synthesize all Level 5 skills to create a complete leather lounge chair with recline function, luxury details, and investment-quality construction.',
      instructions: `1. Design lounge chair: comfort-focused, reclining mechanism optional, luxury materials
2. Source reclining mechanism: manual or powered, weight capacity, smooth operation
3. Build or adapt frame: integrate mechanism, structural support, quality materials
4. Plan comprehensive padding: multi-density foam, lumbar support, headrest, comfort zones
5. Create patterns for all sections: seat, back, arms, headrest, sides, pattern complexity
6. Select premium leather: quality grading, sufficient yardage, color selection
7. Execute upholstery: all sections professionally done, pattern matching, seam alignment
8. Install decorative elements: tufting, nailhead trim, piping, luxury details
9. Integrate mechanism: smooth reclining, secure attachment, operational testing
10. Final finishing: condition leather, quality check all details, test comfort and function`,
      objectives: [
        'Create luxury lounge chair',
        'Integrate reclining mechanism',
        'Execute complex upholstery',
        'Apply all decorative skills',
        'Achieve investment-quality result',
        'Demonstrate mastery of Level 5',
      ],
      skills: ['Lounge chair construction', 'Mechanism integration', 'Complex upholstery', 'Luxury finishing', 'Comfort engineering', 'Quality control'],
      expectedOutcome: 'Completed leather lounge chair with optional recline, luxury upholstery, decorative elements, investment quality, comfortable and beautiful.',
      passingCriteria: 'Chair is extremely comfortable, mechanism works smoothly, upholstery is flawless, decorative elements perfect, investment-quality throughout',
      referencePhotos: ['/curriculum/leather/lounge-chair-design.jpg', '/curriculum/leather/mechanism-integration.jpg', '/curriculum/leather/completed-lounge-chair.jpg'],
      estimatedHours: 60,
      difficulty: 'expert',
      category: 'projects',
      subcategory: 'furniture',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Lounge chair construction guide',
        'Reclining mechanism integration',
        'Investment-quality furniture standards',
      ],
      crossReferences: [
        'LW-5.3.1: Leather Chair Construction',
        'LW-5.3.2: Tufting & Buttoning',
        'LW-5.5.2: Accent Chair',
      ],
    },

    // ========================================================================
    // LEVEL 6: BUSINESS & PRODUCTION
    // ========================================================================
    {
      level: 6,
      moduleNumber: '6.1',
      assignmentNumber: 'LW-6.1.1',
      orderIndex: 61,
      title: 'Workshop Efficiency & Production Flow',
      description: 'Optimize workshop layout and workflow for efficient production, minimizing waste and maximizing productivity.',
      instructions: `1. Study production workflow: material flow, workstation arrangement, minimize movement
2. Analyze current workspace: identify bottlenecks, wasted motion, inefficiencies
3. Design optimized layout: group similar tasks, logical flow, efficient material storage
4. Implement cutting station: pattern storage, cutting mat, tool organization, scrap management
5. Set up stitching zone: machine access, hand-stitching area, thread organization
6. Create finishing area: separate from cutting (avoid dust), all finishing supplies accessible
7. Organize material storage: leather flat or rolled, sorted by type/color, easy access
8. Implement work-in-progress system: designated area, project tracking, priority management
9. Establish quality control checkpoint: final inspection before completion, standards checklist
10. Document workflow: visual diagram, train others if applicable, continuous improvement`,
      objectives: [
        'Analyze workflow efficiency',
        'Design optimized workshop layout',
        'Implement production zones',
        'Organize material storage',
        'Create work tracking system',
        'Establish quality control',
      ],
      skills: ['Workflow analysis', 'Space optimization', 'Production efficiency', 'Material management', 'Quality systems', 'Process improvement'],
      expectedOutcome: 'Optimized workshop with logical flow, organized materials, efficient workstations, quality control checkpoint, documented workflow.',
      passingCriteria: 'Workshop layout is logical, material flow is efficient, all zones are organized, quality system is in place, productivity improved',
      referencePhotos: ['/curriculum/leather/workshop-layout.jpg', '/curriculum/leather/production-zones.jpg', '/curriculum/leather/efficient-workspace.jpg'],
      estimatedHours: 12,
      difficulty: 'expert',
      category: 'business',
      subcategory: 'operations',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Lean manufacturing principles for small shops',
        'Workshop organization for craftspeople',
        'Production efficiency techniques',
      ],
    },
    {
      level: 6,
      moduleNumber: '6.1',
      assignmentNumber: 'LW-6.1.2',
      orderIndex: 62,
      title: 'Pattern Library & Organization',
      description: 'Create a comprehensive pattern library system for repeatable production and efficient pattern management.',
      instructions: `1. Study pattern organization systems: filing, labeling, storage, retrieval
2. Create pattern numbering system: logical categorization, sequential numbering, version control
3. Transfer patterns to durable material: hardboard, plastic, or thin metal, label permanently
4. Document each pattern: project name, date created, sizes, material requirements
5. Create pattern index: searchable database or catalog, photos, quick reference
6. Photograph finished projects: with pattern number, multiple angles, detail shots
7. Write construction notes: assembly order, special techniques, time estimates
8. Organize physical storage: flat storage or hanging, protected from damage, easy access
9. Implement version control: pattern updates, improvements documented, old versions archived
10. Create digital backup: scan or photograph patterns, cloud storage, searchable database`,
      objectives: [
        'Develop pattern numbering system',
        'Create durable pattern templates',
        'Document construction process',
        'Organize physical and digital patterns',
        'Implement version control',
        'Build searchable library',
      ],
      skills: ['Organization systems', 'Documentation', 'Database management', 'Version control', 'Photography', 'Knowledge management'],
      expectedOutcome: 'Complete pattern library with numbered templates, construction notes, photos, organized storage, digital backup, searchable index.',
      passingCriteria: 'All patterns numbered and documented, photos linked to patterns, construction notes complete, storage organized, digital backup created',
      referencePhotos: ['/curriculum/leather/pattern-library.jpg', '/curriculum/leather/pattern-documentation.jpg', '/curriculum/leather/organized-storage.jpg'],
      estimatedHours: 10,
      difficulty: 'expert',
      category: 'business',
      subcategory: 'organization',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Knowledge management for craftspeople',
        'Pattern library systems',
        'Digital documentation best practices',
      ],
    },
    {
      level: 6,
      moduleNumber: '6.2',
      assignmentNumber: 'LW-6.2.1',
      orderIndex: 63,
      title: 'Pricing & Cost Analysis',
      description: 'Develop a comprehensive pricing strategy based on accurate cost analysis, market research, and value proposition.',
      instructions: `1. Track all material costs: leather, hardware, thread, supplies, shipping, waste factor
2. Calculate labor hours: time tracking for each project, learning curve vs production time
3. Determine hourly rate: desired income, overhead, taxes, benefits, professional level
4. Calculate overhead costs: rent, utilities, insurance, equipment, marketing, all fixed costs
5. Add profit margin: reinvestment, growth, savings, industry standards
6. Research market prices: competitors, similar quality, market positioning
7. Calculate break-even point: minimum sales to cover costs, production capacity
8. Create pricing tiers: standard, custom, luxury, volume discounts
9. Develop pricing formula: material + labor + overhead + profit = price
10. Document pricing strategy: formula, justification, market position, regular review`,
      objectives: [
        'Track all costs accurately',
        'Calculate true hourly rate',
        'Understand overhead costs',
        'Research market pricing',
        'Develop pricing formula',
        'Create profitable pricing strategy',
      ],
      skills: ['Cost analysis', 'Financial planning', 'Market research', 'Pricing strategy', 'Profit calculation', 'Business math'],
      expectedOutcome: 'Complete pricing strategy with cost tracking, hourly rate calculation, overhead analysis, competitive pricing, documented formula.',
      passingCriteria: 'All costs accurately tracked, hourly rate covers all expenses, pricing is competitive and profitable, formula is documented',
      referencePhotos: ['/curriculum/leather/cost-tracking.jpg', '/curriculum/leather/pricing-worksheet.jpg', '/curriculum/leather/price-list.jpg'],
      estimatedHours: 10,
      difficulty: 'expert',
      category: 'business',
      subcategory: 'finance',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Pricing for profit in craft business',
        'Cost analysis for makers',
        'Financial planning for small business',
      ],
    },
    {
      level: 6,
      moduleNumber: '6.2',
      assignmentNumber: 'LW-6.2.2',
      orderIndex: 64,
      title: 'Customer Relations & Custom Orders',
      description: 'Develop systems for managing customer relationships, custom order process, and maintaining client satisfaction.',
      instructions: `1. Create inquiry response template: professional, informative, timely, personal touch
2. Develop consultation process: understand needs, present options, set expectations
3. Design custom order form: specifications, measurements, preferences, timeline, deposit
4. Establish deposit policy: percentage required, refund policy, payment schedule
5. Create progress update system: photos, milestones, keep clients informed
6. Develop approval process: critical decision points, client sign-off, changes documentation
7. Handle changes and revisions: scope creep prevention, change order process, additional fees
8. Implement quality check before delivery: final inspection, client specifications met
9. Create packaging and presentation: professional presentation, care instructions, thank you
10. Follow-up system: satisfaction check, testimonial request, future business, referrals`,
      objectives: [
        'Create professional inquiry process',
        'Manage custom orders effectively',
        'Set clear expectations',
        'Communicate progress regularly',
        'Handle changes professionally',
        'Build long-term relationships',
      ],
      skills: ['Customer service', 'Custom order management', 'Communication', 'Expectation setting', 'Change management', 'Relationship building'],
      expectedOutcome: 'Complete custom order system with templates, forms, communication protocols, quality checks, follow-up process.',
      passingCriteria: 'All templates created, order process documented, communication system in place, quality checks defined, follow-up protocol established',
      referencePhotos: ['/curriculum/leather/order-form.jpg', '/curriculum/leather/progress-update.jpg', '/curriculum/leather/professional-packaging.jpg'],
      estimatedHours: 10,
      difficulty: 'expert',
      category: 'business',
      subcategory: 'customer_service',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Customer service excellence for craftspeople',
        'Managing custom orders',
        'Client communication best practices',
      ],
    },
    {
      level: 6,
      moduleNumber: '6.3',
      assignmentNumber: 'LW-6.3.1',
      orderIndex: 65,
      title: 'Marketing & Brand Development',
      description: 'Develop a complete brand identity and marketing strategy for your leather working business.',
      instructions: `1. Define brand identity: values, style, target market, unique selling proposition
2. Create visual brand: logo, color palette, fonts, photography style, consistency
3. Write brand story: your journey, philosophy, why leather work, connect with customers
4. Develop social media strategy: platform selection, content calendar, engagement plan
5. Create content: behind-the-scenes, process videos, finished pieces, customer stories
6. Build email list: website opt-in, newsletter strategy, value for subscribers
7. Develop photography skills: product photography, natural light, styling, editing
8. Create marketing materials: business cards, flyers, look book, digital assets
9. Plan launch or relaunch: strategy, timeline, coordinated effort, special offer
10. Track marketing metrics: followers, engagement, conversions, ROI, adjust strategy`,
      objectives: [
        'Develop clear brand identity',
        'Create visual brand consistency',
        'Build social media presence',
        'Create valuable content',
        'Develop photography skills',
        'Track marketing effectiveness',
      ],
      skills: ['Brand development', 'Social media marketing', 'Content creation', 'Photography', 'Marketing strategy', 'Analytics'],
      expectedOutcome: 'Complete brand identity with visual elements, social media presence, content strategy, marketing materials, metrics tracking system.',
      passingCriteria: 'Brand identity is clear and consistent, social media active, quality content created, photography is professional, metrics tracked',
      referencePhotos: ['/curriculum/leather/brand-identity.jpg', '/curriculum/leather/social-media-content.jpg', '/curriculum/leather/product-photography.jpg'],
      estimatedHours: 16,
      difficulty: 'expert',
      category: 'business',
      subcategory: 'marketing',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Brand development for small business',
        'Social media marketing for makers',
        'Product photography basics',
      ],
    },
    {
      level: 6,
      moduleNumber: '6.3',
      assignmentNumber: 'LW-6.3.2',
      orderIndex: 66,
      title: 'E-commerce & Online Sales',
      description: 'Set up online sales channels including website, online marketplace presence, and e-commerce operations.',
      instructions: `1. Choose e-commerce platform: Shopify, Etsy, own website, consider fees and features
2. Set up online shop: product listings, descriptions, pricing, policies, payment processing
3. Create product photography: multiple angles, detail shots, styled images, consistent lighting
4. Write compelling descriptions: materials, dimensions, care instructions, story, keywords
5. Establish shipping strategy: packaging materials, carrier selection, rates, tracking
6. Create policies: returns, exchanges, custom orders, processing time, clear communication
7. Implement inventory management: track available items, materials needed, production capacity
8. Set up customer service: response time, FAQ, email templates, professionalism
9. Launch online presence: announce, first orders, gather reviews, build trust
10. Analyze and optimize: sales data, traffic sources, conversion rate, continuous improvement`,
      objectives: [
        'Set up e-commerce platform',
        'Create professional product listings',
        'Establish shipping operations',
        'Implement customer service system',
        'Launch online sales',
        'Optimize based on data',
      ],
      skills: ['E-commerce setup', 'Online marketing', 'Shipping logistics', 'Customer service', 'Data analysis', 'Online sales'],
      expectedOutcome: 'Active online shop with professional listings, shipping system, customer service protocols, sales tracking, optimization strategy.',
      passingCriteria: 'Shop is live and professional, products well-presented, shipping efficient, customer service responsive, sales tracking in place',
      referencePhotos: ['/curriculum/leather/online-shop.jpg', '/curriculum/leather/product-listings.jpg', '/curriculum/leather/shipping-station.jpg'],
      estimatedHours: 14,
      difficulty: 'expert',
      category: 'business',
      subcategory: 'sales',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'E-commerce for makers',
        'Online marketplace strategies',
        'Shipping and fulfillment guide',
      ],
    },
    {
      level: 6,
      moduleNumber: '6.4',
      assignmentNumber: 'LW-6.4.1',
      orderIndex: 67,
      title: 'Production Techniques & Templates',
      description: 'Develop efficient production methods and jigs/templates for repeatable quality and increased productivity.',
      instructions: `1. Identify repetitive tasks: cutting, hole punching, stitching lines, hardware placement
2. Create cutting templates: acrylic or hardboard, trace quickly, consistent shapes
3. Build hole-punching jigs: pre-marked spacing, guide for chisels, consistent results
4. Design stitching guides: straight edge guides, curve templates, spacing markers
5. Create assembly jigs: hold pieces for gluing, alignment guides, hands-free work
6. Develop batch processing: cut multiple pieces at once, batch similar tasks, efficiency
7. Standardize hardware: common sizes, bulk ordering, interchangeable parts
8. Create process documentation: step-by-step for each product, photos, time estimates
9. Train for consistency: if hiring help, documented processes, quality standards
10. Continuously improve: track time, identify slow points, optimize, update documentation`,
      objectives: [
        'Create production templates',
        'Build helpful jigs',
        'Implement batch processing',
        'Standardize components',
        'Document processes',
        'Increase productivity',
      ],
      skills: ['Template creation', 'Jig building', 'Batch processing', 'Process documentation', 'Efficiency improvement', 'Standardization'],
      expectedOutcome: 'Set of production templates, jigs, and documented processes that increase productivity while maintaining quality.',
      passingCriteria: 'Templates speed up production, jigs ensure consistency, processes documented, batch processing implemented, productivity measurably increased',
      referencePhotos: ['/curriculum/leather/production-templates.jpg', '/curriculum/leather/assembly-jigs.jpg', '/curriculum/leather/batch-processing.jpg'],
      estimatedHours: 12,
      difficulty: 'expert',
      category: 'business',
      subcategory: 'production',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Production efficiency for small shops',
        'Jig and template design',
        'Lean manufacturing principles',
      ],
    },
    {
      level: 6,
      moduleNumber: '6.4',
      assignmentNumber: 'LW-6.4.2',
      orderIndex: 68,
      title: 'Quality Control Systems',
      description: 'Establish comprehensive quality control procedures to ensure consistent excellence in all work.',
      instructions: `1. Define quality standards: specifications for each product, acceptable tolerances, professional level
2. Create inspection checklist: all critical points, objective criteria, pass/fail standards
3. Implement in-process checks: catch errors early, fix before finishing, prevent waste
4. Establish final inspection: comprehensive check before delivery, quality gate, no exceptions
5. Document defects and fixes: learn from mistakes, prevent recurrence, continuous improvement
6. Create customer feedback system: gather input, address issues, improve products
7. Develop material inspection: check leather quality upon receipt, reject substandard materials
8. Set up rework procedures: when to fix, when to scrap, cost-benefit analysis
9. Train for quality: if hiring help, quality standards, inspection training, accountability
10. Maintain quality records: track defect rates, improvement over time, demonstrate excellence`,
      objectives: [
        'Define clear quality standards',
        'Create inspection procedures',
        'Implement quality gates',
        'Learn from defects',
        'Gather customer feedback',
        'Continuously improve quality',
      ],
      skills: ['Quality control', 'Inspection procedures', 'Standards development', 'Problem solving', 'Continuous improvement', 'Documentation'],
      expectedOutcome: 'Complete quality control system with defined standards, inspection checklists, feedback loops, defect tracking, continuous improvement.',
      passingCriteria: 'Standards clearly defined, inspection procedures in place, feedback system active, defects tracked and reduced, quality consistently high',
      referencePhotos: ['/curriculum/leather/quality-checklist.jpg', '/curriculum/leather/inspection-process.jpg', '/curriculum/leather/quality-records.jpg'],
      estimatedHours: 10,
      difficulty: 'expert',
      category: 'business',
      subcategory: 'quality',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Quality control for small manufacturing',
        'Defect prevention strategies',
        'Continuous improvement methodologies',
      ],
    },
    {
      level: 6,
      moduleNumber: '6.5',
      assignmentNumber: 'LW-6.5.1',
      orderIndex: 69,
      title: 'Teaching Leather Working',
      description: 'Develop skills to teach leather working to others through workshops, online courses, or apprenticeships.',
      instructions: `1. Design beginner workshop: 3-4 hour class, simple project, all materials included
2. Create lesson plan: learning objectives, demonstration, practice time, guided instruction
3. Develop teaching materials: handouts, tool lists, resource recommendations, clear instructions
4. Practice teaching techniques: clear demonstrations, positive feedback, patience, adaptability
5. Set up teaching space: adequate workstations, good lighting, tool access, safe environment
6. Price workshop appropriately: materials, time, space rental, fair value
7. Market workshop: social media, local craft stores, community centers, word of mouth
8. Run first workshop: teach, observe, gather feedback, improve
9. Create online content: video tutorials, written guides, build online presence
10. Develop ongoing teaching: regular classes, private lessons, apprenticeship program, teaching income`,
      objectives: [
        'Design effective workshops',
        'Develop teaching skills',
        'Create teaching materials',
        'Set up teaching space',
        'Market classes successfully',
        'Build teaching revenue stream',
      ],
      skills: ['Workshop design', 'Teaching techniques', 'Curriculum development', 'Public speaking', 'Marketing', 'Student management'],
      expectedOutcome: 'Complete workshop designed and taught successfully, teaching materials created, feedback gathered, path forward for teaching revenue.',
      passingCriteria: 'Workshop successfully delivered, students learn skills, positive feedback received, materials effective, profitable and repeatable',
      referencePhotos: ['/curriculum/leather/workshop-setup.jpg', '/curriculum/leather/teaching-demonstration.jpg', '/curriculum/leather/student-work.jpg'],
      estimatedHours: 16,
      difficulty: 'expert',
      category: 'business',
      subcategory: 'teaching',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Teaching craft workshops',
        'Adult education principles',
        'Workshop marketing strategies',
      ],
    },
    {
      level: 6,
      moduleNumber: '6.5',
      assignmentNumber: 'LW-6.5.2',
      orderIndex: 70,
      title: 'Level 6 Final: Complete Portfolio & Business Plan',
      description: 'Create a comprehensive professional portfolio and detailed business plan demonstrating readiness to operate a successful leather working business.',
      instructions: `1. Compile portfolio: best work from all levels, professional photography, variety of projects
2. Write artist statement: philosophy, style, unique approach, target market
3. Document your journey: timeline, skills acquired, challenges overcome, growth demonstrated
4. Create business plan: mission, vision, market analysis, competitive advantage, goals
5. Develop financial projections: startup costs, operating expenses, revenue projections, break-even
6. Plan marketing strategy: brand position, target customers, channels, budget, timeline
7. Outline operations: workspace, equipment, suppliers, production capacity, quality systems
8. Set short and long-term goals: 1-year, 3-year, 5-year objectives, measurable milestones
9. Present portfolio and plan: professional presentation, demonstrate readiness, receive feedback
10. Launch or grow business: implement plan, track progress, adjust as needed, continue learning`,
      objectives: [
        'Create professional portfolio',
        'Develop comprehensive business plan',
        'Set clear business goals',
        'Demonstrate business readiness',
        'Present professionally',
        'Launch or grow leather business',
      ],
      skills: ['Portfolio development', 'Business planning', 'Financial projections', 'Strategic thinking', 'Professional presentation', 'Goal setting'],
      expectedOutcome: 'Professional portfolio showcasing best work and comprehensive business plan demonstrating readiness to operate successful leather working business.',
      passingCriteria: 'Portfolio is professional quality, business plan is thorough and realistic, financial projections sound, presentation excellent, ready for business',
      referencePhotos: ['/curriculum/leather/professional-portfolio.jpg', '/curriculum/leather/business-plan.jpg', '/curriculum/leather/portfolio-presentation.jpg'],
      estimatedHours: 30,
      difficulty: 'expert',
      category: 'business',
      subcategory: 'planning',
      serviceTrack: 'leather_working' as ServiceTrack,
      requiredReading: [
        'Business planning for craftspeople',
        'Portfolio development for makers',
        'Financial planning for small business',
        'Marketing strategy development',
      ],
      crossReferences: [
        'LW-6.1.1: Workshop Efficiency',
        'LW-6.2.1: Pricing & Cost Analysis',
        'LW-6.3.1: Marketing & Brand Development',
        'LW-6.4.2: Quality Control Systems',
      ],
    },

  ]

  // Clear existing leather working curriculum
  await prisma.assignmentTemplate.deleteMany({
    where: { serviceTrack: 'leather_working' },
  })

  // Insert new curriculum
  await prisma.assignmentTemplate.createMany({
    data: assignments,
  })

  console.log(`✅ Seeded ${assignments.length} leather working assignments`)
}

// For standalone execution
if (require.main === module) {
  seedLeatherWorkingCurriculum()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

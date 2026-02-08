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

const hennaCurriculum: AssignmentTemplateData[] = [
  // ============================================================================
  // LEVEL 1: FOUNDATION (Months 1-2)
  // ============================================================================

  // Module 1.1: Introduction to Henna Art
  {
    level: 1,
    moduleNumber: '1.1',
    assignmentNumber: 'HN-1.1.1',
    orderIndex: 1,
    title: 'History & Cultural Significance of Henna',
    description: 'Study the rich cultural history and traditions of henna art (Mehndi) across different cultures — Indian, Arabic, African, and contemporary Western styles.',
    instructions: `1. Research the origins of henna art dating back 5,000+ years
2. Study the cultural significance in Indian/South Asian weddings (Mehndi)
3. Learn about Arabic henna traditions and design characteristics
4. Explore African henna traditions (particularly North and West African)
5. Understand modern/contemporary henna trends and fusion styles
6. Write a 2-page summary documenting key cultural differences and design styles`,
    objectives: [
      'Understand the historical roots of henna across cultures',
      'Identify the distinctive characteristics of Indian, Arabic, and African styles',
      'Respect cultural significance when creating designs',
      'Recognize contemporary trends in henna art',
    ],
    skills: ['Cultural knowledge', 'Art history', 'Style identification', 'Cultural sensitivity'],
    expectedOutcome: 'A written report covering henna history across 4 cultural traditions with visual examples.',
    passingCriteria: 'Report demonstrates thorough understanding of cultural contexts and design distinctions',
    referencePhotos: ['/curriculum/henna/indian-mehndi.jpg', '/curriculum/henna/arabic-henna.jpg', '/curriculum/henna/african-henna.jpg'],
    estimatedHours: 8,
    difficulty: 'beginner',
    category: 'theory',
    subcategory: 'history',
    serviceTrack: 'henna' as ServiceTrack,
  },
  {
    level: 1,
    moduleNumber: '1.1',
    assignmentNumber: 'HN-1.1.2',
    orderIndex: 2,
    title: 'Henna Materials & Tool Identification',
    description: 'Learn to identify and use all essential henna tools and materials including paste preparation, cones, applicators, and aftercare products.',
    instructions: `1. Study henna powder types: BAQ (Body Art Quality) vs non-BAQ, identifying quality brands
2. Learn about essential oils for henna: eucalyptus, tea tree, lavender, cajeput
3. Practice rolling henna cones from cellophane/mylar — roll at least 10 cones
4. Study applicator bottles (jacquard bottles) with different tip sizes
5. Learn about aftercare materials: lemon-sugar sealant, balm, tape
6. Identify and organize a complete henna artist kit`,
    objectives: [
      'Identify quality henna powder and essential oils',
      'Roll professional henna cones consistently',
      'Understand different applicator types and when to use each',
      'Assemble a complete professional henna kit',
    ],
    skills: ['Material identification', 'Cone rolling', 'Kit organization', 'Quality assessment'],
    expectedOutcome: 'A complete henna kit with 10 hand-rolled cones and demonstration of all tool uses.',
    passingCriteria: 'Cones are uniform and functional, kit is complete, materials are correctly identified',
    referencePhotos: ['/curriculum/henna/henna-kit.jpg', '/curriculum/henna/cone-rolling.jpg', '/curriculum/henna/applicator-types.jpg'],
    estimatedHours: 6,
    difficulty: 'beginner',
    category: 'tools',
    subcategory: 'materials',
    serviceTrack: 'henna' as ServiceTrack,
  },
  {
    level: 1,
    moduleNumber: '1.1',
    assignmentNumber: 'HN-1.1.3',
    orderIndex: 3,
    title: 'Henna Paste Preparation & Testing',
    description: 'Master the art of preparing professional-grade henna paste from powder, achieving the perfect consistency and stain quality.',
    instructions: `1. Study henna paste recipes: powder, liquid (lemon juice/tea), sugar, essential oil ratios
2. Prepare your first batch following a standard recipe
3. Learn dye release timing — how long to rest paste (8-24 hours depending on climate)
4. Test paste consistency: it should flow smoothly from cone without being runny
5. Perform skin patch tests for allergies on yourself and practice volunteers
6. Compare stain results from different recipes and document findings`,
    objectives: [
      'Prepare consistent, high-quality henna paste',
      'Understand dye release and timing for optimal stain',
      'Achieve proper paste consistency for smooth application',
      'Conduct safety patch tests before client application',
    ],
    skills: ['Paste preparation', 'Recipe formulation', 'Consistency control', 'Safety testing'],
    expectedOutcome: 'Three batches of henna paste tested for consistency and stain quality, with documented results.',
    passingCriteria: 'Paste flows smoothly, achieves deep stain after 24-48 hours, passes safety test',
    referencePhotos: ['/curriculum/henna/paste-mixing.jpg', '/curriculum/henna/consistency-test.jpg', '/curriculum/henna/stain-comparison.jpg'],
    estimatedHours: 10,
    difficulty: 'beginner',
    category: 'tools',
    subcategory: 'paste-preparation',
    serviceTrack: 'henna' as ServiceTrack,
  },

  // Module 1.2: Basic Strokes & Elements
  {
    level: 1,
    moduleNumber: '1.2',
    assignmentNumber: 'HN-1.2.1',
    orderIndex: 4,
    title: 'Fundamental Henna Strokes — Lines & Dots',
    description: 'Practice the most fundamental henna strokes: straight lines, curved lines, dots of various sizes, and basic pressure control.',
    instructions: `1. Practice holding the cone at the correct angle (45 degrees) with proper hand position
2. Draw straight lines of consistent thickness — practice 50 lines on paper
3. Draw curved lines and S-curves — practice 50 curves
4. Create dots of 3 different sizes using pressure variation
5. Practice consistent spacing between lines and dots
6. Complete all exercises on practice skin (silicone hand or paper) before real skin`,
    objectives: [
      'Hold the cone correctly for extended periods without fatigue',
      'Draw straight and curved lines of consistent thickness',
      'Create uniform dots of varying sizes',
      'Control paste flow through pressure modulation',
    ],
    skills: ['Cone control', 'Line consistency', 'Dot precision', 'Pressure control'],
    expectedOutcome: 'Practice sheets showing 50 straight lines, 50 curves, and 3-size dot grids with consistent quality.',
    passingCriteria: 'Lines are even thickness, curves are smooth, dots are uniform within each size',
    referencePhotos: ['/curriculum/henna/basic-lines.jpg', '/curriculum/henna/dot-practice.jpg'],
    estimatedHours: 10,
    difficulty: 'beginner',
    category: 'technique',
    subcategory: 'basic-strokes',
    serviceTrack: 'henna' as ServiceTrack,
  },
  {
    level: 1,
    moduleNumber: '1.2',
    assignmentNumber: 'HN-1.2.2',
    orderIndex: 5,
    title: 'Core Design Elements — Petals, Leaves & Vines',
    description: 'Learn to create the core decorative elements used in all henna styles: petals, leaves, vines, and simple fills.',
    instructions: `1. Practice teardrop/petal shapes — the building block of most floral designs
2. Learn leaf shapes: simple pointed, curved, and filled leaves
3. Practice vine lines with attached leaves and tendrils
4. Create simple fill patterns: cross-hatching, parallel lines, dots, swirls
5. Practice paisley (mango/ambi) shapes — the iconic henna motif
6. Combine elements into a simple vine-and-flower border design`,
    objectives: [
      'Create consistent teardrop and petal shapes',
      'Draw various leaf styles smoothly',
      'Build flowing vine compositions',
      'Execute basic fill patterns neatly',
    ],
    skills: ['Petal formation', 'Leaf drawing', 'Vine flow', 'Fill patterns', 'Paisley shapes'],
    expectedOutcome: 'Practice sheets showing mastery of petals, leaves, vines, and a combined border design.',
    passingCriteria: 'Shapes are consistent, vines flow naturally, fills are even',
    referencePhotos: ['/curriculum/henna/petals-leaves.jpg', '/curriculum/henna/vine-border.jpg', '/curriculum/henna/paisley.jpg'],
    estimatedHours: 12,
    difficulty: 'beginner',
    category: 'technique',
    subcategory: 'design-elements',
    serviceTrack: 'henna' as ServiceTrack,
  },
  {
    level: 1,
    moduleNumber: '1.2',
    assignmentNumber: 'HN-1.2.3',
    orderIndex: 6,
    title: 'Core Design Elements — Mandalas & Circles',
    description: 'Learn to create circular mandala designs — the centerpiece of most henna hand designs.',
    instructions: `1. Practice drawing circles freehand in various sizes
2. Build a simple mandala: center dot, inner ring of petals, outer ring of details
3. Learn to add layers to a mandala: each ring adds complexity
4. Practice symmetry — keeping mandala balanced on all sides
5. Create 5 different mandala designs increasing in complexity
6. Place a mandala on the palm of a practice hand in the correct position`,
    objectives: [
      'Draw freehand circles with confidence',
      'Build layered mandalas from center outward',
      'Maintain symmetry in circular designs',
      'Position mandalas correctly on the hand',
    ],
    skills: ['Freehand circles', 'Mandala construction', 'Symmetry', 'Layering', 'Placement'],
    expectedOutcome: 'Five mandala designs of increasing complexity, plus one placed correctly on a practice hand.',
    passingCriteria: 'Mandalas are symmetrical, layers are clean, placement on hand is appropriate',
    referencePhotos: ['/curriculum/henna/simple-mandala.jpg', '/curriculum/henna/complex-mandala.jpg', '/curriculum/henna/palm-mandala.jpg'],
    estimatedHours: 12,
    difficulty: 'beginner',
    category: 'technique',
    subcategory: 'mandalas',
    serviceTrack: 'henna' as ServiceTrack,
  },

  // Module 1.3: Hygiene, Safety & Client Care
  {
    level: 1,
    moduleNumber: '1.3',
    assignmentNumber: 'HN-1.3.1',
    orderIndex: 7,
    title: 'Hygiene, Safety & Allergy Awareness',
    description: 'Learn essential safety protocols for henna application including hygiene, allergy testing, and identifying unsafe products.',
    instructions: `1. Study the dangers of "black henna" (PPD) and how to identify it
2. Learn proper hand hygiene and workspace sanitation protocols
3. Practice conducting a patch test on clients (inner elbow, 24 hours before)
4. Understand common skin reactions and when to stop application
5. Create a client consent/allergy form
6. Study proper henna storage and paste shelf life (fresh vs frozen)`,
    objectives: [
      'Identify and refuse to use unsafe henna products (PPD/black henna)',
      'Maintain proper hygiene during application',
      'Conduct patch tests and recognize allergic reactions',
      'Store henna paste safely for optimal quality',
    ],
    skills: ['Safety protocols', 'Allergy awareness', 'Hygiene standards', 'Client screening'],
    expectedOutcome: 'A client consent form, safety checklist, and demonstrated knowledge of PPD dangers.',
    passingCriteria: 'Score 100% on safety quiz, consent form is comprehensive, hygiene standards demonstrated',
    referencePhotos: ['/curriculum/henna/safety-kit.jpg', '/curriculum/henna/patch-test.jpg'],
    estimatedHours: 4,
    difficulty: 'beginner',
    category: 'safety',
    subcategory: 'hygiene',
    serviceTrack: 'henna' as ServiceTrack,
  },
  {
    level: 1,
    moduleNumber: '1.3',
    assignmentNumber: 'HN-1.3.2',
    orderIndex: 8,
    title: 'Aftercare Guidance & Stain Development',
    description: 'Learn the complete henna aftercare process to ensure clients achieve the deepest, longest-lasting stain.',
    instructions: `1. Study henna stain chemistry: how lawsone bonds with keratin in skin
2. Learn the stain development timeline: orange initially, darkening over 24-48 hours
3. Prepare lemon-sugar sealant and practice application over dried henna
4. Understand heat and moisture effects on stain darkening
5. Create a client aftercare instruction card
6. Document stain progression with photos over 72 hours on your own skin`,
    objectives: [
      'Explain the science of henna staining to clients',
      'Prepare and apply lemon-sugar sealant',
      'Guide clients on aftercare for best results',
      'Create professional aftercare documentation',
    ],
    skills: ['Stain chemistry knowledge', 'Sealant preparation', 'Client education', 'Documentation'],
    expectedOutcome: 'Client aftercare card plus photo documentation of stain progression over 72 hours.',
    passingCriteria: 'Aftercare card is clear and professional, photo documentation shows proper stain development',
    referencePhotos: ['/curriculum/henna/stain-progression.jpg', '/curriculum/henna/aftercare-card.jpg'],
    estimatedHours: 6,
    difficulty: 'beginner',
    category: 'safety',
    subcategory: 'aftercare',
    serviceTrack: 'henna' as ServiceTrack,
  },

  // ============================================================================
  // LEVEL 2: CORE DESIGN STYLES (Months 3-5)
  // ============================================================================

  // Module 2.1: Arabic Henna Style
  {
    level: 2,
    moduleNumber: '2.1',
    assignmentNumber: 'HN-2.1.1',
    orderIndex: 9,
    title: 'Arabic Henna Design — Bold Floral',
    description: 'Master the Arabic henna style characterized by bold, flowing floral patterns with large open spaces and dramatic contrast.',
    instructions: `1. Study Arabic henna characteristics: bold outlines, large flowers, open negative space
2. Practice large flower motifs with thick outlines and detailed inner fills
3. Learn the Arabic "trail" design — a flowing pattern from fingertip to wrist
4. Practice shading within Arabic designs using parallel line fills
5. Create 3 complete Arabic-style designs on practice hands
6. Apply one Arabic design on a real hand (volunteer or your own non-dominant hand)`,
    objectives: [
      'Create bold, flowing Arabic floral designs',
      'Maintain proper negative space balance',
      'Execute Arabic trail designs from finger to wrist',
      'Apply shading and fill techniques in Arabic style',
    ],
    skills: ['Arabic style', 'Bold florals', 'Negative space', 'Shading fills', 'Trail design'],
    expectedOutcome: 'Three Arabic designs on practice hands plus one on real skin with proper stain documentation.',
    passingCriteria: 'Designs show bold Arabic characteristics, negative space is balanced, skin application is clean',
    referencePhotos: ['/curriculum/henna/arabic-floral.jpg', '/curriculum/henna/arabic-trail.jpg'],
    estimatedHours: 14,
    difficulty: 'intermediate',
    category: 'design-styles',
    subcategory: 'arabic',
    serviceTrack: 'henna' as ServiceTrack,
  },
  {
    level: 2,
    moduleNumber: '2.1',
    assignmentNumber: 'HN-2.1.2',
    orderIndex: 10,
    title: 'Arabic Henna — Back of Hand & Finger Work',
    description: 'Specialize in Arabic designs for the back of the hand including finger extensions and wrist cuffs.',
    instructions: `1. Study back-of-hand Arabic design layouts
2. Practice finger tip designs: simple caps, vine extensions, ring patterns
3. Learn wrist cuff/bracelet designs in Arabic style
4. Create designs that flow naturally from fingers through hand to wrist
5. Practice on 3 different hand sizes (small, medium, large practice hands)
6. Complete a full back-of-hand Arabic design on real skin`,
    objectives: [
      'Design flowing back-of-hand compositions',
      'Create detailed finger work that complements the main design',
      'Build wrist cuff designs as finishing elements',
      'Adapt designs to different hand sizes',
    ],
    skills: ['Back-of-hand design', 'Finger detailing', 'Wrist cuffs', 'Size adaptation'],
    expectedOutcome: 'Three sized back-of-hand designs plus one real skin application with finger and wrist work.',
    passingCriteria: 'Design flows naturally across hand, fingers are detailed, wrist cuff is balanced',
    referencePhotos: ['/curriculum/henna/arabic-backhand.jpg', '/curriculum/henna/finger-work.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'design-styles',
    subcategory: 'arabic',
    serviceTrack: 'henna' as ServiceTrack,
  },

  // Module 2.2: Indian Mehndi Style
  {
    level: 2,
    moduleNumber: '2.2',
    assignmentNumber: 'HN-2.2.1',
    orderIndex: 11,
    title: 'Indian Mehndi — Traditional Full Hand',
    description: 'Learn traditional Indian Mehndi characterized by dense, intricate patterns covering the entire hand with detailed fills.',
    instructions: `1. Study Indian Mehndi characteristics: dense coverage, fine lines, intricate fills, no open space
2. Practice traditional motifs: peacocks, paisleys, lotus flowers, elephant, bride-and-groom
3. Learn the grid/layout system for filling an entire palm
4. Practice fine line work needed for Indian detail
5. Create a full palm design with mandala center, filled sections, and finger coverage
6. Apply an Indian-style design covering the full palm on real skin`,
    objectives: [
      'Create dense, full-coverage Indian Mehndi designs',
      'Execute fine-line detail work consistently',
      'Use the grid layout system for palm coverage',
      'Incorporate traditional Indian motifs authentically',
    ],
    skills: ['Indian Mehndi', 'Dense patterning', 'Fine line work', 'Traditional motifs', 'Full coverage'],
    expectedOutcome: 'A full-palm Indian Mehndi design on practice hand plus one on real skin.',
    passingCriteria: 'Design covers entire palm, detail is fine and consistent, traditional motifs are recognizable',
    referencePhotos: ['/curriculum/henna/indian-palm.jpg', '/curriculum/henna/indian-motifs.jpg'],
    estimatedHours: 16,
    difficulty: 'intermediate',
    category: 'design-styles',
    subcategory: 'indian',
    serviceTrack: 'henna' as ServiceTrack,
  },
  {
    level: 2,
    moduleNumber: '2.2',
    assignmentNumber: 'HN-2.2.2',
    orderIndex: 12,
    title: 'Indian Mehndi — Bridal Basics',
    description: 'Learn the fundamentals of bridal Mehndi — the most elaborate and important form of Indian henna art.',
    instructions: `1. Study bridal Mehndi traditions: both hands and feet, extensive coverage up to elbows and ankles
2. Learn to incorporate bride-groom figures, dulha-dulhan motifs, and wedding symbols
3. Practice extending designs from hands up the forearm
4. Create a design that tells a story (wedding procession, celebration)
5. Practice hiding the groom's name or initials within the design
6. Create a full bridal design on practice hands (both palms and back)`,
    objectives: [
      'Understand bridal Mehndi traditions and expectations',
      'Create elaborate designs extending to the forearm',
      'Incorporate narrative and symbolic elements',
      'Hide names/initials seamlessly within designs',
    ],
    skills: ['Bridal design', 'Extended coverage', 'Narrative design', 'Hidden elements', 'Symbolic motifs'],
    expectedOutcome: 'A complete bridal Mehndi set on practice hands (4 sides) with hidden name and story elements.',
    passingCriteria: 'Designs are elaborate and cohesive, hidden name is found only when pointed out, coverage is full',
    referencePhotos: ['/curriculum/henna/bridal-mehndi.jpg', '/curriculum/henna/bridal-forearm.jpg'],
    estimatedHours: 20,
    difficulty: 'intermediate',
    category: 'design-styles',
    subcategory: 'indian-bridal',
    serviceTrack: 'henna' as ServiceTrack,
  },

  // Module 2.3: African & Contemporary Styles
  {
    level: 2,
    moduleNumber: '2.3',
    assignmentNumber: 'HN-2.3.1',
    orderIndex: 13,
    title: 'African Henna Traditions',
    description: 'Study and practice African henna styles including North African geometric patterns and West African designs.',
    instructions: `1. Research North African (Moroccan, Tunisian, Egyptian) henna traditions
2. Study West African henna traditions (Nigerian, Senegalese, Malian)
3. Practice geometric patterns: diamonds, triangles, chevrons, parallel lines
4. Learn bold block designs characteristic of African henna
5. Practice foot and ankle designs common in African traditions
6. Create 3 designs: one Moroccan, one West African, and one fusion piece`,
    objectives: [
      'Identify African henna design characteristics',
      'Create geometric patterns with precision',
      'Design for feet and ankles traditionally',
      'Blend African traditions into original designs',
    ],
    skills: ['African henna styles', 'Geometric precision', 'Foot design', 'Cultural blending'],
    expectedOutcome: 'Three designs representing Moroccan, West African, and fusion styles.',
    passingCriteria: 'Designs are culturally accurate, geometric patterns are precise, fusion piece is creative',
    referencePhotos: ['/curriculum/henna/moroccan-henna.jpg', '/curriculum/henna/west-african-henna.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'design-styles',
    subcategory: 'african',
    serviceTrack: 'henna' as ServiceTrack,
  },
  {
    level: 2,
    moduleNumber: '2.3',
    assignmentNumber: 'HN-2.3.2',
    orderIndex: 14,
    title: 'Contemporary & Fusion Henna Designs',
    description: 'Explore modern henna trends: minimalist designs, white henna (body paint), geometric modern, and fusion styles.',
    instructions: `1. Study contemporary henna trends on social media and in fashion
2. Practice minimalist designs: single-finger, small wrist, behind-the-ear placements
3. Learn about white henna (body paint, not real henna) for events and photoshoots
4. Create modern geometric designs mixing traditional elements with contemporary aesthetics
5. Design henna for non-traditional placements: shoulder, back, collarbone, ankle
6. Create 5 contemporary mini-designs suitable for quick event work`,
    objectives: [
      'Create modern minimalist henna designs',
      'Understand white henna products and applications',
      'Design for non-traditional body placements',
      'Create quick, appealing designs for event work',
    ],
    skills: ['Contemporary design', 'Minimalism', 'Non-traditional placement', 'Quick application'],
    expectedOutcome: 'Five contemporary mini-designs plus two non-traditional placement designs.',
    passingCriteria: 'Designs are modern and trendy, placements are appropriate, quick designs take under 10 minutes',
    referencePhotos: ['/curriculum/henna/minimalist-henna.jpg', '/curriculum/henna/contemporary-henna.jpg'],
    estimatedHours: 10,
    difficulty: 'intermediate',
    category: 'design-styles',
    subcategory: 'contemporary',
    serviceTrack: 'henna' as ServiceTrack,
  },

  // Module 2.4: Foot & Body Designs
  {
    level: 2,
    moduleNumber: '2.4',
    assignmentNumber: 'HN-2.4.1',
    orderIndex: 15,
    title: 'Foot & Ankle Henna Designs',
    description: 'Master henna application on feet and ankles — essential for bridal work and cultural ceremonies.',
    instructions: `1. Study foot anatomy for optimal design placement
2. Practice top-of-foot designs: sandal-style patterns flowing to toes
3. Create ankle bracelet/anklet designs wrapping around the ankle
4. Design toe cap patterns for each toe
5. Learn to work with the curved surfaces of feet and ankles
6. Apply a full foot design on real skin or detailed practice foot`,
    objectives: [
      'Design flowing patterns for foot anatomy',
      'Create ankle bracelet designs with consistent wrapping',
      'Apply henna on curved surfaces smoothly',
      'Execute toe detailing neatly',
    ],
    skills: ['Foot design', 'Ankle wrapping', 'Curved surface application', 'Toe detailing'],
    expectedOutcome: 'A complete foot design with ankle bracelet and toe caps on practice or real skin.',
    passingCriteria: 'Design follows foot contours naturally, ankle wrap is even, toes are cleanly detailed',
    referencePhotos: ['/curriculum/henna/foot-design.jpg', '/curriculum/henna/ankle-bracelet.jpg'],
    estimatedHours: 10,
    difficulty: 'intermediate',
    category: 'technique',
    subcategory: 'foot-designs',
    serviceTrack: 'henna' as ServiceTrack,
  },

  // ============================================================================
  // LEVEL 3: INTERMEDIATE APPLICATION (Months 6-8)
  // ============================================================================

  // Module 3.1: Client Application Skills
  {
    level: 3,
    moduleNumber: '3.1',
    assignmentNumber: 'HN-3.1.1',
    orderIndex: 16,
    title: 'First Client Sessions — Simple Designs',
    description: 'Conduct your first real client sessions applying simple henna designs under mentor supervision.',
    instructions: `1. Set up a professional workspace: clean surface, good lighting, comfortable seating
2. Conduct client consultation: design preference, placement, allergies, timeline
3. Perform patch test if first-time client
4. Apply 5 simple designs on real clients (flowers, mandalas, vines, finger patterns)
5. Guide clients on paste removal timing and aftercare
6. Document each session: design photo, client feedback, time taken, stain result`,
    objectives: [
      'Conduct professional client consultations',
      'Apply clean henna designs on real skin under time pressure',
      'Manage client expectations and comfort during application',
      'Document sessions for portfolio building',
    ],
    skills: ['Client management', 'Real skin application', 'Time management', 'Consultation', 'Documentation'],
    expectedOutcome: 'Five documented client sessions with before/after photos and feedback.',
    passingCriteria: 'All designs are clean, clients are satisfied, sessions completed in reasonable time',
    referencePhotos: ['/curriculum/henna/client-session.jpg', '/curriculum/henna/workspace-setup.jpg'],
    estimatedHours: 15,
    difficulty: 'intermediate',
    category: 'application',
    subcategory: 'client-sessions',
    serviceTrack: 'henna' as ServiceTrack,
  },
  {
    level: 3,
    moduleNumber: '3.1',
    assignmentNumber: 'HN-3.1.2',
    orderIndex: 17,
    title: 'Speed Building — Timed Design Practice',
    description: 'Develop speed and efficiency while maintaining quality — essential for event work where time is limited.',
    instructions: `1. Create a menu of designs categorized by time: 5-min, 10-min, 15-min, 30-min
2. Practice each 5-minute design until you can complete it consistently in time
3. Practice each 10-minute design until consistent
4. Build a "flash sheet" of quick designs for events and walk-ins
5. Time yourself on progressively complex designs, aiming to reduce time by 20%
6. Complete a timed test: 3 designs in 30 minutes on real skin`,
    objectives: [
      'Complete simple designs in 5 minutes or less',
      'Build a repertoire of timed designs for events',
      'Maintain quality while working under time pressure',
      'Create a flash sheet for quick client selection',
    ],
    skills: ['Speed application', 'Efficiency', 'Flash design', 'Time management'],
    expectedOutcome: 'A categorized flash sheet plus timed test completing 3 designs in 30 minutes.',
    passingCriteria: 'All timed designs are clean and complete within time limits, flash sheet has 20+ designs',
    referencePhotos: ['/curriculum/henna/flash-sheet.jpg', '/curriculum/henna/speed-practice.jpg'],
    estimatedHours: 16,
    difficulty: 'intermediate',
    category: 'application',
    subcategory: 'speed-building',
    serviceTrack: 'henna' as ServiceTrack,
  },

  // Module 3.2: Design Composition & Layout
  {
    level: 3,
    moduleNumber: '3.2',
    assignmentNumber: 'HN-3.2.1',
    orderIndex: 18,
    title: 'Full Hand Composition — Front & Back',
    description: 'Master the art of composing balanced, complete hand designs that flow naturally across the palm, back, and fingers.',
    instructions: `1. Study composition principles: focal point, balance, flow, rhythm
2. Learn layout zones of the hand: palm center, fingers, thumb, sides, wrist
3. Practice placing a focal mandala and building outward to fill the palm
4. Design back-of-hand layouts with central motif and finger extensions
5. Create 3 complete front-and-back hand designs as matched sets
6. Apply a full front-and-back set on a volunteer`,
    objectives: [
      'Compose balanced full-hand designs',
      'Create cohesive front-and-back design sets',
      'Fill hand zones proportionally',
      'Maintain design flow across surfaces',
    ],
    skills: ['Composition', 'Layout planning', 'Design balance', 'Full-hand coverage'],
    expectedOutcome: 'Three matched front-and-back hand sets, plus one applied on real skin.',
    passingCriteria: 'Designs are balanced, front and back complement each other, flow across the hand is natural',
    referencePhotos: ['/curriculum/henna/full-hand-front.jpg', '/curriculum/henna/full-hand-back.jpg'],
    estimatedHours: 18,
    difficulty: 'intermediate',
    category: 'design',
    subcategory: 'composition',
    serviceTrack: 'henna' as ServiceTrack,
  },
  {
    level: 3,
    moduleNumber: '3.2',
    assignmentNumber: 'HN-3.2.2',
    orderIndex: 19,
    title: 'Custom Design Creation from Client Requests',
    description: 'Learn to translate client ideas, reference images, and verbal descriptions into original henna designs.',
    instructions: `1. Practice interpreting vague client requests ("something pretty", "not too much")
2. Learn to sketch quick design concepts for client approval before application
3. Practice combining elements from reference photos into original compositions
4. Handle requests for specific symbols: infinity signs, hearts, names, dates
5. Design for specific occasions: birthday, engagement, baby shower, festival
6. Complete 5 custom designs from mock client briefs`,
    objectives: [
      'Translate client ideas into design sketches',
      'Create original designs inspired by reference images',
      'Incorporate specific symbols and text into designs',
      'Design for specific occasions and moods',
    ],
    skills: ['Client interpretation', 'Sketch presentation', 'Custom design', 'Occasion-specific design'],
    expectedOutcome: 'Five custom designs from mock client briefs with sketches and final designs.',
    passingCriteria: 'Designs match client briefs, sketches are clear for approval, final work is clean',
    referencePhotos: ['/curriculum/henna/custom-sketch.jpg', '/curriculum/henna/client-request.jpg'],
    estimatedHours: 14,
    difficulty: 'intermediate',
    category: 'design',
    subcategory: 'custom-creation',
    serviceTrack: 'henna' as ServiceTrack,
  },

  // Module 3.3: Event Henna
  {
    level: 3,
    moduleNumber: '3.3',
    assignmentNumber: 'HN-3.3.1',
    orderIndex: 20,
    title: 'Party & Event Henna — High-Volume Service',
    description: 'Learn to manage high-volume henna services at parties and events efficiently while maintaining quality.',
    instructions: `1. Study event setup: table, chair, lighting, display of sample designs, supplies
2. Create a menu board with numbered designs and time/price for each
3. Practice quick designs (under 5 minutes) for children and casual clients
4. Learn crowd management: queue system, time expectations, next-client prep
5. Practice working continuously for 2 hours applying designs back-to-back
6. Simulate an event: apply designs on 8-10 people in 2 hours`,
    objectives: [
      'Set up a professional event station efficiently',
      'Manage a queue of clients smoothly',
      'Apply quality designs quickly under event pressure',
      'Maintain energy and quality over extended sessions',
    ],
    skills: ['Event management', 'High-volume application', 'Queue management', 'Endurance'],
    expectedOutcome: 'A complete event kit and simulated event serving 8-10 clients in 2 hours.',
    passingCriteria: 'All clients served within time, designs are clean, event flow is smooth',
    referencePhotos: ['/curriculum/henna/event-setup.jpg', '/curriculum/henna/menu-board.jpg'],
    estimatedHours: 14,
    difficulty: 'intermediate',
    category: 'application',
    subcategory: 'event-henna',
    serviceTrack: 'henna' as ServiceTrack,
  },

  // Module 3.4: Specialty Techniques
  {
    level: 3,
    moduleNumber: '3.4',
    assignmentNumber: 'HN-3.4.1',
    orderIndex: 21,
    title: 'Negative Space & Outline Techniques',
    description: 'Master negative space design — creating beautiful patterns by leaving skin visible as part of the design.',
    instructions: `1. Study negative space principles: the skin becomes part of the artwork
2. Practice outline-only designs where shapes are defined by borders
3. Create "reverse" designs where the fill is around the motif, leaving the motif as bare skin
4. Learn to balance positive (henna) and negative (skin) space
5. Create 3 negative space designs: one on hand, one on wrist, one on arm
6. Apply a negative space design on real skin`,
    objectives: [
      'Use negative space as a deliberate design element',
      'Create clean outlines without fills',
      'Balance henna and skin for maximum visual impact',
      'Design using both positive and negative space',
    ],
    skills: ['Negative space design', 'Outline precision', 'Space balance', 'Visual impact'],
    expectedOutcome: 'Three negative space designs plus one on real skin demonstrating space balance.',
    passingCriteria: 'Negative space is intentional and clean, outlines are crisp, design is visually striking',
    referencePhotos: ['/curriculum/henna/negative-space.jpg', '/curriculum/henna/outline-design.jpg'],
    estimatedHours: 10,
    difficulty: 'intermediate',
    category: 'technique',
    subcategory: 'negative-space',
    serviceTrack: 'henna' as ServiceTrack,
  },
  {
    level: 3,
    moduleNumber: '3.4',
    assignmentNumber: 'HN-3.4.2',
    orderIndex: 22,
    title: 'Shading & Gradient Techniques',
    description: 'Learn advanced shading techniques to add depth and dimension to henna designs.',
    instructions: `1. Study shading methods: parallel lines, cross-hatching, stippling (dots), gradient fills
2. Practice parallel line shading at varying densities for light-to-dark effect
3. Practice stippling: creating tonal gradients using dot density
4. Learn to shade petals and leaves for 3D appearance
5. Practice smooth gradient transitions in large design areas
6. Create a design that showcases all 4 shading techniques`,
    objectives: [
      'Execute multiple shading techniques with control',
      'Create depth and dimension in flat designs',
      'Achieve smooth gradient transitions',
      'Use shading to enhance realism in motifs',
    ],
    skills: ['Parallel line shading', 'Cross-hatching', 'Stippling', 'Gradient fills'],
    expectedOutcome: 'A showcase design demonstrating all 4 shading techniques with clear gradient effects.',
    passingCriteria: 'Shading is even and controlled, gradients are smooth, 3D effect is visible',
    referencePhotos: ['/curriculum/henna/shading-techniques.jpg', '/curriculum/henna/gradient-henna.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'technique',
    subcategory: 'shading',
    serviceTrack: 'henna' as ServiceTrack,
  },

  // ============================================================================
  // LEVEL 4: ADVANCED ARTISTRY (Months 9-12)
  // ============================================================================

  // Module 4.1: Bridal Henna Mastery
  {
    level: 4,
    moduleNumber: '4.1',
    assignmentNumber: 'HN-4.1.1',
    orderIndex: 23,
    title: 'Bridal Mehndi — Full Arms & Feet',
    description: 'Master complete bridal henna covering hands (front and back), forearms to elbows, feet, and ankles.',
    instructions: `1. Plan a complete bridal set: 4 hand sides + 2 forearms + 2 feet + 2 ankles
2. Design cohesive themes across all surfaces (consistent motifs and style)
3. Practice forearm extensions that flow naturally from hand designs
4. Create full foot and ankle designs that complement the hand work
5. Time yourself: a complete bridal set should take 3-5 hours
6. Execute a full bridal set on a volunteer (or practice mannequins)`,
    objectives: [
      'Design cohesive bridal sets across all surfaces',
      'Extend designs naturally up forearms',
      'Complete a full bridal set in 3-5 hours',
      'Maintain quality and detail over extended sessions',
    ],
    skills: ['Bridal set design', 'Extended surface work', 'Session endurance', 'Thematic cohesion'],
    expectedOutcome: 'A complete bridal henna set on practice surfaces or volunteer, documented with photos.',
    passingCriteria: 'Set is cohesive across all surfaces, detail is consistent, completed within time frame',
    referencePhotos: ['/curriculum/henna/bridal-full-set.jpg', '/curriculum/henna/bridal-forearm.jpg'],
    estimatedHours: 25,
    difficulty: 'advanced',
    category: 'bridal',
    subcategory: 'full-bridal',
    serviceTrack: 'henna' as ServiceTrack,
  },
  {
    level: 4,
    moduleNumber: '4.1',
    assignmentNumber: 'HN-4.1.2',
    orderIndex: 24,
    title: 'Bridal Consultation & Service Management',
    description: 'Learn to manage the complete bridal henna experience from initial consultation through application day.',
    instructions: `1. Create a bridal consultation questionnaire (style preference, outfit, budget, timeline)
2. Practice creating mood boards and design proposals for brides
3. Learn pricing strategies for bridal packages (hands, feet, party, touch-ups)
4. Develop a bridal session checklist: supplies, timing, breaks, lighting
5. Practice managing the bridal session environment (family, photographer, comfort)
6. Conduct a mock bridal consultation and create a complete proposal`,
    objectives: [
      'Conduct thorough bridal consultations',
      'Create professional design proposals',
      'Price bridal packages appropriately',
      'Manage the bridal session environment',
    ],
    skills: ['Bridal consultation', 'Proposal creation', 'Package pricing', 'Session management'],
    expectedOutcome: 'A complete bridal consultation package: questionnaire, mood board, proposal, and pricing.',
    passingCriteria: 'Materials are professional, pricing is fair and profitable, proposal is compelling',
    referencePhotos: ['/curriculum/henna/bridal-consultation.jpg', '/curriculum/henna/mood-board.jpg'],
    estimatedHours: 10,
    difficulty: 'advanced',
    category: 'bridal',
    subcategory: 'consultation',
    serviceTrack: 'henna' as ServiceTrack,
  },

  // Module 4.2: Advanced Pattern & Freehand Skills
  {
    level: 4,
    moduleNumber: '4.2',
    assignmentNumber: 'HN-4.2.1',
    orderIndex: 25,
    title: 'Advanced Freehand Design — No Sketching',
    description: 'Develop the ability to create complex, balanced designs directly on skin without pre-drawing or stencils.',
    instructions: `1. Practice building designs element-by-element directly on skin
2. Learn mental mapping: visualizing the complete design before starting
3. Practice symmetrical freehand work: matching both hands without a template
4. Create 3 complex freehand designs without any pre-sketching
5. Work on different skin tones and textures
6. Complete a timed freehand test: full back-of-hand design in 20 minutes`,
    objectives: [
      'Create complex designs freehand on skin',
      'Maintain symmetry without guides',
      'Adapt to different skin tones and textures',
      'Work confidently without pre-drawing',
    ],
    skills: ['Freehand design', 'Mental mapping', 'Symmetry control', 'Skin adaptation'],
    expectedOutcome: 'Three complex freehand designs on skin plus a timed test design.',
    passingCriteria: 'Designs are balanced and complex, symmetry is maintained, timed test is completed well',
    referencePhotos: ['/curriculum/henna/freehand-design.jpg', '/curriculum/henna/symmetry.jpg'],
    estimatedHours: 18,
    difficulty: 'advanced',
    category: 'technique',
    subcategory: 'freehand',
    serviceTrack: 'henna' as ServiceTrack,
  },
  {
    level: 4,
    moduleNumber: '4.2',
    assignmentNumber: 'HN-4.2.2',
    orderIndex: 26,
    title: 'Intricate Fills & Micro-Detail Work',
    description: 'Master ultra-fine detail work and intricate fill patterns that elevate designs to professional-level artistry.',
    instructions: `1. Practice micro-dot work: tiny consistent dots for texture and tone
2. Learn intricate fill patterns: mesh, fishnet, peacock eye, spiral, checkered
3. Practice fine-line work using thin cone tips (under 0.5mm)
4. Create designs where the fill patterns are the primary visual interest
5. Study the work of master henna artists and replicate their fill techniques
6. Create a "fill sampler" showcasing 12 different fill patterns`,
    objectives: [
      'Execute ultra-fine detail work consistently',
      'Master 12+ fill pattern variations',
      'Use thin cone tips for micro-detail',
      'Make fill work the star of the design',
    ],
    skills: ['Micro-detail', 'Fill patterns', 'Fine-line work', 'Precision control'],
    expectedOutcome: 'A fill sampler with 12 patterns plus a design where fill work is the primary feature.',
    passingCriteria: 'Fills are consistent and precise, micro-details are clean, sampler shows variety',
    referencePhotos: ['/curriculum/henna/micro-detail.jpg', '/curriculum/henna/fill-patterns.jpg'],
    estimatedHours: 16,
    difficulty: 'advanced',
    category: 'technique',
    subcategory: 'micro-detail',
    serviceTrack: 'henna' as ServiceTrack,
  },

  // Module 4.3: Body Art & Extended Placements
  {
    level: 4,
    moduleNumber: '4.3',
    assignmentNumber: 'HN-4.3.1',
    orderIndex: 27,
    title: 'Body Henna — Shoulder, Back & Torso',
    description: 'Learn to design and apply henna on larger body areas: shoulders, upper back, chest/collarbone, and belly (maternity).',
    instructions: `1. Study body placement considerations: visibility, movement, skin sensitivity
2. Design for shoulder cap and upper arm (popular for photos and festivals)
3. Practice upper back designs: mandala center-back, trailing vine designs
4. Learn maternity belly henna: celebrating pregnancy with meaningful designs
5. Understand collarbone and chest placement for fashion/bridal
6. Apply at least 2 body area designs on volunteers`,
    objectives: [
      'Design for large curved body surfaces',
      'Create maternity belly henna designs',
      'Apply henna on shoulders, back, and chest',
      'Manage client comfort during body application',
    ],
    skills: ['Body art design', 'Curved surface application', 'Maternity henna', 'Large-scale design'],
    expectedOutcome: 'Two body area designs on real skin with documentation.',
    passingCriteria: 'Designs follow body contours, application is clean on large surfaces, client is comfortable',
    referencePhotos: ['/curriculum/henna/shoulder-henna.jpg', '/curriculum/henna/maternity-belly.jpg'],
    estimatedHours: 14,
    difficulty: 'advanced',
    category: 'application',
    subcategory: 'body-art',
    serviceTrack: 'henna' as ServiceTrack,
  },

  // Module 4.4: Henna for Special Occasions
  {
    level: 4,
    moduleNumber: '4.4',
    assignmentNumber: 'HN-4.4.1',
    orderIndex: 28,
    title: 'Themed Henna — Festivals, Holidays & Cultural Events',
    description: 'Design henna for specific cultural events and celebrations including Eid, Diwali, Christmas, and seasonal festivals.',
    instructions: `1. Research henna traditions for different celebrations: Eid, Diwali, Karva Chauth, Teej
2. Create themed designs for religious and cultural festivals
3. Design seasonal henna: spring florals, summer tropical, autumn harvest, winter snowflakes
4. Create Valentine's Day, New Year, and birthday-themed quick designs
5. Design henna for gender reveals and baby showers
6. Build a themed design portfolio with at least 10 occasion-specific designs`,
    objectives: [
      'Create culturally appropriate designs for various celebrations',
      'Design seasonal and holiday-themed henna',
      'Build a versatile themed portfolio',
      'Understand the significance of designs for specific occasions',
    ],
    skills: ['Themed design', 'Cultural appropriateness', 'Seasonal design', 'Portfolio building'],
    expectedOutcome: 'A themed portfolio with 10+ designs for different occasions and seasons.',
    passingCriteria: 'Designs are culturally appropriate, themes are clear, portfolio shows range',
    referencePhotos: ['/curriculum/henna/eid-henna.jpg', '/curriculum/henna/seasonal-designs.jpg'],
    estimatedHours: 12,
    difficulty: 'advanced',
    category: 'design',
    subcategory: 'themed',
    serviceTrack: 'henna' as ServiceTrack,
  },

  // ============================================================================
  // LEVEL 5: MASTERY & PORTFOLIO (Months 13-15)
  // ============================================================================

  // Module 5.1: Signature Style Development
  {
    level: 5,
    moduleNumber: '5.1',
    assignmentNumber: 'HN-5.1.1',
    orderIndex: 29,
    title: 'Developing Your Signature Henna Style',
    description: 'Identify and develop your unique artistic voice as a henna artist, creating a recognizable personal style.',
    instructions: `1. Analyze your own work: which styles, elements, and techniques define your best work
2. Study 5 professional henna artists and identify what makes each unique
3. Experiment with combining your favorite elements into a distinctive style
4. Create 5 designs that represent your "signature" aesthetic
5. Get feedback from mentors and peers on what makes your work distinct
6. Write an artist statement describing your style and influences`,
    objectives: [
      'Identify your strongest design tendencies',
      'Develop a recognizable personal style',
      'Articulate your artistic vision',
      'Create designs that are distinctively "yours"',
    ],
    skills: ['Style development', 'Self-analysis', 'Artistic identity', 'Creative voice'],
    expectedOutcome: 'Five signature-style designs and a written artist statement.',
    passingCriteria: 'Designs show a cohesive personal style, artist statement is thoughtful and clear',
    referencePhotos: ['/curriculum/henna/signature-style.jpg', '/curriculum/henna/artist-portfolio.jpg'],
    estimatedHours: 14,
    difficulty: 'advanced',
    category: 'mastery',
    subcategory: 'signature-style',
    serviceTrack: 'henna' as ServiceTrack,
  },
  {
    level: 5,
    moduleNumber: '5.1',
    assignmentNumber: 'HN-5.1.2',
    orderIndex: 30,
    title: 'Professional Portfolio Creation',
    description: 'Build a stunning professional portfolio showcasing your best henna work across all styles and occasions.',
    instructions: `1. Select 20-25 of your best henna photographs across all categories
2. Organize by category: bridal, Arabic, Indian, contemporary, body art, event
3. Ensure photos are high quality: sharp, well-lit, consistent background
4. Edit photos for consistency: color correction, cropping, watermarking
5. Create both digital (Instagram portfolio, PDF) and printed versions
6. Include your artist bio, services offered, and contact information`,
    objectives: [
      'Curate a professional-quality portfolio',
      'Photograph henna work for maximum impact',
      'Create consistent, branded presentation',
      'Build both digital and physical portfolios',
    ],
    skills: ['Portfolio curation', 'Henna photography', 'Brand presentation', 'Digital presence'],
    expectedOutcome: 'A complete portfolio with 20+ images in digital and print format.',
    passingCriteria: 'Photos are professional quality, portfolio is well-organized, branding is consistent',
    referencePhotos: ['/curriculum/henna/portfolio-layout.jpg', '/curriculum/henna/henna-photography.jpg'],
    estimatedHours: 16,
    difficulty: 'advanced',
    category: 'mastery',
    subcategory: 'portfolio',
    serviceTrack: 'henna' as ServiceTrack,
  },

  // Module 5.2: Teaching & Mentorship
  {
    level: 5,
    moduleNumber: '5.2',
    assignmentNumber: 'HN-5.2.1',
    orderIndex: 31,
    title: 'Teaching Henna — Workshop Facilitation',
    description: 'Learn to teach henna to beginners by designing and conducting a structured workshop.',
    instructions: `1. Design a 2-hour beginner henna workshop curriculum
2. Create workshop materials: practice sheets, step-by-step guides, supply lists
3. Prepare practice kits for participants (cones, practice paper, design sheets)
4. Conduct a workshop for 3-5 beginners (classmates or community members)
5. Teach basic strokes, simple designs, and cone handling
6. Gather participant feedback and refine your teaching approach`,
    objectives: [
      'Design a structured teaching curriculum for beginners',
      'Create clear instructional materials',
      'Conduct a workshop with confidence',
      'Adapt teaching to different skill levels',
    ],
    skills: ['Teaching', 'Curriculum design', 'Workshop facilitation', 'Instruction'],
    expectedOutcome: 'A complete workshop kit and documented workshop with 3-5 participants.',
    passingCriteria: 'Workshop is well-structured, participants learn basic skills, feedback is positive',
    referencePhotos: ['/curriculum/henna/workshop.jpg', '/curriculum/henna/teaching-materials.jpg'],
    estimatedHours: 14,
    difficulty: 'advanced',
    category: 'mastery',
    subcategory: 'teaching',
    serviceTrack: 'henna' as ServiceTrack,
  },

  // Module 5.3: Quality & Consistency
  {
    level: 5,
    moduleNumber: '5.3',
    assignmentNumber: 'HN-5.3.1',
    orderIndex: 32,
    title: 'Quality Standards & Stain Optimization',
    description: 'Develop expertise in achieving consistently deep, long-lasting stains through paste optimization and application technique.',
    instructions: `1. Experiment with paste recipes for different climates and skin types
2. Test essential oil ratios for optimal stain (eucalyptus, tea tree, cajeput)
3. Study how body chemistry affects stain: areas that stain well vs poorly
4. Develop techniques for challenging areas (wrist, fingers, top of hand)
5. Create a troubleshooting guide for common stain issues
6. Document stain results across 10 different applications with variables tracked`,
    objectives: [
      'Optimize paste recipes for deep, consistent stains',
      'Understand body chemistry effects on staining',
      'Troubleshoot common stain problems',
      'Achieve consistently professional results',
    ],
    skills: ['Stain optimization', 'Paste chemistry', 'Troubleshooting', 'Consistency'],
    expectedOutcome: 'A stain optimization guide with 10 documented applications and variable tracking.',
    passingCriteria: 'Stains are consistently deep (dark brown to maroon), guide covers common issues',
    referencePhotos: ['/curriculum/henna/stain-optimization.jpg', '/curriculum/henna/stain-comparison.jpg'],
    estimatedHours: 12,
    difficulty: 'advanced',
    category: 'quality',
    subcategory: 'stain-optimization',
    serviceTrack: 'henna' as ServiceTrack,
  },

  // ============================================================================
  // LEVEL 6: BUSINESS & PROFESSIONAL (Months 16-18)
  // ============================================================================

  // Module 6.1: Photography & Social Media
  {
    level: 6,
    moduleNumber: '6.1',
    assignmentNumber: 'HN-6.1.1',
    orderIndex: 33,
    title: 'Henna Photography & Content Creation',
    description: 'Master photography and video content creation specific to henna art for social media and marketing.',
    instructions: `1. Learn to photograph henna on skin: lighting, angles, background, hand poses
2. Practice before-and-after shots showing fresh paste and final stain
3. Create time-lapse videos of henna application process
4. Learn editing for henna photos: color accuracy, skin smoothing (ethical limits)
5. Create Reels/TikTok content: satisfying application videos, transformations
6. Build 2 weeks of content and post to social media`,
    objectives: [
      'Photograph henna work with professional quality',
      'Create engaging video content for social media',
      'Edit photos and videos for maximum impact',
      'Build a consistent social media content pipeline',
    ],
    skills: ['Henna photography', 'Video creation', 'Content editing', 'Social media strategy'],
    expectedOutcome: 'Two weeks of posted social media content with engagement tracking.',
    passingCriteria: 'Photos are professional, videos are engaging, content is consistent',
    referencePhotos: ['/curriculum/henna/henna-photo-tips.jpg', '/curriculum/henna/social-content.jpg'],
    estimatedHours: 14,
    difficulty: 'intermediate',
    category: 'business',
    subcategory: 'photography',
    serviceTrack: 'henna' as ServiceTrack,
  },

  // Module 6.2: Pricing & Business Setup
  {
    level: 6,
    moduleNumber: '6.2',
    assignmentNumber: 'HN-6.2.1',
    orderIndex: 34,
    title: 'Pricing Strategy & Service Packages',
    description: 'Develop a profitable pricing strategy for henna services including individual designs, events, and bridal packages.',
    instructions: `1. Calculate material costs per application (paste, cone, aftercare, supplies)
2. Track time per design type and calculate hourly rate
3. Research local market rates for henna services
4. Create a pricing menu: simple designs, medium, complex, bridal, event rates
5. Design bridal packages: hands only, hands + feet, full bridal + party
6. Create a professional price list and booking terms document`,
    objectives: [
      'Calculate accurate costs per service',
      'Set competitive and profitable prices',
      'Create tiered service packages',
      'Develop professional booking terms',
    ],
    skills: ['Cost calculation', 'Pricing strategy', 'Package design', 'Business terms'],
    expectedOutcome: 'A complete pricing menu, 3 bridal packages, and professional booking terms.',
    passingCriteria: 'Pricing covers costs and profit, packages are attractive, terms are clear',
    referencePhotos: ['/curriculum/henna/price-menu.jpg', '/curriculum/henna/bridal-packages.jpg'],
    estimatedHours: 8,
    difficulty: 'intermediate',
    category: 'business',
    subcategory: 'pricing',
    serviceTrack: 'henna' as ServiceTrack,
  },
  {
    level: 6,
    moduleNumber: '6.2',
    assignmentNumber: 'HN-6.2.2',
    orderIndex: 35,
    title: 'Booking System & Client Management',
    description: 'Set up a professional booking and client management system for your henna business.',
    instructions: `1. Set up an online booking system (Calendly, Square Appointments, or Instagram booking)
2. Create a client intake form: design preferences, allergies, occasion, budget
3. Develop a booking workflow: inquiry → consultation → deposit → appointment → aftercare
4. Set up payment processing (mobile money, bank transfer, card payment)
5. Create follow-up templates: confirmation, reminder, aftercare, review request
6. Practice the full booking workflow with mock clients`,
    objectives: [
      'Set up and manage an online booking system',
      'Create professional client intake processes',
      'Handle deposits and payments efficiently',
      'Maintain client relationships with follow-ups',
    ],
    skills: ['Booking management', 'Client intake', 'Payment processing', 'Follow-up systems'],
    expectedOutcome: 'A functioning booking system with all templates and 3 mock bookings processed.',
    passingCriteria: 'System is functional, templates are professional, workflow is smooth',
    referencePhotos: ['/curriculum/henna/booking-system.jpg', '/curriculum/henna/client-form.jpg'],
    estimatedHours: 8,
    difficulty: 'intermediate',
    category: 'business',
    subcategory: 'booking',
    serviceTrack: 'henna' as ServiceTrack,
  },

  // Module 6.3: Marketing & Brand Building
  {
    level: 6,
    moduleNumber: '6.3',
    assignmentNumber: 'HN-6.3.1',
    orderIndex: 36,
    title: 'Brand Identity & Online Presence',
    description: 'Build a professional brand identity for your henna business including name, visual identity, and online profiles.',
    instructions: `1. Choose a business name and create a simple logo/brand mark
2. Define your brand aesthetic: colors, fonts, photography style
3. Set up professional profiles on Instagram, Facebook, and Google Business
4. Create a simple website or landing page with portfolio, services, and booking
5. Develop a brand story connecting your cultural background with your art
6. Create branded materials: business cards, stickers, aftercare cards`,
    objectives: [
      'Create a cohesive brand identity',
      'Establish professional online presence',
      'Build a simple website or landing page',
      'Create branded physical materials',
    ],
    skills: ['Brand development', 'Online presence', 'Website creation', 'Marketing materials'],
    expectedOutcome: 'Complete brand package: logo, online profiles, website, and printed materials.',
    passingCriteria: 'Brand is cohesive and professional, online presence is active, materials are polished',
    referencePhotos: ['/curriculum/henna/brand-identity.jpg', '/curriculum/henna/business-cards.jpg'],
    estimatedHours: 16,
    difficulty: 'intermediate',
    category: 'business',
    subcategory: 'branding',
    serviceTrack: 'henna' as ServiceTrack,
  },
  {
    level: 6,
    moduleNumber: '6.3',
    assignmentNumber: 'HN-6.3.2',
    orderIndex: 37,
    title: 'Event Networking & Vendor Partnerships',
    description: 'Learn to build a network of event vendors and establish partnerships for consistent bookings.',
    instructions: `1. Identify potential partners: wedding planners, event venues, photographers, makeup artists
2. Create a professional introduction package to send to potential partners
3. Reach out to 5 local event businesses with partnership proposals
4. Offer a demo session or portfolio presentation to potential partners
5. Develop a referral program for mutual benefit
6. Attend or participate in a wedding expo or craft market`,
    objectives: [
      'Build professional vendor relationships',
      'Create compelling partnership proposals',
      'Develop a referral network',
      'Present services at industry events',
    ],
    skills: ['Networking', 'Partnership building', 'Referral systems', 'Industry participation'],
    expectedOutcome: '5 partnership outreach attempts, at least 1 confirmed partnership, and event participation.',
    passingCriteria: 'Outreach is professional, at least 1 partnership established, event participation documented',
    referencePhotos: ['/curriculum/henna/vendor-network.jpg', '/curriculum/henna/wedding-expo.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'business',
    subcategory: 'networking',
    serviceTrack: 'henna' as ServiceTrack,
  },

  // Module 6.4: Final Capstone
  {
    level: 6,
    moduleNumber: '6.4',
    assignmentNumber: 'HN-6.4.1',
    orderIndex: 38,
    title: 'FINAL PROJECT: Complete Bridal Henna Service',
    description: 'Execute a complete bridal henna service from consultation through application and aftercare, demonstrating mastery of all skills.',
    instructions: `1. Conduct a full bridal consultation with a real or mock bride
2. Create a design proposal with mood board, sketches, and pricing
3. Prepare fresh henna paste optimized for deep staining
4. Apply a complete bridal set: both hands (front and back), both feet, plus forearm extensions
5. Document the entire process with professional photography and video
6. Provide aftercare guidance and follow up with stain result photos
7. Create a case study documenting the complete bridal experience
8. Present your work to mentors for final assessment`,
    objectives: [
      'Execute the complete bridal henna service lifecycle',
      'Demonstrate mastery of advanced design and application',
      'Achieve consistently deep, professional stains',
      'Document and present work at professional standard',
    ],
    skills: ['Complete service delivery', 'Advanced technique mastery', 'Client management', 'Professional documentation'],
    expectedOutcome: 'A complete bridal henna case study with professional documentation and stain results.',
    passingCriteria: 'Bridal set is elaborate and cohesive, stain is deep and even, documentation is professional, client is delighted',
    referencePhotos: ['/curriculum/henna/final-bridal.jpg', '/curriculum/henna/capstone-presentation.jpg'],
    estimatedHours: 30,
    difficulty: 'expert',
    category: 'capstone',
    subcategory: 'final-project',
    serviceTrack: 'henna' as ServiceTrack,
  },
]

export async function seedHennaCurriculum() {
  console.log('Seeding henna tattoo curriculum...')

  for (const assignment of hennaCurriculum) {
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

  console.log(`\nSeeded ${hennaCurriculum.length} henna tattoo assignment templates`)
}

// Run if called directly
if (require.main === module) {
  seedHennaCurriculum()
    .then(() => prisma.$disconnect())
    .catch((e) => {
      console.error(e)
      prisma.$disconnect()
      process.exit(1)
    })
}

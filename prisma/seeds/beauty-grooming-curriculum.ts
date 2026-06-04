import { PrismaClient, ServiceTrack } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Beauty & Grooming Curriculum Seed
 *
 * Complete beauty and grooming professional journey from shop setup to expertise
 * 6 levels, 70 assignments total
 *
 * Level 1: Foundations - Shop Setup, Safety, Tools & Sanitation (12 assignments)
 * Level 2: Basic Services - Men's Grooming & Basic Hair Care (12 assignments)
 * Level 3: Intermediate - Women's Hair Services & Makeup Basics (12 assignments)
 * Level 4: Advanced - Nail Services & Advanced Makeup (12 assignments)
 * Level 5: Expert - Skincare, Facials & Specializations (12 assignments)
 * Level 6: Business & Mastery (10 assignments)
 *
 * Total: 70 assignments covering shop setup to running a beauty business
 */

export async function seedBeautyGroomingCurriculum() {
  console.log('💄 Seeding Beauty & Grooming Curriculum...')

  const assignments = [
    // ========================================================================
    // LEVEL 1: FOUNDATIONS - Shop Setup, Safety, Tools & Sanitation
    // ========================================================================
    {
      level: 1,
      moduleNumber: '1.1',
      assignmentNumber: 'BG-1.1.1',
      orderIndex: 1,
      title: 'Beauty Salon Safety & Shop Setup',
      description: 'Learn essential safety practices for beauty services and set up a functional salon with proper sanitation, lighting, ventilation, and professional workspace organization.',
      instructions: `1. Study salon safety hazards: chemical exposure, sharp tools, electrical equipment, slip hazards
2. Learn proper ventilation requirements: fume extraction for chemicals, air circulation
3. Set up lighting: bright natural lighting at styling stations, proper mirror illumination
4. Organize reception area: client check-in, product display, waiting area
5. Create styling stations: mirror, chair, tool storage, electrical outlets
6. Set up shampoo station: plumbing, reclining chair, product storage
7. Install sterilization area: autoclave or UV sterilizer, disinfectant solutions
8. Prepare chemical storage: locked cabinet for hair dyes, relaxers, perms
9. Create waste disposal system: sharps container, chemical disposal, general waste
10. Complete safety checklist and photograph your organized salon`,
      objectives: [
        'Identify all safety hazards in beauty salon operations',
        'Set up proper ventilation and lighting systems',
        'Organize professional styling stations',
        'Establish sanitation and sterilization protocols',
        'Create safe chemical storage procedures',
        'Develop professional salon workflow',
      ],
      skills: ['Salon safety', 'Space organization', 'Sanitation protocols', 'Equipment setup', 'Hazard identification', 'Professional standards'],
      expectedOutcome: 'Fully organized beauty salon with proper safety equipment, ventilation, lighting, sterilization area, and professional stations. Safety checklist completed.',
      passingCriteria: 'Salon has adequate ventilation, all stations are properly equipped, lighting is sufficient, chemicals are safely stored, sterilization area is functional and compliant',
      referencePhotos: ['/curriculum/beauty/salon-layout.jpg', '/curriculum/beauty/station-setup.jpg', '/curriculum/beauty/safety-equipment.jpg'],
      estimatedHours: 8,
      difficulty: 'beginner',
      category: 'setup',
      subcategory: 'safety',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
      requiredReading: [
        '"Milady\'s Standard Cosmetology" - Chapter 1: Safety & Sanitation',
        'OSHA guidelines for beauty salons',
        'State cosmetology board regulations',
      ],
    },
    {
      level: 1,
      moduleNumber: '1.1',
      assignmentNumber: 'BG-1.1.2',
      orderIndex: 2,
      title: 'Sanitation & Sterilization Fundamentals',
      description: 'Master proper sanitation and sterilization techniques for all beauty tools and equipment to prevent cross-contamination and ensure client safety.',
      instructions: `1. Learn difference between sanitation, disinfection, and sterilization
2. Study bacterial, viral, and fungal contamination risks
3. Practice pre-cleaning: remove all visible debris before disinfection
4. Learn chemical disinfection: hospital-grade disinfectants, contact time, dilution ratios
5. Practice UV sterilization: proper placement, exposure time, rotating tools
6. Study autoclave sterilization: temperature, pressure, time for metal tools
7. Organize clean vs. dirty tool separation: color-coded containers
8. Create sanitation schedule: between clients, daily, weekly deep cleaning
9. Practice hand washing protocol: 20 seconds, proper technique, drying
10. Complete sanitation certification exam and create personal protocol checklist`,
      objectives: [
        'Differentiate sanitation methods and their applications',
        'Prevent cross-contamination between clients',
        'Properly disinfect all tools and equipment',
        'Maintain sterilization equipment correctly',
        'Follow professional hygiene standards',
        'Create and follow sanitation schedules',
      ],
      skills: ['Sanitation techniques', 'Sterilization methods', 'Contamination prevention', 'Chemical safety', 'Professional hygiene', 'Compliance'],
      expectedOutcome: 'Sanitation protocol checklist, properly sterilized tool sets, certification exam passed. Demonstration of proper pre-cleaning and sterilization of various tools.',
      passingCriteria: 'All sanitation methods correctly demonstrated, tools are properly sterilized, protocol checklist is comprehensive, exam score is 90% or higher',
      referencePhotos: ['/curriculum/beauty/sterilization-station.jpg', '/curriculum/beauty/tool-cleaning.jpg', '/curriculum/beauty/sanitation-protocol.jpg'],
      estimatedHours: 6,
      difficulty: 'beginner',
      category: 'fundamentals',
      subcategory: 'sanitation',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
      requiredReading: [
        '"Infection Control for Cosmetology" certification guide',
        'CDC guidelines for personal service workers',
      ],
    },
    {
      level: 1,
      moduleNumber: '1.2',
      assignmentNumber: 'BG-1.2.1',
      orderIndex: 3,
      title: 'Essential Beauty Tools & Equipment Recognition',
      description: 'Learn to identify, use, and maintain all essential beauty and grooming tools including shears, razors, brushes, combs, and styling implements.',
      instructions: `1. Study cutting tools: shears (7", 6", 5.5"), thinning shears, razors, trimmers
2. Learn combs and brushes: wide-tooth, tail comb, paddle brush, round brushes, teasing brush
3. Identify styling tools: blow dryer, flat iron, curling irons (various sizes), hot rollers
4. Study nail tools: clippers, files, buffers, pushers, nippers, UV lamp
5. Learn makeup tools: brushes (foundation, powder, blush, eye shadow, liner), sponges, spatulas
6. Practice shear maintenance: cleaning, oiling, tension adjustment, sharpening schedule
7. Test electrical tools: heat settings, proper handling, cool-down procedures
8. Organize tools by service type: hair cutting station, nail station, makeup station
9. Practice tool handling: proper grip, control, safety positioning
10. Create tool inventory with maintenance schedule for each item`,
      objectives: [
        'Identify all essential beauty tools and their purposes',
        'Understand proper tool selection for each service',
        'Maintain tools in professional condition',
        'Handle electrical equipment safely',
        'Organize tools for efficient workflow',
        'Create maintenance schedules',
      ],
      skills: ['Tool identification', 'Equipment maintenance', 'Shear handling', 'Brush techniques', 'Electrical safety', 'Organization'],
      expectedOutcome: 'Tool inventory with photos and descriptions, maintenance schedule, demonstration of proper handling for each tool category.',
      passingCriteria: 'All tools correctly identified and categorized, maintenance procedures demonstrated properly, tools are clean and functional, organization system is efficient',
      referencePhotos: ['/curriculum/beauty/essential-tools.jpg', '/curriculum/beauty/tool-maintenance.jpg', '/curriculum/beauty/station-organization.jpg'],
      estimatedHours: 8,
      difficulty: 'beginner',
      category: 'fundamentals',
      subcategory: 'tools',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 1,
      moduleNumber: '1.2',
      assignmentNumber: 'BG-1.2.2',
      orderIndex: 4,
      title: 'Hair Analysis & Client Consultation',
      description: 'Master the art of analyzing hair type, texture, condition, and face shape to provide appropriate service recommendations during client consultations.',
      instructions: `1. Learn hair texture classification: fine, medium, coarse
2. Study hair porosity: low, normal, high - water test, indicators
3. Analyze hair density: thin, medium, thick - visual assessment
4. Identify hair condition: healthy, damaged, chemically treated, heat damaged
5. Study face shapes: oval, round, square, heart, oblong, diamond
6. Practice consultation techniques: active listening, asking open questions
7. Learn to assess scalp conditions: dry, oily, normal, dandruff, sensitivity
8. Create client consultation cards: hair history, chemical treatments, allergies
9. Practice style recommendations: matching face shape to hairstyles
10. Conduct 5 practice consultations with detailed notes and recommendations`,
      objectives: [
        'Accurately analyze hair texture and condition',
        'Identify face shapes and recommend suitable styles',
        'Conduct professional client consultations',
        'Document client information properly',
        'Recognize contraindications for services',
        'Build client trust through expertise',
      ],
      skills: ['Hair analysis', 'Client communication', 'Face shape identification', 'Consultation techniques', 'Documentation', 'Professional recommendations'],
      expectedOutcome: '5 completed consultation cards with detailed hair analysis, face shape identification, and style recommendations. Written assessment of each client.',
      passingCriteria: 'Hair texture and condition correctly identified in all cases, face shapes accurately determined, recommendations are appropriate, consultation cards are complete and professional',
      referencePhotos: ['/curriculum/beauty/hair-textures.jpg', '/curriculum/beauty/face-shapes.jpg', '/curriculum/beauty/consultation-form.jpg'],
      estimatedHours: 10,
      difficulty: 'beginner',
      category: 'fundamentals',
      subcategory: 'consultation',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 1,
      moduleNumber: '1.3',
      assignmentNumber: 'BG-1.3.1',
      orderIndex: 5,
      title: 'Product Knowledge: Hair Care Basics',
      description: 'Learn about different hair care products, their ingredients, purposes, and proper application techniques for various hair types.',
      instructions: `1. Study shampoo types: clarifying, moisturizing, color-safe, sulfate-free, dandruff
2. Learn conditioner types: daily, deep conditioning, leave-in, protein treatments
3. Identify styling products: gels, mousses, pomades, waxes, sprays, serums
4. Study heat protectants: when to use, application methods, protection levels
5. Learn about chemical products: relaxers, perms, dyes - safety and storage
6. Practice reading ingredient labels: identify beneficial and harmful ingredients
7. Understand pH levels: importance for hair health, testing methods
8. Match products to hair types: fine, thick, curly, straight, damaged
9. Learn proper product application amounts: avoiding waste and build-up
10. Create product reference guide with recommendations for different hair types`,
      objectives: [
        'Identify all major product categories and their purposes',
        'Understand ingredients and their effects on hair',
        'Match products to appropriate hair types',
        'Apply products correctly and efficiently',
        'Educate clients on home hair care',
        'Recognize potential allergic reactions or contraindications',
      ],
      skills: ['Product knowledge', 'Ingredient analysis', 'Hair typing', 'Application techniques', 'Client education', 'Safety awareness'],
      expectedOutcome: 'Comprehensive product reference guide organized by hair type and service category. Demonstration of proper product selection and application for 3 different hair types.',
      passingCriteria: 'All product categories correctly identified, ingredients properly understood, applications match hair types appropriately, reference guide is comprehensive and accurate',
      estimatedHours: 8,
      difficulty: 'beginner',
      category: 'fundamentals',
      subcategory: 'products',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 1,
      moduleNumber: '1.3',
      assignmentNumber: 'BG-1.3.2',
      orderIndex: 6,
      title: 'Shampooing & Conditioning Techniques',
      description: 'Master professional shampooing and conditioning techniques including scalp massage, proper rinsing, and towel drying methods.',
      instructions: `1. Set up shampoo station: towels, products, water temperature control
2. Practice client draping: cape application, towel placement, comfort check
3. Learn water temperature testing: use wrist, check with client
4. Study shampooing technique: scalp stimulation, not hair scrubbing
5. Practice scalp massage: circular motions, pressure points, relaxation
6. Learn proper rinsing: complete product removal, temperature transition
7. Practice conditioner application: mid-shaft to ends, avoid scalp for fine hair
8. Study processing time: product penetration, heat application when needed
9. Learn towel drying: blotting not rubbing, removing excess water
10. Complete 10 shampoo services with different hair types and document`,
      objectives: [
        'Properly prepare client for shampoo service',
        'Perform effective scalp cleansing and massage',
        'Apply conditioner appropriately for different hair types',
        'Ensure client comfort throughout service',
        'Remove all products completely',
        'Prepare hair properly for styling',
      ],
      skills: ['Shampooing technique', 'Scalp massage', 'Client comfort', 'Product application', 'Draping', 'Professional service'],
      expectedOutcome: '10 documented shampoo services showing progression of technique, client feedback forms, demonstration of proper massage and product removal.',
      passingCriteria: 'Shampooing technique is gentle and thorough, scalp massage is relaxing and effective, all products completely rinsed, clients report comfort and satisfaction',
      estimatedHours: 12,
      difficulty: 'beginner',
      category: 'fundamentals',
      subcategory: 'basic_services',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 1,
      moduleNumber: '1.4',
      assignmentNumber: 'BG-1.4.1',
      orderIndex: 7,
      title: 'Basic Blow-Drying Techniques',
      description: 'Learn fundamental blow-drying techniques for different hair types including proper brush selection, sectioning, and heat control.',
      instructions: `1. Study blow dryer settings: heat levels, speed settings, cool shot button
2. Learn brush selection: round brushes (sizes), paddle brush, vent brush
3. Practice hair sectioning: 4-section method, clips, clean parts
4. Study directional drying: root lift, smoothing, volume creation
5. Learn tension control: brush and dryer coordination, consistent pull
6. Practice heat protection: distance from scalp, moving dryer, not overheating
7. Study finish techniques: cool shot for set, serum for shine
8. Practice on straight hair: smooth finish, no frizz
9. Practice on curly hair: stretch without complete straightening, maintain some texture
10. Complete 15 blow-dry services on various hair types`,
      objectives: [
        'Select appropriate tools for each hair type',
        'Section hair efficiently for blow-drying',
        'Control heat and prevent damage',
        'Create smooth, professional finishes',
        'Work efficiently without fatigue',
        'Adapt technique to different textures',
      ],
      skills: ['Blow-drying', 'Brush techniques', 'Sectioning', 'Heat control', 'Styling efficiency', 'Texture management'],
      expectedOutcome: '15 documented blow-dry services with before/after photos, demonstration of techniques on straight, wavy, and curly hair types.',
      passingCriteria: 'Blow-dries result in smooth, frizz-free finish, no heat damage evident, technique is efficient (under 30 minutes for medium-length hair), client satisfaction is high',
      estimatedHours: 15,
      difficulty: 'beginner',
      category: 'styling',
      subcategory: 'basic_styling',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 1,
      moduleNumber: '1.4',
      assignmentNumber: 'BG-1.4.2',
      orderIndex: 8,
      title: 'Introduction to Thermal Styling',
      description: 'Learn safe and effective use of thermal styling tools including flat irons and curling irons with proper heat protection and technique.',
      instructions: `1. Study thermal tool safety: heat settings, auto-shut off, cord management
2. Learn heat protectant application: even distribution, processing time
3. Practice flat iron technique: sectioning, tension, single-pass smoothing
4. Study curling iron sizes: 1/2", 3/4", 1", 1.5" - effects on different hair lengths
5. Practice curling technique: wrapping hair, timing, release method
6. Learn temperature selection: fine hair (300°F), medium (350°F), coarse (400°F)
7. Study curl direction: toward face, away from face, alternating
8. Practice curl setting: pinning while cooling, hairspray timing
9. Learn finishing: separating curls, adding texture, setting spray
10. Complete 10 thermal styling services with documentation`,
      objectives: [
        'Use thermal tools safely and effectively',
        'Protect hair from heat damage',
        'Create smooth styles with flat iron',
        'Form consistent curls with curling iron',
        'Select appropriate heat settings',
        'Finish styles professionally',
      ],
      skills: ['Thermal styling', 'Heat protection', 'Curl formation', 'Smoothing techniques', 'Temperature control', 'Style finishing'],
      expectedOutcome: '10 documented thermal styling services showing various techniques, before/after photos, no visible heat damage on any client.',
      passingCriteria: 'Thermal tools used safely, heat settings appropriate for hair type, styles have professional finish, curls are uniform when intended, no scorching or damage',
      estimatedHours: 12,
      difficulty: 'beginner',
      category: 'styling',
      subcategory: 'thermal',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 1,
      moduleNumber: '1.5',
      assignmentNumber: 'BG-1.5.1',
      orderIndex: 9,
      title: 'Skin Types & Analysis',
      description: 'Learn to identify different skin types, analyze skin conditions, and perform basic skin assessments for makeup and skincare services.',
      instructions: `1. Study skin types: normal, dry, oily, combination, sensitive
2. Learn skin analysis techniques: visual assessment, touch test, blotting paper test
3. Identify skin concerns: acne, aging, hyperpigmentation, rosacea, eczema
4. Study Fitzpatrick scale: skin tones I-VI, sun sensitivity
5. Learn contraindications: active infections, recent procedures, allergies
6. Practice client skin questionnaire: health history, current routine, concerns
7. Study seasonal skin changes: adjusting recommendations
8. Learn magnifying lamp use: detailed skin examination
9. Practice documentation: skin maps, photo records, treatment notes
10. Complete 10 skin analyses with detailed documentation`,
      objectives: [
        'Accurately identify skin types and conditions',
        'Recognize contraindications for services',
        'Conduct thorough skin consultations',
        'Document skin analysis properly',
        'Recommend appropriate products and services',
        'Understand diverse skin tones and needs',
      ],
      skills: ['Skin analysis', 'Client assessment', 'Documentation', 'Product recommendations', 'Contraindication recognition', 'Professional consultation'],
      expectedOutcome: '10 completed skin analysis forms with photos, skin type identification, condition assessment, and service recommendations.',
      passingCriteria: 'Skin types correctly identified in all cases, contraindications recognized, documentation is thorough, recommendations are appropriate for skin type and concerns',
      estimatedHours: 10,
      difficulty: 'beginner',
      category: 'fundamentals',
      subcategory: 'skin_analysis',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 1,
      moduleNumber: '1.5',
      assignmentNumber: 'BG-1.5.2',
      orderIndex: 10,
      title: 'Color Theory for Beauty Services',
      description: 'Master color theory fundamentals including color wheel, complementary colors, and corrective color application for makeup and hair.',
      instructions: `1. Study color wheel: primary, secondary, tertiary colors
2. Learn color relationships: complementary, analogous, triadic
3. Study warm vs cool tones: identifying undertones in skin, hair
4. Learn corrective color: green cancels red, purple cancels yellow, etc.
5. Practice foundation matching: identifying undertones, testing on jawline
6. Study hair color levels: 1-10 scale, natural vs artificial color
7. Learn color correction in makeup: redness, dark circles, hyperpigmentation
8. Practice color selection: makeup shades for different skin tones
9. Study seasonal color analysis: determining client's best colors
10. Create color reference guide with swatches and applications`,
      objectives: [
        'Understand color wheel and color relationships',
        'Identify warm and cool undertones',
        'Apply corrective color techniques',
        'Match foundation accurately to skin tone',
        'Select appropriate colors for diverse clients',
        'Create harmonious color combinations',
      ],
      skills: ['Color theory', 'Undertone identification', 'Foundation matching', 'Color correction', 'Skin tone analysis', 'Product selection'],
      expectedOutcome: 'Comprehensive color reference guide with examples, successful foundation matches for 5 different skin tones, color correction demonstrations.',
      passingCriteria: 'Color theory concepts correctly understood and applied, undertones accurately identified, foundation matches are seamless, corrective techniques effectively neutralize discoloration',
      estimatedHours: 8,
      difficulty: 'beginner',
      category: 'fundamentals',
      subcategory: 'color_theory',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 1,
      moduleNumber: '1.6',
      assignmentNumber: 'BG-1.6.1',
      orderIndex: 11,
      title: 'Professional Communication & Client Relations',
      description: 'Develop essential professional communication skills for interacting with clients, managing expectations, and building lasting relationships.',
      instructions: `1. Study professional greeting: welcoming clients, introduction, consultation setup
2. Learn active listening: asking clarifying questions, confirming understanding
3. Practice expectation management: realistic outcomes, timeframes, maintenance
4. Study difficult conversations: pricing, service limitations, correcting mistakes
5. Learn upselling techniques: genuine recommendations, not pushy sales
6. Practice appointment management: scheduling, reminders, respecting time
7. Study complaint handling: listening, empathizing, solving, following up
8. Learn client retention: follow-up messages, loyalty programs, referral requests
9. Practice professional boundaries: appropriate topics, personal space, conduct
10. Role-play 10 client scenarios: consultations, complaints, upsells, boundaries`,
      objectives: [
        'Communicate professionally and warmly with clients',
        'Manage client expectations effectively',
        'Handle complaints and difficult situations',
        'Build client loyalty and encourage referrals',
        'Maintain professional boundaries',
        'Create positive client experiences',
      ],
      skills: ['Client communication', 'Active listening', 'Expectation management', 'Conflict resolution', 'Upselling', 'Professional conduct'],
      expectedOutcome: 'Completed role-play exercises with evaluations, client communication script templates, documented strategies for common scenarios.',
      passingCriteria: 'Communication is clear and professional, difficult situations handled diplomatically, upselling is natural not pushy, boundaries maintained appropriately',
      estimatedHours: 8,
      difficulty: 'beginner',
      category: 'professional_development',
      subcategory: 'communication',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 1,
      moduleNumber: '1.6',
      assignmentNumber: 'BG-1.6.2',
      orderIndex: 12,
      title: 'Portfolio Development Basics',
      description: 'Begin building a professional portfolio documenting your work, progress, and capabilities to showcase to potential clients and employers.',
      instructions: `1. Study portfolio formats: physical book, digital portfolio, social media
2. Learn photography basics: lighting, angles, before/after shots
3. Practice client permission: model release forms, privacy protection
4. Document Level 1 work: organize by service type, chronological progress
5. Learn photo editing basics: cropping, brightness, color correction (not over-editing)
6. Create portfolio structure: table of contents, categories, descriptions
7. Study presentation: clean layout, professional descriptions, branding
8. Practice writing service descriptions: techniques used, products, results
9. Learn social media portfolio: Instagram, Facebook, choosing platforms
10. Complete portfolio with all Level 1 assignments documented`,
      objectives: [
        'Create organized professional portfolio',
        'Document work with quality photos',
        'Obtain proper client permissions',
        'Present work in professional manner',
        'Show progression and skill development',
        'Prepare for marketing and job applications',
      ],
      skills: ['Portfolio development', 'Photography', 'Documentation', 'Organization', 'Professional presentation', 'Digital literacy'],
      expectedOutcome: 'Professional portfolio (physical or digital) containing all Level 1 work with before/after photos, service descriptions, and signed model releases.',
      passingCriteria: 'Portfolio is well-organized and professional, photos are clear and well-lit, all work is documented with descriptions, model releases obtained for all photos',
      estimatedHours: 10,
      difficulty: 'beginner',
      category: 'professional_development',
      subcategory: 'portfolio',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },

    // ========================================================================
    // LEVEL 2: BASIC SERVICES - Men's Grooming & Basic Hair Care
    // ========================================================================
    {
      level: 2,
      moduleNumber: '2.1',
      assignmentNumber: 'BG-2.1.1',
      orderIndex: 13,
      title: 'Men\'s Basic Haircut Fundamentals',
      description: 'Learn essential men\'s haircutting techniques including clipper work, scissor-over-comb, and creating clean necklines and sideburns.',
      instructions: `1. Study clipper guards: sizes 0-8, half guards, clipper maintenance
2. Learn basic men's cuts: crew cut, buzz cut, fade prep, classic taper
3. Practice clipper technique: against growth for short, with growth for blend
4. Study scissor-over-comb: angle, tension, consistent elevation
5. Learn neckline shapes: blocked, rounded, tapered
6. Practice sideburn trimming: symmetry, length matching, clean lines
7. Study around-the-ear technique: folding ear, clipper angle, safety
8. Learn weight line identification: where bulk sits, how to remove
9. Practice client head positioning: tilting for access, comfort
10. Complete 15 basic men's haircuts with documentation`,
      objectives: [
        'Use clippers safely and effectively',
        'Create clean, even haircuts with proper technique',
        'Execute scissor-over-comb method',
        'Finish necklines and edges professionally',
        'Maintain tool control and client comfort',
        'Work efficiently within time standards',
      ],
      skills: ['Clipper technique', 'Scissor-over-comb', 'Neckline finishing', 'Sideburn symmetry', 'Head positioning', 'Men\'s cutting'],
      expectedOutcome: '15 documented men\'s haircuts with before/after photos, demonstrating progression from basic to clean execution.',
      passingCriteria: 'Haircuts are even and symmetrical, necklines are clean, sideburns match, no clipper lines visible, client comfort maintained, time under 30 minutes',
      estimatedHours: 20,
      difficulty: 'beginner',
      category: 'hair_cutting',
      subcategory: 'mens_basics',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 2,
      moduleNumber: '2.1',
      assignmentNumber: 'BG-2.1.2',
      orderIndex: 14,
      title: 'Classic Wet Shaving Techniques',
      description: 'Master traditional straight razor and safety razor wet shaving including preparation, lathering, grain mapping, and post-shave care.',
      instructions: `1. Study shaving tools: straight razor, safety razor, shavette, maintenance
2. Learn pre-shave prep: hot towel application, skin softening, oil application
3. Practice lather creation: brush types, soap vs cream, water ratio, building foam
4. Study grain mapping: identifying growth direction, multiple passes
5. Learn razor angle: 30 degrees, skin stretching, pressure control
6. Practice first pass: with the grain, no pressure, short strokes
7. Study second pass: across the grain, re-lather between passes
8. Learn touch-up technique: against grain only for problem areas
9. Practice post-shave care: cold water rinse, alum block, aftershave balm
10. Complete 20 wet shaves with full documentation`,
      objectives: [
        'Prepare client skin properly for shaving',
        'Create rich, protective lather',
        'Hold and control razor safely',
        'Map hair growth and shave with grain',
        'Achieve smooth shave without irritation',
        'Provide professional post-shave treatment',
      ],
      skills: ['Straight razor technique', 'Lathering', 'Grain mapping', 'Skin preparation', 'Post-shave care', 'Safety procedures'],
      expectedOutcome: '20 documented wet shaves showing progression, client feedback on comfort, before/after photos demonstrating smooth results.',
      passingCriteria: 'Shaves are smooth and irritation-free, no nicks or cuts, lather is rich and protective, technique is safe and controlled, clients report comfort',
      estimatedHours: 25,
      difficulty: 'intermediate',
      category: 'mens_grooming',
      subcategory: 'shaving',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 2,
      moduleNumber: '2.2',
      assignmentNumber: 'BG-2.2.1',
      orderIndex: 15,
      title: 'Beard Trimming & Shaping',
      description: 'Learn professional beard trimming, shaping, and maintenance techniques for various beard styles and face shapes.',
      instructions: `1. Study beard styles: full beard, goatee, van dyke, stubble, mutton chops
2. Learn face shape matching: round, square, oval, long - complementary styles
3. Practice neckline creation: two fingers above Adam's apple, clean curve
4. Study cheek line trimming: natural vs defined, symmetry, angle
5. Learn mustache trimming: over lip line, symmetry, style variations
6. Practice clipper guard blending: starting long, working down, smooth transition
7. Study detail work: scissors for length, trimmers for edges, razor for lines
8. Learn beard conditioning: oils, balms, brushing techniques
9. Practice hot towel beard treatment: softening, steaming, preparation
10. Complete 15 beard trims in various styles with documentation`,
      objectives: [
        'Shape beards to complement face shapes',
        'Create clean, symmetrical lines',
        'Blend lengths smoothly',
        'Trim mustaches precisely',
        'Maintain beard health',
        'Provide styling recommendations',
      ],
      skills: ['Beard shaping', 'Face shape analysis', 'Line work', 'Blending techniques', 'Beard care', 'Style consultation'],
      expectedOutcome: '15 documented beard services showing various styles, before/after photos, client satisfaction with shape and maintenance advice.',
      passingCriteria: 'Beard shapes complement face, lines are clean and symmetrical, blending is smooth, mustaches are well-proportioned, clients receive proper care instructions',
      estimatedHours: 18,
      difficulty: 'intermediate',
      category: 'mens_grooming',
      subcategory: 'beard_care',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 2,
      moduleNumber: '2.2',
      assignmentNumber: 'BG-2.2.2',
      orderIndex: 16,
      title: 'Basic Women\'s Haircut: Blunt Cut',
      description: 'Master the fundamental blunt cutting technique for creating even, one-length haircuts on women\'s hair.',
      instructions: `1. Study blunt cut basics: zero elevation, clean line, even tension
2. Learn sectioning for blunt cuts: horizontal sections, consistent parts
3. Practice wet vs dry cutting: when to use each, shrinkage factors
4. Study guide creation: traveling guide vs stationary guide
5. Learn finger positioning: first two fingers, consistent angle, knuckle guide
6. Practice tension control: firm but not tight, even pull throughout
7. Study checking technique: cross-checking, visual line check, client movement
8. Learn point cutting: softening line, removing bulk from ends
9. Practice drying and finishing: blow-dry for final check, flat iron for precision
10. Complete 12 blunt cuts on various lengths with documentation`,
      objectives: [
        'Create perfectly even, blunt hairlines',
        'Maintain consistent elevation throughout cut',
        'Section hair efficiently for precision',
        'Control tension for clean results',
        'Check work thoroughly for evenness',
        'Finish cuts professionally',
      ],
      skills: ['Blunt cutting', 'Sectioning', 'Tension control', 'Elevation techniques', 'Checking methods', 'Precision cutting'],
      expectedOutcome: '12 documented blunt cuts with before/after photos, various lengths from bob to long, demonstrating clean, even lines.',
      passingCriteria: 'Hairlines are perfectly straight and even, no steps or unevenness, sections are clean, cross-checks show consistency, finished style is polished',
      estimatedHours: 20,
      difficulty: 'intermediate',
      category: 'hair_cutting',
      subcategory: 'womens_basics',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 2,
      moduleNumber: '2.3',
      assignmentNumber: 'BG-2.3.1',
      orderIndex: 17,
      title: 'Layering Techniques: Introduction',
      description: 'Learn basic layering techniques for creating movement, volume, and texture in women\'s haircuts.',
      instructions: `1. Study layer theory: removing weight, creating movement, adding volume
2. Learn elevation levels: 0° (blunt), 45° (gradual layer), 90° (uniform layer)
3. Practice guideline creation: stationary guide vs traveling guide
4. Study face-framing layers: starting point, angle, blending to length
5. Learn round layering: radial sections, center point, even distribution
6. Practice over-direction: pulling hair forward/back, creating shape
7. Study checking: cross-sections, visual balance, symmetry
8. Learn finishing: blow-dry to check layers, styling to enhance movement
9. Practice texturizing: point cutting, slide cutting, softening edges
10. Complete 10 layered haircuts with documentation`,
      objectives: [
        'Understand layering principles and effects',
        'Create layers at various elevations',
        'Establish clean guidelines',
        'Frame face appropriately',
        'Achieve symmetrical results',
        'Finish layered cuts professionally',
      ],
      skills: ['Layering', 'Elevation control', 'Face framing', 'Over-direction', 'Texturizing', 'Shape creation'],
      expectedOutcome: '10 documented layered cuts showing various elevations and styles, before/after photos demonstrating movement and volume.',
      passingCriteria: 'Layers are even and symmetrical, elevation is consistent, face-framing is flattering, movement is visible, finishing shows off the cut',
      estimatedHours: 22,
      difficulty: 'intermediate',
      category: 'hair_cutting',
      subcategory: 'layering',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 2,
      moduleNumber: '2.3',
      assignmentNumber: 'BG-2.3.2',
      orderIndex: 18,
      title: 'Basic Hair Braiding Techniques',
      description: 'Master fundamental braiding techniques including three-strand braids, French braids, and Dutch braids.',
      instructions: `1. Study three-strand braid: sectioning, crossing pattern, tension
2. Practice side braiding: clean parts, even sections, secure finishing
3. Learn French braid technique: adding hair with each cross, smooth incorporation
4. Practice tension control: tight enough to hold, not pulling scalp
5. Study Dutch braid (reverse French): crossing under instead of over
6. Learn fishtail braid: two sections, small pieces, intricate look
7. Practice rope twist: two strands, continuous twisting, secure end
8. Study braid finishing: elastic bands, bobby pins, hairspray, edge control
9. Learn style variations: side braids, crown braids, multiple braids
10. Complete 15 various braiding styles with documentation`,
      objectives: [
        'Execute clean three-strand braids',
        'Create smooth French and Dutch braids',
        'Control tension throughout braiding',
        'Add hair evenly and consistently',
        'Finish braids securely and neatly',
        'Adapt braiding to various styles',
      ],
      skills: ['Three-strand braiding', 'French braiding', 'Dutch braiding', 'Fishtail technique', 'Tension control', 'Style finishing'],
      expectedOutcome: '15 documented braiding styles with photos, showing progression from basic to complex, various techniques demonstrated.',
      passingCriteria: 'Braids are even and smooth, tension is consistent, no loose hairs, sections are clean, finishing is secure and neat',
      estimatedHours: 16,
      difficulty: 'beginner',
      category: 'styling',
      subcategory: 'braiding',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 2,
      moduleNumber: '2.4',
      assignmentNumber: 'BG-2.4.1',
      orderIndex: 19,
      title: 'Basic Makeup Application: Natural Look',
      description: 'Learn fundamental makeup application for creating natural, everyday looks including skin prep, foundation, and basic eye makeup.',
      instructions: `1. Study skin prep: cleanse, moisturize, primer application
2. Learn foundation application: sponge vs brush vs fingers, stippling, blending
3. Practice concealer technique: under-eye, blemishes, color correction
4. Study powder application: setting vs finishing, brush technique, baking basics
5. Learn eyebrow filling: matching color, following natural shape, blending
6. Practice neutral eye shadow: lid, crease, highlight, blending
7. Study eyeliner basics: pencil vs gel, tightline, simple wing
8. Learn mascara application: upper and lower lashes, preventing clumps
9. Practice blush and bronzer: placement for face shape, blending
10. Complete 10 natural makeup applications with documentation`,
      objectives: [
        'Prep skin properly for makeup',
        'Match and apply foundation seamlessly',
        'Conceal imperfections effectively',
        'Create natural-looking eyes',
        'Fill brows naturally',
        'Add dimension with minimal product',
      ],
      skills: ['Skin preparation', 'Foundation matching', 'Concealing', 'Eye shadow blending', 'Brow shaping', 'Face contouring basics'],
      expectedOutcome: '10 documented natural makeup applications with before/after photos, various skin tones, clean and polished results.',
      passingCriteria: 'Foundation matches skin tone, blending is seamless, coverage is even, eyes look enhanced but natural, brows are filled appropriately, face has subtle dimension',
      estimatedHours: 18,
      difficulty: 'beginner',
      category: 'makeup',
      subcategory: 'natural_looks',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 2,
      moduleNumber: '2.4',
      assignmentNumber: 'BG-2.4.2',
      orderIndex: 20,
      title: 'Men\'s Grooming Makeup & Skincare',
      description: 'Learn makeup techniques specifically for male clients including concealing, mattifying, and natural enhancement.',
      instructions: `1. Study men's skin concerns: oil control, razor burn, ingrown hairs, acne
2. Learn male skincare routine: cleansing, exfoliating, moisturizing
3. Practice concealer for men: blemishes, dark circles, redness - minimal appearance
4. Study mattifying techniques: oil control, reducing shine, natural finish
5. Learn brow grooming for men: trimming, shaping, filling sparse areas subtly
6. Practice beard enhancement: filling patches, defining lines, natural color
7. Study men's makeup preferences: invisible results, comfort with products
8. Learn post-shave treatment: soothing irritation, preventing ingrown hairs
9. Practice product recommendations: appropriate textures and finishes for men
10. Complete 8 men's grooming services with full documentation`,
      objectives: [
        'Address male-specific skin concerns',
        'Apply makeup invisibly on male clients',
        'Groom and enhance facial hair',
        'Create matte, natural finishes',
        'Build comfort with male clients',
        'Recommend appropriate products',
      ],
      skills: ['Men\'s skincare', 'Subtle concealing', 'Brow grooming', 'Beard maintenance', 'Client comfort', 'Product knowledge'],
      expectedOutcome: '8 documented men\'s grooming services with before/after photos, client feedback on comfort level, natural-looking results.',
      passingCriteria: 'Skin looks improved but natural, makeup is undetectable, clients are comfortable with process, products are appropriate, recommendations are helpful',
      estimatedHours: 12,
      difficulty: 'beginner',
      category: 'mens_grooming',
      subcategory: 'skincare_makeup',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 2,
      moduleNumber: '2.5',
      assignmentNumber: 'BG-2.5.1',
      orderIndex: 21,
      title: 'Basic Manicure Techniques',
      description: 'Master professional manicure services including cuticle care, nail shaping, polish application, and hand massage.',
      instructions: `1. Study nail anatomy: nail plate, cuticle, nail bed, lunula, free edge
2. Learn hand soak preparation: water temperature, additives, soaking time
3. Practice cuticle softening and pushing: cuticle remover, orange stick technique
4. Study nail shaping: square, round, oval, squoval, almond - file technique
5. Learn cuticle trimming: nippers, removing hangnails, avoiding cutting too much
6. Practice hand exfoliation: scrub application, massage, removal
7. Study hand massage: techniques, pressure points, relaxation
8. Learn polish application: base coat, two color coats, top coat, clean-up
9. Practice quick-dry techniques: thin coats, drying drops, proper timing
10. Complete 15 basic manicures with documentation`,
      objectives: [
        'Provide thorough nail and cuticle care',
        'Shape nails evenly and beautifully',
        'Apply polish smoothly and evenly',
        'Perform relaxing hand massage',
        'Ensure long-lasting polish results',
        'Maintain sanitation throughout',
      ],
      skills: ['Cuticle care', 'Nail shaping', 'Polish application', 'Hand massage', 'Nail care', 'Client relaxation'],
      expectedOutcome: '15 documented manicures with before/after photos, various nail shapes, clean polish application, satisfied clients.',
      passingCriteria: 'Cuticles are clean and healthy, nail shapes are even and requested style, polish application is smooth with no flooding or gaps, massage is relaxing',
      estimatedHours: 20,
      difficulty: 'beginner',
      category: 'nail_services',
      subcategory: 'manicure',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 2,
      moduleNumber: '2.5',
      assignmentNumber: 'BG-2.5.2',
      orderIndex: 22,
      title: 'Basic Pedicure Techniques',
      description: 'Learn professional pedicure services including foot soaking, callus removal, nail care, and foot massage.',
      instructions: `1. Study foot anatomy: toenail structure, pressure points, common issues
2. Learn foot soak: basin preparation, temperature, soaking time, additives
3. Practice callus removal: foot file, pumice stone, safe technique, not over-removing
4. Study toenail trimming: straight across, not too short, preventing ingrown nails
5. Learn cuticle care for feet: pushing, trimming, conditioning
6. Practice foot scrub: exfoliation, focusing on heels and balls of feet
7. Study foot massage: techniques, pressure, reflexology basics, relaxation
8. Learn polish application on toes: separator use, clean application, drying
9. Practice problem identification: fungus, ingrown nails, referring when needed
10. Complete 15 basic pedicures with documentation`,
      objectives: [
        'Provide comprehensive foot care',
        'Remove calluses safely and effectively',
        'Care for toenails properly',
        'Perform therapeutic foot massage',
        'Apply polish cleanly on toes',
        'Recognize when to refer clients',
      ],
      skills: ['Foot care', 'Callus removal', 'Toenail care', 'Foot massage', 'Polish application', 'Problem identification'],
      expectedOutcome: '15 documented pedicures with before/after photos, smooth feet, well-groomed toenails, relaxed clients.',
      passingCriteria: 'Calluses are reduced safely, toenails are trimmed straight across and smooth, polish is clean and even, foot massage is relaxing, contraindications recognized',
      estimatedHours: 22,
      difficulty: 'beginner',
      category: 'nail_services',
      subcategory: 'pedicure',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 2,
      moduleNumber: '2.6',
      assignmentNumber: 'BG-2.6.1',
      orderIndex: 23,
      title: 'Client Draping & Comfort Techniques',
      description: 'Perfect professional draping methods and client comfort procedures for all beauty services.',
      instructions: `1. Study draping for haircuts: neck strips, cape application, adjusting for comfort
2. Learn draping for color services: towels, plastic protection, preventing stains
3. Practice draping for shaving: hot towel technique, protecting clothing
4. Study makeup draping: headbands, robes, protecting clothing from product
5. Learn facial service draping: towel wrapping, hair protection, professional setup
6. Practice client positioning: chair height, recline angle, neck support
7. Study communication: checking comfort, adjusting as needed, anticipating needs
8. Learn temperature management: hot towels, cool products, client preference
9. Practice professional finishing: removing draping, checking for product on skin/clothes
10. Role-play 10 complete service setups with proper draping for each type`,
      objectives: [
        'Drape clients appropriately for each service',
        'Ensure client comfort throughout services',
        'Protect client clothing and belongings',
        'Position clients properly for service quality',
        'Communicate professionally about comfort',
        'Maintain professional appearance of setup',
      ],
      skills: ['Professional draping', 'Client comfort', 'Communication', 'Service setup', 'Positioning techniques', 'Attention to detail'],
      expectedOutcome: 'Demonstrated proficiency in draping for all service types, client feedback on comfort, professional service setup documented.',
      passingCriteria: 'Draping is secure and comfortable, clients report comfort throughout, no product gets on clothing, positioning supports service quality',
      estimatedHours: 8,
      difficulty: 'beginner',
      category: 'professional_development',
      subcategory: 'client_care',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 2,
      moduleNumber: '2.6',
      assignmentNumber: 'BG-2.6.2',
      orderIndex: 24,
      title: 'Time Management & Service Efficiency',
      description: 'Develop efficiency in performing services while maintaining quality, managing appointment schedules, and maximizing productivity.',
      instructions: `1. Study service timing standards: average times for each service type
2. Learn setup efficiency: preparing station before client arrives, organization
3. Practice workflow optimization: order of steps, minimizing backtracking
4. Study multitasking: processing time use, preparing next steps during waits
5. Learn appointment booking: realistic time blocks, buffer time, avoiding overbooking
6. Practice smooth transitions: cleaning station, greeting next client, no delays
7. Study rush service modifications: maintaining quality while working faster
8. Learn to politely manage chatty clients: engaging while staying on task
9. Practice handling delays: communicating with waiting clients, catching up
10. Complete 20 services tracking time, identifying efficiency improvements`,
      objectives: [
        'Complete services within time standards',
        'Maintain quality while improving speed',
        'Optimize workflow and station setup',
        'Book appointments realistically',
        'Transition smoothly between clients',
        'Communicate professionally about timing',
      ],
      skills: ['Time management', 'Workflow optimization', 'Multitasking', 'Appointment scheduling', 'Efficiency', 'Client communication'],
      expectedOutcome: '20 services with time tracking, documented improvements in efficiency, maintained quality despite increased speed.',
      passingCriteria: 'Services completed within standard times, quality not sacrificed, clients don\'t feel rushed, transitions are smooth, schedule maintained',
      estimatedHours: 10,
      difficulty: 'intermediate',
      category: 'professional_development',
      subcategory: 'efficiency',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },

    // ========================================================================
    // LEVEL 3: INTERMEDIATE - Women's Hair Services & Makeup Basics
    // ========================================================================
    {
      level: 3,
      moduleNumber: '3.1',
      assignmentNumber: 'BG-3.1.1',
      orderIndex: 25,
      title: 'Box Braids Installation',
      description: 'Master the technique of installing box braids including sectioning, braiding with extensions, and finishing for long-lasting results.',
      instructions: `1. Study box braid theory: section size, braid tension, length options
2. Learn hair preparation: washing, conditioning, blow-drying, stretching
3. Practice sectioning: square/box pattern, consistent size, clean parts
4. Study extension preparation: kanekalon vs synthetic, pre-stretching, length
5. Learn feed-in technique: starting natural, gradually adding extension
6. Practice three-strand with extensions: tension control, smooth incorporation
7. Study braid finishing: dipping in hot water, burning ends, securing
8. Learn edge laying: baby hairs, gel application, smoothing techniques
9. Practice maintenance education: nighttime care, washing, longevity
10. Complete 8 full box braid installations with documentation`,
      objectives: [
        'Section hair uniformly for box braids',
        'Install extensions smoothly and securely',
        'Maintain appropriate tension throughout',
        'Create neat, long-lasting braids',
        'Finish braids professionally',
        'Educate clients on maintenance',
      ],
      skills: ['Box braiding', 'Extension installation', 'Sectioning precision', 'Tension management', 'Edge control', 'Client education'],
      expectedOutcome: '8 documented box braid installations with before/after photos, various lengths and sizes, client satisfaction with comfort and appearance.',
      passingCriteria: 'Sections are uniform and neat, braids are even tension (not too tight), extensions blended smoothly, finishing is secure, edges are laid neatly',
      estimatedHours: 40,
      difficulty: 'intermediate',
      category: 'styling',
      subcategory: 'protective_styles',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 3,
      moduleNumber: '3.1',
      assignmentNumber: 'BG-3.1.2',
      orderIndex: 26,
      title: 'Cornrow Braiding Techniques',
      description: 'Learn professional cornrow braiding including straight-back, curved patterns, and intricate designs for protective styling.',
      instructions: `1. Study cornrow basics: underhand vs overhand, scalp-close technique
2. Learn straight-back cornrows: clean parts, consistent size, tension
3. Practice feed-in cornrows: invisible start, gradual extension addition
4. Study curved cornrow patterns: following head shape, design planning
5. Learn intricate designs: geometric patterns, tribal designs, creative styles
6. Practice finishing techniques: tucking ends, securing, invisible finish
7. Study scalp visibility: avoiding too-tight braids, healthy tension
8. Learn combination styles: cornrows with box braids, buns, ponytails
9. Practice speed building: efficient technique, maintaining quality
10. Complete 12 cornrow styles in various patterns with documentation`,
      objectives: [
        'Create clean, uniform cornrows',
        'Design and execute pattern layouts',
        'Feed in extensions invisibly',
        'Maintain healthy scalp tension',
        'Finish cornrows securely',
        'Work efficiently with quality',
      ],
      skills: ['Cornrow braiding', 'Pattern design', 'Feed-in technique', 'Tension control', 'Creative styling', 'Efficiency'],
      expectedOutcome: '12 documented cornrow styles with photos, various patterns from simple to complex, smooth and long-lasting results.',
      passingCriteria: 'Cornrows are uniform and neat, patterns are symmetrical, tension is comfortable, extensions invisible at start, finishing is secure',
      estimatedHours: 35,
      difficulty: 'intermediate',
      category: 'styling',
      subcategory: 'protective_styles',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 3,
      moduleNumber: '3.2',
      assignmentNumber: 'BG-3.2.1',
      orderIndex: 27,
      title: 'Sew-In Weave Installation',
      description: 'Master sew-in weave installation including cornrow foundation, track sewing, and creating natural-looking results.',
      instructions: `1. Study weave types: human hair vs synthetic, textures, weft types
2. Learn foundation cornrows: beehive pattern, straight-back, customizing for style
3. Practice track measurement: cutting wefts, avoiding waste, proper length
4. Study sewing technique: needle threading, knot security, stitch spacing
5. Learn layering: bottom tracks first, building up, leave-out placement
6. Practice blending leave-out: flat ironing, curling to match weave texture
7. Study closure/frontal installation: positioning, sewing, creating hairline
8. Learn finishing: cutting, styling, blending, natural appearance
9. Practice maintenance education: washing, nighttime care, longevity tips
10. Complete 10 full sew-in installations with various styles`,
      objectives: [
        'Create secure cornrow foundations',
        'Sew tracks securely and evenly',
        'Blend weave with natural hair seamlessly',
        'Install closures and frontals naturally',
        'Style weaves professionally',
        'Educate on proper maintenance',
      ],
      skills: ['Weave installation', 'Sewing technique', 'Cornrow foundation', 'Blending', 'Closure installation', 'Styling'],
      expectedOutcome: '10 documented sew-in installations with before/after photos, various styles and lengths, natural-looking and secure results.',
      passingCriteria: 'Cornrows are secure and flat, sewing is even and tight, tracks don\'t show, leave-out blends seamlessly, style looks natural',
      estimatedHours: 45,
      difficulty: 'intermediate',
      category: 'hair_extensions',
      subcategory: 'sew_in',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 3,
      moduleNumber: '3.2',
      assignmentNumber: 'BG-3.2.2',
      orderIndex: 28,
      title: 'Wig Making & Installation',
      description: 'Learn to construct and install wigs including measuring, sewing wefts onto caps, customizing, and securing for natural appearance.',
      instructions: `1. Study wig cap types: lace front, full lace, u-part, 360 lace
2. Learn head measurement: circumference, front to nape, ear to ear
3. Practice weft sewing on cap: starting at nape, working up, spacing
4. Study ventilating: knotting hair on lace, creating hairline, density
5. Learn customization: cutting lace, plucking hairline, bleaching knots
6. Practice wig installation: wig cap prep, adhesive/tape, positioning
7. Study styling: cutting, heat styling, creating natural part
8. Learn removal and cleaning: safe removal, washing wig, storage
9. Practice quick install methods: glueless, clip-ins, headband wigs
10. Complete 8 wig constructions and 15 installations with documentation`,
      objectives: [
        'Measure and fit wigs properly',
        'Construct wigs on various cap types',
        'Customize wigs for natural appearance',
        'Install wigs securely and naturally',
        'Style wigs professionally',
        'Teach removal and maintenance',
      ],
      skills: ['Wig construction', 'Ventilating', 'Customization', 'Installation techniques', 'Wig styling', 'Client education'],
      expectedOutcome: '8 custom wigs created and 15 installations documented with photos, natural hairlines, secure application, styled beautifully.',
      passingCriteria: 'Wigs fit properly, hairlines look natural, installation is secure, styling is professional, clients can remove safely',
      estimatedHours: 50,
      difficulty: 'advanced',
      category: 'hair_extensions',
      subcategory: 'wigs',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 3,
      moduleNumber: '3.3',
      assignmentNumber: 'BG-3.3.1',
      orderIndex: 29,
      title: 'Evening Makeup Application',
      description: 'Master glamorous evening makeup including dramatic eyes, full-coverage foundation, contouring, and long-wearing techniques.',
      instructions: `1. Study evening makeup principles: more pigment, definition, drama
2. Learn full-coverage foundation: building coverage, airbrush effect, setting
3. Practice advanced concealing: color correction, brightening, sculpting
4. Study contouring and highlighting: cream vs powder, blending, placement
5. Learn dramatic eye looks: smokey eyes, cut crease, halo eye, glitter
6. Practice false lash application: strip lashes, individual lashes, layering
7. Study bold lip application: lining, filling, dimension, long-wear
8. Learn setting techniques: spray, powder, baking for longevity
9. Practice photography makeup: flash considerations, HD makeup
10. Complete 12 evening makeup looks with documentation`,
      objectives: [
        'Create high-impact, glamorous makeup',
        'Build full coverage flawlessly',
        'Contour and highlight for dimension',
        'Execute dramatic eye techniques',
        'Apply false lashes seamlessly',
        'Ensure makeup longevity',
      ],
      skills: ['Evening makeup', 'Contouring', 'Dramatic eyes', 'False lashes', 'Long-wear techniques', 'Photography makeup'],
      expectedOutcome: '12 documented evening makeup applications with before/after photos, various dramatic styles, long-lasting and photo-ready.',
      passingCriteria: 'Coverage is flawless, contour is blended seamlessly, eyes are dramatic and symmetrical, lashes applied invisibly, makeup lasts 8+ hours',
      estimatedHours: 25,
      difficulty: 'intermediate',
      category: 'makeup',
      subcategory: 'evening_glam',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 3,
      moduleNumber: '3.3',
      assignmentNumber: 'BG-3.3.2',
      orderIndex: 30,
      title: 'Bridal Makeup Fundamentals',
      description: 'Learn bridal makeup application including long-wearing techniques, photography considerations, and creating timeless beautiful looks.',
      instructions: `1. Study bridal makeup requirements: longevity, photos, tears, kissing
2. Learn bridal consultation: mood boards, trial runs, skin prep timeline
3. Practice timeless makeup: classic beauty, not trendy, elegant
4. Study primer selection: long-wear, photography-friendly, skin type
5. Learn waterproof products: mascara, eyeliner, setting spray selection
6. Practice natural-yet-polished: defined but soft, romantic, glowing
7. Study flash photography makeup: avoiding SPF, proper highlight placement
8. Learn lip stain layering: color that lasts through eating, drinking, kissing
9. Practice timeline management: trial, wedding day timing, touch-up kit
10. Complete 8 bridal makeup applications with full documentation`,
      objectives: [
        'Create long-lasting bridal makeup',
        'Consider photography requirements',
        'Execute timeless, elegant looks',
        'Use waterproof, long-wear products',
        'Manage bridal timeline and trials',
        'Prepare touch-up kits',
      ],
      skills: ['Bridal makeup', 'Long-wear application', 'Photography makeup', 'Client consultation', 'Timeline management', 'Classic beauty'],
      expectedOutcome: '8 documented bridal makeup applications with photos, trial documentation, touch-up kits, lasting 12+ hours beautifully.',
      passingCriteria: 'Makeup is elegant and timeless, lasts 12+ hours, photographs beautifully, waterproof products used, bride is thrilled',
      estimatedHours: 30,
      difficulty: 'advanced',
      category: 'makeup',
      subcategory: 'bridal',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 3,
      moduleNumber: '3.4',
      assignmentNumber: 'BG-3.4.1',
      orderIndex: 31,
      title: 'Advanced Men\'s Fades & Tapers',
      description: 'Master advanced fade techniques including low, mid, and high fades, skin fades, and detailed blending for modern men\'s styles.',
      instructions: `1. Study fade types: low, mid, high, drop, burst, temp, skin fade
2. Learn clipper work: open vs closed, lever positioning, guard blending
3. Practice guideline creation: establishing fade line, working up/down
4. Study blending technique: clipper-over-comb, gradual transitions, no lines
5. Learn detailing: lineup, edge work, design work, precision
6. Practice different hair textures: straight, wavy, curly, coily - adjusting technique
7. Study finishing: balding clippers, foil shaver, razor detail
8. Learn consultation: showing examples, managing expectations, modern trends
9. Practice efficiency: completing fades in 30-45 minutes with quality
10. Complete 20 various fade styles with documentation`,
      objectives: [
        'Execute clean fades and tapers',
        'Blend seamlessly without lines',
        'Create sharp edge work and lineups',
        'Adapt technique to hair textures',
        'Work efficiently with precision',
        'Stay current with modern styles',
      ],
      skills: ['Fade techniques', 'Clipper mastery', 'Blending', 'Detail work', 'Texture adaptation', 'Modern styling'],
      expectedOutcome: '20 documented fades with before/after photos, various fade types and textures, seamless blending, sharp details.',
      passingCriteria: 'Fades are smooth with no lines, blending is gradual, details are sharp, technique adapts to texture, time is under 45 minutes',
      estimatedHours: 30,
      difficulty: 'advanced',
      category: 'hair_cutting',
      subcategory: 'mens_advanced',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 3,
      moduleNumber: '3.4',
      assignmentNumber: 'BG-3.4.2',
      orderIndex: 32,
      title: 'Twist and Loc Styling',
      description: 'Learn two-strand twists, flat twists, and loc maintenance for textured hair styling and protective styling options.',
      instructions: `1. Study two-strand twist technique: sectioning, tension, twisting direction
2. Learn flat twist technique: scalp-close twisting, adding hair, patterns
3. Practice twist-outs: setting twists, unraveling, separating for volume
4. Study loc maintenance: palm rolling, interlocking, retwisting new growth
5. Learn loc styling: updos, coloring locs, length retention
6. Practice combination styles: twists with braids, twist updos, accessories
7. Study product selection: holding products, moisturizers for twists and locs
8. Learn maintenance schedules: retwist timing, washing, conditioning
9. Practice starting locs: comb coils, two-strand twists, freeform
10. Complete 15 twist styles and 5 loc maintenance services`,
      objectives: [
        'Execute clean two-strand and flat twists',
        'Create beautiful twist-out styles',
        'Maintain locs professionally',
        'Style twists and locs creatively',
        'Educate on home maintenance',
        'Select appropriate products',
      ],
      skills: ['Two-strand twists', 'Flat twists', 'Loc maintenance', 'Twist-outs', 'Product knowledge', 'Textured hair care'],
      expectedOutcome: '15 documented twist styles and 5 loc services with photos, neat installation, successful twist-outs, healthy locs.',
      passingCriteria: 'Twists are uniform and neat, tension is appropriate, twist-outs have definition, locs are maintained without damage',
      estimatedHours: 28,
      difficulty: 'intermediate',
      category: 'styling',
      subcategory: 'natural_hair',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 3,
      moduleNumber: '3.5',
      assignmentNumber: 'BG-3.5.1',
      orderIndex: 33,
      title: 'Gel Nail Application & Nail Art',
      description: 'Master gel polish application, gel nail extensions, and basic nail art techniques for long-lasting, beautiful nails.',
      instructions: `1. Study gel types: soak-off gel polish, hard gel, gel extensions
2. Learn proper nail prep: filing, buffing, dehydrating, primer
3. Practice gel polish application: thin coats, curing time, avoiding flooding
4. Study gel removal: soaking, wrapping, safe acetone use, no damage
5. Learn gel extensions: tips, forms, sculpting, shaping
6. Practice nail art basics: dotting, striping, stamping, stickers
7. Study advanced nail art: ombre, marble, flowers, 3D designs
8. Learn encapsulation: glitter, dried flowers, foils in gel
9. Practice French manicure with gel: classic and modern variations
10. Complete 20 gel services with various nail art designs`,
      objectives: [
        'Apply gel polish with perfect coverage',
        'Create gel extensions that last',
        'Remove gel without nail damage',
        'Execute basic to intermediate nail art',
        'Cure gel properly for longevity',
        'Design custom nail art',
      ],
      skills: ['Gel application', 'Gel extensions', 'Nail art', 'Gel removal', 'Design skills', 'Technical precision'],
      expectedOutcome: '20 documented gel services with photos, various nail art designs, long-lasting application, no lifting or damage.',
      passingCriteria: 'Gel application is smooth and even, curing is proper, nail art is clean and creative, gel lasts 2+ weeks without issues',
      estimatedHours: 35,
      difficulty: 'intermediate',
      category: 'nail_services',
      subcategory: 'gel_nails',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 3,
      moduleNumber: '3.5',
      assignmentNumber: 'BG-3.5.2',
      orderIndex: 34,
      title: 'Acrylic Nail Application',
      description: 'Learn acrylic nail application including liquid and powder technique, sculpting, shaping, and maintenance for durable nail enhancements.',
      instructions: `1. Study acrylic chemistry: monomer/polymer, ratios, working time
2. Learn proper ventilation: fume extraction, masks, safety
3. Practice bead control: wet/dry ratio, placement, smoothing
4. Study application on tips: tip selection, blending, building apex
5. Learn sculpting on forms: form placement, free edge, C-curve
6. Practice shaping: filing techniques, achieving desired shape, symmetry
7. Study fill maintenance: identifying grown-out area, filing, blending
8. Learn acrylic removal: soaking, safe filing, preventing damage
9. Practice pink and white acrylics: smile line, color placement, French look
10. Complete 25 full acrylic sets with various techniques`,
      objectives: [
        'Mix and apply acrylic with proper ratio',
        'Sculpt nails on tips and forms',
        'Create strong, beautiful nail enhancements',
        'Perform fill maintenance correctly',
        'Remove acrylics safely',
        'Work with proper ventilation',
      ],
      skills: ['Acrylic application', 'Sculpting', 'Bead control', 'Filing techniques', 'Fill maintenance', 'Safety protocols'],
      expectedOutcome: '25 documented acrylic sets with photos, various lengths and shapes, strong structure, beautiful finish.',
      passingCriteria: 'Acrylic ratio is correct, beads are smooth, apex is properly placed, nails are strong and symmetrical, no lifting',
      estimatedHours: 40,
      difficulty: 'advanced',
      category: 'nail_services',
      subcategory: 'acrylic_nails',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 3,
      moduleNumber: '3.6',
      assignmentNumber: 'BG-3.6.1',
      orderIndex: 35,
      title: 'Basic Eyebrow Shaping & Tinting',
      description: 'Master eyebrow shaping techniques including waxing, threading, tweezing, and brow tinting for perfect brow enhancement.',
      instructions: `1. Study brow anatomy: arch placement, tail length, proportions to face
2. Learn waxing technique: hard wax vs soft wax, temperature, direction
3. Practice threading: thread preparation, hair removal, precision
4. Study tweezing: finishing tool, stray removal, shaping refinement
5. Learn brow mapping: measuring, marking, creating symmetry
6. Practice brow tinting: color selection, processing time, stain removal
7. Study brow lamination basics: lifting brows, setting, aftercare
8. Learn aftercare education: soothing, preventing ingrown hairs, growth
9. Practice various face shapes: customizing brow shape to complement
10. Complete 30 brow shaping services with various techniques`,
      objectives: [
        'Shape brows to complement face shape',
        'Execute waxing, threading, and tweezing',
        'Map brows for perfect symmetry',
        'Tint brows to enhance definition',
        'Educate clients on brow care',
        'Work precisely and safely',
      ],
      skills: ['Brow shaping', 'Waxing', 'Threading', 'Brow tinting', 'Face analysis', 'Precision work'],
      expectedOutcome: '30 documented brow services with before/after photos, various techniques demonstrated, symmetrical and flattering shapes.',
      passingCriteria: 'Brows are symmetrical and suit face shape, hair removal is clean, tinting is even, clients are satisfied with results',
      estimatedHours: 25,
      difficulty: 'intermediate',
      category: 'facial_services',
      subcategory: 'brow_services',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 3,
      moduleNumber: '3.6',
      assignmentNumber: 'BG-3.6.2',
      orderIndex: 36,
      title: 'Eyelash Extensions Application',
      description: 'Learn professional eyelash extension application including isolation, adhesive use, various styles, and safe removal techniques.',
      instructions: `1. Study lash extension types: classic, volume, hybrid, mega volume
2. Learn proper isolation: tweezers technique, protecting natural lashes
3. Practice adhesive use: amount, drying time, fume management
4. Study lash mapping: eye shape analysis, length/curl placement, design
5. Learn application technique: dipping, placement, bonding without clumping
6. Practice various styles: natural, cat eye, doll eye, wispy
7. Study fill maintenance: identifying outgrown lashes, replacing, blending
8. Learn removal: gel remover, cream remover, safe technique, no damage
9. Practice aftercare education: cleansing, avoiding oil, retention tips
10. Complete 15 full lash extension sets with documentation`,
      objectives: [
        'Isolate natural lashes properly',
        'Apply extensions without damaging natural lashes',
        'Create various lash styles and designs',
        'Use adhesive safely and effectively',
        'Perform fill maintenance',
        'Remove extensions safely',
      ],
      skills: ['Lash extensions', 'Isolation technique', 'Adhesive application', 'Lash mapping', 'Style design', 'Safe removal'],
      expectedOutcome: '15 documented lash extension sets with photos, various styles, no damage to natural lashes, client satisfaction.',
      passingCriteria: 'Lashes are isolated properly, extensions bond only to one natural lash, design suits eye shape, no irritation, retention is good',
      estimatedHours: 45,
      difficulty: 'advanced',
      category: 'facial_services',
      subcategory: 'lash_extensions',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },

    // ========================================================================
    // LEVEL 4: ADVANCED - Nail Services & Advanced Makeup
    // ========================================================================
    {
      level: 4,
      moduleNumber: '4.1',
      assignmentNumber: 'BG-4.1.1',
      orderIndex: 37,
      title: 'Advanced Hair Coloring: Single Process',
      description: 'Master single-process hair coloring including color theory application, gray coverage, and achieving desired tones.',
      instructions: `1. Study hair color levels: 1-10 scale, lifting vs depositing
2. Learn developer selection: 10, 20, 30, 40 volume - appropriate uses
3. Practice color formulation: achieving target level and tone
4. Study gray coverage: formulas, application technique, resistant gray
5. Learn root touch-up application: avoiding overlap, blending
6. Practice all-over color: sectioning, saturation, processing time
7. Study toner application: neutralizing unwanted tones, gloss
8. Learn strand testing: predicting results, adjusting formula
9. Practice color removal and correction basics
10. Complete 20 single-process color services`,
      objectives: [
        'Formulate color to achieve desired results',
        'Apply color evenly and thoroughly',
        'Cover gray hair effectively',
        'Select appropriate developer strength',
        'Perform strand tests accurately',
        'Understand color theory in practice',
      ],
      skills: ['Color formulation', 'Application technique', 'Gray coverage', 'Color theory', 'Developer selection', 'Toning'],
      expectedOutcome: '20 documented color services with before/after photos, formula notes, various levels and tones achieved successfully.',
      passingCriteria: 'Color formulas achieve desired results, application is even, gray is covered, no hot roots or banding, tone is as requested',
      estimatedHours: 35,
      difficulty: 'advanced',
      category: 'chemical_services',
      subcategory: 'color',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 4,
      moduleNumber: '4.1',
      assignmentNumber: 'BG-4.1.2',
      orderIndex: 38,
      title: 'Highlighting & Lowlighting Techniques',
      description: 'Learn foil highlighting, balayage basics, and lowlighting for dimensional color and natural-looking results.',
      instructions: `1. Study highlighting techniques: foil, cap, balayage, ombre
2. Learn foil placement: weaving, slicing, thickness control
3. Practice sectioning patterns: traditional, money piece, face-framing
4. Study product application: saturation, avoiding bleed, placement
5. Learn balayage hand-painting: freehand technique, blending, natural placement
6. Practice lowlighting: adding depth, dimension, breaking up solid color
7. Study toning highlights: neutralizing brass, achieving desired blonde
8. Learn dimensional color: multiple tones, natural depth and light
9. Practice various looks: subtle, chunky, face-framing, full head
10. Complete 15 highlighting/lowlighting services`,
      objectives: [
        'Place foils for desired effect',
        'Hand-paint balayage naturally',
        'Create dimensional color',
        'Tone highlights appropriately',
        'Avoid harsh lines and banding',
        'Customize placement for client',
      ],
      skills: ['Foiling technique', 'Balayage', 'Weaving', 'Toning', 'Dimensional color', 'Placement strategy'],
      expectedOutcome: '15 documented highlight services with photos, various techniques, natural-looking dimension, proper toning.',
      passingCriteria: 'Highlights are evenly placed, balayage looks natural, toning is appropriate, dimension is visible, client is satisfied',
      estimatedHours: 40,
      difficulty: 'advanced',
      category: 'chemical_services',
      subcategory: 'highlights',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 4,
      moduleNumber: '4.2',
      assignmentNumber: 'BG-4.2.1',
      orderIndex: 39,
      title: 'Chemical Relaxer Application',
      description: 'Master chemical relaxer application for straightening textured hair, including proper technique, timing, and neutralization.',
      instructions: `1. Study relaxer types: lye vs no-lye, strengths, chemistry
2. Learn consultation: assessing hair health, previous chemicals, realistic expectations
3. Practice strand testing: determining processing time, compatibility
4. Study base application: protecting scalp, petroleum base
5. Learn virgin application: starting mid-shaft, processing, adding roots
6. Practice retouch application: new growth only, avoiding overlap
7. Study smoothing technique: comb vs fingers, straightness level
8. Learn neutralization: stopping chemical process, pH balance, thorough rinsing
9. Practice deep conditioning: protein-moisture balance, strengthening
10. Complete 12 relaxer services with documentation`,
      objectives: [
        'Assess hair for relaxer suitability',
        'Apply relaxer without overlapping',
        'Process to desired straightness safely',
        'Neutralize properly to stop processing',
        'Minimize hair damage',
        'Educate on aftercare',
      ],
      skills: ['Relaxer application', 'Chemical processing', 'Scalp protection', 'Neutralization', 'Damage prevention', 'Hair analysis'],
      expectedOutcome: '12 documented relaxer services with before/after photos, smooth results, minimal breakage, healthy hair maintained.',
      passingCriteria: 'Hair is relaxed to desired straightness, no overlapping, scalp protected, neutralized properly, hair remains healthy',
      estimatedHours: 30,
      difficulty: 'advanced',
      category: 'chemical_services',
      subcategory: 'relaxers',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 4,
      moduleNumber: '4.2',
      assignmentNumber: 'BG-4.2.2',
      orderIndex: 40,
      title: 'Keratin Treatment & Hair Smoothing',
      description: 'Learn keratin treatment application, Brazilian blowout techniques, and semi-permanent hair smoothing services.',
      instructions: `1. Study keratin treatment types: formaldehyde-free, Brazilian, Japanese straightening
2. Learn client consultation: hair type suitability, maintenance, expectations
3. Practice clarifying wash: removing buildup, opening cuticle
4. Study product application: sectioning, saturation, processing time
5. Learn blow-dry technique: 100% dry, tension, smoothing
6. Practice flat iron sealing: temperature, passes, locking in treatment
7. Study post-treatment care: no washing timeline, sulfate-free products
8. Learn maintenance: longevity, touch-ups, protecting treatment
9. Practice various hair types: fine, coarse, curly, color-treated
10. Complete 10 keratin treatments with documentation`,
      objectives: [
        'Apply keratin treatments correctly',
        'Blow-dry and flat iron to seal treatment',
        'Customize for different hair types',
        'Educate on aftercare for longevity',
        'Manage client expectations',
        'Achieve smooth, frizz-free results',
      ],
      skills: ['Keratin application', 'Heat sealing', 'Blow-dry technique', 'Client education', 'Product knowledge', 'Aftercare'],
      expectedOutcome: '10 documented keratin treatments with photos, smooth results, various hair types, treatments lasting 3+ months.',
      passingCriteria: 'Hair is smooth and frizz-free, treatment is sealed properly, clients educated on care, results last appropriately',
      estimatedHours: 25,
      difficulty: 'advanced',
      category: 'chemical_services',
      subcategory: 'smoothing',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 4,
      moduleNumber: '4.3',
      assignmentNumber: 'BG-4.3.1',
      orderIndex: 41,
      title: 'Advanced Nail Art & 3D Designs',
      description: 'Master advanced nail art techniques including hand-painting, 3D sculptures, encapsulation, and custom designs.',
      instructions: `1. Study nail art brushes: liner, striper, detail, fan - appropriate uses
2. Learn hand-painting: flowers, patterns, portraits, fine details
3. Practice acrylic 3D sculptures: roses, bows, characters, dimensional art
4. Study chrome and mirror finishes: application, buffing, effects
5. Learn encapsulation: pressed flowers, foils, glitter, depth creation
6. Practice ombre techniques: sponge gradient, airbrush, color blending
7. Study rhinestone and gem placement: adhesive, patterns, secure application
8. Learn negative space designs: modern, minimalist, geometric
9. Practice client design consultation: translating ideas, managing expectations
10. Complete 20 advanced nail art services`,
      objectives: [
        'Hand-paint intricate nail art',
        'Create 3D acrylic sculptures',
        'Apply special effects and finishes',
        'Design custom nail art for clients',
        'Use various techniques for different effects',
        'Create portfolio-worthy work',
      ],
      skills: ['Hand-painting', '3D sculpture', 'Advanced techniques', 'Design consultation', 'Special effects', 'Artistic creativity'],
      expectedOutcome: '20 documented nail art services with photos, various advanced techniques, custom designs, portfolio-quality work.',
      passingCriteria: 'Nail art is detailed and clean, 3D work is secure, designs match client vision, techniques are advanced, work is portfolio-worthy',
      estimatedHours: 35,
      difficulty: 'advanced',
      category: 'nail_services',
      subcategory: 'advanced_art',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 4,
      moduleNumber: '4.3',
      assignmentNumber: 'BG-4.3.2',
      orderIndex: 42,
      title: 'Dip Powder & Alternative Nail Systems',
      description: 'Learn dip powder nail application, hard gel overlays, and alternative nail enhancement systems.',
      instructions: `1. Study dip powder system: base, powder, activator, top coat
2. Learn prep and application: bonding, dipping technique, shaping
3. Practice ombre dip: color blending, gradient effects
4. Study hard gel overlay: strengthening natural nails, UV curing
5. Learn builder gel: sculpting, extensions, repairs
6. Practice poly gel application: tube vs dual forms, shaping
7. Study removal techniques: filing, soaking, preserving natural nail
8. Learn system comparison: when to use each, client needs
9. Practice nail art with dip and gel: colors, effects, designs
10. Complete 15 services using alternative systems`,
      objectives: [
        'Apply dip powder smoothly and evenly',
        'Use hard gel for overlays and extensions',
        'Master poly gel application',
        'Remove systems safely',
        'Recommend appropriate system for client',
        'Create nail art with each system',
      ],
      skills: ['Dip powder', 'Hard gel', 'Poly gel', 'Builder gel', 'System selection', 'Safe removal'],
      expectedOutcome: '15 documented services with photos, various systems demonstrated, smooth application, long-lasting results.',
      passingCriteria: 'Dip powder is smooth and even, gel overlays are thin and strong, poly gel is well-sculpted, removal is safe, nails are healthy',
      estimatedHours: 28,
      difficulty: 'advanced',
      category: 'nail_services',
      subcategory: 'alternative_systems',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 4,
      moduleNumber: '4.4',
      assignmentNumber: 'BG-4.4.1',
      orderIndex: 43,
      title: 'Special Effects Makeup',
      description: 'Learn special effects makeup including wounds, bruising, aging, fantasy looks, and theatrical makeup.',
      instructions: `1. Study SFX makeup materials: latex, gelatin, silicone, theatrical blood
2. Learn wound creation: cuts, scrapes, burns, realistic texturing
3. Practice bruise makeup: color layering, stages of healing, realistic placement
4. Study aging makeup: wrinkles, age spots, sagging, highlighting technique
5. Learn prosthetic application: adhesives, blending edges, painting
6. Practice fantasy makeup: fairies, mermaids, creatures, creative looks
7. Study body painting: coverage, setting, removal
8. Learn Halloween/costume makeup: character recreation, transformation
9. Practice photography for SFX: lighting, angles, documentation
10. Complete 10 special effects makeup projects`,
      objectives: [
        'Create realistic wounds and injuries',
        'Age clients convincingly with makeup',
        'Apply and blend prosthetics',
        'Execute fantasy and creative looks',
        'Use special effects materials safely',
        'Document work professionally',
      ],
      skills: ['SFX makeup', 'Prosthetic application', 'Aging techniques', 'Fantasy makeup', 'Body painting', 'Creative artistry'],
      expectedOutcome: '10 documented SFX makeup projects with photos, various techniques, realistic results, creative portfolio pieces.',
      passingCriteria: 'SFX looks realistic and convincing, prosthetics blend seamlessly, aging is believable, fantasy looks are creative, work is portfolio-quality',
      estimatedHours: 30,
      difficulty: 'advanced',
      category: 'makeup',
      subcategory: 'special_effects',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 4,
      moduleNumber: '4.4',
      assignmentNumber: 'BG-4.4.2',
      orderIndex: 44,
      title: 'Airbrush Makeup Techniques',
      description: 'Master airbrush makeup application for flawless, long-lasting coverage in bridal, photography, and special event makeup.',
      instructions: `1. Study airbrush equipment: compressor, gun types, pressure settings
2. Learn airbrush foundations: water-based vs silicone, color matching
3. Practice airbrushing technique: distance, motion, coverage building
4. Study stenciling: templates, designs, precision work
5. Learn contouring with airbrush: subtle dimension, blending
6. Practice body airbrushing: coverage, tanning, special events
7. Study cleaning and maintenance: daily cleaning, deep cleaning, troubleshooting
8. Learn layering: foundation, blush, highlight, setting
9. Practice various applications: bridal, photography, HD makeup
10. Complete 15 airbrush makeup applications`,
      objectives: [
        'Operate airbrush equipment properly',
        'Create flawless airbrush coverage',
        'Use stencils for precision designs',
        'Maintain airbrush equipment',
        'Apply airbrush makeup for various occasions',
        'Achieve long-lasting, photo-ready results',
      ],
      skills: ['Airbrush technique', 'Equipment operation', 'Stenciling', 'Body airbrushing', 'Maintenance', 'HD makeup'],
      expectedOutcome: '15 documented airbrush makeup applications with photos, flawless coverage, various uses demonstrated, equipment maintained.',
      passingCriteria: 'Coverage is flawless and even, equipment operated correctly, makeup lasts 12+ hours, photographs beautifully, equipment well-maintained',
      estimatedHours: 25,
      difficulty: 'advanced',
      category: 'makeup',
      subcategory: 'airbrush',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 4,
      moduleNumber: '4.5',
      assignmentNumber: 'BG-4.5.1',
      orderIndex: 45,
      title: 'Basic Facial Treatments',
      description: 'Learn professional facial treatments including cleansing, exfoliation, extractions, masks, and massage for skin health.',
      instructions: `1. Study facial steps: cleanse, analyze, steam, exfoliate, extract, mask, massage, moisturize
2. Learn double cleansing: oil-based, water-based, thorough removal
3. Practice facial steaming: equipment, duration, benefits, contraindications
4. Study exfoliation methods: physical scrubs, chemical peels, enzymes
5. Learn extraction technique: comedones, milia, safe method, avoiding damage
6. Practice facial massage: lymphatic drainage, relaxation, product penetration
7. Study mask selection: clay, cream, gel, sheet - matching to skin type
8. Learn high-frequency treatment: acne, oxygenation, safety
9. Practice customizing facials: skin type, concerns, seasonal adjustments
10. Complete 20 facial treatments with documentation`,
      objectives: [
        'Perform complete professional facials',
        'Extract safely without scarring',
        'Customize treatments for skin types',
        'Execute relaxing facial massage',
        'Use facial equipment properly',
        'Educate clients on home care',
      ],
      skills: ['Facial treatments', 'Extractions', 'Facial massage', 'Skin analysis', 'Equipment use', 'Treatment customization'],
      expectedOutcome: '20 documented facial treatments with before/after photos, various skin types, clean extractions, relaxed clients.',
      passingCriteria: 'Facials are relaxing and thorough, extractions are clean without damage, skin shows improvement, clients are satisfied and educated',
      estimatedHours: 40,
      difficulty: 'intermediate',
      category: 'facial_services',
      subcategory: 'facials',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 4,
      moduleNumber: '4.5',
      assignmentNumber: 'BG-4.5.2',
      orderIndex: 46,
      title: 'Chemical Peels & Advanced Exfoliation',
      description: 'Master chemical peel application including glycolic, salicylic, and lactic acid peels for skin rejuvenation.',
      instructions: `1. Study peel types: AHA, BHA, TCA, enzyme - chemistry and effects
2. Learn peel strengths: superficial, medium, deep - appropriate uses
3. Practice skin assessment: suitability, contraindications, Fitzpatrick scale
4. Study pre-peel preparation: priming skin, avoiding retinoids, sun protection
5. Learn application technique: timing, layers, neutralization
6. Practice monitoring: frosting, client comfort, appropriate endpoints
7. Study post-peel care: soothing, peeling process, sun protection
8. Learn peel protocols: series planning, spacing, maintenance
9. Practice various peels: acne, anti-aging, hyperpigmentation, brightening
10. Complete 15 chemical peel treatments with documentation`,
      objectives: [
        'Assess skin for peel suitability',
        'Apply chemical peels safely',
        'Monitor peel progression accurately',
        'Educate on post-peel care',
        'Customize peels for skin concerns',
        'Plan peel series effectively',
      ],
      skills: ['Chemical peels', 'Skin assessment', 'Application technique', 'Safety protocols', 'Post-care education', 'Treatment planning'],
      expectedOutcome: '15 documented peel treatments with photos, various peel types, visible skin improvement, no complications.',
      passingCriteria: 'Peels applied safely and correctly, skin shows improvement, no burns or complications, clients educated thoroughly, results are visible',
      estimatedHours: 30,
      difficulty: 'advanced',
      category: 'facial_services',
      subcategory: 'peels',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 4,
      moduleNumber: '4.6',
      assignmentNumber: 'BG-4.6.1',
      orderIndex: 47,
      title: 'Body Waxing & Hair Removal',
      description: 'Learn professional body waxing techniques for arms, legs, back, chest, and bikini area using hard and soft wax.',
      instructions: `1. Study wax types: hard wax, soft wax, sugar wax - appropriate areas
2. Learn temperature control: testing wax, client comfort, preventing burns
3. Practice leg waxing: sectioning, direction, removing all hair
4. Study arm waxing: fine hair, direction, skin sensitivity
5. Learn bikini waxing: basic bikini, Brazilian, hygiene, client comfort
6. Practice chest and back waxing: male clients, hair growth patterns
7. Study ingrown hair prevention: exfoliation, proper technique, aftercare
8. Learn post-wax care: soothing products, avoiding sun, preventing irritation
9. Practice speed and efficiency: completing services in time standards
10. Complete 30 body waxing services on various areas`,
      objectives: [
        'Wax various body areas effectively',
        'Use hard and soft wax appropriately',
        'Remove hair completely in one pass',
        'Maintain client comfort and modesty',
        'Prevent and treat ingrown hairs',
        'Work efficiently and hygienically',
      ],
      skills: ['Body waxing', 'Hard wax technique', 'Soft wax technique', 'Client comfort', 'Hygiene protocols', 'Efficiency'],
      expectedOutcome: '30 documented waxing services with photos, various body areas, complete hair removal, minimal irritation, satisfied clients.',
      passingCriteria: 'Hair removed completely, minimal irritation, wax temperature appropriate, client comfort maintained, hygiene standards met',
      estimatedHours: 35,
      difficulty: 'intermediate',
      category: 'hair_removal',
      subcategory: 'waxing',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 4,
      moduleNumber: '4.6',
      assignmentNumber: 'BG-4.6.2',
      orderIndex: 48,
      title: 'Portfolio Expansion & Social Media Marketing',
      description: 'Build advanced portfolio, develop social media presence, and create marketing content for beauty business growth.',
      instructions: `1. Study portfolio curation: selecting best work, variety, cohesion
2. Learn professional photography: lighting setup, angles, editing
3. Practice before/after documentation: consistent lighting, angles, showcasing results
4. Study social media platforms: Instagram, TikTok, Facebook - best practices
5. Learn content creation: reels, posts, stories, engagement strategies
6. Practice hashtag research: relevant tags, reach, engagement
7. Study client testimonials: collecting, displaying, leveraging reviews
8. Learn consistent branding: colors, fonts, style, professional image
9. Practice engagement: responding, building community, networking
10. Create 50 pieces of portfolio/marketing content across platforms`,
      objectives: [
        'Curate professional portfolio',
        'Create engaging social media content',
        'Photograph work professionally',
        'Build online following and engagement',
        'Develop consistent brand identity',
        'Market services effectively',
      ],
      skills: ['Portfolio curation', 'Social media marketing', 'Photography', 'Content creation', 'Branding', 'Client engagement'],
      expectedOutcome: '50 pieces of marketing content created, active social media presence, professional portfolio, growing follower base.',
      passingCriteria: 'Portfolio is cohesive and professional, social media shows consistent posting, content is engaging, follower count growing, brand is recognizable',
      estimatedHours: 25,
      difficulty: 'intermediate',
      category: 'professional_development',
      subcategory: 'marketing',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },

    // ========================================================================
    // LEVEL 5: EXPERT - Skincare, Facials & Specializations
    // ========================================================================
    {
      level: 5,
      moduleNumber: '5.1',
      assignmentNumber: 'BG-5.1.1',
      orderIndex: 49,
      title: 'Microdermabrasion Treatments',
      description: 'Master microdermabrasion technique for skin resurfacing, texture improvement, and anti-aging treatments.',
      instructions: `1. Study microdermabrasion types: crystal, diamond-tip, hydradermabrasion
2. Learn equipment operation: suction levels, tip selection, pressure control
3. Practice skin assessment: suitability, contraindications, realistic expectations
4. Study treatment technique: passes, patterns, avoiding sensitive areas
5. Learn customization: intensity for skin type, concern-specific protocols
6. Practice combination treatments: with peels, LED, serums
7. Study post-treatment care: sun protection, gentle care, avoiding irritation
8. Learn treatment series: frequency, progression, maintenance
9. Practice documentation: settings, results, client progress tracking
10. Complete 20 microdermabrasion treatments with full documentation`,
      objectives: [
        'Operate microdermabrasion equipment safely',
        'Assess skin for treatment suitability',
        'Customize treatments for concerns',
        'Achieve visible skin improvement',
        'Plan effective treatment series',
        'Educate clients on aftercare',
      ],
      skills: ['Microdermabrasion', 'Equipment operation', 'Skin assessment', 'Treatment planning', 'Results tracking', 'Safety protocols'],
      expectedOutcome: '20 documented microdermabrasion treatments with before/after photos, various skin types, visible improvement, no complications.',
      passingCriteria: 'Equipment operated correctly, treatments are safe and effective, skin shows improvement, no adverse reactions, clients satisfied',
      estimatedHours: 30,
      difficulty: 'advanced',
      category: 'facial_services',
      subcategory: 'advanced_treatments',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 5,
      moduleNumber: '5.1',
      assignmentNumber: 'BG-5.1.2',
      orderIndex: 50,
      title: 'LED Light Therapy & Anti-Aging Treatments',
      description: 'Learn LED light therapy, radio frequency, and advanced anti-aging treatment modalities.',
      instructions: `1. Study LED light therapy: red, blue, yellow, green - wavelengths and benefits
2. Learn treatment protocols: acne, anti-aging, inflammation, wound healing
3. Practice equipment setup: timing, distance, eye protection
4. Study radio frequency: skin tightening, collagen stimulation, safety
5. Learn microcurrent therapy: facial toning, lifting, contouring
6. Practice combination treatments: LED with facials, peels, serums
7. Study contraindications: pacemakers, pregnancy, medications, conditions
8. Learn treatment series planning: frequency, duration, expected results
9. Practice client education: realistic expectations, maintenance, home care
10. Complete 25 advanced anti-aging treatments`,
      objectives: [
        'Operate LED and RF equipment safely',
        'Select appropriate treatments for concerns',
        'Plan effective treatment series',
        'Combine modalities for enhanced results',
        'Recognize contraindications',
        'Achieve visible anti-aging results',
      ],
      skills: ['LED therapy', 'Radio frequency', 'Microcurrent', 'Treatment planning', 'Equipment safety', 'Results-driven protocols'],
      expectedOutcome: '25 documented advanced treatments with photos, various modalities, visible improvement in skin tone and firmness.',
      passingCriteria: 'Equipment used safely, treatments appropriate for concerns, visible results achieved, no adverse reactions, clients see improvement',
      estimatedHours: 35,
      difficulty: 'advanced',
      category: 'facial_services',
      subcategory: 'anti_aging',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 5,
      moduleNumber: '5.2',
      assignmentNumber: 'BG-5.2.1',
      orderIndex: 51,
      title: 'Advanced Balayage & Color Melting',
      description: 'Master advanced balayage techniques, color melting, and seamless color blending for high-end dimensional color.',
      instructions: `1. Study advanced balayage: freehand painting, blending, natural placement
2. Learn color melting: seamless blending, eliminating lines, gradient effect
3. Practice foilyage: combining foil and balayage, faster processing
4. Study money piece: face-framing highlights, bold yet natural
5. Learn root smudging: softening regrowth, extending color longevity
6. Practice lived-in color: low-maintenance, natural grow-out, effortless
7. Study color placement strategy: face shape, skin tone, lifestyle
8. Learn toning for dimension: multiple toners, depth and light
9. Practice high-end finishes: glosses, glazes, shine treatments
10. Complete 15 advanced dimensional color services`,
      objectives: [
        'Hand-paint balayage with artistry',
        'Blend colors seamlessly',
        'Create low-maintenance, high-impact color',
        'Customize color for client lifestyle',
        'Achieve salon-quality dimensional color',
        'Command premium pricing for expertise',
      ],
      skills: ['Advanced balayage', 'Color melting', 'Foilyage', 'Toning mastery', 'Color artistry', 'Premium techniques'],
      expectedOutcome: '15 documented advanced color services with photos, seamless blending, natural dimension, high-end results.',
      passingCriteria: 'Balayage looks natural and artistic, color melts seamlessly, no harsh lines, dimension is visible, results are premium-quality',
      estimatedHours: 40,
      difficulty: 'expert',
      category: 'chemical_services',
      subcategory: 'advanced_color',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 5,
      moduleNumber: '5.2',
      assignmentNumber: 'BG-5.2.2',
      orderIndex: 52,
      title: 'Color Correction & Problem Solving',
      description: 'Learn to correct color mistakes, remove unwanted tones, fix banding, and rescue damaged hair from color disasters.',
      instructions: `1. Study color correction theory: color wheel, neutralization, lifting
2. Learn common problems: brass, green tones, banding, uneven color
3. Practice color removal: Color Oops, bleach bath, gentle lifting
4. Study toner correction: neutralizing unwanted tones, achieving target
5. Learn damage assessment: preventing further damage, protein-moisture balance
6. Practice correcting box dye: lifting, toning, managing expectations
7. Study banding correction: blending lines, creating smooth transition
8. Learn consultation: managing difficult clients, realistic timelines, multiple sessions
9. Practice various corrections: too dark, too light, wrong tone, patchy
10. Complete 12 color correction services with documentation`,
      objectives: [
        'Diagnose color problems accurately',
        'Formulate correction strategy',
        'Remove or neutralize unwanted color',
        'Minimize additional damage',
        'Manage challenging client expectations',
        'Achieve desired corrected result',
      ],
      skills: ['Color correction', 'Problem diagnosis', 'Damage prevention', 'Toner formulation', 'Client management', 'Complex problem-solving'],
      expectedOutcome: '12 documented color corrections with before/after photos, various problems solved, client satisfaction despite challenges.',
      passingCriteria: 'Problems accurately diagnosed, corrections successful, minimal additional damage, clients satisfied with results, expectations managed well',
      estimatedHours: 35,
      difficulty: 'expert',
      category: 'chemical_services',
      subcategory: 'color_correction',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 5,
      moduleNumber: '5.3',
      assignmentNumber: 'BG-5.3.1',
      orderIndex: 53,
      title: 'Advanced Updo & Formal Styling',
      description: 'Master updo techniques for weddings, proms, and special events including braided updos, sleek buns, and romantic styles.',
      instructions: `1. Study updo foundations: teasing, backcombing, creating volume base
2. Learn classic chignon: sleek, messy, textured variations
3. Practice braided updos: incorporating braids, crown braids, halo braids
4. Study romantic updos: loose curls, soft waves, whimsical styling
5. Learn sleek updos: smoothing, slicking, modern elegance
6. Practice half-up styles: formal half-up, braided details, accessories
7. Study pin placement: invisible pinning, secure hold, no pain
8. Learn product use: hairspray, texture spray, shine serum
9. Practice accessory integration: flowers, pins, tiaras, veils
10. Complete 20 updo styles for various occasions`,
      objectives: [
        'Create secure, long-lasting updos',
        'Execute various updo styles',
        'Incorporate braiding into updos',
        'Pin hair invisibly and securely',
        'Integrate accessories beautifully',
        'Customize styles for events',
      ],
      skills: ['Updo styling', 'Braiding integration', 'Pin placement', 'Volume creation', 'Accessory placement', 'Formal styling'],
      expectedOutcome: '20 documented updo styles with photos, various techniques, styles lasting 8+ hours, event-appropriate.',
      passingCriteria: 'Updos are secure and comfortable, pinning is invisible, styles last full event, designs are elegant and appropriate',
      estimatedHours: 35,
      difficulty: 'advanced',
      category: 'styling',
      subcategory: 'formal_styling',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 5,
      moduleNumber: '5.3',
      assignmentNumber: 'BG-5.3.2',
      orderIndex: 54,
      title: 'Precision Haircut Mastery',
      description: 'Refine haircutting skills with advanced precision cutting, razor techniques, and signature haircut styles.',
      instructions: `1. Study precision cutting: clean lines, sharp angles, architectural shapes
2. Learn razor cutting: texturizing, softening, movement creation
3. Practice graduated bob: angle precision, weight line, stacking
4. Study asymmetrical cuts: balance, intention, modern edge
5. Learn disconnection: creating separation, intentional choppy layers
6. Practice shag cutting: textured layers, movement, effortless style
7. Study dry cutting: curl pattern cutting, precision on natural texture
8. Learn signature cut development: creating your unique style
9. Practice cutting all hair types: fine, thick, curly, straight, textured
10. Complete 25 advanced precision haircuts`,
      objectives: [
        'Execute precision cuts with clean lines',
        'Use razor for texturizing effectively',
        'Create modern architectural haircuts',
        'Cut dry for curl pattern accuracy',
        'Develop signature cutting style',
        'Master cuts on all hair types',
      ],
      skills: ['Precision cutting', 'Razor techniques', 'Dry cutting', 'Graduation', 'Disconnection', 'Signature style'],
      expectedOutcome: '25 documented advanced cuts with photos, various modern styles, precision execution, custom techniques.',
      passingCriteria: 'Cuts are precise and clean, razor work is controlled, styles are modern and wearable, technique adapts to hair type',
      estimatedHours: 40,
      difficulty: 'expert',
      category: 'hair_cutting',
      subcategory: 'precision_cutting',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 5,
      moduleNumber: '5.4',
      assignmentNumber: 'BG-5.4.1',
      orderIndex: 55,
      title: 'Competition & Editorial Makeup',
      description: 'Learn competition-level makeup artistry, editorial looks, and avant-garde makeup for photo shoots and contests.',
      instructions: `1. Study competition makeup: precision, exaggeration, artistry
2. Learn editorial makeup: high-fashion, creative, trend-forward
3. Practice avant-garde: artistic expression, unconventional, pushing boundaries
4. Study graphic liner: shapes, precision, bold designs
5. Learn editorial eye looks: dramatic shadows, cut crease perfection, color blocking
6. Practice full-face artwork: face charts, creative designs, artistic makeup
7. Study photography makeup: lighting considerations, camera-ready
8. Learn makeup for different lighting: natural, studio, stage, photography
9. Practice speed: creating complex looks efficiently
10. Complete 15 competition/editorial makeup looks`,
      objectives: [
        'Create competition-worthy makeup',
        'Execute editorial and avant-garde looks',
        'Design and execute face charts',
        'Perfect precision techniques',
        'Adapt makeup for photography',
        'Work creatively and artistically',
      ],
      skills: ['Competition makeup', 'Editorial artistry', 'Graphic techniques', 'Face charting', 'Creative design', 'Photography makeup'],
      expectedOutcome: '15 documented editorial/competition looks with photos, face charts, artistic excellence, portfolio-quality work.',
      passingCriteria: 'Makeup is precise and artistic, looks are creative and original, photography is professional, work is competition-level',
      estimatedHours: 40,
      difficulty: 'expert',
      category: 'makeup',
      subcategory: 'editorial',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 5,
      moduleNumber: '5.4',
      assignmentNumber: 'BG-5.4.2',
      orderIndex: 56,
      title: 'Makeup for Different Skin Tones & Ethnicities',
      description: 'Master makeup application for diverse skin tones, understanding undertones, and cultural beauty preferences.',
      instructions: `1. Study melanin-rich skin: undertones, color selection, highlight/contour
2. Learn Asian skin tones: yellow/golden undertones, eye shapes, preferences
3. Practice Latina skin: olive/golden tones, warm colors, bold preferences
4. Study Middle Eastern skin: warm undertones, dramatic eyes, cultural norms
5. Learn fair/pale skin: avoiding ashy tones, preventing washout, rosy undertones
6. Practice foundation matching: all skin tones, custom mixing, undertone identification
7. Study cultural preferences: modest makeup, bold lips, dramatic eyes
8. Learn corrective techniques: hyperpigmentation, uneven tone, dark circles on deep skin
9. Practice eye shape variations: hooded, monolid, deep-set, protruding
10. Complete 20 makeup applications on diverse skin tones`,
      objectives: [
        'Match foundation on all skin tones',
        'Understand undertones in diverse skin',
        'Respect cultural beauty preferences',
        'Adapt techniques for various features',
        'Correct skin concerns on deep skin',
        'Create beautiful makeup on everyone',
      ],
      skills: ['Foundation matching', 'Undertone analysis', 'Cultural awareness', 'Color theory', 'Corrective techniques', 'Inclusive beauty'],
      expectedOutcome: '20 documented makeup applications on diverse clients, perfect matches, respectful approaches, beautiful results for all.',
      passingCriteria: 'Foundation matches seamlessly on all skin tones, techniques respect cultural preferences, all clients look beautiful, inclusive approach demonstrated',
      estimatedHours: 30,
      difficulty: 'advanced',
      category: 'makeup',
      subcategory: 'diverse_beauty',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 5,
      moduleNumber: '5.5',
      assignmentNumber: 'BG-5.5.1',
      orderIndex: 57,
      title: 'Permanent Makeup: Microblading Basics',
      description: 'Learn microblading fundamentals for semi-permanent eyebrow enhancement including blade technique, pigment selection, and safety.',
      instructions: `1. Study microblading theory: manual blade, hair strokes, semi-permanent
2. Learn health and safety: bloodborne pathogens, sterilization, licensing requirements
3. Practice blade handling: angle, pressure, stroke technique on practice skin
4. Study brow mapping: measuring, symmetry, shape design for face
5. Learn pigment selection: matching natural brow color, undertones, fading
6. Practice numbing: topical anesthetics, application, timing
7. Study stroke patterns: direction, natural hair growth, realistic appearance
8. Learn aftercare: healing process, touch-ups, client education
9. Practice on models: full microblading procedure, documentation
10. Complete 10 microblading procedures with supervision`,
      objectives: [
        'Execute microblading safely and hygienically',
        'Map brows for perfect shape',
        'Select appropriate pigments',
        'Create natural-looking hair strokes',
        'Educate clients on aftercare',
        'Obtain required certifications',
      ],
      skills: ['Microblading', 'Brow mapping', 'Pigment selection', 'Blade technique', 'Health & safety', 'Client care'],
      expectedOutcome: '10 documented microblading procedures with photos, natural results, proper healing, required certifications obtained.',
      passingCriteria: 'Strokes look natural and hair-like, brows are symmetrical, healing is proper, safety protocols followed, certification earned',
      estimatedHours: 50,
      difficulty: 'expert',
      category: 'permanent_makeup',
      subcategory: 'microblading',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 5,
      moduleNumber: '5.5',
      assignmentNumber: 'BG-5.5.2',
      orderIndex: 58,
      title: 'Advanced Natural Hair Care & Styling',
      description: 'Master natural hair care, wash-and-go styling, silk presses, and maintaining healthy natural texture.',
      instructions: `1. Study natural hair types: 3a-4c curl patterns, porosity, density
2. Learn moisture retention: LOC/LCO method, deep conditioning, protein balance
3. Practice wash-and-go: product layering, defining curls, long-lasting results
4. Study silk press: heat straightening natural hair, reversion prevention, heat protection
5. Learn twist-outs and braid-outs: setting, unraveling, longevity
6. Practice shrinkage management: stretching techniques, heat-free methods
7. Study scalp health: product buildup, clarifying, moisture balance
8. Learn curl defining: shingling, raking, brush techniques
9. Practice protective styling consultation: preventing damage, promoting growth
10. Complete 20 natural hair services with various techniques`,
      objectives: [
        'Identify and care for curl patterns',
        'Achieve long-lasting wash-and-go',
        'Execute silk press without damage',
        'Define curls beautifully',
        'Maintain hair health and growth',
        'Educate on home care routine',
      ],
      skills: ['Natural hair care', 'Curl defining', 'Silk press', 'Moisture retention', 'Heat styling', 'Scalp health'],
      expectedOutcome: '20 documented natural hair services with photos, defined curls, healthy hair, various curl patterns.',
      passingCriteria: 'Curls are defined and bouncy, silk presses are straight without damage, hair is healthy and moisturized, clients educated',
      estimatedHours: 35,
      difficulty: 'advanced',
      category: 'styling',
      subcategory: 'natural_hair_advanced',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 5,
      moduleNumber: '5.6',
      assignmentNumber: 'BG-5.6.1',
      orderIndex: 59,
      title: 'Business Management for Beauty Professionals',
      description: 'Learn business fundamentals including pricing, booking systems, inventory management, and financial planning.',
      instructions: `1. Study pricing strategy: cost analysis, market research, value-based pricing
2. Learn booking systems: online scheduling, deposits, cancellation policies
3. Practice inventory management: stock tracking, suppliers, minimum orders
4. Study financial planning: budgeting, profit margins, tax preparation
5. Learn client retention: loyalty programs, referral incentives, follow-ups
6. Practice expense tracking: supplies, rent, utilities, categorizing
7. Study business insurance: liability, property, requirements
8. Learn contracts: service agreements, model releases, liability waivers
9. Practice goal setting: financial goals, growth plans, milestones
10. Create complete business plan for beauty services`,
      objectives: [
        'Price services appropriately',
        'Manage bookings and schedules',
        'Track inventory and expenses',
        'Plan for financial success',
        'Retain clients effectively',
        'Operate business legally',
      ],
      skills: ['Pricing strategy', 'Booking management', 'Financial planning', 'Inventory control', 'Client retention', 'Business operations'],
      expectedOutcome: 'Complete business plan, pricing structure, booking system setup, financial tracking established, inventory managed.',
      passingCriteria: 'Business plan is comprehensive, pricing is profitable, booking system functional, expenses tracked, legal requirements met',
      estimatedHours: 30,
      difficulty: 'intermediate',
      category: 'professional_development',
      subcategory: 'business',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 5,
      moduleNumber: '5.6',
      assignmentNumber: 'BG-5.6.2',
      orderIndex: 60,
      title: 'Advanced Client Consultation & Sales',
      description: 'Master consultation skills, product sales, service upselling, and creating comprehensive treatment plans.',
      instructions: `1. Study consultation techniques: needs assessment, lifestyle analysis
2. Learn treatment planning: customized service series, maintenance schedules
3. Practice product sales: identifying needs, recommending appropriately, not pushy
4. Study upselling services: complementary services, package deals, add-ons
5. Learn handling objections: price concerns, time constraints, fear responses
6. Practice closing sales: assumptive close, choice close, creating urgency
7. Study retail display: product placement, testers, point-of-sale
8. Learn follow-up: post-service check-ins, rebooking, product replenishment
9. Practice calculating commissions: retail vs service, tracking sales
10. Achieve $5000 in retail and service sales`,
      objectives: [
        'Conduct thorough consultations',
        'Create customized treatment plans',
        'Sell products genuinely and effectively',
        'Upsell services naturally',
        'Handle sales objections',
        'Achieve sales goals',
      ],
      skills: ['Consultation mastery', 'Sales techniques', 'Upselling', 'Objection handling', 'Treatment planning', 'Retail sales'],
      expectedOutcome: '$5000 in documented sales, consultation forms, treatment plans, satisfied clients purchasing products and rebooking.',
      passingCriteria: 'Sales goal achieved, consultations are thorough, clients feel helped not sold to, reebooking rate is high, product recommendations appropriate',
      estimatedHours: 25,
      difficulty: 'advanced',
      category: 'professional_development',
      subcategory: 'sales',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },

    // ========================================================================
    // LEVEL 6: BUSINESS & MASTERY
    // ========================================================================
    {
      level: 6,
      moduleNumber: '6.1',
      assignmentNumber: 'BG-6.1.1',
      orderIndex: 61,
      title: 'Opening Your Own Beauty Business',
      description: 'Learn to start and operate your own salon, spa, or beauty business including location, licensing, and setup.',
      instructions: `1. Study business structures: sole proprietorship, LLC, corporation - choosing best fit
2. Learn licensing requirements: cosmetology license, business license, permits
3. Practice location selection: foot traffic, demographics, competition analysis
4. Study lease negotiation: terms, build-out, deposits, exit clauses
5. Learn salon design: layout, flow, stations, reception, storage
6. Practice equipment purchasing: chairs, sinks, tools, supplies - budgeting
7. Study hiring: employees vs independent contractors, interviewing, onboarding
8. Learn marketing launch: grand opening, promotions, social media blitz
9. Practice systems setup: POS, scheduling, client management software
10. Create complete business launch plan with timeline and budget`,
      objectives: [
        'Choose appropriate business structure',
        'Obtain all required licenses',
        'Select and secure ideal location',
        'Design functional salon space',
        'Purchase necessary equipment',
        'Launch business successfully',
      ],
      skills: ['Business formation', 'Location selection', 'Salon design', 'Equipment sourcing', 'Licensing', 'Launch planning'],
      expectedOutcome: 'Complete business launch plan with budget, timeline, location selected, equipment list, licensing roadmap.',
      passingCriteria: 'Plan is comprehensive and realistic, budget is detailed, location is appropriate, licensing understood, timeline is achievable',
      estimatedHours: 40,
      difficulty: 'advanced',
      category: 'business_ownership',
      subcategory: 'startup',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 6,
      moduleNumber: '6.1',
      assignmentNumber: 'BG-6.1.2',
      orderIndex: 62,
      title: 'Team Building & Staff Management',
      description: 'Learn to hire, train, manage, and motivate a team of beauty professionals for business growth.',
      instructions: `1. Study hiring process: job descriptions, interviewing, skill assessment
2. Learn onboarding: training protocols, salon policies, cultural fit
3. Practice team training: continuing education, skill development, mentoring
4. Study scheduling: shift management, ensuring coverage, time-off requests
5. Learn performance management: feedback, reviews, improvement plans
6. Practice motivation: commission structures, bonuses, recognition programs
7. Study conflict resolution: mediating disputes, addressing issues, maintaining harmony
8. Learn delegation: assigning tasks, trusting team, avoiding micromanagement
9. Practice team meetings: effective meetings, communication, goal setting
10. Build and manage team of 3+ beauty professionals`,
      objectives: [
        'Hire qualified team members',
        'Train team to salon standards',
        'Schedule efficiently',
        'Provide effective feedback',
        'Motivate and retain staff',
        'Lead team successfully',
      ],
      skills: ['Hiring', 'Training', 'Team management', 'Performance reviews', 'Motivation', 'Leadership'],
      expectedOutcome: 'Team of 3+ professionals hired and managed, training program created, scheduling system in place, team meetings conducted.',
      passingCriteria: 'Team is skilled and motivated, turnover is low, scheduling is efficient, communication is clear, standards are maintained',
      estimatedHours: 35,
      difficulty: 'advanced',
      category: 'business_ownership',
      subcategory: 'management',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 6,
      moduleNumber: '6.2',
      assignmentNumber: 'BG-6.2.1',
      orderIndex: 63,
      title: 'Advanced Marketing & Brand Development',
      description: 'Develop comprehensive marketing strategy, build brand identity, and create effective advertising campaigns.',
      instructions: `1. Study brand identity: mission, values, unique selling proposition, positioning
2. Learn logo and visual identity: design, colors, fonts, consistent application
3. Practice website development: booking integration, gallery, services, SEO
4. Study Google My Business: optimization, reviews, local SEO, visibility
5. Learn paid advertising: Facebook ads, Instagram ads, Google ads, targeting
6. Practice email marketing: newsletters, promotions, automated sequences
7. Study partnerships: collaborations, cross-promotions, local businesses
8. Learn PR: media outreach, press releases, local features
9. Practice analytics: tracking ROI, adjusting strategy, measuring success
10. Execute 6-month marketing campaign with measurable results`,
      objectives: [
        'Develop strong brand identity',
        'Create professional online presence',
        'Execute effective advertising campaigns',
        'Build local reputation',
        'Track marketing ROI',
        'Grow client base through marketing',
      ],
      skills: ['Brand development', 'Digital marketing', 'SEO', 'Paid advertising', 'Email marketing', 'Analytics'],
      expectedOutcome: '6-month marketing campaign executed, brand identity established, website live, ads running, measurable client growth.',
      passingCriteria: 'Brand is cohesive and recognizable, website is professional, ads generate leads, client base grows, ROI is positive',
      estimatedHours: 40,
      difficulty: 'advanced',
      category: 'business_ownership',
      subcategory: 'marketing',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 6,
      moduleNumber: '6.2',
      assignmentNumber: 'BG-6.2.2',
      orderIndex: 64,
      title: 'Financial Management & Growth Strategy',
      description: 'Master financial management, profit optimization, and strategic planning for business growth and sustainability.',
      instructions: `1. Study financial statements: P&L, balance sheet, cash flow - reading and analyzing
2. Learn cost control: reducing waste, negotiating suppliers, efficiency improvements
3. Practice pricing optimization: raising prices, tiered pricing, premium services
4. Study profit margins: service vs retail, identifying most profitable offerings
5. Learn tax planning: quarterly estimates, deductions, working with accountant
6. Practice growth planning: expansion timeline, second location, franchising
7. Study passive income: product lines, online courses, affiliate marketing
8. Learn investment: reinvesting profits, equipment upgrades, marketing budget
9. Practice exit strategy: selling business, valuation, succession planning
10. Create 3-year growth plan with financial projections`,
      objectives: [
        'Read and understand financial statements',
        'Control costs effectively',
        'Optimize pricing for profit',
        'Plan for sustainable growth',
        'Manage taxes appropriately',
        'Build valuable business asset',
      ],
      skills: ['Financial analysis', 'Cost control', 'Profit optimization', 'Growth planning', 'Tax management', 'Strategic thinking'],
      expectedOutcome: '3-year growth plan with financial projections, cost control measures implemented, pricing optimized, profit margins improved.',
      passingCriteria: 'Financial statements are understood, costs are controlled, profitability increases, growth plan is realistic, business is sustainable',
      estimatedHours: 35,
      difficulty: 'advanced',
      category: 'business_ownership',
      subcategory: 'finance',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 6,
      moduleNumber: '6.3',
      assignmentNumber: 'BG-6.3.1',
      orderIndex: 65,
      title: 'Teaching & Mentoring Future Professionals',
      description: 'Learn to train apprentices, create educational content, and give back to the beauty community through teaching.',
      instructions: `1. Study teaching methods: demonstration, hands-on practice, feedback
2. Learn curriculum development: structuring lessons, progression, assessments
3. Practice one-on-one mentoring: identifying weaknesses, personalized guidance
4. Study group teaching: classroom management, engaging multiple learners
5. Learn creating tutorials: video production, editing, clear instruction
6. Practice workshop hosting: planning, marketing, delivering live education
7. Study online course creation: platform selection, content organization, pricing
8. Learn certification programs: developing standards, testing, issuing certificates
9. Practice giving constructive feedback: encouraging while correcting, growth mindset
10. Train 3 apprentices to competency in chosen specialty`,
      objectives: [
        'Teach beauty techniques effectively',
        'Mentor apprentices successfully',
        'Create educational content',
        'Host workshops and classes',
        'Give constructive feedback',
        'Elevate the beauty profession',
      ],
      skills: ['Teaching', 'Mentoring', 'Curriculum development', 'Content creation', 'Feedback delivery', 'Leadership'],
      expectedOutcome: '3 trained apprentices, educational content created, workshop hosted, teaching materials developed.',
      passingCriteria: 'Apprentices reach competency, teaching is clear and effective, content is helpful, feedback is constructive, students are satisfied',
      estimatedHours: 50,
      difficulty: 'expert',
      category: 'professional_development',
      subcategory: 'education',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 6,
      moduleNumber: '6.3',
      assignmentNumber: 'BG-6.3.2',
      orderIndex: 66,
      title: 'Industry Networking & Professional Development',
      description: 'Build professional network, attend industry events, join professional organizations, and advance career through connections.',
      instructions: `1. Study professional organizations: joining, participating, benefiting from membership
2. Learn networking events: trade shows, conferences, local meetups - making connections
3. Practice social media networking: engaging with industry leaders, commenting thoughtfully
4. Study collaboration opportunities: photo shoots, fashion shows, charity events
5. Learn speaking opportunities: panels, podcasts, workshops, sharing expertise
6. Practice competition participation: entering contests, showcasing skills, gaining exposure
7. Study mentorship: finding mentors, being mentored, advancing through guidance
8. Learn giving back: charity work, community service, pro bono services
9. Practice staying current: continuing education, trend research, skill updates
10. Attend 3 industry events and build network of 20+ beauty professionals`,
      objectives: [
        'Build strong professional network',
        'Stay current with industry trends',
        'Gain exposure through events',
        'Collaborate with other professionals',
        'Give back to community',
        'Advance career through connections',
      ],
      skills: ['Networking', 'Professional relationships', 'Collaboration', 'Public speaking', 'Community service', 'Continuous learning'],
      expectedOutcome: '3 events attended, network of 20+ professionals, collaborations completed, professional organization membership, portfolio enhanced.',
      passingCriteria: 'Network is established and active, events provided value, collaborations are successful, professional presence is strong',
      estimatedHours: 30,
      difficulty: 'intermediate',
      category: 'professional_development',
      subcategory: 'networking',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 6,
      moduleNumber: '6.4',
      assignmentNumber: 'BG-6.4.1',
      orderIndex: 67,
      title: 'Specialization: Choose Your Expert Path',
      description: 'Choose a specialization area and develop expert-level mastery in bridal, color, natural hair, nails, skincare, or men\'s grooming.',
      instructions: `1. Study specialization options: analyzing market demand, personal passion, profitability
2. Learn advanced techniques in chosen specialty: deepening expertise, unique offerings
3. Practice signature service development: creating unique services, premium positioning
4. Study certification in specialty: advanced training, recognized credentials
5. Learn marketing specialty: positioning as expert, premium pricing, targeted marketing
6. Practice building specialty clientele: attracting ideal clients, retention
7. Study teaching specialty: workshops, masterclasses, establishing authority
8. Learn product development: creating signature products for specialty
9. Practice competition in specialty: showcasing expertise, winning awards
10. Complete 30 services in chosen specialty at expert level`,
      objectives: [
        'Choose profitable specialization',
        'Develop expert-level skills',
        'Create signature services',
        'Obtain advanced certifications',
        'Build specialty clientele',
        'Establish authority in specialty',
      ],
      skills: ['Specialized expertise', 'Signature services', 'Premium positioning', 'Niche marketing', 'Advanced techniques', 'Authority building'],
      expectedOutcome: '30 expert-level specialty services documented, certifications earned, signature service created, specialty clientele built.',
      passingCriteria: 'Expertise is evident, signature service is unique, certification earned, clients seek out specialty, premium pricing achieved',
      estimatedHours: 60,
      difficulty: 'expert',
      category: 'specialization',
      subcategory: 'mastery',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 6,
      moduleNumber: '6.4',
      assignmentNumber: 'BG-6.4.2',
      orderIndex: 68,
      title: 'Capstone Project: Complete Beauty Transformation',
      description: 'Execute a complete beauty transformation showcasing multiple skills from consultation through final reveal and documentation.',
      instructions: `1. Select transformation client: significant change potential, good candidate
2. Conduct comprehensive consultation: analyzing all aspects, creating vision
3. Plan transformation: services needed, timeline, products, budget
4. Execute hair services: cut, color, styling - comprehensive hair transformation
5. Perform makeup application: enhancing features, appropriate for lifestyle
6. Complete nail services: manicure, pedicure, nail art if appropriate
7. Provide skincare services: facial, recommendations, home care plan
8. Style final look: outfit consultation, accessories, complete presentation
9. Document transformation: before/during/after photos, video if possible
10. Present transformation: reveal, client reaction, portfolio documentation`,
      objectives: [
        'Plan comprehensive transformation',
        'Execute multiple services cohesively',
        'Create dramatic, positive change',
        'Document professionally',
        'Showcase mastery of all skills',
        'Create portfolio centerpiece',
      ],
      skills: ['Comprehensive planning', 'Multi-service execution', 'Transformation artistry', 'Documentation', 'Presentation', 'Mastery integration'],
      expectedOutcome: 'Complete transformation documented with professional photos, client is thrilled, transformation showcases multiple skills, portfolio centerpiece created.',
      passingCriteria: 'Transformation is dramatic and cohesive, all services are expertly executed, documentation is professional, client is amazed, work demonstrates mastery',
      estimatedHours: 30,
      difficulty: 'expert',
      category: 'capstone',
      subcategory: 'final_project',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 6,
      moduleNumber: '6.5',
      assignmentNumber: 'BG-6.5.1',
      orderIndex: 69,
      title: 'Professional Portfolio & Career Launch',
      description: 'Compile comprehensive professional portfolio, prepare for licensure, and launch beauty career successfully.',
      instructions: `1. Curate final portfolio: best work from all 6 levels, variety, progression shown
2. Create portfolio presentation: physical book, digital portfolio, social media showcase
3. Prepare for licensure: study for exams, practical preparation, application process
4. Develop resume: highlighting skills, education, work samples, references
5. Practice job interviews: answering questions, showcasing portfolio, professionalism
6. Study employment options: salon employment, booth rental, mobile services, ownership
7. Create career plan: goals, timeline, steps, milestones
8. Build professional presence: business cards, website, social media, branding
9. Prepare for launch: initial clients, pricing, services offered, marketing
10. Complete licensing exams and secure first beauty position or launch business`,
      objectives: [
        'Create outstanding professional portfolio',
        'Pass licensing examinations',
        'Secure employment or launch business',
        'Establish professional brand',
        'Set clear career goals',
        'Begin successful beauty career',
      ],
      skills: ['Portfolio presentation', 'Exam preparation', 'Job searching', 'Interviewing', 'Career planning', 'Professional branding'],
      expectedOutcome: 'Professional portfolio complete, licensing exams passed, employment secured or business launched, career successfully started.',
      passingCriteria: 'Portfolio is impressive and comprehensive, exams passed, position secured or business launched, career trajectory is clear',
      estimatedHours: 40,
      difficulty: 'advanced',
      category: 'professional_development',
      subcategory: 'career_launch',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
    {
      level: 6,
      moduleNumber: '6.5',
      assignmentNumber: 'BG-6.5.2',
      orderIndex: 70,
      title: 'Final Assessment & Mastery Certification',
      description: 'Demonstrate mastery across all beauty services through comprehensive practical examination and earn certification.',
      instructions: `1. Review all Level 1-6 skills: refreshing techniques, identifying areas for improvement
2. Practice weak areas: additional work on any services needing improvement
3. Prepare for practical exam: all services, time management, professional setup
4. Execute men's grooming services: haircut, shave, beard trim, grooming
5. Perform women's hair services: cut, color, style, protective styling
6. Complete nail services: manicure, pedicure, nail art, gel or acrylic
7. Apply makeup: natural and glamorous looks, demonstrating versatility
8. Provide facial services: complete facial, extractions, professional technique
9. Demonstrate business skills: consultation, pricing, client communication, professionalism
10. Pass comprehensive practical and written examination`,
      objectives: [
        'Demonstrate mastery of all skills',
        'Execute services professionally',
        'Show business acumen',
        'Pass comprehensive examination',
        'Earn mastery certification',
        'Graduate from Beauty & Grooming program',
      ],
      skills: ['Comprehensive mastery', 'Time management', 'Professionalism', 'Technical excellence', 'Business knowledge', 'Client service'],
      expectedOutcome: 'All services executed at professional level, exams passed, mastery certification earned, ready for successful beauty career.',
      passingCriteria: 'All services are executed correctly and professionally, exams passed with 85%+, professionalism demonstrated, certification earned',
      estimatedHours: 50,
      difficulty: 'expert',
      category: 'certification',
      subcategory: 'final_exam',
      serviceTrack: 'beauty_grooming' as ServiceTrack,
    },
  ]

  try {
    console.log(`Creating ${assignments.length} Beauty & Grooming assignments...`)

    for (const assignment of assignments) {
      await prisma.assignmentTemplate.create({
        data: assignment,
      })
    }

    console.log('✅ Beauty & Grooming Curriculum seeded successfully!')
    console.log(`📊 Total assignments created: ${assignments.length}`)
    console.log('   Level 1 (Foundations): 12 assignments')
    console.log('   Level 2 (Basic Services): 12 assignments')
    console.log('   Level 3 (Intermediate): 12 assignments')
    console.log('   Level 4 (Advanced): 12 assignments')
    console.log('   Level 5 (Expert): 12 assignments')
    console.log('   Level 6 (Business & Mastery): 10 assignments')
  } catch (error) {
    console.error('❌ Error seeding Beauty & Grooming Curriculum:', error)
    throw error
  }
}

export default seedBeautyGroomingCurriculum

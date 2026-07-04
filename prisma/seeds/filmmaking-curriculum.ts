import { PrismaClient, ServiceTrack } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Filmmaking & Video Production Curriculum Seed
 *
 * Complete filmmaking journey from smartphone filming to professional video production
 * Designed for educational content creators documenting craft skills
 * 9 levels, 81 assignments total
 *
 * Level 1: Phone Camera Mastery - Samsung S23 Ultra (9 assignments)
 * Level 2: Cinematography - Visual Storytelling (9 assignments)
 * Level 3: Lighting - Professional Lighting Techniques (9 assignments)
 * Level 4: Audio - Sound Recording & Design (9 assignments)
 * Level 5: DaVinci Resolve - Video Editing (9 assignments)
 * Level 6: Motion Graphics - Titles & Effects (9 assignments)
 * Level 7: Educational Video Production (9 assignments)
 * Level 8: Color Grading - Cinematic Look (9 assignments)
 * Level 9: Studio Build & Advanced Production (9 assignments)
 *
 * Total: 81 assignments covering smartphone filming to professional educational video production
 */

export async function seedFilmmakingCurriculum() {
  console.log('🎥 Seeding Filmmaking & Video Production Curriculum...')

  const assignments = [
    // ========================================================================
    // LEVEL 1: PHONE CAMERA MASTERY - Samsung S23 Ultra
    // ========================================================================
    {
      level: 1,
      moduleNumber: '1.1',
      assignmentNumber: 'FM-1.1.1',
      orderIndex: 1,
      title: 'Video Production Studio Setup & Safety',
      description: 'Set up a functional video production workspace with proper organization for equipment, adequate power management, data storage systems, and safe filming practices.',
      instructions: `1. Study filming safety hazards: electrical cables, tripod stability, lighting heat, battery safety
2. Learn proper workspace organization: equipment storage, charging station, cable management
3. Set up filming area: backdrop space, adequate lighting area, tripod positions
4. Create data management system: SD card organization, backup drives, cloud storage
5. Organize equipment storage: camera bags, lens cases, accessory drawers
6. Set up editing workstation: monitor position, ergonomic desk, proper lighting
7. Install power management: surge protectors, battery charging station, power strips
8. Create safety checklist: pre-shoot equipment check, cable routing, lighting safety
9. Establish backup protocol: dual storage, cloud backup, project organization
10. Complete safety documentation and photograph your organized studio`,
      objectives: [
        'Identify all safety hazards in video production',
        'Set up proper equipment storage and organization',
        'Establish reliable data backup systems',
        'Create efficient workflow space',
        'Implement power management for all equipment',
        'Develop pre-shoot safety checklist',
      ],
      skills: ['Studio safety', 'Equipment organization', 'Data management', 'Power systems', 'Workflow planning', 'Risk assessment'],
      expectedOutcome: 'Fully organized video production studio with proper equipment storage, charging station, data backup system, editing workstation, and safety protocols documented.',
      passingCriteria: 'Studio has proper electrical setup, all equipment organized and accessible, backup systems tested and working, safety checklist complete, workspace ergonomic',
      referencePhotos: ['/curriculum/filmmaking/studio-layout.jpg', '/curriculum/filmmaking/equipment-storage.jpg', '/curriculum/filmmaking/safety-setup.jpg'],
      estimatedHours: 8,
      difficulty: 'beginner',
      category: 'setup',
      subcategory: 'safety',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Set Safety Guidelines for Video Production',
        'Data Management Best Practices for Filmmakers',
        'Basic Electrical Safety for Content Creators',
      ],
    },
    {
      level: 1,
      moduleNumber: '1.1',
      assignmentNumber: 'FM-1.1.2',
      orderIndex: 2,
      title: 'Samsung S23 Ultra Camera App Mastery',
      description: 'Master the Samsung S23 Ultra camera app, understanding all modes, settings, and features for optimal video quality.',
      instructions: `1. Explore camera modes: Video, Pro Video, Hyperlapse, Slow Motion, Single Take
2. Learn resolution settings: 4K 60fps, 8K 24fps, 1080p options
3. Study frame rates: 24fps (cinematic), 30fps (standard), 60fps (smooth motion), 120fps/240fps (slow-mo)
4. Practice focus modes: Auto-focus, Manual focus, Tracking auto-focus
5. Understand exposure: ISO settings, shutter speed relationship
6. Learn white balance: Auto, daylight, cloudy, tungsten, fluorescent, custom
7. Explore video effects: Filters, aspect ratios, grid overlays
8. Test microphone options: Internal mic, external mic input, audio monitoring
9. Practice using zoom: Optical vs digital, smooth zoom techniques
10. Record test footage using each mode and setting`,
      objectives: [
        'Navigate all camera modes confidently',
        'Select optimal resolution and frame rate for each scenario',
        'Control focus manually and automatically',
        'Adjust exposure for proper brightness',
        'Set accurate white balance',
        'Use camera features effectively',
      ],
      skills: ['Camera operation', 'Technical settings', 'Video modes', 'Mobile filming', 'Settings optimization'],
      expectedOutcome: 'Test video clips demonstrating each camera mode, resolution setting, frame rate option, and manual control of focus, exposure, and white balance.',
      passingCriteria: 'All modes tested successfully, footage properly exposed and in focus, white balance accurate, optimal settings chosen for different scenarios',
      referencePhotos: ['/curriculum/filmmaking/s23-camera-modes.jpg', '/curriculum/filmmaking/pro-video-settings.jpg'],
      estimatedHours: 6,
      difficulty: 'beginner',
      category: 'camera_basics',
      subcategory: 'smartphone',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Samsung Galaxy S23 Ultra Camera Manual',
        'Understanding Frame Rates for Video',
        'Smartphone Filmmaking Pro course (YouTube)',
      ],
    },
    {
      level: 1,
      moduleNumber: '1.1',
      assignmentNumber: 'FM-1.1.3',
      orderIndex: 3,
      title: 'Understanding Exposure Triangle - ISO, Shutter, Aperture',
      description: 'Master the exposure triangle relationship between ISO, shutter speed, and aperture (f-stop) for proper video exposure.',
      instructions: `1. Study ISO sensitivity: Low ISO (100-400) = clean, High ISO (800+) = noise/grain
2. Learn shutter speed rule: 1/(2x frame rate) for natural motion blur (e.g., 24fps = 1/48s)
3. Understand aperture on S23: Fixed aperture (f/1.8-f/2.4), digital aperture effects
4. Practice exposure compensation: Adjusting brightness without changing frame rate
5. Test ISO range: Film same scene at ISO 100, 400, 800, 1600, 3200
6. Practice shutter speed: Test different speeds, observe motion blur differences
7. Learn ND filters: Reduce light to maintain slow shutter in bright conditions
8. Study exposure histogram: Understanding clipping, shadows, midtones, highlights
9. Practice manual exposure: Lock exposure for consistent brightness across shots
10. Create exposure reference chart with sample footage`,
      objectives: [
        'Understand ISO sensitivity and noise relationship',
        'Apply 180-degree shutter rule for natural motion',
        'Read and use histogram for accurate exposure',
        'Balance exposure triangle for optimal quality',
        'Use manual exposure controls confidently',
        'Identify over/underexposure issues',
      ],
      skills: ['Exposure control', 'ISO management', 'Shutter speed selection', 'Histogram reading', 'Manual camera operation'],
      expectedOutcome: 'Exposure reference chart with videos at different ISO levels, shutter speeds, and exposure compensation settings. All properly labeled and analyzed.',
      passingCriteria: 'Exposure is accurate across all test clips, histogram shows proper distribution, ISO chosen appropriately for lighting conditions, shutter speed follows 180-degree rule',
      referencePhotos: ['/curriculum/filmmaking/exposure-triangle.jpg', '/curriculum/filmmaking/histogram-examples.jpg'],
      estimatedHours: 8,
      difficulty: 'beginner',
      category: 'camera_basics',
      subcategory: 'exposure',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Understanding Exposure by Bryan Peterson',
        'The Exposure Triangle Explained',
        'Smartphone Cinema: Exposure Masterclass',
      ],
      crossReferences: ['FM-1.1.2'],
    },
    {
      level: 1,
      moduleNumber: '1.2',
      assignmentNumber: 'FM-1.2.1',
      orderIndex: 4,
      title: 'White Balance & Color Temperature',
      description: 'Master white balance settings to achieve accurate colors in different lighting conditions and understand Kelvin temperature.',
      instructions: `1. Study color temperature scale: 2000K (candlelight) to 10000K (blue sky)
2. Learn preset white balance: Daylight (5500K), Cloudy (6500K), Tungsten (3200K), Fluorescent (4000K)
3. Practice custom white balance: Using white card/grey card for perfect accuracy
4. Film in mixed lighting: Combine daylight and tungsten, observe color cast
5. Test auto white balance: When it works well vs when manual is better
6. Learn color correction vs color grading: Fixing vs stylizing
7. Use Kelvin temperature control: Manual adjustment for precise color
8. Study golden hour: Warm 3000K light, blue hour 9000K+ light
9. Film white balance comparison: Same scene with different WB settings
10. Create white balance reference guide with sample footage`,
      objectives: [
        'Set accurate white balance for any lighting condition',
        'Understand Kelvin color temperature scale',
        'Use custom white balance with grey card',
        'Identify and correct color casts',
        'Choose between auto and manual WB appropriately',
        'Create consistent color across multiple shots',
      ],
      skills: ['White balance control', 'Color temperature understanding', 'Color correction', 'Lighting assessment'],
      expectedOutcome: 'White balance reference guide showing same scene under different WB settings, custom WB samples, and correctly balanced footage in various lighting conditions.',
      passingCriteria: 'Colors are accurate and neutral, no unwanted color casts, grey card method properly executed, footage has consistent color temperature',
      referencePhotos: ['/curriculum/filmmaking/color-temperature-chart.jpg', '/curriculum/filmmaking/white-balance-comparison.jpg'],
      estimatedHours: 6,
      difficulty: 'beginner',
      category: 'camera_basics',
      subcategory: 'color',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Understanding White Balance and Color Temperature',
        'Kelvin Scale for Video Production',
      ],
      crossReferences: ['FM-1.1.2', 'FM-1.1.3'],
    },
    {
      level: 1,
      moduleNumber: '1.2',
      assignmentNumber: 'FM-1.2.2',
      orderIndex: 5,
      title: 'Focus Techniques & Depth of Field',
      description: 'Master manual and auto-focus techniques, tracking focus, and understanding depth of field for smartphone video.',
      instructions: `1. Study focus types: Auto-focus, Manual focus, Continuous auto-focus, Tracking focus
2. Practice tap-to-focus: Single-point focus, locking focus
3. Learn manual focus pulling: Smooth focus transitions between subjects
4. Understand depth of field: Controlled by aperture (limited on phone), distance to subject, background distance
5. Practice shallow DOF: Portrait mode, telephoto lens, close to subject
6. Practice deep DOF: Wide angle, far from subject, landscape shots
7. Learn focus peaking: Using focus assist tools if available
8. Study rack focus: Shifting focus from foreground to background
9. Practice tracking focus: Following moving subjects smoothly
10. Create focus demonstration reel showing all techniques`,
      objectives: [
        'Control focus manually with precision',
        'Use auto-focus and tracking effectively',
        'Understand depth of field principles',
        'Execute smooth rack focus transitions',
        'Keep moving subjects in focus',
        'Choose optimal focus technique for each shot',
      ],
      skills: ['Focus control', 'Manual focus pulling', 'Tracking focus', 'Depth of field management'],
      expectedOutcome: 'Focus demonstration reel including tap-to-focus examples, manual focus pulls, rack focus shots, tracking focus on moving subjects, shallow and deep DOF comparisons.',
      passingCriteria: 'Focus is sharp and intentional, focus pulls are smooth, tracking keeps subject sharp, DOF is appropriate for each shot type',
      referencePhotos: ['/curriculum/filmmaking/focus-techniques.jpg', '/curriculum/filmmaking/depth-of-field-examples.jpg'],
      estimatedHours: 7,
      difficulty: 'intermediate',
      category: 'camera_basics',
      subcategory: 'focus',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Depth of Field in Cinematography',
        'Focus Pulling Techniques for Mobile Video',
      ],
      crossReferences: ['FM-1.1.2'],
    },
    {
      level: 1,
      moduleNumber: '1.3',
      assignmentNumber: 'FM-1.3.1',
      orderIndex: 6,
      title: 'Smartphone Stabilization Techniques',
      description: 'Learn to hold the phone steady, use electronic stabilization, and employ tools like gimbals and tripods for smooth footage.',
      instructions: `1. Study handheld technique: Two-hand grip, elbows tucked, stable stance
2. Practice breathing technique: Exhale before shooting, steady body
3. Learn walking technique: Bend knees, heel-to-toe steps, smooth movement
4. Use electronic stabilization: Samsung Super Steady mode vs standard
5. Practice panning: Smooth horizontal movement, consistent speed
6. Practice tilting: Smooth vertical movement, controlled motion
7. Learn tripod usage: Level horizon, smooth pan/tilt head
8. Study gimbal basics: Balancing, modes (follow, lock, POV)
9. Practice gimbal movements: Walking, running, low-angle, high-angle
10. Create stabilization comparison video showing all techniques`,
      objectives: [
        'Hold phone steady for shake-free footage',
        'Use electronic stabilization effectively',
        'Operate tripod smoothly',
        'Balance and use smartphone gimbal',
        'Execute smooth camera movements',
        'Choose appropriate stabilization for each scenario',
      ],
      skills: ['Camera stabilization', 'Handheld technique', 'Gimbal operation', 'Tripod usage', 'Smooth camera movement'],
      expectedOutcome: 'Stabilization comparison video demonstrating handheld (steady vs shaky), electronic stabilization, tripod shots, gimbal movements, panning and tilting techniques.',
      passingCriteria: 'Handheld footage is stable, electronic stabilization properly utilized, tripod shots are level and smooth, gimbal is balanced and movements are fluid',
      referencePhotos: ['/curriculum/filmmaking/handheld-grip.jpg', '/curriculum/filmmaking/gimbal-movements.jpg'],
      estimatedHours: 8,
      difficulty: 'intermediate',
      category: 'camera_basics',
      subcategory: 'stabilization',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Smartphone Gimbal Tutorial',
        'Stabilization Techniques for Mobile Filmmaking',
      ],
    },
    {
      level: 1,
      moduleNumber: '1.3',
      assignmentNumber: 'FM-1.3.2',
      orderIndex: 7,
      title: 'Smartphone Video Accessories & Lenses',
      description: 'Learn about essential smartphone video accessories: external lenses, filters, microphones, lights, and power solutions.',
      instructions: `1. Study clip-on lenses: Wide-angle, telephoto, macro, fisheye, anamorphic
2. Learn ND filters: Variable ND, fixed ND for exposure control in bright light
3. Explore CPL filters: Reducing reflections, enhancing colors, controlling glare
4. Study external microphones: Lavalier, shotgun, wireless, USB-C/Lightning connection
5. Learn portable LED lights: On-camera LED panels, RGB lights, ring lights
6. Study smartphone rigs: Cages, handles, cold shoe mounts
7. Learn power solutions: External battery packs, USB-C power delivery
8. Explore monitoring: External monitors, smartphone monitor apps
9. Study storage solutions: High-speed microSD cards, USB-C SSDs
10. Create accessory setup guide for different filming scenarios`,
      objectives: [
        'Select appropriate lenses for different shots',
        'Use ND and CPL filters effectively',
        'Connect and use external microphones',
        'Set up portable lighting solutions',
        'Build smartphone rig for professional setup',
        'Manage power and storage for long shoots',
      ],
      skills: ['Accessory selection', 'Lens attachment', 'Filter usage', 'Microphone setup', 'Rig building'],
      expectedOutcome: 'Accessory setup guide with photos showing different rig configurations, lens attachment examples, filter comparison shots, and microphone setup demonstrations.',
      passingCriteria: "Accessories are properly attached and functional, lenses don't cause vignetting, filters are clean and effective, audio from external mic is clear",
      referencePhotos: ['/curriculum/filmmaking/smartphone-rig.jpg', '/curriculum/filmmaking/accessories-guide.jpg'],
      estimatedHours: 6,
      difficulty: 'beginner',
      category: 'equipment',
      subcategory: 'accessories',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Essential Smartphone Filmmaking Accessories',
        'Moment Lens Guide',
        'External Microphones for Mobile Video',
      ],
    },
    {
      level: 1,
      moduleNumber: '1.3',
      assignmentNumber: 'FM-1.3.3',
      orderIndex: 8,
      title: 'HDR Video & Log Recording',
      description: 'Understand HDR video, log recording profiles, and when to use them for maximum post-production flexibility.',
      instructions: `1. Study HDR10+: Samsung's HDR video mode, dynamic tone mapping
2. Learn log recording: If available, flat color profile for color grading
3. Understand dynamic range: Shadows to highlights, retaining detail
4. Practice HDR recording: High-contrast scenes, bright windows, dark interiors
5. Learn limitations: HDR playback requirements, file size increase
6. Study standard vs HDR: Comparison in editing and final delivery
7. Practice exposure for log: ETTR (Expose To The Right) technique
8. Learn LUT application: Converting log footage to viewable image
9. Study when to use HDR: Scenarios that benefit from extended dynamic range
10. Create HDR vs standard comparison project`,
      objectives: [
        'Understand HDR video benefits and limitations',
        'Record in HDR when appropriate',
        'Use log profiles if available',
        'Expose properly for maximum dynamic range',
        'Apply LUTs to log footage',
        'Decide when to use standard vs HDR recording',
      ],
      skills: ['HDR recording', 'Log profiles', 'Dynamic range management', 'LUT application'],
      expectedOutcome: 'HDR vs standard comparison video showing same scenes in both modes, properly exposed log footage with LUT applied, analysis of when each mode is appropriate.',
      passingCriteria: 'HDR footage retains detail in highlights and shadows, log footage properly exposed, LUTs correctly applied, appropriate mode chosen for each scenario',
      referencePhotos: ['/curriculum/filmmaking/hdr-comparison.jpg', '/curriculum/filmmaking/log-footage-examples.jpg'],
      estimatedHours: 7,
      difficulty: 'advanced',
      category: 'camera_advanced',
      subcategory: 'hdr_log',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Understanding HDR Video',
        'Log Recording for Beginners',
        'Samsung S23 Ultra Video Settings Deep Dive',
      ],
      crossReferences: ['FM-1.1.3', 'FM-8.1.1'],
    },
    {
      level: 1,
      moduleNumber: '1.3',
      assignmentNumber: 'FM-1.3.4',
      orderIndex: 9,
      title: 'Smartphone Filming Best Practices Project',
      description: 'Apply all Level 1 skills to film a complete project demonstrating proper camera settings, stabilization, focus, exposure, and accessories usage.',
      instructions: `1. Plan a 2-3 minute demonstration video: Choose a craft skill from SUBER-Craftex
2. Write shot list: Wide shots, close-ups, detail shots, process shots
3. Choose optimal settings: Resolution, frame rate, white balance, exposure
4. Set up proper stabilization: Tripod for static shots, gimbal for movement
5. Use external microphone: Clear narration or ambient sound
6. Apply proper lighting: Natural or artificial, consistent across shots
7. Execute smooth camera movements: Pans, tilts, handheld stability
8. Capture proper focus: Sharp details, intentional focus changes
9. Record b-roll: Multiple angles, different focal lengths
10. Review footage: Check exposure, focus, stability, audio before finishing`,
      objectives: [
        'Plan professional video shoot',
        'Apply optimal camera settings for scenario',
        'Execute stable, well-composed shots',
        'Capture clear audio with external microphone',
        'Demonstrate all Level 1 camera skills',
        'Create portfolio-worthy footage',
      ],
      skills: ['Project planning', 'Shot listing', 'Full production workflow', 'Quality control', 'Technical execution'],
      expectedOutcome: '2-3 minute raw footage package demonstrating a craft skill, properly exposed, in focus, stable, with clear audio. Shot list and settings documentation included.',
      passingCriteria: 'All footage properly exposed and white-balanced, focus is sharp, camera movements smooth, audio clear, variety of shots captured, settings documented',
      referencePhotos: ['/curriculum/filmmaking/sample-project-shots.jpg'],
      estimatedHours: 12,
      difficulty: 'intermediate',
      category: 'projects',
      subcategory: 'phone_project',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'How to Plan a Video Shoot',
        'Creating Shot Lists',
        'Smartphone Filmmaking Pro Full Course',
      ],
      crossReferences: ['FM-1.1.2', 'FM-1.1.3', 'FM-1.2.1', 'FM-1.2.2', 'FM-1.3.1', 'FM-1.3.2'],
      prerequisiteIds: ['FM-1.1.2', 'FM-1.1.3', 'FM-1.2.1', 'FM-1.2.2', 'FM-1.3.1'],
    },

    // ========================================================================
    // LEVEL 2: CINEMATOGRAPHY - Visual Storytelling
    // ========================================================================
    {
      level: 2,
      moduleNumber: '2.1',
      assignmentNumber: 'FM-2.1.1',
      orderIndex: 10,
      title: 'Composition Fundamentals - Rule of Thirds & Visual Balance',
      description: 'Master fundamental composition techniques including rule of thirds, visual balance, leading lines, and framing to create visually engaging shots.',
      instructions: `1. Study rule of thirds: Grid overlay, power points, subject placement
2. Learn visual balance: Symmetrical vs asymmetrical, visual weight
3. Practice leading lines: Using natural lines to guide viewer's eye
4. Study framing: Using foreground elements to frame subject
5. Learn headroom and look room: Proper spacing in frame
6. Practice negative space: Using empty space effectively
7. Study depth: Foreground, midground, background layers
8. Learn center composition: When to break the rule of thirds
9. Practice horizons: Horizontal line placement, keeping level
10. Film composition showcase with 20+ example shots`,
      objectives: [
        'Apply rule of thirds effectively',
        'Create balanced compositions',
        'Use leading lines to guide viewer attention',
        'Frame subjects with environmental elements',
        'Manage headroom and look room properly',
        'Create depth with layered compositions',
      ],
      skills: ['Composition', 'Visual balance', 'Framing', 'Rule of thirds', 'Leading lines', 'Depth creation'],
      expectedOutcome: 'Composition showcase video with labeled examples of each technique: rule of thirds, balance, leading lines, framing, negative space, depth.',
      passingCriteria: 'Compositions follow established principles, subjects properly positioned, visual balance achieved, depth clearly demonstrated, variety of techniques shown',
      referencePhotos: ['/curriculum/filmmaking/rule-of-thirds.jpg', '/curriculum/filmmaking/composition-examples.jpg'],
      estimatedHours: 8,
      difficulty: 'beginner',
      category: 'cinematography',
      subcategory: 'composition',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'The Filmmaker\'s Eye by Gustavo Mercado',
        'Composition in Cinematography',
        'Rule of Thirds and Beyond',
      ],
      prerequisiteIds: ['FM-1.3.4'],
    },
    {
      level: 2,
      moduleNumber: '2.1',
      assignmentNumber: 'FM-2.1.2',
      orderIndex: 11,
      title: 'Camera Angles & Shot Sizes',
      description: 'Learn standard shot sizes (wide, medium, close-up) and camera angles (high, low, eye-level, Dutch) to convey different meanings and emotions.',
      instructions: `1. Study shot sizes: Extreme wide, wide, full, medium, close-up, extreme close-up
2. Practice each shot size: Film same subject at all six sizes
3. Learn eye-level shots: Neutral, objective perspective
4. Practice high angle: Looking down, makes subject appear smaller/weaker
5. Practice low angle: Looking up, makes subject appear larger/powerful
6. Study Dutch angle: Tilted horizon, creates unease or dynamism
7. Learn over-the-shoulder: Dialogue, relationship between subjects
8. Practice POV (point of view): Camera as character's eyes
9. Study bird's eye view: Directly overhead, pattern/layout
10. Create shot size and angle reference chart`,
      objectives: [
        'Execute all standard shot sizes',
        'Choose appropriate shot size for purpose',
        'Use camera angles to convey meaning',
        'Understand psychological impact of angles',
        'Combine angles and sizes effectively',
        'Create visual variety in coverage',
      ],
      skills: ['Shot sizing', 'Camera angles', 'Visual psychology', 'Coverage planning', 'Shot selection'],
      expectedOutcome: 'Reference chart showing same subject filmed at all shot sizes and major angles, with notes on emotional/psychological impact of each.',
      passingCriteria: 'All shot sizes properly framed, angles create intended effect, variety demonstrated, proper labeling and analysis included',
      referencePhotos: ['/curriculum/filmmaking/shot-sizes-chart.jpg', '/curriculum/filmmaking/camera-angles.jpg'],
      estimatedHours: 7,
      difficulty: 'beginner',
      category: 'cinematography',
      subcategory: 'shots_angles',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Shot Sizes in Film',
        'The Psychology of Camera Angles',
        'Cinematic Shot Types',
      ],
      crossReferences: ['FM-2.1.1'],
    },
    {
      level: 2,
      moduleNumber: '2.1',
      assignmentNumber: 'FM-2.1.3',
      orderIndex: 12,
      title: 'Camera Movement - Motivated vs Unmotivated',
      description: 'Master camera movements (pan, tilt, dolly, truck, pedestal, crane) and understand when movement should be motivated by story or subject.',
      instructions: `1. Study pan: Horizontal rotation, following subject or revealing space
2. Practice tilt: Vertical rotation, revealing height or showing top-to-bottom
3. Learn dolly/tracking: Camera moves toward/away from subject
4. Practice truck: Camera moves left/right parallel to subject
5. Study pedestal: Camera moves up/down vertically
6. Learn crane/jib: Camera moves in arc, high to low
7. Understand motivated movement: Movement follows action or reveals information
8. Study unmotivated movement: Stylistic choice, creates mood
9. Practice push-in: Slow dolly in to emphasize importance
10. Create camera movement demonstration reel`,
      objectives: [
        'Execute smooth camera movements',
        'Differentiate between movement types',
        'Use motivated movement to follow action',
        'Apply unmotivated movement for style',
        'Combine movements effectively',
        'Choose appropriate movement for each shot',
      ],
      skills: ['Camera movement', 'Panning', 'Tilting', 'Dollying', 'Tracking', 'Movement motivation'],
      expectedOutcome: 'Movement demonstration reel showing each type of movement (pan, tilt, dolly, truck, pedestal) with examples of motivated and unmotivated movement.',
      passingCriteria: 'Movements are smooth and controlled, motivated movements enhance storytelling, unmotivated movements create intended mood, variety demonstrated',
      referencePhotos: ['/curriculum/filmmaking/camera-movements.jpg', '/curriculum/filmmaking/motivated-movement.jpg'],
      estimatedHours: 9,
      difficulty: 'intermediate',
      category: 'cinematography',
      subcategory: 'movement',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Camera Movement in Film',
        'Motivated vs Unmotivated Camera Movement',
        'Gimbal Movement Techniques',
      ],
      crossReferences: ['FM-1.3.1'],
      prerequisiteIds: ['FM-1.3.1'],
    },
    {
      level: 2,
      moduleNumber: '2.2',
      assignmentNumber: 'FM-2.2.1',
      orderIndex: 13,
      title: 'The 180-Degree Rule & Screen Direction',
      description: 'Understand and apply the 180-degree rule to maintain consistent screen direction and spatial relationships between subjects.',
      instructions: `1. Study 180-degree rule: Imaginary line between subjects, camera stays one side
2. Learn why it matters: Maintains spatial relationships, prevents viewer confusion
3. Practice dialogue scenes: Two subjects, proper eyeline and screen direction
4. Study crossing the line: When and how to intentionally break the rule
5. Learn neutral shots: On the line, allows direction change
6. Practice action sequences: Maintaining consistent movement direction
7. Study screen direction: Left-to-right vs right-to-left movement
8. Learn coverage patterns: Master, over-shoulder, close-ups maintaining 180
9. Practice multi-subject scenes: Three or more people, complex eyelines
10. Film dialogue scene demonstrating proper 180-degree coverage`,
      objectives: [
        'Apply 180-degree rule correctly',
        'Maintain consistent screen direction',
        'Shoot proper dialogue coverage',
        'Understand when to break the rule',
        'Create neutral shots for direction changes',
        'Manage complex multi-subject scenes',
      ],
      skills: ['180-degree rule', 'Screen direction', 'Coverage', 'Spatial continuity', 'Eyeline matching'],
      expectedOutcome: 'Dialogue scene properly covered with master, over-shoulders, and close-ups maintaining 180-degree rule, plus examples of intentional line crossing.',
      passingCriteria: 'Screen direction is consistent, eyelines match, spatial relationships clear, 180-degree rule maintained (or intentionally broken with justification)',
      referencePhotos: ['/curriculum/filmmaking/180-degree-rule.jpg', '/curriculum/filmmaking/coverage-pattern.jpg'],
      estimatedHours: 8,
      difficulty: 'intermediate',
      category: 'cinematography',
      subcategory: 'continuity',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'The 180-Degree Rule Explained',
        'Screen Direction in Film',
        'Dialogue Coverage Techniques',
      ],
      crossReferences: ['FM-2.1.2'],
    },
    {
      level: 2,
      moduleNumber: '2.2',
      assignmentNumber: 'FM-2.2.2',
      orderIndex: 14,
      title: 'Visual Storytelling Without Dialogue',
      description: 'Learn to tell stories purely through visual means: action, composition, camera movement, and sequencing.',
      instructions: `1. Study show don't tell: Visual communication vs exposition
2. Practice symbolic imagery: Objects that represent ideas or emotions
3. Learn visual metaphors: Comparing unlike things visually
4. Study shot sequencing: How shots in sequence create meaning
5. Practice environmental storytelling: Setting tells character information
6. Learn visual motifs: Recurring visual elements that reinforce themes
7. Study character revelation: Showing personality through actions/choices
8. Practice emotional communication: Using visuals to convey feelings
9. Learn Kuleshov effect: Adjacent shots create new meaning
10. Create 2-minute story without dialogue or text`,
      objectives: [
        'Tell story without dialogue',
        'Use composition to convey information',
        'Sequence shots to create meaning',
        'Employ visual metaphors effectively',
        'Reveal character through action',
        'Create emotional impact visually',
      ],
      skills: ['Visual storytelling', 'Shot sequencing', 'Symbolic imagery', 'Environmental storytelling', 'Non-verbal communication'],
      expectedOutcome: '2-minute narrative story told entirely through visuals, no dialogue or text, demonstrating clear storytelling through shot selection and sequencing.',
      passingCriteria: 'Story is clear and understandable, emotions conveyed visually, character revealed through action, sequencing creates meaning, no dialogue or text needed',
      referencePhotos: ['/curriculum/filmmaking/visual-storytelling.jpg', '/curriculum/filmmaking/shot-sequence.jpg'],
      estimatedHours: 10,
      difficulty: 'advanced',
      category: 'cinematography',
      subcategory: 'storytelling',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Visual Storytelling by Jennifer Van Sijll',
        'The Kuleshov Effect',
        'Show Don\'t Tell in Film',
      ],
      crossReferences: ['FM-2.1.1', 'FM-2.1.2', 'FM-2.1.3'],
      prerequisiteIds: ['FM-2.1.1', 'FM-2.1.2'],
    },
    {
      level: 2,
      moduleNumber: '2.3',
      assignmentNumber: 'FM-2.3.1',
      orderIndex: 15,
      title: 'Shot Lists & Storyboarding',
      description: 'Learn to pre-visualize your project through detailed shot lists and storyboards for efficient, purposeful filming.',
      instructions: `1. Study shot list components: Shot number, size, angle, movement, description
2. Learn shot list organization: Scene order, setup grouping, efficiency
3. Practice storyboarding: Simple sketches showing composition and action
4. Study frame-by-frame planning: Key moments, camera positions
5. Learn coverage planning: Master, medium, close-up variations
6. Practice timing estimation: How long each shot takes to capture
7. Study equipment requirements: What gear needed for each shot
8. Learn contingency planning: Backup shots if primary doesn't work
9. Practice shot progression: Building visual momentum through sequence
10. Create complete shot list and storyboard for 3-minute video`,
      objectives: [
        'Write comprehensive shot lists',
        'Create simple but effective storyboards',
        'Plan efficient shooting order',
        'Visualize final edit before filming',
        'Estimate time and equipment needs',
        'Build shot progression for pacing',
      ],
      skills: ['Shot listing', 'Storyboarding', 'Pre-visualization', 'Production planning', 'Coverage planning'],
      expectedOutcome: 'Complete shot list (30+ shots) and storyboard for 3-minute video, including shot descriptions, equipment needs, and timing estimates.',
      passingCriteria: 'Shot list is detailed and organized, storyboard clearly shows composition and action, coverage is comprehensive, timing realistic, sequence logical',
      referencePhotos: ['/curriculum/filmmaking/shot-list-template.jpg', '/curriculum/filmmaking/storyboard-example.jpg'],
      estimatedHours: 7,
      difficulty: 'intermediate',
      category: 'pre_production',
      subcategory: 'planning',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Creating Shot Lists for Video Production',
        'Storyboarding for Filmmakers',
        'Pre-Production Planning Guide',
      ],
      crossReferences: ['FM-1.3.4'],
    },
    {
      level: 2,
      moduleNumber: '2.3',
      assignmentNumber: 'FM-2.3.2',
      orderIndex: 16,
      title: 'B-Roll & Coverage Strategy',
      description: 'Master the art of capturing comprehensive b-roll and coverage to give maximum flexibility in editing.',
      instructions: `1. Study b-roll purpose: Supporting footage, cutaways, establishing shots
2. Learn coverage ratios: Shooting 3-5x what you'll use in final edit
3. Practice various angles: Same action from multiple perspectives
4. Study insert shots: Extreme close-ups of details, hands, tools
5. Learn establishing shots: Wide shots that show location/context
6. Practice transition shots: Natural edit points between scenes
7. Study cutaway shots: Related action, provides edit flexibility
8. Learn reaction shots: Subject responding to action
9. Practice environmental shots: Setting, atmosphere, context
10. Film comprehensive b-roll package for craft demonstration`,
      objectives: [
        'Capture adequate b-roll for editing flexibility',
        'Shoot from multiple angles for variety',
        'Create effective insert and detail shots',
        'Film establishing shots that set context',
        'Provide natural transition points',
        'Build comprehensive coverage',
      ],
      skills: ['B-roll shooting', 'Coverage strategy', 'Insert shots', 'Establishing shots', 'Cutaways', 'Multiple angles'],
      expectedOutcome: 'B-roll package with 50+ shots covering a craft demonstration: wide, medium, close, inserts, details, establishing, transitions, reactions.',
      passingCriteria: 'Comprehensive coverage from multiple angles, adequate variety for editing, proper insert shots, establishing shots set context, transitions available',
      referencePhotos: ['/curriculum/filmmaking/b-roll-examples.jpg', '/curriculum/filmmaking/coverage-checklist.jpg'],
      estimatedHours: 8,
      difficulty: 'intermediate',
      category: 'cinematography',
      subcategory: 'coverage',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'B-Roll Shooting Techniques',
        'Coverage for Editing',
        'Insert Shots and Detail Work',
      ],
      crossReferences: ['FM-2.3.1'],
    },
    {
      level: 2,
      moduleNumber: '2.3',
      assignmentNumber: 'FM-2.3.3',
      orderIndex: 17,
      title: 'Continuity & Matching Shots',
      description: 'Learn continuity principles to ensure smooth editing by matching action, screen direction, eyelines, and props between shots.',
      instructions: `1. Study continuity importance: Maintaining reality, preventing jarring cuts
2. Learn action matching: Movement continues smoothly across cuts
3. Practice screen direction: Subject movement consistent across shots
4. Study eyeline matching: Subjects look at correct off-screen points
5. Learn prop continuity: Objects stay in same position/hand
6. Practice wardrobe continuity: Costume consistency across takes
7. Study lighting continuity: Maintaining consistent lighting across coverage
8. Learn temporal continuity: Time of day, shadows, natural light
9. Practice shooting continuity: Note-taking, reference photos, script supervisor role
10. Film scene with perfect continuity across 5+ shots`,
      objectives: [
        'Maintain continuity across multiple shots',
        'Match action smoothly between cuts',
        'Keep screen direction consistent',
        'Match eyelines accurately',
        'Maintain prop and wardrobe consistency',
        'Document continuity during shooting',
      ],
      skills: ['Continuity', 'Action matching', 'Eyeline matching', 'Prop consistency', 'Script supervising', 'Detail observation'],
      expectedOutcome: 'Scene with 5+ shots demonstrating perfect continuity: action matches, eyelines correct, props consistent, screen direction maintained.',
      passingCriteria: 'No continuity errors visible, action matches between cuts, eyelines are correct, props in consistent positions, smooth editing possible',
      referencePhotos: ['/curriculum/filmmaking/continuity-examples.jpg', '/curriculum/filmmaking/action-matching.jpg'],
      estimatedHours: 7,
      difficulty: 'intermediate',
      category: 'cinematography',
      subcategory: 'continuity',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Continuity in Film Production',
        'The Script Supervisor\'s Role',
        'Matching Shots for Editing',
      ],
      crossReferences: ['FM-2.2.1'],
    },
    {
      level: 2,
      moduleNumber: '2.3',
      assignmentNumber: 'FM-2.3.4',
      orderIndex: 18,
      title: 'Cinematography Project - Craft Process Video',
      description: 'Apply all Level 2 cinematography skills to film a complete craft process with professional composition, coverage, and visual storytelling.',
      instructions: `1. Choose craft process: Select 5-10 minute craft demonstration
2. Create shot list: 40+ shots with sizes, angles, movements planned
3. Storyboard key moments: Visualize important steps and transitions
4. Set up multiple camera positions: Plan efficient shooting order
5. Film with proper composition: Apply rule of thirds, balance, depth
6. Capture comprehensive coverage: Wide, medium, close, inserts, b-roll
7. Execute camera movements: Motivated pans, tilts, dolly moves
8. Maintain continuity: Props, lighting, action matching
9. Tell visual story: Process is clear without narration
10. Review footage: Check coverage, continuity, technical quality`,
      objectives: [
        'Plan and execute professional shoot',
        'Apply all composition principles',
        'Capture comprehensive coverage',
        'Maintain perfect continuity',
        'Tell story visually',
        'Create edit-ready footage package',
      ],
      skills: ['Full production workflow', 'Cinematography application', 'Coverage execution', 'Visual storytelling', 'Quality control'],
      expectedOutcome: 'Complete footage package for 5-10 minute craft video: shot list, storyboard, 40+ shots with variety, proper coverage, maintained continuity.',
      passingCriteria: 'Coverage is comprehensive, composition follows principles, continuity maintained, story is clear visually, technical quality high, ready for editing',
      referencePhotos: ['/curriculum/filmmaking/cinematography-project.jpg'],
      estimatedHours: 14,
      difficulty: 'advanced',
      category: 'projects',
      subcategory: 'cinematography_project',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Cinematography Projects Guide',
        'Professional Production Workflow',
      ],
      crossReferences: ['FM-2.1.1', 'FM-2.1.2', 'FM-2.1.3', 'FM-2.2.1', 'FM-2.2.2', 'FM-2.3.1', 'FM-2.3.2', 'FM-2.3.3'],
      prerequisiteIds: ['FM-2.1.1', 'FM-2.1.2', 'FM-2.3.1', 'FM-2.3.2'],
    },

    // ========================================================================
    // LEVEL 3: LIGHTING - Professional Lighting Techniques
    // ========================================================================
    {
      level: 3,
      moduleNumber: '3.1',
      assignmentNumber: 'FM-3.1.1',
      orderIndex: 19,
      title: 'Light Properties - Quality, Color, Direction, Intensity',
      description: 'Understand the four fundamental properties of light and how each affects the mood and quality of your video.',
      instructions: `1. Study light quality: Hard light (sharp shadows) vs soft light (gradual shadows)
2. Learn color temperature: Warm (3000K) vs cool (6500K), emotional impact
3. Practice light direction: Front, side, back, top, bottom lighting
4. Study light intensity: Brightness levels, exposure relationships
5. Learn hard light creation: Direct sun, small sources, bare bulbs
6. Practice soft light creation: Diffusion, large sources, bounce, overcast
7. Study directional lighting: Shadows reveal form and texture
8. Learn intensity control: Distance, dimming, ND filters, diffusion
9. Practice combining properties: Hard/soft + warm/cool + direction
10. Create lighting properties reference chart`,
      objectives: [
        'Identify and control light quality',
        'Understand color temperature impact',
        'Use light direction purposefully',
        'Control light intensity',
        'Create hard and soft light',
        'Combine properties for desired effect',
      ],
      skills: ['Light properties', 'Hard vs soft light', 'Color temperature', 'Light direction', 'Intensity control'],
      expectedOutcome: 'Reference chart showing same subject lit with different properties: hard/soft, warm/cool, various directions, different intensities.',
      passingCriteria: 'All light properties demonstrated clearly, differences visible, proper labeling, understanding of emotional impact shown',
      referencePhotos: ['/curriculum/filmmaking/light-properties.jpg', '/curriculum/filmmaking/hard-soft-comparison.jpg'],
      estimatedHours: 8,
      difficulty: 'beginner',
      category: 'lighting',
      subcategory: 'fundamentals',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'The Four Properties of Light',
        'Hard vs Soft Light Explained',
        'Color Temperature in Video',
      ],
    },
    {
      level: 3,
      moduleNumber: '3.1',
      assignmentNumber: 'FM-3.1.2',
      orderIndex: 20,
      title: 'Three-Point Lighting Setup',
      description: 'Master the foundational three-point lighting setup: key light, fill light, and back light for professional subject lighting.',
      instructions: `1. Study three-point lighting: Key (main), fill (shadows), back (separation)
2. Learn key light placement: 30-45° from camera, above subject eye level
3. Practice fill light: Opposite key, fills shadows, ratio controls contrast
4. Study back light: Behind subject, creates rim light, separation from background
5. Learn lighting ratios: 2:1 (low contrast) to 8:1 (high contrast)
6. Practice high-key lighting: Bright, low contrast, minimal shadows
7. Study low-key lighting: Dark, high contrast, dramatic shadows
8. Learn modifiers: Softboxes, umbrellas, diffusion for each light
9. Practice variations: Moving lights, changing ratios, different moods
10. Set up and document complete three-point lighting setup`,
      objectives: [
        'Set up proper three-point lighting',
        'Position key light for optimal subject lighting',
        'Use fill light to control contrast',
        'Add back light for separation',
        'Control lighting ratios',
        'Create high-key and low-key looks',
      ],
      skills: ['Three-point lighting', 'Key light', 'Fill light', 'Back light', 'Lighting ratios', 'High/low-key lighting'],
      expectedOutcome: 'Complete three-point lighting setup documented with diagrams, showing key/fill/back positions, lighting ratios, and resulting image quality.',
      passingCriteria: 'Lights properly positioned, appropriate ratios maintained, subject well-lit, separation from background achieved, mood controlled',
      referencePhotos: ['/curriculum/filmmaking/three-point-diagram.jpg', '/curriculum/filmmaking/lighting-ratios.jpg'],
      estimatedHours: 9,
      difficulty: 'intermediate',
      category: 'lighting',
      subcategory: 'portrait',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Three-Point Lighting Explained',
        'Understanding Lighting Ratios',
        'High-Key vs Low-Key Lighting',
      ],
      crossReferences: ['FM-3.1.1'],
      prerequisiteIds: ['FM-3.1.1'],
    },
    {
      level: 3,
      moduleNumber: '3.1',
      assignmentNumber: 'FM-3.1.3',
      orderIndex: 21,
      title: 'Natural Light Techniques - Window Light',
      description: 'Master working with natural window light, controlling and modifying it for beautiful, soft lighting without artificial sources.',
      instructions: `1. Study window light direction: North (consistent), East/West (changing), South (bright)
2. Learn time of day: Morning (cool), midday (harsh), afternoon (warm), golden hour
3. Practice diffusion: Sheer curtains, diffusion fabric, white shower curtain
4. Study negative fill: Black fabric to deepen shadows, increase contrast
5. Learn bounce/fill: White card, foam core, reflector to fill shadows
6. Practice window as key: Subject near window, various angles
7. Study window as back light: Silhouette, rim light, exposure for highlights
8. Learn window as side light: Dramatic shadows, texture revelation
9. Practice mixed natural/artificial: Balancing window with indoor lights
10. Film subject using only window light in 5+ setups`,
      objectives: [
        'Use window light as main source',
        'Modify natural light with diffusion',
        'Control contrast with negative fill',
        'Bounce light to fill shadows',
        'Position subject relative to window',
        'Balance window light with artificial',
      ],
      skills: ['Window light', 'Natural lighting', 'Light modification', 'Bounce/fill', 'Negative fill', 'Light balancing'],
      expectedOutcome: 'Series of shots showing subject lit exclusively by window light: direct, diffused, bounced, negative fill, various positions and times.',
      passingCriteria: 'Window light properly controlled, skin tones natural, exposure correct, diffusion/bounce/negative fill used effectively, variety demonstrated',
      referencePhotos: ['/curriculum/filmmaking/window-light-setups.jpg', '/curriculum/filmmaking/natural-light-portraits.jpg'],
      estimatedHours: 8,
      difficulty: 'intermediate',
      category: 'lighting',
      subcategory: 'natural',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Working with Window Light',
        'Natural Light for Video',
        'Modifying Sunlight',
      ],
      crossReferences: ['FM-3.1.1'],
    },
    {
      level: 3,
      moduleNumber: '3.2',
      assignmentNumber: 'FM-3.2.1',
      orderIndex: 22,
      title: 'LED Panel Lights & Light Modifiers',
      description: 'Learn to use LED panel lights with various modifiers (softboxes, grids, gels) for controlled, professional lighting.',
      instructions: `1. Study LED panels: Bi-color vs fixed, CRI/TLCI ratings for color accuracy
2. Learn power options: AC power, battery powered, USB-C, V-mount
3. Practice color temperature control: 3200K-5600K adjustment, matching ambient
4. Study light modifiers: Softboxes, diffusion panels, egg crate grids
5. Learn color gels: CTB (warming), CTO (cooling), creative colors
6. Practice barn doors: Controlling spill, shaping light direction
7. Study grid attachments: Focusing light, preventing spill
8. Learn dimming: Flicker-free dimming, maintaining color temperature
9. Practice multiple LED setup: Key, fill, back, practical lights
10. Create LED lighting setup guide with modifiers`,
      objectives: [
        'Operate LED panels effectively',
        'Adjust color temperature for consistency',
        'Use modifiers to shape light',
        'Apply gels for color effects',
        'Control light spill with grids/barn doors',
        'Build multi-light LED setup',
      ],
      skills: ['LED panels', 'Light modifiers', 'Color temperature control', 'Gels', 'Light shaping', 'Multi-light setup'],
      expectedOutcome: 'LED lighting guide showing various modifier setups: bare panel, softbox, grid, gels, barn doors, and complete multi-light configurations.',
      passingCriteria: 'LEDs properly configured, color temperature accurate, modifiers improve light quality, gels used effectively, multi-light setup balanced',
      referencePhotos: ['/curriculum/filmmaking/led-panels.jpg', '/curriculum/filmmaking/light-modifiers.jpg'],
      estimatedHours: 7,
      difficulty: 'intermediate',
      category: 'lighting',
      subcategory: 'equipment',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'LED Lighting for Video',
        'Understanding CRI and TLCI',
        'Light Modifiers Guide',
      ],
      crossReferences: ['FM-3.1.2'],
    },
    {
      level: 3,
      moduleNumber: '3.2',
      assignmentNumber: 'FM-3.2.2',
      orderIndex: 23,
      title: 'Product Lighting - Small Objects',
      description: 'Master lighting techniques for small products and craft items to showcase detail, texture, and eliminate unwanted reflections.',
      instructions: `1. Study product lighting goals: Detail, texture, dimension, accurate color
2. Learn overhead lighting: Tabletop setup, diffused overhead key
3. Practice sweep backgrounds: Seamless paper, fabric, creating infinity curve
4. Study tent lighting: Diffusion tent for even, shadow-free lighting
5. Learn accent lighting: Rim light, hair light for separation and dimension
6. Practice reflection control: Polarizing filters, light positioning, black wrap
7. Study texture enhancement: Side light to reveal surface details
8. Learn white balance for products: Accurate color critical for e-commerce
9. Practice turntable lighting: Consistent lighting for 360° product views
10. Light and photograph 5 different craft products`,
      objectives: [
        'Light small products professionally',
        'Create even, shadow-free lighting',
        'Enhance texture and detail',
        'Control unwanted reflections',
        'Use sweep backgrounds effectively',
        'Achieve accurate color reproduction',
      ],
      skills: ['Product lighting', 'Tabletop setup', 'Reflection control', 'Texture lighting', 'Sweep backgrounds', 'Color accuracy'],
      expectedOutcome: 'Portfolio of 5 craft products professionally lit: proper exposure, accurate color, texture visible, reflections controlled, clean backgrounds.',
      passingCriteria: 'Products well-lit with good detail, colors accurate, reflections controlled, backgrounds clean, texture enhanced, professional quality',
      referencePhotos: ['/curriculum/filmmaking/product-lighting-setup.jpg', '/curriculum/filmmaking/product-examples.jpg'],
      estimatedHours: 9,
      difficulty: 'intermediate',
      category: 'lighting',
      subcategory: 'product',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Product Photography Lighting',
        'Controlling Reflections',
        'Tabletop Lighting Techniques',
      ],
      crossReferences: ['FM-3.1.1', 'FM-3.2.1'],
    },
    {
      level: 3,
      moduleNumber: '3.2',
      assignmentNumber: 'FM-3.2.3',
      orderIndex: 24,
      title: 'Practical Lights & Motivated Lighting',
      description: 'Learn to use practical lights (visible light sources in frame) and create motivated lighting that appears natural and realistic.',
      instructions: `1. Study practical lights: Lamps, candles, screens, signs as light sources
2. Learn motivated lighting: Light appears to come from visible source
3. Practice enhancing practicals: Adding hidden lights to boost practicals
4. Study color matching: Matching artificial lights to practical color
5. Learn dimming practicals: Controlling brightness of in-frame lights
6. Practice screen light: TV/monitor as light source, flicker simulation
7. Study window motivation: Lights positioned to appear as window light
8. Learn fire/candle lighting: Warm, flickering light simulation
9. Practice mixed practicals: Combining multiple practical sources
10. Light scene using only motivated/practical lighting`,
      objectives: [
        'Use practical lights effectively',
        'Create motivated lighting that appears natural',
        'Enhance practicals without revealing technique',
        'Match color of artificial lights to practicals',
        'Simulate various practical light sources',
        'Build realistic lighting scenarios',
      ],
      skills: ['Practical lighting', 'Motivated lighting', 'Light enhancement', 'Color matching', 'Realistic lighting'],
      expectedOutcome: 'Scene lit entirely with motivated/practical lighting: lamps, windows, screens, candles, all appearing natural and realistic.',
      passingCriteria: 'Lighting appears motivated and natural, practicals properly enhanced, colors matched, no obvious artificial sources visible, realistic atmosphere',
      referencePhotos: ['/curriculum/filmmaking/practical-lights.jpg', '/curriculum/filmmaking/motivated-lighting.jpg'],
      estimatedHours: 8,
      difficulty: 'advanced',
      category: 'lighting',
      subcategory: 'narrative',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Practical Lighting in Film',
        'Creating Motivated Light',
        'Enhancing Practicals',
      ],
      crossReferences: ['FM-3.1.2', 'FM-3.2.1'],
    },
    {
      level: 3,
      moduleNumber: '3.3',
      assignmentNumber: 'FM-3.3.1',
      orderIndex: 25,
      title: 'Workshop & Studio Lighting for Craft Videos',
      description: 'Design permanent lighting setup for workshop/studio to consistently film craft demonstrations with professional quality.',
      instructions: `1. Study workshop lighting needs: Overhead work light, subject light, background light
2. Learn overhead camera lighting: Directly above work surface, shadowless
3. Practice background lighting: Separating subject from background, even illumination
4. Study color consistency: All lights same temperature, proper white balance
5. Learn key light for presenter: Flattering face lighting while showing work
6. Practice fill light: Reducing shadows in work area and on presenter
7. Study practical challenges: Hands casting shadows, reflective materials
8. Learn permanent mounting: Ceiling mount, C-stands, boom arms
9. Practice lighting for multiple angles: Front camera, overhead camera, side angles
10. Design and install complete workshop lighting system`,
      objectives: [
        'Design permanent studio lighting',
        'Light work surface without shadows',
        'Light presenter flatteringly',
        'Maintain color consistency',
        'Solve practical craft lighting challenges',
        'Create multi-angle lighting setup',
      ],
      skills: ['Studio design', 'Workshop lighting', 'Overhead lighting', 'Multi-angle setup', 'Permanent installation'],
      expectedOutcome: 'Complete workshop lighting system installed and documented: diagrams, equipment list, settings, test footage from multiple angles.',
      passingCriteria: 'Work surface evenly lit, presenter well-lit, shadows minimized, color consistent, lighting works for multiple camera angles, professional quality',
      referencePhotos: ['/curriculum/filmmaking/workshop-lighting.jpg', '/curriculum/filmmaking/overhead-setup.jpg'],
      estimatedHours: 10,
      difficulty: 'advanced',
      category: 'lighting',
      subcategory: 'studio',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Workshop Lighting Design',
        'Overhead Lighting for Crafts',
        'Studio Lighting Installation',
      ],
      crossReferences: ['FM-3.1.2', 'FM-3.2.1', 'FM-3.2.2'],
      prerequisiteIds: ['FM-3.1.2', 'FM-3.2.1'],
    },
    {
      level: 3,
      moduleNumber: '3.3',
      assignmentNumber: 'FM-3.3.2',
      orderIndex: 26,
      title: 'Outdoor Lighting & Sun Control',
      description: 'Master working with sunlight outdoors: using reflectors, diffusion, negative fill, and timing for best natural light.',
      instructions: `1. Study sun positions: Golden hour (warm, soft), midday (harsh, overhead), blue hour
2. Learn open shade: Placing subject in shade for even, soft light
3. Practice reflectors: Silver (bright), gold (warm), white (soft fill)
4. Study diffusion outdoors: Large scrims, shoot-through umbrellas, overhead diffusion
5. Learn negative fill: Reducing bounce from ground/surroundings, deepening shadows
6. Practice backlighting: Sun behind subject, exposing for face, using fill
7. Study mixed sun/shade: Balancing exposure between bright and dark areas
8. Learn wind challenges: Securing equipment, minimizing movement
9. Practice timing: Scheduling outdoor shoots for optimal light
10. Film outdoor craft demonstration using natural light control`,
      objectives: [
        'Work effectively with sunlight',
        'Use reflectors for fill light',
        'Diffuse harsh sunlight',
        'Time shoots for best natural light',
        'Balance mixed lighting conditions',
        'Secure equipment outdoors',
      ],
      skills: ['Outdoor lighting', 'Sun control', 'Reflectors', 'Diffusion', 'Backlighting', 'Natural light timing'],
      expectedOutcome: 'Outdoor craft demonstration filmed with controlled natural light: reflectors, diffusion, proper timing, balanced exposure.',
      passingCriteria: 'Sunlight properly controlled, skin tones natural, harsh shadows diffused/filled, exposure balanced, timing appropriate, equipment secure',
      referencePhotos: ['/curriculum/filmmaking/outdoor-lighting.jpg', '/curriculum/filmmaking/reflector-techniques.jpg'],
      estimatedHours: 8,
      difficulty: 'intermediate',
      category: 'lighting',
      subcategory: 'outdoor',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Outdoor Lighting Techniques',
        'Working with Reflectors',
        'Golden Hour Filming',
      ],
      crossReferences: ['FM-3.1.3'],
    },
    {
      level: 3,
      moduleNumber: '3.3',
      assignmentNumber: 'FM-3.3.3',
      orderIndex: 27,
      title: 'Professional Lighting Project',
      description: 'Apply all Level 3 lighting skills to create a completely lit craft video demonstrating professional lighting techniques.',
      instructions: `1. Choose craft project: Select demonstration requiring various lighting setups
2. Design lighting plan: Diagram all light positions, modifiers, power
3. Set up studio lighting: Key, fill, back, background, work surface
4. Light for multiple angles: Ensure lighting works for all camera positions
5. Balance all sources: Consistent color temperature, proper ratios
6. Light product shots: Small objects, detail shots, texture enhancement
7. Control reflections: Manage shiny surfaces, glass, metals
8. Ensure color accuracy: Proper white balance, accurate product colors
9. Create consistent look: All shots match in lighting quality and mood
10. Film complete project with professional lighting throughout`,
      objectives: [
        'Design comprehensive lighting plan',
        'Execute professional multi-light setup',
        'Maintain consistency across all shots',
        'Solve practical lighting challenges',
        'Achieve broadcast-quality lighting',
        'Demonstrate mastery of all lighting techniques',
      ],
      skills: ['Lighting design', 'Professional execution', 'Multi-light setup', 'Problem solving', 'Quality control'],
      expectedOutcome: 'Complete craft video (5-10 min) professionally lit throughout: lighting diagrams, all techniques applied, consistent quality, broadcast-ready.',
      passingCriteria: 'Lighting is professional quality, consistent throughout, appropriate for content, challenges solved, colors accurate, technical execution flawless',
      referencePhotos: ['/curriculum/filmmaking/professional-lighting-project.jpg'],
      estimatedHours: 14,
      difficulty: 'advanced',
      category: 'projects',
      subcategory: 'lighting_project',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Professional Lighting Workflow',
        'Lighting for Educational Video',
      ],
      crossReferences: ['FM-3.1.2', 'FM-3.2.1', 'FM-3.2.2', 'FM-3.3.1'],
      prerequisiteIds: ['FM-3.1.2', 'FM-3.2.1', 'FM-3.3.1'],
    },

    // ========================================================================
    // LEVEL 4: AUDIO - Sound Recording & Design
    // ========================================================================
    {
      level: 4,
      moduleNumber: '4.1',
      assignmentNumber: 'FM-4.1.1',
      orderIndex: 28,
      title: 'Audio Fundamentals - Frequency, Amplitude, & Waveforms',
      description: 'Understand basic audio concepts including frequency (pitch), amplitude (volume), waveforms, and how sound is recorded digitally.',
      instructions: `1. Study frequency: Measured in Hz, low (bass) to high (treble), human hearing 20Hz-20kHz
2. Learn amplitude: Volume/loudness measured in dB, dynamic range
3. Practice reading waveforms: Visual representation of audio, peaks and valleys
4. Study sample rate: 48kHz standard for video, bit depth 16-bit vs 24-bit
5. Learn mono vs stereo: Single channel vs left/right channels
6. Practice audio metering: Peak levels, average levels, -12dB to -6dB target
7. Study clipping: Distortion from too-loud signal, preventing peaks above 0dB
8. Learn noise floor: Background noise level, signal-to-noise ratio
9. Practice monitoring: Headphones vs speakers, accurate listening environment
10. Record and analyze various audio samples`,
      objectives: [
        'Understand frequency and amplitude',
        'Read audio waveforms',
        'Set proper recording levels',
        'Prevent clipping and distortion',
        'Recognize good vs bad audio quality',
        'Use audio meters effectively',
      ],
      skills: ['Audio fundamentals', 'Waveform reading', 'Level setting', 'Audio metering', 'Quality assessment'],
      expectedOutcome: 'Audio analysis document showing various recordings with waveforms, levels, frequency content, and quality assessment notes.',
      passingCriteria: 'Demonstrates understanding of audio concepts, recordings are properly leveled without clipping, analysis accurate, quality differences identified',
      referencePhotos: ['/curriculum/filmmaking/audio-waveforms.jpg', '/curriculum/filmmaking/audio-meters.jpg'],
      estimatedHours: 7,
      difficulty: 'beginner',
      category: 'audio',
      subcategory: 'fundamentals',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Audio Basics for Video',
        'Understanding Audio Waveforms',
        'Recording Levels and Metering',
      ],
    },
    {
      level: 4,
      moduleNumber: '4.1',
      assignmentNumber: 'FM-4.1.2',
      orderIndex: 29,
      title: 'Microphone Types & Polar Patterns',
      description: 'Learn different microphone types (dynamic, condenser, lavalier, shotgun) and polar patterns (omni, cardioid, supercardioid) for various situations.',
      instructions: `1. Study dynamic microphones: Rugged, loud sources, less sensitive
2. Learn condenser microphones: Sensitive, detailed, requires phantom power
3. Practice lavalier/lav mics: Clip-on, close to mouth, consistent level
4. Study shotgun microphones: Directional, boom-mounted, dialogue
5. Learn omnidirectional pattern: Picks up sound equally from all directions
6. Practice cardioid pattern: Front-focused, rejects rear sound
7. Study supercardioid/hypercardioid: Very directional, narrow pickup
8. Learn proximity effect: Bass boost when close to mic
9. Practice mic selection: Choosing right mic for each scenario
10. Test each mic type and pattern with recordings`,
      objectives: [
        'Identify microphone types',
        'Understand polar patterns',
        'Choose appropriate mic for situation',
        'Position mics effectively',
        'Understand proximity effect',
        'Achieve optimal audio capture',
      ],
      skills: ['Microphone types', 'Polar patterns', 'Mic selection', 'Mic positioning', 'Audio capture'],
      expectedOutcome: 'Mic comparison recordings testing each type and pattern: dynamic, condenser, lav, shotgun, omni, cardioid, supercardioid.',
      passingCriteria: 'All mic types tested, polar patterns demonstrated, appropriate selection for scenarios, positioning correct, quality differences understood',
      referencePhotos: ['/curriculum/filmmaking/microphone-types.jpg', '/curriculum/filmmaking/polar-patterns.jpg'],
      estimatedHours: 8,
      difficulty: 'intermediate',
      category: 'audio',
      subcategory: 'microphones',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Microphone Types Explained',
        'Understanding Polar Patterns',
        'Mic Selection for Video',
      ],
    },
    {
      level: 4,
      moduleNumber: '4.1',
      assignmentNumber: 'FM-4.1.3',
      orderIndex: 30,
      title: 'Recording Equipment - Recorders & Interfaces',
      description: 'Learn to use portable audio recorders, audio interfaces, and proper connections (XLR, TRS, TRRS) for high-quality sound capture.',
      instructions: `1. Study portable recorders: Zoom H5/H6, Tascam, standalone recording
2. Learn audio interfaces: USB connection to computer, phantom power, preamps
3. Practice XLR connections: Balanced, professional, long cable runs
4. Study TRS/TS cables: 1/4" connections, instrument level vs line level
5. Learn TRRS connections: Smartphone microphones, adapter cables
6. Practice phantom power: 48V for condenser mics, when to enable
7. Study preamps: Gain staging, clean amplification, noise reduction
8. Learn dual system sound: Separate recorder synced to camera in post
9. Practice backup recording: Redundant tracks, safety recordings
10. Set up complete recording system and test`,
      objectives: [
        'Operate portable audio recorders',
        'Use audio interfaces with computer',
        'Connect microphones properly',
        'Enable phantom power when needed',
        'Set proper gain levels',
        'Create backup recordings',
      ],
      skills: ['Audio recorders', 'Audio interfaces', 'Cable connections', 'Gain staging', 'Phantom power', 'Dual system'],
      expectedOutcome: 'Complete recording setup documented: equipment, connections, settings, test recordings from various configurations.',
      passingCriteria: 'Equipment properly connected, phantom power used correctly, gain levels appropriate, recordings clean, backup system functional',
      referencePhotos: ['/curriculum/filmmaking/audio-recorder-setup.jpg', '/curriculum/filmmaking/audio-connections.jpg'],
      estimatedHours: 7,
      difficulty: 'intermediate',
      category: 'audio',
      subcategory: 'equipment',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Portable Audio Recorders Guide',
        'Audio Interfaces Explained',
        'XLR vs TRS vs TRRS Connections',
      ],
      crossReferences: ['FM-4.1.2'],
    },
    {
      level: 4,
      moduleNumber: '4.2',
      assignmentNumber: 'FM-4.2.1',
      orderIndex: 31,
      title: 'Voice Recording - Narration & Voiceover',
      description: 'Master recording professional voiceover and narration with proper mic technique, room treatment, and vocal performance.',
      instructions: `1. Study microphone positioning: 6-12" from mouth, pop filter, angle
2. Learn room treatment: Reducing echo, absorbing reflections, DIY solutions
3. Practice vocal warm-ups: Breathing exercises, articulation, projection
4. Study plosives: Managing P, B, T sounds with pop filter and technique
5. Learn consistent distance: Maintaining level by staying same distance from mic
6. Practice inflection: Varying tone, emphasis, pacing for engagement
7. Study recording environment: Quiet space, turning off noise sources
8. Learn punch recording: Re-recording mistakes, maintaining consistency
9. Practice script reading: Natural delivery, conversational tone, clarity
10. Record complete voiceover for 5-minute video`,
      objectives: [
        'Position microphone optimally for voice',
        'Treat recording space for clean audio',
        'Deliver engaging vocal performance',
        'Manage plosives and sibilance',
        'Maintain consistent recording levels',
        'Create professional voiceover recordings',
      ],
      skills: ['Voice recording', 'Mic technique', 'Room treatment', 'Vocal performance', 'Script reading'],
      expectedOutcome: 'Professional voiceover recording for 5-minute video: clean audio, consistent levels, engaging delivery, no technical issues.',
      passingCriteria: 'Audio is clean with minimal background noise, levels consistent, plosives managed, delivery is natural and engaging, technical quality high',
      referencePhotos: ['/curriculum/filmmaking/voiceover-setup.jpg', '/curriculum/filmmaking/room-treatment.jpg'],
      estimatedHours: 8,
      difficulty: 'intermediate',
      category: 'audio',
      subcategory: 'voice',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Recording Professional Voiceover',
        'Microphone Technique for Voice',
        'Home Studio Acoustics',
      ],
      crossReferences: ['FM-4.1.2', 'FM-4.1.3'],
      prerequisiteIds: ['FM-4.1.2'],
    },
    {
      level: 4,
      moduleNumber: '4.2',
      assignmentNumber: 'FM-4.2.2',
      orderIndex: 32,
      title: 'Location Sound - Dialogue & Ambient Recording',
      description: 'Learn to capture clean dialogue and ambient sound on location using boom mics, lavs, and proper monitoring.',
      instructions: `1. Study boom mic technique: Overhead, just out of frame, following speaker
2. Learn lavalier placement: Sternum area, hiding under clothing, managing rustle
3. Practice monitoring: Headphones, listening for issues during recording
4. Study wind protection: Windscreens, dead cats, blimp systems
5. Learn ambient sound recording: Room tone, environmental sounds, wild sound
6. Practice noise reduction: Identifying and minimizing unwanted sounds
7. Study acoustics: Reflective vs absorptive surfaces, room resonances
8. Learn multichannel recording: Boom + lavs, backup tracks, mixer operation
9. Practice sync sound: Clapper, hand clap, post-sync methods
10. Record location dialogue scene with clean audio`,
      objectives: [
        'Operate boom microphone effectively',
        'Place and hide lavalier microphones',
        'Monitor audio during recording',
        'Protect mics from wind',
        'Record room tone and ambience',
        'Minimize location noise issues',
      ],
      skills: ['Boom operation', 'Lavalier placement', 'Location recording', 'Wind protection', 'Audio monitoring', 'Ambient recording'],
      expectedOutcome: 'Location dialogue recording with clean audio: boom mic, lavs, room tone, proper monitoring, issues resolved.',
      passingCriteria: 'Dialogue is clear and intelligible, background noise minimized, lavs hidden and rustle-free, boom out of frame, room tone recorded',
      referencePhotos: ['/curriculum/filmmaking/boom-technique.jpg', '/curriculum/filmmaking/lav-placement.jpg'],
      estimatedHours: 9,
      difficulty: 'advanced',
      category: 'audio',
      subcategory: 'location',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Location Sound Recording',
        'Boom Mic Techniques',
        'Lavalier Microphone Guide',
      ],
      crossReferences: ['FM-4.1.2', 'FM-4.1.3'],
      prerequisiteIds: ['FM-4.1.2'],
    },
    {
      level: 4,
      moduleNumber: '4.2',
      assignmentNumber: 'FM-4.2.3',
      orderIndex: 33,
      title: 'Audio Editing Basics - Cleaning & Processing',
      description: 'Learn fundamental audio editing in DaVinci Resolve or Audacity: noise reduction, EQ, compression, normalization.',
      instructions: `1. Study audio workspace: Timeline, waveforms, mixer, effects
2. Learn noise reduction: Identifying noise floor, reducing hum/hiss
3. Practice EQ (equalization): Removing rumble, enhancing clarity, fixing issues
4. Study compression: Reducing dynamic range, consistent levels
5. Learn normalization: Setting peak levels, loudness standards
6. Practice de-essing: Reducing harsh S sounds
7. Study fade in/out: Smooth starts and ends, cross-fades
8. Learn audio repair: Removing clicks, pops, breaths
9. Practice mixing levels: Balancing voice, music, effects
10. Clean and process raw voiceover recording`,
      objectives: [
        'Navigate audio editing software',
        'Reduce background noise',
        'Apply EQ to improve clarity',
        'Use compression for consistent levels',
        'Normalize audio to proper levels',
        'Create professional-sounding audio',
      ],
      skills: ['Audio editing', 'Noise reduction', 'EQ', 'Compression', 'Normalization', 'Audio repair'],
      expectedOutcome: 'Processed audio files showing before/after: noise reduction, EQ, compression, normalization applied to voiceover recording.',
      passingCriteria: 'Noise significantly reduced, EQ improves clarity without artifacts, compression evens levels, normalization to broadcast standards, professional quality',
      referencePhotos: ['/curriculum/filmmaking/audio-editing-interface.jpg', '/curriculum/filmmaking/audio-processing.jpg'],
      estimatedHours: 8,
      difficulty: 'intermediate',
      category: 'audio',
      subcategory: 'editing',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Audio Editing for Video',
        'Noise Reduction Techniques',
        'EQ and Compression Basics',
      ],
      crossReferences: ['FM-4.2.1'],
    },
    {
      level: 4,
      moduleNumber: '4.3',
      assignmentNumber: 'FM-4.3.1',
      orderIndex: 34,
      title: 'Music & Sound Effects for Video',
      description: 'Learn to select, edit, and mix music and sound effects to enhance your video without overwhelming the main audio.',
      instructions: `1. Study royalty-free music: YouTube Audio Library, Epidemic Sound, licensing
2. Learn music selection: Matching mood, energy, pacing to video
3. Practice music editing: Cutting to length, matching to edits, transitions
4. Study mixing levels: Music at -18dB to -22dB under dialogue
5. Learn ducking: Automatically lowering music when dialogue present
6. Practice sound effects: Adding natural sounds, Foley, ambient layers
7. Study sound design: Creating atmosphere, supporting visuals
8. Learn copyright: Creative Commons, stock music, DMCA
9. Practice audio transitions: Fades, crossfades, hard cuts
10. Add complete audio design to video project`,
      objectives: [
        'Select appropriate music for video',
        'Edit music to fit video length',
        'Mix music at proper levels',
        'Duck music under dialogue',
        'Add sound effects appropriately',
        'Understand music licensing',
      ],
      skills: ['Music selection', 'Music editing', 'Audio mixing', 'Ducking', 'Sound effects', 'Licensing'],
      expectedOutcome: 'Video project with complete audio design: music, sound effects, proper mixing, ducking, all elements balanced.',
      passingCriteria: 'Music complements video mood, levels proper relative to dialogue, ducking smooth, sound effects enhance realism, no copyright issues',
      referencePhotos: ['/curriculum/filmmaking/audio-mixing.jpg', '/curriculum/filmmaking/music-ducking.jpg'],
      estimatedHours: 7,
      difficulty: 'intermediate',
      category: 'audio',
      subcategory: 'music',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Music for Video Production',
        'Audio Mixing Fundamentals',
        'Royalty-Free Music Guide',
      ],
      crossReferences: ['FM-4.2.3'],
    },
    {
      level: 4,
      moduleNumber: '4.3',
      assignmentNumber: 'FM-4.3.2',
      orderIndex: 35,
      title: 'Audio Synchronization & Multi-track Mixing',
      description: 'Master syncing external audio to video, managing multiple audio tracks, and creating professional mixes with proper levels.',
      instructions: `1. Study sync methods: Clapper slate, hand clap, PluralEyes, waveform matching
2. Learn manual sync: Matching audio waveforms in timeline
3. Practice multi-track organization: Voice, music, effects, ambience separate
4. Study mixing workflow: Solo, mute, level adjustment, panning
5. Learn stereo field: Panning, width, creating space
6. Practice audio groups: Submix, group processing, efficiency
7. Study final mix levels: -3dB to -6dB peaks, -16 LUFS integrated loudness
8. Learn export settings: Stereo mix, sample rate, bit depth
9. Practice quality control: Listening on various devices, fixing issues
10. Sync and mix complete multi-track project`,
      objectives: [
        'Sync external audio to video',
        'Organize multi-track audio session',
        'Mix multiple audio elements',
        'Use stereo field effectively',
        'Achieve broadcast-standard levels',
        'Export properly formatted audio',
      ],
      skills: ['Audio sync', 'Multi-track mixing', 'Level balancing', 'Stereo mixing', 'Export settings', 'Quality control'],
      expectedOutcome: 'Complete video with synced external audio, multi-track mix (voice, music, effects, ambience), broadcast-standard levels.',
      passingCriteria: 'Audio perfectly synced, all tracks balanced, proper use of stereo field, levels meet broadcast standards, export settings correct',
      referencePhotos: ['/curriculum/filmmaking/multi-track-session.jpg', '/curriculum/filmmaking/audio-levels.jpg'],
      estimatedHours: 9,
      difficulty: 'advanced',
      category: 'audio',
      subcategory: 'mixing',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Audio Synchronization Methods',
        'Multi-track Mixing for Video',
        'Broadcast Audio Standards',
      ],
      crossReferences: ['FM-4.2.2', 'FM-4.2.3', 'FM-4.3.1'],
      prerequisiteIds: ['FM-4.2.3'],
    },
    {
      level: 4,
      moduleNumber: '4.3',
      assignmentNumber: 'FM-4.3.3',
      orderIndex: 36,
      title: 'Professional Audio Project',
      description: 'Apply all Level 4 audio skills to create a craft video with professional audio: voiceover, location sound, music, and effects.',
      instructions: `1. Plan audio needs: Voiceover script, location sound, music, effects
2. Record voiceover: Clean, professional narration in treated space
3. Capture location sound: Craft demonstration with clear audio
4. Record room tone: Ambient sound for editing flexibility
5. Edit and clean audio: Noise reduction, EQ, compression on all tracks
6. Add music: Select appropriate track, edit to length, proper levels
7. Add sound effects: Enhance craft sounds, create atmosphere
8. Sync all audio: Align external recordings to video
9. Mix final audio: Balance all elements, proper levels, stereo field
10. Export with broadcast-standard audio`,
      objectives: [
        'Plan complete audio production',
        'Record all audio elements professionally',
        'Process and clean all recordings',
        'Create comprehensive multi-track mix',
        'Meet broadcast audio standards',
        'Deliver professional-quality audio',
      ],
      skills: ['Audio production', 'Recording', 'Editing', 'Mixing', 'Quality standards', 'Complete workflow'],
      expectedOutcome: '5-10 minute craft video with professional audio: clean voiceover, location sound, music, effects, perfect sync, broadcast-standard mix.',
      passingCriteria: 'All audio professionally recorded and processed, multi-track mix balanced, levels meet standards, no technical issues, broadcast-ready',
      referencePhotos: ['/curriculum/filmmaking/professional-audio-project.jpg'],
      estimatedHours: 14,
      difficulty: 'advanced',
      category: 'projects',
      subcategory: 'audio_project',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Professional Audio Workflow',
        'Audio for Educational Video',
      ],
      crossReferences: ['FM-4.2.1', 'FM-4.2.2', 'FM-4.2.3', 'FM-4.3.1', 'FM-4.3.2'],
      prerequisiteIds: ['FM-4.2.1', 'FM-4.2.3', 'FM-4.3.2'],
    },

    // ========================================================================
    // LEVEL 5: DAVINCI RESOLVE - Video Editing
    // ========================================================================
    {
      level: 5,
      moduleNumber: '5.1',
      assignmentNumber: 'FM-5.1.1',
      orderIndex: 37,
      title: 'DaVinci Resolve Interface & Project Setup',
      description: 'Learn to navigate DaVinci Resolve interface, create projects, import media, and organize bins for efficient editing.',
      instructions: `1. Study Resolve interface: Media, Cut, Edit, Fusion, Color, Fairlight, Deliver pages
2. Learn project creation: Resolution, frame rate, color space settings
3. Practice media import: Video, audio, images, organizing source files
4. Study bin organization: Creating folders, smart bins, sorting media
5. Learn media management: Linking files, relinking, consolidating
6. Practice proxy workflow: Generating proxies for smooth editing
7. Study timeline creation: Resolution, frame rate matching source
8. Learn keyboard shortcuts: J-K-L playback, I-O marks, essential keys
9. Practice preferences: Auto-save, cache, optimized media settings
10. Set up complete project structure for craft video`,
      objectives: [
        'Navigate Resolve interface confidently',
        'Create properly configured projects',
        'Import and organize media efficiently',
        'Use bins for organization',
        'Generate proxies for performance',
        'Employ keyboard shortcuts for speed',
      ],
      skills: ['Resolve interface', 'Project setup', 'Media management', 'Bin organization', 'Proxy workflow', 'Shortcuts'],
      expectedOutcome: 'Organized Resolve project with imported media, bin structure, proxies generated, timeline created, ready for editing.',
      passingCriteria: 'Project properly configured, media imported and organized, bins logical, proxies working, shortcuts used, efficient setup',
      referencePhotos: ['/curriculum/filmmaking/resolve-interface.jpg', '/curriculum/filmmaking/bin-organization.jpg'],
      estimatedHours: 7,
      difficulty: 'beginner',
      category: 'editing',
      subcategory: 'resolve_basics',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'DaVinci Resolve for Beginners',
        'Resolve Project Setup Guide',
        'Media Management in Resolve',
      ],
    },
    {
      level: 5,
      moduleNumber: '5.1',
      assignmentNumber: 'FM-5.1.2',
      orderIndex: 38,
      title: 'Basic Editing - Cuts, Trims, & Timeline Management',
      description: 'Master fundamental editing techniques: making cuts, trimming clips, arranging timeline, and creating rough assembly.',
      instructions: `1. Study three-point editing: In/out points, insert vs overwrite
2. Learn blade tool: Cutting clips, razor tool, split at playhead
3. Practice trim modes: Ripple, roll, slip, slide editing
4. Study timeline tracks: Video layers, audio tracks, disabling/locking
5. Learn selection tools: Range, track selection, selecting linked clips
6. Practice clip arrangement: Moving, deleting, inserting, gaps
7. Study ripple delete: Removing clips without leaving gaps
8. Learn linked selection: Video/audio together or separate
9. Practice rough cut assembly: Building story from raw footage
10. Create rough cut of 3-minute craft video`,
      objectives: [
        'Make precise cuts in timeline',
        'Trim clips efficiently',
        'Manage multiple timeline tracks',
        'Arrange clips to tell story',
        'Create rough cut assembly',
        'Work efficiently with editing tools',
      ],
      skills: ['Cutting', 'Trimming', 'Timeline management', 'Clip arrangement', 'Rough cutting', 'Tool proficiency'],
      expectedOutcome: 'Rough cut of 3-minute craft video: story assembled, clips trimmed, proper pacing, ready for refinement.',
      passingCriteria: 'Cuts are intentional, trimming precise, timeline organized, story flows logically, pacing appropriate, no gaps',
      referencePhotos: ['/curriculum/filmmaking/editing-tools.jpg', '/curriculum/filmmaking/timeline-editing.jpg'],
      estimatedHours: 8,
      difficulty: 'beginner',
      category: 'editing',
      subcategory: 'basic_editing',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Basic Video Editing Techniques',
        'Timeline Editing in Resolve',
        'Rough Cut to Fine Cut',
      ],
      crossReferences: ['FM-5.1.1'],
      prerequisiteIds: ['FM-5.1.1'],
    },
    {
      level: 5,
      moduleNumber: '5.1',
      assignmentNumber: 'FM-5.1.3',
      orderIndex: 39,
      title: 'Pacing, Rhythm & Story Structure',
      description: 'Learn to control video pacing through editing rhythm, shot duration, and story structure to maintain viewer engagement.',
      instructions: `1. Study story structure: Beginning (hook), middle (development), end (resolution)
2. Learn pacing control: Fast cuts for energy, longer shots for emotion
3. Practice rhythm editing: Cutting to music, action, visual beats
4. Study shot duration: Establishing shots longer, reactions shorter
5. Learn momentum building: Increasing pace toward climax, slowing for resolution
6. Practice tension creation: Withholding information, building anticipation
7. Study J-cuts and L-cuts: Audio/video split for smooth transitions
8. Learn montage pacing: Multiple shots building to conclusion
9. Practice engagement maintenance: Variety, surprises, visual interest
10. Re-edit rough cut with focus on pacing and rhythm`,
      objectives: [
        'Control pacing through editing',
        'Create engaging rhythm',
        'Structure story effectively',
        'Build momentum and tension',
        'Use J-cuts and L-cuts',
        'Maintain viewer engagement',
      ],
      skills: ['Pacing', 'Rhythm', 'Story structure', 'Momentum', 'J-cuts/L-cuts', 'Engagement'],
      expectedOutcome: 'Refined edit of craft video with intentional pacing, rhythm, story structure, J/L-cuts, and sustained engagement.',
      passingCriteria: 'Pacing is appropriate and varied, rhythm creates energy, story structure clear, momentum builds, J/L-cuts smooth, viewers engaged',
      referencePhotos: ['/curriculum/filmmaking/pacing-timeline.jpg', '/curriculum/filmmaking/story-structure.jpg'],
      estimatedHours: 9,
      difficulty: 'intermediate',
      category: 'editing',
      subcategory: 'pacing',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Pacing in Film Editing',
        'Story Structure for Video',
        'J-Cuts and L-Cuts Explained',
      ],
      crossReferences: ['FM-5.1.2'],
      prerequisiteIds: ['FM-5.1.2'],
    },
    {
      level: 5,
      moduleNumber: '5.2',
      assignmentNumber: 'FM-5.2.1',
      orderIndex: 40,
      title: 'Transitions - Cuts, Dissolves, & Creative Transitions',
      description: 'Master video transitions from simple cuts to dissolves, wipes, and creative transitions appropriate for educational content.',
      instructions: `1. Study straight cut: Most common, invisible, maintains energy
2. Learn dissolve/cross-fade: Passage of time, mood change, softening
3. Practice fade to/from black: Scene breaks, chapter transitions
4. Study dip to color: Similar to fade, using white or other colors
5. Learn wipe transitions: Directional, retro feel, appropriate uses
6. Practice speed changes: Ramps, slow motion integration
7. Study whip pan transition: Fast camera movement between shots
8. Learn zoom transitions: Matching zoom in/out between clips
9. Practice creative transitions: Match cuts, morphing, inventive connects
10. Create transition showcase video`,
      objectives: [
        'Use straight cuts effectively',
        'Apply dissolves appropriately',
        'Employ fades for scene breaks',
        'Use creative transitions sparingly',
        'Match transitions to content tone',
        'Maintain professional quality',
      ],
      skills: ['Transitions', 'Cuts', 'Dissolves', 'Fades', 'Creative transitions', 'Transition timing'],
      expectedOutcome: 'Video showcasing various transitions used appropriately: cuts, dissolves, fades, wipes, creative transitions with context.',
      passingCriteria: 'Transitions enhance rather than distract, timing is appropriate, creative transitions used sparingly, professional execution',
      referencePhotos: ['/curriculum/filmmaking/transition-types.jpg', '/curriculum/filmmaking/creative-transitions.jpg'],
      estimatedHours: 7,
      difficulty: 'intermediate',
      category: 'editing',
      subcategory: 'transitions',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Video Transitions Guide',
        'When to Use Dissolves vs Cuts',
        'Creative Transition Techniques',
      ],
      crossReferences: ['FM-5.1.3'],
    },
    {
      level: 5,
      moduleNumber: '5.2',
      assignmentNumber: 'FM-5.2.2',
      orderIndex: 41,
      title: 'Speed Effects - Slow Motion, Time Lapse, Speed Ramping',
      description: 'Learn to manipulate clip speed for creative effect: slow motion, time lapse, freeze frames, and speed ramping.',
      instructions: `1. Study slow motion: Frame rate conversion, optical flow, quality considerations
2. Learn speed change methods: Change speed, retime controls, curves
3. Practice time lapse: Speeding up slow processes, appropriate factor
4. Study freeze frame: Holding moment, adding emphasis
5. Learn speed ramping: Smooth transitions between normal and slow/fast
6. Practice optical flow: Resolving retiming artifacts, frame blending
7. Study reverse speed: Playing clips backward, creative uses
8. Learn time remapping: Variable speed throughout clip
9. Practice appropriate uses: When speed changes enhance vs distract
10. Create video using various speed effects`,
      objectives: [
        'Apply slow motion effectively',
        'Create time lapse sequences',
        'Use freeze frames for emphasis',
        'Execute smooth speed ramps',
        'Understand optical flow retiming',
        'Choose appropriate speed effects',
      ],
      skills: ['Speed effects', 'Slow motion', 'Time lapse', 'Speed ramping', 'Freeze frames', 'Optical flow'],
      expectedOutcome: 'Video demonstrating various speed effects: slow motion, time lapse, freeze frames, speed ramps, all used appropriately.',
      passingCriteria: 'Speed effects are smooth, optical flow artifacts minimal, timing appropriate, effects enhance content, professional quality',
      referencePhotos: ['/curriculum/filmmaking/speed-effects.jpg', '/curriculum/filmmaking/speed-ramping.jpg'],
      estimatedHours: 8,
      difficulty: 'intermediate',
      category: 'editing',
      subcategory: 'effects',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Slow Motion in DaVinci Resolve',
        'Time Remapping and Speed Ramping',
        'Optical Flow Explained',
      ],
      crossReferences: ['FM-5.1.2'],
    },
    {
      level: 5,
      moduleNumber: '5.2',
      assignmentNumber: 'FM-5.2.3',
      orderIndex: 42,
      title: 'Multi-Camera Editing & Syncing',
      description: 'Master multi-camera editing workflow: syncing multiple angles, cutting between cameras, and creating dynamic coverage.',
      instructions: `1. Study multi-cam benefits: Coverage, variety, dynamic editing
2. Learn sync methods: Audio waveform, timecode, markers
3. Practice multi-cam clip creation: Grouping angles, sync point
4. Study multi-cam viewer: Viewing all angles simultaneously
5. Learn angle cutting: Live switching between cameras during playback
6. Practice audio selection: Choosing best audio source per angle
7. Study color matching: Balancing different cameras' looks
8. Learn multi-cam refinement: Adjusting cuts, replacing angles
9. Practice coverage patterns: When to cut, maintaining interest
10. Edit multi-cam craft demonstration`,
      objectives: [
        'Sync multiple camera angles',
        'Create multi-cam clips',
        'Cut between angles dynamically',
        'Choose appropriate moments to switch',
        'Match color between cameras',
        'Create engaging multi-cam edits',
      ],
      skills: ['Multi-cam editing', 'Camera syncing', 'Angle cutting', 'Coverage editing', 'Color matching'],
      expectedOutcome: 'Multi-camera edit of craft demonstration: 2-3 angles synced, dynamic cutting, color matched, engaging coverage.',
      passingCriteria: 'Cameras perfectly synced, angle cuts at appropriate moments, color matched between cameras, coverage dynamic and engaging',
      referencePhotos: ['/curriculum/filmmaking/multicam-interface.jpg', '/curriculum/filmmaking/multicam-editing.jpg'],
      estimatedHours: 9,
      difficulty: 'advanced',
      category: 'editing',
      subcategory: 'multicam',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Multi-Camera Editing in Resolve',
        'Syncing Multiple Cameras',
        'Dynamic Coverage Editing',
      ],
      crossReferences: ['FM-5.1.2'],
    },
    {
      level: 5,
      moduleNumber: '5.3',
      assignmentNumber: 'FM-5.3.1',
      orderIndex: 43,
      title: 'Basic Color Correction - Exposure & White Balance',
      description: 'Learn fundamental color correction: fixing exposure, white balance, and achieving consistent look across clips.',
      instructions: `1. Study color page: Node structure, scopes, color wheels
2. Learn video scopes: Waveform (exposure), vectorscope (color), parade (RGB)
3. Practice exposure correction: Lifting shadows, lowering highlights
4. Study white balance: Neutral greys, removing color casts
5. Learn contrast adjustment: Gamma, pivot, S-curve
6. Practice shot matching: Making clips look consistent
7. Study primary color wheels: Lift (shadows), gamma (mids), gain (highlights)
8. Learn saturation: Adjusting color intensity appropriately
9. Practice skin tone correction: Natural, flattering skin tones
10. Color correct complete video for consistency`,
      objectives: [
        'Navigate color page confidently',
        'Read video scopes accurately',
        'Correct exposure issues',
        'Fix white balance problems',
        'Match shots for consistency',
        'Achieve natural skin tones',
      ],
      skills: ['Color correction', 'Exposure fixing', 'White balance', 'Scopes reading', 'Shot matching', 'Skin tones'],
      expectedOutcome: 'Color-corrected video with consistent exposure, accurate white balance, matched shots, natural skin tones throughout.',
      passingCriteria: 'Exposure properly corrected, white balance neutral, shots match, skin tones natural, scopes show proper levels',
      referencePhotos: ['/curriculum/filmmaking/color-page.jpg', '/curriculum/filmmaking/video-scopes.jpg'],
      estimatedHours: 8,
      difficulty: 'intermediate',
      category: 'editing',
      subcategory: 'color',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Color Correction Basics in Resolve',
        'Reading Video Scopes',
        'Primary Color Correction',
      ],
      crossReferences: ['FM-5.1.1'],
    },
    {
      level: 5,
      moduleNumber: '5.3',
      assignmentNumber: 'FM-5.3.2',
      orderIndex: 44,
      title: 'Export Settings & Delivery Formats',
      description: 'Master export settings for various platforms: YouTube, social media, broadcast, and archival with proper codecs and compression.',
      instructions: `1. Study delivery page: Render settings, codecs, containers
2. Learn YouTube settings: 1080p/4K, H.264/H.265, 20-50Mbps bitrate
3. Practice social media exports: Instagram, Facebook, TikTok specifications
4. Study codec selection: H.264 (compatibility), H.265 (efficiency), ProRes (quality)
5. Learn bitrate: Higher = quality, lower = file size, appropriate balance
6. Practice resolution: 1080p standard, 4K for premium, 720p for web
7. Study audio settings: AAC codec, 320kbps, stereo
8. Learn render queue: Batch exports, multiple formats
9. Practice file naming: Descriptive, organized, versioning
10. Export video in 5 different formats/platforms`,
      objectives: [
        'Choose appropriate export settings',
        'Export for YouTube optimally',
        'Create social media versions',
        'Select proper codecs',
        'Balance quality and file size',
        'Organize exported files',
      ],
      skills: ['Export settings', 'Codec selection', 'Platform optimization', 'Bitrate management', 'Multi-format delivery'],
      expectedOutcome: 'Single video exported in 5 formats: YouTube 4K, YouTube 1080p, Instagram, broadcast quality, archive master.',
      passingCriteria: 'All exports properly configured, quality appropriate for platform, file sizes reasonable, naming organized, ready for upload',
      referencePhotos: ['/curriculum/filmmaking/export-settings.jpg', '/curriculum/filmmaking/platform-specs.jpg'],
      estimatedHours: 6,
      difficulty: 'beginner',
      category: 'editing',
      subcategory: 'delivery',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Export Settings for YouTube',
        'Video Codecs Explained',
        'Delivery Formats Guide',
      ],
      crossReferences: ['FM-5.1.1'],
    },
    {
      level: 5,
      moduleNumber: '5.3',
      assignmentNumber: 'FM-5.3.3',
      orderIndex: 45,
      title: 'Complete Edit Project - Start to Finish',
      description: 'Apply all Level 5 editing skills to edit a complete craft video from rough cut through final export with professional quality.',
      instructions: `1. Import and organize media: Bins, proxies, efficient structure
2. Create rough cut: Assemble story, basic structure, pacing
3. Refine edit: Precise cuts, rhythm, pacing, J/L-cuts
4. Add transitions: Appropriate use, professional execution
5. Apply speed effects: Slow motion, time lapse where appropriate
6. Edit audio: Sync, levels, music, effects, mixing
7. Color correct: Exposure, white balance, shot matching
8. Add titles and graphics: Opening, lower thirds, end screen
9. Review and polish: Fix issues, smooth transitions, perfect timing
10. Export final video: Multiple formats, ready for delivery`,
      objectives: [
        'Execute complete editing workflow',
        'Create professional rough cut',
        'Refine to polished final edit',
        'Apply all technical skills',
        'Deliver broadcast-quality video',
        'Meet professional standards',
      ],
      skills: ['Complete workflow', 'Professional editing', 'Quality control', 'Multi-format delivery', 'Project management'],
      expectedOutcome: '5-10 minute craft video edited from start to finish: professional pacing, transitions, audio, color, titles, ready for distribution.',
      passingCriteria: 'Edit is polished and professional, pacing engaging, technical quality high, audio perfect, color consistent, ready for broadcast',
      referencePhotos: ['/curriculum/filmmaking/complete-edit-project.jpg'],
      estimatedHours: 16,
      difficulty: 'advanced',
      category: 'projects',
      subcategory: 'editing_project',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Professional Editing Workflow',
        'Editing for Educational Content',
      ],
      crossReferences: ['FM-5.1.2', 'FM-5.1.3', 'FM-5.2.1', 'FM-5.2.2', 'FM-5.3.1', 'FM-5.3.2'],
      prerequisiteIds: ['FM-5.1.2', 'FM-5.1.3', 'FM-5.3.1'],
    },

    // ========================================================================
    // LEVEL 6: MOTION GRAPHICS - Titles & Effects
    // ========================================================================
    {
      level: 6,
      moduleNumber: '6.1',
      assignmentNumber: 'FM-6.1.1',
      orderIndex: 46,
      title: 'Typography Basics for Video',
      description: 'Learn typography fundamentals for video: font selection, hierarchy, readability, contrast, and safe zones.',
      instructions: `1. Study font categories: Serif, sans-serif, script, display, monospace
2. Learn font pairing: Combining fonts harmoniously, contrast and complement
3. Practice readability: Size, weight, spacing for video screens
4. Study safe zones: Title safe, action safe, keeping text in visible area
5. Learn contrast: Text vs background, ensuring legibility
6. Practice font psychology: How fonts convey mood and tone
7. Study font licensing: Free fonts, commercial use, attribution
8. Learn kerning and tracking: Letter spacing for optimal readability
9. Practice alignment: Left, right, center, justified alignment
10. Create typography style guide for video project`,
      objectives: [
        'Select appropriate fonts for video',
        'Pair fonts effectively',
        'Ensure readability on all screens',
        'Keep text within safe zones',
        'Create sufficient contrast',
        'Match font to content tone',
      ],
      skills: ['Typography', 'Font selection', 'Font pairing', 'Readability', 'Safe zones', 'Contrast'],
      expectedOutcome: 'Typography style guide with font selections, pairings, size guidelines, safe zone templates, and readability tests.',
      passingCriteria: 'Fonts are readable and appropriate, pairings harmonious, safe zones respected, contrast sufficient, style consistent',
      referencePhotos: ['/curriculum/filmmaking/typography-guide.jpg', '/curriculum/filmmaking/safe-zones.jpg'],
      estimatedHours: 6,
      difficulty: 'beginner',
      category: 'motion_graphics',
      subcategory: 'typography',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Typography for Video',
        'Font Pairing Guide',
        'TV Safe Zones Explained',
      ],
    },
    {
      level: 6,
      moduleNumber: '6.1',
      assignmentNumber: 'FM-6.1.2',
      orderIndex: 47,
      title: 'Title Design in DaVinci Resolve',
      description: 'Master creating opening titles, end credits, and chapter markers using Resolve\'s text tools.',
      instructions: `1. Study Resolve text tool: Edit page text, timeline-based titles
2. Learn text formatting: Font, size, color, position, alignment
3. Practice drop shadows: Enhancing legibility, depth creation
4. Study outlines/strokes: Adding borders, separation from background
5. Learn background shapes: Boxes, bars behind text for readability
6. Practice opening title sequence: Multiple title cards, timing
7. Study end credits: Scrolling credits, speed control
8. Learn chapter markers: Dividing video into sections
9. Practice animation: Fade in/out, simple movements
10. Create complete title package for video`,
      objectives: [
        'Create professional title cards',
        'Format text for maximum readability',
        'Use shadows and outlines effectively',
        'Design opening title sequence',
        'Create scrolling end credits',
        'Add simple text animations',
      ],
      skills: ['Title design', 'Text formatting', 'Shadows/outlines', 'Credits', 'Text animation'],
      expectedOutcome: 'Complete title package: opening sequence, chapter markers, lower thirds, end credits, all professionally formatted.',
      passingCriteria: 'Titles are readable and professional, formatting consistent, animations smooth, timing appropriate, credits complete',
      referencePhotos: ['/curriculum/filmmaking/title-design.jpg', '/curriculum/filmmaking/credits-example.jpg'],
      estimatedHours: 7,
      difficulty: 'beginner',
      category: 'motion_graphics',
      subcategory: 'titles',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Creating Titles in DaVinci Resolve',
        'Title Design Best Practices',
      ],
      crossReferences: ['FM-6.1.1'],
      prerequisiteIds: ['FM-5.1.1'],
    },
    {
      level: 6,
      moduleNumber: '6.1',
      assignmentNumber: 'FM-6.1.3',
      orderIndex: 48,
      title: 'Lower Thirds & Name Tags',
      description: 'Design and animate lower thirds for naming people, locations, and providing context in educational videos.',
      instructions: `1. Study lower third purpose: Identifying people, locations, topics
2. Learn composition: Position (lower third), size, breathing room
3. Practice design elements: Background shapes, accent colors, logos
4. Study animation in/out: Slide, fade, wipe, appropriate timing
5. Learn text hierarchy: Name larger, title/description smaller
6. Practice color coding: Different colors for different types of info
7. Study duration: How long to display, when to remove
8. Learn batch creation: Creating multiple lower thirds efficiently
9. Practice brand consistency: Matching style across all lower thirds
10. Create lower third template set`,
      objectives: [
        'Design professional lower thirds',
        'Position elements appropriately',
        'Animate in and out smoothly',
        'Establish clear text hierarchy',
        'Create consistent style',
        'Build reusable templates',
      ],
      skills: ['Lower thirds', 'Name tags', 'Animation', 'Template creation', 'Brand consistency'],
      expectedOutcome: 'Set of lower third templates with various styles, all animated, ready to customize with names and titles.',
      passingCriteria: 'Lower thirds are professional and readable, animations smooth, positioning correct, style consistent, easily customizable',
      referencePhotos: ['/curriculum/filmmaking/lower-thirds.jpg', '/curriculum/filmmaking/name-tag-styles.jpg'],
      estimatedHours: 8,
      difficulty: 'intermediate',
      category: 'motion_graphics',
      subcategory: 'lower_thirds',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Lower Third Design Guide',
        'Animating Lower Thirds',
      ],
      crossReferences: ['FM-6.1.2'],
      prerequisiteIds: ['FM-6.1.2'],
    },
    {
      level: 6,
      moduleNumber: '6.2',
      assignmentNumber: 'FM-6.2.1',
      orderIndex: 49,
      title: 'Fusion Basics - Nodes & Interface',
      description: 'Learn DaVinci Resolve Fusion page basics: node-based compositing, interface navigation, and fundamental concepts.',
      instructions: `1. Study Fusion interface: Nodes, viewers, toolbar, inspector
2. Learn node workflow: Adding nodes, connecting, rearranging
3. Practice merge nodes: Combining elements, foreground/background
4. Study transform node: Position, scale, rotation, anchor point
5. Learn text+ node: Advanced text creation and formatting
6. Practice background node: Creating solid colors and gradients
7. Study MediaIn/MediaOut: Connecting to timeline clips
8. Learn viewer controls: Viewing different nodes, comparing
9. Practice saving compositions: Macros, templates for reuse
10. Create simple Fusion composition`,
      objectives: [
        'Navigate Fusion interface confidently',
        'Understand node-based workflow',
        'Connect nodes properly',
        'Use fundamental Fusion nodes',
        'Create simple compositions',
        'Save templates for reuse',
      ],
      skills: ['Fusion interface', 'Node workflow', 'Merge nodes', 'Transform', 'Text+', 'Compositing basics'],
      expectedOutcome: 'Simple Fusion composition demonstrating node connections, text, backgrounds, transforms, saved as reusable template.',
      passingCriteria: 'Nodes properly connected, composition renders correctly, transforms accurate, understanding of workflow demonstrated',
      referencePhotos: ['/curriculum/filmmaking/fusion-interface.jpg', '/curriculum/filmmaking/node-workflow.jpg'],
      estimatedHours: 8,
      difficulty: 'intermediate',
      category: 'motion_graphics',
      subcategory: 'fusion',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Fusion for Beginners',
        'Node-Based Compositing',
        'Fusion Quick Start Guide',
      ],
      prerequisiteIds: ['FM-5.1.1'],
    },
    {
      level: 6,
      moduleNumber: '6.2',
      assignmentNumber: 'FM-6.2.2',
      orderIndex: 50,
      title: 'Keyframe Animation in Fusion',
      description: 'Master keyframe animation: creating movement, easing, animation curves, and timing for smooth motion graphics.',
      instructions: `1. Study keyframes: Setting position, scale, rotation over time
2. Learn animation curves: Spline editor, ease in/out, timing control
3. Practice linear vs smooth: Different interpolation methods
4. Study ease in/ease out: Natural acceleration and deceleration
5. Learn animation principles: Anticipation, follow-through, timing
6. Practice position animation: Moving elements across screen
7. Study scale animation: Growing/shrinking elements
8. Learn rotation animation: Spinning elements smoothly
9. Practice opacity animation: Fading elements in/out
10. Create animated lower third with keyframes`,
      objectives: [
        'Set keyframes for animation',
        'Use animation curves effectively',
        'Apply easing for natural movement',
        'Understand animation principles',
        'Animate position, scale, rotation',
        'Create smooth, professional animations',
      ],
      skills: ['Keyframe animation', 'Animation curves', 'Easing', 'Timing', 'Motion principles'],
      expectedOutcome: 'Animated lower third with smooth keyframe animation: position, scale, rotation, opacity, all properly eased.',
      passingCriteria: 'Animations are smooth, easing appropriate, timing natural, keyframes properly set, professional quality',
      referencePhotos: ['/curriculum/filmmaking/keyframe-animation.jpg', '/curriculum/filmmaking/animation-curves.jpg'],
      estimatedHours: 9,
      difficulty: 'intermediate',
      category: 'motion_graphics',
      subcategory: 'animation',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Keyframe Animation in Fusion',
        'Animation Curves Explained',
        '12 Principles of Animation',
      ],
      crossReferences: ['FM-6.2.1'],
      prerequisiteIds: ['FM-6.2.1'],
    },
    {
      level: 6,
      moduleNumber: '6.2',
      assignmentNumber: 'FM-6.2.3',
      orderIndex: 51,
      title: 'Shape Animation & Design Elements',
      description: 'Create animated shapes, icons, and design elements to enhance educational videos and add visual interest.',
      instructions: `1. Study polygon node: Creating shapes, rectangles, circles, custom
2. Learn ellipse and rectangle: Basic shape creation and styling
3. Practice stroke and fill: Outline vs solid, colors and gradients
4. Study shape animation: Morphing, growing, rotating shapes
5. Learn icon creation: Simple vector icons for educational content
6. Practice callouts: Arrows, circles, highlights for emphasis
7. Study particle effects: Simple particles for visual interest
8. Learn animated backgrounds: Subtle motion for depth
9. Practice combining shapes: Building complex designs from simple shapes
10. Create animated callout toolkit`,
      objectives: [
        'Create basic and custom shapes',
        'Animate shapes smoothly',
        'Design simple icons',
        'Create callouts and emphasis elements',
        'Build animated backgrounds',
        'Combine shapes into complex designs',
      ],
      skills: ['Shape creation', 'Shape animation', 'Icon design', 'Callouts', 'Design elements'],
      expectedOutcome: 'Animated callout toolkit: arrows, circles, highlights, underlines, all animated and ready to use in educational videos.',
      passingCriteria: 'Shapes are clean and professional, animations smooth, callouts effective, toolkit comprehensive and reusable',
      referencePhotos: ['/curriculum/filmmaking/shape-animation.jpg', '/curriculum/filmmaking/callout-examples.jpg'],
      estimatedHours: 8,
      difficulty: 'intermediate',
      category: 'motion_graphics',
      subcategory: 'shapes',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Shape Tools in Fusion',
        'Animating Shapes',
        'Creating Callouts and Highlights',
      ],
      crossReferences: ['FM-6.2.2'],
      prerequisiteIds: ['FM-6.2.2'],
    },
    {
      level: 6,
      moduleNumber: '6.3',
      assignmentNumber: 'FM-6.3.1',
      orderIndex: 52,
      title: 'Text Animation & Title Effects',
      description: 'Master advanced text animation techniques: character animation, tracking, write-on effects, and creative text treatments.',
      instructions: `1. Study Text+ character level: Animating individual characters
2. Learn tracking animation: Spacing between all characters
3. Practice write-on effect: Text appearing letter by letter
4. Study bounce/overshoot: Characters bouncing into position
5. Learn blur in/out: Text coming into focus
6. Practice 3D text: Rotation in 3D space, depth
7. Study text along path: Following curves and shapes
8. Learn glitch effects: Digital distortion, modern treatments
9. Practice kinetic typography: Animated, energetic text
10. Create title sequence with advanced animation`,
      objectives: [
        'Animate text at character level',
        'Create write-on effects',
        'Add bounce and overshoot',
        'Work with 3D text',
        'Animate text along paths',
        'Apply creative text treatments',
      ],
      skills: ['Character animation', 'Write-on effects', '3D text', 'Path animation', 'Kinetic typography'],
      expectedOutcome: 'Dynamic title sequence with advanced text animation: character-level animation, 3D rotation, write-on effects, kinetic movement.',
      passingCriteria: 'Text animations are smooth and creative, effects enhance readability, timing energetic but not overwhelming, professional execution',
      referencePhotos: ['/curriculum/filmmaking/text-animation.jpg', '/curriculum/filmmaking/kinetic-typography.jpg'],
      estimatedHours: 10,
      difficulty: 'advanced',
      category: 'motion_graphics',
      subcategory: 'text_effects',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Advanced Text Animation in Fusion',
        'Kinetic Typography Tutorial',
        'Text Effects for Video',
      ],
      crossReferences: ['FM-6.2.2', 'FM-6.2.3'],
      prerequisiteIds: ['FM-6.2.2'],
    },
    {
      level: 6,
      moduleNumber: '6.3',
      assignmentNumber: 'FM-6.3.2',
      orderIndex: 53,
      title: 'Transitions & Reveals in Fusion',
      description: 'Create custom transitions and reveal effects: wipes, masks, shape transitions, and creative scene changes.',
      instructions: `1. Study custom wipes: Directional reveals, soft edges
2. Learn mask transitions: Using shapes to reveal content
3. Practice circular reveals: Expanding circles, iris effects
4. Study displacement maps: Warping transitions
5. Learn luma mattes: Using brightness to control reveals
6. Practice zoom transitions: Matching zoom between clips
7. Study rotation transitions: Spinning reveals
8. Learn particles as transitions: Dissolving into particles
9. Practice seamless transitions: Matching movement and color
10. Create transition pack for craft videos`,
      objectives: [
        'Create custom wipe transitions',
        'Use masks for creative reveals',
        'Build circular and iris transitions',
        'Apply luma matte transitions',
        'Match movement between clips',
        'Design seamless, creative transitions',
      ],
      skills: ['Custom transitions', 'Mask transitions', 'Wipes', 'Luma mattes', 'Creative reveals'],
      expectedOutcome: 'Transition pack with 5-10 custom transitions: wipes, reveals, masks, all smooth and creative, ready for use.',
      passingCriteria: 'Transitions are smooth and creative, timing appropriate, effects enhance rather than distract, easily applicable to clips',
      referencePhotos: ['/curriculum/filmmaking/custom-transitions.jpg', '/curriculum/filmmaking/reveal-effects.jpg'],
      estimatedHours: 9,
      difficulty: 'advanced',
      category: 'motion_graphics',
      subcategory: 'transitions',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Custom Transitions in Fusion',
        'Mask-Based Transitions',
        'Creative Reveal Techniques',
      ],
      crossReferences: ['FM-6.2.1', 'FM-6.2.2'],
      prerequisiteIds: ['FM-6.2.2'],
    },
    {
      level: 6,
      moduleNumber: '6.3',
      assignmentNumber: 'FM-6.3.3',
      orderIndex: 54,
      title: 'Motion Graphics Project - Educational Graphics Package',
      description: 'Apply all Level 6 skills to create complete motion graphics package for educational craft video.',
      instructions: `1. Design consistent visual style: Colors, fonts, shapes matching brand
2. Create opening title sequence: Animated, engaging, sets tone
3. Build lower third templates: Name tags, location tags, topic tags
4. Design animated callouts: Arrows, circles, highlights for key points
5. Create chapter markers: Dividing video into sections
6. Design transition pack: Custom transitions between sections
7. Build icon set: Animated icons for materials, tools, steps
8. Create end screen: Subscribe, links, social media
9. Animate all elements: Smooth, consistent animation style
10. Assemble complete graphics package`,
      objectives: [
        'Design cohesive visual style',
        'Create complete graphics package',
        'Animate all elements smoothly',
        'Maintain brand consistency',
        'Build reusable templates',
        'Deliver professional motion graphics',
      ],
      skills: ['Package design', 'Brand consistency', 'Template creation', 'Complete workflow', 'Professional execution'],
      expectedOutcome: 'Complete motion graphics package: opening, lower thirds, callouts, transitions, icons, end screen, all animated and branded.',
      passingCriteria: 'All graphics professionally designed, animations smooth, style consistent, package comprehensive, broadcast-ready',
      referencePhotos: ['/curriculum/filmmaking/motion-graphics-package.jpg'],
      estimatedHours: 16,
      difficulty: 'advanced',
      category: 'projects',
      subcategory: 'motion_project',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Motion Graphics for Educational Video',
        'Building Graphics Packages',
      ],
      crossReferences: ['FM-6.1.2', 'FM-6.1.3', 'FM-6.2.2', 'FM-6.2.3', 'FM-6.3.1', 'FM-6.3.2'],
      prerequisiteIds: ['FM-6.2.2', 'FM-6.3.1'],
    },

    // ========================================================================
    // LEVEL 7: EDUCATIONAL VIDEO PRODUCTION
    // ========================================================================
    {
      level: 7,
      moduleNumber: '7.1',
      assignmentNumber: 'FM-7.1.1',
      orderIndex: 55,
      title: 'Educational Video Structure & Planning',
      description: 'Learn to structure educational content: hook, learning objectives, instruction, practice, and assessment.',
      instructions: `1. Study educational video structure: Hook, introduce, teach, demonstrate, practice, review
2. Learn hook creation: Capturing attention in first 10 seconds
3. Practice learning objectives: Clear, specific, measurable goals
4. Study chunking: Breaking complex topics into digestible segments
5. Learn instructional strategies: Show, explain, demonstrate, repeat
6. Practice pacing: Not too fast, not too slow, appropriate for complexity
7. Study engagement techniques: Questions, challenges, interaction prompts
8. Learn summary/review: Reinforcing key points at end
9. Practice call-to-action: Next steps, related content
10. Create educational video script with structure`,
      objectives: [
        'Structure content for learning',
        'Create engaging hooks',
        'Write clear learning objectives',
        'Break content into chunks',
        'Pace instruction appropriately',
        'Include summary and call-to-action',
      ],
      skills: ['Instructional design', 'Content structuring', 'Learning objectives', 'Engagement', 'Educational pacing'],
      expectedOutcome: 'Complete educational video script with hook, objectives, structured instruction, demonstrations, summary, and call-to-action.',
      passingCriteria: 'Structure follows educational best practices, hook engaging, objectives clear, pacing appropriate, content well-organized',
      referencePhotos: ['/curriculum/filmmaking/educational-structure.jpg', '/curriculum/filmmaking/video-script.jpg'],
      estimatedHours: 7,
      difficulty: 'intermediate',
      category: 'educational',
      subcategory: 'planning',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Instructional Design for Video',
        'Educational Video Structure',
        'Writing Learning Objectives',
      ],
    },
    {
      level: 7,
      moduleNumber: '7.1',
      assignmentNumber: 'FM-7.1.2',
      orderIndex: 56,
      title: 'On-Camera Presence & Presentation Skills',
      description: 'Develop confident on-camera presence: body language, eye contact, energy, and natural delivery for teaching.',
      instructions: `1. Study camera presence: Confidence, energy, authenticity
2. Learn eye contact: Looking at camera as if talking to person
3. Practice body language: Open posture, natural gestures, movement
4. Study vocal delivery: Clear enunciation, varied tone, appropriate pace
5. Learn energy management: Enthusiasm without overwhelming
6. Practice natural delivery: Conversational, not reading script
7. Study framing for presenter: Headroom, looking room, composition
8. Learn handling mistakes: Staying calm, re-starting smoothly
9. Practice repetition: Saying key points multiple ways
10. Record 5-minute teaching segment on camera`,
      objectives: [
        'Project confidence on camera',
        'Maintain natural eye contact',
        'Use effective body language',
        'Deliver content clearly and naturally',
        'Manage energy appropriately',
        'Handle mistakes professionally',
      ],
      skills: ['On-camera presence', 'Presentation', 'Body language', 'Vocal delivery', 'Confidence'],
      expectedOutcome: '5-minute on-camera teaching segment: confident presence, natural delivery, clear instruction, engaging energy.',
      passingCriteria: 'Presenter is confident and natural, eye contact maintained, body language open, delivery clear and engaging, mistakes handled well',
      referencePhotos: ['/curriculum/filmmaking/on-camera-presence.jpg', '/curriculum/filmmaking/presenter-framing.jpg'],
      estimatedHours: 8,
      difficulty: 'intermediate',
      category: 'educational',
      subcategory: 'presentation',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'On-Camera Presentation Skills',
        'Body Language for Video',
        'Vocal Delivery Techniques',
      ],
    },
    {
      level: 7,
      moduleNumber: '7.1',
      assignmentNumber: 'FM-7.1.3',
      orderIndex: 57,
      title: 'Demonstration Filming Techniques',
      description: 'Master filming craft demonstrations: camera angles, hand positions, tool visibility, and clear process documentation.',
      instructions: `1. Study overhead camera setup: Directly above workspace, full view
2. Learn front angle filming: Eye-level view of process
3. Practice hand positioning: Keeping hands out of way of critical view
4. Study detail shots: Close-ups of important steps, techniques
5. Learn tool visibility: Ensuring tools and materials clearly visible
6. Practice step-by-step filming: One clear step at a time
7. Study multi-angle coverage: Overhead + front + side for complete view
8. Learn common mistakes: What to avoid in demonstration filming
9. Practice consistency: Lighting, framing, angle throughout process
10. Film complete craft demonstration with multiple angles`,
      objectives: [
        'Set up overhead camera effectively',
        'Capture demonstrations from optimal angles',
        'Ensure all steps are clearly visible',
        'Film detail shots of key techniques',
        'Maintain consistency throughout',
        'Create comprehensive demonstration footage',
      ],
      skills: ['Demonstration filming', 'Overhead camera', 'Multi-angle coverage', 'Detail shots', 'Process documentation'],
      expectedOutcome: 'Complete craft demonstration filmed from multiple angles: overhead, front, detail shots, all steps clear and visible.',
      passingCriteria: 'All steps clearly visible, hands don\'t obscure important views, lighting consistent, angles appropriate, comprehensive coverage',
      referencePhotos: ['/curriculum/filmmaking/overhead-filming.jpg', '/curriculum/filmmaking/demonstration-angles.jpg'],
      estimatedHours: 9,
      difficulty: 'intermediate',
      category: 'educational',
      subcategory: 'demonstration',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Filming Craft Demonstrations',
        'Overhead Camera Techniques',
        'Multi-Angle Production',
      ],
      crossReferences: ['FM-2.1.2', 'FM-2.3.2'],
    },
    {
      level: 7,
      moduleNumber: '7.2',
      assignmentNumber: 'FM-7.2.1',
      orderIndex: 58,
      title: 'Screen Recording for Tutorials',
      description: 'Learn to record screen for software tutorials: capture settings, cursor visibility, audio narration, and editing.',
      instructions: `1. Study screen recording software: OBS, ScreenFlow, Camtasia, QuickTime
2. Learn capture settings: Resolution, frame rate, area selection
3. Practice cursor highlighting: Making cursor more visible
4. Study click visualization: Showing when you click
5. Learn audio setup: Microphone recording synchronized with screen
6. Practice zoom/magnify: Highlighting important areas
7. Study editing screen recordings: Cutting mistakes, speeding up slow parts
8. Learn annotations: Adding arrows, highlights, callouts in post
9. Practice picture-in-picture: Webcam overlay showing presenter
10. Create complete software tutorial with screen recording`,
      objectives: [
        'Record screen at proper settings',
        'Make cursor and clicks visible',
        'Record synchronized audio',
        'Zoom to highlight important areas',
        'Edit screen recordings effectively',
        'Add helpful annotations',
      ],
      skills: ['Screen recording', 'Software tutorials', 'Cursor highlighting', 'Audio sync', 'Annotations'],
      expectedOutcome: 'Complete software tutorial: screen recording with highlighted cursor, synchronized narration, edited, annotated, picture-in-picture.',
      passingCriteria: 'Screen recording is clear, cursor visible, audio synchronized, pacing appropriate, annotations helpful, professional quality',
      referencePhotos: ['/curriculum/filmmaking/screen-recording.jpg', '/curriculum/filmmaking/tutorial-annotations.jpg'],
      estimatedHours: 8,
      difficulty: 'intermediate',
      category: 'educational',
      subcategory: 'screen_recording',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Screen Recording Best Practices',
        'Creating Software Tutorials',
        'Editing Screen Captures',
      ],
    },
    {
      level: 7,
      moduleNumber: '7.2',
      assignmentNumber: 'FM-7.2.2',
      orderIndex: 59,
      title: 'Multi-Camera Educational Setup',
      description: 'Set up and film with multiple cameras for comprehensive educational coverage: presenter, demonstration, and detail cameras.',
      instructions: `1. Study multi-cam educational setup: Front camera (presenter), overhead (demo), detail (close-up)
2. Learn camera placement: Angles that don't interfere with each other
3. Practice synchronized recording: Starting all cameras together, sync in post
4. Study switching strategy: When to show each angle
5. Learn audio setup: Which camera captures primary audio
6. Practice lighting for multi-cam: Ensuring all angles properly lit
7. Study editing multi-cam educational: Cutting between angles for clarity
8. Learn graphic overlays: Labels showing which angle/camera
9. Practice consistency: Color matching, exposure matching between cameras
10. Film educational segment with 3-camera setup`,
      objectives: [
        'Set up multiple cameras effectively',
        'Synchronize recordings from all cameras',
        'Light for all camera angles',
        'Edit multi-cam for educational clarity',
        'Match color and exposure',
        'Choose optimal angles for each moment',
      ],
      skills: ['Multi-camera setup', 'Camera synchronization', 'Educational coverage', 'Multi-cam editing', 'Angle selection'],
      expectedOutcome: 'Educational video shot with 3 cameras: presenter, overhead demo, detail shots, all synchronized and edited together.',
      passingCriteria: 'Cameras properly positioned, synchronized perfectly, lighting works for all angles, editing clear and purposeful, colors matched',
      referencePhotos: ['/curriculum/filmmaking/multi-cam-educational.jpg', '/curriculum/filmmaking/three-camera-setup.jpg'],
      estimatedHours: 10,
      difficulty: 'advanced',
      category: 'educational',
      subcategory: 'multi_camera',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Multi-Camera Educational Production',
        'Three-Camera Tutorial Setup',
      ],
      crossReferences: ['FM-5.2.3', 'FM-7.1.3'],
      prerequisiteIds: ['FM-5.2.3'],
    },
    {
      level: 7,
      moduleNumber: '7.2',
      assignmentNumber: 'FM-7.2.3',
      orderIndex: 60,
      title: 'Visual Aids & On-Screen Graphics for Teaching',
      description: 'Create and integrate visual aids: diagrams, bullet points, step lists, progress indicators, and teaching graphics.',
      instructions: `1. Study visual aid types: Diagrams, lists, charts, illustrations
2. Learn bullet point design: Clear, concise, easy to read
3. Practice step numbering: Visual step indicators, progress bars
4. Study diagrams: Arrows, labels, exploded views, technical drawings
5. Learn material/tool lists: On-screen checklists
6. Practice progress indicators: Showing where in process viewer is
7. Study picture-in-picture diagrams: Reference while showing live action
8. Learn highlighting: Circling, arrows, emphasis on specific areas
9. Practice integration: Smooth transitions between graphics and footage
10. Create complete visual aid package for tutorial`,
      objectives: [
        'Design clear visual aids',
        'Create effective bullet points and lists',
        'Build progress indicators',
        'Design helpful diagrams',
        'Integrate graphics with footage',
        'Enhance teaching with visuals',
      ],
      skills: ['Visual aids', 'Diagrams', 'Lists', 'Progress indicators', 'Teaching graphics', 'Integration'],
      expectedOutcome: 'Visual aid package for tutorial: step numbers, bullet points, diagrams, tool lists, progress indicators, all integrated smoothly.',
      passingCriteria: 'Visual aids are clear and helpful, design consistent, integration smooth, aids enhance rather than distract from teaching',
      referencePhotos: ['/curriculum/filmmaking/visual-aids.jpg', '/curriculum/filmmaking/teaching-graphics.jpg'],
      estimatedHours: 8,
      difficulty: 'intermediate',
      category: 'educational',
      subcategory: 'visual_aids',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Visual Aids for Educational Video',
        'Designing Teaching Graphics',
      ],
      crossReferences: ['FM-6.1.2', 'FM-6.2.3'],
    },
    {
      level: 7,
      moduleNumber: '7.3',
      assignmentNumber: 'FM-7.3.1',
      orderIndex: 61,
      title: 'Accessibility in Educational Video',
      description: 'Make educational videos accessible: captions, audio descriptions, visual clarity, and inclusive design practices.',
      instructions: `1. Study closed captions: Accurate transcription, proper timing, formatting
2. Learn caption creation: Auto-generate in Resolve, manual correction
3. Practice audio description: Describing visual elements for blind viewers
4. Study visual clarity: High contrast, large text, clear demonstrations
5. Learn color blindness considerations: Not relying solely on color
6. Practice caption styling: Readable fonts, backgrounds, positioning
7. Study audio-only comprehension: Content understandable without visuals
8. Learn chapter markers: Helping viewers navigate content
9. Practice inclusive language: Clear, simple, avoiding jargon
10. Add complete accessibility features to tutorial`,
      objectives: [
        'Create accurate captions',
        'Ensure visual clarity',
        'Consider color blindness',
        'Make content audio-only accessible',
        'Use inclusive language',
        'Implement accessibility best practices',
      ],
      skills: ['Captioning', 'Accessibility', 'Audio description', 'Visual clarity', 'Inclusive design'],
      expectedOutcome: 'Tutorial with full accessibility: accurate captions, high visual clarity, audio description track, chapter markers, inclusive language.',
      passingCriteria: 'Captions are accurate and well-timed, visuals are clear, content accessible to diverse audiences, inclusive language used',
      referencePhotos: ['/curriculum/filmmaking/captions-example.jpg', '/curriculum/filmmaking/accessible-design.jpg'],
      estimatedHours: 7,
      difficulty: 'intermediate',
      category: 'educational',
      subcategory: 'accessibility',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Video Accessibility Guidelines',
        'Creating Captions in Resolve',
        'Inclusive Video Design',
      ],
    },
    {
      level: 7,
      moduleNumber: '7.3',
      assignmentNumber: 'FM-7.3.2',
      orderIndex: 62,
      title: 'YouTube Optimization for Educational Content',
      description: 'Optimize educational videos for YouTube: SEO, thumbnails, titles, descriptions, tags, playlists, and engagement.',
      instructions: `1. Study YouTube SEO: Keywords, search optimization, algorithm
2. Learn thumbnail design: Eye-catching, clear, representative
3. Practice title writing: Compelling, keyword-rich, accurate
4. Study description writing: Detailed, timestamped, links
5. Learn tag strategy: Relevant keywords, competition analysis
6. Practice playlist organization: Grouping related content
7. Study end screens: Promoting other videos, subscribe buttons
8. Learn cards: Adding links, polls, related content during video
9. Practice engagement: Asking questions, encouraging comments
10. Optimize complete educational video for YouTube`,
      objectives: [
        'Create effective thumbnails',
        'Write compelling, SEO-optimized titles',
        'Write detailed descriptions with timestamps',
        'Use tags strategically',
        'Organize content in playlists',
        'Maximize viewer engagement',
      ],
      skills: ['YouTube optimization', 'SEO', 'Thumbnail design', 'Title writing', 'Engagement strategies'],
      expectedOutcome: 'Complete YouTube optimization: custom thumbnail, keyword-rich title and description, tags, playlist placement, end screen, cards.',
      passingCriteria: 'Thumbnail is compelling, title and description optimized, tags relevant, playlists organized, engagement strategies implemented',
      referencePhotos: ['/curriculum/filmmaking/youtube-thumbnail.jpg', '/curriculum/filmmaking/youtube-optimization.jpg'],
      estimatedHours: 6,
      difficulty: 'beginner',
      category: 'educational',
      subcategory: 'distribution',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'YouTube SEO Guide',
        'Thumbnail Design Best Practices',
        'YouTube Algorithm Explained',
      ],
    },
    {
      level: 7,
      moduleNumber: '7.3',
      assignmentNumber: 'FM-7.3.3',
      orderIndex: 63,
      title: 'Complete Educational Video Project',
      description: 'Apply all Level 7 skills to create complete educational craft video from planning through distribution.',
      instructions: `1. Plan educational content: Structure, learning objectives, script
2. Prepare presenter: Practice delivery, on-camera presence
3. Set up multi-camera: Presenter, overhead, detail cameras
4. Film demonstration: Clear steps, multiple angles, comprehensive coverage
5. Record voiceover: Professional narration for sections
6. Edit with educational pacing: Appropriate speed, clear instruction
7. Add visual aids: Step numbers, diagrams, bullet points, progress indicators
8. Create accessibility features: Captions, clear visuals, inclusive language
9. Add motion graphics: Opening, lower thirds, callouts, end screen
10. Optimize for YouTube: Thumbnail, title, description, tags`,
      objectives: [
        'Plan complete educational video',
        'Film with professional multi-camera setup',
        'Edit for educational effectiveness',
        'Integrate visual aids and graphics',
        'Ensure accessibility',
        'Optimize for distribution',
      ],
      skills: ['Educational production', 'Multi-camera', 'Visual aids', 'Accessibility', 'Distribution'],
      expectedOutcome: 'Complete 10-15 minute educational craft video: multi-camera, visual aids, captions, motion graphics, optimized for YouTube.',
      passingCriteria: 'Content is educationally effective, production professional, accessible to all, optimized for distribution, broadcast-ready',
      referencePhotos: ['/curriculum/filmmaking/educational-project.jpg'],
      estimatedHours: 18,
      difficulty: 'advanced',
      category: 'projects',
      subcategory: 'educational_project',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Educational Video Production Workflow',
        'Complete Tutorial Creation Guide',
      ],
      crossReferences: ['FM-7.1.1', 'FM-7.1.2', 'FM-7.1.3', 'FM-7.2.2', 'FM-7.2.3', 'FM-7.3.1', 'FM-7.3.2'],
      prerequisiteIds: ['FM-7.1.3', 'FM-7.2.2', 'FM-7.3.1'],
    },

    // ========================================================================
    // LEVEL 8: COLOR GRADING - Cinematic Look
    // ========================================================================
    {
      level: 8,
      moduleNumber: '8.1',
      assignmentNumber: 'FM-8.1.1',
      orderIndex: 64,
      title: 'Color Theory for Video',
      description: 'Master color theory fundamentals: color wheel, complementary colors, color psychology, and emotional impact.',
      instructions: `1. Study color wheel: Primary, secondary, tertiary colors
2. Learn color relationships: Complementary, analogous, triadic
3. Practice color psychology: Warm (energy, passion) vs cool (calm, professional)
4. Study color schemes: Monochromatic, complementary, split-complementary
5. Learn cultural color meanings: Different associations in different cultures
6. Practice color harmony: Creating pleasing color combinations
7. Study color contrast: High contrast (dramatic) vs low contrast (subtle)
8. Learn color temperature storytelling: Emotional arc through color
9. Practice color palettes: Building cohesive looks for projects
10. Create color mood board for video project`,
      objectives: [
        'Understand color wheel and relationships',
        'Apply color psychology',
        'Build harmonious color schemes',
        'Use color for emotional impact',
        'Create cohesive color palettes',
        'Understand cultural color meanings',
      ],
      skills: ['Color theory', 'Color psychology', 'Color harmony', 'Color palettes', 'Emotional design'],
      expectedOutcome: 'Color mood board showing planned color scheme for video: palette, emotional goals, reference images, color relationships.',
      passingCriteria: 'Color theory understanding demonstrated, palette is harmonious, emotional goals clear, scheme appropriate for content',
      referencePhotos: ['/curriculum/filmmaking/color-wheel.jpg', '/curriculum/filmmaking/color-mood-board.jpg'],
      estimatedHours: 6,
      difficulty: 'beginner',
      category: 'color_grading',
      subcategory: 'theory',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Color Theory for Filmmakers',
        'Color Psychology in Film',
        'Building Color Palettes',
      ],
    },
    {
      level: 8,
      moduleNumber: '8.1',
      assignmentNumber: 'FM-8.1.2',
      orderIndex: 65,
      title: 'Advanced Color Correction',
      description: 'Go beyond basics: advanced primary correction, skin tone perfection, and professional color balance.',
      instructions: `1. Study advanced scopes: Reading complex images, identifying issues
2. Learn skin tone mastery: Perfect skin tones across different ethnicities
3. Practice selective color: Isolating and adjusting specific colors
4. Study color wheels mastery: Precise adjustments in shadows/mids/highlights
5. Learn curves: Fine control over tones and contrast
6. Practice matching shots: Making shots from different times/cameras match
7. Study log footage correction: Working with flat profiles, proper workflow
8. Learn HDR correction: Wide dynamic range, proper tone mapping
9. Practice color space: Rec.709, DCI-P3, understanding output targets
10. Color correct challenging footage: Mixed lighting, log, HDR`,
      objectives: [
        'Perfect skin tones professionally',
        'Use advanced color tools',
        'Correct log and HDR footage',
        'Match shots from different sources',
        'Master curves and wheels',
        'Understand color spaces',
      ],
      skills: ['Advanced correction', 'Skin tones', 'Selective color', 'Curves', 'Log workflow', 'HDR'],
      expectedOutcome: 'Professionally color-corrected sequence: perfect skin tones, matched shots, log footage corrected, HDR handled, all footage balanced.',
      passingCriteria: 'Skin tones are perfect, shots match seamlessly, log footage properly corrected, scopes show proper levels, professional execution',
      referencePhotos: ['/curriculum/filmmaking/advanced-correction.jpg', '/curriculum/filmmaking/skin-tone-scopes.jpg'],
      estimatedHours: 10,
      difficulty: 'advanced',
      category: 'color_grading',
      subcategory: 'correction',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Advanced Color Correction',
        'Perfect Skin Tones',
        'Log Footage Workflow',
      ],
      crossReferences: ['FM-5.3.1', 'FM-1.3.3'],
      prerequisiteIds: ['FM-5.3.1'],
    },
    {
      level: 8,
      moduleNumber: '8.1',
      assignmentNumber: 'FM-8.1.3',
      orderIndex: 66,
      title: 'LUTs - Creation & Application',
      description: 'Master Look-Up Tables: applying creative LUTs, creating custom LUTs, and understanding LUT workflow.',
      instructions: `1. Study LUTs: What they are, how they work, when to use
2. Learn LUT types: Technical (log to Rec.709) vs creative (film looks)
3. Practice LUT application: Correct order in node tree
4. Study LUT adjustment: Modifying LUT strength, mixing LUTs
5. Learn popular LUT packs: Film emulation, cinematic looks
6. Practice creating LUTs: Saving your grades as reusable LUTs
7. Study LUT limitations: What LUTs can and can't do
8. Learn shot-specific adjustment: Tweaking after LUT application
9. Practice LUT organization: Naming, categorizing, managing library
10. Create custom LUT pack for craft video style`,
      objectives: [
        'Apply LUTs correctly',
        'Choose appropriate LUTs',
        'Create custom LUTs',
        'Adjust LUT strength',
        'Understand LUT workflow',
        'Build organized LUT library',
      ],
      skills: ['LUTs', 'LUT application', 'LUT creation', 'Film emulation', 'Look development'],
      expectedOutcome: 'Custom LUT pack for brand: 3-5 LUTs creating consistent look, properly applied to footage, adjustable, organized library.',
      passingCriteria: 'LUTs are properly applied, look is consistent, custom LUTs work across footage, strength adjustable, library organized',
      referencePhotos: ['/curriculum/filmmaking/lut-application.jpg', '/curriculum/filmmaking/lut-library.jpg'],
      estimatedHours: 7,
      difficulty: 'intermediate',
      category: 'color_grading',
      subcategory: 'luts',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Understanding LUTs',
        'Creating Custom LUTs',
        'LUT Workflow in Resolve',
      ],
      crossReferences: ['FM-8.1.2'],
      prerequisiteIds: ['FM-5.3.1'],
    },
    {
      level: 8,
      moduleNumber: '8.2',
      assignmentNumber: 'FM-8.2.1',
      orderIndex: 67,
      title: 'Secondary Color Grading - Qualifiers & Windows',
      description: 'Master secondary grading: HSL qualifiers, power windows, tracking, and isolating specific areas for adjustment.',
      instructions: `1. Study HSL qualifiers: Selecting colors by hue, saturation, luminance
2. Learn power windows: Circular, linear, polygon masks
3. Practice window tracking: Following subjects through movement
4. Study feathering: Soft edges for natural-looking adjustments
5. Learn combining qualifiers: HSL + luminance + windows for precision
6. Practice sky replacement: Selecting and enhancing skies
7. Study selective saturation: Boosting or reducing specific colors
8. Learn vignettes: Subtle darkening of edges
9. Practice skin smoothing: Subtle skin enhancement without losing detail
10. Apply secondary grading to video project`,
      objectives: [
        'Select colors with HSL qualifiers',
        'Create and track power windows',
        'Combine selection methods',
        'Apply selective adjustments',
        'Create natural-looking grades',
        'Master secondary tools',
      ],
      skills: ['Secondary grading', 'HSL qualifiers', 'Power windows', 'Tracking', 'Selective adjustment'],
      expectedOutcome: 'Graded video with secondary adjustments: sky enhanced, skin smoothed, specific colors isolated and adjusted, vignettes, all natural.',
      passingCriteria: 'Selections are clean, tracking accurate, adjustments subtle and natural, no visible edges, professional execution',
      referencePhotos: ['/curriculum/filmmaking/secondary-grading.jpg', '/curriculum/filmmaking/power-windows.jpg'],
      estimatedHours: 9,
      difficulty: 'advanced',
      category: 'color_grading',
      subcategory: 'secondary',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Secondary Color Grading',
        'HSL Qualifiers Guide',
        'Power Windows and Tracking',
      ],
      crossReferences: ['FM-8.1.2'],
      prerequisiteIds: ['FM-8.1.2'],
    },
    {
      level: 8,
      moduleNumber: '8.2',
      assignmentNumber: 'FM-8.2.2',
      orderIndex: 68,
      title: 'Cinematic Color Looks',
      description: 'Create popular cinematic looks: teal and orange, bleach bypass, film noir, vintage film, modern blockbuster.',
      instructions: `1. Study teal and orange: Complementary color grading, modern blockbuster look
2. Learn bleach bypass: Desaturated, high contrast, gritty look
3. Practice film noir: Black and white with high contrast shadows
4. Study vintage film: Faded colors, grain, vignetting, imperfections
5. Learn modern blockbuster: Clean, saturated, separated tones
6. Practice warm vintage: Golden hour, nostalgic feel
7. Study cool futuristic: Blue/cyan tones, sleek and modern
8. Learn pastel: Soft, desaturated, gentle colors
9. Practice building looks: Step-by-step process for each style
10. Create look book with 5 cinematic styles`,
      objectives: [
        'Create teal and orange look',
        'Build bleach bypass effect',
        'Grade film noir style',
        'Achieve vintage film look',
        'Master modern blockbuster grading',
      ],
      skills: ['Cinematic looks', 'Teal and orange', 'Bleach bypass', 'Film noir', 'Vintage grading', 'Look development'],
      expectedOutcome: 'Look book with 5 cinematic styles applied to same footage: teal/orange, bleach bypass, noir, vintage, blockbuster.',
      passingCriteria: 'Each look is properly executed, styles are distinct, techniques appropriate, consistent application, professional quality',
      referencePhotos: ['/curriculum/filmmaking/cinematic-looks.jpg', '/curriculum/filmmaking/teal-orange.jpg'],
      estimatedHours: 10,
      difficulty: 'advanced',
      category: 'color_grading',
      subcategory: 'looks',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Cinematic Color Grading',
        'Teal and Orange Explained',
        'Film Look Development',
      ],
      crossReferences: ['FM-8.1.1', 'FM-8.1.2', 'FM-8.1.3'],
      prerequisiteIds: ['FM-8.1.2'],
    },
    {
      level: 8,
      moduleNumber: '8.2',
      assignmentNumber: 'FM-8.2.3',
      orderIndex: 69,
      title: 'Film Grain & Texture',
      description: 'Add film grain, halation, and texture to digital video for organic, filmic quality.',
      instructions: `1. Study film grain: Size, intensity, color vs monochrome
2. Learn grain application: Resolve grain effect, third-party plugins
3. Practice grain amount: Subtle enhancement vs strong film look
4. Study halation: Bloom around highlights, vintage film characteristic
5. Learn texture overlays: Dust, scratches, light leaks for vintage
6. Practice gate weave: Subtle movement simulation from film projectors
7. Study color film grain: Different grain in different color channels
8. Learn temporal grain: Grain that changes frame-to-frame
9. Practice matching grain to footage: Appropriate amount for resolution
10. Add film texture to digital video project`,
      objectives: [
        'Apply appropriate film grain',
        'Create halation effects',
        'Add texture overlays',
        'Simulate film characteristics',
        'Match grain to footage style',
        'Create organic, filmic look',
      ],
      skills: ['Film grain', 'Halation', 'Texture', 'Film emulation', 'Organic look'],
      expectedOutcome: 'Digital video with film characteristics: appropriate grain, halation on highlights, subtle texture, organic and cinematic feel.',
      passingCriteria: 'Grain is appropriate for footage, halation subtle and natural, texture enhances without distracting, filmic look achieved',
      referencePhotos: ['/curriculum/filmmaking/film-grain.jpg', '/curriculum/filmmaking/halation-effect.jpg'],
      estimatedHours: 7,
      difficulty: 'intermediate',
      category: 'color_grading',
      subcategory: 'texture',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Film Grain in Digital Video',
        'Halation Effects',
        'Film Emulation Techniques',
      ],
      crossReferences: ['FM-8.2.2'],
    },
    {
      level: 8,
      moduleNumber: '8.3',
      assignmentNumber: 'FM-8.3.1',
      orderIndex: 70,
      title: 'Color Grading Workflow & Node Structure',
      description: 'Master professional color grading workflow: node structure, organization, and efficient grading practices.',
      instructions: `1. Study node types: Serial, parallel, layer, outside nodes
2. Learn node structure: Correction node, creative node, finishing node
3. Practice node organization: Labeling, color coding, logical flow
4. Study shared nodes: Applying same grade to multiple clips
5. Learn timeline grading: Shot-based vs clip-based workflow
6. Practice version management: Saving different grade versions
7. Study grading in passes: Multiple rounds of refinement
8. Learn collaboration: Notes, feedback integration, client review
9. Practice efficient workflow: Keyboard shortcuts, streamlined process
10. Grade complete project with professional workflow`,
      objectives: [
        'Organize nodes professionally',
        'Use appropriate node types',
        'Build efficient workflow',
        'Manage grade versions',
        'Collaborate effectively',
        'Work in organized passes',
      ],
      skills: ['Node structure', 'Workflow organization', 'Version management', 'Professional grading', 'Collaboration'],
      expectedOutcome: 'Complete project graded with professional workflow: organized nodes, labeled structure, version management, efficient process.',
      passingCriteria: 'Node structure is logical and organized, workflow efficient, versions managed, labels clear, professional execution',
      referencePhotos: ['/curriculum/filmmaking/node-structure.jpg', '/curriculum/filmmaking/grading-workflow.jpg'],
      estimatedHours: 8,
      difficulty: 'advanced',
      category: 'color_grading',
      subcategory: 'workflow',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Professional Color Grading Workflow',
        'Node Structure Best Practices',
        'Efficient Grading Techniques',
      ],
      crossReferences: ['FM-8.1.2', 'FM-8.2.1'],
      prerequisiteIds: ['FM-8.1.2'],
    },
    {
      level: 8,
      moduleNumber: '8.3',
      assignmentNumber: 'FM-8.3.2',
      orderIndex: 71,
      title: 'Color Grading for Different Platforms',
      description: 'Grade for various output platforms: YouTube, Instagram, broadcast, cinema, understanding limitations and standards.',
      instructions: `1. Study Rec.709: Standard for HD video, YouTube, web
2. Learn DCI-P3: Wider gamut for cinema, modern displays
3. Practice Rec.2020: Ultra-wide gamut for HDR, future-proofing
4. Study Instagram/social: Considerations for mobile viewing, compression
5. Learn broadcast standards: Legal color limits, safe for transmission
6. Practice HDR grading: ST.2084 (PQ), HLG, wider dynamic range
7. Study platform-specific: YouTube HDR, Instagram filters impact
8. Learn delivery formats: Master grade, platform-specific versions
9. Practice testing: Viewing on target devices, compression testing
10. Create delivery versions for multiple platforms`,
      objectives: [
        'Understand different color spaces',
        'Grade for Rec.709, DCI-P3, Rec.2020',
        'Meet broadcast standards',
        'Optimize for social media',
        'Create HDR grades',
        'Deliver platform-specific versions',
      ],
      skills: ['Color spaces', 'Platform optimization', 'Broadcast standards', 'HDR grading', 'Multi-platform delivery'],
      expectedOutcome: 'Project delivered in multiple versions: Rec.709 YouTube, Instagram-optimized, broadcast-safe, HDR, all properly graded.',
      passingCriteria: 'All versions properly formatted, color spaces correct, broadcast legal, platform-optimized, quality maintained across deliverables',
      referencePhotos: ['/curriculum/filmmaking/color-spaces.jpg', '/curriculum/filmmaking/platform-delivery.jpg'],
      estimatedHours: 9,
      difficulty: 'advanced',
      category: 'color_grading',
      subcategory: 'delivery',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Color Spaces Explained',
        'Grading for Different Platforms',
        'HDR Workflow Guide',
      ],
      crossReferences: ['FM-5.3.2'],
    },
    {
      level: 8,
      moduleNumber: '8.3',
      assignmentNumber: 'FM-8.3.3',
      orderIndex: 72,
      title: 'Master Color Grading Project',
      description: 'Apply all Level 8 skills to create fully graded craft video with professional cinematic look.',
      instructions: `1. Develop color palette: Mood board, color scheme based on content
2. Perform primary correction: Balance, exposure, white balance across all clips
3. Match all shots: Consistent look throughout video
4. Create custom LUTs: Brand-specific look, reusable across projects
5. Apply secondary grading: Selective adjustments, sky, skin, products
6. Build cinematic look: Creative grade matching brand aesthetic
7. Add film characteristics: Grain, texture, halation for organic feel
8. Optimize for platforms: Create Rec.709 master and platform versions
9. Final polish: Vignettes, finishing touches, quality control
10. Deliver graded project in multiple formats`,
      objectives: [
        'Develop cohesive color palette',
        'Execute professional color correction',
        'Create custom cinematic look',
        'Apply advanced grading techniques',
        'Deliver multi-platform versions',
        'Achieve broadcast-quality grade',
      ],
      skills: ['Complete grading workflow', 'Look development', 'Professional execution', 'Multi-platform delivery'],
      expectedOutcome: '10-15 minute craft video professionally graded: custom look, balanced footage, cinematic feel, multiple delivery versions.',
      passingCriteria: 'Grade is professional and consistent, look is cinematic, all shots match, advanced techniques applied, broadcast-ready',
      referencePhotos: ['/curriculum/filmmaking/master-grading-project.jpg'],
      estimatedHours: 16,
      difficulty: 'advanced',
      category: 'projects',
      subcategory: 'grading_project',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Professional Color Grading Workflow',
        'Creating Signature Looks',
      ],
      crossReferences: ['FM-8.1.2', 'FM-8.2.1', 'FM-8.2.2', 'FM-8.3.1', 'FM-8.3.2'],
      prerequisiteIds: ['FM-8.1.2', 'FM-8.2.1', 'FM-8.3.1'],
    },

    // ========================================================================
    // LEVEL 9: STUDIO BUILD & Advanced Production
    // ========================================================================
    {
      level: 9,
      moduleNumber: '9.1',
      assignmentNumber: 'FM-9.1.1',
      orderIndex: 73,
      title: 'Studio Space Planning & Design',
      description: 'Design complete studio space: layout, workflow, equipment placement, storage, and efficient production environment.',
      instructions: `1. Study space requirements: Filming area, equipment storage, editing station
2. Learn workflow optimization: Efficient movement between stations
3. Practice room layout: Camera positions, lighting positions, backdrop area
4. Study acoustics: Sound treatment, reducing echo and noise
5. Learn electrical planning: Power requirements, circuit load, cable management
6. Practice equipment storage: Shelving, cases, organized accessibility
7. Study backdrop systems: Permanent vs portable, rail systems, storage
8. Learn climate control: Temperature, humidity for equipment longevity
9. Practice safety: Fire safety, electrical safety, ergonomics
10. Create complete studio floor plan and design`,
      objectives: [
        'Design efficient studio layout',
        'Plan workflow optimization',
        'Consider acoustic treatment',
        'Plan electrical requirements',
        'Design storage solutions',
        'Ensure safety and ergonomics',
      ],
      skills: ['Studio design', 'Space planning', 'Workflow optimization', 'Acoustics', 'Safety planning'],
      expectedOutcome: 'Complete studio design: floor plan, equipment layout, electrical plan, acoustic treatment plan, storage solutions.',
      passingCriteria: 'Design is practical and efficient, workflow optimized, acoustics addressed, electrical sufficient, safety considered',
      referencePhotos: ['/curriculum/filmmaking/studio-floor-plan.jpg', '/curriculum/filmmaking/studio-layout.jpg'],
      estimatedHours: 8,
      difficulty: 'advanced',
      category: 'studio',
      subcategory: 'planning',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Studio Design and Planning',
        'Acoustic Treatment for Video Studios',
        'Studio Electrical Requirements',
      ],
    },
    {
      level: 9,
      moduleNumber: '9.1',
      assignmentNumber: 'FM-9.1.2',
      orderIndex: 74,
      title: 'Permanent Lighting Installation',
      description: 'Install permanent studio lighting: overhead lights, background lights, key/fill positions, and lighting control.',
      instructions: `1. Study permanent mounting: Ceiling rails, grid systems, wall mounts
2. Learn overhead lighting: Shadowless work surface illumination
3. Practice background lighting: Even backdrop lighting, adjustable colors
4. Study key/fill positioning: Permanently mounted with flexibility
5. Learn lighting control: Dimmers, switches, DMX control systems
6. Practice cable management: Permanent routing, hiding cables, accessibility
7. Study power distribution: Dedicated circuits, proper load distribution
8. Learn maintenance access: Easy bulb changing, cleaning, adjustment
9. Practice safety: Secure mounting, heat management, electrical safety
10. Install complete permanent lighting system`,
      objectives: [
        'Install permanent lighting safely',
        'Create flexible lighting positions',
        'Implement lighting control',
        'Manage cables professionally',
        'Ensure proper power distribution',
        'Plan for maintenance',
      ],
      skills: ['Lighting installation', 'Permanent mounting', 'Electrical work', 'Cable management', 'Lighting control'],
      expectedOutcome: 'Complete permanent lighting system: overhead, background, key/fill positions, control system, professional installation.',
      passingCriteria: 'Lights securely mounted, positions flexible, cables managed, power distribution safe, control system functional',
      referencePhotos: ['/curriculum/filmmaking/permanent-lighting.jpg', '/curriculum/filmmaking/lighting-grid.jpg'],
      estimatedHours: 12,
      difficulty: 'advanced',
      category: 'studio',
      subcategory: 'lighting',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Permanent Studio Lighting Installation',
        'Lighting Control Systems',
        'Studio Electrical Safety',
      ],
      crossReferences: ['FM-3.3.1'],
      prerequisiteIds: ['FM-3.3.1'],
    },
    {
      level: 9,
      moduleNumber: '9.1',
      assignmentNumber: 'FM-9.1.3',
      orderIndex: 75,
      title: 'Overhead Camera Rig for Craft Videos',
      description: 'Build overhead camera mounting system for filming work surfaces, demonstrations, and top-down shots.',
      instructions: `1. Study overhead mounting options: C-stand with boom, ceiling mount, articulating arm
2. Learn camera positioning: Centered, parallel to surface, proper height
3. Practice stabilization: Secure mounting, preventing movement/vibration
4. Study camera control: Remote focus, tilt adjustment, monitoring
5. Learn lighting integration: Overhead camera + overhead lighting coordination
6. Practice cable management: Power, HDMI, control cables organized
7. Study multi-height setup: Adjustable height for different projects
8. Learn safety: Load capacity, secure mounting, fail-safes
9. Practice workflow: Easy camera mounting/removal, position adjustment
10. Build complete overhead camera system`,
      objectives: [
        'Mount overhead camera securely',
        'Position camera optimally',
        'Integrate with lighting',
        'Implement remote control',
        'Manage cables effectively',
        'Ensure safety and stability',
      ],
      skills: ['Overhead rigging', 'Camera mounting', 'Remote control', 'Integration', 'Safety'],
      expectedOutcome: 'Complete overhead camera system: secure mount, adjustable height, remote control, integrated with lighting, professional setup.',
      passingCriteria: 'Camera securely mounted, position optimal, no vibration, remote control functional, cables managed, safety ensured',
      referencePhotos: ['/curriculum/filmmaking/overhead-camera-rig.jpg', '/curriculum/filmmaking/overhead-setup.jpg'],
      estimatedHours: 10,
      difficulty: 'advanced',
      category: 'studio',
      subcategory: 'camera_rig',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Overhead Camera Mounting',
        'Top-Down Filming Techniques',
        'Camera Rig Safety',
      ],
      crossReferences: ['FM-7.1.3'],
    },
    {
      level: 9,
      moduleNumber: '9.2',
      assignmentNumber: 'FM-9.2.1',
      orderIndex: 76,
      title: 'Backdrop System & Seamless Paper',
      description: 'Install backdrop system with seamless paper for clean backgrounds, product photography, and professional look.',
      instructions: `1. Study backdrop systems: Wall-mounted, floor stands, ceiling-mounted
2. Learn seamless paper: Rolls, sweep technique, creating infinity curve
3. Practice paper installation: Mounting, creating sweep, securing
4. Study paper colors: White, black, grey, colored options
5. Learn paper management: Cutting, replacing, storage
6. Practice backdrop lighting: Even illumination, gradient control
7. Study alternative backdrops: Fabric, vinyl, collapsible backgrounds
8. Learn green screen: Setup, lighting, proper distance from subject
9. Practice quick changes: Swapping backdrops efficiently
10. Install complete backdrop system with multiple options`,
      objectives: [
        'Install backdrop system',
        'Create seamless paper sweep',
        'Light backdrops evenly',
        'Manage paper efficiently',
        'Set up green screen',
        'Enable quick backdrop changes',
      ],
      skills: ['Backdrop installation', 'Seamless paper', 'Backdrop lighting', 'Green screen', 'Efficient setup'],
      expectedOutcome: 'Complete backdrop system: rails, seamless paper sweep, multiple backdrop options, green screen, properly lit.',
      passingCriteria: 'System securely installed, paper sweep smooth, lighting even, green screen properly set, quick changes possible',
      referencePhotos: ['/curriculum/filmmaking/backdrop-system.jpg', '/curriculum/filmmaking/seamless-paper.jpg'],
      estimatedHours: 8,
      difficulty: 'intermediate',
      category: 'studio',
      subcategory: 'backdrops',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Backdrop Systems for Studios',
        'Seamless Paper Techniques',
        'Green Screen Setup',
      ],
    },
    {
      level: 9,
      moduleNumber: '9.2',
      assignmentNumber: 'FM-9.2.2',
      orderIndex: 77,
      title: 'Product Turntable & Automated Motion',
      description: 'Set up motorized turntable for 360° product videos and automated camera movements.',
      instructions: `1. Study turntable types: Manual, motorized, speed-controlled
2. Learn turntable setup: Centering product, proper lighting
3. Practice 360° filming: Complete rotation, consistent lighting
4. Study stop-motion turntables: Frame-by-frame rotation control
5. Learn speed control: Matching rotation speed to frame rate
6. Practice turntable lighting: Maintaining even lighting through rotation
7. Study slider automation: Motorized sliders for repeatable moves
8. Learn multi-axis motion: Combining turntable, slider, pan/tilt
9. Practice stitching software: Creating seamless 360° views
10. Create 360° product video with turntable`,
      objectives: [
        'Set up motorized turntable',
        'Film smooth 360° rotations',
        'Light products during rotation',
        'Control rotation speed',
        'Combine multiple motion axes',
        'Create professional 360° videos',
      ],
      skills: ['Turntable setup', '360° filming', 'Motion control', 'Product lighting', 'Automated motion'],
      expectedOutcome: 'Complete 360° product video: motorized turntable, consistent lighting, smooth rotation, professional quality.',
      passingCriteria: 'Turntable operates smoothly, product centered, lighting consistent, rotation speed appropriate, professional result',
      referencePhotos: ['/curriculum/filmmaking/product-turntable.jpg', '/curriculum/filmmaking/360-product-video.jpg'],
      estimatedHours: 9,
      difficulty: 'advanced',
      category: 'studio',
      subcategory: 'automation',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Product Turntable Setup',
        '360° Product Photography',
        'Motion Control Systems',
      ],
      crossReferences: ['FM-3.2.2'],
    },
    {
      level: 9,
      moduleNumber: '9.2',
      assignmentNumber: 'FM-9.2.3',
      orderIndex: 78,
      title: 'Studio Monitor Calibration & Color Accuracy',
      description: 'Calibrate editing monitors for accurate color representation and consistent grading results.',
      instructions: `1. Study monitor types: IPS panels, color gamut coverage, bit depth
2. Learn calibration tools: Hardware calibrators (X-Rite, Datacolor)
3. Practice monitor placement: Proper viewing distance, angle, ambient light
4. Study calibration settings: Brightness, contrast, color temperature, gamma
5. Learn color space: Rec.709, DCI-P3, matching project requirements
6. Practice regular calibration: Monthly recalibration, maintaining accuracy
7. Study ambient lighting: Controlled environment, neutral walls, bias lighting
8. Learn dual monitor setup: Reference monitor + GUI monitor
9. Practice verification: Test patterns, comparing to known references
10. Fully calibrate editing monitor setup`,
      objectives: [
        'Calibrate monitors accurately',
        'Set up proper viewing environment',
        'Maintain calibration schedule',
        'Configure dual monitor setup',
        'Ensure color accuracy',
        'Meet professional standards',
      ],
      skills: ['Monitor calibration', 'Color accuracy', 'Viewing environment', 'Professional standards'],
      expectedOutcome: 'Calibrated monitor setup: accurate colors, proper brightness, controlled environment, verified calibration.',
      passingCriteria: 'Monitors accurately calibrated, colors match reference, environment controlled, dual setup configured, professional standards met',
      referencePhotos: ['/curriculum/filmmaking/monitor-calibration.jpg', '/curriculum/filmmaking/editing-setup.jpg'],
      estimatedHours: 6,
      difficulty: 'intermediate',
      category: 'studio',
      subcategory: 'calibration',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Monitor Calibration Guide',
        'Color Accuracy for Video',
        'Professional Editing Environment',
      ],
      crossReferences: ['FM-8.1.2'],
    },
    {
      level: 9,
      moduleNumber: '9.3',
      assignmentNumber: 'FM-9.3.1',
      orderIndex: 79,
      title: 'Teleprompter Setup for Professional Delivery',
      description: 'Set up and use teleprompter for natural-looking scripted delivery while maintaining eye contact.',
      instructions: `1. Study teleprompter types: Tablet-based, dedicated, beam splitter glass
2. Learn teleprompter placement: Distance from camera, proper height
3. Practice script formatting: Font size, line length, pacing marks
4. Study reading technique: Natural delivery, maintaining eye contact
5. Learn scrolling speed: Matching comfortable reading pace
6. Practice remote control: Wireless control, pause/resume, speed adjustment
7. Study lighting considerations: Avoiding glass reflections
8. Learn script preparation: Breaking into segments, marking emphasis
9. Practice natural delivery: Not obviously reading, conversational tone
10. Record presentation using teleprompter`,
      objectives: [
        'Set up teleprompter correctly',
        'Format scripts for readability',
        'Read naturally while maintaining eye contact',
        'Control scrolling speed',
        'Avoid glass reflections',
        'Deliver professional presentations',
      ],
      skills: ['Teleprompter setup', 'Script formatting', 'On-camera reading', 'Natural delivery', 'Technical operation'],
      expectedOutcome: 'Professional presentation using teleprompter: natural delivery, eye contact maintained, proper pacing, script well-formatted.',
      passingCriteria: 'Setup correct, delivery appears natural, eye contact consistent, scrolling smooth, no reflections, professional quality',
      referencePhotos: ['/curriculum/filmmaking/teleprompter-setup.jpg', '/curriculum/filmmaking/script-formatting.jpg'],
      estimatedHours: 7,
      difficulty: 'intermediate',
      category: 'studio',
      subcategory: 'teleprompter',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Teleprompter Setup and Use',
        'Natural Delivery with Teleprompter',
        'Script Formatting for Video',
      ],
      crossReferences: ['FM-7.1.2'],
    },
    {
      level: 9,
      moduleNumber: '9.3',
      assignmentNumber: 'FM-9.3.2',
      orderIndex: 80,
      title: 'Live Streaming Setup for Craft Tutorials',
      description: 'Set up live streaming system for real-time craft demonstrations with multiple cameras, graphics, and interaction.',
      instructions: `1. Study streaming software: OBS Studio, vMix, StreamYard, platform selection
2. Learn multi-camera switching: Live switching between angles during stream
3. Practice scene composition: Lower thirds, overlays, graphics integration
4. Study audio mixing: Multiple sources, music ducking, clear sound
5. Learn streaming settings: Bitrate, resolution, platform requirements
6. Practice chat interaction: Reading and responding to comments live
7. Study internet requirements: Upload speed, wired vs wireless
8. Learn backup systems: Redundant internet, backup recording
9. Practice streaming workflow: Pre-stream check, during stream management
10. Conduct live streaming craft demonstration`,
      objectives: [
        'Set up streaming software',
        'Switch between cameras live',
        'Integrate graphics and overlays',
        'Mix audio sources',
        'Interact with live audience',
        'Ensure reliable streaming',
      ],
      skills: ['Live streaming', 'Multi-camera switching', 'Live graphics', 'Audience interaction', 'Technical operation'],
      expectedOutcome: 'Complete live stream: multiple cameras, graphics, clear audio, audience interaction, smooth technical operation.',
      passingCriteria: 'Stream is stable, camera switching smooth, graphics professional, audio clear, interaction engaging, technical issues minimal',
      referencePhotos: ['/curriculum/filmmaking/live-stream-setup.jpg', '/curriculum/filmmaking/obs-interface.jpg'],
      estimatedHours: 10,
      difficulty: 'advanced',
      category: 'studio',
      subcategory: 'streaming',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Live Streaming for Beginners',
        'OBS Studio Complete Guide',
        'Multi-Camera Live Production',
      ],
      crossReferences: ['FM-7.2.2'],
    },
    {
      level: 9,
      moduleNumber: '9.3',
      assignmentNumber: 'FM-9.3.3',
      orderIndex: 81,
      title: 'Master Studio Project - Complete Production System',
      description: 'Integrate all Level 9 skills to create complete, professional studio production system for craft content.',
      instructions: `1. Design complete studio: Layout, permanent lighting, backdrop system, overhead rig
2. Install all systems: Lighting, backdrops, camera positions, audio setup
3. Set up production workflow: Filming stations, editing station, storage
4. Integrate technology: Monitors, teleprompter, streaming setup, control systems
5. Configure for efficiency: Quick setup changes, workflow optimization
6. Implement quality control: Calibrated monitors, accurate audio monitoring
7. Create studio documentation: Equipment list, setup guides, troubleshooting
8. Establish maintenance schedule: Calibration, cleaning, equipment checks
9. Optimize for multiple production types: Single camera, multi-cam, streaming, products
10. Produce complete craft video using full studio capabilities`,
      objectives: [
        'Build complete professional studio',
        'Integrate all production systems',
        'Optimize workflow efficiency',
        'Ensure broadcast quality',
        'Document all systems',
        'Produce professional content',
      ],
      skills: ['Complete studio build', 'Systems integration', 'Workflow optimization', 'Professional production', 'Quality control'],
      expectedOutcome: 'Complete professional studio: all systems installed and integrated, workflow optimized, documentation complete, producing broadcast-quality content.',
      passingCriteria: 'All systems professionally installed, integration seamless, workflow efficient, quality broadcast-standard, documentation thorough',
      referencePhotos: ['/curriculum/filmmaking/complete-studio.jpg'],
      estimatedHours: 20,
      difficulty: 'advanced',
      category: 'projects',
      subcategory: 'studio_project',
      serviceTrack: 'filmmaking' as ServiceTrack,
      requiredReading: [
        'Professional Studio Building',
        'Production System Integration',
        'Broadcast Quality Standards',
      ],
      crossReferences: ['FM-9.1.1', 'FM-9.1.2', 'FM-9.1.3', 'FM-9.2.1', 'FM-9.2.2', 'FM-9.3.1', 'FM-9.3.2'],
      prerequisiteIds: ['FM-9.1.2', 'FM-9.1.3'],
    },
  ]

  // Insert all assignments
  for (const assignment of assignments) {
    await prisma.assignmentTemplate.upsert({
      where: { assignmentNumber: assignment.assignmentNumber },
      update: assignment,
      create: assignment,
    })
  }

  console.log(`✅ Seeded ${assignments.length} Filmmaking & Video Production assignments`)
}

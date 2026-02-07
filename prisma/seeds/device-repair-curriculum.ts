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

const deviceRepairCurriculum: AssignmentTemplateData[] = [
  // ============================================================================
  // LEVEL 1: FOUNDATIONS (Assignments 1-10)
  // ============================================================================

  // Module 1.1: Safety & ESD
  {
    level: 1,
    moduleNumber: '1.1',
    assignmentNumber: 'DR-1.1.1',
    orderIndex: 1,
    title: 'Electrostatic Discharge (ESD) Safety',
    description: 'Learn the critical importance of ESD protection when handling electronic components. Static electricity can destroy sensitive components instantly.',
    instructions: `1. Study ESD fundamentals and how static damages electronics
2. Learn proper grounding techniques using wrist straps and mats
3. Practice setting up an ESD-safe workstation
4. Demonstrate proper component handling procedures
5. Take the ESD safety certification test`,
    objectives: [
      'Understand how ESD damages electronic components',
      'Properly use ESD wrist straps, mats, and bags',
      'Set up an ESD-safe workspace',
      'Handle sensitive components without causing damage',
    ],
    skills: ['ESD safety', 'Grounding techniques', 'Component handling'],
    expectedOutcome: 'Demonstrate complete ESD-safe workstation setup and proper component handling.',
    passingCriteria: 'Score 100% on ESD safety certification test',
    referencePhotos: ['/curriculum/repair/esd-wriststrap.jpg', '/curriculum/repair/esd-mat.jpg'],
    estimatedHours: 4,
    difficulty: 'beginner',
    category: 'safety',
    subcategory: 'esd',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 1,
    moduleNumber: '1.1',
    assignmentNumber: 'DR-1.1.2',
    orderIndex: 2,
    title: 'Workshop Safety & Chemical Handling',
    description: 'Learn essential safety protocols for the repair workshop including chemical handling, ventilation, and emergency procedures.',
    instructions: `1. Review MSDS sheets for common repair chemicals
2. Learn proper ventilation requirements for soldering
3. Study fire safety and extinguisher locations
4. Practice first aid for common workshop injuries
5. Complete safety checklist for your workstation`,
    objectives: [
      'Handle isopropyl alcohol, flux, and cleaning chemicals safely',
      'Understand ventilation needs for soldering and adhesive work',
      'Know location and use of safety equipment',
      'Apply first aid for burns and chemical exposure',
    ],
    skills: ['Chemical safety', 'Ventilation', 'Emergency response'],
    expectedOutcome: 'Complete workshop safety audit and demonstrate proper chemical handling.',
    passingCriteria: 'Pass safety audit with no deficiencies',
    referencePhotos: ['/curriculum/repair/safety-equipment.jpg', '/curriculum/repair/ventilation.jpg'],
    estimatedHours: 3,
    difficulty: 'beginner',
    category: 'safety',
    subcategory: 'workshop',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 1.2: Tool Identification
  {
    level: 1,
    moduleNumber: '1.2',
    assignmentNumber: 'DR-1.2.1',
    orderIndex: 3,
    title: 'Basic Repair Tool Identification',
    description: 'Learn to identify and properly use all essential electronic repair tools.',
    instructions: `1. Study each tool in the basic repair toolkit
2. Learn proper names and uses for each screwdriver type
3. Practice using spudgers and pry tools without damage
4. Understand suction cup and opening pick techniques
5. Complete tool identification test`,
    objectives: [
      'Identify pentalobe, tri-wing, Phillips, flathead, and Torx screwdrivers',
      'Use plastic spudgers, metal pry tools, and opening picks properly',
      'Understand when to use each tool type',
      'Maintain and organize tools correctly',
    ],
    skills: ['Tool identification', 'Proper tool use', 'Tool maintenance'],
    expectedOutcome: 'Correctly identify and demonstrate use of 20+ basic repair tools.',
    passingCriteria: 'Score 95% on tool identification test',
    referencePhotos: ['/curriculum/repair/toolkit.jpg', '/curriculum/repair/screwdrivers.jpg'],
    estimatedHours: 6,
    difficulty: 'beginner',
    category: 'tools',
    subcategory: 'basic',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 1,
    moduleNumber: '1.2',
    assignmentNumber: 'DR-1.2.2',
    orderIndex: 4,
    title: 'Precision Instruments & Measuring Tools',
    description: 'Learn to use multimeters, calipers, and other precision measuring instruments.',
    instructions: `1. Study multimeter functions and safety
2. Practice measuring voltage, current, and resistance
3. Learn to use digital calipers for component sizing
4. Practice using magnification tools and microscopes
5. Complete precision measurement exercises`,
    objectives: [
      'Use a multimeter for basic electrical measurements',
      'Measure component dimensions with digital calipers',
      'Use magnification effectively for small components',
      'Record measurements accurately',
    ],
    skills: ['Multimeter use', 'Precision measurement', 'Documentation'],
    expectedOutcome: 'Demonstrate accurate measurements using all precision instruments.',
    passingCriteria: 'Complete measurement exercises with 98% accuracy',
    referencePhotos: ['/curriculum/repair/multimeter.jpg', '/curriculum/repair/calipers.jpg'],
    estimatedHours: 6,
    difficulty: 'beginner',
    category: 'tools',
    subcategory: 'precision',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 1.3: Device Anatomy
  {
    level: 1,
    moduleNumber: '1.3',
    assignmentNumber: 'DR-1.3.1',
    orderIndex: 5,
    title: 'Smartphone Anatomy & Components',
    description: 'Learn the internal structure and components of modern smartphones.',
    instructions: `1. Study teardown diagrams of common smartphone models
2. Identify all major components: display, battery, logic board, cameras
3. Learn connector types: flex cables, FPC, ZIF
4. Understand antenna placement and design
5. Complete component identification quiz`,
    objectives: [
      'Identify all major smartphone components',
      'Understand how components connect',
      'Know common connector types and their handling',
      'Recognize differences between manufacturers',
    ],
    skills: ['Component identification', 'Device architecture', 'Connector knowledge'],
    expectedOutcome: 'Correctly label all components on teardown diagrams.',
    passingCriteria: 'Score 90% on component identification quiz',
    referencePhotos: ['/curriculum/repair/phone-teardown.jpg', '/curriculum/repair/phone-components.jpg'],
    estimatedHours: 8,
    difficulty: 'beginner',
    category: 'anatomy',
    subcategory: 'smartphone',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 1,
    moduleNumber: '1.3',
    assignmentNumber: 'DR-1.3.2',
    orderIndex: 6,
    title: 'Laptop & Computer Anatomy',
    description: 'Learn the internal structure of laptops and desktop computers.',
    instructions: `1. Study motherboard layouts and component placement
2. Identify CPU, RAM, storage, and expansion slots
3. Learn cooling system components: fans, heatsinks, thermal paste
4. Understand power delivery systems
5. Practice component removal and reinstallation`,
    objectives: [
      'Identify all major computer components',
      'Understand motherboard architecture',
      'Know cooling system design and importance',
      'Recognize component compatibility issues',
    ],
    skills: ['PC anatomy', 'Component identification', 'Cooling systems'],
    expectedOutcome: 'Correctly identify all components and their functions.',
    passingCriteria: 'Pass practical component identification test',
    referencePhotos: ['/curriculum/repair/laptop-teardown.jpg', '/curriculum/repair/motherboard.jpg'],
    estimatedHours: 10,
    difficulty: 'beginner',
    category: 'anatomy',
    subcategory: 'computer',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 1.4: Diagnostic Basics
  {
    level: 1,
    moduleNumber: '1.4',
    assignmentNumber: 'DR-1.4.1',
    orderIndex: 7,
    title: 'Software Diagnostic Tools',
    description: 'Learn to use diagnostic software for initial device assessment.',
    instructions: `1. Study common diagnostic software for iOS and Android
2. Learn to run hardware tests: display, touch, battery, sensors
3. Practice reading diagnostic reports
4. Understand error codes and their meanings
5. Document diagnostic procedures`,
    objectives: [
      'Run comprehensive hardware diagnostics',
      'Interpret diagnostic results correctly',
      'Identify common error codes',
      'Document findings for customer communication',
    ],
    skills: ['Diagnostic software', 'Error interpretation', 'Documentation'],
    expectedOutcome: 'Complete diagnostic assessment on 5 different devices.',
    passingCriteria: 'Correctly diagnose issues on test devices',
    referencePhotos: ['/curriculum/repair/diagnostics.jpg', '/curriculum/repair/diagnostic-software.jpg'],
    estimatedHours: 8,
    difficulty: 'beginner',
    category: 'diagnostics',
    subcategory: 'software',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 1,
    moduleNumber: '1.4',
    assignmentNumber: 'DR-1.4.2',
    orderIndex: 8,
    title: 'Visual & Physical Inspection',
    description: 'Master the art of visual inspection to identify device issues.',
    instructions: `1. Learn systematic inspection procedures
2. Practice identifying water damage indicators
3. Study common physical damage patterns
4. Use magnification for detailed inspection
5. Document findings with photos`,
    objectives: [
      'Conduct thorough visual inspections',
      'Identify water damage, physical damage, and wear',
      'Use proper lighting and magnification',
      'Create detailed inspection reports',
    ],
    skills: ['Visual inspection', 'Damage assessment', 'Documentation'],
    expectedOutcome: 'Complete detailed inspection reports for 10 devices.',
    passingCriteria: 'Accurately identify 95% of issues on test devices',
    referencePhotos: ['/curriculum/repair/inspection.jpg', '/curriculum/repair/water-damage.jpg'],
    estimatedHours: 6,
    difficulty: 'beginner',
    category: 'diagnostics',
    subcategory: 'inspection',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 1.5: Customer Service Fundamentals
  {
    level: 1,
    moduleNumber: '1.5',
    assignmentNumber: 'DR-1.5.1',
    orderIndex: 9,
    title: 'Customer Intake Procedures',
    description: 'Learn professional customer intake and communication skills.',
    instructions: `1. Study the intake form and checklist
2. Practice gathering device history from customers
3. Learn to set realistic expectations
4. Document device condition at intake
5. Practice explaining technical issues in simple terms`,
    objectives: [
      'Conduct professional customer intake',
      'Gather complete device history',
      'Set realistic repair expectations',
      'Document pre-existing conditions',
    ],
    skills: ['Customer service', 'Communication', 'Documentation'],
    expectedOutcome: 'Complete 10 mock customer intakes with accurate documentation.',
    passingCriteria: 'Pass role-play evaluation with mentor',
    referencePhotos: ['/curriculum/repair/customer-intake.jpg'],
    estimatedHours: 6,
    difficulty: 'beginner',
    category: 'customer-service',
    subcategory: 'intake',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 1,
    moduleNumber: '1.5',
    assignmentNumber: 'DR-1.5.2',
    orderIndex: 10,
    title: 'Quote Estimation Basics',
    description: 'Learn to create accurate repair quotes for customers.',
    instructions: `1. Study pricing structure for common repairs
2. Learn to estimate labor time accurately
3. Practice sourcing parts and calculating costs
4. Create clear, itemized quotes
5. Practice explaining quotes to customers`,
    objectives: [
      'Create accurate repair estimates',
      'Source parts and calculate costs',
      'Present quotes professionally',
      'Handle price objections appropriately',
    ],
    skills: ['Pricing', 'Estimation', 'Customer communication'],
    expectedOutcome: 'Create 20 accurate quotes for various repair scenarios.',
    passingCriteria: 'Quotes within 10% of actual repair costs',
    referencePhotos: ['/curriculum/repair/quote-example.jpg'],
    estimatedHours: 8,
    difficulty: 'beginner',
    category: 'customer-service',
    subcategory: 'quoting',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // ============================================================================
  // LEVEL 2: PHONE REPAIR (Assignments 11-25)
  // ============================================================================

  // Module 2.1: Screen Replacement
  {
    level: 2,
    moduleNumber: '2.1',
    assignmentNumber: 'DR-2.1.1',
    orderIndex: 11,
    title: 'iPhone Screen Replacement - Basics',
    description: 'Master the fundamentals of iPhone screen replacement on common models.',
    instructions: `1. Study iPhone opening procedures for different generations
2. Practice heat application and adhesive softening
3. Learn proper flex cable disconnection sequence
4. Practice screen alignment and testing
5. Complete 5 supervised screen replacements`,
    objectives: [
      'Safely open iPhone devices without damage',
      'Properly disconnect and reconnect display cables',
      'Test screen functionality before reassembly',
      'Apply adhesive correctly for water resistance',
    ],
    skills: ['iPhone repair', 'Screen replacement', 'Adhesive work'],
    expectedOutcome: 'Complete 5 successful iPhone screen replacements.',
    passingCriteria: 'All 5 repairs pass quality inspection',
    referencePhotos: ['/curriculum/repair/iphone-screen.jpg', '/curriculum/repair/screen-cables.jpg'],
    estimatedHours: 12,
    difficulty: 'beginner',
    category: 'phone-repair',
    subcategory: 'screen',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 2,
    moduleNumber: '2.1',
    assignmentNumber: 'DR-2.1.2',
    orderIndex: 12,
    title: 'Samsung Screen Replacement',
    description: 'Learn screen replacement techniques for Samsung Galaxy devices.',
    instructions: `1. Study Samsung display technologies (AMOLED vs LCD)
2. Practice rear glass removal techniques
3. Learn motherboard removal procedures
4. Master screen separation using heat and tools
5. Complete 5 supervised Samsung screen replacements`,
    objectives: [
      'Understand Samsung assembly differences from iPhone',
      'Use heat safely for adhesive removal',
      'Handle curved edge displays properly',
      'Apply waterproofing adhesive correctly',
    ],
    skills: ['Samsung repair', 'AMOLED handling', 'Curved display work'],
    expectedOutcome: 'Complete 5 successful Samsung screen replacements.',
    passingCriteria: 'All 5 repairs pass quality inspection',
    referencePhotos: ['/curriculum/repair/samsung-screen.jpg', '/curriculum/repair/amoled-display.jpg'],
    estimatedHours: 14,
    difficulty: 'beginner',
    category: 'phone-repair',
    subcategory: 'screen',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 2,
    moduleNumber: '2.1',
    assignmentNumber: 'DR-2.1.3',
    orderIndex: 13,
    title: 'LCD vs OLED Calibration',
    description: 'Learn to calibrate and test different display technologies.',
    instructions: `1. Study differences between LCD, OLED, and AMOLED
2. Learn True Tone and color calibration procedures
3. Practice touch sensitivity testing
4. Understand brightness and contrast standards
5. Complete calibration on 10 displays`,
    objectives: [
      'Calibrate True Tone on iPhone displays',
      'Test and verify touch responsiveness',
      'Verify color accuracy and brightness',
      'Document calibration results',
    ],
    skills: ['Display calibration', 'Color accuracy', 'Touch testing'],
    expectedOutcome: 'Successfully calibrate 10 displays to factory specifications.',
    passingCriteria: 'All displays pass calibration verification',
    referencePhotos: ['/curriculum/repair/calibration.jpg', '/curriculum/repair/color-test.jpg'],
    estimatedHours: 8,
    difficulty: 'intermediate',
    category: 'phone-repair',
    subcategory: 'calibration',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 2.2: Battery Replacement
  {
    level: 2,
    moduleNumber: '2.2',
    assignmentNumber: 'DR-2.2.1',
    orderIndex: 14,
    title: 'Battery Safety & Handling',
    description: 'Critical training on lithium-ion battery safety and proper handling.',
    instructions: `1. Study lithium-ion battery chemistry and risks
2. Learn proper battery storage and disposal
3. Practice safe battery removal techniques
4. Understand thermal runaway and prevention
5. Complete battery safety certification`,
    objectives: [
      'Handle lithium batteries safely',
      'Recognize damaged or swollen batteries',
      'Use proper tools for battery removal',
      'Know emergency procedures for battery fires',
    ],
    skills: ['Battery safety', 'Risk assessment', 'Emergency response'],
    expectedOutcome: 'Pass battery safety certification with 100% score.',
    passingCriteria: 'Score 100% on safety certification',
    referencePhotos: ['/curriculum/repair/battery-safety.jpg', '/curriculum/repair/swollen-battery.jpg'],
    estimatedHours: 4,
    difficulty: 'beginner',
    category: 'phone-repair',
    subcategory: 'battery',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 2,
    moduleNumber: '2.2',
    assignmentNumber: 'DR-2.2.2',
    orderIndex: 15,
    title: 'iPhone Battery Replacement',
    description: 'Master battery replacement on various iPhone models.',
    instructions: `1. Study battery adhesive patterns for different iPhone models
2. Practice adhesive tab removal techniques
3. Learn to use isopropyl alcohol for stuck batteries
4. Practice battery health calibration after replacement
5. Complete 10 supervised battery replacements`,
    objectives: [
      'Remove batteries without damage or bending',
      'Apply new adhesive correctly',
      'Calibrate battery after installation',
      'Verify battery health readings',
    ],
    skills: ['Battery replacement', 'Adhesive removal', 'Calibration'],
    expectedOutcome: 'Complete 10 successful iPhone battery replacements.',
    passingCriteria: 'All batteries show 100% health after calibration',
    referencePhotos: ['/curriculum/repair/iphone-battery.jpg', '/curriculum/repair/battery-tabs.jpg'],
    estimatedHours: 10,
    difficulty: 'beginner',
    category: 'phone-repair',
    subcategory: 'battery',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 2.3: Charging & Power
  {
    level: 2,
    moduleNumber: '2.3',
    assignmentNumber: 'DR-2.3.1',
    orderIndex: 16,
    title: 'Charging Port Diagnosis',
    description: 'Learn to diagnose charging issues and determine repair needs.',
    instructions: `1. Study common charging port issues
2. Practice inspecting ports with magnification
3. Learn to test charging ICs and circuitry
4. Diagnose between port damage and IC failure
5. Complete diagnostic exercises`,
    objectives: [
      'Identify lint, debris, and corrosion',
      'Test charging port connectivity',
      'Diagnose charging IC vs port issues',
      'Recommend appropriate repairs',
    ],
    skills: ['Charging diagnostics', 'Port inspection', 'Circuit testing'],
    expectedOutcome: 'Accurately diagnose charging issues on 20 devices.',
    passingCriteria: 'Achieve 90% diagnostic accuracy',
    referencePhotos: ['/curriculum/repair/charging-port.jpg', '/curriculum/repair/port-damage.jpg'],
    estimatedHours: 6,
    difficulty: 'intermediate',
    category: 'phone-repair',
    subcategory: 'charging',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 2,
    moduleNumber: '2.3',
    assignmentNumber: 'DR-2.3.2',
    orderIndex: 17,
    title: 'Charging Port Replacement',
    description: 'Replace charging ports on common smartphone models.',
    instructions: `1. Study charging port assembly designs
2. Practice flex cable routing and connection
3. Learn proper torque for port mounting
4. Test functionality before reassembly
5. Complete 5 supervised port replacements`,
    objectives: [
      'Remove charging port assemblies safely',
      'Route flex cables correctly',
      'Ensure proper port alignment',
      'Verify all charging and data functions',
    ],
    skills: ['Port replacement', 'Flex cable handling', 'Testing'],
    expectedOutcome: 'Complete 5 successful charging port replacements.',
    passingCriteria: 'All ports charge and transfer data properly',
    referencePhotos: ['/curriculum/repair/port-replacement.jpg', '/curriculum/repair/flex-cable.jpg'],
    estimatedHours: 10,
    difficulty: 'intermediate',
    category: 'phone-repair',
    subcategory: 'charging',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 2.4: Audio Components
  {
    level: 2,
    moduleNumber: '2.4',
    assignmentNumber: 'DR-2.4.1',
    orderIndex: 18,
    title: 'Speaker & Microphone Repair',
    description: 'Diagnose and replace speaker and microphone components.',
    instructions: `1. Study speaker and microphone locations in devices
2. Learn audio testing procedures
3. Practice speaker replacement techniques
4. Understand mesh and gasket requirements
5. Complete 5 audio component repairs`,
    objectives: [
      'Diagnose audio issues accurately',
      'Replace speakers without damage',
      'Install microphones with proper sealing',
      'Verify audio quality after repair',
    ],
    skills: ['Audio diagnostics', 'Speaker replacement', 'Microphone repair'],
    expectedOutcome: 'Complete 5 successful audio component repairs.',
    passingCriteria: 'All audio functions pass quality testing',
    referencePhotos: ['/curriculum/repair/speaker.jpg', '/curriculum/repair/microphone.jpg'],
    estimatedHours: 8,
    difficulty: 'intermediate',
    category: 'phone-repair',
    subcategory: 'audio',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 2.5: Camera Systems
  {
    level: 2,
    moduleNumber: '2.5',
    assignmentNumber: 'DR-2.5.1',
    orderIndex: 19,
    title: 'Camera Module Replacement',
    description: 'Replace front and rear camera modules in smartphones.',
    instructions: `1. Study camera module designs and connectors
2. Learn proper handling of camera sensors
3. Practice lens cleaning and alignment
4. Test camera functions after replacement
5. Complete 5 camera module replacements`,
    objectives: [
      'Handle camera modules without damage',
      'Clean sensors and lenses properly',
      'Align cameras correctly',
      'Verify autofocus and image quality',
    ],
    skills: ['Camera replacement', 'Sensor handling', 'Optical cleaning'],
    expectedOutcome: 'Complete 5 successful camera replacements.',
    passingCriteria: 'All camera functions work correctly',
    referencePhotos: ['/curriculum/repair/camera-module.jpg', '/curriculum/repair/lens-cleaning.jpg'],
    estimatedHours: 8,
    difficulty: 'intermediate',
    category: 'phone-repair',
    subcategory: 'camera',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 2.6: Software Troubleshooting
  {
    level: 2,
    moduleNumber: '2.6',
    assignmentNumber: 'DR-2.6.1',
    orderIndex: 20,
    title: 'iOS Troubleshooting',
    description: 'Diagnose and resolve common iOS software issues.',
    instructions: `1. Study iOS recovery and DFU modes
2. Practice backup and restore procedures
3. Learn to resolve update failures
4. Diagnose activation lock issues
5. Complete 10 iOS troubleshooting cases`,
    objectives: [
      'Perform iOS recovery and updates',
      'Backup and restore customer data',
      'Resolve boot loop and crash issues',
      'Handle activation lock appropriately',
    ],
    skills: ['iOS recovery', 'Data backup', 'Software troubleshooting'],
    expectedOutcome: 'Successfully resolve iOS issues on 10 devices.',
    passingCriteria: 'Achieve 90% success rate on test cases',
    referencePhotos: ['/curriculum/repair/ios-recovery.jpg', '/curriculum/repair/dfu-mode.jpg'],
    estimatedHours: 10,
    difficulty: 'intermediate',
    category: 'phone-repair',
    subcategory: 'software',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 2,
    moduleNumber: '2.6',
    assignmentNumber: 'DR-2.6.2',
    orderIndex: 21,
    title: 'Android Troubleshooting',
    description: 'Diagnose and resolve common Android software issues.',
    instructions: `1. Study Android recovery and factory reset modes
2. Practice ADB and Fastboot commands
3. Learn to flash firmware safely
4. Resolve bootloop and ROM issues
5. Complete 10 Android troubleshooting cases`,
    objectives: [
      'Use ADB and Fastboot effectively',
      'Flash firmware and recover devices',
      'Resolve Google account locks',
      'Backup and restore Android data',
    ],
    skills: ['Android recovery', 'ADB commands', 'Firmware flashing'],
    expectedOutcome: 'Successfully resolve Android issues on 10 devices.',
    passingCriteria: 'Achieve 90% success rate on test cases',
    referencePhotos: ['/curriculum/repair/android-recovery.jpg', '/curriculum/repair/adb.jpg'],
    estimatedHours: 10,
    difficulty: 'intermediate',
    category: 'phone-repair',
    subcategory: 'software',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 2.7: Water Damage
  {
    level: 2,
    moduleNumber: '2.7',
    assignmentNumber: 'DR-2.7.1',
    orderIndex: 22,
    title: 'Water Damage Assessment & Treatment',
    description: 'Learn to assess and treat water-damaged devices.',
    instructions: `1. Study water damage indicators and corrosion patterns
2. Learn ultrasonic cleaning procedures
3. Practice board cleaning with isopropyl alcohol
4. Understand corrosion prevention
5. Complete 5 water damage treatments`,
    objectives: [
      'Assess extent of water damage',
      'Clean boards using ultrasonic bath',
      'Remove corrosion without damage',
      'Advise customers on success probability',
    ],
    skills: ['Water damage repair', 'Ultrasonic cleaning', 'Corrosion removal'],
    expectedOutcome: 'Successfully treat 5 water-damaged devices.',
    passingCriteria: 'Achieve 60% recovery rate on treatable devices',
    referencePhotos: ['/curriculum/repair/water-damage-board.jpg', '/curriculum/repair/ultrasonic.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'phone-repair',
    subcategory: 'water-damage',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 2.8: Common Repairs Practice
  {
    level: 2,
    moduleNumber: '2.8',
    assignmentNumber: 'DR-2.8.1',
    orderIndex: 23,
    title: 'Button & Switch Replacement',
    description: 'Replace physical buttons and switches in smartphones.',
    instructions: `1. Study button assembly designs
2. Practice power and volume button replacement
3. Learn mute switch repair techniques
4. Test button function and feel
5. Complete 5 button replacements`,
    objectives: [
      'Replace power and volume buttons',
      'Repair or replace mute switches',
      'Ensure proper button feel and function',
      'Handle tiny components carefully',
    ],
    skills: ['Button repair', 'Small component handling', 'Testing'],
    expectedOutcome: 'Complete 5 successful button replacements.',
    passingCriteria: 'All buttons function correctly',
    referencePhotos: ['/curriculum/repair/buttons.jpg', '/curriculum/repair/power-button.jpg'],
    estimatedHours: 6,
    difficulty: 'intermediate',
    category: 'phone-repair',
    subcategory: 'buttons',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 2,
    moduleNumber: '2.8',
    assignmentNumber: 'DR-2.8.2',
    orderIndex: 24,
    title: 'Back Glass Replacement',
    description: 'Replace back glass on modern smartphones.',
    instructions: `1. Study back glass removal techniques
2. Practice using heat and laser machines
3. Learn adhesive application methods
4. Ensure camera lens alignment
5. Complete 5 back glass replacements`,
    objectives: [
      'Remove back glass without internal damage',
      'Use appropriate heat levels',
      'Apply adhesive correctly',
      'Align camera cutouts precisely',
    ],
    skills: ['Glass removal', 'Adhesive work', 'Heat application'],
    expectedOutcome: 'Complete 5 successful back glass replacements.',
    passingCriteria: 'All devices pass visual and function inspection',
    referencePhotos: ['/curriculum/repair/back-glass.jpg', '/curriculum/repair/laser-machine.jpg'],
    estimatedHours: 10,
    difficulty: 'intermediate',
    category: 'phone-repair',
    subcategory: 'housing',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 2,
    moduleNumber: '2.8',
    assignmentNumber: 'DR-2.8.3',
    orderIndex: 25,
    title: 'Phone Repair Practical Exam',
    description: 'Demonstrate comprehensive phone repair skills in a timed practical exam.',
    instructions: `1. Complete screen replacement under time pressure
2. Diagnose unknown issue on test device
3. Perform battery replacement with calibration
4. Replace charging port or speaker
5. Document all work professionally`,
    objectives: [
      'Complete repairs efficiently and accurately',
      'Diagnose issues without assistance',
      'Document work to professional standards',
      'Handle customer scenarios appropriately',
    ],
    skills: ['Time management', 'Independent work', 'Quality control'],
    expectedOutcome: 'Pass comprehensive practical exam.',
    passingCriteria: 'Score 85% or higher on practical exam',
    referencePhotos: ['/curriculum/repair/practical-exam.jpg'],
    estimatedHours: 8,
    difficulty: 'intermediate',
    category: 'phone-repair',
    subcategory: 'exam',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // ============================================================================
  // LEVEL 3: COMPUTER REPAIR (Assignments 26-40)
  // ============================================================================

  // Module 3.1: Storage Upgrades
  {
    level: 3,
    moduleNumber: '3.1',
    assignmentNumber: 'DR-3.1.1',
    orderIndex: 26,
    title: 'HDD to SSD Upgrade',
    description: 'Upgrade traditional hard drives to solid-state drives.',
    instructions: `1. Study HDD and SSD differences and form factors
2. Practice drive cloning procedures
3. Learn partition management
4. Install and verify SSD function
5. Complete 5 HDD to SSD upgrades`,
    objectives: [
      'Clone drives without data loss',
      'Install SSDs in various laptop models',
      'Verify drive performance after upgrade',
      'Handle customer data responsibly',
    ],
    skills: ['Drive cloning', 'SSD installation', 'Data migration'],
    expectedOutcome: 'Complete 5 successful SSD upgrades.',
    passingCriteria: 'All upgrades successful with data intact',
    referencePhotos: ['/curriculum/repair/ssd-upgrade.jpg', '/curriculum/repair/drive-cloning.jpg'],
    estimatedHours: 10,
    difficulty: 'intermediate',
    category: 'computer-repair',
    subcategory: 'storage',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 3,
    moduleNumber: '3.1',
    assignmentNumber: 'DR-3.1.2',
    orderIndex: 27,
    title: 'NVMe & M.2 Drive Installation',
    description: 'Install modern NVMe drives in laptops and desktops.',
    instructions: `1. Study M.2 slot types and NVMe compatibility
2. Learn thermal pad and heatsink installation
3. Practice BIOS configuration for NVMe
4. Complete fresh OS installation on NVMe
5. Complete 5 NVMe installations`,
    objectives: [
      'Identify M.2 slot types correctly',
      'Install NVMe drives with cooling',
      'Configure BIOS for boot drive',
      'Verify NVMe performance',
    ],
    skills: ['NVMe installation', 'BIOS configuration', 'Thermal management'],
    expectedOutcome: 'Complete 5 successful NVMe installations.',
    passingCriteria: 'All drives achieve expected speeds',
    referencePhotos: ['/curriculum/repair/nvme-drive.jpg', '/curriculum/repair/m2-slot.jpg'],
    estimatedHours: 8,
    difficulty: 'intermediate',
    category: 'computer-repair',
    subcategory: 'storage',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 3.2: RAM Upgrades
  {
    level: 3,
    moduleNumber: '3.2',
    assignmentNumber: 'DR-3.2.1',
    orderIndex: 28,
    title: 'RAM Upgrade & Troubleshooting',
    description: 'Upgrade and troubleshoot RAM in computers.',
    instructions: `1. Study RAM types, speeds, and compatibility
2. Practice RAM installation and removal
3. Learn to diagnose RAM failures
4. Use memory testing software
5. Complete 5 RAM upgrades`,
    objectives: [
      'Select compatible RAM modules',
      'Install RAM correctly without damage',
      'Diagnose RAM-related issues',
      'Verify system stability after upgrade',
    ],
    skills: ['RAM installation', 'Compatibility checking', 'Memory testing'],
    expectedOutcome: 'Complete 5 successful RAM upgrades.',
    passingCriteria: 'All systems stable after upgrade',
    referencePhotos: ['/curriculum/repair/ram-upgrade.jpg', '/curriculum/repair/ram-slots.jpg'],
    estimatedHours: 6,
    difficulty: 'intermediate',
    category: 'computer-repair',
    subcategory: 'ram',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 3.3: Operating System
  {
    level: 3,
    moduleNumber: '3.3',
    assignmentNumber: 'DR-3.3.1',
    orderIndex: 29,
    title: 'Windows Installation & Drivers',
    description: 'Perform clean Windows installations and driver management.',
    instructions: `1. Create bootable Windows installation media
2. Practice partition management during install
3. Learn driver installation best practices
4. Configure Windows for optimal performance
5. Complete 5 Windows installations`,
    objectives: [
      'Install Windows cleanly and efficiently',
      'Manage partitions appropriately',
      'Install all required drivers',
      'Configure system settings correctly',
    ],
    skills: ['Windows installation', 'Driver management', 'System configuration'],
    expectedOutcome: 'Complete 5 successful Windows installations.',
    passingCriteria: 'All systems fully functional with all drivers',
    referencePhotos: ['/curriculum/repair/windows-install.jpg', '/curriculum/repair/drivers.jpg'],
    estimatedHours: 10,
    difficulty: 'intermediate',
    category: 'computer-repair',
    subcategory: 'os',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 3,
    moduleNumber: '3.3',
    assignmentNumber: 'DR-3.3.2',
    orderIndex: 30,
    title: 'macOS Installation & Recovery',
    description: 'Perform macOS installations and recovery procedures.',
    instructions: `1. Study macOS recovery options
2. Practice Internet Recovery procedures
3. Learn Time Machine backup and restore
4. Understand macOS compatibility by hardware
5. Complete 5 macOS installations`,
    objectives: [
      'Use macOS recovery effectively',
      'Backup and restore using Time Machine',
      'Install correct macOS version for hardware',
      'Configure system preferences properly',
    ],
    skills: ['macOS recovery', 'Time Machine', 'macOS installation'],
    expectedOutcome: 'Complete 5 successful macOS installations.',
    passingCriteria: 'All systems boot and function correctly',
    referencePhotos: ['/curriculum/repair/macos-recovery.jpg', '/curriculum/repair/time-machine.jpg'],
    estimatedHours: 10,
    difficulty: 'intermediate',
    category: 'computer-repair',
    subcategory: 'os',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 3.4: Malware & Security
  {
    level: 3,
    moduleNumber: '3.4',
    assignmentNumber: 'DR-3.4.1',
    orderIndex: 31,
    title: 'Virus & Malware Removal',
    description: 'Identify and remove various types of malware.',
    instructions: `1. Study common malware types and behaviors
2. Practice safe malware removal procedures
3. Use multiple anti-malware tools effectively
4. Learn to clean infected systems thoroughly
5. Complete 5 malware removals`,
    objectives: [
      'Identify types of malware infections',
      'Use removal tools safely and effectively',
      'Clean systems without data loss',
      'Advise customers on prevention',
    ],
    skills: ['Malware removal', 'Security scanning', 'System cleaning'],
    expectedOutcome: 'Successfully clean 5 infected systems.',
    passingCriteria: 'All systems clean and stable after removal',
    referencePhotos: ['/curriculum/repair/malware-scan.jpg', '/curriculum/repair/security-tools.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'computer-repair',
    subcategory: 'security',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 3.5: Laptop Screen Replacement
  {
    level: 3,
    moduleNumber: '3.5',
    assignmentNumber: 'DR-3.5.1',
    orderIndex: 32,
    title: 'Laptop LCD/LED Screen Replacement',
    description: 'Replace laptop display panels on various models.',
    instructions: `1. Study laptop screen connector types
2. Practice bezel removal without damage
3. Learn screen panel specifications
4. Practice video cable routing
5. Complete 5 laptop screen replacements`,
    objectives: [
      'Remove bezels and panels safely',
      'Select correct replacement panels',
      'Route cables correctly',
      'Verify display function after replacement',
    ],
    skills: ['Laptop repair', 'Panel replacement', 'Cable routing'],
    expectedOutcome: 'Complete 5 successful laptop screen replacements.',
    passingCriteria: 'All displays function correctly',
    referencePhotos: ['/curriculum/repair/laptop-screen.jpg', '/curriculum/repair/lcd-cable.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'computer-repair',
    subcategory: 'display',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 3.6: Keyboard & Trackpad
  {
    level: 3,
    moduleNumber: '3.6',
    assignmentNumber: 'DR-3.6.1',
    orderIndex: 33,
    title: 'Laptop Keyboard Replacement',
    description: 'Replace keyboards on various laptop models.',
    instructions: `1. Study keyboard mounting methods
2. Practice keyboard removal techniques
3. Learn ribbon cable handling
4. Practice key cap replacement for minor repairs
5. Complete 5 keyboard replacements`,
    objectives: [
      'Remove keyboards without case damage',
      'Handle ribbon cables correctly',
      'Test all keys after replacement',
      'Replace individual key caps when needed',
    ],
    skills: ['Keyboard replacement', 'Ribbon cable handling', 'Key testing'],
    expectedOutcome: 'Complete 5 successful keyboard replacements.',
    passingCriteria: 'All keys function correctly',
    referencePhotos: ['/curriculum/repair/keyboard-replacement.jpg', '/curriculum/repair/keyboard-ribbon.jpg'],
    estimatedHours: 10,
    difficulty: 'intermediate',
    category: 'computer-repair',
    subcategory: 'keyboard',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 3,
    moduleNumber: '3.6',
    assignmentNumber: 'DR-3.6.2',
    orderIndex: 34,
    title: 'Trackpad Repair & Calibration',
    description: 'Repair and calibrate laptop trackpads.',
    instructions: `1. Study trackpad technologies
2. Practice trackpad removal and replacement
3. Learn gesture calibration
4. Diagnose click and gesture issues
5. Complete 3 trackpad repairs`,
    objectives: [
      'Diagnose trackpad issues accurately',
      'Replace trackpads correctly',
      'Calibrate gesture settings',
      'Test all trackpad functions',
    ],
    skills: ['Trackpad repair', 'Calibration', 'Gesture testing'],
    expectedOutcome: 'Complete 3 successful trackpad repairs.',
    passingCriteria: 'All trackpad functions work correctly',
    referencePhotos: ['/curriculum/repair/trackpad.jpg', '/curriculum/repair/trackpad-cable.jpg'],
    estimatedHours: 6,
    difficulty: 'intermediate',
    category: 'computer-repair',
    subcategory: 'input',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 3.7: Cooling Systems
  {
    level: 3,
    moduleNumber: '3.7',
    assignmentNumber: 'DR-3.7.1',
    orderIndex: 35,
    title: 'Thermal Paste Replacement',
    description: 'Replace thermal paste on CPUs and GPUs.',
    instructions: `1. Study thermal paste types and application
2. Practice heatsink removal
3. Learn proper thermal paste application amounts
4. Monitor temperatures before and after
5. Complete 5 thermal paste replacements`,
    objectives: [
      'Remove old thermal paste completely',
      'Apply correct amount of new paste',
      'Reinstall heatsinks correctly',
      'Verify improved thermal performance',
    ],
    skills: ['Thermal management', 'Heatsink removal', 'Temperature monitoring'],
    expectedOutcome: 'Complete 5 thermal paste replacements with temperature improvement.',
    passingCriteria: 'All systems show 10+ degree temperature drop',
    referencePhotos: ['/curriculum/repair/thermal-paste.jpg', '/curriculum/repair/heatsink.jpg'],
    estimatedHours: 8,
    difficulty: 'intermediate',
    category: 'computer-repair',
    subcategory: 'cooling',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 3,
    moduleNumber: '3.7',
    assignmentNumber: 'DR-3.7.2',
    orderIndex: 36,
    title: 'Fan Cleaning & Replacement',
    description: 'Clean and replace cooling fans in laptops and desktops.',
    instructions: `1. Study fan bearing types and failure modes
2. Practice fan cleaning with compressed air
3. Learn fan replacement procedures
4. Diagnose fan speed control issues
5. Complete 5 fan services`,
    objectives: [
      'Clean fans thoroughly without damage',
      'Replace fans with correct models',
      'Verify fan speed control function',
      'Test system cooling after service',
    ],
    skills: ['Fan cleaning', 'Fan replacement', 'Cooling diagnostics'],
    expectedOutcome: 'Complete 5 successful fan services.',
    passingCriteria: 'All cooling systems function correctly',
    referencePhotos: ['/curriculum/repair/fan-cleaning.jpg', '/curriculum/repair/laptop-fan.jpg'],
    estimatedHours: 6,
    difficulty: 'intermediate',
    category: 'computer-repair',
    subcategory: 'cooling',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 3.8: Power Systems
  {
    level: 3,
    moduleNumber: '3.8',
    assignmentNumber: 'DR-3.8.1',
    orderIndex: 37,
    title: 'Laptop Battery Replacement',
    description: 'Replace batteries in various laptop models.',
    instructions: `1. Study laptop battery types and removal
2. Practice battery calibration
3. Learn to handle swollen batteries safely
4. Verify charging function after replacement
5. Complete 5 laptop battery replacements`,
    objectives: [
      'Remove and install laptop batteries safely',
      'Calibrate batteries for accurate readings',
      'Handle swollen batteries appropriately',
      'Verify charging and battery health',
    ],
    skills: ['Laptop battery replacement', 'Battery calibration', 'Safety'],
    expectedOutcome: 'Complete 5 successful laptop battery replacements.',
    passingCriteria: 'All batteries calibrated and functioning',
    referencePhotos: ['/curriculum/repair/laptop-battery.jpg', '/curriculum/repair/battery-calibration.jpg'],
    estimatedHours: 8,
    difficulty: 'intermediate',
    category: 'computer-repair',
    subcategory: 'power',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 3,
    moduleNumber: '3.8',
    assignmentNumber: 'DR-3.8.2',
    orderIndex: 38,
    title: 'DC Jack Repair',
    description: 'Repair or replace DC power jacks on laptops.',
    instructions: `1. Study DC jack failure modes
2. Practice jack testing with multimeter
3. Learn soldering for jack replacement
4. Practice cable repair techniques
5. Complete 3 DC jack repairs`,
    objectives: [
      'Diagnose DC jack issues accurately',
      'Solder replacement jacks correctly',
      'Test power delivery after repair',
      'Reinforce repairs for longevity',
    ],
    skills: ['DC jack repair', 'Soldering', 'Power testing'],
    expectedOutcome: 'Complete 3 successful DC jack repairs.',
    passingCriteria: 'All repairs pass power delivery tests',
    referencePhotos: ['/curriculum/repair/dc-jack.jpg', '/curriculum/repair/jack-soldering.jpg'],
    estimatedHours: 10,
    difficulty: 'intermediate',
    category: 'computer-repair',
    subcategory: 'power',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 3.9: Desktop Systems
  {
    level: 3,
    moduleNumber: '3.9',
    assignmentNumber: 'DR-3.9.1',
    orderIndex: 39,
    title: 'Desktop Troubleshooting & Repair',
    description: 'Diagnose and repair common desktop computer issues.',
    instructions: `1. Study desktop architecture and component testing
2. Practice POST code interpretation
3. Learn power supply testing
4. Diagnose motherboard issues
5. Complete 5 desktop repairs`,
    objectives: [
      'Interpret POST codes and beep patterns',
      'Test power supplies accurately',
      'Identify failed components',
      'Replace modular components',
    ],
    skills: ['Desktop repair', 'POST troubleshooting', 'Component testing'],
    expectedOutcome: 'Successfully diagnose and repair 5 desktop systems.',
    passingCriteria: 'All systems functional after repair',
    referencePhotos: ['/curriculum/repair/desktop-repair.jpg', '/curriculum/repair/post-codes.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'computer-repair',
    subcategory: 'desktop',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 3,
    moduleNumber: '3.9',
    assignmentNumber: 'DR-3.9.2',
    orderIndex: 40,
    title: 'Computer Repair Practical Exam',
    description: 'Demonstrate comprehensive computer repair skills.',
    instructions: `1. Complete laptop disassembly and reassembly
2. Diagnose unknown hardware issue
3. Perform SSD upgrade with OS migration
4. Replace a laptop component (screen, keyboard, or fan)
5. Document all work professionally`,
    objectives: [
      'Complete repairs efficiently',
      'Diagnose issues independently',
      'Document work professionally',
      'Demonstrate quality standards',
    ],
    skills: ['Time management', 'Independent diagnosis', 'Quality control'],
    expectedOutcome: 'Pass comprehensive practical exam.',
    passingCriteria: 'Score 85% or higher on practical exam',
    referencePhotos: ['/curriculum/repair/computer-exam.jpg'],
    estimatedHours: 8,
    difficulty: 'intermediate',
    category: 'computer-repair',
    subcategory: 'exam',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // ============================================================================
  // LEVEL 4: ADVANCED REPAIRS (Assignments 41-50)
  // ============================================================================

  // Module 4.1: Microsoldering
  {
    level: 4,
    moduleNumber: '4.1',
    assignmentNumber: 'DR-4.1.1',
    orderIndex: 41,
    title: 'Soldering Fundamentals',
    description: 'Learn basic through-hole and surface mount soldering.',
    instructions: `1. Study soldering equipment and materials
2. Practice through-hole soldering on practice boards
3. Learn proper tip care and maintenance
4. Practice desoldering techniques
5. Complete soldering practice exercises`,
    objectives: [
      'Solder through-hole components cleanly',
      'Create good solder joints consistently',
      'Desolder components without board damage',
      'Maintain soldering equipment properly',
    ],
    skills: ['Soldering', 'Desoldering', 'Equipment care'],
    expectedOutcome: 'Complete soldering practice kit successfully.',
    passingCriteria: 'All joints pass visual inspection',
    referencePhotos: ['/curriculum/repair/soldering.jpg', '/curriculum/repair/solder-joint.jpg'],
    estimatedHours: 12,
    difficulty: 'intermediate',
    category: 'advanced-repair',
    subcategory: 'soldering',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 4,
    moduleNumber: '4.1',
    assignmentNumber: 'DR-4.1.2',
    orderIndex: 42,
    title: 'SMD Component Replacement',
    description: 'Replace surface mount components on device boards.',
    instructions: `1. Study SMD component identification
2. Practice using hot air station safely
3. Learn flux application and cleaning
4. Practice replacing small SMD components
5. Complete 10 SMD component replacements`,
    objectives: [
      'Use hot air station effectively',
      'Remove SMD components without damage',
      'Place and solder new components accurately',
      'Clean boards after soldering',
    ],
    skills: ['SMD soldering', 'Hot air rework', 'Component handling'],
    expectedOutcome: 'Complete 10 successful SMD replacements.',
    passingCriteria: 'All components function correctly',
    referencePhotos: ['/curriculum/repair/smd-soldering.jpg', '/curriculum/repair/hot-air.jpg'],
    estimatedHours: 16,
    difficulty: 'advanced',
    category: 'advanced-repair',
    subcategory: 'microsoldering',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 4.2: Board-Level Diagnostics
  {
    level: 4,
    moduleNumber: '4.2',
    assignmentNumber: 'DR-4.2.1',
    orderIndex: 43,
    title: 'Schematic Reading & Board Diagnostics',
    description: 'Learn to read schematics and diagnose board-level issues.',
    instructions: `1. Study schematic symbols and conventions
2. Practice tracing power rails
3. Learn to identify common failure points
4. Use thermal camera for diagnostics
5. Complete 5 board-level diagnoses`,
    objectives: [
      'Read and interpret device schematics',
      'Trace power delivery circuits',
      'Identify short circuits and failures',
      'Use diagnostic tools effectively',
    ],
    skills: ['Schematic reading', 'Board diagnostics', 'Thermal analysis'],
    expectedOutcome: 'Successfully diagnose 5 board-level issues.',
    passingCriteria: 'Accurate diagnosis on 80% of test cases',
    referencePhotos: ['/curriculum/repair/schematic.jpg', '/curriculum/repair/thermal-camera.jpg'],
    estimatedHours: 20,
    difficulty: 'advanced',
    category: 'advanced-repair',
    subcategory: 'diagnostics',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 4.3: Data Recovery
  {
    level: 4,
    moduleNumber: '4.3',
    assignmentNumber: 'DR-4.3.1',
    orderIndex: 44,
    title: 'Data Recovery Fundamentals',
    description: 'Learn basic data recovery techniques for common scenarios.',
    instructions: `1. Study data recovery software options
2. Practice imaging failing drives
3. Learn file system recovery techniques
4. Understand when to refer to specialists
5. Complete 3 data recovery cases`,
    objectives: [
      'Create disk images safely',
      'Use recovery software effectively',
      'Recover data from logical failures',
      'Know limits of software recovery',
    ],
    skills: ['Data recovery', 'Disk imaging', 'File system repair'],
    expectedOutcome: 'Successfully recover data in 3 cases.',
    passingCriteria: 'Recover majority of data in each case',
    referencePhotos: ['/curriculum/repair/data-recovery.jpg', '/curriculum/repair/disk-imaging.jpg'],
    estimatedHours: 12,
    difficulty: 'advanced',
    category: 'advanced-repair',
    subcategory: 'data-recovery',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 4.4: TV Repair
  {
    level: 4,
    moduleNumber: '4.4',
    assignmentNumber: 'DR-4.4.1',
    orderIndex: 45,
    title: 'TV Panel Diagnostics',
    description: 'Diagnose issues in LED and LCD television panels.',
    instructions: `1. Study TV architecture and components
2. Learn power supply board testing
3. Practice main board diagnostics
4. Identify panel vs board failures
5. Complete 5 TV diagnoses`,
    objectives: [
      'Diagnose TV power supply issues',
      'Test main boards effectively',
      'Identify backlight failures',
      'Determine repair vs replace decisions',
    ],
    skills: ['TV diagnostics', 'Power supply testing', 'Backlight repair'],
    expectedOutcome: 'Accurately diagnose 5 TV issues.',
    passingCriteria: 'Correct diagnosis on 80% of cases',
    referencePhotos: ['/curriculum/repair/tv-teardown.jpg', '/curriculum/repair/tv-boards.jpg'],
    estimatedHours: 14,
    difficulty: 'advanced',
    category: 'advanced-repair',
    subcategory: 'tv',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 4,
    moduleNumber: '4.4',
    assignmentNumber: 'DR-4.4.2',
    orderIndex: 46,
    title: 'TV Board Replacement',
    description: 'Replace common TV boards and components.',
    instructions: `1. Study TV board identification
2. Practice board removal and installation
3. Learn firmware programming for T-CON boards
4. Replace LED strips for backlight repair
5. Complete 3 TV repairs`,
    objectives: [
      'Replace power supply boards',
      'Install main boards correctly',
      'Program T-CON boards when needed',
      'Replace LED backlight strips',
    ],
    skills: ['TV repair', 'Board replacement', 'Firmware programming'],
    expectedOutcome: 'Complete 3 successful TV repairs.',
    passingCriteria: 'All TVs fully functional after repair',
    referencePhotos: ['/curriculum/repair/tv-repair.jpg', '/curriculum/repair/led-strips.jpg'],
    estimatedHours: 16,
    difficulty: 'advanced',
    category: 'advanced-repair',
    subcategory: 'tv',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 4.5: Gaming Console Repair
  {
    level: 4,
    moduleNumber: '4.5',
    assignmentNumber: 'DR-4.5.1',
    orderIndex: 47,
    title: 'Gaming Console Diagnostics',
    description: 'Diagnose common issues in PlayStation, Xbox, and Nintendo consoles.',
    instructions: `1. Study console architecture by platform
2. Learn common failure patterns
3. Practice HDMI port testing
4. Diagnose disc drive issues
5. Complete 5 console diagnoses`,
    objectives: [
      'Identify BLOD, YLOD, and similar failures',
      'Test HDMI ports and ICs',
      'Diagnose disc drive mechanisms',
      'Determine repair feasibility',
    ],
    skills: ['Console diagnostics', 'HDMI testing', 'Mechanical repair'],
    expectedOutcome: 'Accurately diagnose 5 console issues.',
    passingCriteria: 'Correct diagnosis on 80% of cases',
    referencePhotos: ['/curriculum/repair/console-teardown.jpg', '/curriculum/repair/hdmi-port.jpg'],
    estimatedHours: 12,
    difficulty: 'advanced',
    category: 'advanced-repair',
    subcategory: 'console',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 4,
    moduleNumber: '4.5',
    assignmentNumber: 'DR-4.5.2',
    orderIndex: 48,
    title: 'Console Component Replacement',
    description: 'Replace common failing components in gaming consoles.',
    instructions: `1. Practice HDMI port replacement
2. Learn thermal paste replacement on APUs
3. Practice disc drive repairs and swaps
4. Learn controller repairs
5. Complete 3 console repairs`,
    objectives: [
      'Replace HDMI ports successfully',
      'Reball or reflow as appropriate',
      'Repair disc drive mechanisms',
      'Fix controller issues',
    ],
    skills: ['Console repair', 'HDMI replacement', 'Thermal management'],
    expectedOutcome: 'Complete 3 successful console repairs.',
    passingCriteria: 'All consoles fully functional',
    referencePhotos: ['/curriculum/repair/hdmi-replacement.jpg', '/curriculum/repair/console-thermal.jpg'],
    estimatedHours: 18,
    difficulty: 'advanced',
    category: 'advanced-repair',
    subcategory: 'console',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 4.6: Advanced Practical
  {
    level: 4,
    moduleNumber: '4.6',
    assignmentNumber: 'DR-4.6.1',
    orderIndex: 49,
    title: 'Advanced Repair Project',
    description: 'Complete a complex repair project under mentor supervision.',
    instructions: `1. Select an advanced repair case with mentor
2. Document initial diagnosis thoroughly
3. Research repair procedures
4. Execute repair with mentor guidance
5. Document complete process`,
    objectives: [
      'Handle complex repair scenarios',
      'Research solutions independently',
      'Execute multi-step repairs',
      'Document work professionally',
    ],
    skills: ['Complex troubleshooting', 'Research', 'Project completion'],
    expectedOutcome: 'Complete one complex repair project.',
    passingCriteria: 'Successful repair with complete documentation',
    referencePhotos: ['/curriculum/repair/advanced-project.jpg'],
    estimatedHours: 20,
    difficulty: 'advanced',
    category: 'advanced-repair',
    subcategory: 'project',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 4,
    moduleNumber: '4.6',
    assignmentNumber: 'DR-4.6.2',
    orderIndex: 50,
    title: 'Advanced Repair Certification Exam',
    description: 'Comprehensive exam covering all advanced repair topics.',
    instructions: `1. Review all Level 4 material
2. Complete written exam on advanced topics
3. Complete practical exam with unknown issues
4. Demonstrate soldering skills
5. Present advanced repair project`,
    objectives: [
      'Demonstrate comprehensive knowledge',
      'Complete practical repairs successfully',
      'Show professional documentation skills',
      'Explain repairs clearly',
    ],
    skills: ['Knowledge demonstration', 'Practical skills', 'Communication'],
    expectedOutcome: 'Pass certification exam.',
    passingCriteria: 'Score 85% or higher on combined exam',
    referencePhotos: ['/curriculum/repair/certification.jpg'],
    estimatedHours: 8,
    difficulty: 'advanced',
    category: 'advanced-repair',
    subcategory: 'certification',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // ============================================================================
  // LEVEL 5: SUPERVISED CUSTOMER WORK (Assignments 51-60)
  // ============================================================================

  // Module 5.1: Supervised Phone Repairs
  {
    level: 5,
    moduleNumber: '5.1',
    assignmentNumber: 'DR-5.1.1',
    orderIndex: 51,
    title: 'Supervised Phone Repair - Screen (5 jobs)',
    description: 'Complete 5 supervised phone screen replacements on customer devices.',
    instructions: `1. Work with mentor on customer device intake
2. Complete screen replacement under supervision
3. Conduct quality control checks
4. Communicate results to customer
5. Document each repair thoroughly`,
    objectives: [
      'Handle customer devices professionally',
      'Complete repairs to professional standards',
      'Communicate effectively with customers',
      'Meet time and quality expectations',
    ],
    skills: ['Customer work', 'Quality control', 'Professional communication'],
    expectedOutcome: 'Complete 5 successful customer screen repairs.',
    passingCriteria: 'All repairs pass quality inspection and customer satisfaction',
    referencePhotos: ['/curriculum/repair/customer-repair.jpg'],
    estimatedHours: 15,
    difficulty: 'advanced',
    category: 'supervised-work',
    subcategory: 'phone',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 5,
    moduleNumber: '5.1',
    assignmentNumber: 'DR-5.1.2',
    orderIndex: 52,
    title: 'Supervised Phone Repair - Battery (5 jobs)',
    description: 'Complete 5 supervised phone battery replacements on customer devices.',
    instructions: `1. Intake devices and document condition
2. Replace batteries under supervision
3. Calibrate and test batteries
4. Return devices to customers
5. Follow up on battery health`,
    objectives: [
      'Replace batteries efficiently',
      'Calibrate batteries correctly',
      'Handle customer expectations',
      'Provide aftercare instructions',
    ],
    skills: ['Battery replacement', 'Customer service', 'Quality assurance'],
    expectedOutcome: 'Complete 5 successful customer battery repairs.',
    passingCriteria: 'All batteries calibrated and customers satisfied',
    referencePhotos: ['/curriculum/repair/battery-service.jpg'],
    estimatedHours: 10,
    difficulty: 'advanced',
    category: 'supervised-work',
    subcategory: 'phone',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 5.2: Supervised Computer Repairs
  {
    level: 5,
    moduleNumber: '5.2',
    assignmentNumber: 'DR-5.2.1',
    orderIndex: 53,
    title: 'Supervised Laptop Repair (5 jobs)',
    description: 'Complete 5 supervised laptop repairs on customer devices.',
    instructions: `1. Diagnose customer laptop issues
2. Create and present quotes
3. Complete repairs under supervision
4. Test thoroughly before return
5. Provide customer with repair summary`,
    objectives: [
      'Diagnose laptop issues accurately',
      'Create professional quotes',
      'Complete various laptop repairs',
      'Ensure customer satisfaction',
    ],
    skills: ['Laptop repair', 'Quoting', 'Customer management'],
    expectedOutcome: 'Complete 5 successful customer laptop repairs.',
    passingCriteria: 'All repairs completed successfully',
    referencePhotos: ['/curriculum/repair/laptop-service.jpg'],
    estimatedHours: 25,
    difficulty: 'advanced',
    category: 'supervised-work',
    subcategory: 'computer',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 5.3: Customer Communication
  {
    level: 5,
    moduleNumber: '5.3',
    assignmentNumber: 'DR-5.3.1',
    orderIndex: 54,
    title: 'Customer Communication Excellence',
    description: 'Master professional customer communication for repair services.',
    instructions: `1. Practice explaining technical issues simply
2. Handle difficult customer situations
3. Present quotes persuasively
4. Manage expectations appropriately
5. Complete 10 customer interactions`,
    objectives: [
      'Explain technical issues clearly',
      'Handle objections professionally',
      'Present quotes confidently',
      'Build customer trust and rapport',
    ],
    skills: ['Communication', 'Conflict resolution', 'Sales skills'],
    expectedOutcome: 'Demonstrate excellent customer communication.',
    passingCriteria: 'Positive feedback from all observed interactions',
    referencePhotos: ['/curriculum/repair/customer-service.jpg'],
    estimatedHours: 8,
    difficulty: 'advanced',
    category: 'supervised-work',
    subcategory: 'customer-service',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 5.4: Quote Accuracy
  {
    level: 5,
    moduleNumber: '5.4',
    assignmentNumber: 'DR-5.4.1',
    orderIndex: 55,
    title: 'Quote Accuracy Training',
    description: 'Master the art of creating accurate repair quotes.',
    instructions: `1. Study pricing for all common repairs
2. Practice time estimation
3. Learn to account for unexpected issues
4. Create quotes for 20 repair scenarios
5. Track accuracy over time`,
    objectives: [
      'Create accurate time estimates',
      'Price repairs competitively',
      'Account for potential complications',
      'Present quotes professionally',
    ],
    skills: ['Pricing', 'Time estimation', 'Risk assessment'],
    expectedOutcome: 'Create 20 accurate quotes.',
    passingCriteria: 'Quotes within 15% of actual costs',
    referencePhotos: ['/curriculum/repair/quoting.jpg'],
    estimatedHours: 10,
    difficulty: 'advanced',
    category: 'supervised-work',
    subcategory: 'business',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 5.5: Quality Assurance
  {
    level: 5,
    moduleNumber: '5.5',
    assignmentNumber: 'DR-5.5.1',
    orderIndex: 56,
    title: 'Quality Assurance Procedures',
    description: 'Master quality control procedures for all repairs.',
    instructions: `1. Study QA checklists for different repair types
2. Practice thorough testing procedures
3. Learn to document quality checks
4. Identify and fix issues before customer return
5. QA 20 repairs completed by others`,
    objectives: [
      'Follow QA procedures consistently',
      'Identify issues before customer return',
      'Document QA results properly',
      'Maintain high quality standards',
    ],
    skills: ['Quality control', 'Testing', 'Documentation'],
    expectedOutcome: 'Successfully QA 20 repairs.',
    passingCriteria: 'Catch all issues in test repairs',
    referencePhotos: ['/curriculum/repair/quality-assurance.jpg'],
    estimatedHours: 10,
    difficulty: 'advanced',
    category: 'supervised-work',
    subcategory: 'quality',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 5.6: Independent Work Preparation
  {
    level: 5,
    moduleNumber: '5.6',
    assignmentNumber: 'DR-5.6.1',
    orderIndex: 57,
    title: 'Independent Repair Practice (10 jobs)',
    description: 'Complete 10 repairs with minimal supervision.',
    instructions: `1. Take on repairs with mentor available but not directly supervising
2. Make decisions independently
3. Seek help only when truly needed
4. Document decision-making process
5. Receive feedback on independence`,
    objectives: [
      'Work independently while knowing limits',
      'Make sound repair decisions',
      'Manage time effectively',
      'Know when to ask for help',
    ],
    skills: ['Independence', 'Decision making', 'Time management'],
    expectedOutcome: 'Complete 10 repairs with minimal assistance.',
    passingCriteria: 'All repairs successful with minimal mentor intervention',
    referencePhotos: ['/curriculum/repair/independent-work.jpg'],
    estimatedHours: 30,
    difficulty: 'advanced',
    category: 'supervised-work',
    subcategory: 'independence',
    serviceTrack: 'device_repair' as ServiceTrack,
  },

  // Module 5.7: Final Certification
  {
    level: 5,
    moduleNumber: '5.7',
    assignmentNumber: 'DR-5.7.1',
    orderIndex: 58,
    title: 'Customer Service Excellence Review',
    description: 'Comprehensive review of customer service skills.',
    instructions: `1. Review all customer interactions from supervised work
2. Identify areas of strength and improvement
3. Practice challenging scenarios
4. Complete customer service assessment
5. Receive final feedback`,
    objectives: [
      'Demonstrate excellent customer service',
      'Handle difficult situations professionally',
      'Build customer relationships',
      'Represent the business positively',
    ],
    skills: ['Customer excellence', 'Problem solving', 'Professionalism'],
    expectedOutcome: 'Pass customer service assessment.',
    passingCriteria: 'Score 90% or higher on assessment',
    referencePhotos: ['/curriculum/repair/service-excellence.jpg'],
    estimatedHours: 6,
    difficulty: 'advanced',
    category: 'supervised-work',
    subcategory: 'assessment',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 5,
    moduleNumber: '5.7',
    assignmentNumber: 'DR-5.7.2',
    orderIndex: 59,
    title: 'Technical Skills Final Assessment',
    description: 'Final technical assessment covering all repair skills.',
    instructions: `1. Complete written exam on all topics
2. Perform practical repairs under observation
3. Demonstrate diagnostic skills
4. Show microsoldering ability
5. Present portfolio of work`,
    objectives: [
      'Demonstrate comprehensive technical knowledge',
      'Perform repairs to professional standards',
      'Show growth from program start',
      'Prove readiness for independent work',
    ],
    skills: ['Technical mastery', 'Professionalism', 'Continuous learning'],
    expectedOutcome: 'Pass final technical assessment.',
    passingCriteria: 'Score 85% or higher on combined assessment',
    referencePhotos: ['/curriculum/repair/final-assessment.jpg'],
    estimatedHours: 8,
    difficulty: 'advanced',
    category: 'supervised-work',
    subcategory: 'certification',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
  {
    level: 5,
    moduleNumber: '5.7',
    assignmentNumber: 'DR-5.7.3',
    orderIndex: 60,
    title: 'Apprentice Graduation & Certification',
    description: 'Complete the apprenticeship and receive certification.',
    instructions: `1. Complete all prior assignments
2. Submit complete portfolio
3. Receive mentor evaluation
4. Complete graduation requirements
5. Receive Device Repair Technician Certificate`,
    objectives: [
      'Complete all program requirements',
      'Demonstrate readiness for employment',
      'Receive official certification',
      'Begin career as repair technician',
    ],
    skills: ['Program completion', 'Professionalism', 'Career readiness'],
    expectedOutcome: 'Receive Device Repair Technician Certification.',
    passingCriteria: 'All program requirements completed',
    referencePhotos: ['/curriculum/repair/graduation.jpg', '/curriculum/repair/certificate.jpg'],
    estimatedHours: 4,
    difficulty: 'advanced',
    category: 'supervised-work',
    subcategory: 'graduation',
    serviceTrack: 'device_repair' as ServiceTrack,
  },
]

export async function seedDeviceRepairCurriculum() {
  console.log('Seeding device repair curriculum...')

  for (const assignment of deviceRepairCurriculum) {
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

  console.log(`\nSeeded ${deviceRepairCurriculum.length} device repair assignment templates`)
}

// Run if called directly
if (require.main === module) {
  seedDeviceRepairCurriculum()
    .then(() => prisma.$disconnect())
    .catch((e) => {
      console.error(e)
      prisma.$disconnect()
      process.exit(1)
    })
}

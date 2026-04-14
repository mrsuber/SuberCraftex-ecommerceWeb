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

const electronicsCurriculum: AssignmentTemplateData[] = [
  // ============================================================================
  // LEVEL 1: ELECTRONICS FUNDAMENTALS (Months 1-3)
  // ============================================================================

  {
    level: 1,
    moduleNumber: '1.1',
    assignmentNumber: 'ELEC-1.1.1',
    orderIndex: 1,
    title: 'Electronics Safety & ESD Protection',
    description: 'Master electronics safety including high voltage, ESD protection, and proper handling of components. Safety is paramount when working with electricity.',
    instructions: `1. Study electrical hazards: shock, burns, arc flash, high voltage dangers
2. Learn proper grounding techniques and earth ground importance
3. Master ESD (Electrostatic Discharge) protection: wrist straps, ESD mats, proper handling
4. Understand component ratings: voltage, current, power dissipation
5. Study safety equipment: multimeter safety, fused probes, isolation
6. Learn battery safety: lithium chemistry, charging, fire hazards
7. Practice safe soldering: ventilation, temperature control, burn prevention
8. Study emergency procedures: electrical fire, shock response
9. Complete electronics safety certification exam`,
    objectives: [
      'Understand all electrical hazards and controls',
      'Use ESD protection equipment properly',
      'Handle electronic components safely',
      'Respond appropriately to electrical emergencies',
      'Work safely with batteries and power supplies',
      'Maintain a safe electronics workspace',
    ],
    skills: ['Electrical safety', 'ESD protection', 'Hazard identification', 'Emergency response'],
    expectedOutcome: 'Electronics safety certification and properly configured ESD-safe workstation.',
    passingCriteria: 'Score 100% on safety exam, demonstrate all ESD procedures, workstation passes safety inspection',
    referencePhotos: ['/curriculum/electronics/esd-workstation.jpg', '/curriculum/electronics/safety-equipment.jpg', '/curriculum/electronics/grounding.jpg'],
    estimatedHours: 12,
    difficulty: 'beginner',
    category: 'safety',
    subcategory: 'fundamentals',
    serviceTrack: 'electronics' as ServiceTrack,
    requiredReading: [
      '"Practical Electronics for Inventors" by Paul Scherz - Chapter 1: Safety',
      'ESD Association Standards (ANSI/ESD S20.20)',
      '"The Art of Electronics" by Horowitz & Hill - Lab safety appendix',
    ],
  },

  {
    level: 1,
    moduleNumber: '1.2',
    assignmentNumber: 'ELEC-1.2.1',
    orderIndex: 2,
    title: 'Basic Electrical Theory - Ohm\'s Law & Power',
    description: 'Master the fundamental laws of electronics: Ohm\'s Law, Kirchhoff\'s Laws, and power calculations. These are the foundation of all circuit analysis.',
    instructions: `1. Study Ohm's Law: V = I × R (voltage, current, resistance relationship)
2. Learn power formula: P = V × I = I²R = V²/R
3. Understand Kirchhoff's Current Law (KCL): sum of currents at node = 0
4. Study Kirchhoff's Voltage Law (KVL): sum of voltages in loop = 0
5. Practice series circuits: total resistance, voltage dividers
6. Master parallel circuits: total resistance, current dividers
7. Learn series-parallel combination circuits
8. Calculate power dissipation and component wattage ratings
9. Solve 50 circuit analysis problems
10. Build and measure 10 test circuits to verify calculations`,
    objectives: [
      'Apply Ohm\'s Law to solve circuit problems',
      'Calculate power dissipation in circuits',
      'Analyze series and parallel circuits',
      'Use Kirchhoff\'s Laws for complex circuits',
      'Select components with appropriate power ratings',
      'Verify theoretical calculations with measurements',
    ],
    skills: ['Circuit analysis', 'Ohm\'s Law application', 'Power calculation', 'Component selection'],
    expectedOutcome: 'Completed problem set with 50 circuit calculations, verified with 10 built circuits.',
    passingCriteria: 'Score 90%+ on calculations, measured values within 10% of calculated (accounting for component tolerance)',
    referencePhotos: ['/curriculum/electronics/ohms-law.jpg', '/curriculum/electronics/series-parallel.jpg', '/curriculum/electronics/multimeter-measurement.jpg'],
    estimatedHours: 20,
    difficulty: 'beginner',
    category: 'theory',
    subcategory: 'fundamentals',
    serviceTrack: 'electronics' as ServiceTrack,
    requiredReading: [
      '"Make: Electronics" by Charles Platt (Experiments 1-10)',
      '"The Art of Electronics" by Horowitz & Hill - Chapter 1',
      '"All New Electronics Self-Teaching Guide" by Harry Kybett',
    ],
  },

  {
    level: 1,
    moduleNumber: '1.3',
    assignmentNumber: 'ELEC-1.3.1',
    orderIndex: 3,
    title: 'Electronic Components - Resistors, Capacitors, Inductors',
    description: 'Learn to identify, test, and use passive electronic components. Understand component markings, tolerances, and applications.',
    instructions: `1. Study resistor types: carbon film, metal film, wirewound, power resistors
2. Learn resistor color code: 4-band, 5-band, 6-band reading
3. Understand resistor tolerance: ±1%, ±5%, ±10%
4. Study capacitor types: ceramic, electrolytic, tantalum, film
5. Learn capacitor markings: µF, nF, pF conversions, voltage ratings
6. Understand capacitor polarity (electrolytic) and consequences of reversal
7. Study inductor types: air core, iron core, ferrite, toroids
8. Learn to measure components with multimeter and LCR meter
9. Create component identification reference board (50+ components)
10. Test and sort components from mixed lots`,
    objectives: [
      'Identify all common electronic components',
      'Read resistor color codes accurately',
      'Understand capacitor markings and ratings',
      'Measure component values correctly',
      'Select appropriate components for circuits',
      'Recognize faulty or out-of-spec components',
    ],
    skills: ['Component identification', 'Color code reading', 'Component testing', 'Specification interpretation'],
    expectedOutcome: 'Component reference board with 50+ labeled components, measurement data sheet.',
    passingCriteria: 'Correctly identify 95%+ of components in blind test, measurements within component tolerance',
    referencePhotos: ['/curriculum/electronics/resistor-color-code.jpg', '/curriculum/electronics/capacitor-types.jpg', '/curriculum/electronics/component-board.jpg'],
    estimatedHours: 16,
    difficulty: 'beginner',
    category: 'components',
    subcategory: 'passive',
    serviceTrack: 'electronics' as ServiceTrack,
    requiredReading: [
      '"Electronic Components: A Complete Reference" by Delton Horn',
      'Resistor color code charts and calculators',
      'Capacitor marking guide - online resources',
    ],
    crossReferences: [
      'Builds on Device Repair Curriculum (Level 1) - component identification',
    ],
  },

  {
    level: 1,
    moduleNumber: '1.4',
    assignmentNumber: 'ELEC-1.4.1',
    orderIndex: 4,
    title: 'Soldering & Desoldering Mastery',
    description: 'Master through-hole and surface mount soldering techniques. Perfect soldering is essential for reliable circuits.',
    instructions: `1. Study soldering theory: eutectic point (63/37 Sn/Pb or lead-free SAC305), heat transfer
2. Learn soldering iron types: temperature controlled, wattage selection, tip types
3. Practice through-hole soldering: perfect joints every time (shiny, concave fillet)
4. Master desoldering techniques: solder wick, vacuum pump, hot air
5. Learn surface mount (SMD) soldering: 0805, 0603, 0402 components
6. Practice hot air rework for SMD removal and replacement
7. Understand flux types: rosin, no-clean, water-soluble
8. Study solder defects: cold joint, bridging, insufficient, excess
9. Build practice circuits demonstrating perfect soldering
10. Complete IPC-A-610 soldering standards training`,
    objectives: [
      'Create perfect solder joints consistently',
      'Desolder components without board damage',
      'Solder SMD components (down to 0402 size)',
      'Use appropriate flux for each application',
      'Identify and prevent soldering defects',
      'Meet IPC-A-610 acceptability standards',
    ],
    skills: ['Through-hole soldering', 'SMD soldering', 'Desoldering', 'Hot air rework', 'Quality control'],
    expectedOutcome: 'Practice boards demonstrating perfect through-hole and SMD soldering.',
    passingCriteria: 'All joints pass IPC-A-610 Class 2 standards, SMD components aligned and properly reflowed',
    referencePhotos: ['/curriculum/electronics/perfect-joint.jpg', '/curriculum/electronics/smd-soldering.jpg', '/curriculum/electronics/soldering-defects.jpg'],
    estimatedHours: 24,
    difficulty: 'beginner',
    category: 'assembly',
    subcategory: 'soldering',
    serviceTrack: 'electronics' as ServiceTrack,
    requiredReading: [
      'IPC-A-610 "Acceptability of Electronic Assemblies"',
      '"Soldering Is Easy" comic book guide',
      'NASA soldering standards (NASA-STD-8739.3)',
    ],
    crossReferences: [
      'Advanced version of Device Repair Curriculum (Level 4) - Microsoldering',
    ],
  },

  {
    level: 1,
    moduleNumber: '1.5',
    assignmentNumber: 'ELEC-1.5.1',
    orderIndex: 5,
    title: 'Breadboarding & Prototyping Techniques',
    description: 'Master solderless breadboarding for rapid prototyping and testing. Learn to build reliable temporary circuits.',
    instructions: `1. Study breadboard anatomy: power rails, tie points, internal connections
2. Learn proper wire routing: short jumpers, organized layout, color coding
3. Practice component placement: minimize jumper length, logical grouping
4. Master power distribution: decoupling capacitors, power rail connections
5. Learn to troubleshoot breadboard circuits: poor connections, loose wires
6. Build and test 10 reference circuits from schematics
7. Create breadboard layout best practices guide
8. Practice rapid prototyping: idea to working circuit in minutes
9. Learn when to use breadboard vs PCB vs perfboard`,
    objectives: [
      'Build reliable circuits on breadboard',
      'Create organized, readable breadboard layouts',
      'Troubleshoot breadboard connection issues',
      'Prototype circuits rapidly from schematics',
      'Understand breadboard limitations',
    ],
    skills: ['Breadboarding', 'Prototyping', 'Circuit layout', 'Troubleshooting'],
    expectedOutcome: 'Ten working breadboard circuits demonstrating clean layout and organization.',
    passingCriteria: 'All circuits function correctly, layout is organized and follows best practices',
    referencePhotos: ['/curriculum/electronics/breadboard-layout.jpg', '/curriculum/electronics/organized-prototype.jpg', '/curriculum/electronics/breadboard-best-practices.jpg'],
    estimatedHours: 12,
    difficulty: 'beginner',
    category: 'prototyping',
    subcategory: 'breadboard',
    serviceTrack: 'electronics' as ServiceTrack,
    requiredReading: [
      '"Make: Electronics" by Charles Platt - Breadboarding chapters',
      'Breadboard layout best practices - online resources',
    ],
  },

  // ============================================================================
  // LEVEL 2: SEMICONDUCTORS & ACTIVE COMPONENTS (Months 4-6)
  // ============================================================================

  {
    level: 2,
    moduleNumber: '2.1',
    assignmentNumber: 'ELEC-2.1.1',
    orderIndex: 10,
    title: 'Diodes & Rectifier Circuits',
    description: 'Master diode theory and applications: rectification, protection, voltage regulation. Understand PN junctions and semiconductor physics.',
    instructions: `1. Study PN junction theory: depletion region, forward bias, reverse bias
2. Learn diode characteristics: forward voltage drop (0.7V Si, 0.3V Schottky), reverse breakdown
3. Understand diode types: signal (1N4148), power (1N4007), Schottky, Zener, LED
4. Master rectifier circuits: half-wave, full-wave bridge, voltage doubler
5. Learn filtering: smoothing capacitors, ripple voltage calculation
6. Practice protection circuits: reverse polarity, flyback diodes, TVS diodes
7. Study voltage regulation: Zener diodes, constant current diodes
8. Build power supply: transformer → rectifier → filter → regulation
9. Test and document 10 diode circuits`,
    objectives: [
      'Understand semiconductor physics basics',
      'Design and build rectifier circuits',
      'Calculate filter capacitor values',
      'Use diodes for circuit protection',
      'Build complete power supply circuits',
    ],
    skills: ['Diode theory', 'Rectifier design', 'Power supply design', 'Protection circuits'],
    expectedOutcome: 'Working power supply and 10 documented diode circuit applications.',
    passingCriteria: 'Power supply delivers stable DC with <5% ripple, all protection circuits function correctly',
    referencePhotos: ['/curriculum/electronics/diode-curves.jpg', '/curriculum/electronics/bridge-rectifier.jpg', '/curriculum/electronics/power-supply.jpg'],
    estimatedHours: 18,
    difficulty: 'intermediate',
    category: 'semiconductors',
    subcategory: 'diodes',
    serviceTrack: 'electronics' as ServiceTrack,
    requiredReading: [
      '"The Art of Electronics" - Chapter 1.4: Diodes',
      '"Practical Electronics for Inventors" - Power supply chapter',
    ],
  },

  {
    level: 2,
    moduleNumber: '2.2',
    assignmentNumber: 'ELEC-2.2.1',
    orderIndex: 12,
    title: 'Transistors - BJT & MOSFET Fundamentals',
    description: 'Master bipolar junction transistors (BJT) and MOSFETs - the building blocks of all modern electronics.',
    instructions: `1. Study BJT structure: NPN and PNP, emitter/base/collector
2. Learn BJT operation: current amplification (hFE/β), saturation, cutoff
3. Understand biasing: voltage divider bias, emitter follower
4. Practice switching circuits: BJT as digital switch, load driving
5. Study MOSFET structure: N-channel, P-channel, enhancement mode
6. Learn MOSFET operation: voltage-controlled device, gate threshold (Vgs)
7. Practice MOSFET switching: high-current loads, PWM dimming
8. Compare BJT vs MOSFET: when to use each
9. Build amplifier, switch, and driver circuits
10. Design motor driver using MOSFETs`,
    objectives: [
      'Understand BJT and MOSFET operating principles',
      'Design proper biasing circuits',
      'Use transistors as switches and amplifiers',
      'Select appropriate transistor for application',
      'Drive high-current loads safely',
    ],
    skills: ['Transistor theory', 'Amplifier design', 'Switching circuits', 'Load driving'],
    expectedOutcome: 'Working amplifier, digital switches, and motor driver circuits.',
    passingCriteria: 'Amplifier has expected gain, switches operate correctly, motor driver handles rated current',
    referencePhotos: ['/curriculum/electronics/bjt-circuits.jpg', '/curriculum/electronics/mosfet-switch.jpg', '/curriculum/electronics/motor-driver.jpg'],
    estimatedHours: 24,
    difficulty: 'intermediate',
    category: 'semiconductors',
    subcategory: 'transistors',
    serviceTrack: 'electronics' as ServiceTrack,
    requiredReading: [
      '"The Art of Electronics" - Chapter 2: Bipolar Transistors',
      '"The Art of Electronics" - Chapter 3: Field-Effect Transistors',
      'Transistor datasheets: 2N3904, 2N2222, IRF540, BS170',
    ],
  },

  {
    level: 2,
    moduleNumber: '2.3',
    assignmentNumber: 'ELEC-2.3.1',
    orderIndex: 14,
    title: 'Operational Amplifiers (Op-Amps)',
    description: 'Master the versatile op-amp - amplification, filtering, comparison, mathematical operations, and signal conditioning.',
    instructions: `1. Study ideal op-amp characteristics: infinite gain, infinite input impedance, zero output impedance
2. Learn op-amp configurations: inverting, non-inverting, voltage follower
3. Practice gain calculations: Av = -Rf/Rin (inverting), Av = 1 + Rf/Rin (non-inverting)
4. Master comparator circuits: window comparator, Schmitt trigger
5. Learn active filters: low-pass, high-pass, band-pass (Sallen-Key topology)
6. Study instrumentation amplifier: high CMRR, precision measurement
7. Practice summing, difference, and integrator circuits
8. Build signal conditioning circuits for sensors
9. Design audio amplifier using op-amps
10. Create function generator: triangle/square wave`,
    objectives: [
      'Design and build op-amp circuits',
      'Calculate gain and frequency response',
      'Use op-amps for signal conditioning',
      'Build active filter circuits',
      'Apply op-amps to real-world problems',
    ],
    skills: ['Op-amp design', 'Filter design', 'Signal conditioning', 'Instrumentation'],
    expectedOutcome: 'Working audio amplifier, active filters, and instrumentation circuits.',
    passingCriteria: 'Circuits meet design specifications, filters have correct cutoff frequencies, amplifiers have expected gain',
    referencePhotos: ['/curriculum/electronics/opamp-circuits.jpg', '/curriculum/electronics/active-filter.jpg', '/curriculum/electronics/audio-amp.jpg'],
    estimatedHours: 20,
    difficulty: 'intermediate',
    category: 'analog',
    subcategory: 'opamps',
    serviceTrack: 'electronics' as ServiceTrack,
    requiredReading: [
      '"Op Amps for Everyone" by Ron Mancini (Texas Instruments)',
      '"The Art of Electronics" - Chapter 4: Operational Amplifiers',
      'Op-amp datasheet reading: LM358, TL072, OPA2134',
    ],
  },

  // ============================================================================
  // LEVEL 3: MICROCONTROLLERS & DIGITAL ELECTRONICS (Months 7-9)
  // ============================================================================

  {
    level: 3,
    moduleNumber: '3.1',
    assignmentNumber: 'ELEC-3.1.1',
    orderIndex: 20,
    title: 'Digital Logic Fundamentals - Gates & Boolean Algebra',
    description: 'Master digital logic: Boolean algebra, truth tables, logic gates, and combinational logic design.',
    instructions: `1. Study Boolean algebra: AND, OR, NOT, NAND, NOR, XOR operations
2. Learn truth tables: create and interpret for logic functions
3. Practice logic gate symbols: ANSI/IEEE standard symbols
4. Master De Morgan's theorems: conversion between logic forms
5. Learn combinational logic: encoders, decoders, multiplexers, demultiplexers
6. Practice Karnaugh maps: logic minimization
7. Build logic circuits using 74HC series ICs
8. Create half adder and full adder circuits
9. Design and build 4-bit binary counter
10. Build traffic light controller using logic gates`,
    objectives: [
      'Apply Boolean algebra to logic problems',
      'Design combinational logic circuits',
      'Minimize logic using Karnaugh maps',
      'Build circuits using 74-series logic ICs',
      'Create functional digital systems',
    ],
    skills: ['Boolean algebra', 'Logic design', 'Truth tables', 'Digital circuits'],
    expectedOutcome: 'Working digital circuits: adder, counter, and traffic light controller.',
    passingCriteria: 'All logic circuits function according to truth tables, timing is correct',
    referencePhotos: ['/curriculum/electronics/logic-gates.jpg', '/curriculum/electronics/karnaugh-map.jpg', '/curriculum/electronics/digital-circuits.jpg'],
    estimatedHours: 18,
    difficulty: 'intermediate',
    category: 'digital',
    subcategory: 'logic',
    serviceTrack: 'electronics' as ServiceTrack,
    requiredReading: [
      '"Digital Fundamentals" by Floyd',
      '"The Art of Electronics" - Chapter 10: Digital Logic',
      '74HC series datasheet library',
    ],
  },

  {
    level: 3,
    moduleNumber: '3.2',
    assignmentNumber: 'ELEC-3.2.1',
    orderIndex: 22,
    title: 'Arduino Programming & Interfacing',
    description: 'Master Arduino microcontroller platform - your gateway to embedded systems and physical computing.',
    instructions: `1. Study Arduino board anatomy: ATmega328P MCU, USB interface, voltage regulation, I/O pins
2. Learn Arduino IDE: installation, board selection, library management
3. Master C++ basics for Arduino: variables, data types, functions, control structures
4. Practice digital I/O: digitalWrite(), digitalRead(), pinMode()
5. Learn analog I/O: analogRead() (ADC), analogWrite() (PWM)
6. Master serial communication: Serial.print(), debugging, communication
7. Study interrupts: attachInterrupt(), debouncing, event detection
8. Practice timing: millis(), micros(), delay alternatives
9. Learn library usage: servo, stepper, I2C, SPI
10. Build 10 Arduino projects: LED control, sensor reading, motor control, display interfacing`,
    objectives: [
      'Program Arduino microcontroller confidently',
      'Interface with sensors and actuators',
      'Use serial communication for debugging',
      'Implement interrupts and timers',
      'Build complete Arduino-based systems',
    ],
    skills: ['Arduino programming', 'Embedded C++', 'Sensor interfacing', 'Motor control'],
    expectedOutcome: 'Ten working Arduino projects demonstrating all core concepts.',
    passingCriteria: 'All projects function correctly, code is well-structured and commented',
    referencePhotos: ['/curriculum/electronics/arduino-uno.jpg', '/curriculum/electronics/arduino-projects.jpg', '/curriculum/electronics/sensor-interface.jpg'],
    estimatedHours: 30,
    difficulty: 'intermediate',
    category: 'microcontrollers',
    subcategory: 'arduino',
    serviceTrack: 'electronics' as ServiceTrack,
    requiredReading: [
      '"Arduino Cookbook" by Michael Margolis',
      '"Programming Arduino" by Simon Monk',
      'Official Arduino reference documentation',
    ],
    crossReferences: [
      'Foundation for Computing Curriculum (Level 2-3) - Embedded Programming',
      'Used extensively in Woodworking-Aerospace (Level 7+) for sensor systems',
    ],
  },

  {
    level: 3,
    moduleNumber: '3.3',
    assignmentNumber: 'ELEC-3.3.1',
    orderIndex: 24,
    title: 'Sensors & Data Acquisition',
    description: 'Master sensors for measuring the physical world: temperature, pressure, light, motion, distance, and more.',
    instructions: `1. Study temperature sensors: thermistor, LM35, DS18B20, thermocouple
2. Learn pressure sensors: BMP280, MPX5700, load cells
3. Master light sensors: photoresistor, photodiode, TSL2561
4. Practice motion sensors: PIR, accelerometer (ADXL345), gyroscope
5. Learn distance sensors: ultrasonic (HC-SR04), IR, ToF (VL53L0X), LIDAR
6. Study gas sensors: MQ-2 (smoke), MQ-135 (air quality)
7. Master sensor signal conditioning: amplification, filtering, calibration
8. Learn I2C and SPI sensor communication
9. Practice data logging and visualization
10. Build weather station: temp, humidity, pressure, light`,
    objectives: [
      'Interface with 20+ different sensor types',
      'Condition sensor signals properly',
      'Calibrate sensors for accuracy',
      'Use I2C/SPI communication protocols',
      'Build data acquisition systems',
      'Log and visualize sensor data',
    ],
    skills: ['Sensor interfacing', 'Signal conditioning', 'I2C/SPI', 'Data acquisition', 'Calibration'],
    expectedOutcome: 'Working weather station with multiple sensors and data logging.',
    passingCriteria: 'Sensor readings are accurate (within datasheet specs), data logging works reliably',
    referencePhotos: ['/curriculum/electronics/sensors-array.jpg', '/curriculum/electronics/weather-station.jpg', '/curriculum/electronics/data-logging.jpg'],
    estimatedHours: 28,
    difficulty: 'intermediate',
    category: 'sensors',
    subcategory: 'acquisition',
    serviceTrack: 'electronics' as ServiceTrack,
    requiredReading: [
      '"Sensors: A Comprehensive Survey" - VCH Publishers',
      '"Practical Electronics for Inventors" - Sensors chapter',
      'Adafruit sensor tutorials and datasheets',
    ],
    crossReferences: [
      'CRITICAL for Woodworking-Aerospace (Level 9-12) - rocket telemetry and flight data',
      'Used in Computing Curriculum (Level 4-6) for IoT and data collection',
    ],
  },

  // ============================================================================
  // LEVEL 4: ADVANCED MICROCONTROLLERS (Months 10-12)
  // ============================================================================

  {
    level: 4,
    moduleNumber: '4.1',
    assignmentNumber: 'ELEC-4.1.1',
    orderIndex: 30,
    title: 'ESP32 & WiFi/Bluetooth Communication',
    description: 'Master ESP32 microcontroller for IoT applications with WiFi, Bluetooth, and advanced peripherals.',
    instructions: `1. Study ESP32 architecture: dual-core, WiFi/BT, 34 GPIO, ADC, DAC, touch sensors
2. Learn ESP-IDF framework: FreeRTOS, tasks, queues, semaphores
3. Practice WiFi connectivity: station mode, AP mode, web server
4. Master Bluetooth: BLE advertising, GATT services, classic Bluetooth
5. Learn over-the-air (OTA) updates: firmware updates via WiFi
6. Study deep sleep modes: power optimization, wake-up sources
7. Practice multi-tasking: dual-core task distribution
8. Build IoT devices: sensor nodes, remote controls, data loggers
9. Create web interface for device control
10. Build complete IoT system with cloud connectivity`,
    objectives: [
      'Program ESP32 for advanced applications',
      'Implement WiFi and Bluetooth communication',
      'Create web servers and APIs on ESP32',
      'Optimize power consumption with sleep modes',
      'Build professional IoT devices',
    ],
    skills: ['ESP32 programming', 'WiFi/BLE', 'FreeRTOS', 'IoT development', 'Power management'],
    expectedOutcome: 'Complete IoT system with ESP32 nodes, web interface, and cloud connectivity.',
    passingCriteria: 'WiFi connection is stable, BLE communication works, web interface is functional, power consumption is optimized',
    referencePhotos: ['/curriculum/electronics/esp32-dev.jpg', '/curriculum/electronics/iot-system.jpg', '/curriculum/electronics/web-interface.jpg'],
    estimatedHours: 32,
    difficulty: 'advanced',
    category: 'microcontrollers',
    subcategory: 'iot',
    serviceTrack: 'electronics' as ServiceTrack,
    requiredReading: [
      '"Kolban\'s Book on ESP32" by Neil Kolban',
      'ESP32 technical reference manual',
      'FreeRTOS documentation',
    ],
    crossReferences: [
      'Integrates with Computing Curriculum (Level 5-7) for cloud platforms and data processing',
    ],
  },

  // ============================================================================
  // LEVEL 5: PCB DESIGN & MANUFACTURING (Months 13-15)
  // ============================================================================

  {
    level: 5,
    moduleNumber: '5.1',
    assignmentNumber: 'ELEC-5.1.1',
    orderIndex: 40,
    title: 'PCB Design Fundamentals - KiCad Schematic Capture',
    description: 'Master PCB design using KiCad (open-source). Learn schematic capture, component libraries, and design rules.',
    instructions: `1. Install and configure KiCad (latest version)
2. Learn schematic editor: component placement, wiring, labels, power symbols
3. Master component library management: symbols, footprints, 3D models
4. Practice hierarchical schematics: sheets, ports, organization
5. Learn electrical rules checker (ERC): find errors before PCB layout
6. Study design documentation: title block, notes, BOM generation
7. Create custom schematic symbols for common parts
8. Design 5 schematics: power supply, Arduino shield, sensor board, motor driver, audio circuit
9. Run ERC and fix all errors
10. Generate complete BOM with part numbers and sources`,
    objectives: [
      'Create professional schematics in KiCad',
      'Organize complex designs hierarchically',
      'Use and create component libraries',
      'Generate error-free designs with ERC',
      'Produce manufacturing documentation',
    ],
    skills: ['Schematic capture', 'KiCad proficiency', 'Library management', 'Design documentation'],
    expectedOutcome: 'Five complete, error-free schematics with BOMs ready for PCB layout.',
    passingCriteria: 'All schematics pass ERC with zero errors, BOMs are complete and accurate',
    referencePhotos: ['/curriculum/electronics/kicad-schematic.jpg', '/curriculum/electronics/hierarchical-design.jpg', '/curriculum/electronics/bom-example.jpg'],
    estimatedHours: 24,
    difficulty: 'advanced',
    category: 'pcb-design',
    subcategory: 'schematic',
    serviceTrack: 'electronics' as ServiceTrack,
    requiredReading: [
      'KiCad official documentation',
      '"Getting to Blinky" PCB design tutorial series',
      '"PCB Design Best Practices" - Altium/KiCad resources',
    ],
    crossReferences: [
      'Complements Woodworking-Aerospace (Level 8+) - custom PCBs for rocket avionics',
    ],
  },

  {
    level: 5,
    moduleNumber: '5.2',
    assignmentNumber: 'ELEC-5.2.1',
    orderIndex: 42,
    title: 'PCB Layout - 2-Layer Boards',
    description: 'Master 2-layer PCB layout: component placement, routing, design rules, and manufacturing preparation.',
    instructions: `1. Study PCB layer stackup: top copper, bottom copper, silkscreen, soldermask
2. Learn footprint assignment: matching symbols to footprints
3. Practice component placement: logical grouping, signal flow, thermal considerations
4. Master routing: trace width calculation, clearance, via placement
5. Learn design rules: minimum trace width (6mil), spacing (6mil), via size
6. Study ground planes: copper pour, thermal relief, stitching vias
7. Practice high-speed routing: impedance control, differential pairs (later level)
8. Learn silkscreen: reference designators, polarity marks, company logo
9. Create manufacturing outputs: Gerber files, drill files, assembly drawings
10. Layout and manufacture 5 boards: power supply, Arduino shield, sensor breakout, motor driver, LED matrix`,
    objectives: [
      'Create manufacturable 2-layer PCB layouts',
      'Route boards following design rules',
      'Use ground planes effectively',
      'Generate Gerber files for fabrication',
      'Order PCBs from manufacturers (JLCPCB, PCBWay, OSH Park)',
      'Assemble and test manufactured boards',
    ],
    skills: ['PCB layout', 'Routing', 'Ground planes', 'Manufacturing prep', 'Assembly'],
    expectedOutcome: 'Five manufactured PCBs, assembled and tested.',
    passingCriteria: 'All boards pass DRC, manufacture without errors, assemble and function correctly',
    referencePhotos: ['/curriculum/electronics/pcb-layout.jpg', '/curriculum/electronics/ground-plane.jpg', '/curriculum/electronics/manufactured-pcb.jpg'],
    estimatedHours: 40,
    difficulty: 'advanced',
    category: 'pcb-design',
    subcategory: 'layout',
    serviceTrack: 'electronics' as ServiceTrack,
    requiredReading: [
      '"Complete PCB Design Using OrCAD Capture and PCB Editor" (concepts apply to KiCad)',
      'Saturn PCB Design Toolkit for trace width calculations',
      'IPC-2221 Generic Standard on Printed Board Design',
    ],
  },

  // Continue with remaining levels...
  // I'll create the structure for the advanced levels

  // ============================================================================
  // LEVEL 6-12: ADVANCED TOPICS (For rocket avionics and aerospace)
  // ============================================================================
  // Level 6: Advanced PCB - 4-layer, impedance control, high-speed design
  // Level 7: Power Electronics - Buck/boost converters, battery management, motor drivers
  // Level 8: RF & Wireless - RF design, antenna matching, telemetry systems
  // Level 9: IMU & Navigation - Accelerometers, gyroscopes, magnetometers, GPS, sensor fusion
  // Level 10: Flight Computer Design - Real-time systems, state machines, data logging
  // Level 11: Pyrotechnics & Igniter Circuits - E-match firing, continuity testing, safety interlocks
  // Level 12: Complete Avionics System - Flight computer + sensors + telemetry + recovery deployment

  // LEVEL 11 & 12 - Critical for Rocket Integration
  {
    level: 11,
    moduleNumber: '11.1',
    assignmentNumber: 'ELEC-11.1.1',
    orderIndex: 110,
    title: 'Pyrotechnic Circuits & E-Match Firing Systems',
    description: 'Design and build safe pyrotechnic firing circuits for rocket ignition and parachute deployment. SAFETY IS CRITICAL.',
    instructions: `1. Study e-match/igniter characteristics: resistance (1-2Ω), current requirements (1-3A), "all-fire" current
2. Learn safety interlocks: key switch, arming switch, continuity check, remove-before-flight pin
3. Master continuity testing: low current (<10mA) to prevent accidental ignition
4. Design MOSFET firing circuit: high-side or low-side switching, current capacity (10A+)
5. Practice safe wiring: twisted pairs, shielded cables, proper connectors
6. Learn multi-channel systems: deployment charges, motor ignition, separation
7. Study regulations: NFPA 1127, FAA requirements, range safety
8. Build firing controller with safety interlocks
9. Test with dummy loads (resistors) before live pyro
10. Create comprehensive safety procedures and checklists`,
    objectives: [
      'Design safe pyrotechnic firing circuits',
      'Implement multiple safety interlocks',
      'Test continuity without firing',
      'Handle high currents safely',
      'Follow regulations and safety standards',
      'Build reliable flight-proven systems',
    ],
    skills: ['Pyrotechnic safety', 'High-current switching', 'Safety interlocks', 'Regulation compliance'],
    expectedOutcome: 'Multi-channel pyrotechnic controller with tested safety systems.',
    passingCriteria: 'All safety interlocks function correctly, continuity testing works, dummy load firing successful, zero accidental activations',
    referencePhotos: ['/curriculum/electronics/firing-circuit.jpg', '/curriculum/electronics/safety-interlocks.jpg', '/curriculum/electronics/continuity-test.jpg'],
    estimatedHours: 30,
    difficulty: 'expert',
    category: 'pyrotechnics',
    subcategory: 'ignition',
    serviceTrack: 'electronics' as ServiceTrack,
    requiredReading: [
      'NFPA 1127 - Code for High Power Rocketry',
      'Tripoli Rocketry Association Safety Code',
      '"Ignition Systems for Model Rockets" technical papers',
      'E-match manufacturer datasheets and safety guides',
    ],
    crossReferences: [
      'CRITICAL for Woodworking-Aerospace Curriculum (Level 12) - rocket ignition and deployment',
      'Integrates with Computing Curriculum (Level 10-11) for flight software control',
    ],
  },

  {
    level: 12,
    moduleNumber: '12.1',
    assignmentNumber: 'ELEC-12.1.1',
    orderIndex: 120,
    title: 'Complete Flight Avionics System Integration',
    description: 'Design and build complete rocket avionics: flight computer, sensors, telemetry, recovery, and ignition. This is where everything comes together.',
    instructions: `1. Design system architecture: flight computer (STM32/ESP32), sensor suite, radio, pyro channels
2. Create 4-layer PCB: power distribution, sensor interfaces, RF section, pyro drivers
3. Integrate sensors: barometer (altitude), IMU (orientation), GPS (position), temperature
4. Design power system: LiPo battery, buck converters (5V, 3.3V), current monitoring
5. Implement telemetry: 915MHz LoRa or 2.4GHz radio, ground station receiver
6. Add data logging: SD card or flash memory for flight data recording
7. Design recovery system: dual-deployment altimeter, backup redundancy
8. Build ground support equipment: launch controller, telemetry receiver
9. Create comprehensive testing procedures: bench tests, ground tests, flight-ready checks
10. Document complete system: schematics, code, operating procedures, failure modes
11. Integration test with rocket airframe from woodworking curriculum
12. Conduct test flights with progressive complexity`,
    objectives: [
      'Integrate all subsystems into cohesive avionics package',
      'Design for reliability and redundancy',
      'Implement telemetry and data logging',
      'Create complete test and operations procedures',
      'Build flight-proven system',
      'Successfully fly and recover rocket with custom avionics',
    ],
    skills: ['System integration', 'Avionics design', 'Reliability engineering', 'Flight testing', 'Documentation'],
    expectedOutcome: 'Complete flight avionics system, tested and flown successfully in rocket.',
    passingCriteria: 'All subsystems functional, telemetry received, data logged, deployment successful, rocket recovered safely',
    referencePhotos: ['/curriculum/electronics/avionics-bay.jpg', '/curriculum/electronics/flight-computer.jpg', '/curriculum/electronics/successful-flight.jpg'],
    estimatedHours: 120,
    difficulty: 'expert',
    category: 'avionics',
    subcategory: 'integration',
    serviceTrack: 'electronics' as ServiceTrack,
    requiredReading: [
      'Review ALL electronics curriculum materials',
      '"Avionics Navigation Systems" by Myron Kayton',
      'Tripoli Level 3 certification requirements',
      'Flight computer designs: TeleMetrum, EasyMini technical documentation',
    ],
    crossReferences: [
      'INTEGRATES WITH Woodworking-Aerospace Curriculum (Level 12 Capstone) - complete rocket',
      'REQUIRES Computing Curriculum (Level 11-12) - flight software and ground station',
      'Uses skills from ALL previous electronics levels',
    ],
  },
]

export async function seedElectronicsCurriculum() {
  console.log('⚡ Seeding Electronics Curriculum...')
  console.log('From circuits to complete rocket avionics - the electronic nervous system of SuberCraftex spacecraft')

  for (const assignment of electronicsCurriculum) {
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

  console.log(`\n✅ Electronics Curriculum seeded successfully!`)
  console.log(`   Total assignments (SAMPLE): ${electronicsCurriculum.length}`)
  console.log(`   Full curriculum will have ~180 assignments across 12 levels`)
  console.log(`   Level 1 (Fundamentals): Safety, Ohm's Law, Components, Soldering`)
  console.log(`   Level 2 (Semiconductors): Diodes, Transistors, Op-Amps`)
  console.log(`   Level 3 (Digital/MCU): Logic, Arduino, Sensors`)
  console.log(`   Level 4 (Advanced MCU): ESP32, IoT, Communication`)
  console.log(`   Level 5 (PCB Design): KiCad, 2-layer boards, Manufacturing`)
  console.log(`   Level 11 (Pyrotechnics): Igniter circuits, Safety systems`)
  console.log(`   Level 12 (Avionics): Complete flight computer integration`)
  console.log(`\n🚀 This curriculum provides all electronics knowledge needed for rocket avionics!`)
}

// Run if called directly
if (require.main === module) {
  seedElectronicsCurriculum()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

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

const computingCurriculum: AssignmentTemplateData[] = [
  // ============================================================================
  // LEVEL 1: PROGRAMMING FUNDAMENTALS (Months 1-3)
  // ============================================================================

  {
    level: 1,
    moduleNumber: '1.1',
    assignmentNumber: 'COMP-1.1.1',
    orderIndex: 1,
    title: 'Development Environment Setup & Command Line Basics',
    description: 'Set up professional development environment and master command line - the foundation of all software development.',
    instructions: `1. Install operating system: Linux (Ubuntu/Debian) or macOS for development
2. Learn terminal/command line basics: navigation, file operations, permissions
3. Master shell commands: ls, cd, mkdir, rm, cp, mv, grep, find, chmod
4. Study text editors: Vim basics, VS Code/Cursor setup with extensions
5. Install programming languages: Python 3.11+, Node.js, GCC/Clang
6. Learn version control: Git basics, GitHub account, SSH keys
7. Practice Git workflow: clone, add, commit, push, pull, branch, merge
8. Set up package managers: pip (Python), npm (JavaScript), apt/brew (system)
9. Create development workspace with organized project structure
10. Complete 50 command line exercises`,
    objectives: [
      'Navigate filesystem confidently via command line',
      'Use Git for version control',
      'Set up complete development environment',
      'Use text editors efficiently',
      'Manage software packages and dependencies',
      'Understand Linux/Unix fundamentals',
    ],
    skills: ['Command line', 'Git', 'Development tools', 'Linux basics'],
    expectedOutcome: 'Fully configured development environment with Git proficiency.',
    passingCriteria: 'Complete all command line exercises, demonstrate Git workflow, environment passes setup checklist',
    referencePhotos: ['/curriculum/computing/terminal.jpg', '/curriculum/computing/vscode.jpg', '/curriculum/computing/git-workflow.jpg'],
    estimatedHours: 16,
    difficulty: 'beginner',
    category: 'fundamentals',
    subcategory: 'setup',
    serviceTrack: 'computing' as ServiceTrack,
    requiredReading: [
      '"The Linux Command Line" by William Shotts',
      '"Pro Git" by Scott Chacon (free online)',
      'Missing Semester of Your CS Education (MIT course - online)',
    ],
  },

  {
    level: 1,
    moduleNumber: '1.2',
    assignmentNumber: 'COMP-1.2.1',
    orderIndex: 2,
    title: 'Python Programming Fundamentals',
    description: 'Master Python - the most versatile language for automation, data processing, and rapid prototyping.',
    instructions: `1. Study Python syntax: indentation, variables, data types (int, float, str, bool)
2. Learn control flow: if/elif/else, for loops, while loops, break, continue
3. Master data structures: lists, tuples, dictionaries, sets
4. Practice functions: def, parameters, return values, scope
5. Learn string manipulation: formatting, slicing, methods
6. Study file I/O: open(), read(), write(), with statement
7. Master list comprehensions and generator expressions
8. Learn error handling: try/except/finally, raising exceptions
9. Practice modules and imports: standard library, pip packages
10. Complete 100 Python programming exercises (easy → medium difficulty)
11. Build 5 practical programs: calculator, file organizer, data processor, web scraper, automation script`,
    objectives: [
      'Write Python programs confidently',
      'Use appropriate data structures',
      'Handle errors gracefully',
      'Read and write files',
      'Create reusable functions',
      'Solve real-world problems with code',
    ],
    skills: ['Python programming', 'Algorithm design', 'Problem solving', 'Code organization'],
    expectedOutcome: 'Five working Python programs demonstrating core concepts.',
    passingCriteria: 'All programs function correctly, code is well-structured and commented, passes 90%+ of exercises',
    referencePhotos: ['/curriculum/computing/python-code.jpg', '/curriculum/computing/python-projects.jpg'],
    estimatedHours: 40,
    difficulty: 'beginner',
    category: 'programming',
    subcategory: 'python',
    serviceTrack: 'computing' as ServiceTrack,
    requiredReading: [
      '"Python Crash Course" by Eric Matthes',
      '"Automate the Boring Stuff with Python" by Al Sweigart',
      'Official Python Tutorial (python.org)',
    ],
  },

  {
    level: 1,
    moduleNumber: '1.3',
    assignmentNumber: 'COMP-1.3.1',
    orderIndex: 3,
    title: 'Algorithms & Data Structures Basics',
    description: 'Learn fundamental algorithms and data structures - the building blocks of efficient software.',
    instructions: `1. Study algorithm complexity: Big O notation, time and space complexity
2. Learn sorting algorithms: bubble sort, insertion sort, merge sort, quicksort
3. Master searching: linear search, binary search, hash tables
4. Practice recursion: base case, recursive case, call stack
5. Study linked lists: singly linked, doubly linked, implementation
6. Learn stacks and queues: LIFO/FIFO, implementation, applications
7. Master trees: binary trees, binary search trees, traversal (inorder, preorder, postorder)
8. Study graphs basics: representation, BFS, DFS
9. Implement all data structures from scratch in Python
10. Solve 50 algorithm problems on LeetCode/HackerRank (easy difficulty)`,
    objectives: [
      'Analyze algorithm time and space complexity',
      'Implement fundamental data structures',
      'Choose appropriate data structure for problem',
      'Write efficient algorithms',
      'Solve coding interview-style problems',
    ],
    skills: ['Algorithms', 'Data structures', 'Complexity analysis', 'Problem solving'],
    expectedOutcome: 'Implementations of all major data structures and 50 solved algorithm problems.',
    passingCriteria: 'All implementations correct and efficient, solve 45+ out of 50 problems',
    referencePhotos: ['/curriculum/computing/big-o.jpg', '/curriculum/computing/data-structures.jpg', '/curriculum/computing/algorithm-viz.jpg'],
    estimatedHours: 32,
    difficulty: 'beginner',
    category: 'algorithms',
    subcategory: 'fundamentals',
    serviceTrack: 'computing' as ServiceTrack,
    requiredReading: [
      '"Grokking Algorithms" by Aditya Bhargava',
      '"Introduction to Algorithms" by CLRS (reference)',
      'AlgoExpert or LeetCode study plans',
    ],
  },

  // ============================================================================
  // LEVEL 2: EMBEDDED SYSTEMS PROGRAMMING (Months 4-6)
  // ============================================================================

  {
    level: 2,
    moduleNumber: '2.1',
    assignmentNumber: 'COMP-2.1.1',
    orderIndex: 10,
    title: 'C Programming for Embedded Systems',
    description: 'Master C - the language of embedded systems, operating systems, and high-performance software.',
    instructions: `1. Study C syntax: variables, pointers, arrays, structs
2. Master memory management: malloc/free, memory leaks, valgrind
3. Learn pointer arithmetic: array indexing, pointer to pointer
4. Practice bit manipulation: bitwise operators, bit masks, bit fields
5. Study header files and compilation: preprocessor, linking, makefiles
6. Master structs and unions: memory layout, typedef, packed structs
7. Learn function pointers: callbacks, function tables
8. Practice file I/O in C: fopen, fread, fwrite, binary files
9. Study embedded C concepts: volatile, const, static, inline
10. Implement data structures in C: linked list, stack, queue, hash table
11. Build 10 C programs for embedded-style applications`,
    objectives: [
      'Write efficient C code for embedded systems',
      'Manage memory correctly without leaks',
      'Use pointers and pointer arithmetic',
      'Understand memory layout and optimization',
      'Interface with hardware registers (preparation)',
      'Debug C programs with GDB',
    ],
    skills: ['C programming', 'Memory management', 'Pointers', 'Bit manipulation', 'Debugging'],
    expectedOutcome: 'Ten C programs demonstrating embedded programming concepts.',
    passingCriteria: 'All programs compile without warnings (-Wall -Werror), no memory leaks (valgrind clean), code is efficient',
    referencePhotos: ['/curriculum/computing/c-code.jpg', '/curriculum/computing/memory-layout.jpg', '/curriculum/computing/valgrind.jpg'],
    estimatedHours: 48,
    difficulty: 'intermediate',
    category: 'programming',
    subcategory: 'c-language',
    serviceTrack: 'computing' as ServiceTrack,
    requiredReading: [
      '"The C Programming Language" by Kernighan & Ritchie (K&R)',
      '"Expert C Programming: Deep C Secrets" by Peter van der Linden',
      '"Embedded C Coding Standard" by Michael Barr',
    ],
    crossReferences: [
      'Builds on Electronics Curriculum (Level 3) - Arduino C++ programming',
      'Foundation for embedded flight software in later levels',
    ],
  },

  {
    level: 2,
    moduleNumber: '2.2',
    assignmentNumber: 'COMP-2.2.1',
    orderIndex: 12,
    title: 'Bare-Metal ARM Cortex Programming',
    description: 'Program ARM microcontrollers at the register level - no Arduino libraries, direct hardware control.',
    instructions: `1. Study ARM Cortex-M architecture: STM32, registers, memory map
2. Learn startup code: vector table, reset handler, clock configuration
3. Master GPIO control: mode registers, output data register (ODR), input data register (IDR)
4. Practice bit-banding and bit manipulation on hardware registers
5. Learn interrupt handling: NVIC, interrupt priorities, ISR implementation
6. Study timers: basic timer, PWM generation, input capture
7. Master UART communication: baud rate calculation, transmit/receive, interrupts
8. Learn SPI and I2C: bit-banging and hardware peripheral usage
9. Practice ADC: single conversion, continuous mode, DMA
10. Build firmware from scratch: no HAL, direct register access
11. Create bootloader basics: jump to application, firmware update`,
    objectives: [
      'Program ARM Cortex-M without libraries',
      'Control hardware peripherals directly',
      'Handle interrupts correctly',
      'Implement communication protocols',
      'Read and understand datasheets and reference manuals',
      'Write efficient bare-metal firmware',
    ],
    skills: ['Bare-metal programming', 'ARM Cortex-M', 'Register-level control', 'Interrupt handling'],
    expectedOutcome: 'Complete firmware projects controlling STM32 peripherals without HAL.',
    passingCriteria: 'All peripherals function correctly, interrupts handled properly, code is efficient and well-documented',
    referencePhotos: ['/curriculum/computing/stm32-register.jpg', '/curriculum/computing/bare-metal.jpg', '/curriculum/computing/interrupt-handling.jpg'],
    estimatedHours: 56,
    difficulty: 'intermediate',
    category: 'embedded',
    subcategory: 'bare-metal',
    serviceTrack: 'computing' as ServiceTrack,
    requiredReading: [
      '"The Definitive Guide to ARM Cortex-M3 and Cortex-M4" by Joseph Yiu',
      'STM32 reference manual (RM0008 or similar)',
      '"Mastering STM32" by Carmine Noviello',
    ],
    crossReferences: [
      'Requires Electronics Curriculum (Level 3-4) - microcontroller hardware knowledge',
      'Foundation for flight computer programming (Level 10-12)',
    ],
  },

  // ============================================================================
  // LEVEL 3: REAL-TIME SYSTEMS (Months 7-9)
  // ============================================================================

  {
    level: 3,
    moduleNumber: '3.1',
    assignmentNumber: 'COMP-3.1.1',
    orderIndex: 20,
    title: 'FreeRTOS - Real-Time Operating System',
    description: 'Master FreeRTOS for real-time embedded applications - essential for flight software and complex embedded systems.',
    instructions: `1. Study RTOS concepts: tasks, scheduler, context switching, tick rate
2. Learn task creation: xTaskCreate, task priorities, task states
3. Master task synchronization: semaphores (binary, counting), mutexes
4. Practice inter-task communication: queues, message passing
5. Learn task notifications: lightweight synchronization
6. Study software timers: periodic callbacks, one-shot timers
7. Master critical sections: taskENTER_CRITICAL, taskEXIT_CRITICAL
8. Learn memory management: heap schemes (heap_1 through heap_5)
9. Practice priority inversion solutions: priority inheritance
10. Build multi-tasking applications: sensor reading, data logging, communication, user interface
11. Profile and optimize RTOS performance`,
    objectives: [
      'Design multi-tasking real-time systems',
      'Synchronize tasks correctly',
      'Avoid deadlocks and priority inversion',
      'Choose appropriate RTOS primitives',
      'Build responsive embedded systems',
      'Meet real-time deadlines',
    ],
    skills: ['RTOS', 'Multi-tasking', 'Synchronization', 'Real-time design', 'Performance optimization'],
    expectedOutcome: 'Complex multi-tasking applications on FreeRTOS demonstrating all concepts.',
    passingCriteria: 'No deadlocks, tasks meet deadlines, synchronization is correct, system is stable',
    referencePhotos: ['/curriculum/computing/freertos-tasks.jpg', '/curriculum/computing/rtos-timing.jpg', '/curriculum/computing/task-diagram.jpg'],
    estimatedHours: 40,
    difficulty: 'advanced',
    category: 'embedded',
    subcategory: 'rtos',
    serviceTrack: 'computing' as ServiceTrack,
    requiredReading: [
      '"Mastering the FreeRTOS Real Time Kernel" by Richard Barry (free PDF)',
      'FreeRTOS official documentation and API reference',
      '"Real-Time Systems" by Jane W. S. Liu',
    ],
    crossReferences: [
      'Used with Electronics Curriculum (Level 4) - ESP32 dual-core FreeRTOS',
      'Critical for flight software (Level 10-12)',
    ],
  },

  // ============================================================================
  // LEVEL 4-12: ADVANCED TOPICS
  // ============================================================================
  // Level 4: Communication Protocols - UART, SPI, I2C, CAN, USB
  // Level 5: Sensor Fusion & Kalman Filtering - IMU data processing
  // Level 6: Control Systems - PID control, state-space, feedback loops
  // Level 7: Data Logging & Telemetry - SD cards, flash memory, radio protocols
  // Level 8: Ground Station Software - GUI, data visualization, commanding
  // Level 9: Computer Vision - OpenCV, object detection, tracking
  // Level 10: Flight Software Architecture - State machines, fault tolerance
  // Level 11: Rocket Flight Software - Ignition sequencing, deployment logic
  // Level 12: AI & Machine Learning - Data centers, distributed systems

  // LEVEL 10 & 11 - Flight Software for Rockets
  {
    level: 10,
    moduleNumber: '10.1',
    assignmentNumber: 'COMP-10.1.1',
    orderIndex: 100,
    title: 'Flight Software Architecture & State Machines',
    description: 'Design robust flight software architecture using state machines - the foundation of reliable autonomous systems.',
    instructions: `1. Study flight software requirements: reliability, determinism, fault tolerance
2. Learn state machine design: states, transitions, events, guards
3. Master hierarchical state machines (HSM): substates, history states
4. Practice fault detection and recovery: watchdogs, error handling, safe modes
5. Study flight phases: pre-launch, boost, coast, apogee, drogue, main, landing
6. Design state machine for rocket flight: detect events, transition correctly
7. Learn event-driven architecture: event queues, handlers, priorities
8. Master data validation: sensor redundancy, voting algorithms, outlier detection
9. Practice software safety: MISRA C compliance, code review, static analysis
10. Build complete flight software architecture
11. Simulate flight scenarios and verify state transitions`,
    objectives: [
      'Design flight software using state machines',
      'Handle all flight phases correctly',
      'Implement fault detection and recovery',
      'Validate sensor data with redundancy',
      'Write safety-critical software',
      'Verify software through simulation',
    ],
    skills: ['State machine design', 'Flight software', 'Fault tolerance', 'Safety-critical software'],
    expectedOutcome: 'Complete flight software architecture with state machine implementation.',
    passingCriteria: 'State machine handles all flight scenarios correctly, fault recovery works, passes simulation tests',
    referencePhotos: ['/curriculum/computing/state-machine.jpg', '/curriculum/computing/flight-phases.jpg', '/curriculum/computing/fault-handling.jpg'],
    estimatedHours: 60,
    difficulty: 'expert',
    category: 'flight-software',
    subcategory: 'architecture',
    serviceTrack: 'computing' as ServiceTrack,
    requiredReading: [
      '"Practical Statecharts in C/C++" by Miro Samek',
      'NASA Flight Software Complexity study',
      '"Safety Critical Systems Handbook" by David Smith',
      'MISRA C:2012 Guidelines',
    ],
    crossReferences: [
      'Integrates with Electronics Curriculum (Level 11-12) - avionics hardware',
      'Used in Woodworking-Aerospace (Level 12) - complete rocket system',
    ],
  },

  {
    level: 11,
    moduleNumber: '11.1',
    assignmentNumber: 'COMP-11.1.1',
    orderIndex: 110,
    title: 'Rocket Flight Software Implementation',
    description: 'Implement complete rocket flight software: sensor processing, apogee detection, deployment logic, and telemetry.',
    instructions: `1. Implement sensor drivers: barometer (altitude), IMU (orientation), GPS (position)
2. Master sensor fusion: Kalman filter for altitude, complementary filter for orientation
3. Learn apogee detection algorithms: velocity-based, acceleration-based, Kalman-based
4. Design deployment logic: drogue at apogee, main at 500ft AGL, backup timers
5. Implement ignition sequencing: continuity check, countdown, ignition command
6. Master telemetry protocol: packet structure, CRC, acknowledge, real-time transmission
7. Practice data logging: high-rate logging to flash, post-flight analysis
8. Learn ground-test modes: sensor calibration, actuator tests, safe modes
9. Build complete flight software for rocket
10. Conduct hardware-in-the-loop (HIL) testing
11. Perform flight simulations with realistic sensor data
12. Create ground station software for monitoring and control`,
    objectives: [
      'Process sensor data in real-time',
      'Detect apogee accurately',
      'Deploy parachutes at correct altitudes',
      'Log all flight data reliably',
      'Transmit telemetry to ground station',
      'Handle all failure modes safely',
    ],
    skills: ['Sensor fusion', 'Apogee detection', 'Deployment logic', 'Telemetry', 'Data logging'],
    expectedOutcome: 'Complete flight software, tested in simulation and HIL, ready for integration.',
    passingCriteria: 'Apogee detection accurate within 50ft, deployments occur at correct altitudes, all data logged, telemetry received',
    referencePhotos: ['/curriculum/computing/flight-software.jpg', '/curriculum/computing/apogee-detection.jpg', '/curriculum/computing/ground-station.jpg'],
    estimatedHours: 80,
    difficulty: 'expert',
    category: 'flight-software',
    subcategory: 'implementation',
    serviceTrack: 'computing' as ServiceTrack,
    requiredReading: [
      'Review all Computing and Electronics curriculum',
      '"Fundamentals of Kalman Filtering" by Paul Zarchan',
      'TeleMetrum and EasyMini firmware source code (study)',
      'Open source flight computers: AltusMetrum, OpenRocket',
    ],
    crossReferences: [
      'CRITICAL INTEGRATION with Electronics Curriculum (Level 12) - complete avionics',
      'FINAL INTEGRATION with Woodworking-Aerospace (Level 12) - complete rocket',
      'Works with all sensor systems from Electronics curriculum',
    ],
  },

  // LEVEL 12 - AI, Machine Learning, Data Centers
  {
    level: 12,
    moduleNumber: '12.1',
    assignmentNumber: 'COMP-12.1.1',
    orderIndex: 120,
    title: 'Machine Learning & AI for Manufacturing',
    description: 'Apply machine learning to manufacturing optimization, quality control, and predictive maintenance for SuberCraftex operations.',
    instructions: `1. Study machine learning basics: supervised, unsupervised, reinforcement learning
2. Learn Python ML libraries: NumPy, Pandas, Scikit-learn, TensorFlow, PyTorch
3. Master data preprocessing: cleaning, normalization, feature engineering
4. Practice classification: quality control, defect detection (computer vision)
5. Learn regression: demand forecasting, inventory optimization
6. Study computer vision: OpenCV, object detection (YOLO), image classification
7. Master time series analysis: sensor data, predictive maintenance
8. Learn neural networks: design, training, hyperparameter tuning
9. Practice deployment: model serving, edge deployment, optimization
10. Build ML system for SuberCraftex: quality inspection, inventory forecasting, or process optimization`,
    objectives: [
      'Apply ML to real manufacturing problems',
      'Build computer vision quality inspection systems',
      'Forecast demand and optimize inventory',
      'Implement predictive maintenance',
      'Deploy ML models to production',
      'Understand AI capabilities and limitations',
    ],
    skills: ['Machine learning', 'Computer vision', 'Data analysis', 'Model deployment', 'AI applications'],
    expectedOutcome: 'Working ML system deployed for SuberCraftex operations.',
    passingCriteria: 'Model achieves >90% accuracy on test set, system runs reliably in production, provides actionable insights',
    referencePhotos: ['/curriculum/computing/ml-pipeline.jpg', '/curriculum/computing/cv-quality.jpg', '/curriculum/computing/prediction.jpg'],
    estimatedHours: 60,
    difficulty: 'expert',
    category: 'ai-ml',
    subcategory: 'applications',
    serviceTrack: 'computing' as ServiceTrack,
    requiredReading: [
      '"Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow" by Aurélien Géron',
      '"Deep Learning" by Ian Goodfellow (deeplearningbook.org)',
      'Fast.ai courses (practical deep learning)',
    ],
  },

  {
    level: 12,
    moduleNumber: '12.2',
    assignmentNumber: 'COMP-12.2.1',
    orderIndex: 122,
    title: 'Data Center Infrastructure & Cloud Systems',
    description: 'Design and deploy data center infrastructure to support SuberCraftex\'s growing computing needs - from edge to cloud.',
    instructions: `1. Study data center architecture: compute, storage, networking
2. Learn server hardware: rack servers, blade servers, storage arrays
3. Master virtualization: KVM, VMware, containerization (Docker, Kubernetes)
4. Practice network design: switching, routing, VLANs, firewalls
5. Learn storage systems: SAN, NAS, object storage, RAID configurations
6. Study high availability: redundancy, load balancing, failover
7. Master monitoring: Prometheus, Grafana, log aggregation
8. Learn backup and disaster recovery: strategies, testing
9. Practice cloud integration: hybrid cloud, edge computing
10. Design and deploy compute infrastructure for SuberCraftex
11. Build telemetry data pipeline: collection, storage, analysis, visualization`,
    objectives: [
      'Design scalable data center infrastructure',
      'Deploy virtualized and containerized workloads',
      'Ensure high availability and fault tolerance',
      'Monitor and maintain systems proactively',
      'Integrate edge and cloud computing',
      'Support SuberCraftex\'s growing data needs',
    ],
    skills: ['Data center design', 'Virtualization', 'Networking', 'High availability', 'Cloud infrastructure'],
    expectedOutcome: 'Deployed infrastructure supporting SuberCraftex operations with monitoring and redundancy.',
    passingCriteria: 'Infrastructure achieves >99.9% uptime, handles peak loads, monitoring provides actionable alerts',
    referencePhotos: ['/curriculum/computing/data-center.jpg', '/curriculum/computing/kubernetes.jpg', '/curriculum/computing/monitoring.jpg'],
    estimatedHours: 70,
    difficulty: 'expert',
    category: 'infrastructure',
    subcategory: 'data-center',
    serviceTrack: 'computing' as ServiceTrack,
    requiredReading: [
      '"The Data Center as a Computer" by Luiz André Barroso',
      '"Kubernetes: Up and Running" by Kelsey Hightower',
      '"Site Reliability Engineering" by Google (free online)',
    ],
    crossReferences: [
      'Supports ALL SuberCraftex operations: manufacturing, inventory, customer systems',
      'Processes telemetry data from Electronics/Aerospace systems',
    ],
  },
]

export async function seedComputingCurriculum() {
  console.log('💻 Seeding Computing Curriculum...')
  console.log('From programming basics to AI and data centers - the brain controlling SuberCraftex spacecraft')

  for (const assignment of computingCurriculum) {
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

  console.log(`\n✅ Computing Curriculum seeded successfully!`)
  console.log(`   Total assignments (SAMPLE): ${computingCurriculum.length}`)
  console.log(`   Full curriculum will have ~180 assignments across 12 levels`)
  console.log(`   Level 1 (Fundamentals): Command line, Python, Algorithms`)
  console.log(`   Level 2 (Embedded): C programming, ARM Cortex bare-metal`)
  console.log(`   Level 3 (Real-Time): FreeRTOS, multi-tasking`)
  console.log(`   Level 10 (Flight Software): State machines, fault tolerance`)
  console.log(`   Level 11 (Rocket Software): Sensor fusion, apogee detection, deployment`)
  console.log(`   Level 12 (AI/Infrastructure): Machine learning, data centers`)
  console.log(`\n🚀 This curriculum provides complete software stack for spacecraft!`)
}

// Run if called directly
if (require.main === module) {
  seedComputingCurriculum()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

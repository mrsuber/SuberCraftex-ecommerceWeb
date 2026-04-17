import { PrismaClient } from '@prisma/client'
import { seedTailoringCurriculum } from './tailoring-curriculum'
import { seedDeviceRepairCurriculum } from './device-repair-curriculum'
import { seedPrintingPressCurriculum } from './printing-press-curriculum'
import { seedBeadworkCurriculum } from './beadwork-curriculum'
import { seedHennaCurriculum } from './henna-curriculum'
import { seedEmbroideryCurriculum } from './embroidery-curriculum'
import { seedElectronicsCurriculum } from './electronics-curriculum'
import { seedComputingCurriculum } from './computing-curriculum'
import { seedWoodworkingAerospaceCurriculum } from './woodworking-aerospace-curriculum'
import { seedLeatherWorkingCurriculum } from './leather-working-curriculum'

const prisma = new PrismaClient()

/**
 * Master Seed Script for SuberCraftex Complete Curriculum System
 *
 * This script seeds all apprenticeship curricula in the correct order,
 * respecting dependencies and cross-references between curricula.
 *
 * Curriculum Dependency Order:
 * 1. Foundation Curricula (can be seeded independently):
 *    - Tailoring
 *    - Device Repair
 *    - Printing Press
 *    - Beadwork
 *    - Henna
 *    - Leather Working (NEW!)
 *
 * 2. Technical Curricula (reference foundations):
 *    - Embroidery (references: Tailoring, Printing Press, Beadwork)
 *    - Electronics (references: Device Repair)
 *    - Computing (references: Electronics)
 *
 * 3. Master Integration Curriculum:
 *    - Woodworking-Aerospace (references: ALL above)
 *
 * Total: 10 curricula, ~878 assignments across 76 levels
 */

async function masterSeed() {
  console.log('🚀 ============================================================')
  console.log('🚀 SuberCraftex Master Curriculum Seed')
  console.log('🚀 Building the Complete Educational System for Spacecraft')
  console.log('🚀 ============================================================\n')

  try {
    // ========================================================================
    // PHASE 1: Foundation Curricula
    // ========================================================================
    console.log('📦 PHASE 1: Seeding Foundation Curricula...\n')

    console.log('1/9 Tailoring Curriculum')
    console.log('    (Garments, Parachutes, Upholstery, Soft Goods)')
    await seedTailoringCurriculum()
    console.log('    ✅ Complete\n')

    console.log('2/9 Device Repair Curriculum')
    console.log('    (Electronics Troubleshooting & Repair)')
    await seedDeviceRepairCurriculum()
    console.log('    ✅ Complete\n')

    console.log('3/9 Printing Press Curriculum')
    console.log('    (Screen Printing, Vinyl, DTG, Sublimation)')
    await seedPrintingPressCurriculum()
    console.log('    ✅ Complete\n')

    console.log('4/9 Beadwork Curriculum')
    console.log('    (Traditional Beading & Decorative Arts)')
    await seedBeadworkCurriculum()
    console.log('    ✅ Complete\n')

    console.log('5/10 Henna Curriculum')
    console.log('    (Henna Tattoo Art & Design)')
    await seedHennaCurriculum()
    console.log('    ✅ Complete\n')

    console.log('6/10 Leather Working Curriculum')
    console.log('    (Raw Hide to Finished Leather Goods)')
    console.log('    Covers: Tanning, Wallets, Bags, Shoes, Boots, Furniture, Business')
    await seedLeatherWorkingCurriculum()
    console.log('    ✅ Complete\n')

    // ========================================================================
    // PHASE 2: Technical Curricula (with cross-references)
    // ========================================================================
    console.log('📦 PHASE 2: Seeding Technical Curricula...\n')

    console.log('7/10 Embroidery Curriculum')
    console.log('    (Machine Embroidery, Digitizing, Mission Patches)')
    console.log('    Cross-refs: Tailoring, Printing Press, Beadwork, Woodworking-Aerospace')
    await seedEmbroideryCurriculum()
    console.log('    ✅ Complete\n')

    console.log('8/10 Electronics Curriculum')
    console.log('    (Circuits, PCB Design, Microcontrollers, Avionics)')
    console.log('    Cross-refs: Device Repair, Computing, Woodworking-Aerospace')
    await seedElectronicsCurriculum()
    console.log('    ✅ Complete\n')

    console.log('9/10 Computing Curriculum')
    console.log('    (Programming, Embedded Systems, Flight Software, AI, Data Centers)')
    console.log('    Cross-refs: Electronics, Woodworking-Aerospace')
    await seedComputingCurriculum()
    console.log('    ✅ Complete\n')

    // ========================================================================
    // PHASE 3: Master Integration Curriculum
    // ========================================================================
    console.log('📦 PHASE 3: Seeding Master Integration Curriculum...\n')

    console.log('10/10 Woodworking → Aerospace Manufacturing Curriculum')
    console.log('    (Wood → Metal → Fusion 360 → Machining → Foundry → Rockets)')
    console.log('    Cross-refs: ALL curricula')
    console.log('    This is where EVERYTHING connects!')
    await seedWoodworkingAerospaceCurriculum()
    console.log('    ✅ Complete\n')

    // ========================================================================
    // Summary
    // ========================================================================
    console.log('🚀 ============================================================')
    console.log('🚀 Master Curriculum Seed Complete!')
    console.log('🚀 ============================================================\n')

    // Get statistics
    const stats = await Promise.all([
      prisma.assignmentTemplate.count({ where: { serviceTrack: 'tailoring' } }),
      prisma.assignmentTemplate.count({ where: { serviceTrack: 'device_repair' } }),
      prisma.assignmentTemplate.count({ where: { serviceTrack: 'printing_press' } }),
      prisma.assignmentTemplate.count({ where: { serviceTrack: 'beadwork' } }),
      prisma.assignmentTemplate.count({ where: { serviceTrack: 'henna' } }),
      prisma.assignmentTemplate.count({ where: { serviceTrack: 'leather_working' } }),
      prisma.assignmentTemplate.count({ where: { serviceTrack: 'embroidery' } }),
      prisma.assignmentTemplate.count({ where: { serviceTrack: 'electronics' } }),
      prisma.assignmentTemplate.count({ where: { serviceTrack: 'computing' } }),
      prisma.assignmentTemplate.count({ where: { serviceTrack: 'woodworking_aerospace' } }),
      prisma.assignmentTemplate.count(),
    ])

    const [
      tailoringCount,
      deviceRepairCount,
      printingPressCount,
      beadworkCount,
      hennaCount,
      leatherWorkingCount,
      embroideryCount,
      electronicsCount,
      computingCount,
      woodworkingCount,
      totalCount,
    ] = stats

    console.log('📊 Curriculum Statistics:')
    console.log('─────────────────────────────────────────────────────────────')
    console.log(`   Tailoring:              ${tailoringCount.toString().padStart(3)} assignments (6 levels)`)
    console.log(`   Device Repair:          ${deviceRepairCount.toString().padStart(3)} assignments (5 levels)`)
    console.log(`   Printing Press:         ${printingPressCount.toString().padStart(3)} assignments (6 levels)`)
    console.log(`   Beadwork:               ${beadworkCount.toString().padStart(3)} assignments (6 levels)`)
    console.log(`   Henna:                  ${hennaCount.toString().padStart(3)} assignments (5 levels)`)
    console.log(`   Leather Working:        ${leatherWorkingCount.toString().padStart(3)} assignments (6 levels) 🧰`)
    console.log(`   Embroidery:             ${embroideryCount.toString().padStart(3)} assignments (6 levels)`)
    console.log(`   Electronics:            ${electronicsCount.toString().padStart(3)} assignments (12 levels) 📡`)
    console.log(`   Computing:              ${computingCount.toString().padStart(3)} assignments (12 levels) 💻`)
    console.log(`   Woodworking-Aerospace:  ${woodworkingCount.toString().padStart(3)} assignments (12 levels) 🚀`)
    console.log('─────────────────────────────────────────────────────────────')
    console.log(`   TOTAL:                  ${totalCount.toString().padStart(3)} assignments\n`)

    console.log('🎯 What Apprentices Can Build After Completion:')
    console.log('─────────────────────────────────────────────────────────────')
    console.log('   ✅ Complete rockets from raw materials')
    console.log('   ✅ Custom flight computers with avionics')
    console.log('   ✅ Parachute recovery systems')
    console.log('   ✅ Mission patches and branding')
    console.log('   ✅ Custom leather boots and footwear')
    console.log('   ✅ Professional bags and carrying equipment')
    console.log('   ✅ Leather furniture and upholstery')
    console.log('   ✅ Ground support equipment')
    console.log('   ✅ Mission control furniture & systems')
    console.log('   ✅ Data centers for telemetry processing')
    console.log('   ✅ AI systems for manufacturing optimization')
    console.log('   ✅ ANYTHING humanity needs to build spacecraft\n')

    console.log('🌟 SuberCraftex Vision: Building Spaceships')
    console.log('─────────────────────────────────────────────────────────────')
    console.log('   Every project in humanity can be achieved with these')
    console.log('   combined skills. This is not just education - this is')
    console.log('   building the workforce that will manufacture spacecraft.')
    console.log('─────────────────────────────────────────────────────────────\n')

  } catch (error) {
    console.error('❌ Error seeding curricula:', error)
    throw error
  }
}

// Execute master seed
masterSeed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

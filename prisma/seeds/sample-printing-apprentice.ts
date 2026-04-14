import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedSamplePrintingApprentice() {
  console.log('🎓 Creating sample printing press apprentice...')

  try {
    // First, create a user account for the apprentice
    // Pre-hashed password for "password123" using bcrypt
    const hashedPassword = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'

    const user = await prisma.user.upsert({
      where: { email: 'samuel.printing@subercraftex.com' },
      update: {
        role: 'apprentice',
      },
      create: {
        email: 'samuel.printing@subercraftex.com',
        passwordHash: hashedPassword,
        fullName: 'Samuel Tabe',
        phone: '+237 670 123 456',
        role: 'apprentice',
      },
    })

    console.log(`✅ User created: ${user.fullName || user.email} (${user.email})`)

    // Find an admin user to assign as mentor
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' },
    })

    if (!adminUser) {
      throw new Error('No admin user found to assign as mentor')
    }

    console.log(`👤 Using admin as mentor: ${adminUser.fullName || adminUser.email}`)

    // Create the apprentice record
    const apprentice = await prisma.apprentice.upsert({
      where: { userId: user.id },
      update: {
        serviceTrack: 'printing_press',
        department: 'printing_press',
        status: 'active',
      },
      create: {
        userId: user.id,
        apprenticeNumber: 'APP-2026-PP-001',
        fullName: 'Samuel Tabe',
        email: 'samuel.printing@subercraftex.com',
        phone: '+237 670 123 456',
        serviceTrack: 'printing_press',
        department: 'printing_press',
        mentorId: adminUser.id,
        mentorType: 'admin',
        status: 'active',
        startDate: new Date('2026-03-15'),
        emergencyContactName: 'Grace Tabe',
        emergencyContactPhone: '+237 670 987 654',
        notes: 'Printing press apprentice - Sample for curriculum testing',
      },
    })

    console.log(`✅ Apprentice created: ${apprentice.fullName} (${apprentice.apprenticeNumber})`)

    // Fetch all printing press curriculum assignments
    const templates = await prisma.assignmentTemplate.findMany({
      where: {
        serviceTrack: 'printing_press',
        isActive: true,
      },
      orderBy: [{ level: 'asc' }, { orderIndex: 'asc' }],
    })

    console.log(`\n📚 Found ${templates.length} printing press curriculum assignments`)

    // Assign all curriculum to the apprentice
    let assignedCount = 0
    const today = new Date()

    for (const template of templates) {
      // Calculate due date based on level (stagger assignments)
      // Level 1: Month 1-3, Level 2: Month 4-6, etc.
      const monthsOffset = (template.level - 1) * 3 + template.orderIndex
      const dueDate = new Date(today)
      dueDate.setMonth(dueDate.getMonth() + monthsOffset)

      await prisma.apprenticeAssignment.create({
        data: {
          apprenticeId: apprentice.id,
          templateId: template.id,
          title: template.title,
          description: template.description,
          status: 'pending',
          dueDate: dueDate,
          assignedBy: adminUser.id,
        },
      })

      assignedCount++
      console.log(`  ✅ Assigned: ${template.assignmentNumber} - ${template.title}`)
    }

    console.log(`\n✅ Successfully assigned ${assignedCount} assignments to ${apprentice.fullName}`)
    console.log(`\n📊 Apprentice Summary:`)
    console.log(`   Name: ${apprentice.fullName}`)
    console.log(`   Apprentice #: ${apprentice.apprenticeNumber}`)
    console.log(`   Service Track: ${apprentice.serviceTrack}`)
    console.log(`   Start Date: ${apprentice.startDate.toLocaleDateString()}`)
    console.log(`   Email: ${apprentice.email}`)
    console.log(`   Login Password: password123`)
    console.log(`   Total Assignments: ${assignedCount}`)

  } catch (error) {
    console.error('❌ Error creating apprentice:', error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  seedSamplePrintingApprentice()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export { seedSamplePrintingApprentice }

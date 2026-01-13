import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🧵 Creating test tailor account...\n')

  try {
    // Create or update tailor user
    const tailorPassword = await bcrypt.hash('tailor123', 10)

    const tailorUser = await prisma.user.upsert({
      where: { email: 'tailor@subercraftex.com' },
      update: {
        passwordHash: tailorPassword,
        role: 'tailor',
        fullName: 'Sarah Tailor',
        phone: '+237654321098',
        emailVerified: true,
      },
      create: {
        email: 'tailor@subercraftex.com',
        passwordHash: tailorPassword,
        role: 'tailor',
        fullName: 'Sarah Tailor',
        phone: '+237654321098',
        emailVerified: true,
      },
    })

    console.log('✅ Tailor user created/updated:', {
      id: tailorUser.id,
      email: tailorUser.email,
      role: tailorUser.role,
      fullName: tailorUser.fullName,
    })

    // Create or update tailor profile
    const tailorProfile = await prisma.tailor.upsert({
      where: { userId: tailorUser.id },
      update: {
        fullName: 'Sarah Tailor',
        phone: '+237654321098',
        email: 'tailor@subercraftex.com',
        employeeId: 'TAIL-001',
        specialties: ['dresses', 'suits', 'alterations', 'custom_clothing'],
        isActive: true,
      },
      create: {
        userId: tailorUser.id,
        fullName: 'Sarah Tailor',
        phone: '+237654321098',
        email: 'tailor@subercraftex.com',
        employeeId: 'TAIL-001',
        specialties: ['dresses', 'suits', 'alterations', 'custom_clothing'],
        isActive: true,
      },
    })

    console.log('\n✅ Tailor profile created/updated:', {
      id: tailorProfile.id,
      employeeId: tailorProfile.employeeId,
      specialties: tailorProfile.specialties,
      isActive: tailorProfile.isActive,
    })

    console.log('\n🎉 Test tailor account created successfully!')
    console.log('\n📋 Login Credentials:')
    console.log('   Email: tailor@subercraftex.com')
    console.log('   Password: tailor123')
    console.log('\n🔗 Access the tailor dashboard at: /dashboard')
  } catch (error) {
    console.error('❌ Error creating tailor account:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

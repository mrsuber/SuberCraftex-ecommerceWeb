import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('👤 Creating cashier account...')

  // Create cashier user
  const cashierPassword = await bcrypt.hash('cashier123', 10)
  const cashierUser = await prisma.user.upsert({
    where: { email: 'cashier@subercraftex.com' },
    update: {},
    create: {
      email: 'cashier@subercraftex.com',
      passwordHash: cashierPassword,
      role: 'cashier',
      fullName: 'John Cashier',
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  })
  console.log('✅ Created cashier user:', cashierUser.email)
  console.log('   Password: cashier123')

  // Create cashier profile
  const cashierProfile = await prisma.cashier.upsert({
    where: { userId: cashierUser.id },
    update: {},
    create: {
      userId: cashierUser.id,
      fullName: 'John Cashier',
      phone: '+1234567890',
      email: 'cashier@subercraftex.com',
      employeeId: 'CASH-001',
      isActive: true,
    },
  })
  console.log('✅ Created cashier profile for:', cashierProfile.fullName)
  console.log('   Employee ID:', cashierProfile.employeeId)

  console.log('\n🎉 Cashier account ready!')
  console.log('\n📋 Login Credentials:')
  console.log('   Email: cashier@subercraftex.com')
  console.log('   Password: cashier123')
  console.log('\n🏪 Access POS at: http://localhost:3000/pos')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

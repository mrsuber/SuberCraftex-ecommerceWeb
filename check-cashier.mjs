import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function checkCashier() {
  const user = await db.user.findUnique({
    where: { email: 'cashier@subercraftex.com' },
    include: { cashier: true }
  })

  if (user) {
    console.log('✓ Cashier user found:')
    console.log(`  Email: ${user.email}`)
    console.log(`  Role: ${user.role}`)
    console.log(`  Cashier profile: ${user.cashier ? 'Yes' : 'No'}`)
  } else {
    console.log('✗ Cashier user not found - need to create one')
  }

  await db.$disconnect()
}

checkCashier().catch(console.error)

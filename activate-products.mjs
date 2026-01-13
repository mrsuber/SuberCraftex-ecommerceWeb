import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function activateProducts() {
  console.log('🔍 Checking products...')

  const products = await db.product.findMany({
    take: 10,
    select: {
      id: true,
      name: true,
      isActive: true,
      inventoryCount: true,
      price: true,
    }
  })

  console.log(`Found ${products.length} products`)

  if (products.length === 0) {
    console.log('⚠️  No products in database. Need to seed database first.')
  } else {
    products.forEach(p => {
      console.log(`  - ${p.name}: ${p.isActive ? 'Active' : 'Inactive'} (Stock: ${p.inventoryCount})`)
    })

    const inactiveCount = products.filter(p => !p.isActive).length

    if (inactiveCount > 0) {
      console.log(`\n📝 Activating ${inactiveCount} inactive products...`)

      const result = await db.product.updateMany({
        where: { isActive: false },
        data: { isActive: true }
      })

      console.log(`✅ Activated ${result.count} products`)
    } else {
      console.log('\n✅ All products are already active')
    }
  }

  await db.$disconnect()
}

activateProducts().catch(console.error)

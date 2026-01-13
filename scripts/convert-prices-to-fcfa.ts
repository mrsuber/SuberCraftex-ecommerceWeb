import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Exchange rate: 1 USD = 600 FCFA
const USD_TO_FCFA = 600

async function convertPricesToFCFA() {
  console.log('🔄 Converting all prices from USD to FCFA...')
  console.log(`📊 Exchange Rate: 1 USD = ${USD_TO_FCFA} FCFA\n`)

  try {
    // Get all products
    const products = await prisma.product.findMany()
    console.log(`Found ${products.length} products to update`)

    for (const product of products) {
      const oldPrice = Number(product.price)
      const newPrice = Math.round(oldPrice * USD_TO_FCFA)

      const oldComparePrice = product.compareAtPrice ? Number(product.compareAtPrice) : null
      const newComparePrice = oldComparePrice ? Math.round(oldComparePrice * USD_TO_FCFA) : null

      await prisma.product.update({
        where: { id: product.id },
        data: {
          price: newPrice,
          compareAtPrice: newComparePrice,
        },
      })

      console.log(`✅ ${product.name}: ${oldPrice} → ${newPrice} FCFA`)
    }

    // Get all services
    const services = await prisma.service.findMany()
    console.log(`\nFound ${services.length} services to update`)

    for (const service of services) {
      const oldPrice = Number(service.price)
      const newPrice = Math.round(oldPrice * USD_TO_FCFA)

      const oldComparePrice = service.compareAtPrice ? Number(service.compareAtPrice) : null
      const newComparePrice = oldComparePrice ? Math.round(oldComparePrice * USD_TO_FCFA) : null

      await prisma.service.update({
        where: { id: service.id },
        data: {
          price: newPrice,
          compareAtPrice: newComparePrice,
        },
      })

      console.log(`✅ ${service.name}: ${oldPrice} → ${newPrice} FCFA`)
    }

    // Get all materials
    const materials = await prisma.material.findMany()
    console.log(`\nFound ${materials.length} materials to update`)

    for (const material of materials) {
      const oldPrice = Number(material.price)
      const newPrice = Math.round(oldPrice * USD_TO_FCFA)

      await prisma.material.update({
        where: { id: material.id },
        data: {
          price: newPrice,
        },
      })

      console.log(`✅ ${material.name}: ${oldPrice} → ${newPrice} FCFA per ${material.unit}`)
    }

    console.log('\n✅ All prices converted successfully!')
    console.log('🎉 Your platform now uses FCFA pricing!')

  } catch (error) {
    console.error('❌ Error converting prices:', error)
    process.exit(1)
  }
}

convertPricesToFCFA()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const total = await prisma.product.count()
  console.log(`Total products in database: ${total}`)

  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      sku: true,
      images: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  console.log('\nAll products:')
  products.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name} (SKU: ${p.sku})`)
    console.log(`   ID: ${p.id}`)
    console.log(`   Images: ${p.images.length}`)
    console.log(`   Created: ${p.createdAt}`)
    console.log()
  })
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

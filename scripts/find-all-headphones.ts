import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    where: { name: 'Wireless Headphones' },
    select: {
      id: true,
      name: true,
      images: true,
      sku: true,
    },
  })

  console.log(`Found ${products.length} products named "Wireless Headphones":\n`)
  products.forEach((p, index) => {
    console.log(`${index + 1}. ID: ${p.id}`)
    console.log(`   SKU: ${p.sku}`)
    console.log(`   Images: ${p.images.length}`)
    console.log(`   URLs:`, p.images)
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

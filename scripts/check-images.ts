import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      images: true,
    },
    take: 3,
  })

  console.log('Products in database:')
  products.forEach(p => {
    console.log(`\n${p.name}:`)
    console.log(`  Images count: ${p.images.length}`)
    console.log(`  Images:`, p.images)
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

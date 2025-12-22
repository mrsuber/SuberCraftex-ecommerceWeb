import { PrismaClient } from '@prisma/client'
import { serializeProduct } from '../lib/utils'

const prisma = new PrismaClient()

async function main() {
  const product = await prisma.product.findFirst({
    where: { name: 'Wireless Headphones' },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  })

  if (!product) {
    console.log('Product not found')
    return
  }

  console.log('Raw product from DB:')
  console.log('Images:', product.images)
  console.log('Images length:', product.images.length)

  const serialized = serializeProduct(product)
  console.log('\nSerialized product:')
  console.log('Images:', serialized.images)
  console.log('Images length:', serialized.images.length)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

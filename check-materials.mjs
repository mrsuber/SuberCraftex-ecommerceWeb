import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const materials = await prisma.material.findMany({
    include: {
      category: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })

  console.log(`\nFound ${materials.length} materials:\n`)

  materials.forEach((material, index) => {
    console.log(`${index + 1}. ${material.name}`)
    console.log(`   Description: ${material.description || 'N/A'}`)
    console.log(`   Category: ${material.category?.name || 'N/A'}`)
    console.log(`   Image: ${material.imageUrl || 'N/A'}`)
    console.log(`   Price: $${material.price}`)
    console.log(`   Stock: ${material.stockQuantity} ${material.unit}`)
    console.log('')
  })

  await prisma.$disconnect()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

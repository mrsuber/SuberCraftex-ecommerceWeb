import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔗 Linking materials to services...\n')

  // Get all services with their categories
  const services = await prisma.service.findMany({
    where: { isActive: true },
    include: {
      category: true,
    },
  })

  // Get all materials with their categories
  const materials = await prisma.material.findMany({
    where: { isActive: true },
    include: {
      category: true,
    },
  })

  console.log(`Found ${services.length} services and ${materials.length} materials\n`)

  let linksCreated = 0

  // Link materials to services based on matching categories
  for (const service of services) {
    const serviceCategoryId = service.categoryId

    // Find materials in the same category
    const matchingMaterials = materials.filter(
      (m) => m.serviceCategoryId === serviceCategoryId
    )

    if (matchingMaterials.length === 0) {
      console.log(`⚠️  No materials found for service: ${service.name} (${service.category?.name || 'No category'})`)
      continue
    }

    console.log(`\n📌 ${service.name} (${service.category?.name || 'No category'})`)
    console.log(`   Linking ${matchingMaterials.length} materials...`)

    // Create service-material associations
    for (const material of matchingMaterials) {
      try {
        // Check if link already exists
        const existing = await prisma.serviceMaterial.findFirst({
          where: {
            serviceId: service.id,
            materialId: material.id,
          },
        })

        if (existing) {
          console.log(`   ↳ ${material.name} (already linked)`)
          continue
        }

        // Create the link
        await prisma.serviceMaterial.create({
          data: {
            serviceId: service.id,
            materialId: material.id,
            isRequired: false,
            defaultQuantity: 1,
          },
        })

        linksCreated++
        console.log(`   ✓ ${material.name}`)
      } catch (error) {
        console.error(`   ✗ Failed to link ${material.name}:`, error)
      }
    }
  }

  console.log(`\n✅ Successfully created ${linksCreated} material-service links!`)

  // Show summary
  console.log('\n📊 Summary:')
  const servicesWithMaterials = await prisma.service.findMany({
    where: { isActive: true },
    include: {
      materials: {
        include: {
          material: true,
        },
      },
      category: true,
    },
  })

  for (const service of servicesWithMaterials) {
    const materialCount = service.materials.length
    console.log(`   ${service.name}: ${materialCount} materials`)
  }
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

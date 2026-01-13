import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const materialImages = {
  // Woodworking Materials
  'Premium Oak Wood': 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=800&q=80', // Oak wood texture
  'Pine Lumber': 'https://images.unsplash.com/photo-1604514628550-37477afdf4e3?w=800&q=80', // Pine wood planks
  'Black Walnut': 'https://images.unsplash.com/photo-1614267118647-20bd36f3c49f?w=800&q=80', // Dark walnut wood
  'Maple Hardwood': 'https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?w=800&q=80', // Light maple wood
  'Wood Glue Industrial': 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&q=80', // Glue/adhesive
  'Wood Screws Set': 'https://images.unsplash.com/photo-1530288782965-fbad40327074?w=800&q=80', // Screws/hardware
  'Wood Stain Dark Oak': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80', // Wood stain/varnish
  'Wood Varnish': 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80', // Varnish/finish

  // Dress Making Materials
  'Premium Silk Fabric': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80', // Silk fabric
  'Organic Cotton': 'https://images.unsplash.com/photo-1519659528534-7fd733a832a0?w=800&q=80', // Cotton fabric
  'Satin Fabric': 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80', // Satin fabric
  'Velvet Fabric': 'https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?w=800&q=80', // Velvet fabric
  'French Lace': 'https://images.unsplash.com/photo-1606760424812-8fc2b2dc0dd7?w=800&q=80', // Lace fabric
  'Professional Thread Set': 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80', // Thread spools
  'Designer Buttons': 'https://images.unsplash.com/photo-1591523638869-45a9e72d3c4e?w=800&q=80', // Buttons
  'Invisible Zippers': 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80', // Zippers

  // Shoe Making Materials
  'Premium Leather': 'https://images.unsplash.com/photo-1578768079052-aa76e52ff1e6?w=800&q=80', // Premium leather
  'Suede Leather': 'https://images.unsplash.com/photo-1633526543814-9718c8922b7a?w=800&q=80', // Suede texture
  'Patent Leather': 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80', // Shiny patent leather
  'Leather Soles': 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=80', // Leather sole
  'Rubber Soles': 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80', // Rubber sole
  'Shoe Laces Premium': 'https://images.unsplash.com/photo-1542840410-3092f99611a3?w=800&q=80', // Shoe laces
  'Shoe Adhesive': 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800&q=80', // Adhesive/glue
  'Shoe Polish Set': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', // Shoe polish

  // Blinds & Bedsheets Materials
  'Egyptian Cotton': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80', // Cotton sheets
  'Mulberry Silk': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80', // Silk bedding
  'Belgian Linen': 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80', // Linen fabric
  'Blackout Fabric': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', // Dark blackout fabric
  'Quilt Batting': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80', // Batting/padding
  'Fitted Sheet Elastic': 'https://images.unsplash.com/photo-1568209865332-a15790aed756?w=800&q=80', // Elastic band
  'Roller Mechanism': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80', // Blind mechanism
  'Blind Chain & Pull': 'https://images.unsplash.com/photo-1620843002805-05a08cb72f57?w=800&q=80', // Chain/cord
}

async function updateMaterialImages() {
  console.log('🔄 Updating material images...\n')

  let updated = 0
  let notFound = 0

  for (const [materialName, imageUrl] of Object.entries(materialImages)) {
    try {
      const result = await prisma.material.updateMany({
        where: { name: materialName },
        data: { imageUrl }
      })

      if (result.count > 0) {
        console.log(`✅ Updated: ${materialName}`)
        updated++
      } else {
        console.log(`⚠️  Not found: ${materialName}`)
        notFound++
      }
    } catch (error) {
      console.error(`❌ Error updating ${materialName}:`, error.message)
    }
  }

  console.log(`\n📊 Summary:`)
  console.log(`   ✅ Updated: ${updated}`)
  console.log(`   ⚠️  Not found: ${notFound}`)
}

async function main() {
  await updateMaterialImages()
  await prisma.$disconnect()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

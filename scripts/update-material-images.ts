import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Fresh, working Unsplash URLs for materials
const materialImageMap: Record<string, string> = {
  // Woodworking Materials
  'WOOD-OAK-001': 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800&q=80', // Oak wood texture
  'WOOD-MAPLE-001': 'https://images.unsplash.com/photo-1566035026482-1c3baeb44b3e?w=800&q=80', // Maple wood
  'WOOD-PINE-001': 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800&q=80', // Pine wood planks
  'WOOD-WALNUT-001': 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800&q=80', // Walnut wood
  'WOOD-GLUE-001': 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&q=80', // Wood glue/adhesive
  'WOOD-SCREWS-001': 'https://images.unsplash.com/photo-1530288782965-fbad40327074?w=800&q=80', // Screws and fasteners
  'WOOD-STAIN-001': 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80', // Wood stain/paint
  'WOOD-VARNISH-001': 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80', // Varnish cans

  // Dress Making - Fabrics
  'FABRIC-SILK-001': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80', // Silk fabric
  'FABRIC-COTTON-001': 'https://images.unsplash.com/photo-1585128903994-03e6ecdf782a?w=800&q=80', // Cotton fabric rolls
  'FABRIC-SATIN-001': 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80', // Satin fabric
  'FABRIC-VELVET-001': 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80', // Velvet texture
  'FABRIC-LACE-001': 'https://images.unsplash.com/photo-1617088960245-b0c545f4b93c?w=800&q=80', // Lace fabric
  'THREAD-001': 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80', // Thread spools
  'ZIPPER-001': 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80', // Zippers
  'BUTTONS-001': 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800&q=80', // Buttons collection

  // Shoe Making - Leather & Materials
  'LEATHER-001': 'https://images.unsplash.com/photo-1585916420730-d7f95e942d43?w=800&q=80', // Brown leather
  'LEATHER-SUEDE-001': 'https://images.unsplash.com/photo-1633526543814-9718c8922b7a?w=800&q=80', // Suede texture
  'LEATHER-PATENT-001': 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80', // Patent leather (shiny)
  'SOLE-RUBBER-001': 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80', // Rubber soles
  'SOLE-LEATHER-001': 'https://images.unsplash.com/photo-1585916420730-d7f95e942d43?w=800&q=80', // Leather soles
  'ADHESIVE-001': 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&q=80', // Glue/adhesive
  'LACES-001': 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&q=80', // Shoe laces
  'POLISH-001': 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80', // Shoe polish kit

  // Blinds & Bedsheets
  'BLIND-FABRIC-001': 'https://images.unsplash.com/photo-1585128903994-03e6ecdf782a?w=800&q=80', // Blackout fabric
  'BLIND-ROLLER-001': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80', // Roller mechanism
  'BLIND-CHAIN-001': 'https://images.unsplash.com/photo-1530288782965-fbad40327074?w=800&q=80', // Chain/cord
  'SHEET-COTTON-001': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80', // Cotton sheets
  'SHEET-LINEN-001': 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80', // Linen bedding
  'SHEET-SILK-001': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80', // Silk sheets
  'ELASTIC-001': 'https://images.unsplash.com/photo-1591523638869-45a9e72d3c4e?w=800&q=80', // Elastic bands
  'BATTING-001': 'https://images.unsplash.com/photo-1585128903994-03e6ecdf782a?w=800&q=80', // Quilt batting/padding
}

async function main() {
  console.log('🔄 Updating material images with fresh URLs...\n')

  let updated = 0
  let failed = 0

  for (const [sku, imageUrl] of Object.entries(materialImageMap)) {
    try {
      const material = await prisma.material.findUnique({
        where: { sku }
      })

      if (!material) {
        console.log(`⚠️  Material not found: ${sku}`)
        failed++
        continue
      }

      await prisma.material.update({
        where: { sku },
        data: { imageUrl }
      })

      updated++
      console.log(`✓ Updated ${material.name.padEnd(30)} (${sku})`)
    } catch (error) {
      console.error(`✗ Error updating ${sku}:`, error)
      failed++
    }
  }

  console.log(`\n✅ Successfully updated ${updated} material images!`)
  if (failed > 0) {
    console.log(`⚠️  ${failed} materials failed to update`)
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

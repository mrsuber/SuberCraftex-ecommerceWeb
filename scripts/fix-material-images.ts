import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Curated material images matched to specific materials
const materialImageMap: Record<string, string> = {
  // Woodworking Materials
  'WOOD-OAK-001': 'https://images.unsplash.com/photo-1545259742-24f9d8d6d1e1?w=800&q=80', // Oak wood planks
  'WOOD-MAPLE-001': 'https://images.unsplash.com/photo-1613574473321-4c2bd7d3a5e1?w=800&q=80', // Maple wood
  'WOOD-PINE-001': 'https://images.unsplash.com/photo-1598808503390-90f8f9a92e3f?w=800&q=80', // Pine lumber
  'WOOD-WALNUT-001': 'https://images.unsplash.com/photo-1602428443678-7953e1e670b5?w=800&q=80', // Walnut wood
  'WOOD-GLUE-001': 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80', // Wood glue
  'WOOD-SCREWS-001': 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80', // Wood screws
  'WOOD-STAIN-001': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80', // Wood stain
  'WOOD-VARNISH-001': 'https://images.unsplash.com/photo-1604147495798-57beb5f6af73?w=800&q=80', // Wood varnish

  // Dress Making - Fabrics
  'FABRIC-SILK-001': 'https://images.unsplash.com/photo-1574429283047-4ffd5bd615e9?w=800&q=80', // Silk fabric
  'FABRIC-COTTON-001': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80', // Cotton fabric
  'FABRIC-SATIN-001': 'https://images.unsplash.com/photo-1558769132-cb1aea9c4d00?w=800&q=80', // Satin fabric
  'FABRIC-VELVET-001': 'https://images.unsplash.com/photo-1596035267607-2f66f34d1ed3?w=800&q=80', // Velvet fabric
  'FABRIC-LACE-001': 'https://images.unsplash.com/photo-1519406596751-0a3ccc4937fe?w=800&q=80', // Lace fabric
  'THREAD-001': 'https://images.unsplash.com/photo-1597113366926-1e0ce31bc7f7?w=800&q=80', // Thread spools
  'ZIPPER-001': 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=800&q=80', // Zippers
  'BUTTONS-001': 'https://images.unsplash.com/photo-1591360236937-4b0b14f50719?w=800&q=80', // Buttons

  // Shoe Making - Leather & Materials
  'LEATHER-001': 'https://images.unsplash.com/photo-1622483472968-68beff04ef4f?w=800&q=80', // Premium brown leather
  'LEATHER-SUEDE-001': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', // Suede leather texture
  'LEATHER-PATENT-001': 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80', // Patent leather (shiny black)
  'SOLE-RUBBER-001': 'https://images.unsplash.com/photo-1542219550-37153d387c27?w=800&q=80', // Rubber soles
  'SOLE-LEATHER-001': 'https://images.unsplash.com/photo-1605408499391-6368c628ef42?w=800&q=80', // Leather soles
  'ADHESIVE-001': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80', // Shoe adhesive/glue
  'LACES-001': 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800&q=80', // Shoe laces
  'POLISH-001': 'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?w=800&q=80', // Shoe polish

  // Blinds & Bedsheets
  'BLIND-FABRIC-001': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80', // Blackout fabric/blinds
  'BLIND-ROLLER-001': 'https://images.unsplash.com/photo-1585128792334-0b94721881b0?w=800&q=80', // Roller blind mechanism
  'BLIND-CHAIN-001': 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&q=80', // Blind chain/pull cord
  'SHEET-COTTON-001': 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80', // Egyptian cotton sheets
  'SHEET-LINEN-001': 'https://images.unsplash.com/photo-1584955147002-83bedb59926e?w=800&q=80', // Linen bedsheets
  'SHEET-SILK-001': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80', // Silk sheets
  'ELASTIC-001': 'https://images.unsplash.com/photo-1569096563656-44607946b7d7?w=800&q=80', // Elastic bands
  'BATTING-001': 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=800&q=80', // Quilt batting/padding
}

async function main() {
  console.log('🎨 Updating material images with appropriate photos...\n')

  let updated = 0
  let notFound = 0

  for (const [sku, imageUrl] of Object.entries(materialImageMap)) {
    try {
      const material = await prisma.material.findUnique({
        where: { sku }
      })

      if (!material) {
        console.log(`⚠️  Material not found: ${sku}`)
        notFound++
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
    }
  }

  console.log(`\n✅ Successfully updated ${updated} materials!`)
  if (notFound > 0) {
    console.log(`⚠️  ${notFound} materials not found in database`)
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

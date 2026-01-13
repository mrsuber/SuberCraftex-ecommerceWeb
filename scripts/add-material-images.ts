import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// High-quality material images from Unsplash
const materialImages = [
  // Wood materials
  'https://images.unsplash.com/photo-1545259742-24f9d8d6d1e1?w=800&q=80', // Wood planks
  'https://images.unsplash.com/photo-1597743107651-a20eba5e8cd7?w=800&q=80', // Oak wood
  'https://images.unsplash.com/photo-1602428443678-7953e1e670b5?w=800&q=80', // Wood texture
  'https://images.unsplash.com/photo-1598808503390-90f8f9a92e3f?w=800&q=80', // Pine wood

  // Metal materials
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80', // Steel
  'https://images.unsplash.com/photo-1590247365623-c0ca1b0bc8f6?w=800&q=80', // Aluminum
  'https://images.unsplash.com/photo-1582142306909-195724d33727?w=800&q=80', // Copper
  'https://images.unsplash.com/photo-1531685250784-7569952593d2?w=800&q=80', // Brass

  // Fabric materials
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80', // Cotton fabric
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80', // Wool fabric
  'https://images.unsplash.com/photo-1584955147002-83bedb59926e?w=800&q=80', // Linen
  'https://images.unsplash.com/photo-1574429283047-4ffd5bd615e9?w=800&q=80', // Silk fabric

  // Leather materials
  'https://images.unsplash.com/photo-1622483472968-68beff04ef4f?w=800&q=80', // Brown leather
  'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80', // Black leather
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', // Leather texture

  // Stone materials
  'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80', // Granite
  'https://images.unsplash.com/photo-1634059877018-c2eb6c24a58b?w=800&q=80', // Marble
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80', // Stone tiles

  // Glass materials
  'https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=800&q=80', // Clear glass
  'https://images.unsplash.com/photo-1590856029620-d49284a87e53?w=800&q=80', // Tinted glass

  // Plastic/Acrylic materials
  'https://images.unsplash.com/photo-1621329863671-18c8c0f72ea8?w=800&q=80', // Acrylic
  'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&q=80', // Plastic sheets

  // Paint materials
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80', // Paint cans
  'https://images.unsplash.com/photo-1621802337062-7e7bb4e40e28?w=800&q=80', // Paint samples

  // Hardware materials
  'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80', // Screws
  'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=80', // Nails
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80', // Tools

  // Adhesives
  'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80', // Glue
  'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=800&q=80', // Tape

  // Finishing materials
  'https://images.unsplash.com/photo-1604147495798-57beb5f6af73?w=800&q=80', // Varnish
  'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?w=800&q=80', // Polish

  // Generic materials
  'https://images.unsplash.com/photo-1504204267155-aaad8e81290d?w=800&q=80', // Workshop materials
  'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&q=80', // Raw materials
]

async function main() {
  console.log('Starting to add images to materials...')

  // Get all materials without images
  const materials = await prisma.material.findMany({
    where: {
      OR: [
        { imageUrl: null },
        { imageUrl: '' }
      ]
    }
  })

  console.log(`Found ${materials.length} materials without images`)

  let updated = 0

  for (let i = 0; i < materials.length; i++) {
    const material = materials[i]
    // Cycle through images
    const imageUrl = materialImages[i % materialImages.length]

    await prisma.material.update({
      where: { id: material.id },
      data: {
        imageUrl,
        // Add some sample specifications based on material type
        specifications: {
          color: ['Natural', 'Brown', 'Gray', 'Black', 'White'][Math.floor(Math.random() * 5)],
          grade: ['Standard', 'Premium', 'Economy'][Math.floor(Math.random() * 3)],
          finish: ['Smooth', 'Rough', 'Polished', 'Matte'][Math.floor(Math.random() * 4)],
        }
      }
    })

    updated++
    console.log(`✓ Updated ${material.name} (${updated}/${materials.length})`)
  }

  console.log(`\n✅ Successfully added images to ${updated} materials!`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleBanners = [
  {
    title: 'New Woodworking Collection',
    subtitle: 'Handcrafted Excellence',
    description: 'Discover our latest custom furniture pieces crafted with precision and care',
    type: 'new_product',
    imageUrl: 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=1920&h=1080&fit=crop',
    ctaText: 'Explore Collection',
    ctaLink: '/catalog',
    ctaStyle: 'primary',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    order: 0,
    isActive: true,
  },
  {
    title: 'Professional Services Available',
    subtitle: 'Book Your Appointment Today',
    description: 'Expert craftsmanship for all your woodworking, tailoring, and repair needs',
    type: 'new_service',
    imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1920&h=1080&fit=crop',
    ctaText: 'View Services',
    ctaLink: '/services',
    ctaStyle: 'secondary',
    backgroundColor: '#2d3748',
    textColor: '#ffffff',
    order: 1,
    isActive: true,
  },
  {
    title: 'Summer Sale - Up to 30% Off',
    subtitle: 'Limited Time Offer',
    description: 'Shop our premium collection at unbeatable prices this season',
    type: 'promotion',
    imageUrl: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1920&h=1080&fit=crop',
    ctaText: 'Shop Sale',
    ctaLink: '/catalog',
    ctaStyle: 'outline',
    backgroundColor: '#e63946',
    textColor: '#ffffff',
    order: 2,
    isActive: true,
  },
]

async function seedHeroBanners() {
  console.log('🌱 Seeding hero banners...\n')

  try {
    // Clear existing banners
    await prisma.heroBanner.deleteMany({})
    console.log('✓ Cleared existing banners\n')

    // Create new banners
    for (const banner of sampleBanners) {
      const created = await prisma.heroBanner.create({
        data: banner,
      })
      console.log(`✓ Created banner: ${created.title}`)
    }

    console.log(`\n🎉 Successfully seeded ${sampleBanners.length} hero banners!`)
  } catch (error) {
    console.error('❌ Error seeding banners:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedHeroBanners()

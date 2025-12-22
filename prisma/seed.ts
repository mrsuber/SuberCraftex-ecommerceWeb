import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@subercraftex.com' },
    update: {},
    create: {
      email: 'admin@subercraftex.com',
      passwordHash: adminPassword,
      role: 'admin',
      fullName: 'Admin User',
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  })
  console.log('✅ Created admin user:', admin.email)
  console.log('   Password: admin123')

  // Create categories
  const categories = [
    {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest gadgets and electronic devices',
      imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
    },
    {
      name: 'Fashion',
      slug: 'fashion',
      description: 'Trendy clothing and accessories',
      imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
    },
    {
      name: 'Home & Living',
      slug: 'home-living',
      description: 'Beautiful home decor and furniture',
      imageUrl: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800',
    },
    {
      name: 'Sports & Outdoor',
      slug: 'sports-outdoor',
      description: 'Equipment for active lifestyle',
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    console.log('✅ Created category:', cat.name)
  }

  // Get category IDs
  const electronicsCategory = await prisma.category.findUnique({ where: { slug: 'electronics' } })
  const fashionCategory = await prisma.category.findUnique({ where: { slug: 'fashion' } })
  const homeCategory = await prisma.category.findUnique({ where: { slug: 'home-living' } })
  const sportsCategory = await prisma.category.findUnique({ where: { slug: 'sports-outdoor' } })

  // Create products
  const products = [
    {
      name: 'Wireless Headphones',
      slug: 'wireless-headphones',
      sku: 'WH-001',
      description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
      price: 299.99,
      compareAtPrice: 399.99,
      category: electronicsCategory ? { connect: { id: electronicsCategory.id } } : undefined,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
        'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800',
        'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800'
      ],
      featuredImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      isFeatured: true,
      isActive: true,
      inventoryCount:50,
      weight: 0.25,
    },
    {
      name: 'Smart Watch Pro',
      slug: 'smart-watch-pro',
      sku: 'SW-002',
      description: 'Advanced fitness tracking, heart rate monitoring, and smart notifications.',
      price: 449.99,
      compareAtPrice: 549.99,
      category: electronicsCategory ? { connect: { id: electronicsCategory.id } } : undefined,
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800',
        'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800'
      ],
      featuredImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      isFeatured: true,
      isActive: true,
      inventoryCount:35,
      weight: 0.1,
    },
    {
      name: 'Designer Sunglasses',
      slug: 'designer-sunglasses',
      sku: 'SG-003',
      description: 'Luxury sunglasses with UV protection and premium Italian design.',
      price: 199.99,
      compareAtPrice: 299.99,
      category: fashionCategory ? { connect: { id: fashionCategory.id } } : undefined,
      images: [
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800',
        'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800',
        'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800'
      ],
      featuredImage: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
      isFeatured: true,
      isActive: true,
      inventoryCount:100,
      weight: 0.05,
    },
    {
      name: 'Leather Backpack',
      slug: 'leather-backpack',
      sku: 'LB-004',
      description: 'Genuine leather backpack with laptop compartment and water-resistant coating.',
      price: 179.99,
      category: fashionCategory ? { connect: { id: fashionCategory.id } } : undefined,
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
        'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
        'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800'
      ],
      featuredImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
      isActive: true,
      inventoryCount:45,
      weight: 0.8,
    },
    {
      name: 'Modern Table Lamp',
      slug: 'modern-table-lamp',
      sku: 'ML-005',
      description: 'Minimalist LED table lamp with adjustable brightness and color temperature.',
      price: 89.99,
      category: homeCategory ? { connect: { id: homeCategory.id } } : undefined,
      images: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800',
        'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800',
        'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800'
      ],
      featuredImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
      isFeatured: true,
      isActive: true,
      inventoryCount:75,
      weight: 1.2,
    },
    {
      name: 'Ceramic Coffee Mug Set',
      slug: 'ceramic-coffee-mug-set',
      sku: 'CM-006',
      description: 'Set of 4 handcrafted ceramic mugs with elegant champagne gold accents.',
      price: 49.99,
      category: homeCategory ? { connect: { id: homeCategory.id } } : undefined,
      images: [
        'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
        'https://images.unsplash.com/photo-1517256673644-36ad11246d21?w=800',
        'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800',
        'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800'
      ],
      featuredImage: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
      isActive: true,
      inventoryCount:120,
      weight: 1.5,
    },
    {
      name: 'Yoga Mat Premium',
      slug: 'yoga-mat-premium',
      sku: 'YM-007',
      description: 'Extra-thick yoga mat with non-slip surface and carrying strap.',
      price: 59.99,
      category: sportsCategory ? { connect: { id: sportsCategory.id } } : undefined,
      images: [
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
        'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
        'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=800'
      ],
      featuredImage: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
      isActive: true,
      inventoryCount:80,
      weight: 2.0,
    },
    {
      name: 'Running Shoes Elite',
      slug: 'running-shoes-elite',
      sku: 'RS-008',
      description: 'Professional running shoes with advanced cushioning and breathable mesh.',
      price: 139.99,
      compareAtPrice: 179.99,
      category: sportsCategory ? { connect: { id: sportsCategory.id } } : undefined,
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800',
        'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800',
        'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800'
      ],
      featuredImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      isFeatured: true,
      isActive: true,
      inventoryCount:60,
      weight: 0.6,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        images: product.images,
        featuredImage: product.featuredImage,
      },
      create: product,
    })
    console.log('✅ Created/Updated product:', product.name)
  }

  console.log('✅ Database seeded successfully!')
  console.log('\n📋 Admin Credentials:')
  console.log('   Email: admin@subercraftex.com')
  console.log('   Password: admin123')
  console.log('\n🎉 You can now login to the dashboard!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Products organized by subcategory slug
const productsByCategory: Record<string, Array<{
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  sku: string;
  inventoryCount: number;
  isFeatured?: boolean;
}>> = {
  // Threads > Sewing Thread
  'sewing-thread': [
    {
      name: 'Premium Polyester Sewing Thread - White',
      slug: 'premium-polyester-thread-white',
      description: 'High-quality polyester sewing thread, ideal for all fabrics. 5000 yards per spool.',
      price: 2500,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
      sku: 'THR-SEW-001',
      inventoryCount: 150,
      isFeatured: true,
    },
    {
      name: 'Premium Polyester Sewing Thread - Black',
      slug: 'premium-polyester-thread-black',
      description: 'High-quality polyester sewing thread, ideal for all fabrics. 5000 yards per spool.',
      price: 2500,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
      sku: 'THR-SEW-002',
      inventoryCount: 150,
    },
    {
      name: 'Cotton Sewing Thread Set - 10 Colors',
      slug: 'cotton-thread-set-10-colors',
      description: 'Set of 10 essential colors for everyday sewing projects. 100% mercerized cotton.',
      price: 15000,
      compareAtPrice: 18000,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
      sku: 'THR-SEW-003',
      inventoryCount: 45,
      isFeatured: true,
    },
  ],

  // Threads > Embroidery Thread
  'embroidery-thread': [
    {
      name: 'Rayon Embroidery Thread - Rainbow Set',
      slug: 'rayon-embroidery-rainbow-set',
      description: '24-color rainbow set of premium rayon embroidery threads. High sheen finish.',
      price: 35000,
      compareAtPrice: 42000,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
      sku: 'THR-EMB-001',
      inventoryCount: 30,
      isFeatured: true,
    },
    {
      name: 'Metallic Embroidery Thread - Gold',
      slug: 'metallic-embroidery-gold',
      description: 'Sparkling metallic gold thread for decorative embroidery. 1000m spool.',
      price: 5500,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
      sku: 'THR-EMB-002',
      inventoryCount: 60,
    },
  ],

  // Sublimation Blanks > Mugs & Drinkware
  'mugs-drinkware': [
    {
      name: '11oz White Sublimation Mug',
      slug: '11oz-white-sublimation-mug',
      description: 'Classic 11oz ceramic mug with AAA coating for vibrant sublimation prints.',
      price: 1500,
      images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800'],
      sku: 'MUG-WHT-11',
      inventoryCount: 500,
      isFeatured: true,
    },
    {
      name: '15oz White Sublimation Mug',
      slug: '15oz-white-sublimation-mug',
      description: 'Large 15oz ceramic mug with AAA coating for vibrant sublimation prints.',
      price: 2000,
      images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800'],
      sku: 'MUG-WHT-15',
      inventoryCount: 300,
    },
    {
      name: '20oz Straight Tumbler - White',
      slug: '20oz-straight-tumbler-white',
      description: 'Stainless steel tumbler with sublimation coating. Double-wall insulated.',
      price: 7500,
      images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800'],
      sku: 'TUM-STR-20',
      inventoryCount: 100,
      isFeatured: true,
    },
  ],

  // Sublimation Blanks > T-Shirts
  't-shirts': [
    {
      name: '100% Polyester T-Shirt - White',
      slug: 'polyester-tshirt-white',
      description: 'Premium 100% polyester t-shirt for sublimation. Soft feel, sizes S-3XL.',
      price: 4500,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
      sku: 'TSH-POLY-WHT',
      inventoryCount: 200,
      isFeatured: true,
    },
    {
      name: '65/35 Polyester Blend T-Shirt',
      slug: 'polyester-blend-tshirt',
      description: '65% polyester, 35% cotton blend for comfortable sublimation garments.',
      price: 5500,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
      sku: 'TSH-BLD-001',
      inventoryCount: 150,
    },
  ],

  // Sublimation Blanks > Phone Cases
  'phone-cases': [
    {
      name: 'iPhone 14 Sublimation Case - Glossy',
      slug: 'iphone-14-case-glossy',
      description: '3D sublimation phone case for iPhone 14. Glossy finish, edge-to-edge printing.',
      price: 3500,
      images: ['https://images.unsplash.com/photo-1601593346740-925612772716?w=800'],
      sku: 'CASE-IP14-G',
      inventoryCount: 75,
    },
    {
      name: 'Samsung S23 Sublimation Case - Matte',
      slug: 'samsung-s23-case-matte',
      description: '3D sublimation phone case for Samsung S23. Matte finish, scratch resistant.',
      price: 3500,
      images: ['https://images.unsplash.com/photo-1601593346740-925612772716?w=800'],
      sku: 'CASE-SS23-M',
      inventoryCount: 50,
    },
  ],

  // Fabrics > Polyester Fabric
  'polyester-fabric': [
    {
      name: 'White Polyester Fabric - 1 Meter',
      slug: 'white-polyester-fabric-1m',
      description: '100% polyester fabric ideal for sublimation printing. 150cm width.',
      price: 3000,
      images: ['https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800'],
      sku: 'FAB-POLY-WHT',
      inventoryCount: 100,
      isFeatured: true,
    },
  ],

  // Fabrics > Cotton Fabric
  'cotton-fabric': [
    {
      name: 'Premium White Cotton - 1 Meter',
      slug: 'premium-white-cotton-1m',
      description: 'High thread count 100% cotton fabric. Perfect for dressmaking.',
      price: 4500,
      images: ['https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800'],
      sku: 'FAB-COT-WHT',
      inventoryCount: 80,
    },
    {
      name: 'African Print Cotton - 6 Yards',
      slug: 'african-print-cotton-6y',
      description: 'Traditional African wax print cotton fabric. Vibrant patterns.',
      price: 18000,
      images: ['https://images.unsplash.com/photo-1590874315261-f2b277f4b784?w=800'],
      sku: 'FAB-AFR-001',
      inventoryCount: 40,
      isFeatured: true,
    },
  ],

  // Printing Supplies > Sublimation Ink
  'sublimation-ink': [
    {
      name: 'Sublimation Ink Set - CMYK 100ml',
      slug: 'sublimation-ink-cmyk-100ml',
      description: 'Complete CMYK ink set for Epson sublimation printers. 100ml per color.',
      price: 25000,
      images: ['https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=800'],
      sku: 'INK-CMYK-100',
      inventoryCount: 60,
      isFeatured: true,
    },
  ],

  // Printing Supplies > Transfer Paper
  'transfer-paper': [
    {
      name: 'A4 Sublimation Transfer Paper - 100 Sheets',
      slug: 'a4-sublimation-paper-100',
      description: 'High-quality A4 sublimation transfer paper. Quick-dry formula.',
      price: 8500,
      images: ['https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=800'],
      sku: 'PAP-A4-100',
      inventoryCount: 120,
      isFeatured: true,
    },
    {
      name: 'A3 Sublimation Transfer Paper - 50 Sheets',
      slug: 'a3-sublimation-paper-50',
      description: 'Large format A3 sublimation transfer paper for bigger projects.',
      price: 12000,
      images: ['https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=800'],
      sku: 'PAP-A3-50',
      inventoryCount: 80,
    },
  ],

  // Equipment > Heat Presses
  'heat-presses': [
    {
      name: 'Flat Heat Press 15x15" - Digital',
      slug: 'flat-heat-press-15x15',
      description: 'Digital flat heat press with temperature and time control. Perfect for t-shirts.',
      price: 185000,
      compareAtPrice: 220000,
      images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800'],
      sku: 'HP-FLAT-15',
      inventoryCount: 10,
      isFeatured: true,
    },
    {
      name: 'Mug Heat Press - 11oz-15oz',
      slug: 'mug-heat-press',
      description: 'Dedicated mug heat press for 11oz and 15oz mugs. Digital timer.',
      price: 75000,
      images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800'],
      sku: 'HP-MUG-001',
      inventoryCount: 15,
    },
  ],

  // Accessories > Scissors & Cutters
  'scissors-cutters': [
    {
      name: 'Professional Fabric Scissors 10"',
      slug: 'professional-fabric-scissors-10',
      description: 'Heavy-duty stainless steel fabric scissors. Ergonomic handle.',
      price: 8500,
      images: ['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800'],
      sku: 'ACC-SCI-10',
      inventoryCount: 50,
    },
  ],

  // Accessories > Measuring Tools
  'measuring-tools': [
    {
      name: 'Tailor Measuring Tape - 150cm',
      slug: 'tailor-measuring-tape-150',
      description: 'Flexible measuring tape for body measurements and sewing projects.',
      price: 1500,
      images: ['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800'],
      sku: 'ACC-TAPE-150',
      inventoryCount: 200,
    },
    {
      name: 'Quilting Ruler Set',
      slug: 'quilting-ruler-set',
      description: 'Set of 3 acrylic quilting rulers with grid markings.',
      price: 15000,
      images: ['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800'],
      sku: 'ACC-RULER-SET',
      inventoryCount: 25,
    },
  ],
};

async function main() {
  console.log('🛍️  Seeding products...\n');

  // First, get all subcategories
  const categories = await prisma.category.findMany({
    where: { parentId: { not: null } }, // Only subcategories
  });

  const categoryMap = new Map(categories.map(c => [c.slug, c.id]));

  let created = 0;
  let skipped = 0;

  for (const [categorySlug, products] of Object.entries(productsByCategory)) {
    const categoryId = categoryMap.get(categorySlug);

    if (!categoryId) {
      console.log(`⚠️  Category not found: ${categorySlug}, skipping ${products.length} products`);
      skipped += products.length;
      continue;
    }

    console.log(`\n📁 ${categorySlug}:`);

    for (const product of products) {
      // Check if product already exists
      const existing = await prisma.product.findUnique({
        where: { sku: product.sku },
      });

      if (existing) {
        // Update the category
        await prisma.product.update({
          where: { id: existing.id },
          data: { categoryId },
        });
        console.log(`   ✏️  Updated category: ${product.name}`);
        continue;
      }

      // Create new product
      await prisma.product.create({
        data: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          images: product.images,
          featuredImage: product.images[0],
          sku: product.sku,
          inventoryCount: product.inventoryCount,
          lowStockThreshold: 10,
          trackInventory: true,
          isFeatured: product.isFeatured || false,
          isActive: true,
          categoryId,
        },
      });
      console.log(`   ✅ Created: ${product.name}`);
      created++;
    }
  }

  console.log('\n' + '─'.repeat(50));
  console.log(`\n🎉 Products seeded successfully!`);
  console.log(`   Created: ${created}`);
  console.log(`   Skipped (category not found): ${skipped}`);

  // Show summary by category
  console.log('\n📊 Products by category:');
  const summary = await prisma.product.groupBy({
    by: ['categoryId'],
    _count: true,
    where: { categoryId: { not: null } },
  });

  for (const item of summary) {
    const cat = categories.find(c => c.id === item.categoryId);
    if (cat) {
      console.log(`   ${cat.name}: ${item._count} products`);
    }
  }

  // Show uncategorized products
  const uncategorized = await prisma.product.count({
    where: { categoryId: null },
  });
  if (uncategorized > 0) {
    console.log(`   (Uncategorized): ${uncategorized} products`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

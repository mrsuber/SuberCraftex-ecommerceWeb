import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    name: 'Threads',
    slug: 'threads',
    description: 'High-quality threads for sewing and embroidery',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    sortOrder: 1,
    children: [
      { name: 'Sewing Thread', slug: 'sewing-thread', description: 'Polyester and cotton sewing threads', sortOrder: 1 },
      { name: 'Embroidery Thread', slug: 'embroidery-thread', description: 'Colorful embroidery threads', sortOrder: 2 },
      { name: 'Marking Thread', slug: 'marking-thread', description: 'Temporary marking threads', sortOrder: 3 },
      { name: 'Overlocking Thread', slug: 'overlocking-thread', description: 'Threads for overlock machines', sortOrder: 4 },
    ]
  },
  {
    name: 'Sublimation Blanks',
    slug: 'sublimation-blanks',
    description: 'Blank products ready for sublimation printing',
    imageUrl: 'https://images.unsplash.com/photo-1503341733017-1901578f9f1e?w=800',
    sortOrder: 2,
    children: [
      { name: 'Mugs & Drinkware', slug: 'mugs-drinkware', description: 'Sublimation mugs, tumblers, and bottles', sortOrder: 1 },
      { name: 'T-Shirts', slug: 't-shirts', description: 'Polyester and blend t-shirts for sublimation', sortOrder: 2 },
      { name: 'Phone Cases', slug: 'phone-cases', description: 'Blank phone cases for sublimation', sortOrder: 3 },
      { name: 'Cushion Covers', slug: 'cushion-covers', description: 'Sublimation pillow and cushion covers', sortOrder: 4 },
      { name: 'Mouse Pads', slug: 'mouse-pads', description: 'Blank mouse pads for custom printing', sortOrder: 5 },
    ]
  },
  {
    name: 'Fabrics',
    slug: 'fabrics',
    description: 'Quality fabrics for various applications',
    imageUrl: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800',
    sortOrder: 3,
    children: [
      { name: 'Polyester Fabric', slug: 'polyester-fabric', description: 'Sublimation-ready polyester fabrics', sortOrder: 1 },
      { name: 'Cotton Fabric', slug: 'cotton-fabric', description: 'Premium cotton fabrics', sortOrder: 2 },
      { name: 'Blend Fabric', slug: 'blend-fabric', description: 'Cotton-polyester blend fabrics', sortOrder: 3 },
    ]
  },
  {
    name: 'Printing Supplies',
    slug: 'printing-supplies',
    description: 'Essential supplies for sublimation printing',
    imageUrl: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=800',
    sortOrder: 4,
    children: [
      { name: 'Sublimation Ink', slug: 'sublimation-ink', description: 'High-quality sublimation inks', sortOrder: 1 },
      { name: 'Transfer Paper', slug: 'transfer-paper', description: 'Sublimation transfer papers', sortOrder: 2 },
      { name: 'Heat Tape', slug: 'heat-tape', description: 'Heat resistant tapes', sortOrder: 3 },
      { name: 'Protective Paper', slug: 'protective-paper', description: 'Butcher and kraft papers', sortOrder: 4 },
    ]
  },
  {
    name: 'Equipment',
    slug: 'equipment',
    description: 'Printing and heat press equipment',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
    sortOrder: 5,
    children: [
      { name: 'Heat Presses', slug: 'heat-presses', description: 'Flat, mug, and combo heat presses', sortOrder: 1 },
      { name: 'Printers', slug: 'printers', description: 'Sublimation printers', sortOrder: 2 },
      { name: 'Cutting Machines', slug: 'cutting-machines', description: 'Vinyl and fabric cutters', sortOrder: 3 },
    ]
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Accessories and tools for crafting',
    imageUrl: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800',
    sortOrder: 6,
    children: [
      { name: 'Scissors & Cutters', slug: 'scissors-cutters', description: 'Precision cutting tools', sortOrder: 1 },
      { name: 'Measuring Tools', slug: 'measuring-tools', description: 'Rulers, tape measures, and gauges', sortOrder: 2 },
      { name: 'Storage', slug: 'storage', description: 'Thread racks and organizers', sortOrder: 3 },
    ]
  },
];

async function main() {
  console.log('🗑️  Removing old categories...');

  // First, remove category references from products
  await prisma.product.updateMany({
    data: { categoryId: null }
  });

  // Delete all existing categories
  await prisma.category.deleteMany();

  console.log('✅ Old categories removed');
  console.log('📁 Creating new categories with subcategories...\n');

  for (const cat of categories) {
    // Create parent category
    const parent = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        imageUrl: cat.imageUrl,
        sortOrder: cat.sortOrder,
        isActive: true,
      }
    });
    console.log(`✅ Created: ${cat.name}`);

    // Create subcategories
    if (cat.children) {
      for (const child of cat.children) {
        await prisma.category.create({
          data: {
            name: child.name,
            slug: child.slug,
            description: child.description,
            parentId: parent.id,
            sortOrder: child.sortOrder,
            isActive: true,
          }
        });
        console.log(`   └─ ${child.name}`);
      }
    }
  }

  console.log('\n🎉 Categories updated successfully!');

  // Show summary
  const count = await prisma.category.count();
  const parentCount = await prisma.category.count({ where: { parentId: null } });
  console.log(`\n📊 Summary: ${parentCount} parent categories, ${count - parentCount} subcategories`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

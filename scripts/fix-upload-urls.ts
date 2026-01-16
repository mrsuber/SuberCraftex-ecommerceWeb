import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fix image URLs to use the API route instead of direct public path
 * This is needed because Next.js doesn't serve files added to public/ after build
 */
async function main() {
  console.log('🔧 Fixing upload URLs...\n');

  // Fix category images
  const categories = await prisma.category.findMany({
    where: {
      imageUrl: {
        startsWith: '/uploads/',
      },
    },
  });

  console.log(`📁 Categories with /uploads/ URLs: ${categories.length}`);
  for (const cat of categories) {
    const newUrl = cat.imageUrl!.replace('/uploads/', '/api/uploads/');
    await prisma.category.update({
      where: { id: cat.id },
      data: { imageUrl: newUrl },
    });
    console.log(`   ✅ ${cat.name}: ${cat.imageUrl} → ${newUrl}`);
  }

  // Fix product images
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { featuredImage: { startsWith: '/uploads/' } },
        { images: { hasSome: [] } }, // Will filter below
      ],
    },
  });

  let productFixCount = 0;
  for (const product of products) {
    const updates: any = {};

    // Fix featured image
    if (product.featuredImage?.startsWith('/uploads/')) {
      updates.featuredImage = product.featuredImage.replace('/uploads/', '/api/uploads/');
    }

    // Fix images array
    if (product.images && product.images.length > 0) {
      const hasUploadUrls = product.images.some(img => img.startsWith('/uploads/'));
      if (hasUploadUrls) {
        updates.images = product.images.map(img =>
          img.startsWith('/uploads/') ? img.replace('/uploads/', '/api/uploads/') : img
        );
      }
    }

    if (Object.keys(updates).length > 0) {
      await prisma.product.update({
        where: { id: product.id },
        data: updates,
      });
      productFixCount++;
      console.log(`   ✅ Product: ${product.name}`);
    }
  }
  console.log(`\n📦 Products fixed: ${productFixCount}`);

  // Fix hero banners
  const banners = await prisma.heroBanner.findMany({
    where: {
      OR: [
        { image_url: { startsWith: '/uploads/' } },
        { mobile_image_url: { startsWith: '/uploads/' } },
      ],
    },
  });

  console.log(`\n🖼️  Hero banners with /uploads/ URLs: ${banners.length}`);
  for (const banner of banners) {
    const updates: any = {};
    if (banner.image_url?.startsWith('/uploads/')) {
      updates.image_url = banner.image_url.replace('/uploads/', '/api/uploads/');
    }
    if (banner.mobile_image_url?.startsWith('/uploads/')) {
      updates.mobile_image_url = banner.mobile_image_url.replace('/uploads/', '/api/uploads/');
    }
    if (Object.keys(updates).length > 0) {
      await prisma.heroBanner.update({
        where: { id: banner.id },
        data: updates,
      });
      console.log(`   ✅ Banner: ${banner.title}`);
    }
  }

  // Fix service images
  const services = await prisma.service.findMany({
    where: {
      OR: [
        { imageUrl: { startsWith: '/uploads/' } },
        { images: { hasSome: [] } },
      ],
    },
  });

  let serviceFixCount = 0;
  for (const service of services) {
    const updates: any = {};
    if (service.imageUrl?.startsWith('/uploads/')) {
      updates.imageUrl = service.imageUrl.replace('/uploads/', '/api/uploads/');
    }
    if (service.images && service.images.length > 0) {
      const hasUploadUrls = service.images.some(img => img.startsWith('/uploads/'));
      if (hasUploadUrls) {
        updates.images = service.images.map(img =>
          img.startsWith('/uploads/') ? img.replace('/uploads/', '/api/uploads/') : img
        );
      }
    }
    if (Object.keys(updates).length > 0) {
      await prisma.service.update({
        where: { id: service.id },
        data: updates,
      });
      serviceFixCount++;
      console.log(`   ✅ Service: ${service.name}`);
    }
  }
  console.log(`\n🛠️  Services fixed: ${serviceFixCount}`);

  // Fix material images
  const materials = await prisma.material.findMany({
    where: {
      imageUrl: { startsWith: '/uploads/' },
    },
  });

  console.log(`\n🧵 Materials with /uploads/ URLs: ${materials.length}`);
  for (const material of materials) {
    const newUrl = material.imageUrl!.replace('/uploads/', '/api/uploads/');
    await prisma.material.update({
      where: { id: material.id },
      data: { imageUrl: newUrl },
    });
    console.log(`   ✅ Material: ${material.name}`);
  }

  console.log('\n✅ All upload URLs fixed!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

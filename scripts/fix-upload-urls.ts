import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fix image URLs to use the API route instead of direct public path
 * This is needed because Next.js doesn't serve files added to public/ after build
 */
async function main() {
  console.log('🔧 Fixing upload URLs...\n');

  // Fix category images
  const categories = await prisma.category.findMany();
  let categoryFixCount = 0;
  for (const cat of categories) {
    if (cat.imageUrl?.startsWith('/uploads/')) {
      const newUrl = cat.imageUrl.replace('/uploads/', '/api/uploads/');
      await prisma.category.update({
        where: { id: cat.id },
        data: { imageUrl: newUrl },
      });
      console.log(`   ✅ Category: ${cat.name}`);
      categoryFixCount++;
    }
  }
  console.log(`📁 Categories fixed: ${categoryFixCount}`);

  // Fix product images
  const products = await prisma.product.findMany();
  let productFixCount = 0;
  for (const product of products) {
    const updates: Record<string, unknown> = {};

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
  const banners = await prisma.heroBanner.findMany();
  let bannerFixCount = 0;
  for (const banner of banners) {
    const updates: Record<string, unknown> = {};
    if (banner.imageUrl?.startsWith('/uploads/')) {
      updates.imageUrl = banner.imageUrl.replace('/uploads/', '/api/uploads/');
    }
    if (banner.mobileImageUrl?.startsWith('/uploads/')) {
      updates.mobileImageUrl = banner.mobileImageUrl.replace('/uploads/', '/api/uploads/');
    }
    if (Object.keys(updates).length > 0) {
      await prisma.heroBanner.update({
        where: { id: banner.id },
        data: updates,
      });
      console.log(`   ✅ Banner: ${banner.title}`);
      bannerFixCount++;
    }
  }
  console.log(`\n🖼️  Hero banners fixed: ${bannerFixCount}`);

  // Fix service images
  const services = await prisma.service.findMany();
  let serviceFixCount = 0;
  for (const service of services) {
    const updates: Record<string, unknown> = {};
    if (service.featuredImage?.startsWith('/uploads/')) {
      updates.featuredImage = service.featuredImage.replace('/uploads/', '/api/uploads/');
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
  const materials = await prisma.material.findMany();
  let materialFixCount = 0;
  for (const material of materials) {
    if (material.imageUrl?.startsWith('/uploads/')) {
      const newUrl = material.imageUrl.replace('/uploads/', '/api/uploads/');
      await prisma.material.update({
        where: { id: material.id },
        data: { imageUrl: newUrl },
      });
      console.log(`   ✅ Material: ${material.name}`);
      materialFixCount++;
    }
  }
  console.log(`\n🧵 Materials fixed: ${materialFixCount}`);

  console.log('\n✅ All upload URLs fixed!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

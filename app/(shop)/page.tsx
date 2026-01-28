import { HeroBanners } from "@/components/landing/HeroBanners";
import { Features } from "@/components/landing/Features";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { FeaturedServices } from "@/components/landing/FeaturedServices";
import { UpcomingServices } from "@/components/landing/UpcomingServices";
import { CTA } from "@/components/landing/CTA";
import { db } from "@/lib/db";

// Disable caching to always show fresh data (banners, services, etc.)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  // Fetch active hero banners
  const now = new Date();
  const heroBanners = await db.heroBanner.findMany({
    where: {
      isActive: true,
      OR: [
        { startDate: null, endDate: null }, // Always active
        { startDate: { lte: now }, endDate: null }, // Started, no end
        { startDate: null, endDate: { gte: now } }, // Not started yet, has end
        { startDate: { lte: now }, endDate: { gte: now } }, // Currently active
      ],
    },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });

  // Serialize hero banners for client component
  const serializedBanners = heroBanners.map((banner) => ({
    id: banner.id,
    title: banner.title,
    subtitle: banner.subtitle,
    description: banner.description,
    type: banner.type,
    image_url: banner.imageUrl,
    mobile_image_url: banner.mobileImageUrl,
    cta_text: banner.ctaText,
    cta_link: banner.ctaLink,
    cta_style: banner.ctaStyle,
    background_color: banner.backgroundColor,
    text_color: banner.textColor,
    order: banner.order,
    is_active: banner.isActive,
    start_date: banner.startDate?.toISOString() || null,
    end_date: banner.endDate?.toISOString() || null,
    created_at: banner.createdAt.toISOString(),
    updated_at: banner.updatedAt.toISOString(),
  }));

  // Fetch featured services
  const featuredServices = await db.service.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 6,
  });

  // Serialize services for client component
  const serializedServices = featuredServices.map((service) => ({
    ...service,
    price: Number(service.price),
    compare_at_price: service.compareAtPrice ? Number(service.compareAtPrice) : null,
    compareAtPrice: service.compareAtPrice ? Number(service.compareAtPrice) : null,
    buffer_time: service.bufferTime,
    bufferTime: service.bufferTime,
    max_bookings_per_day: service.maxBookingsPerDay,
    maxBookingsPerDay: service.maxBookingsPerDay,
    custom_duration: service.customDuration,
    customDuration: service.customDuration,
    category_id: service.categoryId,
    categoryId: service.categoryId,
    short_description: service.shortDescription,
    shortDescription: service.shortDescription,
    featured_image: service.featuredImage,
    featuredImage: service.featuredImage,
    is_active: service.isActive,
    isActive: service.isActive,
    is_featured: service.isFeatured,
    isFeatured: service.isFeatured,
    seo_title: service.seoTitle,
    seoTitle: service.seoTitle,
    seo_description: service.seoDescription,
    seoDescription: service.seoDescription,
    created_at: service.createdAt.toISOString(),
    createdAt: service.createdAt.toISOString(),
    updated_at: service.updatedAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
    category: service.category ? {
      ...service.category,
      image_url: service.category.imageUrl,
      imageUrl: service.category.imageUrl,
      sort_order: service.category.sortOrder,
      sortOrder: service.category.sortOrder,
      is_active: service.category.isActive,
      isActive: service.category.isActive,
      created_at: service.category.createdAt.toISOString(),
      createdAt: service.category.createdAt.toISOString(),
      updated_at: service.category.updatedAt.toISOString(),
      updatedAt: service.category.updatedAt.toISOString(),
    } : undefined,
  }));

  // Fetch active upcoming services
  const upcomingServices = await db.upcomingService.findMany({
    where: {
      isActive: true,
    },
    include: {
      service: {
        select: {
          id: true,
          name: true,
          slug: true,
          featuredImage: true,
        },
      },
    },
    orderBy: [{ serviceDate: 'asc' }, { order: 'asc' }],
    take: 6,
  });

  // Serialize upcoming services
  const serializedUpcoming = upcomingServices.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    short_description: s.shortDescription,
    image_url: s.imageUrl,
    service_date: s.serviceDate.toISOString(),
    service_id: s.serviceId,
    cta_text: s.ctaText,
    location: s.location,
    price: s.price?.toString() || null,
    order: s.order,
    is_active: s.isActive,
    created_at: s.createdAt.toISOString(),
    updated_at: s.updatedAt.toISOString(),
    service: s.service ? {
      id: s.service.id,
      name: s.service.name,
      slug: s.service.slug,
      featured_image: s.service.featuredImage,
    } : null,
  }));

  return (
    <main>
      <HeroBanners initialBanners={serializedBanners as any} />
      <FeaturedServices services={serializedServices as any} />
      <FeaturedProducts />
      <UpcomingServices services={serializedUpcoming} />
      <Features />
      <CTA />
    </main>
  );
}

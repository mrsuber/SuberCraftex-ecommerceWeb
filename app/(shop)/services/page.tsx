import { Metadata } from 'next'
import { ServiceGrid } from '@/components/services/ServiceGrid'
import { db } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Our Services | SuberCraftex',
  description: 'Browse our professional craft and repair services including woodworking, dress making, shoe making, and more.',
}

export default async function ServicesPage() {
  // Fetch initial data server-side
  const [services, categories] = await Promise.all([
    db.service.findMany({
      where: { isActive: true },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    }),
    db.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ])

  // Serialize data for client component
  const serializedServices = services.map((service) => ({
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
  }))

  const serializedCategories = categories.map((cat) => ({
    ...cat,
    image_url: cat.imageUrl,
    imageUrl: cat.imageUrl,
    sort_order: cat.sortOrder,
    sortOrder: cat.sortOrder,
    is_active: cat.isActive,
    isActive: cat.isActive,
    created_at: cat.createdAt.toISOString(),
    createdAt: cat.createdAt.toISOString(),
    updated_at: cat.updatedAt.toISOString(),
    updatedAt: cat.updatedAt.toISOString(),
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-bold">Our Services</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Professional craft and repair services tailored to your needs. Book an appointment with our expert artisans.
        </p>
      </div>

      {/* Services Grid */}
      <ServiceGrid
        initialServices={serializedServices as any}
        initialCategories={serializedCategories as any}
      />
    </div>
  )
}

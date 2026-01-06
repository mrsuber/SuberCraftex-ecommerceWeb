import { Metadata } from 'next'
import { db } from '@/lib/db'
import { ServicesTable } from '@/components/dashboard/ServicesTable'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Services Management | Admin Dashboard',
  description: 'Manage your services',
}

export default async function ServicesPage() {
  const [services, categories] = await Promise.all([
    db.service.findMany({
      include: {
        category: true,
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    db.serviceCategory.findMany({
      orderBy: { sortOrder: 'asc' },
    }),
  ])

  // Serialize data
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground mt-1">
            Manage your service offerings and bookings
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/services/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Total Services</div>
          <div className="text-2xl font-bold mt-1">{services.length}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Active</div>
          <div className="text-2xl font-bold mt-1">
            {services.filter((s) => s.isActive).length}
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Featured</div>
          <div className="text-2xl font-bold mt-1">
            {services.filter((s) => s.isFeatured).length}
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Categories</div>
          <div className="text-2xl font-bold mt-1">{categories.length}</div>
        </div>
      </div>

      {/* Table */}
      <ServicesTable
        initialServices={serializedServices as any}
        categories={serializedCategories as any}
      />
    </div>
  )
}

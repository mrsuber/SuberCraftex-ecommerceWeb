import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { ServiceForm } from '@/components/dashboard/ServiceForm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Palette } from 'lucide-react'

interface EditServicePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditServicePageProps): Promise<Metadata> {
  const { id } = await params
  const service = await db.service.findUnique({
    where: { id },
  })

  if (!service) {
    return {
      title: 'Service Not Found',
    }
  }

  return {
    title: `Edit ${service.name} | Admin Dashboard`,
    description: 'Edit service details',
  }
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params

  const [service, categories] = await Promise.all([
    db.service.findUnique({
      where: { id },
      include: {
        category: true,
      },
    }),
    db.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ])

  if (!service) {
    notFound()
  }

  // Serialize service for client component
  const serializedService = {
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
  }

  // Serialize categories for client component
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Service</h1>
          <p className="text-muted-foreground mt-1">
            Update service details and settings
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/dashboard/services/${id}/design`}>
            <Palette className="w-4 h-4 mr-2" />
            Manage Design Options
          </Link>
        </Button>
      </div>

      <ServiceForm
        categories={serializedCategories as any}
        service={serializedService as any}
      />
    </div>
  )
}

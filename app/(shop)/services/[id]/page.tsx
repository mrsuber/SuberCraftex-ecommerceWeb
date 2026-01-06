import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { EnhancedServiceBookingForm } from '@/components/services/EnhancedServiceBookingForm'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Clock, Tag, Star, MapPin, Hammer, Wrench } from 'lucide-react'
import Image from 'next/image'

interface ServicePageProps {
  params: Promise<{ id: string }>
}

const DURATION_LABELS: Record<string, string> = {
  half_hour: '30 minutes',
  one_hour: '1 hour',
  two_hours: '2 hours',
  half_day: '4 hours',
  full_day: '8 hours',
  custom: 'Custom duration',
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
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
    title: `${service.name} | SuberCraftex Services`,
    description: service.seoDescription || service.shortDescription || service.description || '',
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params

  const service = await db.service.findUnique({
    where: { id },
    include: {
      category: true,
    },
  })

  if (!service || !service.isActive) {
    notFound()
  }

  // Serialize for client component
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
    // Enhanced service type fields
    supports_onsite: service.supportsOnsite,
    supportsOnsite: service.supportsOnsite,
    supports_custom_production: service.supportsCustomProduction,
    supportsCustomProduction: service.supportsCustomProduction,
    supports_collect_repair: service.supportsCollectRepair,
    supportsCollectRepair: service.supportsCollectRepair,
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
  }

  const hasDiscount = service.compareAtPrice && service.compareAtPrice > service.price
  const discountPercentage = hasDiscount
    ? Math.round(((Number(service.compareAtPrice) - Number(service.price)) / Number(service.compareAtPrice)) * 100)
    : 0

  const durationLabel = service.duration === 'custom' && service.customDuration
    ? `${service.customDuration} minutes`
    : DURATION_LABELS[service.duration] || '1 hour'

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Service Info */}
        <div className="space-y-6">
          {/* Image Gallery */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            {service.featuredImage ? (
              <Image
                src={service.featuredImage}
                alt={service.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Tag className="w-24 h-24 text-muted-foreground/20" />
              </div>
            )}

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {service.isFeatured && (
                <Badge variant="default" className="bg-primary">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              {hasDiscount && (
                <Badge variant="destructive">
                  {discountPercentage}% OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Additional Images */}
          {service.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {service.images.slice(1, 5).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-md overflow-hidden bg-muted"
                >
                  <Image
                    src={image}
                    alt={`${service.name} - Image ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Service Details Card */}
          <Card>
            <CardContent className="p-6 space-y-4">
              {/* Category */}
              {service.category && (
                <div className="text-sm text-muted-foreground uppercase tracking-wide">
                  {service.category.name}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl font-bold">{service.name}</h1>

              {/* Short Description */}
              {service.shortDescription && (
                <p className="text-lg text-muted-foreground">
                  {service.shortDescription}
                </p>
              )}

              <Separator />

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold">
                  ${Number(service.price).toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${Number(service.compareAtPrice).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Duration & Service Types */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Clock className="w-3 h-3" />
                  {durationLabel}
                </Badge>
                {service.supportsOnsite && (
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="w-3 h-3" />
                    On-Site
                  </Badge>
                )}
                {service.supportsCustomProduction && (
                  <Badge variant="outline" className="gap-1">
                    <Hammer className="w-3 h-3" />
                    Custom Production
                  </Badge>
                )}
                {service.supportsCollectRepair && (
                  <Badge variant="outline" className="gap-1">
                    <Wrench className="w-3 h-3" />
                    Collect & Repair
                  </Badge>
                )}
                {service.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Separator />

              {/* Full Description */}
              {service.description && (
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {service.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Booking Form */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <EnhancedServiceBookingForm service={serializedService as any} />
        </div>
      </div>
    </div>
  )
}

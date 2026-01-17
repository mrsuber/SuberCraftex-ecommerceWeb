import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { UpcomingServiceDetail } from '@/components/shop/UpcomingServiceDetail'
import { UpcomingService } from '@/types'

interface UpcomingServicePageProps {
  params: Promise<{ id: string }>
}

async function getUpcomingService(id: string): Promise<UpcomingService | null> {
  const service = await db.upcomingService.findUnique({
    where: { id },
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
  })

  if (!service) return null

  return {
    id: service.id,
    title: service.title,
    description: service.description,
    short_description: service.shortDescription,
    image_url: service.imageUrl,
    service_date: service.serviceDate.toISOString(),
    service_id: service.serviceId,
    cta_text: service.ctaText,
    location: service.location,
    price: service.price?.toString() || null,
    order: service.order,
    is_active: service.isActive,
    created_at: service.createdAt.toISOString(),
    updated_at: service.updatedAt.toISOString(),
    service: service.service ? {
      id: service.service.id,
      name: service.service.name,
      slug: service.service.slug,
      featured_image: service.service.featuredImage,
    } : null,
  }
}

export async function generateMetadata({ params }: UpcomingServicePageProps) {
  const { id } = await params
  const service = await getUpcomingService(id)

  if (!service) {
    return {
      title: 'Not Found | SuberCraftex',
    }
  }

  return {
    title: `${service.title} | Coming Soon | SuberCraftex`,
    description: service.short_description || service.description || `${service.title} - launching soon at SuberCraftex`,
  }
}

export default async function UpcomingServicePage({ params }: UpcomingServicePageProps) {
  const { id } = await params
  const upcomingService = await getUpcomingService(id)

  if (!upcomingService) {
    notFound()
  }

  return <UpcomingServiceDetail service={upcomingService} />
}

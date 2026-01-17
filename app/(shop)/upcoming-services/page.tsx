import { db } from '@/lib/db'
import { UpcomingService } from '@/types'
import { UpcomingServicesGrid } from '@/components/shop/UpcomingServicesGrid'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Coming Soon | SuberCraftex',
  description: 'Discover our exciting new services launching soon',
}

async function getUpcomingServices(): Promise<UpcomingService[]> {
  const services = await db.upcomingService.findMany({
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
  })

  return services.map((s) => ({
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
  }))
}

export default async function UpcomingServicesPage() {
  const upcomingServices = await getUpcomingServices()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Coming Soon</h1>
        <p className="text-muted-foreground mt-2">
          Exciting new services launching soon. Stay tuned!
        </p>
      </div>

      <UpcomingServicesGrid services={upcomingServices} />
    </div>
  )
}

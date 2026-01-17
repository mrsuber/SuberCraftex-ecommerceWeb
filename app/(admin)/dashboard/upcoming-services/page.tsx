import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { UpcomingServicesTable } from '@/components/dashboard/UpcomingServicesTable'
import { UpcomingService } from '@/types'

export const dynamic = 'force-dynamic'

async function getUpcomingServices() {
  const services = await db.upcomingService.findMany({
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

  // Serialize for frontend
  return services.map((s): UpcomingService => ({
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Upcoming Services</h1>
          <p className="text-muted-foreground">
            Manage upcoming services with countdown timers
          </p>
        </div>
        <Link href="/dashboard/upcoming-services/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Upcoming Service
          </Button>
        </Link>
      </div>

      <UpcomingServicesTable upcomingServices={upcomingServices} />
    </div>
  )
}

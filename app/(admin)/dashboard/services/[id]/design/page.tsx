import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { ServiceDesignGallery } from '@/components/dashboard/ServiceDesignGallery'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface DesignPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: DesignPageProps): Promise<Metadata> {
  const { id } = await params
  const service = await db.service.findUnique({ where: { id } })

  if (!service) {
    return { title: 'Service Not Found' }
  }

  return {
    title: `Design Options - ${service.name} | Admin Dashboard`,
    description: 'Manage design option categories and images for this service',
  }
}

export default async function DesignPage({ params }: DesignPageProps) {
  const { id } = await params

  const service = await db.service.findUnique({
    where: { id },
    select: { id: true, name: true },
  })

  if (!service) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/services/${id}/edit`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Edit Service
          </Link>
        </Button>
      </div>

      <ServiceDesignGallery serviceId={service.id} serviceName={service.name} />
    </div>
  )
}

import { Suspense } from 'react'
import { db } from '@/lib/db'
import { HeroBannersTable } from '@/components/dashboard/HeroBannersTable'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

async function getHeroBanners() {
  const banners = await db.heroBanner.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })

  return banners.map((banner) => ({
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
  }))
}

export default async function HeroBannersPage() {
  const banners = await getHeroBanners()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hero Banners</h1>
          <p className="text-muted-foreground mt-2">
            Manage homepage hero section banners and advertisements
          </p>
        </div>
        <Link href="/dashboard/hero-banners/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Banner
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <HeroBannersTable banners={banners} />
      </Suspense>
    </div>
  )
}

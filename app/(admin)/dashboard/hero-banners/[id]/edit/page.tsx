import { db } from '@/lib/db'
import { HeroBannerForm } from '@/components/dashboard/HeroBannerForm'
import { notFound } from 'next/navigation'

async function getHeroBanner(id: string) {
  const banner = await db.heroBanner.findUnique({
    where: { id },
  })

  if (!banner) return null

  return {
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
  }
}

export default async function EditHeroBannerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const banner = await getHeroBanner(id)

  if (!banner) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Hero Banner</h1>
        <p className="text-muted-foreground mt-2">Update banner details and settings</p>
      </div>

      <HeroBannerForm banner={banner} />
    </div>
  )
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, requireAdmin } from '@/lib/auth/verify-auth'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://subercraftex.com'

// Helper to convert relative URLs to absolute URLs
function toAbsoluteUrl(url: string | null): string | null {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${APP_URL}${url}`
}

// GET /api/hero-banners - Get all active banners (public) or all banners (admin)
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const now = new Date()

    const where: any = {}

    // Only show active banners for non-admin users
    if (!auth.user || auth.user.role !== 'admin') {
      where.isActive = true
      // Also check date-based scheduling
      where.OR = [
        { startDate: null, endDate: null }, // Always active
        { startDate: { lte: now }, endDate: null }, // Started, no end
        { startDate: null, endDate: { gte: now } }, // Not started yet, has end
        { startDate: { lte: now }, endDate: { gte: now } }, // Currently active
      ]
    } else if (!includeInactive) {
      where.isActive = true
    }

    const banners = await db.heroBanner.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })

    // Serialize data for frontend
    const serialized = banners.map((banner) => ({
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle,
      description: banner.description,
      type: banner.type,
      image_url: toAbsoluteUrl(banner.imageUrl),
      mobile_image_url: toAbsoluteUrl(banner.mobileImageUrl),
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

    return NextResponse.json(serialized)
  } catch (error) {
    console.error('Error fetching hero banners:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hero banners' },
      { status: 500 }
    )
  }
}

// POST /api/hero-banners - Create new banner (admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    const body = await request.json()

    const {
      title,
      subtitle,
      description,
      type,
      imageUrl,
      mobileImageUrl,
      ctaText,
      ctaLink,
      ctaStyle,
      backgroundColor,
      textColor,
      order,
      isActive,
      startDate,
      endDate,
    } = body

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: 'Title and image URL are required' },
        { status: 400 }
      )
    }

    const banner = await db.heroBanner.create({
      data: {
        title,
        subtitle: subtitle || null,
        description: description || null,
        type: type || 'announcement',
        imageUrl,
        mobileImageUrl: mobileImageUrl || null,
        ctaText: ctaText || null,
        ctaLink: ctaLink || null,
        ctaStyle: ctaStyle || 'primary',
        backgroundColor: backgroundColor || '#000000',
        textColor: textColor || '#ffffff',
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    })

    const serialized = {
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle,
      description: banner.description,
      type: banner.type,
      image_url: toAbsoluteUrl(banner.imageUrl),
      mobile_image_url: toAbsoluteUrl(banner.mobileImageUrl),
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

    return NextResponse.json(serialized, { status: 201 })
  } catch (error: any) {
    console.error('Error creating hero banner:', error)

    if (error.message === 'Unauthorized' || error.message.includes('Admin')) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Failed to create hero banner' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth/verify-auth'

// GET /api/hero-banners/[id] - Get single banner
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const banner = await db.heroBanner.findUnique({
      where: { id },
    })

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    const serialized = {
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

    return NextResponse.json(serialized)
  } catch (error) {
    console.error('Error fetching hero banner:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hero banner' },
      { status: 500 }
    )
  }
}

// PATCH /api/hero-banners/[id] - Update banner (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)
    const { id } = await params
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

    const existingBanner = await db.heroBanner.findUnique({
      where: { id },
    })

    if (!existingBanner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (subtitle !== undefined) updateData.subtitle = subtitle || null
    if (description !== undefined) updateData.description = description || null
    if (type !== undefined) updateData.type = type
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl
    if (mobileImageUrl !== undefined) updateData.mobileImageUrl = mobileImageUrl || null
    if (ctaText !== undefined) updateData.ctaText = ctaText || null
    if (ctaLink !== undefined) updateData.ctaLink = ctaLink || null
    if (ctaStyle !== undefined) updateData.ctaStyle = ctaStyle
    if (backgroundColor !== undefined) updateData.backgroundColor = backgroundColor
    if (textColor !== undefined) updateData.textColor = textColor
    if (order !== undefined) updateData.order = order
    if (isActive !== undefined) updateData.isActive = isActive
    if (startDate !== undefined)
      updateData.startDate = startDate ? new Date(startDate) : null
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null

    const banner = await db.heroBanner.update({
      where: { id },
      data: updateData,
    })

    const serialized = {
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

    return NextResponse.json(serialized)
  } catch (error: any) {
    console.error('Error updating hero banner:', error)

    if (error.message === 'Unauthorized' || error.message.includes('Admin')) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Failed to update hero banner' },
      { status: 500 }
    )
  }
}

// DELETE /api/hero-banners/[id] - Delete banner (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)
    const { id } = await params

    const existingBanner = await db.heroBanner.findUnique({
      where: { id },
    })

    if (!existingBanner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    await db.heroBanner.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Banner deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting hero banner:', error)

    if (error.message === 'Unauthorized' || error.message.includes('Admin')) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Failed to delete hero banner' },
      { status: 500 }
    )
  }
}

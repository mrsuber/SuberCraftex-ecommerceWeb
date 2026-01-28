import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://subercraftex.com'

// Helper to convert relative URLs to absolute URLs
function toAbsoluteUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${APP_URL}${url}`
}

// Transform category for API response with absolute URLs
function transformCategory(category: any) {
  return {
    ...category,
    imageUrl: toAbsoluteUrl(category.imageUrl),
    image_url: toAbsoluteUrl(category.imageUrl),
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { name, slug, description, icon, imageUrl, sortOrder, isActive } = body

    // Check if category exists
    const existingCategory = await db.serviceCategory.findUnique({
      where: { id },
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Service category not found' },
        { status: 404 }
      )
    }

    // Check if slug is already taken by another category
    if (slug && slug !== existingCategory.slug) {
      const slugExists = await db.serviceCategory.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'A category with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Update the category
    const updatedCategory = await db.serviceCategory.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        icon,
        imageUrl,
        sortOrder,
        isActive,
      },
    })

    return NextResponse.json(transformCategory(updatedCategory))
  } catch (error) {
    console.error('Error updating service category:', error)
    return NextResponse.json(
      { error: 'Failed to update service category' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if category exists
    const category = await db.serviceCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { services: true },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Service category not found' },
        { status: 404 }
      )
    }

    // Check if category has services
    if (category._count.services > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category with ${category._count.services} service(s). Remove or reassign services first.`,
        },
        { status: 400 }
      )
    }

    // Delete the category
    await db.serviceCategory.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting service category:', error)
    return NextResponse.json(
      { error: 'Failed to delete service category' },
      { status: 500 }
    )
  }
}

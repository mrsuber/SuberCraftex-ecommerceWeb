import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth/verify-auth'

// POST /api/services/[id]/design-categories/[categoryId]/options - Create option
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; categoryId: string }> }
) {
  try {
    const auth = await verifyAuth(request)
    if (!auth.user || auth.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { id, categoryId } = await params
    const body = await request.json()

    const { name, imageUrl, description, sortOrder } = body

    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Option name is required' },
        { status: 400 }
      )
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Option image is required' },
        { status: 400 }
      )
    }

    // Verify category belongs to service
    const category = await db.serviceDesignCategory.findFirst({
      where: { id: categoryId, serviceId: id },
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    const option = await db.serviceDesignOption.create({
      data: {
        categoryId,
        name: name.trim(),
        imageUrl,
        description: description || null,
        sortOrder: sortOrder ?? 0,
      },
    })

    return NextResponse.json(option, { status: 201 })
  } catch (error) {
    console.error('Error creating design option:', error)
    return NextResponse.json(
      { error: 'Failed to create design option' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth/verify-auth'

// PUT /api/services/[id]/design-categories/[categoryId] - Update category
export async function PUT(
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

    const existing = await db.serviceDesignCategory.findFirst({
      where: { id: categoryId, serviceId: id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    const category = await db.serviceDesignCategory.update({
      where: { id: categoryId },
      data: {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
        ...(body.isRequired !== undefined && { isRequired: body.isRequired }),
      },
      include: {
        options: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating design category:', error)
    return NextResponse.json(
      { error: 'Failed to update design category' },
      { status: 500 }
    )
  }
}

// DELETE /api/services/[id]/design-categories/[categoryId] - Delete category
export async function DELETE(
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

    const existing = await db.serviceDesignCategory.findFirst({
      where: { id: categoryId, serviceId: id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    await db.serviceDesignCategory.delete({
      where: { id: categoryId },
    })

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting design category:', error)
    return NextResponse.json(
      { error: 'Failed to delete design category' },
      { status: 500 }
    )
  }
}

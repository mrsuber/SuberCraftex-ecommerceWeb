import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth/verify-auth'

// PUT /api/services/[id]/design-categories/[categoryId]/options/[optionId]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; categoryId: string; optionId: string }> }
) {
  try {
    const auth = await verifyAuth(request)
    if (!auth.user || auth.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { id, categoryId, optionId } = await params
    const body = await request.json()

    // Verify option belongs to category which belongs to service
    const existing = await db.serviceDesignOption.findFirst({
      where: {
        id: optionId,
        categoryId,
        category: { serviceId: id },
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Option not found' }, { status: 404 })
    }

    const option = await db.serviceDesignOption.update({
      where: { id: optionId },
      data: {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    })

    return NextResponse.json(option)
  } catch (error) {
    console.error('Error updating design option:', error)
    return NextResponse.json(
      { error: 'Failed to update design option' },
      { status: 500 }
    )
  }
}

// DELETE /api/services/[id]/design-categories/[categoryId]/options/[optionId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; categoryId: string; optionId: string }> }
) {
  try {
    const auth = await verifyAuth(request)
    if (!auth.user || auth.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { id, categoryId, optionId } = await params

    const existing = await db.serviceDesignOption.findFirst({
      where: {
        id: optionId,
        categoryId,
        category: { serviceId: id },
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Option not found' }, { status: 404 })
    }

    await db.serviceDesignOption.delete({
      where: { id: optionId },
    })

    return NextResponse.json({ message: 'Option deleted successfully' })
  } catch (error) {
    console.error('Error deleting design option:', error)
    return NextResponse.json(
      { error: 'Failed to delete design option' },
      { status: 500 }
    )
  }
}

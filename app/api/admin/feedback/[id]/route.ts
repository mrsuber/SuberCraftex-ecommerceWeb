import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

// GET /api/admin/feedback/[id] - Get single feedback detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getSession()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const feedback = await db.feedback.findUnique({
      where: { id },
      include: {
        investor: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            investorNumber: true,
          },
        },
        adminResponses: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!feedback) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(feedback)
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/feedback/[id] - Update feedback status/priority
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getSession()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const feedback = await db.feedback.findUnique({
      where: { id },
    })

    if (!feedback) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { status, priority } = body

    const updateData: any = {}

    // Validate and set status
    const validStatuses = ['pending', 'under_review', 'in_progress', 'resolved', 'closed']
    if (status && validStatuses.includes(status)) {
      updateData.status = status
      if (status === 'resolved') {
        updateData.resolvedAt = new Date()
      }
    }

    // Validate and set priority
    const validPriorities = ['low', 'medium', 'high', 'urgent']
    if (priority && validPriorities.includes(priority)) {
      updateData.priority = priority
    }

    const updatedFeedback = await db.feedback.update({
      where: { id },
      data: updateData,
      include: {
        investor: {
          select: {
            id: true,
            fullName: true,
            email: true,
            investorNumber: true,
          },
        },
        adminResponses: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    return NextResponse.json(updatedFeedback)
  } catch (error) {
    console.error('Error updating feedback:', error)
    return NextResponse.json(
      { error: 'Failed to update feedback' },
      { status: 500 }
    )
  }
}

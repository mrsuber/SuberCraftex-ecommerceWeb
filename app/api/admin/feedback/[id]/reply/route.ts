import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

// POST /api/admin/feedback/[id]/reply - Add a reply to feedback
export async function POST(
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
    const { message, isInternal, updateStatus } = body

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Create the response
    const response = await db.feedbackResponse.create({
      data: {
        feedbackId: id,
        responderId: user.id,
        message: message.trim(),
        isInternal: isInternal || false,
      },
    })

    // Optionally update the feedback status
    const validStatuses = ['pending', 'under_review', 'in_progress', 'resolved', 'closed']
    if (updateStatus && validStatuses.includes(updateStatus)) {
      await db.feedback.update({
        where: { id },
        data: {
          status: updateStatus,
          resolvedAt: updateStatus === 'resolved' ? new Date() : undefined,
        },
      })
    } else if (feedback.status === 'pending') {
      // Auto-update to under_review if this is the first response
      await db.feedback.update({
        where: { id },
        data: { status: 'under_review' },
      })
    }

    // Return the updated feedback with all responses
    const updatedFeedback = await db.feedback.findUnique({
      where: { id },
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
    console.error('Error adding reply:', error)
    return NextResponse.json(
      { error: 'Failed to add reply' },
      { status: 500 }
    )
  }
}

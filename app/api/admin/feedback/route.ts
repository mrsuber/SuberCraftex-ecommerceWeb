import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

// GET /api/admin/feedback - Get all feedback (admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getSession()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const priority = searchParams.get('priority')

    const where: any = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (type && type !== 'all') {
      where.type = type
    }

    if (priority && priority !== 'all') {
      where.priority = priority
    }

    const feedback = await db.feedback.findMany({
      where,
      include: {
        investor: {
          select: {
            id: true,
            fullName: true,
            email: true,
            investorNumber: true,
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
        adminResponses: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    // Get counts for dashboard
    const counts = await db.feedback.groupBy({
      by: ['status'],
      _count: { status: true },
    })

    const statusCounts = {
      pending: 0,
      under_review: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
    }

    counts.forEach((c) => {
      statusCounts[c.status as keyof typeof statusCounts] = c._count.status
    })

    return NextResponse.json({
      feedback,
      counts: statusCounts,
      total: feedback.length,
    })
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}

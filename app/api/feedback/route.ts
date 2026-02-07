import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

// GET /api/feedback - Get user's feedback history
export async function GET(request: NextRequest) {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to view your feedback.' },
        { status: 401 }
      )
    }

    // Build where clause based on user type
    const whereClause: any = {}

    // Check if user is an investor
    if (user.role === 'investor') {
      const investor = await db.investor.findUnique({
        where: { userId: user.id },
      })
      if (investor) {
        whereClause.OR = [
          { investorId: investor.id },
          { userId: user.id }
        ]
      } else {
        whereClause.userId = user.id
      }
    } else {
      // For non-investors, just get by userId
      whereClause.userId = user.id
    }

    const feedback = await db.feedback.findMany({
      where: whereClause,
      include: {
        adminResponses: {
          where: { isInternal: false }, // Only show non-internal responses
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(feedback)
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}

// POST /api/feedback - Submit new feedback
export async function POST(request: NextRequest) {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to submit feedback.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { type, subject, message, screenshots, videos, appVersion, deviceInfo, userEmail, userName } = body

    // Validate required fields
    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      )
    }

    // Validate type if provided
    const validTypes = ['bug_report', 'feature_request', 'improvement', 'general', 'complaint']
    if (type && !validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid feedback type' },
        { status: 400 }
      )
    }

    // Prepare feedback data
    const feedbackData: any = {
      userId: user.id,
      userEmail: userEmail || user.email,
      userName: userName || user.fullName || user.email,
      type: type || 'general',
      subject: subject.trim(),
      message: message.trim(),
      screenshots: screenshots || [],
      videos: videos || [],
      appVersion: appVersion || null,
      deviceInfo: deviceInfo || null,
    }

    // If user is an investor, also link to investor record
    if (user.role === 'investor') {
      const investor = await db.investor.findUnique({
        where: { userId: user.id },
      })
      if (investor) {
        feedbackData.investorId = investor.id
      }
    }

    const feedback = await db.feedback.create({
      data: feedbackData,
      include: {
        adminResponses: true,
      },
    })

    return NextResponse.json(feedback, { status: 201 })
  } catch (error) {
    console.error('Error creating feedback:', error)
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}

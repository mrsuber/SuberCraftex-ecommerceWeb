import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import FeedbackDashboardClient from './FeedbackDashboardClient'

export default async function FeedbackPage() {
  const user = await getSession()

  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  // Fetch all feedback with user/investor info and responses
  const feedback = await db.feedback.findMany({
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

  // Get counts by status
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

  // Serialize dates
  const serializedFeedback = feedback.map(f => ({
    ...f,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
    resolvedAt: f.resolvedAt?.toISOString() || null,
    adminResponses: f.adminResponses.map(r => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
  }))

  return (
    <FeedbackDashboardClient
      initialFeedback={serializedFeedback}
      statusCounts={statusCounts}
    />
  )
}

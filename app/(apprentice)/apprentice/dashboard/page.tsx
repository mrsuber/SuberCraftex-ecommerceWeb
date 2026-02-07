import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import ApprenticeDashboardClient from '@/components/apprentice/ApprenticeDashboardClient'

export default async function ApprenticeDashboardPage() {
  const user = await getSession()

  if (!user || user.role !== 'apprentice') {
    redirect('/login')
  }

  const apprentice = await db.apprentice.findUnique({
    where: { userId: user.id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      assignments: {
        orderBy: { assignedDate: 'desc' },
      },
      certificates: {
        orderBy: { issuedDate: 'desc' },
      },
    },
  })

  if (!apprentice) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Apprentice Profile Not Found</h1>
          <p className="text-muted-foreground">
            Your apprentice profile has not been set up yet. Please contact an administrator.
          </p>
        </div>
      </div>
    )
  }

  // Get mentor info
  let mentor = null
  if (apprentice.mentorType === 'tailor') {
    mentor = await db.tailor.findUnique({
      where: { id: apprentice.mentorId },
      include: {
        user: {
          select: { fullName: true, email: true },
        },
      },
    })
  } else if (apprentice.mentorType === 'technician') {
    mentor = await db.technician.findUnique({
      where: { id: apprentice.mentorId },
      include: {
        user: {
          select: { fullName: true, email: true },
        },
      },
    })
  }

  // Calculate stats
  const stats = {
    totalAssignments: apprentice.assignments.length,
    completedAssignments: apprentice.assignments.filter((a) => a.status === 'completed').length,
    pendingAssignments: apprentice.assignments.filter((a) => a.status === 'pending').length,
    inProgressAssignments: apprentice.assignments.filter((a) => a.status === 'in_progress').length,
    averageRating:
      apprentice.assignments.filter((a) => a.rating !== null).length > 0
        ? apprentice.assignments
            .filter((a) => a.rating !== null)
            .reduce((acc, a) => acc + (a.rating || 0), 0) /
          apprentice.assignments.filter((a) => a.rating !== null).length
        : null,
    certificatesCount: apprentice.certificates.length,
  }

  // Serialize for client component
  const serializedApprentice = {
    id: apprentice.id,
    apprenticeNumber: apprentice.apprenticeNumber,
    fullName: apprentice.fullName,
    email: apprentice.email,
    phone: apprentice.phone,
    photoUrl: apprentice.photoUrl,
    department: apprentice.department,
    mentorId: apprentice.mentorId,
    mentorType: apprentice.mentorType,
    mentorName: mentor?.user?.fullName || 'Unknown',
    startDate: apprentice.startDate.toISOString(),
    expectedEndDate: apprentice.expectedEndDate?.toISOString() || null,
    status: apprentice.status,
    isActive: apprentice.isActive,
    serviceTrack: apprentice.serviceTrack || 'tailoring',
    canWorkOnRealJobs: apprentice.canWorkOnRealJobs || false,
    realJobsCompleted: apprentice.realJobsCompleted || 0,
    stats,
    assignments: apprentice.assignments.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      instructions: a.instructions,
      status: a.status,
      dueDate: a.dueDate?.toISOString() || null,
      assignedDate: a.assignedDate.toISOString(),
      completedDate: a.completedDate?.toISOString() || null,
      submittedAt: a.submittedAt?.toISOString() || null,
      rating: a.rating,
      feedback: a.feedback,
      assignmentPhotos: a.assignmentPhotos || [],
      submissionNotes: a.submissionNotes,
      submissionPhotos: a.submissionPhotos || [],
      submissionVideos: a.submissionVideos || [],
      submissionDocuments: a.submissionDocuments || [],
    })),
    certificates: apprentice.certificates.map((c) => ({
      id: c.id,
      certificateNumber: c.certificateNumber,
      title: c.title,
      description: c.description,
      skills: c.skills,
      issuedDate: c.issuedDate.toISOString(),
      issuedBy: c.issuedBy,
    })),
  }

  return <ApprenticeDashboardClient apprentice={serializedApprentice} />
}

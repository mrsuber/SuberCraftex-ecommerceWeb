import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  ClipboardList,
  Star,
  Calendar,
  Award,
  Clock,
} from 'lucide-react'
import { format } from 'date-fns'

export const metadata: Metadata = {
  title: 'My Apprentices | Tailor Dashboard',
  description: 'Manage your apprentices and their learning progress',
}

export default async function TailorApprenticesPage() {
  const user = await getSession()

  if (!user || user.role !== 'tailor') {
    redirect('/dashboard')
  }

  const tailor = await db.tailor.findUnique({
    where: { userId: user.id },
  })

  if (!tailor) {
    redirect('/dashboard')
  }

  const apprentices = await db.apprentice.findMany({
    where: {
      mentorId: user.id,
      isActive: true,
    },
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
    orderBy: { startDate: 'desc' },
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'completed':
        return 'bg-blue-500'
      case 'suspended':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/tailor">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            My Apprentices
          </h1>
          <p className="text-muted-foreground">
            Manage and track progress of apprentices you are mentoring
          </p>
        </div>
      </div>

      {apprentices.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Apprentices Assigned</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                You currently have no apprentices assigned to you. Contact an administrator to have apprentices assigned to your mentorship.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Apprentices</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{apprentices.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {apprentices.reduce((acc, a) => acc + a.assignments.length, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Star className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {apprentices.reduce((acc, a) => acc + a.assignments.filter(t => t.status === 'completed').length, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
                <Award className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {apprentices.reduce((acc, a) => acc + a.certificates.length, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Apprentices List */}
          <Card>
            <CardHeader>
              <CardTitle>Apprentices</CardTitle>
              <CardDescription>Click on an apprentice to view details and manage assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apprentices.map((apprentice) => {
                  const completedAssignments = apprentice.assignments.filter(a => a.status === 'completed').length
                  const totalAssignments = apprentice.assignments.length
                  const progressPercentage = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0
                  const pendingReview = apprentice.assignments.filter(a => a.status === 'submitted').length
                  const inProgress = apprentice.assignments.filter(a => a.status === 'in_progress').length

                  return (
                    <div
                      key={apprentice.id}
                      className="border rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                            {apprentice.photoUrl ? (
                              <img
                                src={apprentice.photoUrl}
                                alt={apprentice.fullName}
                                className="h-14 w-14 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-xl font-semibold text-primary">
                                {apprentice.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-lg">{apprentice.fullName}</h3>
                              <Badge className={getStatusColor(apprentice.status)}>
                                {apprentice.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              #{apprentice.apprenticeNumber} &bull; {apprentice.email}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Started {format(new Date(apprentice.startDate), 'MMM d, yyyy')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Award className="h-3 w-3 text-yellow-500" />
                                {apprentice.certificates.length} certificate{apprentice.certificates.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 md:items-end">
                          <div className="flex gap-2">
                            <Link href={`/dashboard/apprentices/${apprentice.id}/assignments/new`}>
                              <Button size="sm" variant="outline">
                                <ClipboardList className="mr-2 h-4 w-4" />
                                Assign Task
                              </Button>
                            </Link>
                            <Link href={`/dashboard/apprentices/${apprentice.id}`}>
                              <Button size="sm">
                                View Details
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Progress Section */}
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Assignment Progress</span>
                          <span className="text-sm text-muted-foreground">
                            {completedAssignments} of {totalAssignments} completed
                          </span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />

                        {/* Quick Stats */}
                        <div className="flex gap-4 mt-3 text-xs">
                          {pendingReview > 0 && (
                            <span className="flex items-center gap-1 text-orange-600">
                              <Clock className="h-3 w-3" />
                              {pendingReview} pending review
                            </span>
                          )}
                          {inProgress > 0 && (
                            <span className="flex items-center gap-1 text-blue-600">
                              <ClipboardList className="h-3 w-3" />
                              {inProgress} in progress
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

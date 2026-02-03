'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  GraduationCap,
  ClipboardList,
  Award,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  ArrowLeft,
  Eye,
  Send,
  Image as ImageIcon,
  Video,
  FileText,
  MessageSquare,
  ExternalLink,
} from 'lucide-react'
import { format } from 'date-fns'
import { AssignmentSubmissionForm } from './AssignmentSubmissionForm'
import { AssignmentComments } from '@/components/dashboard/AssignmentComments'

interface Assignment {
  id: string
  title: string
  description: string | null
  instructions: string | null
  status: string
  dueDate: string | null
  assignedDate: string
  completedDate: string | null
  submittedAt: string | null
  rating: number | null
  feedback: string | null
  assignmentPhotos: string[]
  submissionNotes: string | null
  submissionPhotos: string[]
  submissionVideos: string[]
}

interface Certificate {
  id: string
  certificateNumber: string
  title: string
  description: string | null
  skills: string[]
  issuedDate: string
  issuedBy: string
}

interface ApprenticeData {
  id: string
  apprenticeNumber: string
  fullName: string
  email: string
  phone: string
  photoUrl: string | null
  department: string
  mentorId: string
  mentorType: string
  mentorName: string
  startDate: string
  expectedEndDate: string | null
  status: string
  isActive: boolean
  stats: {
    totalAssignments: number
    completedAssignments: number
    pendingAssignments: number
    inProgressAssignments: number
    averageRating: number | null
    certificatesCount: number
  }
  assignments: Assignment[]
  certificates: Certificate[]
}

interface ApprenticeDashboardClientProps {
  apprentice: ApprenticeData
}

export default function ApprenticeDashboardClient({ apprentice }: ApprenticeDashboardClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600">Completed</Badge>
      case 'in_progress':
        return <Badge className="bg-blue-600">In Progress</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back to Account */}
        <Link href="/account" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Account
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <Avatar className="h-24 w-24">
            <AvatarImage src={apprentice.photoUrl || undefined} />
            <AvatarFallback className="text-2xl">{getInitials(apprentice.fullName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{apprentice.fullName}</h1>
              <Badge variant={apprentice.isActive ? 'default' : 'secondary'}>
                {apprentice.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-1">
              Apprentice #{apprentice.apprenticeNumber}
            </p>
            <p className="text-muted-foreground">
              Department: <span className="font-medium capitalize">{apprentice.department.toLowerCase()}</span>
            </p>
            <p className="text-muted-foreground">
              Mentor: <span className="font-medium">{apprentice.mentorName}</span>
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{apprentice.stats.totalAssignments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{apprentice.stats.completedAssignments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{apprentice.stats.inProgressAssignments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {apprentice.stats.averageRating ? apprentice.stats.averageRating.toFixed(1) : 'N/A'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Program Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Program Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date</span>
                    <span className="font-medium">
                      {format(new Date(apprentice.startDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                  {apprentice.expectedEndDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expected End Date</span>
                      <span className="font-medium">
                        {format(new Date(apprentice.expectedEndDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Certificates Earned</span>
                    <span className="font-medium">{apprentice.stats.certificatesCount}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Assignments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    Recent Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {apprentice.assignments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No assignments yet</p>
                  ) : (
                    <div className="space-y-3">
                      {apprentice.assignments.slice(0, 5).map((assignment) => (
                        <div
                          key={assignment.id}
                          className="flex items-center justify-between border-b pb-3 last:border-0"
                        >
                          <div>
                            <p className="font-medium">{assignment.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(assignment.assignedDate), 'MMM d, yyyy')}
                            </p>
                          </div>
                          {getStatusBadge(assignment.status)}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle>All Assignments</CardTitle>
                <CardDescription>Your learning assignments and their progress</CardDescription>
              </CardHeader>
              <CardContent>
                {apprentice.assignments.length === 0 ? (
                  <div className="text-center py-12">
                    <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Assignments Yet</h3>
                    <p className="text-muted-foreground">
                      Your mentor will assign tasks to help you learn.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {apprentice.assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="border rounded-lg p-4 hover:border-primary transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold">{assignment.title}</h3>
                            {assignment.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {assignment.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {getStatusBadge(assignment.status)}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Assigned: {format(new Date(assignment.assignedDate), 'MMM d, yyyy')}
                          </span>
                          {assignment.dueDate && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Due: {format(new Date(assignment.dueDate), 'MMM d, yyyy')}
                            </span>
                          )}
                          {assignment.rating && (
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              Rating: {assignment.rating}/5
                            </span>
                          )}
                        </div>
                        {assignment.feedback && (
                          <div className="mt-3 p-3 bg-muted rounded-md">
                            <p className="text-sm font-medium">Mentor Feedback:</p>
                            <p className="text-sm text-muted-foreground">{assignment.feedback}</p>
                          </div>
                        )}
                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4 pt-3 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAssignment(assignment)
                              setShowDetailsDialog(true)
                              setShowSubmitForm(false)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          {['pending', 'in_progress', 'needs_revision'].includes(assignment.status) && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedAssignment(assignment)
                                setShowDetailsDialog(true)
                                setShowSubmitForm(true)
                              }}
                            >
                              <Send className="h-4 w-4 mr-1" />
                              Submit Work
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <CardTitle>Certificates</CardTitle>
                <CardDescription>Your earned certificates and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                {apprentice.certificates.length === 0 ? (
                  <div className="text-center py-12">
                    <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Certificates Yet</h3>
                    <p className="text-muted-foreground">
                      Complete your assignments to earn certificates.
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {apprentice.certificates.map((certificate) => (
                      <div
                        key={certificate.id}
                        className="border rounded-lg p-4 hover:border-primary transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <Award className="h-8 w-8 text-yellow-500 flex-shrink-0" />
                          <div className="flex-1">
                            <h3 className="font-semibold">{certificate.title}</h3>
                            <p className="text-xs text-muted-foreground">
                              #{certificate.certificateNumber}
                            </p>
                            {certificate.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {certificate.description}
                              </p>
                            )}
                            {certificate.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {certificate.skills.map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <p className="text-sm text-muted-foreground mt-2">
                              Issued: {format(new Date(certificate.issuedDate), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Assignment Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={(open) => {
          setShowDetailsDialog(open)
          if (!open) {
            setShowSubmitForm(false)
            setSelectedAssignment(null)
          }
        }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {selectedAssignment?.title}
              </DialogTitle>
              <DialogDescription>
                Assignment details, submission, and discussion
              </DialogDescription>
            </DialogHeader>
            {selectedAssignment && (
              <div className="space-y-6">
                {/* Status and Dates */}
                <div className="flex flex-wrap gap-3 items-center">
                  {getStatusBadge(selectedAssignment.status)}
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Assigned: {format(new Date(selectedAssignment.assignedDate), 'MMM d, yyyy')}
                  </span>
                  {selectedAssignment.dueDate && (
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Due: {format(new Date(selectedAssignment.dueDate), 'MMM d, yyyy')}
                    </span>
                  )}
                  {selectedAssignment.submittedAt && (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Submitted: {format(new Date(selectedAssignment.submittedAt), 'MMM d, yyyy')}
                    </span>
                  )}
                  {selectedAssignment.rating && (
                    <span className="text-sm text-yellow-600 flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current" />
                      Rating: {selectedAssignment.rating}/5
                    </span>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedAssignment.description || 'No description provided'}
                  </p>
                </div>

                {/* Instructions */}
                {selectedAssignment.instructions && (
                  <div>
                    <h4 className="font-medium mb-2">Instructions</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-3 rounded-lg">
                      {selectedAssignment.instructions}
                    </p>
                  </div>
                )}

                {/* Assignment Reference Photos */}
                {selectedAssignment.assignmentPhotos.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-1">
                      <ImageIcon className="h-4 w-4" />
                      Reference Photos ({selectedAssignment.assignmentPhotos.length})
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                      {selectedAssignment.assignmentPhotos.map((photo, idx) => (
                        <img
                          key={idx}
                          src={photo}
                          alt={`Reference ${idx + 1}`}
                          className="rounded-lg object-cover aspect-square cursor-pointer hover:opacity-80 transition-opacity border"
                          onClick={() => setSelectedImage(photo)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Your Submission (if exists) */}
                {(selectedAssignment.submissionNotes ||
                  selectedAssignment.submissionPhotos.length > 0 ||
                  selectedAssignment.submissionVideos.length > 0) && !showSubmitForm && (
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Your Submission
                      </CardTitle>
                      {selectedAssignment.submittedAt && (
                        <CardDescription>
                          Submitted on {format(new Date(selectedAssignment.submittedAt), "MMMM d, yyyy 'at' h:mm a")}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedAssignment.submissionNotes && (
                        <div>
                          <h5 className="font-medium text-sm mb-1">Your Notes</h5>
                          <p className="text-sm whitespace-pre-wrap bg-white p-3 rounded-lg border">
                            {selectedAssignment.submissionNotes}
                          </p>
                        </div>
                      )}
                      {selectedAssignment.submissionPhotos.length > 0 && (
                        <div>
                          <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                            <ImageIcon className="h-4 w-4" />
                            Your Photos ({selectedAssignment.submissionPhotos.length})
                          </h5>
                          <div className="grid grid-cols-4 gap-2">
                            {selectedAssignment.submissionPhotos.map((photo, idx) => (
                              <img
                                key={idx}
                                src={photo}
                                alt={`Submission ${idx + 1}`}
                                className="rounded-lg object-cover aspect-square cursor-pointer hover:opacity-80 transition-opacity border"
                                onClick={() => setSelectedImage(photo)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedAssignment.submissionVideos.length > 0 && (
                        <div>
                          <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                            <Video className="h-4 w-4" />
                            Your Videos ({selectedAssignment.submissionVideos.length})
                          </h5>
                          <div className="space-y-2">
                            {selectedAssignment.submissionVideos.map((video, idx) => (
                              <a
                                key={idx}
                                href={video}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors text-sm border"
                              >
                                <Video className="h-4 w-4 text-red-500" />
                                <span className="truncate flex-1">{video}</span>
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Mentor Feedback */}
                {selectedAssignment.feedback && (
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Mentor Feedback
                        {selectedAssignment.rating && (
                          <Badge className="bg-yellow-100 text-yellow-800 ml-2">
                            {selectedAssignment.rating}/5 stars
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">{selectedAssignment.feedback}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Submit Form */}
                {showSubmitForm && ['pending', 'in_progress', 'needs_revision'].includes(selectedAssignment.status) && (
                  <AssignmentSubmissionForm
                    apprenticeId={apprentice.id}
                    assignmentId={selectedAssignment.id}
                    assignmentTitle={selectedAssignment.title}
                    existingSubmission={{
                      submissionNotes: selectedAssignment.submissionNotes,
                      submissionPhotos: selectedAssignment.submissionPhotos,
                      submissionVideos: selectedAssignment.submissionVideos,
                    }}
                    onSuccess={() => {
                      setShowSubmitForm(false)
                      setShowDetailsDialog(false)
                      router.refresh()
                    }}
                    onCancel={() => setShowSubmitForm(false)}
                  />
                )}

                {/* Submit Button when not showing form */}
                {!showSubmitForm && ['pending', 'in_progress', 'needs_revision'].includes(selectedAssignment.status) && (
                  <div className="flex justify-center pt-4 border-t">
                    <Button size="lg" onClick={() => setShowSubmitForm(true)}>
                      <Send className="mr-2 h-4 w-4" />
                      {selectedAssignment.submissionNotes ? 'Update Submission' : 'Submit Your Work'}
                    </Button>
                  </div>
                )}

                {/* Comments Section */}
                <div className="pt-4 border-t">
                  <AssignmentComments
                    apprenticeId={apprentice.id}
                    assignmentId={selectedAssignment.id}
                    currentUserRole="apprentice"
                  />
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Image Lightbox */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0">
            <DialogHeader className="sr-only">
              <DialogTitle>Image Preview</DialogTitle>
              <DialogDescription>Full size image preview</DialogDescription>
            </DialogHeader>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Full size"
                className="w-full h-auto rounded-lg"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

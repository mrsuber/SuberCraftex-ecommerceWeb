"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Clock,
  Calendar,
  Star,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Video,
  FileText,
  User,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { AssignmentComments } from "./AssignmentComments";
import { AssignmentSubmissionForm } from "@/components/apprentice/AssignmentSubmissionForm";

interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string | null;
  assignedDate: string;
  dueDate: string | null;
  completedDate: string | null;
  submittedAt: string | null;
  status: string;
  rating: number | null;
  feedback: string | null;
  assignmentPhotos: string[];
  submissionNotes: string | null;
  submissionPhotos: string[];
  submissionVideos: string[];
  assignedBy: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
}

interface AssignmentDetailViewProps {
  assignment: Assignment;
  apprenticeId: string;
  apprenticeName: string;
  currentUserRole: string;
  canSubmit?: boolean; // Whether current user can submit (is apprentice owner)
  canReview?: boolean; // Whether current user can review (is mentor/admin)
  onClose?: () => void;
  isDialog?: boolean;
}

const STATUS_STYLES: Record<string, { bg: string; icon: React.ReactNode }> = {
  pending: { bg: "bg-gray-100 text-gray-800", icon: <Clock className="h-3 w-3" /> },
  in_progress: { bg: "bg-blue-100 text-blue-800", icon: <Clock className="h-3 w-3" /> },
  submitted: { bg: "bg-yellow-100 text-yellow-800", icon: <CheckCircle className="h-3 w-3" /> },
  needs_revision: { bg: "bg-orange-100 text-orange-800", icon: <AlertCircle className="h-3 w-3" /> },
  completed: { bg: "bg-green-100 text-green-800", icon: <CheckCircle className="h-3 w-3" /> },
  overdue: { bg: "bg-red-100 text-red-800", icon: <AlertCircle className="h-3 w-3" /> },
};

// Extract YouTube video ID
function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function AssignmentDetailView({
  assignment,
  apprenticeId,
  apprenticeName,
  currentUserRole,
  canSubmit = false,
  canReview = false,
  onClose,
  isDialog = false,
}: AssignmentDetailViewProps) {
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const statusStyle = STATUS_STYLES[assignment.status] || STATUS_STYLES.pending;

  const canShowSubmitButton =
    canSubmit && ["pending", "in_progress", "needs_revision"].includes(assignment.status);

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{assignment.title}</h2>
          <p className="text-sm text-muted-foreground">For {apprenticeName}</p>
        </div>
        <Badge className={`${statusStyle.bg} flex items-center gap-1`}>
          {statusStyle.icon}
          {assignment.status.replace("_", " ")}
        </Badge>
      </div>

      {/* Timeline Info */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Assigned: {format(new Date(assignment.assignedDate), "MMM d, yyyy")}
        </div>
        {assignment.dueDate && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            Due: {format(new Date(assignment.dueDate), "MMM d, yyyy")}
          </div>
        )}
        {assignment.submittedAt && (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
            Submitted: {format(new Date(assignment.submittedAt), "MMM d, yyyy")}
          </div>
        )}
        {assignment.rating && (
          <div className="flex items-center gap-1 text-yellow-600">
            <Star className="h-4 w-4 fill-current" />
            Rating: {assignment.rating}/5
          </div>
        )}
      </div>

      {/* Description */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Assignment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-1">Description</h4>
            <p className="text-sm whitespace-pre-wrap">{assignment.description}</p>
          </div>
          {assignment.instructions && (
            <div>
              <h4 className="font-medium text-sm mb-1">Instructions</h4>
              <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                {assignment.instructions}
              </p>
            </div>
          )}
          {assignment.assignmentPhotos.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2">Reference Photos</h4>
              <div className="grid grid-cols-4 gap-2">
                {assignment.assignmentPhotos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={`Reference ${idx + 1}`}
                    className="rounded-lg object-cover aspect-square cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedImage(photo)}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Section */}
      {(assignment.submissionNotes ||
        assignment.submissionPhotos.length > 0 ||
        assignment.submissionVideos.length > 0) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Apprentice Submission
            </CardTitle>
            {assignment.submittedAt && (
              <CardDescription>
                Submitted on {format(new Date(assignment.submittedAt), "MMMM d, yyyy 'at' h:mm a")}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {assignment.submissionNotes && (
              <div>
                <h4 className="font-medium text-sm mb-1">Notes</h4>
                <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-lg">
                  {assignment.submissionNotes}
                </p>
              </div>
            )}
            {assignment.submissionPhotos.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  <ImageIcon className="h-4 w-4" />
                  Photos ({assignment.submissionPhotos.length})
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {assignment.submissionPhotos.map((photo, idx) => (
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
            {assignment.submissionVideos.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  <Video className="h-4 w-4" />
                  Videos ({assignment.submissionVideos.length})
                </h4>
                <div className="space-y-2">
                  {assignment.submissionVideos.map((video, idx) => {
                    const youtubeId = getYouTubeId(video);
                    return (
                      <div key={idx}>
                        {youtubeId ? (
                          <div className="aspect-video rounded-lg overflow-hidden bg-black">
                            <iframe
                              width="100%"
                              height="100%"
                              src={`https://www.youtube.com/embed/${youtubeId}`}
                              title={`Video ${idx + 1}`}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <a
                            href={video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                          >
                            <Video className="h-5 w-5 text-red-500" />
                            <span className="text-sm truncate flex-1">{video}</span>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Mentor Feedback */}
      {assignment.feedback && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              Mentor Feedback
              {assignment.rating && (
                <Badge className="bg-yellow-100 text-yellow-800 ml-2">
                  {assignment.rating}/5 stars
                </Badge>
              )}
            </CardTitle>
            {assignment.reviewedAt && (
              <CardDescription>
                Reviewed on {format(new Date(assignment.reviewedAt), "MMMM d, yyyy")}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{assignment.feedback}</p>
          </CardContent>
        </Card>
      )}

      {/* Submit Button for Apprentice */}
      {canShowSubmitButton && !showSubmitForm && (
        <div className="flex justify-center">
          <Button onClick={() => setShowSubmitForm(true)} size="lg">
            <CheckCircle className="mr-2 h-4 w-4" />
            Submit Your Work
          </Button>
        </div>
      )}

      {/* Submission Form */}
      {showSubmitForm && (
        <AssignmentSubmissionForm
          apprenticeId={apprenticeId}
          assignmentId={assignment.id}
          assignmentTitle={assignment.title}
          existingSubmission={{
            submissionNotes: assignment.submissionNotes,
            submissionPhotos: assignment.submissionPhotos,
            submissionVideos: assignment.submissionVideos,
          }}
          onSuccess={() => {
            setShowSubmitForm(false);
            onClose?.();
          }}
          onCancel={() => setShowSubmitForm(false)}
        />
      )}

      {/* Comments Section */}
      <AssignmentComments
        apprenticeId={apprenticeId}
        assignmentId={assignment.id}
        currentUserRole={currentUserRole}
      />

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
  );

  if (isDialog) {
    return content;
  }

  return <div className="max-w-4xl mx-auto">{content}</div>;
}

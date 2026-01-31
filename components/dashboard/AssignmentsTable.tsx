"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  MoreHorizontal,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  Image as ImageIcon,
  ClipboardList,
} from "lucide-react";
import { AssignmentReview } from "./AssignmentReview";

interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string | null;
  assignedDate: string;
  dueDate: string | null;
  completedDate: string | null;
  status: string;
  rating: number | null;
  feedback: string | null;
  assignmentPhotos: string[];
  submissionPhotos: string[];
  assignedBy: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
}

interface AssignmentsTableProps {
  assignments: Assignment[];
  apprenticeId: string;
  canReview?: boolean;
  onRefresh?: () => void;
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  in_progress: "outline",
  submitted: "default",
  needs_revision: "destructive",
  completed: "default",
  overdue: "destructive",
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-3 w-3" />,
  in_progress: <Clock className="h-3 w-3" />,
  submitted: <CheckCircle className="h-3 w-3" />,
  needs_revision: <AlertCircle className="h-3 w-3" />,
  completed: <CheckCircle className="h-3 w-3" />,
  overdue: <AlertCircle className="h-3 w-3" />,
};

export function AssignmentsTable({
  assignments,
  apprenticeId,
  canReview = false,
  onRefresh,
}: AssignmentsTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const filteredAssignments = assignments.filter((assignment) => {
    return statusFilter === "all" || assignment.status === statusFilter;
  });

  const handleReviewSuccess = () => {
    setShowReviewDialog(false);
    setSelectedAssignment(null);
    onRefresh?.();
  };

  if (assignments.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No assignments found.</p>
          <Link href={`/dashboard/apprentices/${apprenticeId}/assignments/new`}>
            <Button className="mt-4">Create First Assignment</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex justify-between items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="needs_revision">Needs Revision</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>

          <Link href={`/dashboard/apprentices/${apprenticeId}/assignments/new`}>
            <Button>Create Assignment</Button>
          </Link>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Photos</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{assignment.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {assignment.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusColors[assignment.status] || "outline"}
                        className="flex items-center gap-1 w-fit"
                      >
                        {statusIcons[assignment.status]}
                        {assignment.status.replace("_", " ").charAt(0).toUpperCase() +
                          assignment.status.replace("_", " ").slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {assignment.dueDate
                        ? new Date(assignment.dueDate).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ImageIcon className="h-4 w-4" />
                        {assignment.assignmentPhotos.length} / {assignment.submissionPhotos.length}
                      </div>
                    </TableCell>
                    <TableCell>
                      {assignment.rating ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{assignment.rating}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedAssignment(assignment);
                              setShowDetailsDialog(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {canReview && assignment.status === "submitted" && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAssignment(assignment);
                                setShowReviewDialog(true);
                              }}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Review
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Results Count */}
        {statusFilter !== "all" && (
          <p className="text-sm text-muted-foreground">
            Showing {filteredAssignments.length} of {assignments.length} assignments
          </p>
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAssignment?.title}</DialogTitle>
            <DialogDescription>Assignment details and submission</DialogDescription>
          </DialogHeader>
          {selectedAssignment && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {selectedAssignment.description}
                </p>
              </div>

              {selectedAssignment.instructions && (
                <div>
                  <h4 className="font-medium mb-2">Instructions</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedAssignment.instructions}
                  </p>
                </div>
              )}

              {selectedAssignment.assignmentPhotos.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Assignment Photos</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedAssignment.assignmentPhotos.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt={`Assignment ${idx + 1}`}
                        className="rounded-lg object-cover aspect-square"
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedAssignment.submissionPhotos.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Submission Photos</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedAssignment.submissionPhotos.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt={`Submission ${idx + 1}`}
                        className="rounded-lg object-cover aspect-square"
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedAssignment.feedback && (
                <div>
                  <h4 className="font-medium mb-2">Feedback</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedAssignment.feedback}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Badge variant={statusColors[selectedAssignment.status]}>
                  {selectedAssignment.status.replace("_", " ")}
                </Badge>
                {selectedAssignment.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{selectedAssignment.rating}/5</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Assignment</DialogTitle>
            <DialogDescription>
              Provide feedback and rating for this assignment
            </DialogDescription>
          </DialogHeader>
          {selectedAssignment && (
            <AssignmentReview
              apprenticeId={apprenticeId}
              assignmentId={selectedAssignment.id}
              onSuccess={handleReviewSuccess}
              onCancel={() => setShowReviewDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

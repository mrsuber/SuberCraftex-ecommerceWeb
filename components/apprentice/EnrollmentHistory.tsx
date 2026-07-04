"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Plus, GraduationCap, CheckCircle, Clock, BookOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Enrollment {
  id: string;
  serviceTrack: string;
  status: string;
  startDate: string;
  completionDate: string | null;
  totalAssignments: number;
  completedAssignments: number;
  progressPercentage: number;
}

interface EnrollmentHistoryProps {
  apprenticeId: string;
  enrollments: Enrollment[];
}

const SERVICE_TRACK_LABELS: Record<string, string> = {
  tailoring: "Tailoring",
  device_repair: "Device Repair",
  sales: "Sales",
  delivery: "Delivery",
  operations: "Operations",
  beadwork: "Beadwork",
  henna: "Henna",
  printing_press: "Printing Press",
  embroidery: "Embroidery",
  electronics: "Electronics",
  computing: "Computing",
  woodworking_aerospace: "Woodworking → Aerospace",
  leather_working: "Leather Working",
  drawing_sketching: "Drawing & Sketching",
  beauty_grooming: "Beauty & Grooming",
  filmmaking: "Filmmaking & Video Production",
};

const ENROLLMENT_STATUS_COLORS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  completed: "secondary",
  dropped: "destructive",
  paused: "outline",
};

export function EnrollmentHistory({ apprenticeId, enrollments }: EnrollmentHistoryProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [enrollmentToDelete, setEnrollmentToDelete] = useState<{
    id: string;
    serviceTrack: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Get tracks that are already enrolled
  const enrolledTracks = enrollments.map((e) => e.serviceTrack);

  // Available tracks to enroll in
  const availableTracks = Object.keys(SERVICE_TRACK_LABELS).filter(
    (track) => !enrolledTracks.includes(track)
  );

  const handleEnroll = async () => {
    if (!selectedTrack) {
      toast.error("Please select a service track");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/apprentices/${apprenticeId}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceTrack: selectedTrack }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to enroll");
      }

      toast.success(
        `Successfully enrolled in ${SERVICE_TRACK_LABELS[selectedTrack]} curriculum with ${data.assignmentsCreated} assignments`
      );
      setOpen(false);
      setSelectedTrack("");
      router.refresh();
    } catch (error: any) {
      console.error("Error enrolling:", error);
      toast.error(error.message || "Failed to enroll in curriculum");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (enrollmentId: string, serviceTrack: string) => {
    setEnrollmentToDelete({ id: enrollmentId, serviceTrack });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!enrollmentToDelete) return;

    setDeleting(true);

    try {
      const response = await fetch(
        `/api/apprentices/${apprenticeId}/enrollments/${enrollmentToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove enrollment");
      }

      toast.success(
        `Successfully removed ${SERVICE_TRACK_LABELS[enrollmentToDelete.serviceTrack]} curriculum (${data.deletedAssignments} assignments deleted)`
      );
      setDeleteDialogOpen(false);
      setEnrollmentToDelete(null);
      router.refresh();
    } catch (error: any) {
      console.error("Error removing enrollment:", error);
      toast.error(error.message || "Failed to remove enrollment");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Curriculum Enrollments
        </CardTitle>
        {availableTracks.length > 0 && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Assign New Curriculum
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign New Curriculum</DialogTitle>
                <DialogDescription>
                  Select a service track curriculum to assign to this apprentice.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Service Track</label>
                  <Select value={selectedTrack} onValueChange={setSelectedTrack}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select curriculum..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTracks.map((track) => (
                        <SelectItem key={track} value={track}>
                          {SERVICE_TRACK_LABELS[track]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleEnroll}
                  disabled={loading || !selectedTrack}
                  className="w-full"
                >
                  {loading ? "Enrolling..." : "Enroll in Curriculum"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {enrollments.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No Enrollments Yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Assign a curriculum to start tracking this apprentice's learning progress.
            </p>
            <Button onClick={() => setOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Assign First Curriculum
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="p-4 rounded-lg border space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">
                        {SERVICE_TRACK_LABELS[enrollment.serviceTrack]}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Started {new Date(enrollment.startDate).toLocaleDateString()}
                        {enrollment.completionDate &&
                          ` • Completed ${new Date(enrollment.completionDate).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        ENROLLMENT_STATUS_COLORS[enrollment.status] || "outline"
                      }
                    >
                      {enrollment.status === "active" && (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {enrollment.status === "completed" && (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      )}
                      {enrollment.status.replace("_", " ").charAt(0).toUpperCase() +
                        enrollment.status.slice(1)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleDeleteClick(enrollment.id, enrollment.serviceTrack)
                      }
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {enrollment.completedAssignments} / {enrollment.totalAssignments}{" "}
                      assignments ({enrollment.progressPercentage}%)
                    </span>
                  </div>
                  <Progress value={enrollment.progressPercentage} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Curriculum Enrollment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the{" "}
              <strong>
                {enrollmentToDelete &&
                  SERVICE_TRACK_LABELS[enrollmentToDelete.serviceTrack]}
              </strong>{" "}
              curriculum? This will permanently delete all associated assignments
              and progress. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Removing..." : "Remove Curriculum"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

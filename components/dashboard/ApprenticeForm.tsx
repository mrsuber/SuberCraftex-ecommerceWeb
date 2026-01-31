"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";

interface User {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  role: string;
}

interface Mentor {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface ApprenticeFormProps {
  apprentice?: {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    photoUrl: string | null;
    department: string;
    mentorId: string;
    mentorType: string;
    startDate: string;
    expectedEndDate: string | null;
    status: string;
    emergencyContactName: string | null;
    emergencyContactPhone: string | null;
    notes: string | null;
  };
  users?: User[];
  mentors?: Mentor[];
}

export function ApprenticeForm({ apprentice, users = [], mentors = [] }: ApprenticeFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [formData, setFormData] = useState({
    userId: apprentice?.userId || "",
    fullName: apprentice?.fullName || "",
    email: apprentice?.email || "",
    phone: apprentice?.phone || "",
    photoUrl: apprentice?.photoUrl || "",
    department: apprentice?.department || "operations",
    mentorId: apprentice?.mentorId || "",
    mentorType: apprentice?.mentorType || "admin",
    startDate: apprentice?.startDate
      ? new Date(apprentice.startDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    expectedEndDate: apprentice?.expectedEndDate
      ? new Date(apprentice.expectedEndDate).toISOString().split("T")[0]
      : "",
    status: apprentice?.status || "pending",
    emergencyContactName: apprentice?.emergencyContactName || "",
    emergencyContactPhone: apprentice?.emergencyContactPhone || "",
    notes: apprentice?.notes || "",
  });

  // Auto-fill user details when user is selected
  useEffect(() => {
    if (formData.userId && !apprentice) {
      const selectedUser = users.find((u) => u.id === formData.userId);
      if (selectedUser) {
        setFormData((prev) => ({
          ...prev,
          fullName: selectedUser.fullName || prev.fullName,
          email: selectedUser.email || prev.email,
          phone: selectedUser.phone || prev.phone,
        }));
      }
    }
  }, [formData.userId, users, apprentice]);

  // Update mentor type when mentor is selected
  useEffect(() => {
    if (formData.mentorId) {
      const selectedMentor = mentors.find((m) => m.id === formData.mentorId);
      if (selectedMentor) {
        setFormData((prev) => ({
          ...prev,
          mentorType: selectedMentor.role,
        }));
      }
    }
  }, [formData.mentorId, mentors]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("type", "apprentice-photo");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error("Failed to upload photo");
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, photoUrl: data.url }));
      toast.success("Photo uploaded successfully");
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Failed to upload photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = apprentice
        ? `/api/apprentices/${apprentice.id}`
        : "/api/apprentices";
      const method = apprentice ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save apprentice");
      }

      toast.success(
        apprentice ? "Apprentice updated successfully" : "Apprentice created successfully"
      );
      router.push("/dashboard/apprentices");
      router.refresh();
    } catch (error) {
      console.error("Error saving apprentice:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save apprentice");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!apprentice && (
              <div className="space-y-2">
                <Label htmlFor="userId">Select User *</Label>
                <Select
                  value={formData.userId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, userId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.fullName || user.email} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={formData.photoUrl || undefined} />
                <AvatarFallback>
                  {formData.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "AP"}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="photo" className="cursor-pointer">
                  <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                    {isUploadingPhoto ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    {formData.photoUrl ? "Change Photo" : "Upload Photo"}
                  </div>
                </Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={isUploadingPhoto}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Program Details */}
        <Card>
          <CardHeader>
            <CardTitle>Program Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, department: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tailoring">Tailoring</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mentorId">Mentor *</Label>
              <Select
                value={formData.mentorId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, mentorId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mentor" />
                </SelectTrigger>
                <SelectContent>
                  {mentors.map((mentor) => (
                    <SelectItem key={mentor.id} value={mentor.id}>
                      {mentor.fullName} ({mentor.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedEndDate">Expected End Date</Label>
              <Input
                id="expectedEndDate"
                type="date"
                value={formData.expectedEndDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, expectedEndDate: e.target.value }))
                }
              />
            </div>

            {apprentice && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">Contact Name</Label>
              <Input
                id="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    emergencyContactName: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
              <Input
                id="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    emergencyContactPhone: e.target.value,
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                rows={4}
                placeholder="Any additional notes about the apprentice..."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {apprentice ? "Update Apprentice" : "Create Apprentice"}
        </Button>
      </div>
    </form>
  );
}

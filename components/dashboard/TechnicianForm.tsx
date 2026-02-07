"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";

interface User {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  role: string;
}

interface TechnicianFormProps {
  technician?: {
    id: string;
    userId: string;
    fullName: string;
    phone: string | null;
    photoUrl: string | null;
    specializations: string[];
    certifications: string[];
    isActive: boolean;
    hireDate: string;
  };
  users?: User[];
}

const SPECIALIZATIONS = [
  { value: "phones", label: "Phones" },
  { value: "tablets", label: "Tablets" },
  { value: "laptops", label: "Laptops" },
  { value: "desktops", label: "Desktops" },
  { value: "tvs", label: "TVs" },
  { value: "gaming_consoles", label: "Gaming Consoles" },
  { value: "audio_equipment", label: "Audio Equipment" },
  { value: "other", label: "Other Electronics" },
];

export function TechnicianForm({ technician, users = [] }: TechnicianFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [certificationInput, setCertificationInput] = useState("");

  const [formData, setFormData] = useState({
    userId: technician?.userId || "",
    fullName: technician?.fullName || "",
    phone: technician?.phone || "",
    photoUrl: technician?.photoUrl || "",
    specializations: technician?.specializations || [],
    certifications: technician?.certifications || [],
    isActive: technician?.isActive ?? true,
    hireDate: technician?.hireDate
      ? new Date(technician.hireDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  });

  // Auto-fill user details when user is selected
  useEffect(() => {
    if (formData.userId && !technician) {
      const selectedUser = users.find((u) => u.id === formData.userId);
      if (selectedUser) {
        setFormData((prev) => ({
          ...prev,
          fullName: selectedUser.fullName || prev.fullName,
          phone: selectedUser.phone || prev.phone,
        }));
      }
    }
  }, [formData.userId, users, technician]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("type", "technician-photo");

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

  const toggleSpecialization = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(value)
        ? prev.specializations.filter((s) => s !== value)
        : [...prev.specializations, value],
    }));
  };

  const addCertification = () => {
    if (certificationInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, certificationInput.trim()],
      }));
      setCertificationInput("");
    }
  };

  const removeCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.specializations.length === 0) {
        throw new Error("Please select at least one specialization");
      }

      const url = technician
        ? `/api/technicians/${technician.id}`
        : "/api/technicians";
      const method = technician ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save technician");
      }

      toast.success(
        technician ? "Technician updated successfully" : "Technician created successfully"
      );
      router.push("/dashboard/technicians");
      router.refresh();
    } catch (error) {
      console.error("Error saving technician:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save technician");
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
            {!technician && (
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
                    .toUpperCase() || "TN"}
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
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hireDate">Hire Date *</Label>
              <Input
                id="hireDate"
                type="date"
                value={formData.hireDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, hireDate: e.target.value }))
                }
                required
              />
            </div>

            {technician && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isActive: checked as boolean }))
                  }
                />
                <Label htmlFor="isActive">Active Technician</Label>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Specializations */}
        <Card>
          <CardHeader>
            <CardTitle>Specializations *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {SPECIALIZATIONS.map((spec) => (
                <div key={spec.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={spec.value}
                    checked={formData.specializations.includes(spec.value)}
                    onCheckedChange={() => toggleSpecialization(spec.value)}
                  />
                  <Label htmlFor={spec.value} className="text-sm cursor-pointer">
                    {spec.label}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a certification (e.g., Apple Certified Technician)"
                value={certificationInput}
                onChange={(e) => setCertificationInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCertification();
                  }
                }}
              />
              <Button type="button" onClick={addCertification} variant="secondary">
                Add
              </Button>
            </div>
            {formData.certifications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                  >
                    {cert}
                    <button
                      type="button"
                      onClick={() => removeCertification(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
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
          {technician ? "Update Technician" : "Create Technician"}
        </Button>
      </div>
    </form>
  );
}

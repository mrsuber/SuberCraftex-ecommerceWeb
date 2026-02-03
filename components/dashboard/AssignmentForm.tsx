"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, X, Image as ImageIcon, BookOpen, Clock, BarChart3 } from "lucide-react";

interface AssignmentTemplate {
  id: string;
  assignmentNumber: number;
  title: string;
  description: string;
  difficulty: string;
  estimatedHours: number;
  category: string;
  subcategory: string | null;
  skills: string[];
}

interface TemplatesResponse {
  templates: AssignmentTemplate[];
  grouped: Record<string, Record<string, AssignmentTemplate[]>>;
}

interface AssignmentFormProps {
  apprenticeId: string;
  assignment?: {
    id: string;
    title: string;
    description: string;
    instructions: string | null;
    dueDate: string | null;
    assignmentPhotos: string[];
  };
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-orange-100 text-orange-800",
  expert: "bg-red-100 text-red-800",
};

export function AssignmentForm({ apprenticeId, assignment }: AssignmentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [templates, setTemplates] = useState<AssignmentTemplate[]>([]);
  const [groupedTemplates, setGroupedTemplates] = useState<Record<string, Record<string, AssignmentTemplate[]>>>({});
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<AssignmentTemplate | null>(null);

  const [formData, setFormData] = useState({
    title: assignment?.title || "",
    description: assignment?.description || "",
    instructions: assignment?.instructions || "",
    dueDate: assignment?.dueDate
      ? new Date(assignment.dueDate).toISOString().split("T")[0]
      : "",
    assignmentPhotos: assignment?.assignmentPhotos || [],
  });

  // Fetch curriculum templates
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoadingTemplates(true);
      try {
        const response = await fetch("/api/assignment-templates");
        if (response.ok) {
          const data: TemplatesResponse = await response.json();
          setTemplates(data.templates);
          setGroupedTemplates(data.grouped);
        }
      } catch (error) {
        console.error("Failed to fetch templates:", error);
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    // Only fetch templates for new assignments
    if (!assignment) {
      fetchTemplates();
    }
  }, [assignment]);

  const handleTemplateSelect = (template: AssignmentTemplate) => {
    setSelectedTemplate(template);
    setFormData((prev) => ({
      ...prev,
      title: template.title,
      description: template.description,
      instructions: `Skills to develop: ${template.skills.join(", ")}\n\nEstimated time: ${template.estimatedHours} hours\nDifficulty: ${template.difficulty}`,
    }));
    toast.success(`Template "${template.title}" applied`);
  };

  const clearTemplate = () => {
    setSelectedTemplate(null);
    setSelectedLevel("");
    setSelectedModule("");
    setFormData({
      title: "",
      description: "",
      instructions: "",
      dueDate: "",
      assignmentPhotos: [],
    });
  };

  const availableLevels = Object.keys(groupedTemplates);
  const availableModules = selectedLevel ? Object.keys(groupedTemplates[selectedLevel] || {}) : [];
  const availableAssignments = selectedLevel && selectedModule
    ? groupedTemplates[selectedLevel]?.[selectedModule] || []
    : [];

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhoto(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("type", "assignment");
        formDataUpload.append("apprenticeId", apprenticeId);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (!response.ok) {
          throw new Error("Failed to upload photo");
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      setFormData((prev) => ({
        ...prev,
        assignmentPhotos: [...prev.assignmentPhotos, ...uploadedUrls],
      }));
      toast.success(`${uploadedUrls.length} photo(s) uploaded successfully`);
    } catch (error) {
      console.error("Error uploading photos:", error);
      toast.error("Failed to upload photos");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      assignmentPhotos: prev.assignmentPhotos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = assignment
        ? `/api/apprentices/${apprenticeId}/assignments/${assignment.id}`
        : `/api/apprentices/${apprenticeId}/assignments`;
      const method = assignment ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          dueDate: formData.dueDate || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save assignment");
      }

      toast.success(
        assignment ? "Assignment updated successfully" : "Assignment created successfully"
      );
      router.push(`/dashboard/apprentices/${apprenticeId}/assignments`);
      router.refresh();
    } catch (error) {
      console.error("Error saving assignment:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save assignment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Template Selection - Only show for new assignments */}
      {!assignment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Curriculum Templates
            </CardTitle>
            <CardDescription>
              Select a predefined assignment from the tailoring curriculum or create a custom assignment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingTemplates ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading curriculum...</span>
              </div>
            ) : templates.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Level Selection */}
                  <div className="space-y-2">
                    <Label>Level</Label>
                    <Select
                      value={selectedLevel}
                      onValueChange={(value) => {
                        setSelectedLevel(value);
                        setSelectedModule("");
                        setSelectedTemplate(null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Module Selection */}
                  <div className="space-y-2">
                    <Label>Module</Label>
                    <Select
                      value={selectedModule}
                      onValueChange={(value) => {
                        setSelectedModule(value);
                        setSelectedTemplate(null);
                      }}
                      disabled={!selectedLevel}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={selectedLevel ? "Select module" : "Select level first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModules.map((module) => (
                          <SelectItem key={module} value={module}>
                            {module}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Clear Selection */}
                  <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={clearTemplate}
                      disabled={!selectedLevel && !selectedTemplate}
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>

                {/* Available Assignments from Selected Module */}
                {availableAssignments.length > 0 && (
                  <div className="space-y-2">
                    <Label>Available Assignments</Label>
                    <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto border rounded-lg p-2">
                      {availableAssignments.map((template) => (
                        <div
                          key={template.id}
                          onClick={() => handleTemplateSelect(template)}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedTemplate?.id === template.id
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary/50 hover:bg-accent"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {template.assignmentNumber}. {template.title}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                {template.description}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <Badge className={DIFFICULTY_COLORS[template.difficulty] || "bg-gray-100"}>
                                {template.difficulty}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {template.estimatedHours}h
                              </span>
                            </div>
                          </div>
                          {template.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {template.skills.slice(0, 3).map((skill, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {template.skills.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{template.skills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Template Info */}
                {selectedTemplate && (
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      <span className="font-medium">Template Applied</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The form below has been filled with &quot;{selectedTemplate.title}&quot;. You can modify the details as needed.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No curriculum templates available. You can create a custom assignment below.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g., Hem a pair of trousers"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Describe what needs to be done..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, instructions: e.target.value }))
              }
              placeholder="Step-by-step instructions (optional)..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reference Photos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload photos showing what the assignment should look like or reference materials.
          </p>

          {/* Photo Grid */}
          {formData.assignmentPhotos.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {formData.assignmentPhotos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Reference ${index + 1}`}
                    className="rounded-lg object-cover aspect-square w-full"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          <div>
            <Label htmlFor="photos" className="cursor-pointer">
              <div className="flex items-center justify-center gap-2 p-8 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
                {isUploadingPhoto ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload photos
                    </span>
                  </>
                )}
              </div>
            </Label>
            <Input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoUpload}
              disabled={isUploadingPhoto}
            />
          </div>
        </CardContent>
      </Card>

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
          {assignment ? "Update Assignment" : "Create Assignment"}
        </Button>
      </div>
    </form>
  );
}

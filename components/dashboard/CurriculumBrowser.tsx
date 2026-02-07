"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  BookOpen,
  Clock,
  GraduationCap,
  Loader2,
  CheckCircle,
  Search,
  ChevronRight,
  Send,
  Calendar,
} from "lucide-react";

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
  summary: {
    total: number;
    byLevel: Record<string, number>;
  };
}

interface CurriculumBrowserProps {
  apprenticeId: string;
  apprenticeName: string;
  serviceTrack?: string;
  onAssignmentCreated?: () => void;
}

const SERVICE_TRACK_LABELS: Record<string, string> = {
  tailoring: "Tailoring",
  device_repair: "Device Repair",
  sales: "Sales",
  delivery: "Delivery",
  operations: "Operations",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-800 border-green-200",
  intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  advanced: "bg-orange-100 text-orange-800 border-orange-200",
  expert: "bg-red-100 text-red-800 border-red-200",
};

const LEVEL_COLORS: Record<string, string> = {
  "Level 1": "from-green-500 to-green-600",
  "Level 2": "from-blue-500 to-blue-600",
  "Level 3": "from-yellow-500 to-yellow-600",
  "Level 4": "from-orange-500 to-orange-600",
  "Level 5": "from-red-500 to-red-600",
};

export function CurriculumBrowser({
  apprenticeId,
  apprenticeName,
  serviceTrack = "tailoring",
  onAssignmentCreated,
}: CurriculumBrowserProps) {
  const curriculumTitle = SERVICE_TRACK_LABELS[serviceTrack] || "Training";
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [templates, setTemplates] = useState<AssignmentTemplate[]>([]);
  const [groupedTemplates, setGroupedTemplates] = useState<Record<string, Record<string, AssignmentTemplate[]>>>({});
  const [summary, setSummary] = useState<{ total: number; byLevel: Record<string, number> } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<AssignmentTemplate | null>(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [expandedLevels, setExpandedLevels] = useState<string[]>([]);

  useEffect(() => {
    fetchTemplates();
  }, [serviceTrack]);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const url = serviceTrack
        ? `/api/assignment-templates?serviceTrack=${serviceTrack}`
        : "/api/assignment-templates";
      const response = await fetch(url);
      if (response.ok) {
        const data: TemplatesResponse = await response.json();
        setTemplates(data.templates);
        setGroupedTemplates(data.grouped);
        setSummary(data.summary);
      } else {
        toast.error("Failed to load curriculum templates");
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Failed to load curriculum templates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignTemplate = async () => {
    if (!selectedTemplate) return;

    setIsAssigning(true);
    try {
      const instructions = [
        `Skills to develop: ${selectedTemplate.skills.join(", ")}`,
        `Estimated time: ${selectedTemplate.estimatedHours} hours`,
        `Difficulty: ${selectedTemplate.difficulty}`,
        additionalInstructions ? `\nAdditional Instructions:\n${additionalInstructions}` : "",
      ].filter(Boolean).join("\n");

      const response = await fetch(`/api/apprentices/${apprenticeId}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedTemplate.title,
          description: selectedTemplate.description,
          instructions,
          dueDate: dueDate || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create assignment");
      }

      toast.success(`Assignment "${selectedTemplate.title}" assigned to ${apprenticeName}`);
      setShowAssignDialog(false);
      setSelectedTemplate(null);
      setDueDate("");
      setAdditionalInstructions("");
      router.refresh();
      onAssignmentCreated?.();
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create assignment");
    } finally {
      setIsAssigning(false);
    }
  };

  const toggleLevel = (level: string) => {
    setExpandedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const filteredGrouped = searchQuery
    ? Object.entries(groupedTemplates).reduce((acc, [level, modules]) => {
        const filteredModules = Object.entries(modules).reduce((modAcc, [module, assignments]) => {
          const filtered = assignments.filter(
            (t) =>
              t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
          );
          if (filtered.length > 0) {
            modAcc[module] = filtered;
          }
          return modAcc;
        }, {} as Record<string, AssignmentTemplate[]>);
        if (Object.keys(filteredModules).length > 0) {
          acc[level] = filteredModules;
        }
        return acc;
      }, {} as Record<string, Record<string, AssignmentTemplate[]>>)
    : groupedTemplates;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading curriculum...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (templates.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Curriculum Templates</h3>
            <p className="text-muted-foreground max-w-md">
              No curriculum templates have been created yet. Contact an administrator to set up the {curriculumTitle.toLowerCase()} curriculum.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                {curriculumTitle} Curriculum
              </CardTitle>
              <CardDescription>
                Select an assignment from the curriculum to assign to {apprenticeName}
              </CardDescription>
            </div>
            {summary && (
              <Badge variant="outline" className="text-sm">
                {summary.total} assignments available
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, description, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Level Summary */}
          {summary && !searchQuery && (
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(summary.byLevel).map(([level, count]) => (
                <div
                  key={level}
                  className={`p-3 rounded-lg bg-gradient-to-br ${LEVEL_COLORS[`Level ${level.replace("level", "")}`] || "from-gray-500 to-gray-600"} text-white text-center`}
                >
                  <p className="text-xs opacity-90">Level {level.replace("level", "")}</p>
                  <p className="text-lg font-bold">{count}</p>
                </div>
              ))}
            </div>
          )}

          {/* Curriculum Browser */}
          <div className="max-h-[500px] overflow-y-auto pr-2">
            {Object.keys(filteredGrouped).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No templates match your search</p>
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(filteredGrouped).map(([level, modules]) => (
                  <div key={level} className="border rounded-lg">
                    <button
                      onClick={() => toggleLevel(level)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent transition-colors rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${LEVEL_COLORS[level] || "from-gray-500 to-gray-600"}`} />
                        <span className="font-semibold">{level}</span>
                        <Badge variant="secondary" className="ml-2">
                          {Object.values(modules).flat().length} assignments
                        </Badge>
                      </div>
                      <ChevronRight
                        className={`h-5 w-5 transition-transform ${
                          expandedLevels.includes(level) ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {expandedLevels.includes(level) && (
                      <div className="px-4 pb-4 space-y-4">
                        {Object.entries(modules).map(([module, assignments]) => (
                          <div key={module} className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                              <ChevronRight className="h-4 w-4" />
                              {module}
                            </h4>
                            <div className="grid gap-2 ml-6">
                              {assignments.map((template) => (
                                <div
                                  key={template.id}
                                  onClick={() => {
                                    setSelectedTemplate(template);
                                    setShowAssignDialog(true);
                                  }}
                                  className="p-3 border rounded-lg cursor-pointer hover:border-primary hover:bg-accent transition-all group"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs text-muted-foreground font-mono">
                                          #{template.assignmentNumber}
                                        </span>
                                        <h5 className="font-medium text-sm truncate">
                                          {template.title}
                                        </h5>
                                      </div>
                                      <p className="text-xs text-muted-foreground line-clamp-2">
                                        {template.description}
                                      </p>
                                      {template.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                          {template.skills.slice(0, 3).map((skill, idx) => (
                                            <Badge key={idx} variant="outline" className="text-xs py-0">
                                              {skill}
                                            </Badge>
                                          ))}
                                          {template.skills.length > 3 && (
                                            <Badge variant="outline" className="text-xs py-0">
                                              +{template.skills.length - 3}
                                            </Badge>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                      <Badge className={`${DIFFICULTY_COLORS[template.difficulty]} text-xs`}>
                                        {template.difficulty}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {template.estimatedHours}h
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity h-7 text-xs"
                                      >
                                        <Send className="h-3 w-3 mr-1" />
                                        Assign
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Assign Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign Task to {apprenticeName}</DialogTitle>
            <DialogDescription>
              Review the assignment details and set a due date
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4">
              {/* Template Preview */}
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{selectedTemplate.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Assignment #{selectedTemplate.assignmentNumber}
                    </p>
                  </div>
                  <Badge className={DIFFICULTY_COLORS[selectedTemplate.difficulty]}>
                    {selectedTemplate.difficulty}
                  </Badge>
                </div>
                <p className="text-sm">{selectedTemplate.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedTemplate.estimatedHours} hours
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {selectedTemplate.category}
                  </span>
                </div>
                {selectedTemplate.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedTemplate.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Due Date (Optional)
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Additional Instructions */}
              <div className="space-y-2">
                <Label htmlFor="instructions">Additional Instructions (Optional)</Label>
                <Textarea
                  id="instructions"
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  placeholder="Add any specific instructions or notes for this apprentice..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAssignDialog(false)}
              disabled={isAssigning}
            >
              Cancel
            </Button>
            <Button onClick={handleAssignTemplate} disabled={isAssigning}>
              {isAssigning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Assign Task
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, X, Plus } from "lucide-react";

interface CertificateFormProps {
  apprenticeId: string;
  apprenticeName: string;
}

export function CertificateForm({ apprenticeId, apprenticeName }: CertificateFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: [] as string[],
  });

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/apprentices/${apprenticeId}/certificates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to issue certificate");
      }

      toast.success("Certificate issued successfully");
      router.push(`/dashboard/apprentices/${apprenticeId}/certificates`);
      router.refresh();
    } catch (error) {
      console.error("Error issuing certificate:", error);
      toast.error(error instanceof Error ? error.message : "Failed to issue certificate");
    } finally {
      setIsLoading(false);
    }
  };

  // Suggested skills based on common training areas
  const suggestedSkills = [
    "Basic Sewing",
    "Pattern Making",
    "Fabric Selection",
    "Machine Operation",
    "Hand Stitching",
    "Alterations",
    "Customer Service",
    "Quality Control",
    "Time Management",
    "Inventory Management",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Issue Certificate for {apprenticeName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Certificate Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g., Certificate of Completion - Basic Tailoring"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Describe what this certificate recognizes..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Skills Acquired</Label>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a skill and press Enter"
              />
              <Button type="button" variant="outline" onClick={addSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Selected Skills */}
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Suggested Skills */}
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Suggested skills:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedSkills
                  .filter((skill) => !formData.skills.includes(skill))
                  .map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          skills: [...prev.skills, skill],
                        }))
                      }
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {skill}
                    </Badge>
                  ))}
              </div>
            </div>
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
          Issue Certificate
        </Button>
      </div>
    </form>
  );
}

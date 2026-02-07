"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, UserPlus, FileText, Wrench, CheckCircle } from "lucide-react";

interface Technician {
  id: string;
  fullName: string;
  employeeId: string | null;
  specializations: string[];
}

interface Apprentice {
  id: string;
  fullName: string;
  apprenticeNumber: string;
}

interface RepairWorkflowProps {
  repairId: string;
  currentStatus: string;
  technicians: Technician[];
  apprentices: Apprentice[];
  assignedTechnicianId: string | null;
  totalQuote: number | null;
}

export function RepairWorkflow({
  repairId,
  currentStatus,
  technicians,
  apprentices,
  assignedTechnicianId,
  totalQuote,
}: RepairWorkflowProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);

  // Assignment form
  const [assignForm, setAssignForm] = useState({
    technicianId: assignedTechnicianId || "",
    apprenticeId: "",
    isSupervisedWork: false,
  });

  // Receive form
  const [receiveForm, setReceiveForm] = useState({
    deviceConditionOnIntake: "",
    notes: "",
  });

  // Diagnosis form
  const [diagnoseForm, setDiagnoseForm] = useState({
    diagnosis: "",
  });

  // Quote form
  const [quoteForm, setQuoteForm] = useState({
    estimatedPartsCost: 0,
    estimatedLaborCost: 0,
    diagnosticFee: 0,
    warrantyDays: 30,
    validDays: 7,
    notes: "",
  });

  // Complete form
  const [completeForm, setCompleteForm] = useState({
    repairNotes: "",
  });

  const handleAssign = async () => {
    if (!assignForm.technicianId) {
      toast.error("Please select a technician");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/repair-requests/${repairId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assignForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to assign repair");
      }

      toast.success("Technician assigned successfully");
      setDialogOpen(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to assign");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReceive = async () => {
    if (!receiveForm.deviceConditionOnIntake) {
      toast.error("Please describe the device condition");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/repair-requests/${repairId}/receive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(receiveForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to receive device");
      }

      toast.success("Device received successfully");
      setDialogOpen(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to receive");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiagnose = async () => {
    if (!diagnoseForm.diagnosis) {
      toast.error("Please enter the diagnosis");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/repair-requests/${repairId}/diagnose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(diagnoseForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit diagnosis");
      }

      toast.success("Diagnosis submitted successfully");
      setDialogOpen(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to diagnose");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateQuote = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/repair-requests/${repairId}/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quoteForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create quote");
      }

      toast.success("Quote created and sent to customer");
      setDialogOpen(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create quote");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartRepair = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/repair-requests/${repairId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "in_repair" }),
      });

      if (!response.ok) {
        throw new Error("Failed to start repair");
      }

      toast.success("Repair started");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to start");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/repair-requests/${repairId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completeForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to complete repair");
      }

      toast.success("Repair marked as complete");
      setDialogOpen(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to complete");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickup = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/repair-requests/${repairId}/pickup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to mark pickup");
      }

      toast.success("Device picked up by customer");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to mark pickup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Current Status:</span>
          <Badge>{currentStatus.replace(/_/g, " ")}</Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Assign Technician */}
          <Dialog open={dialogOpen === "assign"} onOpenChange={(open) => setDialogOpen(open ? "assign" : null)}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                {assignedTechnicianId ? "Reassign" : "Assign"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Technician</DialogTitle>
                <DialogDescription>
                  Select a technician to work on this repair.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Technician *</Label>
                  <Select
                    value={assignForm.technicianId}
                    onValueChange={(value) =>
                      setAssignForm((prev) => ({ ...prev, technicianId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent>
                      {technicians.map((tech) => (
                        <SelectItem key={tech.id} value={tech.id}>
                          {tech.fullName} ({tech.specializations.join(", ")})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {apprentices.length > 0 && (
                  <div className="space-y-2">
                    <Label>Apprentice (Optional)</Label>
                    <Select
                      value={assignForm.apprenticeId}
                      onValueChange={(value) =>
                        setAssignForm((prev) => ({
                          ...prev,
                          apprenticeId: value,
                          isSupervisedWork: !!value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select apprentice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {apprentices.map((app) => (
                          <SelectItem key={app.id} value={app.id}>
                            {app.fullName} ({app.apprenticeNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={handleAssign} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Assign
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Receive Device */}
          {currentStatus === "pending" && (
            <Dialog open={dialogOpen === "receive"} onOpenChange={(open) => setDialogOpen(open ? "receive" : null)}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Receive Device
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Receive Device</DialogTitle>
                  <DialogDescription>
                    Document the device condition when received.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Device Condition *</Label>
                    <Textarea
                      value={receiveForm.deviceConditionOnIntake}
                      onChange={(e) =>
                        setReceiveForm((prev) => ({
                          ...prev,
                          deviceConditionOnIntake: e.target.value,
                        }))
                      }
                      placeholder="Describe the device condition..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input
                      value={receiveForm.notes}
                      onChange={(e) =>
                        setReceiveForm((prev) => ({ ...prev, notes: e.target.value }))
                      }
                      placeholder="Any additional notes"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleReceive} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Receive
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Submit Diagnosis */}
          {["received", "diagnosing"].includes(currentStatus) && (
            <Dialog open={dialogOpen === "diagnose"} onOpenChange={(open) => setDialogOpen(open ? "diagnose" : null)}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Submit Diagnosis
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Diagnosis</DialogTitle>
                  <DialogDescription>
                    Describe the diagnosis findings.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Diagnosis *</Label>
                    <Textarea
                      value={diagnoseForm.diagnosis}
                      onChange={(e) =>
                        setDiagnoseForm((prev) => ({ ...prev, diagnosis: e.target.value }))
                      }
                      placeholder="Describe the issue and what needs to be fixed..."
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleDiagnose} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Create Quote */}
          {currentStatus === "diagnosed" && (
            <Dialog open={dialogOpen === "quote"} onOpenChange={(open) => setDialogOpen(open ? "quote" : null)}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Create Quote
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Quote</DialogTitle>
                  <DialogDescription>
                    Provide repair cost estimate for the customer.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Parts Cost ($)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={quoteForm.estimatedPartsCost}
                        onChange={(e) =>
                          setQuoteForm((prev) => ({
                            ...prev,
                            estimatedPartsCost: parseFloat(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Labor Cost ($)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={quoteForm.estimatedLaborCost}
                        onChange={(e) =>
                          setQuoteForm((prev) => ({
                            ...prev,
                            estimatedLaborCost: parseFloat(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Diagnostic Fee ($)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={quoteForm.diagnosticFee}
                        onChange={(e) =>
                          setQuoteForm((prev) => ({
                            ...prev,
                            diagnosticFee: parseFloat(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Warranty (days)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={quoteForm.warrantyDays}
                        onChange={(e) =>
                          setQuoteForm((prev) => ({
                            ...prev,
                            warrantyDays: parseInt(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex justify-between font-medium">
                      <span>Total Quote:</span>
                      <span>
                        $
                        {(
                          quoteForm.estimatedPartsCost +
                          quoteForm.estimatedLaborCost +
                          quoteForm.diagnosticFee
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateQuote} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Quote
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Start Repair */}
          {currentStatus === "quote_approved" && (
            <Button variant="outline" size="sm" onClick={handleStartRepair} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Wrench className="mr-2 h-4 w-4" />
              Start Repair
            </Button>
          )}

          {/* Complete Repair */}
          {["in_repair", "testing", "quote_approved"].includes(currentStatus) && (
            <Dialog open={dialogOpen === "complete"} onOpenChange={(open) => setDialogOpen(open ? "complete" : null)}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete Repair
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Complete Repair</DialogTitle>
                  <DialogDescription>
                    Mark this repair as complete and ready for pickup.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Repair Notes</Label>
                    <Textarea
                      value={completeForm.repairNotes}
                      onChange={(e) =>
                        setCompleteForm((prev) => ({ ...prev, repairNotes: e.target.value }))
                      }
                      placeholder="Summary of work performed..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleComplete} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Complete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Mark Picked Up */}
          {currentStatus === "ready_for_pickup" && (
            <Button variant="outline" size="sm" onClick={handlePickup} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mark Picked Up
            </Button>
          )}
        </div>

        {totalQuote && (
          <div className="text-sm">
            <span className="text-muted-foreground">Total Quote: </span>
            <span className="font-medium">${totalQuote.toFixed(2)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

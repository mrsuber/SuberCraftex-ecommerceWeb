"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DriverAssignmentProps {
  orderId: string;
  orderNumber: string;
  availableDrivers: Array<{
    id: string;
    fullName: string;
    rating: number | null;
    activeDeliveries: number;
  }>;
}

export function DriverAssignment({
  orderId,
  orderNumber,
  availableDrivers,
}: DriverAssignmentProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState("");

  const handleAssign = async () => {
    if (!selectedDriver) return;

    setLoading(true);
    try {
      const response = await fetch("/api/shipping/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          driverId: selectedDriver,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign driver");
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to assign driver");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Assign Driver
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Driver</DialogTitle>
          <DialogDescription>
            Assign a driver to order {orderNumber}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Driver</Label>
            <Select value={selectedDriver} onValueChange={setSelectedDriver}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a driver" />
              </SelectTrigger>
              <SelectContent>
                {availableDrivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.fullName} - {driver.activeDeliveries} active (
                    {driver.rating ? `${driver.rating.toFixed(1)}⭐` : "No rating"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!selectedDriver || loading}>
              {loading ? "Assigning..." : "Assign"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

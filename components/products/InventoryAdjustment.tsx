"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Package, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface InventoryAdjustmentProps {
  productId: string;
  productName: string;
  currentStock: number;
}

export function InventoryAdjustment({
  productId,
  productName,
  currentStock,
}: InventoryAdjustmentProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<"increase" | "decrease">("decrease");
  const [quantity, setQuantity] = useState("");
  const [action, setAction] = useState("adjustment");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!quantity || !reason) {
      toast.error("Please fill in all required fields");
      return;
    }

    const adjustmentAmount = adjustmentType === "increase"
      ? parseInt(quantity)
      : -parseInt(quantity);

    setLoading(true);

    try {
      const response = await fetch(`/api/products/${productId}/inventory`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adjustment: adjustmentAmount,
          reason,
          action,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to adjust inventory");
      }

      const result = await response.json();

      toast.success(
        `Inventory adjusted: ${result.previousInventory} → ${result.newInventory}`
      );

      setOpen(false);
      setQuantity("");
      setReason("");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to adjust inventory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Package className="h-4 w-4 mr-2" />
          Adjust Inventory
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust Inventory</DialogTitle>
          <DialogDescription>
            Manually adjust inventory for {productName}
            <br />
            <span className="text-sm font-medium">Current Stock: {currentStock} units</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Adjustment Type</Label>
            <Select
              value={adjustmentType}
              onValueChange={(value: "increase" | "decrease") => {
                setAdjustmentType(value);
                setAction("adjustment");
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="decrease">Decrease (Remove Stock)</SelectItem>
                <SelectItem value="increase">Increase (Add Stock)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">
              Quantity {adjustmentType === "decrease" ? "to Remove" : "to Add"} *
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={adjustmentType === "decrease" ? currentStock : undefined}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              required
            />
            {adjustmentType === "decrease" && (
              <p className="text-xs text-muted-foreground">
                New stock will be: {Math.max(0, currentStock - parseInt(quantity || "0"))}
              </p>
            )}
            {adjustmentType === "increase" && (
              <p className="text-xs text-muted-foreground">
                New stock will be: {currentStock + parseInt(quantity || "0")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="action">Reason Category *</Label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adjustment">Manual Adjustment</SelectItem>
                <SelectItem value="damaged">Damaged/Defective</SelectItem>
                <SelectItem value="returned">Returned Items</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Detailed Reason *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain the reason for this adjustment..."
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {adjustmentType === "decrease" ? "Remove Stock" : "Add Stock"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

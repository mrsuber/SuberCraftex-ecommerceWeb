"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { SignaturePad } from "@/components/orders/SignaturePad";
import { toast } from "sonner";
import { Package, Camera } from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
}

interface POItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  quantityReceived: number;
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  items: POItem[];
}

interface ReceiveGoodsFormProps {
  purchaseOrder: PurchaseOrder;
}

interface ReceiptItem {
  productId: string;
  quantityReceived: number;
  condition: "good" | "damaged" | "partial";
  notes: string;
}

export function ReceiveGoodsForm({ purchaseOrder }: ReceiveGoodsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [discrepancyNotes, setDiscrepancyNotes] = useState("");

  const [receiptItems, setReceiptItems] = useState<Record<string, ReceiptItem>>(
    purchaseOrder.items.reduce((acc, item) => {
      acc[item.productId] = {
        productId: item.productId,
        quantityReceived: Math.max(0, item.quantity - item.quantityReceived),
        condition: "good",
        notes: "",
      };
      return acc;
    }, {} as Record<string, ReceiptItem>)
  );

  const updateReceiptItem = (productId: string, field: keyof ReceiptItem, value: any) => {
    setReceiptItems((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleSaveSignature = (dataUrl: string) => {
    setSignatureDataUrl(dataUrl);
    setShowSignaturePad(false);
  };

  const handleSubmit = async () => {
    // Validate that at least one item has quantity received
    const itemsWithQuantity = Object.values(receiptItems).filter(
      (item) => item.quantityReceived > 0
    );

    if (itemsWithQuantity.length === 0) {
      toast.error("Please enter quantity received for at least one item");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/goods-receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchaseOrderId: purchaseOrder.id,
          items: itemsWithQuantity,
          discrepancyNotes: discrepancyNotes || undefined,
          signatureUrl: signatureDataUrl || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create goods receipt");
      }

      const result = await response.json();
      console.log("Goods receipt created:", result);

      toast.success("Goods received successfully! Inventory updated.");
      router.push(`/dashboard/purchase-orders/${purchaseOrder.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error creating goods receipt:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to receive goods";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Receive Items</CardTitle>
          <CardDescription>
            Enter the quantity received for each item
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {purchaseOrder.items.map((item) => {
              const remaining = item.quantity - item.quantityReceived;

              return (
                <div key={item.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">SKU: {item.product.sku}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Ordered: {item.quantity} | Already Received: {item.quantityReceived} | Remaining: {remaining}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`qty-${item.productId}`}>Quantity Received</Label>
                      <Input
                        id={`qty-${item.productId}`}
                        type="number"
                        min="0"
                        max={remaining}
                        value={receiptItems[item.productId]?.quantityReceived || 0}
                        onChange={(e) =>
                          updateReceiptItem(
                            item.productId,
                            "quantityReceived",
                            parseInt(e.target.value) || 0
                          )
                        }
                        disabled={remaining === 0}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`condition-${item.productId}`}>Condition</Label>
                      <Select
                        value={receiptItems[item.productId]?.condition}
                        onValueChange={(value) =>
                          updateReceiptItem(item.productId, "condition", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="damaged">Damaged</SelectItem>
                          <SelectItem value="partial">Partial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`notes-${item.productId}`}>Notes</Label>
                      <Input
                        id={`notes-${item.productId}`}
                        placeholder="Optional notes..."
                        value={receiptItems[item.productId]?.notes || ""}
                        onChange={(e) =>
                          updateReceiptItem(item.productId, "notes", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="discrepancy">Discrepancy Notes</Label>
            <Textarea
              id="discrepancy"
              placeholder="Note any discrepancies, damages, or issues..."
              value={discrepancyNotes}
              onChange={(e) => setDiscrepancyNotes(e.target.value)}
              rows={3}
            />
          </div>

          {signatureDataUrl ? (
            <div>
              <Label>Receiver Signature</Label>
              <div className="border rounded-lg p-4 bg-gray-50">
                <img
                  src={signatureDataUrl}
                  alt="Receiver signature"
                  className="max-w-full h-auto"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSignaturePad(true)}
                  className="mt-2"
                >
                  Retake Signature
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <Label>Receiver Signature (Optional)</Label>
              <Button
                variant="outline"
                onClick={() => setShowSignaturePad(true)}
                className="w-full mt-2"
              >
                <Package className="h-4 w-4 mr-2" />
                Add Signature
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {showSignaturePad && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <SignaturePad
              onSave={handleSaveSignature}
              onCancel={() => setShowSignaturePad(false)}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/purchase-orders/${purchaseOrder.id}`)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Complete Receipt"}
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Loader2, Plus, Trash2, Package } from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  paymentTerms: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  costPerItem: number | null;
  inventoryCount: number;
}

interface LineItem {
  id: string;
  productId: string;
  productName?: string; // For custom products not in catalog
  quantity: number;
  unitPrice: number;
  isCustom: boolean;
}

interface PurchaseOrderFormProps {
  suppliers: Supplier[];
  products: Product[];
}

export function PurchaseOrderForm({ suppliers, products }: PurchaseOrderFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("net_30");
  const [taxAmount, setTaxAmount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: Math.random().toString(), productId: "", quantity: 1, unitPrice: 0, isCustom: false },
  ]);

  // Update payment terms when supplier changes
  useEffect(() => {
    if (supplierId) {
      const supplier = suppliers.find((s) => s.id === supplierId);
      if (supplier) {
        setPaymentTerms(supplier.paymentTerms);
      }
    }
  }, [supplierId, suppliers]);

  // Calculate subtotal
  const subtotal = lineItems.reduce((sum, item) => {
    return sum + item.quantity * item.unitPrice;
  }, 0);

  // Calculate total
  const total = subtotal + taxAmount + shippingCost;

  const addLineItem = (isCustom = false) => {
    setLineItems([
      ...lineItems,
      { id: Math.random().toString(), productId: "", quantity: 1, unitPrice: 0, isCustom, productName: isCustom ? "" : undefined },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(
      lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleProductChange = (itemId: string, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setLineItems(
        lineItems.map((item) =>
          item.id === itemId
            ? {
                ...item,
                productId: productId,
                productName: product.name,
                unitPrice: product.costPerItem ?? product.price,
              }
            : item
        )
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate
      if (!supplierId) {
        throw new Error("Please select a supplier");
      }

      const validItems = lineItems.filter((item) => {
        if (item.isCustom) {
          return item.productName && item.productName.trim() && item.quantity > 0 && item.unitPrice > 0;
        }
        return item.productId && item.quantity > 0 && item.unitPrice > 0;
      });

      if (validItems.length === 0) {
        throw new Error("Please add at least one product");
      }

      // For custom products, create them first
      const itemsToSubmit = await Promise.all(
        validItems.map(async (item) => {
          if (item.isCustom && item.productName) {
            // Create a new product for this custom item
            const productResponse = await fetch("/api/products", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: item.productName,
                sku: `CUSTOM-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
                price: item.unitPrice,
                costPerItem: item.unitPrice,
                categoryId: null,
                description: "Product added via purchase order",
                trackInventory: true,
                inventoryCount: 0,
              }),
            });

            if (!productResponse.ok) {
              throw new Error(`Failed to create product: ${item.productName}`);
            }

            const { product } = await productResponse.json();
            return {
              productId: product.id,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            };
          }

          return {
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          };
        })
      );

      const response = await fetch("/api/purchase-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierId,
          expectedDeliveryDate: expectedDeliveryDate
            ? new Date(expectedDeliveryDate).toISOString()
            : undefined,
          paymentTerms,
          notes: notes || undefined,
          taxAmount,
          shippingCost,
          items: itemsToSubmit,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (Array.isArray(data.error)) {
          const errorMessages = data.error
            .map((err: any) => `${err.path.join(".")}: ${err.message}`)
            .join("\n");
          throw new Error(errorMessages);
        }
        throw new Error(
          typeof data.error === "string" ? data.error : JSON.stringify(data.error)
        );
      }

      router.push("/dashboard/purchase-orders");
      router.refresh();
    } catch (error) {
      console.error("Error creating purchase order:", error);
      alert(error instanceof Error ? error.message : "Failed to create purchase order");
    } finally {
      setIsLoading(false);
    }
  };

  if (suppliers.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">
            You need to add suppliers before creating purchase orders.
          </p>
          <Button asChild>
            <a href="/dashboard/suppliers/new">Add Supplier</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Supplier & Delivery Info */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier & Delivery Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplierId">
                Supplier <span className="text-red-500">*</span>
              </Label>
              <Select value={supplierId} onValueChange={setSupplierId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
              <Input
                id="expectedDeliveryDate"
                type="date"
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Select value={paymentTerms} onValueChange={setPaymentTerms}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="net_30">Net 30</SelectItem>
                <SelectItem value="net_60">Net 60</SelectItem>
                <SelectItem value="net_90">Net 90</SelectItem>
                <SelectItem value="cod">Cash on Delivery</SelectItem>
                <SelectItem value="prepaid">Prepaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Order Items</CardTitle>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => addLineItem(false)}>
                <Plus className="h-4 w-4 mr-2" />
                Add from Catalog
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => addLineItem(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {lineItems.map((item, index) => (
            <div key={item.id} className="flex gap-4 items-start">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                {item.isCustom ? (
                  <div className="md:col-span-2 space-y-2">
                    <Label>
                      New Product Name {index === 0 && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      value={item.productName || ""}
                      onChange={(e) => updateLineItem(item.id, "productName", e.target.value)}
                      placeholder="Enter product name"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      This will create a new product in your catalog
                    </p>
                  </div>
                ) : (
                  <div className="md:col-span-2 space-y-2">
                    <Label>
                      Product {index === 0 && <span className="text-red-500">*</span>}
                    </Label>
                    <Select
                      value={item.productId}
                      onValueChange={(value) => handleProductChange(item.id, value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} ({product.sku}) - Stock: {product.inventoryCount}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateLineItem(item.id, "quantity", parseInt(e.target.value) || 1)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Unit Price ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateLineItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-8">
                <div className="text-sm font-medium">
                  ${(item.quantity * item.unitPrice).toFixed(2)}
                </div>
                {lineItems.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLineItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Costs & Totals */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Costs & Totals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxAmount">Tax Amount ($)</Label>
              <Input
                id="taxAmount"
                type="number"
                min="0"
                step="0.01"
                value={taxAmount}
                onChange={(e) => setTaxAmount(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shippingCost">Shipping Cost ($)</Label>
              <Input
                id="shippingCost"
                type="number"
                min="0"
                step="0.01"
                value={shippingCost}
                onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax:</span>
              <span className="font-medium">${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping:</span>
              <span className="font-medium">${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span className="text-blue-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes about this purchase order..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
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
          Create Purchase Order
        </Button>
      </div>
    </form>
  );
}

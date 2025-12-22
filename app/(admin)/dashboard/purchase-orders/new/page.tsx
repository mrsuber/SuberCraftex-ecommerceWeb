import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { PurchaseOrderForm } from "@/components/purchase-orders/PurchaseOrderForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewPurchaseOrderPage() {
  const user = await getSession();

  if (!user || user.role !== 'admin') {
    redirect("/login");
  }

  // Fetch suppliers and products for the form
  const [suppliersRaw, productsRaw] = await Promise.all([
    db.supplier.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        paymentTerms: true,
      },
    }),
    db.product.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        costPerItem: true,
        inventoryCount: true,
      },
    }),
  ]);

  // Convert Decimal to number for client component
  const suppliers = suppliersRaw;
  const products = productsRaw.map((product) => ({
    ...product,
    price: Number(product.price),
    costPerItem: product.costPerItem ? Number(product.costPerItem) : null,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/purchase-orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Purchase Order</h1>
          <p className="text-gray-600 mt-1">
            Order products from a supplier
          </p>
        </div>
      </div>

      <PurchaseOrderForm suppliers={suppliers} products={products} />
    </div>
  );
}

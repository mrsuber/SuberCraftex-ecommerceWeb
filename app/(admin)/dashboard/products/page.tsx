import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ProductsTable } from "@/components/dashboard/ProductsTable";
import { serializeProduct } from "@/lib/utils";
import type { Product } from "@/types";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Products - Admin Dashboard",
  description: "Manage your products",
};

export default async function ProductsPage() {
  const [rawProducts, count] = await Promise.all([
    db.product.findMany({
      include: {
        category: {
          select: { name: true },
        },
        investorAllocations: {
          select: {
            quantityRemaining: true,
            investor: { select: { fullName: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.product.count(),
  ]);

  // Serialize products to convert Decimal to number + add ownership info
  const products = (rawProducts || []).map((p) => {
    const investorAllocatedCount = p.investorAllocations.reduce(
      (sum, alloc) => sum + alloc.quantityRemaining, 0
    );
    const companyOwnedCount = Math.max(0, p.inventoryCount - investorAllocatedCount);
    return {
      ...serializeProduct(p),
      category: p.category,
      investor_allocated_count: investorAllocatedCount,
      company_owned_count: companyOwnedCount,
      unassigned_stock: companyOwnedCount > 0,
    };
  }) as (Product & { category?: { name: string }; investor_allocated_count: number; company_owned_count: number; unassigned_stock: boolean })[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory ({count || 0} total)
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Products Table */}
      <ProductsTable products={products} />
    </div>
  );
}

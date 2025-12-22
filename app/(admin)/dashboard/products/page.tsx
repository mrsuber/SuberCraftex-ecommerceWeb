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
      },
      orderBy: { createdAt: "desc" },
    }),
    db.product.count(),
  ]);

  // Serialize products to convert Decimal to number
  const products = (rawProducts || []).map((p) => ({
    ...serializeProduct(p),
    category: p.category,
  })) as (Product & { category?: { name: string } })[];

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

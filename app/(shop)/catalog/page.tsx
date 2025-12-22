import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Suspense } from "react";

export const metadata = {
  title: "Product Catalog - SuberCraftex",
  description: "Browse our premium collection of products",
};

export default function CatalogPage() {
  return (
    <main className="min-h-screen py-12">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Product Catalog</h1>
          <p className="text-muted-foreground">
            Discover our premium collection of products
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <Suspense fallback={<div>Loading filters...</div>}>
              <ProductFilters />
            </Suspense>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            <Suspense fallback={<div>Loading products...</div>}>
              <ProductGrid />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}

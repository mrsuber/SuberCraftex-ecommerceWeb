import { db } from "@/lib/db";
import { ProductForm } from "@/components/products/ProductForm";

export const metadata = {
  title: "Add Product - Admin Dashboard",
  description: "Create a new product",
};

export default async function NewProductPage() {
  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground">Create a new product in your inventory</p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}

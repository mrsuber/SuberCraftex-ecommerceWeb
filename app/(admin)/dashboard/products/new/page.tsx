import { db } from "@/lib/db";
import { ProductForm } from "@/components/products/ProductForm";

export const metadata = {
  title: "Add Product - Admin Dashboard",
  description: "Create a new product",
};

export default async function NewProductPage() {
  // Fetch parent categories with their children for hierarchical display
  const categories = await db.category.findMany({
    where: {
      isActive: true,
      parentId: null, // Only parent categories
    },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });

  // Transform to match the expected format
  const categoriesWithChildren = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    parentId: null,
    children: cat.children,
  }));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground">Create a new product in your inventory</p>
      </div>

      <ProductForm categories={categoriesWithChildren} />
    </div>
  );
}

import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CategoriesTable } from "@/components/categories/CategoriesTable";
import { CategoryForm } from "@/components/categories/CategoryForm";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Categories - Admin Dashboard",
  description: "Manage product categories",
};

export default async function CategoriesPage() {
  const [categories, count] = await Promise.all([
    db.category.findMany({
      include: {
        parent: {
          select: { name: true },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    }),
    db.category.count(),
  ]);

  // Serialize data
  const serializedCategories = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    parentId: cat.parentId,
    parentName: cat.parent?.name || null,
    imageUrl: cat.imageUrl,
    sortOrder: cat.sortOrder,
    isActive: cat.isActive,
    productCount: cat._count.products,
    createdAt: cat.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Manage product categories ({count} total)
          </p>
        </div>
        <CategoryForm>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </CategoryForm>
      </div>

      {/* Categories Table */}
      <CategoriesTable categories={serializedCategories} />
    </div>
  );
}

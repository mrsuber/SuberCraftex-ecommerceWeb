import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ProductForm } from "@/components/products/ProductForm";

export const metadata = {
  title: "Edit Product - Admin Dashboard",
  description: "Edit product details",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    // Fetch parent categories with their children for hierarchical display
    db.category.findMany({
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
    }),
  ]);

  // Transform categories to match the expected format
  const categoriesWithChildren = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    parentId: null,
    children: cat.children,
  }));

  if (!product) {
    redirect("/dashboard/products");
  }

  // Serialize product
  const serializedProduct = {
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    costPerItem: product.costPerItem ? Number(product.costPerItem) : null,
    weight: product.weight ? Number(product.weight) : null,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    publishedAt: product.publishedAt?.toISOString() || null,
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">Update product details</p>
      </div>

      <ProductForm categories={categoriesWithChildren} product={serializedProduct} />
    </div>
  );
}

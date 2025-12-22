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
    db.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    }),
  ]);

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

      <ProductForm categories={categories} product={serializedProduct} />
    </div>
  );
}

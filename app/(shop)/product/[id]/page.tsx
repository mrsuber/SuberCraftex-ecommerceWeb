import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductInfo } from "@/components/products/product-info";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductReviews } from "@/components/products/ProductReviews";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types";
import { Metadata } from "next";
import { serializeProduct } from "@/lib/utils";
import { getSession } from "@/lib/auth/session";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProduct(id: string) {
  const product = await db.product.findFirst({
    where: {
      id,
      isActive: true,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  // Fetch reviews
  const reviews = await db.review.findMany({
    where: {
      productId: id,
      isApproved: true,
    },
    include: {
      user: {
        select: {
          fullName: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate average rating
  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  // Fetch related products from same category
  const relatedProducts = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      id: { not: id }, // Exclude current product
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  // Serialize reviews
  const serializedReviews = reviews.map((review) => ({
    ...review,
    createdAt: review.createdAt.toISOString(),
    adminRespondedAt: review.adminRespondedAt?.toISOString() || null,
  }));

  return {
    product: serializeProduct(product) as Product,
    reviews: serializedReviews,
    avgRating: Number(avgRating.toFixed(1)),
    reviewCount: reviews?.length || 0,
    relatedProducts: relatedProducts.map(serializeProduct) as Product[],
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getProduct(id);

  if (!data) {
    return {
      title: "Product Not Found",
    };
  }

  const { product } = data;

  return {
    title: product.seo_title || `${product.name} | SuberCraftex`,
    description:
      product.seo_description ||
      product.short_description ||
      product.description ||
      undefined,
    openGraph: {
      title: product.name,
      description: product.short_description || undefined,
      images: product.featured_image
        ? [{ url: product.featured_image }]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const data = await getProduct(id);

  if (!data) {
    notFound();
  }

  const { product, reviews, avgRating, reviewCount, relatedProducts } = data;
  const user = await getSession();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb could go here */}

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Product Gallery */}
        <ProductGallery
          images={product.images || [product.featured_image || ""]}
          productName={product.name}
        />

        {/* Product Info */}
        <ProductInfo
          product={product}
          avgRating={avgRating}
          reviewCount={reviewCount}
        />
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({reviewCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="prose dark:prose-invert max-w-none p-6">
              {product.description ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: product.description.replace(/\n/g, "<br />"),
                  }}
                />
              ) : (
                <p className="text-muted-foreground">
                  No description available.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <dl className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <dt className="font-medium text-muted-foreground">SKU</dt>
                  <dd className="font-medium">{product.sku}</dd>
                </div>
                {product.vendor && (
                  <div className="flex justify-between border-b pb-2">
                    <dt className="font-medium text-muted-foreground">Brand</dt>
                    <dd className="font-medium">{product.vendor}</dd>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between border-b pb-2">
                    <dt className="font-medium text-muted-foreground">
                      Weight
                    </dt>
                    <dd className="font-medium">
                      {product.weight} {product.weight_unit}
                    </dd>
                  </div>
                )}
                {product.barcode && (
                  <div className="flex justify-between border-b pb-2">
                    <dt className="font-medium text-muted-foreground">
                      Barcode
                    </dt>
                    <dd className="font-medium">{product.barcode}</dd>
                  </div>
                )}
                <div className="flex justify-between border-b pb-2">
                  <dt className="font-medium text-muted-foreground">
                    Availability
                  </dt>
                  <dd className="font-medium">
                    {product.inventory_count > 0 ? "In Stock" : "Out of Stock"}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <ProductReviews
            productId={id}
            reviews={reviews as any[]}
            avgRating={avgRating}
            reviewCount={reviewCount}
            isLoggedIn={!!user}
          />
        </TabsContent>
      </Tabs>

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

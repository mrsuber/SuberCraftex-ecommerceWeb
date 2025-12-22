import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { ReviewForm } from "@/components/products/ReviewForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface ReviewPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ orderId?: string }>;
}

export default async function ReviewPage({ params, searchParams }: ReviewPageProps) {
  const user = await getSession();

  if (!user) {
    redirect("/login?redirect=/product/" + (await params).id + "/review");
  }

  const { id } = await params;
  const { orderId } = await searchParams;

  // Get product
  const product = await db.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      sku: true,
      featuredImage: true,
    },
  });

  if (!product) {
    redirect("/catalog");
  }

  // Check if user already reviewed this product
  const existingReview = await db.review.findFirst({
    where: {
      productId: id,
      userId: user.id,
    },
  });

  if (existingReview) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">You've Already Reviewed This Product</h1>
          <p className="text-muted-foreground">
            You can only submit one review per product.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild variant="outline">
              <Link href={`/product/${id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Product
              </Link>
            </Button>
            <Button asChild>
              <Link href="/account/orders">View My Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href={`/product/${id}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Product
        </Link>
      </Button>

      <div className="mb-6">
        <div className="flex items-center gap-4">
          {product.featuredImage && (
            <div className="w-20 h-20 relative rounded-lg overflow-hidden border">
              <img
                src={product.featuredImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
          </div>
        </div>
      </div>

      <ReviewForm
        productId={id}
        productName={product.name}
        orderId={orderId}
      />
    </div>
  );
}

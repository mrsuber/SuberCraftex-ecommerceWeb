import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { WishlistGrid } from "@/components/account/wishlist-grid";

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  const wishlistItems = await db.wishlist.findMany({
    where: { userId: user.id },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          compareAtPrice: true,
          featuredImage: true,
          inventoryCount: true,
          isActive: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Convert Decimal to string for client component
  const formattedItems = wishlistItems.map(item => ({
    ...item,
    product: {
      ...item.product,
      price: item.product.price.toString(),
      compareAtPrice: item.product.compareAtPrice?.toString() || null,
    },
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">
            Products you've saved for later
          </p>
        </div>

        <WishlistGrid initialItems={formattedItems} />
      </div>
    </div>
  );
}

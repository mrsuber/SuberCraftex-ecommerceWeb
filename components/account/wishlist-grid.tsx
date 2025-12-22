"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type WishlistProduct = {
  id: string;
  name: string;
  slug: string;
  price: string;
  compareAtPrice: string | null;
  featuredImage: string | null;
  inventoryCount: number;
  isActive: boolean;
};

type WishlistItem = {
  id: string;
  productId: string;
  createdAt: Date;
  product: WishlistProduct;
};

type WishlistGridProps = {
  initialItems: WishlistItem[];
};

export function WishlistGrid({ initialItems }: WishlistGridProps) {
  const [items, setItems] = useState<WishlistItem[]>(initialItems);
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const router = useRouter();

  const handleRemove = async (itemId: string) => {
    if (!confirm("Remove this item from your wishlist?")) return;

    setLoadingItems(prev => new Set(prev).add(itemId));

    try {
      const response = await fetch(`/api/wishlist/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      setItems(items.filter(item => item.id !== itemId));
      router.refresh();
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item. Please try again.");
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleAddToCart = async (productId: string, itemId: string) => {
    setLoadingItems(prev => new Set(prev).add(itemId));

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      alert("Item added to cart!");
      router.refresh();
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Items</CardTitle>
          <CardDescription>
            Keep track of products you're interested in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-4">
              Start adding products to your wishlist to save them for later
            </p>
            <Button asChild>
              <Link href="/catalog">Browse Products</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Items</CardTitle>
        <CardDescription>
          {items.length} {items.length === 1 ? "item" : "items"} in your wishlist
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const isLoading = loadingItems.has(item.id);
            const isOutOfStock = item.product.inventoryCount === 0;
            const hasDiscount = item.product.compareAtPrice &&
              parseFloat(item.product.compareAtPrice) > parseFloat(item.product.price);

            return (
              <div
                key={item.id}
                className="border-2 border-gray-300 rounded-lg overflow-hidden hover:border-primary transition-all group"
              >
                <Link href={`/product/${item.product.slug}`} className="block relative aspect-square bg-gray-100">
                  {item.product.featuredImage ? (
                    <Image
                      src={item.product.featuredImage}
                      alt={item.product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                  {hasDiscount && (
                    <Badge className="absolute top-2 right-2 bg-red-500">
                      Save{" "}
                      {Math.round(
                        ((parseFloat(item.product.compareAtPrice!) - parseFloat(item.product.price)) /
                          parseFloat(item.product.compareAtPrice!)) *
                          100
                      )}
                      %
                    </Badge>
                  )}
                  {isOutOfStock && (
                    <Badge className="absolute top-2 left-2 bg-gray-500">
                      Out of Stock
                    </Badge>
                  )}
                </Link>
                <div className="p-4">
                  <Link href={`/product/${item.product.slug}`}>
                    <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xl font-bold text-primary">
                      ${parseFloat(item.product.price).toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${parseFloat(item.product.compareAtPrice!).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleAddToCart(item.product.id, item.id)}
                      disabled={isLoading || isOutOfStock}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemove(item.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

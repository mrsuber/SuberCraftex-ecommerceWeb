"use client";

import { useState } from "react";
import { Star, Heart, Share2, ShoppingCart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import { Product } from "@/types";

interface ProductInfoProps {
  product: Product;
  avgRating?: number;
  reviewCount?: number;
}

export function ProductInfo({
  product,
  avgRating = 0,
  reviewCount = 0,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCartStore();

  const discount = product.compare_at_price
    ? Math.round(
        ((product.compare_at_price - product.price) /
          product.compare_at_price) *
          100
      )
    : 0;

  const inventoryStatus =
    product.inventory_count === 0
      ? "out-of-stock"
      : product.inventory_count <= product.low_stock_threshold
      ? "low-stock"
      : "in-stock";

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${quantity} ${quantity === 1 ? "item" : "items"} added to cart`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted ? "Removed from wishlist" : "Added to wishlist"
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.short_description || "",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="space-y-6">
      {/* Category & SKU */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{product.sku}</span>
        <span>•</span>
        <span className="text-primary">Electronics</span>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
        {product.short_description && (
          <p className="text-muted-foreground">{product.short_description}</p>
        )}
      </div>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${
                star <= avgRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium">{avgRating.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">
          ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-primary">
          ${product.price.toFixed(2)}
        </span>
        {product.compare_at_price && (
          <>
            <span className="text-2xl text-muted-foreground line-through">
              ${product.compare_at_price.toFixed(2)}
            </span>
            <Badge variant="destructive" className="text-sm">
              Save {discount}%
            </Badge>
          </>
        )}
      </div>

      <Separator />

      {/* Inventory Status */}
      <div className="flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${
            inventoryStatus === "in-stock"
              ? "bg-green-500"
              : inventoryStatus === "low-stock"
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
        />
        <span className="text-sm font-medium">
          {inventoryStatus === "in-stock" && "In Stock"}
          {inventoryStatus === "low-stock" &&
            `Only ${product.inventory_count} left!`}
          {inventoryStatus === "out-of-stock" && "Out of Stock"}
        </span>
      </div>

      {/* Quantity Selector */}
      {inventoryStatus !== "out-of-stock" && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Quantity</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setQuantity(Math.min(product.inventory_count, quantity + 1))
                }
                disabled={quantity >= product.inventory_count}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleWishlist}
              className={isWishlisted ? "text-red-500" : ""}
            >
              <Heart
                className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
              />
            </Button>
            <Button size="lg" variant="outline" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {inventoryStatus === "out-of-stock" && (
        <Button size="lg" className="w-full" disabled>
          Out of Stock
        </Button>
      )}

      <Separator />

      {/* Product Details */}
      <div className="space-y-3 text-sm">
        {product.vendor && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Brand</span>
            <span className="font-medium">{product.vendor}</span>
          </div>
        )}
        {product.weight && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Weight</span>
            <span className="font-medium">
              {product.weight} {product.weight_unit}
            </span>
          </div>
        )}
        {product.tags && product.tags.length > 0 && (
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground">Tags</span>
            <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

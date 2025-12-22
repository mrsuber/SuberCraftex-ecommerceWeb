"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success("Added to cart!", {
      description: `${product.name} has been added to your cart.`,
    });
  };

  const discount = product.compare_at_price
    ? Math.round(
        ((product.compare_at_price - product.price) / product.compare_at_price) * 100
      )
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/product/${product.id}`}>
        <Card className="h-full overflow-hidden group cursor-pointer">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            {product.featured_image ? (
              <Image
                src={product.featured_image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-6xl">
                📦
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-2">
              {product.is_featured && (
                <Badge variant="default" className="shadow-md">
                  Featured
                </Badge>
              )}
              {discount > 0 && (
                <Badge variant="destructive" className="shadow-md">
                  {discount}% OFF
                </Badge>
              )}
              {product.inventory_count <= product.low_stock_threshold &&
                product.inventory_count > 0 && (
                  <Badge variant="warning" className="shadow-md">
                    Low Stock
                  </Badge>
                )}
              {product.inventory_count === 0 && (
                <Badge variant="secondary" className="shadow-md">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Actions */}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="secondary"
                className="shadow-md"
                onClick={(e) => {
                  e.preventDefault();
                  toast.success("Added to wishlist!");
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <CardContent className="p-4">
            {/* Category/Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="text-xs text-muted-foreground mb-2">
                {product.tags[0]}
              </div>
            )}

            {/* Name */}
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Description */}
            {product.short_description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {product.short_description}
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < 4
                      ? "fill-primary text-primary"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-1">
                (4.0)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.compare_at_price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <Button
              className="w-full group/btn"
              onClick={handleAddToCart}
              disabled={product.inventory_count === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4 transition-transform group-hover/btn:scale-110" />
              {product.inventory_count === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}

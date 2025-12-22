"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import type { CartItem, Product } from "@/types";

interface CartItemCardProps {
  item: CartItem & { product: Product };
}

export function CartItemCard({ item }: CartItemCardProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product_id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    updateQuantity(item.product_id, item.quantity + 1);
  };

  const handleRemove = () => {
    removeItem(item.product_id);
  };

  const subtotal = item.product.price * item.quantity;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <Link
            href={`/product/${item.product.slug}`}
            className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted"
          >
            {item.product.featured_image ? (
              <Image
                src={item.product.featured_image}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-4xl">
                📦
              </div>
            )}
          </Link>

          {/* Product Details */}
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <Link
                href={`/product/${item.product.slug}`}
                className="font-semibold hover:text-primary transition-colors"
              >
                {item.product.name}
              </Link>
              {item.product.short_description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {item.product.short_description}
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                SKU: {item.product.sku}
              </p>
            </div>

            <div className="flex items-center justify-between mt-2">
              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={handleDecrease}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-12 text-center font-medium">
                  {item.quantity}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={handleIncrease}
                  disabled={
                    item.quantity >= item.product.inventory_count
                  }
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              {/* Price */}
              <div className="text-right">
                <div className="font-bold text-lg">
                  {formatPrice(subtotal)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatPrice(item.product.price)} each
                </div>
              </div>
            </div>
          </div>

          {/* Remove Button */}
          <div>
            <Button
              size="icon"
              variant="ghost"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleRemove}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

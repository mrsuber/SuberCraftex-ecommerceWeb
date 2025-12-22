"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStock, setInStock] = useState(true);
  const [onSale, setOnSale] = useState(false);

  // Update URL when filters change
  const updateFilters = (updates: Record<string, any>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else {
        params.set(key, Array.isArray(value) ? value.join(",") : String(value));
      }
    });

    router.push(`/catalog?${params.toString()}`, { scroll: false });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-4">
          <Label>Price Range</Label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            onValueCommit={(value) => updateFilters({ minPrice: value[0], maxPrice: value[1] })}
            max={500}
            step={10}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>

        <Separator />

        {/* Categories */}
        <div className="space-y-3">
          <Label>Categories</Label>
          <div className="space-y-2">
            {["Electronics", "Fashion", "Home & Living", "Sports & Outdoor"].map(
              (category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) => {
                      const newCategories = checked
                        ? [...selectedCategories, category]
                        : selectedCategories.filter(c => c !== category);
                      setSelectedCategories(newCategories);
                      updateFilters({ categories: newCategories });
                    }}
                  />
                  <label
                    htmlFor={category}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {category}
                  </label>
                </div>
              )
            )}
          </div>
        </div>

        <Separator />

        {/* Availability */}
        <div className="space-y-3">
          <Label>Availability</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={inStock}
                onCheckedChange={(checked) => {
                  setInStock(!!checked);
                  updateFilters({ inStock: checked });
                }}
              />
              <label
                htmlFor="in-stock"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                In Stock
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="on-sale"
                checked={onSale}
                onCheckedChange={(checked) => {
                  setOnSale(!!checked);
                  updateFilters({ onSale: checked });
                }}
              />
              <label
                htmlFor="on-sale"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                On Sale
              </label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Rating */}
        <div className="space-y-3">
          <Label>Rating</Label>
          <div className="space-y-2">
            {[5, 4, 3].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox id={`rating-${rating}`} />
                <label
                  htmlFor={`rating-${rating}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {rating} Stars & Up
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

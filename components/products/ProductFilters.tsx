"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  children?: Category[];
  productCount?: number;
}

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    searchParams.get("categoryId")
  );
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [inStock, setInStock] = useState(true);
  const [onSale, setOnSale] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories?parentOnly=true&includeChildren=true");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Sync with URL params
  useEffect(() => {
    const categoryId = searchParams.get("categoryId");
    setSelectedCategoryId(categoryId);

    // Auto-expand parent if subcategory is selected
    if (categoryId) {
      const parent = categories.find(c =>
        c.children?.some(child => child.id === categoryId)
      );
      if (parent && !expandedCategories.includes(parent.id)) {
        setExpandedCategories(prev => [...prev, parent.id]);
      }
    }
  }, [searchParams, categories]);

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

  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategorySelect = (categoryId: string) => {
    const newValue = selectedCategoryId === categoryId ? null : categoryId;
    setSelectedCategoryId(newValue);
    updateFilters({ categoryId: newValue });
  };

  const clearCategoryFilter = () => {
    setSelectedCategoryId(null);
    updateFilters({ categoryId: null });
  };

  // Get selected category name for display
  const getSelectedCategoryName = (): string | null => {
    if (!selectedCategoryId) return null;

    for (const cat of categories) {
      if (cat.id === selectedCategoryId) return cat.name;
      const child = cat.children?.find(c => c.id === selectedCategoryId);
      if (child) return `${cat.name} > ${child.name}`;
    }
    return null;
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
          <div className="flex items-center justify-between">
            <Label>Categories</Label>
            {selectedCategoryId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCategoryFilter}
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Selected category indicator */}
          {selectedCategoryId && (
            <div className="px-3 py-2 bg-primary/10 rounded-md text-sm font-medium text-primary">
              {getSelectedCategoryName()}
            </div>
          )}

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-6 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {categories.map((category) => (
                <div key={category.id}>
                  {/* Parent Category */}
                  <div className="flex items-center">
                    {category.children && category.children.length > 0 && (
                      <button
                        onClick={() => toggleExpanded(category.id)}
                        className="p-1 hover:bg-muted rounded mr-1"
                      >
                        {expandedCategories.includes(category.id) ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => handleCategorySelect(category.id)}
                      className={cn(
                        "flex-1 text-left py-1.5 px-2 rounded-md text-sm font-medium transition-colors",
                        selectedCategoryId === category.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      {category.name}
                      {category.productCount !== undefined && (
                        <span className="ml-1 text-xs opacity-60">
                          ({category.productCount})
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Subcategories */}
                  {category.children && category.children.length > 0 && expandedCategories.includes(category.id) && (
                    <div className="ml-6 mt-1 space-y-1 border-l-2 border-muted pl-3">
                      {category.children.map((subCategory) => (
                        <button
                          key={subCategory.id}
                          onClick={() => handleCategorySelect(subCategory.id)}
                          className={cn(
                            "w-full text-left py-1 px-2 rounded-md text-sm transition-colors",
                            selectedCategoryId === subCategory.id
                              ? "bg-primary/80 text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )}
                        >
                          {subCategory.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
  children?: Category[];
}

export function ProductGrid() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categories to know parent-child relationships
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
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Get all category IDs including subcategories for a given parent category
  const getCategoryIdsForFilter = (categoryId: string): string[] => {
    // Check if this is a parent category
    const parentCategory = categories.find(c => c.id === categoryId);
    if (parentCategory && parentCategory.children && parentCategory.children.length > 0) {
      // Return parent ID plus all child IDs
      return [categoryId, ...parentCategory.children.map(c => c.id)];
    }
    // It's either a subcategory or a category with no children
    return [categoryId];
  };

  // Apply filters when searchParams or products change
  useEffect(() => {
    if (products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    let filtered = [...products];

    // Price range filter
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      filtered = filtered.filter((product) => {
        const price = product.price;
        if (minPrice && price < Number(minPrice)) return false;
        if (maxPrice && price > Number(maxPrice)) return false;
        return true;
      });
    }

    // Category filter - supports categoryId from filter sidebar
    const categoryId = searchParams.get("categoryId") || searchParams.get("category");

    if (categoryId) {
      // Get all relevant category IDs (parent + children if parent selected)
      const categoryIds = getCategoryIdsForFilter(categoryId);
      filtered = filtered.filter((product) =>
        product.category_id && categoryIds.includes(product.category_id)
      );
    }

    // In stock filter
    const inStock = searchParams.get("inStock");
    if (inStock === "true") {
      filtered = filtered.filter((product) => product.inventory_count > 0);
    }

    // On sale filter
    const onSale = searchParams.get("onSale");
    if (onSale === "true") {
      filtered = filtered.filter((product) => product.compare_at_price && product.compare_at_price > product.price);
    }

    setFilteredProducts(filtered);
  }, [products, searchParams, categories]);

  // Apply sorting when filteredProducts or sortBy changes
  useEffect(() => {
    if (filteredProducts.length === 0) {
      setSortedProducts([]);
      return;
    }

    const sorted = [...filteredProducts];

    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      default:
        // Default to newest
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setSortedProducts(sorted);
  }, [filteredProducts, sortBy]);

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/catalog?${params.toString()}`, { scroll: false });
  };

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <button
          onClick={() => router.refresh()}
          className="text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  const displayProducts = sortedProducts.length > 0 || searchParams.toString() ? sortedProducts : products;

  if (displayProducts.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No products found.</p>
        <p className="text-sm text-muted-foreground mt-2">
          {searchParams.toString() ? "Try adjusting your filters" : "Check back later for new arrivals!"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {displayProducts.length} product{displayProducts.length !== 1 ? "s" : ""}
        </p>

        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* TODO: Add pagination */}
    </div>
  );
}

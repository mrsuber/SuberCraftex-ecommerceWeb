import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatCurrency as formatCurrencyUtil } from "./currency";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "XAF";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {}
) {
  const { currency = "XAF", notation = "standard" } = options;

  // Use custom formatter for XAF/FCFA
  if (currency === "XAF") {
    return formatCurrencyUtil(price, "XAF");
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Serialize Prisma Product to frontend Product type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeProduct(product: any) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    short_description: product.description ? product.description.substring(0, 150) : null,
    price: Number(product.price),
    compare_at_price: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    cost_per_item: product.costPerItem ? Number(product.costPerItem) : null,
    category_id: product.categoryId,
    category: product.category ? {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    } : null,
    images: product.images || [],
    featured_image: product.featuredImage,
    sku: product.sku,
    barcode: null,
    inventory_count: product.inventoryCount,
    track_inventory: product.trackInventory,
    low_stock_threshold: product.lowStockThreshold,
    weight: product.weight ? Number(product.weight) : null,
    weight_unit: 'kg',
    vendor: product.vendor,
    tags: product.tags || [],
    is_active: product.isActive,
    is_featured: product.isFeatured,
    seo_title: product.seoTitle,
    seo_description: product.seoDescription,
    metadata: {},
    created_at: product.createdAt.toISOString(),
    updated_at: product.updatedAt.toISOString(),
    published_at: product.publishedAt ? product.publishedAt.toISOString() : null,
  };
}

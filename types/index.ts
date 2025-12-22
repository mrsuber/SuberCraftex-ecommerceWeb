// Database Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  cost_per_item: number | null;
  category_id: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  images: string[];
  featured_image: string | null;
  sku: string;
  barcode: string | null;
  inventory_count: number;
  track_inventory: boolean;
  low_stock_threshold: number;
  weight: number | null;
  weight_unit: string;
  vendor: string | null;
  tags: string[];
  is_active: boolean;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  guest_email: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod | null;
  shipping_method: ShippingMethod;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  shipping_address: Address;
  billing_address: Address;
  stripe_payment_intent_id: string | null;
  stripe_charge_id: string | null;
  tracking_number: string | null;
  carrier: string | null;
  estimated_delivery_date: string | null;
  customer_notes: string | null;
  admin_notes: string | null;
  coupon_code: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  product_sku: string;
  product_image: string | null;
  variant_options: Record<string, any>;
  quantity: number;
  price: number;
  total: number;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  order_id: string | null;
  rating: number;
  title: string;
  content: string;
  images: string[];
  verified_purchase: boolean;
  is_approved: boolean;
  helpful_count: number;
  admin_response: string | null;
  admin_responded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface Address {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface SavedAddress extends Address {
  id: string;
  user_id: string;
  is_default: boolean;
  label: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShippingTracking {
  id: string;
  order_id: string;
  driver_id: string | null;
  status: TrackingStatus;
  current_location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  } | null;
  pickup_location: {
    type: "Point";
    coordinates: [number, number];
  } | null;
  delivery_location: {
    type: "Point";
    coordinates: [number, number];
  } | null;
  estimated_delivery_time: string | null;
  actual_delivery_time: string | null;
  notes: string | null;
  signature_url: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Driver {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  email: string;
  photo_url: string | null;
  vehicle_type: string | null;
  vehicle_number: string | null;
  license_number: string | null;
  is_active: boolean;
  is_available: boolean;
  rating: number;
  total_deliveries: number;
  created_at: string;
  updated_at: string;
}

// Enum Types
export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type PaymentMethod = "card" | "cash";

export type ShippingMethod = "standard" | "express" | "overnight";

export type TrackingStatus =
  | "assigned"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed";

// Frontend Types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  onSale?: boolean;
  rating?: number;
  search?: string;
}

export interface ProductSort {
  field: "price" | "created_at" | "name" | "popularity";
  order: "asc" | "desc";
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Cart Store Types
export interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

// User Types
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: "customer" | "admin" | "driver";
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Stripe Types
export interface StripeCheckoutSession {
  sessionId: string;
  url: string;
}

// Analytics Types
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  conversionRate: number;
  revenueGrowth: number;
  ordersGrowth: number;
}

export interface ChartData {
  date: string;
  value: number;
  label?: string;
}

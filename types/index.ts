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
  pickup_deadline?: string | null;
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
  postal_code?: string;
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

export type ShippingMethod = "standard" | "express" | "overnight" | "in_store";

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
  role: "customer" | "admin" | "driver" | "cashier" | "tailor" | "investor";
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

// ============================================================================
// SERVICES & BOOKING TYPES
// ============================================================================

export type ServiceDuration =
  | "half_hour"
  | "one_hour"
  | "two_hours"
  | "half_day"
  | "full_day"
  | "custom";

export type BookingStatus =
  | "pending"
  | "quote_pending"
  | "quote_sent"
  | "quote_approved"
  | "quote_rejected"
  | "awaiting_payment"
  | "payment_partial"
  | "confirmed"
  | "in_progress"
  | "awaiting_collection"
  | "completed"
  | "cancelled"
  | "no_show"
  | "rescheduled";

export type ServiceType =
  | "onsite"
  | "custom_production"
  | "collect_repair";

export type CollectionMethod =
  | "customer_brings"
  | "admin_collects";

export type QuoteStatus =
  | "draft"
  | "sent"
  | "approved"
  | "rejected"
  | "expired";

export type MaterialRequestStatus =
  | "pending"
  | "approved"
  | "acquired"
  | "cancelled";

export type PaymentType =
  | "down_payment"
  | "partial_payment"
  | "final_payment"
  | "refund";

export type ProgressStatus =
  | "pending"
  | "material_ordered"
  | "material_received"
  | "in_production"
  | "quality_check"
  | "ready_for_collection"
  | "completed";

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  _count?: {
    services: number;
  };
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  category_id: string;
  category?: ServiceCategory;
  images: string[];
  featured_image: string | null;
  duration: ServiceDuration;
  custom_duration: number | null; // in minutes
  buffer_time: number;
  max_bookings_per_day: number | null;
  // Enhanced: Service Type Flags
  supports_onsite: boolean;
  supports_custom_production: boolean;
  supports_collect_repair: boolean;
  is_active: boolean;
  is_featured: boolean;
  tags: string[];
  seo_title: string | null;
  seo_description: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  availability?: ServiceAvailability[];
  materials?: ServiceMaterial[];
  _count?: {
    bookings: number;
  };
}

export interface ServiceAvailability {
  id: string;
  service_id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  start_time: string; // "09:00"
  end_time: string; // "17:00"
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceBlockout {
  id: string;
  service_id: string | null;
  start_date: string;
  end_date: string;
  reason: string | null;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceBooking {
  id: string;
  booking_number: string;
  service_id: string;
  user_id: string | null;
  order_id: string | null;
  status: BookingStatus;
  // Enhanced: Service Type & Collection
  service_type: ServiceType;
  collection_method: CollectionMethod | null;
  // Scheduling (optional for custom production and collect/repair)
  scheduled_date: string | null;
  scheduled_time: string | null;
  end_time: string | null;
  duration: number; // in minutes
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_notes: string | null;
  // Enhanced Requirements
  requirement_photos: string[];
  desired_outcome: string | null;
  admin_notes: string | null;
  price: number;
  final_price: number | null; // Locked price after quote approval
  cancellation_reason: string | null;
  rescheduled_from: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  service?: Service;
  user?: {
    id: string;
    email: string;
    full_name: string | null;
  };
  // Enhanced Relations
  quote?: Quote;
  materials?: BookingMaterial[];
  material_requests?: MaterialRequest[];
  progress_updates?: BookingProgress[];
  timeline?: BookingTimeline[];
  payments?: BookingPayment[];
}

export interface CartItemService {
  id: string;
  user_id: string;
  service_id: string;
  scheduled_date: string;
  scheduled_time: string;
  customer_notes: string | null;
  created_at: string;
  updated_at: string;
  service?: Service;
}

export interface OrderItemService {
  id: string;
  order_id: string;
  service_id: string;
  booking_id: string | null;
  service_name: string;
  service_sku: string;
  service_image: string | null;
  scheduled_date: string;
  scheduled_time: string;
  duration: number;
  price: number;
  customer_notes: string | null;
  created_at: string;
}

// Service Availability Response
export interface ServiceAvailabilityResponse {
  serviceId: string;
  serviceName: string;
  duration: ServiceDuration;
  durationMinutes: number;
  bufferTime: number;
  availability: Record<string, string[]>; // { "2024-01-15": ["09:00", "09:30", "10:00", ...] }
}

// Update CartState to include services
export interface CartState {
  items: CartItem[];
  serviceItems: CartItemService[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  addServiceItem: (
    service: Service,
    scheduledDate: string,
    scheduledTime: string,
    customerNotes?: string
  ) => void;
  removeServiceItem: (serviceItemId: string) => void;
  updateServiceItem: (
    serviceItemId: string,
    scheduledDate: string,
    scheduledTime: string
  ) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

// Service Filters
export interface ServiceFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: ServiceDuration;
  featured?: boolean;
  search?: string;
}

// Booking Filters
export interface BookingFilters {
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
  serviceId?: string;
  service_type?: ServiceType;
  upcoming?: boolean;
}

// ============================================================================
// ENHANCED WORKSHOP MANAGEMENT TYPES
// ============================================================================

// Material Management
export interface Material {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  stockQuantity: number;
  unit: string;
  imageUrl?: string | null;
  image_url?: string | null;
  specifications?: any;
  notes?: string | null;
  service_category_id: string | null;
  serviceCategoryId?: string | null;
  is_active: boolean;
  isActive?: boolean;
  created_at: string;
  createdAt?: string;
  updated_at: string;
  updatedAt?: string;
  category?: ServiceCategory;
  services?: ServiceMaterial[];
  bookings?: BookingMaterial[];
}

export interface ServiceMaterial {
  id: string;
  service_id: string;
  material_id: string;
  is_required: boolean;
  default_quantity: number;
  created_at: string;
  material: Material;
}

export interface BookingMaterial {
  id: string;
  booking_id: string;
  material_id: string;
  quantity: number;
  price_at_booking: number;
  is_acquired: boolean;
  created_at: string;
  updated_at: string;
  material: Material;
}

export interface MaterialRequest {
  id: string;
  booking_id: string;
  description: string;
  reference_url: string | null;
  reference_photos: string[];
  status: MaterialRequestStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

// Quote System
export interface Quote {
  id: string;
  booking_id: string;
  material_cost: number;
  labor_cost: number;
  labor_hours: number;
  total_cost: number;
  down_payment_amount: number;
  notes: string | null;
  status: QuoteStatus;
  valid_until: string | null;
  created_at: string;
  updated_at: string;
  history?: QuoteHistory[];
}

export interface QuoteHistory {
  id: string;
  quote_id: string;
  action: string;
  notes: string | null;
  created_by: string;
  created_at: string;
}

// Progress Tracking
export interface BookingProgress {
  id: string;
  booking_id: string;
  status: ProgressStatus;
  description: string;
  photos: string[];
  created_by: string;
  created_at: string;
}

export interface BookingTimeline {
  id: string;
  booking_id: string;
  milestone: string;
  expected_date: string | null;
  actual_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Payment Tracking
export interface BookingPayment {
  id: string;
  booking_id: string;
  amount: number;
  payment_type: PaymentType;
  payment_method: string;
  status: string;
  stripe_payment_id: string | null;
  notes: string | null;
  created_at: string;
}

// File Upload
export interface UploadResult {
  success: boolean;
  url: string;
  filename: string;
  size: number;
  type: string;
}

export interface UploadOptions {
  type: 'requirement' | 'material' | 'progress';
  bookingId: string;
  file: File;
}

// Hero Banner Types
export type BannerType =
  | 'advertisement'
  | 'new_product'
  | 'new_service'
  | 'promotion'
  | 'announcement'
  | 'upcoming';

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  type: BannerType;
  image_url: string;
  mobile_image_url: string | null;
  cta_text: string | null;
  cta_link: string | null;
  cta_style: string | null;
  background_color: string | null;
  text_color: string | null;
  order: number;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

// Blog Types
export type BlogStatus = 'draft' | 'published' | 'archived';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  images: string[];
  youtube_url: string | null;
  status: BlogStatus;
  published_at: string | null;
  author_id: string;
  author?: {
    id: string;
    full_name: string | null;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

// Upcoming Services Types
export interface UpcomingService {
  id: string;
  title: string;
  description: string | null;
  short_description: string | null;
  image_url: string;
  service_date: string;
  service_id: string | null;
  cta_text: string | null;
  location: string | null;
  price: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  service?: {
    id: string;
    name: string;
    slug: string;
    featured_image: string | null;
  } | null;
}

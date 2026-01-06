-- CreateEnum
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('draft', 'sent', 'confirmed', 'shipped', 'partial_received', 'received', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "ServiceDuration" AS ENUM ('half_hour', 'one_hour', 'two_hours', 'half_day', 'full_day', 'custom');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled');

-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact_person" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" JSONB NOT NULL,
    "payment_terms" TEXT NOT NULL DEFAULT 'net_30',
    "tax_id" TEXT,
    "bank_details" JSONB,
    "rating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "id" TEXT NOT NULL,
    "po_number" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expected_delivery_date" TIMESTAMP(3),
    "status" "PurchaseOrderStatus" NOT NULL DEFAULT 'draft',
    "subtotal" DECIMAL(10,2) NOT NULL,
    "tax_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "shipping_cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "payment_terms" TEXT NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "payment_date" TIMESTAMP(3),
    "notes" TEXT,
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_order_items" (
    "id" TEXT NOT NULL,
    "purchase_order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "quantity_received" INTEGER NOT NULL DEFAULT 0,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "line_total" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goods_receipts" (
    "id" TEXT NOT NULL,
    "receipt_number" TEXT NOT NULL,
    "purchase_order_id" TEXT NOT NULL,
    "received_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "received_by_id" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "discrepancy_notes" TEXT,
    "photos" JSONB,
    "signature_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goods_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_confirmations" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "purchase_order_id" TEXT NOT NULL,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmed_at" TIMESTAMP(3),
    "confirmed_ip" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_confirmations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "icon" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "description" TEXT,
    "short_description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "compare_at_price" DECIMAL(10,2),
    "category_id" TEXT NOT NULL,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "featured_image" TEXT,
    "duration" "ServiceDuration" NOT NULL DEFAULT 'one_hour',
    "custom_duration" INTEGER,
    "buffer_time" INTEGER NOT NULL DEFAULT 0,
    "max_bookings_per_day" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "seo_title" TEXT,
    "seo_description" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_availability" (
    "id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_blockouts" (
    "id" TEXT NOT NULL,
    "service_id" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_blockouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_bookings" (
    "id" TEXT NOT NULL,
    "booking_number" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "user_id" TEXT,
    "order_id" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "scheduled_date" TIMESTAMP(3) NOT NULL,
    "scheduled_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,
    "customer_phone" TEXT,
    "customer_notes" TEXT,
    "admin_notes" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "cancellation_reason" TEXT,
    "rescheduled_from" TEXT,
    "completed_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_item_services" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "scheduled_date" TIMESTAMP(3) NOT NULL,
    "scheduled_time" TEXT NOT NULL,
    "customer_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_item_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item_services" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "booking_id" TEXT,
    "service_name" TEXT NOT NULL,
    "service_sku" TEXT NOT NULL,
    "service_image" TEXT,
    "scheduled_date" TIMESTAMP(3) NOT NULL,
    "scheduled_time" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "customer_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_item_services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_email_key" ON "suppliers"("email");

-- CreateIndex
CREATE INDEX "suppliers_email_idx" ON "suppliers"("email");

-- CreateIndex
CREATE INDEX "suppliers_is_active_idx" ON "suppliers"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_po_number_key" ON "purchase_orders"("po_number");

-- CreateIndex
CREATE INDEX "purchase_orders_supplier_id_idx" ON "purchase_orders"("supplier_id");

-- CreateIndex
CREATE INDEX "purchase_orders_po_number_idx" ON "purchase_orders"("po_number");

-- CreateIndex
CREATE INDEX "purchase_orders_status_idx" ON "purchase_orders"("status");

-- CreateIndex
CREATE INDEX "purchase_orders_payment_status_idx" ON "purchase_orders"("payment_status");

-- CreateIndex
CREATE INDEX "purchase_orders_created_at_idx" ON "purchase_orders"("created_at");

-- CreateIndex
CREATE INDEX "purchase_order_items_purchase_order_id_idx" ON "purchase_order_items"("purchase_order_id");

-- CreateIndex
CREATE INDEX "purchase_order_items_product_id_idx" ON "purchase_order_items"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "goods_receipts_receipt_number_key" ON "goods_receipts"("receipt_number");

-- CreateIndex
CREATE INDEX "goods_receipts_purchase_order_id_idx" ON "goods_receipts"("purchase_order_id");

-- CreateIndex
CREATE INDEX "goods_receipts_receipt_number_idx" ON "goods_receipts"("receipt_number");

-- CreateIndex
CREATE INDEX "goods_receipts_received_date_idx" ON "goods_receipts"("received_date");

-- CreateIndex
CREATE UNIQUE INDEX "payment_confirmations_token_key" ON "payment_confirmations"("token");

-- CreateIndex
CREATE INDEX "payment_confirmations_token_idx" ON "payment_confirmations"("token");

-- CreateIndex
CREATE INDEX "payment_confirmations_purchase_order_id_idx" ON "payment_confirmations"("purchase_order_id");

-- CreateIndex
CREATE INDEX "payment_confirmations_is_confirmed_idx" ON "payment_confirmations"("is_confirmed");

-- CreateIndex
CREATE UNIQUE INDEX "service_categories_name_key" ON "service_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "service_categories_slug_key" ON "service_categories"("slug");

-- CreateIndex
CREATE INDEX "service_categories_slug_idx" ON "service_categories"("slug");

-- CreateIndex
CREATE INDEX "service_categories_is_active_idx" ON "service_categories"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "services_sku_key" ON "services"("sku");

-- CreateIndex
CREATE INDEX "services_category_id_idx" ON "services"("category_id");

-- CreateIndex
CREATE INDEX "services_slug_idx" ON "services"("slug");

-- CreateIndex
CREATE INDEX "services_sku_idx" ON "services"("sku");

-- CreateIndex
CREATE INDEX "services_is_active_idx" ON "services"("is_active");

-- CreateIndex
CREATE INDEX "services_is_featured_idx" ON "services"("is_featured");

-- CreateIndex
CREATE INDEX "service_availability_service_id_idx" ON "service_availability"("service_id");

-- CreateIndex
CREATE INDEX "service_availability_day_of_week_idx" ON "service_availability"("day_of_week");

-- CreateIndex
CREATE INDEX "service_blockouts_service_id_idx" ON "service_blockouts"("service_id");

-- CreateIndex
CREATE INDEX "service_blockouts_start_date_end_date_idx" ON "service_blockouts"("start_date", "end_date");

-- CreateIndex
CREATE UNIQUE INDEX "service_bookings_booking_number_key" ON "service_bookings"("booking_number");

-- CreateIndex
CREATE UNIQUE INDEX "service_bookings_order_id_key" ON "service_bookings"("order_id");

-- CreateIndex
CREATE INDEX "service_bookings_service_id_idx" ON "service_bookings"("service_id");

-- CreateIndex
CREATE INDEX "service_bookings_user_id_idx" ON "service_bookings"("user_id");

-- CreateIndex
CREATE INDEX "service_bookings_order_id_idx" ON "service_bookings"("order_id");

-- CreateIndex
CREATE INDEX "service_bookings_status_idx" ON "service_bookings"("status");

-- CreateIndex
CREATE INDEX "service_bookings_scheduled_date_idx" ON "service_bookings"("scheduled_date");

-- CreateIndex
CREATE INDEX "service_bookings_booking_number_idx" ON "service_bookings"("booking_number");

-- CreateIndex
CREATE INDEX "cart_item_services_user_id_idx" ON "cart_item_services"("user_id");

-- CreateIndex
CREATE INDEX "cart_item_services_service_id_idx" ON "cart_item_services"("service_id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_item_services_user_id_service_id_scheduled_date_schedu_key" ON "cart_item_services"("user_id", "service_id", "scheduled_date", "scheduled_time");

-- CreateIndex
CREATE INDEX "order_item_services_order_id_idx" ON "order_item_services"("order_id");

-- CreateIndex
CREATE INDEX "order_item_services_service_id_idx" ON "order_item_services"("service_id");

-- CreateIndex
CREATE INDEX "order_item_services_booking_id_idx" ON "order_item_services"("booking_id");

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_received_by_id_fkey" FOREIGN KEY ("received_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_confirmations" ADD CONSTRAINT "payment_confirmations_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "service_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_availability" ADD CONSTRAINT "service_availability_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_blockouts" ADD CONSTRAINT "service_blockouts_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_bookings" ADD CONSTRAINT "service_bookings_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_bookings" ADD CONSTRAINT "service_bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_bookings" ADD CONSTRAINT "service_bookings_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item_services" ADD CONSTRAINT "cart_item_services_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item_services" ADD CONSTRAINT "cart_item_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item_services" ADD CONSTRAINT "order_item_services_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item_services" ADD CONSTRAINT "order_item_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

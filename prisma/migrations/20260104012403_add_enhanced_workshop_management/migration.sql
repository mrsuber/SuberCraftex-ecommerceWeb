/*
  Warnings:

  - Added the required column `service_type` to the `service_bookings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('onsite', 'custom_production', 'collect_repair');

-- CreateEnum
CREATE TYPE "CollectionMethod" AS ENUM ('customer_brings', 'admin_collects');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('draft', 'sent', 'approved', 'rejected', 'expired');

-- CreateEnum
CREATE TYPE "MaterialRequestStatus" AS ENUM ('pending', 'approved', 'acquired', 'cancelled');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('down_payment', 'partial_payment', 'final_payment', 'refund');

-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('pending', 'material_ordered', 'material_received', 'in_production', 'quality_check', 'ready_for_collection', 'completed');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BookingStatus" ADD VALUE 'quote_pending';
ALTER TYPE "BookingStatus" ADD VALUE 'quote_sent';
ALTER TYPE "BookingStatus" ADD VALUE 'quote_approved';
ALTER TYPE "BookingStatus" ADD VALUE 'quote_rejected';
ALTER TYPE "BookingStatus" ADD VALUE 'awaiting_payment';
ALTER TYPE "BookingStatus" ADD VALUE 'payment_partial';
ALTER TYPE "BookingStatus" ADD VALUE 'awaiting_collection';

-- AlterTable
ALTER TABLE "service_bookings" ADD COLUMN     "collection_method" "CollectionMethod",
ADD COLUMN     "desired_outcome" TEXT,
ADD COLUMN     "final_price" DECIMAL(10,2),
ADD COLUMN     "requirement_photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "service_type" "ServiceType" NOT NULL,
ALTER COLUMN "scheduled_date" DROP NOT NULL,
ALTER COLUMN "scheduled_time" DROP NOT NULL,
ALTER COLUMN "end_time" DROP NOT NULL;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "supports_collect_repair" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "supports_custom_production" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "supports_onsite" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "materials" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL DEFAULT 'piece',
    "service_category_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_materials" (
    "id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "default_quantity" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_materials" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price_at_booking" DECIMAL(10,2) NOT NULL,
    "is_acquired" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_requests" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reference_url" TEXT,
    "reference_photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "MaterialRequestStatus" NOT NULL DEFAULT 'pending',
    "admin_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "material_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "material_cost" DECIMAL(10,2) NOT NULL,
    "labor_cost" DECIMAL(10,2) NOT NULL,
    "labor_hours" DECIMAL(5,2) NOT NULL,
    "total_cost" DECIMAL(10,2) NOT NULL,
    "down_payment_amount" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "status" "QuoteStatus" NOT NULL DEFAULT 'draft',
    "valid_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_history" (
    "id" TEXT NOT NULL,
    "quote_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "notes" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quote_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_progress" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "status" "ProgressStatus" NOT NULL,
    "description" TEXT NOT NULL,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_timeline" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "milestone" TEXT NOT NULL,
    "expected_date" TIMESTAMP(3),
    "actual_date" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_payments" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "payment_type" "PaymentType" NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "stripe_payment_id" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "materials_sku_key" ON "materials"("sku");

-- CreateIndex
CREATE INDEX "materials_service_category_id_idx" ON "materials"("service_category_id");

-- CreateIndex
CREATE INDEX "materials_sku_idx" ON "materials"("sku");

-- CreateIndex
CREATE INDEX "materials_is_active_idx" ON "materials"("is_active");

-- CreateIndex
CREATE INDEX "service_materials_service_id_idx" ON "service_materials"("service_id");

-- CreateIndex
CREATE INDEX "service_materials_material_id_idx" ON "service_materials"("material_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_materials_service_id_material_id_key" ON "service_materials"("service_id", "material_id");

-- CreateIndex
CREATE INDEX "booking_materials_booking_id_idx" ON "booking_materials"("booking_id");

-- CreateIndex
CREATE INDEX "booking_materials_material_id_idx" ON "booking_materials"("material_id");

-- CreateIndex
CREATE INDEX "material_requests_booking_id_idx" ON "material_requests"("booking_id");

-- CreateIndex
CREATE INDEX "material_requests_status_idx" ON "material_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "quotes_booking_id_key" ON "quotes"("booking_id");

-- CreateIndex
CREATE INDEX "quotes_booking_id_idx" ON "quotes"("booking_id");

-- CreateIndex
CREATE INDEX "quotes_status_idx" ON "quotes"("status");

-- CreateIndex
CREATE INDEX "quote_history_quote_id_idx" ON "quote_history"("quote_id");

-- CreateIndex
CREATE INDEX "quote_history_created_at_idx" ON "quote_history"("created_at");

-- CreateIndex
CREATE INDEX "booking_progress_booking_id_idx" ON "booking_progress"("booking_id");

-- CreateIndex
CREATE INDEX "booking_progress_created_at_idx" ON "booking_progress"("created_at");

-- CreateIndex
CREATE INDEX "booking_timeline_booking_id_idx" ON "booking_timeline"("booking_id");

-- CreateIndex
CREATE INDEX "booking_payments_booking_id_idx" ON "booking_payments"("booking_id");

-- CreateIndex
CREATE INDEX "booking_payments_payment_type_idx" ON "booking_payments"("payment_type");

-- CreateIndex
CREATE INDEX "booking_payments_status_idx" ON "booking_payments"("status");

-- CreateIndex
CREATE INDEX "service_bookings_service_type_idx" ON "service_bookings"("service_type");

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_service_category_id_fkey" FOREIGN KEY ("service_category_id") REFERENCES "service_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_materials" ADD CONSTRAINT "service_materials_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_materials" ADD CONSTRAINT "service_materials_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_materials" ADD CONSTRAINT "booking_materials_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "service_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_materials" ADD CONSTRAINT "booking_materials_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_requests" ADD CONSTRAINT "material_requests_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "service_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "service_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_history" ADD CONSTRAINT "quote_history_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_progress" ADD CONSTRAINT "booking_progress_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "service_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_timeline" ADD CONSTRAINT "booking_timeline_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "service_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_payments" ADD CONSTRAINT "booking_payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "service_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "FeeScheduleStatus" AS ENUM ('active', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "FeeInstalmentStatus" AS ENUM ('scheduled', 'invoiced', 'paid', 'waived', 'cancelled');

-- AlterEnum
ALTER TYPE "PayoutReason" ADD VALUE 'apprentice_refund';

-- CreateTable
CREATE TABLE "apprentice_fee_plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "service_track" "ServiceTrack",
    "registration_fee" BIGINT NOT NULL DEFAULT 0,
    "tuition" BIGINT NOT NULL,
    "instalments" INTEGER NOT NULL DEFAULT 1,
    "interval_months" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apprentice_fee_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apprentice_fee_schedules" (
    "id" TEXT NOT NULL,
    "apprentice_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "enrollment_id" TEXT,
    "plan_name" TEXT NOT NULL,
    "total" BIGINT NOT NULL,
    "discount" BIGINT NOT NULL DEFAULT 0,
    "discount_reason" TEXT,
    "status" "FeeScheduleStatus" NOT NULL DEFAULT 'active',
    "start_date" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "cancelled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apprentice_fee_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apprentice_fee_instalments" (
    "id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "apprentice_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "due_date" DATE NOT NULL,
    "amount" BIGINT NOT NULL,
    "paid" BIGINT NOT NULL DEFAULT 0,
    "status" "FeeInstalmentStatus" NOT NULL DEFAULT 'scheduled',
    "invoiced_at" TIMESTAMP(3),
    "reminded_at" TIMESTAMP(3),
    "waived_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apprentice_fee_instalments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apprentice_fee_payments" (
    "id" TEXT NOT NULL,
    "apprentice_id" TEXT NOT NULL,
    "receipt_number" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "method" TEXT NOT NULL,
    "collection_reference" TEXT,
    "payout_id" TEXT,
    "received_by_id" TEXT,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apprentice_fee_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "apprentice_fee_schedules_apprentice_id_status_idx" ON "apprentice_fee_schedules"("apprentice_id", "status");

-- CreateIndex
CREATE INDEX "apprentice_fee_instalments_apprentice_id_status_idx" ON "apprentice_fee_instalments"("apprentice_id", "status");

-- CreateIndex
CREATE INDEX "apprentice_fee_instalments_status_due_date_idx" ON "apprentice_fee_instalments"("status", "due_date");

-- CreateIndex
CREATE UNIQUE INDEX "apprentice_fee_payments_receipt_number_key" ON "apprentice_fee_payments"("receipt_number");

-- CreateIndex
CREATE UNIQUE INDEX "apprentice_fee_payments_collection_reference_key" ON "apprentice_fee_payments"("collection_reference");

-- CreateIndex
CREATE INDEX "apprentice_fee_payments_apprentice_id_idx" ON "apprentice_fee_payments"("apprentice_id");

-- AddForeignKey
ALTER TABLE "apprentice_fee_schedules" ADD CONSTRAINT "apprentice_fee_schedules_apprentice_id_fkey" FOREIGN KEY ("apprentice_id") REFERENCES "apprentices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apprentice_fee_schedules" ADD CONSTRAINT "apprentice_fee_schedules_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "apprentice_fee_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apprentice_fee_instalments" ADD CONSTRAINT "apprentice_fee_instalments_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "apprentice_fee_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apprentice_fee_instalments" ADD CONSTRAINT "apprentice_fee_instalments_apprentice_id_fkey" FOREIGN KEY ("apprentice_id") REFERENCES "apprentices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apprentice_fee_payments" ADD CONSTRAINT "apprentice_fee_payments_apprentice_id_fkey" FOREIGN KEY ("apprentice_id") REFERENCES "apprentices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

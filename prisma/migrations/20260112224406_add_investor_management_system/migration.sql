-- CreateEnum
CREATE TYPE "InvestorStatus" AS ENUM ('pending_verification', 'active', 'suspended', 'exited');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('deposit', 'withdrawal_cash', 'withdrawal_profit', 'withdrawal_product', 'withdrawal_equipment', 'allocation_product', 'allocation_equipment', 'profit_credit', 'refund');

-- CreateEnum
CREATE TYPE "WithdrawalType" AS ENUM ('cash', 'profit', 'product', 'equipment_share');

-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('pending', 'approved', 'processing', 'completed', 'rejected', 'cancelled');

-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('active', 'maintenance', 'retired');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'investor';

-- CreateTable
CREATE TABLE "investors" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "investor_number" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "id_type" TEXT NOT NULL,
    "id_number" TEXT NOT NULL,
    "id_document_url" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMP(3),
    "verified_by" TEXT,
    "cash_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "profit_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_invested" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_profit" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_withdrawn" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "agreement_accepted" BOOLEAN NOT NULL DEFAULT false,
    "agreement_accepted_at" TIMESTAMP(3),
    "status" "InvestorStatus" NOT NULL DEFAULT 'pending_verification',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_deposits" (
    "id" TEXT NOT NULL,
    "investor_id" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "payment_method" TEXT NOT NULL,
    "reference_number" TEXT,
    "receipt_url" TEXT,
    "notes" TEXT,
    "deposited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "investor_deposits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "equipment_number" TEXT NOT NULL,
    "purchase_price" DECIMAL(12,2) NOT NULL,
    "current_value" DECIMAL(12,2) NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "location" TEXT,
    "specifications" JSONB,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "EquipmentStatus" NOT NULL DEFAULT 'active',
    "maintenance_cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_revenue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_profit" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "retired_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_product_allocations" (
    "id" TEXT NOT NULL,
    "investor_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "variant_id" TEXT,
    "amount_allocated" DECIMAL(12,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "purchase_price" DECIMAL(10,2) NOT NULL,
    "total_investment" DECIMAL(12,2) NOT NULL,
    "quantity_sold" INTEGER NOT NULL DEFAULT 0,
    "quantity_remaining" INTEGER NOT NULL,
    "profit_generated" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "capital_returned" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "allocated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investor_product_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_equipment_allocations" (
    "id" TEXT NOT NULL,
    "investor_id" TEXT NOT NULL,
    "equipment_id" TEXT NOT NULL,
    "amount_allocated" DECIMAL(12,2) NOT NULL,
    "investment_percentage" DECIMAL(5,2) NOT NULL,
    "profit_share" DECIMAL(5,2) NOT NULL,
    "total_profit_received" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "has_exited" BOOLEAN NOT NULL DEFAULT false,
    "exit_amount" DECIMAL(12,2),
    "exited_at" TIMESTAMP(3),
    "notes" TEXT,
    "allocated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investor_equipment_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_job_usages" (
    "id" TEXT NOT NULL,
    "equipment_id" TEXT NOT NULL,
    "order_id" TEXT,
    "booking_id" TEXT,
    "job_description" TEXT NOT NULL,
    "revenue" DECIMAL(12,2) NOT NULL,
    "material_cost" DECIMAL(12,2) NOT NULL,
    "labor_cost" DECIMAL(12,2) NOT NULL,
    "maintenance_cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax_cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "other_expenses" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_expenses" DECIMAL(12,2) NOT NULL,
    "net_profit" DECIMAL(12,2) NOT NULL,
    "company_profit" DECIMAL(12,2) NOT NULL,
    "investor_pool_profit" DECIMAL(12,2) NOT NULL,
    "profit_distributed" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "job_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_job_usages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_transactions" (
    "id" TEXT NOT NULL,
    "investor_id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "balance_after" DECIMAL(12,2) NOT NULL,
    "profit_after" DECIMAL(12,2) NOT NULL,
    "product_id" TEXT,
    "equipment_id" TEXT,
    "withdrawal_id" TEXT,
    "order_id" TEXT,
    "description" TEXT NOT NULL,
    "notes" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "investor_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profit_distributions" (
    "id" TEXT NOT NULL,
    "investor_id" TEXT NOT NULL,
    "order_id" TEXT,
    "equipment_id" TEXT,
    "product_id" TEXT,
    "sale_revenue" DECIMAL(12,2) NOT NULL,
    "sale_cost" DECIMAL(12,2) NOT NULL,
    "gross_profit" DECIMAL(12,2) NOT NULL,
    "company_share" DECIMAL(12,2) NOT NULL,
    "investor_share" DECIMAL(12,2) NOT NULL,
    "capital_returned" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "notes" TEXT,
    "distributed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profit_distributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdrawal_requests" (
    "id" TEXT NOT NULL,
    "investor_id" TEXT NOT NULL,
    "request_number" TEXT NOT NULL,
    "type" "WithdrawalType" NOT NULL,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'pending',
    "amount" DECIMAL(12,2) NOT NULL,
    "approved_amount" DECIMAL(12,2),
    "product_id" TEXT,
    "variant_id" TEXT,
    "equipment_id" TEXT,
    "quantity" INTEGER,
    "request_reason" TEXT,
    "investor_notes" TEXT,
    "admin_notes" TEXT,
    "rejection_reason" TEXT,
    "requested_by" TEXT NOT NULL,
    "reviewed_by" TEXT,
    "processed_by" TEXT,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "withdrawal_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "investors_user_id_key" ON "investors"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "investors_investor_number_key" ON "investors"("investor_number");

-- CreateIndex
CREATE UNIQUE INDEX "investors_email_key" ON "investors"("email");

-- CreateIndex
CREATE INDEX "investors_user_id_idx" ON "investors"("user_id");

-- CreateIndex
CREATE INDEX "investors_email_idx" ON "investors"("email");

-- CreateIndex
CREATE INDEX "investors_investor_number_idx" ON "investors"("investor_number");

-- CreateIndex
CREATE INDEX "investors_status_idx" ON "investors"("status");

-- CreateIndex
CREATE INDEX "investors_is_verified_idx" ON "investors"("is_verified");

-- CreateIndex
CREATE INDEX "investor_deposits_investor_id_idx" ON "investor_deposits"("investor_id");

-- CreateIndex
CREATE INDEX "investor_deposits_deposited_at_idx" ON "investor_deposits"("deposited_at");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_equipment_number_key" ON "equipment"("equipment_number");

-- CreateIndex
CREATE INDEX "equipment_equipment_number_idx" ON "equipment"("equipment_number");

-- CreateIndex
CREATE INDEX "equipment_status_idx" ON "equipment"("status");

-- CreateIndex
CREATE INDEX "equipment_category_idx" ON "equipment"("category");

-- CreateIndex
CREATE INDEX "investor_product_allocations_investor_id_idx" ON "investor_product_allocations"("investor_id");

-- CreateIndex
CREATE INDEX "investor_product_allocations_product_id_idx" ON "investor_product_allocations"("product_id");

-- CreateIndex
CREATE INDEX "investor_product_allocations_variant_id_idx" ON "investor_product_allocations"("variant_id");

-- CreateIndex
CREATE INDEX "investor_product_allocations_allocated_at_idx" ON "investor_product_allocations"("allocated_at");

-- CreateIndex
CREATE INDEX "investor_equipment_allocations_investor_id_idx" ON "investor_equipment_allocations"("investor_id");

-- CreateIndex
CREATE INDEX "investor_equipment_allocations_equipment_id_idx" ON "investor_equipment_allocations"("equipment_id");

-- CreateIndex
CREATE INDEX "investor_equipment_allocations_has_exited_idx" ON "investor_equipment_allocations"("has_exited");

-- CreateIndex
CREATE INDEX "equipment_job_usages_equipment_id_idx" ON "equipment_job_usages"("equipment_id");

-- CreateIndex
CREATE INDEX "equipment_job_usages_order_id_idx" ON "equipment_job_usages"("order_id");

-- CreateIndex
CREATE INDEX "equipment_job_usages_booking_id_idx" ON "equipment_job_usages"("booking_id");

-- CreateIndex
CREATE INDEX "equipment_job_usages_job_date_idx" ON "equipment_job_usages"("job_date");

-- CreateIndex
CREATE INDEX "equipment_job_usages_profit_distributed_idx" ON "equipment_job_usages"("profit_distributed");

-- CreateIndex
CREATE INDEX "investor_transactions_investor_id_idx" ON "investor_transactions"("investor_id");

-- CreateIndex
CREATE INDEX "investor_transactions_type_idx" ON "investor_transactions"("type");

-- CreateIndex
CREATE INDEX "investor_transactions_created_at_idx" ON "investor_transactions"("created_at");

-- CreateIndex
CREATE INDEX "profit_distributions_investor_id_idx" ON "profit_distributions"("investor_id");

-- CreateIndex
CREATE INDEX "profit_distributions_order_id_idx" ON "profit_distributions"("order_id");

-- CreateIndex
CREATE INDEX "profit_distributions_equipment_id_idx" ON "profit_distributions"("equipment_id");

-- CreateIndex
CREATE INDEX "profit_distributions_product_id_idx" ON "profit_distributions"("product_id");

-- CreateIndex
CREATE INDEX "profit_distributions_distributed_at_idx" ON "profit_distributions"("distributed_at");

-- CreateIndex
CREATE UNIQUE INDEX "withdrawal_requests_request_number_key" ON "withdrawal_requests"("request_number");

-- CreateIndex
CREATE INDEX "withdrawal_requests_investor_id_idx" ON "withdrawal_requests"("investor_id");

-- CreateIndex
CREATE INDEX "withdrawal_requests_request_number_idx" ON "withdrawal_requests"("request_number");

-- CreateIndex
CREATE INDEX "withdrawal_requests_type_idx" ON "withdrawal_requests"("type");

-- CreateIndex
CREATE INDEX "withdrawal_requests_status_idx" ON "withdrawal_requests"("status");

-- CreateIndex
CREATE INDEX "withdrawal_requests_requested_at_idx" ON "withdrawal_requests"("requested_at");

-- AddForeignKey
ALTER TABLE "investors" ADD CONSTRAINT "investors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investor_deposits" ADD CONSTRAINT "investor_deposits_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "investors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investor_product_allocations" ADD CONSTRAINT "investor_product_allocations_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "investors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investor_product_allocations" ADD CONSTRAINT "investor_product_allocations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investor_product_allocations" ADD CONSTRAINT "investor_product_allocations_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investor_equipment_allocations" ADD CONSTRAINT "investor_equipment_allocations_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "investors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investor_equipment_allocations" ADD CONSTRAINT "investor_equipment_allocations_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_job_usages" ADD CONSTRAINT "equipment_job_usages_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_job_usages" ADD CONSTRAINT "equipment_job_usages_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_job_usages" ADD CONSTRAINT "equipment_job_usages_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "service_bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investor_transactions" ADD CONSTRAINT "investor_transactions_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "investors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profit_distributions" ADD CONSTRAINT "profit_distributions_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "investors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawal_requests" ADD CONSTRAINT "withdrawal_requests_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "investors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

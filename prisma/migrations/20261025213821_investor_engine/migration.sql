-- AlterTable
ALTER TABLE "equipment" ADD COLUMN     "carried_loss" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "depreciation_start" TIMESTAMP(3),
ADD COLUMN     "floor_area_m2" DECIMAL(8,2),
ADD COLUMN     "power_kw" DECIMAL(8,3),
ADD COLUMN     "residual_value" DECIMAL(12,2),
ADD COLUMN     "total_units" BIGINT NOT NULL DEFAULT 1000000,
ADD COLUMN     "useful_life_months" INTEGER;

-- AlterTable
ALTER TABLE "equipment_job_usages" ADD COLUMN     "hours_used" DECIMAL(8,2),
ADD COLUMN     "period_id" TEXT;

-- CreateTable
CREATE TABLE "product_lots" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "variant_id" TEXT,
    "investor_id" TEXT NOT NULL,
    "units_milli" BIGINT NOT NULL,
    "original_units_milli" BIGINT NOT NULL,
    "unit_cost" BIGINT NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "allocation_id" TEXT,
    "agreement_version" INTEGER,
    "proposed_value_note" TEXT,
    "accepted_at" TIMESTAMP(3),
    "created_by_id" TEXT,
    "closed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_lots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lot_sales" (
    "id" TEXT NOT NULL,
    "lot_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "order_item_id" TEXT NOT NULL,
    "investor_id" TEXT NOT NULL,
    "units_milli" BIGINT NOT NULL,
    "revenue" BIGINT NOT NULL,
    "cost" BIGINT NOT NULL,
    "profit" BIGINT NOT NULL,
    "investor_share" BIGINT NOT NULL,
    "capital_returned" BIGINT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "available_at" TIMESTAMP(3) NOT NULL,
    "released_at" TIMESTAMP(3),
    "returned_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lot_sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_holdings" (
    "id" TEXT NOT NULL,
    "equipment_id" TEXT NOT NULL,
    "holder_type" TEXT NOT NULL,
    "investor_id" TEXT,
    "units" BIGINT NOT NULL,
    "cost_basis" BIGINT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "legacy_allocation_id" TEXT,
    "agreement_version" INTEGER,
    "acquired_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exited_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_holdings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_periods" (
    "id" TEXT NOT NULL,
    "equipment_id" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "revenue" BIGINT NOT NULL,
    "direct_costs" BIGINT NOT NULL,
    "electricity" BIGINT NOT NULL,
    "rent" BIGINT NOT NULL,
    "depreciation" BIGINT NOT NULL,
    "profit" BIGINT NOT NULL,
    "loss_brought_in" BIGINT NOT NULL,
    "loss_recovered" BIGINT NOT NULL,
    "loss_carried_out" BIGINT NOT NULL,
    "distributable" BIGINT NOT NULL,
    "company_share" BIGINT NOT NULL,
    "investor_pool" BIGINT NOT NULL,
    "details" JSONB NOT NULL DEFAULT '{}',
    "closed_by_id" TEXT,
    "closed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "equipment_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shared_costs" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "amount" BIGINT NOT NULL,
    "total_kwh" DECIMAL(12,2),
    "total_area_m2" DECIMAL(10,2),
    "notes" TEXT,
    "created_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shared_costs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_agreement_versions" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body_en" TEXT NOT NULL,
    "body_fr" TEXT NOT NULL,
    "risks_en" TEXT NOT NULL,
    "risks_fr" TEXT NOT NULL,
    "rules" JSONB NOT NULL,
    "published_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" TEXT,

    CONSTRAINT "investor_agreement_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_agreement_acceptances" (
    "id" TEXT NOT NULL,
    "investor_id" TEXT NOT NULL,
    "version_id" TEXT NOT NULL,
    "typed_name" TEXT NOT NULL,
    "risks_acknowledged" JSONB NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "ip" TEXT,
    "user_agent" TEXT,
    "accepted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "investor_agreement_acceptances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_exits" (
    "id" TEXT NOT NULL,
    "investor_id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "lot_id" TEXT,
    "holding_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'requested',
    "option" TEXT,
    "notice_ends_at" TIMESTAMP(3) NOT NULL,
    "valuation" BIGINT,
    "valuation_method" TEXT,
    "price" BIGINT,
    "buyer_investor_id" TEXT,
    "instalments" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "handled_by_id" TEXT,

    CONSTRAINT "investor_exits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_lots_allocation_id_key" ON "product_lots"("allocation_id");

-- CreateIndex
CREATE INDEX "product_lots_product_id_variant_id_status_idx" ON "product_lots"("product_id", "variant_id", "status");

-- CreateIndex
CREATE INDEX "product_lots_investor_id_idx" ON "product_lots"("investor_id");

-- CreateIndex
CREATE INDEX "lot_sales_order_id_idx" ON "lot_sales"("order_id");

-- CreateIndex
CREATE INDEX "lot_sales_investor_id_idx" ON "lot_sales"("investor_id");

-- CreateIndex
CREATE INDEX "lot_sales_status_available_at_idx" ON "lot_sales"("status", "available_at");

-- CreateIndex
CREATE UNIQUE INDEX "lot_sales_lot_id_order_item_id_key" ON "lot_sales"("lot_id", "order_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_holdings_legacy_allocation_id_key" ON "equipment_holdings"("legacy_allocation_id");

-- CreateIndex
CREATE INDEX "equipment_holdings_equipment_id_status_idx" ON "equipment_holdings"("equipment_id", "status");

-- CreateIndex
CREATE INDEX "equipment_holdings_investor_id_idx" ON "equipment_holdings"("investor_id");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_periods_equipment_id_period_start_key" ON "equipment_periods"("equipment_id", "period_start");

-- CreateIndex
CREATE UNIQUE INDEX "shared_costs_kind_period_start_key" ON "shared_costs"("kind", "period_start");

-- CreateIndex
CREATE UNIQUE INDEX "investor_agreement_versions_version_key" ON "investor_agreement_versions"("version");

-- CreateIndex
CREATE INDEX "investor_agreement_acceptances_investor_id_idx" ON "investor_agreement_acceptances"("investor_id");

-- CreateIndex
CREATE UNIQUE INDEX "investor_agreement_acceptances_investor_id_version_id_key" ON "investor_agreement_acceptances"("investor_id", "version_id");

-- CreateIndex
CREATE INDEX "investor_exits_investor_id_idx" ON "investor_exits"("investor_id");

-- CreateIndex
CREATE INDEX "investor_exits_status_idx" ON "investor_exits"("status");

-- AddForeignKey
ALTER TABLE "lot_sales" ADD CONSTRAINT "lot_sales_lot_id_fkey" FOREIGN KEY ("lot_id") REFERENCES "product_lots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_holdings" ADD CONSTRAINT "equipment_holdings_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_periods" ADD CONSTRAINT "equipment_periods_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investor_agreement_acceptances" ADD CONSTRAINT "investor_agreement_acceptances_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "investor_agreement_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

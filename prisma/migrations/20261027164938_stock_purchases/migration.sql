-- CreateEnum
CREATE TYPE "StockPurchaseStatus" AS ENUM ('waiting_payout', 'open', 'received', 'cancelled');

-- AlterEnum
ALTER TYPE "PayoutReason" ADD VALUE 'stock_purchase';

-- AlterTable
ALTER TABLE "product_lots" ADD COLUMN     "purchase_id" TEXT;

-- CreateTable
CREATE TABLE "stock_purchases" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "status" "StockPurchaseStatus" NOT NULL DEFAULT 'open',
    "source" TEXT NOT NULL,
    "buyer_name" TEXT NOT NULL,
    "buyer_phone" TEXT,
    "payout_id" TEXT,
    "amount" BIGINT NOT NULL,
    "company_amount" BIGINT NOT NULL DEFAULT 0,
    "spent" BIGINT,
    "transport" BIGINT NOT NULL DEFAULT 0,
    "change_returned" BIGINT,
    "change_into" TEXT,
    "receipt_urls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "created_by_id" TEXT NOT NULL,
    "received_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "received_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),

    CONSTRAINT "stock_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_purchase_fundings" (
    "id" TEXT NOT NULL,
    "purchase_id" TEXT NOT NULL,
    "investor_id" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "used" BIGINT,
    "returned" BIGINT,

    CONSTRAINT "stock_purchase_fundings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_purchase_lines" (
    "id" TEXT NOT NULL,
    "purchase_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "variant_id" TEXT,
    "product_name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "line_total" BIGINT NOT NULL,
    "transport_share" BIGINT NOT NULL,
    "unit_cost" BIGINT NOT NULL,

    CONSTRAINT "stock_purchase_lines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stock_purchases_number_key" ON "stock_purchases"("number");

-- CreateIndex
CREATE INDEX "stock_purchases_status_idx" ON "stock_purchases"("status");

-- CreateIndex
CREATE INDEX "stock_purchase_fundings_investor_id_idx" ON "stock_purchase_fundings"("investor_id");

-- CreateIndex
CREATE UNIQUE INDEX "stock_purchase_fundings_purchase_id_investor_id_key" ON "stock_purchase_fundings"("purchase_id", "investor_id");

-- CreateIndex
CREATE INDEX "stock_purchase_lines_product_id_idx" ON "stock_purchase_lines"("product_id");

-- AddForeignKey
ALTER TABLE "stock_purchase_fundings" ADD CONSTRAINT "stock_purchase_fundings_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "stock_purchases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_purchase_lines" ADD CONSTRAINT "stock_purchase_lines_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "stock_purchases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "booking_payments" ADD COLUMN     "collection_reference" TEXT,
ADD COLUMN     "confirmed_by_id" TEXT;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "payment_due_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "repair_payments" ADD COLUMN     "collection_reference" TEXT;

-- CreateTable
CREATE TABLE "driver_cash_handovers" (
    "id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "held_before" BIGINT NOT NULL,
    "received_by_id" TEXT NOT NULL,
    "into_account" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "driver_cash_handovers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "driver_cash_handovers_driver_id_created_at_idx" ON "driver_cash_handovers"("driver_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "booking_payments_collection_reference_key" ON "booking_payments"("collection_reference");

-- CreateIndex
CREATE UNIQUE INDEX "repair_payments_collection_reference_key" ON "repair_payments"("collection_reference");

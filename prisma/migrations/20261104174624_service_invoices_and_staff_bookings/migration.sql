-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('draft', 'issued', 'void');

-- CreateEnum
CREATE TYPE "InvoiceLineKind" AS ENUM ('labour', 'material', 'part', 'travel', 'fee', 'other');

-- AlterTable
ALTER TABLE "service_bookings" ADD COLUMN     "created_by_id" TEXT,
ADD COLUMN     "service_address" TEXT,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'online',
ALTER COLUMN "customer_email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "service_invoices" (
    "id" TEXT NOT NULL,
    "number" TEXT,
    "booking_id" TEXT NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'draft',
    "access_token" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_email" TEXT,
    "customer_phone" TEXT,
    "customer_address" TEXT,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL,
    "notes" TEXT,
    "due_date" TIMESTAMP(3),
    "issued_at" TIMESTAMP(3),
    "issued_by_id" TEXT,
    "sent_at" TIMESTAMP(3),
    "paid_at" TIMESTAMP(3),
    "voided_at" TIMESTAMP(3),
    "voided_by_id" TEXT,
    "void_reason" TEXT,
    "created_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_invoice_lines" (
    "id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "kind" "InvoiceLineKind" NOT NULL DEFAULT 'other',
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "service_invoice_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_sequences" (
    "key" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_sequences_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "service_invoices_number_key" ON "service_invoices"("number");

-- CreateIndex
CREATE UNIQUE INDEX "service_invoices_access_token_key" ON "service_invoices"("access_token");

-- CreateIndex
CREATE INDEX "service_invoices_booking_id_idx" ON "service_invoices"("booking_id");

-- CreateIndex
CREATE INDEX "service_invoices_status_idx" ON "service_invoices"("status");

-- CreateIndex
CREATE INDEX "service_invoices_issued_at_idx" ON "service_invoices"("issued_at");

-- CreateIndex
CREATE INDEX "service_invoice_lines_invoice_id_idx" ON "service_invoice_lines"("invoice_id");

-- AddForeignKey
ALTER TABLE "service_invoices" ADD CONSTRAINT "service_invoices_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "service_bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_invoice_lines" ADD CONSTRAINT "service_invoice_lines_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "service_invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- A booking has at most one invoice that is not void (drafts included)
CREATE UNIQUE INDEX "service_invoices_one_open_per_booking" ON "service_invoices"("booking_id") WHERE "status" <> 'void';

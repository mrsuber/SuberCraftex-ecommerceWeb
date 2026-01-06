-- CreateEnum
CREATE TYPE "POSSessionStatus" AS ENUM ('open', 'closed', 'suspended');

-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'mobile_payment';

-- AlterEnum
ALTER TYPE "ShippingMethod" ADD VALUE 'in_store';

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'cashier';

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "amount_tendered" DECIMAL(10,2),
ADD COLUMN     "cashier_id" TEXT,
ADD COLUMN     "change_given" DECIMAL(10,2),
ADD COLUMN     "customer_name" TEXT,
ADD COLUMN     "customer_phone" TEXT,
ADD COLUMN     "is_pos_order" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pos_session_id" TEXT,
ALTER COLUMN "shipping_address" DROP NOT NULL,
ALTER COLUMN "billing_address" DROP NOT NULL;

-- CreateTable
CREATE TABLE "cashiers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "photo_url" TEXT,
    "employee_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "total_sales" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_orders" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cashiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos_sessions" (
    "id" TEXT NOT NULL,
    "session_number" TEXT NOT NULL,
    "cashier_id" TEXT NOT NULL,
    "status" "POSSessionStatus" NOT NULL DEFAULT 'open',
    "opening_balance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "closing_balance" DECIMAL(10,2),
    "expected_cash" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "actual_cash" DECIMAL(10,2),
    "cash_difference" DECIMAL(10,2),
    "total_sales" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_orders" INTEGER NOT NULL DEFAULT 0,
    "total_cash" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_card" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_mobile" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "opened_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pos_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cashiers_user_id_key" ON "cashiers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "cashiers_employee_id_key" ON "cashiers"("employee_id");

-- CreateIndex
CREATE INDEX "cashiers_user_id_idx" ON "cashiers"("user_id");

-- CreateIndex
CREATE INDEX "cashiers_is_active_idx" ON "cashiers"("is_active");

-- CreateIndex
CREATE INDEX "cashiers_employee_id_idx" ON "cashiers"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "pos_sessions_session_number_key" ON "pos_sessions"("session_number");

-- CreateIndex
CREATE INDEX "pos_sessions_cashier_id_idx" ON "pos_sessions"("cashier_id");

-- CreateIndex
CREATE INDEX "pos_sessions_status_idx" ON "pos_sessions"("status");

-- CreateIndex
CREATE INDEX "pos_sessions_opened_at_idx" ON "pos_sessions"("opened_at");

-- CreateIndex
CREATE INDEX "orders_cashier_id_idx" ON "orders"("cashier_id");

-- CreateIndex
CREATE INDEX "orders_pos_session_id_idx" ON "orders"("pos_session_id");

-- CreateIndex
CREATE INDEX "orders_is_pos_order_idx" ON "orders"("is_pos_order");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_cashier_id_fkey" FOREIGN KEY ("cashier_id") REFERENCES "cashiers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_pos_session_id_fkey" FOREIGN KEY ("pos_session_id") REFERENCES "pos_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashiers" ADD CONSTRAINT "cashiers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_sessions" ADD CONSTRAINT "pos_sessions_cashier_id_fkey" FOREIGN KEY ("cashier_id") REFERENCES "cashiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

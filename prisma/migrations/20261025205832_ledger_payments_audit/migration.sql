-- CreateEnum
CREATE TYPE "LedgerAccountKind" AS ENUM ('asset', 'liability', 'equity', 'income', 'expense');

-- CreateEnum
CREATE TYPE "CollectionStatus" AS ENUM ('pending', 'succeeded', 'failed', 'expired');

-- CreateEnum
CREATE TYPE "CollectionPurpose" AS ENUM ('order', 'pos_order', 'booking', 'repair', 'investor_deposit', 'apprentice_fee');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('awaiting_approval', 'pending', 'processing', 'succeeded', 'failed', 'rejected', 'review');

-- CreateEnum
CREATE TYPE "PayoutReason" AS ENUM ('investor_withdrawal', 'salary', 'customer_refund');

-- CreateTable
CREATE TABLE "ledger_accounts" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "kind" "LedgerAccountKind" NOT NULL,
    "name" TEXT NOT NULL,
    "owner_type" TEXT,
    "owner_id" TEXT,
    "balance" BIGINT NOT NULL DEFAULT 0,
    "allow_negative" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger_transactions" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_by_id" TEXT,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reverses_id" TEXT,

    CONSTRAINT "ledger_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger_entries" (
    "id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "balance_after" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_collections" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "purpose" "CollectionPurpose" NOT NULL,
    "target_id" TEXT NOT NULL,
    "user_id" TEXT,
    "amount" BIGINT NOT NULL,
    "phone" TEXT NOT NULL,
    "provider" TEXT,
    "status" "CollectionStatus" NOT NULL DEFAULT 'pending',
    "provider_reference" TEXT,
    "provider_status" TEXT,
    "failure_reason" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "expires_at" TIMESTAMP(3),
    "last_checked_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payouts" (
    "id" TEXT NOT NULL,
    "reason" "PayoutReason" NOT NULL,
    "source_account_key" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "recipient_name" TEXT,
    "amount" BIGINT NOT NULL,
    "fee" BIGINT NOT NULL DEFAULT 0,
    "fee_paid_by_company" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "related_id" TEXT,
    "status" "PayoutStatus" NOT NULL DEFAULT 'awaiting_approval',
    "camsol_reference" TEXT,
    "failure_reason" TEXT,
    "approved_by_id" TEXT,
    "approved_at" TIMESTAMP(3),
    "rejected_by_id" TEXT,
    "resolved_by_id" TEXT,
    "last_checked_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actor_id" TEXT,
    "actor_email" TEXT,
    "action" TEXT NOT NULL,
    "target_type" TEXT,
    "target_id" TEXT,
    "details" JSONB NOT NULL DEFAULT '{}',
    "ip" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ledger_accounts_key_key" ON "ledger_accounts"("key");

-- CreateIndex
CREATE INDEX "ledger_accounts_owner_type_owner_id_idx" ON "ledger_accounts"("owner_type", "owner_id");

-- CreateIndex
CREATE INDEX "ledger_accounts_kind_idx" ON "ledger_accounts"("kind");

-- CreateIndex
CREATE UNIQUE INDEX "ledger_transactions_reference_key" ON "ledger_transactions"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "ledger_transactions_reverses_id_key" ON "ledger_transactions"("reverses_id");

-- CreateIndex
CREATE INDEX "ledger_transactions_type_idx" ON "ledger_transactions"("type");

-- CreateIndex
CREATE INDEX "ledger_transactions_occurred_at_idx" ON "ledger_transactions"("occurred_at");

-- CreateIndex
CREATE INDEX "ledger_entries_account_id_created_at_idx" ON "ledger_entries"("account_id", "created_at");

-- CreateIndex
CREATE INDEX "ledger_entries_transaction_id_idx" ON "ledger_entries"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_collections_reference_key" ON "payment_collections"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "payment_collections_provider_reference_key" ON "payment_collections"("provider_reference");

-- CreateIndex
CREATE INDEX "payment_collections_status_created_at_idx" ON "payment_collections"("status", "created_at");

-- CreateIndex
CREATE INDEX "payment_collections_purpose_target_id_idx" ON "payment_collections"("purpose", "target_id");

-- CreateIndex
CREATE INDEX "payment_collections_user_id_idx" ON "payment_collections"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "payouts_camsol_reference_key" ON "payouts"("camsol_reference");

-- CreateIndex
CREATE INDEX "payouts_status_created_at_idx" ON "payouts"("status", "created_at");

-- CreateIndex
CREATE INDEX "payouts_user_id_idx" ON "payouts"("user_id");

-- CreateIndex
CREATE INDEX "payouts_reason_related_id_idx" ON "payouts"("reason", "related_id");

-- CreateIndex
CREATE INDEX "audit_logs_target_type_target_id_idx" ON "audit_logs"("target_type", "target_id");

-- CreateIndex
CREATE INDEX "audit_logs_actor_id_idx" ON "audit_logs"("actor_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- AddForeignKey
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "ledger_transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "ledger_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

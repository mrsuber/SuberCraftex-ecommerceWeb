-- AlterTable
ALTER TABLE "investor_exits" ADD COLUMN     "bought_back_milli" BIGINT,
ADD COLUMN     "collected_units" INTEGER,
ADD COLUMN     "handed_over_at" TIMESTAMP(3),
ADD COLUMN     "handed_over_by_id" TEXT,
ADD COLUMN     "handover_note" TEXT,
ADD COLUMN     "investor_confirmed_at" TIMESTAMP(3),
ADD COLUMN     "investor_dispute_note" TEXT,
ADD COLUMN     "requested_option" TEXT,
ADD COLUMN     "units_milli" BIGINT;

-- AlterTable
ALTER TABLE "investors" ADD COLUMN     "suspended_at" TIMESTAMP(3),
ADD COLUMN     "suspended_by_id" TEXT,
ADD COLUMN     "suspended_reason" TEXT;

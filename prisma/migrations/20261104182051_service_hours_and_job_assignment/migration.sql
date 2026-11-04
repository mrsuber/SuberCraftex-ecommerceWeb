-- AlterTable
ALTER TABLE "service_bookings" ADD COLUMN     "assigned_at" TIMESTAMP(3),
ADD COLUMN     "assigned_to_id" TEXT;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "max_advance_days" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "min_notice_minutes" INTEGER NOT NULL DEFAULT 30;

-- CreateIndex
CREATE INDEX "service_bookings_assigned_to_id_idx" ON "service_bookings"("assigned_to_id");

-- AddForeignKey
ALTER TABLE "service_bookings" ADD CONSTRAINT "service_bookings_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

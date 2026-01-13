/*
  Warnings:

  - The `status` column on the `fitting_appointments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "FittingStatus" AS ENUM ('scheduled', 'customer_called', 'completed', 'no_show', 'rescheduled', 'cancelled');

-- AlterTable
ALTER TABLE "fitting_appointments" DROP COLUMN "status",
ADD COLUMN     "status" "FittingStatus" NOT NULL DEFAULT 'scheduled';

-- CreateIndex
CREATE INDEX "fitting_appointments_status_idx" ON "fitting_appointments"("status");

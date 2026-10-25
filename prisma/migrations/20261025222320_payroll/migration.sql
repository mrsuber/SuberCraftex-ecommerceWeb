-- CreateEnum
CREATE TYPE "PayrollRunStatus" AS ENUM ('draft', 'approved', 'cancelled');

-- CreateEnum
CREATE TYPE "SalaryAdvanceStatus" AS ENUM ('requested', 'approved', 'rejected', 'repaid');

-- CreateEnum
CREATE TYPE "StaffChargeStatus" AS ENUM ('proposed', 'acknowledged', 'disputed', 'recovered', 'withdrawn');

-- AlterEnum
ALTER TYPE "PayoutReason" ADD VALUE 'salary_advance';

-- AlterTable
ALTER TABLE "equipment_job_usages" ADD COLUMN     "operator_user_id" TEXT;

-- CreateTable
CREATE TABLE "staff_pay" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "monthly_salary" BIGINT NOT NULL,
    "payout_phone" TEXT,
    "deduction_codes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "income_tax" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_pay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_runs" (
    "id" TEXT NOT NULL,
    "period_start" DATE NOT NULL,
    "status" "PayrollRunStatus" NOT NULL DEFAULT 'draft',
    "total_gross" BIGINT NOT NULL DEFAULT 0,
    "total_net" BIGINT NOT NULL DEFAULT 0,
    "total_employer" BIGINT NOT NULL DEFAULT 0,
    "prepared_by_id" TEXT NOT NULL,
    "approved_by_id" TEXT,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_lines" (
    "id" TEXT NOT NULL,
    "run_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "base_salary" BIGINT NOT NULL,
    "unpaid_days" INTEGER NOT NULL DEFAULT 0,
    "bonus" BIGINT NOT NULL DEFAULT 0,
    "bonus_note" TEXT,
    "gross" BIGINT NOT NULL,
    "deductions" JSONB NOT NULL DEFAULT '[]',
    "employer_charges" JSONB NOT NULL DEFAULT '[]',
    "advance_recovered" BIGINT NOT NULL DEFAULT 0,
    "charges_recovered" BIGINT NOT NULL DEFAULT 0,
    "net" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_advances" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "SalaryAdvanceStatus" NOT NULL DEFAULT 'requested',
    "monthly_recovery" BIGINT NOT NULL,
    "recovered" BIGINT NOT NULL DEFAULT 0,
    "paid_by" TEXT,
    "payout_id" TEXT,
    "decided_by_id" TEXT,
    "decided_at" TIMESTAMP(3),
    "decision_note" TEXT,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "salary_advances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_charges" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "StaffChargeStatus" NOT NULL DEFAULT 'proposed',
    "recovered" BIGINT NOT NULL DEFAULT 0,
    "settles_account_key" TEXT,
    "employee_note" TEXT,
    "created_by_id" TEXT NOT NULL,
    "responded_at" TIMESTAMP(3),
    "decided_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_charges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "staff_pay_user_id_key" ON "staff_pay"("user_id");

-- CreateIndex
CREATE INDEX "staff_pay_is_active_idx" ON "staff_pay"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_runs_period_start_key" ON "payroll_runs"("period_start");

-- CreateIndex
CREATE INDEX "payroll_lines_user_id_idx" ON "payroll_lines"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_lines_run_id_user_id_key" ON "payroll_lines"("run_id", "user_id");

-- CreateIndex
CREATE INDEX "salary_advances_user_id_status_idx" ON "salary_advances"("user_id", "status");

-- CreateIndex
CREATE INDEX "staff_charges_user_id_status_idx" ON "staff_charges"("user_id", "status");

-- AddForeignKey
ALTER TABLE "staff_pay" ADD CONSTRAINT "staff_pay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_lines" ADD CONSTRAINT "payroll_lines_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "payroll_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_lines" ADD CONSTRAINT "payroll_lines_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_advances" ADD CONSTRAINT "salary_advances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_charges" ADD CONSTRAINT "staff_charges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

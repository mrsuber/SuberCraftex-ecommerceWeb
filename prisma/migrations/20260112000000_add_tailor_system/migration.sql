-- Add tailor to UserRole enum
ALTER TYPE "UserRole" ADD VALUE 'tailor';

-- Create Tailor table
CREATE TABLE "tailors" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "photo_url" TEXT,
    "employee_id" TEXT,
    "specialties" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "total_orders" INTEGER NOT NULL DEFAULT 0,
    "average_rating" DECIMAL(3,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tailors_pkey" PRIMARY KEY ("id")
);

-- Create Measurement table
CREATE TABLE "measurements" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "tailor_id" TEXT NOT NULL,
    "measurements" JSONB NOT NULL,
    "notes" TEXT,
    "customer_signature_url" TEXT,
    "taken_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "measurements_pkey" PRIMARY KEY ("id")
);

-- Create FittingAppointment table
CREATE TABLE "fitting_appointments" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "tailor_id" TEXT NOT NULL,
    "scheduled_date" TIMESTAMP(3) NOT NULL,
    "scheduled_time" TEXT NOT NULL,
    "duration_minutes" INTEGER NOT NULL DEFAULT 30,
    "customer_called" BOOLEAN NOT NULL DEFAULT false,
    "called_at" TIMESTAMP(3),
    "called_by" TEXT,
    "attended" BOOLEAN,
    "attended_at" TIMESTAMP(3),
    "notes" TEXT,
    "fitting_number" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fitting_appointments_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX "tailors_user_id_key" ON "tailors"("user_id");
CREATE UNIQUE INDEX "tailors_employee_id_key" ON "tailors"("employee_id");
CREATE UNIQUE INDEX "measurements_booking_id_key" ON "measurements"("booking_id");

-- Create indexes for efficient queries
CREATE INDEX "tailors_user_id_idx" ON "tailors"("user_id");
CREATE INDEX "tailors_is_active_idx" ON "tailors"("is_active");
CREATE INDEX "tailors_employee_id_idx" ON "tailors"("employee_id");

CREATE INDEX "measurements_booking_id_idx" ON "measurements"("booking_id");
CREATE INDEX "measurements_tailor_id_idx" ON "measurements"("tailor_id");
CREATE INDEX "measurements_taken_at_idx" ON "measurements"("taken_at");

CREATE INDEX "fitting_appointments_booking_id_idx" ON "fitting_appointments"("booking_id");
CREATE INDEX "fitting_appointments_tailor_id_idx" ON "fitting_appointments"("tailor_id");
CREATE INDEX "fitting_appointments_scheduled_date_idx" ON "fitting_appointments"("scheduled_date");
CREATE INDEX "fitting_appointments_status_idx" ON "fitting_appointments"("status");

-- Add foreign key constraints
ALTER TABLE "tailors" ADD CONSTRAINT "tailors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "measurements" ADD CONSTRAINT "measurements_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "service_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_tailor_id_fkey" FOREIGN KEY ("tailor_id") REFERENCES "tailors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "fitting_appointments" ADD CONSTRAINT "fitting_appointments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "service_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "fitting_appointments" ADD CONSTRAINT "fitting_appointments_tailor_id_fkey" FOREIGN KEY ("tailor_id") REFERENCES "tailors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

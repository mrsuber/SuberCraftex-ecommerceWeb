-- CreateEnum
CREATE TYPE "ScheduleEventKind" AS ENUM ('shift', 'meeting', 'training', 'maintenance', 'leave', 'delivery_run', 'other');

-- CreateTable
CREATE TABLE "schedule_events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "kind" "ScheduleEventKind" NOT NULL DEFAULT 'other',
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "is_all_day" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT,
    "roles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "equipment_id" TEXT,
    "created_by_id" TEXT NOT NULL,
    "cancelled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedule_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_event_attendees" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "response" TEXT NOT NULL DEFAULT 'invited',

    CONSTRAINT "schedule_event_attendees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "schedule_events_start_time_idx" ON "schedule_events"("start_time");

-- CreateIndex
CREATE INDEX "schedule_events_end_time_idx" ON "schedule_events"("end_time");

-- CreateIndex
CREATE INDEX "schedule_event_attendees_user_id_idx" ON "schedule_event_attendees"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "schedule_event_attendees_event_id_user_id_key" ON "schedule_event_attendees"("event_id", "user_id");

-- AddForeignKey
ALTER TABLE "schedule_event_attendees" ADD CONSTRAINT "schedule_event_attendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "schedule_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_event_attendees" ADD CONSTRAINT "schedule_event_attendees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

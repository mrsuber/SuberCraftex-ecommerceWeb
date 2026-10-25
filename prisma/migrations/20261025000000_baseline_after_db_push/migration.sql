-- Baseline: everything production received through `prisma db push` after 2026-01-12.
-- Production already has these objects. Do NOT run this there; mark it applied:
--   npx prisma migrate resolve --applied 20261025000000_baseline_after_db_push
-- (see docs/DEPLOYMENT.md). Fresh databases (tests, new installs) run it normally.

-- CreateEnum
CREATE TYPE "ProductCondition" AS ENUM ('new', 'refurbished', 'used');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('not_started', 'pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('new_order', 'order_paid', 'order_cancelled', 'new_booking', 'booking_confirmed', 'booking_cancelled', 'new_deposit', 'deposit_confirmed', 'withdrawal_request', 'new_review', 'new_feedback', 'low_stock', 'kyc_submitted', 'quote_approved', 'system');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('low', 'normal', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('bug_report', 'feature_request', 'improvement', 'general', 'complaint');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('pending', 'under_review', 'in_progress', 'resolved', 'closed');

-- CreateEnum
CREATE TYPE "FeedbackPriority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "ApprenticeStatus" AS ENUM ('pending', 'active', 'on_hold', 'completed', 'terminated');

-- CreateEnum
CREATE TYPE "Department" AS ENUM ('tailoring', 'sales', 'delivery', 'operations', 'beadwork', 'henna', 'printing_press');

-- CreateEnum
CREATE TYPE "ServiceTrack" AS ENUM ('tailoring', 'device_repair', 'sales', 'delivery', 'operations', 'beadwork', 'henna', 'printing_press', 'embroidery', 'electronics', 'computing', 'woodworking_aerospace', 'leather_working', 'drawing_sketching', 'beauty_grooming', 'filmmaking');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('pending', 'in_progress', 'submitted', 'needs_revision', 'completed', 'overdue');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('active', 'completed', 'dropped', 'paused');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('class', 'meeting', 'assignment_deadline', 'workshop', 'exam', 'orientation', 'other');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('invited', 'confirmed', 'attended', 'missed', 'cancelled');

-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('one_week_before', 'three_days_before', 'one_day_before', 'three_hours_before', 'one_hour_before');

-- CreateEnum
CREATE TYPE "EventCreatorRole" AS ENUM ('admin', 'apprentice', 'mentor', 'system');

-- CreateEnum
CREATE TYPE "CalendarEventType" AS ENUM ('class', 'assignment_deadline', 'meeting', 'workshop', 'exam', 'orientation', 'free_period', 'personal_event', 'recurring_class', 'mentor_session', 'study_time', 'break', 'other');

-- CreateEnum
CREATE TYPE "CalendarEventStatus" AS ENUM ('pending', 'approved', 'rejected', 'scheduled', 'in_progress', 'completed', 'incomplete', 'cancelled');

-- CreateEnum
CREATE TYPE "EventEditRequestType" AS ENUM ('edit', 'postpone', 'cancel');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('phone', 'tablet', 'laptop', 'desktop', 'tv', 'gaming_console', 'audio_equipment', 'other');

-- CreateEnum
CREATE TYPE "RepairStatus" AS ENUM ('pending', 'received', 'diagnosing', 'diagnosed', 'quote_sent', 'quote_approved', 'quote_rejected', 'waiting_parts', 'in_repair', 'testing', 'ready_for_pickup', 'completed', 'cancelled');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "InventoryAction" ADD VALUE 'reserved';
ALTER TYPE "InventoryAction" ADD VALUE 'released';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'apprentice';
ALTER TYPE "UserRole" ADD VALUE 'technician';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "WithdrawalStatus" ADD VALUE 'awaiting_investor_confirmation';
ALTER TYPE "WithdrawalStatus" ADD VALUE 'confirmed';
ALTER TYPE "WithdrawalStatus" ADD VALUE 'disputed';

-- AlterTable
ALTER TABLE "addresses" ALTER COLUMN "postal_code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "investor_deposits" ADD COLUMN     "admin_confirmed_at" TIMESTAMP(3),
ADD COLUMN     "charges" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "confirmation_status" TEXT NOT NULL DEFAULT 'pending_confirmation',
ADD COLUMN     "confirmed_at" TIMESTAMP(3),
ADD COLUMN     "gross_amount" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "investor_notes" TEXT,
ADD COLUMN     "investor_receipt_url" TEXT;

-- AlterTable
ALTER TABLE "investors" ADD COLUMN     "id_document_back_url" TEXT,
ADD COLUMN     "kyc_rejection_reason" TEXT,
ADD COLUMN     "kyc_status" "KycStatus" NOT NULL DEFAULT 'not_started',
ADD COLUMN     "kyc_submitted_at" TIMESTAMP(3),
ADD COLUMN     "selfie_url" TEXT,
ALTER COLUMN "id_type" DROP NOT NULL,
ALTER COLUMN "id_number" DROP NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "pickup_deadline" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "condition" "ProductCondition" NOT NULL DEFAULT 'new',
ADD COLUMN     "device_specs" JSONB,
ADD COLUMN     "warranty_months" INTEGER;

-- AlterTable
ALTER TABLE "service_bookings" ADD COLUMN     "design_selections" JSONB;

-- AlterTable
ALTER TABLE "withdrawal_requests" ADD COLUMN     "admin_receipt_url" TEXT,
ADD COLUMN     "investor_confirmed_at" TIMESTAMP(3),
ADD COLUMN     "investor_feedback" TEXT,
ADD COLUMN     "momo_name" TEXT,
ADD COLUMN     "momo_number" TEXT,
ADD COLUMN     "momo_provider" TEXT;

-- CreateTable
CREATE TABLE "password_resets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_design_categories" (
    "id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_design_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_design_options" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_design_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_reviews" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upcoming_services" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "short_description" TEXT,
    "image_url" TEXT NOT NULL,
    "service_date" TIMESTAMP(3) NOT NULL,
    "service_id" TEXT,
    "cta_text" TEXT DEFAULT 'Learn More',
    "location" TEXT,
    "price" DECIMAL(10,2),
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "upcoming_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" "NotificationPriority" NOT NULL DEFAULT 'normal',
    "reference_id" TEXT,
    "reference_type" TEXT,
    "action_url" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMP(3),
    "read_by" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback" (
    "id" TEXT NOT NULL,
    "investor_id" TEXT,
    "user_id" TEXT,
    "user_email" TEXT,
    "user_name" TEXT,
    "type" "FeedbackType" NOT NULL DEFAULT 'general',
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "screenshots" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "videos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "FeedbackStatus" NOT NULL DEFAULT 'pending',
    "priority" "FeedbackPriority" NOT NULL DEFAULT 'medium',
    "app_version" TEXT,
    "device_info" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_responses" (
    "id" TEXT NOT NULL,
    "feedback_id" TEXT NOT NULL,
    "responder_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_internal" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apprentices" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "apprentice_number" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "photo_url" TEXT,
    "department" "Department" NOT NULL,
    "mentor_id" TEXT NOT NULL,
    "mentor_type" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "expected_end_date" TIMESTAMP(3),
    "actual_end_date" TIMESTAMP(3),
    "status" "ApprenticeStatus" NOT NULL DEFAULT 'pending',
    "emergency_contact_name" TEXT,
    "emergency_contact_phone" TEXT,
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "service_track" "ServiceTrack" NOT NULL DEFAULT 'tailoring',
    "can_work_on_real_jobs" BOOLEAN NOT NULL DEFAULT false,
    "real_jobs_completed" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apprentices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apprentice_enrollments" (
    "id" TEXT NOT NULL,
    "apprentice_id" TEXT NOT NULL,
    "service_track" "ServiceTrack" NOT NULL,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'active',
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completion_date" TIMESTAMP(3),
    "total_assignments" INTEGER NOT NULL DEFAULT 0,
    "completed_assignments" INTEGER NOT NULL DEFAULT 0,
    "progress_percentage" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apprentice_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignment_templates" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "module_number" TEXT NOT NULL,
    "assignment_number" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "instructions" TEXT,
    "objectives" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "expected_outcome" TEXT,
    "passing_criteria" TEXT,
    "reference_photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "video_url" TEXT,
    "estimated_hours" INTEGER,
    "difficulty" TEXT NOT NULL DEFAULT 'beginner',
    "prerequisite_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "service_track" "ServiceTrack" NOT NULL DEFAULT 'tailoring',
    "required_reading" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "cross_references" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignment_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apprentice_assignments" (
    "id" TEXT NOT NULL,
    "apprentice_id" TEXT NOT NULL,
    "enrollment_id" TEXT,
    "template_id" TEXT,
    "is_custom" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "instructions" TEXT,
    "assigned_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" TIMESTAMP(3),
    "completed_date" TIMESTAMP(3),
    "submitted_at" TIMESTAMP(3),
    "status" "AssignmentStatus" NOT NULL DEFAULT 'pending',
    "rating" INTEGER,
    "feedback" TEXT,
    "assignment_photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "submission_notes" TEXT,
    "submission_photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "submission_videos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "submission_documents" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "assigned_by" TEXT NOT NULL,
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apprentice_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignment_comments" (
    "id" TEXT NOT NULL,
    "assignment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignment_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apprentice_certificates" (
    "id" TEXT NOT NULL,
    "apprentice_id" TEXT NOT NULL,
    "certificate_number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "issued_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issued_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apprentice_certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timetable_events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "event_type" "EventType" NOT NULL DEFAULT 'class',
    "status" "EventStatus" NOT NULL DEFAULT 'scheduled',
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrence_pattern" TEXT,
    "recurrence_end" TIMESTAMP(3),
    "service_track" "ServiceTrack",
    "created_by" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timetable_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timetable_event_attendees" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "apprentice_id" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'invited',
    "reminder_sent" BOOLEAN NOT NULL DEFAULT false,
    "responded_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timetable_event_attendees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminder_logs" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "apprentice_id" TEXT NOT NULL,
    "reminder_type" "ReminderType" NOT NULL,
    "email_to" TEXT NOT NULL,
    "email_subject" TEXT NOT NULL,
    "email_body" TEXT NOT NULL,
    "email_status" TEXT NOT NULL DEFAULT 'sent',
    "error_message" TEXT,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reminder_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendar_events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "event_type" "CalendarEventType" NOT NULL DEFAULT 'personal_event',
    "status" "CalendarEventStatus" NOT NULL DEFAULT 'scheduled',
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "is_all_day" BOOLEAN NOT NULL DEFAULT false,
    "due_date" TIMESTAMP(3),
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrence_pattern" TEXT,
    "recurrence_end" TIMESTAMP(3),
    "apprentice_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_by_role" "EventCreatorRole" NOT NULL,
    "assignment_id" TEXT,
    "color" TEXT,
    "location" TEXT,
    "notes" TEXT,
    "attachments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "completion_notes" TEXT,
    "completion_evidence" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendar_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_edit_requests" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "apprentice_id" TEXT NOT NULL,
    "request_type" "EventEditRequestType" NOT NULL,
    "requested_changes" JSONB NOT NULL,
    "reason" TEXT NOT NULL,
    "attachments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "RequestStatus" NOT NULL DEFAULT 'pending',
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "review_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_edit_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "free_period_requests" (
    "id" TEXT NOT NULL,
    "apprentice_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "attachments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "RequestStatus" NOT NULL DEFAULT 'pending',
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "review_notes" TEXT,
    "calendar_event_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "free_period_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_conflicts" (
    "id" TEXT NOT NULL,
    "event1_id" TEXT NOT NULL,
    "event2_id" TEXT NOT NULL,
    "conflict_type" TEXT NOT NULL,
    "is_resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolved_at" TIMESTAMP(3),
    "detected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_conflicts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendar_reminders" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "apprentice_id" TEXT NOT NULL,
    "reminder_type" "ReminderType" NOT NULL,
    "scheduled_for" TIMESTAMP(3) NOT NULL,
    "sent_at" TIMESTAMP(3),
    "email_to" TEXT NOT NULL,
    "email_subject" TEXT NOT NULL,
    "email_body" TEXT NOT NULL,
    "email_status" TEXT NOT NULL DEFAULT 'pending',
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calendar_reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_completion_logs" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "apprentice_id" TEXT NOT NULL,
    "was_completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_on_time" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "completion_notes" TEXT,
    "completion_evidence" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "discipline_points" INTEGER NOT NULL DEFAULT 0,
    "logged_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_completion_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "featured_image" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "youtube_url" TEXT,
    "status" "BlogStatus" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMP(3),
    "author_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_likes" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_comments" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_share_stats" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "click_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_share_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technicians" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "employee_id" TEXT,
    "full_name" TEXT NOT NULL,
    "phone" TEXT,
    "photo_url" TEXT,
    "specializations" TEXT[],
    "certifications" TEXT[],
    "average_rating" DOUBLE PRECISION DEFAULT 0,
    "total_repairs" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "hire_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "technicians_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repair_requests" (
    "id" TEXT NOT NULL,
    "ticket_number" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "device_type" "DeviceType" NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "serial_number" TEXT,
    "device_color" TEXT,
    "issue_description" TEXT NOT NULL,
    "issue_photos" TEXT[],
    "customer_notes" TEXT,
    "collection_method" TEXT NOT NULL DEFAULT 'customer_brings',
    "pickup_address" TEXT,
    "scheduled_dropoff" TIMESTAMP(3),
    "received_at" TIMESTAMP(3),
    "device_condition_on_intake" TEXT,
    "intake_photos" TEXT[],
    "technician_id" TEXT,
    "apprentice_id" TEXT,
    "supervisor_id" TEXT,
    "is_supervised_work" BOOLEAN NOT NULL DEFAULT false,
    "diagnosis" TEXT,
    "diagnosis_photos" TEXT[],
    "diagnosed_at" TIMESTAMP(3),
    "estimated_parts_cost" DECIMAL(10,2),
    "estimated_labor_cost" DECIMAL(10,2),
    "diagnostic_fee" DECIMAL(10,2),
    "total_quote" DECIMAL(10,2),
    "quote_valid_until" TIMESTAMP(3),
    "quote_sent_at" TIMESTAMP(3),
    "quote_approved_at" TIMESTAMP(3),
    "parts_used" JSONB,
    "repair_notes" TEXT,
    "repair_started_at" TIMESTAMP(3),
    "repair_completed_at" TIMESTAMP(3),
    "completion_photos" TEXT[],
    "final_cost" DECIMAL(10,2),
    "payment_status" TEXT NOT NULL DEFAULT 'pending',
    "warranty_days" INTEGER,
    "warranty_expires_at" TIMESTAMP(3),
    "status" "RepairStatus" NOT NULL DEFAULT 'pending',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "customer_picked_up_at" TIMESTAMP(3),
    "customer_signature" TEXT,
    "rating" INTEGER,
    "review_comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "repair_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repair_progress" (
    "id" TEXT NOT NULL,
    "repair_request_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photos" TEXT[],
    "updated_by" TEXT NOT NULL,
    "updated_by_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "repair_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repair_payments" (
    "id" TEXT NOT NULL,
    "repair_request_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "payment_type" TEXT NOT NULL,
    "payment_method" TEXT NOT NULL,
    "reference" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "repair_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_resets_token_key" ON "password_resets"("token");

-- CreateIndex
CREATE INDEX "password_resets_user_id_idx" ON "password_resets"("user_id");

-- CreateIndex
CREATE INDEX "password_resets_token_idx" ON "password_resets"("token");

-- CreateIndex
CREATE INDEX "service_design_categories_service_id_idx" ON "service_design_categories"("service_id");

-- CreateIndex
CREATE INDEX "service_design_options_category_id_idx" ON "service_design_options"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "booking_reviews_booking_id_key" ON "booking_reviews"("booking_id");

-- CreateIndex
CREATE INDEX "booking_reviews_user_id_idx" ON "booking_reviews"("user_id");

-- CreateIndex
CREATE INDEX "booking_reviews_service_id_idx" ON "booking_reviews"("service_id");

-- CreateIndex
CREATE INDEX "booking_reviews_rating_idx" ON "booking_reviews"("rating");

-- CreateIndex
CREATE INDEX "upcoming_services_is_active_idx" ON "upcoming_services"("is_active");

-- CreateIndex
CREATE INDEX "upcoming_services_order_idx" ON "upcoming_services"("order");

-- CreateIndex
CREATE INDEX "upcoming_services_service_date_idx" ON "upcoming_services"("service_date");

-- CreateIndex
CREATE INDEX "upcoming_services_service_id_idx" ON "upcoming_services"("service_id");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_is_read_idx" ON "notifications"("is_read");

-- CreateIndex
CREATE INDEX "notifications_priority_idx" ON "notifications"("priority");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

-- CreateIndex
CREATE INDEX "notifications_reference_type_idx" ON "notifications"("reference_type");

-- CreateIndex
CREATE UNIQUE INDEX "app_settings_key_key" ON "app_settings"("key");

-- CreateIndex
CREATE INDEX "app_settings_category_idx" ON "app_settings"("category");

-- CreateIndex
CREATE INDEX "feedback_investor_id_idx" ON "feedback"("investor_id");

-- CreateIndex
CREATE INDEX "feedback_user_id_idx" ON "feedback"("user_id");

-- CreateIndex
CREATE INDEX "feedback_status_idx" ON "feedback"("status");

-- CreateIndex
CREATE INDEX "feedback_type_idx" ON "feedback"("type");

-- CreateIndex
CREATE INDEX "feedback_priority_idx" ON "feedback"("priority");

-- CreateIndex
CREATE INDEX "feedback_created_at_idx" ON "feedback"("created_at");

-- CreateIndex
CREATE INDEX "feedback_responses_feedback_id_idx" ON "feedback_responses"("feedback_id");

-- CreateIndex
CREATE INDEX "feedback_responses_created_at_idx" ON "feedback_responses"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "apprentices_user_id_key" ON "apprentices"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "apprentices_apprentice_number_key" ON "apprentices"("apprentice_number");

-- CreateIndex
CREATE INDEX "apprentices_mentor_id_idx" ON "apprentices"("mentor_id");

-- CreateIndex
CREATE INDEX "apprentices_department_idx" ON "apprentices"("department");

-- CreateIndex
CREATE INDEX "apprentices_status_idx" ON "apprentices"("status");

-- CreateIndex
CREATE INDEX "apprentices_service_track_idx" ON "apprentices"("service_track");

-- CreateIndex
CREATE INDEX "apprentice_enrollments_apprentice_id_idx" ON "apprentice_enrollments"("apprentice_id");

-- CreateIndex
CREATE INDEX "apprentice_enrollments_service_track_idx" ON "apprentice_enrollments"("service_track");

-- CreateIndex
CREATE INDEX "apprentice_enrollments_status_idx" ON "apprentice_enrollments"("status");

-- CreateIndex
CREATE INDEX "assignment_templates_level_idx" ON "assignment_templates"("level");

-- CreateIndex
CREATE INDEX "assignment_templates_category_idx" ON "assignment_templates"("category");

-- CreateIndex
CREATE INDEX "assignment_templates_order_index_idx" ON "assignment_templates"("order_index");

-- CreateIndex
CREATE INDEX "assignment_templates_service_track_idx" ON "assignment_templates"("service_track");

-- CreateIndex
CREATE UNIQUE INDEX "assignment_templates_assignment_number_key" ON "assignment_templates"("assignment_number");

-- CreateIndex
CREATE INDEX "apprentice_assignments_apprentice_id_idx" ON "apprentice_assignments"("apprentice_id");

-- CreateIndex
CREATE INDEX "apprentice_assignments_enrollment_id_idx" ON "apprentice_assignments"("enrollment_id");

-- CreateIndex
CREATE INDEX "apprentice_assignments_status_idx" ON "apprentice_assignments"("status");

-- CreateIndex
CREATE INDEX "apprentice_assignments_due_date_idx" ON "apprentice_assignments"("due_date");

-- CreateIndex
CREATE INDEX "assignment_comments_assignment_id_idx" ON "assignment_comments"("assignment_id");

-- CreateIndex
CREATE UNIQUE INDEX "apprentice_certificates_certificate_number_key" ON "apprentice_certificates"("certificate_number");

-- CreateIndex
CREATE INDEX "apprentice_certificates_apprentice_id_idx" ON "apprentice_certificates"("apprentice_id");

-- CreateIndex
CREATE INDEX "timetable_events_start_time_idx" ON "timetable_events"("start_time");

-- CreateIndex
CREATE INDEX "timetable_events_service_track_idx" ON "timetable_events"("service_track");

-- CreateIndex
CREATE INDEX "timetable_events_event_type_idx" ON "timetable_events"("event_type");

-- CreateIndex
CREATE INDEX "timetable_events_status_idx" ON "timetable_events"("status");

-- CreateIndex
CREATE INDEX "timetable_event_attendees_event_id_idx" ON "timetable_event_attendees"("event_id");

-- CreateIndex
CREATE INDEX "timetable_event_attendees_apprentice_id_idx" ON "timetable_event_attendees"("apprentice_id");

-- CreateIndex
CREATE INDEX "timetable_event_attendees_status_idx" ON "timetable_event_attendees"("status");

-- CreateIndex
CREATE UNIQUE INDEX "timetable_event_attendees_event_id_apprentice_id_key" ON "timetable_event_attendees"("event_id", "apprentice_id");

-- CreateIndex
CREATE INDEX "reminder_logs_event_id_idx" ON "reminder_logs"("event_id");

-- CreateIndex
CREATE INDEX "reminder_logs_apprentice_id_idx" ON "reminder_logs"("apprentice_id");

-- CreateIndex
CREATE INDEX "reminder_logs_sent_at_idx" ON "reminder_logs"("sent_at");

-- CreateIndex
CREATE INDEX "calendar_events_apprentice_id_idx" ON "calendar_events"("apprentice_id");

-- CreateIndex
CREATE INDEX "calendar_events_created_by_idx" ON "calendar_events"("created_by");

-- CreateIndex
CREATE INDEX "calendar_events_start_time_idx" ON "calendar_events"("start_time");

-- CreateIndex
CREATE INDEX "calendar_events_end_time_idx" ON "calendar_events"("end_time");

-- CreateIndex
CREATE INDEX "calendar_events_status_idx" ON "calendar_events"("status");

-- CreateIndex
CREATE INDEX "calendar_events_event_type_idx" ON "calendar_events"("event_type");

-- CreateIndex
CREATE INDEX "calendar_events_is_deleted_idx" ON "calendar_events"("is_deleted");

-- CreateIndex
CREATE INDEX "event_edit_requests_event_id_idx" ON "event_edit_requests"("event_id");

-- CreateIndex
CREATE INDEX "event_edit_requests_apprentice_id_idx" ON "event_edit_requests"("apprentice_id");

-- CreateIndex
CREATE INDEX "event_edit_requests_status_idx" ON "event_edit_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "free_period_requests_calendar_event_id_key" ON "free_period_requests"("calendar_event_id");

-- CreateIndex
CREATE INDEX "free_period_requests_apprentice_id_idx" ON "free_period_requests"("apprentice_id");

-- CreateIndex
CREATE INDEX "free_period_requests_status_idx" ON "free_period_requests"("status");

-- CreateIndex
CREATE INDEX "free_period_requests_start_date_idx" ON "free_period_requests"("start_date");

-- CreateIndex
CREATE INDEX "free_period_requests_end_date_idx" ON "free_period_requests"("end_date");

-- CreateIndex
CREATE INDEX "event_conflicts_event1_id_idx" ON "event_conflicts"("event1_id");

-- CreateIndex
CREATE INDEX "event_conflicts_event2_id_idx" ON "event_conflicts"("event2_id");

-- CreateIndex
CREATE INDEX "event_conflicts_is_resolved_idx" ON "event_conflicts"("is_resolved");

-- CreateIndex
CREATE INDEX "calendar_reminders_event_id_idx" ON "calendar_reminders"("event_id");

-- CreateIndex
CREATE INDEX "calendar_reminders_apprentice_id_idx" ON "calendar_reminders"("apprentice_id");

-- CreateIndex
CREATE INDEX "calendar_reminders_scheduled_for_idx" ON "calendar_reminders"("scheduled_for");

-- CreateIndex
CREATE INDEX "calendar_reminders_email_status_idx" ON "calendar_reminders"("email_status");

-- CreateIndex
CREATE UNIQUE INDEX "event_completion_logs_event_id_key" ON "event_completion_logs"("event_id");

-- CreateIndex
CREATE INDEX "event_completion_logs_apprentice_id_idx" ON "event_completion_logs"("apprentice_id");

-- CreateIndex
CREATE INDEX "event_completion_logs_was_completed_idx" ON "event_completion_logs"("was_completed");

-- CreateIndex
CREATE INDEX "event_completion_logs_logged_at_idx" ON "event_completion_logs"("logged_at");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_slug_idx" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_status_idx" ON "blog_posts"("status");

-- CreateIndex
CREATE INDEX "blog_posts_published_at_idx" ON "blog_posts"("published_at");

-- CreateIndex
CREATE INDEX "blog_likes_post_id_idx" ON "blog_likes"("post_id");

-- CreateIndex
CREATE INDEX "blog_likes_user_id_idx" ON "blog_likes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "blog_likes_post_id_user_id_key" ON "blog_likes"("post_id", "user_id");

-- CreateIndex
CREATE INDEX "blog_comments_post_id_idx" ON "blog_comments"("post_id");

-- CreateIndex
CREATE INDEX "blog_comments_user_id_idx" ON "blog_comments"("user_id");

-- CreateIndex
CREATE INDEX "blog_comments_created_at_idx" ON "blog_comments"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "blog_share_stats_post_id_key" ON "blog_share_stats"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "technicians_user_id_key" ON "technicians"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "technicians_employee_id_key" ON "technicians"("employee_id");

-- CreateIndex
CREATE INDEX "technicians_user_id_idx" ON "technicians"("user_id");

-- CreateIndex
CREATE INDEX "technicians_is_active_idx" ON "technicians"("is_active");

-- CreateIndex
CREATE INDEX "technicians_employee_id_idx" ON "technicians"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "repair_requests_ticket_number_key" ON "repair_requests"("ticket_number");

-- CreateIndex
CREATE INDEX "repair_requests_customer_id_idx" ON "repair_requests"("customer_id");

-- CreateIndex
CREATE INDEX "repair_requests_technician_id_idx" ON "repair_requests"("technician_id");

-- CreateIndex
CREATE INDEX "repair_requests_apprentice_id_idx" ON "repair_requests"("apprentice_id");

-- CreateIndex
CREATE INDEX "repair_requests_status_idx" ON "repair_requests"("status");

-- CreateIndex
CREATE INDEX "repair_requests_device_type_idx" ON "repair_requests"("device_type");

-- CreateIndex
CREATE INDEX "repair_requests_priority_idx" ON "repair_requests"("priority");

-- CreateIndex
CREATE INDEX "repair_requests_ticket_number_idx" ON "repair_requests"("ticket_number");

-- CreateIndex
CREATE INDEX "repair_requests_created_at_idx" ON "repair_requests"("created_at");

-- CreateIndex
CREATE INDEX "repair_progress_repair_request_id_idx" ON "repair_progress"("repair_request_id");

-- CreateIndex
CREATE INDEX "repair_progress_created_at_idx" ON "repair_progress"("created_at");

-- CreateIndex
CREATE INDEX "repair_payments_repair_request_id_idx" ON "repair_payments"("repair_request_id");

-- CreateIndex
CREATE INDEX "repair_payments_payment_type_idx" ON "repair_payments"("payment_type");

-- CreateIndex
CREATE INDEX "repair_payments_created_at_idx" ON "repair_payments"("created_at");

-- CreateIndex
CREATE INDEX "investor_deposits_confirmation_status_idx" ON "investor_deposits"("confirmation_status");

-- CreateIndex
CREATE INDEX "orders_shipping_method_order_status_pickup_deadline_idx" ON "orders"("shipping_method", "order_status", "pickup_deadline");

-- AddForeignKey
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_design_categories" ADD CONSTRAINT "service_design_categories_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_design_options" ADD CONSTRAINT "service_design_options_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "service_design_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_reviews" ADD CONSTRAINT "booking_reviews_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "service_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_reviews" ADD CONSTRAINT "booking_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_reviews" ADD CONSTRAINT "booking_reviews_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upcoming_services" ADD CONSTRAINT "upcoming_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "investors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_responses" ADD CONSTRAINT "feedback_responses_feedback_id_fkey" FOREIGN KEY ("feedback_id") REFERENCES "feedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apprentices" ADD CONSTRAINT "apprentices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apprentice_enrollments" ADD CONSTRAINT "apprentice_enrollments_apprentice_id_fkey" FOREIGN KEY ("apprentice_id") REFERENCES "apprentices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apprentice_assignments" ADD CONSTRAINT "apprentice_assignments_apprentice_id_fkey" FOREIGN KEY ("apprentice_id") REFERENCES "apprentices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apprentice_assignments" ADD CONSTRAINT "apprentice_assignments_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "apprentice_enrollments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apprentice_assignments" ADD CONSTRAINT "apprentice_assignments_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "assignment_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_comments" ADD CONSTRAINT "assignment_comments_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "apprentice_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apprentice_certificates" ADD CONSTRAINT "apprentice_certificates_apprentice_id_fkey" FOREIGN KEY ("apprentice_id") REFERENCES "apprentices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_event_attendees" ADD CONSTRAINT "timetable_event_attendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "timetable_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_event_attendees" ADD CONSTRAINT "timetable_event_attendees_apprentice_id_fkey" FOREIGN KEY ("apprentice_id") REFERENCES "apprentices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminder_logs" ADD CONSTRAINT "reminder_logs_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "timetable_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminder_logs" ADD CONSTRAINT "reminder_logs_apprentice_id_fkey" FOREIGN KEY ("apprentice_id") REFERENCES "apprentices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_apprentice_id_fkey" FOREIGN KEY ("apprentice_id") REFERENCES "apprentices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "apprentice_assignments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_edit_requests" ADD CONSTRAINT "event_edit_requests_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "calendar_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_edit_requests" ADD CONSTRAINT "event_edit_requests_apprentice_id_fkey" FOREIGN KEY ("apprentice_id") REFERENCES "apprentices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "free_period_requests" ADD CONSTRAINT "free_period_requests_apprentice_id_fkey" FOREIGN KEY ("apprentice_id") REFERENCES "apprentices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_conflicts" ADD CONSTRAINT "event_conflicts_event1_id_fkey" FOREIGN KEY ("event1_id") REFERENCES "calendar_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_conflicts" ADD CONSTRAINT "event_conflicts_event2_id_fkey" FOREIGN KEY ("event2_id") REFERENCES "calendar_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_reminders" ADD CONSTRAINT "calendar_reminders_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "calendar_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_reminders" ADD CONSTRAINT "calendar_reminders_apprentice_id_fkey" FOREIGN KEY ("apprentice_id") REFERENCES "apprentices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_completion_logs" ADD CONSTRAINT "event_completion_logs_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "calendar_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_completion_logs" ADD CONSTRAINT "event_completion_logs_apprentice_id_fkey" FOREIGN KEY ("apprentice_id") REFERENCES "apprentices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_likes" ADD CONSTRAINT "blog_likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_likes" ADD CONSTRAINT "blog_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_comments" ADD CONSTRAINT "blog_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_comments" ADD CONSTRAINT "blog_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_share_stats" ADD CONSTRAINT "blog_share_stats_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technicians" ADD CONSTRAINT "technicians_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_requests" ADD CONSTRAINT "repair_requests_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_requests" ADD CONSTRAINT "repair_requests_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "technicians"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_requests" ADD CONSTRAINT "repair_requests_apprentice_id_fkey" FOREIGN KEY ("apprentice_id") REFERENCES "apprentices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_progress" ADD CONSTRAINT "repair_progress_repair_request_id_fkey" FOREIGN KEY ("repair_request_id") REFERENCES "repair_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_payments" ADD CONSTRAINT "repair_payments_repair_request_id_fkey" FOREIGN KEY ("repair_request_id") REFERENCES "repair_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;


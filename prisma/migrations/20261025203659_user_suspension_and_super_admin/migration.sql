-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_super_admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_suspended" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "suspended_at" TIMESTAMP(3),
ADD COLUMN     "suspended_reason" TEXT;

-- Today's admins become super admins, so nobody loses access to settings they manage now.
-- New admins start without the flag; a super admin grants it.
UPDATE "users" SET "is_super_admin" = true WHERE "role" = 'admin';

-- Accounts suspended the old way (email unverified by the suspend button) keep working
-- as before: they still cannot log in until verified. Nothing is migrated automatically.

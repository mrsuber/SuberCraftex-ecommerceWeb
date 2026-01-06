-- AlterTable
ALTER TABLE "materials" ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "specifications" JSONB;

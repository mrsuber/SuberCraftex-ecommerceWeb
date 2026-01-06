-- CreateEnum
CREATE TYPE "BannerType" AS ENUM ('advertisement', 'new_product', 'new_service', 'promotion', 'announcement', 'upcoming');

-- CreateTable
CREATE TABLE "hero_banners" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "type" "BannerType" NOT NULL DEFAULT 'announcement',
    "image_url" TEXT NOT NULL,
    "mobile_image_url" TEXT,
    "cta_text" TEXT,
    "cta_link" TEXT,
    "cta_style" TEXT DEFAULT 'primary',
    "background_color" TEXT DEFAULT '#000000',
    "text_color" TEXT DEFAULT '#ffffff',
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_banners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "hero_banners_is_active_idx" ON "hero_banners"("is_active");

-- CreateIndex
CREATE INDEX "hero_banners_order_idx" ON "hero_banners"("order");

-- CreateIndex
CREATE INDEX "hero_banners_type_idx" ON "hero_banners"("type");

-- CreateIndex
CREATE INDEX "hero_banners_start_date_idx" ON "hero_banners"("start_date");

-- CreateIndex
CREATE INDEX "hero_banners_end_date_idx" ON "hero_banners"("end_date");

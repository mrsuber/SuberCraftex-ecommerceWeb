import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const product = await db.product.findFirst({
    where: { name: 'Wireless Headphones' }
  })

  return NextResponse.json({
    name: product?.name,
    images: product?.images,
    imageCount: product?.images.length
  })
}

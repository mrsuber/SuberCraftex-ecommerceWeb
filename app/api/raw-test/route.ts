import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic'

export async function GET() {
  const product = await db.product.findFirst({
    where: { name: 'Wireless Headphones' }
  })

  if (!product) {
    return NextResponse.json({ error: 'Not found' })
  }

  return NextResponse.json({
    raw_db_response: {
      id: product.id,
      name: product.name,
      images: product.images,
      images_type: typeof product.images,
      images_is_array: Array.isArray(product.images),
      images_length: product.images?.length,
    }
  })
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeProduct } from "@/lib/utils";

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const product = await db.product.findFirst({
    where: { id, isActive: true },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const serialized = serializeProduct(product);

  return NextResponse.json({
    raw_images_from_db: product.images,
    raw_images_count: product.images.length,
    serialized_images: serialized.images,
    serialized_images_count: serialized.images.length,
    product_id: serialized.id,
    product_name: serialized.name,
  });
}

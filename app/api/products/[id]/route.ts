import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeProduct } from "@/lib/utils";
import { requireApiAuth } from "@/lib/auth/api-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch product with category information
    const product = await db.product.findFirst({
      where: {
        id,
        isActive: true,
      },
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
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Fetch reviews for this product
    const reviews = await db.review.findMany({
      where: {
        productId: id,
        isApproved: true,
      },
      include: {
        user: {
          select: {
            fullName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate average rating
    const avgRating = reviews && reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    return NextResponse.json({
      product: serializeProduct(product),
      reviews: reviews || [],
      avgRating: Number(avgRating.toFixed(1)),
      reviewCount: reviews?.length || 0,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update product
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiAuth();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Check if product exists
    const existingProduct = await db.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if slug is being changed and if it's unique
    if (body.slug && body.slug !== existingProduct.slug) {
      const slugExists = await db.product.findUnique({ where: { slug: body.slug } });
      if (slugExists) {
        return NextResponse.json({ error: 'Product with this slug already exists' }, { status: 400 });
      }
    }

    // Check if SKU is being changed and if it's unique
    if (body.sku && body.sku !== existingProduct.sku) {
      const skuExists = await db.product.findUnique({ where: { sku: body.sku } });
      if (skuExists) {
        return NextResponse.json({ error: 'Product with this SKU already exists' }, { status: 400 });
      }
    }

    // Update product
    const product = await db.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        sku: body.sku,
        description: body.description,
        price: body.price,
        compareAtPrice: body.compareAtPrice,
        costPerItem: body.costPerItem,
        categoryId: body.categoryId,
        images: body.images,
        featuredImage: body.featuredImage,
        inventoryCount: body.inventoryCount,
        lowStockThreshold: body.lowStockThreshold,
        trackInventory: body.trackInventory,
        isActive: body.isActive,
        isFeatured: body.isFeatured,
      },
    });

    console.log(`✅ Product updated: ${product.name}`);

    return NextResponse.json(serializeProduct(product));
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiAuth();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orderItems: true,
            cartItems: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if product has been ordered
    if (product._count.orderItems > 0) {
      return NextResponse.json(
        { error: `Cannot delete product that has been ordered. Set it as inactive instead.` },
        { status: 400 }
      );
    }

    // Delete cart items first if any
    if (product._count.cartItems > 0) {
      await db.cartItem.deleteMany({ where: { productId: id } });
    }

    // Delete product
    await db.product.delete({ where: { id } });

    console.log(`✅ Product deleted: ${product.name}`);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

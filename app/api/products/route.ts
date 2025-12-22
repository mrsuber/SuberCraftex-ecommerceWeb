import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeProduct } from "@/lib/utils";
import { requireApiAuth } from "@/lib/auth/api-auth";

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Query parameters
    const categoryId = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const where: any = {
      isActive: true,
    };

    // Filters
    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    // Execute queries
    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({
      products: products.map(serializeProduct),
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.sku || !body.slug || body.price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name, sku, slug, price" },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    const skuExists = await db.product.findUnique({
      where: { sku: body.sku },
    });

    if (skuExists) {
      return NextResponse.json(
        { error: "A product with this SKU already exists" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const slugExists = await db.product.findUnique({
      where: { slug: body.slug },
    });

    if (slugExists) {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 400 }
      );
    }

    // Create product
    const product = await db.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        sku: body.sku,
        description: body.description,
        price: body.price,
        compareAtPrice: body.compareAtPrice,
        costPerItem: body.costPerItem,
        categoryId: body.categoryId,
        images: body.images || [],
        featuredImage: body.featuredImage,
        inventoryCount: body.inventoryCount || 0,
        lowStockThreshold: body.lowStockThreshold || 5,
        trackInventory: body.trackInventory ?? true,
        isActive: body.isActive ?? true,
        isFeatured: body.isFeatured ?? false,
      },
    });

    console.log(`✅ Product created: ${product.name}`);

    return NextResponse.json(serializeProduct(product), { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';

// GET - List all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeChildren = searchParams.get('includeChildren') === 'true';
    const parentOnly = searchParams.get('parentOnly') === 'true';

    const where: any = { isActive: true };
    if (parentOnly) {
      where.parentId = null;
    }

    const categories = await db.category.findMany({
      where,
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        children: includeChildren ? {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            imageUrl: true,
            sortOrder: true,
            _count: { select: { products: true } },
          }
        } : false,
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });

    // Transform to consistent format with aggregated product counts
    const result = categories.map(cat => {
      // Calculate total products including children
      let totalProducts = cat._count.products;
      const children = (cat as any).children || [];

      // Add products from children (subcategories)
      if (children.length > 0) {
        for (const child of children) {
          totalProducts += child._count?.products || 0;
        }
      }

      // Transform children to remove _count from output
      const transformedChildren = children.map((child: any) => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        description: child.description,
        imageUrl: child.imageUrl,
        sortOrder: child.sortOrder,
        productCount: child._count?.products || 0,
      }));

      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        imageUrl: cat.imageUrl,
        parentId: cat.parentId,
        parent: cat.parent,
        children: transformedChildren,
        sortOrder: cat.sortOrder,
        productCount: totalProducts,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, parentId, imageUrl, sortOrder, isActive } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    // Check if slug exists
    const existing = await db.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Category with this slug already exists' }, { status: 400 });
    }

    // Validate parent category if provided
    if (parentId) {
      const parent = await db.category.findUnique({ where: { id: parentId } });
      if (!parent) {
        return NextResponse.json({ error: 'Parent category not found' }, { status: 400 });
      }
      // Prevent nested subcategories (only 2 levels allowed)
      if (parent.parentId) {
        return NextResponse.json({ error: 'Cannot create subcategory under another subcategory' }, { status: 400 });
      }
    }

    const category = await db.category.create({
      data: {
        name,
        slug,
        description: description || null,
        parentId: parentId || null,
        imageUrl: imageUrl || null,
        sortOrder: sortOrder || 0,
        isActive: isActive ?? true,
      },
    });

    const categoryType = parentId ? 'Subcategory' : 'Category';
    console.log(`✅ ${categoryType} created: ${name}`);

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

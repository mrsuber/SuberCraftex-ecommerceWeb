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
          }
        } : false,
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });

    // Transform to consistent format
    const result = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      imageUrl: cat.imageUrl,
      parentId: cat.parentId,
      parent: cat.parent,
      children: (cat as any).children || [],
      sortOrder: cat.sortOrder,
      productCount: cat._count.products,
    }));

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
    const { name, slug, description, sortOrder, isActive } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    // Check if slug exists
    const existing = await db.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Category with this slug already exists' }, { status: 400 });
    }

    const category = await db.category.create({
      data: {
        name,
        slug,
        description: description || null,
        sortOrder: sortOrder || 0,
        isActive: isActive ?? true,
      },
    });

    console.log(`✅ Category created: ${name}`);

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';

// PATCH - Update category
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

    // Validate parent category if provided
    if (body.parentId) {
      const parent = await db.category.findUnique({ where: { id: body.parentId } });
      if (!parent) {
        return NextResponse.json({ error: 'Parent category not found' }, { status: 400 });
      }
      // Prevent nested subcategories (only 2 levels allowed)
      if (parent.parentId) {
        return NextResponse.json({ error: 'Cannot create subcategory under another subcategory' }, { status: 400 });
      }
      // Prevent category from being its own parent
      if (body.parentId === id) {
        return NextResponse.json({ error: 'Category cannot be its own parent' }, { status: 400 });
      }
    }

    // Check if this category has children (can't set parent if it has children)
    if (body.parentId) {
      const hasChildren = await db.category.findFirst({
        where: { parentId: id },
      });
      if (hasChildren) {
        return NextResponse.json(
          { error: 'Cannot set parent for a category that has subcategories' },
          { status: 400 }
        );
      }
    }

    const category = await db.category.update({
      where: { id },
      data: body,
    });

    console.log(`✅ Category updated: ${category.name}`);

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE - Delete category
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

    // Check if category has products or subcategories
    const category = await db.category.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true, children: true } },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        { error: `Cannot delete category with ${category._count.products} products` },
        { status: 400 }
      );
    }

    if (category._count.children > 0) {
      return NextResponse.json(
        { error: `Cannot delete category with ${category._count.children} subcategories. Delete subcategories first.` },
        { status: 400 }
      );
    }

    await db.category.delete({ where: { id } });

    console.log(`✅ Category deleted: ${category.name}`);

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}

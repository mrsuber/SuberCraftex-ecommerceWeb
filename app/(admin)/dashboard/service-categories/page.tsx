import { Metadata } from 'next'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ServiceCategoriesTable } from '@/components/dashboard/ServiceCategoriesTable'
import { ServiceCategoryForm } from '@/components/dashboard/ServiceCategoryForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Service Categories | Admin Dashboard',
  description: 'Manage service categories',
}

export default async function ServiceCategoriesPage() {
  const [categories, count] = await Promise.all([
    db.serviceCategory.findMany({
      include: {
        _count: {
          select: { services: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    }),
    db.serviceCategory.count(),
  ])

  // Serialize data
  const serializedCategories = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    icon: cat.icon,
    imageUrl: cat.imageUrl,
    sortOrder: cat.sortOrder,
    isActive: cat.isActive,
    serviceCount: cat._count.services,
    createdAt: cat.createdAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Service Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage service categories ({count} total)
          </p>
        </div>
        <ServiceCategoryForm>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </ServiceCategoryForm>
      </div>

      {/* Categories Table */}
      <ServiceCategoriesTable categories={serializedCategories} />
    </div>
  )
}

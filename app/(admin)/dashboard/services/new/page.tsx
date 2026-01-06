import { Metadata } from 'next'
import { db } from '@/lib/db'
import { ServiceForm } from '@/components/dashboard/ServiceForm'

export const metadata: Metadata = {
  title: 'Add Service | Admin Dashboard',
  description: 'Create a new service',
}

export default async function NewServicePage() {
  const categories = await db.serviceCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  // Serialize categories for client component
  const serializedCategories = categories.map((cat) => ({
    ...cat,
    image_url: cat.imageUrl,
    imageUrl: cat.imageUrl,
    sort_order: cat.sortOrder,
    sortOrder: cat.sortOrder,
    is_active: cat.isActive,
    isActive: cat.isActive,
    created_at: cat.createdAt.toISOString(),
    createdAt: cat.createdAt.toISOString(),
    updated_at: cat.updatedAt.toISOString(),
    updatedAt: cat.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Add New Service</h1>
        <p className="text-muted-foreground mt-1">
          Create a new service offering for customers
        </p>
      </div>

      <ServiceForm categories={serializedCategories as any} />
    </div>
  )
}

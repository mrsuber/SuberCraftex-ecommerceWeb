import { Metadata } from 'next'
import { db } from '@/lib/db'
import { MaterialsTable } from '@/components/dashboard/MaterialsTable'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Materials Management | Dashboard',
  description: 'Manage materials for services',
}

export default async function MaterialsPage() {
  const materials = await db.material.findMany({
    include: {
      category: true,
      services: {
        include: {
          service: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const categories = await db.serviceCategory.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })

  // Serialize for client component
  const serializedMaterials = materials.map((material) => ({
    ...material,
    price: Number(material.price),
    services: material.services.map(sm => sm.service),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Materials Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage materials and link them to services
          </p>
        </div>
        <Link href="/dashboard/materials/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Material
          </Button>
        </Link>
      </div>

      <MaterialsTable materials={serializedMaterials} categories={categories} />
    </div>
  )
}

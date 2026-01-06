import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { MaterialForm } from '@/components/dashboard/MaterialForm'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Edit Material | Dashboard',
  description: 'Edit material details',
}

interface EditMaterialPageProps {
  params: Promise<{ id: string }>
}

export default async function EditMaterialPage({ params }: EditMaterialPageProps) {
  const { id } = await params

  const material = await db.material.findUnique({
    where: { id },
    include: {
      services: {
        select: {
          serviceId: true,
        },
      },
    },
  })

  if (!material) {
    notFound()
  }

  const categories = await db.serviceCategory.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })

  const services = await db.service.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
    },
  })

  const materialData = {
    id: material.id,
    sku: material.sku,
    name: material.name,
    description: material.description || '',
    price: Number(material.price),
    stockQuantity: material.stockQuantity,
    unit: material.unit,
    imageUrl: material.imageUrl || '',
    serviceCategoryId: material.serviceCategoryId || '',
    isActive: material.isActive,
    serviceIds: material.services.map((s) => s.serviceId),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/materials">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Material</h1>
          <p className="text-muted-foreground mt-1">
            Update material details and associations
          </p>
        </div>
      </div>

      <MaterialForm material={materialData} categories={categories} services={services} />
    </div>
  )
}

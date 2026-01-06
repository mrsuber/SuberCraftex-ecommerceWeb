import { Metadata } from 'next'
import { db } from '@/lib/db'
import { MaterialForm } from '@/components/dashboard/MaterialForm'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'New Material | Dashboard',
  description: 'Create a new material',
}

export default async function NewMaterialPage() {
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
          <h1 className="text-3xl font-bold">Create New Material</h1>
          <p className="text-muted-foreground mt-1">
            Add a new material to your inventory
          </p>
        </div>
      </div>

      <MaterialForm categories={categories} services={services} />
    </div>
  )
}

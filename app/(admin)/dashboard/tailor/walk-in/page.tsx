import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { WalkInOrderForm } from '@/components/tailor/WalkInOrderForm'

export const metadata: Metadata = {
  title: 'Walk-In Order | Tailor Dashboard',
  description: 'Create order for walk-in customers',
}

export default async function WalkInOrderPage() {
  const user = await getSession()

  if (!user || user.role !== 'tailor') {
    redirect('/dashboard')
  }

  // Get active services that support custom production or collect/repair
  const services = await db.service.findMany({
    where: {
      isActive: true,
      OR: [
        { supportsCustomProduction: true },
        { supportsCollectRepair: true },
      ],
    },
    include: {
      category: true,
    },
    orderBy: {
      name: 'asc',
    },
  })

  // Get active materials
  const materials = await db.material.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: 'asc',
    },
  })

  // Serialize data
  const serializedServices = services.map((service) => ({
    ...service,
    price: Number(service.price),
    compareAtPrice: service.compareAtPrice ? Number(service.compareAtPrice) : null,
  }))

  const serializedMaterials = materials.map((material) => ({
    ...material,
    price: Number(material.price),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Walk-In Order</h1>
        <p className="text-muted-foreground mt-1">
          Quickly create a booking for customers who visit the shop
        </p>
      </div>

      <WalkInOrderForm
        services={serializedServices as any}
        materials={serializedMaterials as any}
      />
    </div>
  )
}

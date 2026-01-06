import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/session'
import POSDashboard from '@/components/pos/POSDashboard'

export default async function POSPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/pos')
  }

  if (user.role !== 'cashier') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <POSDashboard />
    </div>
  )
}

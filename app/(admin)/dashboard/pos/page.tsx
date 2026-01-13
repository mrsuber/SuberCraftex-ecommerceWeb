import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import POSDashboard from '@/components/pos/POSDashboard'

export default async function POSPage() {
  const user = await getSession()

  if (!user) {
    redirect('/login?redirect=/dashboard/pos')
  }

  // Allow admins and cashiers to access POS
  if (user.role !== 'cashier' && user.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 -m-8">
      <POSDashboard />
    </div>
  )
}

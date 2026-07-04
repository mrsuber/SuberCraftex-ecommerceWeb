import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { StatisticsDashboard } from '@/components/calendar/StatisticsDashboard'

export default async function StatisticsPage() {
  const user = await getSession()

  if (!user || user.role !== 'apprentice') {
    redirect('/login')
  }

  const apprentice = await db.apprentice.findUnique({
    where: { userId: user.id },
    select: {
      id: true,
      fullName: true,
      apprenticeNumber: true,
    },
  })

  if (!apprentice) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Apprentice Profile Not Found</h1>
          <p className="text-muted-foreground">
            Your apprentice profile has not been set up yet. Please contact an administrator.
          </p>
        </div>
      </div>
    )
  }

  return <StatisticsDashboard apprenticeId={apprentice.id} apprenticeName={apprentice.fullName} />
}

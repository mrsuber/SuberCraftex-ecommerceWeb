import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { FeedbackForm } from '@/components/feedback/FeedbackForm'
import { FeedbackHistory } from '@/components/feedback/FeedbackHistory'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const metadata: Metadata = {
  title: 'Feedback | SuberCraftex',
  description: 'Send feedback and view your feedback history',
}

export default async function FeedbackPage() {
  const user = await getSession()

  if (!user) {
    redirect('/login?redirect=/account/feedback')
  }

  // Get user's feedback history
  const feedbackRaw = await db.feedback.findMany({
    where: { userId: user.id },
    include: {
      adminResponses: {
        where: { isInternal: false },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Serialize dates for client component
  const feedback = feedbackRaw.map((f) => ({
    ...f,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
    resolvedAt: f.resolvedAt?.toISOString() || null,
    adminResponses: f.adminResponses.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
  }))

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Feedback</h1>
        <p className="text-muted-foreground mt-1">
          Help us improve by sharing your thoughts
        </p>
      </div>

      <Tabs defaultValue="new" className="space-y-6">
        <TabsList>
          <TabsTrigger value="new">Send Feedback</TabsTrigger>
          <TabsTrigger value="history">
            My Feedback ({feedback.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <FeedbackForm
            userId={user.id}
            userEmail={user.email}
            userName={user.fullName || undefined}
          />
        </TabsContent>

        <TabsContent value="history">
          <FeedbackHistory feedback={feedback} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import InvestorAgreementClient from '@/components/investor/InvestorAgreementClient'

export default async function InvestorAgreementPage() {
  const user = await getSession()

  if (!user || user.role !== 'investor') {
    redirect('/investor/register')
  }

  const investor = await db.investor.findUnique({
    where: { userId: user.id },
  })

  if (!investor) {
    redirect('/investor/register')
  }

  if (investor.agreementAccepted) {
    redirect('/investor/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <InvestorAgreementClient investorNumber={investor.investorNumber} />
      </div>
    </div>
  )
}

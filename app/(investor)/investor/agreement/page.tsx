import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import InvestorAgreementClient from '@/components/investor/InvestorAgreementClient'
import { VersionedAgreement } from '@/components/investor/VersionedAgreement'
import { investorLedgerLive } from '@/lib/investors/live'
import { acceptedCurrentVersion } from '@/lib/investors/agreement'

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

  // On the new ledger the agreement is versioned: each version is read, its risks ticked and
  // signed with the investor's typed name
  if (await investorLedgerLive()) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <VersionedAgreement />
          {(await acceptedCurrentVersion(db, investor.id)) && (
            <p className="mt-4 text-center text-sm"><a className="underline" href="/investor/dashboard">Back to my dashboard</a></p>
          )}
        </div>
      </div>
    )
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

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import KycVerificationForm from '@/components/investor/KycVerificationForm'

export default async function InvestorVerifyPage() {
  const user = await getSession()

  if (!user || user.role !== 'investor') {
    redirect('/investor/register')
  }

  const investor = await db.investor.findUnique({
    where: { userId: user.id },
    select: {
      id: true,
      investorNumber: true,
      fullName: true,
      email: true,
      phone: true,
      idType: true,
      idNumber: true,
      idDocumentUrl: true,
      idDocumentBackUrl: true,
      selfieUrl: true,
      kycStatus: true,
      kycSubmittedAt: true,
      kycRejectionReason: true,
      isVerified: true,
      agreementAccepted: true,
    },
  })

  if (!investor) {
    redirect('/investor/register')
  }

  if (!investor.agreementAccepted) {
    redirect('/investor/agreement')
  }

  // If already verified, redirect to dashboard
  if (investor.isVerified) {
    redirect('/investor/dashboard')
  }

  // Serialize the investor data for client component
  const serializedInvestor = {
    ...investor,
    kycSubmittedAt: investor.kycSubmittedAt?.toISOString() || null,
  }

  return <KycVerificationForm investor={serializedInvestor} />
}

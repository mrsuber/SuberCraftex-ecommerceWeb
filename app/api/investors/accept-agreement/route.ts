import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

// POST /api/investors/accept-agreement - Accept investor agreement
export async function POST(request: NextRequest) {
  try {
    const user = await getSession()

    if (!user || user.role !== 'investor') {
      return NextResponse.json(
        { error: 'Unauthorized. Investor access required.' },
        { status: 401 }
      )
    }

    const investor = await db.investor.findUnique({
      where: { userId: user.id },
    })

    if (!investor) {
      return NextResponse.json(
        { error: 'Investor profile not found' },
        { status: 404 }
      )
    }

    // Once accounts are on the new ledger, the versioned agreement (with each risk ticked and
    // the investor's name typed) is the only way to accept: /api/investors/agreement
    const { investorLedgerLive } = await import('@/lib/investors/live')
    const { acceptedCurrentVersion } = await import('@/lib/investors/agreement')
    if (await investorLedgerLive()) {
      if (await acceptedCurrentVersion(db, investor.id)) return NextResponse.json({ success: true, alreadyAccepted: true })
      return NextResponse.json(
        { error: 'A new investor agreement must be read and accepted on the SuberCraftex website.', needsNewAgreement: true },
        { status: 409 }
      )
    }

    if (investor.agreementAccepted) {
      // Already accepted — return success so the app can proceed to dashboard
      return NextResponse.json({ success: true, alreadyAccepted: true })
    }

    const updatedInvestor = await db.investor.update({
      where: { id: investor.id },
      data: {
        agreementAccepted: true,
        agreementAcceptedAt: new Date(),
      },
    })

    console.log(`✅ Investor ${investor.investorNumber} accepted agreement`)

    return NextResponse.json(updatedInvestor)
  } catch (error) {
    console.error('Error accepting agreement:', error)
    return NextResponse.json(
      { error: 'Failed to accept agreement' },
      { status: 500 }
    )
  }
}

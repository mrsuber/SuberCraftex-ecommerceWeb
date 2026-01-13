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

    if (investor.agreementAccepted) {
      return NextResponse.json(
        { error: 'Agreement already accepted' },
        { status: 400 }
      )
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

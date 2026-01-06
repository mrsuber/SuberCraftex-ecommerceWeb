import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'

/**
 * POST /api/pos/session/close
 * Close current POS session (cashier only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'cashier') {
      return NextResponse.json(
        { error: 'Unauthorized. Cashier access required.' },
        { status: 401 }
      )
    }

    const cashier = await db.cashier.findUnique({
      where: { userId: user.id }
    })

    if (!cashier) {
      return NextResponse.json(
        { error: 'Cashier profile not found' },
        { status: 404 }
      )
    }

    // Get active session
    const session = await db.pOSSession.findFirst({
      where: {
        cashierId: cashier.id,
        status: 'open'
      }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'No active session found to close' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { actualCash, notes } = body

    if (actualCash === undefined || actualCash === null) {
      return NextResponse.json(
        { error: 'Actual cash amount is required' },
        { status: 400 }
      )
    }

    // Calculate cash difference
    const cashDifference = Number(actualCash) - Number(session.expectedCash)

    // Close session
    const closedSession = await db.pOSSession.update({
      where: { id: session.id },
      data: {
        status: 'closed',
        closedAt: new Date(),
        actualCash,
        closingBalance: actualCash,
        cashDifference,
        notes: notes || null
      },
      include: {
        cashier: {
          select: {
            fullName: true,
            employeeId: true
          }
        },
        _count: {
          select: {
            orders: true
          }
        }
      }
    })

    console.log(`📱 POS session closed: ${session.sessionNumber} by ${cashier.fullName}`)
    if (cashDifference !== 0) {
      console.log(`   Cash difference: $${cashDifference.toFixed(2)} (${cashDifference > 0 ? 'over' : 'short'})`)
    }

    return NextResponse.json({
      success: true,
      session: {
        ...closedSession,
        openingBalance: Number(closedSession.openingBalance),
        closingBalance: Number(closedSession.closingBalance!),
        expectedCash: Number(closedSession.expectedCash),
        actualCash: Number(closedSession.actualCash!),
        cashDifference: Number(closedSession.cashDifference!),
        totalSales: Number(closedSession.totalSales),
        totalCash: Number(closedSession.totalCash),
        totalCard: Number(closedSession.totalCard),
        totalMobile: Number(closedSession.totalMobile),
      }
    })
  } catch (error) {
    console.error('Error closing POS session:', error)
    return NextResponse.json(
      { error: 'Failed to close POS session' },
      { status: 500 }
    )
  }
}

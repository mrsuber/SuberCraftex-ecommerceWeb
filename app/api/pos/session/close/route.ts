import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { closeDrawer } from '@/lib/commerce/pos-cash'
import { parseXafOrZero, toDecimal } from '@/lib/money'
import { getCurrentUser } from '@/lib/session'

/**
 * POST /api/pos/session/close
 * Close current POS session (cashier only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== 'cashier' && user.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Unauthorized. Cashier or admin access required.' },
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

    let counted: bigint
    try {
      counted = parseXafOrZero(actualCash, 'counted cash')
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 400 })
    }

    // Close in the ledger and on the session together; the counted cash goes to the safe
    const closedSession = await db.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM pos_sessions WHERE id = ${session.id} FOR UPDATE`
      const fresh = await tx.pOSSession.findUniqueOrThrow({ where: { id: session.id } })
      if (fresh.status !== 'open') throw new Error('Session already closed')
      const { expected } = await closeDrawer(tx, fresh, counted, user.id)
      const expectedCash = expected !== null ? toDecimal(expected) : fresh.expectedCash
      return tx.pOSSession.update({
        where: { id: session.id },
        data: {
          status: 'closed',
          closedAt: new Date(),
          actualCash: toDecimal(counted),
          closingBalance: toDecimal(counted),
          expectedCash,
          cashDifference: toDecimal(counted).sub(expectedCash),
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
    })
    const cashDifference = Number(closedSession.cashDifference)

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

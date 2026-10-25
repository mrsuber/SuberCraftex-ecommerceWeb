import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { randomBytes } from 'crypto'
import { openDrawer } from '@/lib/commerce/pos-cash'
import { parseXafOrZero, toDecimal } from '@/lib/money'
import { getCurrentUser } from '@/lib/session'

/**
 * POST /api/pos/session
 * Open a new POS session (cashier only)
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

    // Check if cashier profile exists, create if needed (for admins)
    let cashier = await db.cashier.findUnique({
      where: { userId: user.id }
    })

    if (!cashier && user.role === 'admin') {
      // Auto-create cashier profile for admin
      cashier = await db.cashier.create({
        data: {
          userId: user.id,
          fullName: user.fullName || 'Admin User',
          phone: user.phone || '+0000000000',
          email: user.email,
          employeeId: `ADMIN-${user.id.substring(0, 8).toUpperCase()}`,
          isActive: true
        }
      })
    }

    if (!cashier || !cashier.isActive) {
      return NextResponse.json(
        { error: 'Cashier profile not found or inactive' },
        { status: 404 }
      )
    }

    // Check if cashier already has an open session
    const existingSession = await db.pOSSession.findFirst({
      where: {
        cashierId: cashier.id,
        status: 'open'
      }
    })

    if (existingSession) {
      return NextResponse.json(
        { error: 'You already have an open session. Please close it first.' },
        { status: 400 }
      )
    }

    const body = await request.json().catch(() => ({}))
    let float: bigint
    try {
      float = parseXafOrZero(body.openingBalance, 'opening cash')
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 400 })
    }

    const sessionNumber = `POS-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString('hex').toUpperCase()}`

    // The float moves into the drawer in the ledger in the same transaction
    const session = await db.$transaction(async (tx) => {
      const created = await tx.pOSSession.create({
        data: {
          sessionNumber,
          cashierId: cashier.id,
          openingBalance: toDecimal(float),
          expectedCash: toDecimal(float),
          status: 'open'
        },
        include: {
          cashier: {
            select: {
              fullName: true,
              employeeId: true
            }
          }
        }
      })
      await openDrawer(tx, created, float, user.id)
      return created
    })

    return NextResponse.json({
      success: true,
      session: {
        ...session,
        openingBalance: Number(session.openingBalance),
        expectedCash: Number(session.expectedCash),
        totalSales: Number(session.totalSales),
        totalCash: Number(session.totalCash),
        totalCard: Number(session.totalCard),
        totalMobile: Number(session.totalMobile),
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error opening POS session:', error)
    return NextResponse.json(
      { error: 'Failed to open POS session' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/pos/session
 * Get current active session (cashier only)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== 'cashier' && user.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Unauthorized. Cashier or admin access required.' },
        { status: 401 }
      )
    }

    let cashier = await db.cashier.findUnique({
      where: { userId: user.id }
    })

    if (!cashier && user.role === 'admin') {
      // Auto-create cashier profile for admin
      cashier = await db.cashier.create({
        data: {
          userId: user.id,
          fullName: user.fullName || 'Admin User',
          phone: user.phone || '+0000000000',
          email: user.email,
          employeeId: `ADMIN-${user.id.substring(0, 8).toUpperCase()}`,
          isActive: true
        }
      })
    }

    if (!cashier) {
      return NextResponse.json(
        { error: 'Cashier profile not found' },
        { status: 404 }
      )
    }

    const session = await db.pOSSession.findFirst({
      where: {
        cashierId: cashier.id,
        status: 'open'
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

    if (!session) {
      return NextResponse.json(
        { error: 'No active session found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...session,
      openingBalance: Number(session.openingBalance),
      closingBalance: session.closingBalance ? Number(session.closingBalance) : null,
      expectedCash: Number(session.expectedCash),
      actualCash: session.actualCash ? Number(session.actualCash) : null,
      cashDifference: session.cashDifference ? Number(session.cashDifference) : null,
      totalSales: Number(session.totalSales),
      totalCash: Number(session.totalCash),
      totalCard: Number(session.totalCard),
      totalMobile: Number(session.totalMobile),
    })
  } catch (error) {
    console.error('Error fetching POS session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch POS session' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

// GET /api/admin/investors/[id] - Get investor details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getSession()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const investor = await db.investor.findUnique({
      where: { id },
      include: {
        user: true,
        deposits: {
          orderBy: { depositedAt: 'desc' },
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
        productAllocations: {
          include: {
            product: true,
            variant: true,
          },
        },
        equipmentAllocations: {
          include: {
            equipment: true,
          },
        },
        profitDistributions: {
          orderBy: { distributedAt: 'desc' },
        },
        withdrawalRequests: {
          orderBy: { requestedAt: 'desc' },
        },
      },
    })

    if (!investor) {
      return NextResponse.json(
        { error: 'Investor not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(investor)
  } catch (error) {
    console.error('Error fetching investor:', error)
    return NextResponse.json(
      { error: 'Failed to fetch investor' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/investors/[id] - Update investor (verify, suspend, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getSession()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const investor = await db.investor.findUnique({
      where: { id },
    })

    if (!investor) {
      return NextResponse.json(
        { error: 'Investor not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { status, notes, isVerified } = body

    const updateData: any = {}

    if (status) {
      updateData.status = status
    }

    if (notes !== undefined) {
      updateData.notes = notes
    }

    if (typeof isVerified === 'boolean' && isVerified && !investor.isVerified) {
      updateData.isVerified = true
      updateData.verifiedAt = new Date()
      updateData.verifiedBy = user.id
      updateData.status = 'active'
    }

    const updatedInvestor = await db.investor.update({
      where: { id },
      data: updateData,
    })

    console.log(`✅ Admin ${user.email} updated investor ${investor.investorNumber}`)

    return NextResponse.json(updatedInvestor)
  } catch (error) {
    console.error('Error updating investor:', error)
    return NextResponse.json(
      { error: 'Failed to update investor' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

// GET /api/investors/me - Get current investor profile
export async function GET(request: NextRequest) {
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
      include: {
        deposits: {
          orderBy: { depositedAt: 'desc' },
          take: 10,
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        productAllocations: {
          where: { quantityRemaining: { gt: 0 } },
          include: {
            product: {
              select: {
                name: true,
                featuredImage: true,
                sku: true,
              },
            },
            variant: {
              select: {
                name: true,
                sku: true,
                imageUrl: true,
              },
            },
          },
        },
        equipmentAllocations: {
          where: { hasExited: false },
          include: {
            equipment: {
              select: {
                name: true,
                equipmentNumber: true,
                currentValue: true,
                status: true,
                photos: true,
              },
            },
          },
        },
        profitDistributions: {
          orderBy: { distributedAt: 'desc' },
          take: 10,
        },
        withdrawalRequests: {
          orderBy: { requestedAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!investor) {
      return NextResponse.json(
        { error: 'Investor profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(investor)
  } catch (error) {
    console.error('Error fetching investor profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch investor profile' },
      { status: 500 }
    )
  }
}

// PATCH /api/investors/me - Update investor profile
export async function PATCH(request: NextRequest) {
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

    const body = await request.json()
    const { phone, idDocumentUrl } = body

    const updateData: any = {}

    if (phone) {
      updateData.phone = phone
    }

    if (idDocumentUrl) {
      updateData.idDocumentUrl = idDocumentUrl
    }

    const updatedInvestor = await db.investor.update({
      where: { id: investor.id },
      data: updateData,
    })

    return NextResponse.json(updatedInvestor)
  } catch (error) {
    console.error('Error updating investor profile:', error)
    return NextResponse.json(
      { error: 'Failed to update investor profile' },
      { status: 500 }
    )
  }
}

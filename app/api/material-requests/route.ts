import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'

/**
 * GET /api/material-requests
 * Admin view all material requests (with filtering)
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = {}

    if (status) {
      where.status = status
    }

    const materialRequests = await db.materialRequest.findMany({
      where,
      include: {
        booking: {
          select: {
            id: true,
            booking_number: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            },
            service: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      },
      orderBy: [
        { status: 'asc' }, // pending first
        { created_at: 'desc' }
      ]
    })

    return NextResponse.json(materialRequests)
  } catch (error) {
    console.error('Error fetching material requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch material requests' },
      { status: 500 }
    )
  }
}

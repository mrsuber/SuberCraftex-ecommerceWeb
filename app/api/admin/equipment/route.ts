import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

// GET /api/admin/equipment - Get all equipment
export async function GET(request: NextRequest) {
  try {
    const user = await getSession()

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

    const equipment = await db.equipment.findMany({
      where,
      include: {
        investorAllocations: {
          where: { hasExited: false },
          include: {
            investor: {
              select: {
                investorNumber: true,
                fullName: true,
              },
            },
          },
        },
        jobUsages: {
          orderBy: { jobDate: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(equipment)
  } catch (error) {
    console.error('Error fetching equipment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch equipment' },
      { status: 500 }
    )
  }
}

// POST /api/admin/equipment - Create equipment
export async function POST(request: NextRequest) {
  try {
    const user = await getSession()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      purchasePrice,
      purchaseDate,
      category,
      location,
      specifications,
      photos,
      notes,
    } = body

    if (!name || !purchasePrice || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, purchasePrice, category' },
        { status: 400 }
      )
    }

    // Generate equipment number
    const year = new Date().getFullYear()
    const count = await db.equipment.count()
    const equipmentNumber = `EQP-${year}-${String(count + 1).padStart(4, '0')}`

    const equipment = await db.equipment.create({
      data: {
        name,
        description: description || null,
        equipmentNumber,
        purchasePrice,
        currentValue: purchasePrice, // Initially same as purchase price
        purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
        category,
        location: location || null,
        specifications: specifications || null,
        photos: photos || [],
        notes: notes || null,
        status: 'active',
      },
    })

    console.log(`✅ Equipment created: ${equipmentNumber} - ${name}`)

    return NextResponse.json(equipment, { status: 201 })
  } catch (error) {
    console.error('Error creating equipment:', error)
    return NextResponse.json(
      { error: 'Failed to create equipment' },
      { status: 500 }
    )
  }
}

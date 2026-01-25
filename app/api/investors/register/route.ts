import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

// POST /api/investors/register - Register as investor
export async function POST(request: NextRequest) {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      )
    }

    // Check if user is already an investor
    const existingInvestor = await db.investor.findUnique({
      where: { userId: user.id },
    })

    if (existingInvestor) {
      return NextResponse.json(
        { error: 'You are already registered as an investor.' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const {
      fullName,
      phone,
      email,
      idType,
      idNumber,
      idDocumentUrl,
    } = body

    // Only fullName and phone are required at registration
    // idType and idNumber are collected during KYC verification
    if (!fullName || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: fullName, phone' },
        { status: 400 }
      )
    }

    // Check if ID number already exists (only if provided)
    if (idNumber) {
      const existingId = await db.investor.findFirst({
        where: { idNumber },
      })

      if (existingId) {
        return NextResponse.json(
          { error: 'This ID number is already registered.' },
          { status: 400 }
        )
      }
    }

    // Generate investor number
    const year = new Date().getFullYear()
    const count = await db.investor.count()
    const investorNumber = `INV-${year}-${String(count + 1).padStart(4, '0')}`

    // Determine kycStatus based on whether KYC info is provided
    // If ID info is provided, set to 'pending' (awaiting admin review)
    // If ID info is not provided, keep as 'not_started' (default)
    const kycStatus = (idType && idNumber) ? 'pending' : 'not_started'

    // Create investor profile
    const investor = await db.investor.create({
      data: {
        userId: user.id,
        investorNumber,
        fullName,
        email: email || user.email,
        phone,
        idType: idType || null,
        idNumber: idNumber || null,
        idDocumentUrl: idDocumentUrl || null,
        status: 'pending_verification',
        kycStatus,
      },
    })

    // Update user role to investor
    await db.user.update({
      where: { id: user.id },
      data: { role: 'investor' },
    })

    console.log(`✅ New investor registered: ${investorNumber}`)

    return NextResponse.json(investor, { status: 201 })
  } catch (error) {
    console.error('Error registering investor:', error)
    return NextResponse.json(
      { error: 'Failed to register as investor' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { z } from 'zod'

// Custom validator for URLs (accepts both full URLs and relative paths)
const urlOrPath = z.string().refine(
  (val) => val.startsWith('/') || val.startsWith('http://') || val.startsWith('https://'),
  { message: 'Must be a valid URL or path' }
)

const kycSubmissionSchema = z.object({
  idType: z.enum(['national_id', 'passport', 'driver_license']),
  idNumber: z.string().min(1, 'ID number is required'),
  idDocumentUrl: urlOrPath,
  idDocumentBackUrl: urlOrPath.nullable().optional(),
  selfieUrl: urlOrPath,
})

// POST /api/investors/kyc - Submit KYC verification
export async function POST(request: NextRequest) {
  try {
    const user = await getSession()

    if (!user || user.role !== 'investor') {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in as an investor.' },
        { status: 401 }
      )
    }

    // Get investor profile
    const investor = await db.investor.findUnique({
      where: { userId: user.id },
      select: { id: true, kycStatus: true, isVerified: true },
    })

    if (!investor) {
      return NextResponse.json(
        { error: 'Investor profile not found' },
        { status: 404 }
      )
    }

    // Check if already verified
    if (investor.isVerified) {
      return NextResponse.json(
        { error: 'Your account is already verified' },
        { status: 400 }
      )
    }

    // Only allow submission if KYC is not started or was rejected
    if (investor.kycStatus !== 'not_started' && investor.kycStatus !== 'rejected') {
      return NextResponse.json(
        { error: 'KYC verification is already pending review' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = kycSubmissionSchema.parse(body)

    // Update investor with KYC data
    await db.investor.update({
      where: { id: investor.id },
      data: {
        idType: validatedData.idType,
        idNumber: validatedData.idNumber,
        idDocumentUrl: validatedData.idDocumentUrl,
        idDocumentBackUrl: validatedData.idDocumentBackUrl,
        selfieUrl: validatedData.selfieUrl,
        kycStatus: 'pending',
        kycSubmittedAt: new Date(),
        kycRejectionReason: null, // Clear any previous rejection reason
      },
    })

    console.log(`✅ KYC submitted for investor ${investor.id}`)

    return NextResponse.json({
      success: true,
      message: 'KYC verification submitted successfully. You will be notified once reviewed.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Error submitting KYC:', error)
    return NextResponse.json(
      { error: 'Failed to submit KYC verification' },
      { status: 500 }
    )
  }
}

// GET /api/investors/kyc - Get KYC status
export async function GET(request: NextRequest) {
  try {
    const user = await getSession()

    if (!user || user.role !== 'investor') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const investor = await db.investor.findUnique({
      where: { userId: user.id },
      select: {
        kycStatus: true,
        kycSubmittedAt: true,
        kycRejectionReason: true,
        isVerified: true,
        verifiedAt: true,
      },
    })

    if (!investor) {
      return NextResponse.json(
        { error: 'Investor profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      kycStatus: investor.kycStatus,
      kycSubmittedAt: investor.kycSubmittedAt,
      kycRejectionReason: investor.kycRejectionReason,
      isVerified: investor.isVerified,
      verifiedAt: investor.verifiedAt,
    })
  } catch (error) {
    console.error('Error getting KYC status:', error)
    return NextResponse.json(
      { error: 'Failed to get KYC status' },
      { status: 500 }
    )
  }
}

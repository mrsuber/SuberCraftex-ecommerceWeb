import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { MB, saveUpload, UploadError } from '@/lib/uploads'

// POST /api/investors/kyc/upload - Upload KYC document
export async function POST(request: NextRequest) {
  try {
    const user = await getSession()

    if (!user || user.role !== 'investor') {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in as an investor.' },
        { status: 401 }
      )
    }

    // Check if investor exists and can upload
    const investor = await db.investor.findUnique({
      where: { userId: user.id },
      select: { id: true, kycStatus: true },
    })

    if (!investor) {
      return NextResponse.json(
        { error: 'Investor profile not found' },
        { status: 404 }
      )
    }

    // Only allow upload if KYC is not started or was rejected
    if (investor.kycStatus !== 'not_started' && investor.kycStatus !== 'rejected') {
      return NextResponse.json(
        { error: 'KYC documents already submitted and under review' },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const type = formData.get('type') as string

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!type || !['id_front', 'id_back', 'selfie'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Must be id_front, id_back, or selfie' },
        { status: 400 }
      )
    }

    // Saved outside public/: only the investor and admins can open it
    const saved = await saveUpload(file, {
      folder: ['kyc', investor.id],
      allowed: ['image'],
      maxBytes: 10 * MB,
      private: true,
      prefix: type,
    })
    const publicUrl = saved.url
    const filename = saved.filename

    console.log(`✅ KYC document uploaded: ${publicUrl}`)

    return NextResponse.json({
      url: publicUrl,
      filename: filename,
    })
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('Error uploading KYC document:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

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
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!type || !['id_front', 'id_back', 'selfie'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Must be id_front, id_back, or selfie' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file format. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop() || 'jpg'
    const filename = `${type}_${timestamp}.${extension}`

    // Create upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'kyc', investor.id)
    await mkdir(uploadDir, { recursive: true })

    // Convert file to buffer and save locally
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const filePath = path.join(uploadDir, filename)

    await writeFile(filePath, buffer)

    // Generate public URL
    const publicUrl = `/uploads/kyc/${investor.id}/${filename}`

    console.log(`✅ KYC document uploaded: ${publicUrl}`)

    return NextResponse.json({
      url: publicUrl,
      filename: filename,
    })
  } catch (error) {
    console.error('Error uploading KYC document:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

// POST /api/admin/investors/upload-receipt - Upload deposit receipt
export async function POST(request: NextRequest) {
  try {
    const user = await getSession()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const investorId = formData.get('investorId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!investorId) {
      return NextResponse.json({ error: 'Investor ID is required' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file format. Only JPEG, PNG, WebP, and PDF are allowed.' },
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
    const extension = file.name.split('.').pop() || (file.type === 'application/pdf' ? 'pdf' : 'jpg')
    const filename = `receipt_${timestamp}.${extension}`

    // Create upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'receipts', investorId)
    await mkdir(uploadDir, { recursive: true })

    // Convert file to buffer and save locally
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const filePath = path.join(uploadDir, filename)

    await writeFile(filePath, buffer)

    // Generate public URL
    const publicUrl = `/uploads/receipts/${investorId}/${filename}`

    console.log(`✅ Receipt uploaded: ${publicUrl}`)

    return NextResponse.json({
      url: publicUrl,
      filename: filename,
    })
  } catch (error) {
    console.error('Error uploading receipt:', error)
    return NextResponse.json(
      { error: 'Failed to upload receipt' },
      { status: 500 }
    )
  }
}

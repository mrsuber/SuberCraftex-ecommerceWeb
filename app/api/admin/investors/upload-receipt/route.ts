import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { MB, saveUpload, UploadError } from '@/lib/uploads'

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
    const file = formData.get('file')
    const investorId = formData.get('investorId') as string

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!investorId) {
      return NextResponse.json({ error: 'Investor ID is required' }, { status: 400 })
    }

    const investor = await db.investor.findUnique({ where: { id: investorId }, select: { id: true } })
    if (!investor) {
      return NextResponse.json({ error: 'Investor not found' }, { status: 404 })
    }

    // Receipts are private: only this investor and admins can open them
    const saved = await saveUpload(file, {
      folder: ['receipts', investor.id],
      allowed: ['image', 'pdf'],
      maxBytes: 10 * MB,
      private: true,
      prefix: 'receipt',
    })
    const publicUrl = saved.url
    const filename = saved.filename

    return NextResponse.json({
      url: publicUrl,
      filename: filename,
    })
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('Error uploading receipt:', error)
    return NextResponse.json(
      { error: 'Failed to upload receipt' },
      { status: 500 }
    )
  }
}

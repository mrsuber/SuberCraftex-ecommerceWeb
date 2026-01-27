import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

// POST /api/investors/deposits/[depositId]/upload-receipt
// Investor uploads their mobile money receipt
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ depositId: string }> }
) {
  try {
    const { depositId } = await params
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
    })

    if (!investor) {
      return NextResponse.json(
        { error: 'Investor profile not found' },
        { status: 404 }
      )
    }

    // Get the deposit
    const deposit = await db.investorDeposit.findUnique({
      where: { id: depositId },
    })

    if (!deposit) {
      return NextResponse.json(
        { error: 'Deposit not found' },
        { status: 404 }
      )
    }

    // Verify this deposit belongs to the investor
    if (deposit.investorId !== investor.id) {
      return NextResponse.json(
        { error: 'This deposit does not belong to you' },
        { status: 403 }
      )
    }

    // Check if deposit is in awaiting_payment status
    if (deposit.confirmationStatus !== 'awaiting_payment') {
      return NextResponse.json(
        { error: `Cannot upload receipt. Current status: ${deposit.confirmationStatus}` },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { receiptUrl, referenceNumber } = body

    if (!receiptUrl) {
      return NextResponse.json(
        { error: 'Receipt image URL is required' },
        { status: 400 }
      )
    }

    // Update the deposit with investor receipt and move to awaiting_admin_confirmation
    const updatedDeposit = await db.investorDeposit.update({
      where: { id: depositId },
      data: {
        investorReceiptUrl: receiptUrl,
        referenceNumber: referenceNumber || null,
        confirmationStatus: 'awaiting_admin_confirmation',
      },
    })

    console.log(`✅ Investor uploaded receipt for deposit: ${depositId} - Investor: ${investor.investorNumber}`)

    // Create admin notification for new deposit
    try {
      const { NotificationService } = await import('@/lib/services/notification-service')
      await NotificationService.notifyNewDeposit({
        id: updatedDeposit.id,
        investorName: investor.fullName,
        amount: updatedDeposit.grossAmount.toString(),
        paymentMethod: updatedDeposit.paymentMethod,
      })
      console.log('✅ Admin notification created for deposit receipt upload')
    } catch (notifError) {
      console.error('⚠️  Failed to create admin notification:', notifError)
    }

    return NextResponse.json({
      message: 'Receipt uploaded successfully. Waiting for admin confirmation.',
      deposit: {
        id: updatedDeposit.id,
        confirmationStatus: updatedDeposit.confirmationStatus,
        investorReceiptUrl: updatedDeposit.investorReceiptUrl,
      },
    })
  } catch (error) {
    console.error('Error uploading investor receipt:', error)
    return NextResponse.json(
      { error: 'Failed to upload receipt' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { Decimal } from '@prisma/client/runtime/library'

// GET /api/investors/withdrawals - Get investor's withdrawal requests
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
    })

    if (!investor) {
      return NextResponse.json(
        { error: 'Investor profile not found' },
        { status: 404 }
      )
    }

    const withdrawals = await db.withdrawalRequest.findMany({
      where: { investorId: investor.id },
      orderBy: { requestedAt: 'desc' },
    })

    // Serialize to snake_case
    const serialized = withdrawals.map(w => ({
      id: w.id,
      investor_id: w.investorId,
      request_number: w.requestNumber,
      type: w.type,
      status: w.status,
      amount: w.amount.toString(),
      approved_amount: w.approvedAmount?.toString() || null,
      product_id: w.productId,
      variant_id: w.variantId,
      equipment_id: w.equipmentId,
      quantity: w.quantity,
      request_reason: w.requestReason,
      investor_notes: w.investorNotes,
      admin_notes: w.adminNotes,
      rejection_reason: w.rejectionReason,
      momo_number: w.momoNumber,
      momo_name: w.momoName,
      momo_provider: w.momoProvider,
      admin_receipt_url: w.adminReceiptUrl,
      investor_confirmed_at: w.investorConfirmedAt?.toISOString() || null,
      investor_feedback: w.investorFeedback,
      requested_by: w.requestedBy,
      reviewed_by: w.reviewedBy,
      processed_by: w.processedBy,
      requested_at: w.requestedAt.toISOString(),
      reviewed_at: w.reviewedAt?.toISOString() || null,
      processed_at: w.processedAt?.toISOString() || null,
      created_at: w.createdAt.toISOString(),
      updated_at: w.updatedAt.toISOString(),
    }))

    return NextResponse.json(serialized)
  } catch (error) {
    console.error('Error fetching withdrawals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch withdrawals' },
      { status: 500 }
    )
  }
}

// POST /api/investors/withdrawals - Create withdrawal request
export async function POST(request: NextRequest) {
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

    if (investor.status !== 'active') {
      return NextResponse.json(
        { error: 'Investor account is not active' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const {
      type,
      amount,
      productId,
      variantId,
      equipmentId,
      quantity,
      requestReason,
      investorNotes,
      momoNumber,
      momoName,
      momoProvider,
    } = body

    if (!type) {
      return NextResponse.json(
        { error: 'Withdrawal type is required' },
        { status: 400 }
      )
    }

    // Validate based on withdrawal type
    if (type === 'cash') {
      if (!amount || amount <= 0) {
        return NextResponse.json(
          { error: 'Valid amount is required for cash withdrawal' },
          { status: 400 }
        )
      }

      if (new Decimal(investor.cashBalance).lt(amount)) {
        return NextResponse.json(
          { error: 'Insufficient cash balance' },
          { status: 400 }
        )
      }

      // Require mobile money details for cash withdrawals
      if (!momoNumber || !momoName || !momoProvider) {
        return NextResponse.json(
          { error: 'Mobile money details (number, name, provider) are required for cash withdrawal' },
          { status: 400 }
        )
      }
    } else if (type === 'profit') {
      if (!amount || amount <= 0) {
        return NextResponse.json(
          { error: 'Valid amount is required for profit withdrawal' },
          { status: 400 }
        )
      }

      if (new Decimal(investor.profitBalance).lt(amount)) {
        return NextResponse.json(
          { error: 'Insufficient profit balance' },
          { status: 400 }
        )
      }

      // Require mobile money details for profit withdrawals
      if (!momoNumber || !momoName || !momoProvider) {
        return NextResponse.json(
          { error: 'Mobile money details (number, name, provider) are required for profit withdrawal' },
          { status: 400 }
        )
      }
    } else if (type === 'product') {
      if (!productId || !quantity || quantity <= 0) {
        return NextResponse.json(
          { error: 'Product ID and quantity are required' },
          { status: 400 }
        )
      }

      // Verify investor has this product allocation
      const allocation = await db.investorProductAllocation.findFirst({
        where: {
          investorId: investor.id,
          productId,
          variantId: variantId || null,
          quantityRemaining: { gte: quantity },
        },
      })

      if (!allocation) {
        return NextResponse.json(
          { error: 'Product allocation not found or insufficient quantity' },
          { status: 400 }
        )
      }
    } else if (type === 'equipment_share') {
      if (!equipmentId) {
        return NextResponse.json(
          { error: 'Equipment ID is required' },
          { status: 400 }
        )
      }

      // Verify investor has allocation in this equipment
      const allocation = await db.investorEquipmentAllocation.findFirst({
        where: {
          investorId: investor.id,
          equipmentId,
          hasExited: false,
        },
      })

      if (!allocation) {
        return NextResponse.json(
          { error: 'Equipment allocation not found or already exited' },
          { status: 400 }
        )
      }
    }

    // Generate withdrawal request number
    const year = new Date().getFullYear()
    const count = await db.withdrawalRequest.count()
    const requestNumber = `WDR-${year}-${String(count + 1).padStart(4, '0')}`

    const withdrawal = await db.withdrawalRequest.create({
      data: {
        investorId: investor.id,
        requestNumber,
        type,
        amount: amount || 0,
        productId: productId || null,
        variantId: variantId || null,
        equipmentId: equipmentId || null,
        quantity: quantity || null,
        requestReason: requestReason || null,
        investorNotes: investorNotes || null,
        momoNumber: momoNumber || null,
        momoName: momoName || null,
        momoProvider: momoProvider || null,
        requestedBy: user.id,
        status: 'pending',
      },
    })

    console.log(`✅ Withdrawal request created: ${requestNumber} - ${type}`)

    // Create admin notification for withdrawal request
    try {
      const { NotificationService } = await import('@/lib/services/notification-service')
      await NotificationService.notifyWithdrawalRequest({
        id: withdrawal.id,
        requestNumber: withdrawal.requestNumber,
        investorName: investor.fullName,
        amount: (amount || 0).toString(),
        type,
      })
      console.log('✅ Admin notification created for withdrawal request')
    } catch (notifError) {
      console.error('⚠️  Failed to create admin notification:', notifError)
    }

    // Serialize to snake_case
    const serialized = {
      id: withdrawal.id,
      investor_id: withdrawal.investorId,
      request_number: withdrawal.requestNumber,
      type: withdrawal.type,
      status: withdrawal.status,
      amount: withdrawal.amount.toString(),
      approved_amount: withdrawal.approvedAmount?.toString() || null,
      product_id: withdrawal.productId,
      variant_id: withdrawal.variantId,
      equipment_id: withdrawal.equipmentId,
      quantity: withdrawal.quantity,
      request_reason: withdrawal.requestReason,
      investor_notes: withdrawal.investorNotes,
      admin_notes: withdrawal.adminNotes,
      rejection_reason: withdrawal.rejectionReason,
      momo_number: withdrawal.momoNumber,
      momo_name: withdrawal.momoName,
      momo_provider: withdrawal.momoProvider,
      admin_receipt_url: withdrawal.adminReceiptUrl,
      investor_confirmed_at: withdrawal.investorConfirmedAt?.toISOString() || null,
      investor_feedback: withdrawal.investorFeedback,
      requested_by: withdrawal.requestedBy,
      reviewed_by: withdrawal.reviewedBy,
      processed_by: withdrawal.processedBy,
      requested_at: withdrawal.requestedAt.toISOString(),
      reviewed_at: withdrawal.reviewedAt?.toISOString() || null,
      processed_at: withdrawal.processedAt?.toISOString() || null,
      created_at: withdrawal.createdAt.toISOString(),
      updated_at: withdrawal.updatedAt.toISOString(),
    }

    return NextResponse.json(serialized, { status: 201 })
  } catch (error) {
    console.error('Error creating withdrawal:', error)
    return NextResponse.json(
      { error: 'Failed to create withdrawal request' },
      { status: 500 }
    )
  }
}

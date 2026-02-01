import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { Decimal } from '@prisma/client/runtime/library'

// POST /api/investors/withdrawals/[id]/confirm - Investor confirms or disputes a withdrawal
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Get the withdrawal
    const withdrawal = await db.withdrawalRequest.findUnique({
      where: { id },
    })

    if (!withdrawal) {
      return NextResponse.json(
        { error: 'Withdrawal request not found' },
        { status: 404 }
      )
    }

    // Verify this withdrawal belongs to the investor
    if (withdrawal.investorId !== investor.id) {
      return NextResponse.json(
        { error: 'This withdrawal request does not belong to you' },
        { status: 403 }
      )
    }

    // Check if in correct status
    if (withdrawal.status !== 'awaiting_investor_confirmation') {
      return NextResponse.json(
        { error: `Withdrawal cannot be confirmed in its current status: ${withdrawal.status}` },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { confirmed, feedback } = body

    if (typeof confirmed !== 'boolean') {
      return NextResponse.json(
        { error: 'The "confirmed" field must be a boolean (true/false)' },
        { status: 400 }
      )
    }

    if (confirmed) {
      // Confirm the withdrawal - deduct balance and create transaction
      const finalAmount = withdrawal.approvedAmount || withdrawal.amount

      const result = await db.$transaction(async (tx) => {
        let updatedInvestor
        let transaction

        if (withdrawal.type === 'cash') {
          // Deduct from cash balance
          updatedInvestor = await tx.investor.update({
            where: { id: withdrawal.investorId },
            data: {
              cashBalance: {
                decrement: finalAmount,
              },
              totalWithdrawn: {
                increment: finalAmount,
              },
            },
          })

          transaction = await tx.investorTransaction.create({
            data: {
              investorId: withdrawal.investorId,
              type: 'withdrawal_cash',
              amount: finalAmount,
              balanceAfter: updatedInvestor.cashBalance,
              profitAfter: updatedInvestor.profitBalance,
              withdrawalId: withdrawal.id,
              description: `Cash withdrawal confirmed`,
              notes: `Request: ${withdrawal.requestNumber}`,
              createdBy: user.id,
            },
          })
        } else if (withdrawal.type === 'profit') {
          // Deduct from profit balance
          updatedInvestor = await tx.investor.update({
            where: { id: withdrawal.investorId },
            data: {
              profitBalance: {
                decrement: finalAmount,
              },
              totalWithdrawn: {
                increment: finalAmount,
              },
            },
          })

          transaction = await tx.investorTransaction.create({
            data: {
              investorId: withdrawal.investorId,
              type: 'withdrawal_profit',
              amount: finalAmount,
              balanceAfter: updatedInvestor.cashBalance,
              profitAfter: updatedInvestor.profitBalance,
              withdrawalId: withdrawal.id,
              description: `Profit withdrawal confirmed`,
              notes: `Request: ${withdrawal.requestNumber}`,
              createdBy: user.id,
            },
          })
        } else if (withdrawal.type === 'product') {
          // Mark product allocation quantities as withdrawn
          const allocation = await tx.investorProductAllocation.findFirst({
            where: {
              investorId: withdrawal.investorId,
              productId: withdrawal.productId!,
              variantId: withdrawal.variantId,
              quantityRemaining: { gte: withdrawal.quantity! },
            },
            include: {
              product: true,
            },
          })

          if (!allocation) {
            throw new Error('Product allocation not found')
          }

          const withdrawnValue = new Decimal(allocation.purchasePrice).mul(withdrawal.quantity!)

          await tx.investorProductAllocation.update({
            where: { id: allocation.id },
            data: {
              quantityRemaining: {
                decrement: withdrawal.quantity!,
              },
            },
          })

          updatedInvestor = await tx.investor.update({
            where: { id: withdrawal.investorId },
            data: {
              totalWithdrawn: {
                increment: withdrawnValue,
              },
            },
          })

          transaction = await tx.investorTransaction.create({
            data: {
              investorId: withdrawal.investorId,
              type: 'withdrawal_product',
              amount: withdrawnValue,
              balanceAfter: updatedInvestor.cashBalance,
              profitAfter: updatedInvestor.profitBalance,
              productId: withdrawal.productId,
              withdrawalId: withdrawal.id,
              description: `Product withdrawal confirmed: ${withdrawal.quantity} x ${allocation.product.name}`,
              notes: `Request: ${withdrawal.requestNumber}`,
              createdBy: user.id,
            },
          })
        } else if (withdrawal.type === 'equipment_share') {
          // Process equipment exit
          const allocation = await tx.investorEquipmentAllocation.findFirst({
            where: {
              investorId: withdrawal.investorId,
              equipmentId: withdrawal.equipmentId!,
              hasExited: false,
            },
            include: {
              equipment: true,
            },
          })

          if (!allocation) {
            throw new Error('Equipment allocation not found')
          }

          // Calculate exit amount based on current value and ownership percentage
          const exitAmount = new Decimal(allocation.equipment.currentValue)
            .mul(allocation.investmentPercentage)
            .div(100)

          await tx.investorEquipmentAllocation.update({
            where: { id: allocation.id },
            data: {
              hasExited: true,
              exitAmount,
              exitedAt: new Date(),
            },
          })

          // Credit investor's cash balance with exit amount
          updatedInvestor = await tx.investor.update({
            where: { id: withdrawal.investorId },
            data: {
              cashBalance: {
                increment: exitAmount,
              },
              totalWithdrawn: {
                increment: exitAmount,
              },
            },
          })

          transaction = await tx.investorTransaction.create({
            data: {
              investorId: withdrawal.investorId,
              type: 'withdrawal_equipment',
              amount: exitAmount,
              balanceAfter: updatedInvestor.cashBalance,
              profitAfter: updatedInvestor.profitBalance,
              equipmentId: withdrawal.equipmentId,
              withdrawalId: withdrawal.id,
              description: `Equipment share exit confirmed: ${allocation.equipment.name} (${allocation.investmentPercentage}%)`,
              notes: `Request: ${withdrawal.requestNumber} - Current value: ${allocation.equipment.currentValue}`,
              createdBy: user.id,
            },
          })
        }

        // Update withdrawal status to confirmed
        const updatedWithdrawal = await tx.withdrawalRequest.update({
          where: { id },
          data: {
            status: 'confirmed',
            investorConfirmedAt: new Date(),
            investorFeedback: feedback || null,
          },
        })

        return { withdrawal: updatedWithdrawal, investor: updatedInvestor, transaction }
      })

      console.log(`✅ Withdrawal confirmed by investor: ${investor.investorNumber} - ${withdrawal.requestNumber}`)

      return NextResponse.json({
        message: 'Withdrawal confirmed successfully. Your balance has been updated.',
        withdrawal: result.withdrawal,
        newBalance: {
          cash: result.investor?.cashBalance.toString(),
          profit: result.investor?.profitBalance.toString(),
        },
      })
    } else {
      // Dispute the withdrawal
      if (!feedback) {
        return NextResponse.json(
          { error: 'Please provide a reason for disputing this withdrawal' },
          { status: 400 }
        )
      }

      const updatedWithdrawal = await db.withdrawalRequest.update({
        where: { id },
        data: {
          status: 'disputed',
          investorFeedback: feedback,
        },
      })

      console.log(`⚠️ Withdrawal disputed by investor: ${investor.investorNumber} - ${withdrawal.requestNumber} - Reason: ${feedback}`)

      return NextResponse.json({
        message: 'Withdrawal disputed. Our team will review and contact you.',
        withdrawal: updatedWithdrawal,
      })
    }
  } catch (error) {
    console.error('Error processing withdrawal confirmation:', error)
    return NextResponse.json(
      { error: 'Failed to process confirmation' },
      { status: 500 }
    )
  }
}

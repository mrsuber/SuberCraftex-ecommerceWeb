import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { Decimal } from '@prisma/client/runtime/library'

// POST /api/admin/withdrawals/[id]/process - Process withdrawal request
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getSession()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const withdrawal = await db.withdrawalRequest.findUnique({
      where: { id },
      include: {
        investor: true,
      },
    })

    if (!withdrawal) {
      return NextResponse.json(
        { error: 'Withdrawal request not found' },
        { status: 404 }
      )
    }

    if (withdrawal.status !== 'pending' && withdrawal.status !== 'approved') {
      return NextResponse.json(
        { error: 'Withdrawal request cannot be processed' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { action, adminNotes, approvedAmount, rejectionReason } = body

    if (!action || !['approve', 'reject', 'complete'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be approve, reject, or complete' },
        { status: 400 }
      )
    }

    // Process based on action
    const result = await db.$transaction(async (tx) => {
      if (action === 'reject') {
        const updated = await tx.withdrawalRequest.update({
          where: { id },
          data: {
            status: 'rejected',
            adminNotes: adminNotes || null,
            rejectionReason: rejectionReason || null,
            reviewedBy: user.id,
            reviewedAt: new Date(),
          },
        })

        return { withdrawal: updated }
      }

      if (action === 'approve') {
        const updated = await tx.withdrawalRequest.update({
          where: { id },
          data: {
            status: 'approved',
            approvedAmount: approvedAmount || withdrawal.amount,
            adminNotes: adminNotes || null,
            reviewedBy: user.id,
            reviewedAt: new Date(),
          },
        })

        return { withdrawal: updated }
      }

      // Complete withdrawal
      if (action === 'complete') {
        const finalAmount = withdrawal.approvedAmount || withdrawal.amount

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
              description: `Cash withdrawal`,
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
              description: `Profit withdrawal`,
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
              description: `Product withdrawal: ${withdrawal.quantity} x ${allocation.product.name}`,
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
              description: `Equipment share exit: ${allocation.equipment.name} (${allocation.investmentPercentage}%)`,
              notes: `Request: ${withdrawal.requestNumber} - Current value: ${allocation.equipment.currentValue}`,
              createdBy: user.id,
            },
          })
        }

        const updated = await tx.withdrawalRequest.update({
          where: { id },
          data: {
            status: 'completed',
            processedBy: user.id,
            processedAt: new Date(),
            adminNotes: adminNotes || null,
          },
        })

        return { withdrawal: updated, investor: updatedInvestor, transaction }
      }

      return {}
    })

    console.log(`✅ Withdrawal ${action}d: ${withdrawal.requestNumber} - ${withdrawal.type}`)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error processing withdrawal:', error)
    return NextResponse.json(
      { error: 'Failed to process withdrawal' },
      { status: 500 }
    )
  }
}

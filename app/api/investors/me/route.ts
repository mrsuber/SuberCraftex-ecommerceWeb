import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

// GET /api/investors/me - Get current investor profile
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
      include: {
        deposits: {
          orderBy: { depositedAt: 'desc' },
          take: 10,
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        productAllocations: {
          where: { quantityRemaining: { gt: 0 } },
          include: {
            product: {
              select: {
                name: true,
                featuredImage: true,
                sku: true,
              },
            },
            variant: {
              select: {
                name: true,
                sku: true,
                imageUrl: true,
              },
            },
          },
        },
        equipmentAllocations: {
          where: { hasExited: false },
          include: {
            equipment: {
              select: {
                name: true,
                equipmentNumber: true,
                currentValue: true,
                status: true,
                photos: true,
              },
            },
          },
        },
        profitDistributions: {
          orderBy: { distributedAt: 'desc' },
          take: 10,
        },
        withdrawalRequests: {
          orderBy: { requestedAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!investor) {
      return NextResponse.json(
        { error: 'Investor profile not found' },
        { status: 404 }
      )
    }

    // Serialize to snake_case for mobile app compatibility
    const serialized = {
      id: investor.id,
      user_id: investor.userId,
      investor_number: investor.investorNumber,
      status: investor.status,
      cash_balance: investor.cashBalance.toString(),
      profit_balance: investor.profitBalance.toString(),
      total_invested: investor.totalInvested.toString(),
      total_profit: investor.totalProfit.toString(),
      total_withdrawn: investor.totalWithdrawn.toString(),
      phone: investor.phone,
      id_document_url: investor.idDocumentUrl,
      kyc_status: investor.kycStatus,
      agreement_accepted: investor.agreementAccepted,
      agreement_accepted_at: investor.agreementAcceptedAt?.toISOString() || null,
      kyc_submitted_at: investor.kycSubmittedAt?.toISOString() || null,
      verified_at: investor.verifiedAt?.toISOString() || null,
      created_at: investor.createdAt.toISOString(),
      updated_at: investor.updatedAt.toISOString(),
      deposits: investor.deposits.map(d => ({
        id: d.id,
        investor_id: d.investorId,
        deposit_number: d.depositNumber,
        gross_amount: d.grossAmount?.toString() || d.amount.toString(),
        charges: d.charges?.toString() || '0',
        amount: d.amount.toString(),
        payment_method: d.paymentMethod,
        reference_number: d.referenceNumber || null,
        receipt_url: d.receiptUrl || null,
        investor_receipt_url: d.investorReceiptUrl || null,
        investor_notes: d.investorNotes || null,
        notes: d.notes || null,
        confirmation_status: d.confirmationStatus || 'confirmed',
        deposited_at: d.depositedAt.toISOString(),
        confirmed_at: d.confirmedAt?.toISOString() || null,
        admin_confirmed_at: d.adminConfirmedAt?.toISOString() || null,
        created_at: d.createdAt.toISOString(),
      })),
      transactions: investor.transactions.map(t => ({
        id: t.id,
        investor_id: t.investorId,
        type: t.type,
        amount: t.amount.toString(),
        balance_after: t.balanceAfter.toString(),
        profit_after: t.profitAfter.toString(),
        description: t.description,
        notes: t.notes,
        product_id: t.productId,
        created_at: t.createdAt.toISOString(),
      })),
      product_allocations: investor.productAllocations.map(p => ({
        id: p.id,
        investor_id: p.investorId,
        product_id: p.productId,
        variant_id: p.variantId,
        amount_allocated: p.amountAllocated.toString(),
        quantity: p.quantity,
        purchase_price: p.purchasePrice.toString(),
        total_investment: p.totalInvestment.toString(),
        quantity_sold: p.quantitySold,
        quantity_remaining: p.quantityRemaining,
        profit_generated: p.profitGenerated.toString(),
        capital_returned: p.capitalReturned.toString(),
        notes: p.notes,
        allocated_at: p.allocatedAt.toISOString(),
        created_at: p.createdAt.toISOString(),
        updated_at: p.updatedAt.toISOString(),
        product: p.product ? {
          name: p.product.name,
          featured_image: p.product.featuredImage,
          sku: p.product.sku,
        } : null,
        variant: p.variant ? {
          name: p.variant.name,
          sku: p.variant.sku,
          image_url: p.variant.imageUrl,
        } : null,
      })),
      equipment_allocations: investor.equipmentAllocations.map(e => ({
        id: e.id,
        investor_id: e.investorId,
        equipment_id: e.equipmentId,
        amount_allocated: e.amountAllocated.toString(),
        investment_percentage: e.investmentPercentage.toString(),
        profit_share: e.profitShare.toString(),
        total_profit_received: e.totalProfitReceived.toString(),
        has_exited: e.hasExited,
        exit_amount: e.exitAmount?.toString() || null,
        allocated_at: e.allocatedAt.toISOString(),
        exited_at: e.exitedAt?.toISOString() || null,
        created_at: e.createdAt.toISOString(),
        updated_at: e.updatedAt.toISOString(),
        equipment: e.equipment ? {
          name: e.equipment.name,
          equipment_number: e.equipment.equipmentNumber,
          current_value: e.equipment.currentValue.toString(),
          status: e.equipment.status,
          photos: e.equipment.photos,
        } : null,
      })),
      profit_distributions: investor.profitDistributions.map(p => ({
        id: p.id,
        investor_id: p.investorId,
        sale_revenue: p.saleRevenue.toString(),
        sale_cost: p.saleCost.toString(),
        gross_profit: p.grossProfit.toString(),
        company_share: p.companyShare.toString(),
        investor_share: p.investorShare.toString(),
        capital_returned: p.capitalReturned.toString(),
        distributed_at: p.distributedAt.toISOString(),
        created_at: p.createdAt.toISOString(),
      })),
      withdrawal_requests: investor.withdrawalRequests.map(w => ({
        id: w.id,
        investor_id: w.investorId,
        amount: w.amount.toString(),
        source: w.source,
        status: w.status,
        approved_amount: w.approvedAmount?.toString() || null,
        payment_method: w.paymentMethod,
        payment_details: w.paymentDetails,
        admin_notes: w.adminNotes,
        requested_at: w.requestedAt.toISOString(),
        reviewed_at: w.reviewedAt?.toISOString() || null,
        processed_at: w.processedAt?.toISOString() || null,
        created_at: w.createdAt.toISOString(),
        updated_at: w.updatedAt.toISOString(),
      })),
    }

    return NextResponse.json(serialized)
  } catch (error) {
    console.error('Error fetching investor profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch investor profile' },
      { status: 500 }
    )
  }
}

// PATCH /api/investors/me - Update investor profile
export async function PATCH(request: NextRequest) {
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

    const body = await request.json()
    const { phone, idDocumentUrl } = body

    const updateData: any = {}

    if (phone) {
      updateData.phone = phone
    }

    if (idDocumentUrl) {
      updateData.idDocumentUrl = idDocumentUrl
    }

    const updatedInvestor = await db.investor.update({
      where: { id: investor.id },
      data: updateData,
    })

    return NextResponse.json(updatedInvestor)
  } catch (error) {
    console.error('Error updating investor profile:', error)
    return NextResponse.json(
      { error: 'Failed to update investor profile' },
      { status: 500 }
    )
  }
}

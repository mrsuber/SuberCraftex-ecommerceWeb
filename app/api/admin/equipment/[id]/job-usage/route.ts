import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { Decimal } from '@prisma/client/runtime/library'

// POST /api/admin/equipment/[id]/job-usage - Record equipment job usage and distribute profit
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: equipmentId } = await params
    const user = await getSession()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const equipment = await db.equipment.findUnique({
      where: { id: equipmentId },
      include: {
        investorAllocations: {
          where: { hasExited: false },
          include: {
            investor: true,
          },
        },
      },
    })

    if (!equipment) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      orderId,
      bookingId,
      jobDescription,
      revenue,
      materialCost,
      laborCost,
      maintenanceCost = 0,
      taxCost = 0,
      otherExpenses = 0,
      notes,
    } = body

    if (!jobDescription || !revenue) {
      return NextResponse.json(
        { error: 'Missing required fields: jobDescription, revenue' },
        { status: 400 }
      )
    }

    // Calculate totals
    const totalExpenses = new Decimal(materialCost || 0)
      .add(laborCost || 0)
      .add(maintenanceCost)
      .add(taxCost)
      .add(otherExpenses)

    const netProfit = new Decimal(revenue).sub(totalExpenses)

    if (netProfit.lte(0)) {
      return NextResponse.json(
        { error: 'Job generated no profit or a loss' },
        { status: 400 }
      )
    }

    // Calculate 50-50 split
    const companyProfit = netProfit.div(2)
    const investorPoolProfit = netProfit.div(2)

    // Distribute profit to investors in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create job usage record
      const jobUsage = await tx.equipmentJobUsage.create({
        data: {
          equipmentId,
          orderId: orderId || null,
          bookingId: bookingId || null,
          jobDescription,
          revenue,
          materialCost: materialCost || 0,
          laborCost: laborCost || 0,
          maintenanceCost,
          taxCost,
          otherExpenses,
          totalExpenses,
          netProfit,
          companyProfit,
          investorPoolProfit,
          profitDistributed: true,
          notes: notes || null,
        },
      })

      // Update equipment totals
      await tx.equipment.update({
        where: { id: equipmentId },
        data: {
          totalRevenue: {
            increment: revenue,
          },
          totalProfit: {
            increment: netProfit,
          },
          maintenanceCost: {
            increment: maintenanceCost,
          },
        },
      })

      // Distribute profit to each investor proportionally
      const distributions = []
      for (const allocation of equipment.investorAllocations) {
        // Calculate investor's share based on their profit share percentage
        const investorShare = investorPoolProfit
          .mul(allocation.profitShare)
          .div(100)

        // Update investor profit balance
        const updatedInvestor = await tx.investor.update({
          where: { id: allocation.investorId },
          data: {
            profitBalance: {
              increment: investorShare,
            },
            totalProfit: {
              increment: investorShare,
            },
          },
        })

        // Update allocation total profit received
        await tx.investorEquipmentAllocation.update({
          where: { id: allocation.id },
          data: {
            totalProfitReceived: {
              increment: investorShare,
            },
          },
        })

        // Create profit distribution record
        const distribution = await tx.profitDistribution.create({
          data: {
            investorId: allocation.investorId,
            orderId: orderId || null,
            equipmentId,
            saleRevenue: revenue,
            saleCost: totalExpenses,
            grossProfit: netProfit,
            companyShare: companyProfit,
            investorShare,
            description: `Equipment job: ${jobDescription}`,
            notes: `${allocation.profitShare.toFixed(2)}% share of equipment profit`,
          },
        })

        // Create transaction record
        await tx.investorTransaction.create({
          data: {
            investorId: allocation.investorId,
            type: 'profit_credit',
            amount: investorShare,
            balanceAfter: updatedInvestor.cashBalance,
            profitAfter: updatedInvestor.profitBalance,
            equipmentId,
            orderId: orderId || null,
            description: `Profit from ${equipment.name}: ${jobDescription}`,
            notes: `${allocation.profitShare.toFixed(2)}% of ${investorPoolProfit} pool`,
            createdBy: user.id,
          },
        })

        distributions.push({
          investor: allocation.investor,
          share: investorShare,
          percentage: allocation.profitShare,
        })
      }

      return { jobUsage, distributions }
    })

    console.log(`✅ Equipment job recorded: ${equipment.name} - Profit distributed to ${result.distributions.length} investors`)

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error recording job usage:', error)
    return NextResponse.json(
      { error: 'Failed to record job usage' },
      { status: 500 }
    )
  }
}

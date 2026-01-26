import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import PendingDepositsClient from './PendingDepositsClient'

export const metadata: Metadata = {
  title: 'Pending Deposits - Admin Dashboard',
  description: 'Manage pending investor deposits',
}

export default async function PendingDepositsPage() {
  const user = await getSession()

  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  // Fetch all pending deposits across all investors
  const pendingDeposits = await db.investorDeposit.findMany({
    where: {
      confirmationStatus: {
        in: ['awaiting_payment', 'awaiting_admin_confirmation', 'awaiting_receipt', 'pending_confirmation'],
      },
    },
    include: {
      investor: {
        select: {
          id: true,
          investorNumber: true,
          fullName: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: [
      { confirmationStatus: 'asc' },
      { createdAt: 'desc' },
    ],
  })

  // Transform for client
  const deposits = pendingDeposits.map(deposit => ({
    id: deposit.id,
    depositNumber: `DEP-${deposit.id.slice(0, 8).toUpperCase()}`,
    grossAmount: deposit.grossAmount.toString(),
    charges: deposit.charges.toString(),
    amount: deposit.amount.toString(),
    paymentMethod: deposit.paymentMethod,
    referenceNumber: deposit.referenceNumber,
    investorReceiptUrl: deposit.investorReceiptUrl,
    receiptUrl: deposit.receiptUrl,
    notes: deposit.notes,
    confirmationStatus: deposit.confirmationStatus,
    investorNotes: deposit.investorNotes,
    adminConfirmedAt: deposit.adminConfirmedAt?.toISOString() || null,
    confirmedAt: deposit.confirmedAt?.toISOString() || null,
    depositedAt: deposit.depositedAt.toISOString(),
    createdAt: deposit.createdAt.toISOString(),
    investor: deposit.investor,
  }))

  // Group by status for better display
  const groupedDeposits = {
    awaiting_admin_confirmation: deposits.filter(d => d.confirmationStatus === 'awaiting_admin_confirmation'),
    awaiting_receipt: deposits.filter(d => d.confirmationStatus === 'awaiting_receipt'),
    awaiting_payment: deposits.filter(d => d.confirmationStatus === 'awaiting_payment'),
    pending_confirmation: deposits.filter(d => d.confirmationStatus === 'pending_confirmation'),
  }

  return <PendingDepositsClient groupedDeposits={groupedDeposits} />
}

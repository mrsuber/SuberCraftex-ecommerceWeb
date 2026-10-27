import { PaymentCollection } from '@prisma/client'
import { Accounts, credit, Tx } from '@/lib/ledger'
import { cancelUnpaidOrder, handleLateOrderPayment, lockOrder, markOrderPaid, orderSaleCredits } from '@/lib/commerce/order-payments'
import { sendOrderConfirmation } from '@/lib/commerce/order-emails'
import { recordBookingPayment, recordRepairPayment } from '@/lib/services/booking-payments'
import { creditDeposit, depositCredits, onWithdrawalPaid, onWithdrawalReturned } from '@/lib/investors/funds'
import { advancePayoutReturned } from '@/lib/payroll'
import { purchasePayoutReturned, purchasePayoutSent } from '@/lib/finance/purchases'
import { apprenticeFeeHandler, refundPaid } from '@/lib/apprentices/fees'
import { registerCollectionHandler } from './collections'
import { registerPayoutHandler } from './payouts'

/**
 * What each kind of Mobile Money payment does once it is paid, failed or expired.
 * Imported once by every entry point that touches collections (lib/payments/index.ts).
 */

let registered = false

export function registerPaymentHandlers() {
  if (registered) return
  registered = true

  const orderHandler = {
    async credits(tx: Tx, c: PaymentCollection) {
      const order = await lockOrder(tx, c.targetId)
      return orderSaleCredits(order)
    },
    async onPaid(tx: Tx, c: PaymentCollection, late: boolean) {
      const order = await lockOrder(tx, c.targetId)
      if (order.orderStatus === 'cancelled') {
        await handleLateOrderPayment(tx, order.id, c.amount)
        return
      }
      await markOrderPaid(tx, order.id)
      if (late) console.log(`[payments] late payment applied to ${order.orderNumber}`)
    },
    async onExpired(tx: Tx, c: PaymentCollection) {
      const order = await lockOrder(tx, c.targetId)
      // POS sales stay open for the cashier to take cash instead
      if (order.isPosOrder) return
      // The customer may still retry with another number until the order's own deadline
      if (order.paymentDueAt && order.paymentDueAt > new Date()) return
      await cancelUnpaidOrder(tx, order.id, 'Cancelled: Mobile Money payment not received in time')
    },
    async afterPaid(c: PaymentCollection) {
      if (c.purpose === 'order') await sendOrderConfirmation(c.targetId)
    },
  }
  registerCollectionHandler('order', orderHandler)
  registerCollectionHandler('pos_order', orderHandler)

  registerCollectionHandler('booking', {
    async credits(_tx, c) {
      return [credit(Accounts.serviceIncome(), c.amount)]
    },
    async onPaid(tx, c) {
      const meta = c.metadata as { paymentType?: 'down_payment' | 'partial_payment' | 'final_payment' }
      await recordBookingPayment(tx, {
        bookingId: c.targetId,
        type: meta.paymentType ?? 'final_payment',
        amount: c.amount,
        method: 'mobile_money',
        collectionReference: c.reference,
      })
    },
  })

  registerCollectionHandler('repair', {
    async credits(_tx, c) {
      return [credit(Accounts.repairIncome(), c.amount)]
    },
    async onPaid(tx, c) {
      const meta = c.metadata as { paymentType?: string }
      await recordRepairPayment(tx, {
        repairId: c.targetId,
        amount: c.amount,
        paymentType: meta.paymentType ?? 'final_payment',
        method: 'mobile_money',
        collectionReference: c.reference,
        createdBy: c.userId ?? 'customer',
        reference: c.providerReference,
      })
    },
  })

  registerCollectionHandler('investor_deposit', {
    async credits(_tx, c) {
      return depositCredits(c)
    },
    async onPaid(tx, c) {
      await creditDeposit(tx, c)
    },
  })

  registerPayoutHandler('investor_withdrawal', {
    onSucceeded: onWithdrawalPaid,
    onReturned: onWithdrawalReturned,
  })

  registerCollectionHandler('apprentice_fee', apprenticeFeeHandler)

  registerPayoutHandler('apprentice_refund', {
    onSucceeded: (tx, payout) => refundPaid(tx, payout),
  })

  registerPayoutHandler('stock_purchase', {
    onSucceeded: purchasePayoutSent,
    onReturned: purchasePayoutReturned,
  })

  registerPayoutHandler('salary_advance', {
    onReturned: (tx, payout, reason) => (payout.relatedId ? advancePayoutReturned(tx, payout.relatedId, reason) : Promise.resolve()),
  })
}

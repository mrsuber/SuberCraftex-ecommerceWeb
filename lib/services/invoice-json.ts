import { ServiceInvoice, ServiceInvoiceLine } from '@prisma/client'
import { toXaf } from '@/lib/money'
import { InvoiceSummary } from './service-invoices'

/** An invoice as the browser gets it: plain numbers, no Decimals or BigInts. */
export function invoiceJson(
  invoice: ServiceInvoice & { lines?: ServiceInvoiceLine[] },
  summary?: InvoiceSummary | null,
  opts: { withToken?: boolean } = {},
) {
  return {
    id: invoice.id,
    number: invoice.number,
    status: invoice.status,
    customerName: invoice.customerName,
    customerEmail: invoice.customerEmail,
    customerPhone: invoice.customerPhone,
    customerAddress: invoice.customerAddress,
    subtotal: Number(toXaf(invoice.subtotal)),
    discount: Number(toXaf(invoice.discount)),
    total: Number(toXaf(invoice.total)),
    notes: invoice.notes,
    dueDate: invoice.dueDate ? invoice.dueDate.toISOString().slice(0, 10) : null,
    issuedAt: invoice.issuedAt?.toISOString() ?? null,
    sentAt: invoice.sentAt?.toISOString() ?? null,
    paidAt: invoice.paidAt?.toISOString() ?? null,
    voidedAt: invoice.voidedAt?.toISOString() ?? null,
    voidReason: invoice.voidReason,
    lines: (invoice.lines ?? []).map((l) => ({
      id: l.id,
      kind: l.kind,
      description: l.description,
      quantity: Number(l.quantity),
      unitPrice: Number(toXaf(l.unitPrice)),
      amount: Number(toXaf(l.amount)),
    })),
    summary: summary
      ? { total: Number(summary.total), paid: Number(summary.paid), balance: Number(summary.balance), credit: Number(summary.credit) }
      : null,
    ...(opts.withToken ? { accessToken: invoice.accessToken } : {}),
  }
}

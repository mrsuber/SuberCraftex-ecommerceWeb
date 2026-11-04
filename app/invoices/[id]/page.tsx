import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { timingSafeEqual } from 'crypto'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { getSetting } from '@/lib/settings'
import { formatCurrency } from '@/lib/currency'
import { toXaf } from '@/lib/money'
import { STAFF_ROLES } from '@/lib/services/booking-workflow'
import { invoiceSummary } from '@/lib/services/service-invoices'
import { PrintButton } from './PrintButton'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Invoice | SuberCraftex', robots: { index: false, follow: false } }

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ t?: string }>
}

const KIND_LABELS: Record<string, string> = {
  labour: 'Labour',
  material: 'Material',
  part: 'Part',
  travel: 'Travel',
  fee: 'Fee',
  other: '',
}

const fcfa = (v: unknown) => formatCurrency(Number(toXaf(v as any)))
const day = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Douala' })

function tokenMatches(given: string | undefined, expected: string) {
  if (!given) return false
  const a = Buffer.from(given)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

/**
 * A service invoice, ready to print or save as PDF. Opens for staff, for the customer who
 * owns the booking, or for anyone holding the secret link sent with the invoice (customers
 * recorded by staff often have no account).
 */
export default async function InvoicePage({ params, searchParams }: Props) {
  const { id } = await params
  const { t } = await searchParams

  const invoice = await db.serviceInvoice.findUnique({
    where: { id },
    include: {
      lines: { orderBy: { sortOrder: 'asc' } },
      booking: {
        include: {
          service: { select: { name: true } },
          payments: { where: { status: 'completed' }, orderBy: { createdAt: 'asc' } },
        },
      },
    },
  })
  if (!invoice) notFound()

  const user = await getCurrentUser()
  const staff = !!user && STAFF_ROLES.includes(user.role)
  const owner = !!user && user.id === invoice.booking.userId
  if (!staff && !owner && !tokenMatches(t, invoice.accessToken)) notFound()
  // Customers see an invoice only once it is issued
  if (!staff && invoice.status === 'draft') notFound()

  const company = await getSetting('company.profile')
  const summary = await invoiceSummary(db, invoice)
  const isDraft = invoice.status === 'draft'
  const isVoid = invoice.status === 'void'
  const isPaid = invoice.status === 'issued' && summary.balance === 0n

  return (
    <div className="min-h-screen bg-neutral-100 py-8 print:bg-white print:py-0">
      <style>{`@media print { @page { size: A4; margin: 14mm } .no-print { display: none !important } }`}</style>

      <div className="no-print mx-auto mb-4 flex max-w-3xl flex-wrap items-center justify-between gap-2 px-4">
        <Link href={staff ? `/dashboard/bookings/${invoice.bookingId}` : owner ? `/bookings/${invoice.bookingId}` : '/'} className="text-sm text-neutral-600 hover:underline">
          ← Back
        </Link>
        <div className="flex gap-2">
          {owner && invoice.status === 'issued' && summary.balance > 0n && (
            <Link
              href={`/bookings/${invoice.bookingId}/payment`}
              className="inline-flex items-center rounded-md border border-neutral-900 px-4 py-2 text-sm font-medium hover:bg-neutral-200"
            >
              Pay by Mobile Money
            </Link>
          )}
          <PrintButton />
        </div>
      </div>

      <article className="relative mx-auto max-w-3xl overflow-hidden bg-white px-6 py-8 shadow-sm sm:px-10 print:max-w-none print:px-0 print:shadow-none">
        {(isPaid || isVoid || isDraft) && (
          <div
            aria-hidden
            className={`pointer-events-none absolute right-6 top-24 rotate-[-12deg] rounded-md border-4 px-4 py-1 text-3xl font-black tracking-widest opacity-70 ${
              isVoid ? 'border-red-600 text-red-600' : isDraft ? 'border-neutral-400 text-neutral-400' : 'border-emerald-600 text-emerald-600'
            }`}
          >
            {isVoid ? 'VOID' : isDraft ? 'DRAFT' : 'PAID'}
          </div>
        )}

        <header className="flex flex-col gap-6 border-b-2 border-[#D4AF76] pb-6 sm:flex-row sm:justify-between">
          <div>
            <div className="text-2xl font-bold text-[#B8924F]">{company.name || 'SuberCraftex'}</div>
            <div className="mt-1 space-y-0.5 text-sm text-neutral-600">
              {company.address && <div>{company.address}</div>}
              {company.phone && <div>Tel: {company.phone}</div>}
              {company.email && <div>{company.email}</div>}
              {company.taxId && <div>NIU: {company.taxId}</div>}
              {company.registration && <div>RCCM: {company.registration}</div>}
            </div>
          </div>
          <div className="sm:text-right">
            <h1 className="text-xl font-semibold uppercase tracking-wide">Invoice</h1>
            <dl className="mt-2 grid grid-cols-[auto_auto] gap-x-4 gap-y-0.5 text-sm sm:justify-end">
              <dt className="text-neutral-500">Number</dt>
              <dd className="font-mono font-medium">{invoice.number ?? 'Not issued yet'}</dd>
              <dt className="text-neutral-500">Date</dt>
              <dd>{day(invoice.issuedAt ?? invoice.createdAt)}</dd>
              <dt className="text-neutral-500">Due</dt>
              <dd>{invoice.dueDate ? day(invoice.dueDate) : 'On receipt'}</dd>
              <dt className="text-neutral-500">Booking</dt>
              <dd className="font-mono">{invoice.booking.bookingNumber}</dd>
            </dl>
          </div>
        </header>

        <section className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Billed to</h2>
            <div className="mt-1 text-sm">
              <div className="font-medium">{invoice.customerName}</div>
              {invoice.customerAddress && <div>{invoice.customerAddress}</div>}
              {invoice.customerPhone && <div>{invoice.customerPhone}</div>}
              {invoice.customerEmail && <div>{invoice.customerEmail}</div>}
            </div>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Service</h2>
            <div className="mt-1 text-sm">
              <div className="font-medium">{invoice.booking.service.name}</div>
              {invoice.booking.completedAt && <div>Work completed {day(invoice.booking.completedAt)}</div>}
              {invoice.booking.serviceAddress && <div>At: {invoice.booking.serviceAddress}</div>}
            </div>
          </div>
        </section>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-neutral-300 text-left text-xs uppercase tracking-wide text-neutral-500">
                <th className="py-2 pr-2 font-medium">Description</th>
                <th className="py-2 px-2 text-right font-medium">Qty</th>
                <th className="py-2 px-2 text-right font-medium">Unit price</th>
                <th className="py-2 pl-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lines.map((l) => (
                <tr key={l.id} className="border-b border-neutral-100 align-top">
                  <td className="py-2 pr-2">
                    {l.description}
                    {KIND_LABELS[l.kind] && <span className="ml-2 text-xs text-neutral-400">{KIND_LABELS[l.kind]}</span>}
                  </td>
                  <td className="py-2 px-2 text-right tabular-nums">{Number(l.quantity)}</td>
                  <td className="py-2 px-2 text-right tabular-nums whitespace-nowrap">{fcfa(l.unitPrice)}</td>
                  <td className="py-2 pl-2 text-right tabular-nums whitespace-nowrap">{fcfa(l.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mt-4 flex justify-end">
          <dl className="grid w-full max-w-xs grid-cols-2 gap-y-1 text-sm">
            <dt className="text-neutral-500">Subtotal</dt>
            <dd className="text-right tabular-nums">{fcfa(invoice.subtotal)}</dd>
            {toXaf(invoice.discount) > 0n && (
              <>
                <dt className="text-neutral-500">Discount</dt>
                <dd className="text-right tabular-nums">− {fcfa(invoice.discount)}</dd>
              </>
            )}
            <dt className="border-t-2 border-neutral-900 pt-1 font-semibold">Total</dt>
            <dd className="border-t-2 border-neutral-900 pt-1 text-right font-semibold tabular-nums">{fcfa(invoice.total)}</dd>
            {!isDraft && !isVoid && (
              <>
                <dt className="text-neutral-500">Paid</dt>
                <dd className="text-right tabular-nums">{fcfa(summary.paid)}</dd>
                <dt className="font-semibold">Balance due</dt>
                <dd className="text-right font-semibold tabular-nums">{fcfa(summary.balance)}</dd>
              </>
            )}
          </dl>
        </section>

        {!isDraft && !isVoid && invoice.booking.payments.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Payments received</h2>
            <ul className="mt-1 divide-y divide-neutral-100 text-sm">
              {invoice.booking.payments.map((p) => (
                <li key={p.id} className="flex justify-between gap-4 py-1">
                  <span>
                    {day(p.createdAt)} · {p.paymentMethod === 'mobile_money' ? 'Mobile Money' : p.paymentMethod === 'cash' ? 'Cash' : p.paymentMethod}
                    {p.paymentType === 'refund' ? ' (refund)' : ''}
                  </span>
                  <span className="tabular-nums">{p.paymentType === 'refund' ? '− ' : ''}{fcfa(p.amount)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {isVoid && (
          <p className="mt-6 rounded-md bg-red-50 p-3 text-sm text-red-800">
            This invoice was voided{invoice.voidedAt ? ` on ${day(invoice.voidedAt)}` : ''}: {invoice.voidReason}. It is replaced by a corrected invoice.
          </p>
        )}

        {invoice.notes && <p className="mt-6 whitespace-pre-line text-sm text-neutral-700">{invoice.notes}</p>}

        <footer className="mt-10 border-t border-neutral-200 pt-4 text-center text-xs text-neutral-500">
          {company.invoiceFooter && <p className="whitespace-pre-line">{company.invoiceFooter}</p>}
          <p className="mt-1">Thank you for your trust.</p>
        </footer>
      </article>
    </div>
  )
}

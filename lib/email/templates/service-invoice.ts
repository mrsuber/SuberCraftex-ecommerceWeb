export interface ServiceInvoiceEmailData {
  invoiceNumber: string
  bookingNumber: string
  customerName: string
  serviceName: string
  issuedDate: string
  dueDate: string | null
  lines: { description: string; quantity: string; amount: string }[]
  subtotal: string
  discount: string | null
  total: string
  paid: string
  balance: string
  isPaid: boolean
  link: string
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function getServiceInvoiceTemplate(d: ServiceInvoiceEmailData) {
  const rows = d.lines
    .map(
      (l) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${esc(l.description)}<br><span style="color:#6b7280;font-size:12px">Qty ${esc(l.quantity)}</span></td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap">${esc(l.amount)}</td></tr>`,
    )
    .join('')

  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Invoice ${esc(d.invoiceNumber)}</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px;background:#f9fafb">
  <div style="background:#fff;border-radius:8px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,.1)">
    <div style="text-align:center;padding-bottom:20px;border-bottom:2px solid #D4AF76">
      <div style="font-size:26px;font-weight:bold;color:#D4AF76">SuberCraftex</div>
      <div style="font-size:13px;color:#6b7280">Invoice ${esc(d.invoiceNumber)} · ${esc(d.issuedDate)}</div>
    </div>
    <p>Hello ${esc(d.customerName)},</p>
    <p>Thank you for choosing SuberCraftex. Here is the invoice for <strong>${esc(d.serviceName)}</strong> (booking ${esc(d.bookingNumber)}).</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">${rows}
      <tr><td style="padding:8px 0;color:#6b7280">Subtotal</td><td style="padding:8px 0;text-align:right">${esc(d.subtotal)}</td></tr>
      ${d.discount ? `<tr><td style="padding:4px 0;color:#6b7280">Discount</td><td style="padding:4px 0;text-align:right">− ${esc(d.discount)}</td></tr>` : ''}
      <tr><td style="padding:8px 0;font-weight:bold;border-top:2px solid #111">Total</td><td style="padding:8px 0;text-align:right;font-weight:bold;border-top:2px solid #111">${esc(d.total)}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280">Paid</td><td style="padding:4px 0;text-align:right">${esc(d.paid)}</td></tr>
      <tr><td style="padding:4px 0;font-weight:bold">Balance due</td><td style="padding:4px 0;text-align:right;font-weight:bold">${esc(d.balance)}</td></tr>
    </table>
    ${
      d.isPaid
        ? '<p style="background:#ecfdf5;color:#065f46;padding:12px;border-radius:6px;text-align:center;font-weight:600">Paid in full — thank you!</p>'
        : `<p>${d.dueDate ? `Please pay by <strong>${esc(d.dueDate)}</strong>.` : 'Payment is due on receipt.'} You can pay by Mobile Money from your booking page, or in cash at the shop.</p>`
    }
    <p style="text-align:center;margin:28px 0">
      <a href="${esc(d.link)}" style="background:#D4AF76;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:600">View or print your invoice</a>
    </p>
    <p style="font-size:12px;color:#6b7280;text-align:center">Keep this email: the link opens your invoice at any time.</p>
  </div>
</body></html>`

  const text = [
    `SuberCraftex — Invoice ${d.invoiceNumber} (${d.issuedDate})`,
    `Booking ${d.bookingNumber}: ${d.serviceName}`,
    '',
    ...d.lines.map((l) => `${l.description} × ${l.quantity}: ${l.amount}`),
    '',
    `Subtotal: ${d.subtotal}`,
    ...(d.discount ? [`Discount: −${d.discount}`] : []),
    `Total: ${d.total}`,
    `Paid: ${d.paid}`,
    `Balance due: ${d.balance}`,
    '',
    d.isPaid ? 'Paid in full — thank you!' : d.dueDate ? `Please pay by ${d.dueDate}.` : 'Payment is due on receipt.',
    `View or print: ${d.link}`,
  ].join('\n')

  return { html, text }
}

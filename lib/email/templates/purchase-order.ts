type POItem = {
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

type PurchaseOrderData = {
  poNumber: string;
  supplierName: string;
  supplierEmail: string;
  orderDate: string;
  expectedDeliveryDate?: string;
  items: POItem[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  totalAmount: number;
  paymentTerms: string;
  notes?: string;
  companyName: string;
  companyEmail: string;
};

export const getPurchaseOrderTemplate = (data: PurchaseOrderData) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Purchase Order</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 700px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9fafb;
    }
    .container {
      background-color: white;
      border-radius: 8px;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .header {
      display: flex;
      justify-content: space-between;
      padding-bottom: 24px;
      border-bottom: 2px solid #D4AF76;
      margin-bottom: 24px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #D4AF76;
      margin-bottom: 4px;
    }
    .po-label {
      text-align: right;
      color: #6b7280;
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .po-number {
      font-size: 24px;
      color: #D4AF76;
      font-weight: bold;
      text-align: right;
    }
    h1 {
      color: #111827;
      font-size: 24px;
      margin: 0 0 16px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin: 24px 0;
    }
    .info-section {
      padding: 16px;
      background-color: #f9fafb;
      border-radius: 6px;
    }
    .info-label {
      font-weight: 600;
      color: #6b7280;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .info-value {
      color: #111827;
      font-size: 14px;
      margin-bottom: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
    }
    th {
      background-color: #f9fafb;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #6b7280;
      font-size: 12px;
      text-transform: uppercase;
      border-bottom: 2px solid #e5e7eb;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
    }
    .text-right {
      text-align: right;
    }
    .totals {
      margin-top: 24px;
      border-top: 2px solid #e5e7eb;
      padding-top: 16px;
      max-width: 350px;
      margin-left: auto;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
      font-size: 14px;
    }
    .total-row.grand {
      font-size: 18px;
      font-weight: bold;
      color: #D4AF76;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 2px solid #e5e7eb;
    }
    .notes-section {
      margin-top: 32px;
      padding: 16px;
      background-color: #fffbeb;
      border-left: 3px solid #f59e0b;
      border-radius: 4px;
    }
    .notes-section h3 {
      margin: 0 0 8px;
      font-size: 14px;
      color: #92400e;
    }
    .notes-section p {
      margin: 0;
      font-size: 13px;
      color: #78350f;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
    }
    .important-note {
      margin-top: 24px;
      padding: 16px;
      background-color: #dbeafe;
      border-left: 3px solid #2563eb;
      border-radius: 4px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="logo">${data.companyName}</div>
        <p style="color: #6b7280; margin: 0; font-size: 14px;">Purchase Order</p>
      </div>
      <div>
        <div class="po-label">PO Number</div>
        <div class="po-number">${data.poNumber}</div>
      </div>
    </div>

    <h1>Purchase Order Notification</h1>
    <p>Dear ${data.supplierName},</p>
    <p>We would like to place the following order. Please confirm receipt and expected delivery date.</p>

    <div class="info-grid">
      <div class="info-section">
        <div class="info-label">Order Date</div>
        <div class="info-value">${data.orderDate}</div>
        ${data.expectedDeliveryDate ? `
          <div class="info-label">Expected Delivery</div>
          <div class="info-value">${data.expectedDeliveryDate}</div>
        ` : ''}
      </div>

      <div class="info-section">
        <div class="info-label">Payment Terms</div>
        <div class="info-value">${data.paymentTerms.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
        <div class="info-label">Payment Status</div>
        <div class="info-value">
          <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; background-color: #fef3c7; color: #92400e;">
            ⏳ Pending
          </span>
        </div>
      </div>
    </div>

    <h2 style="margin-top: 32px; font-size: 18px;">Order Items</h2>
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>SKU</th>
          <th class="text-right">Quantity</th>
          <th class="text-right">Unit Price</th>
          <th class="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${data.items.map(item => `
          <tr>
            <td>${item.productName}</td>
            <td style="color: #6b7280;">${item.productSku}</td>
            <td class="text-right">${item.quantity}</td>
            <td class="text-right">$${item.unitPrice.toFixed(2)}</td>
            <td class="text-right">$${item.lineTotal.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="total-row">
        <span>Subtotal</span>
        <span>$${data.subtotal.toFixed(2)}</span>
      </div>
      ${data.taxAmount > 0 ? `
        <div class="total-row">
          <span>Tax</span>
          <span>$${data.taxAmount.toFixed(2)}</span>
        </div>
      ` : ''}
      ${data.shippingCost > 0 ? `
        <div class="total-row">
          <span>Shipping</span>
          <span>$${data.shippingCost.toFixed(2)}</span>
        </div>
      ` : ''}
      <div class="total-row grand">
        <span>Total Amount</span>
        <span>$${data.totalAmount.toFixed(2)}</span>
      </div>
    </div>

    ${data.notes ? `
      <div class="notes-section">
        <h3>Additional Notes</h3>
        <p>${data.notes}</p>
      </div>
    ` : ''}

    <div class="important-note">
      <strong>📋 Next Steps:</strong>
      <ol style="margin: 8px 0 0 0; padding-left: 20px;">
        <li>Please confirm receipt of this purchase order</li>
        <li>Verify the delivery date or provide an updated estimate</li>
        <li>Send any questions or concerns to ${data.companyEmail}</li>
      </ol>
    </div>

    <div class="footer">
      <p><strong>Contact Us:</strong></p>
      <p>Email: ${data.companyEmail}</p>
      <p style="margin-top: 16px; font-size: 13px; color: #9ca3af;">
        This is an automated email. Please reply to confirm receipt.
      </p>
      <p style="margin-top: 16px;">&copy; ${new Date().getFullYear()} ${data.companyName}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
PURCHASE ORDER - ${data.companyName}

PO Number: ${data.poNumber}
Order Date: ${data.orderDate}
${data.expectedDeliveryDate ? `Expected Delivery: ${data.expectedDeliveryDate}` : ''}

Dear ${data.supplierName},

We would like to place the following order:

ORDER ITEMS:
${data.items.map(item => `${item.productName} (${item.productSku}) x${item.quantity} @ $${item.unitPrice.toFixed(2)} = $${item.lineTotal.toFixed(2)}`).join('\n')}

TOTALS:
Subtotal: $${data.subtotal.toFixed(2)}
${data.taxAmount > 0 ? `Tax: $${data.taxAmount.toFixed(2)}` : ''}
${data.shippingCost > 0 ? `Shipping: $${data.shippingCost.toFixed(2)}` : ''}
Total Amount: $${data.totalAmount.toFixed(2)}

PAYMENT TERMS: ${data.paymentTerms.replace(/_/g, ' ').toUpperCase()}
PAYMENT STATUS: Pending

${data.notes ? `NOTES:\n${data.notes}\n` : ''}

NEXT STEPS:
1. Please confirm receipt of this purchase order
2. Verify the delivery date or provide an updated estimate
3. Send any questions or concerns to ${data.companyEmail}

Contact: ${data.companyEmail}

© ${new Date().getFullYear()} ${data.companyName}. All rights reserved.
  `;

  return { html, text };
};
